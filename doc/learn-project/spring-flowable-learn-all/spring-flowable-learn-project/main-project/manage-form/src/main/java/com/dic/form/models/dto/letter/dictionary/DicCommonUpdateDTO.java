package com.dic.form.models.dto.letter.dictionary;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@EqualsAndHashCode(callSuper = true)
@Data
@Accessors(chain = true)
public class DicCommonUpdateDTO extends DicCommonInsertDTO {
    private Integer id;
}
