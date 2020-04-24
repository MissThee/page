package com.dic.form.models.vo.letter.dictionary.resulttype;

import com.dic.form.models.vo.letter.dictionary.DicCommonCreateOneReqVO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class DicResultTypeCommonCreateOneReqVO extends DicCommonCreateOneReqVO {
  private Boolean isInLetClue;
}
