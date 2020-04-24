package com.dic.form.service.interf;


import com.dic.form.common.EnumStuffRelationType;
import com.dic.form.models.dto.LetFileResDTO;

import java.util.List;

public interface StuffService {
    public List<LetFileResDTO> findStuffList(String relationshipId, EnumStuffRelationType enumStuffRelationType);

    public Boolean insertStuffToDB(List<LetFileResDTO> fileList, String relationId, EnumStuffRelationType enumStuffRelationType, Boolean isCreate);
}
