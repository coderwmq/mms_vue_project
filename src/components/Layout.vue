<template>
  <div>
    <!-- 头部 -->
    <app-header/>
    <!-- 菜单 -->
    <app-left/>
    <!-- 显示区 -->
    <app-main-right/>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppLeft from '@/components/AppLeft'
import AppMainRight from '@/components/AppMainRight'
export default {
  data () {
    return {
    }
  },

  components: {
    AppHeader,
    AppLeft,
    AppMainRight
  },

  methods: {}
}
</script>


<style scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0; /* 全横屏填充 */
  background-color: #2d3a4b;
}
/* 左侧区域 */
.app-left {
  position: absolute;
  width: 230px;
  top: 50px;
  bottom: 0; /* 全竖屏填充 */
  background-color: #545c64;
  overflow-y: auto;
}
/* 主区域 */
.app-main-right {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0;
  bottom: 0;
  padding: 10px;
  /* background-color: skyblue; */
  overflow-y: auto;
}
</style>