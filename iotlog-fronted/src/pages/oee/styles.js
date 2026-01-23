import { Row } from '@paljs/ui';
import styled from 'styled-components';

export const ColFlex = styled.div`
  padding-left: 8px;
  display: flex;
  flex-direction: column;
`

export const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`

export const ContainerRow = styled(Row)`
  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;
