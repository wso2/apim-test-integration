
Here's the gist of what happens in the current test.sh/run-scenario.sh of apim-test-integration repo.

1. Read infra.sh inputs
2. Clone the test repo
3. Download the product pack from Jenkins/WUM 
4. Configure the product pack
5. Setup databases
6. Run intg tests

As you see, we have mixed up the tasks of the deployment creation step (such as steps #3,4,5) and the test run step (#2,6). 
This worked fine for single node integration tests because it does not use an external product deployment. 

But, this is changing with the two-node apim deployment test effort. 
Here, we need to separate the deployment creation and test execution. 

For cloudformation-based aws deployments, we use the following model:
![Testgrid intg test workflow](https://user-images.githubusercontent.com/936037/44514089-cd2b8f00-a6dc-11e8-950b-386374e9bd4e.png)

1. infra.sh -> Does both infra.sh + deploy.sh steps. Reason is that it's easier to configure the VMs the moment they got provisioned via cloudformation scripts. 
So, in here, we are actually doing the following:
   * Provision the infrastructure via cloudformation scripts.
   * Do the product deployment via cloudformation Userdata scripting (via bash/bat) of each ec2 instance.
Steps #3,4,5 comes under here.
2. test.sh (run-scenario.sh) -> 
   * Read the infra.sh inputs to find the deployment properties
   * Clone the test repo (ie. step #2)
   * Configure the repo according to deployment properties
   * Run intg tests (ie. step #6)
