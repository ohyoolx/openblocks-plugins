import {
  optionsControl,
  disabledPropertyView,
  hiddenPropertyView,
  MultiCompBuilder,
  StringControl,
  JSONObjectArrayControl,
  BoolCodeControl,
  OptionCompProperty,
  dropdownControl,
} from "openblocks-sdk";

type OptionPropertyParam = {
  autoMap?: boolean;
};

interface OptionCompProperty {
  propertyView(param: OptionPropertyParam): React.ReactNode;
}

const DisplayTypeOptions = [
  {
    label: "输入框（input）",
    value: "input",
  },
  {
    label: "下拉框（select）",
    value: "select",
  },
];

let SelectOption = new MultiCompBuilder(
  {
    name: StringControl,
    label: StringControl,
    value: StringControl,
    type: dropdownControl(DisplayTypeOptions, "input"), // 展示类型
    options: JSONObjectArrayControl, // 如果展示控件是select 对应的options
    disabled: BoolCodeControl,
    hidden: BoolCodeControl,
  },
  (props: any) => props
).build();

SelectOption = class extends SelectOption implements OptionCompProperty {
  propertyView(param: { autoMap?: boolean }) {
    return (
      <>
        {this.children.name.propertyView({
          label: "名字", // trans("label")
          placeholder: param.autoMap ? "{{item}}" : "",
        })}
        {this.children.label.propertyView({
          label: "标签", // trans("label")
          placeholder: param.autoMap ? "{{item}}" : "",
        })}
        {/* {this.children.value.propertyView({ label: "值" })} */}
        {this.children.type.propertyView({ label: "展示组件" })}
        {this.children.type.getView() === "select" &&
          this.children.options.propertyView({
            label: "选项值",
            tooltip:
              "请输入包含label和value键值对的对象组成的数组，例如：[{label: 'aaa', value: 1}, {label: 'bbb', value: 2}]",
          })}
        {disabledPropertyView(this.children)}
        {hiddenPropertyView(this.children)}
      </>
    );
  }
};

export const FormListControl = optionsControl(SelectOption, {
  //   initOptions: [
  //     { label: trans("optionsControl.optionI", { i: 1 }), value: "1" },
  //     { label: trans("optionsControl.optionI", { i: 2 }), value: "2" },
  //   ],
  initOptions: [
    { label: "字段1", name: "name1", type: "input" },
    { label: "字段2", name: "name2", type: "select" },
  ],
  uniqField: "name",
});
