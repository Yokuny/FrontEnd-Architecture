export const getFields = ({ intl }) => [
  {
    "id": 1,
    "name": "totalOnBoard",
    "description": intl.formatMessage({ id: "total.on.board" }),
    "datatype": "number",
    "size": 12,
    "isRequired": false,
    "properties": {
      "min": 0
    },
    "fields": [],
    "isShowInList": true,
    "isVisiblePublic": true,
    "usersVisible": [],
  },
  {
    "id": 2,
    "name": "people",
    "description": intl.formatMessage({ id: "crew" }),
    "datatype": "table",
    "size": 12,
    "fields": [
      {
        "id": 1,
        "description": intl.formatMessage({ id: "name" }),
        "datatype": "text",
        "size": 4,
        "isRequired": false,
        "isVisiblePublic": true,
        "name": "name",
        "fields": []
      },
      {
        "id": 2,
        "isVisiblePublic": true,
        "description": intl.formatMessage({ id: "boarding" }),
        "datatype": "datetime",
        "size": 4,
        "isRequired": false,
        "properties": {
          "useDateNowDefault": false
        },
        "name": "boarding",
        "fields": []
      },
      {
        "id": 3,
        "isVisiblePublic": true,
        "description": intl.formatMessage({ id: "landing" }),
        "datatype": "datetime",
        "properties": {
          "useDateNowDefault": false
        },
        "size": 4,
        "name": "landing",
        "fields": []
      }
    ],
    "isVisiblePublic": true,
    "usersVisible": []
  }
]
