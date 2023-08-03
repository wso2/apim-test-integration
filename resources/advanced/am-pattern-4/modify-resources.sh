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
