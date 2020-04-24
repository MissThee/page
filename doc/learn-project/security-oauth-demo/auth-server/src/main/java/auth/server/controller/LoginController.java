package auth.server.controller;

import org.springframework.security.oauth2.provider.AuthorizationRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

//thymeleaf登录页[3]
@Controller
@SessionAttributes("authorizationRequest")
public class LoginController {
    @GetMapping("/auth/login")
    public ModelAndView loginPage(Map<String, Object> model){
//        AuthorizationRequest authorizationRequest = (AuthorizationRequest) model.get("authorizationRequest");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("base-login");
        modelAndView.addObject("loginProcessUrl","/auth/login");
//        modelAndView.addObject("clientId", authorizationRequest.getClientId());
//        modelAndView.addObject("scopes", authorizationRequest.getScope());
        return modelAndView;
    }
}
