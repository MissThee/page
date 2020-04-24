package sso.server.config;

import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoRestTemplateFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;

@Configuration
public class RestTemplateConfig {
    //注册一个可以中继用户身份信息的TestTemplate，用以在此服务中，使用用户传来的身份内心戏，获取其他资源服务的资源
    @Bean
    public OAuth2RestTemplate restTemplate(UserInfoRestTemplateFactory factory) {
        return factory.getUserInfoRestTemplate();
    }
}
