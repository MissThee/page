package com.dic.form.service.interf.letter.dictionary;


import com.baomidou.mybatisplus.extension.service.IService;
import com.dic.common.db.entity.primary.DicResultType;
import com.dic.form.models.dto.letter.dictionary.DicCommonInsertDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;
import com.dic.form.models.dto.letter.dictionary.resulttype.DicResultTypeInsertDTO;
import com.dic.form.models.dto.letter.dictionary.resulttype.DicResultTypeUpdateDTO;

import java.util.List;

/**
 * <p>
 * 信访信访室处理结果 服务类
 * </p>
 *
 * @author WORK,MT
 * @since 2019-06-03
 */
public interface DicResultTypeService extends IService<DicResultType> {
    Integer insertOne(DicResultTypeInsertDTO dicResultTypeInsertDTO);

    Boolean deleteOne(Integer id);

    Boolean updateOne(DicResultTypeUpdateDTO dicResultTypeUpdateDTO);

    List<DicResultType> selectList(Boolean isDelete);
}
