<template>
  <div id="login_box">
    <h2>注册</h2>
    <div id="form">
      <div id="input_box">
        <el-input v-model="newusr" placeholder="请输入用户账号"></el-input>
      </div>
      <div id="input_box">
        <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
      </div>
      <div id="input_box">
        <el-input v-model="newname" placeholder="请输入名字" ></el-input>
      </div>
      <div id="input_box">
        <el-input v-model="address" placeholder="新用户地址" ></el-input>
      </div>
      <div id="input_box">
        <el-radio v-model="identify" label="1">学生</el-radio>
        <el-radio v-model="identify" label="2">骑手</el-radio>
      </div>
    </div>
    <br /><br />
    <div>
      <el-button type="primary" plain @click="register">确认注册</el-button>
      <el-button type="primary" plain @click="back">返回登录</el-button>
    </div><!--
    <div id="Sign">
      <a href='#/login'>重新登录</a>
    </div>-->
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      newusr: '',
      password: '',
      newname:'',
      address:'',
      identify:'1'
    };
  },
 
  methods:{
    //注册
  register:function(){
      var newusr=this.newusr
      var password=this.password
      var newname=this.newname
      var address=this.address
      var identify=this.identify
      if(newusr==''||password==''||newname==''||address==''){
        if(newusr==''){
            this.$message({
            message: '账号不能为空',
            type: 'warning'
          });
        }
        else if(password==''){
          this.$message({
            message: '密码不能为空',
            type: 'warning'
          });
        }
        else if(newname==''){
            this.$message({
            message: '名字不能为空',
            type: 'warning'
          });
        }
        else if(address==''){
          this.$message({
            message: '地址不能为空',
            type: 'warning'
          });
        }
      }
      else{
     // var class_list='["润园打印店","沁园打印店","澄园打印店","泽园打印店"]'
        this.$axios.post(this.GLOBAL.config_ip+'/register/',{
            usr:newusr,
            pwd:password,
            name:newname,
            address:address,
            identify:identify
        }).then((res)=>{
                if(res.data.code==0){
                    this.$message({
                    showClose: true,
                    message: '注册成功',
                    type: 'success'
                  });
                  location.href='#/login'
              }
                  if(res.data.code==12){
                    this.$message({
                    showClose: true,
                    message: '账号已存在',
                    type: 'warning'
                    });
              }
        }).catch((err)=>{
            alert(err)
        })
      }
    } ,


  back:function(){
    location.href='#/login'
  }

  }
}
  //methods
</script>
