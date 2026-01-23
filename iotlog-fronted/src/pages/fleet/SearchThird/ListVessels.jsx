import React from 'react'
import { Card, CardBody, EvaIcon, InputGroup, List, ListItem, Row } from "@paljs/ui"
import { useIntl } from "react-intl";
import styled, { css } from "styled-components"
import { debounce } from "underscore";
import { nanoid } from 'nanoid';
import { connect } from 'react-redux';
import { Fetch, TextSpan } from '../../../components';
import { getDifferenceDateAgo } from '../../../components/Utils';
import Proximity from '../Proximity';
import { getRouteIntegration, setRouteIntegration } from '../../../actions';
import { SkeletonThemed } from '../../../components/Skeleton';
import TrackingService from '../../../services/TrackingService';

const ContainerIcon = styled.a`
  cursor: pointer;
`;

const ListStyled = styled(List)`
  overflow-y: auto;
  max-height: calc(100vh - 230px);

  div {
    cursor: pointer;
  }

  ${({ theme }) => css`
    ::-webkit-scrollbar-thumb {
      background: ${theme.scrollbarColor};
      cursor: pointer;
    }
    ::-webkit-scrollbar-track {
      background: ${theme.scrollbarBackgroundColor};
    }
    ::-webkit-scrollbar {
      width: ${theme.scrollbarWidth};
      height: ${theme.scrollbarWidth};
    }
  `}
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function ListVessels(props) {
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [vessels, setVessels] = React.useState();

  const { getRouteIntegration } = props;

  const intl = useIntl();

  React.useEffect(() => {
    saveTracking();
  }, []);

  const saveTracking = (search = "") => {
    TrackingService.saveTracking({
      pathfull: "/ais-searchvessels",
      pathname: "/ais-searchvessels",
      search: `?text=${search}`,
    }).then(() => {});
  };

  const changeValueDebounced = debounce((value) => {
    getVessels(value);
  }, 500);

  const getVessels = (text) => {
    if (!text) {
      setVessels([]);
      props.setRouteIntegration({
        routeIntegration: [],
        vesselIntegration: undefined,
      });
      return;
    }
    setIsLoadingData(true);
    saveTracking(text);
    Fetch.get(`/integrationthird/searchvessels?search=${text}`)
      .then((res) => {
        setVessels(res.data?.filter((x) => x));
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

  return (
    <>
      <Card style={{ minWidth: 400, marginBottom: 0 }}>
        <CardBody>
          <InputGroup fullWidth style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              disabled={isLoadingData}
              placeholder={intl.formatMessage({ id: "search" })}
              onChange={(e) => changeValueDebounced(e.target.value)}
            />
            <ContainerIcon onClick={() => {}}>
              <EvaIcon name="search-outline" status="Basic" />
            </ContainerIcon>
          </InputGroup>

          <ListStyled>
            {isLoadingData ? (
              <>
                <ListItem className="p-2">
                  <Col>
                    <SkeletonThemed width={50} />
                    <SkeletonThemed width={150} />
                    <SkeletonThemed width={150} />
                  </Col>
                </ListItem>
              </>
            ) : (
              <>
                {vessels?.map((x) => (
                  <ListItem key={nanoid(4)} onClick={() => getRouteIntegration(x)}>
                    <Col>
                      <Row className="m-0" between="xs">
                        <Row className="m-0" middle="xs">
                          <TextSpan apparence="s2">{x?.name}</TextSpan>
                        </Row>

                        <TextSpan apparence="p3" hint>
                          {x.segment?.label}
                        </TextSpan>
                      </Row>
                      <Row className="m-0">
                        {x?.imo && (
                          <TextSpan apparence="p2" hint className="mr-4">
                            {`IMO ${x.imo}`}
                          </TextSpan>
                        )}
                        <TextSpan apparence="p2" hint>
                          {x?.mmsi ? `MMSI ${x?.mmsi}` : ""}
                        </TextSpan>
                      </Row>
                      <Row className="m-0">
                        <TextSpan apparence="p2" hint className="mr-4">
                          {intl.formatMessage({ id: "proximity" })}
                          {`: `}
                          <Proximity
                            latitude={x?.ais?.position?.latitude}
                            longitude={x?.ais?.position?.longitude}
                            showFlag={true}
                          />
                        </TextSpan>
                      </Row>
                      <Row className="m-0">
                        <TextSpan apparence="p2" hint className="mr-4">
                          {intl.formatMessage({ id: "last.date.acronym" })}
                          <TextSpan apparence="c2" hint className="ml-1">
                            {x?.ais?.lastSeen ? getDifferenceDateAgo(new Date(x.ais?.lastSeen), intl) : ""}
                          </TextSpan>
                        </TextSpan>
                      </Row>
                    </Col>
                  </ListItem>
                ))}
              </>
            )}
          </ListStyled>
        </CardBody>
      </Card>
    </>
  );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  getRouteIntegration: (filter) => {
    dispatch(getRouteIntegration(filter));
  },
  setRouteIntegration: (data) => {
    dispatch(setRouteIntegration(data));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVessels)
