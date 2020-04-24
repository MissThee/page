package com.dic.form.models.vo.letter.dictionary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel("DicIllegalBehaviorVO.InsertOneRes")
public  class DicCommonCreateOneResVO {
    @ApiModelProperty(value = "新增的id")
    private Integer id;
}
