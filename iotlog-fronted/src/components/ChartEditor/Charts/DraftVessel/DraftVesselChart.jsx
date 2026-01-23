import { EvaIcon } from "@paljs/ui";
import React from "react";
import styled from "styled-components";
import TextSpan from "../../../Text/TextSpan";
import { floatToStringExtendDot } from "../../../Utils";
import { ContentChart } from "../../Utils";

const ContentOcean = styled.div`
position: fixed;
width: 100%;
bottom: 10%;
padding: 0 10px 0 10px;

.icon-rotate {
  transform: rotate(-45deg);
}
`

export default function DraftVesselChart({
  title,
  draftData,
  data,
  onClick = undefined,
}) {


  const { bow = 0, stern = 0 } = draftData || {};

  const diffToRotate = bow > stern
  ? Math.abs(bow - stern)
  : Math.abs(bow - stern) * -1

  const isCBOCustomer = !!(data?.idEnterprise === "99ea60e8-29d3-4bfa-b72e-f913ecd34fa0")

  return (
    <ContentChart
      className="card-shadow"
      style={{ cursor: !!onClick ? "pointer" : "default", justifyContent: 'flex-start' }}
      onClick={onClick}
    >
      <TextSpan apparence="p3" hint className="mt-3">
        {title}
      </TextSpan>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <img
          src={require(`../../../../assets/img/cargo-offshore${isCBOCustomer ? '-cbo' : ''}.png`)}
          alt={"carga"}
          width="70%"
          height="90%"
          style={{ objectFit: 'contain', position: 'fixed', bottom: '0%', transform: `rotate(${diffToRotate}deg)` }}
        />
        <img
          src={require(`../../../../assets/img/ocean-offshore${isCBOCustomer ? '-cbo' : ''}.png`)}
          alt={"carga"}
          width="90%"
          height="90%"
          style={{ objectFit: 'contain', position: 'fixed', bottom: isCBOCustomer ? '1%' : '2%' }}
        />


        <ContentOcean>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <TextSpan apparence="s2" className="ml-2" style={{ marginTop: -2 }}>
                  {`${floatToStringExtendDot(stern,1)}m`}
                </TextSpan>

                <EvaIcon name="expand-outline" className='icon-rotate' options={{ height: 50, width: 30 }} />

              </div>
              <div style={{ display: 'flex' }}>
                <EvaIcon name="expand-outline" className='icon-rotate mr-4' options={{ height: 50, width: 30 }} />
                <TextSpan apparence="s2" className="mr-2 ml-2" style={{ marginTop: -2 }}>
                  {`${floatToStringExtendDot(bow,1)}m`}
                </TextSpan>
              </div>

            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextSpan apparence="p3" className="ml-2">
                Stern
              </TextSpan>
              <TextSpan apparence="p3" className="mr-2">
                Bow
              </TextSpan>
            </div>
          </div>
        </ContentOcean>
      </div>
    </ContentChart>
  );
}
