import React from "react";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import styled from "styled-components";
import { EvaIcon, Select } from "@paljs/ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import ItemParamsModal from "./ItemParamsModal";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const ParamsAdd = (props) => {

  const [isEdit, setIsEdit] = React.useState(false);
  const [editId, setEditId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const [data, setData] = React.useState({
    options: [],
    description: "",
    enterprise: undefined,
    type: "",
  });

  const navigate = useNavigate();
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const indexEdit = React.useRef(null);

  React.useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const idEdit = searchParams.get("id");
    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/params/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            description: response.data?.description,
            options: response.data?.options,
            enterprise: {
              value: response.data?.enterprise?.id,
              label: response.data?.enterprise?.name,
            },
            type: response.data?.type,
          });
          setEditId(id);
          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = async () => {
    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!data?.enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      description: data.description,
      options: data.options,
      idEnterprise: data.enterprise?.value,
      id: editId,
      type: data.type
    };

    try {
      await Fetch.post("/params", dataToSave);
    } catch (e) {
      setIsLoading(false);
      return;
    }

    toast.success(intl.formatMessage({ id: "save.successfull" }));
    setIsLoading(false);
    navigate(-1);
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const options = [
    { value: "JUSTIFY", label: intl.formatMessage({ id: "justify" }) },
    { value: "OTHER", label: intl.formatMessage({ id: "other" }) },
  ];

  const onRemove = (i) => {
    setData({
      ...data,
      options: data?.options.filter((x, z) => z !== i),
    });
  }

  const changeEditIndex = (index) => {
    indexEdit.current = index;
    setShowModal(true);
  }

  const onSaveModal = (data) => {
    const i = indexEdit.current;
    setData(prevState => ({
      ...prevState,
      options: [
        ...(prevState?.options?.slice(0, i) || []),
        data,
        ...(prevState?.options?.slice(i + 1) || []),
      ],
    }));
    indexEdit.current = null;
    setShowModal(false);
  }

  const onAdd = () => {
    if (data?.options?.length) {
      const total = data?.options?.length;
      onChange("options", [...data?.options, {}]);
      changeEditIndex(total);
      return;
    }
    onChange("options", [{}]);
    changeEditIndex(0);
  }


  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={isEdit ? "edit.model" : "new.model"} />
            </CardHeader>
            <CardBody>
              <ContainerRow>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName={"briefcase-outline"}
                    title={intl.formatMessage({ id: "enterprise" })}
                    className="mb-1"
                  />
                  <SelectEnterprise
                    onChange={(value) => onChange("enterprise", value)}
                    value={data?.enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName={"text-outline"}
                    title={intl.formatMessage({ id: "description" })}
                    className="mb-1"
                  />
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "description.placeholder",
                      })}
                      onChange={(text) =>
                        onChange("description", text.target.value)
                      }
                      value={data?.description}
                      maxLength={150}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName={"at-outline"}
                    title={intl.formatMessage({ id: "type" })}
                    className="mb-1"
                  />
                  <Select
                    options={options}
                    placeholder={intl.formatMessage({ id: "type" })}
                    onChange={(e) => onChange("type", e.value)}
                    value={options.find((x) => x.value === data?.type)}
                  />
                </Col>
                <Col breakPoint={{ md: 12 }}>
                  <TABLE>
                    {!!data?.options?.length && <THEAD>
                      <TRH>
                        <TH>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="value" />
                          </TextSpan>
                        </TH>
                        <TH>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="label" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" style={{ width: 80 }}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="actions" />
                          </TextSpan>
                        </TH>
                      </TRH>
                    </THEAD>}
                    <TBODY>
                      {data?.options?.map((operationItem, i) => (
                        <TR key={`${i}-c`}
                          isEvenColor={i % 2 === 0}>
                          <TD>
                            <TextSpan apparence="s2">
                              {operationItem?.value}
                            </TextSpan>
                          </TD>
                          <TD>
                            <TextSpan apparence="s2">
                              {operationItem?.label}
                            </TextSpan>
                          </TD>
                          <TD>
                            <Row className="m-0" around="xs">
                              <Button
                                size="Tiny"
                                status="Info"
                                appearance="ghost"
                                style={{ padding: 2 }}
                                onClick={() => changeEditIndex(i)}
                              >
                                <EvaIcon name="edit-2-outline" />
                              </Button>
                              <Button
                                size="Tiny"
                                status="Danger"
                                appearance="ghost"
                                className="ml-1"
                                style={{ padding: 2 }}
                                onClick={() => onRemove(i)}
                              >
                                <EvaIcon name="trash-2-outline" />
                              </Button>
                            </Row>
                          </TD>
                        </TR>))}
                    </TBODY>
                  </TABLE>
                  <Row center="xs" middle="xs">
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      className={data?.options?.length ? "mt-4" : ""}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "between",
                      }}
                      onClick={() => onAdd()}
                    >
                      <EvaIcon name="plus-circle-outline" className="mr-1" />
                      <FormattedMessage id="add.options" />
                    </Button>
                  </Row>
                </Col>
              </ContainerRow>
            </CardBody>
            <CardFooter>
              <Row end>
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <ItemParamsModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSave={(data) => onSaveModal(data)}
        dataInitial={data?.options?.[indexEdit.current]}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default ParamsAdd;
