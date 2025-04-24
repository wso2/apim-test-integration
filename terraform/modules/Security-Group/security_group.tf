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

resource "aws_security_group" "security_group" {
  name        = join("-", [var.project, var.application, var.environment, var.region, "sg"])
  description = var.description
  vpc_id      = var.vpc_id

  tags = local.sg_tags
}

resource "aws_security_group_rule" "security_group_rule" {
  count = length(var.rules)

  security_group_id = aws_security_group.security_group.id
  type              = var.rules[count.index].direction
  from_port         = var.rules[count.index].from_port
  to_port           = var.rules[count.index].to_port
  protocol          = var.rules[count.index].protocol
  cidr_blocks       = var.rules[count.index].cidr_blocks

  depends_on = [
    aws_security_group.security_group
  ]
}
