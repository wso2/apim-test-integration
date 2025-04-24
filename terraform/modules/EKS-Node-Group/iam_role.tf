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

resource "aws_iam_role" "iam_role" {
  name = join("-", [var.eks_cluster_name, var.node_group_name, "eks-node-group-iam-role"])

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  tags = var.tags
}

# Required as per https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html
resource "aws_iam_role_policy_attachment" "amazon_eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

# Required as per https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html
resource "aws_iam_role_policy_attachment" "amazon_eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

# Required as per https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html
resource "aws_iam_role_policy_attachment" "amazon_ec2_container_registry_read_only" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

/* TODO:: Review and remove if not required
resource "aws_iam_role_policy_attachment" "amazon_cloud_watch_agent_policy" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

# Ignore: AVD-AWS-0057 (https://avd.aquasec.com/misconfig/aws/iam/avd-aws-0057/)
# Reason: This policy provides the necessary permissions for configuring the cluster autoscaler
# AWS Documentation: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended
# trivy:ignore:AVD-AWS-0057
resource "aws_iam_policy" "node_group_autoscaler_policy" {
  name = join("-", [var.eks_cluster_name, var.node_group_name, "eks-cluster-auto-scaler-policy"])
  policy = jsonencode({
    Statement = [{
      Action = [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeAutoScalingInstances",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeTags",
        "autoscaling:SetDesiredCapacity",
        "autoscaling:TerminateInstanceInAutoScalingGroup",
        "ec2:DescribeLaunchTemplateVersions",
        "ec2:DescribeInstanceTypes"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "eks_ca_iam_policy_attach" {
  role       = aws_iam_role.iam_role.name
  policy_arn = aws_iam_policy.node_group_autoscaler_policy.arn

  depends_on = [
    aws_iam_role.iam_role,
    aws_iam_policy.node_group_autoscaler_policy
  ]
}
*/

# Required for accessing ECR Cache registries
# Ignore: AVD-AWS-0057 (https://avd.aquasec.com/misconfig/aws/iam/avd-aws-0057/)
# Reason: This policy provides the necessary permissions to use pull through cache to the Node Group
# AWS Documentation: https://docs.aws.amazon.com/AmazonECR/latest/userguide/pull-through-cache.html
# trivy:ignore:AVD-AWS-0057
resource "aws_iam_policy" "amazon_ec2_cache_policy" {
  name = join("-", [var.eks_cluster_name, var.node_group_name, "eks-cluster-ecr-pull-cache-policy"])
  policy = jsonencode({
    Statement = [{
      Action = [
        "ecr:CreatePullThroughCacheRule",
        "ecr:BatchImportUpstreamImage",
        "ecr:CreateRepository"
      ]
      Effect   = "Allow"
      Resource = "*"
    }]
    Version = "2012-10-17"
  })
  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "amazon_ec2_cache_policy_attachment" {
  policy_arn = aws_iam_policy.amazon_ec2_cache_policy.arn
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}
