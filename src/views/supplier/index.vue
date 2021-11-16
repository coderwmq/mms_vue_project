<template>
  <div>
    <!-- 条件搜索表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
    >
      <el-form-item prop="name">
        <el-input
          v-model="searchMap.supplierName"
          placeholder="供应商名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd"
          >新增</el-button
        >
        <el-button v-if="!isDialog" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 渲染表格 -->
    <el-table
      @current-change="handleCurrentChangeTable"
      :data="supplierList"
      height="380"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称">
      </el-table-column>
      <el-table-column prop="linkman" label="联系人"> </el-table-column>
      <el-table-column v-if="!isDialog" prop="mobile" label="联系电话">
      </el-table-column>
      <el-table-column v-if="!isDialog" prop="remark" label="备注">
      </el-table-column>
      <el-table-column v-if="!isDialog" label="操作" width="150px">
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
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="
        isDialog
          ? 'prev, pager, next'
          : 'total, sizes,prev, pager, next, jumper'
      "
      :total="total"
    >
    </el-pagination>
    <!-- 添加供应商弹框 -->
    <el-dialog
      title="编辑供应商"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
        ref="pojoForm"
      >
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="pojo.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark"></el-input>
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
import supplierAPI from "@/api/supplier";
export default {
  props: {
    isDialog: Boolean,
  },
  data() {
    return {   
      pojo: {
        id: null,
        supplierName: "",
        linkman: "",
        mobile: "",
        remark: "",
      },
      supplierList: [],
      searchMap: {
        // supplierName: "",
        // linkman: "",
        // mobile: "",
      },
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false, //控制选择供应商弹框显隐
      rules: {
        supplierName: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // 初始化周期函数
  created() {
    this.getAllSuppliers();
  },
  methods: {
    // 确认编辑
    updateData() {
      supplierAPI.updateSup(this.pojo).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.$message({
            message: resp.message,
            type: "success",
          });
          this.pojo.id = null;
          this.getAllSuppliers();
          this.dialogFormVisible = false;
        }
      });
    },
    // 确认新增
    addData(formName) {
      supplierAPI.addSupplier(this.pojo).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.$message({
            message: resp.message,
            type: "success",
          });
          this.dialogFormVisible = false;
          this.getAllSuppliers();
        }
      });
    },
    // pageSize 每页条数发生变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllSuppliers();
    },
    // currentPage 当前页码发生变化
    handleCurrentChange(val) {
      this.pageSize = val;
      this.getAllSuppliers();
    },
    // 点击重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击新增
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 点击查询
    onSubmit() {
      this.getAllSuppliers();
    },
    // 点击删除
    handleDelete(id) {
      this.$confirm("确认删除这条数据吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          supplierAPI.delSupById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });

            if (resp.flag) {
              this.getAllSuppliers();
            }
          });
        })
        .catch(() => {});
    },
    // 点击编辑
    handleEdit(id) {
      this.handleAdd();
      supplierAPI.querySupById(id).then((response) => {
        this.pojo = response.data.data;
      });
    },
    // 选中某一行所触发事件
    handleCurrentChangeTable(currentRow) {
      this.$emit("option-supplier", currentRow);
    },
    // 抓取全部供应商信息
    getAllSuppliers() {
      // supplierAPI.getAllSuppliers().then((response) => {
      supplierAPI
        .search(this.pageSize, this.currentPage, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.supplierList = resp.data.rows;
          this.total = resp.data.total;
        });
    },
  },
};
</script>


<style scoped>
</style>