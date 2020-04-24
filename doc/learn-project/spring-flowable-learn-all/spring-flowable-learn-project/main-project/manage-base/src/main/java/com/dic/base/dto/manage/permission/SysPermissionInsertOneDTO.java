package com.dic.base.dto.manage.permission;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class SysPermissionInsertOneDTO {
    private Long parentId;
    private String name;
    private String permission;
    private String Type;
    private String isEnable;
    private Integer indexNum;
}