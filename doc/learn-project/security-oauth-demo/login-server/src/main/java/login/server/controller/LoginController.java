package login.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import login.server.config.AuthParamConfig;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class LoginController {
    private final AuthParamConfig authParamConfig;

    public LoginController(AuthParamConfig authParamConfig) {
        this.authParamConfig = authParamConfig;
    }

    @GetMapping("login")
    public void login(HttpServletResponse response, @RequestParam("state") String state) throws IOException {
        response.sendRedirect(authParamConfig.getUriPrefix() + "/oauth/authorize?response_type=code&client_id=" + authParamConfig.getClientId() + "&state=" + state);
    }

}
