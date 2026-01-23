import React from 'react';
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui";
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ onClick }) {

  const navigate = useNavigate()

  return (
    <Button
      size="Tiny"
      className="flex-between"
      status="Info"
      appearance="ghost"
      style={{ marginRight: '1rem' }}
      onClick={onClick ? onClick : () => navigate(-1)}
    >
      <EvaIcon name="arrow-ios-back-outline" />
      <FormattedMessage id="back" />
    </Button>
  );
};
