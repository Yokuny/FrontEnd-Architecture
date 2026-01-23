import React from 'react';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { InputGroup } from '@paljs/ui/Input';
import { Button } from '@paljs/ui/Button';
import { EvaIcon } from '@paljs/ui/Icon';
import { FormattedMessage } from 'react-intl';
import AddButton from '../../../components/Button/AddButton';
import { useTheme } from 'styled-components';

export default function CrewCard({
  formData,
  intl,
  addCrewMember,
  removeCrewMember,
  updateCrewMemberName
}) {
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
        <CardHeader>
          <EvaIcon name="people-outline" status="Warning" className="mr-2" />
          <FormattedMessage id="crew" />
        </CardHeader>
        <CardBody className="mb-0">
          {!!formData?.crew?.length && (
            <>
              {formData?.crew.map((crewMember, index) => (
                <Row key={index} middle="xs" className="mb-4">
                  <Col breakPoint={{ md: 11 }}>
                    <InputGroup fullWidth>
                      <input
                        type="text"
                        disabled={!!formData?.isFinishVoyage}
                        value={crewMember}
                        onChange={(e) => updateCrewMemberName(index, e.target.value)}
                        placeholder={intl.formatMessage({ id: "name" })}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 1 }}>
                    <Button
                      size="Tiny"
                      appearance="ghost"
                      status="Danger"
                      disabled={!!formData?.isFinishVoyage}
                      onClick={() => removeCrewMember(index)}
                    >
                      <EvaIcon name="trash-2-outline" size="small" />
                    </Button>
                  </Col>
                </Row>
              ))}
            </>
          )}

          <Row className="m-0 mt-4" center="xs">
            <AddButton
              iconName={"person-add-outline"}
              textId="add.crew" onClick={addCrewMember}
              appearance="ghost"
              status="Basic"
              disabled={!formData?.asset || !!formData?.isFinishVoyage} />
          </Row>

        </CardBody>
      </Card>
    </>
  )
}
