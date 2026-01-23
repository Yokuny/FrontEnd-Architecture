import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Spinner,
  List,
  ListItem,
} from "@paljs/ui";
import styled from "styled-components";
import InputText from "../../../components/Inputs/InputText";
import { InputDecimal, LabelIcon, Modal, TextSpan } from "../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import { useState, useEffect } from "react";
import { Fetch } from "../../../components";

const Panel = styled(Card)`
  position: absolute;
  top: 5rem;
  border-radius: 0.5rem;
  border-radius: 12px;
  left: 13px;
  z-index: 999;
  max-width: 250px;
  background: ${(props) => props.theme.backgroundBasicColor1}ee;
  border: 1px solid ${(props) => props.theme.borderBasicColor3};
`;

export default function PainelInput({
  filterParams,
  calculateRoute,
  canRoute,
  isRouting,
  setSelectTarget,
  selectTarget,
  resetRoute,
  onChange,
  routeGeoJson,
  loadRouteFromHistory,
}) {
  const intl = useIntl();
  const [showRestrictionsModal, setShowRestrictionsModal] = useState(false);
  const [routeDescription, setRouteDescription] = useState("");
  const [savingRoute, setSavingRoute] = useState(false);
  const [showSaveRoute, setShowSaveRoute] = useState(false);
  const [routeHistory, setRouteHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchRouteHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await Fetch.get("/route/history", {
        isV2: true,
      });
      setRouteHistory(response.data || []);
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveRouteToHistory = async (description) => {
    if (!routeGeoJson || !routeGeoJson.features) {
      return false;
    }

    try {
      await Fetch.post(
        "/route/history",
        {
          description,
          routeGeoJson: routeGeoJson.features,
        },
        {
          isV2: true,
        }
      );

      await fetchRouteHistory();
      return true;
    } catch {
      return false;
    }
  };

  const deleteRouteFromHistory = async (id) => {
    try {
      await Fetch.delete(`/route/history/${id}`, {
        isV2: true,
      });

      await fetchRouteHistory();
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleLoadRouteFromHistory = async (route) => {
    try {
      const response = await Fetch.get(`/route/history/${route.id}`, {
        isV2: true,
      });
      if (response.data && response.data.features) {
        loadRouteFromHistory(response.data);
      }
    } catch (error) {
    }
  };

  const handleSaveRoute = async () => {
    if (!routeDescription.trim()) {
      return;
    }

    setSavingRoute(true);
    const success = await saveRouteToHistory(routeDescription.trim());
    if (success) {
      setRouteDescription("");
    }
    setSavingRoute(false);
  };

  useEffect(() => {
    fetchRouteHistory();
  }, []);

  return (
    <>
      <Panel>
        <CardHeader>
          <FormattedMessage id="route.planner" />
        </CardHeader>
        <CardBody
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            position: "relative",
          }}>
          <Row style={{ marginBottom: "0.5rem" }}>
            <Col
              breakPoint={{ xs: 12 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LabelIcon title={`${intl.formatMessage({ id: "departure" })} (A)`} />
              <Button
                size="Tiny"
                style={{
                  padding: "0.2rem",
                }}
                status={selectTarget === "origin" ? "Primary" : "Basic"}
                onClick={() => setSelectTarget(selectTarget === "origin" ? null : "origin")}>
                <EvaIcon name="pin-outline" />
              </Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Col breakPoint={{ xs: 12 }}>
              <InputGroup style={{ marginBottom: "0.5rem" }}>
                <InputDecimal
                  value={filterParams.origin?.lat}
                  onChange={(v) => onChange("origin", { ...filterParams.origin, lat: v })}
                  placeholder="Lat"
                  style={{ width: "100%" }}
                  sizeDecimals={6}
                />
              </InputGroup>
              <InputGroup>
                <InputDecimal
                  value={filterParams.origin?.lng}
                  onChange={(v) => onChange("origin", { ...filterParams.origin, lng: v })}
                  placeholder="Lon"
                  style={{ width: "100%" }}
                  sizeDecimals={6}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row style={{ marginBottom: "0.5rem" }}>
            <Col
              breakPoint={{ xs: 12 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LabelIcon title={`${intl.formatMessage({ id: "arrival" })} (B)`} />
              <Button
                size="Tiny"
                style={{
                  padding: "0.2rem",
                }}
                status={selectTarget === "destination" ? "Primary" : "Basic"}
                onClick={() => setSelectTarget(selectTarget === "destination" ? null : "destination")}>
                <EvaIcon name="pin-outline" />
              </Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: "1rem" }}>
            <Col breakPoint={{ xs: 12 }}>
              <InputGroup style={{ marginBottom: "0.5rem" }}>
                <InputDecimal
                  value={filterParams.destination?.lat}
                  onChange={(v) => onChange("destination", { ...filterParams.destination, lat: v })}
                  placeholder="Lat"
                  style={{ width: "100%" }}
                  sizeDecimals={6}
                />
              </InputGroup>
              <InputGroup>
                <InputDecimal
                  value={filterParams.destination?.lng}
                  onChange={(v) => onChange("destination", { ...filterParams.destination, lng: v })}
                  placeholder="Lon"
                  style={{ width: "100%" }}
                  sizeDecimals={6}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ xs: 12 }} style={{ marginTop: "1.5rem" }}>
              <Button
                status="Info"
                appearance="outline"
                onClick={() => setShowRestrictionsModal(true)}
                size="Tiny"
                fullWidth>
                {intl.formatMessage({ id: "restrictions" })}
              </Button>
            </Col>
          </Row>
          <Row gutter={8} style={{ marginTop: "0.5rem" }}>
            <Col breakPoint={{ xs: 6 }}>
              <Button status="Basic" appearance="ghost" onClick={resetRoute} size="Tiny" fullWidth>
                {intl.formatMessage({ id: "reset" })}
              </Button>
            </Col>
            <Col breakPoint={{ xs: 6 }}>
              <Button status="Primary" disabled={!canRoute || isRouting} onClick={calculateRoute} size="Tiny" fullWidth>
                {isRouting ? <Spinner size="Tiny" /> : intl.formatMessage({ id: "route" })}
              </Button>
            </Col>
          </Row>

          {routeGeoJson && (
            <>
              <Row style={{ marginTop: ".5rem" }}>
                <Col breakPoint={{ xs: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <LabelIcon title={intl.formatMessage({ id: "save.route" }) || "Salvar Rota"} />
                    <Button
                      size="Tiny"
                      status="Basic"
                      appearance="ghost"
                      style={{ padding: "0.2rem" }}
                      onClick={() => setShowSaveRoute(!showSaveRoute)}>
                      <EvaIcon name={showSaveRoute ? "minus-outline" : "plus-outline"} />
                    </Button>
                  </div>
                </Col>
              </Row>
              {showSaveRoute && (
                <Row style={{ marginBottom: "1rem" }}>
                  <Col breakPoint={{ xs: 12 }}>
                    <InputGroup style={{ marginBottom: "0.5rem" }}>
                      <InputText
                        value={routeDescription}
                        onChange={(value) => setRouteDescription(value)}
                        placeholder={intl.formatMessage({ id: "route.description" }) || "Descrição da rota"}
                      />
                    </InputGroup>
                    <Button
                      status="Success"
                      size="Tiny"
                      fullWidth
                      disabled={!routeDescription.trim() || savingRoute}
                      onClick={handleSaveRoute}>
                      {savingRoute ? <Spinner size="Tiny" /> : intl.formatMessage({ id: "save" }) || "Salvar"}
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )}

          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <LabelIcon title={intl.formatMessage({ id: "route.history" }) || "Histórico de Rotas"} />
              {loadingHistory ? (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <Spinner size="Medium" />
                </div>
              ) : (
                <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "0.4rem" }}>
                  {routeHistory.length === 0 ? (
                    <TextSpan
                      apparence="p2"
                      hint
                      style={{
                        border: "1px solid #ccc",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        textAlign: "center",
                        display: "block",
                      }}>
                      {intl.formatMessage({ id: "no.routes.found" }) || "Nenhuma rota salva"}
                    </TextSpan>
                  ) : (
                    <List>
                      {routeHistory.map((route, index) => (
                        <ListItem
                          key={route.description || index}
                          style={{
                            cursor: "pointer",
                            padding: "0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            borderBottom: "0px solid",
                            border: "0px solid",
                          }}>
                          <div
                            onClick={() => handleLoadRouteFromHistory(route)}
                            style={{
                              flex: 1,
                              display: "flex",
                              gap: "0.1rem",
                              cursor: "pointer",
                              justifyContent: "space-between",
                            }}>
                            <TextSpan apparence="p2" style={{ fontWeight: "500" }}>
                              {route.description}
                            </TextSpan>
                            <TextSpan apparence="c3" hint style={{ display: "block", marginBottom: "0.25rem" }}>
                              {new Date(route.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </TextSpan>
                          </div>
                          <Button
                            size="Tiny"
                            status="Danger"
                            appearance="ghost"
                            style={{
                              padding: "0.2rem",
                              width: "fit-content",
                              height: "fit-content",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRouteFromHistory(route.id);
                            }}>
                            x
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </CardBody>
      </Panel>
      <Modal
        show={showRestrictionsModal}
        onClose={() => setShowRestrictionsModal(false)}
        title={intl.formatMessage({ id: "restrictions" })}
        renderFooter={() => (
          <CardFooter>
            <Row between="xs" className="m-0">
              <Button status="Basic" appearance="ghost" onClick={() => setShowRestrictionsModal(false)} size="Tiny">
                {intl.formatMessage({ id: "cancel" })}
              </Button>
              <Button
                status="Info"
                onClick={() => {
                  // Logic to apply restrictions
                  setShowRestrictionsModal(false);
                }}
                size="Small">
                {intl.formatMessage({ id: "apply" })}
              </Button>
            </Row>
          </CardFooter>
        )}>
        <Row>
          <Col breakPoint={{ xs: 6 }}>
            <LabelIcon title={`${intl.formatMessage({ id: "draftRestriction" })} (m)`} />
            <InputGroup fullWidth>
              <InputDecimal
                onChange={(v) => onChange("draftRestriction", v)}
                value={filterParams.draftRestriction}
                placeholder={intl.formatMessage({ id: "draftRestriction" })}
                sizeDecimals={2}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ xs: 6 }}>
            <LabelIcon title={`${intl.formatMessage({ id: "waveHeightRestriction" })} (m)`} />
            <InputGroup fullWidth>
              <InputDecimal
                onChange={(v) => onChange("waveHeightRestriction", v)}
                value={filterParams.waveHeightRestriction}
                placeholder={intl.formatMessage({ id: "waveHeightRestriction" })}
                sizeDecimals={2}
              />
            </InputGroup>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
