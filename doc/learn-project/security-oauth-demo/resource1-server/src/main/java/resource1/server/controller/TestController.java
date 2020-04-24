package resource1.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.client.OAuth2RestOperations;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
public class TestController {
    private final OAuth2RestOperations oAuth2RestOperations;
    private static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
    private static RestTemplate restTemplate = new RestTemplate();

    public TestController(OAuth2RestOperations oAuth2RestOperations) {
        this.oAuth2RestOperations = oAuth2RestOperations;
    }

    @RequestMapping("/r1p")
    public String principal(Principal principal) {
        return "resource1" + principal.getName();
    }

    @RequestMapping("/r1a1")
    @PreAuthorize("hasAnyAuthority('r1a1')")
    public String r1a1() {
        return "[ resource1 api1 " + simpleDateFormat.format(new Date()) + " ]";
    }

    @RequestMapping("/r1a2")
    @PreAuthorize("hasAnyAuthority('r1a2')")
    public String r1a2() {
        return "[ resource1 api2 " + simpleDateFormat.format(new Date()) + " ]";
    }

    @RequestMapping("/r1r2")
    public String relay(@RequestHeader String authorization) {
        return "resource1 fetch others: " + doRequest("http://localhost:9002/r2a1", authorization);
    }

    private String doRequest(String url, String authorization) {
        HttpEntity<String> requestEntity = new HttpEntity<>(
                null,
                new HttpHeaders() {{
                    add("authorization", authorization);
                }});
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
        return responseEntity.getBody();
    }
}
