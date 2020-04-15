package com.missthee.businessproviderboot.imp;

import com.missthee.interf.UserService;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.springframework.stereotype.Service;

@Service
//@org.apache.dubbo.config.annotation.Service(version = "1.0.2")
public class UserServiceImp implements UserService {
    private static boolean sign = false;

    @Override
    @HystrixCommand
    public String getUserInfo(String userId) throws Exception {
        System.out.println("business-provider-boot.....getUserInfo.....");
//        throw new Exception("just exception");//抛出异常不会触发重试
//        try {
//            Thread.sleep(2000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
        sign = !sign;
        if (sign) {
            throw new Exception("just exception");
        }else {
            return "server boot : " + userId;
        }
    }
}
