import { Store } from "../../configureStore";

const en = require('../../translations/en.json')
const pt = require('../../translations/pt.json')
const es = require('../../translations/es.json')

const translations = {
  pt,
  en,
  es
}

export const translate = key => {
    const locale = Store.getState().settings.locale;
    return translations[locale][key];
  }