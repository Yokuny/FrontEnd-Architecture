import React from "react";
import { Button, EvaIcon, Row } from "@paljs/ui";
import styled, { css } from "styled-components";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { SkeletonThemed } from "../../../components/Skeleton";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../../components/Table';
import { Fetch, LabelIcon, TextSpan } from "../../../components";

const Content = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}

  height: 250px;
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
  bottom: 153px;
  right: 5px;
  position: absolute;
  padding: 2px;
`


const CrewFooter = (props) => {

  const { machineDetails } = props;

  const [crew, setCrew] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (machineDetails?.machine?.id) {
      getData(machineDetails?.machine?.id);
    }
  }, [machineDetails]);

  const getData = () => {
    setLoading(true);
    const idEnterprise = localStorage.getItem("id_enterprise_filter");
    Fetch.get(`/crew?idMachine=${machineDetails?.machine?.id}&idEnterprise=${idEnterprise}`)
      .then((res) => {
        setCrew(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Content>
        {loading
          ? <>
            <SkeletonThemed height={40} />
            <div className="mt-1"></div>
            <SkeletonThemed />
            <div className="mt-1"></div>
            <SkeletonThemed height={30} />
          </>
          : <>

            {!!crew && <>
              <Row className="m-0 pl-2" middle="xs">
                <LabelIcon iconName="people-outline" title={<FormattedMessage id="total.on.board" />} />
                <TextSpan className="ml-2" apparence="s1">{crew?.totalOnBoard}</TextSpan>
              </Row>
            </>}
            <TABLE>
              <THEAD>
                <TRH>
                  <TH>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="name" />
                    </TextSpan>
                  </TH>
                  <TH>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="boarding" />
                    </TextSpan>
                  </TH>
                  <TH>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="landing" />
                    </TextSpan>
                  </TH>
                </TRH>
              </THEAD>
              <TBODY>
                {crew?.people?.map((x, i) => <TR key={i} isEvenColor={i % 2 === 0}>
                  <TD>
                    <TextSpan apparence="c1">{x.name}</TextSpan>
                  </TD>
                  <TD>
                    <TextSpan apparence="c1">{moment(x.boarding).format("DD MMM YYYY")}</TextSpan>
                  </TD>
                  <TD>
                    <TextSpan apparence="c1">{moment(x.landing).format("DD MMM YYYY")}</TextSpan>
                  </TD>
                </TR>)}
                {!crew &&
                  <TR>
                    <TD colspan="3">
                      <TextSpan apparence="c1">
                        <FormattedMessage id="crew.empty" />
                      </TextSpan>
                    </TD>
                  </TR>
                }
              </TBODY>
            </TABLE>


            <ButtonClosed
              size="Tiny"
              status="Danger"
              onClick={props.onClose}
            >
              <EvaIcon name="close-outline" />
            </ButtonClosed>
          </>}
      </Content>
    </>
  );
};

export default CrewFooter;
