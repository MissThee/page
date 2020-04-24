package auth.server.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final MyUserDetailsService myUserDetailsService;
    private static ObjectMapper objectMapper = new ObjectMapper();

    public SecurityConfig(MyUserDetailsService myUserDetailsService) {
        this.myUserDetailsService = myUserDetailsService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                //避免登录页403，配置.formLogin().permitAll() 和 .antMatchers("/oauth/authorize").permitAll()
                .formLogin()
                .loginPage("/auth/login")//指定自定义login页面。若使用静态页，配置/auth/login.html
                .loginProcessingUrl("/auth/login")//指定登录请求地址，不指定会使用loginPage的路径
                .permitAll()
//                .and().csrf().disable()
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))//启用csrf后，logout默认只能post请求，配置可使用get
                .and()
                .authorizeRequests()
                .antMatchers("/oauth/authorize").permitAll()
                .antMatchers("/user").permitAll()
                .anyRequest().authenticated()
                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        ;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(myUserDetailsService)
        ;
    }


    @Override
    public void configure(WebSecurity web) throws Exception {
        //使用access_token进行访问时，检查token的请求直接放行。不配置则500错误
        //配置忽略favicon.ico验证，并放置一个favicon，防止默认登录页请求favicon时302跳转
        web.ignoring().antMatchers("/oauth/check_token", "/favicon.ico");
    }
}
