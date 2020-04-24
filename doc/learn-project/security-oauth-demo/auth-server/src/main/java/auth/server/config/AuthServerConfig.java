package auth.server.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.approval.JdbcApprovalStore;
import org.springframework.security.oauth2.provider.code.JdbcAuthorizationCodeServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;

import javax.sql.DataSource;
import java.security.KeyPair;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableAuthorizationServer
public class AuthServerConfig extends AuthorizationServerConfigurerAdapter {

    private final MyUserDetailsService myUserDetailsService;

    public AuthServerConfig(MyUserDetailsService myUserDetailsService) {
        this.myUserDetailsService = myUserDetailsService;
    }

    // 一、账号\密码\client_id  换取 授权码
    // http://localhost:8080/oauth/authorize?response_type=code&client_id=<client_id>
    // http://localhost:8080/oauth/authorize?response_type=code&client_id=client_1
    // 二、授权码\client_id\secret_id  换取 accessToken
    // 默认仅可POST请求，参数均在URL中。也可配置开放GET请求，使用.allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST);
    // http://<client_id>:<secret_id>@localhost:8080/oauth/token?grant_type=authorization_code&code=<授权码>
    // http://client_1:secret_1@localhost:8080/oauth/token?grant_type=authorization_code&code=XXXXXX
    // 若使用以下方式传参数，需配置开启allowFormAuthenticationForClients()，且开启后，以上url中携带client_id,client_secret方式无法使用
    // 默认认证策略：
    //      1、client_id与secret_id在URL中时，使用basic认证。
    //      2、client_id与secret_id不在URL中，使用ClientCredentialsTokenEndpointFilter
    // http://localhost:8080/oauth/token
    // x-www-form-urlencoded
    // grant_type       authorization_code
    // code             vrYZYn
    // client_secret    secret_1
    // client_id        client_1
    // 三、使用accessToken请求资源
    // http://localhost:8081/content/page1?access_token=56dd70b4-c7c9-4a33-8ab7-6d0e9d5476ad
    // 或
    // http://localhost:8081/content/page1
    // header中：Authorization: Bearer 56dd70b4-c7c9-4a33-8ab7-6d0e9d5476ad
    // 四、刷新token
    // 需先配置userDetailsService
    // http://localhost:8080/oauth/token?grant_type=refresh_token&client_id=client_1&client_secret=secret_1&refresh_token=82492404-772f-43d0-a613-8a4d2ba5f3d8
    // 五、检查token
    // http://localhost:8080/oauth/check_token?token=56dd70b4-c7c9-4a33-8ab7-6d0e9d5476ad

    @Override
    public void configure(ClientDetailsServiceConfigurer clientDetailsServiceConfigurer) throws Exception {
        clientDetailsServiceConfigurer
                .jdbc(dataSource())//client信息持久化[oauth_client_details]。其中client_secret要加密后的
//                //硬编码
//                .inMemory()
//                .withClient("client_1")
//                .secret(new BCryptPasswordEncoder().encode("secret_1"))
//                .resourceIds("resource_1")//可用的资源id，若不配置，可用所有
//                .authorizedGrantTypes("authorization_code")//授权模式
//                .scopes("all")//授权范围，可当做权限值使用
//                .redirectUris("http://www.baidu.com")//回调地址
//                .accessTokenValiditySeconds(3600)//access_token有效时间，秒。默认12小时（见DefaultTokenServices）
//                .refreshTokenValiditySeconds(86400 * 7)//刷新access_token用的refresh_token有效时间，秒。默认30天（见DefaultTokenServices）
//                //数据库读取
        ;
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {

        endpoints
                .approvalStore(new JdbcApprovalStore(dataSource()))//approval持久化[oauth_approvals]（同意、否决可用授权）
                .authorizationCodeServices(new JdbcAuthorizationCodeServices(dataSource()))//code持久化[oauth_code]
                .userDetailsService(myUserDetailsService)//使用refresh_token时必须配置自定义userDetailsService
                .tokenStore(tokenStore())//token持久化[oauth_access_token]
                .tokenEnhancer((accessToken, authentication) -> {
                    UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                    final Map<String, Object> additionalInfo = new HashMap<>();
                    additionalInfo.put("username", userDetails.getUsername());
                    ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
                    return accessToken;
                })
//                .tokenServices(new DefaultTokenServices(){{
//                    setTokenStore(endpoints.getTokenStore());
//                    setSupportRefreshToken(true);
//                    setReuseRefreshToken(true);
//                    setClientDetailsService(endpoints.getClientDetailsService());
//                    setTokenEnhancer(endpoints.getTokenEnhancer());
//                }})
                .accessTokenConverter(jwtAccessTokenConverter())
//                .pathMapping("/oauth/confirm_access", "/custom/confirm_access")//授权页面替换自定义uri
//                .allowedTokenEndpointRequestMethods(HttpMethod.GET, HttpMethod.POST)
        ;

    }

    //使用非对称加密算法来对Token进行签名
    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        KeyPair keyPair = new KeyStoreKeyFactory(new ClassPathResource("keystore.jks"), "foobar".toCharArray()).getKeyPair("test");
        converter.setKeyPair(keyPair);
        return converter;
    }

    //注册一个密码加密器
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    //注册一个TokenStore
    @Bean
    public TokenStore tokenStore() {
        return new JdbcTokenStore(dataSource());
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer oauthServer) {
        oauthServer
//                .tokenKeyAccess("permitAll()")// 开启/oauth/token_key验证端口无权限访问
//                .checkTokenAccess("permitAll()")// 开启/oauth/check_token验证端口认证权限访问
                .allowFormAuthenticationForClients();

    }
}
