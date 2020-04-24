package com.dic.form.service.interf.letter.casemanage;

import com.dic.common.db.entity.primary.CaseManage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.dic.common.tool.SimplePageInfo;
import com.dic.form.models.dto.letter.casemanage.CaseManageListResDTO;
import com.dic.form.models.vo.letter.casemanage.CaseManageGetListVO;

import java.time.LocalDate;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author WORK-PC,MT
 * @since 2019-09-19
 */
public interface CaseManageService extends IService<CaseManage> {

    SimplePageInfo<CaseManageListResDTO> selectSimplePage(Integer pageIndex, Integer pageSize, String letClueId,String defendantName,String content, LocalDate startReceptionTime, LocalDate endReceptionTime, Integer leftDayNum,Integer stateId);

    CaseManage getByLetClueId(String id);
}
