package com.example.securityauthdemo.config.auth.imagecode;

import com.google.code.kaptcha.Constants;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.google.code.kaptcha.util.Config;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.util.Properties;

@Data
@PropertySource(value = {"classpath:kaptcha.properties"})
@Configuration
public class KaptchaConfig {
    @Value("${kaptcha.border}")
    private String border;
    @Value("${kaptcha.border.color}")
    private String borderColor;
    @Value("${kaptcha.image.width}")
    private String imageWidth;
    @Value("${kaptcha.image.height}")
    private String imageHeight;
    @Value("${kaptcha.testproducer.font.color}")
    private String fontColor;
    @Value("${kaptcha.testproducer.char.length}")
    private String charLength;
    @Value("${kaptcha.testproducer.font.names}")
    private String fontNames;
    @Value("${kaptcha.testproducer.font.size}")
    private String fontSize;

    @Bean("customKaptcha")
    public DefaultKaptcha customKaptcha() {
        DefaultKaptcha defaultKaptcha = new DefaultKaptcha();
        Properties properties = new Properties();
        properties.setProperty(Constants.KAPTCHA_BORDER, border);
        properties.setProperty(Constants.KAPTCHA_BORDER_COLOR, borderColor);
        properties.setProperty(Constants.KAPTCHA_IMAGE_WIDTH, imageWidth);
        properties.setProperty(Constants.KAPTCHA_IMAGE_HEIGHT, imageHeight);
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_COLOR, fontColor);
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_CHAR_LENGTH, charLength);
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_NAMES, fontNames);
        properties.setProperty(Constants.KAPTCHA_TEXTPRODUCER_FONT_SIZE, fontSize);
        defaultKaptcha.setConfig(new Config(properties));
        return defaultKaptcha;
    }
}
