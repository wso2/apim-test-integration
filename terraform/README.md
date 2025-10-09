# Terraform Configuration for WSO2 Products

This repository contains the Terraform scripts to provision AWS resources for WSO2 products.

## Prerequisites

Before you begin, ensure you have the following installed:
- Terraform >= 1.3.8
- AWS Provider ~> 5.0
- AWS CLI
- Proper AWS credentials configured

## Deployment
To deploy the AWS resources:

1. Initialize Terraform to download and configure the providers.

```sh
   terraform init
   ```

2. Review the Terraform execution plan to ensure the configurations are as expected.

```sh
   terraform plan
   ```

3. Apply the configuration to provision the AWS resources.

```sh
   terraform apply
   ```

Please ensure the secrets.tfvars file is kept secure and is not committed to your version control system.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_az_dmz_subnet_cidr_block"></a> [az\_dmz\_subnet\_cidr\_block](#input\_az\_dmz\_subnet\_cidr\_block) | CIDR range for subnet that holds Firewalls and Public Load Balancers in AZ | `string` | n/a | yes |
| <a name="input_client_name"></a> [client\_name](#input\_client\_name) | Name of the Client. Used to separate client deployments | `string` | n/a | yes |
| <a name="input_db_access_security_group_rules"></a> [db\_access\_security\_group\_rules](#input\_db\_access\_security\_group\_rules) | List of rules to allow/deny access to the Database | `any` | n/a | yes |
| <a name="input_db_az1_subnet_cidr_block"></a> [db\_az1\_subnet\_cidr\_block](#input\_db\_az1\_subnet\_cidr\_block) | CIDR range for subnet that holds the Database in AZ1 | `string` | n/a | yes |
| <a name="input_db_az2_subnet_cidr_block"></a> [db\_az2\_subnet\_cidr\_block](#input\_db\_az2\_subnet\_cidr\_block) | CIDR range for subnet that holds the Database in AZ2 | `string` | n/a | yes |
| <a name="input_db_engine_mode"></a> [db\_engine\_mode](#input\_db\_engine\_mode) | Database engine mode to be used | `string` | n/a | yes |
| <a name="input_db_instance_size"></a> [db\_instance\_size](#input\_db\_instance\_size) | Database instance size to be used | `string` | n/a | yes |
| <a name="input_db_master_username"></a> [db\_master\_username](#input\_db\_master\_username) | Master username to be used in MySQL DB | `string` | n/a | yes |
| <a name="input_db_password"></a> [db\_password](#input\_db\_password) | Password for the Database | `string` | n/a | yes |
| <a name="input_db_primary_db_name"></a> [db\_primary\_db\_name](#input\_db\_primary\_db\_name) | Primary Database name to be used in MySQL DB | `string` | n/a | yes |
| <a name="input_default_tags"></a> [default\_tags](#input\_default\_tags) | Default tags to be applied to all resources | `map(string)` | n/a | yes |
| <a name="input_eks_availability_zone_1_subnet_cidr_block"></a> [eks\_availability\_zone\_1\_subnet\_cidr\_block](#input\_eks\_availability\_zone\_1\_subnet\_cidr\_block) | CIDR range for subnet that holds the First EKS cluster in AZ1 | `string` | n/a | yes |
| <a name="input_eks_availability_zone_2_subnet_cidr_block"></a> [eks\_availability\_zone\_2\_subnet\_cidr\_block](#input\_eks\_availability\_zone\_2\_subnet\_cidr\_block) | CIDR range for subnet that holds the First EKS cluster in AZ2 | `string` | n/a | yes |
| <a name="input_eks_default_nodepool_desired_size"></a> [eks\_default\_nodepool\_desired\_size](#input\_eks\_default\_nodepool\_desired\_size) | Desired number of nodes in the default node pool for the First EKS Cluster | `number` | n/a | yes |
| <a name="input_eks_default_nodepool_max_size"></a> [eks\_default\_nodepool\_max\_size](#input\_eks\_default\_nodepool\_max\_size) | Maximum number of nodes in the default node pool for the First EKS Cluster | `number` | n/a | yes |
| <a name="input_eks_default_nodepool_max_unavailable"></a> [eks\_default\_nodepool\_max\_unavailable](#input\_eks\_default\_nodepool\_max\_unavailable) | Maximum number of nodes that can be unavailable in the default node pool for the First EKS Cluster | `number` | n/a | yes |
| <a name="input_eks_default_nodepool_min_size"></a> [eks\_default\_nodepool\_min\_size](#input\_eks\_default\_nodepool\_min\_size) | Minimum number of nodes in the default node pool for the First EKS Cluster | `number` | n/a | yes |
| <a name="input_eks_external_lb_az1_subnet_cidr"></a> [eks\_external\_lb\_az1\_subnet\_cidr](#input\_eks\_external\_lb\_az1\_subnet\_cidr) | CIDR range for subnet that holds the Internal Load Balancers in AZ1 | `string` | n/a | yes |
| <a name="input_eks_external_lb_az2_subnet_cidr"></a> [eks\_external\_lb\_az2\_subnet\_cidr](#input\_eks\_external\_lb\_az2\_subnet\_cidr) | CIDR range for subnet that holds the Internal Load Balancers in AZ2 | `string` | n/a | yes |
| <a name="input_enable_secret"></a> [enable\_secret](#input\_enable\_secret) | Enable secrets to store passwords | `bool` | `true` | no |
| <a name="input_environment_name"></a> [environment\_name](#input\_environment\_name) | Name used to identify Resources of the development resources | `string` | n/a | yes |
| <a name="input_kubernetes_version"></a> [kubernetes\_version](#input\_kubernetes\_version) | Kubernetes version to be used in EKS clusters | `string` | n/a | yes |
| <a name="input_management_subnet_az_cidr"></a> [management\_subnet\_az\_cidr](#input\_management\_subnet\_az\_cidr) | CIDR range for subnet that holds the Transit Gateway attachment in AZ1 | `string` | n/a | yes |
| <a name="input_project"></a> [project](#input\_project) | Name of the project. Used for naming | `string` | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | Deployment region | `string` | n/a | yes |
| <a name="input_secret_name"></a> [secret\_name](#input\_secret\_name) | Secret name for string | `string` | n/a | yes |
| <a name="input_secret_recovery_window_in_days"></a> [secret\_recovery\_window\_in\_days](#input\_secret\_recovery\_window\_in\_days) | Recovery window of the secret | `number` | n/a | yes |
| <a name="input_secret_string"></a> [secret\_string](#input\_secret\_string) | String value for string | `string` | n/a | yes |
| <a name="input_vpc_cidr_block"></a> [vpc\_cidr\_block](#input\_vpc\_cidr\_block) | CIDR range for VPC | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_bastion_instance"></a> [bastion\_instance](#output\_bastion\_instance) | ID of the bastion instance. |
| <a name="output_database_writer_endpoint"></a> [database\_writer\_endpoint](#output\_database\_writer\_endpoint) | Writer endpoint of the database instance. |
| <a name="output_efs_efs_access_point"></a> [efs\_efs\_access\_point](#output\_efs\_efs\_access\_point) | ID of the EFS Access Point |
| <a name="output_efs_id"></a> [efs\_id](#output\_efs\_id) | ID of the Elastic File Storage |
| <a name="output_filestore_location"></a> [filestore\_location](#output\_filestore\_location) | Location of the filestore. |
