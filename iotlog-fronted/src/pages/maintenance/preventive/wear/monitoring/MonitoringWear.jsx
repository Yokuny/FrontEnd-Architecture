import { Card, CardHeader } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ListSearchPaginated, SpinnerFull } from "../../../../../components";
import ItemMonitoringWear from "./ItemMonitoringWear";

const MonitoringWear = (props) => {
  const renderItem = ({ item }) => (
    <>
      <ItemMonitoringWear data={item} />
    </>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="monitoring.wear.part" />
        </CardHeader>
        <ListSearchPaginated
          renderItem={renderItem}
          contentStyle={{
            padding: 0,
            justifyContent: "space-between",
          }}
          pathUrlSearh="/wearstate/monitoring/list"
          filterEnterprise
        />
      </Card>
    </>
  );
};

export default MonitoringWear;
