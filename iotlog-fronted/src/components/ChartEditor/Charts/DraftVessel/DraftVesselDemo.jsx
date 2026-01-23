import { EvaIcon } from "@paljs/ui";
import React from "react";
import styled from "styled-components";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";


const ContentOcean = styled.div`
position: relative;
width: 100%;
bottom: -10px;

.icon-rotate {
  transform: rotate(-45deg);
}
`


const useSetTimeout = () => {
  const [values, setValues] = React.useState([Math.floor(Math.random() * 10),Math.floor(Math.random() * 10)]);

  React.useEffect(() => {
    let timeout = setTimeout(() => {
      setValues([Math.floor(Math.random() * 10),Math.floor(Math.random() * 10)]);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [values]);

  return { values };
};


export default function DraftVesselDemo(props) {

  const { height = 200, width = 200, idEnterprise } = props;

  const { values } = useSetTimeout();

  const draftBow = values[0]
  const draftStern = values[1]

  const diffToRotate = draftBow > draftStern
    ? Math.abs(draftBow - draftStern) * -1
    : Math.abs(draftBow - draftStern)

    const isCBOCustomer = !!(idEnterprise === "99ea60e8-29d3-4bfa-b72e-f913ecd34fa0")

  return (
    <ContainerChart height={height} width={width}
      className="card-shadow"
      style={{ justifyContent: 'flex-start' }}
    >
      <TextSpan apparence="s2" className="mt-3">
        Draft
      </TextSpan>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <img
          src={require(`../../../../assets/img/cargo-offshore${isCBOCustomer ? '-cbo' : ''}.png`)}
          alt={"carga"}
          width="80%"
          height="100%"
          style={{
            objectFit: 'contain',
            position: 'relative',
            marginTop: 40,
            transform: `rotate(${diffToRotate}deg)`
          }}
        />
        <img
          src={require(`../../../../assets/img/ocean-offshore${isCBOCustomer ? '-cbo' : ''}.png`)}
          alt={"carga"}
          width="90%"
          height="100%"
          style={{ objectFit: 'contain', position: 'relative', marginTop: isCBOCustomer ? '-65px' : '-80px' }}
        />


        <ContentOcean>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <TextSpan apparence="s2" className="ml-2" style={{ marginTop: -2 }}>
                  {`${draftStern}m`}
                </TextSpan>

                <EvaIcon name="expand-outline" className='icon-rotate' options={{ height: 50, width: 30 }} />

              </div>
              <div style={{ display: 'flex' }}>
                <EvaIcon name="expand-outline" className='icon-rotate mr-4' options={{ height: 50, width: 30 }} />
                <TextSpan apparence="s2" className="mr-2 ml-2" style={{ marginTop: -2 }}>
                  {`${draftBow}m`}
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
    </ContainerChart>
  );
}
