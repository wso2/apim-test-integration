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

DIR=$2
FILE1=${DIR}/infrastructure.properties
FILE2=${DIR}/testplan-props.properties
FILE3=do-run.py
FILE4=configure_product.py
FILE5=const.py

PROP_KEY=sshKeyFileLocation    #pem file
PROP_USER=user              #OS name e.g. centos
PROP_HOST=WSO2PublicIP      #host IP
PROP_REMOTE_DIR=REMOTE_WORKSPACE_DIR_UNIX

REM_DIR=`grep -w "$PROP_REMOTE_DIR" ${FILE1} ${FILE2} | cut -d'=' -f2`
key_pem=`grep -w "$PROP_KEY" ${FILE1} ${FILE2} | cut -d'=' -f2`
#user=`cat ${FILE2} | grep -w "$PROP_USER" ${FILE1} ${FILE2} | cut -d'=' -f2`
user=centos
host=`grep -w "$PROP_HOST" ${FILE1} ${FILE2} | cut -d'=' -f2`
CONNECT_RETRY_COUNT=2

wait_for_port() {
host=$1
port=$2
x=0;
retry_count=$CONNECT_RETRY_COUNT;
echo "Wait port: ${1}:${2}" 
while ! nc -z $host $port; do
  sleep 2 # wait for 2 second before check again
  echo -n "."
  if [ $x = $retry_count ]; then
    echo "port never opened."
    exit 1
  fi
x=$((x+1))
done

}

wait_for_port ${host} 22 

ssh -o StrictHostKeyChecking=no -i ${key_pem} ${user}@${host} mkdir -p ${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} do-run.sh ${user}@${host}:${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} ${FILE1} ${user}@${host}:${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} ${FILE2} ${user}@${host}:${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} ${FILE3} ${user}@${host}:${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} ${FILE4} ${user}@${host}:${REM_DIR}

scp -o StrictHostKeyChecking=no -i ${key_pem} ${FILE5} ${user}@${host}:${REM_DIR}
echo "=== Files copied success ==="


ssh -o StrictHostKeyChecking=no -i ${key_pem} ${user}@${host} bash ${REM_DIR}/do-run.sh
#ssh -o StrictHostKeyChecking=no -i ${key_pem} ${user}@${host} python3 ${REM_DIR}/do-run.py

### Get the reports from integration test
scp -o StrictHostKeyChecking=no -r -i ${key_pem} ${user}@${host}:${REM_DIR}/product-apim/modules/integration/tests-integration/tests-backend/target/surefire-reports .
scp -o StrictHostKeyChecking=no -r -i ${key_pem} ${user}@${host}:${REM_DIR}/product-apim/modules/integration/tests-integration/tests-backend/target/logs/automation.log .
echo "=== Reports are copied success ==="

##script ends
