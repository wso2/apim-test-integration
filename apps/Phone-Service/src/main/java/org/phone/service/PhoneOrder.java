/*
 * Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.phone.service;


import org.wso2.client.api.ApiClient;
import org.wso2.client.api.ApiException;
import org.wso2.client.api.AppDevelopmentAPI.DefaultApi;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import java.util.logging.Logger;

/**
 * This is the Microservice resource class.
 * See <a href="https://github.com/wso2/msf4j#getting-started">https://github.com/wso2/msf4j#getting-started</a>
 * for the usage of annotations.
 *
 * @since 0.1-SNAPSHOT
 */
@Path("/phones")
public class PhoneOrder {
    private final static Logger LOGGER = Logger.getLogger(PhoneOrder.class.getName());
    @GET
    @Path("/getPhone")
    public String get(@QueryParam("serverHost") String serverHost, @QueryParam("accessToken") String accessToken,@QueryParam("serverPort") String serverPort) {

        DefaultApi defaultApi = new DefaultApi();
        ApiClient apiClient = defaultApi.getApiClient();
        apiClient.addDefaultHeader("Accept", "application/json");
        apiClient.addDefaultHeader("Authorization", "Bearer " + accessToken);
        apiClient.setBasePath("http://"+serverHost+":"+serverPort+"/getmock/v1.0.0");
        defaultApi.setApiClient(apiClient);

        try {

            String phoneModel = defaultApi.getMockGet();
            if(phoneModel.contains("org.wso2.client.api.ApiResponse")){
                return "The phone you searched is in stock"+phoneModel;
            }

        } catch (ApiException e) {
            e.printStackTrace();
            LOGGER.info("Encountered an error while invoking the api: "+e);
        }
        return "Error occured please check the MSF4J Stacktrace";

    }

    @GET
    @Produces("application/json")
    @Path("/getMock")
    public String get() {
        return "{\"Phone available is\" : \"Samsung\"}";
    }

}
