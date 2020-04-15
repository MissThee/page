package com.example.securityauthdemo.config.auth;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MyUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //数据库查询
        MyUserDetails myUserDetails = new MyUserDetails();
        myUserDetails.setUsername(username);
        myUserDetails.setPassword("$2a$10$R/Scz728R5Lfu24fxuQXkOsen1RdVj4jklRUI6V8ix/In0QuxW2j.");
//        new BCryptPasswordEncoder().encode("123");
// 此处不能使用方法临时对密码加密，每次加密的结果不同，security认为密码被修改过，登录会失效
//
        String permissionStr="";
        if (username.equals("user")) {
            permissionStr = "ROLE_user,page3";

        } else if (username.equals("admin")) {
            permissionStr = "ROLE_admin";
        }
        myUserDetails.setCollection(AuthorityUtils.commaSeparatedStringToAuthorityList(permissionStr));
        return myUserDetails;
    }
}
