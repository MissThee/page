package com.example.securityauthdemo.config.auth.jwt;

import com.example.securityauthdemo.config.auth.MyUserDetailsService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
public class JwtAuthService {
  private final AuthenticationManager authenticationManager;
  private final MyUserDetailsService myUserDetailsService;
  private final JwtTokenUtil jwtTokenUtil;

  public JwtAuthService(AuthenticationManager authenticationManager, MyUserDetailsService myUserDetailsService, JwtTokenUtil jwtTokenUtil) {
    this.authenticationManager = authenticationManager;
    this.myUserDetailsService = myUserDetailsService;
    this.jwtTokenUtil = jwtTokenUtil;
  }

  public String login(String username, String password) throws Exception {
    try {
      UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, password);
      Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (AuthenticationException e) {
      throw new Exception("用户名或密码不正确");
    }
    UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
    return jwtTokenUtil.generateToken(userDetails);
  }

  public String refreshToken(String oldToken) {
    if (!jwtTokenUtil.isTokenValidated(oldToken)) {
      return jwtTokenUtil.refreshToken(oldToken);
    }
    return null;
  }
}
