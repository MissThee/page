package com.example.securityauthdemo.config.auth.smscode.authentication;

import com.example.securityauthdemo.utils.StaticKey;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SmsCodeAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    public SmsCodeAuthenticationFilter() {
        super(new AntPathRequestMatcher("/smsLogin", "POST"));
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String mobile = request.getParameter(StaticKey.SMS_MOBILE_REQUEST_KEY);
        mobile = mobile == null ? "" : mobile.trim();
        SmsCodeAuthenticationToken authRequest = new SmsCodeAuthenticationToken(mobile);
        authRequest.setDetails(authenticationDetailsSource.buildDetails(request));
        return this.getAuthenticationManager().authenticate(authRequest);
    }
}
