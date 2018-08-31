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

#create APIs
#/home/ubuntu/apache-jmeter-3.2/bin/jmeter.sh -n -t /home/ubuntu/apim-loadtest/jmeter/API_Creation.jmx -p /home/ubuntu/apim-loadtest/resources/api-creationuser.properties -l /home/ubuntu/apim-loadtest/das-LRTest-APICreation.jtl

#run high-traffic-jmeter_script

crontab -l > mycron
sudo echo "30 20 * * * /home/ubuntu/apache-jmeter-3.2/bin/jmeter.sh -n -t /home/ubuntu/apim-loadtest/jmeter/high_traffic_Invocation.jmx -p /home/ubuntu/apim-loadtest/resources/high-traffic-user.properties -l /home/ubuntu/apim-loadtest/jmeter/das-LRTest-HighTraffic.jtl" >> mycron
crontab mycron
rm mycron

#run medium-traffic-jmeter_script
crontab -l > mycron
sudo echo "00 06 * * * /home/ubuntu/apache-jmeter-3.2/bin/jmeter.sh -n -t /home/ubuntu/apim-loadtest/jmeter/medium_traffic_Invocation.jmx -p /home/ubuntu/apim-loadtest/resources/medium-traffic-user.properties -l /home/ubuntu/apim-loadtest/jmeter/das-LRTest-MediumTraffic.jtl" >> mycron
crontab mycron
rm mycron

#run low-traffic-jmeter_script
crontab -l > mycron
sudo echo "00 12 * * * /home/ubuntu/apache-jmeter-3.2/bin/jmeter.sh -n -t /home/ubuntu/apim-loadtest/jmeter/low_traffic_Invocation.jmx -p /home/ubuntu/apim-loadtest/resources/low-traffic-user.properties -l /home/ubuntu/apim-loadtest/jmeter/das-LRTest-LowTraffic.jtl" >> mycron
crontab mycron
rm mycron


