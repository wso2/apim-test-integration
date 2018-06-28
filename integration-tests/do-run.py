

# importing required modules
import yaml
import subprocess
import wget
import logging
import inspect
import os
import shutil
import pymysql
import sqlparse
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
DB_CARBON_DB = 'WSO2_CARBON_DB'
DB_AM_DB = 'WSO2AM_DB'
DB_STAT_DB = 'WSO2AM_STATS_DB'
DB_MB_DB = 'WSO2_MB_STORE_DB'

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

def get_db_hostname(url, db_type):
    """Retreive db hostname from jdbc url
    """
    if db_type == 'ORACLE':
        #TODO: implementation for oracle db_type
        hostname = "testurl123"
    else:
        hostname = url.split(':')[2].replace("//","")
    return hostname

def run_sqlserver_commands(sql_host, sql_user, sql_pass, sql_query):
    """Run SQL_SERVER commands using sqlcmd utility.
    """
    subprocess.call(['sqlcmd', '-S', sql_host, '-U', sql_user, '-P', sql_pass, '-Q', sql_query])

def get_mysql_connection(dbName=None):
    if dbName is not None:
        conn = pymysql.connect(host=get_db_hostname(database_config['url'], 'MYSQL'), user=database_config['user'], passwd=database_config['passwd'], db=dbName)
    else:
        conn = pymysql.connect(host=get_db_hostname(database_config['url'], 'MYSQL'), user=database_config['user'], passwd=database_config['passwd'])
    return conn

def run_mysql_commands(query):
    """Run mysql commands using mysql client when db name not provided.
    """
    #subprocess.call(['mysql', '-H', host, '-u', user, '-p', passwrd, '-e', query])
    conn = get_mysql_connection()
    conectr = conn.cursor()
    conectr.execute(query)
    conn.close()

def run_sqlserver_script_file(sql_host, sql_user, sql_pass, db_name, script_path):
    """Run SQL_SERVER script file on a provided database.
    """
    #sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $UM_DB -i $DB_SCRIPTS_PATH/mssql.sql
    subprocess.call(['sqlcmd', '-S', sql_host, '-U', sql_user, '-P', sql_pass, '-d', db_name, '-i', script_path])

def run_mysql_script_file(db_name, script_path):
    """Run MYSQL db script file on a provided database.
    """
    conn = get_mysql_connection(db_name)
    conectr = conn.cursor()

    sql = open(script_path).read()
    sql_parts = sqlparse.split( sql )
    for sql_part in sql_parts:
        if sql_part.strip() ==  '':
            continue 
        conectr.execute( sql_part )
    conn.close()


def copy_file(os_type, source, target):
    if(os_type == "WINDOWS"):
        source = make_windows_path(source)
        target = make_windows_path(target)
        shutil.copy(source, target)
    elif (os_type == "LINUX"):
        shutil.copy(source, target)

def make_windows_path(win_path, encoding=None):
    path = os.path.abspath(win_path)
    if path.startswith("\\\\"):
        path = "\\\\?\\UNC\\" + path[2:]
    else:
        path = "\\\\?\\" + path
    return path

def setup_databases(script_path):
    """Create required databases.
    """  
    print('Creating databases...')
    for database in database_names:
        if database == DB_CARBON_DB:
            if db_type == 'MSSQL':
                #create database
                run_sqlserver_commands(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], 'CREATE DATABASE WSO2_CARBON_DB')
                #manipulate script path
                scriptPath = script_path / 'mssql.sql'
                #run db scripts
                run_sqlserver_script_file(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], database, str(scriptPath))              
            elif db_type == 'MYSQL':
                scriptPath = script_path / 'mysql5.7.sql'
                #create database
                run_mysql_commands('CREATE DATABASE IF NOT EXISTS {0};'.format(database))
                #run db script
                run_mysql_script_file(database, str(scriptPath))

            elif db_type == 'ORACLE':
                #TODO: oracle implementation
                testval = 'testValue'
                pass
        elif database == DB_AM_DB:
            if db_type == 'MSSQL':
                #create database
                run_sqlserver_commands(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], 'CREATE DATABASE WSO2AM_DB')
                #manipulate script path
                scriptPath = script_path / 'apimgt/mssql.sql'
                #run db scripts
                run_sqlserver_script_file(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], database, str(scriptPath))
            elif db_type == 'MYSQL':
                scriptPath = script_path / 'apimgt/mysql5.7.sql'
                #create database
                run_mysql_commands('CREATE DATABASE IF NOT EXISTS {0};'.format(database))
                #run db script
                run_mysql_script_file(database, str(scriptPath))
            elif db_type == 'ORACLE':
                pass
        elif database == DB_STAT_DB:
            if db_type == 'MSSQL':
                #create database
                run_sqlserver_commands(get_db_hostname(database_config['url'],'MSSQL'), database_config['user'], database_config['passwd'], 'CREATE DATABASE WSO2AM_STATS_DB')               
            elif db_type == 'MYSQL':
                #create database
                run_mysql_commands('CREATE DATABASE IF NOT EXISTS {0};'.format(database))
            elif db_type == 'ORACLE':
                pass
        elif database == DB_MB_DB:
            if db_type == 'MSSQL':
                pass
            elif db_type == 'MYSQL':
                #create database
                run_mysql_commands('CREATE DATABASE IF NOT EXISTS {0};'.format(database))
                #manipulate script path
                scriptPath = script_path / 'mb-store/mysql-mb.sql'
                #run db scripts
                run_mysql_script_file(database, str(scriptPath))
            elif db_type == 'ORACLE':
                pass


def main():
    try:
        read_config_file()
        logger = function_logger(logging.DEBUG, logging.DEBUG)

        #clone the product repo
        subprocess.call(['git', 'clone', '--branch', git_branch, git_repo_url], cwd=workspace_dir)
        logger.info('cloning repo done.')

        #build the product
        subprocess.call(['mvn', 'clean', 'install'], cwd='path/to/product/repo')
        
        #TODO: need to generate the url in correct way.
        #xpath=https://wso2.org/jenkins/job/products/job/product-apim_2.x/lastRelease/api/xml?xpath=/*/artifact[1]/fileName
        url = jeinkins_build_url
        product_file_name = product_name + ".zip"

        destination = Path(workspace_dir + "/storage/" + product_file_name)

        #download the last released pack from Jenkins
        download_file(url, str(destination))
        logger.info('downloading the pack from Jenkins done.')

        #run python file for product configuration
        #subprocess.call(['python', 'Configure_Product.py'])

        #populate databases
        script_path = Path(workspace_dir + "/storage/" + product_name + "/" + 'dbscripts')
        setup_databases(script_path)
        logger.info('Database setting up is done.')

        #create directory structure inside cloned repo and copy product distribution
        target_path = Path(workspace_dir + "/" + product_id + "/" + 'modules/distribution/product/target')
        target_path.mkdir(parents=True)
        logger.info('Target directory created.')

        #copy the pack to target directory
        copy_file(os_type, destination, target_path)
        logger.info('Product distribution copied to ' + str(target_path))

        #run integration tests
        integration_tests_path = Path(workspace_dir + "/" + product_id + "/" + 'modules/integration/tests-integration')
        subprocess.call(['mvn', 'clean', 'install'], cwd=integration_tests_path)
        logger.info('Running integration tests done.')
        
    except Exception as e:
        print(e)

if __name__ == "__main__":
    main()
