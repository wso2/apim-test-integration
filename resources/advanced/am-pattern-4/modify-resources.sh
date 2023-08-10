#!/bin/bash

k8s_repo_dir=$1
reldir=`dirname $0`
echo "========= Running resource modifications ==================="
echo "= current dir :" $reldir
ls $reldir

## copy all the resources to the k8s repo
echo "Copy content from $reldir to $k8s_repo_dir/advanced/am-pattern-4/"
cp -r $reldir/* $k8s_repo_dir/advanced/am-pattern-4/


sed -i '/type = "database_unique_id"/a    \\n    [oauth.endpoints]\n    oauth2_jwks_url="https://{{ template "am-pattern-4.resource.prefix" . }}-am-cp-service:${mgt.transport.https.port}/oauth2/jwks"' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-conf.yaml
sed -i '/type = "database_unique_id"/a    \\n    [oauth.endpoints]\n    oauth2_jwks_url="https://{{ template "am-pattern-4.resource.prefix" . }}-am-cp-service:${mgt.transport.https.port}/oauth2/jwks"' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-conf.yaml

sed -i '/paths:/a \      - path: /api/am/gateway/v2/\n        pathType: Prefix\n        backend:\n          service:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-gateway-service\n            port:\n              number: 9443' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-ingress.yaml


# add volume entry to gateway deployment
sed -i '/volumes:/a \      - name: wso2am-conf-entrypoint\n        configMap:\n          name: {{ template "am-pattern-4.resource.prefix" . }}-am-gateway-entrypoint\n          defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml
sed -i '/volumeMounts:/a \        - name: wso2am-conf-entrypoint\n          mountPath: /home/wso2carbon/docker-entrypoint.sh\n          subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml

# add volume entry to Traffic manager deployment
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint-tm\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-1/wso2am-pattern-4-am-trafficmanager-deployment.yaml
sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint-tm\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-trafficmanager-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-1/wso2am-pattern-4-am-trafficmanager-deployment.yaml
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint-tm\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-2/wso2am-pattern-4-am-trafficmanager-deployment.yaml
sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint-tm\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-trafficmanager-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-2/wso2am-pattern-4-am-trafficmanager-deployment.yaml


# add volume entry to cp deployment
sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-cp-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-cp-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml

# add environment variable to get UAT or staging pack
sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-1/wso2am-pattern-4-am-trafficmanager-deployment.yaml
sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-2/wso2am-pattern-4-am-trafficmanager-deployment.yaml
sed -i '/env:/a \        - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n          value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml

# Start CP 2 after CP 1 is started. This is to provent registry related concurreny issue when both nodes starts together.
sed -i "/initContainers:/a \        - name: init-cp-1\n          image: busybox:1.32\n          command: ['sh', '-c', 'echo -e \"Checking for the availability of control plane instance one deployment\"; while ! nc -z {{ template \"am-pattern-4.resource.prefix\" . }}-am-cp-1-service 9443; do sleep 1; printf \"-\"; done; echo -e\"  >> API Manager Control Plane instance one has started\";']" $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
