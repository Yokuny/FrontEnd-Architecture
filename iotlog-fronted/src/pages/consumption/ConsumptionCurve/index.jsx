import { Card, CardBody, CardHeader, Col, Row } from '@paljs/ui';
import moment from 'moment';
import { nanoid } from 'nanoid';
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useTheme } from 'styled-components';
import { toast } from 'react-toastify';

import { Fetch, LoadingCard, TextSpan } from '../../../components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import FilterData from './FilterData';

function ConsumptionCurve(props) {
    const theme = useTheme();
    const intl = useIntl();
    const themeSelected = useThemeSelected();

    const [enginesData, setEnginesData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [filterQuery, setFilterQuery] = React.useState({
        dateMin: new Date(new Date().setDate(new Date().getDate() - 30)),
        dateMax: new Date(),
        machine: null,
    });

    const idEnterprise = props.enterprises?.length
        ? props.enterprises[0]?.id
        : undefined;

    // Realistic diesel engine consumption curve calculators
    const calculateConsumption = (load) => {
        // Diesel engines are more efficient at 70-85% load
        // Consumption increases non-linearly
        if (load === 0) return 5; // Idle consumption
        if (load <= 25) return 5 + (load * 0.8);
        if (load <= 50) return 25 + ((load - 25) * 1.2);
        if (load <= 75) return 55 + ((load - 50) * 1.5);
        return 92.5 + ((load - 75) * 2.2);
    };

    const calculateEfficiency = (load) => {
        // Peak efficiency around 75-80% load
        if (load === 0) return 0;
        if (load <= 25) return 60 + (load * 0.4);
        if (load <= 75) return 70 + ((load - 25) * 0.3);
        return 85 - ((load - 75) * 0.6);
    };

    const getData = () => {
        setEnginesData([]);
        if (!filterQuery?.machine?.value) {
            return;
        }

        setIsLoading(true);

        // TODO: Replace with real API call when backend is ready
        let querys = [];
        if (idEnterprise) {
            querys.push(`idEnterprise=${idEnterprise}`);
        }
        if (filterQuery?.dateMin) {
            querys.push(`dateMin=${moment(filterQuery?.dateMin).format('YYYY-MM-DDTHH:mm:ssZ')}`);
        }
        if (filterQuery?.dateMax) {
            querys.push(`dateMax=${moment(filterQuery?.dateMax).format('YYYY-MM-DDTHH:mm:ssZ')}`);
        }

        Fetch.get(`/consumption/curve/${filterQuery?.machine?.value}?${querys.join('&')}`)
            .then((response) => {
                const engines = response.data?.engines || [];

                const processedEngines = engines.map(engine => {
                    const loadPoints = engine.load || [];
                    const rpmPoints = engine.rpm || [];
                    const consumptionPoints = engine.consumption || [];

                    const efficiencyPoints = (engine.efficiency && engine.efficiency.length > 0)
                        ? engine.efficiency
                        : loadPoints.map(load => calculateEfficiency(load));

                    return {
                        name: engine.name || 'Motor Desconhecido',
                        load: loadPoints,
                        consumption: consumptionPoints,
                        efficiency: efficiencyPoints,
                        rpm: rpmPoints,
                    };
                });



                setEnginesData(processedEngines);
            })
            .catch((error) => {
                toast.error(intl.formatMessage({ id: 'error.get' }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onChange = (key, value) => {

        setFilterQuery(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const getEChartsOption = (engineData) => {
        const mappedData = engineData.load.map((load, index) => ({
            load,
            consumption: engineData.consumption[index],
            efficiency: engineData.efficiency[index],
            rpm: engineData.rpm[index]
        }));

        const consumptionData = mappedData.map(item => [item.load, parseFloat(item.consumption?.toFixed(2) || 0)]);
        const efficiencyData = mappedData.map(item => [item.load, parseFloat(item.efficiency?.toFixed(2) || 0)]);
        const rpmData = mappedData.map(item => [item.load, parseFloat(item.rpm?.toFixed(0) || 0)]);

        return {
            title: {
                text: engineData.name,
                subtext: 'Comportamento do motor em diferentes cargas',
                left: 'center',
                textStyle: {
                    color: theme.textBasicColor,
                    fontSize: 16,
                    fontFamily: theme.fontFamilyPrimary,
                    fontWeight: 600,
                },
                subtextStyle: {
                    color: theme.textHintColor,
                    fontSize: 13,
                    fontFamily: theme.fontFamilyPrimary,
                },
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: themeSelected === 'dark' ? '#1a1a1a' : '#ffffff',
                borderColor: themeSelected === 'dark' ? '#444' : '#e0e0e0',
                textStyle: {
                    color: theme.textBasicColor,
                    fontSize: 12,
                    fontFamily: theme.fontFamilyPrimary,
                },
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: theme.textHintColor,
                    },
                },
                formatter: (params) => {
                    let result = `<strong>Carga: ${params[0].value[0]}%</strong><br/>`;
                    params.forEach((param) => {
                        const value = param.value[1];
                        let formattedValue;
                        if (param.seriesName === 'Consumo (L/h)') {
                            formattedValue = `${value.toFixed(2)} L/h`;
                        } else if (param.seriesName === 'Eficiência (%)') {
                            formattedValue = `${value.toFixed(2)}%`;
                        } else if (param.seriesName === 'RPM') {
                            formattedValue = `${value.toFixed(0)} RPM`;
                        }
                        result += `${param.marker} ${param.seriesName}: ${formattedValue}<br/>`;
                    });
                    return result;
                },
            },
            legend: {
                data: [
                    'Consumo (L/h)',
                    'Eficiência (%)',
                    'RPM'
                ],
                top: 40,
                textStyle: {
                    color: theme.textBasicColor,
                    fontSize: 14,
                    fontFamily: theme.fontFamilyPrimary,
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                top: 100,
                containLabel: true,
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                    },
                    restore: {},
                    saveAsImage: {},
                },
                iconStyle: {
                    borderColor: theme.textBasicColor,
                },
            },
            xAxis: {
                type: 'value',
                name: 'Carga do Motor (%)',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: theme.textBasicColor,
                    fontSize: 14,
                    fontFamily: theme.fontFamilyPrimary,
                    fontWeight: 600,
                },
                axisLabel: {
                    formatter: '{value}%',
                    color: theme.textBasicColor,
                    fontSize: 12,
                    fontFamily: theme.fontFamilyPrimary,
                },
                axisLine: {
                    lineStyle: {
                        color: themeSelected === 'dark' ? '#444' : '#e0e0e0',
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: themeSelected === 'dark' ? '#444' : '#e0e0e0',
                        type: 'dashed',
                    },
                },
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Consumo (L/h)',
                    position: 'left',
                    nameTextStyle: {
                        color: theme.colorPrimary500,
                        fontSize: 14,
                        fontFamily: theme.fontFamilyPrimary,
                        fontWeight: 600,
                    },
                    axisLabel: {
                        formatter: (value) => value.toFixed(1),
                        color: theme.colorPrimary500,
                        fontSize: 12,
                        fontFamily: theme.fontFamilyPrimary,
                    },
                    axisLine: {
                        lineStyle: {
                            color: theme.colorPrimary500,
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: themeSelected === 'dark' ? '#444' : '#e0e0e0',
                            type: 'dashed',
                        },
                    },
                },
                {
                    type: 'value',
                    name: 'Eficiência (%)',
                    position: 'right',
                    nameTextStyle: {
                        color: theme.colorSuccess500,
                        fontSize: 14,
                        fontFamily: theme.fontFamilyPrimary,
                        fontWeight: 600,
                    },
                    axisLabel: {
                        formatter: '{value}%',
                        color: theme.colorSuccess500,
                        fontSize: 12,
                        fontFamily: theme.fontFamilyPrimary,
                    },
                    axisLine: {
                        lineStyle: {
                            color: theme.colorSuccess500,
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                },
                {
                    type: 'value',
                    name: 'RPM',
                    position: 'right',
                    offset: 80,
                    nameTextStyle: {
                        color: theme.colorInfo500,
                        fontSize: 14,
                        fontFamily: theme.fontFamilyPrimary,
                        fontWeight: 600,
                    },
                    axisLabel: {
                        formatter: (value) => value.toFixed(0),
                        color: theme.colorInfo500,
                        fontSize: 12,
                        fontFamily: theme.fontFamilyPrimary,
                    },
                    axisLine: {
                        lineStyle: {
                            color: theme.colorInfo500,
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                },
            ],
            series: [
                // Consumo - Pontos
                {
                    name: 'Consumo (L/h)',
                    type: 'scatter',
                    yAxisIndex: 0,
                    data: consumptionData,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: theme.colorPrimary500,
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: theme.colorPrimary500,
                            symbolSize: 12,
                        },
                    },
                    z: 10,
                },
                // Eficiência - Pontos
                {
                    name: 'Eficiência (%)',
                    type: 'scatter',
                    yAxisIndex: 1,
                    data: efficiencyData,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: theme.colorSuccess500,
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: theme.colorSuccess500,
                            symbolSize: 12,
                        },
                    },
                    z: 10,
                },
                // RPM - Pontos
                {
                    name: 'RPM',
                    type: 'scatter',
                    yAxisIndex: 2,
                    data: rpmData,
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: theme.colorInfo500,
                    },
                    emphasis: {
                        focus: 'series',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: theme.colorInfo500,
                            symbolSize: 12,
                        },
                    },
                    z: 10,
                },
            ],
            animation: true,
            animationDuration: 800,
            animationEasing: 'cubicInOut',
        };
    };

    return (
        <Card>
            <CardHeader>
                <TextSpan apparence="s1">
                    <FormattedMessage id="consumption.curve" defaultMessage="Curva de Consumo" />
                </TextSpan>
            </CardHeader>
            <CardBody>
                <FilterData
                    onChange={onChange}
                    filterQuery={filterQuery}
                    idEnterprise={idEnterprise}
                    onSearchCallback={getData}
                />

                <LoadingCard isLoading={isLoading}>
                    {enginesData.length > 0 ? (
                        enginesData.map((engine, index) => (
                            <div key={index}>
                                <Row className="mt-4">
                                    <Col breakPoint={{ md: 12, xs: 12 }}>
                                        <ReactECharts
                                            option={getEChartsOption(engine)}
                                            style={{ height: '450px', width: '100%' }}
                                            notMerge={true}
                                            lazyUpdate={true}
                                            opts={{ renderer: 'canvas' }}
                                        />
                                    </Col>
                                </Row>

                                <Row className="mt-4 mb-5">
                                    <Col breakPoint={{ md: 12, xs: 12 }}>
                                        <Card>
                                            <CardHeader>
                                                <TextSpan apparence="h6">
                                                    <FormattedMessage id="optimal.operation.info" defaultMessage="Informações de Operação Ótima" />
                                                    {` - ${engine.name}`}
                                                </TextSpan>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    <Col breakPoint={{ md: 4, xs: 12 }}>
                                                        <div style={{ padding: '16px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '14px', color: theme.textHintColor, marginBottom: '8px' }}>
                                                                Faixa de Eficiência Máxima
                                                            </div>
                                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colorSuccess500 }}>
                                                                70-85%
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: theme.textHintColor, marginTop: '4px' }}>
                                                                de carga
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col breakPoint={{ md: 4, xs: 12 }}>
                                                        <div style={{ padding: '16px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '14px', color: theme.textHintColor, marginBottom: '8px' }}>
                                                                Consumo em Marcha Lenta
                                                            </div>
                                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colorPrimary500 }}>
                                                                {engine.consumption && engine.consumption[0] ? engine.consumption[0].toFixed(1) : '0.0'} L/h
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: theme.textHintColor, marginTop: '4px' }}>
                                                                a 0% de carga
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col breakPoint={{ md: 4, xs: 12 }}>
                                                        <div style={{ padding: '16px', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '14px', color: theme.textHintColor, marginBottom: '8px' }}>
                                                                Consumo Máximo
                                                            </div>
                                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colorDanger500 }}>
                                                                {engine.consumption && engine.consumption[engine.consumption.length - 1] ? engine.consumption[engine.consumption.length - 1].toFixed(1) : '0.0'} L/h
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: theme.textHintColor, marginTop: '4px' }}>
                                                                a 100% de carga
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        ))
                    ) : (
                        <Row className="mt-4">
                            <Col breakPoint={{ md: 12, xs: 12 }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: theme.textHintColor
                                }}>
                                    <FormattedMessage
                                        id="select.machine.to.view.curve"
                                        defaultMessage="Selecione uma máquina e clique em Aplicar para visualizar a curva de consumo"
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                </LoadingCard>
            </CardBody>
        </Card>
    );
}

const mapStateToProps = (state) => ({
    enterprises: state.enterpriseFilter.enterprises,
    items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ConsumptionCurve);
