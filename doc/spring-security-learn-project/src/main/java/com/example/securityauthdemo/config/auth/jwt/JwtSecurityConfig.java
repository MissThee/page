//package com.example.securityauthdemo.config.auth.jwt;
//
//import com.example.securityauthdemo.config.auth.*;
//import com.example.securityauthdemo.config.auth.imagecode.KaptchaCodeValidateFilter;
//import com.example.securityauthdemo.config.auth.smscode.SmsCodeSecurityConfig;
//import com.example.securityauthdemo.utils.StaticKey;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.annotation.Order;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.BeanIds;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.builders.WebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
//
//import javax.sql.DataSource;
//
//@Configuration
//@Order(1)
//public class JwtSecurityConfig extends WebSecurityConfigurerAdapter {
//
//  @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
//  @Override
//  public AuthenticationManager authenticationManagerBean() throws Exception {
//    return super.authenticationManagerBean();
//  }
//}
