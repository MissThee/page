package com;

import com.netflix.hystrix.contrib.metrics.eventstream.HystrixMetricsStreamServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableEurekaClient //【eureka】配置为eureka客户端启动类
@EnableDiscoveryClient //服务发现
@EnableCircuitBreaker//【Hystrix2/2】Hystrix熔断支持
public class DeptHystrix8002 {
    public static void main(String[] args) {
        SpringApplication.run(DeptHystrix8002.class, args);
    }

    // 这个是2.X要添加的，不然仪表盘不显示
    @Bean
    public ServletRegistrationBean getServlet() {
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(1);
        registrationBean.addUrlMappings("/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
}
//监控页：http://localhost:9001/hystrix
//输入：http://host:port/hystrix.stream, 点击下方按钮开始监控