package resource1.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

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

//    @Override
//    public void configure(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .authorizeRequests()
//                .antMatchers("/r1a1").hasAnyAuthority("r1a1")
//                .antMatchers("/r1a2").hasAnyAuthority("r1a2")
//        ;
//    }


}
