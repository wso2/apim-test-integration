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

NS = {'d': 'http://maven.apache.org/POM/4.0.0'}
ZIP_FILE_EXTENSION = ".zip"
CARBON_NAME = "carbon.zip"
VALUE_TAG = "{http://maven.apache.org/POM/4.0.0}value"
SURFACE_PLUGIN_ARTIFACT_ID = "maven-surefire-plugin"
DATASOURCE_PATHS = ["repository/conf/datasources/master-datasources.xml",
                    "repository/conf/datasources/metrics-datasources.xml"]
POM_FILE_PATHS = ["modules/integration/tests-integration/tests-backend/pom.xml",
                  "modules/integration/tests-ui-integration/pom.xml",
                  "modules/integration/tests-integration/tests-jmeter/pom.xml",
                  "modules/integration/tests-platform/pom.xml"]
LIB_PATH = "repository/components/lib"
DISTRIBUTION_PATH = "modules/distribution/product/target"
PRODUCT_STORAGE_DIR_NAME = "storage"
TEST_PLAN_PROPERTY_FILE_NAME = "testplan-props.properties"
INFRA_PROPERTY_FILE_NAME = "infrastructure.properties"
LOG_FILE_NAME = "integration.log"
DB_CARBON_DB = 'WSO2_CARBON_DB'
DB_AM_DB = 'WSO2AM_DB'
ORACLE_DB_ENGINE = "ORACLE"
DEFAULT_ORACLE_SID = "orcl"
DB_STAT_DB = 'WSO2AM_STATS_DB'
DB_MB_DB = 'WSO2_MB_STORE_DB'
DB_META_DATA = {
    "MYSQL": {"prefix": "jdbc:mysql://", "driverClassName": "com.mysql.jdbc.Driver", "jarName": "mysql.jar"},
    "MSSQL": {"prefix": "jdbc:jtds:sqlserver://", "driverClassName": "net.sourceforge.jtds.jdbc.Driver",
              "jarName": "sqlserver-ex.jar"},
    "ORACLE": {"prefix": "jdbc:oracle:thin:@", "driverClassName": "oracle.jdbc.OracleDriver",
               "jarName": "oracle-se.jar"},
    "POSTGRESQL": {"prefix": "jdbc:postgresql://", "driverClassName": "org.postgresql.Driver",
                   "jarName": "postgres.jar"}
}
