package test.http;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class SimpleHttpServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8099), 0);//第二参数为可同时处理的请求个数，小于等于0时使用默认值50
        server.createContext("/test", new TestHandler());
        server.start();
    }
}
