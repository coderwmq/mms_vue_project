<template>
  <div>
    <!-- 上方条件搜索表单 -->
    <el-form
      :inline="true"
      :model="searchMap"
      style="margin-top: 20px"
      ref="searchForm"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员姓名"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.typeId"
            :label="option.typeName"
            :value="option.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          v-model="searchMap.birthday"
          value-format="yyyy-MM-dd"
          placeholder="出生日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form-item> </el-form-item>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="memberList" height="380" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="会员姓名"> </el-table-column>
      <el-table-column prop="birthday" type="data" label="会员生日">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column prop="integral" label="可用积分"> </el-table-column>
      <el-table-column prop="money" label="开卡金额"> </el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | getTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"> </el-table-column>
      <el-table-column label="操作" width="150">
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
    <!-- 弹框--添加会员信息 -->
    <el-dialog
      title="编辑会员"
      :visible.sync="dialogFormVisible"
      width="500px"
      style="margin-top: -50px"
    >
      <el-form
        :model="pojo"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
        ref="pojoForm"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            v-model="pojo.birthday"
            value-format="yyyy-MM-dd"
            placeholder="会员生日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item prop="payType" label="支付类型">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.typeId"
              :label="option.typeName"
              :value="option.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
import {
  search,
  addMember,
  queryMemberById,
  updateMember,
  delMemberById,
} from "@/api/member";
// 定义支付类型数组 ，为什么不能定义在里面？因为在过滤器中不能引用当前实例
const payTypeOptions = [
  { typeId: "1", typeName: "银行卡" },
  { typeId: "2", typeName: "微信" },
  { typeId: "3", typeName: "支付宝" },
  { typeId: "4", typeName: "现金" },
];
export default {
  data() {
    return {
      memberList: [],
      searchMap: {
        cardNum: "",
        name: "",
        payType: "",
        birthday: "",
      },
      total: 0, //总条数
      pageSize: 10, //每页条数
      currentPage: 1, //当前页数
      payTypeOptions,
      dialogFormVisible: false, //控制弹框是否显示
      pojo: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        payType: "",
        birthday: "",
        phone: "",
        money: "",
        integral: "",
        payType: "",
        address: "",
      },
      rules: {
        cardNum: [
          { required: true, message: "会员卡号不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "会员姓名不能为空", trigger: "blur" },
        ],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" },
        ],
      },
    };
  },

  components: {},

  // 声明周期函数
  created() {
    this.getAllMember();
  },
  methods: {
    // 点击确定修改按钮
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateMember(this.pojo).then((response) => {
            const resp = response.data;
            console.log("修改", this.pojo);
            if (resp.flag) {
              // this.pojo.id置为null
              // 解决添加变修改
              this.pojo.id = null;
              // 刷新数据
              this.getAllMember();
              // 关闭弹框
              this.dialogFormVisible = false;
              this.$message({
                message: resp.message,
                type: "success",
              });
            }
          });
        }
      });
    },
    // 点击确认新增按钮
    addData(formName) {
      // 校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //校验通过
          addMember(this.pojo).then((response) => {
            const resp = response.data;
            console.log("添加", this.pojo.id);
            if (resp.flag) {
              // 刷新数据
              this.getAllMember();
              // 关闭弹框
              this.dialogFormVisible = false;
              this.$message({
                message: resp.message,
                type: "success",
              });
            }
          });
        } else {
          //校验不通过
          return false;
        }
      });
    },
    // 点击新增按钮
    handleAdd() {
      // 显示弹框
      this.dialogFormVisible = true;
      // 清空表单
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    // 查询全部会员信息
    getAllMember() {
      // getMemberList().then((response) => {
      search(this.pageSize, this.currentPage, this.searchMap).then(
        (response) => {
          const resp = response.data.data;
          //查询到的数据赋值
          this.memberList = resp.rows;
          this.total = resp.total;
        }
      );
    },
    // 点击编辑按钮
    handleEdit(id) {
      this.handleAdd();
      queryMemberById(id).then((response) => {
        const respUser = response.data;
        if (respUser.flag) {
          this.pojo = respUser.data;
          console.log(this.pojo);
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
          delMemberById(id).then((response) => {
            const resp = response.data;
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error",
            });

            if (resp.flag) {
              this.getAllMember();
            }
          });
        })
        .catch(() => {});
    },
    // pageSize发生变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAllMember();
    },
    // currentPage发生变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllMember();
    },
    // 点击条件查询
    onSubmit() {
      this.getAllMember();
    },
    // 重置表头表单内容
    resetForm(formName) {
      // 重置会看 el-form-item组件元素的prop上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields();
    },
  },
  // 解决表格支付类型为数字
  filters: {
    // 显示支付类型
    getTypeName(rowPayId) {
      const payObj = payTypeOptions.find((obj) => obj.typeId === rowPayId);
      return payObj ? payObj.typeName : null;
    },
  },
};
</script>


<style scoped>
</style>