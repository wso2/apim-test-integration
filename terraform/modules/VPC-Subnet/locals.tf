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

locals {
  name_prefix = var.availability_zone == null ? join("-", [var.project, var.application, var.environment, var.region]) : join("-", [var.project, var.application, var.environment, var.region, var.availability_zone])
  rt_name     = join("-", [local.name_prefix, "snet-rt"])
  subnet_name = join("-", [local.name_prefix, "snet"])
  rt_tags     = merge(var.tags, { Name : local.rt_name })
  subnet_tags = merge(var.tags, { Name : local.subnet_name })
}
