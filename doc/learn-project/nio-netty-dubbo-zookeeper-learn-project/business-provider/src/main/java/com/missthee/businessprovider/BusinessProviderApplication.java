package com.missthee.businessprovider;
import org.apache.dubbo.container.Main;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;

public class BusinessProviderApplication {
    public static void main(String[] args) throws IOException {
//        Main.main(args);
        ClassPathXmlApplicationContext ioc =new ClassPathXmlApplicationContext("provider.xml");
        ioc.start();
        System.in.read();
    }
}
