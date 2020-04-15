package com.example.securityauthdemo.controller;

import com.example.securityauthdemo.config.auth.imagecode.KaptchaBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.IOException;

@RestController
public class KaptchaController {
    private final KaptchaBuilder kaptchaBuilder;

    public KaptchaController(KaptchaBuilder kaptchaBuilder) {
        this.kaptchaBuilder = kaptchaBuilder;
    }

    @RequestMapping("/kaptcha")
    public void kaptcha(HttpSession httpSession, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        httpServletResponse.setDateHeader("Expires", 0);//旧版控制缓存头，设置时间点
        httpServletResponse.setHeader("Cache-control", "no-store,no-cache,must-revalidate");
        httpServletResponse.setHeader("Cache-control", "post-check=0,pre-check=0");
        httpServletResponse.setHeader("Cache-control", "max-age=0");//新版控制缓存头，设置时长
        httpServletResponse.setHeader("Pragma", "no-cache");
        httpServletResponse.setContentType("image/jpeg");
        //生成验证码保存到session中，拿取对应图片
        BufferedImage kaptchaImage =  kaptchaBuilder.buildAndSaveToSession();
        //返回图
        try (ServletOutputStream outputStream = httpServletResponse.getOutputStream()) {
            ImageIO.write(kaptchaImage, "jpg", outputStream);
            outputStream.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    //http 缓存
//    强缓存：
//    Pragma：陈旧的控制缓存，如：Pragma:no-cache  禁用缓存
//    Cache-control：新版控制缓存过期，如：
//                  private:     客户端可以缓存（不写则默认此值）
//                  public:      客户端和代理服务器都可缓存
//                  max-age=xxx: 缓存的内容将在 xxx 秒后失效
//                  no-cache:    需要使用对比缓存来验证缓存数据
//                  no-store:    所有内容都不会缓存，强制缓存、对比缓存都不会触发
//    Expires：旧版控制缓存过期，如：Expires:Wed, 21 Oct 2015 07:28:00 GMT
//    对比缓存
//    ETag：使用MD5叫校验过期，如：
//                  后台返回前端：ETag:440e123c245615c51b4
//                  前端下次请求：If-None-Match:440e123c245615c51b4  如果匹配上了，文件没改过，直接返回304，无响应体，使用缓存，无需再次请求；否则返回内容
//    Last-Modified：使用日期校验，如：
//                  后台返回前端：Last-Modified:Wed, 21 Oct 2015 07:28:00 GMT
//                  前端下次请求：If-Modified-Since:Wed, 21 Oct 2015 07:28:00 GMT 如果与后台的Last-Modified时间相同，则直接返回304


//    多种缓存同时存在的优先级
//    Cache-control 覆盖 Expire。此时expires无论有没有过期，都无效。
//    Etag 覆盖 Last-Modified。Last-Modified不会生效。
//    pragma 覆盖 Cache-control。

//    多种浏览器行为同步 解决有的304，有的直接使用缓存，同一使用304：
//    1、设置cache-control:public, max-age=0;
//    2、设置cache-control:max-age=1000;

}
