package com.example.securityauthdemo.config.auth.jwt;

import com.example.securityauthdemo.config.auth.MyUserDetailsService;
import org.h2.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtTokenAuthenticationFilter extends OncePerRequestFilter {
  private final JwtTokenUtil jwtTokenUtil;
  private final MyUserDetailsService myUserDetailsService;

  public JwtTokenAuthenticationFilter(JwtTokenUtil jwtTokenUtil, MyUserDetailsService myUserDetailsService) {
    this.jwtTokenUtil = jwtTokenUtil;
    this.myUserDetailsService = myUserDetailsService;
  }


  @Override
  protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
    String jwtToken = httpServletRequest.getHeader(jwtTokenUtil.getHeader());
    if (!StringUtils.isNullOrEmpty(jwtToken)) {
      //获取用户名，同时进行jwt合法性校验
      String username = jwtTokenUtil.getUsernameFromToken(jwtToken);
      if (!StringUtils.isNullOrEmpty(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
        if (jwtTokenUtil.validateToken(jwtToken)) {
          UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
          UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
          SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
          //填充了认证对象后，UsernamePasswordAuthenticationTokenFilter不会再次进行认证
        }
      }
    }
    filterChain.doFilter(httpServletRequest, httpServletResponse);
  }
}
