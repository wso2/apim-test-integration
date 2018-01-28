#! /bin/bash

# Copyright (c) 2017, WSO2 Inc. (http://wso2.com) All Rights Reserved.
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

#properties
#TODO:read below property from infra.json file
appName="sample-data-backend"
tomcatHost=$tomcatHost
tomcatPort=$tomcatPort
tomcatUsername=erandi
tomcatPassword=erandi123
tomcatVersion=7
serverHost=$serverHost
serverPort=$serverPort
servletPort=$servletPort

cd $scriptPath/resources/configs/pre

#copy user-mgt.xml and jndi.properties
cp user-mgt.xml $APIM_HOME/repository/conf
cp jndi.properties $APIM_HOME/repository/conf

#Restart the server
sh $APIM_HOME/bin/wso2server.sh restart

#deploy webapp on tomcat
#tomcat6
#curl --upload-file target\debug.war "http://tomcat:tomcat@localhost:8088/manager/deploy?path=/debug&update=true"
#tomcat7/8
curl -T "sample-data-backend.war" "http://$tomcatUsername:$tomcatPassword@$tomcatHost:$tomcatPort/manager/text/deploy?path=/$appname&update=true"

x=0;
retry_count=10;
while true
do
echo $(date)" Waiting until deploying the app on Tomcat!"
#STATUS=$(curl -s http://scriptuser:scriptuser@localhost:8080/manager/text/list | grep ${appName})
if curl -s http://$tomcatUsername:$tomcatPassword@$tomcatHost:$tomcatPort/manager/text/list | grep "${appName}:running"
then
 echo "Found ${appName} is running on Tomcat"
 echo "Done base-setup.sh"
 exit 0
else
 echo "Context /${appName} Not Found"
    if [ $x = $retry_count ]; then
    echo "ERROR on app deployment"
        exit 1
    fi
fi
x=$((x+1))
sleep 1
done
