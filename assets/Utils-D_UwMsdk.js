import { a as fullPercent, c as generatedTrue, f as originPoint, g as threeQuarter, i as doublePI, l as half, o as generatedAttribute, p as quarter, s as generatedFalse, t as canvasTag } from "./Constants-ohzUY8CX.js";
import { a as isNumber, i as isNull, n as isBoolean, o as isObject, t as isArray } from "./TypeUtils-uwhvQEh7.js";
//#region ../../engine/dist/browser/Utils/LogUtils.js
var errorPrefix = "tsParticles - Error";
var codedErrorPattern = /^\[tsParticles Error (TSP-\d+)\]\s*/;
var fullMatchIndex = 0;
var codeIndex = 1;
var wrap = (fn) => (...args) => {
	fn(...args);
};
var _logger = {
	debug: wrap(console.debug),
	error: (message, ...optionalParams) => {
		if (typeof message === "string") {
			const match = codedErrorPattern.exec(message);
			if (match?.[codeIndex]) {
				console.error(`tsParticles - ${match[codeIndex]} - ${message.slice(match[fullMatchIndex].length)}`, ...optionalParams);
				return;
			}
		}
		console.error(`${errorPrefix} - ${message}`, ...optionalParams);
	},
	info: wrap(console.info),
	log: wrap(console.log),
	trace: wrap(console.trace),
	verbose: wrap(console.log),
	warning: wrap(console.warn)
};
function getLogger() {
	return _logger;
}
//#endregion
//#region ../../engine/dist/browser/Enums/Directions/MoveDirection.js
var MoveDirection;
(function(MoveDirection) {
	MoveDirection["bottom"] = "bottom";
	MoveDirection["bottomLeft"] = "bottom-left";
	MoveDirection["bottomRight"] = "bottom-right";
	MoveDirection["left"] = "left";
	MoveDirection["none"] = "none";
	MoveDirection["right"] = "right";
	MoveDirection["top"] = "top";
	MoveDirection["topLeft"] = "top-left";
	MoveDirection["topRight"] = "top-right";
	MoveDirection["outside"] = "outside";
	MoveDirection["inside"] = "inside";
})(MoveDirection || (MoveDirection = {}));
//#endregion
//#region ../../engine/dist/browser/Core/Utils/Vectors.js
function getZ(source) {
	return "z" in source ? source.z : originPoint.z;
}
var Vector3d = class Vector3d {
	x;
	y;
	z;
	constructor(x = originPoint.x, y = originPoint.y, z = originPoint.z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	static get origin() {
		return Vector3d.create(originPoint.x, originPoint.y, originPoint.z);
	}
	get angle() {
		return Math.atan2(this.y, this.x);
	}
	set angle(angle) {
		this.#updateFromAngle(angle, this.length);
	}
	get length() {
		return Math.sqrt(this.getLengthSq());
	}
	set length(length) {
		this.#updateFromAngle(this.angle, length);
	}
	static clone(source) {
		return Vector3d.create(source.x, source.y, getZ(source));
	}
	static create(x, y, z) {
		if (typeof x === "number") return new Vector3d(x, y ?? originPoint.y, z ?? originPoint.z);
		return new Vector3d(x.x, x.y, getZ(x));
	}
	add(v) {
		return Vector3d.create(this.x + v.x, this.y + v.y, this.z + getZ(v));
	}
	addTo(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += getZ(v);
	}
	copy() {
		return Vector3d.clone(this);
	}
	div(n) {
		return Vector3d.create(this.x / n, this.y / n, this.z / n);
	}
	getLengthSq() {
		return this.x ** 2 + this.y ** 2;
	}
	mult(n) {
		return Vector3d.create(this.x * n, this.y * n, this.z * n);
	}
	multTo(n) {
		this.x *= n;
		this.y *= n;
		this.z *= n;
	}
	normalize() {
		const length = this.length;
		if (length !== 0) this.multTo(1 / length);
	}
	rotate(angle) {
		return Vector3d.create(this.x * Math.cos(angle) - this.y * Math.sin(angle), this.x * Math.sin(angle) + this.y * Math.cos(angle), originPoint.z);
	}
	setTo(c) {
		this.x = c.x;
		this.y = c.y;
		this.z = getZ(c);
	}
	sub(v) {
		return Vector3d.create(this.x - v.x, this.y - v.y, this.z - getZ(v));
	}
	subFrom(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= getZ(v);
	}
	#updateFromAngle(angle, length) {
		this.x = Math.cos(angle) * length;
		this.y = Math.sin(angle) * length;
	}
};
var Vector = class Vector extends Vector3d {
	constructor(x = originPoint.x, y = originPoint.y) {
		super(x, y, originPoint.z);
	}
	static get origin() {
		return Vector.create(originPoint.x, originPoint.y);
	}
	static clone(source) {
		return Vector.create(source.x, source.y);
	}
	static create(x, y) {
		if (typeof x === "number") return new Vector(x, y ?? originPoint.y);
		return new Vector(x.x, x.y);
	}
};
//#endregion
//#region ../../engine/dist/browser/Utils/MathUtils.js
var degToRadFactor = Math.PI / 180;
var _random = Math.random;
var _animationLoop = {
	nextFrame: (cb) => requestAnimationFrame(cb),
	cancel: (idx) => {
		cancelAnimationFrame(idx);
	}
};
function getRandom() {
	return clamp(_random(), 0, 1 - Number.EPSILON);
}
function getRandomInRange(min, max) {
	return getRandom() * (max - min) + min;
}
function animate(fn) {
	return _animationLoop.nextFrame(fn);
}
function cancelAnimation(handle) {
	_animationLoop.cancel(handle);
}
function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}
function randomInRangeValue(r) {
	const max = getRangeMax(r), minOffset = 0;
	let min = getRangeMin(r);
	if (max === min) min = minOffset;
	return getRandomInRange(min, max);
}
function getRangeValue(value) {
	return isNumber(value) ? value : randomInRangeValue(value);
}
function getRangeMin(value) {
	return isNumber(value) ? value : value.min;
}
function getRangeMax(value) {
	return isNumber(value) ? value : value.max;
}
function setRangeValue(source, value) {
	if (source === value || value === void 0 && isNumber(source)) return source;
	const min = getRangeMin(source), max = getRangeMax(source);
	return value !== void 0 ? {
		min: Math.min(min, value),
		max: Math.max(max, value)
	} : setRangeValue(min, max);
}
function getDistances(pointA, pointB) {
	const dx = pointA.x - pointB.x, dy = pointA.y - pointB.y;
	return {
		dx,
		dy,
		distance: Math.hypot(dx, dy)
	};
}
function getDistanceSq(pointA, pointB) {
	const dx = pointA.x - pointB.x, dy = pointA.y - pointB.y;
	return dx * dx + dy * dy;
}
function getDistance(pointA, pointB) {
	return Math.sqrt(getDistanceSq(pointA, pointB));
}
function checkDistance(pointA, pointB, distance) {
	return getDistanceSq(pointA, pointB) <= distance * distance;
}
function degToRad(degrees) {
	return degrees * degToRadFactor;
}
function getParticleDirectionAngle(direction, position, center) {
	if (isNumber(direction)) return degToRad(direction);
	switch (direction) {
		case MoveDirection.top: return -Math.PI * half;
		case MoveDirection.topRight: return -Math.PI * quarter;
		case MoveDirection.right: return 0;
		case MoveDirection.bottomRight: return Math.PI * quarter;
		case MoveDirection.bottom: return Math.PI * half;
		case MoveDirection.bottomLeft: return Math.PI * threeQuarter;
		case MoveDirection.left: return Math.PI;
		case MoveDirection.topLeft: return -Math.PI * threeQuarter;
		case MoveDirection.inside: return Math.atan2(center.y - position.y, center.x - position.x);
		case MoveDirection.outside: return Math.atan2(position.y - center.y, position.x - center.x);
		default: return getRandom() * doublePI;
	}
}
function getParticleBaseVelocity(direction) {
	const baseVelocity = Vector.origin;
	baseVelocity.length = 1;
	baseVelocity.angle = direction;
	return baseVelocity;
}
function calcPositionOrRandomFromSize(data) {
	return {
		x: (data.position?.x ?? getRandom() * 100) * data.size.width / 100,
		y: (data.position?.y ?? getRandom() * 100) * data.size.height / 100
	};
}
function calcPositionOrRandomFromSizeRanged(data) {
	const position = {
		x: data.position?.x !== void 0 ? getRangeValue(data.position.x) : void 0,
		y: data.position?.y !== void 0 ? getRangeValue(data.position.y) : void 0
	};
	return calcPositionOrRandomFromSize({
		size: data.size,
		position
	});
}
function calcExactPositionOrRandomFromSize(data) {
	const { position, size } = data;
	return {
		x: position?.x ?? getRandom() * size.width,
		y: position?.y ?? getRandom() * size.height
	};
}
function parseAlpha(input) {
	if (!input) return 1;
	return input.endsWith("%") ? Number.parseFloat(input) / 100 : Number.parseFloat(input);
}
//#endregion
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
	return areBoundsInside(calculateBounds(point, radius ?? 0), size, offset, direction);
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
async function getItemsFromInitializer(container, initializers) {
	return await Promise.all([...initializers.values()].map((t) => t(container)));
}
async function getItemMapFromInitializer(container, initializers) {
	const entries = await Promise.all([...initializers.entries()].map(([key, initializer]) => initializer(container).then((item) => [key, item])));
	return new Map(entries);
}
async function getDataFromUrl(data) {
	const url = itemFromSingleOrMultiple(data.url, data.index);
	if (!url) return data.fallback;
	try {
		const response = await fetch(url);
		if (response.ok) {
			const current = await response.json();
			if (isSourceOptionsValue(current)) return current;
			getLogger().error("invalid configuration data while retrieving config file");
		} else getLogger().error(`${response.status.toString()} while retrieving config file`);
	} catch (error) {
		getLogger().error(`error while retrieving config file: ${error}`);
	}
	return data.fallback;
}
function isSourceOptionsValue(value) {
	if (isArray(value)) return value.every((entry) => isObject(entry) && !isArray(entry));
	return isObject(value) && !isArray(value);
}
function getCanvasFromContainer(domContainer) {
	let canvasEl;
	const documentSafe = safeDocument();
	if (domContainer instanceof HTMLCanvasElement || domContainer.tagName.toLowerCase() === "canvas") {
		canvasEl = domContainer;
		canvasEl.dataset[generatedAttribute] ??= generatedFalse;
		if (canvasEl.dataset["generated"] === "true") {
			canvasEl.style.width ||= fullPercent;
			canvasEl.style.height ||= fullPercent;
			canvasEl.style.pointerEvents = "none";
			canvasEl.style.setProperty("pointer-events", "none");
		}
	} else {
		const foundCanvas = domContainer.getElementsByTagName(canvasTag).item(0);
		if (foundCanvas) {
			canvasEl = foundCanvas;
			canvasEl.dataset[generatedAttribute] = generatedFalse;
		} else {
			canvasEl = documentSafe.createElement(canvasTag);
			canvasEl.dataset[generatedAttribute] = generatedTrue;
			domContainer.appendChild(canvasEl);
		}
		canvasEl.style.width ||= fullPercent;
		canvasEl.style.height ||= fullPercent;
		canvasEl.style.pointerEvents = "none";
		canvasEl.style.setProperty("pointer-events", "none");
	}
	return canvasEl;
}
function getDomContainer(id, source) {
	const documentSafe = safeDocument();
	let domContainer = source ?? documentSafe.getElementById(id);
	if (domContainer) return domContainer;
	domContainer = documentSafe.createElement("canvas");
	domContainer.id = id;
	domContainer.dataset[generatedAttribute] = generatedTrue;
	documentSafe.body.append(domContainer);
	return domContainer;
}
//#endregion
export { getDistances as A, setRangeValue as B, calcExactPositionOrRandomFromSize as C, clamp as D, checkDistance as E, getRangeMax as F, Vector3d as H, getRangeMin as I, getRangeValue as L, getParticleDirectionAngle as M, getRandom as N, degToRad as O, getRandomInRange as P, parseAlpha as R, animate as S, cancelAnimation as T, MoveDirection as U, Vector as V, getLogger as W, safeDocument as _, getCanvasFromContainer as a, PixelMode as b, getFullScreenStyle as c, getPosition as d, isInArray as f, manageListener as g, itemFromSingleOrMultiple as h, executeOnSingleOrMultiple as i, getParticleBaseVelocity as j, getDistance as k, getItemMapFromInitializer as l, itemFromArray as m, cloneStyle as n, getDataFromUrl as o, isPointInside as p, deepExtend as r, getDomContainer as s, calculateBounds as t, getItemsFromInitializer as u, safeMatchMedia as v, calcPositionOrRandomFromSizeRanged as w, OutModeDirection as x, safeMutationObserver as y, randomInRangeValue as z };
