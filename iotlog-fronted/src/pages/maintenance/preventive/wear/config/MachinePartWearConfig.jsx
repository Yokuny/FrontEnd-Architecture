import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "@paljs/ui";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Fetch,
  SpinnerFull,
  UserImage,
} from "../../../../../components";
import ItemMachinePartConfig from "./ItemMachinePartConfig";
import { FormattedMessage, injectIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const MachinePartWearConfig = (props) => {
  const [data, setData] = React.useState();
  const [wearParts, setWearParts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const id = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    getListToConfig();
  }, []);

  const getListToConfig = () => {
    setIsLoading(true);
    Fetch.get(`/machine/partconfig?idMachine=${id}`)
      .then((response) => {
        setData(response.data);
        setWearParts(response.data.wearParts);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = async () => {
    setIsLoading(true);
    if (!data?.machine?.id) {
      toast.warn(props.intl.formatMessage({ id: "machine.required" }));
      return;
    }

    const dataSave = {
      idMachine: data?.machine?.id,
      wearItems: wearParts?.map((x) => ({
        idPart: x?.part?.id,
        proportional: parseInt(x?.proportional),
        actions: x.actions
      })),
    };

    setIsLoading(true);
    try {
      await Fetch.post("/wearconfig/many", dataSave);
      toast.success(props.intl.formatMessage({ id: "save.successfull" }));
      navigate(-1);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onChangeItem = (index, prop, value) => {
    const wearPartUpdate = wearParts[index];
    wearPartUpdate[prop] = value;
    setWearParts([
      ...data.wearParts.slice(0, index),
      wearPartUpdate,
      ...data.wearParts.slice(index + 1),
    ]);
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
                    image={data?.machine?.image?.url}
                    title={data?.enterprise?.name}
                    name={data?.machine?.name}
                  />
                </Row>
              </Col>
            </CardHeader>
            <CardBody>
              {wearParts?.map((item, index) => (
                <ItemMachinePartConfig
                  key={index}
                  data={item}
                  index={index}
                  onChangeItem={(prop, value) =>
                    onChangeItem(index, prop, value)
                  }
                />
              ))}
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

export default injectIntl(MachinePartWearConfig);
