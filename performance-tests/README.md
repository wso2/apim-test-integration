## API Creation with different backends and Invocation

### High level scenario description
This is to address API invocation with different TPS and different payloads within different traffic periods.

This solution covers the below areas
* Create, Publish and subscribe to 20 APIs 
* Create MSF4J services to consume
* Invoke APIs in different traffic intervals

### Pre-requists to execute tests
1. Start each MSF4J service in /apps folder by executing the command similar to below
```sh
java -jar apim-service1-0.1-SNAPSHOT.jar 
```

### Running the script
Configure each  user.properties file and run the below command to execute the script.

```sh
>./runscript.sh
```


