package com.example.securityauthdemo.config.auth.smscode.authentication;

import com.example.securityauthdemo.utils.StaticKey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
//类似    UsernamePasswordAuthenticationFilter 返回 UsernamePasswordToken
//此方法  SmsCodeAuthenticationFilter          返回 SmsCodeAuthenticationToken
//供之后的认证器判断支不支持进行认证。
public class SmsCodeAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    public SmsCodeAuthenticationFilter() {
        super(new AntPathRequestMatcher("/smsLogin", "POST"));
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String mobile = request.getParameter(StaticKey.SMS_MOBILE_REQUEST_KEY);
        mobile = mobile == null ? "" : mobile.trim();
        SmsCodeAuthenticationToken smsCodeAuthenticationToken = new SmsCodeAuthenticationToken(mobile);
        smsCodeAuthenticationToken.setDetails(authenticationDetailsSource.buildDetails(request));
        return this.getAuthenticationManager().authenticate(smsCodeAuthenticationToken);
    }
}
