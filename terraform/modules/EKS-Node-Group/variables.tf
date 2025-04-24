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

variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}
variable "node_group_name" {
  type        = string
  description = "Name of the Node group"
}
variable "subnet_ids" {
  type        = list(string)
  description = "List of subnets to deploy nodepools"
}
variable "tags" {
  type        = map(string)
  description = "Tags to be associated with the EKS"
  default     = {}
}
variable "min_size" {
  type        = number
  description = "Minimum number of nodes for node group"
}
variable "max_size" {
  type        = number
  description = "Maximum number of nodes for nodegroup"
}
variable "desired_size" {
  type        = number
  description = "Desired number of nodes for nodegroup"
}
variable "max_unavailable" {
  type        = number
  description = "Maximum amount of unavailable nodes"
}
variable "k8s_version" {
  type        = string
  description = "K8S version to be installed on the nodes"
}
variable "taints" {
  type = map(object({
    value  = string
    effect = string
  }))
  description = "Taints to be added on to the node group"
  default     = {}
}
variable "instance_types" {
  type        = list(string)
  description = "Instance types to be associated with the VM"
}
variable "node_disk_size" {
  type        = number
  description = "Disk size of the worker nodes"
  default     = 20
}
variable "kms_key_id" {
  type        = string
  description = "KMS key ID to be used for encrypting EBS volumes"
  default     = null
}
variable "enable_encryption_at_rest" {
  type        = bool
  description = "Enable encryption at rest for EBS volumes"
  default     = true
}
variable "imds_enabled" {
  type        = string
  description = "Flag to enable IMDS"
  default     = "required"
}
variable "labels" {
  type        = map(string)
  description = "Labels to be associated with the node group"
  default     = {}
}
