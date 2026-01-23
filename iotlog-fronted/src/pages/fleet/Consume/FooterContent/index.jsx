import React from "react";
import { Button, EvaIcon } from "@paljs/ui";
import styled, { css } from "styled-components";
import DetailsFooterContent from "./DetailsFooterContent";
import { Fetch } from "../../../../components";

const Content = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}

  height: 120px;
  width: 100%;
  padding: 10px;

  .rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const ButtonClosed = styled(Button)`
  bottom: 73px;
  right: 5px;
  position: absolute;
  padding: 2px;
`


const FooterContentConsume = (props) => {
  const { machineDetails } = props;

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (machineDetails?.machine?.id) {
      getData(machineDetails?.machine?.id);
    }
    return () => {
      setData(undefined);
    };
  }, [machineDetails?.machine?.id]);

  const getData = (idMachine) => {
    setIsLoading(true);
    Fetch.get(`/fleet/consume/machine?idMachine=${idMachine}`)
      .then((response) => {
        setData(response?.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };


  return (
    <>
      <Content>
        <DetailsFooterContent
          isLoading={isLoading}
          data={data}
          machineDetails={machineDetails}
        />

        <ButtonClosed
          size="Tiny"
          status="Danger"
          onClick={props.onClose}
        >
          <EvaIcon name="close-outline" />
        </ButtonClosed>
      </Content>
    </>
  );
};

export default FooterContentConsume;
