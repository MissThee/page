package com.dic.form.models.dto.letter.casemanage;

import com.dic.form.models.dto.LetFileResDTO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CaseManageResDTO {
    private Long id;

    @ApiModelProperty(value = "意见")
    private String content;

    @ApiModelProperty(value = "是否要结果件")
    private Boolean isNeedResultForm;

    @ApiModelProperty(value = "要结果件时，限制的时间")
    private LocalDateTime resultFormLimitDate;

    @ApiModelProperty(value = "分派给案管室的1-15编号")
    private Integer sendToSubDeptId;

    @ApiModelProperty(value = "文件列表")
    private List<LetFileResDTO> fileList;

}
