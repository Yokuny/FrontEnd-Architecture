import React from 'react';
import { ItemStyle } from '@paljs/ui/Accordion/style';
import { EvaIcon } from '@paljs/ui';
import styled from 'styled-components';

const Div = styled.div`
  display: flex;
  align-items: center;
`

export const AccordionItem = ({ title, uniqueKey, disabled, children }) => {

  const [expanded, setExpanded] = React.useState(false)

  const cssStyle = [];
  expanded ? cssStyle.push('expanded') : cssStyle.push('collapsed');
  disabled && cssStyle.push('disabled');

  const onExpand = (e) => {
    e.preventDefault();
    setExpanded(prevState => !prevState)
  }

  return (
    <ItemStyle className={cssStyle.join(' ')}>
      <header onClick={onExpand}>
        {title}
        <Div>
        {!disabled && expanded ? (
          <EvaIcon className="expansion-indicator" name="chevron-up-outline" />
        ) : (
          <EvaIcon className="expansion-indicator" name="chevron-down-outline" />
        )}
        </Div>
      </header>
      {expanded && <div uniqueKey={uniqueKey} className={expanded ? 'expanded' : 'collapsed'}>
        <div className="item-body">{children}</div>
      </div>}
    </ItemStyle>
  );
};
