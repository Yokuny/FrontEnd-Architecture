import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, CardFooter, Col, Row, Select, InputGroup } from '@paljs/ui';
import { Modal, LabelIcon, DateTime, InputDecimal } from '../../../components';
import { Speedometer } from '../../../components/Icons';

export default function AddEventModal({
  modalVisibility,
  handleCancelEvent,
  handleSaveEvent,
  intl,
  formData,
  selectedEvent,
  onChangeEvent,
  handleClose,
  theme
}) {
  return (
    <Modal
      title="add.event"
      onClose={handleClose}
      show={modalVisibility}
      size="Large"
      renderFooter={() => (
        <CardFooter>
          <Row middle="xs" between="xs" className="ml-1 mr-1">
            <Button
              size="Small"
              onClick={handleCancelEvent}
              appearance="ghost"
              status="Danger"
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button size="Small" onClick={handleSaveEvent}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row middle="xs"
        style={{
          overflowX: 'hidden',
        }}>
        <Col breakPoint={{ md: 8 }} className="mb-4">
          <LabelIcon iconName="calendar-outline" title={intl.formatMessage({ id: "datetime" })} />
          <DateTime
            className="mt-1"
            onChangeTime={(value) => onChangeEvent('time', value)}
            onChangeDate={(value) => onChangeEvent('date', value)}
            breakPointDate={{ md: 7 }}
            breakPointTime={{ md: 5 }}
            min={formData?.dateTimeStart}
            date={selectedEvent?.date || formData?.date}
            time={selectedEvent?.time || formData?.time}
          />
        </Col>

        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon iconName="shake-outline" title={intl.formatMessage({ id: "status" })} />
          <InputGroup fullWidth>
            <input type="text"
              value={selectedEvent?.status || formData?.status}
              onChange={(e) => onChangeEvent('status', e.target.value)}
              placeholder={intl.formatMessage({ id: "status" })} />
          </InputGroup>
        </Col>

        <Col breakPoint={{ md: 2 }} className="mb-4">
          <LabelIcon iconName="droplet-off-outline" title={intl.formatMessage({ id: "type" })} />
          <Select
            options={[{ label: "MDO", value: "MDO" }]}
            value={{ label: "MDO", value: "MDO" }}
            isDisabled
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon iconName="droplet" title={intl.formatMessage({ id: "machine.supplies.consumption.oil" })} />
          <InputGroup fullWidth>
            <InputDecimal
              value={selectedEvent?.stock?.oil?.value || formData?.stock?.oil?.value}
              onChange={(value) => onChangeEvent('stock', { ...selectedEvent?.stock, oil: { ...selectedEvent?.stock?.oil, value } })}
              placeholder={intl.formatMessage({ id: "machine.supplies.consumption.oil" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <LabelIcon iconName="hash-outline" title={intl.formatMessage({ id: "fas.expense.unit" })} />
          <Select
            options={[{ label: "L", value: "L" }, { label: "m³", value: "m³" }, { label: "T", value: "T" }]}
            onChange={(item) => onChangeEvent('stock', { ...selectedEvent?.stock, oil: { ...selectedEvent?.stock?.oil, unit: item.value } })}
            value={{ value: selectedEvent?.stock?.oil?.unit, label: selectedEvent?.stock?.oil?.unit } || { value: formData?.stock?.oil?.unit, label: formData?.stock?.oil?.unit }}
            placeholder={intl.formatMessage({ id: "fas.expense.unit" })}
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon iconName="droplet-outline" title={intl.formatMessage({ id: "machine.supplies.consumption.potable.water" })} />
          <InputGroup fullWidth>
            <InputDecimal
              value={selectedEvent?.stock?.water?.value || formData?.stock?.water?.value}
              onChange={(value) => onChangeEvent('stock', { ...selectedEvent?.stock, water: { ...selectedEvent?.stock?.water, value } })}
              placeholder={intl.formatMessage({ id: "machine.supplies.consumption.potable.water" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <LabelIcon iconName="hash-outline" title={intl.formatMessage({ id: "fas.expense.unit" })} />
          <Select
            options={[{ label: "L", value: "L" }, { label: "m³", value: "m³" }, { label: "T", value: "T" }]}
            onChange={(item) => onChangeEvent('stock', { ...selectedEvent?.stock, water: { ...selectedEvent?.stock?.water, unit: item.value } })}
            value={{ value: selectedEvent?.stock?.water?.unit, label: selectedEvent?.stock?.water?.unit } || { value: formData?.stock?.water?.unit, label: formData?.stock?.water?.unit }}
            placeholder={intl.formatMessage({ id: "fas.expense.unit" })}
          />
        </Col>

        <Col breakPoint={{ xxl: 4, md: 5 }} className="mb-4">
          <LabelIcon
            renderIcon={() => (
              <Speedometer
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 5,
                  fill: theme.colorBasic600
                }}
              />)}
            title={`${intl.formatMessage({ id: "speed" })} (${intl.formatMessage({ id: "kn" })})`} />
          <InputGroup fullWidth>
            <InputDecimal
              value={selectedEvent?.speed || formData?.speed}
              onChange={(e) => onChangeEvent('speed', e)}
              placeholder={intl.formatMessage({ id: "speed" })}
            />
          </InputGroup>
        </Col>

        <Col breakPoint={{ xxl: 4, md: 6 }} className="mb-4">
          <LabelIcon iconName="settings-outline" title="Engine RPM (BB)" />
          <InputGroup fullWidth>
            <InputDecimal
              value={selectedEvent?.engine?.rpmBB || formData?.engine?.rpmBB}
              onChange={(e) => onChangeEvent('engine', { ...selectedEvent?.engine, rpmBB: e })}
              placeholder="Engine RPM (BB)"
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ xxl: 4, md: 6 }} className="mb-4">
          <LabelIcon iconName="settings-outline" title="Engine RPM (BE)" />
          <InputGroup fullWidth>
            <InputDecimal
              value={selectedEvent?.engine?.rpmBE || formData?.engine?.rpmBE}
              onChange={(e) => onChangeEvent('engine', { ...selectedEvent?.engine, rpmBE: e })}
              placeholder="Engine RPM (BE)"
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon iconName="message-circle-outline" title={
            <FormattedMessage id="observation" />
          } />
          <InputGroup fullWidth>
            <textarea
              className="mt-1"
              type="text"
              value={selectedEvent?.observation || formData?.observation}
              onChange={(e) => onChangeEvent('observation', e.target.value)}
              placeholder={intl.formatMessage({ id: "observation" })}
            />
          </InputGroup>
        </Col>
      </Row>
    </Modal>
  );
};
