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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
          readonly
          @click.native="dialogSupplierFormVisible = true"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllGoods">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 渲染表格 -->
    <el-table :data="goodsList" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="code" label="商品编码"> </el-table-column>
      <el-table-column prop="spec" label="商品规格"> </el-table-column>
      <el-table-column prop="retailPrice" label="零售价"> </el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"> </el-table-column>
      <el-table-column prop="storageNum" label="库存数量"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商"> </el-table-column>
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
    <!-- 分页 -->
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
    <!-- 选择供应商对话框 -->
    <el-dialog
      title="选择供应商"
      :visible.sync="dialogSupplierFormVisible"
      width="500px"
      style="margin-top: -80px"
    >
      <supplier :isDialog="true" @option-supplier="optionSupplier" />
    </el-dialog>
    <!-- 编辑商品弹出框 -->
    <!-- 添加商品弹框 -->
    <el-dialog
      title="编辑商品"
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
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            v-model="pojo.supplierName"
            @click.native="editOptionSupplier"
            placeholder="选择供应商"
          ></el-input>
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
import goodsAPI from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  data() {
    return {
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
      },
      dialogFormVisible: false, //控制编辑弹框显隐
      dialogSupplierFormVisible: false, //控制选择供应商弹框显隐
      pageSize: 10,
      currentPage: 1,
      total: 0,
      goodsList: [],
      searchMap: {
        supplierName: "",
      },
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" },
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" },
        ],
      },
      isEdit: false, //是否为编辑窗口
    };
  },

  components: { Supplier },

  // 初始化周期函数
  created() {
    this.getAllGoods();
  },
  methods: {
    // 确认修改按钮
    updateData(formName) {
      goodsAPI.updateGoods(this.pojo).then((response) => {
        const resp = response.data;
        if (resp.flag) {
          this.$message({
            message: resp.message,
            type: "success",
          });
          this.pojo.id = null;
          this.getAllGoods();
          this.dialogFormVisible = false;
        }
      });
    },
    // 确定添加按钮
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          goodsAPI.addGoods(this.pojo).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success",
              });
              this.getAllGoods();
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
    // 编辑弹框中下拉供应商
    editOptionSupplier() {
      this.isEdit = true;
      this.dialogSupplierFormVisible = true;
    },
    // 触发自定义事件 子传父 数据回显
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.pojo.supplierName = currentRow.supplierName;
        this.pojo.supplierId = currentRow.id;
      } else {
        this.searchMap.supplierName = currentRow.supplierName;
        this.searchMap.supplierId = currentRow.id;
      }
      this.isEdit = false;
      this.dialogSupplierFormVisible = false;
    },
    // 点击编辑按钮
    handleEdit(id) {
      this.handleAdd();
      goodsAPI.queryGoodsById(id).then((response) => {
        const resp = response.data;
        this.pojo = resp.data;
      });
    },
    // 点击删除按钮
    handleDelete(id) {
      this.$confirm("确认删除这条数据吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          goodsAPI.delGood(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });

            if (resp.flag) {
              this.getAllGoods();
            }
          });
        })
        .catch(() => {});
    },
    // 每页条数发生变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllGoods();
    },
    // 页码发生变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllGoods();
    },
    // 新增按钮
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 查询商品
    getAllGoods() {
      goodsAPI
        .search(this.pageSize, this.currentPage, this.searchMap)
        .then((response) => {
          const resp = response.data;
          this.goodsList = resp.data.rows;
          this.total = resp.data.total;
        });
    },
  },
};
</script>


<style scoped>
</style>