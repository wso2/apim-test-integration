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
  description = "Code of the region"
}
variable "application" {
  type        = string
  description = "Purpose of the Subnet"
}
variable "vpc_id" {
  type        = string
  description = "ID of the VPC which should contain this subnet"
}
variable "enable_dns64" {
  type        = bool
  description = "Flag to enable DNS 64 on the subnet"
  default     = false
}
variable "cidr_block" {
  type        = string
  description = "CIDR block for the subnet"
}
variable "tags" {
  type        = map(string)
  description = "Default tags for the Subnet resource"
  default     = {}
}
variable "availability_zone" {
  type        = string
  description = "Availability zones for the Subnet"
  default     = null
}
variable "auto_assign_public_ip" {
  type        = bool
  description = "Automatically Public IPs for Virtual Machines"
  default     = false
}
variable "custom_routes" {
  type = list(object({
    cidr_block = string
    ep_type    = string
    ep_id      = string
  }))
  description = "Rules to be associated with the EC2 Subnet if provided"
  default     = []
}
