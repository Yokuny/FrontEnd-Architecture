import React from 'react';
import styled, { useTheme } from 'styled-components';

const Input = styled.input`
    height: 2.5rem;
    width: 5rem;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.outlineColor};
    border-radius: 2px;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.outlineColor};
`;

const generatePastelColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (getBrightness(color) < 128);

  return color;
};

const getBrightness = (hex) => {
  const rgb = parseInt(hex.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

const ColorPickerPastel = ({ value, onChange, numberOfPastelColors = 10 }) => {
  const theme = useTheme();

  const handleChange = (e) => {
    onChange("color", e.target.value);
  };

  const pastelColors = Array.from({ length: numberOfPastelColors }, () => generatePastelColor());

  return (
    <>
      <Input
        type="color"
        value={value}
        onChange={handleChange}
        list="color-options"
      />
      <datalist id="color-options">
        {pastelColors.map((color, index) => (
          <option key={index} value={color} />
        ))}
      </datalist>
    </>
  );
};

export default ColorPickerPastel;
