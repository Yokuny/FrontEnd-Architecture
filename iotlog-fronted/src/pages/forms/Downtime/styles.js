import { Row } from '@paljs/ui';
import styled from 'styled-components';

export const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

export const Ul = styled.ul`
  padding: 0;
`;

export const Li = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;

  &:hover {
    color: #888;
  }
`;
