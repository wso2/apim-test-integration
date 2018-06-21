#!/bin/bash

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

serverHost=$serverHost
serverPort=$serverPort
pubHost=$pubHost
pubPort=$pubPort
storeHost=$storeHost
storePort=$storePort
gwMgrHost=$gwMgrHost
gwMgrPort=$gwMgrPort
gwWrkHost=$gwWrkHost
gwWrkPort=$gwWrkPort

prgdir=$(dirname "$0")
scriptPath=$(cd "$prgdir"; pwd)

echo "working directory : "$scriptPath

#updating jmeter properties - user.properties
sed -i "s|^\(serverHost\s*=\s*\).*\$|\1${serverHost}|" $scriptPath/../resources/user.properties
sed -i "s|^\(serverPort\s*=\s*\).*\$|\1${serverPort}|" $scriptPath/../resources/user.properties
sed -i "s|^\(pubHost\s*=\s*\).*\$|\1${pubHost}|" $scriptPath/../resources/user.properties
sed -i "s|^\(pubPort\s*=\s*\).*\$|\1${pubPort}|" $scriptPath/../resources/user.properties
sed -i "s|^\(storeHost\s*=\s*\).*\$|\1${storeHost}|" $scriptPath/../resources/user.properties
sed -i "s|^\(storePort\s*=\s*\).*\$|\1${storePort}|" $scriptPath/../resources/user.properties
sed -i "s|^\(gwMgrHost\s*=\s*\).*\$|\1${gwMgrHost}|" $scriptPath/../resources/user.properties
sed -i "s|^\(gwMgrPort\s*=\s*\).*\$|\1${gwMgrPort}|" $scriptPath/../resources/user.properties
sed -i "s|^\(gwWrkHost\s*=\s*\).*\$|\1${gwWrkHost}|" $scriptPath/../resources/user.properties
sed -i "s|^\(gwWrkPort\s*=\s*\).*\$|\1${gwWrkPort}|" $scriptPath/../resources/user.properties
#run base-setup.sh
source $scriptPath/../base-setup.sh > $scriptPath/basesetup.log

