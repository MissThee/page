package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.cloud.netflix.turbine.EnableTurbine;

@SpringBootApplication
@EnableTurbine
public class Turbine {
    public static void main(String[] args) {
        SpringApplication.run(Turbine.class, args);
    }
}
//监控原数据http://localhost:9002/turbine.stream
//将以上地址输入到hystrix dashboard的监控地址，点击下方按钮可进行监控，一个微服务下的所有子节点共用一个图