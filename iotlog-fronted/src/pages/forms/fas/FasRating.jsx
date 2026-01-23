import * as React from "react";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { translate } from "../../../components/language";

import {
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { Button } from "@paljs/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Select from "@paljs/ui/Select";
import { FasSpan } from "./components/FasSpan";
import moment from "moment";
import BackButton from "../../../components/Button/BackButton";

const QuestionsWrapper = styled.div`
  display: flex;
  gap: 18px;
  flex-direction: column;
  width: 100%;
`;

const RowFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
`

const questionsInitial = {
  question1: { answer: '' },
  question2: { answer: '' },
  question3: { answer: '' },
  question4: { answer: '' },
  question5: { answer: '' },
  question6: { answer: '' },
  question7: { answer: '' }
};

const FasAddRating = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const RATINGS = [
    { value: 'rating.satisfactory', label: intl.formatMessage({ id: "rating.satisfactory" }) },
    { value: 'rating.regular', label: intl.formatMessage({ id: "rating.regular" }) },
    { value: 'rating.unsatisfactory', label: intl.formatMessage({ id: "rating.unsatisfactory" }) },
  ];

  const RATINGS_ALT = [
    { value: "rating.meets", label: intl.formatMessage({ id: "rating.meets" }) },
    { value: "rating.partially", label: intl.formatMessage({ id: "rating.partially" }) },
    { value: "rating.does.not.meet", label: intl.formatMessage({ id: "rating.does.not.meet" }) },
    { value: "rating.not.applicable", label: intl.formatMessage({ id: "rating.not.applicable" }) },
  ];

  const PARTIAL_EXECUTION_OPTIONS = [
    {
      value: "partial.execution",
      label: intl.formatMessage({ id: "partial.execution" })
    },
    {
      value: "complete.execution",
      label: intl.formatMessage({ id: "complete.execution" })
    },
  ]

  const [data, setData] = React.useState([]);
  const [selectedRating, setSelectedRating] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [questions, setQuestions] = React.useState(questionsInitial)

  const [searchParams, setSearchParams] = useSearchParams();
  const fasId = searchParams.get("id");
  const notRealized = searchParams.get("not-realized")
  const [partialExecutionValue, setPartialExecutionValue] = React.useState(PARTIAL_EXECUTION_OPTIONS[1]);
  const [isLoading, setIsLoading] = React.useState(false);


  const isRatingFull = (alert = false) => {
    if (!selectedRating.value || selectedRating.value === "") {
      if (alert) toast.error(translate("rating.required"));
      return false;
    }

    if (!rating) {
      if (alert) toast.error(translate("ratingDescription.required"));
      return false;
    }

    if (notRealized && !partialExecutionValue) {
      if (alert) toast.error(translate("partialExecutionValue.required"));
      return false;
    }

    for (const [key, value] of Object.entries(questions)) {
      if (!value.answer) {
        if (alert) toast.error(translate("questions.required"));
        return false;
      }
    }

    return true;
  }

  const onSave = async () => {
    const ratingFull = isRatingFull(true);

    if (!ratingFull) {
      return;
    }

    const fasRating = {
      id: fasId,
      rating: selectedRating.value,
      ratingDescription: rating,
      ...(partialExecutionValue && { partial: partialExecutionValue.value }),
      questions: Object.fromEntries(
        Object.entries(questions).map(([key, value]) => [key, { value: value.answer.value }])
      ),
    };

    setIsLoading(true);
    try {
      const response = await Fetch.post("/fas/add-rating", fasRating);
      setIsLoading(false);
      navigate(-1);
    } catch (e) {
      setIsLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    getData()
  }, [])


  const getData = () => {
    if (!fasId) {
      return;
    }
    setIsLoading(true);
    Fetch.get(`/fas/find-fas-order?id=${fasId}`)
      .then(response => {
        setData(response.data ? response.data : []);
        if (response?.data?.rating) {
          const ratingSelectValue = RATINGS.find(
            (rate) => response?.data?.rating === rate.value);
          setSelectedRating(ratingSelectValue);
        }

        if (response?.data?.ratingDescription) {
          setRating(response?.data?.ratingDescription);
        }

        if (!!Object.entries(response?.data?.questions).length) {
          const parsedQuestions = {};
          Object.entries(response.data.questions)
            .forEach(([key, value]) => {
              parsedQuestions[key] = {
                answer: {
                  value: value.value,
                  label: intl.formatMessage({ id: value.value })
                }
              }
            });

          setQuestions(parsedQuestions);
        }

        if (response?.data?.partial) {
          setPartialExecutionValue(
            {
              value: response?.data?.partial,
              label: intl.formatMessage({ id: response?.data?.partial })
            }
          )
        }
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  function handleRatingChange(questionId, value) {
    setQuestions({
      ...questions,
      [questionId]: {
        answer: value,
      },
    });
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <RowFlex>
            <BackButton />
            <FormattedMessage id="rating" />
          </RowFlex>
        </CardHeader>
        <CardBody>
          <Row>
            <FasSpan
              breakPoint={{ lg: 3, md: 3 }}
              title="os"
              text={data.name}
            />
            <FasSpan
              breakPoint={{ lg: 3, md: 3 }}
              title="vessel"
              text={data.fasHeader?.vessel?.name}
            />

            <FasSpan
              breakPoint={{ lg: 3, md: 3 }}
              title="type"
              text={data.fasHeader?.type}
            />

            <FasSpan
              breakPoint={{ lg: 3, md: 3 }}
              title="service.date"
              text={moment(data.fasHeader?.serviceDate).format("DD MMM YYYY HH:mm")}
            />

            <FasSpan
              breakPoint={{ lg: 12, md: 12 }}
              title="local"
              text={data.fasHeader?.local}
            />

            <FasSpan
              breakPoint={{ lg: 12, md: 12 }}
              title="description"
              text={data.description}
            />

            <FasSpan
              title="add.request"
              text={data.requestOrder}
            />

            <FasSpan
              title="buy.request"
              text={data.buyRequest}
            />

            <FasSpan
              title="materialFas.label"
              text={data.materialFas}
            />
            <FasSpan
              title="materialFas.code.label"
              text={data.materialFasCode}
            />
            <FasSpan
              title="onboardMaterialFas.label"
              text={data.onboardMaterial}
            />
            <FasSpan
              title="rmrbFas.label"
              text={data.rmrb}
            />
            <FasSpan
              title="rmrbFas.code.label"
              text={data.rmrbCode}
            />

            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="rating" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <Select
                noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
                placeholder={intl.formatMessage({
                  id: "rating",
                })}
                options={RATINGS}
                onChange={(value) => { setSelectedRating(value) }}
                value={selectedRating}
                menuPosition="fixed"
              />
            </Col>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="justification" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth className="mt-1">
                <textarea
                  placeholder={intl.formatMessage({
                    id: "support.rating.placeholder",
                  })}
                  maxLength={3000}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  rows={5}
                />
              </InputGroup>
            </Col>
            <QuestionsWrapper >

              <Col>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="question.title" />
                </TextSpan>
              </Col>
              {questions && Array.from({ length: 7 }).map((_, index) => (
                <Row key={index} className="m-0 pl-1 pr-1">
                  <Col breakPoint={{ md: 9 }}>
                    <TextSpan apparence="s2">
                      {index + 1}. <FormattedMessage id={`question.${index + 1}`} />
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 3 }}>
                    <Select
                      noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
                      placeholder={intl.formatMessage({ id: "rating" })}
                      options={RATINGS_ALT}
                      onChange={(value) => handleRatingChange(`question${index + 1}`, value)}
                      value={questions[`question${index + 1}`]?.answer || ''}
                      menuPosition="fixed"
                    />
                  </Col>
                </Row>
              ))}
            </QuestionsWrapper>
            <Col className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="partial.execution" />
              </TextSpan>
              <Select
                noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
                placeholder={intl.formatMessage({ id: "partial.execution" })}
                options={PARTIAL_EXECUTION_OPTIONS}
                onChange={setPartialExecutionValue}
                value={partialExecutionValue}
                menuPosition="fixed"
              />
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row className="m-0" between="xs">
            <BackButton />
            <Button
              size="Small"
              onClick={onSave}
              disabled={!isRatingFull()}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

export default FasAddRating;
