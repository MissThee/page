package com.dic.common.db.mapper.common;

import com.baomidou.mybatisplus.core.injector.AbstractMethod;
import com.baomidou.mybatisplus.core.injector.DefaultSqlInjector;

import java.util.List;

public class CustomerSqlInjector extends DefaultSqlInjector {
    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass){
        List<AbstractMethod> methodList=super.getMethodList(mapperClass);
        methodList.add(new BatchInsertByList());
        return methodList;
    }
}