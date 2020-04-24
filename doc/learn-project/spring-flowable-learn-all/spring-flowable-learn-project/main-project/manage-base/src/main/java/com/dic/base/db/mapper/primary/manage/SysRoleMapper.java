package com.dic.base.db.mapper.primary.manage;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.dic.common.config.mybatis.cache.MybatisRedisCacheConfig;
import com.dic.common.db.entity.primary.SysRole;
import org.apache.ibatis.annotations.CacheNamespace;
import org.springframework.stereotype.Component;

@Component
@CacheNamespace(implementation = MybatisRedisCacheConfig.class)
public interface SysRoleMapper extends BaseMapper<SysRole> {

}