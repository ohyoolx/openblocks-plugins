export const DisplayTypeOptions = [
  {
    label: "输入框（Input）",
    value: "input",
  },
  {
    label: "数字输入框（InputNumber）",
    value: "inputNumber",
  },
  {
    label: "文本（Text）",
    value: "text",
  },
  {
    label: "下拉框（Select）",
    value: "select",
  },
  {
    label: "级联选择（Cascader）",
    value: "cascader",
  },
  {
    label: "时间选择框（TimePicker）",
    value: "timePicker",
  },
  {
    label: "日期选择框（DatePicker）",
    value: "datePicker",
  },
  {
    label: "日期范围选择框（RangePicker）",
    value: "rangePicker",
  },
  {
    label: "开关（Switch）",
    value: "switch",
  },
  {
    label: "上传（Upload）",
    value: "upload",
  },
] as const;

export type DisplayTypeOptionValue = (typeof DisplayTypeOptions)[number]["value"];

export const modeOptions = [
  {
    label: "普通",
    value: "common",
  },
  {
    label: "多选（multiple）",
    value: "multiple",
  },
  {
    label: "标签（tags）",
    value: "tags",
  },
] as const;

export type ModeOptionValue = (typeof modeOptions)[number]["value"];

export const popupMatchSelectWidthOptions = [
  {
    label: "同宽",
    value: "min-width",
  },
  {
    label: "自适应",
    value: "max-width",
  },
  {
    label: "自定义宽度",
    value: "custom-width",
  },
] as const;

export type PopupMatchSelectWidthOptionValue =
  (typeof popupMatchSelectWidthOptions)[number]["value"];

/** 选择器类型 */
export const pickerOptions = [
  {
    label: "时间",
    value: "time",
  },
  {
    label: "日期",
    value: "date",
  },
  {
    label: "周",
    value: "week",
  },
  {
    label: "月份",
    value: "month",
  },
  {
    label: "年份",
    value: "year",
  },
] as const;

export const defaultCascaderOptions = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

export const defaultSelectOptions = [
  { value: "1", label: "选项1" },
  { value: "2", label: "选项2" },
];
