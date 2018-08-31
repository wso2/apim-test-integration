/**
 *
 * <ns:Event xmlns:ns="http://wso2.org/ns/2011/01/eventing/registry/event"><ns:Message>[APILifeCycle] The LifeCycle State Changed from 'Prototyped' to 'Published' for resource at /_system/governance/apimgt/applicationdata/provider/admin/TestAPI3/1.0/api.</ns:Message><ns:Timestamp>2018-01-13T00:43:22.363+0530</ns:Timestamp><ns:Details><ns:Session><ns:Chroot>/_system/governance</ns:Chroot><ns:Username>admin</ns:Username><ns:TenantId>-1234</ns:TenantId></ns:Session><ns:Operation><ns:Path>/_system/governance/apimgt/applicationdata/provider/admin/TestAPI3/1.0/api</ns:Path><ns:EventType>LifeCycleStateChanged</ns:EventType><ns:ResourceType>unknown</ns:ResourceType><ns:LifecycleName>APILifeCycle</ns:LifecycleName><ns:OldLifecycleState>Prototyped</ns:OldLifecycleState><ns:NewLifecycleState>Published</ns:NewLifecycleState></ns:Operation><ns:Server><ns:HostName>192.168.8.101</ns:HostName><ns:Product><ns:Name>WSO2 API Manager</ns:Name><ns:Version>2.1.0</ns:Version></ns:Product><ns:OS><ns:Name>Mac OS X</ns:Name><ns:Version>10.13.1</ns:Version><ns:Architecture>x86_64</ns:Architecture></ns:OS><ns:User><ns:Name>cjayawardena</ns:Name><ns:Country>LK</ns:Country><ns:Language>en</ns:Language><ns:TimeZone>Asia/Colombo</ns:TimeZone></ns:User><ns:Java><ns:Vendor>Oracle Corporation</ns:Vendor><ns:Version>1.8.0_152</ns:Version><ns:JVM><ns:Name>Java HotSpot(TM) 64-Bit Server VM</ns:Name><ns:Version>25.152-b16</ns:Version></ns:JVM></ns:Java></ns:Server></ns:Details></ns:Event>
 */

package org.apim.lrtest.util.model;

import java.io.Serializable;
import java.util.UUID;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(namespace = "http://wso2.org/ns/2011/01/eventing/registry/event", name="Event")
public class Event implements Serializable {

    private String id = UUID.randomUUID().toString();
    private long dateAdded = System.currentTimeMillis();

    @XmlElement(required = true,namespace = "http://wso2.org/ns/2011/01/eventing/registry/event")
    private String Message;

    public Event(){}

    public Event(String Message){
        this.Message = Message;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String Message) {
        Message = Message;
    }

}
