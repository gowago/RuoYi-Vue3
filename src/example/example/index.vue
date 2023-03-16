<template>
  <!-- 示例 -->
  <div>
    <common-filter-table
      ref="tableRef"
      :queryFormConfig="queryFormConfig"
      :listRequestHandle="listRequestHandle"
      :defaultQueryParams="defaultQueryParams"
      :column="column"
    />
  </div>
  <div>11</div>
</template>

<script setup name="phoneAbnormalQuery">
import commonFilterTable from "@/components/common/commonFilterTable.vue";
import generateColumn from "./column";

const queryFormConfig = reactive([
  {
    key: "phone",
    label: "手机号：",
    type: "input",
    props: { clearable: true }
  }
]);

const defaultQueryParams = reactive({});

const listRequestHandle = params => {
  return Promise.resolve({
    rows: Array(10).fill({
      key1: "ecs1元卡密",
      key2: "ECS-1",
      key3: 0,
      key4: 760251,
      key5: 110116,
      key6: 100,
      key7: "ecs卡密类",
      key8: "ECS-SUBTYPE",
      key9: 873313,
      key10: 11011600,
      key11: "ecs卡密类",
      key12: "ECS"
    }),
    total: 10
  });
};

const column = generateColumn({}); //折扣设置
</script>

<style scoped></style>
