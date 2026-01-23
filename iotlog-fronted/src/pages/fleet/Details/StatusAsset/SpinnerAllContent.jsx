import { Spinner } from "@paljs/ui";
import styled, { useTheme } from "styled-components";

const ContentFull = styled.div`
  height: 100%;
`;

export default function SpinnerAllContent() {
  const theme = useTheme();
  return (
    <>
      <ContentFull>
        <Spinner
          status="Primary"
          style={{ backgroundColor: theme.backgroundBasicColor1 }}
        />
      </ContentFull>
    </>
  );
}
