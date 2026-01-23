import { Button, Card, CardBody, Checkbox, EvaIcon, Popover } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { setTheme } from "../../actions";
import { TextSpan } from "../../components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const themeOptions = [
  {
    value: "default",
    color: "#a6c1ff",
  },
  {
    value: "dark",
    color: "#192038",
  },
  {
    value: "cosmic",
    color: "#5a37b8",
  },
  {
    value: "corporate",
    color: "#3366ff",
  },
];

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
  right: 24px;
`;

const FooterAuth = (props) => {
  return (
    <>
      <DivStyled>
        <Popover
          className="inline-block"
          trigger="click"
          placement="top"
          key="color"
          overlay={
            <>
              <Card
                style={{
                  marginBottom: 0,
                }}
              >
                <CardBody>
                  {themeOptions?.map((x, i) => (
                    <Row
                      key={x.value}
                      className={themeOptions?.length > i + 1 ? "mb-2" : ""}
                    >
                      <Checkbox
                        className="mr-2"
                        checked={x.value === props.theme}
                        onChange={() => props.setTheme(x.value)}
                      />
                      <EvaIcon name="droplet" options={{ fill: x.color }} />
                      <TextSpan className="ml-1" apparence="s2">
                        <FormattedMessage id={x.value} />
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
            <EvaIcon name="color-palette-outline" />
          </ButtonStyled>
        </Popover>
      </DivStyled>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => {
    dispatch(setTheme(theme));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FooterAuth);
