package com.dic.form.controller.letter.dictionary;

import com.dic.common.db.entity.primary.DicJobType;
import com.dic.common.tool.Res;
import com.dic.form.models.dto.letter.dictionary.DicCommonInsertDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonListDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;
import com.dic.form.models.vo.letter.dictionary.*;
import com.dic.form.service.interf.letter.dictionary.DicJobTypeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiOperationSort;
import io.swagger.annotations.ApiSort;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Api(tags = "数据字典-干部类型管理")
@ApiSort(1102)
@RestController
@RequestMapping("dic/jobtype")
@PreAuthorize("isAuthenticated()")
public class DicJobTypeController {

    private final DicJobTypeService dicJobTypeService;
    private final MapperFacade mapperFacade;

    @Autowired
    public DicJobTypeController(DicJobTypeService dicJobTypeService, MapperFacade mapperFacade) {
        this.dicJobTypeService = dicJobTypeService;
        this.mapperFacade = mapperFacade;
    }

    @ApiOperation(value = "增加干部类型")
    @ApiOperationSort(2)
    @PutMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicJobType'))")
    public Res<DicCommonCreateOneResVO> insertOne(@RequestBody DicCommonCreateOneReqVO dicCommonCreateOneReqVO) {
        Integer id = dicJobTypeService.insertOne(mapperFacade.map(dicCommonCreateOneReqVO, DicCommonInsertDTO.class));
        return Res.res(id == null, new DicCommonCreateOneResVO().setId(id), "添加" + (id == null ? "失败" : "成功"));
    }

    @ApiOperation(value = "删除干部类型（逻辑删除）")
    @ApiOperationSort(4)
    @DeleteMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicJobType'))")
    public Res deleteOne(@RequestBody DicCommonDeleteOneReqVO dicCommonDeleteOneReqVO) {
        Boolean result = dicJobTypeService.deleteOne(dicCommonDeleteOneReqVO.getId());
        return Res.res(result, "删除" + (result ? "成功" : "失败"));
    }

    @ApiOperation(value = "修改干部类型")
    @ApiOperationSort(3)
    @PatchMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicJobType'))")
    public Res updateOne(@RequestBody DicCommonUpdateOneReqVO dicCommonUpdateOneReqVO) {
        Boolean result = dicJobTypeService.updateOne(mapperFacade.map(dicCommonUpdateOneReqVO, DicCommonUpdateDTO.class));
        return Res.res(result, "修改" + (result ? "成功" : "失败"));
    }

    @ApiOperation(value = "干部类型列表")
    @ApiOperationSort(1)
    @PostMapping("all")
    public Res<DicCommonGetListResVO> selectList(@RequestBody DicCommonGetListReqVO dicCommonGetListReqVO) {
        List<DicJobType> dicJobTypeList = dicJobTypeService.selectList(dicCommonGetListReqVO.getIsDelete());
        List<DicCommonListDTO> dicCommonListDTOList = mapperFacade.mapAsList(dicJobTypeList, DicCommonListDTO.class);
        return Res.success(new DicCommonGetListResVO().setDicCommonList(dicCommonListDTOList));
    }
}
