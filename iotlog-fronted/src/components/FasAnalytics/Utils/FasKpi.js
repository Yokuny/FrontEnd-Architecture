/**
 * Given a grouped data and a grouped variable, it builds the data series for each group to be used in the ApexCharts component.
 * @param {Object} data - Object with the grouped data
 * @param {String} groupedVariable - Variable to group the data
 * @returns {Array<Object>} - An array of objects with the name and the data of each group
 */
export const buildDataSeriesFromGroupedData = (
  data,
  groupedVariable,
  colorMap = {},
  intl = null
) => {
  if (!data?.length) return [];
  const keys = !!data.length ? Object.keys(data[0]?.[groupedVariable]) : [];
  const dataSeriesBuilder = [];
  const labelColors = [];
  keys.forEach((key) => {
    const keyObject = {
      name: intl ? intl.formatMessage({ id: key.replaceAll("-", ".") }) : key,
      data: [],
    };

    data?.forEach((groupData) => {
      keyObject.data.push(groupData[groupedVariable][key]);
    });
    dataSeriesBuilder.push(keyObject);
    labelColors.push(colorMap[key]);
  });
  return [dataSeriesBuilder, labelColors];
};

/**
 * Given a key list, builds a date series for each key to be used in the ApexCharts component.
 * @param {Object} data
 * @param {Array} keyList
 * @param {Intl} intl
 * @returns {Array<Object>}
 *
 */
export const buildDataSeriesFromKeyList = (data, keyList, intl = null) => {
  if (!data?.length) return [];
  const dataSeriesBuilder = [];
  keyList.forEach((key) => {
    const keyObject = {
      name: intl ? intl.formatMessage({ id: key.replaceAll("-", ".") }) : key,
      type: "bar",
      data: [],
    };

    data?.forEach((groupData) => {
      keyObject.data.push(groupData[key]);
    });
    dataSeriesBuilder.push(keyObject);
  });
  return dataSeriesBuilder;
};
