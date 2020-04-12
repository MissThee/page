package com.example.securityauthdemo.controller;

import com.example.securityauthdemo.config.auth.jwt.JwtAuthService;
import com.example.securityauthdemo.utils.Res;
import lombok.Data;
import org.h2.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotEmpty;
import java.util.Map;

@RestController
public class JwtController {
  private final JwtAuthService jwtAuthService;

  public JwtController(JwtAuthService jwtAuthService) {
    this.jwtAuthService = jwtAuthService;
  }

  @RequestMapping("/jwtLogin")
  public Res login(@RequestBody JwtLoginRequestVO jwtLoginRequestVO) {
    String username = jwtLoginRequestVO.getUsername();
    if (StringUtils.isNullOrEmpty(username)) {
      return Res.failure("用户名不能为空");
    }
    String password = jwtLoginRequestVO.getPassword();
    if (StringUtils.isNullOrEmpty(password)) {
      return Res.failure("密码不能为空");
    }
    try {
      return Res.success(jwtAuthService.login(username, password));
    } catch (Exception e) {
      return Res.failure(e.getMessage());
    }
  }

  @RequestMapping("/jwtRefreshToken")
  public Res refresh(@RequestHeader("${jwt.header}") String token) {
    String newToken = jwtAuthService.refreshToken(token);
    return Res.success(newToken);
  }

  @Data
  public static class JwtLoginRequestVO {
    private String username;
    private String password;
  }
}
