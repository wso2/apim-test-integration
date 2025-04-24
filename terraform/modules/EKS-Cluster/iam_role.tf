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
  name = join("-", [var.project, var.application, var.environment, var.region, "eks-iam-role"])

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "amazon_eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

# Optionally, enable Security Groups for Pods
# Reference: https://docs.aws.amazon.com/eks/latest/userguide/security-groups-for-pods.html
resource "aws_iam_role_policy_attachment" "amazon_eks_pc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.iam_role.name

  depends_on = [
    aws_iam_role.iam_role
  ]
}

resource "aws_iam_openid_connect_provider" "eks_ca_oidc_provider" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.tls.certificates[0].sha1_fingerprint]
  url             = data.aws_eks_cluster.eks_cluster.identity[0].oidc[0].issuer

  tags = var.tags

  depends_on = [
    data.tls_certificate.tls,
    data.aws_eks_cluster.eks_cluster
  ]
}

# IAM Role for IAM Cluster Autoscaler
resource "aws_iam_role" "cluster_autoscaler_role" {
  assume_role_policy = data.aws_iam_policy_document.cluster_autoscaler_sts_policy.json
  name               = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-autoscaler-iam-role"])

  depends_on = [
    data.aws_iam_policy_document.cluster_autoscaler_sts_policy
  ]
}

# Ignore: AVD-AWS-0057 (https://avd.aquasec.com/misconfig/aws/iam/avd-aws-0057/)
# Reason: This policy provides the necessary permissions for configuring the cluster autoscaler
# AWS Documentation: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md#full-cluster-autoscaler-features-policy-recommended
# trivy:ignore:AVD-AWS-0057
resource "aws_iam_policy" "cluster_autoscaler_policy" {
  name = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-autoscaler-iam-policy"])
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
}

resource "aws_iam_role_policy_attachment" "eks_ca_iam_policy_attach" {
  role       = aws_iam_role.cluster_autoscaler_role.name
  policy_arn = aws_iam_policy.cluster_autoscaler_policy.arn

  depends_on = [
    aws_iam_role.cluster_autoscaler_role,
    aws_iam_policy.cluster_autoscaler_policy
  ]
}

