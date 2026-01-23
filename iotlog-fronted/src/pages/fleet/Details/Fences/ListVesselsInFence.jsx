import React from "react";
import { connect } from "react-redux";
import { SidebarBody } from "@paljs/ui/Sidebar";
import styled, { css } from "styled-components";
import cryptoJs from "crypto-js";
import { useIntl } from "react-intl";
import ReactCountryFlag from "react-country-flag";
import { Accordion, AccordionItem } from '@paljs/ui/Accordion'
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { SidebarStyled } from "../../Sidebar/SidebarStyled";
import { Fetch, TextSpan } from "../../../../components";
import { floatToStringExtendDot, getDifferenceDateAgo } from "../../../../components/Utils";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { getRouteIntegration, setRouteIntegration } from "../../../../actions";
import { Countries } from "../../../../components/Select/country/Countries";
import DownloadCSV from "./DownloadCSV";
import { setVesselsInFence } from "../../../../actions/fleet.action";

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
const ListItemStyled = styled.div`

  padding: 20px 25px;

  ${({ theme, isSelected }) => css`
  cursor: pointer;

  ${isSelected &&
    `background-color: ${theme.backgroundBasicColor3};
  `}

  &:hover {
    background-color: ${theme.backgroundBasicColor2};
  }`}
`

const Content = styled.div`
  .no-scroll-bar {
  overflow: hidden;
  box-shadow: none;
}

.expanded {
  max-height: none !important;
}
  `

const DivContent = styled.span`

  ${({ theme, status, noBorder = false }) => css`
    padding: 1px 4px;
    color: ${theme[`color${status}500`]};
    background-color: ${theme[`color${status}100`]};
    border-radius: 4px;
    font-size: 13px;
    flex-wrap: nowrap;

    svg {
      fill: ${theme[`color${status}700`]};
    }
  `}

  .span-title {
    font-size: 10px !important;
  }
`

const _atH_f = (a, y) => {
  try {
    return cryptoJs.AES.decrypt(
      a,
      `ec90093_${y}`
    ).toString(cryptoJs.enc.Utf8);
  } catch(e) {
    return "";
  }
};

