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
import { debounce } from "underscore";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  DeleteConfirmation,
  Fetch,
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

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddTypeUser = (props) => {
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
    Fetch.get(`/typeuser?id=${id}`)
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

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value);
  }, 500);

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "machine.idEnterprise.required" }));
      return;
    }

    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/typeuser`, {
      id,
      idEnterprise: enterprise?.value,
      description: data?.description,
      color: data?.color,
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
    Fetch.delete(`/typeuser?id=${id}`)
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
        x.paths?.includes("/delete-type-user")
    );

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <TextSpan apparence="s1">
                <FormattedMessage id="type.user" />
              </TextSpan>
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="enterprise" /> *
                  </TextSpan>
                  <div className="mt-1"></div>
                  <SelectEnterprise
                    onChange={(value) => setEnterprise(value)}
                    value={enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 10 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="description" /> *
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "description",
                      })}
                      onChange={(text) =>
                        onChange("description", text.target.value)
                      }
                      value={data?.description}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 2 }} className="mb-4 pt-4">
                  <ContainerColor className="mt-2">
                    <InputColor
                      type="color"
                      defaultValue={"#3366ff"}
                      value={data?.color}
                      onChange={(e) =>
                        changeValueDebounced("color", e.target.value)
                      }
                    />
                    <TextSpan apparence="s1" className="ml-2">
                      <FormattedMessage id="color" />
                    </TextSpan>
                  </ContainerColor>
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

export default connect(mapStateToProps, undefined)(AddTypeUser);
