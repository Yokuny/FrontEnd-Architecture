import React from "react";
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts'
import * as Sentry from '@sentry/react';
import {
  CanvasRenderer,
} from 'echarts/renderers';
import {
  TooltipComponent,
} from 'echarts/components';
import TextSpan from "../../../../Text/TextSpan";
import { useTheme } from "styled-components";
import { ContentChart } from "../../../Utils";
import { getColorConditionList } from "../../../Utils/TriggerCondition";


function isFunctionSafe(funcStr) {
  const forbiddenPatterns = [
    /eval\(/,
    /window\./,
    /document\./,
    /fetch\(/,
    /XMLHttpRequest/,
    /localStorage/,
    /process\./,
    /require\(/,
    /[\s](for|while|import|export|delete|debugger|with)[\s(]/,
  ];

  return !forbiddenPatterns.some(pattern => pattern.test(funcStr));
}

export const onExecFunction = (value, functionString, data) => {
  if (!functionString) return undefined;
  try {
    const isSafe = isFunctionSafe(functionString);
    if (!isSafe) {
      if (process.env.REACT_APP_SENTRY_DSN) {
        Sentry.captureException(`Function not safe on dashboard ${data.id}: ${functionString}`);
      }
      return 0;
    }

    const valueExec = eval(functionString.replace(`value`, value))();
    return valueExec;
  } catch (e) {
    return 0;
  }
}

const RadialGaugeChart = ({
  value,
  title,
  description,
  data,
  onClick = undefined,
}) => {

  const divBoxRef = React.useRef();
  const [heigth, setHeight] = React.useState()

  React.useEffect(() => {
    if (divBoxRef.current?.offsetHeight) {
      setHeight(divBoxRef.current.offsetHeight)
    }
  }, [divBoxRef?.current?.offsetHeight]);

  const theme = useTheme();

  const maxvalue = parseInt(data?.maxValue ?? 0);


  const isGiant = !!(heigth > 200);

  const normalizeValue = () => {
    const valueToNormalize = data?.funcTakeData
    ? onExecFunction(value, data?.funcTakeData, data)
    : value;
    if (data?.sizeDecimal === 0 || data?.sizeDecimal > 0) {
      return parseFloat((valueToNormalize ?? 0).toFixed(data?.sizeDecimal))
    }
    return valueToNormalize ? parseFloat((valueToNormalize ?? 0).toFixed(1)) : 0
  }

  const valueNormalized = normalizeValue();
  let color = getColorConditionList(data?.colorsConditions, valueNormalized, "");

  const getOption = () => {
    return {
      tooltip: {
        formatter: `${title} <br/><strong>{c}</strong> ${description}`,
        textStyle: {
          fontFamily: theme.fontFamilyPrimary,
          color: theme.textBasicColor,
        },
      },
      textStyle: {
        fontFamily: theme.fontFamilyPrimary
      },
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            overlap: false
          },
          axisLine: {
            lineStyle: {
              width: isGiant ? 12 : 6,
            },
          },
          itemStyle: {
            color: color
          },
          axisTick: {
            show: true,
            splitNumber: 2,
            length: 1,
            distance: 6,
          },
          splitLine: {
            length: 0,
            distance: 7,
            lineStyle: {
              color: theme.textHintColor,
              width: 1,
            },
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',

          },
          axisLabel: {
            distance: isGiant ? 15 : 10,
            color: theme.textBasicColor,
            fontSize: isGiant ? '1em' : '0.75em',
            fontWeight: '500'
          },
          detail: {
            valueAnimation: true,
            formatter: `{value}`,
            offsetCenter: [0,'82%'],
            fontSize: '1.2rem',
            color: theme.textBasicColor,

          },
          data: [
            {
              value: valueNormalized,
              name: `${description}`
            }
          ],
          title: {
            offsetCenter: [0,'23%'],
            fontSize: '0.5rem',
            color: theme.textHintColor,
          },
          max: maxvalue,
          splitNumber: data?.split ? Number(data.split) : 4,
          radius: '91%'
        }
      ]
    }
  }

  echarts.use([TooltipComponent, GaugeChart, CanvasRenderer])

  return (
    <ContentChart className="card-shadow" onClick={onClick} ref={divBoxRef}>
      <TextSpan apparence="p3" hint className="mt-1">
        {title || ""}
      </TextSpan>
     <ReactEChartsCore
        echarts={echarts}
        option={getOption()}
        style={{ height: '100%', width: '100%' }}
      />
    </ContentChart>
  );
};

export default RadialGaugeChart;
