<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="案件办理" :visible.sync="caseDealtWith" width="600px">
      <el-form :model="transactionInfo" label-width="100px" :disabled="!transactionInfo.type">
        <el-form-item label="意见">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="transactionInfo.content" >
          </el-input>
        </el-form-item>
        <el-form-item label="是否要结果件">
          <el-select v-model="transactionInfo.isNeedResultForm" placeholder="请选择" style="width: 120px" >
            <el-option v-for="item in optionsSF" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
          <el-date-picker v-model="transactionInfo.resultFormLimitDate" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="截止日期" style="width: 160px" :disabled="transactionInfo.isNeedResultForm === true ? false : true"></el-date-picker>
        </el-form-item>
        <el-form-item label="分发的案管室" >
          <el-select v-model="transactionInfo.sendToSubDeptId"  placeholder="请选择" style="width: 280px">
            <el-option v-for="item in optionsJD" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件上传">
          <file-uploader ref="FileUploader"></file-uploader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="caseDealtWith = false" :disabled="!transactionInfo.type">取 消</el-button>
        <el-button type="primary" @click="isOk" :disabled="!transactionInfo.type">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from 'src/utils/cookies';
  import Global from 'src/lib/global';
  import { showResMsg } from 'src/utils/operation-result-message';
  import caseManagement from 'src/api/case-management-api';
  import FileUploader from 'src/views/content/common/FileUploader';

  export default {
    name: 'Transaction',
    components: {
      FileUploader
    },
    props: {
      value: Boolean,
      transactionInfo: Object,
    },
    data() {
      return {
        Global,
        headers: {
          Authorization: getToken(),
        },
        // inquires: {},

        optionsSF: [{
          value: true,
          label: '是',
        }, {
          value: false,
          label: '否',
        }],
        optionsJD: [],
      };
    },
    watch: {
      transactionInfo(value) {
        this.$nextTick(() => {
          this.$refs.FileUploader.initFileList(value.fileList, value.type);
        });
      }
    },
    methods: {
      close() {
        this.$emit('input', false);
      },
      isOk() {
        this.transactionInfo.fileList = this.$refs.FileUploader.getFileList();
        caseManagement.SubmitForm(this.transactionInfo)
          .then(({ data }) => {
            showResMsg(data);
            this.$emit('up-data');
            this.close();
          });
      },
    },
    computed: {
      caseDealtWith: {
        get() {
          caseManagement.departmentList()
            .then((data) => {
              this.optionsJD = data.data.data;
            });
          return this.value;
        },
        set(flag) {
          if (!flag) {
            this.close();
          }
        },
      },
    },
  };
</script>

<style scoped>

</style>
