package com.dic.form.service.interf.letter.dictionary;


import com.baomidou.mybatisplus.extension.service.IService;
import com.dic.common.db.entity.primary.DicIllegalBehavior;
import com.dic.form.models.dto.letter.dictionary.DicCommonInsertDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;

import java.util.List;

/**
 * <p>
 * 违法行为 服务类
 * </p>
 *
 * @author WORK, MT
 * @since 2019-06-03
 */
public interface DicIllegalBehaviorService extends IService<DicIllegalBehavior> {

    Integer insertOne(DicCommonInsertDTO dicCommonInsertDTO);

    Boolean deleteOne(Integer id);

    Boolean updateOne(DicCommonUpdateDTO dicCommonUpdateDTO);

    List<DicIllegalBehavior> selectList(Boolean isDelete);

}
