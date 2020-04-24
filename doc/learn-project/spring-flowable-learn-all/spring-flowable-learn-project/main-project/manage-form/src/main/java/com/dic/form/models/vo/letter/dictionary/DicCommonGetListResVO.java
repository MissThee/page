package com.dic.form.models.vo.letter.dictionary;

import com.dic.form.models.dto.letter.dictionary.DicCommonListDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
@ApiModel("DicIllegalBehaviorVO.SelectListRes")
public  class DicCommonGetListResVO {
    @ApiModelProperty(value = "违法行为列表")
    private List<DicCommonListDTO> dicCommonList;
}
