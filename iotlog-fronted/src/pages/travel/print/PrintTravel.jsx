import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import { getEstimatedAndReal } from "../kpis/dashboard/Utils";
import { floatToStringExtendDot } from "../../../components/Utils";
import { SpinnerStyled } from "../../../components/Inputs/ContainerRow";
import { Vessel } from "../../../components/Icons";
import { LabelIcon, TextSpan } from "../../../components";
import Fetch from "../../../components/Fetch/Fetch";
import ListItinerary from "../add/ListItinerary";
import { datesVoyage } from "../add/AddTravel";
import moment from "moment";

const Img = styled.img`
  height: 100px;
  width: 100px;
  object-fit: contain;
`

const ContentRow = styled(Row)`
  width: 100%;
  margin-top: -20px;
  button {
   display: none !important;
  }
`

const PrintTravel = (props) => {

  const [showPrint, setShowPrint] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const [data, setData] = React.useState(null);


  const showRef = React.useRef(false);

  const [searchParams] = useSearchParams();
  const theme = useTheme();

  const idEnterprise = searchParams.get("idEnterprise") || localStorage.getItem('id_enterprise_filter');


  React.useEffect(() => {
    if (data && !isLoading && !showRef.current) {
      window.print();
      showRef.current = true;
      setShowPrint(true);
    }
  }, [data, isLoading])

  React.useEffect(() => {
    getData()
  }, [])

  function breakDateTime(dateTimeString) {
    if (!dateTimeString) {
      return { date: "", time: "" };
    }
    const dateTime = moment(dateTimeString);
    const date = dateTime.format("YYYY-MM-DD");
    const time = dateTime.format("HH:mm");

    return { date, time };
  }

  const getItineraries = (itinerary) => {
    return itinerary?.map((itineraryItem) => {
      const itineraryToAdd = {
        idFence: itineraryItem?.idFence,
        where: itineraryItem?.where,
        load: itineraryItem?.load,
        listObservations: itineraryItem?.listObservations || [],
      };
      datesVoyage.forEach((dateField) => {
        if (itineraryItem[dateField]) {
          const { date, time } = breakDateTime(itineraryItem[dateField]);
          itineraryToAdd[`${dateField}Date`] = date;
          itineraryToAdd[`${dateField}Time`] = time;
          itineraryToAdd[dateField] = itineraryItem[dateField];
        }
      });
      return itineraryToAdd;
    });
  }

  const getData = async () => {
    setIsLoading(true)
    try {
      const responseEnterprise = await Fetch.get(`/enterprise/find?id=${idEnterprise}`)
      const responseVoyage = await Fetch.get(`/travel/manual-voyage/${searchParams.get("id")}`)
      let responseMachine;
      if (responseVoyage.data?.idMachine) {
        responseMachine = await Fetch.get(`/machine/datasheet?id=${responseVoyage.data?.idMachine}`)
      }
      setData({
        enterprise: responseEnterprise.data,
        voyage: {
          ...(responseVoyage.data || {}),
          itinerary: getItineraries(responseVoyage.data?.itinerary || []),
        },
        machine: responseMachine?.data
      })
      setIsLoading(false)
    }
    catch (error) {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <>
      <SpinnerStyled size="Giant" />
    </>
  }


  const estimatedData = getEstimatedAndReal(data.voyage);

  return (<>
    <ContentRow middle="xs" style={{
      display: !showPrint ? 'flex' : 'none',
    }}>
      <Col breakPoint={{ xs: 4, md: 4 }}>
        <Row className="ml-0" start="xs" middle="xs">
          <Img
            src={data?.enterprise?.image?.url}
            alt={data?.enterprise?.name}
          />
        </Row>
      </Col>
      <Col breakPoint={{ xs: 4, md: 4 }}>
        <Row center="xs">
          <TextSpan apparence="s1">{data?.voyage?.machine?.name}</TextSpan>
        </Row>
        <Row center="xs">
          <TextSpan apparence="p2" hint>{data?.voyage?.customer?.label}</TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ xs: 4, md: 4 }}>
        <Row end="xs">
          <TextSpan apparence="s2">{data?.voyage?.code}</TextSpan>
        </Row>
      </Col>

      <Col breakPoint={{ xs: 12, md: 12 }}>
        <LabelIcon
          title={<FormattedMessage id="vessel" />}
          renderIcon={() => <Vessel
            style={{
              height: 13,
              width: 13,
              color: theme.textHintColor,
              marginRight: 5,
              marginTop: 2,
              marginBottom: 2,
            }}
          />}
        />
        <Row>
          <Col breakPoint={{ xs: 3, md: 3 }}>
            <LabelIcon
              title={"DWT"}
            />
            <TextSpan apparence="s2">
              {data?.machine?.dataSheet?.deadWeight ? floatToStringExtendDot(data?.machine?.dataSheet?.deadWeight, 0) : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ xs: 3, md: 3 }}>
            <LabelIcon
              title={"Gross tonnage"}
            />
            <TextSpan apparence="s2">
              {data?.machine?.dataSheet?.grossTonnage ? floatToStringExtendDot(data?.machine?.dataSheet?.grossTonnage, 0) : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ xs: 3, md: 3 }}>
            <LabelIcon
              title={"LOA"}
            />
            <TextSpan apparence="s2">
              {data?.machine?.dataSheet?.lengthLoa ? `${floatToStringExtendDot(data?.machine?.dataSheet?.lengthLoa, 0)} m` : "-"}
            </TextSpan>
          </Col>
          <Col breakPoint={{ xs: 3, md: 3 }}>
            <LabelIcon
              title={<FormattedMessage id="width" />}
            />
            <TextSpan apparence="s2">
              {data?.machine?.dataSheet?.width ? `${floatToStringExtendDot(data?.machine?.dataSheet?.width, 0)} m` : "-"}
            </TextSpan>
          </Col>
        </Row>
      </Col>

      <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4 mb-4">
        <Row center="xs" className="ml-0">
          <ListItinerary
            formData={data?.voyage}
            key={nanoid(5)}
            onChange={() => { }}
            idEnterprise={idEnterprise}
            isPrinter={true}
          />
        </Row>
      </Col>
      {!!data?.voyage?.activity && <Col breakPoint={{ xs: 6, md: 6 }}>
        <LabelIcon
          title={<FormattedMessage id="activity" />}
        />
        <TextSpan apparence="s2">
          {data?.voyage?.activity}
        </TextSpan>
      </Col>}
      <Col breakPoint={{ xs: 2, md: 2 }}>
        <LabelIcon
          title={<FormattedMessage id="estimated" />}
        />
        {!estimatedData?.estimatedTotal ?
          <TextSpan apparence="s2">-</TextSpan>
          : <TextSpan apparence="s2">
            {floatToStringExtendDot(estimatedData?.estimatedTotal, 1)} <FormattedMessage id="days" />
          </TextSpan>}
      </Col>
      <Col breakPoint={{ xs: 2, md: 2 }}>
        <LabelIcon
          title={<FormattedMessage id="real" />}
        />
        {!estimatedData?.realTotal
          ? <TextSpan apparence="s2">
            -
          </TextSpan>
          : <TextSpan apparence="s2">
            {floatToStringExtendDot(estimatedData?.realTotal, 1)} <FormattedMessage id="days" />
          </TextSpan>}
      </Col>
      <Col breakPoint={{ xs: 2, md: 2 }}>
        <LabelIcon
          title={<FormattedMessage id="goal" />}
        />
        <TextSpan apparence="s2">
          {floatToStringExtendDot(data?.voyage?.goal, 1)} <FormattedMessage id="days" />
        </TextSpan>
      </Col>
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <Row center="xs" className="mt-4">
          <TextSpan apparence="p3" hint>{new Date().getFullYear()} © IoTLog powered Bykonz</TextSpan>
        </Row>
      </Col>
    </ContentRow>
  </>)
}

export default PrintTravel;
