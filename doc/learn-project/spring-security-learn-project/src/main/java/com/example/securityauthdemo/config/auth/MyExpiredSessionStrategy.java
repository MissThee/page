package com.example.securityauthdemo.config.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.session.SessionInformationExpiredEvent;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
@Component
public class MyExpiredSessionStrategy implements SessionInformationExpiredStrategy {
    private static ObjectMapper objectMapper = new ObjectMapper();

    @Value("${spring.security.loginType:json}")
    private String loginType;
    @Override
    public void onExpiredSessionDetected(SessionInformationExpiredEvent sessionInformationExpiredEvent) throws IOException, ServletException {
        HttpServletResponse response = sessionInformationExpiredEvent.getResponse();
        if(loginType.equals("json")) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(200);
            response.getWriter().write(objectMapper.writeValueAsString("登录信息失效，已在别处登录"));
        }else {
            response.sendRedirect("/expired.html");
        }
    }
}
