package com.missthee.businessconsumerboot.imp;

import com.missthee.interf.OrderService;
import com.missthee.interf.UserService;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.apache.dubbo.config.annotation.Method;
import org.apache.dubbo.config.annotation.Reference;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImp implements OrderService {
    //    @Reference(retries = 2,timeout = 1000,url="127.0.0.1:20882")//当配置了url时会使用直连，不使用注册中心
    @Reference(retries = 0, timeout = 1000,version = "*")//使用Reference注解表明该service的实现方法通过远程调用
    private UserService userService;

    @Override
    @HystrixCommand(fallbackMethod = "initOrderFallback")
    public String initOrder(String userId) throws Exception {
        return userService.getUserInfo(userId);
    }

    public String initOrderFallback(String userId) {
        return "initOrder("+userId+") FALLBACK";
    }
}
