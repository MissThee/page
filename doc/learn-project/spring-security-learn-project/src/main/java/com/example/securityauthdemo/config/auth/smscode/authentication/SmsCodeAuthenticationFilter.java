package com.example.securityauthdemo.config.auth.smscode.authentication;

import com.example.securityauthdemo.utils.StaticKey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;

//类似    UsernamePasswordAuthenticationFilter 返回 UsernamePasswordToken
//此方法  SmsCodeAuthenticationFilter          返回 SmsCodeAuthenticationToken
//供之后的认证器判断支不支持进行认证。
public class SmsCodeAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    public SmsCodeAuthenticationFilter() {
        super(new AntPathRequestMatcher("/smsLogin", "POST"));
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //验证短信验证码
        try {
            validateSmsCode(new ServletWebRequest(request));
        } catch (AuthenticationException | ServletRequestBindingException e) {
            throw new SessionAuthenticationException(e.getMessage());
        }
        //构建身份认证对象
        String mobile = request.getParameter(StaticKey.SMS_MOBILE_REQUEST_KEY);
        mobile = mobile == null ? "" : mobile.trim();
        SmsCodeAuthenticationToken smsCodeAuthenticationToken = new SmsCodeAuthenticationToken(mobile) {{
            setDetails(authenticationDetailsSource.buildDetails(request));
        }};
        return this.getAuthenticationManager().authenticate(smsCodeAuthenticationToken);
    }

    private void validateSmsCode(ServletWebRequest servletWebRequest) throws ServletRequestBindingException {
        HttpSession httpSession = servletWebRequest.getRequest().getSession();
        //拿取请求中的手机号
        String smsMobileInRequest = ServletRequestUtils.getStringParameter(servletWebRequest.getRequest(), StaticKey.SMS_MOBILE_REQUEST_KEY);
        if (smsMobileInRequest == null || "".equals(smsMobileInRequest.trim())) {
            throw new SessionAuthenticationException("手机号不能为空");
        }
        smsMobileInRequest = smsMobileInRequest.trim();
        //拿取请求中的验证码
        String smsCodeInRequest = ServletRequestUtils.getStringParameter(servletWebRequest.getRequest(), StaticKey.SMS_CODE_REQUEST_KEY);
        if (smsCodeInRequest == null || "".equals(smsCodeInRequest)) {
            throw new SessionAuthenticationException("短信验证码不能为空");
        }

        //拿取session中的验证码
        Object smsCodeInSessionObj = httpSession.getAttribute(StaticKey.SMS_CODE_SESSION_KEY);
        Object smsCodeDateInSessionObj = httpSession.getAttribute(StaticKey.SMS_CODE_DATE_SESSION_KEY);
        Object smsMobileInSessionObj = httpSession.getAttribute(StaticKey.SMS_MOBILE_SESSION_KEY);
        if (smsCodeInSessionObj == null || smsCodeDateInSessionObj == null || smsMobileInSessionObj == null) {
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

    private void eraseSession(HttpSession httpSession) {
        httpSession.removeAttribute(StaticKey.SMS_CODE_SESSION_KEY);
        httpSession.removeAttribute(StaticKey.SMS_CODE_DATE_SESSION_KEY);
        httpSession.removeAttribute(StaticKey.SMS_MOBILE_SESSION_KEY);
    }

}
