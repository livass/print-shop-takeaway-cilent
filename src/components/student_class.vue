<template>
<!--表格-->
<div>
  <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      fixed
      prop=class
      label="打印店"
      width="800">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
    >
<!--表格-->
<!--操作-->
      <template slot-scope="scope">
        <i class="el-icon-caret-right"></i>
        <el-button @click="intoclass(scope.$index, scope.row)" type="text">进入打印店</el-button>
        <i class="el-icon-more"></i>
        <el-button @click="showorder(scope.$index, scope.row)" type="text">查看订单</el-button>
      </template>
<!--操作-->>
    </el-table-column>
  </el-table>
<!--对话框-->
<el-dialog title="此服务订单" :visible.sync="dialogTableVisible">
  <el-table :data="tableData2" >
    <el-table-column prop="porder_id" label="订单号" width="100"></el-table-column>
    <el-table-column prop="porder_work" label="服务名" width="150"></el-table-column>
    <el-table-column prop="ifdelivery" :formatter="formatterC" label="是否接单" width="150"></el-table-column> 
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
var arr=[]
var arr2=[]
    export default {
    data() {
      return {
        //tableData
        tableData:[],
        dialogTableVisible:false,
        tableData2:[]
    }
},
//获取class
created:function(){//获取class_list
    // `this` 指向 vm 实例
        this.$axios.post(this.GLOBAL.config_ip+'/get_class_list/',{
            token:localStorage.getItem("token")
        }).then((res)=>{
            localStorage.setItem("token",res.data.token)
            //string   =   json
            for(let i=0;i<res.data.class_list.length;i++)
                {
                    res.data.class_list[i]={class:res.data.class_list[i]}
                }
                localStorage.setItem("length",res.data.class_list.length)
            this.tableData=Array.from(res.data.class_list)
            arr=Array.from(res.data.class_list)
            })
    },
methods:{
    formatterC:function(row, column, cellValue, index){
        return row.ifdelivery == 0 ? '未被骑手接单' : row.ifdelivery == 1 ? '已被骑手接单' : '未知';
      },
  //进入班级
    // eslint-disable-next-line no-unused-vars
    intoclass(index,row){
        localStorage.setItem("class",row.class)
        location.href='#/student_work'
    },
    //订单显示
    showorder(index){
      this.$axios.post(this.GLOBAL.config_ip+'/get_orderbyuac/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "porder_get": arr[index].class
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=true
            localStorage.setItem("token",res.data.token)
            //res.data.order_list=[res.data.order_list]
            this.tableData2=Array.from(res.data.order_list)
            arr2=Array.from(res.data.order_list)
        }
        else{
        this.$message({
                  showClose: true,
                  message: '错误',
                  type: 'error'
                })
        }
      // eslint-disable-next-line no-unused-vars
      }).catch((err)=>{
        this.$message({
                  showClose: true,
                  message: 'err',
                  type: 'error'
                })
      })
    },
//接收订单
  getorder(index,row){
    this.$axios.post(this.GLOBAL.config_ip+'/del_order/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "order_id": arr2[index].porder_id
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=false
            localStorage.setItem("token",res.data.token)
            this.showorder(index)
            setTimeout(()=>{this.dialogTableVisible=true},100)
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
      }).catch((err)=>{
        this.$message({
                  showClose: true,
                  message: 'err',
                  type: 'error'
                })
      })
  },
//--------------------------------------------------------------取消订单------------------------------------------
  giveuporder(index){
    this.$axios.post(this.GLOBAL.config_ip+'/del_order/',{
        "token":localStorage.getItem("token"),
        "usr":localStorage.getItem("usr"),
        "order_id": arr2[index].porder_id
      }).then((res)=>{
        if(res.data.code==0){
            this.dialogTableVisible=false
            localStorage.setItem("token",res.data.token)
            this.showorder(index)
            setTimeout(()=>{this.dialogTableVisible=true},100)
            this.$message({
              showClose: true,
              message: '取消成功',
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
      }).catch((err)=>{
        this.$message({
                  showClose: true,
                  message: 'err',
                  type: 'error'
                })
      })
  }

}


}
</script>