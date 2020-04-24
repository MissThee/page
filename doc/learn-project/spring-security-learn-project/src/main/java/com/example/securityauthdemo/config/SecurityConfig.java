package com.example.securityauthdemo.config;

import com.example.securityauthdemo.config.auth.*;
import com.example.securityauthdemo.config.auth.imagecode.KaptchaCodeValidateFilter;
import com.example.securityauthdemo.config.auth.jwt.JwtTokenAuthenticationFilter;
import com.example.securityauthdemo.config.auth.smscode.SmsCodeSecurityConfig;
import com.example.securityauthdemo.utils.StaticKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;

import javax.sql.DataSource;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)//启用方法级别的安全控制：@PreAuthorize @PreFilter @PostAuthorize @PostFilter
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  private final MyAuthenticationFailureHandler myAuthenticationFailureHandler;
  private final MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;
  private final MyExpiredSessionStrategy myExpiredSessionStrategy;
  private final MyUserDetailsService myUserDetailsService;
  private final DataSource dataSource;
  private final MyLogoutSuccessHandler myLogoutSuccessHandler;
  private final MyInvalidSessionStrategy myInvalidSessionStrategy;
  private final KaptchaCodeValidateFilter kaptchaCodeFilter;
  private final SmsCodeSecurityConfig smsCodeSecurityConfig;
  private final JwtTokenAuthenticationFilter jwtTokenAuthenticationFilter;

  public SecurityConfig(MyAuthenticationSuccessHandler myAuthenticationSuccessHandler, MyAuthenticationFailureHandler myAuthenticationFailureHandler, MyExpiredSessionStrategy myExpiredSessionStrategy, MyUserDetailsService myUserDetailsService, DataSource dataSource, MyLogoutSuccessHandler myLogoutSuccessHandler, MyInvalidSessionStrategy myInvalidSessionStrategy, KaptchaCodeValidateFilter kaptchaCodeFilter, SmsCodeSecurityConfig smsCodeSecurityConfig, JwtTokenAuthenticationFilter jwtTokenAuthenticationFilter) {
    this.myAuthenticationSuccessHandler = myAuthenticationSuccessHandler;
    this.myAuthenticationFailureHandler = myAuthenticationFailureHandler;
    this.myExpiredSessionStrategy = myExpiredSessionStrategy;
    this.myUserDetailsService = myUserDetailsService;
    this.dataSource = dataSource;
    this.myLogoutSuccessHandler = myLogoutSuccessHandler;
    this.myInvalidSessionStrategy = myInvalidSessionStrategy;
    this.kaptchaCodeFilter = kaptchaCodeFilter;
    this.smsCodeSecurityConfig = smsCodeSecurityConfig;
    this.jwtTokenAuthenticationFilter = jwtTokenAuthenticationFilter;
  }
  @Override
  protected void configure(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .httpBasic()//不安全，非重要接口可用
//                .and()
//                .authorizeRequests()//需要身份认证
//                .anyRequest()//所有访问路径都需要
//                .authenticated();//需要登录授权
    httpSecurity
      .apply(smsCodeSecurityConfig).and()
      .addFilterBefore(kaptchaCodeFilter, UsernamePasswordAuthenticationFilter.class)
      .addFilterBefore(jwtTokenAuthenticationFilter,UsernamePasswordAuthenticationFilter.class)
      .headers().frameOptions().disable()//允许显示iframe，禁用x-frame-options头。（为h2管理页面临时设置）

      .and()
      .csrf().disable()//停用csrf，使post请求无需csrf参数
      .rememberMe()//开启remember-me功能
//                .rememberMeParameter("remember-me")//自定义remember-me参数字段
//                .rememberMeCookieName("remember-me")//自定义remember-me的cookie字段
      .tokenValiditySeconds(24 * 60 * 60)//remember-me的过期时间，只要remember-me没过期，就会自动登录
      .tokenRepository(new JdbcTokenRepositoryImpl() {{
        setDataSource(dataSource);
        setCreateTableOnStartup(true);
      }})//配置remember-me的token持久化，使服务重启后仍可记录之前的remember-me信息

      .and()
      .logout()
      .logoutUrl(StaticKey.SECURITY_LOGOUT_URL)
      .logoutSuccessHandler(myLogoutSuccessHandler)
//                .logoutSuccessUrl("/logout.html")
      .deleteCookies("JSESSIONID")//清除指定的cookie

      .and()
      .formLogin()
      .successHandler(myAuthenticationSuccessHandler)//自定义登录成功后的动作(不能与defaultSuccessUrl()同时使用，因其总是会跳转，前端无法接收myAuthenticationSuccessHandler的自定义返回值)
      .failureHandler(myAuthenticationFailureHandler)//自定义登录成功后的动作(不能与failureForwardUrl()同时使用，因其总是会跳转，前端无法接收myAuthenticationFailureHandler的自定义返回值)
//                .defaultSuccessUrl("/index.html")//登录成功跳转网页
//                .failureForwardUrl("/login.html?failure")//登录失败跳转网页
      .usernameParameter(StaticKey.SECURITY_USERNAME_PARAMETER)//登录表单自定义用户名参数
      .passwordParameter(StaticKey.SECURITY_PASSWORD_PARAMETER)//登录表单自定义密码参数
      .loginPage(StaticKey.SECURITY_LOGIN_PAGE)//自定义登录页
      .loginProcessingUrl(StaticKey.SECURITY_LOGIN_PROCESSING_URL)//后台接收登录请求的url

      .and()
      .authorizeRequests()//需要身份认证
//                .antMatchers("/login.html", "/invalid.html").permitAll()//登录页允许直接访问
      .antMatchers("/index.html", "/").authenticated()
      .antMatchers("/page1.html").hasAnyAuthority("ROLE_admin", "ROLE_user")
      //.antMatchers("/page1.html").hasAnyRole("user","admin")//同hasAnyAuthority使用了ROLE_前缀的值
      .antMatchers("/page2.html").hasAnyAuthority("ROLE_admin", "ROLE_user")
      .antMatchers("/page3.html").hasAnyAuthority("ROLE_admin", "page3")
      .antMatchers("/page4.html").hasAnyAuthority("ROLE_admin", "page4")
      .antMatchers("/page5.html").access("@myRBACService.hasPermission(request,authentication)")//request,authentication不能修改，是固定值

      .and()
      .sessionManagement()
//      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)//如果仅使用jwt，可禁用session
//                .invalidSessionUrl("/invalid.html")//session过期后跳转url
      .invalidSessionStrategy(myInvalidSessionStrategy)
      .sessionFixation()
      .migrateSession()//sessionId更新策略
      .maximumSessions(1)//（需要重写UserDetails的比较方式）
      .maxSessionsPreventsLogin(false)//true不允许登录，false允许登录，最旧的被踢掉
      .expiredSessionStrategy(myExpiredSessionStrategy)
//                .expiredUrl("/expired.html")//由于超过最大登录数限制，导致session失效的跳转

      .and();
  }
