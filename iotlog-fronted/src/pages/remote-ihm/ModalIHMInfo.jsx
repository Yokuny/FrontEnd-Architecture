import React, { useState } from 'react';
import { Button, CardFooter, Col, EvaIcon, InputGroup, Row, Select } from '@paljs/ui';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useEffect } from 'react';
import styled from 'styled-components';
import { LabelIcon, Modal } from '../../components';

const defaultFields = {
  info0: "",
  info1: "",
  info2: "",
  info3: "",
}

const ContainerCol = styled(Col)`
  input {
    line-height: 0.5rem;
  }
`;

const ModalIHMInfo = (props) => {
  const intl = useIntl();
  const [infoList, setInfoList] = useState({});

  useEffect(() => {
    let newInfoList = {}
    props.infoList.forEach((info, i) => {
      newInfoList = {
        ...newInfoList,
        [`info${i}`]: {
          ...info,
          sensor: { value: info.sensor?.idSensor, label: info.sensor?.sensor }
        }
      }
    })
    setInfoList(newInfoList);
  }, [props.infoList])

  const onConfirm = () => {
    const result = Object.keys(infoList).map((key) => ({
      ...infoList[key],
      sensor: {
        idSensor: infoList[key].sensor?.value,
        sensor: infoList[key].sensor?.label
      }
    }));
    props.onChange(result)
    props.onClose()
  }

  const handleChange = (key, value) => {
    setInfoList({
      ...infoList,
      [key]: {
        ...infoList[key],
        ...value
      }
    })
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
          <Row end="xs" className="m-0">
            <Button size="Small" className="flex-between" onClick={onConfirm}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="confirm" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <ContainerCol>
        {Object.keys(defaultFields).map((key, i) => (
          <Row className="mb-2">
            <Col breakPoint={{ md: 3 }}>
              <LabelIcon
                iconName="text-outline"
                title={intl.formatMessage({ id: `description` })}
              />
              <InputGroup fullWidth>
                <input
                  value={infoList[key]?.label}
                  onChange={(e) => handleChange(key, { label: e.target.value })}
                  type="text"
                  placeholder={intl.formatMessage({ id: "label" })}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 7 }}>
              <LabelIcon
                iconName="flash-outline"
                title={intl.formatMessage({ id: `sensor` })}
              />
              <Select
                options={props.sensorList}
                placeholder={intl.formatMessage({
                  id: "sensor.placeholder",
                })}
                value={infoList[key]?.sensor}
                onChange={(value) => handleChange(key, { sensor: value })}
                isClearable
                menuPosition="fixed"
                noOptionsMessage={() =>
                  intl.formatMessage({
                    id: "nooptions.message",
                  })
                }
              />
            </Col>
            <Col breakPoint={{ md: 2 }}>
              <LabelIcon
                iconName="info-outline"
                title={intl.formatMessage({ id: `unit` })}
              />
              <InputGroup fullWidth>
                <input
                  value={infoList[key]?.unit}
                  onChange={(e) => handleChange(key, { unit: e.target.value })}
                  type="text"
                  placeholder={intl.formatMessage({ id: "unit" })}
                />
              </InputGroup>
            </Col>
          </Row>
        ))}
      </ContainerCol>
    </Modal >
  );
};

const mapStateToProps = (state) => ({
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ModalIHMInfo);
