import { connect } from "react-redux";
import styled from "styled-components";
import { DARKS_MAP } from "./Utils";

const Img = styled.img`
  ${({ bottom = 5 }) => `
object-fit: contain;
  height: 30px;
  z-index: 999;
  position: absolute;
  bottom: ${bottom}px;
  right: 8px;
  object-position: right;
  max-width: 120px;
`}
`;

const EnterpriseLogoMap = (props) => {
  const enterpriseSelect = props.enterprises?.find((x) =>
    props.idEnterprises?.includes(x.id)
  );

  const source =
    (DARKS_MAP.includes(props.mapTheme) || !!props.preferenceDark) &&
    enterpriseSelect?.imageDark?.url
      ? enterpriseSelect?.imageDark?.url
      : enterpriseSelect?.image?.url;
  if (!source) {
    return <></>;
  }

  return (
    <>
      <Img
        bottom={props.bottom || 5}
        src={source}
        alt={enterpriseSelect.label}
        noShowLogo={!!(props.enterprises?.length > 1)}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  idEnterprises: state.enterpriseFilter.idEnterprises,
  enterprises: state.enterpriseFilter.enterprises,
  mapTheme: state.map.mapTheme,
});

export default connect(mapStateToProps, undefined)(EnterpriseLogoMap);
