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

set -o xtrace


DIR=$2
INFRA_FILE=${DIR}/infrastructure.properties

# Configuring locale support for python
export LC_ALL=C

# prerequisite: Before run this script pip and virtualenv packages have to be installed on the running environment
# virtuel env location
INIT_ENV=env

# Set python interpreter you want for your environment
PYTHON=$(which python3.7)

# get the working directory
WD=$(pwd)
cd ${WD}

# create the virtual env
virtualenv $WD/$INIT_ENV -p $PYTHON

# activate the environment
source $WD/env/bin/activate

# install packages to the virtual environment
env/bin/pip3.7 install -r requirements.txt

cp ${INFRA_FILE} infrastructure.properties

# run the run-intg-test.py script
python3.7 run-intg-test.py

cp -r product-apim/modules/integration/tests-integration/tests-backend/target/surefire-reports ${DIR}
cp product-apim/modules/integration/tests-integration/tests-backend/target/logs/automation.log ${DIR}
