import moment from "moment";
import { floatToStringBrazilian } from "../../../../components/Utils";
import ListFiles from "../../Downtime/ListFiles";

export const getFormatCell = (
  columnProp,
  itemData,
  dataItem,
  isDownloadShow = false
) => {
  if (isDownloadShow &&
    columnProp.datatype === "group" &&
    columnProp.fields?.length) {
    const groupData = {};
    const fields = columnProp.fields || [];
    fields.forEach(field => {
      const value = itemData.data[field.name];
      if (value !== undefined && value !== null) {
        const mockColumn = { ...field, datatype: field.datatype || 'text' };
        const mockItem = { data: { [field.name]: value } };
        groupData[field.name] = getFormatCell(mockColumn, mockItem, dataItem, true);
      } else {
        groupData[field.name] = '';
      }
    });

    return [groupData];
  }

  if (columnProp.datatype === "datetime") {
    if (!itemData.data[columnProp.name]) return "-";

    const dateValue = moment(itemData.data[columnProp.name]);
    return isDownloadShow ? (
      dateValue.format("YYYY-MM-DD HH:mm")
    ) : (
      <>
        {dateValue.format("DD MMM YYYY")}
        <br />
        {dateValue.format("HH:mm")}
      </>
    );
  }

  if (columnProp.datatype === "date") {
    if (!itemData.data[columnProp.name]) return "-";

    const dateValue = moment(itemData.data[columnProp.name]);
    return isDownloadShow ? (
      dateValue.format("YYYY-MM-DD")
    ) : (
      <>
        {dateValue.format("DD MMM YYYY")}
      </>
    );
  }

  if (columnProp.datatype === "time") {
    if (!itemData.data[columnProp.name]) return "-";
    return itemData.data[columnProp.name];
  }

  if (columnProp.datatype === "selectMachine") {
    return dataItem?.machines?.find(
      (x) => x.id === itemData.data[columnProp.name]
    )?.name;
  }

  if (columnProp.datatype === "selectScale") {
    return itemData?.data[columnProp.name]?.label;
  }

  if (columnProp.datatype === "selectOperationContract") {
    return itemData?.data[columnProp.name]?.value;
  }

  if (columnProp.datatype === "selectPlatform") {
    const platform = dataItem?.platforms?.find(
      (x) => x.id === itemData.data[columnProp.name]
    );
    if (!platform) return "";
    return `${platform.name}${platform.acronym ? ` - ${platform.acronym}` : ""
      }`;
  }

  if (columnProp.datatype === "selectFence") {
    if (columnProp.properties?.isMulti) {
      return itemData?.data[columnProp.name]
        .map((fence) => fence.label)
        .join(", ");
    }

    return itemData?.data[columnProp.name]?.label;
  }

  if (columnProp.datatype === "calculated") {
    const value = itemData.data[columnProp.name];
    if (value === undefined || value === null) return "";
    return floatToStringBrazilian(value, 2);
  }

  if (columnProp.datatype === "number") {
    const value = itemData.data[columnProp.name];
    if (columnProp.properties?.sizeDecimals)
      return floatToStringBrazilian(value, columnProp.properties?.sizeDecimals);
    return value;
  }

  if (columnProp.datatype === "upload" && !isDownloadShow) {
    return <ListFiles files={itemData.data[columnProp.name]} />;
  }

  if (columnProp.datatype === "author") {
    return itemData.data[columnProp.name]?.name || "";
  }

  if (columnProp.datatype === "textarea" || columnProp.datatype === "text") {
    return itemData.data[columnProp.name]?.replaceAll(";", " ") || "";
  }

  return itemData.data[columnProp.name];
};
