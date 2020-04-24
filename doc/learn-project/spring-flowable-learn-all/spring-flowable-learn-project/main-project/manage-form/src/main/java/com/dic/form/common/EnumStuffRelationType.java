package com.dic.form.common;
//附件上传分类，stuff表中的relation_type值，自定义
public enum EnumStuffRelationType {
    XianSuo(1),
    AnGuan(2);
    private Integer value;

    EnumStuffRelationType(Integer value) {
        this.value = value;
    }

    public Integer getValue() {
        return this.value;
    }
}
