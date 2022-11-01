<template>
  <el-dialog :title="upload.title" v-model="DialogOpen" width="400px" append-to-body>
    <el-upload
      ref="uploadRef"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip"><el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据</div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getToken } from "@/utils/auth";
import { computed } from "vue";
export interface Props {
  visible: boolean;
  title?: string;
  isUploading?: boolean;
  updateSupport?: number;
  headers?: any;
  url?: string;
  autoClose?: boolean; //上传完自动关闭
}

const $emit = defineEmits(["uploadSuccess", "update:visible"]);

const props = withDefaults(defineProps<Props>(), {
  visible: false, // 是否显示弹出层（用户导入）
  title: "", // 弹出层标题（用户导入）
  isUploading: false, // 是否禁用上传
  updateSupport: 0, // 是否更新已经存在的用户数据
  headers: () => {
    return { Authorization: "Bearer " + getToken() };
  }, // 设置上传的请求头部
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData" // 上传的地址
});

const DialogOpen = computed({
  get: () => {
    return props.visible;
  },
  set: val => {
    $emit("update:visible", val);
  }
});

const { proxy } = getCurrentInstance();
const uploadRef = ref("");
const upload = reactive({});

function submitFileForm() {
  uploadRef.value.submit();
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value.handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {
    dangerouslyUseHTMLString: true
  });
  $emit("uploadSuccess");
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {}, `user_template_${new Date().getTime()}.xlsx`);
}
</script>

<style scoped></style>
