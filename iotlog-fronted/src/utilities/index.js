const verifyTime = (value) => {
  let valueProxied = value.match(
    /([0-9])?([0-9])?([0-9])?(:)?([0-9])?([0-9])?/
  );
  if (valueProxied?.length) {
    let valueFinded = valueProxied[0];
    return valueFinded?.length === 2 ? `${valueFinded}:00` : valueFinded;
  }

  return undefined;
};

const convertTimeOnMinute = (time) => {
  if (time) return Number(time.split(":")[0]) * 60 + Number(time.split(":")[1]);

  return undefined;
};

const debbuggerInfo = (message) => {
  console.log(message);
};

const debbuggerDanger = (message) => {
  console.log(
    message,
    "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;"
  );
};

const debbuggerClear = () => {
  console.clear();
}

module.exports = {
  verifyTime,
  convertTimeOnMinute,
  debbuggerInfo,
  debbuggerDanger,
  debbuggerClear
};
