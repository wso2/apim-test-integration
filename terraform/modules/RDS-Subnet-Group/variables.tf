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
  description = "AWS Code of the region"
}
variable "application" {
  type        = string
  description = "Purpose of the DB Subnet group"
}
variable "subnet_ids" {
  type        = list(string)
  description = "Subnet IDs"
}
variable "tags" {
  type        = map(string)
  description = "Tags for the Resource"
  default     = {}
}
