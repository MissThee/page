package com.example.securityauthdemo.config.auth.smscode;

import com.example.securityauthdemo.config.auth.MyAuthenticationFailureHandler;
import com.example.securityauthdemo.config.auth.MyAuthenticationSuccessHandler;
import com.example.securityauthdemo.config.auth.smscode.authentication.SmsCodeAuthenticationFilter;
import com.example.securityauthdemo.config.auth.smscode.authentication.SmsCodeAuthenticationProvider;
import com.example.securityauthdemo.config.auth.smscode.filter.SmsCodeValidateFilter;
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
    private final SmsCodeValidateFilter smsCodeValidateFilter;

    public SmsCodeSecurityConfig(SmsCodeValidateFilter smsCodeValidateFilter, MyAuthenticationFailureHandler myAuthenticationFailureHandler, MyAuthenticationSuccessHandler myAuthenticationSuccessHandler, SmsCodeUserDetailsService smsCodeUserDetailsService) {
        this.smsCodeValidateFilter = smsCodeValidateFilter;
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
                .addFilterBefore(smsCodeValidateFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(smsCodeAuthenticationProvider)
                .addFilterAfter(smsCodeAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
