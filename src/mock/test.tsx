import { systemUserColumn } from "./template";
import type { FunctionalComponent } from "vue";

type typeProps = { parse: any; co: string };
type typePropsHandle = { config: ["look", "update", "del"] }; // need to optimize

/**
 * 渲染列表
 * @param scope table 自定义 列表 tempplate 暴露 的 scope
 * @param props  父级组件穿的值
 * @param co  字段名称
 * @returns jsx to vnode to vue template
 */
export default function (props: typeProps, { emit }): FunctionalComponent {
  return systemUserColumn(props.parse, emit).map(co => {
    if (co.render) {
      return (
        <el-table-column label={co.label} align={co.align} width={co.width}>
          {scope => {
            return co.render(scope);
          }}
        </el-table-column>
      );
    } else {
      return <el-table-column prop={co.prop} label={co.label} align={co.align} width={co.width} formatter={co.formatter} />;
    }
  });
}

// 渲染列表操作
const buttonMap = {
  look: { buttonText: "查看", emitEvent: "look" },
  update: { buttonText: "编辑", emitEvent: "update" },
  del: { buttonText: "删除", emitEvent: "del" }
};
export const renderCoHandle = (props: typePropsHandle, { emit, slots, attrs }): FunctionalComponent => {
  return (
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" {...attrs}>
      {scope => [
        props.config?.map(v => {
          const handle = buttonMap[v];
          return (
            <el-button
              text={true}
              type="primary"
              size="small"
              onClick={() => {
                emit(handle.emitEvent, scope.row);
              }}
            >
              {handle.buttonText}
            </el-button>
          );
        }),
        slots.default(scope)
      ]}
    </el-table-column>
  );
};
