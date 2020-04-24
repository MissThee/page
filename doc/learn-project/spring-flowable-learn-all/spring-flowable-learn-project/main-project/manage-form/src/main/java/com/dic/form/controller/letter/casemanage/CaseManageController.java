package com.dic.form.controller.letter.casemanage;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dic.base.service.interf.manage.UnitService;
import com.dic.common.config.security.jwt.JavaJWT;
import com.dic.common.db.entity.primary.CaseManage;
import com.dic.common.db.entity.primary.LetClue;
import com.dic.common.db.entity.primary.Stuff;
import com.dic.common.db.entity.primary.SysUnit;
import com.dic.common.tool.Res;
import com.dic.common.tool.SimplePageInfo;
import com.dic.form.common.Constants;
import com.dic.form.common.EnumCaseManageState;
import com.dic.form.common.EnumLetClueResultType;
import com.dic.form.common.EnumStuffRelationType;
import com.dic.form.db.mapper.primary.letter.StuffMapper;
import com.dic.form.models.dto.LetFileResDTO;
import com.dic.form.models.dto.letter.casemanage.CaseManageDeptDTO;
import com.dic.form.models.dto.letter.casemanage.CaseManageListResDTO;
import com.dic.form.models.dto.letter.casemanage.CaseManageResDTO;
import com.dic.form.models.dto.letter.clue.LetClueCreateDTO;
import com.dic.form.models.dto.letter.clue.LetClueResDTO;
import com.dic.form.models.dto.letter.clue.LetClueUpdateDTO;
import com.dic.form.models.vo.letter.casemanage.CaseManageGetByIdVO;
import com.dic.form.models.vo.letter.casemanage.CaseManageGetListVO;
import com.dic.form.models.vo.letter.casemanage.CaseManageRefuseVO;
import com.dic.form.models.vo.letter.casemanage.CaseManageUpdateVO;
import com.dic.form.models.vo.letter.clue.LetClueCreateVO;
import com.dic.form.models.vo.letter.clue.LetClueGetByIdVO;
import com.dic.form.models.vo.letter.clue.LetClueUpdateVO;
import com.dic.form.service.interf.StuffService;
import com.dic.form.service.interf.letter.casemanage.CaseManageService;
import com.dic.form.service.interf.letter.clue.LetClueService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Api(tags = "信访表单")
@RestController
@RequestMapping("caseManage")
@PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'caseManage'))")
public class CaseManageController {
    private final StuffMapper stuffMapper;
    private final MapperFacade mapperFacade;
    private final CaseManageService caseManageService;
    private final UnitService unitService;
    private final LetClueService letClueService;
    private final StuffService stuffService;
    public CaseManageController(CaseManageService caseManageService, MapperFacade mapperFacade, UnitService unitService, LetClueService letClueService, StuffMapper stuffMapper, StuffService stuffService) {
        this.caseManageService = caseManageService;
        this.mapperFacade = mapperFacade;
        this.unitService = unitService;
        this.letClueService = letClueService;
        this.stuffMapper = stuffMapper;
        this.stuffService = stuffService;
    }

    @ApiOperation(value = "查询列表")
    @PostMapping("list")
    public Res<SimplePageInfo<CaseManageListResDTO>> caseManageList(@RequestBody @Validated CaseManageGetListVO caseManageGetListVO) {
        SimplePageInfo<CaseManageListResDTO> caseManageListResDTOPageInfo = caseManageService.selectSimplePage(caseManageGetListVO.getPageIndex(), caseManageGetListVO.getPageSize(), caseManageGetListVO.getLetClueId(), caseManageGetListVO.getDefendantName(), caseManageGetListVO.getContent(), caseManageGetListVO.getStartReceptionTime(), caseManageGetListVO.getEndReceptionTime(), caseManageGetListVO.getLeftDayNum(), caseManageGetListVO.getStateId());
        return Res.success(caseManageListResDTOPageInfo);
    }

    @ApiOperation(value = "查询单个by id")
    @PostMapping()
    public Res<CaseManageResDTO> getCaseManageById(@RequestBody @Validated CaseManageGetByIdVO caseManageGetByIdVO) {
        CaseManage caseManage = caseManageService.getById(caseManageGetByIdVO.getId());
        CaseManageResDTO caseManageResDTO = mapperFacade.map(caseManage, CaseManageResDTO.class);
        List<LetFileResDTO> stuffList = stuffService.findStuffList(caseManageGetByIdVO.getId().toString(), EnumStuffRelationType.XianSuo);
        caseManageResDTO.setFileList(stuffList);
        return Res.success(caseManageResDTO);
    }

