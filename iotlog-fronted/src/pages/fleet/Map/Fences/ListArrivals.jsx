import React from 'react'
import { Fetch, LabelIcon, TextSpan } from "../../../../components";
import moment from 'moment';
import { Col, Row } from '@paljs/ui';
import ReactCountryFlag from 'react-country-flag';
import { SkeletonThemed } from '../../../../components/Skeleton';

const ListArrivals = (props) => {

  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.dataFence)
      getData(props.dataFence);
  }, [props.dataFence])

  const getData = (filter) => {
    setIsLoading(true);
    let url = `/integrationthird/ports/arrivals?code=${filter.code?.toUpperCase()?.replaceAll(' ', '').replaceAll('-', '').slice(0, 5)}`;
    Fetch.get(url)
      .then((res) => {
        setData(res.data || []);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading && <div className='mt-4 flex-col-center'>
          <SkeletonThemed width={150}  />
          <SkeletonThemed width={150}  />
          <SkeletonThemed width={150}  />
        </div>}
      {!isLoading && !!data?.length &&
        <div style={{ minWidth: 350 }}>
          <div className='mt-4 mb-2 ml-2'>
            <LabelIcon
              iconName='clock-outline'
              title={`Chegadas planejadas GMT (${parseInt(moment().format("Z").split(":")[0]) || 'UTC'})`}
            />
          </div>
          {data?.map((x, i) => (
            <Row key={`a-r-${i}`} between='xs' className='m-0 pb-1'>
              <Col breakPoint={{ md: 6 }}>
                {!!x.vessel?.datasheet?.flagCountryCode && <ReactCountryFlag
                  countryCode={x.vessel?.datasheet?.flagCountryCode}
                  svg
                  style={{ marginTop: -3, fontSize: "1.5em", }}
                />}
                <TextSpan className="ml-1" apparence="s2">{x.vessel?.identity?.name}</TextSpan>
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <TextSpan apparence="s2" hint>{x.eta ? moment(x.eta * 1000).format("DD MMM HH:mm") : '-'}</TextSpan>
              </Col>
            </Row>

          ))}
        </div>}
    </>
  )
}

export default ListArrivals;
