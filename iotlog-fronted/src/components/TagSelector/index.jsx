import React, { useState } from "react";
import { EvaIcon, InputGroup, Button } from "@paljs/ui";
import styled from "styled-components";
import { useIntl } from "react-intl";

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${(props) => props.theme.backgroundBasicColor3};
  color: ${(props) => props.theme.textBasicColor};
  border: 1px solid ${(props) => props.theme.borderBasicColor4};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${(props) => props.theme.backgroundBasicColor4};
    border-color: ${(props) => props.theme.borderBasicColor5};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textHintColor};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${(props) => props.theme.colorDanger600};
  }
`;

const SuggestionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SuggestionTag = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: ${(props) => props.theme.backgroundBasicColor2};
  color: ${(props) => props.theme.textBasicColor};
  border: 1px dashed ${(props) => props.theme.borderBasicColor4};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colorPrimary100};
    border-color: ${(props) => props.theme.colorPrimary400};
    border-style: solid;
    color: ${(props) => props.theme.colorPrimary700};
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DEFAULT_SUGGESTIONS = [
  "qualidade",
  "engenharia",
  "importante",
  "urgente",
  "documentação",
];

const TagSelector = ({ value = [], onChange, suggestions = DEFAULT_SUGGESTIONS }) => {
  const [inputValue, setInputValue] = useState("");
  const intl = useIntl();

  const handleAdd = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    if (!value.includes(suggestion)) {
      onChange([...value, suggestion]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const availableSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div>
      <InputContainer>
        <InputGroup fullWidth>
          <input
            type="text"
            placeholder={intl.formatMessage({ id: "type.new.tag" })}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputGroup>
        <Button
          size="Small"
          status="Primary"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <EvaIcon name="plus-outline" />
        </Button>
      </InputContainer>

      {/* Tags selecionadas */}
      {value.length > 0 && (
        <TagContainer>
          {value.map((tag, index) => (
            <Tag key={index}>
              {tag}
              <RemoveButton onClick={() => handleRemove(tag)}>
                <EvaIcon name="close-outline" size="Small" />
              </RemoveButton>
            </Tag>
          ))}
        </TagContainer>
      )}

      {/* Sugestões disponíveis */}
      {availableSuggestions.length > 0 && (
        <SuggestionContainer>
          {availableSuggestions.map((suggestion, index) => (
            <SuggestionTag
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <EvaIcon name="plus-outline" size="Small" /> {suggestion}
            </SuggestionTag>
          ))}
        </SuggestionContainer>
      )}
    </div>
  );
};

export default TagSelector;

