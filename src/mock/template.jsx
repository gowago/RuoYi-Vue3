const wrap = columns => {
  return columns.map(column => {
    if (!column.align) {
      column.align = "center"; // 默认居中
    }
    if (!column.overflowTooltip) {
      column.overflowTooltip = true; // 默认开启
    }
    if (!column.key) {
      column.key = column.prop; // 默认使用prop 最为key
    }
    if (!column.width) {
      column.width = "auto"; // 默认使用prop 最为key
    }
    return column;
  });
};

// example
export default () => [
  { key: "index", label: "序号", columnType: "index", width: "65px" },
  { key: "key1", label: "key1" },
  { key: "key2", label: "key2" },
  { key: "key3", label: "key3" },
  { key: "key4", label: "key4" },
  { key: "key5", label: "key5" },
  { key: "key6", label: "key6" },
  { key: "key7", label: "key7" },
  { key: "key8", label: "key8" },
  { key: "key9", label: "key9" },
  { key: "key10", label: "key10" },
  { key: "key11", label: "key11" },
  { key: "key12", label: "key12" }
];

export const systemUserColumn = (dict, $emit) => {
  console.log("🚀 ~ file: template.jsx ~ line 37 ~ systemUserColumn ~ dict", dict, $emit);
  return wrap([
    { prop: "userId", label: "用户编号" },
    { prop: "userName", label: "用户名称" },
    { prop: "nickName", label: "用户昵称" },
    { prop: "dept.deptName", label: "部门" },
    { prop: "phonenumber", label: "手机号码", width: 120 },
    { prop: "createTime", label: "创建时间", width: 160, formatter: row => dict(row.createTime) },
    {
      label: "状态",
      width: 160,
      render: scope => {
        return (
          <el-switch
            v-model={scope.row.status}
            active-value="0"
            inactive-value="1"
            onChange={() => {
              $emit("handleStatusChange", scope.row);
            }}
          />
        );
      }
    }
  ]);
};
