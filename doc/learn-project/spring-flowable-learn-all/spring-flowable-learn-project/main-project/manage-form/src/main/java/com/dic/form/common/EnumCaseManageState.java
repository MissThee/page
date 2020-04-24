package com.dic.form.common;

//case_manage的stateId字段值
public enum EnumCaseManageState {
    Default(0), //待办理、未办理。默认值
    YiBanLi(1), //已办理
    YiBoHui(2); //已驳回
    private Integer value;

    EnumCaseManageState(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return this.value;
    }
}
