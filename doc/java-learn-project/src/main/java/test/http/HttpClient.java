package test.http;

import org.springframework.http.*;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

public class HttpClient {

    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<Map> httpEntity = new HttpEntity<>(
                new HashMap<String, Object>() {{
                    put("username", "admin");
                    put("password", "123");
                }},
                new HttpHeaders() {{
                    setContentType(MediaType.APPLICATION_JSON);
//            setBearerAuth("123");//Bearer 123
//            setBasicAuth("1","2");//Basic MToy(MToy为Base64加密结果，值为1:2)
                    set("Authorization", "token value");
                }}
        );
        Map<String, String> uriVariables = new HashMap<String, String>() {{
            put("param1", "a");
            put("param2", "b");
        }};

        StringBuilder url = new StringBuilder("http://localhost:8098/login");
        boolean hasUriVariables = false;
        for (String key : uriVariables.keySet()) {
            url.append(hasUriVariables ? "&" : "?")
                    .append(key)
                    .append("=")
                    .append("{").append(key).append("}");
            hasUriVariables = true;
        }
        try {
            ResponseEntity<Map> result = restTemplate.exchange(url.toString(), HttpMethod.POST, httpEntity, Map.class, uriVariables);
            System.out.println(result);
        } catch (HttpServerErrorException e) {
            System.out.println("5xx");
            e.printStackTrace();
        }
    }
}
