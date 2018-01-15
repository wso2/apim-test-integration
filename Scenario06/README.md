# Solution 06 - API Governance

**This repository contains jmeter scripts created for APIM solution 06 described here[1]**

Basically following scripts covering the API governance solution with ...
scripts will be able to test :
- Subscriber application
- Throttling requests - API level/ Application level/ Subscription tiers
- Analytics - Relevant Publisher/ Store analytics
- Some load to verify more on analytics

Scrips available:

*01-Solution-06-ApplicationLevelThrottling.jmx*


*02-Solution-06-RemoveAPIsApps.jmx*



**How To Run**

Pre condition :
- "run.sh" file from <APIM_HOME>/samples MUST be ran
- sample #9 should be provided
- sample should be deployed to APIM server successfully

Execute script : Testgrid will start execution from 06-pre-scenario-steps.sh and continue the jmeter scripts and will be endedup with 06-post-scenario-steps.sh

Post condition : N/A

 [1] <https://docs.google.com/document/d/1YTcqeywgLR47NZY3xWwc-jJfREjhhVl2vgAAasZhN3A/edit#>
