const typeMap = {
  select: (vm, item, { value, changeHandle, formData }) => {
    return (
      <el-select model-value={value} onUpdate:model-value={changeHandle} {...(item.props || {})}>
        {Array.isArray(item.options)
          ? item.options.map(v => {
              return <el-option key={v.key} label={v.label} value={v.key} />;
            })
          : null}
      </el-select>
    );
  },
  date: (vm, item, { value, changeHandle, formData }) => {
    return <el-date-picker model-value={value} onUpdate:model-value={changeHandle} {...(item.props || {})}></el-date-picker>;
  },
  input: (vm, item, { value, changeHandle, formData }) => {
    return <el-input model-value={value} onUpdate:model-value={changeHandle} {...(item.props || {})}></el-input>;
  },
  switch: (vm, item, { value, changeHandle, formData }) => {
    return <el-switch model-value={value} onUpdate:model-value={changeHandle} {...(item.props || {})} />;
  },
  checkbox: (vm, item, { value, changeHandle, formData }) => {
    return (
      <el-checkbox-group model-value={value || []} onUpdate:model-value={changeHandle} {...(item.props || {})}>
        {Array.isArray(item.options)
          ? item.options.map(v => {
              return <el-checkbox label={v.key}>{v.label}</el-checkbox>;
            })
          : null}
      </el-checkbox-group>
    );
  },
  string: (vm, item, { value, changeHandle, formData }) => {
    let showValue = value;
    if (item.format) {
      showValue = item.format(value, formData);
    }
    return <div>{showValue}</div>;
  },
  render: (vm, item, { value, changeHandle, formData, keyCache }) => {
    return item.render(vm, item, { value, changeHandle, formData, keyCache });
  }
};

export default (vm, item, { value, changeHandle, formData, keyCache }) => {
  let typeSetHandle = typeMap[item.type];

  if (!typeSetHandle) {
    typeSetHandle = typeMap.input;
  }

  return typeSetHandle(vm, item, { value, changeHandle, formData, keyCache });
};
