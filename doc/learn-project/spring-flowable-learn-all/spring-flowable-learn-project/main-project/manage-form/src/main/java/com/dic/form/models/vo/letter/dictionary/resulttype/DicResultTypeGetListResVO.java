package com.dic.form.models.vo.letter.dictionary.resulttype;

import com.dic.form.models.dto.letter.dictionary.resulttype.DicResultTypeListDTO;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
public class DicResultTypeGetListResVO {
    private List<DicResultTypeListDTO> dicCommonList;
}
