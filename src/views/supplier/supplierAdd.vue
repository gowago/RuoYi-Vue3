<template>
  <div class="app-container bg-F2F3F5 h-full flex-1">
    <div class="flex justify-between items-center">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

      <el-button type="primary" size="default" @click="back">返回</el-button>
    </div>

    <div class="supplier-step px-100">
      <el-steps :active="active" finish-status="success">
        <el-step title="填写信息" />
        <el-step title="合同上报" />
        <el-step title="审核" />
      </el-steps>
    </div>

    <div class="form-content">
      <el-form :model="form" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
        <div class="content-item bg-white px-12 py-30 mb-10">
          <h3>基础信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="企业名称" required>
                <el-input placeholder="请输入企业名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来源" required>
                <el-radio-group>
                  <el-radio key="1" label="外部企业"> </el-radio>
                  <el-radio key="2" label="内部企业"> </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-select value-key="" placeholder="" clearable filterable>
                <el-option v-for="item in dict.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-form-item label="企业注册地址" required>
                <el-input placeholder="请输入企业名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="content-item bg-white px-12 py-30 mb-10">
          <h3>基础信息</h3>
        </div>
        <div class="content-item bg-white px-12 py-30">
          <h3>基础信息</h3>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumb";
import { reactive } from "vue";
import { useRouter } from "vue-router";
const active = ref(0);
const form = reactive({});

const dict = reactive({
  test: 1,
  options: [
    { value: 1, label: "代理合作方" },
    { value: 2, label: "权益合作方" }
  ]
});

const router = useRouter();
const back = () => {
  router.back();
};
</script>

<style scoped></style>
