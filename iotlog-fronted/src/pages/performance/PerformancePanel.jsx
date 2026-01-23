import { Button, Card, CardBody, CardHeader, Col, EvaIcon, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Fetch } from '../../components/Fetch';
import { LabelIcon, SelectMachineEnterprise } from "../../components";
import { SelectSensorByMachine } from "../../components/Select";
import { SkeletonThemed } from "../../components/Skeleton";
import ListDashPanel from "./ListDashPanel";

export default function PerformancePanel(props) {

  const [machine, setMachine] = useState();
  const [sensorsY, setSensorsY] = useState([]);
  const [sensorX, setSensorX] = useState();
  const [period, setPeriod] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const intl = useIntl();

  const getData = () => {
    if (!machine?.value) {
      toast.warning(intl.formatMessage({ id: 'machine.required' }));
      return;
    }

    if (!sensorX?.value) {
      toast.warning(intl.formatMessage({ id: 'sensor.required' }));
      return;
    }

    if (!sensorsY?.length) {
      toast.warning(intl.formatMessage({ id: 'sensor.required' }));
      return;
    }

    setIsLoading(true);

    const query = [`idSensor[]=${sensorX.value}`, ...sensorsY.map((sensor) => `idSensor[]=${sensor.value}`)];

    query.push(`lastDays=${period}`);

    Fetch.get(`/sensordata/${machine.value}?${query.join('&')}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  const daysOptions = [
    {
      value: 1,
      label: `1 ${intl.formatMessage({ id: 'day' }).toLowerCase()}`
    },
    {
      value: 3,
      label: `3 ${intl.formatMessage({ id: 'days' })}`
    },
    {
      value: 5,
      label: `5 ${intl.formatMessage({ id: 'days' })}`
    },
    {
      value: 7,
      label: `7 ${intl.formatMessage({ id: 'days' })}`
    },
    {
      value: 15,
      label: `15 ${intl.formatMessage({ id: 'days' })}`
    }
  ]

  return <>
    <Card style={{
      height: 'calc(100vh - 200px)',
      marginBottom: 0
    }}>
      <CardHeader>
        <Row middle="xs">
          <Col breakPoint={{ xs: 12, md: 10 }}>
            <Row>
              <Col breakPoint={{ xs: 12, md: 4 }}>
                <LabelIcon
                  title={<FormattedMessage id="machine" />}
                />
                <SelectMachineEnterprise
                  onChange={setMachine}
                  value={machine}
                  idEnterprise={localStorage.getItem('id_enterprise_filter')}
                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 2 }}>
                <LabelIcon
                  title={<FormattedMessage id="period" />}
                />
                <Select
                  options={daysOptions}
                  value={daysOptions.find((x) => x.value === period)}
                  onChange={(value) => setPeriod(value?.value)}

                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }}>
                <LabelIcon
                  title={`${intl.formatMessage({ id: 'sensor' })} X`}
                />
                <SelectSensorByMachine
                  onChange={setSensorX}
                  idMachine={machine?.value}
                  value={sensorX}
                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 12 }}>
                <LabelIcon
                  title={`${intl.formatMessage({ id: 'sensor' })} Y`}
                />
                <SelectSensorByMachine
                  onChange={setSensorsY}
                  idMachine={machine?.value}
                  value={sensorsY}
                  isMulti
                />
              </Col>
            </Row>
          </Col>
          <Col breakPoint={{ xs: 12, md: 2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button status="Info"
              className="flex-between"
              size="Small"
              onClick={getData}>
              <EvaIcon name="search-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>

        <Row>
          {isLoading
            ? <>
              <Col breakPoint={{ xs: 12, md: 6 }}>
                <SkeletonThemed
                  height="300px"
                />
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }}>
                <SkeletonThemed
                  height="300px"
                />
              </Col>
            </>
            : <>{!!data && <ListDashPanel
              data={data}
              sensorsY={sensorsY}
              sensorX={sensorX}
            />}
            </>}
        </Row>
      </CardBody>
    </Card>
  </>
}
