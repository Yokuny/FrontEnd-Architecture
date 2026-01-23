import React from "react";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, EvaIcon, Row } from "@paljs/ui";
import styled from "styled-components";
import { connect } from "react-redux";
import { Fetch, Modal, TextSpan } from "../../../../components";
import ShowLastData from "../../Filled/ShowLastData";
import MountFormFields from "../../MountFormFields/index";
import WeatherFields from "./WeatherFields";
import NavigationFields from "./NavigationFields";
import DPFields from "./DPFields";

const RowStyled = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  input[type="time"] {
    line-height: 1.1rem;
  }

  #icondate {
    margin-top: -4px;
  }
  #icontime {
    margin-top: -4px;
  }
`;

const stepsOptions = [
  {
    operations: [
      "AM04",
      "AM05",
      "AM13",
      "AM15",
      "OM05",
      "0M19",
      "0M17",
      "OM07",
    ],
    steps: ["main", "weather"],
  },
  {
    operations: ["AM05", "0M19"],
    steps: ["main", "weather", "dp"],
  },
  {
    operations: [
      "NV01",
      "NV02",
      "NV03",
      "NV04",
      "IN01",
      "IN03",
      "IN07",
      "IN08",
      "IN09",
    ],
    steps: ["main", "navigation"],
  },
];

const RVEForm = (props) => {
  const { onClose, formSelected, title, isShow } = props;

  const [isLoading, setIsLoading] = React.useState();
  const [step, setStep] = React.useState("main");
  const [formData, setFormData] = React.useState({});
  const [isLoadingConsumption, setIsLoadingConsumption] = React.useState(false);
  const [isConsumingConsidered, setIsConsumingConsidered] =
    React.useState(false);

  const intl = useIntl();

  const isReadyRef = React.useRef(false);

  React.useEffect(() => {
    if (formSelected?.id) {
      getData(formSelected?.id);
    } else {
      setFormData({
        embarcacao: props.idMachine,
      });
      isReadyRef.current = true;
    }

    return () => {
      setFormData({});
      setStep("main");
      isReadyRef.current = false;
    };
  }, [formSelected]);

  React.useEffect(() => {
    if (!formSelected?.id && props.lastFilled?.atendimento) {
      setFormData((prevstate) => ({
        ...prevstate,
        atendimento: (parseInt(props.lastFilled.atendimento) + 1)
          ?.toString()
          ?.padStart(4, "0"),
      }));
    }
  }, [props.lastFilled]);

  React.useEffect(() => {
    const checkAndCallINCode = async () => {
      const value = formData?.codigoOperacional?.value;
      if (value?.startsWith("IN") && formSelected?.idForm && formSelected?.id) {
        try {
          setIsLoadingConsumption(true);
          const response = await Fetch.get(
            `/formdata/isconsiderconsumptionrve?idForm=${formSelected.idForm}&id=${formSelected.id}`
          );
          setIsConsumingConsidered(
            response?.data?.considerConsumption === true
          );
          setIsLoadingConsumption(false);
        } catch (error) {
          setIsLoadingConsumption(false);
        }
      }
    };

    checkAndCallINCode();
  }, [
    formData?.codigoOperacional?.value,
    formSelected?.idForm,
    formSelected?.id,
  ]);

  const activateConsiderConsumption = async () => {
    if (formSelected?.idForm && formSelected?.id) {
      try {
        const response = await Fetch.patch(
          `/formdata/consumptionconsiderrve?idForm=${formSelected.idForm}&id=${formSelected.id}`
        );

        if (response.data?.considerConsumption) {
          setIsConsumingConsidered(true);
          toast.success(
            intl.formatMessage({
              id: "fillform.consideration.activated",
            })
          );
        }
      } catch (error) {
        toast.error(
          intl.formatMessage({
            id: "fillform.consideration.error",
          })
        );
      }
    }
  };


  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/formdata/rve?id=${id}`)
      .then((response) => {
        setFormData(response.data?.data ? response?.data?.data : {});
        setIsLoading(false);
        isReadyRef.current = true;
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onChangeForm = (prop, value) => {
    if (!isReadyRef.current) {
      return;
    }
    setFormData((prevstate) => ({
      ...prevstate,
      [prop]: value,
    }));
  };

  const validation = props.fields
    ?.filter((x) => x?.isRequired)
    .find((x) => {
      if (!formData) return true;
      if (
        formData[x.name] === undefined ||
        formData[x.name] === null ||
        formData[x.name] === "" ||
        formData[x.name] === 0
      ) {
        return true;
      }
      return false;
    });

  const onSave = () => {
    if (!formSelected.idForm) {
      toast.warn(intl.formatMessage({ id: "form.required" }));
      return;
    }

    if (validation) {
      toast.warn(
        intl
          .formatMessage({ id: "field.required.value" })
          .replace("{0}", validation.description)
      );
      return;
    }

    if (formData.dataHoraInicio && formData.dataHoraFim) {
      if (
        new Date(formData.dataHoraInicio).getTime() >
        new Date(formData.dataHoraFim).getTime()
      ) {
        toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
        return;
      }

      if (
        new Date(formData.dataHoraInicio).getTime() ===
        new Date(formData.dataHoraFim).getTime()
      ) {
        toast.warn(intl.formatMessage({ id: "dates.same" }));
        return;
      }
    }

    setIsLoading(true);
    const dataToSave = {
      id: formSelected.id,
      idForm: formSelected.idForm,
      data: formData,
    };
    Fetch.post(`/formdata`, dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        setFormData({});
        onClose(true);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onNext = () => {
    const steps = [
      ...new Set(
        stepsOptions
          ?.filter((x) =>
            x.operations?.some((y) => y === formData?.codigoOperacional?.value)
          )
          ?.flatMap((x) => x.steps)
      ),
    ];

    if (steps?.length) {
      const index = steps?.findIndex((x) => x === step);
      setStep(steps[index + 1]);
    }
  };

  const onPrevious = () => {
    const steps = [
      ...new Set(
        stepsOptions
          ?.filter((x) =>
            x.operations?.some((y) => y === formData?.codigoOperacional?.value)
          )
          ?.flatMap((x) => x.steps)
      ),
    ];

    if (steps?.length) {
      const index = steps?.findIndex((x) => x === step);
      setStep(index === 0 ? "main" : steps[index - 1]);
    }
  };

  const getIsNextStep = () => {
    const isStep = stepsOptions
      ?.flatMap((x) => x.operations)
      ?.some((x) => x === formData?.codigoOperacional?.value);
    if (isStep) {
      const steps = [
        ...new Set(
          stepsOptions
            ?.filter((x) =>
              x.operations?.some(
                (y) => y === formData?.codigoOperacional?.value
              )
            )
            ?.flatMap((x) => x.steps)
        ),
      ];
      if (steps?.length) {
        return !(steps[steps?.length - 1] === step);
      }
      return false;
    }

    return false;
  };

  const allFieldsRequiredIsFilled = () => {
    if (step === "main") {
      return validation;
    }

    if (step === "weather") {
      return (
        !formData?.direcaoVento ||
        !formData?.direcaoCorrente ||
        !formData?.velocidadeVento ||
        !formData?.velocidadeCorrente ||
        !formData?.direcaoSwell ||
        !formData?.alturaSwell
      );
    }

    if (step === "navigation") {
      return !formData?.eta;
    }

    if (step === "dp") {
      return (
        !formData?.potenciaThruster ||
        !formData?.aproamentoEmbarcacao ||
        !formData?.aproamentoUnidade
      );
    }

    return false;
  };

  const isNextStep = getIsNextStep();

  return (
    <>
      <Modal
        textTitle={title}
        onClose={() => onClose(false)}
        show={isShow}
        styleContent={{ maxHeight: "calc(100vh - 220px)", overflowX: "hidden" }}
        size="ExtraLarge"
        renderFooter={() => (
          <CardFooter>
            <Row
              end={step === "main" && "xs"}
              between={step !== "main" && "xs"}
              className="m-0"
              middle="xs"
              style={{ width: "100%" }}
            >
              {/* Botão "Considerar Consumo" no canto esquerdo */}
              {formData?.codigoOperacional?.value?.startsWith("IN") &&
              formSelected.id &&
              !isLoadingConsumption &&
              (
                <div style={{ flex: 1 }}>
                  {!isConsumingConsidered ? (
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      className="flex-between"
                      onClick={activateConsiderConsumption}
                    >
                      <EvaIcon
                        className="mr-1"
                        name={"droplet-outline"}
                      />
                      <FormattedMessage
                        id="fillform.consider.consumption"
                      />
                    </Button>
                  ) : (
                    <Row middle="xs" className="m-0">
                      <EvaIcon
                        name="info-outline"
                        status="Warning"
                        className="mr-1"
                      />
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage
                          id="fillform.considering.consumption"
                        />
                      </TextSpan>
                    </Row>
                  )}
                </div>
              )}

              {/* Botões padrão (Anterior / Salvar / Próximo) */}
              <div style={{ display: "flex", gap: 8 }}>
                {step !== "main" && (
                  <Button
                    size="Small"
                    onClick={() => onPrevious()}
                    appearance="ghost"
                    className="mr-1 flex-between"
                    status="Info"
                  >
                    <EvaIcon className="mr-1" name={"arrow-ios-back-outline"} />
                    <FormattedMessage id={"previous"} />
                  </Button>
                )}
                <Button
                  size="Small"
                  status={isNextStep ? "Primary" : "Success"}
                  onClick={() => (isNextStep ? onNext() : onSave())}
                  disabled={isLoading || allFieldsRequiredIsFilled()}
                  className="mr-1 flex-between"
                >
                  {!isNextStep && (
                    <EvaIcon className="mr-1" name={"save-outline"} />
                  )}
                  <FormattedMessage id={isNextStep ? "next" : "save"} />
                  {isNextStep && (
                    <EvaIcon
                      className="ml-1"
                      name={"arrow-ios-forward-outline"}
                    />
                  )}
                </Button>
              </div>
            </Row>
          </CardFooter>
        )}
      >
        <RowStyled>
          {step === "weather" ? (
            <WeatherFields
              onChange={(prop, value) => onChangeForm(prop, value)}
              data={formData}
            />
          ) : step === "navigation" ? (
            <NavigationFields
              onChange={(prop, value) => onChangeForm(prop, value)}
              data={formData}
            />
          ) : step === "dp" ? (
            <DPFields
              onChange={(prop, value) => onChangeForm(prop, value)}
              data={formData}
            />
          ) : (
            <>
              {!formSelected?.id && (
                <ShowLastData
                  dateEnd={formData?.dataHoraInicio}
                  idMachine={formData?.embarcacao}
                />
              )}
              <MountFormFields
                idForm={formSelected?.idForm}
                onChange={(prop, value) => onChangeForm(prop, value)}
                data={formData}
              />
            </>
          )}
        </RowStyled>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  fields: state.form.form?.fields,
  form: state.form.form,
  lastFilled: state.formBoard.lastFilled,
});

export default connect(mapStateToProps, undefined)(RVEForm);
