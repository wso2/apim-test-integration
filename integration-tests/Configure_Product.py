# Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# importing required modules
from xml.etree import ElementTree as ET
from zipfile import ZipFile
import os
import yaml
from pathlib import Path
import shutil
import logging

datasource_paths = None
database_url = None
database_user = None
database_pwd = None
database_drive_class_name = None
product_name = None
product_home_path = None
distribution_storage = None
database_config = None
workspace = None
lib_location = None
sql_driver_location = None
repository_name = None
database_names = []
pom_file_paths = None
ns = {'d': 'http://maven.apache.org/POM/4.0.0'}
zip_file_extension = ".zip"
carbon_name = "carbon.zip"
value_tag = "{http://maven.apache.org/POM/4.0.0}value"
artifact_id_of_surefire_plugin = "maven-surefire-plugin"


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def copy_product(source, destination):
    Path(destination).mkdir(parents=True, exist_ok=True)
    shutil.copy(source, destination)


def extract_distribution(path):
    with ZipFile(path, "r") as zip_ref:
        zip_ref.extractall(distribution_storage)


def get_all_file_paths(directory):
    # initializing empty file paths list
    file_paths = []

    # crawling through directory and subdirectories
    for root, directories, files in os.walk(directory):
        for filename in files:
            # join the two strings in order to form the full filepath.
            filepath = os.path.join(root, filename)
            file_paths.append(filepath)

    # returning all file paths
    return file_paths


def compress_distribution(zip_path):
    # calling function to get all file paths in the directory
    file_paths = get_all_file_paths(product_home_path)
    logger.info("Start product compressing")

    # writing files to a zipfile
    with ZipFile(zip_path, 'w') as zip:
        # writing each file one by one
        for file in file_paths:
            zip.write(file, file.replace(str(distribution_storage), ''))

    logger.info('All files zipped successfully!')


def delete_extracted_product():
    logger.info("deleting extracted product")
    shutil.rmtree(Path(distribution_storage / product_name))


def copy_jar_file():
    logger.info('sql driver is coping to the product lib folder')
    shutil.copy(Path(database_config['sql_driver_location']), Path(product_home_path / lib_location))


def read_config_file():
    global datasource_paths
    global distribution_storage
    global product_home_path
    global database_config
    global product_name
    global workspace
    global lib_location
    global repository_name
    global pom_file_paths
    with open("config.yml", 'r') as ymlfile:
        cfg = yaml.load(ymlfile)

    datasource_paths = cfg['datasource_paths']
    repository_name = cfg['repository_name']
    lib_location = cfg['lib_location']
    workspace = cfg['workspace']
    distribution_storage = Path(workspace + "/" + repository_name + "/" + cfg['distribution_storage'])
    product_home_path = Path(distribution_storage / cfg['product_name'])
    database_config = cfg['database']
    product_name = cfg['product_name']
    pom_file_paths = cfg['pom_file_paths']


def write_to_config_file():
    if len(database_names) > 0:
        with open("config.yml", 'r') as ymlfile:
            cfg = yaml.load(ymlfile)

        cfg['database_names'] = database_names
        with open("config.yml", 'w') as yaml_file:
            yaml_file.write(yaml.dump(cfg, default_flow_style=False))


def modify_distibution_name(element):
    temp = element.text.split("/")
    temp[-1] = product_name + zip_file_extension
    return '/'.join(temp)


def modify_pom_files():
    for pom in pom_file_paths:
        file_path = Path(workspace + "/" + repository_name + "/" + pom)
        logger.info("Modifying pom file: " + str(file_path))
        ET.register_namespace('', ns['d'])
        artifact_tree = ET.parse(file_path)
        artifarct_root = artifact_tree.getroot()
        data_sources = artifarct_root.find('d:build', ns)
        plugins = data_sources.find('d:plugins', ns)
        for plugin in plugins.findall('d:plugin', ns):
            artifact_id = plugin.find('d:artifactId', ns)
            if artifact_id is not None and artifact_id.text == artifact_id_of_surefire_plugin:
                configuration = plugin.find('d:configuration', ns)
                system_properties = configuration.find('d:systemProperties', ns)
                for neighbor in system_properties.iter(ns['d'] + carbon_name):
                    neighbor.text = modify_distibution_name(neighbor)
                for prop in system_properties:
                    name = prop.find('d:name', ns)
                    if name is not None and name.text == carbon_name:
                        for data in prop:
                            if data.tag == value_tag:
                                data.text = modify_distibution_name(data)
                break
        artifact_tree.write(file_path)


def modify_datasources():
    for data_source in datasource_paths:
        file_path = Path(product_home_path / data_source)
        logger.info("Modifying datasource: " + str(file_path))
        artifact_tree = ET.parse(file_path)
        artifarc_root = artifact_tree.getroot()
        data_sources = artifarc_root.find('datasources')
        for item in data_sources.findall('datasource'):
            table_name = None
            for child in item:
                if child.tag == 'name':
                    table_name = child.text
                # special checking for namespace object content:media
                if child.tag == 'definition' and table_name:
                    configuration = child.find('configuration')
                    url = configuration.find('url')
                    user = configuration.find('username')
                    passwd = configuration.find('password')
                    drive_class_name = configuration.find('driverClassName')
                    url.text = url.text.replace(url.text, database_config['url'] + table_name)
                    user.text = user.text.replace(user.text, database_config['user'])
                    passwd.text = passwd.text.replace(passwd.text, database_config['password'])
                    drive_class_name.text = drive_class_name.text.replace(drive_class_name.text,
                                                                          database_config['driver_class_name'])
                    database_names.append(table_name)
        artifact_tree.write(file_path)


def main():
    try:
        read_config_file()
        if pom_file_paths is not None:
            modify_pom_files()
        else:
            logger.info("pom file paths are not defined in the config file")
        zip_name = product_name + zip_file_extension
        product_location = Path(workspace + "/" + zip_name)
        copy_product(product_location, distribution_storage)
        extract_distribution(Path(distribution_storage / zip_name))
        copy_jar_file()
        if datasource_paths is not None:
            modify_datasources()
        else:
            logger.info("datasource paths are not defined in the config file")
        write_to_config_file()
        compress_distribution(Path(distribution_storage / zip_name))
        delete_extracted_product()
    except IOError as e:
        logger.error("Error occurred while accessing files", exc_info=True)
    except Exception as e:
        logger.error("Error occurred while configuring the product", exc_info=True)


if __name__ == "__main__":
    main()
