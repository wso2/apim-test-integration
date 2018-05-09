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

#TODO: compete the script when TestGrid implements support for this

set -e

keyName=qaKey
sgName=msf4j-security-group
amiID=ami-cd226cb2
user=ubuntu

prgdir=$(dirname "$0")
scriptPath=$(cd "$prgdir"; pwd)
userData=$scriptPath/user-data.txt

echo "working directory : "$scriptPath

# Launch an EC2 instance for deploying MSF4J services

# Create a security group
echo "Creating secuity group..."
sgId=$(aws ec2 create-security-group --group-name $sgName --description "security group for msf4j instance" --query 'GroupId' | cut -d '"' -f2)

# Define inbound traffic rules
echo "Set inbound traffic rules..."
aws ec2 authorize-security-group-ingress --group-name $sgName --protocol tcp --port 22 --cidr 0.0.0.0/0 --output text
aws ec2 authorize-security-group-ingress --group-name $sgName --protocol tcp --port 8080 --cidr 0.0.0.0/0 --output text
aws ec2 authorize-security-group-ingress --group-name $sgName --protocol tcp --port 8081 --cidr 0.0.0.0/0 --output text

# Create new key pair
echo "Generating key-pair..."
output=$(aws ec2 create-key-pair --key-name $keyName --query 'KeyMaterial' --output text > key.pem)

# Change permission of key
chmod 400 key.pem

# Run EC2 instance using custom ami
echo "Launching EC2 instance..."
instanceId=$(aws ec2 run-instances --image-id $amiID --security-group-ids $sgId --count 1 --instance-type t2.micro --key-name $keyName --user-data file://$userData --query 'Instances[0].InstanceId' | cut -d '"' -f2)

# Copy instance and sg ids to cleanup.sh
sed -i "s|^\(instanceId\s*=\s*\).*\$|\1${instanceId}|" $scriptPath/cleanup.sh
sed -i "s|^\(sgId\s*=\s*\).*\$|\1${sgId}|" $scriptPath/cleanup.sh

# Wait till instance state is running
instanceState=$(aws ec2 describe-instance-status --instance-id $instanceId --query 'InstanceStatuses[0].InstanceState.Name' | cut -d '"' -f2)
counter=1
while [ $instanceState != "running"  -a $counter -le 10 ]; do
    sleep 15
    instanceState=$(aws ec2 describe-instance-status --instance-id $instanceId --query 'InstanceStatuses[0].InstanceState.Name' | cut -d '"' -f2)
    counter=$((counter+1))
done

# Get instance IP
ip=$(aws ec2 describe-instances --instance-ids $instanceId --query 'Reservations[0].Instances[0].PublicIpAddress' | cut -d '"' -f2)

# Wait till instance is ready to serve

counter=1
l_TELNET='echo "quit" | '$ip' 22 | grep "Escape character is"'
while [ "$?" -ne 0 -a $counter -le 20 ]; do
    sleep 6
    l_TELNET='echo "quit" | '$ip' 22 | grep "Escape character is"'
    counter=$((counter+1))
done

# Copy instance and sg ids to cleanup.sh
sed -i "s|^\(MSF4JHost\s*=\s*\).*\$|\1${ip}|" $scriptPath/scenario*/resources/user.properties
sed -i "s|^\(msf4jServiceHost\s*=\s*\).*\$|\1${ip}|" $scriptPath/scenario*/resources/user.properties

sleep 120
