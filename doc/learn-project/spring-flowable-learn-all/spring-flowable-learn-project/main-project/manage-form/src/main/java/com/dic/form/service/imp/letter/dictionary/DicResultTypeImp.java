package com.dic.form.service.imp.letter.dictionary;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dic.common.db.entity.primary.DicResultType;
import com.dic.form.db.mapper.primary.letter.dictionary.DicResultTypeMapper;
import com.dic.form.models.dto.letter.dictionary.DicCommonInsertDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;
import com.dic.form.models.dto.letter.dictionary.resulttype.DicResultTypeInsertDTO;
import com.dic.form.models.dto.letter.dictionary.resulttype.DicResultTypeUpdateDTO;
import com.dic.form.service.interf.letter.dictionary.DicResultTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 信访信访室处理结果 服务实现类
 * </p>
 *
 * @author WORK,MT
 * @since 2019-06-03
 */
@Service
public class DicResultTypeImp extends ServiceImpl<DicResultTypeMapper, DicResultType> implements DicResultTypeService {
    private final DicResultTypeMapper dicResultTypeMapper;
    private final MapperFacade mapperFacade;

    @Autowired
    public DicResultTypeImp(MapperFacade mapperFacade, DicResultTypeMapper dicResultTypeMapper) {
        this.mapperFacade = mapperFacade;
        this.dicResultTypeMapper = dicResultTypeMapper;
    }

    @Override
    public Integer insertOne(DicResultTypeInsertDTO dicCommonInsertDTO) {
        DicResultType dicResultType = mapperFacade.map(dicCommonInsertDTO, DicResultType.class);
        dicResultTypeMapper.insert(dicResultType);
        return dicResultType.getId();
    }

    @Override
    public Boolean deleteOne(Integer id) {
        if (id == null) {
            return false;
        }
        return dicResultTypeMapper.updateById(new DicResultType().setId(id).setIsDelete(true)) > 0;

    }

    @Override
    public Boolean updateOne(DicResultTypeUpdateDTO dicResultTypeUpdateDTO) {
        DicResultType dicResultType = mapperFacade.map(dicResultTypeUpdateDTO, DicResultType.class);
        return (dicResultTypeMapper.updateById(dicResultType) > 0);
    }

    @Override
    public List<DicResultType> selectList(Boolean isDelete) {
        QueryWrapper<DicResultType> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(DicResultType.IS_DELETE, isDelete)
                .orderBy(true, true, DicResultType.INDEX_NUMBER);
        return dicResultTypeMapper.selectList(queryWrapper);
    }
}
