<template>
  <div class="g_empty_container">
    <img src="../../assets/images/general_empty_icon.png" alt="" :style="{ width: width || '259px' }" />
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  props: { width: String },
  setup() {}
};
</script>
<style>
.g_empty_container {
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}
.g_empty_container img {
  display: block;
  margin: 0 auto;
  width: 359px;
}
.g_empty_container p {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #a7aab5;
  line-height: 22px;
}
</style>
