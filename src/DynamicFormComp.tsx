import {
  UICompBuilder,
  Section,
  withDefault,
  withExposingConfigs,
  ArrayControl,
  NameConfig,
  eventHandlerControl,
  withMethodExposing,
  LabelControl,
  StringControl,
  BoolCodeControl,
  JSONObjectArrayControl,
  jsonObjectExposingStateControl,
  // SelectInputValidationSection,
  disabledPropertyView,
  sectionNames,
  hiddenPropertyView,
  placeholderPropertyView,
} from "openblocks-sdk";
import * as opSdk from "openblocks-sdk";
import { Form, Space, Input, Button, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FormListControl } from "./components/controls/formListControl";

import styles from "./styles.module.css";
import { useEffect } from "react";

console.log("####", opSdk);

interface IField {
  label: string;
  name: string;
  type: "input" | "select";
  required?: boolean;
}

const initialFields = JSON.stringify(
  [
    {
      label: "字典code",
      name: "dict_code",
    },
    {
      label: "字典名",
      name: "dict_name",
    },
  ],
  null,
  2
);

const childrenMap = {
  // value: JSONObjectArrayControl, // value 看下来现在并没有符合要求的类型（xxxExposingStateControl）；只用来展示的话JSONObjectArrayControl是可以的
  value: jsonObjectExposingStateControl("value", {}),
  label: LabelControl,
  placeholder: StringControl,
  disabled: BoolCodeControl,
  fields: withDefault(ArrayControl, initialFields),
  options: FormListControl,
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "",
    },
  ]),
};

const DynamicFormComp = new UICompBuilder(childrenMap, (props: any) => {
  // const [validateState, handleValidate] = useSelectInputValidate(props);

  const currentValue = props.value;
  const formListFields = props.options;
  console.log("currentValue formListFields:", currentValue, formListFields);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(currentValue.value);
  }, [currentValue]);

  return props.label({
    required: props.required,
    style: props.style,
    children: (
      <Form
        form={form}
        name="dynamic_form_nest_item"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{
          dynamic_form_list: (currentValue || []).length > 0 ? currentValue : [{}],
        }}
        onValuesChange={(changedFields: any, allFields: any) => {
          // console.log("###changedFields, allFields:", changedFields, allFields);
          props.value.onChange(allFields);
          props.onEvent("change");
        }}
        disabled={props.disabled}
      >
        <Form.List name="dynamic_form_list">
          {(fields: { [x: string]: any; key: any; name: any }[], { add, remove }: any) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  {formListFields.map((field: IField) => (
                    <Form.Item
                      {...restField}
                      key={`formItem_${field.name}`}
                      name={[name, field.name]}
                      rules={
                        field.required
                          ? [{ required: true, message: `${field.label}是必填项` }]
                          : []
                      }
                    >
                      {field.type === "input" ? (
                        <Input placeholder={field.label} style={{ minWidth: 120 }} />
                      ) : null}
                      {field.type === "select" ? (
                        <Select
                          options={[
                            { value: "jack", label: "Jack" },
                            { value: "lucy", label: "Lucy" },
                            { value: "Yiminghe", label: "yiminghe" },
                            { value: "disabled", label: "Disabled", disabled: true },
                          ]}
                          placeholder={field.label}
                          style={{ minWidth: 120 }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    ),
    // ...validateState,
  });
})
  .setPropertyViewFn((children: any) => {
    // console.log("####children", children);
    // 属性面板
    return (
      <>
        <Section name={sectionNames.basic}>
          {children.fields.propertyView({ label: "字段" })}
          {children.value.propertyView({ label: "默认值" })}
          {placeholderPropertyView(children)}
          {children.options.propertyView({})}
        </Section>
        {/* 标签 */}
        {children.label.getPropertyView()}
        {/* 交互 */}
        <Section name={sectionNames.interaction}>
          {children.onEvent.propertyView()}
          {disabledPropertyView(children)}
        </Section>
        {/* 校验 */}
        {/* <SelectInputValidationSection {...children} /> */}
        {/* 布局 */}
        <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>
      </>
    );
  })
  .build();

const HelloWorldCompTemp = withMethodExposing(DynamicFormComp, [
  {
    method: {
      name: "random",
      params: [],
    },
    execute(comp: any) {
      comp.children.value.getView().onChange(Math.floor(Math.random() * 100));
    },
  },
]);

export default withExposingConfigs(HelloWorldCompTemp, [
  new NameConfig("value", ""),
  new NameConfig("fields", ""),
]);
