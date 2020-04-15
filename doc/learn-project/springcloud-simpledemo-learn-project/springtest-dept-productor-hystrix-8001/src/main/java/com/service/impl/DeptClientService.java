package com.service.impl;


import com.dao.DeptDao;
import com.entity.Dept;
import com.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeptClientService implements DeptService {
    //实现service接口，调用dao层中查询方法
    private final DeptDao deptDao;

    @Autowired
    public DeptClientService(DeptDao deptDao) {
        this.deptDao = deptDao;
    }

    @Override
    public boolean add(Dept dept) {
        return deptDao.addDept(dept);
    }

    @Override
    public Dept get(int id) {
        return deptDao.findById(id);
    }

    @Override
    public List<Dept> list() {
        return deptDao.findAll();
    }
}
