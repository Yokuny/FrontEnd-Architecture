import React from 'react';
import { styled } from 'styled-components';

const Bus = styled.div`
  height: 8px;
  width: 100%;
  background-color: #66c28c;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

const Line = (props) => {
    return (
        <Bus/>
    );
};

export default Line;