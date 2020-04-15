package com.missthee.businessconsumer;

import com.missthee.interf.OrderService;
import org.apache.dubbo.container.Main;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;

public class BusinessConsumerApplication {

    public static void main(String[] args) throws Exception {
        //dubbo启动方法(阻塞方法)
//        Main.main(args);
        //spring启动方法
        ClassPathXmlApplicationContext ioc =new ClassPathXmlApplicationContext("consumer.xml");
        ioc.start();
        //获取bean方法1
        OrderService orderService = ioc.getBean(OrderService.class);
        System.out.println(orderService.initOrder("123"));
        //获取bean方法2
        OrderService orderService1 = ApplicationContextHelper.getBean(OrderService.class);
        System.out.println(orderService1.initOrder("zxc"));
        System.in.read();

    }

}
