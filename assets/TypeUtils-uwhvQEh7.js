//#region ../../engine/dist/browser/Utils/TypeUtils.js
function isBoolean(arg) {
	return typeof arg === "boolean";
}
function isString(arg) {
	return typeof arg === "string";
}
function isNumber(arg) {
	return typeof arg === "number";
}
function isEnumValue(enumObject, arg) {
	return Object.values(enumObject).some((enumValue) => enumValue === arg);
}
function toEnumValue(enumObject, arg, defaultValue) {
	return isEnumValue(enumObject, arg) ? arg : defaultValue;
}
function isObject(arg) {
	return typeof arg === "object" && arg !== null;
}
function isArray(arg) {
	return Array.isArray(arg);
}
function isNull(arg) {
	return arg === null || arg === void 0;
}
//#endregion
export { isNumber as a, toEnumValue as c, isNull as i, isBoolean as n, isObject as o, isEnumValue as r, isString as s, isArray as t };
