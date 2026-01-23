import ItemFolder from "./ItemFolder";
import ItemRowListDashboard from "./ItemRow";

export default function ItemLineDashboard(props) {
  const { item, hasPermissionViewer, hasPermissionEditor,isShowEnterprise } = props;

  if (item?.typeData === "folder") {
    return <ItemFolder
      item={item}
      hasPermissionViewer={hasPermissionViewer}
      hasPermissionEditor={hasPermissionEditor}
      isShowEnterprise={isShowEnterprise}
    />
  }

  return <ItemRowListDashboard
    item={item}
    hasPermissionViewer={hasPermissionViewer}
    hasPermissionEditor={hasPermissionEditor}
    isShowEnterprise={isShowEnterprise}
  />
}
