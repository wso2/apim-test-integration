# Scenario 09  Developer Enablement and Community Building


# Scenario:

Providing Single Sign On for API STORE using Twitter IDP and Google IDP

This is a scenario that incorporates with WSO2 Identity Server and WSO2 API Manager


# Covered Automations:

Providing Single Sign On for API STORE using Twitter IDP and Google IDP


# Positive  

- Change Role Permissions
- Create and Update Twitter IDP 
- Create and Update Google IDP
- Register API Store as a Service Provider
- Update SP with Google IDP and Twitter IDP
- API Store Login with Google IDP
- API Store Login with Twitter IDP
- Terminate Tests

# Configurations

1. Go to IS_Home/repository/conf/carbon.xml and set the offset to 1

2. Enable Email as a Username in IS 5.4.0 pack by doing following configs
Open the IS_HOME/repository/conf/carbon.xml file.
Look for the commented out configuration EnableEmailUserName. Uncomment the configuration to enable email authentication.
Open the IS_HOME/repository/conf/identity/identity-mgt.properties file and set the property UserInfoRecovery.UseHashedUserNames=true
Open the IS_HOME/repository/conf/user-mgt.xml and set 

```sh
AdminUser
UserName>admin@wso2.com

```

Provide the suitable regex to match the userstore to enable email as a username

```sh

If the user store is LDAP use the following configs 
Property name="UsernameJavaRegEx">^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$
Property name="UsernameJavaScriptRegEx">^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$
Property name="UsernameWithEmailJavaScriptRegEx">[a-zA-Z0-9@._-|//]{3,30}$

```

If user store is secondary external JDBC/MYSQL use

```sh

Property name="IsEmailUserName">true
Property name="UsernameWithEmailJavaScriptRegEx">[a-zA-Z0-9@._-|//]{3,30}$

```

3. Enable email as a username in APIM 2.1.0 update 7 following the same above steps. Only difference is in user-mgt.xml file use the below username.
```sh
AdminUser
UserName admin@wso2.com@carbon.super

```

4. Configure common userstores for user management and registry sharing between APIM and IS
Create a jdbc/mysql external user store for user-mgt
Create a jdbc/mysql external user store for registry
Add the datasource for both newly created user stores in master-datasource.xml files in APIM and IS
Go to APIM and IS user-mgt.xml and comment out the available userstore details and add the details for newly created user-mgt (step1) user store details. 
In both IS and APIM user-mgt.xml change the datasource name to match with the jndi name given in the master-datasource.xml 
Go to APIM and IS registry.xml and without commenting out the available user store details add the datasource jndi name for the user store (step2) the to match with the master-datasource.xml 

```sh

<dbConfig name="govregistry">
        <dataSource>jdbc/WSO2REG_DB</dataSource>
</dbConfig>

```

Add the details related to sharing the registry and mounting in both IS and APIM

```sh
  
<remoteInstance url="https://localhost">   
        <id>gov</id>
        <dbConfig>govregistry</dbConfig>
        <readOnly>false</readOnly>
        <enableCache>true</enableCache>
        <registryRoot>/</registryRoot>
</remoteInstance>
  
<mount path="/_system/governance" overwrite="true">
        <instanceId>gov</instanceId>
        <targetPath>/_system/governance</targetPath>
</mount>
  
<mount path="/_system/config" overwrite="true">
       <instanceId>gov</instanceId>
       <targetPath>/_system/config</targetPath>
</mount>
```

5. Add the following configs under  API-M_HOME/repository/deployment/server/jaggeryapps/store/site/conf/site.json file

```sh
 "ssoConfiguration" : {
        "ssoConfiguration" : {
        "enabled" : "true",
        "issuer" : "API_STORE",
        "identityProviderURL" : "https://localhost:9444/samlsso",
        "keyStorePassword" : "wso2carbon",
        "identityAlias" : "wso2carbon",
        "responseSigningEnabled":"true",
        "assertionSigningEnabled":"true",
        "verifyAssertionValidityPeriod":"true",
        "timestampSkewInSeconds":"300",
        "audienceRestrictionsEnabled":"true",
        "keyStoreName" :"/home/shanika/WSO2/APIM2xx/mm3/wso2is-5.4.0/repository/resources/security/wso2carbon.jks",
        //"passive" : "true",
        "signRequests" : "true",
        "assertionEncryptionEnabled" : "false",
        "idpInit" : "true",
        "idpInitSSOURL" : "https://localhost:9444/samlsso?spEntityID=API_STORE",
        //"identityProviderLogoutURL" : "https:/localhost:9443/samlsso",
        "externalLogoutPage" : "https://localhost:9444/samlsso?slo=true"
        //"acsURL" : "https://localhost:9443/store/jagg/jaggery_acs.jag", //In passive or request signing mode, use only if default Assertion Consumer Service URL needs to be overidden
        //"nameIdPolicy" : "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" //If not specified, 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified' will be used
    },
```
