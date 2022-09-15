<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<template>

  <el-container>
    <el-header><el-page-header @back="goBack" content="打印文件提交情况"></el-page-header> </el-header>

    <el-main>
      <div id="input_box" >
        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 1}" placeholder="发布者" v-model="detail_publish_user_name" :disabled="true" size="mini"></el-input>
      </div>
      <div id="input_box" >
        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 1}" placeholder="作业名称" v-model="detail_publish_work_name" :disabled="true" size="mini"></el-input>
      </div>
      <div id="input_box">
        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" placeholder="作业要求" v-model="detail_publish_work_desc" :disabled="true" size="mini"></el-input>
      </div>
      <div id="input_box">
        <el-date-picker v-model="detail_publish_work_deadline" type="date" placeholder="作业截止日期" :disabled="true" size="mini" style="width: 100%;"> </el-date-picker>
      </div>
    </el-main>

    <el-main>
      <el-table
      v-loading="loading"
      :data="tableData_student"
      border
      style="width: 100%"
      height="300"
      size="mini"

      >
        <el-table-column   prop="submitStat" :formatter="formatteri" label="订单号" sortable min-width="100" >  </el-table-column>
        <el-table-column   prop="usr"  label="账号名" sortable min-width="100" >  </el-table-column>
        <el-table-column   prop="score" :formatter="formatterS" label="需要的花费" sortable min-width="100" >  </el-table-column>
        <el-table-column   prop="ifdelivery" :formatter="formatterC" label="是否被接单" sortable min-width="100" >  </el-table-column>

        <el-table-column   label="操作" fixed="right" min-width="320">
          <template slot-scope="scope">
            <!--
            <el-button @click="Preview(scope.row.usr)" 
            type="text" 
            icon="el-icon-search"
            size="mini">
            预览word作业
            </el-button>
            -->
            <el-button @click="Previewplus(scope.row.usr)" 
            type="text" 
            icon="el-icon-download"
            size="mini">
            下载所有附件
            </el-button>

            <el-button @click="showEditDialog(scope.row.usr,scope.row.submitStat)" 
            type="text" 
            icon="el-icon-edit"
            size="mini">
            计算金额
            </el-button>

          </template>
      
        </el-table-column>


      </el-table> 

    <!-- 修改用户成绩的对话框 -->
      <el-dialog
        title="计算金额"
        :visible.sync="editDialogVisible"
        width="25%"
        size="mini">
        <el-form :model="editForm"  label-width="50px">
          <el-form-item label="账号" size="mini">
            <el-input v-model="editForm.usr" disabled></el-input>
          </el-form-item>
          <el-form-item label="金额" size="mini">
            <el-input-number v-model="editForm.score"  style="width: 100%;"></el-input-number>
          </el-form-item>
          <font style="font-size:10px;margin-left:-30px;!important" color="red">{{tips}}</font>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false" size="mini" >取 消</el-button>
          <el-button type="primary" @click="confirm(editForm)" size="mini">确 定</el-button>
        </span>
      </el-dialog>

    </el-main>



  </el-container>


</template>

