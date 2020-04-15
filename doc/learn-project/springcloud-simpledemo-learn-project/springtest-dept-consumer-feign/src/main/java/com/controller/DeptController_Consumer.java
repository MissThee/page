package com.controller;

import com.entity.Dept;
import com.service.DeptClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptController_Consumer {

    private final DeptClientService deptClientService;//实际的feign实现在springtest-api的这个类中

    @Autowired
    public DeptController_Consumer(DeptClientService deptClientService) {
        this.deptClientService = deptClientService;
    }

    @RequestMapping(value = "/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") int id) {
        return this.deptClientService.get(id);
    }

    @RequestMapping(value = "/consumer/dept/list")
    public List<Dept> list() {
        return this.deptClientService.list();
    }

    @RequestMapping(value = "/consumer/dept/add")
    public Object add(Dept dept) {
        return this.deptClientService.add(dept);
    }

    @RequestMapping(value = "/consumer/dept/get/timeout/{id}")
    public Dept get1(@PathVariable("id") int id) {
        return this.deptClientService.get1(id);
    }
}
