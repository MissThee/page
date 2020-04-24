package com.dic.socketio;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;
import com.dic.common.config.security.jwt.JavaJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

//SocketIOServer配置类
@Configuration
public class SocketIOServerConfig {
    private static String hostname;
    private static int port;
    private final JavaJWT javaJWT;

    @Autowired
    public SocketIOServerConfig(JavaJWT javaJWT) {
        this.javaJWT = javaJWT;
    }

    @Value("${socket.io.host:localhost}")
    public void setHostname(String a) {
        hostname = a;
    }

    @Value("${socket.io.port}")
    public void setPort(int a) {
        port = a;
    }

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname(hostname);
        config.setPort(port);
        config.setAuthorizationListener(data -> {//身份验证，直接使用jwt验证token
//            String token = data.getHttpHeaders().get("Authorization");
            String token = data.getSingleUrlParam("token");
            boolean result = false;
            try {
                result = javaJWT.verifyToken(token);
            } catch (Exception e) {
                e.printStackTrace();
            }
            return result;
        });

        return new SocketIOServer(config);
    }

    @Bean
    public SpringAnnotationScanner springAnnotationScanner(SocketIOServer socketServer) {
        return new SpringAnnotationScanner(socketServer);
    }
}
