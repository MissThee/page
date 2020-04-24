package com.example.securityauthdemo.config.auth.smscode;

import com.example.securityauthdemo.utils.StaticKey;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.Random;

@Component
public class SmsCodeBuilder {
    public String buildAndSaveToSession(String mobile) {
        if(mobile==null||"".equals(mobile.trim())){
            throw new NullPointerException("手机号不能为空");
        }
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (requestAttributes == null) {
            throw new NullPointerException("请求异常，无法获取请求信息");
        }
        HttpSession httpSession = requestAttributes.getRequest().getSession();
        String code = buildCode(6);
        httpSession.setAttribute(StaticKey.SMS_CODE_SESSION_KEY,code);
        httpSession.setAttribute(StaticKey.SMS_CODE_DATE_SESSION_KEY,LocalDateTime.now().plusMinutes(5));
        httpSession.setAttribute(StaticKey.SMS_MOBILE_SESSION_KEY, mobile.trim());
        return code;
    }

    private static String buildCode(Integer length) {
        String base = "0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }
}
