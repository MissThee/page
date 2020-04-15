package com.missthee.nettytest.config;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

public class PropertiesHelper {
    private static Properties prop;

    public PropertiesHelper() {
        if (prop == null) {
            prop = new Properties();
            try {
                InputStream resourceAsStream = Object.class.getResourceAsStream("/application.properties");
                prop.load(new InputStreamReader(resourceAsStream, "gbk"));     //文件流的编码方式
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public String get(String key) {
        return prop.getProperty(key);
    }
}
