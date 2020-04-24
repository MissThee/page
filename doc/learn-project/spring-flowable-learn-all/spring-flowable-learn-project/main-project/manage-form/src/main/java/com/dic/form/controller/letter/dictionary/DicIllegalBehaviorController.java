package com.dic.form.controller.letter.dictionary;

import com.dic.common.db.entity.primary.DicIllegalBehavior;
import com.dic.common.tool.Res;
import com.dic.form.models.dto.letter.dictionary.DicCommonInsertDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonListDTO;
import com.dic.form.models.dto.letter.dictionary.DicCommonUpdateDTO;
import com.dic.form.models.vo.letter.dictionary.*;
import com.dic.form.service.interf.letter.dictionary.DicIllegalBehaviorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiOperationSort;
import io.swagger.annotations.ApiSort;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Api(tags = "数据字典-违法行为管理")
@ApiSort(1104)
@RestController
@RequestMapping("dic/illegalbehavior")
@PreAuthorize("isAuthenticated() ")
public class DicIllegalBehaviorController {

    private final DicIllegalBehaviorService dicIllegalBehaviorService;
    private final MapperFacade mapperFacade;

    @Autowired
    public DicIllegalBehaviorController(DicIllegalBehaviorService dicIllegalBehaviorService, MapperFacade mapperFacade) {
        this.dicIllegalBehaviorService = dicIllegalBehaviorService;
        this.mapperFacade = mapperFacade;
    }

    @ApiOperation(value = "增加违法行为")
    @ApiOperationSort(2)
    @PutMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicIllegalBehavior'))")
    public Res<DicCommonCreateOneResVO> insertOne(@RequestBody DicCommonCreateOneReqVO dicCommonCreateOneReqVO) {
        Integer id = dicIllegalBehaviorService.insertOne(mapperFacade.map(dicCommonCreateOneReqVO, DicCommonInsertDTO.class));
        return Res.res(id != null, new DicCommonCreateOneResVO().setId(id), "添加" + (id != null ?  "成功": "失败" ));
    }

    @ApiOperation(value = "删除违法行为（逻辑删除）")
    @ApiOperationSort(4)
    @DeleteMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicIllegalBehavior'))")
    public Res deleteOne(@RequestBody DicCommonDeleteOneReqVO dicCommonDeleteOneReqVO) {
        Boolean result = dicIllegalBehaviorService.deleteOne(dicCommonDeleteOneReqVO.getId());
        return Res.res(result, "修改" + (result ? "成功" : "失败"));
    }

    @ApiOperation(value = "修改违法行为")
    @ApiOperationSort(3)
    @PatchMapping
    @PreAuthorize("isAuthenticated() and (hasPermission(null,'[ADMIN]') or hasPermission(null,'dicIllegalBehavior'))")
    public Res updateOne(@RequestBody DicCommonUpdateOneReqVO dicCommonUpdateOneReqVO) {
        Boolean result = dicIllegalBehaviorService.updateOne(mapperFacade.map(dicCommonUpdateOneReqVO, DicCommonUpdateDTO.class));
        return Res.res(result, "删除" + (result ? "成功" : "失败"));
    }

    @ApiOperation(value = "违法行为列表")
    @ApiOperationSort(1)
    @PostMapping("all")
    public Res<DicCommonGetListResVO> selectList(@RequestBody DicCommonGetListReqVO dicCommonGetListReqVO) {
        List<DicIllegalBehavior> dicIllegalBehaviorList = dicIllegalBehaviorService.selectList(dicCommonGetListReqVO.getIsDelete());
        List<DicCommonListDTO> dicCommonListDTOList = mapperFacade.mapAsList(dicIllegalBehaviorList, DicCommonListDTO.class);
        return Res.success(new DicCommonGetListResVO().setDicCommonList(dicCommonListDTOList));
    }
}
