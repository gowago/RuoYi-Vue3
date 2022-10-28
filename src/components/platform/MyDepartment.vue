<template>
  <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search" style="margin-bottom: 20px" />
  <el-tree
    :data="deptOptions"
    :props="{ label: 'label', children: 'children' }"
    :expand-on-click-node="false"
    :filter-node-method="filterNode"
    ref="deptTreeRef"
    highlight-current
    default-expand-all
    @node-click="handleNodeClick"
  />
</template>
<script setup>
import { ref } from "vue";
import { deptTreeSelect } from "@/api/system/user";

const emit = defineEmits(["getDepart"]);
const deptTreeRef = ref();
const deptName = ref("");
const deptOptions = ref(null);

async function getDeptTree() {
  const { data } = await deptTreeSelect();
  deptOptions.value = data;
}
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

/** 节点单击事件 */
function handleNodeClick(data) {
  emit("getDepart", data);
  queryParams.value.deptId = data.id;
  refTable.value.searchQuery();
}

/** 根据名称筛选部门树 */
watch(deptName, val => {
  console.log("🚀 ~ file: MyDepartment.vue ~ line 42 ~ val", val);
  deptTreeRef.value.filter(val);
});

getDeptTree();
</script>

<style lang="scss" scoped></style>
