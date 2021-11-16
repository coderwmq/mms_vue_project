<template>
  <div>
    <!-- 条件搜索表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllStaffs">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 渲染表格 -->
    <el-table :data="staffList" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="salary" label="薪酬"> </el-table-column>
      <el-table-column prop="entryDate" label="入职时间"> </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 编辑员工弹出框 -->
    <!-- 添加员工弹框 -->
    <el-dialog
      title="编辑员工"
      width="500px"
      style="margin-top: -80px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
        ref="pojoForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="entryDate" label="入职时间">
          <el-date-picker
            v-model="pojo.entryDate"
            type="date"
            placeholder="出生日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <!-- <el-button type="primary" @click="updateData('pojoForm')"
          >确 定</el-button
        > -->
        <el-button
          type="primary"
          @click="
            pojo.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffAPI from "@/api/staff";
export default {
  data() {
    return {
      staffList: [],
      searchMap: {},
      pageSize: 10,
      currentPage: 1,
      total: 0,
      pojo: {
        id: null,
        username: "",
        name: "",
        age: null,
        mobile: "",
        salary: "",
        entryDate: null,
      },
      dialogFormVisible: false,
      rules: {
        //校验规则
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },

  components: {},
  // 初始化生命周期函数
  created() {
    this.getAllStaffs();
  },
  methods: {
    // 确认修改
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单
          staffAPI.updateStaff(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success",
              });
              this.pojo.id = null;
              this.getAllStaffs();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 确认添加
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          staffAPI.addStaff(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                message: "新增成功，初始密码为123456",
                type: "success",
              });
              this.getAllStaffs();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击新增按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 点击编辑按钮
    handleEdit(id) {
      this.handleAdd();
      staffAPI.getById(id).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    // 点击删除按钮
    handleDelete(id) {
      this.$confirm("确认删除这条数据吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          staffAPI.deleteById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });

            if (resp.flag) {
              this.getAllStaffs();
            }
          });
        })
        .catch(() => {});
    },
    // 每页条数发生改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllStaffs();
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllStaffs();
    },
    // 查询数据
    getAllStaffs() {
      staffAPI
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((response) => {
          this.staffList = response.data.data.rows;
          this.total = response.data.data.total;
        });
    },
  },
};
</script>


<style scoped>
</style>