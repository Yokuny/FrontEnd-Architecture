import React from "react";
import { SpinnerFull } from "../../../../components";
import { Card, CardHeader } from "@paljs/ui/Card";
import { List, ListItem } from "@paljs/ui/List";
import { injectIntl, FormattedMessage } from "react-intl";
import { nanoid } from "nanoid";
import Fetch from "../../../../components/Fetch/Fetch";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import ItemScaleOrder from "./ItemScaleOrder";

const ListScaleOrder = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);


  React.useLayoutEffect(() => {
    getScalesOrder();
  }, []);

  const getScalesOrder = () => {
    setIsLoading(true);
    Fetch.get(`/scale/sent/order?id=${props.idOrder}`)
      .then((response) => {
        if (response?.data) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const renderItem = ({ item, index }) => (
    <ItemScaleOrder key={index} scale={item} />
  );

  if (!data?.length) {
    return <></>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="send.scales" />
            </Row>
          </Col>
        </CardHeader>
        <List>
          {data?.map((item, index) => (
            <ListItem style={{
              padding: 0
            }} key={nanoid()}>
              {renderItem({ item, index })}
            </ListItem>
          ))}
        </List>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(ListScaleOrder);
