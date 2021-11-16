<template>
  <div class="header">
    <!-- 头部左侧Logo和标题 -->
    <a href="#/">
      <img class="logo" src="@/assets/logo.png" width="25px" />
      <span class="company">梦学谷管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-circle-close" command="b"
          >退出系统</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { logOut } from "@/api/login";
export default {
  data() {
    return {};
  },

  components: {},

  methods: {
    // 退出系统
    loginOut() {
      // 获取本地token
      const token = localStorage.getItem("msm-token");
      logOut(token)
        .then((response) => {
          const resp = response.data;
          if (resp.flag) {
            // 提醒退出成功
            this.$message({
              message: resp.message,
              type: "success",
            });
            // 清空本地token和user信息
            localStorage.removeItem("mms-token");
            localStorage.removeItem("mms-user");
            this.$router.push('/login')
          } else {
            this.$message({
              message: resp.message,
              type: "warning",
            });
          }
        })
        .catch((error) => {
          return false;
        });
    },
    // 判断点击
    handleCommand(command) {
      switch (command) {
        case "a":
          alert("修改密码");
          break;
        case "b":
          this.loginOut();
          break;

        default:
          break;
      }
    },
  },
};
</script>


<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: #fff;
}
.header {
  width: 100%;
  line-height: 50px;
  background-color: rosybrown;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
</style>