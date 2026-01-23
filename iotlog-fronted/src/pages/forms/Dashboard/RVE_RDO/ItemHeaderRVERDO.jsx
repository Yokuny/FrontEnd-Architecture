import { CardHeader } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";
import Tooltip from "@paljs/ui/Tooltip";
import { FormattedMessage } from "react-intl";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { Button } from "@paljs/ui/Button";
import { TextSpan } from "../../../../components";

const Img = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
`

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  background-color: ${({ theme, status }) => `${theme[`color${status}500`]}15`}
`

export default function ItemHeaderRVERDO(props) {

  const { asset, data, isOpen, setIsOpen, showInoperabilities, unit } = props;

  const estimatedTotal = data?.length
    ? data.reduce((acc, b) => {
      let estimated = (b.consumptionEstimated || 0)

      const hasInoperations = !showInoperabilities && b.operations?.some(x => x.code?.slice(0, 2) === "IN")
      if (hasInoperations) {
        estimated = b.operations
          .filter(x => x.code?.slice(0, 2) !== "IN")
          .reduce((accIntern, operation) => accIntern + (estimated / (24 / operation.diffInHours)), 0)
      }

      return acc + estimated
    }, 0)
    : 0

  const maxTotal = data?.length
    ? data.reduce((acc, b) =>
      acc +
      b
        .operations
        .reduce((accIntern, operation) =>
          accIntern + (operation?.consumptionDailyContract
            ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
            : 0)
          , 0)
      , 0)
    : 0

  // maxTotal apenas dos dias que possuem lançamento de estimado (para cálculo do percentual)
  const maxTotalWithEstimated = data?.length
    ? data
      .filter(b => b.consumptionEstimated !== null && b.consumptionEstimated !== undefined)
      .reduce((acc, b) =>
        acc +
        b
          .operations
          .reduce((accIntern, operation) =>
            accIntern + (operation?.consumptionDailyContract
              ? ((operation?.consumptionDailyContract / 24) * operation?.diffInHours)
              : 0)
            , 0)
        , 0)
    : 0

  const hasEstimatedNull = data?.some(item =>
    item.consumptionEstimated === null ||
    item.consumptionEstimated === undefined
  )

  return <CardHeader>
    <Row className="m-0" middle="xs" between="xs">
      <Row className="m-0" middle="xs">
        <Img src={asset
          ?.image
          ?.url} alt={asset.name} />
        <TextSpan apparence="s1" className="ml-3">
          {asset.name}
        </TextSpan>
      </Row>
      <Row className="m-0" middle="xs">
        {hasEstimatedNull &&
          <>
            <EvaIcon
              name="alert-circle"
              status="Warning"
              className="mr-1"
              options={{
                animation: {
                  type: "pulse",
                  infinite: true,
                  hover: false,
                },
              }}
            />
            <TextSpan apparence="s3"
              className="mr-4"
              style={{ textTransform: "uppercase" }}
              status="Warning">
              <FormattedMessage id="null.consumption.estimated" />
            </TextSpan>
          </>
        }
        {maxTotal < estimatedTotal &&
          <>
            <EvaIcon
              name="alert-circle"
              status="Danger"
              className="mr-1"
              options={{
                animation: {
                  type: "pulse",
                  infinite: true,
                  hover: false,
                },
              }}
            />
            <TextSpan apparence="s3"
              className="mr-1"
              style={{ textTransform: "uppercase" }}
              status="Danger">
              <FormattedMessage id="consumption.exceeded" />
            </TextSpan>
            <TextSpan apparence="s2"
              className="mr-4"
              status="Danger">
              ({floatToStringExtendDot(unit === 'm³' ? maxTotal : maxTotal * 1000, 3)} {unit})
            </TextSpan>
          </>
        }
        <InfoCard status="Basic" className="ml-4">
          <TextSpan apparence="p3" style={{ fontSize: '0.65rem' }} hint>
            <FormattedMessage id="consumption.max" />
          </TextSpan>
          <TextSpan apparence="s2" style={{
            width: '100%',
            fontSize: '0.85rem', textAlign: 'right'
          }}>
            {floatToStringExtendDot(unit === 'm³' ? maxTotal : maxTotal * 1000, 3)}
            <TextSpan apparence="p3" hint className="ml-1">
              {unit}
            </TextSpan>
          </TextSpan>
        </InfoCard>
        <InfoCard status={"Primary"} className="ml-4">
          <TextSpan apparence="p3" style={{ fontSize: '0.65rem' }} hint>
            <FormattedMessage id="consumption" /> <FormattedMessage id="pointed" />
          </TextSpan>
          <TextSpan apparence="s2" style={{ width: '100%', fontSize: '0.85rem', textAlign: 'right' }}>
            {floatToStringExtendDot(unit === 'm³' ? estimatedTotal : estimatedTotal * 1000, 3)}
            <TextSpan apparence="p3" hint className="ml-1">
              {unit}
            </TextSpan>
          </TextSpan>
        </InfoCard>

        <Tooltip
          trigger="hover"
          placement="top"
          status="Basic"
          content={<>
            <TextSpan apparence="p2">
              <FormattedMessage id="diff" />:
              <TextSpan apparence="s2" className="ml-1">
                {floatToStringExtendDot(unit === 'm³' ? estimatedTotal - maxTotal : (estimatedTotal - maxTotal) * 1000, 3)}
              </TextSpan> {unit}
            </TextSpan>
          </>}
        >
          <Button
            appearance="ghost"
            style={{ border: 0, padding: `0.4rem 0.6rem`, width: '100px' }}
            className="mr-2 ml-4 flex-between"
            status={!estimatedTotal ? "Basic" : estimatedTotal <= maxTotal ? "Success" : "Danger"}
            onClick={() => { }}
          >
            <EvaIcon name={
              !estimatedTotal ? "alert-circle-outline" : estimatedTotal <= maxTotal ? "checkmark-circle-2-outline" : "trending-up-outline"
            }
              className="mr-2"
            />
            <TextSpan apparence="s2" className="ml-1">
              {floatToStringExtendDot(estimatedTotal ? 100 - ((maxTotalWithEstimated / estimatedTotal) * 100) : 0, 1)}
              <TextSpan apparence="p3" className="ml-1">
                %
              </TextSpan>
            </TextSpan>
          </Button>
        </Tooltip>
        <Button
          appearance="ghost"
          status="Basic"
          className="ml-2"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <EvaIcon name={isOpen ? "arrow-ios-upward-outline" : "arrow-ios-downward-outline"} />
        </Button>
      </Row>
    </Row>
  </CardHeader>
}
