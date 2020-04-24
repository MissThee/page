package login.server.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
public class ResourceController {
    private static RestTemplate restTemplate = new RestTemplate();
    @RequestMapping("/userInfo")
    public String userInfo(@RequestHeader String authorization) {
        ResponseEntity<String> responseEntity = restTemplate.exchange("http://localhost:8080/oauth/check_token?token="+authorization.replace("Bearer ",""), HttpMethod.GET, null, String.class);
        return responseEntity.getBody();
    }
    @RequestMapping("/r1a1")
    public String r1a1(@RequestHeader String authorization) {
        return doRequest("http://localhost:9001/r1a1", authorization);
    }
    @RequestMapping("/r1a2")
    public String r1a2(@RequestHeader String authorization) {
        return doRequest("http://localhost:9001/r1a2", authorization);
    }
    @RequestMapping("/r2a1")
    public String r2a1(@RequestHeader String authorization) {
        return doRequest("http://localhost:9002/r2a1", authorization);
    }
    @RequestMapping("/r2a2")
    public String r2a2(@RequestHeader String authorization) {
        return doRequest("http://localhost:9002/r2a2", authorization);
    }
    @RequestMapping("/r1r2")
    public String r1r2(@RequestHeader String authorization) {
        return doRequest("http://localhost:9001/r1r2", authorization);
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
//        HttpHeaders headers = new HttpHeaders();
//        Enumeration<String> headerNames = request.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String key = (String) headerNames.nextElement();
//            String value = request.getHeader(key);
//            headers.add(key, value);
//        }
}
