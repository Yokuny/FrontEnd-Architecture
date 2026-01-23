import React, { useEffect, useState } from 'react';
import { Button, CardFooter, Col, EvaIcon, InputGroup, Row, Select } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { LabelIcon, Modal } from '../../components';

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const valueTypeList = [
  { value: 'ANALOGIC', label: `Analógico` },
  { value: 'DIGITAL', label: `Digital` },
]

const ModalChangeSensor = (props) => {
  const intl = useIntl();

  const [selectedItem, setSelectedItem] = useState(props.itemSelected);
  const [justify, setJustify] = useState();

  useEffect(() => {
    setSelectedItem(props.itemSelected);
    if (props.allowDelete)
      setJustify({ between: 'xs' })
    else
      setJustify({ end: 'xs' })
  }, [props.itemSelected])


  const onDelete = () => {
    props.onChange({ ...selectedItem, sensor: null })
    props.onClose()
  }

  const onConfirm = () => {
    props.onChange(selectedItem)
    props.onClose()
  }

  const handleChange = (value) => {
    setSelectedItem({
      ...selectedItem,
      ...value
    })
  }

  const getBreakPoint = () => {
    if (props.allowLabel) {
      if (props.allowUnit && !props.allowValueType)
        return 6
      return 8
    }
    if (props.allowUnit)
      return 10
    return 12
  }

  return (
    <Modal
      onClose={props.onClose}
      show={props.show}
      title={"change.sensor"}
      size="Medium"
      styleContent={{ maxHeight: "calc(100vh - 150px)", overflowX: "hidden" }}
      renderFooter={() => (
        <CardFooter>
          <Row {...justify} className="m-0">
            {props.allowDelete &&
              <Button status="Danger"
                appearance="ghost"
                size="Small" className="flex-between" onClick={onDelete}>
                <EvaIcon name="trash-2-outline" className="mr-1" />
                <FormattedMessage id="delete" />
              </Button>
            }
            <Button size="Small" className="flex-between" onClick={onConfirm}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="confirm" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <ContainerRow className="mb-3">
        {props.allowLabel &&
          <Col breakPoint={{ md: 4 }}>
            <LabelIcon
              iconName="text-outline"
              title={intl.formatMessage({ id: "description" })}
            />
            <InputGroup fullWidth>
              <input
                value={selectedItem?.label}
                onChange={(e) => handleChange({ label: e.target.value })}
                type="text"
                placeholder={intl.formatMessage({ id: "description" })}
              />
            </InputGroup>
          </Col>
        }
        <Col breakPoint={{ md: getBreakPoint() }}>
          <LabelIcon
            iconName="flash-outline"
            title={intl.formatMessage({ id: `sensor` })}
          />
          <Select
            options={props.sensorList}
            placeholder={intl.formatMessage({
              id: "sensor.placeholder",
            })}
            value={selectedItem?.sensor}
            onChange={(value) => handleChange({ sensor: value })}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() =>
              intl.formatMessage({
                id: "nooptions.message",
              })
            }
          />
        </Col>
        {props.allowValueType &&
          <Col breakPoint={{ md: 4 }} className="mt-2">
            <LabelIcon
              iconName="info-outline"
              title={intl.formatMessage({ id: `type.value` })}
            />
            <Select
              options={valueTypeList}
              placeholder={intl.formatMessage({
                id: "type.value",
              })}
              value={selectedItem?.valueType}
              onChange={(value) => handleChange({ valueType: value })}
              isClearable
              menuPosition="fixed"
              noOptionsMessage={() =>
                intl.formatMessage({
                  id: "nooptions.message",
                })
              }
            />
          </Col>
        }
        {props.allowUnit &&
          ((props.allowValueType && selectedItem?.valueType?.value === 'ANALOGIC') || (!props.allowValueType)) &&
          <Col breakPoint={{ md: 2 }} className="mt-2">
            <LabelIcon
              iconName="info-outline"
              title={intl.formatMessage({ id: `unit` })}
            />
            <InputGroup fullWidth>
              <input
                value={selectedItem?.unit}
                onChange={(e) => handleChange({ unit: e.target.value })}
                type="text"
                placeholder={intl.formatMessage({ id: "unit" })}
              />
            </InputGroup>
          </Col>
        }
        {props.allowMax &&
          <Col breakPoint={{ md: 4 }}>
            <LabelIcon
              iconName="info-outline"
              title={intl.formatMessage({ id: `max.value` })}
            />
            <InputGroup fullWidth>
              <input
                value={selectedItem?.max}
                onChange={(e) => handleChange({ max: e.target.value })}
                type="text"
                placeholder={intl.formatMessage({ id: "max.value" })}
              />
            </InputGroup>
          </Col>
        }
        {props.allowSizeDecimals &&
          ((props.allowValueType && selectedItem?.valueType?.value === 'ANALOGIC') || (!props.allowValueType)) &&
          <Col breakPoint={{ md: 3 }} className="mt-2">
            <LabelIcon
              iconName="percent-outline"
              title={intl.formatMessage({ id: `size.decimals.acron` })}
            />
            <InputGroup fullWidth>
              <input
                value={selectedItem?.sizeDecimals}
                onChange={(e) => handleChange({ sizeDecimals: parseInt(e.target.value || "0") })}
                type="number"
                min={0}
                max={5}
                placeholder={intl.formatMessage({ id: "size.decimals.acron" })}
              />
            </InputGroup>
          </Col>
        }
        {props.allowValueType && selectedItem?.valueType?.value === 'DIGITAL' &&
          <>
            <Col breakPoint={{ md: 3 }} className="mt-2">
              <LabelIcon
                iconName="percent-outline"
                title={intl.formatMessage({ id: `value.zero` })}
              />
              <InputGroup fullWidth>
                <input
                  value={selectedItem?.valueZero}
                  onChange={(e) => handleChange({ valueZero: e.target.value })}
                  type="text"
                  placeholder={intl.formatMessage({ id: "value.zero" })}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mt-2">
              <LabelIcon
                iconName="percent-outline"
                title={intl.formatMessage({ id: `value.one` })}
              />
              <InputGroup fullWidth>
                <input
                  value={selectedItem?.valueOne}
                  onChange={(e) => handleChange({ valueOne: e.target.value })}
                  type="text"
                  placeholder={intl.formatMessage({ id: "value.one" })}
                />
              </InputGroup>
            </Col>
          </>
        }
      </ContainerRow>
    </Modal>
  );
};


export default ModalChangeSensor;