<script>
var arr=[];
  export default {
    data(){
        return{
          loading:false,
        tableData_student:[],
        detail_publish_user_name:"",
        detail_publish_work_deadline:"",
        detail_publish_work_desc:"",
        detail_publish_work_name:"",
        editDialogVisible: false,
        editForm:{},
        tips:"",
        tips1:"",
        test_submitStat:"",
        }
    },
    created: function () {
        this.loading=true,
        this.$axios.post(this.GLOBAL.config_ip+"/get_assignments_detail",{
            token:localStorage.getItem("token"),
            work_code:localStorage.getItem("work_code")
        }).then((res)=>{
          localStorage.setItem("token",res.data.token)
          this.tableData_student=Array.from(res.data.stu_list)
          this.loading=false
        })
/*************************作业详情**************************************************/
      this.$axios.post(this.GLOBAL.config_ip+'/get_assignments_detail',{
        "token":localStorage.getItem("token"),
        "work_code":localStorage.getItem("work_code")
      }).then((response)=>{
        localStorage.setItem("token",response.data.token)
        this.detail_publish_user_name="发布者:"+response.data.work_belong
        this.detail_publish_work_deadline=response.data.work_deadline
        this.detail_publish_work_desc="要求:"+response.data.work_desc
        this.detail_publish_work_name="作业名:"+response.data.work_name
        });

    },
    ////////////返回/////////////////////////////////////////
    methods: {
      goBack() {
        location.href='#/teacher'
      },
      formatteri:function(row, column, cellValue, index){
        return row.id
      },
      //打印文件算钱
      formatterC:function(row, column, cellValue, index){
        return row.ifdelivery == 0 ? '未被骑手接单' : row.ifdelivery == 1 ? '已被骑手接单' : '未知';
      },
      formatterS:function(row, column, cellValue, index){
        return row.score < -1 ? '已打印文件及结算金额' : row.score == -1 ? '未打印文件及结算金额' : row.score;
      },
/*******************************************预览作业****************************************************** */
  /*
    Preview(usr){
      this.$axios.post(this.GLOBAL.config_ip+'/preview_assignment',{
        "token":localStorage.getItem("token"),
        "work_code":localStorage.getItem("work_code"),
        "usr":usr
      }).then((response)=>{

        if(response.data.code==0){
          window.open(this.GLOBAL.config_ip+response.data.url)
          localStorage.setItem("token",response.data.token)
        }
        else{
          this.$notify({
            title:'错误',
            message:'作业未提交',
            type:'error'
          })
        }
        })
    },
    */
////////////////////////////下载附件/////////////////////////////////////////
    Previewplus(usr){
      this.$axios.post(this.GLOBAL.config_ip+'/download_assignments_plus',{
        "token":localStorage.getItem("token"),
        "work_code":localStorage.getItem("work_code"),
        "usr":usr
      }).then((response)=>{
        if(response.data.code==0){
          window.open(this.GLOBAL.config_ip+response.data.download_url)
          localStorage.setItem("token",response.data.token)
        }
        }).catch(()=>{
            console.log(this)
            this.$notify({
              title:'消息',
              message:'文件未提交',
              type:'info'
            })
          })
    },

    showEditDialog(usr,submitStat) {
      this.tips=this.tips1,
      this.editForm.usr=usr,
      this.editDialogVisible = true
      this.test_submitStat=submitStat
    },
      
    editUserInfo(editForm){

     //   this.tips=tips1
        if(/^((100)|(\d{1,2}))(\.\d{0,2})?$/.test(editForm.score)==true){
        //是数字

      this.$axios.post(this.GLOBAL.config_ip+'/grade_assignments',{
        "token":localStorage.getItem("token"),
        "work_code":localStorage.getItem("work_code"),
        "updateTarget":[editForm]
      }).then((response)=>{
        if(response.data.code==0){
          localStorage.setItem("token",response.data.token)
          this.$notify({
            title:'成功',
            message:'输入金额成功',
            type:'success'
          })
        }
        this.editForm.score=""
        this.tips=""

        this.$axios.post(this.GLOBAL.config_ip+'/get_assignments_detail',{
          token:localStorage.getItem("token"),
          work_code:localStorage.getItem("work_code")
        }).then((res)=>{
          this.tableData_student=Array.from(res.data.stu_list)
          this.editDialogVisible = false
        })

        })


        
        }
        else{
          this.editForm.score=""
          this.tips="请输入 0~100 的有效金额,最多精确小数点后两位"
        }
        this.tips1=""

    },
    confirm(editForm){

      if(this.test_submitStat==false)
      {
          this.$confirm('此用户未提交文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(()=>{
            this.editUserInfo(editForm);
          }).catch(()=>{

          })
      }
      else
      {
        this.editUserInfo(editForm)
      }
    }
    }
  }
</script>