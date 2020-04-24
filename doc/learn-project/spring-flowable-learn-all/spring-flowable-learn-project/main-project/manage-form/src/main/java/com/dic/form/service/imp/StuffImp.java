package com.dic.form.service.imp;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dic.common.db.entity.primary.Stuff;
import com.dic.form.common.Constants;
import com.dic.form.common.EnumStuffRelationType;
import com.dic.form.db.mapper.primary.letter.StuffMapper;
import com.dic.form.models.dto.LetFileResDTO;
import com.dic.form.service.interf.StuffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StuffImp implements StuffService {
    private final StuffMapper stuffMapper;

    public StuffImp(StuffMapper StuffMapper) {
        this.stuffMapper = StuffMapper;
    }

    public List<LetFileResDTO> findStuffList(String relationId, EnumStuffRelationType enumStuffRelationType) {
        //查询扫描件
        List<Stuff> stuffList;
        {
            QueryWrapper<Stuff> qw = new QueryWrapper<>();
            qw.eq(Stuff.RELATION_ID, relationId)
                    .eq(Stuff.RELATION_TYPE, enumStuffRelationType.getValue());
            stuffList = stuffMapper.selectList(qw);
        }
        List<LetFileResDTO> letFileResDTOList = new ArrayList<>();
        if (stuffList.size() > 0) {
            for (Stuff stuff : stuffList) {
                LetFileResDTO letFileResDTO = new LetFileResDTO();
                String fileUrl = "";
                if (Constants.STATIC_RESOURCE_URL.endsWith("/") && stuff.getFile().startsWith("/")) {
                    fileUrl = Constants.STATIC_RESOURCE_URL + stuff.getFile().substring(1);
                } else if (!Constants.STATIC_RESOURCE_URL.endsWith("/") && !stuff.getFile().startsWith("/")) {
                    fileUrl = Constants.STATIC_RESOURCE_URL + "/" + stuff.getFile();
                } else {
                    fileUrl = Constants.STATIC_RESOURCE_URL + stuff.getFile();
                }
                if (fileUrl.length() > 0) {
                    fileUrl = "http://" + fileUrl;
                }
                letFileResDTO.setFile(stuff.getFile());
                letFileResDTO.setName(stuff.getName());
                letFileResDTO.setUrl(fileUrl);
                letFileResDTOList.add(letFileResDTO);
            }
        }
        return letFileResDTOList;
    }

    public Boolean insertStuffToDB(List<LetFileResDTO> fileList, String relationId, EnumStuffRelationType enumStuffRelationType, Boolean isCreate) {
        //添加/更新 文件表
        if (fileList == null) {
            return true;
        }
        List<Stuff> stuffList = new ArrayList<>();
        for (LetFileResDTO letFileDTO : fileList) {
            Stuff stuff = new Stuff();
            stuff.setRelationType(EnumStuffRelationType.XianSuo.getValue());
            stuff.setRelationId(relationId);
            stuff.setName(letFileDTO.getName());
            stuff.setFile(letFileDTO.getFile());
            stuff.setCreateDate(LocalDateTime.now());
            stuffList.add(stuff);
        }
        if (!isCreate) {//非添加时，需删除旧信息
            QueryWrapper<Stuff> qw = new QueryWrapper<>();
            qw.eq(Stuff.RELATION_ID, relationId)
                    .eq(Stuff.RELATION_TYPE, enumStuffRelationType.getValue());
            stuffMapper.delete(qw);
        }
        if (stuffList.size() > 0) {
            return stuffMapper.insertBatch(stuffList) > 0;
        }
        return true;
    }

}
