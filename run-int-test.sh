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

PRODUCT_REPOSITORY_NAME=$2 # apim product integration tests repository
API_IMPORT_EXPORT_MODULE_DIR="/opt/testgrid/workspace/$PRODUCT_REPOSITORY_NAME/modules/api-import-export"
INT_TEST_MODULE_DIR="/opt/testgrid/workspace/$PRODUCT_REPOSITORY_NAME/modules/integration"
NEXUS_SCRIPT_PATH="/opt/testgrid/workspace/uat-nexus-settings.xml"

# export JAVA_HOME and other environment variables
source /etc/environment

# install api-import-export module
cd $API_IMPORT_EXPORT_MODULE_DIR && mvn clean install -fae -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn
# run integration tests
cd $INT_TEST_MODULE_DIR  && mvn clean install -s $NEXUS_SCRIPT_PATH -fae -B -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn
