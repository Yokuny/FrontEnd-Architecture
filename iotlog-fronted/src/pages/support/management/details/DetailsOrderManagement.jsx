import React from "react";
import { useFetchSupport } from "../../../../components/Fetch/FetchSupport";
import { SpinnerFull, TextSpan } from "../../../../components";
import Col from "@paljs/ui/Col";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import DataDetails from "./DataDetails";
import HistoryList from "./HistoryList";
import ListScaleOrder from "../list-types/ListScaleOrder";
import Row from "@paljs/ui/Row";
import FactoryActions from "../actions-history/FactoryActions";
import { FormattedMessage } from "react-intl";

const DetailsOrderManagement = (props) => {
  const id = new URL(window.location.href).searchParams.get("id");
  const { data, isLoading } = useFetchSupport(`/ordersupport?id=${id}`);
  const { data: permissions } = useFetchSupport("/permission");

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 9 }}>
          <DataDetails
            data={data}
            renderContent={() => (
              <>
                {!!data && (
                  <>
                    <div className="mb-2">
                      <TextSpan apparence="s1">
                        <FormattedMessage id="actions" />
                      </TextSpan>
                    </div>
                    <FactoryActions
                      permissions={permissions}
                      order={data}
                      history={props.history}
                    />
                  </>
                )}
              </>
            )}
          />
          <ListScaleOrder idOrder={id}/>
        </Col>
        {!!data && (
          <Col breakPoint={{ md: 3 }}>
            <HistoryList order={data} isManagement />
          </Col>
        )}
        <SpinnerFull isLoading={isLoading} />
      </Row>
    </>
  );
};

export default DetailsOrderManagement;
