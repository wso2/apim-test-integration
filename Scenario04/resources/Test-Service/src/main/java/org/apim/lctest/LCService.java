/*
 * Copyright (c) 2016, WSO2 Inc. (http://wso2.com) All Rights Reserved.
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

package org.apim.lctest;

import org.apim.lctest.util.model.Event;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * This is the Microservice resource class.
 * See <a href="https://github.com/wso2/msf4j#getting-started">https://github.com/wso2/msf4j#getting-started</a>
 * for the usage of annotations.
 *
 * @since 0.1-SNAPSHOT
 */
@Path("/eventservice")
public class LCService {

    private String apiName=null;
    private String apiVerion=null;
    private String fromState = null;
    private String toState = null;

    @GET
    @Produces("application/json")
    @Path("/")
    public Response get() {
        System.out.println("GET invoked");
        String response = "{\"apiName\":\""+apiName+"\",\"apiVersion\":\""+apiVerion+"\",\"fromState\":\""+
                fromState+"\",\"toState\":\""+toState+"\"}";
        return Response.status(Response.Status.OK).entity(response).build();
    }

    @POST
    @Consumes("text/xml")
    @Path("/")
    public Response post(Event event) {
        System.out.println("POST invoked");
        String response = event.getMessage();

        String[] splitText = response.split("resource at ")[1].split("/");
        apiName = splitText[7];
        apiVerion = splitText[8];
        String[] splitStates = response.split("resource at ")[0].split("'");
        fromState = splitStates[1];
        toState = splitStates[3];

        return Response.status(Response.Status.OK).entity(apiName+", "+apiVerion+", "+fromState+", "+toState).build();
    }

    @PUT
    @Path("/")
    public void put() {
        System.out.println("PUT invoked");
    }

    @DELETE
    @Path("/")
    public void delete() {
        System.out.println("DELETE invoked");
    }
}
