import moment from "moment"
import { floatToStringBrazilian } from "../../components/Utils"

export const getFormatCell = (columnProp, itemData) => {
  if (columnProp.datatype === "datetime") {
    if (!itemData.data[columnProp.name])
      return "-"

    const dateValue = moment(itemData.data[columnProp.name])
    return <>
      {dateValue.format("DD MMM YYYY")}
      <br />
      {dateValue.format("HH:mm")}
    </>
  }
  if (columnProp.datatype === "selectMachine") {
    return data?.machines?.find(x => x.id === itemData.data[columnProp.name])?.name
  }

  if (columnProp.datatype === "selectScale") {
    return itemData?.data[columnProp.name]?.label
  }

  if (columnProp.datatype === "selectOperationContract") {
    return itemData?.data[columnProp.name]?.value
  }

  if (columnProp.datatype === "selectPlatform") {
    const platform = data?.platforms?.find(x => x.id === itemData.data[columnProp.name])
    if (!platform) return "";
    return `${platform.name}${platform.acronym ? ` - ${platform.acronym}` : ""}`
  }

  if (columnProp.datatype === "calculated") {
    const value = itemData.data[columnProp.name];
    if (value === undefined || value === null) return ""
    return floatToStringBrazilian(value, 2)
  }

  if (columnProp.datatype === "number") {
    const value = itemData.data[columnProp.name];
    if (columnProp.properties?.sizeDecimals)
      return floatToStringBrazilian(value, columnProp.properties?.sizeDecimals)
    return value
  }

  return itemData.data[columnProp.name]
}
