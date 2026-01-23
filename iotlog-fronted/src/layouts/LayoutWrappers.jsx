import DynamicLayout from "./DynamicLayout";
import LayoutWithOutMenu from "./LayoutWithOutMenu";

export const LayoutBasic = ({ children }) => (
  <DynamicLayout
    showHeader={true}
    showSidebar={true}
    showFooter={true}
    columnStyle={{ padding: "4.7rem .7rem", position: "relative" }}>
    {children}
  </DynamicLayout>
);

export const LayoutSmall = ({ children }) => (
  <DynamicLayout
    showHeader={true}
    showSidebar={true}
    showFooter={false}
    isSmallLayout={true}
    columnStyle={{ padding: "4.7rem .7rem", position: "relative" }}>
    {children}
  </DynamicLayout>
);


export const LayoutBasicNoMenu = ({ children }) => (
  <LayoutWithOutMenu showHeader={false} showSidebar={false} showFooter={true}>
    {children}
  </LayoutWithOutMenu>
);

export const LayoutFullScreen = ({ children }) => (
  <DynamicLayout
    showHeader={true}
    showSidebar={true}
    showFooter={false}
    isSmallLayout={true}
    columnStyle={{ padding: "0", position: "relative" }}>
    {children}
  </DynamicLayout>
);
