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

resource "aws_internet_gateway" "gw" {
  tags = local.ig_tags
}

resource "aws_internet_gateway_attachment" "gw_vpc_attachment" {
  count               = length(var.vpc_ids)
  internet_gateway_id = aws_internet_gateway.gw.id
  vpc_id              = var.vpc_ids[count.index]

  depends_on = [
    aws_internet_gateway.gw
  ]
}