    @ApiOperation(value = "提交办理")
    @PatchMapping()
    @Transactional(rollbackFor = Exception.class)
    public Res updateCaseManage(@RequestBody @Validated CaseManageUpdateVO caseManageUpdateVO) throws Exception {
        CaseManage caseManage = caseManageService.getById(caseManageUpdateVO.getId());
        if (!EnumCaseManageState.Default.getValue().equals(caseManage.getStateId())) {
            return Res.failure("操作失败，此信息已处理，不可重复处理");
        }
        CaseManage caseManageTmp = mapperFacade.map(caseManageUpdateVO, CaseManage.class);
        caseManageTmp.setStateId(EnumCaseManageState.YiBanLi.getValue());
        caseManageTmp.setOperationDate(LocalDateTime.now());
        boolean result = caseManageService.updateById(caseManageTmp);
        if (result) {
            Boolean insertStuffToDBResult = stuffService.insertStuffToDB(caseManageUpdateVO.getFileList(), caseManageUpdateVO.getId().toString(), EnumStuffRelationType.AnGuan, false);
            if (!insertStuffToDBResult) {
                throw new Exception("stuffList insert failed");
            }
        }
        return Res.res(result);
    }

    @ApiOperation(value = "提交驳回")
    @PatchMapping("refuse")
    @Transactional(rollbackFor = Exception.class)
    public Res refuseCaseManage(@RequestBody @Validated CaseManageRefuseVO caseManageRefuseVO) throws Exception {
        CaseManage caseManage = caseManageService.getById(caseManageRefuseVO.getId());
        if (!EnumCaseManageState.Default.getValue().equals(caseManage.getStateId())) {
            return Res.failure("操作失败，此信息已处理，不可重复处理");
        }
        CaseManage caseManageTmp = mapperFacade.map(caseManageRefuseVO, CaseManage.class);
        caseManageTmp.setStateId(EnumCaseManageState.YiBoHui.getValue());
        boolean result1 = caseManageService.updateById(caseManageTmp);
        if (result1) {
            Boolean result2 = letClueService.updateLetClueResultType(caseManage.getLetClueId(), EnumLetClueResultType.BoHui.getValue());
            if (result2) {
                return Res.success();
            }
        }
        throw new Exception("操作失败，驳回处理错误");
    }

    @ApiOperation(value = "查询案管室下拉列表(编辑单个时使用)")
    @PostMapping("deptList")
    public Res<List<CaseManageDeptDTO>> caseManageDeptList() {
        List<SysUnit> unitList = unitService.getListByType("案管室");
        List<CaseManageDeptDTO> caseManageDeptDTOList = mapperFacade.mapAsList(unitList, CaseManageDeptDTO.class);
        return Res.success(caseManageDeptDTOList);
    }

    @ApiOperation(value = "线索-查询单个by id")
    @PostMapping("letClue")
    public Res selectLetClue(@RequestBody LetClueGetByIdVO letClueGetByIdVO) throws UnsupportedEncodingException {
        LetClueResDTO letClueResDTO = letClueService.selectOne(letClueGetByIdVO.getId());
        if (letClueResDTO == null) {
            return Res.failure("查询的内容不存在，id编号:" + letClueGetByIdVO.getId());
        } else {
            return Res.success(letClueResDTO);
        }
    }

    @ApiOperation(value = "线索-新增案管线索")
    @PutMapping("letClue")
    @Transactional(rollbackFor = Exception.class)
    public Res createLetCLueInCaseManage(HttpServletRequest httpServletRequest, @RequestBody @Validated LetClueCreateVO letClueCreateVO) throws Exception {
        LetClueCreateDTO letClueCreateDTO = mapperFacade.map(letClueCreateVO, LetClueCreateDTO.class);
        letClueCreateDTO.setResultTypeId(EnumLetClueResultType.AnGuan.getValue());
        String userId = JavaJWT.getId(httpServletRequest);
        if (userId != null) {
            letClueCreateDTO.setCreatorId(Long.parseLong(userId));
        }
        String letCLueId = letClueService.createOne(letClueCreateDTO);
        boolean caseManageResult = caseManageService.save(new CaseManage().setLetClueId(letCLueId));
        if (caseManageResult) {
            return Res.success();
        }
        throw new Exception("添加失败，保存出现错误");
    }

    @ApiOperation(value = "线索-修改案管线索")
    @PatchMapping("letClue")
    @Transactional(rollbackFor = Exception.class)
    public Res updateLetClueInCaseManage(@RequestBody LetClueUpdateVO letClueUpdateVO) throws Exception {
        LetClueUpdateDTO letClueUpdateDTO = mapperFacade.map(letClueUpdateVO, LetClueUpdateDTO.class);
        LetClue letClue = letClueService.getById(letClueUpdateVO.getId());
        if (letClue.getResultTypeId() == null || EnumLetClueResultType.getEnumByValue(letClue.getResultTypeId()).getIsEditableInAnGuan()) {
            CaseManage caseManage = caseManageService.getByLetClueId(letClueUpdateVO.getId());
            if (caseManage == null) {
                return Res.failure("操作失败，未查询到案管接管此线索的信息");
            }
            if (!EnumCaseManageState.Default.getValue().equals(caseManage.getStateId())) {
                return Res.failure("操作失败，此信息已办理，不可修改");
            }
            letClueService.updateLetClue(letClueUpdateDTO);
            return Res.success("修改成功");
        } else {
            return Res.failure("此线索未分发到案管，不可修改");
        }
    }


}
