package login.server.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth.server")
@Data
public class AuthParamConfig {
    private String uriPrefix;
    private String clientId;
    private String clientSecret;
}
