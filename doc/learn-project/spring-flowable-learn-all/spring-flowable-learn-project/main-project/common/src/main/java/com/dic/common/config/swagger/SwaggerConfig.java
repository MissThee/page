package com.dic.common.config.swagger;

import com.github.xiaoymin.swaggerbootstrapui.annotations.EnableSwaggerBootstrapUI;
import com.google.common.collect.Lists;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityScheme;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@EnableSwaggerBootstrapUI
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.dic"))
                .paths(PathSelectors.any())
                .build()
                .securityContexts(Lists.newArrayList(securityContext()))
                .securitySchemes(Lists.<SecurityScheme>newArrayList(apiKey()))
                .apiInfo(apiInfo());
    }

    //apiInfo对象主要是设置我们api文档的标题，描述，访问的地址，创建者等信息

    private ApiInfo apiInfo() {
        Contact contact = new Contact("重要！！：请进入左侧【文档管理】→【个性化设置】，勾选“启用SwaggerBootstrapUi提供的增强功能”，并刷新页面", null, null);
        return new ApiInfoBuilder()
                .title("接口文档")
                .description("重要！！：请进入左侧【文档管理】→【个性化设置】，勾选“启用SwaggerBootstrapUi提供的增强功能”，并刷新页面")
                .contact(contact)
                .version("1.0-SNAPSHOT")
                .build();
    }

    private ApiKey apiKey() {
        return new ApiKey("jwt的token值", "Authorization", "header");
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder()
//                .securityReferences()
                .forPaths(PathSelectors.regex("/.*"))
                .build();
    }
}