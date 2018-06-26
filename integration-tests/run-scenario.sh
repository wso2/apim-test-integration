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

sudo yum update && \
sudo yum install -y git man zip vim wget tar

DEPL_OUT_DIRECTORY=/opt
FILE=$DEPL_OUT_DIRECTORY/out.properties
WORKSPACE_DIR=$(grep -i 'WORKSPACE_DIR' $FILE  | cut -f2 -d'=')
cd ${WORKSPACE_DIR}


#### TODO : Copy the run-integration.sh into /opt/wso2


install_java() {
	if [[ "$userJava" = "oraclejdk" ]];then
		echo "Installing Oracle JDK"
		MACHINE_TYPE='uname -m'

		if [ ${MACHINE_TYPE} == 'x86_64' ]; then
			sudo wget   http://download.oracle.com/otn-pub/java/jdk/8u171-b11/512cd62ec5174c3487ac17c61aaa89e8/jdk-8u171-linux-x64.tar.gz
			sudo tar -xzf jdk-8u171-linux-x64.tar.gz
			else
			sudo wget  http://download.oracle.com/otn-pub/java/jdk/8u171-b11/512cd62ec5174c3487ac17c61aaa89e8/jdk-8u171-linux-i586.tar.gz
			sudo tar -xzf jdk-8u171-linux-i586.tar.gz
		fi
	elif [[ "$userJava" = "opedjdk" ]];then
		echo "Installing Open jdk"
 	else
		echo "JDK should be entered as CLA"
	fi
}

setup_java_env() {
	source /etc/environment

        echo JDK_PARAM=${JDK} | sudo tee -a  /opt/wso2/java.txt
        REQUESTED_JDK_PRESENT=$(grep "^${JDK}=" /etc/environment | wc -l)
        if [[ $REQUESTED_JDK_PRESENT = 0 ]]; then
           printf "The requested JDK, ${JDK}, not found in /etc/environment: \n $(cat /etc/environment)."
            #exit 1; // todo: inform via cfn-signal
            #### Install java if already not exist
            # install_java;
        fi

        JAVA_HOME=$(grep "^${JDK}=" /etc/environment | head -1 | sed "s:${JDK}=\(.*\):\1:g" | sed 's:"::g')

        echo ">> Setting up JAVA_HOME ..."
        JAVA_HOME_EXISTS=$(grep -r "JAVA_HOME=" /etc/environment | wc -l  )
        if [[ $JAVA_HOME_EXISTS = 0 ]]; then
           echo ">> Adding JAVA_HOME entry."
           echo JAVA_HOME=$JAVA_HOME | sudo tee -a /etc/environment
           else
              echo ">> Updating JAVA_HOME entry."
              sed -i "/JAVA_HOME=/c\JAVA_HOME=$JAVA_HOME" /etc/environment
        fi
        source /etc/environment

        echo "export JAVA_HOME=$JAVA_HOME" | sudo tee -a /etc/profile
        source /etc/profile
        }

get_jenkins_build() {

	echo "Get distribution build from jenkins"
	jenkins_url="https://wso2.org/jenkins/job/products/job/product-apim_2.x/lastRelease/"
	distribution_url=$(curl -s -G $jenkins_url/api/xml -d xpath=\(/mavenModuleSetBuild//relativePath\)[3])
	distribution_pack=$(echo $distribution_url | sed -n 's:.*<relativePath>\(.*\)</relativePath>.*:\1:p')
	echo "Distribution Pack: "$distribution_pack
	downloadable_url=$jenkins_url"artifact/"$distribution_pack
	echo "Downloadable URL: "$downloadable_url
	sudo wget $downloadable_url

}

###################### Starts run-scenario

prgdir=$(dirname "$0")
productPath=$(cd "$prgdir"; pwd)

#### If reads from properties file #repo=$(grep -i 'git_location' $FILE  | cut -f2 -d'=')
####Take product choice from CLI; e.g. apim or is
repo=$1
echo "Working path: "$productPath

#### Call to check set java home
#setup_java_env;


#### Clone the product; Build the distribution pack
echo "cloning the repo product-"$repo
    if [ "$repo" = "apim" ]
        then
        sudo mkdir -p $productPath/inte_test_apim
        cd $productPath/inte_test_apim
        sudo git clone https://github.com/wso2/product-apim.git
        sleep 10
        echo "Product clone success ==========="
	cd product-apim
	sudo git checkout 2.x
	git status

#### Get copied from jenkins build
cd ${productPath}
get_jenkins_build
echo "Download .zip success ==========="

temp_repo=$productPath/inte_test_apim/product-apim/modules/distribution/product
sudo mkdir -p $temp_repo/target

temp_pack=$(ls -t $productPath | grep .zip | head -1)
sudo cp $temp_pack $temp_repo/target
echo "zip file copied to target success =========="
 
#### TODO: Configure datasources and compress

#cd $temp_repo/target
#temp_pack2=$(ls -t | grep .zip | head -1)
#sudo unzip -qq $temp_pack2
#### Incorporate the datasource script here; and call run-schema.sh to create RDBMS schemas
#run-schema.sh
#### =========== Call config-production.python #given by lasantha


echo "Configurations done and unzip success ==========="

#### TODO: Run Integration tests now

cd ${productPath}
pack=$(ls -t | grep .zip | head -1)

for f in $pack; do

    prod=${f%%-*}
    suffix=${f#*-}
        for n in $suffix; do
        version=${n%%.zip}
        done
done

intg_repo=$productPath/inte_test_apim/product-apim/modules/integration

#### Change the pom for version
    file=$intg_repo/tests-integration/tests-backend/pom.xml

    xmlstarlet edit -L -N w=http://maven.apache.org/POM/4.0.0 \
    -u "/w:build/w:plugins/w:plugin/w:configuration/w:systemProperties/w:property[@name='carbon.zip']" -v "${basedir}/../../../distribution/product/target/wso2am-2.5.0.zip" $file

    if [ $? -ne 0 ]; then
    echo "Could not find the file in the given location"
    exit 1
    fi

    echo "Values added to the file: $file"

cd $intg_repo
mvn clean install
echo "Integration test completed =========="


#### If user pass product two (is)
elif [ "$repo" = "is" ]
 then
 mkdir -p $productPath/inte_test_is
 cd $productPath/inte_test_is
 git clone https://github.com/wso2/product-is.git
 sleep 300

else
echo "$repo"

fi



### Script ends
                                                                     
