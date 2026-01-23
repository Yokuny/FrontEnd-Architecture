import React from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { css } from "styled-components";
import { Fetch, LabelIcon, TextSpan } from "../../../components";
import { SkeletonThemed } from "../../../components/Skeleton";
import { useIntl } from "react-intl";
import ReactCountryFlag from "react-country-flag";
import { floatToStringBrazilian } from "../../../components/Utils";
import CIIService from "../../../components/cii/CIIService";
import moment from "moment";

const Content = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}

  height: 255px;
  width: 100%;
  padding: 10px;

  .rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const ButtonClosed = styled(Button)`
  bottom: 150px;
  right: 5px;
  position: absolute;
  padding: 2px;
`


const InfoFooter = (props) => {

  const { machineDetails } = props;
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (machineDetails?.machine?.id)
      getData(machineDetails?.machine?.id)
  }, [machineDetails?.machine?.id])

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/machine/datasheet?id=${idMachine}`
    )
      .then((response) => {
        setData(response.data)
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const ciiReference = !!data?.dataSheet?.typeVesselCIIReference
  ? CIIService.calculateCIIReference({
    typeVessel: data?.dataSheet?.typeVesselCIIReference,
    dwt: data?.dataSheet?.deadWeight,
    grossTonage: data?.dataSheet?.grossTonnage
  })
  : null;

  return (
    <>
      <Content>
        {isLoading
          ? <><Row className="m-0">
            <SkeletonThemed width={250} height={30} className="ml-2" />
            <SkeletonThemed width={50} height={30} className="ml-2" />
            <SkeletonThemed width={100} height={30} className="ml-2" />
            <SkeletonThemed width={40} height={30} className="ml-2" />
          </Row>
            <Row className="m-0 mt-3">
              <SkeletonThemed width={250} height={30} className="ml-2" />
              <SkeletonThemed width={50} height={30} className="ml-2" />
              <SkeletonThemed width={100} height={30} className="ml-2" />
              <SkeletonThemed width={40} height={30} className="ml-2" />
            </Row>
            <Row className="m-0  mt-3">
              <SkeletonThemed width={250} height={30} className="ml-2" />
              <SkeletonThemed width={50} height={30} className="ml-2" />
              <SkeletonThemed width={100} height={30} className="ml-2" />
              <SkeletonThemed width={40} height={30} className="ml-2" />
            </Row>
          </>
          : <>
            <Row className="m-0">
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon title={`${intl.formatMessage({ id: 'name' })}`} />
                <TextSpan apparence="s2">
                  {data?.name}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={`${intl.formatMessage({ id: 'code' })}`} />
                <TextSpan apparence="s2">
                  {data?.code ?? "-"}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={`IMO`} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.imo}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={`MMSI`} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.mmsi}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'type' })} />
                <TextSpan apparence="s2">
                  {data?.modelMachine?.description ?? "-"}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'length.loa' })} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.lengthLoa ? `${data?.dataSheet?.lengthLoa}m` : '-'}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'width.vessel' })} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.width ? `${data?.dataSheet?.width}m` : '-'}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={`Dead weight`} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.deadWeight}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={`Gross Tonnage`} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.grossTonnage}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'year.build' })} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.yearBuilt ?? '-'}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'flag' })} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.flag ?
                    <><ReactCountryFlag
                      countryCode={data?.dataSheet?.flag}
                      svg
                      style={{ marginLeft: 3, marginRight: 3, marginTop: -3, fontSize: "1.4em", borderRadius: 4 }}
                    />
                      {data?.dataSheet?.flag}
                    </> : <>-</>}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={'CII Reference'} />
                <TextSpan apparence="s2">
                  {ciiReference !== null ? floatToStringBrazilian(ciiReference, 4)  : '-'}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-2">
                <LabelIcon title={intl.formatMessage({ id: 'create.at' })} />
                <TextSpan apparence="s2">
                  {moment(data?.createAt).format("DD MMM yyyy")}
                </TextSpan>
              </Col>
            </Row>
          </>
        }

        <ButtonClosed
          size="Tiny"
          status="Danger"
          onClick={props.onClose}
        >
          <EvaIcon name="close-outline" />
        </ButtonClosed>
      </Content>
    </>
  );
};

export default InfoFooter;
