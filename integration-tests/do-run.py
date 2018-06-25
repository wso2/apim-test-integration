# importing required modules
import yaml
import subprocess
import wget
import logging
import inspect
from pathlib import Path

git_repo_url = None
git_branch = None
os_type = None
workspace_dir = None
product_name = None
product_id = None
jeinkins_build_url = "https://wso2.org/jenkins/job/products/job/product-apim_2.x/lastRelease/artifact/target/checkout/modules/distribution/product/target/wso2am-2.5.0.zip"
database_names = None
db_type = None
database_config = None
log_file_name = 'integration.log'
target_path = None

def function_logger(file_level, console_level = None):
    function_name = inspect.stack()[1][3]
    logger = logging.getLogger(function_name)
    #By default, logs all messages
    logger.setLevel(logging.DEBUG)

    if console_level != None:
        #StreamHandler logs to console
        ch = logging.StreamHandler() 
        ch.setLevel(console_level)
        ch_format = logging.Formatter('%(asctime)s - %(message)s')
        ch.setFormatter(ch_format)
        logger.addHandler(ch)

    #log in to a file
    fh = logging.FileHandler("{0}.log".format(function_name))
    fh.setLevel(file_level)
    fh_format = logging.Formatter('%(asctime)s - %(lineno)d - %(levelname)-8s - %(message)s')
    fh.setFormatter(fh_format)
    logger.addHandler(fh)

    return logger

def read_config_file():
    """Read the configs from config.yaml file.
    """
    global git_repo_url
    global git_branch
    global os_type
    global workspace_dir
    global product_name
    global product_id
    global database_names
    global db_type
    global database_config
    
    with open("config.yml", 'r') as ymlfile:
        cfg = yaml.load(ymlfile)

    git_repo_url = cfg['git_repo_url']
    git_branch = cfg['git_branch']
    os_type = cfg['os_type']
    workspace_dir = cfg['workspace_dir']
    product_name = cfg['product_name']
    product_id = cfg['product_id']
    database_names = cfg['database_names']
    db_type = cfg['db_type']
    database_config = cfg['database']

def download_file(url, destination):
    """Download a file using wget package.
    Download the given file in _url_ as the directory+name provided in _destination_
    """
    wget.download(url, destination)

def run_sqlserver_commands(sql_host, sql_user, sql_pass, sql_query):
    """Run SQL_SERVER commands using sqlcmd utility.
    """
    subprocess.call(['sqlcmd', '-S', sql_host, '-U', sql_user, '-P', sql_pass, '-Q', sql_query])

def run_mysql_commands(host, user, passwrd, query):
    """Run mysql commands using mysql client.
    """
    subprocess.call(['mysql', '-H', host, '-u', user, '-p', passwrd, '-e', sql_query])

def run_sqlserver_script_file(sql_host, sql_user, sql_pass, db_name, script_path):
    """Run SQL_SERVER script file on a provided database.
    """
    #sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $UM_DB -i $DB_SCRIPTS_PATH/mssql.sql
    subprocess.call(['sqlcmd', '-S', sql_host, '-U', sql_user, '-P', sql_pass, '-d', db_name, '-i', script_path])

def run_mysql_script_file(sql_host, sql_user, sql_pass, db_name, script_path):
    """Run MYSQL db script file on a provided database.
    """
    #sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $UM_DB -i $DB_SCRIPTS_PATH/mssql.sql
    #TODO: implement the code

def get_db_hostname(url, db_type):
    """Retreive db hostname from jdbc url
    """
    if db_type == 'ORACLE':
        #TODO: implementation for oracle db_type
        hostname = "testurl123"
    else:
        hostname = url.split(':')[2].replace("//","")
    return hostname

def copy_file(os_type, source, target):
    if(os_type == "WINDOWS"):
        subprocess.call(['copy', source, target])
    elif (os_type == "LINUX"):
        subprocess.call(['cp', source, target])

def setup_databases():
    """Create required databases.
    """
    read_config_file()
    #create databases
    db_name = database_config['url']
    
    print('Creating databases...')
    for database in database_names:
        if database == 'WSO2_CARBON_DB':
            if db_type == 'MSSQL':
                #create database
                run_sqlserver_commands(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], 'CREATE DATABASE WSO2_CARBON_DB')
                #manipulate script path
                run_sqlserver_script_file(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], database, )
                
            elif db_type == 'MYSQL':
                #TODO: mysql implementation
                testval = 'testvalmysql'
            elif db_type == 'ORACLE':
                #TODO: oracle implementation
                testval = 'testval'

def main():
    try:
        read_config_file()
        logger = function_logger(logging.DEBUG, logging.DEBUG)

        #clone the product repo
        subprocess.call(['git', 'clone', '--branch', git_branch, git_repo_url], cwd=workspace_dir)
        logger.info('cloning repo done.')

        #build the product
        #subprocess.call(['mvn', 'clean', 'install'], cwd='path/to/product/repo')
        
        #TODO: need to generate the url in correct way.
        url = jeinkins_build_url
        product_file_name = product_name + ".zip"
        destination = Path(workspace_dir + "/" + product_file_name)

        #download the last released pack from Jenkins
        download_file(url, destination)
        logger.info('downloading the pack from Jenkins done.')

        #run python file for product configuration
        #TODO: decide python file name and directory
        #subprocess.call(['python', 'path/to/config/python.py'])

        #populate databases
        setup_databases()
        logger.info('database setting up done.')

        #create directory structure inside cloned repo and copy product distribution
        target_path = Path(workspace_dir + "/" + product_id + "/" + 'modules/distribution/product/target')
        target_path.mkdir(parents=True)
        logger.info('target directory created.')

        #copy the pack to target directory
        copy_file(os_type, destination, target_path)
        logger.info('product distribution copied to ' + str(target_path))

        #run integration tests
        integration_tests_path = Path(workspace_dir + "/" + product_id + "/" + 'modules/integration/tests-integration')
        subprocess.call(['mvn', 'clean', 'install'], cwd=integration_tests_path)
        logger.info('Running integration tests done.')
        
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()