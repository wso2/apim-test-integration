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

# Ignore: AVD-AWS-0086 (https://avd.aquasec.com/misconfig/aws/rds/avd-aws-0086/)
# Ignore: AVD-AWS-0079 (https://avd.aquasec.com/misconfig/aws/rds/avd-aws-0079/)
# Ignore: AVD-AWS-0077 (https://avd.aquasec.com/misconfig/aws/rds/avd-aws-0077/)
# Reason: Delete protection has been configured as an optional parameter as this will depend on the usage of the RDS
# Reason: Variable KMS_KEY_ID is defined and can be used for explicit key encryption
# Reason: Variable backup_retention_period is defined and can be used for explicitlty setting backup retention
# trivy:ignore:AVD-AWS-0086
# trivy:ignore:AVD-AWS-0079
# trivy:ignore:AVD-AWS-0077

locals {
  db_instance_identifier = join("-", [var.project, var.application, var.environment, var.region, "rds"])
}

resource "aws_db_instance" "db_instance" {
  identifier = local.db_instance_identifier

  allocated_storage = 20
  storage_type      = "gp2"
  max_allocated_storage = 30

  engine         = var.engine
  engine_version = var.engine_version
  instance_class = "db.m5.large" 

  db_name                = var.database_name
  username               = var.master_username
  password               = var.master_password
  port                   = var.database_port

  parameter_group_name   = var.db_instance_parameter_group_name
  db_subnet_group_name   = var.db_subnet_group_name
  vpc_security_group_ids = var.vpc_security_group_ids

  availability_zone   = var.availability_zones[0] # Set only for single-AZ
  multi_az            = false        # Set true for multi-AZ

  backup_retention_period      = var.backup_retention_period

  skip_final_snapshot = var.skip_final_snapshot
  deletion_protection = var.deletion_protection

  storage_encrypted   = var.storage_encrypted
  kms_key_id          = var.storage_encrypted == true ? var.kms_key_id : null


  publicly_accessible         = var.publicly_accessible
  allow_major_version_upgrade = var.allow_major_version_upgrade
  auto_minor_version_upgrade  = false
  apply_immediately           = false

  iam_database_authentication_enabled = var.iam_database_authentication_enabled

  tags = var.tags
}
