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

locals {
  eks_container_insights_metrics_namespace = "ContainerInsights"
  elasticache_metrics_namespace            = "AWS/ElastiCache"

  warning_alert_usage_suffix  = "warning"
  critical_alert_usage_suffix = "critical"

  node_cpu_utilization_metric_name         = "node_cpu_utilization"
  node_memory_utilization_metric_name      = "node_memory_utilization"
  container_cpu_utilization_metric_name    = "container_cpu_utilization"
  container_memory_utilization_metric_name = "container_memory_utilization"
  container_restarts_metric_name           = "pod_number_of_container_restarts"

  node_cpu_utilization_metric_name_usage         = "node-cpu-usage"
  node_memory_utilization_metric_name_usage      = "node-memory-usage"
  container_cpu_utilization_metric_name_usage    = "container-cpu-usage"
  container_memory_utilization_metric_name_usage = "container-memory-usage"
  container_restarts_metric_name_usage           = "container_number_of_restarts"

  cloud_watch_average_statistic_string     = "Average"
  cloud_watch_sum_statistic_string         = "Sum"
  cloud_watch_gte_metrics_threshold_string = "GreaterThanOrEqualToThreshold"
}
