package com.dic.common.db.entity.primary;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import java.io.Serializable;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author WORK-PC,MT
 * @since 2019-09-25
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value="LetClueCreator对象", description="")
public class LetClueCreator implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId("let_clue_id")
    private String letClueId;

    @TableField("user_id")
    private Long userId;


    public static final String LET_CLUE_ID = "let_clue_id";

    public static final String USER_ID = "user_id";

}
