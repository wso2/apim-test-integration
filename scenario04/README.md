#Scenario07 - LifeCycle Management

##Description
- Ability to run full lifecycle API Management from the inception stage of an API until retirement
- Notification mechanisms for informing developers on API changes
- App lifecycle management mechanisms in sync with API lifecycle management
- Introduce and execute organization specific lifecycle states

##Prerequisites
1. The event-service MSF4J service should be started: this service will collect the events published from APIM when user perform lifecycle change.
  - build apps/event-service using mvn
  - deploy the service in a different instance in the deployement

##Steps
1. Run 04-pre-scenario-steps.sh
2. Run 01-Scenario04-ManageLifeCycle.jmx
3. Run 04-post-scenario-steps.sh