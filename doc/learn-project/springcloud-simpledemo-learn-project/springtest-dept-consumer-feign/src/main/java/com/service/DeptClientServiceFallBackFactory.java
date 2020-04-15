package com.service;

import com.entity.Dept;
import feign.hystrix.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.List;

//不要忘记在此类上添加@Component注解
@Component
public class DeptClientServiceFallBackFactory implements FallbackFactory<DeptClientService> {
    @Override
    public DeptClientService create(Throwable throwable) {
        return new DeptClientService() {
            @Override
            public Dept get(int id) {
                return new Dept().setId(id).setName(throwable.getMessage()).setDb_source("hystrix降级");
            }

            @Override
            public List<Dept> list() {
                return null;
            }

            @Override
            public boolean add(Dept dept) {
                return false;
            }

            @Override
            public Dept get1(int id) {
                return new Dept().setId(id).setName(throwable.getMessage()).setDb_source("hystrix降级");
            }

        };
    }
}
