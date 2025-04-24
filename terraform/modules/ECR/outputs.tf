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

output "ecr_admin_iam_policy_arn" {
  value      = aws_iam_policy.ecr_admin_iam_policy.arn
  depends_on = [aws_iam_policy.ecr_admin_iam_policy]
}
output "ecr_pull_only_iam_policy_arn" {
  value      = aws_iam_policy.ecr_pull_only_iam_policy.arn
  depends_on = [aws_iam_policy.ecr_pull_only_iam_policy]
}
output "ecr_id" {
  value      = aws_ecr_repository.ecr_repository.id
  depends_on = [aws_ecr_repository.ecr_repository]
}
output "ecr_arn" {
  value      = aws_ecr_repository.ecr_repository.arn
  depends_on = [aws_ecr_repository.ecr_repository]
}

output "ecr_url" {
  value      = aws_ecr_repository.ecr_repository.repository_url
  depends_on = [aws_ecr_repository.ecr_repository]
}
