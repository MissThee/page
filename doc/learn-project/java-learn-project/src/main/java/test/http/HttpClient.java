package test.http;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.Map.Entry;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpClient {
  public static void main(String[] args) {
    System.out.println(doGet("http://localhost:8099/test?a=1"));
    System.out.println(doPostForm("http://localhost:8099/test?a=2", new HashMap<String, Object>() {{
      put("c", "1");
    }}));
    System.out.println(doPostJSON("http://localhost:8099/test?a=3", "{\"b\":\"1\"}"));
  }

  public static String doGet(String url) {
    CloseableHttpClient httpClient = null;
    CloseableHttpResponse response = null;
    String result = "";
    try {
      // 通过址默认配置创建一个httpClient实例
      httpClient = HttpClients.createDefault();
      // 创建httpGet远程连接实例
      HttpGet httpGet = new HttpGet(url);
      // 设置请求头信息，鉴权
      httpGet.setHeader("Authorization", "Bearer da3efcbf-0845-4fe3-8aba-ee040be542c0");
      // 为httpGet实例设置配置
      httpGet.setConfig(
        RequestConfig.custom().setConnectTimeout(35000)// 连接主机服务超时时间
          .setConnectionRequestTimeout(35000)// 请求超时时间
          .setSocketTimeout(60000)// 数据读取超时时间
          .build()
      );
      // 执行get请求得到返回对象
      response = httpClient.execute(httpGet);
      // 通过返回对象获取返回数据
      HttpEntity entity = response.getEntity();
      // 通过EntityUtils中的toString方法将结果转换为字符串
      result = EntityUtils.toString(entity);
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      // 关闭资源
      if (null != response) {
        try {
          response.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (null != httpClient) {
        try {
          httpClient.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
    return result;
  }

  public static String doPostForm(String url, Map<String, Object> paramMap) {
    CloseableHttpResponse httpResponse = null;
    String result = "";
    // 创建httpClient实例
    CloseableHttpClient httpClient = HttpClients.createDefault();
    // 创建httpPost远程连接实例
    HttpPost httpPost = new HttpPost(url);
    // 为httpPost实例设置配置
    httpPost.setConfig(
      RequestConfig.custom().setConnectTimeout(35000)// 设置连接主机服务超时时间
        .setConnectionRequestTimeout(35000)// 设置连接请求超时时间
        .setSocketTimeout(60000)// 设置读取数据连接超时时间
        .build()
    );
    // 设置请求头
    httpPost.addHeader(HttpHeaders.CONTENT_TYPE, ContentType.APPLICATION_FORM_URLENCODED.getMimeType());
    // 封装post请求参数
    if (null != paramMap && paramMap.size() > 0) {
      List<NameValuePair> nvps = new ArrayList<>();
      // 通过map集成entrySet方法获取entity
      Set<Entry<String, Object>> entrySet = paramMap.entrySet();
      // 循环遍历，获取迭代器
      for (Entry<String, Object> mapEntry : entrySet) {
        nvps.add(new BasicNameValuePair(mapEntry.getKey(), mapEntry.getValue().toString()));
      }
      // 为httpPost设置封装好的请求参数
      try {
        httpPost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      }
    }
    try {
      // httpClient对象执行post请求,并返回响应参数对象
      httpResponse = httpClient.execute(httpPost);
      // 从响应对象中获取响应内容
      HttpEntity entity = httpResponse.getEntity();
      result = EntityUtils.toString(entity);
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      // 关闭资源
      if (null != httpResponse) {
        try {
          httpResponse.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (null != httpClient) {
        try {
          httpClient.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
    return result;
  }

  public static String doPostJSON(String url, String jsonStr) {
    CloseableHttpResponse httpResponse = null;
    String result = "";
    // 创建httpClient实例
    CloseableHttpClient httpClient = HttpClients.createDefault();
    // 创建httpPost远程连接实例
    HttpPost httpPost = new HttpPost(url);
    // 为httpPost实例设置配置
    httpPost.setConfig(
      RequestConfig.custom().setConnectTimeout(35000)// 设置连接主机服务超时时间
        .setConnectionRequestTimeout(35000)// 设置连接请求超时时间
        .setSocketTimeout(60000)// 设置读取数据连接超时时间
        .build()
    );
    // 设置请求头
    httpPost.addHeader(HttpHeaders.CONTENT_TYPE, ContentType.APPLICATION_JSON.getMimeType());
    // 封装post请求参数
    if (null != jsonStr && jsonStr.length() > 0) {
      // 为httpPost设置封装好的请求参数
      httpPost.setEntity(new StringEntity(jsonStr, "UTF-8"));
    }
    try {
      // httpClient对象执行post请求,并返回响应参数对象
      httpResponse = httpClient.execute(httpPost);
      // 从响应对象中获取响应内容
      HttpEntity entity = httpResponse.getEntity();
      result = EntityUtils.toString(entity);
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      // 关闭资源
      if (null != httpResponse) {
        try {
          httpResponse.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
      if (null != httpClient) {
        try {
          httpClient.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
    return result;
  }
}
