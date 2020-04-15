package com.missthee.businessproviderboot;

import org.apache.dubbo.config.spring.context.annotation.EnableDubbo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.ImportResource;

@EnableDubbo
//@ImportResource(locations = "classpath:provider.xml")
@SpringBootApplication
@EnableHystrix
public class BusinessProviderBootApplication {
    public static void main(String[] args) {
        SpringApplication.run(BusinessProviderBootApplication.class, args);
    }
}
