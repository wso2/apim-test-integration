# -------------------------------------------------------------------------------------
#
# Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
#
# This software is the property of WSO2 LLC. and its suppliers, if any.
# Dissemination of any information or reproduction of any material contained
# herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
# You may not alter or remove any copyright or other notice from copies of this content.
#
# --------------------------------------------------------------------------------------

# Ignore: AVD-AWS-0038 (https://avd.aquasec.com/misconfig/aws/eks/avd-aws-0038/)
# Reason: Requirement to enable logs for EKS cluster will vary based on cluster purpose and requirements
# Therefore has not been enforced as a requirement
# Ignore: AVD-AWS-0039 (https://avd.aquasec.com/misconfig/aws/eks/avd-aws-0039/)
# Reason: Encrypting Secrets will depend on Cluster usage (usage of CSI driver etc) as such
# This has been configured as an optional parameter
# trivy:ignore:AVD-AWS-0038
# trivy:ignore:AVD-AWS-0039
resource "aws_eks_cluster" "eks_cluster" {
  name     = join("-", [var.project, var.application, var.environment, var.region, "eks"])
  role_arn = aws_iam_role.iam_role.arn

  version = var.kubernetes_version

  vpc_config {
    endpoint_private_access = var.endpoint_private_access
    endpoint_public_access  = var.endpoint_public_access
    public_access_cidrs     = var.public_access_cidrs
    subnet_ids              = aws_subnet.eks_subnet[*].id
  }

  dynamic "encryption_config" {
    for_each = var.secret_encryption_cmk != null ? [1] : []
    content {
      provider {
        key_arn = var.secret_encryption_cmk
      }
      resources = ["secrets"]
    }
  }

  kubernetes_network_config {
    service_ipv4_cidr = var.service_ipv4_cidr
  }

  enabled_cluster_log_types = var.enabled_cluster_log_types

  # Ensure that IAM Role permissions are created before and deleted after EKS Cluster handling.
  # Otherwise, EKS will not be able to properly delete EKS managed EC2 infrastructure such as Security Groups.
  depends_on = [
    aws_iam_role_policy_attachment.amazon_eks_cluster_policy,
    aws_iam_role_policy_attachment.amazon_eks_pc_resource_controller,
  ]
  tags = var.tags
}
