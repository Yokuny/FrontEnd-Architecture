import { Card, CardBody, CardHeader, Col, Row } from "@paljs/ui";
import React from "react";

import { connect } from "react-redux";
import { TextSpan } from "../../../components";

import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import SelectMachineFiltered from "../../remote-ihm/bravante/SelectMachineFiltered";
import DashboardDefault from "./DashboardDefault";
import HeatmapLine from "./HeatmapLine";
import StatusCard from "./StatusCard";

const PanelDefaultView = (props) => {
  const [filter, setFilter] = React.useState();
  const [searchParams] = useSearchParams();

  const idMachineQuery = searchParams.get("idMachine");
  const name = searchParams.get("name");

  const idMachine = idMachineQuery || filter?.machine?.value

  return (
    <>
      <Card>
        <CardHeader>
          <Row middle="xs" className="m-0">
            <Col breakPoint={{ md: 6 }}>
              <Row middle="xs">
                <TextSpan apparence="s1">
                  {idMachine ? name : <FormattedMessage id="panel" />}
                </TextSpan>
                {!idMachine && (
                  <Col breakPoint={{ md: 8 }}>
                    <SelectMachineFiltered
                      idEnterprise={
                        props.enterprises?.length ? props.enterprises[0].id : ""
                      }
                      onChange={(value) => setFilter({ machine: value })}
                      placeholder="machine.placeholder"
                      value={filter?.machine || null}
                      renderLastActivity
                    />
                  </Col>
                )}
              </Row>
            </Col>
            {!!idMachine && <StatusCard
              idMachine={idMachine}
            />}
          </Row>
        </CardHeader>
        <CardBody>
          {!!idMachine && <HeatmapLine idMachine={idMachine} />}
          <DashboardDefault
            filter={filter}
            idEnterprise={
              props.enterprises?.length ? props.enterprises[0].id : ""
            }
          />
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, null)(PanelDefaultView);
