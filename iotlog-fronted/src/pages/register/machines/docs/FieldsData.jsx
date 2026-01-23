export const getFields = ({ intl }) => [
  {
    "id": 1,
    "name": "search",
    "description": intl.formatMessage({ id: "search" }),
    "datatype": "text",
    "size": 12,
    "isRequired": false,
    "properties": {
      "placeholder": intl.formatMessage({ id: "search.docs" })
    },
    "fields": [],
    "isShowInList": true,
    "isVisiblePublic": true,
    "usersVisible": [],
  }
]
