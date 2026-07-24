import "./Constants-Boin98lu.js";
import { y as setRangeValue } from "./MathUtils-DBT3t4S6.js";
import { o as isString, r as isNull, t as isArray } from "./TypeUtils-CAcPJyQQ.js";
import "./Utils-BJNts6wb.js";
//#region ../../engine/dist/browser/Enums/Modes/AnimationMode.js
var AnimationMode;
(function(AnimationMode) {
	AnimationMode["auto"] = "auto";
	AnimationMode["increase"] = "increase";
	AnimationMode["decrease"] = "decrease";
	AnimationMode["random"] = "random";
})(AnimationMode || (AnimationMode = {}));
//#endregion
//#region ../../engine/dist/browser/Enums/Types/StartValueType.js
var StartValueType;
(function(StartValueType) {
	StartValueType["max"] = "max";
	StartValueType["min"] = "min";
	StartValueType["random"] = "random";
})(StartValueType || (StartValueType = {}));
//#endregion
//#region ../../engine/dist/browser/Utils/OptionLoader.js
var OptionLoader = class {
	load(data) {
		if (isNull(data)) return;
		this.doLoad(data);
	}
};
function loadOptions(options, ...sourceOptionsArr) {
	for (const sourceOptions of sourceOptionsArr) options.load(sourceOptions);
}
//#endregion
//#region ../../engine/dist/browser/Utils/OptionsUtils.js
function loadProperty(obj, key, value) {
	if (value !== void 0) obj[key] = value;
}
function loadRangeProperty(obj, key, value) {
	if (value !== void 0) obj[key] = setRangeValue(value);
}
function loadNestedProperty(obj, key, value) {
	if (value !== void 0) obj[key].load(value);
}
function loadLazyProperty(obj, key, value, factory) {
	if (value !== void 0) {
		const objRecord = obj;
		objRecord[key] ??= factory();
		objRecord[key].load(value);
	}
}
function loadOptionProperty(obj, key, optionClass, ...sources) {
	const objRecord = obj;
	objRecord[key] ??= new optionClass();
	const target = objRecord[key];
	for (const source of sources) target.load(source?.[key]);
}
//#endregion
//#region ../../engine/dist/browser/Options/Classes/AnimationOptions.js
var AnimationOptions = class extends OptionLoader {
	count = 0;
	decay = 0;
	delay = 0;
	enable = false;
	speed = 1;
	sync = false;
	doLoad(data) {
		loadRangeProperty(this, "count", data.count);
		loadProperty(this, "enable", data.enable);
		loadRangeProperty(this, "speed", data.speed);
		loadRangeProperty(this, "decay", data.decay);
		loadRangeProperty(this, "delay", data.delay);
		loadProperty(this, "sync", data.sync);
	}
};
var RangedAnimationOptions = class extends AnimationOptions {
	mode = AnimationMode.auto;
	startValue = StartValueType.random;
	doLoad(data) {
		super.doLoad(data);
		loadProperty(this, "mode", data.mode);
		loadProperty(this, "startValue", data.startValue);
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/ColorAnimation.js
var ColorAnimation = class extends AnimationOptions {
	max;
	min;
	offset = 0;
	sync = true;
	constructor(min, max) {
		super();
		this.min = min;
		this.max = max;
	}
	doLoad(data) {
		super.doLoad(data);
		loadProperty(this, "max", data.max);
		loadProperty(this, "min", data.min);
		loadRangeProperty(this, "offset", data.offset);
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/HslAnimation.js
var HslAnimation = class extends OptionLoader {
	h = new ColorAnimation(0, 360);
	l = new ColorAnimation(0, 100);
	s = new ColorAnimation(0, 100);
	doLoad(data) {
		this.h.load(data.h);
		this.s.load(data.s);
		this.l.load(data.l);
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/OptionsColor.js
var OptionsColor = class OptionsColor extends OptionLoader {
	value = "";
	static create(source, data) {
		const color = new OptionsColor();
		color.load(source);
		if (data !== void 0) if (isString(data) || isArray(data)) color.load({ value: data });
		else color.load(data);
		return color;
	}
	doLoad(data) {
		if (!isNull(data.value)) this.value = data.value;
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/AnimatableColor.js
var AnimatableColor = class AnimatableColor extends OptionsColor {
	animation = new HslAnimation();
	static create(source, data) {
		const color = new AnimatableColor();
		color.load(source);
		if (data !== void 0) if (isString(data) || isArray(data)) color.load({ value: data });
		else color.load(data);
		return color;
	}
	doLoad(data) {
		super.doLoad(data);
		const colorAnimation = data.animation;
		if (colorAnimation !== void 0) if (colorAnimation.enable === void 0) this.animation.load(data.animation);
		else this.animation.h.load(colorAnimation);
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/Particles/Fill.js
var Fill = class extends OptionLoader {
	color;
	enable = true;
	opacity = 1;
	doLoad(data) {
		if (data.color !== void 0) this.color = AnimatableColor.create(this.color, data.color);
		loadProperty(this, "enable", data.enable);
		loadRangeProperty(this, "opacity", data.opacity);
	}
};
//#endregion
//#region ../../engine/dist/browser/Options/Classes/Particles/Stroke.js
var Stroke = class extends OptionLoader {
	color;
	opacity;
	width = 0;
	doLoad(data) {
		if (data.color !== void 0) this.color = AnimatableColor.create(this.color, data.color);
		loadRangeProperty(this, "width", data.width);
		loadRangeProperty(this, "opacity", data.opacity);
	}
};
//#endregion
export { AnimationOptions as a, loadNestedProperty as c, loadRangeProperty as d, OptionLoader as f, AnimationMode as h, OptionsColor as i, loadOptionProperty as l, StartValueType as m, Fill as n, RangedAnimationOptions as o, loadOptions as p, AnimatableColor as r, loadLazyProperty as s, Stroke as t, loadProperty as u };
