package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;

@SpringBootApplication
@EnableHystrixDashboard//独立使用的监控工具为
public class HystrixDashboard {
    public static void main(String[] args) {
        SpringApplication.run(HystrixDashboard.class, args);
    }
}
//监控页面地址：http://localhost:9001/hystrix
//输入微服务的访问地址：http://localhost:port/hystrix.stream，点击下方按钮，可进行独立监控（即页面中第三种方式，前两种需配合turbine）。前提是此节点使用了hystrix，若项目中的接口发现@HystrixCommand注解，则仅监控有此注解的各个接口
