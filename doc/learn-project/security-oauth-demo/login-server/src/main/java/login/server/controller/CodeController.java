package login.server.controller;

import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import login.server.config.AuthParamConfig;

@RestController
public class CodeController {
    private final AuthParamConfig authParamConfig;
    private static RestTemplate restTemplate = new RestTemplate();

    public CodeController(AuthParamConfig authParamConfig) {
        this.authParamConfig = authParamConfig;
    }

    @GetMapping("code")
    public String code(@RequestParam String code) {
        String url = authParamConfig.getUriPrefix() + "/oauth/token";
        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(
                new LinkedMultiValueMap<String, String>() {{
                    add("code", code);
                    add("grant_type", "authorization_code");
                    add("client_id", authParamConfig.getClientId());
                    add("client_secret", authParamConfig.getClientSecret());
                }},
                new HttpHeaders() {{
                    setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                }});
        ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        String responseBody = responseEntity.getBody();
        System.out.println(responseBody);
        return responseBody;
    }
}
