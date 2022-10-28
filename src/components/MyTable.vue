<template>
  <slot name="other" :searchQuery="searchQuery"></slot>
  <slot name="searchForm" :searchQuery="searchQuery"></slot>

  <el-card class="box-card">
    <template #header>
      <div class="card-header flex items-center">
        <span>{{ tableName }}</span>
        <el-row :gutter="10" style="margin-left: auto">
          <slot name="tableTool"></slot>
          <right-toolbar v-model:showSearch="toolbarShow" @queryTable="searchTable" :columns="columns" />
        </el-row>
      </div>
    </template>
    <el-table v-loading="table.loading" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <slot name="column"></slot>
    </el-table>
    <pagination v-show="table.total > 0" :total="table.total" v-model:page="page.pageNum" v-model:limit="page.pageSize" @pagination="searchTable" />
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from "vue";
export interface Props {
  data: [];
  selection?: boolean; // 多选展示
  paginationShow?: boolean; // 分页展示
  autoLoad?: boolean; //开始加载
  showLoading?: boolean; // 展示加载状态
  toolbarShow?: boolean; //table 工具
  tableName?: string; // 表格名称
}

const props = withDefaults(defineProps<Props>(), {
  selection: false, // 默认     关闭  表格多选
  paginationShow: true, //默认  展示  表格分页
  autoLoad: true, // 初始化     加载  表格数据
  showLoading: true, // 默认    展示  表格加载状态
  toolbarShow: false, // 默认   关闭  表格工具
  tableName: "" //默认为空            表格名称
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户编号`, visible: true },
  { key: 1, label: `用户名称`, visible: true },
  { key: 2, label: `用户昵称`, visible: true },
  { key: 3, label: `部门`, visible: true },
  { key: 4, label: `手机号码`, visible: true },
  { key: 5, label: `状态`, visible: true },
  { key: 6, label: `创建时间`, visible: true }
]);
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
