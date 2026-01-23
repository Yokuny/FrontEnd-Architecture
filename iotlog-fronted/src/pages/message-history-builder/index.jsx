import { Card, CardBody, CardHeader, Col, InputGroup, List, ListItem, Row } from "@paljs/ui";
import React from "react";
import { Fetch, LabelIcon, SpinnerFull, TextSpan } from "../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../components/Table";
import { FormattedMessage } from "react-intl";
import { debounce } from "underscore";

export default function MessageHistoryBuilder() {

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getData();
  }, [])

  const getData = (search = "") => {
    setIsLoading(true);
    let query = []
    if (search) {
      query.push(`search=${search.trim().toLowerCase()}`);
    }
    Fetch.get(`/message-history?${query}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  const changeValueDebounced = debounce(( value) => {
    getData(value);
  }, 500);

  return (
    <>
      <Card>
        <CardHeader>
          <Col breakPoint={{ xs: 12, md: 12 }}>
            <LabelIcon iconName="search-outline" title="Pesquisar" />
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder="Pesquisar"
                onChange={(e) => {
                  changeValueDebounced(e.target.value)
                }}
              />
            </InputGroup>
          </Col>
        </CardHeader>
        <CardBody>
          <TABLE>
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="image" />
                  </TextSpan>
                </TH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="description" />
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {data?.map((item, index) => (
                <TR
                  isEvenColor={index % 2 === 0}
                  key={index}>
                  <TD>
                    <Row center="xs" className="m-0 p-4">
                      {item.file &&
                        <img
                          alt={`Imagem Base64 ${index}`}
                          style={{
                            objectFit: "contain",
                            borderRadius: "5px",
                            minWidth: "100px", height: "auto"
                          }}
                          src={`data:${item.file.mimetype};base64,${item.file.content}`} alt={item.caption} />}
                    </Row>
                  </TD>
                  <TD>
                    <TextSpan apparence="p1" className="ml-2">{item.caption}</TextSpan>
                    <TextSpan apparence="p1" className="ml-2 mt-1">{item.body}</TextSpan>
                  </TD>
                </TR>
              ))}
            </TBODY>
          </TABLE>
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
