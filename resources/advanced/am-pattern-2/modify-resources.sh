#!/bin/bash

k8s_repo_dir=$1
reldir=`dirname $0`
echo "========= Running resource modifications ==================="
echo "= current dir :" $reldir
ls $reldir
## Remove one pub-devportal-tm node
rm -rf $k8s_repo_dir/advanced/am-pattern-2/templates/am/pub-devportal-tm/instance-2
## Remove init container from gateway deployment which checks for second pub-devportal-tm node
sed -i '/init-apim-2/,+2 d' $k8s_repo_dir/advanced/am-pattern-2/templates/am/gateway/wso2am-pattern-2-am-gateway-deployment.yaml

## copy all the resources to the k8s repo

echo "Copy content from $reldir to $k8s_repo_dir/advanced/am-pattern-2/"
cp -r $reldir/* $k8s_repo_dir/advanced/am-pattern-2/

# add volume entry to gateway deployment
sed -i '/volumes:/a \      - name: wso2am-conf-entrypoint\n        configMap:\n          name: {{ template "am-pattern-2.resource.prefix" . }}-am-gateway-entrypoint\n          defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-2/templates/am/gateway/wso2am-pattern-2-am-gateway-deployment.yaml
sed -i '/volumeMounts:/a \        - name: wso2am-conf-entrypoint\n          mountPath: /home/wso2carbon/docker-entrypoint.sh\n          subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-2/templates/am/gateway/wso2am-pattern-2-am-gateway-deployment.yaml

# add volume entry to keymanager deployment
sed -i '/volumes:/a \      - name: wso2am-conf-entrypoint\n        configMap:\n          name: {{ template "am-pattern-2.resource.prefix" . }}-am-km-entrypoint\n          defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-2/templates/am/km/wso2am-pattern-2-am-km-statefulset.yaml
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-2/templates/am/km/wso2am-pattern-2-am-km-statefulset.yaml
sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-2/templates/am/km/wso2am-pattern-2-am-km-statefulset.yaml

# add volume entry to km-tm-portal deployment
sed -i '/volumes:/a \        - name: wso2am-conf-entrypoint\n          configMap:\n            name: {{ template "am-pattern-2.resource.prefix" . }}-am-pubdevtm-entrypoint\n            defaultMode: 0407' $k8s_repo_dir/advanced/am-pattern-2/templates/am/pub-devportal-tm/instance-1/wso2am-pattern-2-am-deployment.yaml
sed -i '/volumeMounts:/a \            - name: wso2am-conf-entrypoint\n              mountPath: /home/wso2carbon/docker-entrypoint.sh\n              subPath: docker-entrypoint.sh' $k8s_repo_dir/advanced/am-pattern-2/templates/am/pub-devportal-tm/instance-1/wso2am-pattern-2-am-deployment.yaml
sed -i '/^ *initContainers:/,/^ *containers:/ { /^ *- name: wso2am-conf-entrypoint/,/^ *subPath: docker-entrypoint.sh/ d; }' $k8s_repo_dir/advanced/am-pattern-2/templates/am/pub-devportal-tm/instance-1/wso2am-pattern-2-am-deployment.yaml

# add environment variable to get UAT or staging pack
sed -i '/env:/a \            - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n              value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-2/templates/am/pub-devportal-tm/instance-1/wso2am-pattern-2-am-deployment.yaml
sed -i '/env:/a \          - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n            value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-2/templates/am/km/wso2am-pattern-2-am-km-statefulset.yaml
sed -i '/env:/a \        - name: WSO2_UPDATES_UPDATE_LEVEL_STATE\n          value: {{ .Values.wso2.subscription.updateLevelState }}' $k8s_repo_dir/advanced/am-pattern-2/templates/am/gateway/wso2am-pattern-2-am-gateway-deployment.yaml