//    sessionCreationPolicy字段：
//    ALWAYS        每次请求都创建新的session
//    NEVER         从不创建session，但会使用已经存在的session
//    IF_REQUIRED   （默认）如果需要则创建。无session则创建，有session则使用已经存在的
//    STATELESS     从不创建，也不使用已有session（无状态）

  //    同一个cookies的SESSIONID用户：
//    migrateSession        （默认）每次请求创建新的session，复制属性，生成SESSIONID，旧SESSIONID失效
//    changeSessionId       使用已有session，只重新生成一个SESSIONID，旧SESSIONID失效
//    newSession            将创建一个全新的session，生成SESSIONID（旧SESSIONID失效）
//    none                  SESSIONID一致可用（不安全）
//    以上策略中SESSIONID改变一般是在登录前后，会使用不同的SESSIONID
  @Override
  protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
//        authenticationManagerBuilder
//                .inMemoryAuthentication()//设置静态的用户信息
//                //设置一个静态用户
//                .withUser("user")//用户名
//                .password(passwordEncoder().encode("123"))//密码
//                .authorities("page3", "ROLE_user")
//
//                .and()
//                .withUser("admin")//用户名
//                .password(passwordEncoder().encode("123"))//密码
//                .roles("admin")
//
//                .and()
//                .passwordEncoder(passwordEncoder());//密码加密解密方法

    authenticationManagerBuilder
      .userDetailsService(myUserDetailsService)
      .passwordEncoder(new BCryptPasswordEncoder());
  }

  @Override
  public void configure(WebSecurity webSecurity) {
    webSecurity.ignoring().antMatchers(
            "/css/**", "/js/**"
//            ,"/jwtLogin","/kaptcha","/smsCode"//验证码等登录api无需验证
    );
  }

  @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }
}
