#!/bin/bash

## Helper script to deploy apim in a k8s cluster. Pre-req: kubectl needs to be configured or extract

reldir=`dirname $0`
tests_dir=$(pwd)

path_to_helm_folder=advanced/am-pattern-2

rm -rf scripts
echo "=====  clone repo ========="
mkdir -p scripts/kubernetes


git clone -b 3.2.x-prof https://github.com/chamilaadhi/kubernetes-apim.git scripts/kubernetes

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

helm delete wso2am --namespace wso2
kubectl get pods -n wso2 -o name | xargs kubectl delete --force --grace-period=0 -n wso2


#TESTING or VERIFYING
updateLevelState='TESTING'
WUM_USER=''
WUM_PWD=''
echo "=====  deploy apim ========="
helm install wso2am $k8s_repo_dir/$path_to_helm_folder --version 3.2.0-5 --namespace wso2 --dependency-update --create-namespace \
    --set wso2.subscription.username=$WUM_USER \
    --set wso2.subscription.password=$WUM_PWD \
    --set wso2.subscription.updateLevelState=$updateLevelState \
    --set wso2.deployment.dependencies.nfsServerProvisioner=true \
    --set wso2.deployment.dependencies.mysql=true \
    --set wso2.deployment.am.gateway.replicas=1 \
    --set wso2.deployment.am.km.replicas=1 \
    --set wso2.deployment.analytics.dashboard.replicas=0 \
    --set wso2.deployment.analytics.worker.replicas=1 \
    --set wso2.deployment.am.dockerRegistry=chamilaadhi \
    --set wso2.deployment.am.imageName=wso2am \
    --set wso2.deployment.am.imageTag=3.2.0.288 \
    --set wso2.deployment.am.imagePullPolicy=IfNotPresent \
    --set wso2.deployment.analytics.worker.ingress.hostname='worker.analytics.am.wso2.com' \
    --set wso2.deployment.analytics.worker.ingress.annotations.'kubernetes\.io/ingress\.class'="nginx" \
    --set wso2.deployment.analytics.worker.ingress.annotations.'nginx\.ingress\.kubernetes\.io/backend-protocol'="HTTPS" \
    --set wso2.deployment.analytics.worker.dockerRegistry=chamilaadhi \
    --set wso2.deployment.analytics.worker.imageName=wso2am-analytics-worker \
    --set wso2.deployment.analytics.worker.imageTag=3.2.0.66 \
    --set wso2.deployment.analytics.worker.imagePullPolicy=IfNotPresent \
    --set wso2.deployment.am.db.hostname="wso2am-mysql-db-service" \
    --set wso2.deployment.am.db.port="3306" \
    --set wso2.deployment.am.db.type="mysql" \
    --set wso2.deployment.am.db.driver="com.mysql.cj.jdbc.Driver" \
    --set wso2.deployment.am.db.driver_url="https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.29/mysql-connector-java-8.0.29.jar" \
    --set wso2.deployment.am.db.apim.username="wso2carbon" \
    --set wso2.deployment.am.db.apim.password="wso2carbon" \
    --set wso2.deployment.am.db.apim.url="jdbc:mysql://wso2am-mysql-db-service:3306/WSO2AM_DB?useSSL=false&amp;autoReconnect=true&amp;requireSSL=false&amp;verifyServerCertificate=false&amp;allowPublicKeyRetrieval=true" \
    --set wso2.deployment.am.db.apim_shared.username="wso2carbon" \
    --set wso2.deployment.am.db.apim_shared.password="wso2carbon" \
    --set wso2.deployment.am.db.apim_shared.url="jdbc:mysql://wso2am-mysql-db-service:3306/WSO2AM_SHARED_DB?useSSL=false&amp;autoReconnect=true&amp;requireSSL=false&amp;verifyServerCertificate=false&amp;allowPublicKeyRetrieval=true" \
    --set wso2.deployment.analytics.db.hostname="wso2am-mysql-db-service" \
    --set wso2.deployment.analytics.db.port="3306" \
    --set wso2.deployment.analytics.db.driver="org.h2.Driver" \
    --set wso2.deployment.analytics.db.driver_url="https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.29/mysql-connector-java-8.0.29.jar" \
    --set wso2.deployment.analytics.db.connection_test_query="SELECT 1" \
    --set wso2.deployment.analytics.db.permission_db.username="wso2carbon" \
    --set wso2.deployment.analytics.db.permission_db.password="wso2carbon" \
    --set wso2.deployment.analytics.db.permission_db.url='jdbc:h2:\${sys:carbon.home}/wso2/${sys:wso2.runtime}/database/PERMISSION_DB;IFEXISTS=TRUE;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000;MVCC=TRUE' \
    --set wso2.deployment.analytics.db.analytics_db.username="wso2carbon" \
    --set wso2.deployment.analytics.db.analytics_db.password="wso2carbon" \
    --set wso2.deployment.analytics.db.analytics_db.url='jdbc:h2:\${sys:carbon.home}/wso2/worker/database/APIM_ANALYTICS_DB;AUTO_SERVER=TRUE' \
    --set wso2.deployment.analytics.db.cluster_db.username="wso2carbon" \
    --set wso2.deployment.analytics.db.cluster_db.password="wso2carbon" \
    --set wso2.deployment.analytics.db.cluster_db.url='jdbc:h2:\${sys:carbon.home}/wso2/${sys:wso2.runtime}/database/WSO2_CLUSTER_DB;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000;AUTO_SERVER=TRUE' \
    --set wso2.deployment.analytics.db.persistence_db.username="wso2carbon" \
    --set wso2.deployment.analytics.db.persistence_db.password="wso2carbon" \
    --set wso2.deployment.analytics.db.persistence_db.url='jdbc:h2:\${sys:carbon.home}/wso2/${sys:wso2.runtime}/database/PERSISTENCE_DB;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000;AUTO_SERVER=TRUE' \
    --set wso2.deployment.am.gateway.readinessProbe.initialDelaySeconds=360 \
    --set wso2.deployment.am.gateway.livenessProbe.initialDelaySeconds=360 \
    --set wso2.deployment.am.km.readinessProbe.initialDelaySeconds=360 \
    --set wso2.deployment.am.km.livenessProbe.initialDelaySeconds=360 \
    --set wso2.deployment.analytics.worker.readinessProbe.initialDelaySeconds=60 \
    --set wso2.deployment.analytics.worker.livenessProbe.initialDelaySeconds=60 

kubectl get ing -n wso2

