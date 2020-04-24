package auth.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserInfoController {
    private final TokenStore tokenStore;

    public UserInfoController(TokenStore tokenStore) {
        this.tokenStore = tokenStore;
    }

    @RequestMapping("/userInfo")
    public Principal principal(Principal principal) {
        return principal;
    }

    @RequestMapping("/user")
    @ResponseBody
    public Map<String, Object> user(@RequestHeader String authorization) {
        //必须通过客户端{携带的token在服务端的token存储中获取用户信息。
        //header中 Authorization传过来的格式为[type token]的格式
        //因此必须先对Authorization传过来的数据进行分隔authorization.split(" ")[1]才是真正的token
        Map<String, Object> map = new HashMap<>();
        OAuth2Authentication oAuth2Authentication = null;
        try {
            oAuth2Authentication = tokenStore.readAuthentication(authorization.split(" ")[1]);
            if (oAuth2Authentication == null) {
                map.put("error", "invalid token !");
                return map;
            }
        } catch (Exception e) {
            e.printStackTrace();
            map.put("error", e);
            return map;
        }
        //注意这两个key都不能随便填，都是和客户端进行数据处理时进行对应的。
        Object principal = oAuth2Authentication.getPrincipal();
        Authentication userAuthentication = oAuth2Authentication.getUserAuthentication();
        map.put("user", userAuthentication);
        map.put("name", userAuthentication.getName());
        Collection<GrantedAuthority> authorities = oAuth2Authentication.getAuthorities();
        map.put("authorities", authorities);
        return map;

    }

}
