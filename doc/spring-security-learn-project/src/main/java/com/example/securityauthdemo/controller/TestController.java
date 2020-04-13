package com.example.securityauthdemo.controller;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PreFilter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TestController {
    @RequestMapping("test1")
    @PreAuthorize("hasAnyAuthority('user')")
    public String test1() {
        return "test1";
    }

    @RequestMapping("test2")
    @PostAuthorize("returnObject.toString()==authentication.name")
    //returnObject为本方法的返回参数
    //authentication.name为当前用户的登录名username
    public String test2() {
        return "admin";
    }

    @RequestMapping("test3")
    @PreFilter(filterTarget = "inputList", value = "filterObject%2==0")
    //filterTarget指定过滤对象，此处指定inputList
    //filterObject指过滤的每个对象，此处条件是inputList中每个对象除以2余0即可通过
    public String test3(@RequestBody  List<Integer> inputList) {
        return "test3";
    }

    @RequestMapping("test4")
    @PostFilter("filterObject.toString()=='test4'")
    //filterObject返回值的每个对象
    public List<String> test4() {
        return new ArrayList<String>() {{
            add("test4");
        }};
    }
}
