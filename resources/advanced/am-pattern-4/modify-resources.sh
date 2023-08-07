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
#sed -i '/volumes:/a \      - name: wso2am-conf-entrypoint\n        configMap:\n          name: {{ template "am-pattern-4.resource.prefix" . }}-am-gateway-entrypoint\n          defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml
#sed -i '/volumeMounts:/a \        - name: wso2am-conf-entrypoint\n          mountPath: /home/wso2carbon/docker-entrypoint.sh\n          subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml

# add volume entry to Traffic manager deployment
#sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-1/wso2am-pattern-4-am-trafficmanager-deployment.yaml
#sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-2/wso2am-pattern-4-am-trafficmanager-deployment.yaml


# add volume entry to cp deployment
#sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-cp-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint\n          configMap:\n            name: {{ template "am-pattern-4.resource.prefix" . }}-am-cp-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml

# add environment variable to get UAT or staging pack
#sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-1/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/control-plane/instance-2/wso2am-pattern-4-am-control-plane-deployment.yaml
#sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-1/wso2am-pattern-4-am-trafficmanager-deployment.yaml
#sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/instance-2/wso2am-pattern-4-am-trafficmanager-deployment.yaml
#sed -i '/env:/a \        - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n          value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-4/templates/am/gateway/wso2am-pattern-4-am-gateway-deployment.yaml

# add u2 update logic to tm
#sed -i '/^[[:blank:]]*set -e/a\
#    # Update product\n\
#    echo "========================================== update product =========================================================="\n\
#    echo "Updating apim to $WSO2_UPDATES_UPDATE_LEVEL_STATE pack ............."\n\
#    cd ${WSO2_SERVER_HOME}/bin/\n\
#    ./wso2update_linux --backup /home/wso2carbon/ --username {{ .Values.wso2.subscription.username }} --password {{ .Values.wso2.subscription.password }}\n\
#    echo "===================================================================================================================="\n\
#' $k8s_repo_dir/advanced/am-pattern-4/templates/am/traffic-manager/wso2am-pattern-4-am-trafficmanager-conf-entrypoint.yaml

