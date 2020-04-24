package com.dic.form.models.vo.letter.dictionary;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel("DicIllegalBehaviorVO.DeleteOneReq")
public class DicCommonDeleteOneReqVO {
    @ApiModelProperty(value = "id", example = "0")
    private Integer id;
}