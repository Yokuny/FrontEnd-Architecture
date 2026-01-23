import { useTheme } from "styled-components";
import { Row, Tooltip } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../../components";
import { TD } from "../../../../components/Table";
import {
  getInconsistencies,
  getJustifiedIcon,
} from "../Dashboard/Inconsitences";

export const HeaderStatusDataColumn = ({ data }) => {
  return (
    <>
      {data.typeForm === "RVE" && (
        <>
          <TD textAlign="center">
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="status" />
            </TextSpan>
          </TD>
        </>
      )}
    </>
  );
};

export const BodyStatusDataColumn = ({ itemData, data }) => {
  const theme = useTheme();

  const inconsistencies = getInconsistencies(theme);

  return (
    <>
      {data.typeForm === "RVE" && (
        <>
          <TD textAlign="center">
            {!!itemData?.inconsistenciesType?.length ? (
              <Row
                className="m-0"
                center="xs"
                style={{
                  flexWrap: "nowrap",
                }}
              >
                {itemData?.justified ? (
                  <Tooltip
                    placement="top"
                    trigger="hint"
                    content={
                      <>
                        <TextSpan apparence="p3">
                          <FormattedMessage id="justified" />:
                        </TextSpan>
                        <br />
                        <TextSpan apparence="s2">
                          {itemData?.justificative}
                        </TextSpan>
                      </>
                    }
                  >
                    <div className="m-1">{getJustifiedIcon(theme)}</div>
                  </Tooltip>
                ) : (
                  itemData.inconsistenciesType.map((inconsistency, index) => (
                    <>
                      <Tooltip
                        key={index}
                        placement="top"
                        trigger="hint"
                        content={
                          <TextSpan apparence="s2">
                            <FormattedMessage
                              id={inconsistencies[inconsistency].text}
                            />
                          </TextSpan>
                        }
                      >
                        <div key={`${index}-icon`} className="m-1">
                          {inconsistencies[inconsistency].icon}
                        </div>
                      </Tooltip>
                    </>
                  ))
                )}
              </Row>
            ) : (
              <></>
            )}
          </TD>
        </>
      )}
    </>
  );
};
