import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { TABLE, THEAD, TRH, TH, TBODY } from "../../../components/Table";
import { Fetch, TextSpan } from "../../../components";
import { connect } from "react-redux";
import LoadingRows from "./LoadingRows";
import ItemFleetRow from "./ItemFleetRow";
import Filter from "./Filter";

const FleetStatusList = (props) => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filterName, setFilterName] = React.useState("");

  React.useEffect(() => {
    getData();
  }, [props.enterprises]);

  const getData = () => {
    setIsLoading(true);
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    Fetch.get(
      `/travel/fleet/status${idEnterpriseFilter ? `?idEnterprise=${idEnterpriseFilter}` : ""
      }`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const filteredData = filterName
    ? data.filter((item) =>
      item.name?.toLowerCase().includes(filterName.trim().toLowerCase()) ||
      item.dataSheet?.imo?.toString()?.toLowerCase().includes(filterName.trim().toLowerCase()) ||
      item.dataSheet?.mmsi?.toString()?.toLowerCase().includes(filterName.trim().toLowerCase())
    )
    : data;

  const renderRows = () => {
    return (
      !!filteredData?.length && (
        <>
          {filteredData?.sort((a, b) => new Date(a.date) - new Date(b.date))?.map((itemStatus, i) => (
            <ItemFleetRow itemStatus={itemStatus} key={i} index={i} />
          ))}
        </>
      )
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            Status fleet
          </TextSpan>
          <Filter
            onFilterChange={setFilterName}
          />
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <TABLE>
            <THEAD>
              <TRH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="image" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="name" />
                  </TextSpan>
                </TH>

                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="last.date.acronym" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    ETA
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="destiny.port" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="integration" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="actions" />
                  </TextSpan>
                </TH>

              </TRH>
            </THEAD>
            <TBODY>{isLoading ? <LoadingRows /> : renderRows()}</TBODY>
          </TABLE>
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps)(FleetStatusList);
