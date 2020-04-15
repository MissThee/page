package com;

import myrule.MySelfRule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

@SpringBootApplication
@RibbonClient(name="SPRINGTEST-DEPT",configuration = MySelfRule.class) //【ribbon自定义规则】为指定的微服务设置指定的负载规则。MySelfRule.class不能放在@ComponentScan注解作用的包及子包内，否则规则会被所有微服务共享
public class DeptConsumer80 {
    public static void main(String[] args){
        SpringApplication.run(DeptConsumer80.class,args);
    }
}
