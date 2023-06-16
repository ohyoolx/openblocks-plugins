import {
  optionsControl,
  disabledPropertyView,
  hiddenPropertyView,
  MultiCompBuilder,
  StringControl,
  IconControl,
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
    { label: "字典code", name: "dict_code", value: 1, type: "input" },
    { label: "字典name", name: "dict_name", value: 2, type: "select" },
  ],
  uniqField: "value",
});
