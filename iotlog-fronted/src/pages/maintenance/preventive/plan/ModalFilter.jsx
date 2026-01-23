import React from 'react'
import { Button, CardFooter, Col, Radio, Row } from "@paljs/ui";
import { Fetch, LabelIcon, Modal, SelectMachineEnterprise, SelectMaintenancePlan, TextSpan } from "../../../../components";
import { Vessel } from "../../../../components/Icons";
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';
import SelectManagerPerson from '../../../../components/Select/SelectManagerPerson';

export default function ModalFilter(props) {
  const { show, onClose, onFilter, onlyMaintenance } = props;

  const intl = useIntl();
  const theme = useTheme();

  const [dataFilter, setDataFilter] = React.useState(props.filterData);

  React.useLayoutEffect(() => {
    if (onlyMaintenance) {
      onChange("type", "maintenance")
    }
  }, [onlyMaintenance])

  const onChange = (prop, value) => {
    setDataFilter({ ...dataFilter, [prop]: value });
    props.onChangeFilter(prop, value);
  }

  const onClear = () => {
    setDataFilter({});
    props.onChangeFilter("clear");
  }

  return (<>
    <Modal
      show={show}
      onClose={onClose}
      title={intl.formatMessage({ id: "filter" })}
      size='Large'
      renderFooter={() => (
        <CardFooter>
          <Row between='xs'>
            <Button size="Small"
              appearance="ghost"
              status="Danger"
              className="ml-4" onClick={onClear}>
              <FormattedMessage id="clear.filter" />
            </Button>
            <Button size="Small" className="mr-4" onClick={onFilter}>
              <FormattedMessage id="filter" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <Col breakPoint={{ md: 6 }} className='mb-4'>
          <LabelIcon
            title={intl.formatMessage({ id: "filter" })}
            iconName="funnel-outline"
          />
          <Row className='ml-0'>
            <Radio
              onChange={(value) => onChange("type", value)}
              options={[
                {
                  label: intl.formatMessage({ id: "maintenance" }),
                  value: "maintenance",
                  checked: dataFilter.type === "maintenance"
                },
                {
                  label: intl.formatMessage({ id: "event.team.change" }),
                  value: "teamChange",
                  checked: dataFilter.type === "teamChange"
                },
              ]?.filter(x => onlyMaintenance ? x.value === "maintenance" : true)}
            />
          </Row>
        </Col>
        {(!dataFilter?.type ||
          dataFilter?.type === "maintenance") &&
          <Col breakPoint={{ md: 6 }} className='mb-4'>
            <LabelIcon
              title={intl.formatMessage({ id: "status" })}
              iconName="bulb-outline"
            />
            <Row className='ml-0'>
              <Radio
                onChange={(value) => onChange("status", value)}
                options={[
                  {
                    label: intl.formatMessage({ id: "late" }),
                    value: "late",
                    checked: dataFilter.status === "late"
                  },
                  {
                    label: intl.formatMessage({ id: "next" }),
                    value: "next",
                    checked: dataFilter.status === "next"
                  },
                ]}
              />
            </Row>
          </Col>}
        <Col breakPoint={{ md: 12 }} className='mb-4'>
          <LabelIcon
            title={intl.formatMessage({ id: "vessel" })}
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
          />
          <SelectMachineEnterprise
            className="mr-1"
            isMulti
            idEnterprise={props.idEnterprise}
            onChange={(value) => onChange("filterMachine", value)}
            placeholder="vessel"
            value={dataFilter?.filterMachine}
          />
        </Col>
        {dataFilter?.type === "maintenance"
          ? <>
            <Col breakPoint={{ md: 12 }} className='mb-4'>
              <LabelIcon
                title={intl.formatMessage({ id: "maintenance.plan" })}
                iconName="settings-2-outline"
              />
              <SelectMaintenancePlan
                isClearable
                isMulti
                idEnterprise={props.idEnterprise}
                placeholder={intl.formatMessage({ id: "maintenance.plan" })}
                onChange={(value) => onChange("filterMaintenancePlan", value)}
                value={dataFilter?.filterMaintenancePlan}
              />
            </Col>
            <Col breakPoint={{ md: 12 }} className='mb-4'>
              <LabelIcon
                title={intl.formatMessage({ id: "management.person" })}
                iconName="person-outline"
              />
              <SelectManagerPerson
                isClearable
                isMulti
                idEnterprise={props.idEnterprise}
                onChange={(value) => onChange("managers", value)}
                value={dataFilter.managers}
              />
            </Col>
          </>
          : <Col breakPoint={{ md: 12 }}>
            <LabelIcon
              title={intl.formatMessage({ id: "management.person" })}
              iconName="person-outline"
            />
            <SelectManagerPerson
              isClearable
              isMulti
              idEnterprise={props.idEnterprise}
              onChange={(value) => onChange("managers", value)}
              value={dataFilter.managers}
            />
          </Col>}
      </Row>
    </Modal>
  </>)
}
