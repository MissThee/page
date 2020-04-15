package com.missthee.businessconsumer.interf;

import com.missthee.interf.UserService;

public class UserServiceStub implements UserService {
    private UserService userService;

    public UserServiceStub(UserService userService) {
        this.userService = userService;
    }

    @Override
    public String getUserInfo(String userId) throws Exception {
        System.out.println("UserServiceStub.....stub.....");
        return userService.getUserInfo(userId);
    }
}
