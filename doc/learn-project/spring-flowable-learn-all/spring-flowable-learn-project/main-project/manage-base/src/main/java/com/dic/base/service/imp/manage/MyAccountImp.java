package com.dic.base.service.imp.manage;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dic.base.service.interf.manage.MyAccountService;
import com.dic.common.db.entity.primary.SysUser;
import com.dic.base.db.mapper.primary.manage.SysUserMapper;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = {Exception.class})
public class MyAccountImp extends ServiceImpl<SysUserMapper, SysUser> implements MyAccountService {
    private final MapperFacade mapperFacade;
    private final SysUserMapper userMapper;

    @Autowired
    public MyAccountImp(SysUserMapper userMapper, MapperFacade mapperFacade) {
        this.userMapper = userMapper;
        this.mapperFacade = mapperFacade;
    }

    @Override
    public Boolean comparePassword(Long id, String inputOldPassword) {
        SysUser user = userMapper.selectById(id);
        String userOldPassword = user.getPassword();
        return new BCryptPasswordEncoder().matches(inputOldPassword, userOldPassword);
    }

    @Override
    public Boolean updatePassword(Long id, String newPassword) {
        SysUser user = new SysUser();
        user.setId(id);
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        int resultNum = userMapper.updateById(user);
        return resultNum > 0;
    }


}
