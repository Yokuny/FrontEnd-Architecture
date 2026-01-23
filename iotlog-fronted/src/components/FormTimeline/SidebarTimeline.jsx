import { Button, EvaIcon, Sidebar, SidebarBody } from '@paljs/ui';
import React from 'react'
import styled from 'styled-components';
import FormTimelineEvents from './FormTimelineEvents';

const SidebarTimelineStyled = styled(Sidebar)`
  width: 18rem;
  height: auto;
  padding: 0 12px;
  top: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  ${({ width = 18 }) => `min-width: ${width}em;`}

  .main-container {
    height: 100%;
    width: 18rem;
  }
`;

export default function SidebarTimeline({ formEvents, onClose }) {
  return (
    <SidebarTimelineStyled property="right" fixed={true} >
      <SidebarBody>
        <Button
          className="mr-2"
          appearance="ghost"
          size="Tiny"
          style={{ marginLeft: "-1.2rem" }}
          onClick={onClose}
        >
          <EvaIcon name="chevron-right-outline" />
        </Button>
        <FormTimelineEvents events={formEvents} />
      </SidebarBody>
    </SidebarTimelineStyled>
  )
}
