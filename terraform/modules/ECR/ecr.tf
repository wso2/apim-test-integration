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

resource "aws_ecr_repository" "ecr_repository" {
  name = join("-", [var.project, var.application])
  force_delete = true
  tags = var.tags
}

resource "aws_iam_policy" "ecr_admin_iam_policy" {
  name = join("-", [var.project, var.application, "ecr-admin-iam-policy"])

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ],
        Effect   = "Allow",
        Resource = "${aws_ecr_repository.ecr_repository.arn}"
      }
    ]
  })
  depends_on = [
    aws_ecr_repository.ecr_repository
  ]
  tags = var.tags
}

resource "aws_iam_policy" "ecr_pull_only_iam_policy" {
  name = join("-", [var.project, var.application, "ecr-pull-only-iam-policy"])

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ],
        Effect   = "Allow",
        Resource = "${aws_ecr_repository.ecr_repository.arn}"
      }
    ]
  })
  tags = var.tags

  depends_on = [
    aws_ecr_repository.ecr_repository
  ]
}
