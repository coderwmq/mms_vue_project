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
import { login, getUsers } from "@/api/login";
export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
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
          this.$store.dispatch("Login", this.ruleForm).then((response) => {
            if (response.flag) {
              this.$router.push("/");
            } else {
              this.$message({
                message: response.message,
                type: "warning",
              });
            }
          });
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