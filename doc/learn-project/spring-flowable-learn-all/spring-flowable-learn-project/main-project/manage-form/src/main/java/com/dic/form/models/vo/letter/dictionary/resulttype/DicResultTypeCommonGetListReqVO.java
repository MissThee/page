package com.dic.form.models.vo.letter.dictionary.resulttype;

import com.dic.form.models.vo.letter.dictionary.DicCommonGetListReqVO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class DicResultTypeCommonGetListReqVO extends DicCommonGetListReqVO {
    private Boolean isInLetClue;
}