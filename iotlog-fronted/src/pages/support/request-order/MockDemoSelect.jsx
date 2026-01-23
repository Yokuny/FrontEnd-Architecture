import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { useFetchSupport } from "../../../components/Fetch/FetchSupport";

const MockDemoSelect = ({ idEnterprise, onChange, value }) => {
  const intl = useIntl();

  // const data = [
  //   {
  //     id: 1,
  //     Local: "UCE - Sede OR",
  //     Bloco: "CMC",
  //     Andar: "Térreo",
  //     Unidade: "Apt. 101",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 2,
  //     Local: "UCE - Sede OR",
  //     Bloco: "CMC",
  //     Andar: "Térreo",
  //     Unidade: "Apt. 102",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 3,
  //     Local: "UCE - Sede OR",
  //     Bloco: "CMC",
  //     Andar: "Térreo",
  //     Unidade: "Apt. 103",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 4,
  //     Local: "UCE - Sede OR",
  //     Bloco: "Memorial",
  //     Andar: "Térreo",
  //     Unidade: "Geral",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 5,
  //     Local: "UCE - Sede OR",
  //     Bloco: "Memorial",
  //     Andar: "1º andar",
  //     Unidade: "Geral",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 6,
  //     Local: "UCE - Sede OR",
  //     Bloco: "Comunidade CMC",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 7,
  //     Local: "UCE - Sede OR",
  //     Bloco: "Sede Administrativa",
  //     Andar: "Térreo",
  //     Unidade: "Geral",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 8,
  //     Local: "UCE - Sede OR",
  //     Bloco: "Sede Administrativa",
  //     Andar: "Mezanino",
  //     Unidade: "Sala de Ideias",
  //     Cidade: "Curitiba",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Bandeira_de_Curitiba.svg/364px-Bandeira_de_Curitiba.svg.png"
  //     }
  //   },
  //   {
  //     id: 9,
  //     Local: "Casa de Veraneio Boracéia",
  //     Bloco: "Residência",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Boracéia",
  //     Estado: "SP",
  //     image: {
  //       url: "https://www.boraceia.sp.gov.br/fotos/25323ecfee0c7e794b036b6868b04fb4.jpg"
  //     }
  //   },
  //   {
  //     id: 10,
  //     Local: "Centro de Formação Itapejara D'Oeste",
  //     Bloco: "Residência",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Itapejara D'Oeste",
  //     Estado: "PR",
  //     image: {
  //       url: "http://www.educadores.diaadia.pr.gov.br/modules/galeria/uploads/2/normal_1522672030bandeira_itapejaradoeste.png"
  //     }
  //   },
  //   {
  //     id: 11,
  //     Local: "Comunidade Chapecó",
  //     Bloco: "Residência",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Chapecó",
  //     Estado: "SC",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/0/04/Bandeira_de_Chapec%C3%B3.JPG"
  //     }
  //   },
  //   {
  //     id: 12,
  //     Local: "Comunidades Maringá",
  //     Bloco: "Residência",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Maringá",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bandeira_de_Maring%C3%A1_-_PR.svg/1125px-Bandeira_de_Maring%C3%A1_-_PR.svg.png"
  //     }
  //   },
  //   {
  //     id: 13,
  //     Local: "Comunidades Ponta Grossa",
  //     Bloco: "Residência",
  //     Andar: "Único",
  //     Unidade: "Geral",
  //     Cidade: "Ponta Grossa",
  //     Estado: "PR",
  //     image: {
  //       url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Bandeira_ponta_grossa.png"
  //     }
  //   },
  // ];

  const { isLoading, data } = useFetchSupport(
    `/unit/findmany`,
    {
      method: "get",
    }
  );

  const options = data?.map((x) => ({
    value: x.id,
    label: `${x.name} / ${x.city} - ${x.state}`,
    idEnterprise: idEnterprise,
    image: "",
  }));

  return (
    <React.Fragment>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: "support.product.placeholder",
        })}
        onChange={onChange}
        value={value}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: !idEnterprise ? "select.first.enterprise" : "nooptions.message",
          })
        }
      />
    </React.Fragment>
  );
};
export default MockDemoSelect;
