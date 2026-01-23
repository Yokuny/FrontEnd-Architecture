import { CONDITIONS } from "../../../constants";

class ConditionBase {}

class ConditionLess extends ConditionBase {
  getResult(a, b) {
    return a < parseFloat(b);
  }
}
class ConditionDifferent extends ConditionBase {
  getResult(a, b) {
    return a != b;
  }
}
class ConditionEqual extends ConditionBase {
  getResult(a, b) {
    return a == b;
  }
}
class ConditionMore extends ConditionBase {
  getResult(a, b) {
    return a > parseFloat(b);
  }
}
class ConditionMoreOrEqual extends ConditionBase {
  getResult(a, b) {
    return a >= parseFloat(b);
  }
}
class ConditionLessOrEqual extends ConditionBase {
  getResult(a, b) {
    return a <= parseFloat(b);
  }
}
class ConditionBetween extends ConditionBase {
  getResult(a, b) {
    try {
      const conditionsSliced = b.split(",");
      const min = conditionsSliced[0];
      const max = conditionsSliced[1];
      return a >= parseFloat(min) && a <= parseFloat(max);
    } catch {
      return false;
    }
  }
}

class ConditionDefault extends ConditionBase {
  getResult(a, b) {
    return false;
  }
}

class ConditionFactory {
  createConditionExpressor(typeCondition) {
    switch (typeCondition) {
      case CONDITIONS.LESS_THAN:
        return new ConditionLess();
      case CONDITIONS.LESS_THAN_OR_EQUAL:
        return new ConditionLessOrEqual();
      case CONDITIONS.GREAT_THAN:
        return new ConditionMore();
      case CONDITIONS.GREAT_THAN_OR_EQUAL:
        return new ConditionMoreOrEqual();
      case CONDITIONS.EQUAL:
        return new ConditionEqual();
      case CONDITIONS.DIFFERENT:
        return new ConditionDifferent();
      case CONDITIONS.BETWEEN:
        return new ConditionBetween();
      default:
        return new ConditionDefault();
    }
  }
}

export const getCondition = (typeCondition, valueAtual, valueConfig) => {
  const expressor = new ConditionFactory().createConditionExpressor(
    typeCondition
  );
  try {
    return expressor.getResult(valueAtual, valueConfig);
  } catch {
    return false;
  }
};

export const getColorConditionList = (
  conditionsList,
  valueAtual,
  colorDefault
) => {
  const colorConditionFinded = conditionsList
    ?.sort((a, b) => b?.value - a?.value)
    .find((x) => getCondition(x?.condition?.value, valueAtual, x?.value))
    ?.color;
  return colorConditionFinded ?? colorDefault;
};

export const getItemConditionList = (conditionsList, valueAtual) => {
  return conditionsList
    ?.sort((a, b) => b?.value - a?.value)
    .find((x) => getCondition(x?.condition?.value, valueAtual, x?.value));
};
