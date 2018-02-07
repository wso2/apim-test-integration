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

#run pre-scenario-steps
source $rootDir/jmeter/04-pre-scenario-steps.sh
#TODO: Verify output of above step.
#run jmeter file/s.
<JMETER_RUNTIME>/bin/jmeter -n -t 01-Scenario04-ManageLifeCycle.jmx -p resources/user.properties -l 01-Scenario04-ManageLifeCycle.jtl
#run post-scenario-steps
source jmeter/04-post-scenario-steps.sh
