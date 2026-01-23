import { FormattedMessage } from "react-intl";
import { LabelIcon } from "../../../../components";
import ListFields from "../fields/ListFields";

export default function TableField({ onChange, data, idEnterprise }) {
  const onChangeItem = (index, prop, value) => {
    let item = data.fields[index];
    item[prop] = value;
    onChange("fields", [
      ...data.fields.slice(0, index),
      item,
      ...data.fields.slice(index + 1),
    ]);
  };

  const onSetItem = (index, value) => {
    onChange("fields", [
      ...data.fields.slice(0, index),
      value,
      ...data.fields.slice(index + 1),
    ]);
  }

  const onRemoveItem = (i) => {
    onChange("fields", [
      ...data?.fields?.slice(0, i),
      ...data?.fields?.slice(i + 1),
    ]);
  };

  return (
    <>
      <ListFields
        idEnterprise={idEnterprise}
        onChange={onChange}
        onChangeItem={onChangeItem}
        onRemoveItem={onRemoveItem}
        onSetFieldItem={(index, data) => onSetItem(index, data)}
        noShowInList
        data={data}
        level={2}
        table
        renderHeader={() => (
          <>
            <LabelIcon
              iconName="archive-outline"
              title={<FormattedMessage id="fields" />}
            />
            <div className="mt-1"></div>
          </>
        )}
      />
    </>
  );
}
