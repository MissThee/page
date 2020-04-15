package com.service;

import com.entity.Dept;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@FeignClient(value = "SPRINGTEST-DEPT", fallbackFactory = DeptClientServiceFallBackFactory.class) //【服务降级】接口配置服务降级，访问失败时以DeptClientServiceFallBackFactory中方法返回结果
public interface DeptClientService {
    //使用@FeignClient注解的接口，调用此接口中的方法时，会使用微服务名加uri调用微服务中发布的接口
    @RequestMapping(value = "/dept/get/{id}", method = RequestMethod.GET)
    public Dept get(@PathVariable("id") int id);

    @RequestMapping(value = "/dept/list", method = RequestMethod.GET)
    public List<Dept> list();

    @RequestMapping(value = "/dept/add", method = RequestMethod.POST)
    public boolean add(Dept dept);

    @RequestMapping(value = "/dept/get/timeout/{id}", method = RequestMethod.GET)
    public Dept get1(@PathVariable("id") int id);

}
