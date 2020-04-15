package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer //EurekaServer服务器端启动类，接收其他微服务注册进来
public class EurekaServer7001 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServer7001.class, args);
    }
}


//eureka信息查看
//get: {ip:port}/eureka/status

//注册到eureka的服务信息查看
//get: {ip:port}/eureka/apps

//注册到eureka的具体的服务查看
//get: {ip:port}/eureka/apps/{appname}/{id}
//对应eureka源码的：InstanceResource.getInstanceInfo

//服务续约
//put：{ip:port}/eureka/apps/{appname}/{id}?lastDirtyTimestamp={}&status=up
//对应eureka源码的：InstanceResource.renewLease

//更改服务状态
//put：{ip:port}/eureka/apps/{appname}/{id}/status?lastDirtyTimestamp={}&value={UP/DOWN}
//对应eureka源码的：InstanceResource.statusUpdate

//删除状态更新
//delete：{ip:port}/eureka/apps/{appname}/{id}/status?lastDirtyTimestamp={}&value={UP/DOWN}
//对应eureka源码的：InstanceResource.deleteStatusUpdate

//删除服务
//delete: {ip:port}/eureka/apps/{appname}/{id}
//对应eureka源码的：InstanceResource.cancelLease


//{appname}为eureka 列表中的application
//{id}为UP、DOWN后面的节点名称