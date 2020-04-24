package com.dic.form.service.imp.letter.casemanage;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dic.common.db.entity.primary.CaseManage;
import com.dic.common.tool.SimplePageInfo;
import com.dic.form.db.mapper.primary.letter.casemanage.CaseManageMapper;
import com.dic.form.models.dto.letter.casemanage.CaseManageListResDTO;
import com.dic.form.service.interf.letter.casemanage.CaseManageService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.ibatis.annotations.Case;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author WORK-PC,MT
 * @since 2019-09-19
 */
@Service
public class CaseManageImp extends ServiceImpl<CaseManageMapper, CaseManage> implements CaseManageService {
    private final CaseManageMapper caseManageMapper;

    public CaseManageImp(CaseManageMapper caseManageMapper) {
        this.caseManageMapper = caseManageMapper;
    }

    @Override
    public SimplePageInfo<CaseManageListResDTO> selectSimplePage(Integer pageIndex, Integer pageSize, String letClueId, String defendantName, String content, LocalDate startReceptionTime, LocalDate endReceptionTime, Integer leftDayNum, Integer stateId) {
        //查询
        Integer lineStart = (pageIndex - 1) * pageSize;
        List<CaseManageListResDTO> caseManageListResDTOList = caseManageMapper.selectSimplePage(lineStart, pageSize, letClueId, defendantName, content, startReceptionTime, endReceptionTime, leftDayNum, stateId);
        Long total = caseManageMapper.selectTotal(letClueId, defendantName, content, startReceptionTime, endReceptionTime, leftDayNum, stateId);
        return new SimplePageInfo<>(caseManageListResDTOList, total);
    }

    @Override
    public CaseManage getByLetClueId(String id) {
        QueryWrapper<CaseManage> qw = new QueryWrapper<>();
        qw.eq(CaseManage.LET_CLUE_ID, id).eq(CaseManage.IS_DEAD, false);
        return caseManageMapper.selectOne(qw);
    }
}
