#!/bin/bash

## Helper script to deploy apim in a k8s cluster. Pre-req: kubectl needs to be configured or extract

reldir=`dirname $0`
tests_dir=$(pwd)

path_to_helm_folder=advanced/am-pattern-4

rm -rf scripts
echo "=====  clone repo ========="
mkdir -p scripts/kubernetes


git clone -b 4.0.x https://github.com/wso2/kubernetes-apim.git scripts/kubernetes

k8s_repo_dir=scripts/kubernetes

echo "===== modify resources ====="
sh resources/$path_to_helm_folder/modify-resources.sh $k8s_repo_dir 

# for GKE
gcloud container clusters get-credentials cluster-1 --zone us-central1-c

# EKS
#aws eks update-kubeconfig --region us-east-1 --name testgrid-eks-clus

kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin \
  --user $(gcloud config get-value account)


kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
# Wait for nginx to come alive.
echo "===== wait for nginx ========="
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=15s 

helm delete wso2am --namespace wso2
kubectl get pods -n wso2 -o name | xargs kubectl delete --force --grace-period=0 -n wso2


#TESTING or VERIFYING
updateLevelState='TESTING'
WUM_USER=''
WUM_PWD=''
echo "=====  deploy apim ========="
helm install wso2am $k8s_repo_dir/$path_to_helm_folder --version 4.2.0-1 --namespace wso2 --dependency-update --create-namespace \
    --set wso2.subscription.username=$WUM_USER \
    --set wso2.subscription.password=$WUM_PWD \
    --set wso2.subscription.updateLevelState=$updateLevelState \
    --set wso2.deployment.am.gateway.replicas=1 \
    --set wso2.deployment.mi.replicas=0 \
    --set wso2.deployment.am.dockerRegistry=chamilaadhi \
    --set wso2.deployment.am.imageName=wso2am \
    --set wso2.deployment.am.imageTag=4.0.0.218 \
    --set wso2.deployment.am.trafficmanager.livenessProbe.initialDelaySeconds=180 \
    --set wso2.deployment.am.trafficmanager.readinessProbe.initialDelaySeconds=180 \
    --set wso2.deployment.am.cp.startupProbe.initialDelaySeconds=200 \
    --set wso2.deployment.am.cp.readinessProbe.initialDelaySeconds=200 \
    --set wso2.deployment.am.startupProbe.initialDelaySeconds=180 \
    --set wso2.deployment.am.startupProbe.periodSeconds=10 \
    --set wso2.deployment.am.readinessProbe.initialDelaySeconds=180 \
    --set wso2.deployment.am.imagePullPolicy=IfNotPresent 

kubectl get ing -n wso2
