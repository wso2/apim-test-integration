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

DATASOURCE_PATHS = {"repository/conf/datasources/master-datasources.xml",
                    "repository/conf/datasources/metrics-datasources.xml"}
M2_PATH = "am/wso2am"
DIST_POM_PATH = "modules/distribution/product/pom.xml"
LIB_PATH = "repository/components/lib"
DISTRIBUTION_PATH = "modules/distribution/product/target"
INTEGRATION_PATH = "modules/integration/tests-integration/tests-backend"
POM_FILE_PATHS = {}
TESTNG_DIST_XML_PATH = "modules/integration/tests-integration/tests-backend/src/test/resources/testng.xml"
TESTNG_SERVER_MGT_DIST = "modules/integration/tests-integration/tests-backend/src/test/resources/testng-server-mgt.xml"
ARTIFACT_REPORTS_PATHS = {
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/emailable-report.html",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/index.html",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/TEST-TestSuite.xml",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/testng.css",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/testng-results.xml",
    "modules/integration/tests-integration/tests-backend/target/surefire-reports/TestSuite.txt",
    "modules/integration/tests-integration/tests-backend/target/logs/automation.log"}
DB_META_DATA = {
    "MYSQL": {"prefix": "jdbc:mysql://", "driverClassName": "com.mysql.jdbc.Driver", "jarName": "mysql.jar",
              "DB_SETUP": {"WSO2_CARBON_DB": ['dbscripts/mysql5.7.sql'],
                           "WSO2AM_DB": ['dbscripts/apimgt/mysql5.7.sql'],
                           "WSO2AM_STATS_DB": [],
                           "WSO2_MB_STORE_DB": ['dbscripts/mb-store/mysql-mb.sql'],
                           "WSO2_METRICS_DB": ['dbscripts/metrics/mysql.sql']}
              },
    "SQLSERVER-SE": {"prefix": "jdbc:sqlserver://",
                     "driverClassName": "com.microsoft.sqlserver.jdbc.SQLServerDriver", "jarName": "sqlserver-ex.jar",
                     "DB_SETUP": {"WSO2_CARBON_DB": ['dbscripts/mssql.sql'],
                                  "WSO2AM_DB": ['dbscripts/apimgt/mssql.sql'],
                                  "WSO2AM_STATS_DB": [],
                                  "WSO2_MB_STORE_DB": ['dbscripts/mb-store/mssql-mb.sql'],
                                  "WSO2_METRICS_DB": ['dbscripts/metrics/mssql.sql']
                                  }
                     },
    "ORACLE-SE2": {"prefix": "jdbc:oracle:thin:@", "driverClassName": "oracle.jdbc.OracleDriver",
                   "jarName": "oracle-se.jar",
                   "DB_SETUP": {"WSO2_CARBON_DB": ['dbscripts/oracle.sql'],
                                "WSO2AM_DB": ['dbscripts/apimgt/oracle.sql'],
                                "WSO2AM_STATS_DB": [],
                                "WSO2_MB_STORE_DB": ['dbscripts/mb-store/oracle-mb.sql'],
                                "WSO2_METRICS_DB": ['dbscripts/metrics/oracle.sql']
                                }
                   },
    "POSTGRESQL": {"prefix": "jdbc:postgresql://", "driverClassName": "org.postgresql.Driver",
                   "jarName": "postgres.jar",
                   "DB_SETUP": {"WSO2_CARBON_DB": ['dbscripts/postgresql.sql'],
                                "WSO2AM_DB": ['dbscripts/apimgt/postgresql.sql'],
                                "WSO2AM_STATS_DB": [],
                                "WSO2_MB_STORE_DB": ['dbscripts/mb-store/postgresql.sql'],
                                "WSO2_METRICS_DB": ['dbscripts/metrics/postgresql.sql']
                                }
                   }
}
