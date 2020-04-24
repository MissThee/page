package com.dic.base.service.imp.manage;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dic.base.dto.manage.permission.SysPermissionInsertOneDTO;
import com.dic.base.dto.manage.permission.SysPermissionUpdateOneDTO;
import com.dic.base.db.mapper.primary.manage.SysPermissionMapper;
import com.dic.common.db.entity.primary.SysPermission;
import com.dic.base.service.interf.manage.PermissionService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PermissionImp extends ServiceImpl<SysPermissionMapper, SysPermission> implements PermissionService {
    private final MapperFacade mapperFacade;
    private final SysPermissionMapper permissionMapper;

    @Autowired
    public PermissionImp(SysPermissionMapper permissionMapper, MapperFacade mapperFacade) {
        this.permissionMapper = permissionMapper;
        this.mapperFacade = mapperFacade;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Long insertOne(SysPermissionInsertOneDTO permissionInsertOneDTO) {
        SysPermission permission = mapperFacade.map(permissionInsertOneDTO, SysPermission.class);
        permissionMapper.insert(permission);
        Long permissionId = permission.getId();
        return permissionId;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean deleteOne(Long id) {
        if (id == null) {
            return false;
        }
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysPermission.ID, id);
        Boolean result = permissionMapper.updateById(new SysPermission().setId(id).setIsDelete(true)) > 0;
        return result;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean updateOne(SysPermissionUpdateOneDTO permissionUpdateOneDTO) {
        //拷贝用户信息，生成Permission对象
        SysPermission permission = mapperFacade.map(permissionUpdateOneDTO, SysPermission.class);
        //更新信息
        Boolean result = permissionMapper.updateById(permission) > 0;
        return result;
    }

    @Override
    public SysPermission selectOne(Long id) {
        return permissionMapper.selectById(id);
    }

    @Override
    public List<SysPermission> selectList(Boolean isDelete, LinkedHashMap<String, Boolean> orderBy) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        if (!isDelete) {//相较于user和role，permission不能仅显示已删除节点，因为仅已删除的节点不能构建完整的树结构
            queryWrapper.eq(SysPermission.IS_DELETE, isDelete);
        }
        if (orderBy != null) {
            for (Map.Entry<String, Boolean> entry : orderBy.entrySet()) {
                queryWrapper.orderBy(true, entry.getValue(), entry.getKey());
            }
        }
        return permissionMapper.selectList(queryWrapper);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean deleteOnePhysical(Long id) {
        return permissionMapper.deleteById(id) > 0;
    }

    @Override
    public Boolean isExist(String permission) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysPermission.PERMISSION, permission);
        return permissionMapper.selectList(queryWrapper).size() > 0;
    }

    @Override
    public Boolean isExistExceptSelf(String permission, Long id) {
        QueryWrapper<SysPermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysPermission.PERMISSION, permission)
                .ne(SysPermission.ID, id);
        return permissionMapper.selectList(queryWrapper).size() > 0;
    }


}
