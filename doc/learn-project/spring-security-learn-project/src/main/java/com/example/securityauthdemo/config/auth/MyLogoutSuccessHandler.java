package com.example.securityauthdemo.config.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
@Component
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {
    private static ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.security.loginType:json}")
    private String loginType;
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if(loginType.equals("json")) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(200);
            response.getWriter().write(objectMapper.writeValueAsString("登出成功"));
        }else {
            response.sendRedirect("/logout.html");
        }
    }
}
