import React from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import CIIService from "../../../../components/cii/CIIService";
import { Fetch, LabelIcon, TextSpan } from "../../../../components";
import { SkeletonThemed } from "../../../../components/Skeleton";
import InputWhatsapp from "../../../../components/Inputs/InputWhatsapp";
import { Vessel } from "../../../../components/Icons";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";

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

const DataTable = styled.div`
  max-height: 145px;
  overflow-y: auto;

  ${({ theme }) => css`
    ::-webkit-scrollbar-thumb {
      background: ${theme.scrollbarColor};
      cursor: pointer;
    }
    ::-webkit-scrollbar-track {
      background: ${theme.scrollbarBackgroundColor};
    }
    ::-webkit-scrollbar {
    width: ${theme.scrollbarWidth};
    height: ${theme.scrollbarWidth};
    }

    .form-control  {
      font-size: 13px;
      color: ${theme.textBasicColor} !important;
      cursor: pointer;
    }
  `}

  .react-tel-input .form-control {
    background-color: transparent !important;
    border: none;
  }

  .react-tel-input .flag-dropdown {
    background-color: transparent !important;
    border: none;
  }


`

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
      th {
        background-color: ${theme.backgroundBasicColor1};
      }
    `}

  .position-col-dynamic {
    justify-content: center;
  }

  /* position: sticky;
  top: 0; */

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

const InfoContactFooter = (props) => {

  const { machineDetails } = props;
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    if (machineDetails?.machine?.id)
      getData(machineDetails?.machine?.id)
  }, [machineDetails?.machine?.id])

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/machine/contacts?id=${idMachine}`
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
                <LabelIcon
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
                  title={`${intl.formatMessage({ id: 'vessel' })}`} />
                <TextSpan apparence="s2">
                  {`${data?.name} ${data?.code ? `/ ${data?.code}` : ''}`}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon iconName="person-outline" title={`${intl.formatMessage({ id: 'management.person' })}`} />
                <TextSpan apparence="s2">
                  {data?.dataSheet?.managementName ?? "-"}
                </TextSpan>
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon iconName="phone-outline" title={`${intl.formatMessage({ id: 'contacts' })}`} />
                <DataTable>
                  <TABLE>
                    <TheadStyle>
                      <TRH>
                        <TH>
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="name" />
                          </TextSpan>
                        </TH>
                        <TH>
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="phone" />
                          </TextSpan>
                        </TH>
                      </TRH>
                    </TheadStyle>
                    <TBODY>
                      {data?.contacts?.map((x, i) => <TR key={i}>
                        <TD>
                          <TextSpan apparence="s2">
                            {x.name}
                          </TextSpan>
                        </TD>
                        <TD>
                          <InputWhatsapp
                            value={x.phone}
                            onChange={(value) => { }}
                            disableDropdown
                            disabled
                          />
                        </TD>
                      </TR>)}
                    </TBODY>
                  </TABLE>
                </DataTable>
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

export default InfoContactFooter;
