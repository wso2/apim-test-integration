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

DIR=$2
FILE1=${DIR}/infrastructure.properties
FILE2=${DIR}/testplan-props.properties
REM_DIR=/opt/wso2
echo $FILE1
echo $FILE2

PROP_KEY=keyFileLocation    #pem file
PROP_USER=user              #OS name e.g. centos
PROP_HOST=WSO2PublicIP      #host IP

key_pem=`cat ${FILE1} | grep -w "$PROP_KEY" | cut -d'=' -f2`
user=`cat ${FILE2} | grep -w "$PROP_USER" | cut -d'=' -f2`
host=`cat ${FILE1} | grep -w "$PROP_HOST" | cut -d'=' -f2`

scp -i ${key_pem} do-run.sh ${user}@${host}:${REM_DIR}
echo "=== File do-run.sh copied to success ==="

ssh -i ${key_pem} ${user}@${host} bash ${REM_DIR}/do-run.sh

### Get the reports from integration test
scp -r -i ${key_pem} ${user}@${host}:${REM_DIR}/product-apim/modules/integration/tests-integration/tests-backend/target/surefire-reports .
scp -r -i ${key_pem} ${user}@${host}:${REM_DIR}/product-apim/modules/integration/tests-integration/tests-backend/target/logs/automation.log .
echo "=== Reports are copied success ==="

##script ends