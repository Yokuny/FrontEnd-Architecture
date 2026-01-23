import { EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { TH, THEAD, TR, TRH } from "../../../../components/Table";

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  .position-col-dynamic {
    justify-content: flex-end;
  }

  position: sticky;
  top: 0;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
}`

export default function TableHeader(props) {
  const { typeFuels, unit } = props;
  return (
    <>
      <TheadStyle>
        <TRH>
          <TH className="p-2">
            <TextSpan apparence="s1">
              <FormattedMessage id="code" /> / <FormattedMessage id="vessel" />
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="center">
            <TextSpan apparence="s1">
              <FormattedMessage id="source" />
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="center">
            <TextSpan apparence="s1">
              <FormattedMessage id="destiny.port" />
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="center">
            <TextSpan apparence="s1">
              <FormattedMessage id="duration" />
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="end">
            <TextSpan apparence="s1">
              <FormattedMessage id="speed.avg.acron" />
              <TextSpan apparence="p3"> kn</TextSpan>
            </TextSpan>
          </TH>
          <TH className="p-2">
            <Row className="position-col-dynamic" style={{ margin: 0 }}>
              {/* <LabelIcon
                // renderIcon={() => (
                //   <Route
                //     style={{
                //       height: 14,
                //       width: 14,
                //       fill: theme?.colorSuccess500,
                //     }}
                //   />
                // )}
                renderTitle={() => (
                  <TextSpan className="ml-1" apparence="s1">
                    <FormattedMessage id="distance" />
                    <TextSpan apparence="p3"> nm</TextSpan>
                  </TextSpan>
                )}
              /> */}
              <TextSpan className="ml-1" apparence="s1">
                <FormattedMessage id="distance" />
                <TextSpan apparence="p3"> nm</TextSpan>
              </TextSpan>
            </Row>
          </TH>
          {typeFuels?.map((x, i) => <TH key={`hedr-${i}`} className="p-2">
            <Row className="position-col-dynamic" style={{ margin: 0 }}>
              <LabelIcon
                renderIcon={() => (
                  <EvaIcon
                    name={"droplet"}
                    className="mt-1"
                    options={{
                      height: 17,
                      width: 16,
                      fill: x.color
                    }}
                  />
                )}
                renderTitle={() => <TextSpan apparence="s1">
                  {x.code}
                  <TextSpan apparence="p3"> {unit}</TextSpan>
                </TextSpan>}
              />
            </Row>
          </TH>)}
          {/*/// <TH className="p-2">
        //   <Row className="position-col-dynamic" style={{ margin: 0 }}>
        //     <LabelIcon
        //       renderIcon={() => (
        //         <OilMoney
        //           style={{
        //             height: 15,
        //             width: 15,
        //             fill: theme?.colorInfo600,
        //             color: theme?.colorInfo600,
        //           }}
        //         />
        //       )}
        //       renderTitle={() => (
        //         <TextSpan apparence="s1" className="ml-1">
        //           <FormattedMessage id="average" /> MDO
        //         </TextSpan>
        //       )}
        //     />
        //   </Row>
        // </TH>
                  */}
        </TRH>
      </TheadStyle>
    </>
  );
}
