import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
} from "@paljs/ui";
import { LabelIcon, TextSpan } from "../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import { Vessel, VesselComposition } from "../../../components/Icons";
import styled, { useTheme } from "styled-components";
import AddButton from "../../../components/Button/AddButton";

const CardTitle = styled(CardHeader)`
  display: flex;
  align-items: center;
`;

export default function CompositionCard({
  formData,
  handleChangeComposition,
  handleRemoveComposition,
  handleAddComposition,
}) {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <>
      <Card
        style={{
          boxShadow: "none",
          border: `1px solid ${theme.borderBasicColor3}`,
          marginBottom: `1.5rem`
        }}
      >
        <CardTitle>
          <VesselComposition
            style={{
              height: 23,
              width: 24,
              fill: theme.textBasicColor,
              marginTop: 2,
              marginBottom: -4,
            }}
          />
          <TextSpan className="ml-3" apparence="s1">
            <FormattedMessage id="composition" />
          </TextSpan>
        </CardTitle>

        <CardBody>
          <Row>
            {formData?.compositionAsset?.map((composition, index) => (
              <>
                <Col breakPoint={{ md: 11 }} className="mb-4">
                  <LabelIcon
                    className="mt-3"
                    renderIcon={() => (
                      <Vessel
                        style={{
                          height: 14,
                          width: 14,
                          color: theme.textHintColor,
                          marginRight: 4,
                          marginTop: 1,
                          marginBottom: 1,
                        }}
                      />
                    )}
                    title={<FormattedMessage id="machine" />}
                  />
                  <InputGroup fullWidth className="mt-2">
                    <input
                      disabled={!!formData?.isFinishVoyage}
                      value={composition}
                      onChange={(e) =>
                        handleChangeComposition(index, e.target.value)
                      }
                      placeholder={`${intl.formatMessage({
                        id: "composition",
                      })} ${intl.formatMessage({ id: "machine" })}`}
                    />
                  </InputGroup>
                </Col>
                <Col
                  breakPoint={{ md: 1 }}
                  className="mb-2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "1.5rem",
                  }}
                >
                  <Button
                    size="Tiny"
                    appearance="ghost"
                    status="Danger"
                    disabled={!!formData.isFinishVoyage}
                    onClick={() => handleRemoveComposition(index)}
                  >
                    <EvaIcon name="trash-2-outline" size="small" />
                  </Button>
                </Col>
              </>
            ))}
          </Row>

          <Row className="m-0 mt-4" center="xs">
            <AddButton
              iconName="plus-outline"
              textId="add.composition"
              status="Basic"
              onClick={handleAddComposition}
              appearance="ghost"
              disabled={!!formData.isFinishVoyage}
            />
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
