import {
  antd,
  UICompBuilder,
  numberExposingStateControl,
  Section,
  withDefault,
  withExposingConfigs,
  ArrayControl,
  NameConfig,
  eventHandlerControl,
  withMethodExposing,
  LabelControl,
  // SelectInputValidationSection,
  sectionNames,
  hiddenPropertyView,
} from "openblocks-sdk";
import * as opSdk from "openblocks-sdk";
import { Form, Space, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";

console.log("####", opSdk);

const { Button } = antd;

interface IField {
  lable: string;
  name: string;
  type: "input" | "select";
  required?: boolean;
}

const childrenMap = {
  // value: numberExposingStateControl("value", 100),
  initialValue: withDefault(
    ArrayControl,
    JSON.stringify(
      [
        {
          dict_code: "dict11",
          dict_name: "字典字典11",
        },
        {
          dict_code: "dict22",
          dict_name: "字典字典22",
        },
      ],
      null,
      2
    )
  ),
  // value: withDefault(ArrayControl, []),
  value: numberExposingStateControl("value", []),
  label: LabelControl,
  fields: withDefault(
    ArrayControl,
    JSON.stringify(
      [
        {
          lable: "字典code",
          name: "dict_code",
        },
        {
          lable: "字典名",
          name: "dict_name",
        },
      ],
      null,
      2
    )
  ),
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
  const formListFields = props.fields;
  console.log("currentValue formListFields:", currentValue, formListFields);

  return props.label({
    required: props.required,
    style: props.style,
    children: (
      <Form
        name="dynamic_form_nest_item"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{
          dynamic_form_list: (currentValue || []).length > 0 ? currentValue : [{}],
        }}
        onValuesChange={(changedFields: any, allFields: any) => {
          console.log("###changedFields, allFields:", changedFields, allFields);
          props.value.onChange(allFields);
          props.onEvent("change");
        }}
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
                          ? [{ required: true, message: `${field.lable}是必填项` }]
                          : []
                      }
                    >
                      <Input placeholder={field.lable} />
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
          {children.value.propertyView({ label: "初始值" })}
          {children.fields.propertyView({ label: "字段" })}
        </Section>
        {/* 标签 */}
        {children.label.getPropertyView()}
        <Section name="Interaction">{children.onEvent.propertyView()}</Section>
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
