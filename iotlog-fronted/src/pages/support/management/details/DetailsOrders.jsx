import React from "react";
import { useFetchSupport } from "../../../../components/Fetch/FetchSupport";
import { SpinnerFull } from "../../../../components";
import Col from "@paljs/ui/Col";
import DataDetails from "./DataDetails";
import HistoryList from "./HistoryList";
import Row from "@paljs/ui/Row";

const DetailsOrder = (props) => {
  const id = new URL(window.location.href).searchParams.get("id");
  const { data, isLoading } = useFetchSupport(`/ordersupport?id=${id}`);

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 9 }}>
          <DataDetails data={data} />
        </Col>
        {!!data && (
          <Col breakPoint={{ md: 3 }}>
            <HistoryList order={data} />
          </Col>
        )}
        <SpinnerFull isLoading={isLoading} />
      </Row>
    </>
  );
};

export default DetailsOrder;
