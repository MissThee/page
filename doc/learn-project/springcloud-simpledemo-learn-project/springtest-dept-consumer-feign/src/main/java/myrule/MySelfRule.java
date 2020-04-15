package myrule;

import com.netflix.loadbalancer.IRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MySelfRule {
    //【ribbon自定义规则】为指定的微服务设置指定的负载规则。MySelfRule.class不能放在@ComponentScan注解作用的包及子包内，否则规则会被所有微服务共享
    //此类单独放置新包中原因：springboot启动类中@SpringBootApplication注解中包含@ComponentScan，且@SpringBootApplication在com作用范围为com包，故此类在此项目中不能放在com包下
    //ribbon规则配置类，靠@RibbonClient注解引用此配置，且此类需使用@Configuration注解，且此类不能被@componentScan扫描到
    @Bean
    public IRule myRule(){
        return new RandomRule_Custom1();
    }
}
