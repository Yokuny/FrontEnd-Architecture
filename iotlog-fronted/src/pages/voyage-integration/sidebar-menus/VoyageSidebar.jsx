import React from 'react';
import { Button, EvaIcon, InputGroup, Row, SidebarBody, Spinner } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import { debounce } from "underscore";
import { connect } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import { Fetch } from "../../../components";
import ItemVoyageIntegration from './../details/ItemVoyageIntegration';
import { setAssetIntegrationVoyageSelect, setIntegrationVoyage } from '../../../actions';
import { LoadingList } from '../../fleet/LoadingList';

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const ListItemStyled = styled.div`
  display: flex;
  justify-content: center;
`

const SpinnerThemed = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const MAX_VOYAGES = 10

const VoyageSidebar = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [filter, setFilter] = React.useState({
    text: searchParams.get('code'),
    total: 0,
    page: 0
  });
  const currentAsset = React.useRef();

  const intl = useIntl();

  const { assetSelect } = props;

  React.useEffect(() => {
    if (props.isReady && assetSelect) {
      getData(filter);
    }

    return () => {
      setData([]);
    }
  }, [props.enterprises, props.isReady, assetSelect]);

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
    queryFilters.push(`idMachine=${assetSelect.idMachine}`);
    queryFilters.push(`page=${filterParams.page}`);
    queryFilters.push(`size=${MAX_VOYAGES}`);

    Fetch.get(`/voyageintegration/list?${queryFilters.join("&")}`)
      .then((response) => {
        const data = response.data?.data || [];
        if (filterParams.page === 0 ||
          (currentAsset.current &&
            currentAsset.current !== assetSelect.idMachine)) {
          setData(data);
        } else {
          setData((prevData) => [...(prevData || []), ...data]);
        }

        currentAsset.current = assetSelect.idMachine;

        setFilter({
          page: filterParams.page,
          text: filterParams.text,
          total: response.data.pageInfo?.length ? response.data.pageInfo[0]?.count : 0
        })

        const codeSelected = searchParams.get('code')
        if (codeSelected && !filterParams?.isCleanOldText) {
          setTimeout(() => {
            onSelect(response.data?.data?.find(x => x.code === codeSelected))
          }, 100)
        }

        if (filterParams?.isCleanOldText) {
          setSearchParams('')
          onSelect(undefined)
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changeValueDebounced = debounce((value) => {
    getData({
      ...filter,
      text: value,
      page: 0,
      isCleanOldText: true
    });
  }, 500);

  const onSelect = (voyageSelect) => {
    props.setIntegrationVoyage(voyageSelect);
  }

  const onLoadMore = () => {
    getData({
      ...filter,
      page: filter.page + 1,
    });
  }

  const onClose = () => {
    props.setIntegrationVoyage(undefined);
    props.setAssetIntegrationVoyageSelect(undefined);
  }

  if (!assetSelect) {
    return <></>
  }

  return (
    <>
      <Row className='m-0' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
        <InputGroup className="m-3" fullWidth>
          <input
            placeholder={intl.formatMessage({ id: "search" })}
            type="text"
            onChange={(e) => changeValueDebounced(e.target.value)}
            defaultValue={searchParams.get('code') || ''}
          />
          <ContainerIcon onClick={() => { }}>
            <EvaIcon name="search-outline" status="Basic" />
          </ContainerIcon>
        </InputGroup>
        <div className='pt-4 mr-2'>
          <Button
            onClick={onClose}
            status='Danger'
            appearance="ghost"
            size='Tiny'
            style={{ padding: 3 }}>
            <EvaIcon name="close-outline" />
          </Button>
        </div>
      </Row>

      {isLoading ? (
        <LoadingList
          showMoreThanOne
        />
      ) : (
        <>
          {data?.map((voyage, i) =>
            <ItemVoyageIntegration
              isActive={props.integrationVoyageSelect?.idVoyage === voyage?.idVoyage}
              item={voyage} key={i} onClick={() => onSelect(voyage)} />)}
        </>
      )}

      {MAX_VOYAGES * (filter?.page + 1) <= filter?.total && (
        <ListItemStyled className="mb-2 mt-4">
          {isLoading && filter?.page > 0 && <SpinnerThemed style={{ position: 'relative' }} status="Primary" size="Small" />}
          {!isLoading && <Button size="Small" onClick={onLoadMore}>
            <FormattedMessage id="load.more" />
          </Button>}
        </ListItemStyled>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  integrationVoyageSelect: state.voyage.integrationVoyageSelect,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  assetSelect: state.voyage.assetSelect
});

const mapDispatchToProps = (dispatch) => ({
  setIntegrationVoyage: (integrationVoyageSelect) => {
    dispatch(setIntegrationVoyage(integrationVoyageSelect));
  },
  setAssetIntegrationVoyageSelect: (integrationAssetSelect) => {
    dispatch(setAssetIntegrationVoyageSelect(integrationAssetSelect));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VoyageSidebar);
