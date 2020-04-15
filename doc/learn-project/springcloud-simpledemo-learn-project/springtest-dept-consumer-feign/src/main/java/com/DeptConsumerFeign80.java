package com;

import myrule.MySelfRule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;
import org.springframework.cloud.netflix.ribbon.RibbonClients;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients//默认扫描当前包及子包
@RibbonClients({
        @RibbonClient(name = "SPRINGTEST-DEPT", configuration = MySelfRule.class), //name为微服务名
})//此配置可修改Feign的负载均衡策略
public class DeptConsumerFeign80 {
    public static void main(String[] args) {
        SpringApplication.run(DeptConsumerFeign80.class, args);
    }
}
