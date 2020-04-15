package com.example.securityauthdemo.config.auth.smscode.filter;

import com.example.securityauthdemo.config.auth.MyAuthenticationFailureHandler;
import com.example.securityauthdemo.utils.StaticKey;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
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
public class SmsCodeValidateFilter extends OncePerRequestFilter {
    private final MyAuthenticationFailureHandler myAuthenticationFailureHandler;

    public SmsCodeValidateFilter(MyAuthenticationFailureHandler myAuthenticationFailureHandler) {
        this.myAuthenticationFailureHandler = myAuthenticationFailureHandler;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        if ("/smsLogin".equals(httpServletRequest.getRequestURI()) && "post".equalsIgnoreCase(httpServletRequest.getMethod())) {
            //比较短信验证码
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
        //拿取请求中的短信验证码
        String smsMobileInRequest = ServletRequestUtils.getStringParameter(servletWebRequest.getRequest(), StaticKey.SMS_MOBILE_REQUEST_KEY);
        if ("".equals(smsMobileInRequest) || smsMobileInRequest == null) {
            throw new SessionAuthenticationException("手机号不能为空");
        }
        //拿取请求中的手机号
        String smsCodeInRequest = ServletRequestUtils.getStringParameter(servletWebRequest.getRequest(), StaticKey.SMS_CODE_REQUEST_KEY);
        if ("".equals(smsCodeInRequest) || smsCodeInRequest == null) {
            throw new SessionAuthenticationException("短信验证码不能为空");
        }

        //拿取session中的验证码
        Object smsCodeInSessionObj = httpSession.getAttribute(StaticKey.SMS_CODE_SESSION_KEY);
        Object smsCodeDateInSessionObj = httpSession.getAttribute(StaticKey.SMS_CODE_DATE_SESSION_KEY);
        Object smsMobileInSessionObj = httpSession.getAttribute(StaticKey.SMS_MOBILE_SESSION_KEY);
        if (smsCodeInSessionObj == null || smsCodeDateInSessionObj == null||smsMobileInSessionObj==null) {
            eraseSession(httpSession);
            throw new SessionAuthenticationException("短信验证码不存在");
        }
        if (((LocalDateTime) smsCodeDateInSessionObj).isBefore(LocalDateTime.now())) {
            eraseSession(httpSession);
            throw new SessionAuthenticationException("短信验证码已过期");
        }
        //比较手机号
        if (!smsMobileInSessionObj.toString().equals(smsMobileInRequest)) {
            throw new SessionAuthenticationException("手机号不正确");
        }
        //比较短信验证码
        if (!smsCodeInSessionObj.toString().equalsIgnoreCase(smsCodeInRequest)) {
            throw new SessionAuthenticationException("验证码不正确");
        }
        eraseSession(httpSession);
    }
    private void eraseSession( HttpSession httpSession){
        httpSession.removeAttribute(StaticKey.SMS_CODE_SESSION_KEY);
        httpSession.removeAttribute(StaticKey.SMS_CODE_DATE_SESSION_KEY);
        httpSession.removeAttribute(StaticKey.SMS_MOBILE_SESSION_KEY);
    }
}
