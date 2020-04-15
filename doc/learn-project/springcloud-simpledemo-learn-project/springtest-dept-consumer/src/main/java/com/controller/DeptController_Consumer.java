package com.controller;

import com.entity.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
public class DeptController_Consumer {
//    private static final String REST_URL_PREFIX = "http://localhost:8001";
    private static final String REST_URL_PREFIX = "http://SPRINGTEST-DEPT"; //【ribbon3/3】使用负载均衡需配置对应的微服务名。配置@LoadBalanced后不能使用ip，只能使用微服务名，否则找不到服务

    @Autowired
    private RestTemplate restTemplate;
//    使用restTemplate访问restful接口
//    (url,requestMap,ResponseBean.class)分别为REST请求地址、请求参数、HTTP相应转换被转换成的对象类型。

    @RequestMapping(value = "/consumer/dept/add")
    public boolean add(Dept dept) {
//        return deptService.add(dept);
        return restTemplate.postForObject(REST_URL_PREFIX+"/dept/add",dept,Boolean.class);
    }
    @RequestMapping(value = "/consumer/dept/get/{id}")
    public Dept get(@PathVariable("id") int id)
    {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/" + id, Dept.class);
    }

    @SuppressWarnings("unchecked")
    @RequestMapping(value = "/consumer/dept/list")
    public List<Dept> list()
    {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/list", List.class);
    }

    @RequestMapping(value = "/consumer/dept/get/timeout/{id}")
    public Dept get1(@PathVariable("id") int id)
    {
        return restTemplate.getForObject(REST_URL_PREFIX + "/dept/get/timeout/" + id, Dept.class);
    }
}
