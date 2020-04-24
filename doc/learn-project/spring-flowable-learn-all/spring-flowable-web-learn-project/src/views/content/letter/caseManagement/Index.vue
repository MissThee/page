<template>
  <div>
    <el-form :inline="true" class="demo-form-inline reduce-height-element">
      <el-form-item label="办理状态">
        <el-select size="small" v-model="inquire.stateId" clearable placeholder="全部" style="width:100px" @change="fetchData">
          <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线索编号：" style="margin-left: 10px;">
        <el-input size="small" v-model="inquire.letClueId" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="主要问题：">
        <el-input size="small" v-model="inquire.content" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="被反映人：">
        <el-input size="small" v-model="inquire.defendantName" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="限制天数：">
        <el-input size="small" v-model="inquire.leftDayNum" style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="受理时间：">
        <el-date-picker size="small" v-model="timeQuantum" @change="selectionTime" style="width: 300px;" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-button type="primary" size="small" plain class="custom-button-in-toolbar" style="margin-top: 10px;" @click="inquireFunction">查询</el-button>
      <el-button type="primary" size="small" plain class="custom-button-in-toolbar" icon="el-icon-circle-plus-outline" @click="caseManagerAdd">增加</el-button>
    </el-form>
    <el-table :data="tableData" border header-cell-class-name="custom-header-cell" :height="tableAutoHeight" stripe style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="letClue.id" align="center" width="110" label="线索编码" sortable></el-table-column>
      <el-table-column prop="letClue.content" align="center" min-width="150" label="主要问题" sortable></el-table-column>
      <el-table-column prop="letClue.letDefendantList" align="center" min-width="360" sortable label="被反映人信息">
        <template slot-scope="scope">
          <table v-if="scope.row.letClue.letDefendantList.length>0" style="table-layout: fixed;width: 100%;border-collapse: collapse">
            <tr v-for="letDefendant in scope.row.letClue.letDefendantList">
              <td class="is-center" style="border: 1px solid #ddd;width: 30%">
                <div>{{letDefendant.name}}</div>
              </td>
              <td class="is-center" style="border: 1px solid #ddd;width: 70%">
                <div>{{letDefendant.companyName}}</div>
              </td>
            </tr>
          </table>
          <div v-if="scope.row.letClue.letDefendantList.length===0" style="color: #ccc">无被反映人</div>
        </template>
      </el-table-column>
      <el-table-column prop="sendToSubDeptName" align="center" min-width="150" label="案件管理室名称" sortable></el-table-column>
      <el-table-column prop="content" align="center" min-width="150" label="意见" sortable></el-table-column>
      <el-table-column prop="operationDate" align="center" width="110" label="办理时间" sortable>
        <template slot-scope="scope">
          <span v-html="dateInTableFormatter(scope.row.operationDate)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="resultFormLimitDate" align="center" width="120" label="结果件期限" sortable>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isNeedResultForm" :type="getLevelAlertColor(scope.row.resultFormLimitDate)">
            <span v-html="getLevelAlertTime(scope.row.resultFormLimitDate)"></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stateId" align="center" width="75" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag style="margin-left: 2px" :type="scope.row.stateId === 0 ? 'warning' : scope.row.stateId === 1 ? 'success' : 'danger'" size="mini">
            {{ scope.row.stateId === 0 ? '未办理' : scope.row.stateId === 1 ? '已办理' : '已驳回' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="210" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" plain class="custom-button-in-table" icon="el-icon-document"
                     @click="transactionFunction(scope.$index, scope.row)"
                     v-if="scope.row.stateId !== 2">
            {{ scope.row.stateId === 1 ? '查看' : '办理' }}
          </el-button>
          <el-button type="primary" size="mini" plain class="custom-button-in-table" icon="el-icon-edit"
                     @click="modification(scope.$index, scope.row)">
            {{ scope.row.stateId === 1 || scope.row.stateId === 2 ? '查看' : '修改' }}
          </el-button>
          <el-button type="danger" size="mini" plain class="custom-button-in-table" icon="el-icon-warning"
                     @click="reject(scope.$index, scope.row)"
                     v-if="scope.row.stateId !== 1 && scope.row.stateId !== 2">驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;box-sizing: border-box"
      class="reduce-height-element"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="inquire.pageIndex"
      :page-size="inquire.pageSize"
      layout="total, prev, pager, next"
      :total="totalNumber">
    </el-pagination>
    <!----------------------------增加对话框-------------------------------->
    <el-dialog :close-on-click-modal="false" :title="titleName" @closed="letterClueFormDialogClosedHandler()" width="840px" :visible.sync="dialogFormVisible">
      <div v-loading="IsLoading">
        <LetterClue ref="LetterClueForm" @finishAddOrUpdate="fetchDataAfterOperation"></LetterClue>
      </div>
    </el-dialog>
    <!----------------------------案件办理对话框---------------------------->
    <Transaction v-model="showTransaction" :transaction-info="transactionInfo" @up-data="fetchData"></Transaction>
  </div>
</template>

<script>
  import LetterClue from 'src/views/content/letter/LetterClue';
  import Transaction from './Transaction';
  import caseManagement from 'src/api/case-management-api';
  import { showResMsg } from 'src/utils/operation-result-message';
  import SimpleAutoHeightTable from 'src/mixin/SimpleAutoHeightTable';

  export default {
    mixins: [SimpleAutoHeightTable],
    name: 'Index',
    data() {
      return {
        timeQuantum: '',
        changeInfo: {},
        transactionInfo: {},
        titleName: '',
        IsLoading: false,
        dialogFormVisible: false,
        showTransaction: false,
        tableData: [],
        totalNumber: 1,
        inquire: {
          pageIndex: 1,
          pageSize: 50,
          letClueId: '',
          defendantName: '',
          content: '',
          startReceptionTime: '',
          endReceptionTime: '',
          leftDayNum: '',
          stateId: 0,
        },
        optionsType: [{
          value: 0,
          label: '未办理',
        }, {
          value: 1,
          label: '已办理',
        }, {
          value: 2,
          label: '已驳回',
        }],
      };
    },
    created() {
      this.fetchData();
    },
    components: {
      LetterClue,
      Transaction,
    },
    methods: {
      dateInTableFormatter(date) {
        if (date === undefined || date === '' || date === null) {
          return '';
        }
        return date.replace(' ', '<br>');
      },
      getLevelAlertTime(limitDate) {
        if (limitDate === undefined || limitDate === '' || limitDate === null) {
          return '无期限时间';
        }
        let limitDateObj = new Date(limitDate.replace(/-/g, '/'));

        let y = limitDateObj.getFullYear();
        let m = (limitDateObj.getMonth() < 9 ? '0' : '') + (limitDateObj.getMonth() + 1);
        let d = (limitDateObj.getDate() < 10 ? '0' : '') + (limitDateObj.getDate());
        let leftDayStr = '';
        if (limitDate !== undefined && limitDate !== '' && limitDate !== null) {
          let leftTime = new Date(limitDate.replace(/-/g, '/')).getTime() - new Date().getTime();
          let leftDay = leftTime / 1000 / 60 / 60 / 24 + 1;
          if (leftDay > 0 && leftDay < 1) {
            leftDayStr = '<br>不足1天';
          } else if (leftDay > 0) {
            leftDayStr = '<br>剩余' + parseInt(leftDay) + '天';
          } else {
            leftDayStr = '<br>超过期限';
          }
        }

        return y + '-' + m + '-' + d + leftDayStr;
      },
      getLevelAlertColor(limitDate) {
        if (limitDate === undefined || limitDate === '' || limitDate === null) {
          return 'success';
        }
        let leftTime = new Date(limitDate.replace(/-/g, '/')).getTime() - new Date().getTime();
        let leftDay = leftTime / 1000 / 60 / 60 / 24 + 1;
        if (leftDay < 0) {
          return 'danger';
        } else if (leftDay <= 3) {
          return 'warning';
        } else if (leftDay <= 7) {
          return 'primary';
        } else {
          return 'success';
        }
      },
      fetchDataAfterOperation(result) {
        if (result) {//窗口中修改成功则调用
          this.dialogFormVisible = false;
          this.fetchData();
        }
      },
      handleSizeChange(val) {
        this.inquire.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.inquire.pageIndex = val;
        this.inquire.pageIndex = val;
        this.fetchData();
      },
      fetchData() {
        caseManagement.queryList(this.inquire)
          .then(({ data }) => {
            this.tableData = data.data.list;
            this.totalNumber = data.data.total;
          });
      },
      selectionTime(data) {
        if (data !== null) {
          this.inquire.startReceptionTime = data[0];
          this.inquire.endReceptionTime = data[1];
        }
      },
      inquireFunction() {
        this.fetchData();
      },
      caseManagerAdd() {
        this.titleName = '添加';
        this.dialogFormVisible = true;
        this.changeInfo = {
          canEdit: true,
          isCreate: true,
          typeDistinguish: true,
        };
        this.$nextTick(() => {//子组件加载完后再调用其中方法
          this.$refs.LetterClueForm.iniFormDataForEdit(this.changeInfo);
        });
      },
      transactionFunction(index, row) {
        caseManagement.queryOneTransaction({
          id: row.id,
        })
          .then((data) => {
            this.showTransaction = true;
            this.transactionInfo = data.data.data;
            this.transactionInfo.id = row.id;
            this.transactionInfo.type = row.stateId !== 1;
          });
      },
      modification(index, row) {
        caseManagement.queryCasePipeId({
          id: row.letClue.id,
        })
          .then((data) => {
            this.changeInfo = {
              canEdit: this.letClueIsEditable(row.stateId),
              isCreate: false,
              letClueForm: data.data.data,
              typeDistinguish: false,
            };
            this.titleName = row.stateId === 0 ? '修改' : '查看';
            this.dialogFormVisible = true;
            this.$nextTick(() => {//子组件加载完后再调用其中方法
              this.$refs.LetterClueForm.iniFormDataForEdit(this.changeInfo);
            });
          });
      },
      letClueIsEditable(resultTypeId) {
        switch (resultTypeId) {
          case 0:
          case null:
            return true;
          default:
            return false;
        }
      },
      letterClueFormDialogClosedHandler() {
        this.$refs.LetterClueForm.clearDialogForm();
      },
      reject(index, row) {
        const id = row.id;
        this.$confirm('此操作会将此安管信息驳回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            caseManagement.submitDismiss({
              id: id,
            })
              .then(({ data }) => {
                showResMsg(data);
                this.fetchData();
              });
          });
      },
    },

  };
</script>

<style scoped>

</style>
