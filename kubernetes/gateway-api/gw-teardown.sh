#!/usr/bin/env bash
# Release the Gateway API load balancers (AWS ELBs) that Terraform does not manage.
# Delete the Gateways + EnvoyProxy LB Services directly so the cloud controller removes the
# ELBs; do NOT uninstall the Envoy Gateway controller first, or the orphaned ELB's ENIs stall
# terraform destroy ~20 min. Then wait until every cluster-owned ELB is actually gone.
# Usage: gw-teardown.sh <kube-context> <region> <cluster-name>
set +e
KCTX="$1"; REGION="$2"; CLUSTER="$3"
echo "Releasing Gateway API load balancers for cluster $CLUSTER"
kubectl --context="$KCTX" delete gateway --all --all-namespaces --ignore-not-found --timeout=180s || echo "No Gateways to delete."
kubectl --context="$KCTX" delete svc -n envoy-gateway-system -l gateway.envoyproxy.io/owning-gateway-namespace --ignore-not-found || true
gone=0
for i in $(seq 1 40); do
  out=$(aws elb describe-load-balancers --region "$REGION" --query "LoadBalancerDescriptions[].LoadBalancerName" --output text 2>/dev/null)
  rc=$?
  LEFT=""
  if [ $rc -eq 0 ]; then
    for lb in $out; do
      aws elb describe-tags --region "$REGION" --load-balancer-names "$lb" --query "TagDescriptions[].Tags[?Key=='kubernetes.io/cluster/$CLUSTER'].Value" --output text 2>/dev/null | grep -q owned && LEFT="$LEFT $lb"
    done
    if [ -z "$LEFT" ]; then gone=$((gone+1)); [ $gone -ge 2 ] && { echo "Cluster ELBs released."; break; }; else gone=0; fi
  else
    gone=0
  fi
  echo "Waiting for cluster ELBs to delete:${LEFT:- (rechecking)}"; sleep 15
done
