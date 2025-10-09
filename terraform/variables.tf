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

# Common Network resources
variable "vpc_cidr_block" {
  type        = string
  description = "CIDR range for VPC"
}

variable "management_subnet_az_cidr" {
  type        = string
  description = "CIDR range for subnet that holds the Transit Gateway attachment in AZ1"
}

# Dev EKS 1
variable "eks_availability_zone_1_subnet_cidr_block" {
  type        = string
  description = "CIDR range for subnet that holds the First EKS cluster in AZ1"
}

variable "eks_availability_zone_2_subnet_cidr_block" {
  type        = string
  description = "CIDR range for subnet that holds the First EKS cluster in AZ2"
}

variable "eks_default_nodepool_desired_size" {
  type        = number
  description = "Desired number of nodes in the default node pool for the First EKS Cluster"
}

variable "eks_default_nodepool_max_size" {
  type        = number
  description = "Maximum number of nodes in the default node pool for the First EKS Cluster"
}

variable "eks_default_nodepool_min_size" {
  type        = number
  description = "Minimum number of nodes in the default node pool for the First EKS Cluster"
}

variable "eks_default_nodepool_max_unavailable" {
  type        = number
  description = "Maximum number of nodes that can be unavailable in the default node pool for the First EKS Cluster"
}

variable "eks_instance_types" {}

variable "eks_service_ipv4_cidr" {
  type        = string
  description = "CIDR range for EKS K8S services"
}

variable "kubernetes_version" {
  type        = string
  description = "Kubernetes version to be used in EKS clusters"
}

variable "az_dmz_subnet_cidr_block" {
  type        = string
  description = "CIDR range for subnet that holds Firewalls and Public Load Balancers in AZ"
}

variable "eks_external_lb_az1_subnet_cidr" {
  type        = string
  description = "CIDR range for subnet that holds the Internal Load Balancers in AZ1"
}

variable "eks_external_lb_az2_subnet_cidr" {
  type        = string
  description = "CIDR range for subnet that holds the Internal Load Balancers in AZ2"
}

# Database
variable "db_engine_mode" {
  type        = string
  description = "Database engine mode to be used"
}

variable "db_engine_options" {
  type = list(object({
    engine  = string
    version = string
    port    = number
  }))
  description = "List of database engine and version combinations available for selection"
  default = [
    {
      engine  = "aurora-mysql"
      version = "8.0.mysql_aurora.3.02.0"
      port    = 3306
    }
  ]
}

variable "db_instance_size" {
  type        = string
  description = "Database instance size to be used"
}

variable "db_primary_db_name" {
  type        = string
  description = "Primary Database name to be used in MySQL DB"
}

variable "db_master_username" {
  type        = string
  description = "Master username to be used in MySQL DB"
}

variable "db_access_security_group_rules" {
  description = "List of rules to allow/deny access to the Database"
}

variable "db_az1_subnet_cidr_block" {
  type        = string
  description = "CIDR range for subnet that holds the Database in AZ1"
}

variable "db_az2_subnet_cidr_block" {
  type        = string
  description = "CIDR range for subnet that holds the Database in AZ2"
}

variable "db_password" {
  type        = string
  description = "Password for the Database"
  sensitive   = true
}

variable "db_backup_retention_period" {
  type        = number
  description = "Backup retention period for the Database"
}
# Secret
variable "enable_secret" {
  description = "Enable secrets to store passwords"
  type        = bool
  default     = true
}

variable "secret_string" {
  type        = string
  description = "String value for string"
}

variable "secret_name" {
  type        = string
  description = "Secret name for string"
}

variable "secret_recovery_window_in_days" {
  type        = number
  description = "Recovery window of the secret"
}

# Management Variables
variable "project" {
  type        = string
  description = "Name of the project. Used for naming"
}

variable "environment_name" {
  type        = string
  description = "Name used to identify Resources of the development resources"
}

variable "client_name" {
  type        = string
  description = "Name of the Client. Used to separate client deployments"
}

variable "region" {
  type        = string
  description = "Deployment region"
}

variable "default_tags" {
  type        = map(string)
  description = "Default tags to be applied to all resources"
}
