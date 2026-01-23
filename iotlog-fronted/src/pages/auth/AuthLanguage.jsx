import { Button, Card, CardBody, Checkbox, EvaIcon, Popover } from "@paljs/ui";
import { connect } from "react-redux";
import styled from "styled-components";
import { setLanguage } from "../../actions";
import { TextSpan } from "../../components";
import { LANGUAGES } from "../../constants";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonStyled = styled(Button)`
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: none;
`;

const DivStyled = styled.div`
  position: absolute;
  bottom: 16px;
  left: 24px;
`;

const AuthLanguage = (props) => {
  return (
    <>
      <DivStyled>
        <Popover
          className="inline-block"
          trigger="click"
          placement="top"
          key="language"
          overlay={
            <>
              <Card
                style={{
                  marginBottom: 0,
                }}
              >
                <CardBody>
                  {LANGUAGES?.map((x, i) => (
                    <Row
                      key={x.value}
                      className={LANGUAGES?.length > i + 1 ? "mb-2" : ""}
                    >
                      <Checkbox
                        className="mr-2"
                        checked={x.value === props.locale}
                        onChange={() => props.setLanguage(x.value)}
                      />
                      <TextSpan className="ml-1" apparence="s2">
                        {x.label}
                      </TextSpan>
                    </Row>
                  ))}
                </CardBody>
              </Card>
            </>
          }
        >
          <ButtonStyled
            size="Tiny"
          >
            <EvaIcon name="globe" className="mr-1" />
            {props.locale}
          </ButtonStyled>
        </Popover>
      </DivStyled>
    </>
  );
};

const mapStateToProps = (state) => ({
  locale: state.settings.locale,
});

const mapDispatchToProps = (dispatch) => ({
  setLanguage: (locale) => {
    dispatch(setLanguage(locale));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLanguage);
