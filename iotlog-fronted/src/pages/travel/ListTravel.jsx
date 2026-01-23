import { Button, Card, CardHeader, EvaIcon, Row } from "@paljs/ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextSpan } from "../../components";
import AddButton from "../../components/Button/AddButton";
import { TYPE_TRAVEL } from "../../constants";
import FilterAvanced from "./FilterAvanced";
import ItemInPort from "./ItemInPort";
import ItemItineraryManualVoyage from "./ItemItineraryManualVoyage";
import ItemManualVoyage from "./ItemManualVoyage";
import ItemTravel from "./ItemTravel";
import DownloadCSV from "./DownloadCSV";

const ListTravel = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isFilterAdvanced, setIsFilterAdvanced] = useState(false);

  const renderItem = ({ item, index }) => {
    const itemsMenu = [];
    if (
      item?.travelType === TYPE_TRAVEL.TRAVEL &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.idEnterprise &&
          x.paths?.includes("/add-travel-metadata")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/add-travel-metadata?id=${item.id}` },
      });
    }

    if (
      item?.travelType === TYPE_TRAVEL.TRAVEL &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.idEnterprise &&
          x.paths?.includes("/edit-consume")
      )
    ) {
      itemsMenu.push({
        icon: "edit-2-outline",
        title: intl.formatMessage({ id: "edit.consume" }),
        link: { to: `/edit-consume?id=${item.id}` },
      });
    }

    if (
      item?.travelType === TYPE_TRAVEL.MANEUVER &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.idEnterprise &&
          x.paths?.includes("/add-maneuver-metadata")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/add-maneuver-metadata?id=${item.id}` },
      });
    }

    if (
      item?.travelType === TYPE_TRAVEL.MANUAL_VOYAGE &&
      props.itemsByEnterprise?.some(
        (x) =>
          x.enterprise?.id === item.idEnterprise &&
          x.paths?.includes("/add-travel")
      )
    ) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/add-travel?id=${item.id}` },
      });

      itemsMenu.push({
        icon: "printer-outline",
        title: intl.formatMessage({ id: "print" }),
        link: { to: `/print-voyage?id=${item.id}&idEnterprise=${item.idEnterprise}`, target: "_blank" },
      });

      return item.itinerary?.length ? (
        <ItemItineraryManualVoyage
          item={item}
          key={index}
          itemsMenu={itemsMenu}
        />
      ) : (
        <ItemManualVoyage item={item} key={index} itemsMenu={itemsMenu} />
      );
    }

    return item?.travelType === TYPE_TRAVEL.MANEUVER ? (
      <ItemInPort item={item} key={index} itemsMenu={itemsMenu} />
    ) : (
      <ItemTravel item={item} key={index} itemsMenu={itemsMenu} />
    );
  };

  const hasPermissionAdd = props.itemsByEnterprise?.some((x) =>
    x.paths?.includes("/add-travel")
  );

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : localStorage.getItem("id_enterprise_filter");

  return (
    <>
      <Card style={{ position: "relative" }}>
        <CardHeader>
          <Row between="xs" className="m-0">
            <TextSpan>
              <FormattedMessage id="list.travel" />
            </TextSpan>

            <Row>
              <Button
                size="Tiny"
                appearance={"ghost"}
                className={`flex-between ${hasPermissionAdd ? "mr-4" : ""}`}
                status={isFilterAdvanced ? "Danger" : "Basic"}
                onClick={() => setIsFilterAdvanced((prevState) => !prevState)}
              >
                <EvaIcon
                  className="mr-1"
                  name={isFilterAdvanced ? "close-outline" : "funnel-outline"}
                />
                <FormattedMessage
                  id={isFilterAdvanced ? "filter.close" : "filter.advanced"}
                />
              </Button>
              {hasPermissionAdd && (
                <AddButton
                  status="Primary"
                  onClick={() => {
                    navigate("/add-travel");
                  }}
                  text={intl.formatMessage({ id: "add.travel" })}
                />
              )}
            </Row>
          </Row>
        </CardHeader>

        <FilterAvanced
          renderItem={renderItem}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
          key={"voyages"}
          pathUrlSearh="/travel/list"
          filterEnterprise
          isFilterAdvanced={isFilterAdvanced}
        />

        <DownloadCSV
          idEnterprise={idEnterprise}
        />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ListTravel);
