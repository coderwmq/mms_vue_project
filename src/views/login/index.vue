<template>
  <div class="login-container">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="login-form"
    >
      <h2 class="login-title">梦学谷会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login,getUser} from "@/api/login";
export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },

  components: {},

  methods: {
    // 点击登录按钮
    submitForm(formName) {
      // 输入框校验
      this.$refs[formName].validate((valid) => {
        // 校验通过
        if (valid) {
          login(this.ruleForm.username, this.ruleForm.pass)
            .then((response) => {
              // 请求到数据
              const resp = response.data;
              // 如果拿到token,继续请求
              if (resp.flag) {
                getUser(resp.data.token).then(response=>{
                  const respUser=response.data
                  // 如果获取到用户信息
                  if (respUser.flag) {
                    // 将信息存放到本地
                    localStorage.setItem('mms-user',JSON.stringify(respUser.data))
                    localStorage.setItem('mms-token',resp.data.token)
                    // 前往首页
                    this.$router.push('/')
                  }
                })
              }
            });
        } else {
          //校验不通过
          return false;
        }
      });
    },
  },
};
</script>


<style scoped>
.login-form {
  width: 360px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 50px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg");
  overflow: hidden;
}
.login-title {
  text-align: center;
  color: #303133;
}
</style>