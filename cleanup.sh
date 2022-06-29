#!/bin/bash
workingdir=$(pwd)
reldir=`dirname $0`
cd $reldir

# Upload running pod's logs to S3.
kubectl get pods -l product=apim -n="${kubernetes_namespace}"  -o custom-columns=:metadata.name > podNames.txt
dateWithMinute=$(date +"%Y_%m_%d_%H_%M")
date=$(date +"%Y_%m_%d")
mkdir -p ../../output
cat podNames.txt | while read podName 
do
    if [[ "$podName" != "" ]];
    then 
        phase=$(kubectl get pods "$podName" -n="${kubernetes_namespace}" -o json | jq -r '.status | .phase')
        if [[ "$phase" == "Running" ]];
        then 
            kubectl logs "$podName" -n="${kubernetes_namespace}" > "../../output/$dateWithMinute-$podName.txt"
            aws s3 cp "../../output/$dateWithMinute-$podName.txt" "s3://apim-test-grid/profile-automation/logs/$date/"
            echo "Uploaded $dateWithMinute-$podName.txt to S3."
        else
            echo "$podName is not running. Its in $phase phase."
        fi
    fi
done


echo "Uninstalling APIM in cluster."
helm uninstall "${product_name}" -n="${kubernetes_namespace}" || true

echo "Delete fargate profile."
eksctl delete fargateprofile  --name "${product_name}-fargate-profile" --cluster "${EKS_CLUSTER_NAME}" --region ${EKS_CLUSTER_REGION}

cd "$workingdir"