package com.missthee.businessprovider.imp;


import com.missthee.interf.UserService;

public class UserServiceImp implements UserService {
    @Override
    public String getUserInfo(String userId) {
        System.out.println("business-provider.....getUserInfo.....");
        return "server : "+userId;
    }
}
