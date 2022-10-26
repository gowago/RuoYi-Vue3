import { systemUserColumn } from "./template";
import type { FunctionalComponent } from "vue";

type typeProps = { dict: any };

export default function (props: typeProps, { emit }): FunctionalComponent {
  console.log("🚀 ~ file: test.tsx ~ line 7 ~ props", props.dict);
  return systemUserColumn(props.dict, emit).map(co => {
    if (co.render) {
      return (
        <el-table-column label={co.label} align={co.align} width={co.width}>
          {scope => co.render(scope)}
        </el-table-column>
      );
    } else {
      return <el-table-column prop={co.prop} label={co.label} align={co.align} width={co.width} formatter={co.formatter} />;
    }
  });
}
