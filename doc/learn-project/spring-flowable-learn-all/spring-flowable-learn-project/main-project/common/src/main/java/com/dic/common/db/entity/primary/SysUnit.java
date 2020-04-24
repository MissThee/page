package com.dic.common.db.entity.primary;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * <p>
 *
 * </p>
 *
 * @author WORK, MT
 * @since 2019-04-15
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@ApiModel(value = "Unit对象", description = "")
public class SysUnit implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "id")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @ApiModelProperty(value = "父id")
    @TableField("parent_id")
    private Long parentId;

    @ApiModelProperty(value = "名称")
    @TableField("name")
    private String name;

    @ApiModelProperty(value = "类型")
    @TableField("type")
    private String type;

    @ApiModelProperty(value = "是否已删除")
    @TableField("is_delete")
    private Boolean isDelete;

    @ApiModelProperty(value = "排序")
    @TableField("index_num")
    private Integer indexNum;

    @ApiModelProperty(value = "属于哪个车队")
    @TableField("fleet_id")
    private Long fleetId;

    public static final String ID = "id";

    public static final String PARENT_ID = "parent_id";

    public static final String NAME = "name";

    public static final String TYPE = "type";

    public static final String IS_DELETE = "is_delete";

    public static final String INDEX_NUM = "index_num";

    public static final String FLEET_ID = "fleet_id";
}
