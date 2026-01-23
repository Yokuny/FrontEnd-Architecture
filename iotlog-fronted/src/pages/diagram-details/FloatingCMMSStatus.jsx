import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../components";
import { LabelIcon } from "../../components";

const Container = styled.div`
  position: absolute;
  z-index: 100;
  background-color: ${({ theme }) => theme.backgroundBasicColor1};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: ${({ $isMobile }) => ($isMobile ? "12px" : "16px")};
  top: ${({ $isMobile }) => ($isMobile ? "10px" : "20px")};
  left: ${({ $isMobile }) => ($isMobile ? "10px" : "auto")};
  right: ${({ $isMobile }) => ($isMobile ? "10px" : "20px")};
  width: ${({ $isMobile }) => ($isMobile ? "calc(100% - 20px)" : "auto")};
  max-width: ${({ $isMobile }) => ($isMobile ? "none" : "400px")};
`;

const PlainCard = styled(Card)`
  margin: 0;
  box-shadow: none;
`;

const PlainCardBody = styled(CardBody)`
  padding: ${({ $isMobile }) => ($isMobile ? "4px" : "8px")};
`;

const SectionTitleRow = styled(Row)`
  margin: 0;
  margin-bottom: ${({ $isMobile }) => ($isMobile ? "4px" : "8px")};
`;

const MobileChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: ${({ $withBottomMargin }) => ($withBottomMargin ? "12px" : "0")};
`;

const Chip = styled.div`
  background-color: ${({ theme }) => theme.backgroundBasicColor2};
  border-radius: 4px;
  padding: 6px 8px;
  text-align: center;
  flex: 0 0 auto;
  min-width: fit-content;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DesktopRow = styled(Row)`
  margin: 0;
  margin-bottom: ${({ $withBottomMargin }) => ($withBottomMargin ? "12px" : "0")};
`;

const DesktopCol = styled(Col)`
  margin-bottom: 8px;
`;

const DesktopTile = styled.div`
  background-color: ${({ theme }) => theme.backgroundBasicColor2};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  padding: 8px;
  text-align: center;
  height: 100%;
`;

const FloatingCMMSStatus = ({ markers, isVisible, cmmsData }) => {
  const intl = useIntl();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible || !cmmsData) return null;

  const processDataGroup = (data) => {
    if (!Array.isArray(data)) return [];
    const { defined, undefinedItems } = data.reduce(
      (acc, item) => {
        if (!item.text || item.text.trim() === "") {
          return {
            ...acc,
            undefinedItems: {
              text: intl.formatMessage({ id: "undefined" }),
              total: (acc.undefinedItems.total || 0) + (item.total || 0),
            },
          };
        }
        return { ...acc, defined: [...acc.defined, item] };
      },
      { defined: [], undefinedItems: { text: intl.formatMessage({ id: "undefined" }), total: 0 } }
    );
    return undefinedItems.total > 0 ? [...defined, undefinedItems] : defined;
  };

  const statusData = processDataGroup(cmmsData.status || []);
  const typeMaintenanceData = processDataGroup(cmmsData.typeMaintenance || []);

  return (
    <Container $isMobile={isMobile}>
      <PlainCard>
        <PlainCardBody $isMobile={isMobile}>
          <SectionTitleRow $isMobile={isMobile}>
            <LabelIcon title="Status" />
          </SectionTitleRow>

          {isMobile ? (
            <MobileChips $withBottomMargin>
              {statusData.map((item, idx) => (
                <Chip key={idx + "s"}>
                  <TextSpan apparence="h6">{item?.total || 0}</TextSpan>
                  <TextSpan apparence="p2" hint>
                    {item.text}
                  </TextSpan>
                </Chip>
              ))}
            </MobileChips>
          ) : (
            <DesktopRow $withBottomMargin>
              {statusData.map((item, idx) => (
                <DesktopCol key={idx + "s"} breakPoint={{ xs: 6 }}>
                  <DesktopTile>
                    <TextSpan apparence="h6" className="mt-2">
                      {item?.total || 0}
                    </TextSpan>
                    <TextSpan className="mt-1" apparence="p2" hint>
                      {item.text}
                    </TextSpan>
                  </DesktopTile>
                </DesktopCol>
              ))}
            </DesktopRow>
          )}

          <SectionTitleRow $isMobile={isMobile}>
            <LabelIcon title={<FormattedMessage id="activities" />} />
          </SectionTitleRow>

          {isMobile ? (
            <MobileChips>
              {typeMaintenanceData.map((item, idx) => (
                <Chip key={idx}>
                  <TextSpan apparence="h6" className="mt-2">
                    {item?.total || 0}
                  </TextSpan>
                  <TextSpan className="mt-1" apparence="p2" hint>
                    {item.text}
                  </TextSpan>
                </Chip>
              ))}
            </MobileChips>
          ) : (
            <DesktopRow>
              {typeMaintenanceData.map((item, idx) => (
                <DesktopCol key={idx} breakPoint={{ xs: 6 }}>
                  <DesktopTile>
                    <TextSpan apparence="h6" className="mt-2">
                      {item?.total || 0}
                    </TextSpan>
                    <TextSpan className="mt-1" apparence="p2" hint>
                      {item.text}
                    </TextSpan>
                  </DesktopTile>
                </DesktopCol>
              ))}
            </DesktopRow>
          )}
        </PlainCardBody>
      </PlainCard>
    </Container>
  );
};

export default FloatingCMMSStatus;
