Description
Config changes required for adding custom lifecycle state
Prerequisite
1. Updaed LifeCycle section in registry to add new section[A] for custom LC state.
2. Also update the above by adding <transition event="Reject" target="Rejected"/> line to PUBLISHED state in the same section.

[A]
 <state id="Rejected">
    <datamodel>
        <data name="checkItems">
            <item name="Deprecate old versions after rejecting the API" forEvent="">
            </item>
            <item name="Remove subscriptions after rejection" forEvent="">
            </item>
        </data>
        <data name="transitionExecution">
            <execution forEvent="Re-Submit" class="org.wso2.carbon.apimgt.impl.executors.APIExecutor">
            </execution>
            <execution forEvent="Retire" class="org.wso2.carbon.apimgt.impl.executors.APIExecutor">
            </execution>
        </data>
    </datamodel>
        <transition event="Re-Submit" target="Published"/>
        <transition event="Retire" target="Retired"/>
</state>

Steps
1. copy locale_default.json file to <API-M_HOME>/repository/deployment/server/jaggeryapps/publisher/site/conf/locales/jaggery/ directory.
2. Restart the server
