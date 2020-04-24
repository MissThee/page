package resource2.server.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@RestController
public class TestController {
    private static SimpleDateFormat simpleDateFormat= new SimpleDateFormat("HH:mm:ss");
    @PreAuthorize("hasAnyAuthority('r2a1')")
    @RequestMapping("/r2a1")
    public String r2a1() {
        return "[ resource2 api1 "+simpleDateFormat.format(new Date())+" ]" ;
    }
    @PreAuthorize("hasAnyAuthority('r2a2')")
    @RequestMapping("/r2a2")
    public String r2a2() {
        return "[ resource2 api2 "+simpleDateFormat.format(new Date())+" ]";
    }
}
