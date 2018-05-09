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

prgdir=$(dirname "$0")
scriptPath=$(cd "$prgdir"; pwd)

keyName=qaKey
sgId=sg-19b31c52
instanceId=i-0223b0cef006319d4

echo "Destroying additionally created infrastructure..."

# Destroy the EC2 instance
instanceState=$(aws ec2 terminate-instances --instance-ids $instanceId --query 'TerminatingInstances[0].CurrentState.Name' | cut -d '"' -f2)
counter=1
while [ $instanceState != "terminated" -a $counter -lt 10 ]; do
    sleep 15
    instanceState=$(aws ec2 terminate-instances --instance-ids $instanceId --query 'TerminatingInstances[0].CurrentState.Name' | cut -d '"' -f2)
    counter=$((counter+1))
done
sleep 30

# Delete the securty group, generated key pairs
aws ec2 delete-security-group --group-id $sgId
aws ec2 delete-key-pair --key-name $keyName
rm -f $scriptPath/key.pem
