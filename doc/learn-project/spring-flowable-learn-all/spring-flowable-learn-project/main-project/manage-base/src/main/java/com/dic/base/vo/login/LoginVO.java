package com.dic.base.vo.login;

import com.dic.base.dto.login.AuthDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

public class LoginVO {
    @Data
    @Accessors(chain = true)
    @ApiModel("LoginVO.LoginReq")
    public static class LoginReq {
        @ApiModelProperty(value = "账号", required = true, example = "admin")
        private String username;
        @ApiModelProperty(value = "密码", required = true, example = "123")
        private String password;
        @ApiModelProperty(value = "token有效时长。true-7天；false-2天", required = true, example = "123")
        private Boolean isLongLogin = false;
    }

    @Data
    @Accessors(chain = true)
    @ApiModel("LoginVO.LoginRes")
    public static class LoginRes {
        @ApiModelProperty(value = "用户对象")
        private AuthDTO user;
    }
}
