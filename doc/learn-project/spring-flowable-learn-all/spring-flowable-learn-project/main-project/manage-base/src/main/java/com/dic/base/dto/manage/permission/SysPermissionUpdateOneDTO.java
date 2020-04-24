package com.dic.base.dto.manage.permission;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class SysPermissionUpdateOneDTO extends SysPermissionInsertOneDTO {
    private Long id;
}