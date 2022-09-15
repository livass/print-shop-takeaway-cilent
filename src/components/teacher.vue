<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<template>
  <div class="发布打印任务">
    <div id="link">
    <i class="el-icon-house"></i>
<el-link type="primary" href='#/login'>退出登录</el-link>
</div>
    <el-tabs type="border-card">

    <!-----------------------------------------------------------发布作业------------------------------------------------------>
      <el-tab-pane>
        <span slot="label" class="el-icon-edit">发布任务</span>
        <div id="input_box">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="打印服务名称" v-model="publish_work_name"></el-input>
        </div>
        <div id="input_box">
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="打印服务要求" v-model="publish_work_desc"></el-input>
        </div>
        <div id="input_box">
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 1}" placeholder="可不填写" v-model="text"></el-input>
        </div>
        <br>
        <div id="input_box">
            <el-date-picker v-model="publish_work_deadline" type="date" placeholder="选择服务的截止日期"> </el-date-picker>
        
            <el-select v-model="publish_work_class" clearable placeholder="请选择接收任务的打印店" >
                <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
                >
                </el-option>
            </el-select>
        </div>
        <br/><br/>
        <div>
          <el-button type="primary" sizes="medium" plain @click="publish_assignments" icon="el-icon-s-order">点 击 即 可 发 布 服 务</el-button>
        </div>
        <br>

    </el-tab-pane>


    <!-----------------------------------------------------------服务详情------------------------------------------------------>
      <el-tab-pane>
        <span slot="label" class="el-icon-search">查看服务详情</span>
            <div id="input_box">
                <el-select v-model="detail_work_class" clearable placeholder="请选择查看的打印店" @change="get_class_assignments">
                    <el-option
                      v-for="item in options"
                     :key="item"
                     :label="item"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
 
            <el-table
            :data="tableData"
            border
            style="width: 100%"
            height="400"
            
            >

            <el-table-column  prop="work_name"  label="服务名" min-width="500"  >  </el-table-column>
<!------------------------------------------- 下载WORD作业包 ------------------------------------------------------------------------------>
            <el-table-column  fixed="right"  label="编辑" min-width="500" >
                <template slot-scope="scope">
                    <el-button @click="download_assignments(scope.row.work_code)" 
                    type="text" 
                    icon="el-icon-download">
                    下载word作业包
                    </el-button>

<!------------------------------------------- 下载所有作业包 ------------------------------------------------------------------------------>
                    <el-button @click="download_assignments_plus(scope.row.work_code)" 
                    type="text" 
                    icon="el-icon-download">
                    下载所有打印文件包
                    </el-button>
<!------------------------------------------ 删除服务 ------------------------------------------------------------------------------->        
                    <el-button
                    @click="delete_confirm(scope.$index,tableData,scope.row.work_code)"
                    type="text"
                    icon="el-icon-delete">
                    删除服务
                    </el-button>
