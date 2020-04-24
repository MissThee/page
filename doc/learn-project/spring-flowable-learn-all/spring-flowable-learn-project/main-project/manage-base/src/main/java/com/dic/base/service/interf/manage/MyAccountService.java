package com.dic.base.service.interf.manage;

import com.baomidou.mybatisplus.extension.service.IService;
import com.dic.common.db.entity.primary.SysUser;

public interface MyAccountService extends IService<SysUser> {
    Boolean comparePassword(Long id, String oldPassword);

    Boolean updatePassword(Long id, String oldPassword);

}
