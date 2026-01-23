import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.label`
  position: relative;
  width: 48px;
  height: 20px;
  border-radius: 2px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const Slider = styled.div`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colorPrimaryTransparent400};
  transition: 0.4s;
  border-radius: 2px;
  
  &:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 2px;
  }
`;

const Input = styled.input`
  display: none;
  &:checked + ${Slider} {
    background-color: ${props => props.theme.colorPrimary500};
  }
  &:checked + ${Slider}:before {
    transform: translateX(26px);
  }
`;

export default function Switch({ onChange, checked }) {

  return (
    <Wrapper>
      <Input type="checkbox" checked={checked} onChange={onChange} />
      <Slider />
    </Wrapper>
  );
}