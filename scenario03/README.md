## Scenario 03 - App Development with APIs

### High level scenario description
In the APP Development with API WSO2 APIM provides SDKs to many popular development languages. Basically an API subscriber can quick start his app using the SDK provided.

This solution covers the below areas
* Create, Publish and subscribe to and API 
* Create a MSF4J service to consume the above api using the Java SDK ( Prebuilt ) 
* Verify that the SDK is able to invoke the API and return the response 

### Current folder structure
```
Scenario1
|-jmeter
    |-01-Scenario03-App-Development-with-APIs.jmx

|-resources
    |-user.properties

```
### Pre-requists to execute tests
1. Build the **AppDevelopmentAPI_v1.0.0_java** which can be found in the **apim-test-integration/apps/** folder. Build it using **mvn clean install**

2. Now build the Phone-Service ( MSF4J service ) which can be found in the same location as above **apim-test-integration/apps/**. Build it using **mvn clean install**
3. Ones you build the MSF4J service in step 2 navigate to the target folder of it and start the MSF4J service by issuing the below command
```sh
java -jar Phone-Service-0.1-SNAPSHOT.jar 
```

### Running the script
Configure the user.properties and run the below command to execute the script.

```sh
>path/to/jmeter/bin/jmeter -n -t path/to/01-Scenario03-App-Development-with-APIs.jmx -p path/to/user.properties -l xxxx.jtl
```

