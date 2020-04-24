package com.dic.form.models.vo.letter.dictionary;

import io.swagger.annotations.ApiModel;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@ApiModel("DicIllegalBehaviorVO.UpdateOneReq")
public  class DicCommonUpdateOneReqVO {
    private Integer id;
    private String name;
    private Integer indexNumber;
}
