import React from "react";
import { FormattedMessage } from "react-intl";
import { ContentChart } from "../../../Utils";
import TextSpan from "../../../../Text/TextSpan";

const ModeStatusImageChart = (props) => {
  const { title, value, data } = props;

  const itemConditionVerify = (optionItemParameterized) => {
    return (
      (optionItemParameterized?.value !== "true" &&
        optionItemParameterized?.value !== "false" &&
        optionItemParameterized.value == value) ||
      (optionItemParameterized?.value === "true" &&
        (value === true || value === "true")) ||
      (optionItemParameterized?.value === "false" &&
        (value === false || value === "false"))
    );
  };

  const detailsShow = data.optionsStatus?.find((x) => itemConditionVerify(x));

  return (
    <>
      <ContentChart className="card-shadow">
        <TextSpan apparence="s2" className="mt-2">
          <FormattedMessage id={title} />
        </TextSpan>

        {detailsShow ? (
          <>
            <img
              style={{
                objectFit: "contain",
              }}
              height="50%"
              width="50%"
              src={detailsShow?.image?.url}
              alt={detailsShow?.image?.originalname}
            />

            <TextSpan apparence="c1" className="mb-2">
              {detailsShow?.description ?? ""}
            </TextSpan>
          </>
        ) : (
          <>
            <div></div>
            <div></div>
          </>
        )}
      </ContentChart>
    </>
  );
};

export default ModeStatusImageChart;
