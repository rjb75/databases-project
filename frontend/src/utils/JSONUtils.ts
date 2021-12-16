export const removeInvlaidCharacters = (stringifiedObject: any) => {
  stringifiedObject = stringifiedObject
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f');

  stringifiedObject = stringifiedObject.replace(/[\u0000-\u0019]+/g, '');
  return stringifiedObject;
};
