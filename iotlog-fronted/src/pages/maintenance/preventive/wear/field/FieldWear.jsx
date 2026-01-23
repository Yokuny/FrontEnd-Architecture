import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Fetch, MachineHeader, SpinnerFull } from "../../../../../components";
import ItemFieldWear from "./ItemFieldWear";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const FieldWear = (props) => {
  const { intl } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [listData, setListData] = React.useState([]);

  const id = new URL(window.location.href).searchParams.get("id");
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/wearfield/machine?idMachine=${id}`)
      .then((response) => {
        setListData(
          response.data?.length
            ? response.data.map((x) => ({
                ...x,
                parts: x.parts.map(y => ({
                  value: y.id,
                  label: `${y.name} (${y.sku})`
                })),
                maintenancePlans: x.maintenancePlans.map(y => ({
                  value: y.id,
                  label: y.description
                })),
              }))
            : []
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  function* validItens() {
    for (let item of listData) {
      if (!item?.typeWearSensor) {
        toast.warn(intl.formatMessage({ id: "type.wear.sensor.required" }));
        yield false;
      }
      if (!item?.sensor) {
        toast.warn(intl.formatMessage({ id: "sensor.required" }));
        yield false;
      }

      if (!item?.signal) {
        toast.warn(intl.formatMessage({ id: "signal.required" }));
        yield false;
      }
    }
  }

  const onSave = async () => {
    if (!id) {
      toast.warn(intl.formatMessage({ id: "machine.required" }));
      return;
    }

    let hasError = [...validItens()].some((x) => !x);
    if (hasError) {
      return;
    }

    const sensorsId = listData?.map(x => x.sensor?.value);
    if (sensorsId?.some((item, index) => sensorsId.indexOf(item) != index)) {
      toast.warn(intl.formatMessage({ id: "there.repeated.sensors" }));
      return;
    }

    setIsLoading(true);
    try {
      const data = listData.map((x) => ({
        idMachine: id,
        sensor: x.sensor,
        signal: x.signal,
        typeWearSensor: x.typeWearSensor,
        parts: x.parts.map((x) => x.value),
        maintenancePlans: x.maintenancePlans.map((x) => x.value),
        accumulate: !!x.accumulate,
        id: x.id,
      }));

      await Fetch.post("/wearfield/many", data);
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      navigate(-1);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onChangeItem = (index, prop, value) => {
    const itemToUpdate = listData[index];
    itemToUpdate[prop] = value;
    setListData([
      ...listData.slice(0, index),
      itemToUpdate,
      ...listData.slice(index + 1),
    ]);
  };

  const addField = () => {
    setListData([...listData, {}]);
  };

  const onRemoveItem = (index) => {
    setListData([...listData.slice(0, index), ...listData.slice(index + 1)]);
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between="xs" middle="xs">
                  <MachineHeader
                    idMachine={id}
                  />
                </Row>
              </Col>
            </CardHeader>
            <CardBody>
              {listData?.map((item, i, list) => {
                return (
                  <ItemFieldWear
                    key={i}
                    idMachine={id}
                    item={item}
                    listItems={list}
                    onChange={(prop, value) => onChangeItem(i, prop, value)}
                    onRemove={() => onRemoveItem(i)}
                  />
                );
              })}
              <Button size="Tiny" status="Info" onClick={addField}>
                <FormattedMessage id="add.sensor" />
              </Button>
            </CardBody>
            <CardFooter>
              <Button size="Small" onClick={onSave}>
                <FormattedMessage id="save" />
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(FieldWear);
