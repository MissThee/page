package com.controller;

import com.entity.Dept;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class DeptController {
    private final DeptService deptService;

    private final DiscoveryClient discoveryClient;

    @Autowired
    public DeptController(DeptService deptService, DiscoveryClient discoveryClient) {
        this.deptService = deptService;
        this.discoveryClient = discoveryClient;
    }

    @RequestMapping(value = "/dept/add", method = RequestMethod.POST)
    public boolean add(@RequestBody Dept dept) {
        return deptService.add(dept);
    }

    @RequestMapping(value = "/dept/get/{id}", method = RequestMethod.GET)
    @HystrixCommand(commandKey = "dept-8002-get", fallbackMethod = "processHystrix_Get") // 【Hystrix1/2】调用抛出异常时调用fallbackMethord指定方法。此种写法仅示例，实际使用不会每种方法单独写HystrixCommand，原因会产生大量冗余方法，应直接在所调用接口处写熔断处理
    public Dept get(@PathVariable("id") int id) {
        System.out.println("dept-8002-get");
        Dept dept = this.deptService.get(id);
        if (null == dept) {
            throw new RuntimeException("该ID：" + id + "没有对应信息");
        }
        return dept;
    }

    public Dept processHystrix_Get(@PathVariable("id") int id) {
        return new Dept().setId(id).setName("该ID：" + id + "没有对应信息---Hystrix").setDb_source("None");
    }

    @HystrixCommand(commandKey = "dept-8002-list")
    @RequestMapping(value = "/dept/list", method = RequestMethod.GET)
    public List<Dept> list() {
        return deptService.list();
    }

    @RequestMapping(value = "/dept/discovery", method = RequestMethod.GET)
    public Object discovery() {
        List<String> list = discoveryClient.getServices();
        System.out.println("****" + list);
        List<ServiceInstance> serList = discoveryClient.getInstances("springtest-8001");
        for (ServiceInstance ser : serList) {
            System.out.println(ser.getServiceId() + "\t" + ser.getHost() + "\t" + ser.getPort() + "\t" + ser.getUri());
        }
        return this.discoveryClient;
    }

    @RequestMapping(value = "/dept/get/timeout/{id}", method = RequestMethod.GET)
    public Dept get1(@PathVariable("id") int id) {
        System.out.println("请求 8002/dept/get/{id}");
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            System.out.println("sleep中断");
        }
        return new Dept().setId(1).setDb_source("8002").setName("8002");

    }
}
