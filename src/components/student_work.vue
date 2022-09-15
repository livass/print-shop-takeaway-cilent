<template>
<div>
  <div id="link">
    <i class="el-icon-house"></i>
<el-link type="primary" href='#/login'>退出登录</el-link>
</div>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      fixed
      prop="work_name"
      label="服务名"
      width="800">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
    >
      <template slot-scope="scope">
        <el-button @click="checkdetail(scope.$index)" type="text">查看详情</el-button>
        <el-button @click="postfile(scope.$index)" type="text">提交文件</el-button>
        <el-button @click="checkorder(scope.$index)" type="text">查看订单</el-button>
        <el-button @click="lookscore(scope.$index)" type="text">查看金额</el-button>
      </template>
    </el-table-column>
  </el-table>



<!--对话框-->
  <el-dialog title="此服务订单" :visible.sync="dialogTableVisible">
  <el-table :data="tableData2" style="width: 100%">
    <el-table-column property="porder_id" label="订单号" width="100"></el-table-column>
    <el-table-column property="porder_work" label="服务名" width="150"></el-table-column>
    <el-table-column property="ifdelivery" :formatter="formatterC" label="是否接单" width="150"></el-table-column>

    <el-table-column  fixed="right" label="操作" width="300">
      <!--放弃订单或者接收订单-->
      <template slot-scope="scope">
        <el-button @click="getorder(scope.$index, scope.row)">接收订单</el-button>
        <el-button @click="giveuporder(scope.$index, scope.row)">取消订单</el-button>
      </template>
      <!---->
    </el-table-column> 


  </el-table>
</el-dialog>
<!--对话框-->



  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
var arr1=[];
// eslint-disable-next-line no-unused-vars
var arr2=[];
// eslint-disable-next-line no-unused-vars
var arr3=[]
export default {
    data() {
      return {
        tableData:[],
        tableData2:[],
        dialogTableVisible:false
        //tableData
        
}
},
created:function(){//获取work_name和获取work_code
    // `this` 指向 vm 实例
        this.$axios.post(this.GLOBAL.config_ip+'/get_assignments_list_by_class/',{
            token:localStorage.getItem("token"),
            class:localStorage.getItem("class")
        }).then((res)=>{
            localStorage.setItem("token",res.data.token)
            arr1.length=res.data.work_list.length
            arr2.length=res.data.work_list.length
            for(let i=0;i<res.data.work_list.length;i++)
                {
                    arr1[i]={work_name:res.data.work_list[i].work_name}
                    arr2[i]=res.data.work_list[i].work_code
                }
            this.tableData=Array.from(arr1)

            })
},


methods:{
  //查看金额
  //----------------------------------------------------------------------------------------------------------------------------------------------
formatterC:function(row, column, cellValue, index){
        return row.ifdelivery == 0 ? '未被骑手接单' : row.ifdelivery == 1 ? '已被骑手接单' : '未知';
      },
  // eslint-disable-next-line no-unused-vars
  lookscore(index){
    this.$axios.post(this.GLOBAL.config_ip+'/get_score/',{
      "token":localStorage.getItem("token"),
      "work_code":arr2[index],
      "usr":localStorage.getItem("usr")
    }).then((res)=>{
      console.log(res.data.score_detail.score)
      if(res.data.score_detail.score<0){
      if(res.data.score_detail.score<=-2){
        this.$message({
                  showClose: true,
                  message: '未提交文件',
                  type: 'error'
                })
      }
      if(res.data.score_detail.score==-1){
          this.$message({
                  showClose: true,
                  message: '老板还未算账',
                  type: 'error'
                })
      }
      }
      else{
      localStorage.setItem("token",res.data.token)
          this.$alert("花费的金额是"+res.data.score_detail.score+"元", '金额详情', {
          dangerouslyUseHTMLString: true
        });}
    }).catch((err)=>{
      alert(err)
    })
  },
  
  //----------------------------------------------------------------------------------------------------------------------------------------------
  //查看分数
  //----------------------------------------------------------------------------------------------------------------------------------------------
  //上传文件
  postfile(index){
        localStorage.setItem("work_code",arr2[index])
        console.log(arr2[index])
        location.href='#/student_work_submit01'
  },
  //上传文件
  //查看订单
  //-------------------------------------------------------------------------------------------------------------------------------------------
    checkorder(index){
      this.$axios.post(this.GLOBAL.config_ip+'/usrcheckorder/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "work_code":arr2[index]
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=true
            localStorage.setItem("token",res.data.token)
            //res.data.order_list=[res.data.order_list]
            this.tableData2=Array.from(res.data.order_list)
            arr3=Array.from(res.data.order_list)
        }
        else{
        this.$message({
                  showClose: true,
                  message: '你还未提交文件',
                  type: 'error'
                })
        }
      // eslint-disable-next-line no-unused-vars
      }).catch((err)=>{
        this.$message({
                  showClose: true,
                  message: '你还未提交文件',
                  type: 'error'
                })
      })
  },
  //------------------------------------------------------------------------------------------------------------------------------------------
  //查看详情
  checkdetail(index){
    console.log(arr2[index])
    this.$axios.post(this.GLOBAL.config_ip+'/get_assignments_detail/',{
        "token":localStorage.token,
        "work_code":arr2[index]
        }).then((res)=>{
            localStorage.setItem("token",res.data.token)
            //alert
            // eslint-disable-next-line no-unused-vars
            var date = new Date(res.data.work_deadline).toLocaleDateString() + " " //+ new Date(res.data.work_deadline).toLocaleTimeString()
            /*this.$alert(res.data.work_belong+'的作业:'+res.data.work_desc+'截止日期:'+date, '作业详情', {
            confirmButtonText: '确定',
            callback:  action=> {
            this.$message({
              type: 'info',
              message: action
            });
          }
        });*/
            const h = this.$createElement;
            let newDatas=res.data.work_desc.split("\n").map(v=>h("p",null,v))
            newDatas.push(h("p",null,'截止日期:'+date))
            newDatas.unshift(h("p",null,res.data.work_belong+'打印店老板的打印服务要求:'))
            /*this.$message({
              message: h("div", null, newDatas),
              type: "success"
            });*/
          this.$alert( h("div", null, newDatas),'查看详情',{
          dangerouslyUseHTMLString: true
          });
        //alert
        }).catch(function(err){
            alert(err)
        })
        },

    getorder(index,row){
    this.$axios.post(this.GLOBAL.config_ip+'/del_order/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "order_id": arr3[index].porder_id
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=false
            localStorage.setItem("token",res.data.token)
            this.checkorder(index)
            //setTimeout(()=>{this.dialogTableVisible=true},10)
            this.$message({
              showClose: true,
              message: '接收成功',
              type: 'success'
        });
        }
        else{
        this.$message({
                  showClose: true,
                  message: '错误',
                  type: 'error'
                })
        }
      // eslint-disable-next-line no-unused-vars
      })
  },

  giveuporder(index){
    this.$axios.post(this.GLOBAL.config_ip+'/del_order/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "order_id": arr3[index].porder_id
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=false
            localStorage.setItem("token",res.data.token)
            this.checkorder(index)
            //setTimeout(()=>{this.dialogTableVisible=true},10)
            this.$message({
              showClose: true,
              message: '接收成功',
              type: 'success'
        })
        }
        else{
        this.$message({
                  showClose: true,
                  message: '错误',
                  type: 'error'
                })
        }
      // eslint-disable-next-line no-unused-vars
      })
  }
  }
//-----------------------------------------------------------------------------------------------------------------------------------------
//over
//
}
</script>