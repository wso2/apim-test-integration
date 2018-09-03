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
DISTRIBUTION_PATH = {"product-apim": "modules/distribution/product/target",
                     "product-is": "modules/distribution/target",
                     "product-ei": "modules/distribution/target"}
PRODUCT_STORAGE_DIR_NAME = "storage"
TEST_PLAN_PROPERTY_FILE_NAME = "testplan-props.properties"
INFRA_PROPERTY_FILE_NAME = "infrastructure.properties"
LOG_FILE_NAME = "integration.log"
LOG_STORAGE = "logs"
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
APIM_CONST_HOST = "wso2.apim.test.com"

