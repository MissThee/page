package com.dic.form.models.dto.letter.dictionary;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class DicCommonInsertDTO {
    private String name;
    private Integer indexNumber;
}
