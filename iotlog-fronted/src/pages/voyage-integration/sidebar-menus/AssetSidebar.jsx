import React from 'react';
import { EvaIcon, InputGroup, SidebarBody } from "@paljs/ui";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { debounce } from "underscore";
import { connect } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import { Fetch } from "../../../components";
import { SidebarStyled } from "../../fleet/Sidebar/SidebarStyled";
import { setAssetIntegrationVoyageSelect } from '../../../actions';
import { LoadingList } from '../../fleet/LoadingList';
import ItemAsset from '../details/ItemAsset';
import VoyageSidebar from './VoyageSidebar';

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;


const AssetSidebar = (props) => {

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [filter, setFilter] = React.useState({
    text: '',
    total: 0,
    page: 0
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (props.isReady) {
      getData(filter);
    }

    return () => {
      props.setAssetIntegrationVoyageSelect(undefined)
    }
  }, [props.enterprises, props.isReady]);

  const getData = (filterParams) => {
    setIsLoading(true);
    const queryFilters = [];

    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";

    if (idEnterpriseFilter) {
      queryFilters.push(`idEnterprise=${idEnterpriseFilter}`)
    }

    if (filterParams.text) {
      queryFilters.push(`search=${filterParams.text}`);
    }

    const idMachineSelected = searchParams.get("idMachine");
    if (idMachineSelected && !filterParams?.isChangeSearch) {
      queryFilters.push(`idMachine=${idMachineSelected}`);
    }

    Fetch.get(`/voyageintegration/assets?${queryFilters.join("&")}`)
      .then((response) => {
        const data = response.data || [];
        setData(data);

        setFilter({
          text: filterParams.text,
        })
        setIsLoading(false);

        if (idMachineSelected) {
          setTimeout(() => {
            onSelect(data?.find(x => x.idMachine === idMachineSelected))
          }, 100);
        }
        if (filterParams?.isChangeSearch) {
          setSearchParams('')
          onSelect(undefined)
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changeValueDebounced = debounce((value) => {
    getData({
      ...filter,
      text: value,
      isChangeSearch: true
    });
  }, 500);

  const onSelect = (assetSelect) => {
    props.setAssetIntegrationVoyageSelect(assetSelect);
  }

  // if (props.assetSelect) {
  //   return <></>
  // }

  return (
    <>
      <SidebarStyled width={15}>
        <SidebarBody>
          {props.assetSelect
            ? <VoyageSidebar />
            : <>
              <InputGroup fullWidth className="m-3">
                <input
                  placeholder={intl.formatMessage({ id: "search" })}
                  type="text"
                  onChange={(e) => changeValueDebounced(e.target.value)}
                  defaultValue={searchParams.get("search") || ""}
                />
                <ContainerIcon onClick={() => { }}>
                  <EvaIcon name="search-outline" status="Basic" />
                </ContainerIcon>
              </InputGroup>

              {isLoading ? (
                <LoadingList
                  showMoreThanOne={false}
                />
              ) : (
                <>
                  {data?.map((asset, i) =>
                    <ItemAsset
                      isActive={props.assetSelect?.idMachine === asset?.idMachine}
                      item={asset}
                      key={i}
                      onClick={() => onSelect(asset)} />)}
                </>
              )}
            </>
          }
        </SidebarBody>
      </SidebarStyled>
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  assetSelect: state.voyage.assetSelect
});

const mapDispatchToProps = (dispatch) => ({
  setAssetIntegrationVoyageSelect: (integrationAssetSelect) => {
    dispatch(setAssetIntegrationVoyageSelect(integrationAssetSelect));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetSidebar);
