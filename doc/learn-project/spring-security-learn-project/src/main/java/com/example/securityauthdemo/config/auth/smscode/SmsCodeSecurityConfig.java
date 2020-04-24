package com.example.securityauthdemo.config.auth.smscode;

import com.example.securityauthdemo.config.auth.MyAuthenticationFailureHandler;
import com.example.securityauthdemo.config.auth.MyAuthenticationSuccessHandler;
import com.example.securityauthdemo.config.auth.smscode.authentication.SmsCodeAuthenticationFilter;
import com.example.securityauthdemo.config.auth.smscode.authentication.SmsCodeAuthenticationProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

@Component
public class SmsCodeSecurityConfig extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {
    private final MyAuthenticationFailureHandler myAuthenticationFailureHandler;
    private final MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;
    private final SmsCodeUserDetailsService smsCodeUserDetailsService;

    public SmsCodeSecurityConfig(MyAuthenticationFailureHandler myAuthenticationFailureHandler, MyAuthenticationSuccessHandler myAuthenticationSuccessHandler, SmsCodeUserDetailsService smsCodeUserDetailsService) {
        this.myAuthenticationFailureHandler = myAuthenticationFailureHandler;
        this.myAuthenticationSuccessHandler = myAuthenticationSuccessHandler;
        this.smsCodeUserDetailsService = smsCodeUserDetailsService;
    }

    @Override
    public void configure(HttpSecurity httpSecurity) {
        SmsCodeAuthenticationFilter smsCodeAuthenticationFilter = new SmsCodeAuthenticationFilter() {{
            setAuthenticationManager(httpSecurity.getSharedObject(AuthenticationManager.class));
            setAuthenticationFailureHandler(myAuthenticationFailureHandler);
            setAuthenticationSuccessHandler(myAuthenticationSuccessHandler);
        }};
        SmsCodeAuthenticationProvider smsCodeAuthenticationProvider = new SmsCodeAuthenticationProvider() {{
            setSmsCodeUserDetailsService(smsCodeUserDetailsService);
        }};
        httpSecurity
                .addFilterAt(smsCodeAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(smsCodeAuthenticationProvider);
    }
}
