import { EvaIcon } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import Lottie from "react-lottie";
import { IconBorder } from "../../../Icons/IconRounded";
import TextSpan from "../../../Text/TextSpan";
import { ContentChart } from "../../Utils";
import { TYPE_CONVERT_VALUE } from "../History/Constants";

export default function OnOffChart({
  title,
  description,
  value,
  data,
  onClick = undefined,
}) {

  const getValueInBoolean = (value) => {
    if (value === undefined && value === null) {
      return value
    }

    if (data?.typeVisualization?.value === TYPE_CONVERT_VALUE.FUNCTION) {
      try {
        return new Function(`return ${data?.function?.replaceAll("value", value)}`)();
      }
      catch {
        return "error"
      }
    }

    if (typeof value === "boolean") return value
    return !!value
  }

  const valueReaded = getValueInBoolean(value);

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: require(`./../../../../assets/lotties/${valueReaded === true ? "on" : "on-off"
      }.json`),
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ContentChart className="card-shadow" onClick={onClick}>
      <TextSpan apparence="s2">{title || ""}</TextSpan>


      {(valueReaded === undefined || valueReaded === null)
        ?
        <>
          <div style={{ marginLeft: -25 }}>
            <EvaIcon
              name={'wifi-off-outline'}
              status="Basic"
              options={{ width: 50, height: 40 }}
            />

          </div>
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="not.received" />
          </TextSpan>
        </>
        : (valueReaded === "error") ?
          <>
            <div style={{ marginLeft: -25 }}>
              <EvaIcon
                name={'close'}
                status="Danger"
                options={{ width: 50, height: 40 }}
              />

            </div>
            <TextSpan apparence="p2">
              Error <FormattedMessage id="function" />
            </TextSpan>
          </>
          :
          <><Lottie
            options={defaultOptions}
            style={{ marginTop: -25, marginBottom: -20 }}
            isPaused={true}
            isStopped={true}
            height={'70%'}
            width={'84%'}
          />
            <div></div>
          </>
      }

    </ContentChart>
  );
}
