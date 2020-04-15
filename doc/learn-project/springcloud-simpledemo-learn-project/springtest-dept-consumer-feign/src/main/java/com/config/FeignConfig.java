package com.config;

import feign.Request;
import feign.Retryer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

//【feign无ribbon重试】不使用ribbon时，由此配置feign重试功能
@Configuration
public class FeignConfig {
    //可配置在yml中
    @Bean
    public Request.Options options() {
        //超时时间
        int connectTimeOutMillis = 9000;
        int readTimeOutMillis = 1000;
        return new Request.Options(connectTimeOutMillis, readTimeOutMillis);
    }
//feign:
//  client:
//    config:
//      default:           #服务名，填写default为所有服务
//        connectTimeout: 250
//        readTimeout: 1000


    @Bean
    public Retryer feignRetryer() {
//        return new Retryer.Default(250L, TimeUnit.SECONDS.toMillis(1L), 5);
        return Retryer.NEVER_RETRY;
    }
}
