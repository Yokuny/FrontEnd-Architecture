import React from 'react'
import moment from 'moment'
import styled, { useTheme } from 'styled-components'
import { Wave, Wind } from '../../../../components/Icons'
import { Fetch, TextSpan } from '../../../../components'
import { EvaIcon } from '@paljs/ui'
import { floatToStringExtendDot } from '../../../../components/Utils'
import { SkeletonThemed } from '../../../../components/Skeleton'


const DivIcons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const DivBg = styled.div`
  background-color: ${props => props.theme[`color${props.status}500`]}10;
  border-radius: 4px;
  //border: 1px solid ${props => props.theme[`color${props.status}200`]};
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default function WeatherPanel(props) {

  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState()

  const theme = useTheme();

  React.useEffect(() => {
    if (!!props.latitude && !!props.longitude)
      getData(props.latitude, props.longitude)
  }, [props.latitude, props.longitude])

  const getData = (latitude, longitude) => {
    setIsLoading(true)
    Fetch
      .get(`/integrationthird/weathermarine?latitude=${latitude}&longitude=${longitude}`)
      .then(res => {
        setData(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
      })
  }

  const getOceanData = () => {
    if (data?.marine?.hourly?.time) {
      const dateNow = moment().format('YYYY-MM-DDTHH:00')
      const index = data?.marine?.hourly?.time?.findIndex(time => dateNow === time)
      if (index !== -1) {
        return {
          direction: data?.marine?.hourly?.wave_direction[index],
          height: data?.marine?.hourly?.wave_height[index],
          period: data?.marine?.hourly?.wave_period[index],
          units: {
            direction: data?.marine?.hourly_units?.wave_direction,
            height: data?.marine?.hourly_units?.wave_height,
            period: data?.marine?.hourly_units?.wave_period,
          }
        }
      }
    }
  }

  const getWeatherData = () => {
    if (data?.weather?.hourly?.time) {
      const dateNow = moment().format('YYYY-MM-DDTHH:00')
      const index = data?.weather?.hourly?.time?.findIndex(time => dateNow === time)
      if (index !== -1) {
        return {
          precipitation: data?.weather?.hourly?.precipitation[index],
          temperature_80m: data?.weather?.hourly?.temperature_80m[index],
          winddirection_10m: data?.weather?.hourly?.winddirection_10m[index],
          windspeed_10m: data?.weather?.hourly?.windspeed_10m[index],
          units: {
            precipitation: data?.weather?.hourly_units?.precipitation,
            temperature_80m: data?.weather?.hourly_units?.temperature_80m,
            winddirection_10m: data?.weather?.hourly_units?.winddirection_10m,
            windspeed_10m: data?.weather?.hourly_units?.windspeed_10m,
          }
        }
      }
    }
  }

  const oceanData = getOceanData()
  const weatherData = getWeatherData()

  if (isLoading) return (<>
    <>
      <div className="mt-3">
        <SkeletonThemed height={15} count={4} />
      </div>
    </>
  </>
  )

  if (!oceanData || !weatherData) return <></>

  return (<>
    <DivIcons className='mt-4 pt-2 pb-2'>

      <DivBg theme={theme} status="Info">
        <Wave
          style={{ height: 19, width: 19, fill: theme.colorPrimary500 }}
        />

        <TextSpan
          status='Primary'
          className="ml-2"
          apparence='s2'>{floatToStringExtendDot(oceanData?.height, 1)}<TextSpan
            status='Primary'
            apparence='p3'>{oceanData?.units?.height}</TextSpan></TextSpan>
        <TextSpan
          className="ml-2"
          status='Primary'
          apparence='s2'>{floatToStringExtendDot(oceanData?.period, 1)}<TextSpan
            status='Primary'
            apparence='p3'>{oceanData?.units?.period}</TextSpan></TextSpan>

        <Row className="ml-2">

          <TextSpan
            status='Primary'
            apparence='s2'>{floatToStringExtendDot(oceanData?.direction, 0)}{oceanData?.units?.direction}</TextSpan>
          <div style={{ transform: `rotate(${weatherData?.winddirection_10m - 90}deg)` }}>
            <EvaIcon
              name="arrow-back-outline"
              status='Primary'
            />
          </div>
        </Row>
      </DivBg>


      <DivBg theme={theme} status="Warning" className="mt-4">
        <Wind
          style={{ height: 17, width: 17, fill: theme.colorWarning500 }}
        />

        <TextSpan status="Warning" apparence='s2' className="ml-2">{floatToStringExtendDot(weatherData?.windspeed_10m, 1)}<TextSpan apparence='p3'>{weatherData?.units?.windspeed_10m}</TextSpan></TextSpan>

        <TextSpan status="Warning" apparence='s2' className="ml-2">{floatToStringExtendDot(weatherData?.temperature_80m, 1)}<TextSpan apparence='p3'>{weatherData?.units?.temperature_80m}</TextSpan></TextSpan>
        <Row className="ml-2">
          <TextSpan status="Warning" apparence='s2'>{floatToStringExtendDot(weatherData?.winddirection_10m, 0)}{weatherData?.units?.winddirection_10m}</TextSpan>
          <div style={{ transform: `rotate(${weatherData?.winddirection_10m - 90}deg)` }}>
            <EvaIcon
              name="arrow-back-outline"
              status='Warning'
            />
          </div>
        </Row>
      </DivBg>
    </DivIcons>
  </>)
}
