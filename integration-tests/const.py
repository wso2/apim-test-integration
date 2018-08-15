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
DATASOURCE_PATHS = {"product-apim": ["repository/conf/datasources/master-datasources.xml",
                                     "repository/conf/datasources/metrics-datasources.xml"],
                    "product-is": [],
                    "product-ei": []}
M2_PATH = {"product-is": "is/wso2is", "product-apim": "am/wso2am",
           "product-ei": "ei/wso2ei"}
DIST_POM_PATH = {"product-is": "modules/distribution/pom.xml", "product-apim": "modules/distribution/product/pom.xml",
                 "product-ei": "distribution/pom.xml"}
LIB_PATH = "repository/components/lib"
DISTRIBUTION_PATH = {"product-apim": "modules/distribution/product/target",
                     "product-is": "modules/distribution/target",
                     "product-ei": "modules/distribution/target"}
PRODUCT_STORAGE_DIR_NAME = "storage"
TEST_PLAN_PROPERTY_FILE_NAME = "testplan-props.properties"
INFRA_PROPERTY_FILE_NAME = "infrastructure.properties"
LOG_FILE_NAME = "integration.log"
ORACLE_DB_ENGINE = "ORACLE-SE2"
MSSQL_DB_ENGINE = "SQLSERVER-SE"
MYSQL_DB_ENGINE = "MYSQL"
DEFAULT_ORACLE_SID = "orcl"
DEFAULT_DB_USERNAME = "wso2carbon"
LOG_STORAGE = "logs"
TESTNG_DIST_XML_PATH = "modules/integration/tests-integration/tests-backend/src/test/resources/testng.xml"
TESTNG_SERVER_MGT_DIST = "modules/integration/tests-integration/tests-backend/src/test/resources/testng-server-mgt.xml"
LOG_FILE_PATHS = {"product-apim": [
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/emailable-report.html",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/index.html",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/TEST-TestSuite.xml",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/testng.css",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/testng-results.xml",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/TestSuite.txt",
    "modules/integration/tests-integration/tests-backend/target/logs/automation.log"],
    "product-is": [],
    "product-ei": []}
DB_META_DATA = {
    "MYSQL": {"prefix": "jdbc:mysql://", "driverClassName": "com.mysql.jdbc.Driver", "jarName": "mysql.jar",
              "DB_SETUP": {
                  "product-apim": {"WSO2_CARBON_DB": ['mysql5.7.sql'], "WSO2AM_DB": ['apimgt/mysql5.7.sql'],
                                   "WSO2AM_STATS_DB": [],
                                   "WSO2_MB_STORE_DB": ['mb-store/mysql-mb.sql'],
                                   "WSO2_METRICS_DB": ['metrics/mysql.sql']}, "product-is": {},
                  "product-ei": {}}},
    "SQLSERVER-SE": {"prefix": "jdbc:sqlserver://",
                     "driverClassName": "com.microsoft.sqlserver.jdbc.SQLServerDriver", "jarName": "sqlserver-ex.jar",
                     "DB_SETUP": {
                         "product-apim": {"WSO2_CARBON_DB": ['mssql.sql'], "WSO2AM_DB": ['apimgt/mssql.sql'],
                                          "WSO2AM_STATS_DB": [],
                                          "WSO2_MB_STORE_DB": ['mb-store/mssql-mb.sql'],
                                          "WSO2_METRICS_DB": ['metrics/mssql.sql']}, "product-is": {},
                         "product-ei": {}}},
    "ORACLE-SE2": {"prefix": "jdbc:oracle:thin:@", "driverClassName": "oracle.jdbc.OracleDriver",
                   "jarName": "oracle-se.jar",
                   "DB_SETUP": {
                       "product-apim": {"WSO2_CARBON_DB": ['oracle.sql'], "WSO2AM_DB": ['apimgt/oracle.sql'],
                                        "WSO2AM_STATS_DB": [],
                                        "WSO2_MB_STORE_DB": ['mb-store/oracle-mb.sql'],
                                        "WSO2_METRICS_DB": ['metrics/oracle.sql']}, "product-is": {},
                       "product-ei": {}}},
    "POSTGRESQL": {"prefix": "jdbc:postgresql://", "driverClassName": "org.postgresql.Driver",
                   "jarName": "postgres.jar",
                   "DB_SETUP": {"product-apim": {"WSO2_CARBON_DB": [], "WSO2AM_DB": [], "WSO2AM_STATS_DB": [],
                                                 "WSO2_MB_STORE_DB": [], "WSO2_METRICS_DB": [], "product-is": {},
                                                 "product-ei": {}}}
                   }}
