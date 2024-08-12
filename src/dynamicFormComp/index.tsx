import {
  UICompBuilder,
  Section,
  withExposingConfigs,
  NameConfig,
  eventHandlerControl,
  withMethodExposing,
  LabelControl,
  BoolCodeControl,
  jsonObjectExposingStateControl,
  // arrayStringExposingStateControl,
  disabledPropertyView,
  sectionNames,
  hiddenPropertyView,
  antd,
  requiredPropertyView,
  BoolControl,
  CustomRuleControl,
  dropdownControl,
  NumberControl,
  withDefault,
} from "openblocks-sdk";
import { PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { FormListControl } from "./components/controls/formListControl";
import { v4 as uuidv4 } from "uuid";
import type { Moment } from "moment";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import {
  DisplayTypeOptionValue,
  defaultCascaderOptions,
  defaultSelectOptions,
  PopupMatchSelectWidthOptionValue,
} from "./constants/index";
import styled from "styled-components";

// import * as SDK from "openblocks-sdk";
// console.log(SDK);

const { Input, Button, Select, TimePicker, DatePicker, Cascader, Switch, InputNumber, Col, Row } =
  antd;
const { RangePicker } = DatePicker;

const StyledLabel = styled.div`
  margin-right: 8px;
  white-space: nowrap;
`;

const StyledDynamicFormList = styled.div<{ type: string }>`
  ${(props) => (props.type === "form" ? "" : "display: flex; align-items: baseline; gap: 8px;")};
`;

const StyledDynamicForm = styled.div<{ type: string; width: number }>`
  gap: 8px;
  margin-bottom: 8px;
  display: flex;
  ${(props) =>
    props.type === "form"
      ? "align-items: center;"
      : `width: ${
          props.width || 100
        }%; align-items: flex-start; flex-direction: column; border:1px solid #eeeeee; border-radius: 8px; padding:16px;`};
`;

const StyledDynamicFormItem = styled.div<{ type: string }>`
  ${(props) =>
    props.type === "form"
      ? ""
      : "width: 100%; display: flex; min-width: 0; align-items: center; height: 100%; line-height: 100%;"}
`;

const StyledOperateButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledRow = styled.div`
  width: 100%;
`;

const FormDisplayTypeOptions = [
  {
    label: "表单",
    value: "form",
  },
  {
    label: "卡片",
    value: "card",
  },
] as const;

interface IField {
  label: string;
  name: string;
  type: DisplayTypeOptionValue;
  mode: "common" | "multiple" | "tags";
  popupMatchSelectWidth?: PopupMatchSelectWidthOptionValue;
  popupMatchSelectWidthVal?: number;
  picker: "time" | "date" | "week" | "month" | "year";
  min?: number;
  max?: number;
  required?: boolean;
  options?: any[];
  text?: string;
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  oneRow?: boolean;
  order?: boolean;
}

const SelectInputValidationChildren = {
  required: BoolControl,
  customRule: CustomRuleControl,
};

const childrenMap = {
  // value: arrayStringExposingStateControl("value", []), // value 看下来现在并没有符合要求的类型（xxxExposingStateControl）；只用来展示的话JSONObjectArrayControl是可以的
  value: jsonObjectExposingStateControl("value", { form: [] }),
  label: LabelControl,
  disabled: BoolCodeControl,
  options: FormListControl,
  preserve: BoolControl, // 保留字段值
  formDisplayType: dropdownControl(FormDisplayTypeOptions, "form"), // 动态表单展示类型
  canAdd: withDefault(BoolControl, true), // 支持新增
  canDel: withDefault(BoolControl, true), // 支持删除
  formDisplayWidth: withDefault(NumberControl, "100"), // card 展示宽度
  columnCount: withDefault(NumberControl, "2"), // card 列数
  canMove: BoolCodeControl, // card 支持上下移动
  onEvent: eventHandlerControl([
    {
      label: "onChange",
      value: "change",
      description: "",
    },
  ]),
  ...SelectInputValidationChildren,
};

const DynamicFormComp = new UICompBuilder(childrenMap, (props: any) => {
  // const [validateState, handleValidate] = useSelectInputValidate(props);

  // 默认值
  const initalDynamicFormValue = props.value.value.form;

  // 通过form判断是不是被重置（xxxForm.clearValue）了
  const hasData = Boolean(props.value.value.form);

  useEffect(() => {
    if (!hasData) {
      const initData = [{ _id: uuidv4(), ...initalFormData }];
      setFormData(initData);
      onChangeEvent(initData);
    }
  }, [hasData]);

  // 展示方式
  const isCard = Boolean(props.formDisplayType === "card");
  const isForm = Boolean(props.formDisplayType === "form");

  // 表单配置
  const formListFields = props.options;
  // 保留所有字段值
  const isPreserve = props.preserve;

  const initalFormData = formListFields.reduce((pre: any, field: IField) => {
    return { ...pre, [field.name]: "" };
  }, {});

  const [formData, setFormData] = useState<any[]>(
    (initalDynamicFormValue || []).length > 0
      ? initalDynamicFormValue.map((p: any) => ({ _id: uuidv4(), ...p }))
      : [{ _id: uuidv4(), ...initalFormData }]
  );

  useEffect(() => {
    if ((initalDynamicFormValue || []).length > 0) {
      setFormData(initalDynamicFormValue.map((p: any) => ({ _id: uuidv4(), ...p })));
    }
  }, [initalDynamicFormValue]);

  const onChangeEvent = (formData: any) => {
    props.value.onChange({ form: formData });
    props.onEvent("change");
  };

  const addField = () => {
    const addedData = [...formData, { _id: uuidv4(), ...initalFormData }];
    setFormData(addedData);
    onChangeEvent(addedData);
  };

  const removeField = (indexToRemove: number) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(indexToRemove, 1);
    setFormData(updatedFormData);
    onChangeEvent(updatedFormData);
  };

  const moveDownField = (indexToMove: number) => {
    const updatedFormData = [...formData];
    const previous = updatedFormData[indexToMove];
    const next = updatedFormData[indexToMove + 1];
    updatedFormData.splice(indexToMove, 2, next, previous);
    setFormData(updatedFormData);
    onChangeEvent(updatedFormData);
  };

  const moveUpField = (indexToMove: number) => {
    const updatedFormData = [...formData];
    const previous = updatedFormData[indexToMove];
    const next = updatedFormData[indexToMove - 1];
    updatedFormData.splice(indexToMove - 1, 2, previous, next);
    setFormData(updatedFormData);
    onChangeEvent(updatedFormData);
  };

  const filterObjectByKeys = (obj: any, keysArray: any) => {
    const filteredObject: any = {};
    for (const key of keysArray) {
      if (obj.hasOwnProperty(key)) {
        filteredObject[key] = obj[key];
      }
    }
    return filteredObject;
  };

  const getSelectPopupMatchSelectWidth = (
    popupMatchSelectWidth: PopupMatchSelectWidthOptionValue,
    widthVal?: number
  ) => {
    if (popupMatchSelectWidth === "min-width") {
      return true;
    }
    if (popupMatchSelectWidth === "max-width") {
      return false;
    }
    if (popupMatchSelectWidth === "custom-width") {
      return widthVal ?? 120;
    }
  };

  const handleChange = (index: number, fieldName: string, value: any) => {
    const keysToFilter = isPreserve
      ? ["_id", ...Object.keys(formData[index])]
      : ["_id", ...formListFields.map((p: any) => p.name)];
    const updatedFormData = formData.reduce((preFields, field, formDataIndex) => {
      if (formDataIndex === index) {
        return [...preFields, { ...filterObjectByKeys(field, keysToFilter), [fieldName]: value }];
      } else {
        return [...preFields, filterObjectByKeys(field, keysToFilter)];
      }
    }, []);
    setFormData(updatedFormData);
    onChangeEvent(updatedFormData);
  };

  const getDatePickerValue = (value: any, picker: string) => {
    if (picker === "time") {
      return value ? moment(value, "HH:mm:ss") : undefined;
    }
    return value ? moment(value, "YYYY-MM-DD") : undefined;
  };

  const getRangePickerValue = (value: any, picker: string) => {
    if (picker === "time") {
      return value ? [moment(value[0], "HH:mm:ss"), moment(value[1], "HH:mm:ss")] : undefined;
    }
    return value ? [moment(value[0], "YYYY-MM-DD"), moment(value[1], "YYYY-MM-DD")] : undefined;
  };

  const renderDynamicFormItem = (field: IField, index: number, data: { [x: string]: any }) => {
    return (
      <StyledDynamicFormItem type={props.formDisplayType}>
        {isCard && <StyledLabel>{field.label}：</StyledLabel>}
        {field.type === "text" ? (
          <div style={isCard ? { width: "fit-content" } : { flex: 1 }}>
            {field.text || data[field.name]}
          </div>
        ) : null}
        {field.type === "input" ? (
          <Input
            placeholder={field.label}
            value={data[field.name]}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1 }}
            onChange={(e: any) => handleChange(index, field.name, e.target.value)}
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "inputNumber" ? (
          <InputNumber
            placeholder={field.label}
            value={data[field.name]}
            min={field.min || Number.MIN_SAFE_INTEGER}
            max={field.max || Number.MAX_SAFE_INTEGER}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1 }}
            onChange={(val: any) => handleChange(index, field.name, val)}
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "select" ? (
          <Select
            options={field.options || []}
            mode={field.mode === "common" ? undefined : field.mode}
            placeholder={field.label}
            value={data[field.name] ? data[field.name] : undefined}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1.16 }}
            onChange={(val: any) => handleChange(index, field.name, val)}
            disabled={field.disabled || props.disabled}
            showSearch={field.showSearch}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            dropdownMatchSelectWidth={getSelectPopupMatchSelectWidth(
              field.popupMatchSelectWidth || "min-width",
              field.popupMatchSelectWidthVal
            )}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "cascader" ? (
          <Cascader
            options={field.options || []}
            placeholder={field.label}
            value={data[field.name] ? data[field.name] : undefined}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1.16 }}
            onChange={(val: any) => handleChange(index, field.name, val)}
            disabled={field.disabled || props.disabled}
            showSearch={field.showSearch}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "timePicker" ? (
          <TimePicker
            placeholder={field.label}
            value={data[field.name] ? moment(data[field.name], "HH:mm:ss") : undefined}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1 }}
            onChange={(_time: any, timeString: string) =>
              handleChange(index, field.name, timeString)
            }
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "datePicker" ? (
          <DatePicker
            placeholder={field.label}
            value={getDatePickerValue(data[field.name], field.picker)}
            picker={field.picker}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 120, width: "fit-content" } : { minWidth: 120, flex: 1 }}
            onChange={(_data: Moment, dataString: string) =>
              handleChange(index, field.name, dataString)
            }
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "rangePicker" ? (
          <RangePicker
            order={field.order}
            // placeholder={field.label}
            value={getRangePickerValue(data[field.name], field.picker)}
            picker={field.picker}
            // style={{ minWidth: 220, width: `${100 / formListFields.length}%` }}
            style={isCard ? { minWidth: 220, width: "fit-content" } : { minWidth: 220, flex: 1 }}
            onChange={(_data: Moment, dataString: string) =>
              handleChange(index, field.name, dataString)
            }
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
        {field.type === "switch" ? (
          <Switch
            value={data[field.name]}
            // style={{ minWidth: 120, width: `${100 / formListFields.length}%` }}
            style={isCard ? { width: "fit-content" } : { flex: 1 }}
            onChange={(val: any) => handleChange(index, field.name, val)}
            disabled={field.disabled || props.disabled}
            allowClear={field.allowClear}
          />
        ) : null}
      </StyledDynamicFormItem>
    );
  };

  return props.label({
    required: props.required,
    style: props.style,
    children: (
      <div>
        {isCard && props.canAdd && (
          <Button
            style={{ marginBottom: "8px" }}
            type="primary"
            disabled={props.disabled}
            icon={<PlusOutlined />}
            onClick={addField}
          >
            新增
          </Button>
        )}
        {formData.map((data, index) => (
          <StyledDynamicFormList key={data._id} type={props.formDisplayType}>
            <StyledDynamicForm type={props.formDisplayType} width={props.formDisplayWidth}>
              {isForm ? (
                <>
                  {formListFields.map(
                    (field: IField) =>
                      !Boolean(field.hidden) && (
                        <Fragment key={`${data._id}_${index}_${field.type}_${field.name}`}>
                          {renderDynamicFormItem(field, index, data)}
                        </Fragment>
                      )
                  )}
                </>
              ) : (
                <StyledRow>
                  <Row gutter={[16, 16]}>
                    {formListFields.map((field: IField) => (
                      <Col
                        span={field.oneRow ? 24 : 24 / (props.columnCount || 2)}
                        key={`${data._id}_${index}_${field.type}`}
                      >
                        {renderDynamicFormItem(field, index, data)}
                      </Col>
                    ))}
                  </Row>
                </StyledRow>
              )}
              {isForm && props.canDel && (
                <Button
                  shape="circle"
                  disabled={props.disabled}
                  icon={<DeleteOutlined />}
                  onClick={() => removeField(index)}
                ></Button>
              )}
            </StyledDynamicForm>
            {props.canDel && (
              <StyledOperateButtonGroup>
                {isCard && (
                  <Button
                    type="danger"
                    disabled={props.disabled}
                    icon={<DeleteOutlined />}
                    onClick={() => removeField(index)}
                  >
                    删除
                  </Button>
                )}
                {isCard && props.canMove && index !== 0 && (
                  <Button
                    type="primary"
                    disabled={props.disabled}
                    icon={<UpOutlined />}
                    onClick={() => moveUpField(index)}
                  >
                    上移
                  </Button>
                )}
                {isCard && props.canMove && index !== formData.length - 1 && (
                  <Button
                    type="primary"
                    disabled={props.disabled}
                    icon={<DownOutlined />}
                    onClick={() => moveDownField(index)}
                  >
                    下移
                  </Button>
                )}
              </StyledOperateButtonGroup>
            )}
          </StyledDynamicFormList>
        ))}
        {isForm && props.canAdd && (
          <Button
            type="dashed"
            disabled={props.disabled}
            icon={<PlusOutlined />}
            onClick={addField}
          >
            添加一行数据
          </Button>
        )}
      </div>
    ),
    // ...validateState,
  });
})
  .setPropertyViewFn((children: any) => {
    // 属性面板
    return (
      <>
        <Section name={sectionNames.basic}>
          {children.options.propertyView({})}
          {children.preserve.propertyView({
            label: "保留所有字段值",
            tooltip: "当字段被删除或不展示时，保留字段值",
          })}
          {children.value.propertyView({ label: "默认值" })}
          {children.formDisplayType.propertyView({
            label: "展示方式",
            tooltip:
              "表单：在一行内展示表单（默认横向展示）；卡片：在一个卡片容器内展示表单（默认纵向展示）",
          })}
          {children.canAdd.propertyView({
            label: "“新增”按钮",
            tooltip: "表单展示“新增”按钮，支持动态增加数据",
          })}
          {children.canDel.propertyView({
            label: "“删除”等操作按钮",
            tooltip: "表单展示“删除”按钮，支持动态删除、上下移动等操作",
          })}
          {children.formDisplayType.getView() === "card" &&
            children.formDisplayWidth.propertyView({
              label: "宽度（%）",
            })}
          {children.formDisplayType.getView() === "card" &&
            children.columnCount.propertyView({
              label: "列数",
            })}
          {children.formDisplayType.getView() === "card" &&
            children.canMove.propertyView({
              label: "支持移动",
            })}
        </Section>
        {/* 标签 */}
        {children.label.getPropertyView()}
        {/* 交互 */}
        <Section name={sectionNames.interaction}>
          {children.onEvent.propertyView()}
          {disabledPropertyView(children)}
        </Section>
        {/* 校验 */}
        <Section name={sectionNames.validation}>
          {requiredPropertyView(children)}
          {children.customRule.propertyView({})}
        </Section>
        {/* 布局 */}
        <Section name={sectionNames.layout}>{hiddenPropertyView(children)}</Section>
      </>
    );
  })
  .build();

const DynamicFormTemp = withMethodExposing(DynamicFormComp, []);

export default withExposingConfigs(DynamicFormTemp, [new NameConfig("value", "")]);
