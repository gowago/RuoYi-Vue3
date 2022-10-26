<template>
  <el-date-picker
    v-model="dateRange"
    v-bind="$attrs"
    value-format="YYYY-MM-DD"
    type="daterange"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
  />
</template>

<script setup lang="ts">
import { isEmpty } from "element-plus/lib/utils/types";
import { computed, watch } from "vue";

const props = defineProps<{
  startTime: string;
  endTime: string;
  range?: [];
}>();

const emit = defineEmits<{
  (event: "update:startTime", time: string): string;
  (event: "update:endTime", time: string): string;
}>();

const dateRange = computed({
  get: () => {
    return [props.startTime, props.endTime];
  },
  set: val => {
    if (isEmpty(val)) {
      emit("update:startTime", "");
      emit("update:endTime", "");
    } else {
      emit("update:startTime", val[0]);
      emit("update:endTime", val[1]);
    }
  }
});

watch(
  () => props.range,
  () => {}
);
</script>

<style scoped></style>
