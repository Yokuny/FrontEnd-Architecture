import { List, ListItem } from "@paljs/ui";
import React from "react";
import { Modal, TextSpan, Tracker } from "../../../components";
import TrackingService from "../../../services/TrackingService";

export default function ModalListItens(props) {

  const equipments = props.itemSelected
    ?.data
    ?.equipments
    ?.sort((a, b) => a?.name?.localeCompare(b?.name));

  const openNewWindow = async (item) => {
    const url = `https://app.tractian.com/analyze/${item.assetId}/insights/${item.insightId}`;
    window.open(url, "_blank");
    await TrackingService.saveTracking({
      pathname: `/open-external-tractian`,
      action: "OPEN_EXTERNAL_TRACTIAN",
      actionData: {
        assetId: item.assetId,
        insightId: item.insightId,
      },
    });
  }

  return <><Modal
    onClose={props.onClose}
    show={props.show}
    title={`${props.itemSelected?.machine?.name} - ${props.itemSelected?.tooltip}`}
    size="Medium"
    styleContent={{
      maxHeight: "calc(100vh - 150px)",
      overflowX: "hidden",
      padding: "0px"
    }}
  >
    <List className="p-0 m-0">
      {equipments?.map((x, i) =>
        <ListItem
          style={{ cursor: "pointer" }}
          key={i} onClick={() => openNewWindow(x)}>
          <div className="ml-2">

          </div>
          <Tracker
            itens={[{
              status: x.status,
              tooltip: " ",
            }]}
          />
          <TextSpan apparence="s2" className="ml-3 mt-1">{x?.name}</TextSpan>
        </ListItem>)}
    </List>
  </Modal>
  </>
}
