#!/bin/bash
#----------------------------------------------------------------------------
#  Copyright (c) 2020 WSO2, Inc. http://www.wso2.org
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#----------------------------------------------------------------------------
set -o xtrace; set -e

TESTGRID_DIR=/opt/testgrid/workspace
INFRA_JSON='infra.json'

PRODUCT_REPOSITORY=$1
PRODUCT_REPOSITORY_BRANCH=$2
PRODUCT_NAME=$3
PRODUCT_VERSION=$4
GIT_USER=$5
GIT_PASS=$6
TEST_MODE=$7
TEST_GROUP=$8
PRODUCT_REPOSITORY_NAME=$(echo $PRODUCT_REPOSITORY | rev | cut -d'/' -f1 | rev | cut -d'.' -f1)
PRODUCT_REPOSITORY_PACK_DIR="$TESTGRID_DIR/$PRODUCT_REPOSITORY_NAME/all-in-one-apim/modules/distribution/product/target"
INT_TEST_MODULE_DIR="$TESTGRID_DIR/$PRODUCT_REPOSITORY_NAME/all-in-one-apim/modules/integration-v2"
MIGRATION_RESOURCES_LOCATION="https://raw.githubusercontent.com/wso2/apim-test-integration/refs/heads/4.2.0-migration/apim-migration/"

# CloudFormation properties
CFN_PROP_FILE="${TESTGRID_DIR}/cfn-props.properties"

