package com.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ConfigBean { //spring  使用applicationContext.xml；springboot使用@Configuration注解配置
// springboot配置文件写法
//    @Bean
//    public UserService getUserService(){
//        return new UserService();
//    }
    @Bean
    @LoadBalanced   //【ribbon2/3】打开负载均衡
    public RestTemplate getRestTemplate(){
        return new RestTemplate();
    }

//    @Bean           //【ribbon设置】设置负载均衡方法，ribbon会在Configuration中找IRule类的bean进行配置
//    public IRule myRule(){
//        return new RoundRobinRule();
//    }
}

//spring配置文件写法
//applicationContext.xml
//<bean id="userService" class="com.UserServiceImpl">