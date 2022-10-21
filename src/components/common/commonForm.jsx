import { onMounted, defineComponent, reactive, ref, toRaw, watch } from "vue";
import commonFormItem from "./commonFormItem";
import _ from "lodash";

export class KeyCache {
  dataMap = {};
  getData(key) {
    return this.dataMap[key];
  }
  setData(key, data) {
    this.dataMap[key] = data;
  }
}

export const clearFormUnknowSelect = (config, formData) => {
  formData = formData || {};

  config.forEach(v => {
    if (v.type === "select") {
      let hasOptionSign = false;

      (v.options || []).forEach(vOption => {
        if (vOption.key === formData[v.key]) {
          hasOptionSign = true;
        }
      });

      if (!hasOptionSign) {
        formData[v.key] = null;
      }
    }
  });

  return formData;
};

export const setDefaultForm = (config, formData, { clear } = {}) => {
  formData = formData || {};

  config.forEach(v => {
    if (clear || typeof formData[v.key] === "undefined") {
      if (typeof v.default !== "undefined") {
        if (typeof v.default === "function") {
          formData[v.key] = v.default();
        } else {
          formData[v.key] = v.default;
        }
      } else {
        formData[v.key] = null;
      }
    }
  });

  return formData;
};

const formComponentSet = {
  name: "commonForm",
  props: { formProps: Object, config: [Array, Function] },
  setup(props, { emit, expose }) {
    const formRef = ref();

    const formData = reactive({});

    const viewConfigList = ref([]);

    const keyCache = new KeyCache();

    const setFormData = (newFormData, { emitFunction } = {}) => {
      Object.keys(newFormData).forEach(key => {
        formData[key] = newFormData[key];
      });

      if (emitFunction) {
        if (typeof props.config === "function") {
          debounceEmitFunctionConfig();
        }
      }
    };
    const getFormData = () => {
      return { ...(toRaw(formData) || {}) };
    };
    const validateFrom = async () => {
      await formRef.value.validate();
      return getFormData();
    };
    const resetFields = () => {
      setDefaultForm(viewConfigList.value, formData, { clear: true });

      if (typeof props.config === "function") {
        emitFunctionConfig();
      }
    };

    watch(
      () => props.config,
      () => {
        if (Array.isArray(props.config)) {
          viewConfigList.value = props.config;
        }
      }
    );

    onMounted(async () => {
      if (Array.isArray(props.config)) {
        viewConfigList.value = props.config;
        oldFormData = setDefaultForm(viewConfigList.value, formData);
      }
      if (typeof props.config === "function") {
        const newConfigSet = await props.config({ keyCache });

        viewConfigList.value = newConfigSet.config;
        setFormData(setDefaultForm(newConfigSet.config, newConfigSet.formData));
        oldFormData = toRaw(formData);
      }
    });

    let oldFormData = null;

    const emitFunctionConfig = async ({ changeItem } = {}) => {
      const newConfigSet = await props.config({
        keyCache,
        oldFormData,
        formData: getFormData(),
        config: viewConfigList.value,
        changeItem
      });

      viewConfigList.value = newConfigSet.config;
      setFormData(newConfigSet.formData);
      oldFormData = toRaw(formData);
    };

    const debounceEmitFunctionConfig = _.debounce(emitFunctionConfig, 200);

    const onChange = (item, value) => {
      formData[item.key] = value;

      emit("itemChange", value, item.key);

      if (typeof props.config === "function") {
        debounceEmitFunctionConfig({ changeItem: item.key });
      }
    };

    expose({
      keyCache,
      setFormData,
      getFormData,
      validateFrom,
      resetFields,
      emitFunctionConfig
    });

    return {
      keyCache,
      formRef,
      formData,
      setFormData,
      getFormData,
      validateFrom,
      viewConfigList,
      onChange
    };
  },
  render(vm) {
    const formItemList = this.viewConfigList.map(v => {
      return (
        <el-form-item label={v.label} prop={v.key} rules={v.rules} required={v.required} class={v.className}>
          {commonFormItem(vm, v, {
            value: this.formData[v.key],
            changeHandle: value => {
              this.onChange(v, value);
            },
            formData: this.formData,
            keyCache: this.keyCache
          })}
          {v.prefixRender ? v.prefixRender(vm, v, { value: this.formData[v.key] }) : null}
        </el-form-item>
      );
    });

    return (
      <el-form model={this.formData} {...(this.formProps || {})} ref="formRef">
        {formItemList}
        {this.$slots.bottom ? this.$slots.bottom() : null}
      </el-form>
    );
  }
};

export default defineComponent(formComponentSet);
