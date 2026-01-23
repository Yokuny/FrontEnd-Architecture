import { useIntl } from "react-intl";

export function useOptions({ level }) {
  const intl = useIntl();

  const optionsType = [
    {
      value: "number",
      label: intl.formatMessage({ id: "numeric" }),
      color: "#254EDB",
    },
    {
      value: "date",
      label: intl.formatMessage({ id: "date" }),
      color: "#FFC107",
    },
    {
      value: "datetime",
      label: intl.formatMessage({ id: "datetime" }),
      color: "#F7B500",
    },
    {
      value: "time",
      label: intl.formatMessage({ id: "hour" }),
      color: "#AE9106",
    },
    {
      value: "text",
      label: intl.formatMessage({ id: "text" }),
      color: "#7EC016"
    },
    {
      value: "boolean",
      label: intl.formatMessage({ id: "boolean" }),
      color: "#7a7973",
    },
    {
      value: "select",
      label: "Dropdown",
      color: "#FF3730",
    },
    {
      value: "selectMachine",
      label: intl.formatMessage({ id: "machine.placeholder" }),
      color: "#92078f",
    },
    {
      value: "selectPlatform",
      label: intl.formatMessage({ id: "select.platform" }),
      color: "#B7182D",
    },
    {
      value: "selectScale",
      label: intl.formatMessage({ id: "select.scale" }),
      color: "#2edbd0",
    },
    {
      value: "selectOperationContract",
      label: intl.formatMessage({ id: "select.operation.contract" }),
      color: "#09c470",
    },
    {
      value: "selectFence",
      label: intl.formatMessage({ id: "fence.placeholder" }),
      color: "#dc5709",
    },
    {
      value: "textArea",
      label: intl.formatMessage({ id: "text.multi.line" }),
      color: "#1f7715",
    },
    {
      value: "calculated",
      label: intl.formatMessage({ id: "field.calculated" }),
      color: "#2b312a",
    },
    {

      value: "functionfield",
      label: intl.formatMessage({ id: "function" }),
      color: "#735cbe",
    },
    // {
    //   value: "selectCode",
    //   label: `Dropdown (${intl.formatMessage({ id: "code" })}/${intl.formatMessage({ id: "text" })})`,
    // },
    {
      value: "group",
      label: intl.formatMessage({ id: "group" }),
      color: "#ce1515",
    },
    {
      value: "table",
      label: intl.formatMessage({ id: "table" }),
      color: "#1756a2",
    },
    {
      value: "upload",
      label: intl.formatMessage({ id: "file" }),
      color: "#5a1879",
    },
    {
      value: 'radio',
      label: intl.formatMessage({ id: 'options' }),
      color: '#e87706'
    },
    {
      value: "author",
      label: intl.formatMessage({ id: "author" }),
      color: "#4a90e2"
    }
  ].filter((x) =>
    level === 2 ? x.value !== "group" && x.value !== "table" : true
  ).sort((a, b) => a.label.localeCompare(b.label));

  const optionsSize = [
    {
      value: 12,
      label: intl.formatMessage({ id: "total" }),
    },
    {
      value: 8,
      label: intl.formatMessage({ id: "extra.large" }),
    },
    {
      value: 6,
      label: intl.formatMessage({ id: "large" }),
    },
    {
      value: 4,
      label: intl.formatMessage({ id: "medium.size" }),
    },
    {
      value: 3,
      label: intl.formatMessage({ id: "small" }),
    },
    {
      value: 2,
      label: intl.formatMessage({ id: "extra.small" }),
    },
  ];

  return { optionsType, optionsSize };
}
