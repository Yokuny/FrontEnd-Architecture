import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  Row,
  InputGroup,
  Button,
} from "@paljs/ui";
import React from "react";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AddCustomer = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState();
  const [data, setData] = React.useState();

  const intl = useIntl();
  const navigate = useNavigate();
  const id = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    if (id) getData();
  }, [id]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/customer?id=${id}`)
      .then((response) => {
        setEnterprise({
          value: response.data?.enterprise?.id,
          label: response.data?.enterprise?.name,
        });
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "machine.idEnterprise.required" }));
      return;
    }

    if (!data?.name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/customer`, {
      id,
      idEnterprise: enterprise?.value,
      name: data?.name,
    })
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/customer?id=${id}`)
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const isShowDeactive =
    id &&
    props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id === enterprise?.value &&
        x.paths?.includes("/customer-delete")
    );

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <TextSpan apparence="s1">
                <FormattedMessage id="customer" />
              </TextSpan>
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="home-outline"
                    title={`${intl.formatMessage({
                      id: "enterprise",
                    })} *`}
                  />
                  <div className="mt-1"></div>
                  <SelectEnterprise
                    onChange={(value) => setEnterprise(value)}
                    value={enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="person-outline"
                    title={`${intl.formatMessage({
                      id: "name",
                    })} *`}
                  />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "name",
                      })}
                      onChange={(text) =>
                        onChange("name", text.target.value)
                      }
                      value={data?.name}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Row
                style={{ margin: 0 }}
                end={!isShowDeactive}
                between={isShowDeactive}
              >
                {isShowDeactive && (
                  <DeleteConfirmation
                    onConfirmation={() => onDelete()}
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                  />
                )}
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(AddCustomer);
