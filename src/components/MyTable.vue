<template>
  <slot name="other" :searchQuery="searchQuery"></slot>
  <slot name="search" :searchQuery="searchQuery"></slot>
  <slot name="tool"></slot>
  <el-table v-loading="table.loading" :data="data" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="50" align="center"></el-table-column>
    <slot name="column"></slot>
  </el-table>

  <pagination v-show="table.total > 0" :total="table.total" v-model:page="page.pageNum" v-model:limit="page.pageSize" @pagination="searchTable" />
</template>

<script setup lang="ts">
import { reactive } from "vue";
export interface Props {
  data: [];
  selection?: boolean; // 多选展示
  paginationShow?: boolean; // 分页展示
  autoLoad?: boolean; //开始加载
  showLoading?: boolean; // 展示加载状态
}

const props = withDefaults(defineProps<Props>(), {
  selection: false, // 默认关闭多选
  paginationShow: true, // 默认展示分页
  autoLoad: true, // 默认初始化加载数据
  showLoading: true // 默认展示加载状态
});

const $emit = defineEmits<{
  (event: "getList", pageNum: number, pageSize: number, { setTotal, endLoading }: { setTotal: (totalNum: number) => void; endLoading?: () => void }): void; // 查询
  (event: "selectionChange", e: any): void;
}>();

const table = reactive({
  total: 0,
  loading: false
});

const page = reactive({
  pageNum: 1,
  pageSize: 10,
  totoal: 0
});

const handleSelectionChange = e => {
  $emit("selectionChange", e);
};

// 初始化
const init = () => {
  if (props.autoLoad) {
    searchTable();
  }
};

// 设置table总数
function setTotal(totalNum: number) {
  table.total = totalNum;
}

// 结束加载状态
function endLoading() {
  table.loading = false;
}

// 搜索查询
const searchQuery = () => {
  page.pageNum = 1;
  searchTable();
};

// 加载数据
function searchTable() {
  if (props.showLoading) {
    table.loading = true;
  }
  $emit("getList", page.pageNum, page.pageSize, { setTotal, endLoading });
}

init();
defineExpose({ searchTable, searchQuery });
</script>

<style scoped></style>
