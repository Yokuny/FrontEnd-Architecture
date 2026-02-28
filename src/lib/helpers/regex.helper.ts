export const titleRegExp = /^[a-zA-Z0-9\sÀ-ú]{3,}\s*$/;
export const titleRegex = RegExp(titleRegExp);

export const dateRegExp = /^(202[3-9]|20[3-9]\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const dateRegex = RegExp(dateRegExp);

export const emailRegExp = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
export const emailRegex = RegExp(emailRegExp);

export const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
export const passwordRegex = RegExp(passwordRegExp);

export const cpfRegExp = /^[0-9]{11}$/;
export const cpfRegex = RegExp(cpfRegExp);

export const rgRegExp = /^[0-9]{7}$/;
export const rgRegex = RegExp(rgRegExp);

export const birthRegExp = /^(19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const birthRegex = RegExp(birthRegExp);

export const sexRegExp = /^[MF]$/i;
export const sexRegex = RegExp(sexRegExp);

export const cepRegExp = /^[0-9]{8}$/;
export const cepRegex = RegExp(/^[0-9]{8}$/);

export const addressRegExp = /^[a-zA-ZÀ-ú0-9\s]{5,50}$/;
export const addressRegex = RegExp(addressRegExp);

export const phoneRegExpBR = /^[1-9]{2}9[0-9]{8}$/;
export const phoneRegexBR = RegExp(phoneRegExpBR);

export const phoneRegExpEN = /^1?[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/;
export const phoneRegexEN = RegExp(phoneRegExpEN);

export const phoneRegExp = /^([1-9]{2}9[0-9]{8}|1?[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4})$/;
export const phoneRegex = RegExp(phoneRegExp);

export const ObjectIdRegExp = /^[0-9a-fA-F]{24}$/;
export const ObjectIdRegex = RegExp(ObjectIdRegExp);
