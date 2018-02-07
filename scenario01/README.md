# Scenario 1 - API Development

### High level scenario description
In the API Development space following three main aspects exists.
* Managing Public, Partner vs Private APIs 
* Ownership, permission and collaborative API development
* Developer Optimized APIs Development 

### Current folder structure
```
Scenario1
|-jmeter
    |-01-Solution1-PublicPartnerPrivateAPI.jmx
    |-02-Solution1-OwnershipAndColDevelopment.jmx
    |-03-Solution1-DeveloperOptimizedAPIDevelopment.jmx
|-resources
    |-user.properties
    |-SubscriptionValueSet.csv
    |-UserAgentValueSet.csv
    |-UserAndRoleCreation.csv
    |-UserDetails.csv
    |-ViewAPI_CreatedByAdmin.csv
```
### Pre-requists to execute tests
All the jmeter scripts requires a change in tenant-conf.json and this registry entry has been updated using registry rest apis. WSO2 APIM does not bundle the registry apis by default hence the registry.war which exists in WSO2 Greg distribution can be used for this purpose. Please copy this registry.war to APIM_HOME/repository/deployment/server/webapps and start the server
Please see [2635](https://github.com/wso2/product-apim/issues/2635)

### Running the scripts
Following three commands can be used to run the scripts respectively
```sh
>path/to/jmeter/bin/jmeter -n -t xx.xxxx.jmx -p path/to/user.properties -l xxxx.jtl
```
As an example
```sh
>path/to/jmeter/bin/jmeter -n -t 01-Solution1-PublicPartnerPrivateAPI.jmx -p ../user.properties -l test1.jtl
```
