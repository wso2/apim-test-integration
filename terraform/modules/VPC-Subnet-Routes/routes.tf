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

resource "aws_route" "route" {
  count                     = length(var.routes)
  route_table_id            = var.route_table_id
  destination_cidr_block    = var.routes[count.index].cidr_block
  carrier_gateway_id        = var.routes[count.index].ep_type == "carrier_gateway_id" ? var.routes[count.index].ep_id : null
  core_network_arn          = var.routes[count.index].ep_type == "core_network_arn" ? var.routes[count.index].ep_id : null
  egress_only_gateway_id    = var.routes[count.index].ep_type == "egress_only_gateway_id" ? var.routes[count.index].egress_only_gateway_id : null
  gateway_id                = var.routes[count.index].ep_type == "gateway_id" ? var.routes[count.index].ep_id : null
  local_gateway_id          = var.routes[count.index].ep_type == "local_gateway_id" ? var.routes[count.index].ep_id : null
  nat_gateway_id            = var.routes[count.index].ep_type == "nat_gateway_id" ? var.routes[count.index].ep_id : null
  network_interface_id      = var.routes[count.index].ep_type == "network_interface_id" ? var.routes[count.index].ep_id : null
  transit_gateway_id        = var.routes[count.index].ep_type == "transit_gateway_id" ? var.routes[count.index].ep_id : null
  vpc_endpoint_id           = var.routes[count.index].ep_type == "vpc_endpoint_id" ? var.routes[count.index].ep_id : null
  vpc_peering_connection_id = var.routes[count.index].ep_type == "vpc_peering_connection_id" ? var.routes[count.index].ep_id : null
}
