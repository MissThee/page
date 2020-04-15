package com.example.securityauthdemo.config.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.session.InvalidSessionStrategy;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class MyInvalidSessionStrategy implements InvalidSessionStrategy {
    private static ObjectMapper objectMapper = new ObjectMapper();
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    @Value("${spring.security.loginType:json}")
    private String loginType;

    @Override
    public void onInvalidSessionDetected(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.getSession();//创建新的session，会返回新的JSESSIONID，和以下直接清除效果相同
//        response.addCookie(
//                new Cookie("JSESSIONID", "") {{//清除cookie中的JSESSIONID，否则一直被此此方法拦截，返回登录超时信息
//                    setMaxAge(0);
//                    setPath("/");
//                }}
//        );
        if (loginType.equals("json")) {
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(200);
            response.getWriter().write(objectMapper.writeValueAsString("登录超时，或失效。"));
        } else {
            response.sendRedirect("/invalid.html");
        }
    }


}
