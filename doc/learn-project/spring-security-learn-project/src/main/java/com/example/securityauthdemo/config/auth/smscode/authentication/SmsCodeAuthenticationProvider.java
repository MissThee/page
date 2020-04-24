package com.example.securityauthdemo.config.auth.smscode.authentication;

import com.example.securityauthdemo.config.auth.smscode.SmsCodeUserDetailsService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class SmsCodeAuthenticationProvider implements AuthenticationProvider {

    private SmsCodeUserDetailsService smsCodeUserDetailsService;

    public void setSmsCodeUserDetailsService(SmsCodeUserDetailsService smsCodeUserDetailsService) {
        this.smsCodeUserDetailsService = smsCodeUserDetailsService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        //

        SmsCodeAuthenticationToken smsCodeAuthenticationToken = (SmsCodeAuthenticationToken) authentication;
        UserDetails userDetails = smsCodeUserDetailsService.loadUserByUsername((String) smsCodeAuthenticationToken.getPrincipal());
        if (userDetails == null) {
            throw new InternalAuthenticationServiceException("无法获取用户信息");
        }
        SmsCodeAuthenticationToken smsCodeAuthenticationTokenResult = new SmsCodeAuthenticationToken(userDetails.getUsername(), userDetails.getAuthorities()) {{
            setDetails(smsCodeAuthenticationToken.getDetails());
        }};
        return smsCodeAuthenticationTokenResult;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        //支持验证何种类型的对象。此对象由AbstractAuthenticationProcessingFilter的attemptAuthentication()实现提供
        return SmsCodeAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
