import { Button, Col, EvaIcon, Row, Select, Spinner } from "@paljs/ui";
import { InputGroup } from "@paljs/ui/Input";
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import { Fetch, InputDecimal, LabelIcon } from "../../../../components";
import { Barrel } from "../../../../components/Icons";
import InputDateTime from "../../../../components/Inputs/InputDateTime";
import { translate } from "../../../../components/language";
import moment from "moment";

const Title = styled.span`
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const FormGroup = styled.div`
  border-width: 1px;
  border-color: ${props => props.theme.borderBasicColor3};
  border-radius: 4px;
  border-style: solid;
  padding: 12px;
  gap: 12px;
  margin-bottom: 36px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: -1rem;
  margin-left: -2rem;
  padding: 1rem 0rem;
  background-color: ${props => props.theme.backgroundBasicColor1};
  width: 100%;
  position: sticky;
  bottom: -1rem;
  right: -1rem;
  align-self: flex-end;
  border-top: 1px solid ${props => props.theme.backgroundBasicColor3};
`;

const ConsumptionForm = ({
  suppliesConsumption,
  closeModal,
  idMachine,
  idEnterprise,
  date,
  hasPermissionToDelete,
  openDeleteModal,
  updateSuppliesConsumption,
}) => {

  const theme = useTheme();
  const intl = useIntl();

  const initialStateExtended = {
    location: '',
    quantity: '',
    unit: '',
    date: '',
  }

  const initialState = {
    quantity: '',
    unit: '',
  }

  const [oilReceived, setOilReceived] = React.useState(initialStateExtended);
  const [oilSupplied, setOilSupplied] = React.useState(initialStateExtended);
  const [oilConsumed, setOilConsumed] = React.useState(initialState);
  const [oilStock, setOilStock] = React.useState(initialState);

  const [waterReceived, setWaterReceived] = React.useState(initialStateExtended);
  const [waterSupplied, setWaterSupplied] = React.useState(initialStateExtended);
  const [waterConsumed, setWaterConsumed] = React.useState(initialState);
  const [waterStock, setWaterStock] = React.useState(initialState);

  const [isLoading, setIsLoading] = React.useState(false)

  const unitOptions = [
    { label: "T", value: "T" },
    { label: "L", value: "L" },
    { label: "m³", value: "m³" },
  ];

  useEffect(() => {

    if (suppliesConsumption) {
      setOilReceived(suppliesConsumption.oil?.received)
      setOilSupplied(suppliesConsumption.oil?.supply)
      setOilConsumed(suppliesConsumption.oil?.consumed)
      setOilStock(suppliesConsumption.oil?.stock)

      setWaterReceived(suppliesConsumption.water.received)
      setWaterSupplied(suppliesConsumption.water.supply)
      setWaterConsumed(suppliesConsumption.water.consumed)
      setWaterStock(suppliesConsumption.water.stock)
    }

  }, []);

  function getPayload() {

    const payload = {
      "idMachine": idMachine,
      idEnterprise,
      "date": new Date(`${date.slice(0, 10)}T06:00:00${moment().format('Z')}`),
      timezone: moment().format('Z'),
      "oil": {
        "supply": {
          "location": oilSupplied.location || undefined,
          "quantity": oilSupplied.quantity || undefined,
          "unit": oilSupplied.unit?.value || suppliesConsumption?.oil.supply.unit || undefined,
          "date": oilSupplied.date || undefined
        },
        "received": {
          "location": oilReceived.location || undefined,
          "quantity": oilReceived.quantity || undefined,
          "unit": oilReceived.unit?.value || suppliesConsumption?.oil.received.unit || undefined,
          "date": oilReceived.date || undefined
        },
        "consumed": {
          "quantity": oilConsumed.quantity || undefined,
          "unit": oilConsumed.unit?.value || suppliesConsumption?.oil.consumed.unit || undefined
        },
        "stock": {
          "quantity": oilStock.quantity || undefined,
          "unit": oilStock.unit?.value || suppliesConsumption?.oil.stock.unit || undefined
        }
      },
      "water": {
        "supply": {
          "location": waterSupplied.location || undefined,
          "quantity": waterSupplied.quantity || undefined,
          "unit": waterSupplied.unit?.value || suppliesConsumption?.water.supply.unit || undefined,
          "date": waterSupplied.date || undefined
        },
        "received": {
          "location": waterReceived.location,
          "quantity": waterReceived.quantity,
          "unit": waterReceived.unit?.value || suppliesConsumption?.water.received.unit || undefined,
          "date": waterReceived.date || undefined
        },
        "consumed": {
          "quantity": waterConsumed.quantity || undefined,
          "unit": waterConsumed.unit?.value || suppliesConsumption?.water.consumed.unit || undefined
        },
        "stock": {
          "quantity": waterStock.quantity || undefined,
          "unit": waterStock.unit?.value || suppliesConsumption?.water.stock.unit || undefined
        }
      }
    }

    return payload;
  }

  function handleOnClickAdd() {
    setIsLoading(true)

    const errors = validateFields();

    if (errors.length === 0) {

      const payload = getPayload();

      Fetch.post(`/machine-supplies-consumption`, payload)
        .then(response => { success(response.data); })
        .catch(error => { handleCatch() })
        .finally(() => setIsLoading(false))
    }
  }

  function handleOnClickEdit() {
    setIsLoading(true)

    const errors = validateFields();

    if (errors.length === 0) {

      const payload = getPayload();

      Fetch.put(`/machine-supplies-consumption`, payload)
        .then(response => { success(response.data); })
        .catch(error => { handleCatch() })
        .finally(() => setIsLoading(false))

    } else {

    }
  }

  function success() {
    toast.success(translate("save.successfull"));
    closeModal(true);
  }

  function handleCatch() {
    toast.error(translate("error.save"));
  }

  // water and oil consumption are the only mandatory fields
  function validateFields() {

    let errors = [];

    // if (!waterConsumed.quantity) errors.push("error.form.water.consumed.quantity")
    // if (!waterConsumed.unit) errors.push("error.form.water.consumed.unit")
    // if (!oilConsumed.quantity) errors.push("error.form.oil.consumed.quantity")
    // if (!oilConsumed.unit) errors.push("error.form.oil.consumed.unit")

    // errors.length > 0 && errors
    //   .forEach(error => {
    //     toast.error(translate(error))
    //   });

    return errors;
  }

  return (
    <FlexColumn>

      <Title><FormattedMessage id="machine.supplies.consumption.oil" /></Title>

      <FormGroup>
        <Col breakPoint={{ md: 12 }}>
          <Row className="m-0">
            <LabelIcon
              iconName="arrow-circle-down-outline"
              title={<FormattedMessage id="machine.supplies.consumption.received" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="hour" />} />
              <InputDateTime
                onlyTime
                value={oilReceived.date}
                onChange={(value) => setOilReceived({ ...oilReceived, date: value })}
              />
            </Col>

            <Col breakPoint={{ md: 4 }}>
              <LabelIcon title={<FormattedMessage id="location" />} />
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={oilReceived.location}
                  onChange={(e) => setOilReceived({ ...oilReceived, location: e.target.value })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  value={oilReceived.quantity}
                  onChange={(e) => setOilReceived({ ...oilReceived, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === oilReceived.unit)}
                onChange={(e) => setOilReceived({ ...oilReceived, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>
          </Row>
        </Col>


        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              iconName="arrow-circle-up-outline"
              title={<FormattedMessage id="machine.supplies.consumption.supplied" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon
                title={<FormattedMessage id="scale.time" />}
              />
              <InputDateTime
                onlyTime
                value={oilSupplied.date}
                onChange={(value) => setOilSupplied({ ...oilSupplied, date: value })}
              />
            </Col>


            <Col breakPoint={{ md: 4 }}>
              <LabelIcon title={<FormattedMessage id="location" />} />
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={oilSupplied.location}
                  onChange={(e) => setOilSupplied({ ...oilSupplied, location: e.target.value })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={oilSupplied.quantity}
                  onChange={(e) => setOilSupplied({ ...oilSupplied, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === oilSupplied.unit)}
                onChange={(e) => setOilSupplied({ ...oilSupplied, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              iconName="droplet"
              title={<FormattedMessage id="machine.supplies.consumption.consumed" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={oilConsumed.quantity}
                  onChange={(e) => setOilConsumed({ ...oilConsumed, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === oilConsumed.unit)}
                onChange={(e) => setOilConsumed({ ...oilConsumed, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              renderIcon={() => (<Barrel style={{ height: 16, width: 16, fill: theme.colorBasic600, marginRight: 4 }} />)}
              title={<FormattedMessage id="machine.supplies.consumption.stock" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={oilStock.quantity}
                  onChange={(e) => setOilStock({ ...oilStock, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === oilStock.unit)}
                onChange={(e) => setOilStock({ ...oilStock, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>
      </FormGroup>


      <Title><FormattedMessage id="machine.supplies.consumption.potable.water" /></Title>
      <FormGroup>
        <Col breakPoint={{ md: 12 }}>
          <Row className="m-0">
            <LabelIcon
              iconName="arrow-circle-down-outline"
              title={<FormattedMessage id="machine.supplies.consumption.potable.water" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="hour" />} />
              <InputDateTime
                onlyTime
                value={waterReceived.date}
                onChange={(value) => setWaterReceived({ ...waterReceived, date: value })}
              />
            </Col>

            <Col breakPoint={{ md: 4 }}>
              <LabelIcon title={<FormattedMessage id="location" />} />
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={waterReceived.location}
                  onChange={(e) => setWaterReceived({ ...waterReceived, location: e.target.value })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={waterReceived.quantity}
                  onChange={(e) => setWaterReceived({ ...waterReceived, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === waterReceived.unit)}
                onChange={(e) => setWaterReceived({ ...waterReceived, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>
          </Row>
        </Col>


        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              iconName="arrow-circle-up-outline"
              title={<FormattedMessage id="machine.supplies.consumption.supplied" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon
                title={<FormattedMessage id="scale.time" />}
              />
              <InputDateTime
                onlyTime
                value={waterSupplied.date}
                onChange={(value) => setWaterSupplied({ ...waterSupplied, date: value })}
              />
            </Col>

            <Col breakPoint={{ md: 4 }}>
              <LabelIcon title={<FormattedMessage id="location" />} />
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={waterSupplied.location}
                  onChange={(e) => setWaterSupplied({ ...waterSupplied, location: e.target.value })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={waterSupplied.quantity}
                  onChange={(e) => setWaterSupplied({ ...waterSupplied, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === waterSupplied.unit)}
                onChange={(e) => setWaterSupplied({ ...waterSupplied, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              iconName="droplet-outline"
              title={<FormattedMessage id="machine.supplies.consumption.consumed" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={waterConsumed.quantity}
                  onChange={(e) => setWaterConsumed({ ...waterConsumed, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === waterConsumed.unit)}
                onChange={(e) => setWaterConsumed({ ...waterConsumed, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }} className="mt-3">
          <Row className="m-0">
            <LabelIcon
              renderIcon={() => (<Barrel style={{ height: 16, width: 16, fill: theme.colorBasic600, marginRight: 4 }} />)}
              title={<FormattedMessage id="machine.supplies.consumption.stock" />}
              titleApparence="s1"
            />
          </Row>
          <Row>
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon title={<FormattedMessage id="quantity" />} />
              <InputGroup fullWidth>
                <InputDecimal
                  style={{ minWidth: 100 }}
                  value={waterStock.quantity}
                  onChange={(e) => setWaterStock({ ...waterStock, quantity: e })}
                  placeholder={intl.formatMessage({ id: "quantity" })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 2 }}>
              <LabelIcon title={<FormattedMessage id="unit" />} />
              <Select
                options={unitOptions}
                value={unitOptions.find((item) => item.value === waterStock.unit)}
                onChange={(e) => setWaterStock({ ...waterStock, unit: e })}
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </Col>

          </Row>
        </Col>
      </FormGroup>


      {isLoading ? (
        <Spinner />
      ) : (

        <ButtonWrapper>
          {suppliesConsumption ? (
            <>
              {hasPermissionToDelete ? (
                <Button
                  size="Tiny"
                  status="Danger"
                  appearance="ghost"
                  className="flex-between"
                  onClick={() => { openDeleteModal(); closeModal() }}
                >
                  <EvaIcon name="trash-outline" className="mr-1" />
                  <FormattedMessage id="delete" />
                </Button>
              ) : (<div />)}

              <Button
                size="Small"
                status="Primary"
                onClick={() => handleOnClickEdit()}
                disabled={isLoading}
              >
                <FormattedMessage id="save" />
              </Button>
            </>
          ) : (
            <>
              <div />
              <Button
                size="Small"
                status="Primary"
                onClick={() => handleOnClickAdd()}
                disabled={isLoading}
              >
                <FormattedMessage id="add" />
              </Button>
            </>
          )}
        </ButtonWrapper>
      )}

    </FlexColumn>
  );
};

export default ConsumptionForm;
