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
import { computed } from "vue";

const props = defineProps<{
  startTime: string;
  endTime: string;
}>();

const emit = defineEmits<{
  (event: "update:startTime", id: string): string;
  (event: "update:endTime", id: string): string;
}>();

const dateRange = computed({
  get: () => {
    return [props.startTime, props.endTime];
  },
  set: val => {
    emit("update:startTime", val[0]);
    emit("update:endTime", val[1]);
  }
});
</script>

<style scoped></style>