# IAM Role for IAM Cluster LoadBalancer
resource "aws_iam_role" "cluster_loadbalancer_role" {
  assume_role_policy = data.aws_iam_policy_document.cluster_lb_sts_policy.json
  name               = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-lb-iam-role"])

  depends_on = [
    data.aws_iam_policy_document.cluster_lb_sts_policy
  ]
}
# Ignore: AVD-AWS-0057 (https://avd.aquasec.com/misconfig/aws/iam/avd-aws-0057/)# This however is an AWS Recommended Policy as per https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json
# Reason: This policy provides the necessary permissions for the EKS cluster to create AWS Load Balancers
# AWS Documentation: https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
# trivy:ignore:AVD-AWS-0057
resource "aws_iam_policy" "cluster_loadbalancer_policy" {
  name = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-lb-iam-policy"])
  policy = jsonencode({
    Statement : [
      {
        Effect : "Allow",
        Action : [
          "iam:CreateServiceLinkedRole"
        ],
        Resource : "*",
        "Condition" : {
          "StringEquals" : {
            "iam:AWSServiceName" : "elasticloadbalancing.amazonaws.com"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:DescribeAccountAttributes",
          "ec2:DescribeAddresses",
          "ec2:DescribeAvailabilityZones",
          "ec2:DescribeInternetGateways",
          "ec2:DescribeVpcs",
          "ec2:DescribeVpcPeeringConnections",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeInstances",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DescribeTags",
          "ec2:GetCoipPoolUsage",
          "ec2:DescribeCoipPools",
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:DescribeLoadBalancerAttributes",
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DescribeListenerCertificates",
          "elasticloadbalancing:DescribeSSLPolicies",
          "elasticloadbalancing:DescribeRules",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DescribeTargetGroupAttributes",
          "elasticloadbalancing:DescribeTargetHealth",
          "elasticloadbalancing:DescribeTags"
        ],
        Resource : "*"
      },
      {
        Effect : "Allow",
        Action : [
          "cognito-idp:DescribeUserPoolClient",
          "acm:ListCertificates",
          "acm:DescribeCertificate",
          "iam:ListServerCertificates",
          "iam:GetServerCertificate",
          "waf-regional:GetWebACL",
          "waf-regional:GetWebACLForResource",
          "waf-regional:AssociateWebACL",
          "waf-regional:DisassociateWebACL",
          "wafv2:GetWebACL",
          "wafv2:GetWebACLForResource",
          "wafv2:AssociateWebACL",
          "wafv2:DisassociateWebACL",
          "shield:GetSubscriptionState",
          "shield:DescribeProtection",
          "shield:CreateProtection",
          "shield:DeleteProtection"
        ],
        Resource : "*"
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress"
        ],
        Resource : "*"
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:CreateSecurityGroup"
        ],
        Resource : "*"
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:CreateTags"
        ],
        Resource : "arn:aws:ec2:*:*:security-group/*",
        "Condition" : {
          "StringEquals" : {
            "ec2:CreateAction" : "CreateSecurityGroup"
          },
          "Null" : {
            "aws:RequestTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:CreateTags",
          "ec2:DeleteTags"
        ],
        Resource : "arn:aws:ec2:*:*:security-group/*",
        "Condition" : {
          "Null" : {
            "aws:RequestTag/elbv2.k8s.aws/cluster" : "true",
            "aws:ResourceTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "ec2:AuthorizeSecurityGroupIngress",
          "ec2:RevokeSecurityGroupIngress",
          "ec2:DeleteSecurityGroup"
        ],
        Resource : "*",
        "Condition" : {
          "Null" : {
            "aws:ResourceTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:CreateLoadBalancer",
          "elasticloadbalancing:CreateTargetGroup"
        ],
        Resource : "*",
        "Condition" : {
          "Null" : {
            "aws:RequestTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:CreateListener",
          "elasticloadbalancing:DeleteListener",
          "elasticloadbalancing:CreateRule",
          "elasticloadbalancing:DeleteRule"
        ],
        Resource : "*"
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:RemoveTags"
        ],
        Resource : [
          "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
        ],
        "Condition" : {
          "Null" : {
            "aws:RequestTag/elbv2.k8s.aws/cluster" : "true",
            "aws:ResourceTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:AddTags",
          "elasticloadbalancing:RemoveTags"
        ],
        Resource : [
          "arn:aws:elasticloadbalancing:*:*:listener/net/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener/app/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
          "arn:aws:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
        ]
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:ModifyLoadBalancerAttributes",
          "elasticloadbalancing:SetIpAddressType",
          "elasticloadbalancing:SetSecurityGroups",
          "elasticloadbalancing:SetSubnets",
          "elasticloadbalancing:DeleteLoadBalancer",
          "elasticloadbalancing:ModifyTargetGroup",
          "elasticloadbalancing:ModifyTargetGroupAttributes",
          "elasticloadbalancing:DeleteTargetGroup"
        ],
        Resource : "*",
        "Condition" : {
          "Null" : {
            "aws:ResourceTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:AddTags"
        ],
        "Resource" : [
          "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/net/*/*",
          "arn:aws:elasticloadbalancing:*:*:loadbalancer/app/*/*"
        ],
        "Condition" : {
          "StringEquals" : {
            "elasticloadbalancing:CreateAction" : [
              "CreateTargetGroup",
              "CreateLoadBalancer"
            ]
          },
          "Null" : {
            "aws:RequestTag/elbv2.k8s.aws/cluster" : "false"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "elasticloadbalancing:RegisterTargets",
          "elasticloadbalancing:DeregisterTargets"
        ],
        Resource : "arn:aws:elasticloadbalancing:*:*:targetgroup/*/*"
      },
      {
        Effect : "Allow",
        Action : [
          "elasticloadbalancing:SetWebAcl",
          "elasticloadbalancing:ModifyListener",
          "elasticloadbalancing:AddListenerCertificates",
          "elasticloadbalancing:RemoveListenerCertificates",
          "elasticloadbalancing:ModifyRule"
        ],
        Resource : "*"
      }
    ]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "cluster_loadbalancer_policy_attach" {
  role       = aws_iam_role.cluster_loadbalancer_role.name
  policy_arn = aws_iam_policy.cluster_loadbalancer_policy.arn

  depends_on = [
    aws_iam_role.cluster_loadbalancer_role,
    aws_iam_policy.cluster_loadbalancer_policy
  ]
}

# IAM Role for CloudWatch Agents
resource "aws_iam_role" "cluster_container_cloudwatch_streamer_role" {
  assume_role_policy = data.aws_iam_policy_document.cluster_container_cloudwatch_streamer_sts_policy.json
  name               = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-ccw-iam-role"])

  depends_on = [
    data.aws_iam_policy_document.cluster_container_cloudwatch_streamer_sts_policy
  ]
}

resource "aws_iam_role_policy_attachment" "cluster_container_cloudwatch_streamer_policy_attach" {
  role       = aws_iam_role.cluster_container_cloudwatch_streamer_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"

  depends_on = [
    aws_iam_role.cluster_container_cloudwatch_streamer_role
  ]
}

# IAM Role for EBS CSI Driver
resource "aws_iam_role" "cluster_ebs_csi_driver_role" {
  count              = var.enable_ebs_csi_driver ? 1 : 0
  assume_role_policy = data.aws_iam_policy_document.cluster_ebs_csi_driver_sts_policy.json
  name               = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-ebs-csi-driver-iam-role"])

  depends_on = [
    data.aws_iam_policy_document.cluster_ebs_csi_driver_sts_policy
  ]
}

resource "aws_iam_role_policy_attachment" "cluster_ebs_csi_driver_role_policy_attach" {
  count      = var.enable_ebs_csi_driver ? 1 : 0
  role       = aws_iam_role.cluster_ebs_csi_driver_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"

  depends_on = [
    aws_iam_role.cluster_ebs_csi_driver_role
  ]
}

# IAM Role for EBS CSI Driver
resource "aws_iam_role" "cluster_efs_csi_driver_role" {
  count              = var.enable_efs_csi_driver ? 1 : 0
  assume_role_policy = data.aws_iam_policy_document.cluster_efs_csi_driver_sts_policy.json
  name               = join("-", [var.project, var.application, var.environment, var.region, "eks-cluster-efs-csi-driver-iam-role"])

  depends_on = [
    data.aws_iam_policy_document.cluster_efs_csi_driver_sts_policy
  ]
}

resource "aws_iam_role_policy_attachment" "cluster_efs_csi_driver_role_policy_attach" {
  count      = var.enable_efs_csi_driver ? 1 : 0
  role       = aws_iam_role.cluster_ebs_csi_driver_role[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEFSCSIDriverPolicy"

  depends_on = [
    aws_iam_role.cluster_efs_csi_driver_role
  ]
}
