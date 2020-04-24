package com.example.securityauthdemo.config.auth.smscode;

import com.example.securityauthdemo.config.auth.MyUserDetails;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class SmsCodeUserDetailsService implements UserDetailsService {
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //数据库查询
        if ("13333333333".equals(username)) {
            MyUserDetails myUserDetails = new MyUserDetails();
            myUserDetails.setUsername("13333333333");
            String permissionStr = "";
            permissionStr = "ROLE_user,page3";
            myUserDetails.setCollection(AuthorityUtils.commaSeparatedStringToAuthorityList(permissionStr));
            return myUserDetails;
        } else {
            return null;
        }
    }
}
