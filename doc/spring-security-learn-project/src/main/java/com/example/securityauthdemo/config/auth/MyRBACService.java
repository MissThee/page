package com.example.securityauthdemo.config.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class MyRBACService {
    public boolean hasPermission(HttpServletRequest request, Authentication authentication){
        Object principal = authentication.getPrincipal();
        if(principal instanceof UserDetails){
            String username=((UserDetails)principal).getUsername();
            //查询数据库，用户可访问的路径及其请求方式
            //此处使用路径匹配。如用户可访问 /userList POST;  /roleList GET;
            return username.equals("admin");
        }
        return false;
    }
}
