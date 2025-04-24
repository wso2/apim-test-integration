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

resource "aws_db_parameter_group" "mysql-pg" {
  name   = "${var.project}-${var.environment_name}-rds-pg"
  family = "mysql5.7"

  parameter {
    name  = "max_connections"
    value = "540"
  }

  parameter {
    name  = "require_secure_transport"
    value = "0"
    }
}

# resource "aws_rds_cluster_parameter_group" "mysql-cluster-pg" {
#   name        = "rds-cluster-pg"
#   family      = "aurora-mysql5.7"
#   description = "RDS default cluster parameter group"

#   parameter {
#     name  = "max_connections"
#     value = "540"
#   }
# }

# module "aurora_rds_cluster" {
#   source             = "./modules/RDS-Aurora"
#   for_each           = { for opt in var.db_engine_options : "${opt.engine}-${opt.version}" => opt }
#   project            = var.project
#   environment        = var.environment_name
#   region             = var.region
#   application        = "${var.client_name}-${each.value.engine}"
#   database_port      = each.value.port 
#   availability_zones = sort(slice(data.aws_availability_zones.available.names, 0, 2))
#   cluster_instances = {
#     "1" : {
#       "name" : "1"
#       "instance_class" : var.db_instance_size
#     }
#   }
#   database_name      = var.db_primary_db_name
#   master_username    = var.db_master_username
#   master_password    = var.db_password
#   engine             = each.value.engine
#   engine_version     = each.value.version
#   engine_mode        = var.db_engine_mode
#   db_subnet_group_name    = module.db_subnet_group.subnet_group_name
#   backup_retention_period = var.db_backup_retention_period
#   vpc_security_group_ids  = [module.db_security_group.security_group_id]
#   skip_final_snapshot     = true
#   publicly_accessible = true
#   db_instance_parameter_group_name = each.value.engine == "aurora-mysql" ? aws_db_parameter_group.mysql-pg.name : null
#   db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.mysql-cluster-pg.name
# }

module "aurora_rds_cluster" {
  for_each           = { for opt in var.db_engine_options : "${opt.engine}-${opt.version}" => opt }
  source             = "./modules/RDS"
  project            = var.project
  environment        = var.environment_name
  region             = var.region
  application        = each.value.engine
  database_port      = each.value.port
  availability_zones = sort(slice(data.aws_availability_zones.available.names, 0, 2))
  database_name      = var.db_primary_db_name
  master_username    = var.db_master_username
  master_password    = var.db_password
  engine             = each.value.engine
  engine_version     = each.value.version
  db_subnet_group_name    = module.db_subnet_group.subnet_group_name
  backup_retention_period = var.db_backup_retention_period
  vpc_security_group_ids  = [module.db_security_group.security_group_id]
  skip_final_snapshot     = true
  publicly_accessible     = true
  db_instance_parameter_group_name = each.value.engine == "mysql" ? aws_db_parameter_group.mysql-pg.name : null
}

module "db_subnet_group" {
  source      = "./modules/RDS-Subnet-Group"
  project     = var.project
  environment = var.environment_name
  region      = var.region
  application = var.client_name
  subnet_ids  = [module.public_subnet_1.subnet_id, module.public_subnet_2.subnet_id]
}

module "db_security_group" {
  source      = "./modules/Security-Group"
  project     = var.project
  environment = var.environment_name
  region      = var.region
  application = "${var.client_name}-db"
  description = "Allow Traffic to Database"
  vpc_id      = module.vpc.vpc_id
  rules       = var.db_access_security_group_rules
  tags        = var.default_tags
  depends_on = [
    module.vpc
  ]
}
