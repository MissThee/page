package com.missthee.businessproviderboot.config;

import com.missthee.interf.UserService;
import org.apache.dubbo.config.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;

@Configuration
public class Config {
    @Bean
    public ApplicationConfig applicationConfig() {
        ApplicationConfig applicationConfig = new ApplicationConfig();
        applicationConfig.setName("business-provider-boot");
        return applicationConfig;
    }

    @Bean
    public RegistryConfig registryConfig() {
        RegistryConfig registryConfig = new RegistryConfig();
        registryConfig.setAddress("zookeeper://127.0.0.1:2181");
        return registryConfig;
    }

    @Bean
    public MetadataReportConfig metadataReportConfig() {
        MetadataReportConfig metadataReportConfig = new MetadataReportConfig();
        metadataReportConfig.setAddress("zookeeper://127.0.0.1:2181");
        return metadataReportConfig;
    }

    @Bean
    public ProtocolConfig protocolConfig() {
        ProtocolConfig protocolConfig = new ProtocolConfig();
        protocolConfig.setName("dubbo");
        protocolConfig.setPort(20882);
        return protocolConfig;
    }

    @Bean
    public ServiceConfig<UserService> userServiceServiceConfig(ApplicationConfig applicationConfig, MetadataReportConfig metadataReportConfig, RegistryConfig registryConfig,ProtocolConfig protocolConfig, UserService userService) {
        ServiceConfig<UserService> serviceConfig = new ServiceConfig<>();
        serviceConfig.setApplication(applicationConfig);
        serviceConfig.setMetadataReportConfig(metadataReportConfig);
        serviceConfig.setRegistry(registryConfig);
        serviceConfig.setProtocol(protocolConfig);
        serviceConfig.setInterface(UserService.class);
        serviceConfig.setRef(userService);
        serviceConfig.setVersion("1.0.0");
        MethodConfig methodConfig = new MethodConfig();
        methodConfig.setName("getUserInfo");
        methodConfig.setTimeout(1000);

        serviceConfig.setMethods(new ArrayList<MethodConfig>() {{
            add(methodConfig);
        }});
        serviceConfig.export();//暴露方法，需在配置完其他项目后再调用。与@Service注解一起使用，会暴露出两个方法，配置独立
        return serviceConfig;
    }
}
