package sso.server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.Map;
@RestController
@RequestMapping("/dashboard")
public class InfoController {
    @RequestMapping("/message")
    public Map<String, Object> dashboard() {
        return Collections.<String, Object>singletonMap("message", "Yay!");
    }

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }
}
