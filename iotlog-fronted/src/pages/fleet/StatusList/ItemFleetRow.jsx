import { Badge } from "@paljs/ui";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { DateDiff } from "../../../components/Date/DateDiff";
import { TD, TR } from "../../../components/Table";
import { optionsIntegrations } from "../../../pages/integration/OptionsIntegrations";

const Img = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`


export default function ItemFleetRow({ itemStatus, index }) {
  const theme = useTheme();

  const getColorUpdate = () => {
    const hours = moment().diff(moment(itemStatus.date), "hours");

    if (hours >= 14) {
      return {
        text: "to.check",
        color: theme.colorDanger500,
      };
    }

    if (hours >= 8) {
      return {
        text: "worrisome",
        color: theme.colorDanger500,
      };
    }

    if (hours >= 4) {
      return {
        text: "warn",
        color: theme.colorWarning500,
      };
    }

    return undefined;
  };

  const colorUpdate = getColorUpdate();

  const optionIntegration = optionsIntegrations?.find(x => x.value === itemStatus.extra?.api)

  return (
    <>
      <TR isEvenColor={index % 2 === 0}>
        <TD textAlign="center">
          {itemStatus?.image?.url ? (
            <Img src={itemStatus?.image?.url} alt={itemStatus?.name} />
          ) : (
            <div style={{ minHeight: 50 }}></div>
          )}
        </TD>
        <TD>
          <ColFlex>
            <TextSpan apparence="s2">{itemStatus.name}</TextSpan>
            {itemStatus.dataSheet?.mmsi && <TextSpan apparence="p3" hint>MMSI: {itemStatus.dataSheet?.mmsi}</TextSpan>}
            {itemStatus.dataSheet?.imo && <TextSpan style={{ marginTop: -5 }} apparence="p3" hint>IMO: {itemStatus.dataSheet?.imo}</TextSpan>}
            <TextSpan apparence="p3" hint>
              <FormattedMessage id="create.at" />: {moment(itemStatus.createAt).format("DD MMM YYYY, HH:mm")}
            </TextSpan>
          </ColFlex>
        </TD>
        <TD textAlign="center">
          {itemStatus.date && (
            <>
              <TextSpan apparence="s2" style={{ color: colorUpdate?.color }}>
                <DateDiff dateInitial={itemStatus.date} />
              </TextSpan>
              <br />
              <TextSpan
                apparence="p3"
                style={{
                  color: colorUpdate?.color,
                  textTransform: "capitalize",
                }}
              >
                {moment(itemStatus.date).format("MMM DD, HH:mm")}
              </TextSpan>
              <br />
            </>
          )}
        </TD>
        <TD textAlign="center">
          {itemStatus.eta && (
            <TextSpan apparence="s2" style={{ textTransform: "capitalize" }}>
              {moment(itemStatus.eta).format("MMM DD, HH:mm")}
            </TextSpan>
          )}
        </TD>
        <TD textAlign="center">
          {itemStatus.destiny && (
            <TextSpan apparence="s2" style={{ textTransform: "capitalize" }}>
              {itemStatus.destiny}
            </TextSpan>
          )}
        </TD>
        <TD textAlign="center">
          <ColFlex>
            {itemStatus.typeIntegration && (
              <Badge
                position=""
                status={itemStatus.typeIntegration == "MIDDLEWARE" ? "Primary" : "Success"}
                style={{
                  position: "inherit",
                }}
              >
                {itemStatus.typeIntegration}
              </Badge>
            )}

            {!!optionIntegration && (
              <TextSpan apparence="p2">
                {`${optionIntegration?.label} (${optionIntegration?.value})`}
              </TextSpan>
            )}
          </ColFlex>
        </TD>
        <TD textAlign="center">
          {colorUpdate && (
            <Badge
              position=""
              style={{
                position: "inherit",
                backgroundColor: colorUpdate.color,
              }}
            >
              <FormattedMessage id={colorUpdate.text} />
            </Badge>
          )}
        </TD>
      </TR>
    </>
  );
}
