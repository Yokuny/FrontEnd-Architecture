import { Select } from "@paljs/ui";
import { useIntl } from "react-intl";

export default function SelectStatusOS({
  onChange,
  value,
  style,
}) {

  const intl = useIntl();

  const optionsStatus = [
    {
      value: "awaiting.create.confirm",
      label: intl.formatMessage({ id: "awaiting.create.confirm" }),
      type: [String],
    },
    {
      value: "awaiting.request",
      label: intl.formatMessage({ id: "awaiting.request" }),
      type: [String],
    },
    {
      value: "supplier.canceled",
      label: intl.formatMessage({ id: "supplier.canceled" }),
      type: [String],
    },
    {
      value: "awaiting.buy.request",
      label: intl.formatMessage({ id: "awaiting.buy.request" }),
      type: [String],
    },
    {
      value: "awaiting.collaborators",
      label: intl.formatMessage({ id: "awaiting.collaborators" }),
      type: [String],
    },
    {
      value: "awaiting.bms.confirm",
      label: intl.formatMessage({ id: "awaiting.bms.confirm" }),
      type: [String],
    },
    {
      value: "bms.refused",
      label: intl.formatMessage({ id: "bms.refused" }),
      type: [String],
    },
    {
      value: "awaiting.contract.validation",
      label: intl.formatMessage({ id: "awaiting.contract.validation" }),
      type: [String],
    },
    {
      value: "awaiting.sap",
      label: intl.formatMessage({ id: "awaiting.sap" }),
      type: [String],
    },
    {
      value: "awaiting.bms",
      label: intl.formatMessage({ id: "awaiting.bms" }),
      type: [String],
    },
    {
      value: "awaiting.payment",
      label: intl.formatMessage({ id: "awaiting.payment" }),
      type: [String],
    },
    {
      value: "awaiting.invoice",
      label: intl.formatMessage({ id: "awaiting.invoice" }),
      type: [String],
    },
    {
      value: "fas.closed",
      label: intl.formatMessage({ id: "fas.closed" }),
      type: [String],
    },
    {
      value: "awaiting.rating",
      label: intl.formatMessage({ id: "awaiting.rating" }),
      type: [String],
    },
    {
      value: "not.realized",
      label: intl.formatMessage({ id: "not.realized" }),
      type: [String],
    },
    {
      value: "not.approved",
      label: intl.formatMessage({ id: "not.approved" }),
      type: [String],
    },
    {
      value: "invoice.rejected",
      label: intl.formatMessage({ id: "invoice.rejected" }),
      type: [String],
    },
    {
      value: "cancelled",
      label: intl.formatMessage({ id: "cancelled" }),
      type: [String],
    },
  ];

  const optionsStatusOrdered = optionsStatus
    ?.sort((a, b) => a.label.localeCompare(b.label))

  const valueData = optionsStatusOrdered?.filter(x => value?.includes(x.value))

  return (
    <>
      <Select
        options={optionsStatusOrdered}
        placeholder={intl.formatMessage({
          id: "status",
        })}
        onChange={onChange}
        value={valueData}
        isClearable
        isMulti
        menuPosition="fixed"
      />
    </>
  );
}
