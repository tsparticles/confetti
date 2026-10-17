import "./Constants-Boin98lu.js";
import { f as getRandom } from "./MathUtils-DBT3t4S6.js";
import { a as isObject, n as isBoolean, r as isNull, t as isArray } from "./TypeUtils-CAcPJyQQ.js";
//#region ../../engine/dist/browser/Enums/Directions/OutModeDirection.js
var OutModeDirection;
(function(OutModeDirection) {
	OutModeDirection["bottom"] = "bottom";
	OutModeDirection["left"] = "left";
	OutModeDirection["right"] = "right";
	OutModeDirection["top"] = "top";
})(OutModeDirection || (OutModeDirection = {}));
//#endregion
//#region ../../engine/dist/browser/Enums/Modes/PixelMode.js
var PixelMode;
(function(PixelMode) {
	PixelMode["precise"] = "precise";
	PixelMode["percent"] = "percent";
})(PixelMode || (PixelMode = {}));
//#endregion
//#region ../../engine/dist/browser/Utils/Utils.js
var minRadius = 0;
function isForbiddenKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
function hasMatchMedia() {
	return typeof matchMedia !== "undefined";
}
function safeDocument() {
	return globalThis.document;
}
function safeMatchMedia(query) {
	if (!hasMatchMedia()) return;
	return matchMedia(query);
}
function safeMutationObserver(callback) {
	if (typeof MutationObserver === "undefined") return;
	return new MutationObserver(callback);
}
function isInArray(value, array) {
	return value === array || isArray(array) && array.includes(value);
}
function itemFromArray(array, index, useIndex = true) {
	return array[index !== void 0 && useIndex ? index % array.length : Math.floor(getRandom() * array.length)];
}
function isPointInside(point, size, offset, radius, direction) {
	return areBoundsInside(calculateBounds(point, radius ?? minRadius), size, offset, direction);
}
function areBoundsInside(bounds, size, offset, direction) {
	let inside = true;
	if (!direction || direction === OutModeDirection.bottom) inside = bounds.top < size.height + offset.x;
	if (inside && (!direction || direction === OutModeDirection.left)) inside = bounds.right > offset.x;
	if (inside && (!direction || direction === OutModeDirection.right)) inside = bounds.left < size.width + offset.y;
	if (inside && (!direction || direction === OutModeDirection.top)) inside = bounds.bottom > offset.y;
	return inside;
}
function calculateBounds(point, radius) {
	return {
		bottom: point.y + radius,
		left: point.x - radius,
		right: point.x + radius,
		top: point.y - radius
	};
}
function deepExtend(destination, ...sources) {
	for (const source of sources) {
		if (isNull(source)) continue;
		if (!isObject(source)) {
			destination = source;
			continue;
		}
		if (Array.isArray(source)) {
			if (!Array.isArray(destination)) destination = [];
		} else if (!isObject(destination) || Array.isArray(destination)) destination = Object.create(null);
		const sourceKeys = Object.keys(source);
		if (!sourceKeys.some((k) => {
			const v = source[k];
			return isObject(v) || Array.isArray(v);
		})) {
			const sourceDict = source, destDict = destination;
			for (const key of sourceKeys) {
				if (isForbiddenKey(key)) continue;
				const v = sourceDict[key];
				if (v !== void 0) destDict[key] = v;
			}
			continue;
		}
		for (const key of sourceKeys) {
			if (isForbiddenKey(key)) continue;
			const sourceDict = source, destDict = destination, value = sourceDict[key];
			destDict[key] = Array.isArray(value) ? value.map((v) => deepExtend(void 0, v)) : deepExtend(destDict[key], value);
		}
	}
	return destination;
}
function executeOnSingleOrMultiple(obj, callback) {
	return isArray(obj) ? obj.map((item, index) => callback(item, index)) : callback(obj, 0);
}
function itemFromSingleOrMultiple(obj, index, useIndex) {
	return isArray(obj) ? itemFromArray(obj, index, useIndex) : obj;
}
function getPositionOrSize(positionOrSize, canvasSize) {
	if (!(positionOrSize.mode === PixelMode.percent)) {
		const { mode: _, ...rest } = positionOrSize;
		return rest;
	}
	if ("x" in positionOrSize) return {
		x: positionOrSize.x / 100 * canvasSize.width,
		y: positionOrSize.y / 100 * canvasSize.height
	};
	else return {
		width: positionOrSize.width / 100 * canvasSize.width,
		height: positionOrSize.height / 100 * canvasSize.height
	};
}
function getPosition(position, canvasSize) {
	return getPositionOrSize(position, canvasSize);
}
function cloneStyle(style) {
	const clonedStyle = safeDocument().createElement("div").style;
	for (const key in style) {
		const styleKey = style[key];
		if (!(key in style) || isNull(styleKey)) continue;
		const styleValue = style.getPropertyValue?.(styleKey);
		if (!styleValue) continue;
		const stylePriority = style.getPropertyPriority?.(styleKey);
		if (stylePriority) clonedStyle.setProperty(styleKey, styleValue, stylePriority);
		else clonedStyle.setProperty(styleKey, styleValue);
	}
	return clonedStyle;
}
var _cachedZIndex;
var _cachedStyle;
function getFullScreenStyle(zIndex) {
	if (_cachedZIndex !== zIndex || !_cachedStyle) {
		_cachedZIndex = zIndex;
		const fullScreenStyle = safeDocument().createElement("div").style, radix = 10, style = {
			width: "100%",
			height: "100%",
			margin: "0",
			padding: "0",
			borderWidth: "0",
			position: "fixed",
			zIndex: zIndex.toString(radix),
			"z-index": zIndex.toString(radix),
			top: "0",
			left: "0",
			"pointer-events": "none"
		};
		for (const key in style) {
			const value = style[key];
			if (value === void 0) continue;
			fullScreenStyle.setProperty(key, value);
		}
		_cachedStyle = fullScreenStyle;
	}
	return _cachedStyle;
}
function manageListener(element, event, handler, add, options) {
	if (add) {
		let addOptions = { passive: true };
		if (isBoolean(options)) addOptions.capture = options;
		else if (options !== void 0) addOptions = options;
		element.addEventListener(event, handler, addOptions);
	} else {
		const removeOptions = options;
		element.removeEventListener(event, handler, removeOptions);
	}
}
async function getItemsFromInitializer(container, map, initializers, force = false) {
	let res = map.get(container);
	if (!res || force) {
		res = await Promise.all([...initializers.values()].map((t) => t(container)));
		map.set(container, res);
	}
	return res;
}
async function getItemMapFromInitializer(container, map, initializers, force = false) {
	let res = map.get(container);
	if (!res || force) {
		const entries = await Promise.all([...initializers.entries()].map(([key, initializer]) => initializer(container).then((item) => [key, item])));
		res = new Map(entries);
		map.set(container, res);
	}
	return res;
}
//#endregion
export { PixelMode as _, getFullScreenStyle as a, getPosition as c, itemFromArray as d, itemFromSingleOrMultiple as f, safeMutationObserver as g, safeMatchMedia as h, executeOnSingleOrMultiple as i, isInArray as l, safeDocument as m, cloneStyle as n, getItemMapFromInitializer as o, manageListener as p, deepExtend as r, getItemsFromInitializer as s, calculateBounds as t, isPointInside as u, OutModeDirection as v };
