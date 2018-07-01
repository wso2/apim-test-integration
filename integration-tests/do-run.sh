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
set -o xtrace

#### Find the OS to run the script on particular OS
    var=$(cat /etc/os-release | sed -e 1b -e '$!d' | awk '{print $1;}')

    for f in $var; do
        os_type=${f#*\"}
    done

    if [ ${os_type} == "CentOS" ]; then
    sudo yum update -y && \
    sudo yum install -y git man zip vim wget tar xmlstarlet
    elif [ ${os_type} == "Ubuntu" ]; then
    sudo apt-get update && \
    sudo apt-get install git man zip vim wget tar xmlstarlet
    fi


#### To read variables from config.yaml
parse_yaml() {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/4;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}


#### To download distribution built from jenkin
get_jenkins_build() {
	echo "Get distribution build from jenkins"
	jenkins_url="https://wso2.org/jenkins/job/products/job/product-apim_2.x/lastRelease/"
	distribution_url=$(curl -s -G $jenkins_url/api/xml -d xpath=\(/mavenModuleSetBuild//relativePath\)[3])
	distribution_pack=$(echo $distribution_url | sed -n 's:.*<relativePath>\(.*\)</relativePath>.*:\1:p')
	echo "Distribution Pack: "$distribution_pack
	downloadable_url=$jenkins_url"artifact/"$distribution_pack
	echo "Downloadable URL: "$downloadable_url
	sudo wget $downloadable_url

}


#### To populate MySQL schema and tables
setup_mysql_databases() {
    echo "MySQL setting up" >> ${WORKSPACE_DIR}/java.txt
    echo ">> Creating databases..."
    mysql -h $DB_HOST -P $DB_PORT -u$MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP DATABASE IF EXISTS $CARBON_DB; DROP DATABASE IF
    EXISTS $AM_DB; DROP DATABASE IF EXISTS $STATS_DB; DROP DATABASE IF EXISTS $METRICS_DB; DROP DATABASE IF EXISTS $MB_DB;
    CREATE DATABASE $CARBON_DB; CREATE DATABASE $AM_DB; CREATE DATABASE $STATS_DB; CREATE DATABASE $METRICS_DB; CREATE DATABASE $MB_DB;"
    echo ">> Databases created!"

    echo ">> Creating users..."
    mysql -h $DB_HOST -P $DB_PORT -u$MYSQL_USERNAME -p$MYSQL_PASSWORD -e "DROP USER '$MYSQL_DB_USER'";
    mysql -h $DB_HOST -P $DB_PORT -u$MYSQL_USERNAME -p$MYSQL_PASSWORD -e "CREATE USER '$MYSQL_DB_USER'@'%' IDENTIFIED BY '$MYSQL_DB_USER_PWD';"
    echo ">> Users created!"

    echo ">> Grant access for users..."
    mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "GRANT ALL PRIVILEGES ON $CARBON_DB.* TO '$MYSQL_DB_USER'@'%';
    GRANT ALL PRIVILEGES ON $AM_DB.* TO '$MYSQL_DB_USER'@'%'; GRANT ALL PRIVILEGES ON $STATS_DB.* TO
    '$MYSQL_DB_USER'@'%'; GRANT ALL PRIVILEGES ON $METRICS_DB.* TO '$MYSQL_DB_USER'@'%'; GRANT ALL PRIVILEGES ON $MB_DB.* TO '$MYSQL_DB_USER'@'%';"
    echo ">> Access granted!"

    echo ">> Creating tables..."
    if [ ${DB_VERSION} ==  "5.7" ]
    then
        mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "USE $CARBON_DB; SOURCE $DB_SCRIPT_HOME/mysql5.7.sql;
        USE $STATS_DB; SOURCE $DB_SCRIPT_HOME/mysql5.7.sql; USE $AM_DB; SOURCE $DB_SCRIPT_HOME/apimgt/mysql5.7.sql;
        USE $METRICS_DB; SOURCE $DB_SCRIPT_HOME/metrics/mysql.sql; USE $MB_DB; SOURCE $DB_SCRIPT_HOME/mb-store/mysql-mb.sql;"
    else
        mysql -h $DB_HOST -P $DB_PORT -u $MYSQL_USERNAME -p$MYSQL_PASSWORD -e "USE $CARBON_DB; SOURCE $DB_SCRIPT_HOME/mysql.sql;
        USE $STATS_DB; SOURCE $DB_SCRIPT_HOME/mysql.sql; USE $AM_DB; SOURCE $DB_SCRIPT_HOME/apimgt/mysql.sql;
        USE $METRICS_DB; SOURCE $DB_SCRIPT_HOME/metrics/mysql.sql; USE $MB_DB; SOURCE $DB_SCRIPT_HOME/mb-store/mysql-mb.sql;"
    fi
    echo ">> Tables created!"
}


#### To populate MSSQL schema and tables
setup_mssql_databases(){
    echo ">> Setting up SQLServer databases ..."
    echo ">> Creating databases..."
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -Q "CREATE DATABASE $CARBON_DB"
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -Q "CREATE DATABASE $AM_DB"
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -Q "CREATE DATABASE $STATS_DB"
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -Q "CREATE DATABASE $MB_DB"
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -Q "CREATE DATABASE $METRICS_DB"
    echo ">> Databases created!"

    echo ">> Creating tables..."
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $CARBON_DB -i $DB_SCRIPT_HOME/mssql.sql
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $AM_DB -i $DB_SCRIPT_HOME/apimgt/mssql.sql
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $STATS_DB -i $DB_SCRIPT_HOME/mssql.sql
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $MB_DB -i $DB_SCRIPT_HOME/mb-store/mssql-mb.sql
    sqlcmd -S $DB_HOST -U $DB_USERNAME -P $DB_PASSWORD -d $METRICS_DB -i $DB_SCRIPT_HOME/metrics/mssql.sql
}

#### To populate ORACLE schema and tables
setup_oracle_databases(){
    url="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=pasinduoracletest.c8jlhntiji2j.us-east-1.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=ORCL)))"

    echo ">> Setting up Oracle user create script ..."
    echo "CREATE USER $CARBON_DB IDENTIFIED BY $DB_PASSWORD;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO $CARBON_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO $CARBON_DB;" >> oracle.sql
    echo "CREATE USER $AM_DB IDENTIFIED BY $DB_PASSWORD;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO $AM_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO $AM_DB;" >> oracle.sql
    echo "CREATE USER $STATS_DB IDENTIFIED BY $DB_PASSWORD;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO $STATS_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO $STATS_DB;" >> oracle.sql
    echo "CREATE USER $MB_DB IDENTIFIED BY $DB_PASSWORD;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO $MB_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO $MB_DB;" >> oracle.sql
    echo "CREATE USER $METRICS_DB IDENTIFIED BY $DB_PASSWORD;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO $METRICS_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO $METRICS_DB;" >> oracle.sql

    echo ">> Setting up Oracle schemas ..."
    echo exit | sqlplus ${DB_USERNAME}/${DB_PASSWORD}@//${DB_HOST}:${DB_PORT}/$ORACLE_SID @oracle.sql

    echo ">> Setting up Oracle tables ..."
    echo exit | sqlplus $CARBON_DB/$DB_PASSWORD@//$DB_HOST/$ORACLE_SID @$DB_SCRIPT_HOME/oracle.sql
    echo exit | sqlplus $AM_DB/$DB_PASSWORD@//$DB_HOST/$ORACLE_SID @$DB_SCRIPT_HOME/apimgt/oracle.sql
    echo exit | sqlplus $STATS_DB/$DB_PASSWORD@//$DB_HOST/$ORACLE_SID @$DB_SCRIPT_HOME/oracle.sql
    echo exit | sqlplus $MB_DB/$DB_PASSWORD@//$DB_HOST/$ORACLE_SID @$DB_SCRIPT_HOME/mb-store/oracle-mb.sql
    echo exit | sqlplus $METRICS_DB/$DB_PASSWORD@//$DB_HOST/$ORACLE_SID @$DB_SCRIPT_HOME/metrics/oracle.sql
    echo ">> Tables created ..."
}


####
git_product_clone(){
    echo "Cloning product repo"
    cd ${productPath}
    sudo git clone ${GIT_LOCATION}
    sleep 10
    cd product-apim
	sudo git checkout ${GIT_BRANCH}
	git status
}

################################## Starts run-scenario ###########################################

####Read from properties file

FILE1=${WORKSPACE_DIR}/infrastructure.properties
FILE2=${WORKSPACE_DIR}/testplan-props.properties
WORKSPACE_DIR=$(grep -i 'REMOTE_WORKSPACE_DIR_UNIX' ${FILE2} ${FILE1}  | cut -f2 -d'=')

#### User Variables
GIT_LOCATION=$(grep -i 'gitURL' ${FILE2} ${FILE1}  | cut -f2 -d'=')
GIT_BRANCH=$(grep -i 'gitBranch' ${FILE2} ${FILE1}  | cut -f2 -d'=')

USERNAME=$(grep -i 'DatabaseUser' ${FILE1} ${FILE2} | cut -f2 -d'=')
DB_HOST=$(grep -i 'DatabaseHost' ${FILE1} ${FILE2} | cut -f2 -d'=')
DB_PORT=$(grep -i 'DatabasePort' ${FILE1} ${FILE2} | cut -f2 -d'=')
#DB_ENGINE=$(echo $config_database_..)
DB_VERSION=$(grep -i 'DBEngineVersion' ${FILE2} ${FILE1} | cut -f2 -d'=')
DB_TYPE=$(grep -i 'DBEngine' ${FILE2} ${FILE1} | cut -f2 -d'=')

## MySQL connection details
DB_USERNAME=$(grep -i 'DatabaseUser' ${FILE1} ${FILE2} | cut -f2 -d'=')
DB_PASSWORD=$(grep -i 'DatabasePassword' ${FILE1} ${FILE2} | cut -f2 -d'=')
#ORACLE_SID=$(grep -i 'OracleSID' ${FILE1} ${FILE2} | cut -f2 -d'=')
ORACLE_SID=ORCL

## databases
CARBON_DB="WSO2_CARBON_DB"
#UM_DB="WSO2UM_DB"
AM_DB="WSO2AM_DB"
STATS_DB="WSO2AM_STATS_DB"
MB_DB="WSO2_MB_STORE_DB"
#GOV_REG_DB="WSO2REG_DB"
METRICS_DB="WSO2METRICS_DB"

## database users
MYSQL_DB_USER=wso2
MYSQL_DB_USER_PWD=wso2



#### Read yaml file
#eval $(parse_yaml config.yml "config_")

#### User Variables
#WORKSPACE_DIR=$(echo $config_workspace_dir)
#GIT_LOCATION=$(echo $config_git_location)
#GIT_BRANCH=$(echo $config_git_branch)

#USERNAME=$(echo $config_database_user)
#DB_HOST=$(echo $config_database_host)
#DB_PORT=$(echo $config_database_port)
#DB_ENGINE=$(echo $config_database_..)
#DB_VERSION=$(echo $config_database_version)
#DB_TYPE=$(echo $config_database_type)

## MySQL connection details
#MYSQL_USERNAME=$(echo $config_database_user)
#MYSQL_PASSWORD=$(echo $config_database_passwd)

## databases
#UM_DB=$(echo $config_database_umdb)
#AM_DB=$(echo $config_database_amdb)
#GOV_REG_DB=$(echo $config_database_govregdb)
#METRICS_DB=$(echo $config_database_metricsdb)

## database users
#MYSQL_DB_USER=$(echo $config_database_mysql_user)
#MYSQL_DB_USER_PWD=$(echo $config_database_mysql_passwd)


cd ${WORKSPACE_DIR}

prgdir=$(dirname "$0")
productPath=$(cd "$prgdir"; pwd)

echo "Working path: "$productPath


#### Clone the product; Build the distribution pack
git_product_clone
echo "============= Product clone success ==============================="

#### Get copied from jenkins build
cd ${productPath}
get_jenkins_build
echo "============= Download .zip success ==============================="

temp_repo=$productPath/product-apim/modules/distribution/product
sudo mkdir -p $temp_repo/target

temp_pack=$(ls -t $productPath | grep .zip | head -1)
sudo cp $temp_pack $temp_repo/target
echo "============= zip file copied to target success ==============================="


#### Configure database, datasources and compress
#### Populate database schemas
cd ${productPath}
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
echo "Working on "${PRODUCT_HOME}
unzip -qq ${PRODUCT_HOME}.zip


#### Create the schemas based on the selected RDBMS

        if [ ${DB_TYPE} = "mysql" ]; then
        echo "Creating MYSQL schemas"
        setup_mysql_databases
        elif [ ${DB_TYPE} = "mssql" ]; then
        echo "Creating MSSQL schemas"
        setup_mssql_databases
        elif [ ${DB_TYPE} = "oracle" ];then
        echo "Creating ORACLE schemas"
        setup_oracle_databases
        else
        echo "No database engine selected"
        fi

echo "============= Database created success ==============================="

#### Calling config-production python
python3 Configure_Product.py ${PRODUCT_HOME}.zip product-apim

echo "============= Datasource configurations are success ==============================="


#### Run Integration tests now

intg_repo=$productPath/product-apim/modules/integration

## Change the pom.xml for required version change
#    file=$intg_repo/tests-integration/tests-backend/pom.xml
#
#    sudo xmlstarlet edit -L -N w=http://maven.apache.org/POM/4.0.0 \
#    -u "/w:build/w:plugins/w:plugin/w:configuration/w:systemProperties/w:property[@name='carbon.zip']" -v "${basedir}/../../../distribution/product/target/wso2am-2.5.0.zip" $file
#
#    if [ $? -ne 0 ]; then
#    echo "Could not find the file in the given location"
#    exit 1
#    fi
#
#    echo "Values added to the file: $file"

cd $intg_repo
mvn clean install
echo "============= Integration test completed ==============================="


#### Script ends
                                                                     