const ListVesselsInFence = (props) => {

  const { code, type } = props;

  const intl = useIntl()

  const [vesselData, setVesselData] = React.useState()
  const [vesselsResultData, setVesselEncData] = React.useState({
    data: "",
    timestamp: 0
  })
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (code && type)
      fetchVesselsInFence(code, type?.replace('.', ''))

    return () => {
      setVesselData(undefined)
      props.setRouteIntegration({
        routeIntegration: [],
        vesselIntegration: undefined,
      })
      props.setVesselsInFence([])
    }
  }, [code, type])

  React.useEffect(() => {
    if (vesselsResultData?.data) {
      try {
        const data = JSON.parse(_atH_f(vesselsResultData.data, Number(vesselsResultData.timestamp)-1078))
        if (data?.vessels?.length && Array.isArray(data?.vessels)) {
          setVesselData(data)
          props.setVesselsInFence(data?.vessels)
        }
      }
      catch { }
    } else {
      setVesselData(undefined)
      props.setVesselsInFence([])
    }
  }, [vesselsResultData])

  const fetchVesselsInFence = (code, type) => {
    const timestamp = new Date().getTime()
    setIsLoading(true)
    Fetch.get(`/integrationthird/ais/port/${type}?code=${code}`, {
      headers: {
        timestamp
      }
    })
      .then(response => {
        if (response.data) {
          setVesselEncData({
            data: response.data,
            timestamp
          })
          setIsLoading(false)
          // props.setVesselsInFence(response.data?.vessels)
        }
      })
      .then(data => {
        setIsLoading(false)
      })
  }

  const onFetchTracking = (vessel) => {
    const isSelect = props.vesselIntegration?.imo === vessel?.imo
    if (isSelect) {
      props.setRouteIntegration({
        routeIntegration: [],
        vesselIntegration: undefined,
      })
      return
    }
    props.getRouteIntegration(vessel)
  }

  const vesselsSegments = vesselData?.vessels?.length
    ? [...new Set(vesselData
      ?.vessels
      ?.map(vessel => vessel?.vessel?.segment?.label)
    )]?.sort((a, b) => a.localeCompare(b))
    : []

  const onGetData = () => {
    return vesselsSegments?.flatMap((x, i) => {
      const vesselsOfThisSegment = vesselData
        ?.vessels
        ?.filter(vessel => vessel?.vessel?.segment?.label === x)
        ?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      return vesselsOfThisSegment?.map(({ vessel, timestamp }) => {
        return {
          type: x,
          imo: vessel?.imo,
          mmsi: vessel?.mmsi,
          name: vessel?.name,
          flag: vessel?.flag,
          dwt: vessel?.dwtSummer,
          teu: vessel?.teu,
          eta: vessel?.aisReport?.eta,
          sog: Number(vessel?.ais?.sog?.toFixed(1)),
          distance: Number(vessel?.distance?.toFixed(1)),
          lastAisUpdate: vessel?.ais?.lastSeen,
        }
      })
    })
  }

  return (
    <>
      <SidebarStyled width={24}
      >
        <SidebarBody>
          <RowBetween className="pl-3 pt-4 mt-2">
            <Col>
              <Row>
                <TextSpan aapparence="p2">
                  <FormattedMessage id="vessels" /></TextSpan>
                <TextSpan apparence="s1" className="ml-2"
                  style={{ textTransform: 'uppercase' }}>{type && <FormattedMessage id={type} />}
                  {` - ${code}`}
                </TextSpan>
              </Row>

              <TextSpan className="pb-2" apparence="p3" hint>
                {intl.formatMessage({ id: "updated.in" })} {moment().format("DD MMM, HH:mm")}
              </TextSpan>
            </Col>
            <DownloadCSV
              getData={onGetData}
              status="Basic"
              fileName={`vessels_${code}_${moment().format("DDMMYYYY_HHmm")}`}
              className="mr-4"
            />
          </RowBetween>

          {isLoading ?
            <>
              <div className="p-4">
                <SkeletonThemed height={15} count={4} />
              </div>
              <div className="p-4">
                <SkeletonThemed height={15} count={4} />
              </div>
              <div className="p-4">
                <SkeletonThemed height={15} count={4} />
              </div>
              <div className="p-4">
                <SkeletonThemed height={15} count={4} />
              </div>
            </>
            :
            <>
              <Content>
                <Accordion

                  className="no-scroll-bar"
                >
                  {vesselsSegments?.map((x, i) => {

                    const vesselsOfThisSegment = vesselData
                      ?.vessels
                      ?.filter(vessel => vessel?.vessel?.segment?.label === x)
                      ?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

                    return (
                      <AccordionItem
                        uniqueKey={i}
                        title={
                          <RowBetween>
                            <TextSpan apparence="p2" hint>
                              {x}
                            </TextSpan>
                            <TextSpan apparence="s2" className="mr-4 pr-1">
                              {vesselsOfThisSegment?.length}
                            </TextSpan>
                          </RowBetween>
                        }
                      >
                        {vesselsOfThisSegment?.map(({ vessel, timestamp }, index) => {
                          const codeFlag = Countries?.find(c => c.name?.toLowerCase() === vessel?.flag?.toLowerCase())?.code
                          return (<ListItemStyled key={index}
                            isSelected={props.vesselIntegration?.imo === vessel?.imo}
                            onClick={() => onFetchTracking(vessel)}
                            style={{
                              marginLeft: -18,
                              marginRight: -18,
                            }}
                          >
                            <Col>
                              <RowBetween>
                                <div>
                                  <ReactCountryFlag
                                    countryCode={codeFlag}
                                    svg
                                    style={{ marginTop: -3, fontSize: "1.2em", }}
                                  />
                                  <TextSpan apparence="s2" className="ml-1">
                                    {vessel?.name}
                                  </TextSpan>
                                </div>

                                {!!vessel?.aisReport?.eta && <TextSpan
                                  style={{ textWrap: "nowrap" }}
                                  apparence="s2" hint>
                                  <TextSpan apparence="p3">ETA</TextSpan> {moment(vessel?.aisReport?.eta).format("DD MMM, HH:mm")}
                                </TextSpan>}
                              </RowBetween>
                              <Row className="mt-2">
                                <TextSpan apparence="p3" hint>
                                  IMO {vessel?.imo}
                                </TextSpan>
                                <TextSpan apparence="p3" hint className="ml-3">
                                  MMSI {vessel?.mmsi}
                                </TextSpan>
                              </Row>
                              {vessel?.ais?.lastSeen && <Row className='m-0'>
                                <TextSpan apparence='p2' hint className="mr-4">
                                  {intl.formatMessage({ id: 'last.date.acronym' })}
                                  <TextSpan apparence='c2' hint className="ml-1">
                                    {vessel?.ais?.lastSeen
                                      ? getDifferenceDateAgo(new Date(vessel.ais?.lastSeen), intl)
                                      : ''}
                                  </TextSpan>
                                </TextSpan>
                              </Row>}
                              {vessel?.distance && <Row className='m-0'>
                                <TextSpan apparence='p2' hint className="mr-4">
                                  {intl.formatMessage({ id: 'distance' })}
                                  <TextSpan apparence='c2' hint className="ml-1">
                                    {`${vessel?.distance?.toFixed(2)} nm`}
                                  </TextSpan>
                                </TextSpan>
                              </Row>}
                              <Row between='xs' className="m-0 pt-2 pb-2">
                                {vessel?.dwtSummer && <DivContent
                                  status="Primary"
                                  className="mr-2"
                                >
                                  <span className="span-title">DWT:</span> {vessel?.dwtSummer}
                                </DivContent>}
                                {vessel?.teu && <DivContent
                                  status="Info"
                                  className="mr-2"
                                >
                                  <span className="span-title">TEU:</span> {vessel?.teu}
                                </DivContent>}
                                {!!vessel?.ais?.sog && <DivContent
                                  status="Warning"
                                >
                                  <span className="span-title">
                                    Knots:
                                  </span> {floatToStringExtendDot(vessel?.ais?.sog, 1)}
                                </DivContent>}
                              </Row>

                            </Col>
                          </ListItemStyled>
                          )
                        })}
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </Content> </>}
        </SidebarBody>
      </SidebarStyled>
    </>
  )
}

const mapStateToProps = (state) => ({
  vesselIntegration: state.fleet.vesselIntegration,
});

const mapDispatchToProps = (dispatch) => ({
  getRouteIntegration: (filter) => {
    dispatch(getRouteIntegration(filter));
  },
  setRouteIntegration: (data) => {
    dispatch(setRouteIntegration(data));
  },
  setVesselsInFence: (machines) => {
    dispatch(setVesselsInFence(machines));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVesselsInFence);
