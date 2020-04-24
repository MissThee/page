package resource2.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.authentication.TokenExtractor;

import javax.servlet.http.HttpServletRequest;

@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled =true,jsr250Enabled = true)
public class SecurityConfig extends ResourceServerConfigurerAdapter {
    @Value("${security.oauth2.resource-id:oauth2-resource}")
    private String resourceId;
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) {
        //设置resource_id，对应oauth_client_details中的resource_ids，有对应的资源，才可访问。（默认值为oauth2-resource）
        resources
                .resourceId(resourceId)
        ;
    }
}
