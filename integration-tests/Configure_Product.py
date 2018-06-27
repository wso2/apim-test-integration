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
import stat
import sys
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
product_storage = None
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


class ZipfileLongPaths(ZipFile):
    def _extract_member(self, member, targetpath, pwd):
        targetpath = winapi_path(targetpath)
        return ZipFile._extract_member(self, member, targetpath, pwd)


def winapi_path(dos_path, encoding=None):
    path = os.path.abspath(dos_path)

    if path.startswith("\\\\"):
        path = "\\\\?\\UNC\\" + path[2:]
    else:
        path = "\\\\?\\" + path

    return path


def on_rm_error(func, path, exc_info):
    os.chmod(path, stat.S_IWRITE)
    os.unlink(path)


def extract_product(path):
    if Path.exists(path):
        logger.info("Extracting the product  into " + str(product_storage))
        if sys.platform.startswith('win'):
            with ZipfileLongPaths(path, "r") as zip_ref:
                zip_ref.extractall(product_storage)
        else:
            with ZipFile(path, "r") as zip_ref:
                zip_ref.extractall(product_storage)
    else:
        raise FileNotFoundError("File is not found to extract, file path: " + str(path))


def compress_distribution(distribution_path, root_dir):
    if not Path.exists(distribution_path):
        Path(distribution_path).mkdir(parents=True, exist_ok=True)

    shutil.make_archive(distribution_path, "zip", root_dir)


def copy_jar_file(source, destination):
    logger.info('sql driver is coping to the product lib folder')
    if sys.platform.startswith('win'):
        source = winapi_path(source)
        destination = winapi_path(destination)
    shutil.copy(source, destination)


def read_config_file():
    global datasource_paths
    global distribution_storage
    global product_home_path
    global database_config
    global product_name
    global product_storage
    global lib_location
    global repository_name
    global pom_file_paths
    global workspace
    with open("config.yml", 'r') as ymlfile:
        cfg = yaml.load(ymlfile)

    datasource_paths = cfg['datasource_paths']
    repository_name = cfg['repository_name']
    lib_location = cfg['lib_location']
    product_storage = cfg['product_storage']
    workspace = cfg['workspace']
    distribution_storage = Path(workspace + "/" + repository_name + "/" + cfg['distribution_storage'])
    product_home_path = Path(product_storage + "/" + cfg['product_name'])
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


def modify_distribution_name(element):
    temp = element.text.split("/")
    temp[-1] = product_name + zip_file_extension
    return '/'.join(temp)


def modify_pom_files():
    for pom in pom_file_paths:
        file_path = Path(workspace + "/" + repository_name + "/" + pom)
        if sys.platform.startswith('win'):
            file_path = winapi_path(file_path)
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
                    neighbor.text = modify_distribution_name(neighbor)
                for prop in system_properties:
                    name = prop.find('d:name', ns)
                    if name is not None and name.text == carbon_name:
                        for data in prop:
                            if data.tag == value_tag:
                                data.text = modify_distribution_name(data)
                break
        artifact_tree.write(file_path)


def modify_datasources():
    for data_source in datasource_paths:
        file_path = Path(product_home_path / data_source)
        if sys.platform.startswith('win'):
            file_path = winapi_path(file_path)
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
        zip_name = product_name + zip_file_extension
        product_location = Path(product_storage + "/" + zip_name)
        configured_product_path = Path(distribution_storage / product_name)
        if pom_file_paths is not None:
            modify_pom_files()
        else:
            logger.info("pom file paths are not defined in the config file")
        extract_product(product_location)
        copy_jar_file(Path(database_config['sql_driver_location']), Path(product_home_path / lib_location))
        if datasource_paths is not None:
            modify_datasources()
        else:
            logger.info("datasource paths are not defined in the config file")
        write_to_config_file()
        os.remove(str(product_location))
        compress_distribution(configured_product_path, product_storage)
        shutil.rmtree(configured_product_path, onerror=on_rm_error)
    except FileNotFoundError as e:
        logger.error("Error occurred while finding files", exc_info=True)
    except IOError as e:
        logger.error("Error occurred while accessing files", exc_info=True)
    except Exception as e:
        logger.error("Error occurred while configuring the product", exc_info=True)


if __name__ == "__main__":
    main()
