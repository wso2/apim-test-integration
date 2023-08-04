#!/bin/bash
workingdir=$(pwd)
reldir=`dirname $0`
cd $reldir
tests_dir=$(pwd)

kubectl get pods -l product=apim -n="${kubernetes_namespace}"  -o custom-columns=:metadata.name > podNames.txt
dateWithMinute=$(date +"%Y_%m_%d_%H_%M")
date=$(date +"%Y_%m_%d")
mkdir -p logs
cat podNames.txt | while read podName 
do
    if [[ "$podName" != "" ]];
    then 
        phase=$(kubectl get pods "$podName" -n="${kubernetes_namespace}" -o json | jq -r '.status | .phase')
        if [[ "$phase" == "Running" ]];
        then 
            kubectl logs "$podName" -n="${kubernetes_namespace}" > "logs/$dateWithMinute-$podName.txt"
        else
            echo "$podName is not running. Its in $phase phase."
        fi
    fi
done

warningPattern="^\[[0-9,: ,-]*\][ ]*WARN - (.*)$"
errorPattern="^\[[0-9,: ,-]*\][ ]*ERROR - (.*)$"

flag="false"

for filename in logs/*; do
    while read line;
    do
        if [[ "$line" =~ $errorPattern ]];#"$line" =~ $warningPattern || "$line" =~ $errorPattern ]];
        then 
            flag="true"
            match=${BASH_REMATCH[1]}
            while read i;
            do
                if [[ "$match" =~ $i ]];
                then 
                    flag="false"
                    break
                fi
            done <<< $( jq -cr '.[]' excludedWarningsAndErrors.json )
            if [[ $flag == "true" ]];
            then 
                if [[ "$line" =~ $warningPattern ]];
                then 
                    echo "Unexpected warning $line"
                    exit 1
                else 
                    echo "Unexpected error $line"
                    exit 1
                fi
            else 
                echo "Expected $line is ignored."
            fi
        fi
    done <<< $(cat "$filename")
done

outputFolderpath="../../../output"
jmeterResultPath="$outputFolderpath/jmeter-results"
rm -f "$outputFolderpath/jmeter.log"
rm -f -r "$jmeterResultPath"
mkdir -p "$outputFolderpath"
mkdir -p "$jmeterResultPath"
echo "host : " ${HOST_NAME}

echo ls

echo "========== Running newman tests ================"

collection_file=$tests_dir/tests-cases/profile-tests/Profile_Setup_Tests.postman_collection.json
environment_file=$tests_dir/tests-cases/profile-tests/APIM_Environment.postman_environment.json

/home/ubuntu/.nvm/versions/node/v19.0.1/bin/newman run "$collection_file" \
  --environment "$environment_file" \
  --env-var "cluster_ip=${HOST_NAME}" \
  --env-var "pizzashack_endpoint=https://wso2am-pattern-4-am-cp-service:9443/am/sample/pizzashack/v1/api/" \
  --insecure \
  --reporters cli,junit \
  --reporter-junit-export newman-profile-results.xml

# Capture the exit code of the Newman test run
newmanExitCode=$?

echo ""
# Check the exit codes and return the appropriate error status
if [ $newmanExitCode -eq 0 ]; then
  echo "All tests passed successfully."
  exit 0  # Jenkins job will succeed since both tests passed
else
  echo "Tests failed. Please check the test results for more details."
  exit 1  # Jenkins job will fail since at least one test failed
fi
cd "$workingdir"

