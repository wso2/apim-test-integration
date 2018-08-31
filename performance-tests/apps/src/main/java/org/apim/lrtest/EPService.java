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

package org.apim.lrtest;

import org.apim.lrtest.util.model.Event;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

/**
 * This is the Microservice resource class.
 * See <a href="https://github.com/wso2/msf4j#getting-started">https://github.com/wso2/msf4j#getting-started</a>
 * for the usage of annotations.
 *
 * @since 0.1-SNAPSHOT
 */
@Path("/service")
public class EPService {

    private String pageName="Page Name Added";
    private String pageLink="Page Link Added";
    private String wikibody = "Wiki Body Added";


    @POST
    @Consumes("application/json")
    @Path("/addInfo")
    public Response post(Event event) {
        System.out.println("POST invoked");
        return Response.status(Response.Status.OK).entity(" "+ pageName+", "+pageLink+", "+wikibody+" ").build();
    }
}
