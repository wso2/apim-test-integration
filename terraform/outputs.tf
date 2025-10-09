# -------------------------------------------------------------------------------------
#
# Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
#
# This software is the property of WSO2 LLC. and its suppliers, if any.
# Dissemination of any information or reproduction of any material contained
# herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
# You may not alter or remove any copyright or other notice from copies of this content.
#
# --------------------------------------------------------------------------------------

output "database_writer_endpoints" {
  description = "Writer endpoints of all database instances."
  value       = { for k, v in module.aurora_rds_cluster : k => v.database_writer_endpoint }
}

output "ecr_wso2am_acp_url" {
  description = "ECR for WSO2 API Manager ACP"
  value       = module.ecr-wso2am-acp.ecr_url
}

output "ecr_wso2am_acp_tm_url" {
  description = "ECR for WSO2 API Manager TM"
  value       = module.ecr-wso2am-tm.ecr_url
}

output "ecr_wso2am_universal_gw_url" {
  description = "ECR for WSO2 API Manager Universal Gateway"
  value       = module.ecr-wso2am-universal-gw.ecr_url
}
