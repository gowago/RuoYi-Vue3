<template>
  <div class="app-container">
    <commonForm
      class="card-search-form"
      v-if="queryFormConfig && queryFormConfig.length"
      ref="queryRef"
      v-show="showSearch"
      :config="queryFormConfig"
      :formProps="{ inline: true, labelWidth: labelWidth }"
    >
      <template #bottom>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery"> 搜索 </el-button>
          <el-button icon="Refresh" @click="resetQuery"> 重置 </el-button>
        </el-form-item>
      </template>
    </commonForm>

    <slot name="queryFormBottom" />

    <div :class="queryFormConfig && queryFormConfig.length ? 'top-operations' : ''" v-if="topOperations && topOperations.length">
      <el-button
        v-for="topOperation in topOperations"
        :key="topOperation.key"
        :disabled="topOperation.disabledWhenNone && dataList && dataList.length === 0"
        v-bind="topOperation.buttonProps || {}"
        @click="topOperationHandle(topOperation)"
      >
        {{ topOperation.name }}
      </el-button>
      <slot name="topOperationsRight" />
    </div>
    <div class="table-container-t">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="dataList"
        :height="tableHeight"
        v-bind="tableProps || {}"
        :default-sort="defaultSort"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <template #empty>
          <no-data />
        </template>
        <template v-for="item in column" :key="item.key">
          <template v-if="item.columnType != 'index' && item.columnType != 'selection'">
            <el-table-column
              align="center"
              :prop="item.key"
              :width="item.width"
              :min-width="item.minWidth"
              :type="item.columnType"
              v-bind="item.columnSet || {}"
              :show-overflow-tooltip="true"
            >
              <template #header>
                <span style="white-space: pre-wrap">
                  {{ item.label }}
                </span>
              </template>
              <template #default="scope">
                <template v-if="item.render">
                  <renderContainer :render="item.render" :data="scope" />
                </template>
                <div v-else style="display: flex; align-items: center">
                  <div class="string-cell" :class="[typeof item.className === 'function' ? item.className(scope.row[item.key], scope) : item.className]">
                    {{ item.formatHandle ? item.formatHandle(scope.row[item.key]) : scope.row[item.key] }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.columnType == 'index'">
            <el-table-column
              align="center"
              :width="item.width"
              :type="item.columnType"
              :label="item.label"
              :index="indexMethod"
              :show-overflow-tooltip="true"
            />
          </template>
          <template v-else>
            <el-table-column
              align="center"
              :width="item.width"
              :type="item.columnType"
              :label="item.label"
              :selectable="selectableFunc"
              :show-overflow-tooltip="true"
            />
          </template>
        </template>
      </el-table>
    </div>
    <pagination
      v-if="!nopagination"
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
      class="pagination"
    />
  </div>
</template>

<script setup name="commonFilterTable">
import _ from "lodash";
import commonForm from "@/components/common/commonForm";
import noData from "@/components/common/noData";
const renderContainer = props => {
  return props.render(props.data);
};
import { nextTick, onDeactivated, onMounted, ref } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  listRequestHandle: Function,
  queryFormConfig: [Array, Function],
  column: Array,
  defaultQueryParams: Object,
  topOperations: Array,
  tableProps: Object,
  nopagination: Boolean,
  tableHeight: { type: String, default: () => "100%" },
  labelWidth: {
    // form表单label宽度
    type: String,
    default: "100px"
  },
  isAutoLoad: {
    type: Boolean,
    default: true
  },
  isSelectDisabled: {
    // 多选框按钮是否做限制，默认不做限制
    type: Boolean,
    default: false
  },
  // isSelectDisabled为ture时，才传入
  selectableFunc: Function,
  defaultSort: Object
});

const emit = defineEmits();

const queryRef = ref(null);

const dataList = ref([]);

const loading = ref(false);
const showSearch = ref(true);
const selectedList = ref([]);
const total = ref(0);

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 50
  }
});

const { queryParams, form, rules } = toRefs(data);

let queryFormData = null;

const getQueryData = ({ nopagination } = {}) => {
  let queryData = {
    ...(nopagination ? {} : queryParams.value),
    ...(props.defaultQueryParams || {}),
    ...(queryFormData || {})
  };
  if (sortSet.value) {
    queryData.orderByColumn = sortSet.value.sortKey || sortSet.value.prop;
    queryData.isAsc = sortSet.value.order === "ascending" ? "asc" : "desc";
  }
  return queryData;
};

/** 查询数据列表 */
async function getList() {
  let formResult = {};
  if (queryRef.value) {
    formResult = await queryRef.value.validateFrom();
  }
  queryFormData = formResult;
  loading.value = true;
  let queryData = getQueryData();

  props
    .listRequestHandle(queryData)
    .then(response => {
      if (props.nopagination) {
        dataList.value = response;
        total.value = response.length;
      } else {
        dataList.value = response.rows;
        total.value = response.total;

        if (response.pagination) {
          queryParams.value.pageNum = response.pagination.pageNum;
          queryParams.value.pageSize = response.pagination.pageSize;
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
async function topOperationHandle(item) {
  let queryData = getQueryData({ nopagination: true });
  item.handle({
    selectedList: selectedList.value,
    queryFormData: queryData || {},
    pagination: queryParams.value
  });
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  selectedList.value = selection;
  emit("selection-change", selection);
}
const sortSet = ref(null);
function handleSortChange({ column, prop, order }) {
  const columnSet = _.find(props.column, v => v.key === prop);
  if (!order) {
    sortSet.value = null;
  } else {
    sortSet.value = {
      prop,
      order,
      sortKey: _.get(columnSet, "columnSet.sortKey")
    };
  }
  getList();
}

const tableRef = ref();

onMounted(() => {
  if (props.isAutoLoad) {
    handleQuery();
  }
});

onActivated(() => {
  nextTick(() => {
    tableRef.value.doLayout();
  });
});

const indexMethod = indexNum => {
  const { pageNum, pageSize } = queryParams.value;
  return indexNum + 1 + (Number(pageNum) - 1) * Number(pageSize);
};

const selectableFunc = (row, index) => {
  return props.isSelectDisabled ? props.selectableFunc(row, index) : true;
};

defineExpose({ getList });
</script>

<style lang="scss" scoped>
.string-cell {
  flex: 1;
}
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  ::v-deep {
    .red-cell {
      color: #fc6c76;
    }
    .blue-cell {
      color: #409eff;
    }
    .grey-cell {
      color: #d7d7d7;
    }
  }
  .card-search-form {
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgb(0 0 0 / 9%);
    border-radius: 4px;
    padding: 20px 20px 0 20px;
  }
  .top-operations {
    margin-top: 10px;
  }
  .table-container-t {
    flex: 1;
    height: 0;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.09);
    border-radius: 4px;
    background: #fff;
    margin-top: 10px;
  }
  .pagination {
    margin-bottom: 0 !important;
  }
}
</style>
