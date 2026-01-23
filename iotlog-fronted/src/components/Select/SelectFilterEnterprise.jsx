import React, { useState } from "react";
import Select from "@paljs/ui/Select";
import styled, { css } from "styled-components";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Fetch } from "../Fetch";
import { setEnteprisesFilter } from "../../actions";
import { SkeletonThemed } from "../Skeleton";

const SelectStyled = styled(Select)`
  @media screen and (max-width: 800px) {
    min-width: 250px;
  }

  @media screen and (max-width: 680px) {
    min-width: 250px;
  }

  @media screen and (max-width: 650px) {
    min-width: 200px;
  }

  @media screen and (max-width: 570px) {
    min-width: 170px;
  }

  @media screen and (max-width: 490px) {
    min-width: 160px;
  }
  @media screen and (max-width: 415px) {
    min-width: 120px;
  }

  @media screen and (max-width: 400px) {
    max-width: 46px;
    min-width: 65px;
  }

  min-width: 300px;
`;

const Img = styled.img`
  object-fit: contain;
  margin-right: 20px;
  max-width: 160px;
  max-height: 40px;

  ${({ noShowLogo = false }) => css`
    @media screen and (max-width: 560px) {
      display: ${noShowLogo ? "none" : "flex"};
    }
  `}

  @media screen and (min-width: 969px) {
    height: 50px;
  }

  @media screen and (max-width: 968px) {
    height: 30px;
  }

  @media screen and (max-width: 400px) {
    width: 60px;
  }
`;

const Content = styled.div`
  @media screen and (max-width: 400px) {
    max-width: 46px;
  }
`;

const ContentSelect = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  @media screen and (max-width: 400px) {
    max-width: 46px;
  }
`;

const Div = styled.div`
  @media screen and (max-width: 379px) {
  }
`;

const THEMES_DARKS = ["cosmic", "dark"];

const SelectFilterEnterprise = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enterprises, setEnterprises] = useState([]);

  React.useEffect(() => {
    searchEnterprises();
  }, []);

  const getSelect = (list) => {
    const identerprisefilter = localStorage.getItem("id_enterprise_filter");
    const enterprisefilter = list.find((x) => x.id === identerprisefilter);
    return enterprisefilter ? enterprisefilter : undefined;
  };

  const searchEnterprises = () => {
    setIsLoading(true);
    Fetch.get(`/enterprise`)
      .then((response) => {
        setEnterprises(response.data);
        if (!props.enterprises?.length) {
          if (response.data?.length === 1) {
            props.setEnteprisesFilter(response.data, response.data);
          } else {
            const selected = getSelect(response.data);
            if (selected) {
              props.setEnteprisesFilter([selected], response.data);
            }
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(true);
      });
  };

  if (enterprises?.length == 1) {
    const source = THEMES_DARKS.includes(props.theme) && enterprises[0]?.imageDark?.url
      ? enterprises[0]?.imageDark?.url
      : enterprises[0]?.image?.url;
    return (
      <>
        <Content>
          <Img
            src={source}
            className="logo"
            alt={enterprises[0]?.name}
          />
        </Content>
      </>
    );
  }

  const onChange = (selected) => {
    if (!selected) {
      props.setEnteprisesFilter([]);
      return;
    }
    const enterpriseFinded = enterprises.find((x) => x.id === selected.value);
    props.setEnteprisesFilter([enterpriseFinded]);
  };

  const enterpriseOptions = enterprises.map((x) => ({
    value: x.id,
    label: `${x.name} / ${x.city} - ${x.state}`,
    name: x.name,
    logo: x.logo,
    image: x.image,
    imageDark: x.imageDark,
  }));

  const enterpriseSelect = enterpriseOptions.find((x) =>
    props.idEnterprises.includes(x.value)
  );

  const source = THEMES_DARKS.includes(props.theme) && enterpriseSelect?.imageDark?.url
    ? enterpriseSelect?.imageDark?.url
    : enterpriseSelect?.image?.url;

  const sourceColor = THEMES_DARKS.includes(props.theme)
    ? `iotlog_white`
    : `iotlog`;

  return (
    <>
      <ContentSelect>
        {isLoading
          ? <SkeletonThemed width={100} height={40} />
          : <>
            <Img
              src={source || require(`../../assets/img/${sourceColor}.png`)}
              className="logo"
              alt={enterpriseSelect ? enterpriseSelect.label : "IoTLog"}
              noShowLogo={!!(props.optionsEnterprises?.length > 1)}
            />
            <Div>
              {!!enterpriseOptions?.length && (
                <SelectStyled
                  isSearchable={false}
                  shape="SemiRound"
                  value={enterpriseSelect}
                  options={enterpriseOptions}

                  onChange={onChange}
                  isLoading={isLoading}
                  menuPosition="fixed"
                  isClearable
                  placeholder={<FormattedMessage id="enterprise" />}
                />
              )}
            </Div>
          </>
        }

      </ContentSelect>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  idEnterprises: state.enterpriseFilter.idEnterprises,
  optionsEnterprises: state.enterpriseFilter.optionsEnterprises,
  theme: state.settings.theme,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setEnteprisesFilter: (enterprises, options) => {
      dispatch(setEnteprisesFilter({ enterprises, options }));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilterEnterprise);
