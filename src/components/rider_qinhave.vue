<template>
<div>
  <div id="link">
    <i class="el-icon-house"></i>
<el-link type="primary" href='#/login'>退出登录</el-link>
</div>
  <el-table
    :v-loading="loading"
    :data="tableData"
    style="width: 100%">
    <el-table-column
      fixed="left"
      prop="order_id"
      label="订单号"
      width="200">
    </el-table-column>
    <el-table-column
      prop="delivery_get"
      label="订单所有者"
      width="200">
    </el-table-column>
    <el-table-column
      prop="delivery_point"
      label="打印店"
      width="200">
    </el-table-column>
    <el-table-column
      prop="delivery_address"
      label="目标地址"
      width="200">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
    >
      <template slot-scope="scope">
        <el-button @click="getorder(scope.$index)">放弃订单</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
var arr1=[];
// eslint-disable-next-line no-unused-vars
var arr2=[];
// eslint-disable-next-line no-unused-vars
export default {
    data() {
      return {
        tableData:[]
        //tableData
        
}
},
created:function(){//获取work_name和获取work_code
    // `this` 指向 vm 实例
        this.loading=true
        this.$axios.post(this.GLOBAL.config_ip+'/get_shopyouorder_list/',{
            token:localStorage.getItem("token"),
            usr:localStorage.getItem("usr"),
            address:"沁园打印店"
        }).then((res)=>{
            localStorage.setItem("token",res.data.token)
            for(let i=0;i<res.data.order_list.length;i++)
                {
                    arr1[i]=res.data.order_list[i].order_id
                }
                console.log(arr1)
            this.tableData=Array.from(res.data.order_list)
            console.log(res.data.order_list)
            console.log(this.tableData)
            this.loading=false
            })
},


methods:{
  //抢此订单
  getorder(index){
    this.$confirm('你确定要放弃此订单', '是否泛放弃此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
    this.$axios.post(this.GLOBAL.config_ip+'/rider_giveup_order/',{
      token:localStorage.getItem("token"),
      order_id:arr1[index]
    }).then((res)=>{
      localStorage.setItem("token",res.data.token)
      })
      this.$message({
            showClose: true,
            message: '已放弃该订单',
            type: 'success'
              });
      location.reload();
    })
      
  },

}
}
</script>