JDK_TYPE=$(grep -w "JDK_TYPE" ${CFN_PROP_FILE} | cut -d"=" -f2)
DB_TYPE=$(grep -w "DB_TYPE" ${CFN_PROP_FILE} | cut -d"=" -f2)
PRODUCT_PACK_NAME=$(grep -w "REMOTE_PACK_NAME" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_VERSION=$(grep -w "CF_DB_VERSION" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_PASSWORD=$(grep -w "CF_DB_PASSWORD" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_USERNAME=$(grep -w "CF_DB_USERNAME" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_HOST=$(grep -w "CF_DB_HOST" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_PORT=$(grep -w "CF_DB_PORT" ${CFN_PROP_FILE} | cut -d"=" -f2)
CF_DB_NAME=$(grep -w "SID" ${CFN_PROP_FILE} | cut -d"=" -f2)
MIGRATED_DB=$(grep -w "MIGRATED_DB" ${CFN_PROP_FILE} | cut -d"=" -f2)

function log_info(){
    echo "[INFO][$(date '+%Y-%m-%d %H:%M:%S')]: $1"
}

function log_error(){
    echo "[ERROR][$(date '+%Y-%m-%d %H:%M:%S')]: $1"
    exit 1
}

function install_jdk(){
    jdk_name=$1

    mkdir -p /opt/${jdk_name}
    jdk_file=$(jq -r '.jdk[] | select ( .name == '\"${jdk_name}\"') | .file_name' ${INFRA_JSON})
    wget -q https://integration-testgrid-resources.s3.amazonaws.com/lib/jdk/$jdk_file.tar.gz
    tar -xzf "$jdk_file.tar.gz" -C /opt/${jdk_name} --strip-component=1

    export JAVA_HOME=/opt/${jdk_name}
    export PATH=$JAVA_HOME/bin:$PATH
    echo $JAVA_HOME
}

function export_db_params(){
    db_name=$1

    case "$db_name" in
    *MYSQL*|*mysql*)
        db_type="mysql"
        ;;
    *POSTGRE*|*PG*|*postgre*)
        db_type="postgre"
        ;;
    *ORACLE*|*oracle*)
        db_type="oracle"
        ;;
    *MSSQL*|*SQLSERVER*|*mssql*|*sqlserver*)
        db_type="mssql"
        ;;
    *DB2*|*db2*)
        db_type="db2"
        ;;
    *)
        echo "Unknown DB type for: $db_name"
        exit 1
        ;;
    esac

    export SHARED_DATABASE_TYPE=$db_type
    export SHARED_DATABASE_DRIVER=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .driver' ${INFRA_JSON})
    export SHARED_DATABASE_URL=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_COMMON_DB") | .url' ${INFRA_JSON})
    export SHARED_DATABASE_USERNAME=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_COMMON_DB") | .username' ${INFRA_JSON})
    export SHARED_DATABASE_PASSWORD=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_COMMON_DB") | .password' ${INFRA_JSON})
    export SHARED_DATABASE_VALIDATION_QUERY=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .validation_query' ${INFRA_JSON})

    export API_MANAGER_DATABASE_TYPE=$db_type
    export API_MANAGER_DATABASE_DRIVER=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .driver' ${INFRA_JSON})
    export API_MANAGER_DATABASE_URL=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_APIMGT_DB") | .url' ${INFRA_JSON})
    export API_MANAGER_DATABASE_USERNAME=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_APIMGT_DB") | .username' ${INFRA_JSON})
    export API_MANAGER_DATABASE_PASSWORD=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .database[] | select ( .name == "WSO2AM_APIMGT_DB") | .password' ${INFRA_JSON})
    export API_MANAGER_DATABASE_VALIDATION_QUERY=$(jq -r '.jdbc[] | select ( .name == '\"${db_name}\"' ) | .validation_query' ${INFRA_JSON})
    
}

source /etc/environment

log_info "Clone Product repository"
if [ ! -d $PRODUCT_REPOSITORY_NAME ];
then
    git clone https://${GIT_USER}:${GIT_PASS}@$PRODUCT_REPOSITORY --branch $PRODUCT_REPOSITORY_BRANCH --single-branch
fi

log_info "Exporting JDK"
install_jdk ${JDK_TYPE}
if [ -n "$TEST_GROUP" ];
then
    log_info "Executing product test for ${TEST_GROUP}"
    export PRODUCT_APIM_TEST_GROUPS=${TEST_GROUP}
fi

db_file=$(jq -r '.jdbc[] | select ( .name == '\"${DB_TYPE}\"') | .file_name' ${INFRA_JSON})
wget -q https://integration-testgrid-resources.s3.amazonaws.com/lib/jdbc/${db_file}.jar  -P $TESTGRID_DIR/${PRODUCT_PACK_NAME}/repository/components/lib

sed -i "s|DB_HOST|${CF_DB_HOST}|g" ${INFRA_JSON}
sed -i "s|DB_USERNAME|${CF_DB_USERNAME}|g" ${INFRA_JSON}
sed -i "s|DB_PASSWORD|${CF_DB_PASSWORD}|g" ${INFRA_JSON}
sed -i "s|DB_NAME|${DB_NAME}|g" ${INFRA_JSON}

export_db_params ${DB_TYPE}

if [ -n "$MIGRATED_DB" ] && [ "$MIGRATED_DB" == "true" ];
then
    log_info "Run APIM Migration..."
    wget "${MIGRATION_RESOURCES_LOCATION}run-apim-migration.sh"
    bash run-apim-migration.sh ${JDK_TYPE} ${INFRA_JSON} ${MIGRATION_RESOURCES_LOCATION} ${DB_TYPE}
    aws s3 cp s3://integration-testgrid-resources/apim-migration-truststore/client-truststore.jks "$TESTGRID_DIR/$PRODUCT_PACK_NAME/repository/resources/security/client-truststore.jks"
    aws s3 cp s3://integration-testgrid-resources/apim-migration-truststore/wso2carbon.jks "$TESTGRID_DIR/$PRODUCT_PACK_NAME/repository/resources/security/wso2carbon.jks"
else
    log_info "Skipping DB migration and continue with integration tests"
fi

# delete if the folder is available
rm -rf $$PRODUCT_REPOSITORY_PACK_DIR

mkdir -p $PRODUCT_REPOSITORY_PACK_DIR
log_info "Copying product pack to Repository"
[ -f $TESTGRID_DIR/$PRODUCT_NAME-$PRODUCT_VERSION*.zip ] && rm -f $TESTGRID_DIR/$PRODUCT_NAME-$PRODUCT_VERSION*.zip
cd $TESTGRID_DIR && zip -qr $PRODUCT_PACK_NAME.zip $PRODUCT_PACK_NAME
mv $TESTGRID_DIR/$PRODUCT_PACK_NAME.zip $PRODUCT_REPOSITORY_PACK_DIR/.
log_info "install pack into local maven Repository"
mvn install:install-file -Dfile=$PRODUCT_REPOSITORY_PACK_DIR/$PRODUCT_PACK_NAME.zip -DgroupId=org.wso2.am -DartifactId=wso2am -Dversion=$PRODUCT_VERSION -Dpackaging=zip --file=$PRODUCT_REPOSITORY_PACK_DIR/../pom.xml 
if [ -n "$MIGRATED_DB" ] && [ "$MIGRATED_DB" == "true" ];
then
    log_info "Run Cucumber tests on the migrated APIM pack"
    cd $INT_TEST_MODULE_DIR  && mvn clean install -Pmigration
else
    log_info "Skipping DB migration related tests and run default integration tests"
    cd $INT_TEST_MODULE_DIR  && mvn clean install
fi
