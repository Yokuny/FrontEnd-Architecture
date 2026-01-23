import React from "react";
import { FormattedMessage } from "react-intl";
import { FasSpan } from "../components/FasSpan";
import { useIntl } from "react-intl";

export default function RatingData({ data }) {
  const intl = useIntl();

  if (!data) return null;
  return <>
    {data?.rating &&
      <FasSpan
        breakPoint={{ lg: 6, md: 6 }}
        title="rating"
        text={<FormattedMessage id={data?.rating} />}
        className="mb-4"
      />}

    {data.ratingDescription &&
      <FasSpan
        breakPoint={{ lg: 6, md: 6 }}
        title="justification.label"
        text={data.ratingDescription}
        className="mb-4"
      />}

    {data.partial &&
      <FasSpan
        breakPoint={{ lg: 12, md: 12 }}
        title="partial.execution.label"
        text={intl.formatMessage({ id: data?.partial})}
        className="mb-4"
      />}

    {!!data.questions
      && Object.keys(data.questions)
        .map((questionId, index) => (
          !!Object.keys(data.questions[questionId]).length ?
            <FasSpan
              key={index}
              breakPoint={{ lg: 6, md: 6 }}
              title={`question.${index + 1}`}
              text={<FormattedMessage id={data.questions[questionId].value} />}
              className="mb-4"
            /> : <></>
        ))}
  </>
}
