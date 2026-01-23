import React, { useState } from "react";
import styled from "styled-components";
import { SidebarBody } from "@paljs/ui/Sidebar";
import { Tab, Tabs } from "@paljs/ui/Tabs";
import { useSearchParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import Filter from "./../Search/Filter";
import { SidebarStyled } from "./../Sidebar/SidebarStyled";
import ContentAssets from "../ContentAssets";
import ContentVoyages from "../ContentVoyages";
import { setIsShowList } from "../../../actions";
import FleetDetails from "../Details";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 5rem;
  z-index: 1000;
  border-radius: 12px;
  height: 100%;
  display: flex;
  padding: 5rem 0 .5rem 0;
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    left: ${(props) => (props.isExpanded ? "5rem" : "0.6rem")};
  }
`;

const tryParseFilter = () => {
  try {
    return {
      filteredModel: JSON.parse(
        localStorage.getItem("filter_model_fleet") || "[]"
      ),
      filteredMachine: JSON.parse(
        localStorage.getItem("filter_machine_fleet") || "[]"
      ),
    };
  } catch {
    return undefined;
  }
};

const MyListFleet = (props) => {
  const intl = useIntl();

  const [searchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(searchParams.get("idVoyage") && searchParams.get("codeVoyage") ? 1 : 0);
  const [showListFilter, setShowListFilter] = useState(false);
  const [filterFind, setFilterFind] = useState(tryParseFilter());
  const [textFilter, setTextFilter] = useState(searchParams.get("idVoyage") && searchParams.get("codeVoyage") ? searchParams.get("codeVoyage") : "");

  if (props.filterPortActivity?.type) {
    return null
  }

  const assetOrVoyageSelected = !!(!!props.machineDetailsSelected || !!props.travelDetailsSelected);

  return (
    <Container isExpanded={props.toggleMenu}>
      <SidebarStyled
        className={!props.isShowList && "hidden-content"}>
        <SidebarBody>
          <div style={{ display: assetOrVoyageSelected ? 'block' : 'none' }}>
            <FleetDetails />
          </div>
          
          <div style={{ display: assetOrVoyageSelected ? 'none' : 'block' }}>
            <Filter
              defaultValue={textFilter}
              filterFind={filterFind}
              setFilterFind={setFilterFind}
              setTextFilter={setTextFilter}
              showListFilter={showListFilter}
              setShowListFilter={(value) => setShowListFilter(value)}
              setBtnEvent={() => props.setIsShowList(false)}
            />

            {!showListFilter && (
              <>
                <Tabs className="mt-2" fullWidth onSelect={(i) => setActiveIndex(i)} activeIndex={activeIndex}>
                  <Tab
                    style={{ padding: 0 }}
                    responsive
                    title={intl.formatMessage({ id: "active.owner" })}
                  >
                    <ContentAssets
                      textFilter={textFilter}
                      filterFind={filterFind}
                    />
                  </Tab>
                  <Tab responsive title={intl.formatMessage({ id: "travel" })}>
                    <ContentVoyages textFilter={textFilter} filterFind={filterFind} />
                  </Tab>
                </Tabs>
              </>
            )}
          </div>
        </SidebarBody>
      </SidebarStyled>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isShowList: state.fleet.isShowList,
  filterPortActivity: state.map.filterPortActivity,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  toggleMenu: state.settings.toggleMenu || state.menu.menuState === 'expanded',
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowList: (isShow) => {
    dispatch(setIsShowList(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyListFleet);
