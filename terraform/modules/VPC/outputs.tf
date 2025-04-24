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

output "vpc_cidr_block" {
  value      = aws_vpc.vpc.cidr_block
  depends_on = [aws_vpc.vpc]
}
output "vpc_id" {
  value      = aws_vpc.vpc.id
  depends_on = [aws_vpc.vpc]
}
output "vpc_route_table_id" {
  value      = aws_vpc.vpc.default_route_table_id
  depends_on = [aws_vpc.vpc]
}
