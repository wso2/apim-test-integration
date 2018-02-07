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

productHome=$productHome
filePath=repository/deployment/server/jaggeryapps/publisher/site/conf/locales/jaggery/

prgdir=$(dirname "$0")
configDir=$(cd "$prgdir"; pwd)

#copy config files
cp $configDir/files/locale_default.json $productHome/$filePath
cd $productHome/bin

#verify file copy status and exit on failure
statusval=$?
if [ $statusval -eq 0 ]; then
 #stop the server
 sh wso2server.sh stop
else
    echo "file copy command failed..."
    exit 1
fi
#wait till server stops
y=0;
retry_count1=20;
while true
do
echo $(date)" Waiting until server stops"
#mystatus=$(curl -s -w '%{http_code}' https://localhost:9443/carbon -k )
if curl -s -w '%{http_code}' https://localhost:9443/carbon -k | grep "000"
then
 echo "Carbon server stopped...!"
 break
else
 echo "Carbon server is still running..."
    if [ $y = $retry_count1 ]; then
    echo "Couldn't stop the server"
        exit 1
    fi
fi
x=$((x+1))
sleep 1
done
#wait few seconds to finish with server-stop
sleep 3
#start back the server
echo "server starting..."
sh wso2server.sh start
#wait till server starts
x=0;
retry_count=20;
while true
do
echo $(date)" waiting until server starts..."
#STATUS=$(curl -s http://scriptuser:scriptuser@localhost:8080/manager/text/list | grep ${appName})
if curl -s -w '%{http_code}' https://localhost:9443/carbon -k | grep "302"
then
 echo "found server running..."
 echo "configurations Done...!"
 exit 0
else
 echo "carbon server not running..."
    if [ $x = $retry_count ]; then
    echo "Couldn't start the server"
        exit 1
    fi
fi
x=$((x+1))
sleep 2
done
