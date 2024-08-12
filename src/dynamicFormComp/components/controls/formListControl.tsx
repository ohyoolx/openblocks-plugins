import {
  allowClearPropertyView,
  showSearchPropertyView,
  sectionNames,
  BoolControl,
  stateComp,
  optionsControl,
  manualOptionsControl,
  disabledPropertyView,
  hiddenPropertyView,
  MultiCompBuilder,
  StringControl,
  NumberControl,
  JSONObjectArrayControl,
  BoolCodeControl,
  OptionCompProperty,
  dropdownControl,
  withDefault,
} from "openblocks-sdk";
import { defaultCascaderOptions } from "../../constants/index";
import { DisplayTypeOptions } from "../../constants";
import { modeOptions, pickerOptions, popupMatchSelectWidthOptions } from "../../constants/index";

type OptionPropertyParam = {
  autoMap?: boolean;
};

interface OptionCompProperty {
  propertyView(param: OptionPropertyParam): React.ReactNode;
}

let SelectOption = new MultiCompBuilder(
  {
    name: StringControl,
    label: StringControl,
    value: StringControl,
    format: withDefault(StringControl, "HH:mm:ss"),
    type: dropdownControl(DisplayTypeOptions, "input"), // 展示类型
    options: JSONObjectArrayControl, // 如果展示控件是select 对应的options
    text: StringControl, // text 固定值
    mode: dropdownControl(modeOptions, "common"), // 组件模式
    popupMatchSelectWidth: dropdownControl(popupMatchSelectWidthOptions, "min-width"), // 下拉菜单和选择器宽度
    popupMatchSelectWidthVal: withDefault(NumberControl, 120), // 下拉菜单和选择器宽度 自定义宽度
    min: NumberControl, // inputNumber用
    max: NumberControl, // inputNumber用
    picker: dropdownControl(pickerOptions, "date"), // 选择器类型 (antd5)
    disabled: BoolCodeControl,
    hidden: BoolCodeControl,
    allowClear: BoolControl,
    inputValue: stateComp<string>(""), // user's input value when search
    showSearch: BoolControl.DEFAULT_TRUE,
    oneRow: BoolControl, // 独占一行
    order: BoolCodeControl,
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
        {/* 以下为各种组件的自定义配置 */}
        {this.children.type.getView() === "text" &&
          this.children.text.propertyView({
            label: "固定值",
            tooltip: "优先展示固定值。如果配置了固定值，不再根据key读取数据源的值。",
          })}
        {/* 以下为各种组件的自定义配置 */}
        {this.children.type.getView() === "select" &&
          this.children.options.propertyView({
            label: "选项值",
            tooltip:
              "请输入包含label和value键值对的对象组成的数组，例如：[{label: 'label1', value: 1}, {label: 'label2', value: 2}]",
            placeholder: JSON.stringify([
              { label: "label1", value: 1 },
              { label: "label2", value: 2 },
            ]),
          })}
        {this.children.type.getView() === "timePicker" &&
          this.children.format.propertyView({ label: "格式" })}
        {this.children.type.getView() === "cascader" &&
          this.children.options.propertyView({
            label: "选项值",
            tooltip: `请输入包含label、value、children的对象组成的数组，例如：${JSON.stringify(
              defaultCascaderOptions
            )}`,
            placeholder: JSON.stringify(defaultCascaderOptions),
          })}
        {this.children.type.getView() === "select" &&
          this.children.popupMatchSelectWidth.propertyView({ label: "下拉选项宽度" })}
        {this.children.type.getView() === "select" &&
          this.children.popupMatchSelectWidth.getView() === "custom-width" &&
          this.children.popupMatchSelectWidthVal.propertyView({
            label: "自定义宽度",
            tooltip: "如果数值过小，会显示为同宽",
          })}
        {this.children.type.getView() === "select" &&
          this.children.mode.propertyView({ label: "组件模式" })}
        {["datePicker", "rangePicker"].includes(this.children.type.getView()) &&
          this.children.picker.propertyView({ label: "选择器类型" })}
        {this.children.type.getView() === "rangePicker" &&
          this.children.order.propertyView({ label: "自动排序" })}
        {this.children.type.getView() === "inputNumber" &&
          this.children.min.propertyView({ label: "最小值" })}
        {this.children.type.getView() === "inputNumber" &&
          this.children.max.propertyView({ label: "最大值" })}
        {/* 以下为通用配置 */}
        {this.children.type.getView() !== "text" && allowClearPropertyView(this.children)}
        {this.children.type.getView() === "select" && showSearchPropertyView(this.children)}
        {this.children.type.getView() !== "text" && disabledPropertyView(this.children)}
        {hiddenPropertyView(this.children)}
        {this.children.oneRow.propertyView({ label: "独占一行" })}
      </>
    );
  }
};

export const FormListControl = manualOptionsControl(SelectOption, {
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
