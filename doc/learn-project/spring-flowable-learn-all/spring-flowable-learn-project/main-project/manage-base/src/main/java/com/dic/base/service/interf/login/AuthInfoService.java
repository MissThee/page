package com.dic.base.service.interf.login;

import com.dic.base.dto.login.AuthDTO;

public interface AuthInfoService {
    AuthDTO selectUserByUsername(String username);
    AuthDTO selectUserById(String id);
}
