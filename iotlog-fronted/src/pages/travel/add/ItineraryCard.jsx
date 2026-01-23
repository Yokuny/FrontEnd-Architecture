import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Select,
  Tab,
  Tabs,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import {
  DateTime,
  DeleteConfirmation,
  InputDecimal,
  LabelIcon,
  Modal,
  TextSpan,
} from "../../../components";
import { SelectFence } from "../../../components/Select";
import AddButton from "../../../components/Button/AddButton";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";
import ListObservations from "./ListObservations";

const ColDate = styled(Col)`
  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }
`;

export const datesVoyage = [
  "eta",
  "ata",
  "etb",
  "atb",
  "etc",
  "atc",
  "etd",
  "atd",
  "ets",
  "ats",
];
export const optionsUnity = [
  { value: "T", label: "Ton" },
  { value: "GT", label: "GT" }, // Gross Ton
  { value: "NT", label: "NT" }, // Net Ton
  { value: "m3", label: "m³" },
  { value: "ft3", label: "ft³" },
  { value: "L", label: "L" },
  { value: "bbl", label: "BBL (Barril)" },
  { value: "TEU", label: "TEU" },
];

export default function ItineraryCard({
  index,
  data: dataMaster,
  onChangeData,
  isFinishVoyage,
  idEnterprise,
  onDelete,
  idsFences = [],
  isLast = false,
  isPrinter = false,
}) {
  const theme = useTheme();
  const intl = useIntl();

  const [showModal, setShowModal] = React.useState(false);
  const [data, setData] = React.useState({});

  React.useEffect(() => {
    if (showModal) {
      setData(dataMaster);
    } else {
      setData({});
    }
  }, [showModal]);

  React.useEffect(() => {
    if (dataMaster?.onShowModal) {
      setShowModal(true);
    }
  }, [dataMaster?.onShowModal]);

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
      ...(prop === "fence"
        ? { idFence: value?.value || null, where: value?.label }
        : {}),
    }));
  };

  function handleChangeLoad(ix, key, value) {
    setData((prevData) => ({
      ...prevData,
      load: [
        ...prevData.load?.slice(0, ix),
        {
          ...prevData.load[ix],
          [key]: value,
        },
        ...prevData.load?.slice(ix + 1),
      ],
    }));
  }

  function handleRemoveLoad(j) {
    setData((prevData) => ({
      ...prevData,
      load: [...prevData.load?.slice(0, j), ...prevData.load?.slice(j + 1)],
    }));
  }

  function handleAddLoad() {
    setData((prevData) => ({
      ...prevData,
      load: [
        ...(prevData.load || []),
        {
          description: "",
          amount: "",
          unit: "",
        },
      ],
    }));
  }

  const onSave = () => {
    onChangeData(data);
    setShowModal(false);
  };

  return (
    <>
      <Col breakPoint={{ md: 12 }}>
        <Card
          style={{
            boxShadow: "none",
            border: `1px solid ${theme.borderBasicColor3}`,
            marginBottom: 5,
          }}
        >
          <CardHeader>
            <Row between="xs" middle="xs" className="m-0">
              <Row className="m-0" middle="xs">
                <EvaIcon
                  status={index === 0 ? "Info" : isLast ? "Primary" : "Warning"}
                  name={
                    index === 0
                      ? "arrow-circle-up-outline"
                      : isLast
                      ? "flag-outline"
                      : "swap-outline"
                  }
                  className="mr-1"
                />
                <TextSpan apparence="s2" hint>
                  {intl.formatMessage({
                    id: index === 0 ? "source" : "destiny.port",
                  })}
                  {index >= 1 ? ` #${index}` : ""}
                </TextSpan>
              </Row>
              <Row>
                <Button
                  size="Tiny"
                  appearance="ghost"
                  status="Basic"
                  className="p-1"
                  onClick={() => setShowModal(true)}
                >
                  <EvaIcon
                    name={isFinishVoyage ? "eye-outline" : "edit-outline"}
                  />
                </Button>
                {!isFinishVoyage && (
                  <DeleteConfirmation
                    onConfirmation={onDelete}
                    placement="bottom"
                    message={<FormattedMessage id="delete.itinerary" />}
                  >
                    <Button
                      size="Tiny"
                      appearance="ghost"
                      status="Danger"
                      className="p-1 ml-2"
                    >
                      <EvaIcon name="trash-2-outline" />
                    </Button>
                  </DeleteConfirmation>
                )}
              </Row>
            </Row>
          </CardHeader>
          <CardBody className="mb-0">
            <Row middle="xs">
              <Col breakPoint={{ md: 12 }} className="mb-2">
                <LabelIcon title={<FormattedMessage id={"local"} />} />
                <TextSpan apparence="s2" className="pl-1">
                  {dataMaster?.where || "-"}
                </TextSpan>
              </Col>
              {datesVoyage?.map((dateV, j) => (
                <Col
                  breakPoint={{ md: 6, xs: 6 }}
                  className="mb-2"
                  key={`${j}-${index}-v`}
                >
                  <LabelIcon title={dateV.toLocaleUpperCase()} />
                  <TextSpan apparence="s2" className="pl-1">
                    {dataMaster[`${dateV}Date`] || "-"}{" "}
                    {dataMaster[`${dateV}Time`] || ""}
                  </TextSpan>
                </Col>
              ))}
              {!!dataMaster?.load?.length && (
                <>
                  <Col breakPoint={{ md: 8 }}>
                    <LabelIcon title={<FormattedMessage id="load" />} />
                    <TABLE>
                      <THEAD>
                        <TRH>
                          <TH>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="description" />
                            </TextSpan>
                          </TH>
                          <TH textAlign="end">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="quantity" />
                            </TextSpan>
                          </TH>
                          <TH textAlign="center">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="unit" />
                            </TextSpan>
                          </TH>
                        </TRH>
                      </THEAD>
                      <TBODY>
                        {dataMaster?.load?.map((item, j) => (
                          <TR key={`load-${j}`} isEvenColor={j % 2 === 0}>
                            <TH>
                              <TextSpan apparence="s2">
                                {item.description}
                              </TextSpan>
                            </TH>
                            <TH textAlign="end">
                              <TextSpan apparence="s2">
                                {floatToStringExtendDot(item.amount, 2)}
                              </TextSpan>
                            </TH>
                            <TH textAlign="center">
                              <TextSpan apparence="s2">{item.unit}</TextSpan>
                            </TH>
                          </TR>
                        ))}
                      </TBODY>
                    </TABLE>
                  </Col>
                </>
              )}
              {!!dataMaster?.listObservations?.length && (
                <Col breakPoint={{ md: 8 }} className="mt-4">
                  <TABLE>
                    <THEAD>
                      <TRH>
                        <TH>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="observation" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="end" style={{ width: 160 }}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="value" /> $
                          </TextSpan>
                        </TH>
                        {!isPrinter && <TH textAlign="center" style={{ width: 120 }}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="display" /> BOT
                          </TextSpan>
                        </TH>}
                      </TRH>
                    </THEAD>
                    <TBODY>
                      {dataMaster?.listObservations.map((item, i) => (
                        <>
                          <TR key={i} isEvenColor={i % 2 === 0}>
                            <TD>
                              <TextSpan apparence="p2">
                                {item?.observation}
                              </TextSpan>
                            </TD>
                            <TD textAlign="end">
                              <TextSpan apparence="p2">
                                {item?.value !== null ||
                                item?.value !== undefined
                                  ? floatToStringExtendDot(item?.value)
                                  : ""}
                              </TextSpan>
                            </TD>
                            {!isPrinter && <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {item?.showBot ? "Sim" : "Não"}
                              </TextSpan>
                            </TD>}
                          </TR>
                        </>
                      ))}
                    </TBODY>
                  </TABLE>
                </Col>
              )}
            </Row>
          </CardBody>
        </Card>

        <Modal
          size="Large"
          show={showModal}
          title={`${intl.formatMessage({
            id: index === 0 ? "source" : "destiny.port",
          })}${index >= 1 ? ` #${index}` : ""}`}
          onClose={() => setShowModal(false)}
          styleContent={{
            overflowX: "hidden",
            padding: 0,
            maxHeight: "calc(100vh - 250px)",
          }}
          renderFooter={() => (
            <CardFooter>
              <Row className="m-0" end="xs">
                {isFinishVoyage ? (
                  <Button
                    status="Info"
                    onClick={() => setShowModal(false)}
                    appearance="ghost"
                    className="flex-between"
                    size="Small"
                  >
                    <EvaIcon name="arrow-ios-back-outline" />
                    <FormattedMessage id="back" />
                  </Button>
                ) : (
                  <Button status="Success" onClick={onSave} size="Small">
                    <FormattedMessage id="save" />
                  </Button>
                )}
              </Row>
            </CardFooter>
          )}
        >
          <Tabs style={{ width: "100%" }} fullWidth>
            <Tab
              responsive
              icon="pin-outline"
              title={<FormattedMessage id="local" />}
            >
              <Row className="m-0">
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName={`arrow-circle-${
                      index === 0 ? "up" : "down"
                    }-outline`}
                    title={
                      <FormattedMessage
                        id={index === 0 ? "source" : "destiny.port"}
                      />
                    }
                    mandatory
                  />
                  <SelectFence
                    idEnterprise={idEnterprise}
                    className="mt-1"
                    value={data?.fence}
                    notId={idsFences}
                    filter="port"
                    onChange={(e) => onChange("fence", e)}
                    placeholder={index === 0 ? "source" : "destiny.port"}
                    isDisabled={!!isFinishVoyage}
                  />
                </Col>
                {datesVoyage.map((dateVoyageItem, i) => {
                  return (
                    <>
                      <ColDate
                        breakPoint={{ md: 4.7 }}
                        key={`date-${i}`}
                        className="mb-4"
                      >
                        <LabelIcon
                          iconName={`calendar${
                            dateVoyageItem[0] === "e" ? "-outline" : ""
                          }`}
                          title={dateVoyageItem?.toLocaleUpperCase()}
                        />
                        <DateTime
                          className="mt-1"
                          onChangeTime={(value) =>
                            onChange(`${dateVoyageItem}Time`, value)
                          }
                          onChangeDate={(time) =>
                            onChange(`${dateVoyageItem}Date`, time)
                          }
                          date={data[`${dateVoyageItem}Date`]}
                          time={data[`${dateVoyageItem}Time`]}
                          breakPointDate={{ md: 7.1 }}
                          breakPointTime={{ md: 4.9 }}
                          isDisabled={!!isFinishVoyage}
                        />
                      </ColDate>
                      <ColDate
                        breakPoint={{ md: 1.3 }}
                        key={`show-date-${i}`}
                        className="mb-4"
                      >
                        <LabelIcon
                          iconName={`eye-outline`}
                          title={<FormattedMessage id="display" />}
                        />
                        <Checkbox
                          className="mt-2"
                          checked={data[`showBot${dateVoyageItem}`]}
                          disabled={!!isFinishVoyage}
                          onChange={(e) =>
                            onChange(
                              `showBot${dateVoyageItem}`,
                              !data[`showBot${dateVoyageItem}`]
                            )
                          }
                        >
                          <TextSpan apparence="p2" hint>
                            BOT
                          </TextSpan>
                        </Checkbox>
                      </ColDate>
                    </>
                  );
                })}
              </Row>
            </Tab>
            <Tab
              responsive
              icon="cube-outline"
              title={<FormattedMessage id="load" />}
            >
              <Row>
                {data?.load?.map((item, j) => (
                  <>
                    <Col
                      key={`load-${j}`}
                      breakPoint={{ md: 5 }}
                      className="mb-2"
                    >
                      <LabelIcon
                        className="mt-1"
                        iconName="cube-outline"
                        title={intl.formatMessage({ id: "description" })}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          value={item.description}
                          placeholder={intl.formatMessage({
                            id: "description",
                          })}
                          onChange={(e) =>
                            handleChangeLoad(j, "description", e.target.value)
                          }
                          disabled={!!isFinishVoyage}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <LabelIcon
                        iconName={"at-outline"}
                        title={intl.formatMessage({ id: "quantity" })}
                        className="mt-1"
                      />
                      <InputGroup fullWidth className="mt-1" size="Medium">
                        <InputDecimal
                          value={item.amount}
                          onChange={(e) => handleChangeLoad(j, "amount", e)}
                          disabled={!!isFinishVoyage}
                          placeholder={intl.formatMessage({ id: "quantity" })}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 2 }} className="mb-2">
                      <LabelIcon
                        className="mt-1"
                        iconName="hash-outline"
                        title={intl.formatMessage({ id: "unit" })}
                      />
                      <Select
                        options={optionsUnity}
                        className="mt-1"
                        placeholder={intl.formatMessage({ id: "unit" })}
                        value={
                          optionsUnity?.find((x) => x.value === item.unit) ||
                          null
                        }
                        onChange={({ value }) =>
                          handleChangeLoad(j, "unit", value)
                        }
                        menuPosition="fixed"
                        isDisabled={!!isFinishVoyage}
                      />
                    </Col>
                    <Col
                      breakPoint={{ md: 1 }}
                      className="mb-2"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1.5rem",
                      }}
                    >
                      <Button
                        size="Tiny"
                        appearance="ghost"
                        status="Danger"
                        disabled={!!isFinishVoyage}
                        onClick={() => handleRemoveLoad(j)}
                      >
                        <EvaIcon name="trash-2-outline" size="small" />
                      </Button>
                    </Col>
                  </>
                ))}
              </Row>

              <Row className="m-0 mt-4" center="xs">
                <AddButton
                  iconName="plus-square-outline"
                  textId="add.load"
                  onClick={handleAddLoad}
                  appearance="ghost"
                  status="Info"
                  disabled={!!isFinishVoyage}
                />
              </Row>
            </Tab>
            <Tab
              title={intl.formatMessage({ id: "observation" })}
              icon="text-outline"
            >
              <ListObservations
                formData={data}
                onChange={onChange}
                idEnterprise={idEnterprise}
              />
            </Tab>
          </Tabs>
        </Modal>
      </Col>
    </>
  );
}
