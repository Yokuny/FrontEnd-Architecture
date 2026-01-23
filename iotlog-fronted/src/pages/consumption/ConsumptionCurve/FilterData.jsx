import { Button, Col, Row } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { LabelIcon, SelectMachineEnterprise } from '../../../components';
import InputDateTime from '../../../components/Inputs/InputDateTime';

export default function FilterData({ onChange, filterQuery, idEnterprise, onSearchCallback }) {
    const intl = useIntl();


    return (
        <Row>
            <Col breakPoint={{ md: 12, xs: 12 }}>
                <LabelIcon
                    iconName="funnel-outline"
                    title={intl.formatMessage({ id: 'filter' })}
                />
            </Col>
            <Col breakPoint={{ md: 4, xs: 12 }}>
                <SelectMachineEnterprise
                    idEnterprise={idEnterprise}
                    value={filterQuery?.machine}
                    onChange={(value) => onChange('machine', value)}
                />
            </Col>
            <Col breakPoint={{ md: 3, xs: 12 }}>
                <InputDateTime
                    placeholder={intl.formatMessage({ id: 'date.start' })}
                    value={filterQuery?.dateMin}
                    onChange={(value) => onChange('dateMin', value)}
                />
            </Col>
            <Col breakPoint={{ md: 3, xs: 12 }}>
                <InputDateTime
                    placeholder={intl.formatMessage({ id: 'date.end' })}
                    value={filterQuery?.dateMax}
                    onChange={(value) => onChange('dateMax', value)}
                />
            </Col>
            <Col breakPoint={{ md: 2, xs: 12 }}>
                <Button
                    status="Primary"
                    fullWidth
                    onClick={onSearchCallback}
                    disabled={!filterQuery?.machine}
                >
                    <FormattedMessage id="apply" />
                </Button>
            </Col>
        </Row>
    );
}
