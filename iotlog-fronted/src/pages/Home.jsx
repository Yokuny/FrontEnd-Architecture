import { Card, CardBody } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Spinner from "@paljs/ui/Spinner";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

const Img = styled.img`
  object-fit: contain;
  height: 150px;
  width: 200px;
`;

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const Home = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (props.itemsByEnterprise?.length) verifyAndDispatch();
  }, [props.itemsByEnterprise]);

  const verifyAndDispatch = () => {
    const pathsDistinct = [
      ...new Set(props.itemsByEnterprise?.map((x) => x.paths)?.flat()),
    ];
    if (pathsDistinct.includes("/fleet-manager")) {
      navigate("/fleet-manager", { replace: true });
    } else if (pathsDistinct.includes("/list-dashboard")) {
      navigate("/list-dashboard", { replace: true });
    } else if (pathsDistinct.includes("/voyage-integration")) {
      navigate("/voyage-integration", { replace: true });
    } else if (pathsDistinct.includes("/datalogger")) {
      navigate("/datalogger", { replace: true });
    }

    setIsLoading(false);
  };

  const enterpriseSelect = props.enterprises?.find((x) =>
    props.idEnterprises?.includes(x.id)
  );

  const source = enterpriseSelect?.image?.url && enterpriseSelect.image.url;

  return (
    <>
      <Card>
        <CardBody>
          <Col
            breakPoint={{ lg: 12, md: 12, sm: 12, xxs: 12 }}
            className="col-flex-center"
          >
            {source && (
              <Img
                src={source}
                alt={enterpriseSelect.label}
                noShowLogo={!!(props.enterprises?.length > 1)}
              />
            )}
          </Col>
          {isLoading && (
            <Col
              breakPoint={{ lg: 12, md: 12, sm: 12, xxs: 12 }}
              className="col-flex-center mb-4"
              style={{ height: 90 }}
            >
              <SpinnerStyled />
            </Col>
          )}
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
  idEnterprises: state.enterpriseFilter.idEnterprises,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(Home);
