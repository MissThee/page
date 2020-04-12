package com.example.securityauthdemo.config.auth.imagecode;

import com.example.securityauthdemo.config.auth.MyAuthenticationFailureHandler;
import com.example.securityauthdemo.utils.StaticKey;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class KaptchaCodeValidateFilter extends OncePerRequestFilter {
    private final DefaultKaptcha customKaptcha;
    private final MyAuthenticationFailureHandler myAuthenticationFailureHandler;

    public KaptchaCodeValidateFilter(MyAuthenticationFailureHandler myAuthenticationFailureHandler, @Qualifier("customKaptcha") DefaultKaptcha customKaptcha) {
        this.myAuthenticationFailureHandler = myAuthenticationFailureHandler;
        this.customKaptcha = customKaptcha;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        if ("/login".equals(httpServletRequest.getRequestURI()) && "post".equalsIgnoreCase(httpServletRequest.getMethod())) {
            //比较验证码
            try {
                validate(new ServletWebRequest(httpServletRequest));
                filterChain.doFilter(httpServletRequest, httpServletResponse);
            } catch (AuthenticationException e) {
                myAuthenticationFailureHandler.onAuthenticationFailure(httpServletRequest, httpServletResponse, e);
            }
        } else {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        }
    }

    private void validate(ServletWebRequest servletWebRequest) throws ServletRequestBindingException {
        HttpSession httpSession = servletWebRequest.getRequest().getSession();
        //拿取请求中的验证码
        String kaptchaTextInRequest = ServletRequestUtils.getStringParameter(servletWebRequest.getRequest(), StaticKey.KAPTCHA_REQUEST_KEY);
        if ("".equals(kaptchaTextInRequest) || kaptchaTextInRequest == null) {
            throw new SessionAuthenticationException("验证码不能为空");
        }
        //拿取session中的验证码
        Object kaptchaTextInSessionObj = httpSession.getAttribute(customKaptcha.getConfig().getSessionKey());
        Object kaptchaTextExpireDateObj = httpSession.getAttribute(customKaptcha.getConfig().getSessionDate());
        if (kaptchaTextInSessionObj == null || kaptchaTextExpireDateObj == null) {
            eraseSession(httpSession);
            throw new SessionAuthenticationException("验证码不存在");
        }
        if (((LocalDateTime) kaptchaTextExpireDateObj).isBefore(LocalDateTime.now())) {
            eraseSession(httpSession);
            throw new SessionAuthenticationException("验证码已过期");
        }
        //比较验证码
        if (!kaptchaTextInSessionObj.toString().equals(kaptchaTextInRequest)) {
            throw new SessionAuthenticationException("验证码不正确");
        }
        eraseSession(httpSession);
    }
    private void eraseSession( HttpSession httpSession){
        httpSession.removeAttribute(customKaptcha.getConfig().getSessionKey());
        httpSession.removeAttribute(customKaptcha.getConfig().getSessionDate());
    }
}
