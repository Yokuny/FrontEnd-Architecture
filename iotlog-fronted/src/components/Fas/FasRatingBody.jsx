import * as React from "react";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";

import {
  TextSpan,
} from "../";
import Select from "@paljs/ui/Select";

const QuestionsWrapper = styled.div`
  display: flex;
  gap: 18px;
  flex-direction: column;
  width: 100%;
`;

const questionsInitial = {
  question1: { answer: '' },
  question2: { answer: '' },
  question3: { answer: '' },
  question4: { answer: '' },
  question5: { answer: '' },
  question6: { answer: '' },
  question7: { answer: '' }
};

const FasAddRating = ({ onChange, data }) => {
  const intl = useIntl();
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
  ];

  const [internalRating, setIntenalRating] = React.useState({ partial: PARTIAL_EXECUTION_OPTIONS[1] });
  const [questionsToUpdate, setQuestionsToUpdate] = React.useState(questionsInitial);
  const [ratingFieldsToUpdate, setRatingFieldsToUpdate] = React.useState({});

  React.useEffect(() => {
    if (data) {
      const internalRatingData = {}
      if (data?.rating) {
        internalRatingData.rating = RATINGS.find(
          (rate) => data?.rating === rate.value);;
      }

      if (data?.ratingDescription) {
        internalRatingData.ratingDescription = data?.ratingDescription;
      }

      if (data?.partial) {
        internalRatingData.partial =
        {
          value: data?.partial,
          label: intl.formatMessage({ id: data?.partial })
        }
      }
      setIntenalRating(internalRatingData);

      if (!!Object.entries(data?.questions).length) {
        const parsedQuestions = {};
        Object.entries(data.questions)
          .forEach(([key, value]) => {
            parsedQuestions[key] = {
              answer: {
                value: value.value,
                label: intl.formatMessage({ id: value.value })
              }
            }
          });

        setQuestionsToUpdate(parsedQuestions);
      }
    }
  }, []);

  function handleRatingChange(questionId, value) {
    const newQuestionsToUpdate = {
      ...questionsToUpdate,
      [questionId]: {
        answer: value,
      }
    }

    setQuestionsToUpdate(newQuestionsToUpdate);
    onChange({
      ...ratingFieldsToUpdate,
      questions: Object.fromEntries(
        Object.entries(newQuestionsToUpdate).map(([key, value]) => [key, { value: value.answer.value }])
      ),
    })
  };

  function handleInternalRatingChanges(prop, value) {
    const newRatingFieldsToUpdate = { ...ratingFieldsToUpdate } ?? {};
    newRatingFieldsToUpdate[prop] = prop === "ratingDescription" ? value : value.value;

    setRatingFieldsToUpdate(newRatingFieldsToUpdate);
    setIntenalRating({
      ...internalRating,
      [prop]: value,
    });
    onChange({ ...newRatingFieldsToUpdate, questionsToUpdate });
  }

  return (
    <React.Fragment>
      <Row>
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
            onChange={(value) => { handleInternalRatingChanges("rating", value) }}
            value={internalRating?.rating}
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
              value={internalRating?.ratingDescription}
              onChange={(e) => handleInternalRatingChanges("ratingDescription", e.target.value)}
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
          {Array.from({ length: 7 }).map((_, index) => (
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
                  value={questionsToUpdate[`question${index + 1}`]?.answer || ''}
                  menuPosition="fixed"
                />
              </Col>
            </Row>
          ))}
        </QuestionsWrapper>
        <Col className="mt-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="partial.execution" />
          </TextSpan>
          <Select
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={intl.formatMessage({ id: "partial.execution" })}
            options={PARTIAL_EXECUTION_OPTIONS}
            onChange={(value) => handleInternalRatingChanges("partial", value)}
            value={internalRating?.partial}
            menuPosition="fixed"
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FasAddRating;
