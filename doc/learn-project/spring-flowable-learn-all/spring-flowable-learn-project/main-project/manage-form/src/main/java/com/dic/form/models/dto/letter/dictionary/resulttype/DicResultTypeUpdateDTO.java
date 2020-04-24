package com.dic.form.models.dto.letter.dictionary.resulttype;

import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class DicResultTypeUpdateDTO extends DicCommonUpdateDTO {
    private Boolean isInLetClue;
}
