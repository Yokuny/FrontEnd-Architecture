import moment from "moment/moment";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../components/Table";
import {
  DeleteConfirmation,
  InputDecimal,
  TextSpan,
  UserImage,
} from "../../components";
import {
  Button,
  Card,
  CardBody,
  Col,
  EvaIcon,
  InputGroup,
  Row,
} from "@paljs/ui";

export function GoalTable({
  data: initialData,
  handleChange,
  handleDelete,
  handleChangeTotal,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  function organizeValuesByMonth(data) {
    const monthValues = Array(13).fill(0);
    
    data.forEach(item => {
      const date = new Date(item.date);
      const month = item.date ? date.getMonth() : 12;

      monthValues[month] = item.value;
    });
    
    return monthValues;
  }

  const intl = useIntl();

  return (
    <>
      <Col breakPoint={{ xs: 12 }}>
        <Card>
          <CardBody>
            <TABLE>
              <THEAD>
                <TRH>
                  <TH textAlign="center" style={{ minWidth: 150 }}>
                    <TextSpan apparence="s2" hint>
                      {intl.formatMessage({ id: "machine" })}
                    </TextSpan>
                  </TH>
                  {[...Array(12).keys()].map((_, index) => (
                    <TH
                      key={index}
                      textAlign="center"
                      style={{ minWidth: 110 }}
                    >
                      <TextSpan apparence="s2" hint>
                        {moment().month(index).format("MMM")}
                      </TextSpan>
                    </TH>
                  ))}

                  <TH textAlign="center" style={{ minWidth: 110 }}>
                    <TextSpan apparence="s2" hint>
                      <FormattedMessage id="total.year" />
                    </TextSpan>
                  </TH>

                  <TH>
                    <TextSpan apparence="p2" className="ml-2 mr-2" hint>
                      {intl.formatMessage({ id: "actions" })}
                    </TextSpan>
                  </TH>
                </TRH>
              </THEAD>

              <TBODY>
                {data
                  ?.sort((a, b) =>
                    a.machine?.name?.localeCompare(b.machine?.name)
                  )
                  ?.map((items, index) => (
                    <TR isEvenColor={index % 2 === 0}>
                      <TD>
                        <Col
                          style={{
                            marginTop: 10,
                            marginBottom: 10,
                            padding: 0,
                            display: "flex",
                            width: `100%`,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {!items.isFleet ? (
                            <>
                              <UserImage
                                image={items.machine?.image?.url}
                                size={"Large"}
                              />
                              <TextSpan apparence="s2">
                                {items.machine?.name}
                              </TextSpan>
                            </>
                          ) : (
                            <TextSpan apparence="s2">
                              <FormattedMessage id="fleet" />
                            </TextSpan>
                          )}
                        </Col>
                      </TD>
                      {organizeValuesByMonth(items.goals).map((item, index) => {
                        if (index === 12) {
                          return (
                            <TD textAlign="center">
                              <InputGroup fullWidth>
                                <InputDecimal
                                  value={item}
                                  style={{ textAlign: "center" }}
                                  onChange={(value) =>
                                    handleChangeTotal(items, value)
                                  }
                                />
                              </InputGroup>
                            </TD>
                          );
                        }

                        return (
                          <TD key={index} textAlign="center">
                            <InputGroup fullWidth>
                              <InputDecimal
                                value={item}
                                style={{ textAlign: "center" }}
                                onChange={(value) =>
                                  handleChange(items, index, value)
                                }
                              />
                            </InputGroup>
                          </TD>
                        );
                      })}
                      <TD>
                        <Row center="md">
                          <DeleteConfirmation
                            onConfirmation={() => handleDelete(items)}
                            message={intl.formatMessage({
                              id: "delete.message.default",
                            })}
                          >
                            <Button
                              size="Tiny"
                              status="Danger"
                              appearance="ghost"
                              style={{ padding: 1 }}
                            >
                              <EvaIcon name="trash-2-outline" />
                            </Button>
                          </DeleteConfirmation>
                        </Row>
                      </TD>
                    </TR>
                  ))}
              </TBODY>
            </TABLE>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
