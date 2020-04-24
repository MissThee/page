package com.dic.base.dto.login;

import com.dic.common.db.entity.primary.SysUser;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.Collection;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class AuthDTO extends SysUser {
    private Collection<String> roleValueList;
    private Collection<String> permissionValueList;
    private String unitName;
}