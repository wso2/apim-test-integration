Name : config02
Description
Config changes required for updating registry resources via REST API and updating output event adepter - email with valid configs.

Prerequisites
1. cp apps/resoruce.war to <PRODUCT_HOME>/repository/deployment/server/webapps directory

2. replace <PRODUCT_HOME>/repository/conf/output-event-adapters.xml with files/output-event-adapters.xml where following configurations are done under 'email' adepterConfig type.
       property key="mail.smtp.from">dewmi123455@gmail.com
       property key="mail.smtp.user">dewmi123455
       property key="mail.smtp.password">password
       property key="mail.smtp.host">smtp.gmail.com
       property key="mail.smtp.port">587

3. Restart the WSO2 server.

Note: Due to a known issue from apim2.1.0-update6 onwards, user has to manually copy relevant jars of spring framwwork 3.07 verion to resource web app. These steps are not included in the config.sh since this bug will be fixed in futer releases.

