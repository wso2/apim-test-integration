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

# Ignore: AVD-AWS-0178 (https://avd.aquasec.com/misconfig/aws/ec2/avd-aws-0178)
# Reason: For more granular control Flow logs are enabled at the subnet level via a separate module at the subnet level (Refer VPC-Flow-Log Module), instead of the VPC level.
# trivy:ignore:AVD-AWS-0178
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_support   = var.enable_dns_support
  enable_dns_hostnames = var.enable_dns_hostnames

  tags = local.vpc_tags
}
