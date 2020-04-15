package com.example.securityauthdemo.controller;

import com.example.securityauthdemo.config.auth.smscode.SmsCodeBuilder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
public class SmsCodeController {
    private final SmsCodeBuilder smsCodeBuilder;

    public SmsCodeController(SmsCodeBuilder smsCodeBuilder) {
        this.smsCodeBuilder = smsCodeBuilder;
    }

    @RequestMapping("/smsCode")
    public void smsCode(@RequestParam String mobile, HttpSession httpSession) {
        String code = smsCodeBuilder.buildAndSaveToSession(mobile);
        System.out.println("验证码："+code + "->" + mobile);
    }
}
