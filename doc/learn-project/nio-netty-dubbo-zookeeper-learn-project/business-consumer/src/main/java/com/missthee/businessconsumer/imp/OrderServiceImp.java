package com.missthee.businessconsumer.imp;

import com.missthee.interf.OrderService;
import com.missthee.interf.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImp implements OrderService {
    private final UserService userService;

    public OrderServiceImp(UserService userService) {
        this.userService = userService;
    }

    @Override
    public String initOrder(String userId) throws Exception {
      return userService.getUserInfo(userId);
    }
}
