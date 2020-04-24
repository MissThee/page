package com.dic.base.service.imp.manage;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dic.base.db.mapper.primary.manage.SysPermissionMapper;
import com.dic.base.dto.manage.role.SysRoleInTableDetailDTO;
import com.dic.base.dto.manage.role.SysRoleInsertOneDTO;
import com.dic.base.dto.manage.role.SysRoleUpdateOneDTO;
import com.dic.base.db.mapper.primary.manage.SysRoleMapper;
import com.dic.base.db.mapper.primary.manage.SysRolePermissionMapper;
import com.dic.common.db.entity.primary.SysPermission;
import com.dic.common.db.entity.primary.SysRole;
import com.dic.common.db.entity.primary.SysRolePermission;
import com.dic.base.service.interf.manage.RoleService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class RoleImp extends ServiceImpl<SysRoleMapper, SysRole> implements RoleService {
    private final MapperFacade mapperFacade;
    private final SysRoleMapper roleMapper;
    private final SysRolePermissionMapper rolePermissionMapper;
  private final SysPermissionMapper sysPermissionMapper;

    @Autowired
    public RoleImp(SysRoleMapper roleMapper, MapperFacade mapperFacade, SysRolePermissionMapper rolePermissionMapper, SysPermissionMapper sysPermissionMapper) {
        this.roleMapper = roleMapper;
        this.mapperFacade = mapperFacade;
        this.rolePermissionMapper = rolePermissionMapper;
        this.sysPermissionMapper = sysPermissionMapper;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Long insertOne(SysRoleInsertOneDTO roleInsertOneDTO) {
        SysRole role = mapperFacade.map(roleInsertOneDTO, SysRole.class);
        roleMapper.insert(role);
        Long roleId = role.getId();
        if (roleId != null) {
            updateRolePermission(roleInsertOneDTO.getPermissionIdList(), role.getId());
        }
        return roleId;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean deleteOne(Long id) {
        if (id == null) {
            return false;
        }
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysRole.ID, id);
        Boolean result = roleMapper.updateById(new SysRole().setId(id).setIsDelete(true)) > 0;
        if (result) {
            updateRolePermission(null, id);
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean updateOne(SysRoleUpdateOneDTO roleUpdateOneDTO) {
        //拷贝用户信息，生成Role对象
        SysRole role = mapperFacade.map(roleUpdateOneDTO, SysRole.class);
        //更新信息
        Boolean result = roleMapper.updateById(role) > 0;
        if (result) {
            updateRolePermission(roleUpdateOneDTO.getPermissionIdList(), role.getId());
        }
        return result;
    }

    @Override
    public SysRoleInTableDetailDTO selectOne(Long id) {
        SysRole sysRole = roleMapper.selectById(id);
        SysRoleInTableDetailDTO sysRoleInTableDetailDTO = mapperFacade.map(sysRole, SysRoleInTableDetailDTO.class);

        List<Long> permissionIdList;
        {//查找权限id集(角色-权限关系表)
            permissionIdList = new ArrayList<>();
            if (id != null) {
                QueryWrapper<SysRolePermission> rolePermissionQW = new QueryWrapper<>();
                rolePermissionQW.eq(SysRolePermission.ROLE_ID, id);
                List<SysRolePermission> rolePermissionList = rolePermissionMapper.selectList(rolePermissionQW);
                rolePermissionList.forEach(e -> permissionIdList.add(e.getPermissionId()));
            }
        }
        sysRoleInTableDetailDTO.setPermissionIdList(permissionIdList);
        return sysRoleInTableDetailDTO;
    }

    @Override
    public List<SysRole> selectList(Boolean isDelete, LinkedHashMap<String, Boolean> orderBy) {
        List<SysRole> sysRoleList;
        {
            QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq(SysRole.IS_DELETE, isDelete);
            for (Map.Entry<String, Boolean> entry : orderBy.entrySet()) {
                queryWrapper.orderBy(true, entry.getValue(), entry.getKey());
            }
            sysRoleList = roleMapper.selectList(queryWrapper);
        }
        return sysRoleList;
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public Boolean deleteOnePhysical(Long id) {
        return roleMapper.deleteById(id) > 0;
    }

    @Override
    public Boolean isExist(String role) {
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysRole.ROLE, role);
        return roleMapper.selectList(queryWrapper).size() > 0;
    }

    @Override
    public Boolean isExistExceptSelf(String role, Long id) {
        QueryWrapper<SysRole> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysRole.ROLE, role)
                .ne(SysRole.ID, id);
        return roleMapper.selectList(queryWrapper).size() > 0;
    }

    private void updateRolePermission(List<Long> permissionIdList, Long roleId) {
        //清理关系
        QueryWrapper<SysRolePermission> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(SysRolePermission.ROLE_ID, roleId);
        rolePermissionMapper.delete(queryWrapper);
        //插入关系
        if (permissionIdList != null && permissionIdList.size() > 0) {
            for (Long permissionId : permissionIdList) {
                rolePermissionMapper.insert(new SysRolePermission().setRoleId(roleId).setPermissionId(permissionId));
            }
        }
    }
}
