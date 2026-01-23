import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Fetch, SpinnerFull, UserImage } from "../../../../components";
import ListMachineWear from "./ListNewWear";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AddMachineWear = (props) => {
  const { intl } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(false);
  const [wearItems, setWearItems] = React.useState([{}]);

  const id = new URL(window.location.href).searchParams.get("id");
  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine/cover?id=${id}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onAdd = () => {
    setWearItems([...wearItems, {}]);
  };

  const onRemove = (indexRemove) => {
    setWearItems([
      ...wearItems.slice(0, indexRemove),
      ...wearItems.slice(indexRemove + 1),
    ]);
  };

  const onChangeItemParts = (index, propName, value) => {
    setWearItems([
      ...wearItems.slice(0, index),
      {
        ...wearItems[index],
        [propName]: value,
      },
      ...wearItems.slice(index + 1),
    ]);
  };

  const onSave = async () => {
    setIsLoading(true);

    const data = {
      idMachine: id,
      wearItems: wearItems
        ?.filter((x) => !!x?.part?.value)
        ?.map((x) => ({
          idPart: x?.part?.value,
          wear: parseInt(x?.wear),
          reason: x?.reason
        })),
    };

    setIsLoading(true);
    try {
      await Fetch.post("/wearpart/many", data);
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      navigate(-1);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Col>
                <Row between="xs" middle="xs">
                  <UserImage
                    size="Large"
                    image={data?.image?.url}
                    title={data?.enterprise?.name}
                    name={data?.name}
                  />
                </Row>
              </Col>
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} style={{ padding: 0 }}>
                  <ListMachineWear
                    wearItems={wearItems}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    onChangeItem={onChangeItemParts}
                    idMachine={id}
                  />
                </Col>
              </Row>
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

export default injectIntl(AddMachineWear);
