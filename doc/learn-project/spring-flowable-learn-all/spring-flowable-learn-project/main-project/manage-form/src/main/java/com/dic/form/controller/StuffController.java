package com.dic.form.controller;

import com.dic.common.tool.FileRec;
import com.dic.common.tool.Res;
import com.dic.form.common.Constants;
import com.dic.form.models.vo.letter.clue.LetClueCreateVO;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.naming.SizeLimitExceededException;
import java.io.File;
import java.io.IOException;
@RestController
@RequestMapping("/stuff")
public class StuffController {
    //上传文件
    @PostMapping(value = "file")
    public Res fileUpload(MultipartFile file, String customPath) throws IOException, SizeLimitExceededException {
        String path = FileRec.fileUpload(file, "letClue" + File.separator + "stuff" + (StringUtils.isEmpty(customPath) ? "" : (File.separator + customPath)));
        LetClueCreateVO.LetFileVO letFileVO = new LetClueCreateVO.LetFileVO();
        letFileVO.setFile(path);
        letFileVO.setName(file.getOriginalFilename());
        {
            String fileUrl = "";
            if (Constants.STATIC_RESOURCE_URL.endsWith("/") && letFileVO.getFile().startsWith("/")) {
                fileUrl = Constants.STATIC_RESOURCE_URL + letFileVO.getFile().substring(1);
            } else if (!Constants.STATIC_RESOURCE_URL.endsWith("/") && !letFileVO.getFile().startsWith("/")) {
                fileUrl = Constants.STATIC_RESOURCE_URL + "/" + letFileVO.getFile();
            } else {
                fileUrl = Constants.STATIC_RESOURCE_URL + letFileVO.getFile();
            }
            if (fileUrl.length() > 0) {
                fileUrl = "http://" + fileUrl;
            }
            letFileVO.setUrl(fileUrl);
        }
        return Res.success(letFileVO, "成功");
    }
}
