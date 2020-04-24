package com.dic.form.models.vo.letter.dictionary.resulttype;

import com.dic.form.models.vo.letter.dictionary.DicCommonUpdateOneReqVO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public  class DicResultTypeCommonUpdateOneReqVO extends DicCommonUpdateOneReqVO {
    private Boolean isInLetClue;
}
