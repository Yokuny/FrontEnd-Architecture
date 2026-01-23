import { Button, EvaIcon } from "@paljs/ui";
import chroma from "chroma-js";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styledComponents, { css, useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringNormalize, getArrayMax } from "../../../components/Utils";

const TheadStyled = styledComponents(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  position: sticky;
  top: 0;
`

const ContentList = (props) => {
  const { data } = props;
  const theme = useTheme();
  const intl = useIntl();

  const getMaxValue = () => {
    const arraydata = data?.data?.flatMap((x, i) => {
      return x.metadata.formsInPort?.flatMap((z, j) =>
        data?.fields
          ?.filter((field) => field?.isHeatmap)
          .map((field, k) => z[field.name] ?? 0)
      );
    });
    return getArrayMax(arraydata?.length ? arraydata : [1]);
  };

  const scale = chroma.scale([
    theme.backgroundBasicColor1,
    "yellow",
    "orange",
    "red",
  ]);
  scale.domain([0, getMaxValue()]);

  const hasPermissionToEdit = props.itemsByEnterprise?.some((x) =>
    x.paths?.includes("/add-maneuver-metadata")
  );

  return (
    <>
      <TheadStyled>
        <TRH>
          <TH>
            <TextSpan apparence="s2">
              <FormattedMessage id="travel" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="s2">
              <FormattedMessage id="port" />
            </TextSpan>
          </TH>
          {data?.fields?.map((field, k) => (
            <TH
              key={`head-${k}`}
              textAlign={field?.datatype !== "number" ? "center" : "end"}
            >
              <TextSpan apparence="s2">{field.description}</TextSpan>
              {field?.unit && (
                <>
                  <br />
                  <TextSpan apparence="p3">({field?.unit})</TextSpan>
                </>
              )}
            </TH>
          ))}
          <TH textAlign="center">
            <EvaIcon
              name="person-outline"
              options={{ fill: theme.colorTextBasic }}
            />
          </TH>
          {hasPermissionToEdit && <TH></TH>}
        </TRH>
      </TheadStyled>
      <TBODY>
        {data?.data?.map((x, i) => {
          return x.metadata.formsInPort?.map((z, j) => (
            <TR key={`${i}-${j}`} isEvenColor={i % 2 === 0}>
              <TD
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                }}
              >
                <TextSpan apparence="s3">{x.code}</TextSpan>
                <br />
                <TextSpan apparence="p2">{x.machine.name}</TextSpan>
              </TD>
              <TD
                textAlign="center"
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                }}
              >
                {x.portPoint?.code && (
                  <>
                    <TextSpan apparence="s3">{x.portPoint?.code}</TextSpan>
                  </>
                )}
              </TD>
              {data?.fields?.map((field, k) => (
                <TD
                  key={`${field?.name}-${i}-${j}`}
                  textAlign={field?.datatype !== "number" ? "center" : "end"}
                  style={{
                    backgroundColor: field?.isHeatmap
                      ? scale(z[field.name] ?? 0)
                      : theme.backgroundBasicColor1,
                  }}
                >
                  <TextSpan apparence="p2">
                    {field?.datatype === "datetime"
                      ? z[field.name]
                        ? moment(z[field.name]).format(
                            intl.formatMessage({
                              id: "format.datetimewithoutss",
                            })
                          )
                        : ""
                      : field?.datatype === "number"
                      ? floatToStringNormalize(z[field.name])
                      : z[field.name]}
                  </TextSpan>
                </TD>
              ))}
              <TD
                textAlign="center"
                style={{
                  backgroundColor: theme.backgroundBasicColor1,
                }}
              >
                <TextSpan apparence="s2">
                  {x?.userLastModified?.name
                    ?.split(" ")
                    ?.map((x) => x[0])
                    ?.join("")}
                </TextSpan>
              </TD>
              {hasPermissionToEdit && (
                <TD
                  textAlign="center"
                  style={{
                    backgroundColor: theme.backgroundBasicColor1,
                  }}
                >
                  <Button
                    onClick={() =>
                      window.open(
                        `/add-maneuver-metadata?id=${x.id}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    size="Tiny"
                    style={{ padding: 2 }}
                  >
                    <EvaIcon name="edit-outline" />
                  </Button>
                </TD>
              )}
            </TR>
          ));
        })}
      </TBODY>
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ContentList);
