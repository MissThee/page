package test.http;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import sun.misc.IOUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class TestHandler implements HttpHandler {
  @Override
  public void handle(HttpExchange exchange) {
    new Thread(() -> {
      OutputStream os = null;
      try {
        HashMap<String, Object> hashMap = new HashMap<>();
        //获得查询字符串(get)
        String queryString = exchange.getRequestURI().getQuery();
        hashMap.put("paramInfo", queryString);
        //获得表单提交数据(post)
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = exchange.getRequestBody().read(buffer)) != -1) {
          result.write(buffer, 0, length);
        }
        hashMap.put("bodyInfo", result.toString("UTF-8"));
        //设置返回状态码
        exchange.sendResponseHeaders(200, 0);
        os = exchange.getResponseBody();
        os.write(hashMap.toString().getBytes());
      } catch (Exception e) {
        e.printStackTrace();
      } finally {
        try {
          if (os != null) {
            os.close();
          }
        } catch (IOException e1) {
          e1.printStackTrace();
        }
      }
    }).start();
  }
}
