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

resource "aws_subnet" "eks_subnet" {
  count = length(var.subnet_details)

  vpc_id            = var.eks_vpc_id
  cidr_block        = var.subnet_details[count.index].cidr_block
  availability_zone = var.subnet_details[count.index].availability_zone


  tags = merge(var.tags, {
    Name = join("-", [var.project, var.application, var.environment, var.subnet_details[count.index].availability_zone, "eks-snet"]),
  })
}

resource "aws_route_table" "route_table" {
  count  = length(var.subnet_details)
  vpc_id = var.eks_vpc_id
  tags   = local.rt_tags

  dynamic "route" {
    for_each = var.subnet_details[count.index].custom_routes
    content {
      cidr_block                = route.value.cidr_block
      carrier_gateway_id        = route.value.ep_type == "carrier_gateway_id" ? route.value.ep_id : null
      core_network_arn          = route.value.ep_type == "core_network_arn" ? route.value.ep_id : null
      egress_only_gateway_id    = route.value.ep_type == "egress_only_gateway_id" ? route.value.egress_only_gateway_id : null
      gateway_id                = route.value.ep_type == "gateway_id" ? route.value.ep_id : null
      local_gateway_id          = route.value.ep_type == "local_gateway_id" ? route.value.ep_id : null
      nat_gateway_id            = route.value.ep_type == "nat_gateway_id" ? route.value.ep_id : null
      network_interface_id      = route.value.ep_type == "network_interface_id" ? route.value.ep_id : null
      transit_gateway_id        = route.value.ep_type == "transit_gateway_id" ? route.value.ep_id : null
      vpc_endpoint_id           = route.value.ep_type == "vpc_endpoint_id" ? route.value.ep_id : null
      vpc_peering_connection_id = route.value.ep_type == "vpc_peering_connection_id" ? route.value.ep_id : null
    }
  }
}

resource "aws_route_table_association" "route_table_association" {
  count = length(aws_subnet.eks_subnet[*].id)

  subnet_id      = aws_subnet.eks_subnet[count.index].id
  route_table_id = aws_route_table.route_table[count.index].id

  depends_on = [
    aws_route_table.route_table,
    aws_subnet.eks_subnet
  ]
}
