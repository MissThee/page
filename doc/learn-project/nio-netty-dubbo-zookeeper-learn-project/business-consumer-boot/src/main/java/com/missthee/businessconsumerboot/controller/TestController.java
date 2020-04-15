package com.missthee.businessconsumerboot.controller;

import com.missthee.interf.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class TestController {
    private final OrderService orderService;

    public TestController(OrderService orderService) {
        this.orderService = orderService;
    }

    @RequestMapping("test/{userId}")
    public String test(@PathVariable(required = false, value = "userId") String userId) throws Exception {
        return orderService.initOrder(userId);
    }
}
