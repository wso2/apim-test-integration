#! /bin/bash

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

set -e

DEPL_OUT_DIRECTORY=/opt
FILE=$DEPL_OUT_DIRECTORY/out.properties
WORKSPACE_DIR=$(grep -i 'WORKSPACE_DIR' $FILE  | cut -f2 -d'=')
cd ${WORKSPACE_DIR}

pack=$(ls -t | grep .zip | head -1)

for f in $pack; do

    prod=${f%%-*}
    suffix=${f#*-}
        for n in $suffix; do
        version=${n%%.zip}
        done
done

PRODUCT_NAME=$prod
PRODUCT_VERSION=$version
PRODUCT_HOME="${PRODUCT_NAME}-${PRODUCT_VERSION}"
DB_SCRIPT_HOME="${PRODUCT_HOME}/dbscripts"

####Read database information from out.properties file
USERNAME=$(grep -i 'USERNAME' $FILE  | cut -f2 -d'=')
DB_HOST=$(grep -i 'DB_HOST' $FILE  | cut -f2 -d'=')
DB_PORT=$(grep -i 'DB_PORT' $FILE  | cut -f2 -d'=')
DB_ENGINE=$(grep -i 'DB_ENGINE' $FILE  | cut -f2 -d'=')
DB_VERSION=$(grep -i 'DB_VERSION' $FILE  | cut -f2 -d'=')
DB_TYPE=$(grep -i 'DB_TYPE' $FILE  | cut -f2 -d'=')

#MySQL connection details
MYSQL_USERNAME=$(grep -i 'MYSQL_USERNAME' $FILE  | cut -f2 -d'=')
MYSQL_PASSWORD=$(grep -i 'MYSQL_PASSWORD' $FILE  | cut -f2 -d'=')


# databases
UM_DB="wso2_um_db"
AM_DB="wso2_am_db"
GOV_REG_DB="wso2_greg_db"
ANALYTICS_DB="wso2_analytics_db"


setup_mysql_databases() {
    echo "MySQL setting up" >> /home/ubuntu/java.txt
    echo ">> Creating databases..."
    mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP DATABASE IF EXISTS $UM_DB; DROP DATABASE IF
    EXISTS $AM_DB; DROP DATABASE IF EXISTS $GOV_REG_DB; DROP DATABASE IF EXISTS $METRICS_DB;
    CREATE DATABASE $UM_DB; CREATE DATABASE $AM_DB; CREATE DATABASE $GOV_REG_DB; CREATE DATABASE $METRICS_DB;"
    echo ">> Databases created!"

    echo ">> Creating users..."
    mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e
    "CREATE USER '$MYSQL_DB_USER'@'%' IDENTIFIED BY '$MYSQL_DB_USER_PWD';"
    echo ">> Users created!"

    echo -e ">> Grant access for users..."
    mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "GRANT ALL PRIVILEGES ON $UM_DB.* TO '$MYSQL_DB_USER'@'%';
    GRANT ALL PRIVILEGES ON $AM_DB.* TO '$MYSQL_DB_USER'@'%'; GRANT ALL PRIVILEGES ON $GOV_REG_DB.* TO
    '$MYSQL_DB_USER'@'%'; GRANT ALL PRIVILEGES ON $METRICS_DB.* TO '$MYSQL_DB_USER'@'%';"
    echo ">> Access granted!"

    echo ">> Creating tables..."
    if [ ${DB_VERSION} -ge  5.7.0 ]
    then
    	mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "USE $UM_DB; SOURCE $DB_SCRIPT_HOME/mysql5.7.sql;
	USE $GOV_REG_DB; SOURCE $DB_SCRIPT_HOME/mysql5.7.sql; USE $AM_DB; SOURCE $DB_SCRIPT_HOME/apimgt/mysql-5.7.sql;
	USE $METRICS_DB; SOURCE $DB_SCRIPT_HOME/metrics/mysql.sql;"
    else
    	mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "USE $UM_DB; SOURCE $DB_SCRIPT_HOME/mysql.sql;
	USE $GOV_REG_DB; SOURCE $DB_SCRIPT_HOME/mysql.sql; USE $AM_DB; SOURCE $DB_SCRIPT_HOME/apimgt/mysql.sql;
	USE $METRICS_DB; SOURCE $DB_SCRIPT_HOME/metrics/mysql.sql;"
    fi
    echo ">> Tables created!"
}

setup_mssql_databases(){
echo "MSSQL"
#TODO: add mssql
}

#### Create the schemas based on the selected RDBMS

if [${DB_TYPE}==MySQL]; then
echo "Creating MYSQL schema"
setup_mysql_databases
elif [${DB_TYPE}==MSSQL]; then
echo "Creating MSSQL schema"
setup_mssql_databases
else
echo "No database created yet"
fi

