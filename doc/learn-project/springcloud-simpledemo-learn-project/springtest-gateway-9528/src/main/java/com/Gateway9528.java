package com;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Gateway9528 {

//    @Bean
//    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
//        return builder.routes()
//                .route(p -> p
//                        .host("*.hystrix.com")
//                        .filters(f -> f.hystrix(config -> config
//                                .setName("myHystrix")
//                                .setFallbackUri("forward:/fallback")))//hystrix触发后，访问本项目的controller
//                        .uri("http://httpbin.org"))
//                .build();
//    }

    public static void main(String[] args) {
        SpringApplication.run(Gateway9528.class, args);
    }
}