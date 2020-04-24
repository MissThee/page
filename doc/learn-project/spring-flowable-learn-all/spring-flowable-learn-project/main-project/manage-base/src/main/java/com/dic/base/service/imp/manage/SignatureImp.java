package com.dic.base.service.imp.manage;

import com.dic.common.db.entity.primary.SysSignature;
import com.dic.base.db.mapper.primary.manage.SysSignatureMapper;
import com.dic.base.service.interf.manage.SignatureService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author WORK-PC,MT
 * @since 2019-07-10
 */
@Service
public class SignatureImp extends ServiceImpl<SysSignatureMapper, SysSignature> implements SignatureService {

}
