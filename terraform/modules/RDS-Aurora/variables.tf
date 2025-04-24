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

variable "allow_major_version_upgrade" {
  description = "Allow major version upgrade"
  type        = bool
  default     = true
}
variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}
variable "backtrack_window" {
  description = "Backtrack window"
  type        = number
  default     = 0
}
variable "backup_retention_period" {
  description = "Backup retention period"
  type        = number
  default     = 0
}
variable "master_username" {
  description = "Master username"
  type        = string
}
variable "master_password" {
  description = "Master password, If not provided Secret Manager will handle the password"
  type        = string
  sensitive   = true
  default     = null
}
variable "database_name" {
  description = "Database name"
  type        = string
}
variable "db_cluster_instance_class" {
  description = "DB cluster instance class"
  type        = string
  default     = null
}
variable "deletion_protection" {
  description = "Deletion protection"
  type        = bool
  default     = false
}
variable "db_subnet_group_name" {
  description = "DB subnet group name"
  type        = string
}
variable "db_cluster_parameter_group_name" {
  description = "DB cluster parameter group name"
  type        = string
  default     = null
}
variable "db_instance_parameter_group_name" {
  description = "DB instance parameter group name"
  type        = string
  default     = null
}
variable "enable_http_endpoint" {
  description = "Flag to Enable HTTP endpoint"
  type        = bool
  default     = false
}
variable "engine_mode" {
  description = "Engine mode to be used for the DB Cluster"
  type        = string
}
variable "engine" {
  description = "Engine to be used for the DB Cluster"
  type        = string
}
variable "engine_version" {
  description = "Engine version to be used for the DB Cluster"
  type        = string
}
variable "enabled_cloudwatch_log_exports" {
  description = "List of log types to export to cloudwatch"
  type        = list(string)
  default     = []
}
variable "iam_database_authentication_enabled" {
  description = "Flag to enable IAM database authentication"
  type        = bool
  default     = false
}
variable "network_type" {
  description = "Network type. Can be IPV4 or DUAL"
  type        = string
  default     = "IPV4"
}
variable "database_port" {
  description = "Database port"
  type        = number
  default     = 3306
}
variable "preferred_backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "07:00-09:00"
}
variable "preferred_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "sun:10:00-sun:14:00"
}
variable "global_cluster_identifier" {
  description = "Global cluster identifier"
  type        = string
  default     = null
}
variable "replication_source_identifier" {
  description = "Replication source identifier"
  type        = string
  default     = null
}
variable "enable_scaling_configuration" {
  description = "Flag to enable scaling configuration"
  type        = bool
  default     = false
}
variable "min_capacity" {
  description = "Minimum capacity for autoscaling"
  type        = number
  default     = null
}
variable "max_capacity" {
  description = "Maximum capacity for autoscaling"
  type        = number
  default     = null
}
variable "cluster_custom_iam_instance_profile" {
  description = "Custom IAM instance profile for all instances"
  type        = string
  default     = null
}
variable "cluster_common_monitoring_interval" {
  description = "Monitoring interval for all instances"
  type        = number
  default     = 0
}
variable "cluster_common_monitoring_role_arn" {
  description = "Monitoring role arn for all instances"
  type        = string
  default     = null
}
variable "cluster_common_performance_insights_enabled" {
  description = "Performance insights enabled for all instances"
  type        = bool
  default     = false
}
variable "publicly_accessible" {
  description = "Flag to make the DB publicly accessible"
  type        = bool
  default     = false
}
variable "cluster_instances" {
  description = "List of cluster instances"
  type = map(object({
    name                         = string
    custom_iam_instance_profile  = optional(string)
    db_parameter_group_name      = optional(string)
    instance_class               = optional(string)
    monitoring_interval          = optional(number, 0)
    monitoring_role_arn          = optional(string)
    performance_insights_enabled = optional(bool, false)
    preferred_backup_window      = optional(string)
    preferred_maintenance_window = optional(string)

  }))
}
variable "tags" {
  type        = map(string)
  description = "Tags for string"
  default     = {}
}

variable "project" {
  type        = string
  description = "Name of the project"
}
variable "environment" {
  type        = string
  description = "Name of the environment"
}
variable "region" {
  type        = string
  description = "Code of the region"
}
variable "application" {
  type        = string
  description = "Purpose of the EKS Cluster"
}
variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of security group ids"
}
variable "skip_final_snapshot" {
  type        = bool
  description = "Flag to skip final snapshot"
  default     = false
}
variable "storage_encrypted" {
  type        = bool
  description = "Flag to enable storage encryption"
  default     = true
}
variable "kms_key_id" {
  type        = string
  description = "KMS key id"
  default     = null
}