<!----------------------------------------- 服务详情(对应作业上交情况及打分等功能界面) ------------------------------------------------->
                    <el-button
                    @click="detail_assignments(scope.row.work_code)"
                    type="text"
                    icon="el-icon-folder-opened">
                    服务详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  data() {
    return {
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },

        },
        publish_work_deadline: '',
        options: [],                  //
        publish_work_class: '',
        publish_work_code:'',
        publish_work_name:'',
        publish_work_desc:'',
        download_work_code:'',
        download_url:'',
        delete_work_code:'',
        detail_work_class:'',
        tableData:[],
        text:'',
    }
  },
  mounted(){
    this.class_list();
  },
    created: function () {
      this.$axios.post(this.GLOBAL.config_ip+'/watermark_text_get',{
        "token":localStorage.getItem("token"),
      }).then((response)=>{
        console.log(response.data.code)
        localStorage.setItem("token",response.data.token)
        this.text=response.data.text
        });

    },

  methods:{
          /* -----------------------------------发布服务方法-------------------------------------- */
    publish_assignments(){
      if(!this.publish_work_name){
        this.$message({
          message:'请输入服务名称',
          type:'warning'
        })
      }
      else if(!this.publish_work_desc){
        this.$message({
          message:'请输入服务要求',
          type:'warning'
        })
      }
      else if(!this.publish_work_deadline){
        this.$message({
          message:'请选择服务截止日期',
          type:'warning'
        })
      }
      else if(!this.publish_work_class){
        this.$message({
          message:'请选择打印店',
          type:'warning'
        })
      }
      else{
      this.$axios.post(this.GLOBAL.config_ip+'/publish_assignments/',{
        "token":localStorage.getItem("token"),
        "work_name":this.publish_work_name,
        "work_desc":this.publish_work_desc,
        "work_deadline":this.publish_work_deadline.getTime(),
        "work_class":this.publish_work_class
      }).then((response)=>{
        localStorage.setItem("token",response.data.token)
        if(response.data.code==0){
            this.$notify({
                title:'成功',
                message:'发布成功',
                type:'success'
            })
        }
        else if(response.data.code==26){
            this.$notify({
                title:'错误',
                message:'当前用户不在此班级中，无法发布作业',
                type:'error'
            })
        }
        }).catch((error)=>{
            this.$notify({
                title:'错误',
                message:error,
                type:'error'
            })
        });
      
      this.$axios.post(this.GLOBAL.config_ip+'/watermark_text/',{
        "token":localStorage.getItem("token"),
        "text":this.text,
      }).then((response)=>{

      })
    }},
    
    /* -----------------------------------删除发布的服务方法-------------------------------------- */
    delete_assignments(index,tabledata,work_code){
      this.$axios.post(this.GLOBAL.config_ip+'/delete_assignments/',{
      "token":localStorage.getItem("token"),
      "work_code":work_code,
    }).then((response)=>{
        if(response.data.code==0)
         { 
            tabledata.splice(index, 1),
            console.log(this)
            this.$notify({
              title:'成功',
              message:'已成功删除',
              type:'success'
            });
         }
         else{
           this.$notify({
             title:'错误',
             message:JSON.stringify(response.data.msg),
             type:'error'
           });
         }
        }).catch((error)=>{
          this.$notify({
            title:'错误',
            message:error,
            type:'error'
          });
        })
    },
    /********************************获取打印店****************************************/
    get_class_assignments(){
        this.$axios.post(this.GLOBAL.config_ip+"/get_assignments_list_by_class",{
            token:localStorage.getItem("token"),
            class:this.detail_work_class
        }).then((res)=>{
            this.tableData=Array.from(res.data.work_list)
        })
    },
    /********************************* 检索打印店************************************************/ 
    class_list:function(){
        this.$axios.post(this.GLOBAL.config_ip+"/get_class_list",{
            token:localStorage.getItem("token"),
        }).then((res)=>{
            this.options=Array.from(res.data.class_list)
        })
    },
    /*************************************下载word作业****************************************** */
    download_assignments(work_code){
      this.$axios.post(this.GLOBAL.config_ip+'/download_assignments',{
        "token":localStorage.getItem("token"),
        "work_code":work_code,
      }).then((response)=>{
        localStorage.setItem("token",response.data.token)
        if(response.data.code==0){
        window.open(this.GLOBAL.config_ip+response.data.download_url)
      }
        }).catch((error)=>{
         this.$notify({
            title:'错误',
            message:error,
            type:'error'
         })
        })
    },
    /*************************************下载所有服务****************************************** */
    download_assignments_plus(work_code){
      this.$axios.post(this.GLOBAL.config_ip+'/download_assignments_plus',{
        "token":localStorage.getItem("token"),
        "work_code":work_code,
      }).then((response)=>{
        localStorage.setItem("token",response.data.token)
        if(response.data.code==0){
        window.open(this.GLOBAL.config_ip+response.data.download_url)
      }
        }).catch((error)=>{
         this.$notify({
            title:'错误',
            message:error,
            type:'error'
         })
        })
    },

    /*********************************** 服务详情  ******************************************/
    detail_assignments(work_code){
      localStorage.setItem("work_code",work_code),
      location.href='#/teacher_view'
    },
    /* 删除提示 */
    delete_confirm(index,tabledata,work_code){
          this.$confirm('此操作将永久删除该作业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(()=>{
            this.delete_assignments(index,tabledata,work_code);
          }).catch(()=>{
            console.log(this)
            this.$notify({
              title:'消息',
              message:'已取消删除',
              type:'info'
            })
          })
    }
  }
}
</script>
