package com.example.securityauthdemo.config.auth.imagecode;

import com.google.code.kaptcha.impl.DefaultKaptcha;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.time.LocalDateTime;

@Component
public class KaptchaBuilder {
    private final DefaultKaptcha customKaptcha;

    public KaptchaBuilder(@Qualifier("customKaptcha") DefaultKaptcha customKaptcha) {
        this.customKaptcha = customKaptcha;
    }

    public BufferedImage buildAndSaveToSession() {
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if(requestAttributes==null){
            throw new NullPointerException("请求异常，无法获取请求信息");
        }
        HttpSession httpSession = requestAttributes.getRequest().getSession();
        //生成验证文字
        String kaptchaText = customKaptcha.createText();
        httpSession.setAttribute(customKaptcha.getConfig().getSessionKey(), kaptchaText);
        httpSession.setAttribute(customKaptcha.getConfig().getSessionDate(), LocalDateTime.now().plusMinutes(1));
        //生成验证图片
        BufferedImage kaptchaImage = customKaptcha.createImage(kaptchaText);
        return kaptchaImage;
    }
}
