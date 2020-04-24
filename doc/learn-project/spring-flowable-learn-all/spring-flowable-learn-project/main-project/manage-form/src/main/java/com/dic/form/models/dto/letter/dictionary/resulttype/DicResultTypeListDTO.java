package com.dic.form.models.dto.letter.dictionary.resulttype;

import com.dic.form.models.dto.letter.dictionary.DicCommonListDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DicResultTypeListDTO extends DicCommonListDTO {
    private Boolean isInLetClue;
}
