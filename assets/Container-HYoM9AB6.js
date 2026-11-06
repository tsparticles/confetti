import { B as setRangeValue, C as calcExactPositionOrRandomFromSize, D as clamp, H as Vector3d, L as getRangeValue, M as getParticleDirectionAngle, N as getRandom, O as degToRad, S as animate, T as cancelAnimation, U as MoveDirection, V as Vector, W as getLogger, _ as safeDocument, c as getFullScreenStyle, d as getPosition, f as isInArray, g as manageListener, h as itemFromSingleOrMultiple, j as getParticleBaseVelocity, l as getItemMapFromInitializer, n as cloneStyle, r as deepExtend, u as getItemsFromInitializer, v as safeMatchMedia, x as OutModeDirection, y as safeMutationObserver, z as randomInRangeValue } from "./Utils-WJDuie34.js";
import { _ as visibilityChangeEvent, d as millisecondsToSeconds, f as originPoint, h as resizeEvent, i as doublePI, l as half, n as defaultCompositeValue, o as generatedAttribute, r as defaultTransform } from "./Constants-ohzUY8CX.js";
import { c as toEnumValue } from "./TypeUtils-uwhvQEh7.js";
import { C as EventType, T as ErrorCodes, _ as LimitMode, a as getStyleFromHsl, b as Circle, c as rangeColorToRgb, g as OutMode, h as ParticleOutType, i as getHslFromAnimation, l as Options, m as DrawLayer, o as getStyleFromRgb, p as loadOptions, r as alterHsl, s as rangeColorToHsl, u as loadParticlesOptions, v as HdrMode, w as getErrorMessage, x as Rectangle } from "./index-Dei_f8wi.js";
//#region ../../engine/dist/browser/Core/RenderManager.js
var fColorIndex = 0;
var sColorIndex = 1;
function setTransformValue(factor, newFactor, key) {
	const newValue = newFactor[key];
	if (newValue !== void 0) factor[key] = (factor[key] ?? 1) * newValue;
}
var RenderManager = class {
	#backgroundElement;
	#backgroundWarnings;
	#canvasClearPlugins;
	#canvasManager;
	#colorPlugins;
	#container;
	#context;
	#contextSettings;
	#drawParticlePlugins;
	#drawParticlesCleanupPlugins;
	#drawParticlesSetupPlugins;
	#layers;
	#pluginManager;
	#postDrawUpdaters;
	#preDrawUpdaters;
	#reusableColorStyles = {};
	#reusablePluginColors = [void 0, void 0];
	#reusableTransform = {};
	constructor(pluginManager, container, canvasManager) {
		this.#pluginManager = pluginManager;
		this.#container = container;
		this.#canvasManager = canvasManager;
		this.#context = null;
		this.#backgroundElement = null;
		this.#backgroundWarnings = /* @__PURE__ */ new Set();
		this.#preDrawUpdaters = [];
		this.#postDrawUpdaters = [];
		this.#canvasClearPlugins = [];
		this.#colorPlugins = [];
		this.#drawParticlePlugins = [];
		this.#drawParticlesCleanupPlugins = [];
		this.#drawParticlesSetupPlugins = [];
		this.#layers = {
			0: [],
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: []
		};
	}
	get settings() {
		return this.#contextSettings;
	}
	canvasClear() {
		if (!this.#container.actualOptions.clear) return;
		this.draw((ctx) => {
			ctx.clearRect(originPoint.x, originPoint.y, this.#canvasManager.size.width, this.#canvasManager.size.height);
		});
	}
	clear() {
		const visited = /* @__PURE__ */ new Set();
		for (const plugin of this.#canvasClearPlugins) {
			visited.add(plugin);
			if (plugin.canvasClear?.() ?? false) return plugin;
		}
		for (const layer of Object.values(DrawLayer)) if (typeof layer === "number") for (const plugin of this.#getLayerPlugins(layer)) {
			if (visited.has(plugin)) continue;
			visited.add(plugin);
			if (plugin.canvasClear?.() ?? false) return plugin;
		}
		this.canvasClear();
	}
	destroy() {
		this.stop();
		this.#backgroundElement = null;
		this.#backgroundWarnings.clear();
		this.#preDrawUpdaters = [];
		this.#postDrawUpdaters = [];
		this.#canvasClearPlugins = [];
		this.#colorPlugins = [];
		this.#drawParticlePlugins = [];
		this.#drawParticlesCleanupPlugins = [];
		this.#drawParticlesSetupPlugins = [];
		for (const layer of Object.values(DrawLayer)) if (typeof layer === "number") this.#layers[layer] = [];
	}
	draw(cb) {
		const ctx = this.#context;
		if (!ctx) return;
		return cb(ctx);
	}
	drawParticle(particle, delta) {
		if (particle.spawning || particle.destroyed) return;
		const radius = particle.getRadius();
		if (radius <= 0) return;
		const pfColor = particle.getFillColor(), psColor = particle.getStrokeColor();
		let [fColor, sColor] = this.#getPluginParticleColors(particle);
		fColor ??= pfColor;
		sColor ??= psColor;
		if (!fColor && !sColor) return;
		const container = this.#container, zIndexOptions = particle.options.zIndex, zIndexFactor = 1 - particle.zIndexFactor, { fillOpacity, opacity, strokeOpacity } = particle.getOpacity(), transform = this.#reusableTransform, colorStyles = this.#reusableColorStyles, fill = fColor ? getStyleFromHsl(fColor, container.hdr, fillOpacity * opacity, container.peakNits, container.hdrMode) : void 0, stroke = sColor ? getStyleFromHsl(sColor, container.hdr, strokeOpacity * opacity, container.peakNits, container.hdrMode) : fill;
		transform.a = transform.b = transform.c = transform.d = void 0;
		colorStyles.fill = fill;
		colorStyles.stroke = stroke;
		this.draw((context) => {
			for (const plugin of this.#drawParticlesSetupPlugins) plugin.drawParticleSetup?.(context, particle, delta);
			this.#applyPreDrawUpdaters(context, particle, radius, opacity, colorStyles, transform);
			this.#drawParticle({
				container,
				context,
				particle,
				delta,
				colorStyles,
				radius: radius * zIndexFactor ** zIndexOptions.sizeRate,
				opacity,
				transform
			});
			this.#applyPostDrawUpdaters(particle);
			for (const plugin of this.#drawParticlesCleanupPlugins) plugin.drawParticleCleanup?.(context, particle, delta);
		});
	}
	drawParticlePlugins(particle, delta) {
		this.draw((ctx) => {
			for (const plugin of this.#drawParticlePlugins) this.#drawParticlePlugin(ctx, plugin, particle, delta);
		});
	}
	drawParticles(delta) {
		const { particles, actualOptions } = this.#container;
		this.clear();
		particles.update(delta);
		this.draw((ctx) => {
			const width = this.#canvasManager.size.width, height = this.#canvasManager.size.height;
			if (this.#backgroundElement) try {
				ctx.drawImage(this.#backgroundElement, originPoint.x, originPoint.y, width, height);
			} catch {
				this.#warnOnce("background-element-draw-error", "Error drawing background element onto canvas");
			}
			const background = actualOptions.background;
			if (background.draw) try {
				background.draw(ctx, delta);
			} catch {
				this.#warnOnce("background-draw-error", "Error in background.draw callback");
			}
			for (const plugin of this.#getLayerPlugins(DrawLayer.BackgroundMask)) plugin.canvasPaint?.();
			for (const plugin of this.#getLayerPlugins(DrawLayer.CanvasSetup)) plugin.drawSettingsSetup?.(ctx, delta);
			for (const plugin of this.#getLayerPlugins(DrawLayer.PluginContent)) plugin.draw?.(ctx, delta);
			particles.drawParticles(delta);
			for (const plugin of this.#getLayerPlugins(DrawLayer.CanvasCleanup)) {
				plugin.clearDraw?.(ctx, delta);
				plugin.drawSettingsCleanup?.(ctx, delta);
			}
		});
	}
	init() {
		this.initUpdaters();
		this.initPlugins();
		this.#resolveBackgroundElement();
		this.paint();
	}
	initPlugins() {
		this.#canvasClearPlugins = [];
		this.#colorPlugins = [];
		this.#drawParticlePlugins = [];
		this.#drawParticlesSetupPlugins = [];
		this.#drawParticlesCleanupPlugins = [];
		for (const layer of Object.values(DrawLayer)) if (typeof layer === "number") this.#layers[layer] = [];
		this.#initPluginsArray();
	}
	initUpdaters() {
		this.#preDrawUpdaters = [];
		this.#postDrawUpdaters = [];
		for (const updater of this.#container.particleUpdaters) {
			if (updater.afterDraw) this.#postDrawUpdaters.push(updater);
			if (updater.getColorStyles ?? updater.getTransformValues ?? updater.beforeDraw) this.#preDrawUpdaters.push(updater);
		}
	}
	paint() {
		let handled = false;
		for (const plugin of this.#getLayerPlugins(DrawLayer.BackgroundMask)) {
			handled = plugin.canvasPaint?.() ?? false;
			if (handled) break;
		}
		if (handled) return;
		this.paintBase();
	}
	paintBase(baseColor) {
		this.draw((ctx) => {
			ctx.fillStyle = baseColor ?? "rgba(0,0,0,0)";
			ctx.fillRect(originPoint.x, originPoint.y, this.#canvasManager.size.width, this.#canvasManager.size.height);
		});
	}
	paintImage(image, opacity) {
		this.draw((ctx) => {
			if (!image) return;
			const prevAlpha = ctx.globalAlpha;
			ctx.globalAlpha = opacity;
			ctx.drawImage(image, originPoint.x, originPoint.y, this.#canvasManager.size.width, this.#canvasManager.size.height);
			ctx.globalAlpha = prevAlpha;
		});
	}
	setContext(context) {
		this.#context = context;
		if (this.#context) this.#context.globalCompositeOperation = defaultCompositeValue;
	}
	setContextSettings(settings) {
		this.#contextSettings = settings;
	}
	stop() {
		this.draw((ctx) => {
			ctx.clearRect(originPoint.x, originPoint.y, this.#canvasManager.size.width, this.#canvasManager.size.height);
		});
	}
	#applyPostDrawUpdaters(particle) {
		for (const updater of this.#postDrawUpdaters) updater.afterDraw?.(particle);
	}
	#applyPreDrawUpdaters(ctx, particle, radius, zOpacity, colorStyles, transform) {
		for (const updater of this.#preDrawUpdaters) {
			if (updater.getColorStyles) {
				const { fill, stroke } = updater.getColorStyles(particle, ctx, radius, zOpacity);
				if (fill) colorStyles.fill = fill;
				if (stroke) colorStyles.stroke = stroke;
			}
			if (updater.getTransformValues) {
				const updaterTransform = updater.getTransformValues(particle);
				for (const key in updaterTransform) setTransformValue(transform, updaterTransform, key);
			}
			updater.beforeDraw?.(particle);
		}
	}
	#drawAfterEffect(drawer, data) {
		if (!drawer?.drawAfter) return;
		const { particle } = data;
		if (!particle.effect) return;
		drawer.drawAfter(data);
	}
	#drawBeforeEffect(drawer, data) {
		if (!drawer?.drawBefore) return;
		const { particle } = data;
		if (!particle.effect) return;
		drawer.drawBefore(data);
	}
	#drawParticle(data) {
		const { container, context, particle, delta, colorStyles, radius, opacity, transform } = data, { effectDrawers, shapeDrawers } = container, pos = particle.getPosition(), transformData = particle.getTransformData(transform), drawScale = 1, drawPosition = {
			x: pos.x,
			y: pos.y
		};
		context.setTransform(transformData.a, transformData.b, transformData.c, transformData.d, pos.x, pos.y);
		if (colorStyles.fill) context.fillStyle = colorStyles.fill;
		const fillEnabled = !!particle.fillEnabled, strokeWidth = particle.strokeWidth ?? 0;
		context.lineWidth = strokeWidth;
		if (colorStyles.stroke) context.strokeStyle = colorStyles.stroke;
		const drawData = {
			context,
			particle,
			radius,
			drawRadius: radius * drawScale,
			opacity,
			delta,
			pixelRatio: container.retina.pixelRatio,
			fill: fillEnabled,
			stroke: strokeWidth > 0,
			transformData,
			position: { ...pos },
			drawPosition,
			drawScale
		};
		for (const plugin of container.plugins) plugin.drawParticleTransform?.(drawData);
		const effect = particle.effect ? effectDrawers.get(particle.effect) : void 0, shape = particle.shape ? shapeDrawers.get(particle.shape) : void 0;
		this.#drawBeforeEffect(effect, drawData);
		this.#drawShapeBeforeDraw(shape, drawData);
		this.#drawShape(shape, drawData);
		this.#drawShapeAfterDraw(shape, drawData);
		this.#drawAfterEffect(effect, drawData);
		context.resetTransform();
	}
	#drawParticlePlugin(context, plugin, particle, delta) {
		if (!plugin.drawParticle) return;
		plugin.drawParticle(context, particle, delta);
	}
	#drawShape(drawer, data) {
		if (!drawer) return;
		const { context, fill, particle, stroke } = data;
		if (!particle.shape) return;
		context.beginPath();
		drawer.draw(data);
		if (particle.shapeClose) context.closePath();
		if (fill) context.fill();
		if (stroke) context.stroke();
	}
	#drawShapeAfterDraw(drawer, data) {
		if (!drawer?.afterDraw) return;
		const { particle } = data;
		if (!particle.shape) return;
		drawer.afterDraw(data);
	}
	#drawShapeBeforeDraw(drawer, data) {
		if (!drawer?.beforeDraw) return;
		const { particle } = data;
		if (!particle.shape) return;
		drawer.beforeDraw(data);
	}
	#getLayerPlugins(layer) {
		return this.#layers[layer];
	}
	#getPluginParticleColors(particle) {
		let fColor, sColor;
		for (const plugin of this.#colorPlugins) {
			if (!fColor && plugin.particleFillColor) fColor = rangeColorToHsl(this.#pluginManager, plugin.particleFillColor(particle));
			if (!sColor && plugin.particleStrokeColor) sColor = rangeColorToHsl(this.#pluginManager, plugin.particleStrokeColor(particle));
			if (fColor && sColor) break;
		}
		this.#reusablePluginColors[fColorIndex] = fColor;
		this.#reusablePluginColors[sColorIndex] = sColor;
		return this.#reusablePluginColors;
	}
	#initLayerPlugin(plugin) {
		const layerMap = [
			[DrawLayer.BackgroundMask, !!plugin.canvasPaint],
			[DrawLayer.CanvasSetup, !!plugin.drawSettingsSetup],
			[DrawLayer.PluginContent, !!plugin.draw],
			[DrawLayer.CanvasCleanup, !!(plugin.clearDraw ?? plugin.drawSettingsCleanup)]
		];
		for (const [layer, active] of layerMap) if (active) this.#layers[layer].push(plugin);
	}
	#initPluginsArray() {
		for (const plugin of this.#container.plugins) {
			if (plugin.particleFillColor ?? plugin.particleStrokeColor) this.#colorPlugins.push(plugin);
			if (plugin.drawParticle) this.#drawParticlePlugins.push(plugin);
			if (plugin.drawParticleSetup) this.#drawParticlesSetupPlugins.push(plugin);
			if (plugin.drawParticleCleanup) this.#drawParticlesCleanupPlugins.push(plugin);
			if (plugin.canvasClear) this.#canvasClearPlugins.push(plugin);
			this.#initLayerPlugin(plugin);
		}
	}
	#isSupportedElement(element) {
		return typeof HTMLCanvasElement !== "undefined" && element instanceof HTMLCanvasElement || typeof OffscreenCanvas !== "undefined" && element instanceof OffscreenCanvas || typeof HTMLVideoElement !== "undefined" && element instanceof HTMLVideoElement || typeof HTMLImageElement !== "undefined" && element instanceof HTMLImageElement;
	}
	#resolveBackgroundElement() {
		const background = this.#container.actualOptions.background;
		this.#backgroundElement = null;
		if (!background.element) return;
		if (typeof background.element === "string") {
			if (typeof document !== "undefined") {
				const node = document.querySelector(background.element);
				if (node && this.#isSupportedElement(node)) this.#backgroundElement = node;
				else if (node) this.#warnOnce("background-element-not-supported", `Background element "${background.element}" is not a supported drawable element (canvas, video, or img)`);
				else this.#warnOnce("background-element-not-found", `Background element selector "${background.element}" not found`);
			}
		} else if (this.#isSupportedElement(background.element)) this.#backgroundElement = background.element;
	}
	#warnOnce(key, message) {
		if (!this.#backgroundWarnings.has(key)) {
			this.#backgroundWarnings.add(key);
			getLogger().warning(message);
		}
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/CanvasManager.js
var transferredCanvases = /* @__PURE__ */ new WeakMap();
var getTransferredCanvas = (canvas) => {
	const transferredCanvas = transferredCanvases.get(canvas);
	if (transferredCanvas) return transferredCanvas;
	if (typeof canvas.transferControlToOffscreen !== "function") throw new TypeError(getErrorMessage(ErrorCodes.offscreenCanvasUnsupported));
	try {
		const offscreenCanvas = canvas.transferControlToOffscreen();
		transferredCanvases.set(canvas, offscreenCanvas);
		return offscreenCanvas;
	} catch {
		throw new TypeError(getErrorMessage(ErrorCodes.offscreenCanvasTransferFailed));
	}
};
var isHtmlCanvasElement = (canvas) => {
	return typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement;
};
var getEffectiveColorSpace = (context) => {
	if (!context) return;
	return context.getContextAttributes?.().colorSpace ?? void 0;
};
function setStyle(canvas, style, important = false) {
	if (!style) return;
	const elementStyle = canvas.style, keys = /* @__PURE__ */ new Set();
	for (let i = 0; i < elementStyle.length; i++) {
		const key = elementStyle.item(i);
		if (!key) continue;
		keys.add(key);
	}
	for (let i = 0; i < style.length; i++) {
		const key = style.item(i);
		if (!key) continue;
		keys.add(key);
	}
	for (const key of keys) {
		const value = style.getPropertyValue(key);
		if (value) elementStyle.setProperty(key, value, important ? "important" : "");
		else elementStyle.removeProperty(key);
	}
}
var CanvasManager = class {
	domElement;
	render;
	renderCanvas;
	size;
	zoom = 1;
	#container;
	#generated;
	#hdrMediaListeners;
	#mutationObserver;
	#originalStyle;
	#pluginManager;
	#pointerEvents;
	#resizePlugins;
	#standardSize;
	#zoomCenter;
	constructor(pluginManager, container) {
		this.#pluginManager = pluginManager;
		this.#container = container;
		this.render = new RenderManager(pluginManager, container, this);
		this.#standardSize = {
			height: 0,
			width: 0
		};
		const pxRatio = container.retina.pixelRatio, stdSize = this.#standardSize;
		this.size = {
			height: stdSize.height * pxRatio,
			width: stdSize.width * pxRatio
		};
		this.#generated = false;
		this.#resizePlugins = [];
		this.#pointerEvents = "none";
	}
	get #fullScreen() {
		return this.#container.actualOptions.fullScreen.enable;
	}
	destroy() {
		this.stop();
		if (this.#generated) {
			this.domElement?.remove();
			this.domElement = void 0;
			this.renderCanvas = void 0;
		} else this.#resetOriginalStyle();
		this.render.destroy();
		this.#resizePlugins = [];
	}
	getZoomCenter() {
		const pxRatio = this.#container.retina.pixelRatio, { width, height } = this.size;
		if (this.#zoomCenter) return this.#zoomCenter;
		return {
			x: width * half / pxRatio,
			y: height * half / pxRatio
		};
	}
	init() {
		this.#safeMutationObserver((obs) => {
			obs.disconnect();
		});
		this.#mutationObserver = safeMutationObserver((records) => {
			for (const record of records) if (record.type === "attributes" && record.attributeName === "style") this.#repairStyle();
		});
		this.resize();
		this.#initStyle();
		this.#safeMutationObserver((obs) => {
			const element = this.domElement;
			if (!element || !(element instanceof Node)) return;
			obs.observe(element, { attributes: true });
		});
		this.initPlugins();
		this.#initContext();
		this.initBackground();
		this.#initHdrListeners();
		this.render.init();
	}
	initBackground() {
		const container = this.#container, background = container.actualOptions.background, element = this.domElement;
		if (!element) return;
		const elementStyle = element.style, color = rangeColorToRgb(this.#pluginManager, background.color);
		if (color) {
			const hdrOptions = container.actualOptions.hdr;
			elementStyle.backgroundColor = getStyleFromRgb(color, container.hdr, background.opacity, hdrOptions.peakNits, toEnumValue(HdrMode, hdrOptions.mode, HdrMode.standard));
		} else elementStyle.backgroundColor = "";
		elementStyle.backgroundImage = background.image || "";
		elementStyle.backgroundPosition = background.position || "";
		elementStyle.backgroundRepeat = background.repeat || "";
		elementStyle.backgroundSize = background.size || "";
	}
	initPlugins() {
		this.#resizePlugins = [];
		for (const plugin of this.#container.plugins) if (plugin.resize) this.#resizePlugins.push(plugin);
	}
	loadCanvas(canvas) {
		if (this.#generated && this.domElement) this.domElement.remove();
		const domCanvas = isHtmlCanvasElement(canvas) ? canvas : void 0;
		this.domElement = domCanvas;
		this.#generated = domCanvas ? domCanvas.dataset[generatedAttribute] === "true" : false;
		this.renderCanvas = domCanvas ? getTransferredCanvas(domCanvas) : canvas;
		const domElement = this.domElement;
		if (domElement) {
			domElement.ariaHidden = "true";
			this.#originalStyle = cloneStyle(domElement.style);
		}
		const standardSize = this.#standardSize, renderCanvas = this.renderCanvas;
		if (domElement) {
			standardSize.height = domElement.offsetHeight;
			standardSize.width = domElement.offsetWidth;
		} else {
			standardSize.height = renderCanvas.height;
			standardSize.width = renderCanvas.width;
		}
		const pxRatio = this.#container.retina.pixelRatio, retinaSize = this.size;
		renderCanvas.height = retinaSize.height = standardSize.height * pxRatio;
		renderCanvas.width = retinaSize.width = standardSize.width * pxRatio;
	}
	resize() {
		const element = this.domElement;
		if (!element) return false;
		const container = this.#container, renderCanvas = this.renderCanvas;
		if (renderCanvas === void 0) return false;
		const currentSize = container.canvas.#standardSize, newSize = {
			width: element.offsetWidth,
			height: element.offsetHeight
		}, pxRatio = container.retina.pixelRatio, retinaSize = {
			width: newSize.width * pxRatio,
			height: newSize.height * pxRatio
		};
		if (newSize.height === currentSize.height && newSize.width === currentSize.width && retinaSize.height === renderCanvas.height && retinaSize.width === renderCanvas.width) return false;
		const oldSize = { ...currentSize };
		currentSize.height = newSize.height;
		currentSize.width = newSize.width;
		const canvasSize = this.size;
		renderCanvas.width = canvasSize.width = retinaSize.width;
		renderCanvas.height = canvasSize.height = retinaSize.height;
		if (this.#container.started) container.particles.setResizeFactor({
			width: currentSize.width / oldSize.width,
			height: currentSize.height / oldSize.height
		});
		return true;
	}
	setPointerEvents(type) {
		if (!this.domElement) return;
		this.#pointerEvents = type;
		this.#repairStyle();
	}
	setZoom(zoomLevel, center) {
		this.zoom = zoomLevel;
		this.#zoomCenter = center;
	}
	stop() {
		this.#safeMutationObserver((obs) => {
			obs.disconnect();
		});
		this.#mutationObserver = void 0;
		this.#removeHdrListeners();
		this.render.stop();
	}
	async windowResize() {
		if (!this.domElement || !this.resize()) return;
		const container = this.#container, needsRefresh = container.updateActualOptions();
		container.particles.setDensity();
		this.#applyResizePlugins();
		if (needsRefresh) await container.refresh();
	}
	#applyResizePlugins() {
		for (const plugin of this.#resizePlugins) plugin.resize?.();
	}
	#initContext() {
		const container = this.#container, canSupportHdr = container.actualOptions.hdr.enable && safeMatchMedia("(color-gamut: p3)")?.matches && safeMatchMedia("(dynamic-range: high)")?.matches;
		container.hdrMode = toEnumValue(HdrMode, container.actualOptions.hdr.mode, HdrMode.standard);
		container.peakNits = container.actualOptions.hdr.peakNits;
		const renderCanvas = this.renderCanvas;
		if (!renderCanvas) {
			container.hdr = canSupportHdr ?? false;
			return;
		}
		this.render.setContextSettings({
			alpha: true,
			desynchronized: true,
			willReadFrequently: false,
			...canSupportHdr ? {
				colorSpace: "display-p3",
				colorType: "float16"
			} : { colorSpace: "srgb" }
		});
		let context;
		try {
			context = renderCanvas.getContext("2d", this.render.settings);
		} catch {
			context = null;
		}
		if (canSupportHdr && !context) {
			const sdrSettings = {
				alpha: true,
				desynchronized: true,
				willReadFrequently: false,
				colorSpace: "srgb"
			};
			this.render.setContextSettings(sdrSettings);
			try {
				context = renderCanvas.getContext("2d", sdrSettings);
			} catch {
				context = null;
			}
		}
		this.render.setContext(context);
		if (context) {
			const effectiveColorSpace = getEffectiveColorSpace(context);
			if (effectiveColorSpace !== void 0) container.hdr = effectiveColorSpace === "display-p3";
		}
	}
	#initHdrListeners() {
		this.#removeHdrListeners();
		const p3Query = safeMatchMedia("(color-gamut: p3)"), hdrQuery = safeMatchMedia("(dynamic-range: high)"), handleChange = () => {
			this.#initContext();
			this.initBackground();
		}, listeners = [];
		if (p3Query) {
			p3Query.addEventListener("change", handleChange);
			listeners.push({
				handler: handleChange,
				mql: p3Query
			});
		}
		if (hdrQuery) {
			hdrQuery.addEventListener("change", handleChange);
			listeners.push({
				handler: handleChange,
				mql: hdrQuery
			});
		}
		this.#hdrMediaListeners = listeners;
	}
	#initStyle() {
		const element = this.domElement, options = this.#container.actualOptions;
		if (!element) return;
		if (this.#fullScreen) this.#setFullScreenStyle();
		else this.#resetOriginalStyle();
		for (const key in options.style) {
			if (!key || !(key in options.style)) continue;
			const value = options.style[key];
			if (!value) continue;
			element.style.setProperty(key, value, "important");
		}
	}
	#removeHdrListeners() {
		if (!this.#hdrMediaListeners) return;
		for (const { handler, mql } of this.#hdrMediaListeners) mql.removeEventListener("change", handler);
		this.#hdrMediaListeners = void 0;
	}
	#repairStyle() {
		const element = this.domElement;
		if (!element) return;
		this.#safeMutationObserver((observer) => {
			observer.disconnect();
		});
		this.#initStyle();
		this.initBackground();
		const pointerEvents = this.#pointerEvents;
		element.style.pointerEvents = pointerEvents;
		element.style.setProperty("pointer-events", pointerEvents);
		this.#safeMutationObserver((observer) => {
			if (!(element instanceof Node)) return;
			observer.observe(element, { attributes: true });
		});
	}
	#resetOriginalStyle() {
		const element = this.domElement, originalStyle = this.#originalStyle;
		if (!element || !originalStyle) return;
		setStyle(element, originalStyle, true);
	}
	#safeMutationObserver(callback) {
		if (!this.#mutationObserver) return;
		callback(this.#mutationObserver);
	}
	#setFullScreenStyle() {
		const element = this.domElement;
		if (!element) return;
		setStyle(element, getFullScreenStyle(this.#container.actualOptions.fullScreen.zIndex), true);
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/Utils/EventListeners.js
var EventListeners = class {
	#container;
	#handlers;
	#resizeObserver;
	#resizeTimeout;
	constructor(container) {
		this.#container = container;
		this.#handlers = {
			visibilityChange: () => {
				this.#handleVisibilityChange();
			},
			resize: () => {
				this.#handleWindowResize();
			}
		};
	}
	addListeners() {
		this.#manageListeners(true);
	}
	removeListeners() {
		if (this.#resizeTimeout !== void 0) {
			clearTimeout(this.#resizeTimeout);
			this.#resizeTimeout = void 0;
		}
		this.#manageListeners(false);
	}
	#handleVisibilityChange() {
		const container = this.#container;
		if (!container.actualOptions.pauseOnBlur) return;
		if (safeDocument().hidden) {
			container.pageHidden = true;
			container.pause();
		} else {
			container.pageHidden = false;
			if (container.animationStatus) container.play(true);
			else container.draw(true);
		}
	}
	#handleWindowResize() {
		if (this.#resizeTimeout) {
			clearTimeout(this.#resizeTimeout);
			this.#resizeTimeout = void 0;
		}
		const handleResize = async () => {
			await this.#container.canvas.windowResize();
		};
		this.#resizeTimeout = setTimeout(() => void handleResize(), this.#container.actualOptions.resize.delay * millisecondsToSeconds);
	}
	#manageListeners(add) {
		const handlers = this.#handlers;
		this.#manageResize(add);
		manageListener(document, visibilityChangeEvent, handlers.visibilityChange, add, false);
	}
	#manageResize(add) {
		const handlers = this.#handlers, container = this.#container;
		if (!container.actualOptions.resize.enable) return;
		if (typeof ResizeObserver === "undefined") {
			manageListener(globalThis, resizeEvent, handlers.resize, add);
			return;
		}
		const canvasEl = container.canvas.domElement;
		if (this.#resizeObserver && !add) {
			if (canvasEl) this.#resizeObserver.unobserve(canvasEl);
			this.#resizeObserver.disconnect();
			this.#resizeObserver = void 0;
		} else if (!this.#resizeObserver && add && canvasEl) {
			this.#resizeObserver = new ResizeObserver((entries) => {
				if (!entries.some((e) => e.target === canvasEl)) return;
				this.#handleWindowResize();
			});
			this.#resizeObserver.observe(canvasEl);
		}
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/Particle.js
function loadEffectData(effect, effectOptions, id, reduceDuplicates) {
	const effectData = effectOptions.options[effect];
	return deepExtend({ close: effectOptions.close }, itemFromSingleOrMultiple(effectData, id, reduceDuplicates));
}
function loadShapeData(shape, shapeOptions, id, reduceDuplicates) {
	const shapeData = shapeOptions.options[shape];
	return deepExtend({ close: shapeOptions.close }, itemFromSingleOrMultiple(shapeData, id, reduceDuplicates));
}
function fixOutMode(data) {
	if (!isInArray(data.outMode, data.checkModes)) return;
	const diameter = data.radius * 2;
	if (data.coord > data.maxCoord - diameter) data.setCb(-data.radius);
	else if (data.coord < diameter) data.setCb(data.radius);
}
function normalizeAngle(angle, modulus) {
	const normalized = angle % modulus;
	return normalized < 0 ? normalized + modulus : normalized;
}
function initParticleState(particle, id, group) {
	particle.id = id;
	particle.group = group;
	particle.justWarped = false;
	particle.effectClose = true;
	particle.shapeClose = true;
	particle.pathRotation = false;
	particle.lastPathTime = 0;
	particle.destroyed = false;
	particle.unbreakable = false;
	particle.isRotating = false;
	particle.rotation = 0;
	particle.misplaced = false;
	particle.retina = {
		maxDistance: {},
		maxSpeed: 0,
		moveDrift: 0,
		moveSpeed: 0,
		sizeAnimationSpeed: 0
	};
	particle.size = {
		value: 1,
		max: 1,
		min: 1,
		enable: false
	};
	particle.outType = ParticleOutType.normal;
	particle.ignoresResizeRatio = true;
}
function resolveParticleOptions(particle, container, pluginManager, overrideOptions) {
	const mainOptions = container.actualOptions, particlesOptions = loadParticlesOptions(pluginManager, container, mainOptions.particles), reduceDuplicates = particlesOptions.reduceDuplicates;
	particle.effect = itemFromSingleOrMultiple(particlesOptions.effect.type, particle.id, reduceDuplicates);
	particle.shape = itemFromSingleOrMultiple(particlesOptions.shape.type, particle.id, reduceDuplicates);
	const effectOptions = particlesOptions.effect, shapeOptions = particlesOptions.shape;
	if (overrideOptions) {
		if (overrideOptions.effect) {
			const overrideEffectType = overrideOptions.effect.type;
			if (overrideEffectType && overrideEffectType !== particle.effect) {
				const effect = itemFromSingleOrMultiple(overrideEffectType, particle.id, reduceDuplicates);
				if (effect) particle.effect = effect;
			}
			effectOptions.load(overrideOptions.effect);
		}
		if (overrideOptions.shape) {
			const overrideShapeType = overrideOptions.shape.type;
			if (overrideShapeType && overrideShapeType !== particle.shape) {
				const shape = itemFromSingleOrMultiple(overrideShapeType, particle.id, reduceDuplicates);
				if (shape) particle.shape = shape;
			}
			shapeOptions.load(overrideOptions.shape);
		}
	}
	if (particle.effect === "random") {
		const availableEffects = [...container.effectDrawers.keys()];
		particle.effect = availableEffects[Math.floor(getRandom() * availableEffects.length)];
	}
	if (particle.shape === "random") {
		const availableShapes = [...container.shapeDrawers.keys()];
		particle.shape = availableShapes[Math.floor(getRandom() * availableShapes.length)];
	}
	particle.effectData = particle.effect ? loadEffectData(particle.effect, effectOptions, particle.id, reduceDuplicates) : void 0;
	particle.shapeData = particle.shape ? loadShapeData(particle.shape, shapeOptions, particle.id, reduceDuplicates) : void 0;
	particlesOptions.load(overrideOptions);
	const effectData = particle.effectData, shapeData = particle.shapeData;
	if (effectData) particlesOptions.load(effectData.particles);
	if (shapeData) particlesOptions.load(shapeData.particles);
	particle.effectClose = effectData?.close ?? particlesOptions.effect.close;
	particle.shapeClose = shapeData?.close ?? particlesOptions.shape.close;
	return particlesOptions;
}
function initParticleDrawers(particle, container) {
	let effectDrawer, shapeDrawer;
	if (particle.effect) effectDrawer = container.effectDrawers.get(particle.effect);
	if (effectDrawer?.loadEffect) effectDrawer.loadEffect(particle);
	if (particle.shape) shapeDrawer = container.shapeDrawers.get(particle.shape);
	if (shapeDrawer?.loadShape) shapeDrawer.loadShape(particle);
	const sideCountFunc = shapeDrawer?.getSidesCount;
	if (sideCountFunc) particle.sides = sideCountFunc(particle);
}
function runUpdaterPreInit(updaters, particle) {
	for (const updater of updaters) updater.preInit?.(particle);
}
function runUpdaterInit(updaters, particle) {
	for (const updater of updaters) updater.init(particle);
}
function runDrawerInit(container, particle) {
	const shapeDrawer = particle.shape ? container.shapeDrawers.get(particle.shape) : void 0;
	(particle.effect ? container.effectDrawers.get(particle.effect) : void 0)?.particleInit?.(container, particle);
	shapeDrawer?.particleInit?.(container, particle);
}
function runParticleCreatedPlugins(container, particle) {
	for (const plugin of container.particleCreatedPlugins) plugin.particleCreated?.(particle);
}
var Particle = class {
	backColor;
	destroyed;
	direction;
	effect;
	effectClose;
	effectData;
	fillColor;
	fillEnabled;
	fillOpacity;
	group;
	id;
	ignoresResizeRatio;
	initialPosition;
	initialVelocity;
	isRotating;
	justWarped;
	lastPathTime;
	misplaced;
	moveCenter;
	offset;
	opacity;
	options;
	outType;
	pathRotation;
	position;
	randomIndexData;
	retina;
	roll;
	rotation;
	shape;
	shapeClose;
	shapeData;
	sides;
	size;
	spawning;
	strokeColor;
	strokeOpacity;
	strokeWidth;
	unbreakable;
	velocity;
	zIndexFactor;
	#cachedOpacityData = {
		fillOpacity: 1,
		opacity: 1,
		strokeOpacity: 1
	};
	#cachedPosition = Vector3d.origin;
	#cachedRotateData = {
		sin: 0,
		cos: 0
	};
	#cachedTransform = {
		a: 1,
		b: 0,
		c: 0,
		d: 1
	};
	#container;
	#modifiers = [];
	#pluginManager;
	constructor(pluginManager, container) {
		this.#pluginManager = pluginManager;
		this.#container = container;
	}
	addModifier(modifier) {
		this.#modifiers.push(modifier);
		this.#modifiers.sort((a, b) => a.priority - b.priority);
	}
	clearModifiers() {
		this.#modifiers.length = 0;
	}
	destroy(override) {
		if (this.unbreakable || this.destroyed) return;
		this.destroyed = true;
		this.clearModifiers();
		const container = this.#container;
		(this.shape ? container.shapeDrawers.get(this.shape) : void 0)?.particleDestroy?.(this);
		for (const plugin of container.particleDestroyedPlugins) plugin.particleDestroyed?.(this, override);
		for (const updater of container.particleUpdaters) updater.particleDestroyed?.(this, override);
		this.#container.dispatchEvent(EventType.particleDestroyed, { particle: this });
	}
	draw(delta) {
		const render = this.#container.canvas.render;
		render.drawParticlePlugins(this, delta);
		render.drawParticle(this, delta);
	}
	getAngle() {
		return this.rotation + (this.pathRotation ? this.velocity.angle : 0);
	}
	getFillColor() {
		return this.#getRollColor(this.#applyModifiers(getHslFromAnimation(this.fillColor), (m) => m.fillColor));
	}
	getMass() {
		return this.getRadius() ** 2 * Math.PI * half;
	}
	getModifier(id) {
		return this.#modifiers.find((m) => m.id === id);
	}
	getOpacity() {
		const zIndexOptions = this.options.zIndex, zOpacityFactor = (1 - this.zIndexFactor) ** zIndexOptions.opacityRate, baseOpacity = getRangeValue(this.opacity?.value ?? 1), opacity = this.#applyModifiers(void 0, (m) => m.opacity) ?? baseOpacity;
		this.#cachedOpacityData.fillOpacity = this.fillOpacity ?? 1;
		this.#cachedOpacityData.opacity = opacity * zOpacityFactor;
		this.#cachedOpacityData.strokeOpacity = this.strokeOpacity ?? 1;
		return this.#cachedOpacityData;
	}
	getPosition() {
		this.#cachedPosition.x = this.position.x + this.offset.x;
		this.#cachedPosition.y = this.position.y + this.offset.y;
		this.#cachedPosition.z = this.position.z;
		return this.#cachedPosition;
	}
	getRadius() {
		return this.#applyModifiers(this.size.value, (m) => m.radius);
	}
	getRotateData() {
		const angle = this.getAngle();
		this.#cachedRotateData.sin = Math.sin(angle);
		this.#cachedRotateData.cos = Math.cos(angle);
		return this.#cachedRotateData;
	}
	getStrokeColor() {
		return this.#getRollColor(this.#applyModifiers(getHslFromAnimation(this.strokeColor), (m) => m.strokeColor));
	}
	getTransformData(externalTransform) {
		const rotateData = this.getRotateData(), rotating = this.isRotating;
		this.#cachedTransform.a = rotateData.cos * (externalTransform.a ?? defaultTransform.a);
		this.#cachedTransform.b = rotating ? rotateData.sin * (externalTransform.b ?? 1) : externalTransform.b ?? defaultTransform.b;
		this.#cachedTransform.c = rotating ? -rotateData.sin * (externalTransform.c ?? 1) : externalTransform.c ?? defaultTransform.c;
		this.#cachedTransform.d = rotateData.cos * (externalTransform.d ?? defaultTransform.d);
		return this.#cachedTransform;
	}
	init(id, position, overrideOptions, group) {
		const container = this.#container;
		initParticleState(this, id, group);
		this.options = resolveParticleOptions(this, container, this.#pluginManager, overrideOptions);
		container.retina.initParticle(this);
		runUpdaterPreInit(container.particleUpdaters, this);
		this.#initPosition(position);
		this.initialVelocity = this.#calculateVelocity();
		this.velocity = this.initialVelocity.copy();
		this.zIndexFactor = this.position.z / container.zLayers;
		this.sides = 24;
		initParticleDrawers(this, container);
		this.spawning = false;
		runUpdaterInit(container.particleUpdaters, this);
		runDrawerInit(container, this);
		runParticleCreatedPlugins(container, this);
	}
	isInsideCanvas(direction) {
		return this.#getInsideCanvasResult({ direction }).inside;
	}
	isInsideCanvasForOutMode(outMode, direction) {
		return this.#getInsideCanvasResult({
			direction,
			outMode
		}).inside;
	}
	isShowingBack() {
		if (!this.roll) return false;
		const angle = this.roll.angle;
		if (this.roll.horizontal && this.roll.vertical) {
			const adjustedAngle = normalizeAngle(angle, doublePI);
			return adjustedAngle >= Math.PI * .5 && adjustedAngle < Math.PI * 3 * .5;
		}
		if (this.roll.horizontal) {
			const adjustedAngle = normalizeAngle(angle + Math.PI * half, doublePI);
			return adjustedAngle >= Math.PI && adjustedAngle < Math.PI * 2;
		}
		if (this.roll.vertical) {
			const adjustedAngle = normalizeAngle(angle, doublePI);
			return adjustedAngle >= Math.PI && adjustedAngle < Math.PI * 2;
		}
		return false;
	}
	isVisible() {
		return !this.destroyed && !this.spawning && this.isInsideCanvas();
	}
	removeModifier(id) {
		const idx = this.#modifiers.findIndex((m) => m.id === id);
		if (idx >= 0) this.#modifiers.splice(idx, 1);
	}
	reset() {
		for (const updater of this.#container.particleUpdaters) updater.reset?.(this);
	}
	#applyModifiers(base, getter) {
		let value = base;
		for (const mod of this.#modifiers) if (mod.enabled) {
			const override = getter(mod);
			if (override !== void 0) value = override;
		}
		return value;
	}
	#calcPosition(position, zIndex) {
		let tryCount = 0, posVec = position ? Vector3d.create(position.x, position.y, zIndex) : void 0;
		const container = this.#container, plugins = container.particlePositionPlugins, outModes = this.options.move.outModes, radius = this.getRadius(), canvasSize = container.canvas.size;
		for (;;) {
			for (const plugin of plugins) {
				const pluginPos = plugin.particlePosition?.(posVec, this);
				if (pluginPos) return Vector3d.create(pluginPos.x, pluginPos.y, zIndex);
			}
			const exactPosition = calcExactPositionOrRandomFromSize({
				size: canvasSize,
				position: posVec
			}), pos = Vector3d.create(exactPosition.x, exactPosition.y, zIndex);
			this.#fixHorizontal(pos, radius, outModes.left ?? outModes.default);
			this.#fixHorizontal(pos, radius, outModes.right ?? outModes.default);
			this.#fixVertical(pos, radius, outModes.top ?? outModes.default);
			this.#fixVertical(pos, radius, outModes.bottom ?? outModes.default);
			let isValidPosition = true;
			for (const plugin of container.particles.checkParticlePositionPlugins) {
				isValidPosition = plugin.checkParticlePosition?.(this, pos, tryCount) ?? true;
				if (!isValidPosition) break;
			}
			if (isValidPosition) return pos;
			tryCount += 1;
			posVec = void 0;
		}
	}
	#calculateVelocity() {
		const moveOptions = this.options.move, res = getParticleBaseVelocity(this.direction).copy();
		if (moveOptions.direction === MoveDirection.inside || moveOptions.direction === MoveDirection.outside) return res;
		const rad = degToRad(getRangeValue(moveOptions.angle.value)), radOffset = degToRad(getRangeValue(moveOptions.angle.offset)), range = {
			left: radOffset - rad * half,
			right: radOffset + rad * half
		};
		if (!moveOptions.straight) res.angle += randomInRangeValue(setRangeValue(range.left, range.right));
		if (moveOptions.random && typeof moveOptions.speed === "number") res.length *= getRandom();
		return res;
	}
	#fixHorizontal(pos, radius, outMode) {
		fixOutMode({
			outMode,
			checkModes: [OutMode.bounce],
			coord: pos.x,
			maxCoord: this.#container.canvas.size.width,
			setCb: (value) => pos.x += value,
			radius
		});
	}
	#fixVertical(pos, radius, outMode) {
		fixOutMode({
			outMode,
			checkModes: [OutMode.bounce],
			coord: pos.y,
			maxCoord: this.#container.canvas.size.height,
			setCb: (value) => pos.y += value,
			radius
		});
	}
	#getDefaultInsideCanvasResult(direction, outMode) {
		const radius = this.getRadius(), canvasSize = this.#container.canvas.size, position = this.position, isBounce = outMode === OutMode.bounce || outMode === OutMode.split;
		if (direction === OutModeDirection.bottom) return {
			inside: isBounce ? position.y + radius < canvasSize.height : position.y - radius < canvasSize.height,
			reason: "default"
		};
		if (direction === OutModeDirection.left) return {
			inside: isBounce ? position.x - radius > 0 : position.x + radius > 0,
			reason: "default"
		};
		if (direction === OutModeDirection.right) return {
			inside: isBounce ? position.x + radius < canvasSize.width : position.x - radius < canvasSize.width,
			reason: "default"
		};
		if (direction === OutModeDirection.top) return {
			inside: isBounce ? position.y - radius > 0 : position.y + radius > 0,
			reason: "default"
		};
		return {
			inside: position.x >= -radius && position.y >= -radius && position.y <= canvasSize.height + radius && position.x <= canvasSize.width + radius,
			reason: "default"
		};
	}
	#getInsideCanvasCallbackData(direction, outMode) {
		return {
			canvasSize: this.#container.canvas.size,
			direction,
			outMode,
			particle: this,
			radius: this.getRadius()
		};
	}
	#getInsideCanvasResult(data) {
		const defaultResult = this.#getDefaultInsideCanvasResult(data.direction, data.outMode), container = this.#container, shapeDrawer = this.shape ? container.shapeDrawers.get(this.shape) : void 0, effectDrawer = this.effect ? container.effectDrawers.get(this.effect) : void 0, shapeCheck = shapeDrawer?.isInsideCanvas, effectCheck = effectDrawer?.isInsideCanvas;
		if (!shapeCheck && !effectCheck) return defaultResult;
		const callbackData = this.#getInsideCanvasCallbackData(data.direction, data.outMode), shapeResult = shapeCheck ? this.#normalizeInsideCanvasResult(shapeCheck(callbackData), "shape") : void 0, effectResult = effectCheck ? this.#normalizeInsideCanvasResult(effectCheck(callbackData), "effect") : void 0;
		if (shapeResult && effectResult) {
			const margin = Math.max(shapeResult.margin ?? 0, effectResult.margin ?? 0);
			return {
				inside: shapeResult.inside && effectResult.inside,
				margin: margin > 0 ? margin : void 0,
				reason: "combined"
			};
		}
		return shapeResult ?? effectResult ?? defaultResult;
	}
	#getRollColor(color) {
		if (!color || !this.roll || !this.backColor && !this.roll.alter) return color;
		if (!this.isShowingBack()) return color;
		if (this.backColor) return this.backColor;
		if (this.roll.alter) return alterHsl(color, this.roll.alter.type, this.roll.alter.value);
		return color;
	}
	#initPosition(position) {
		const container = this.#container, zIndexValue = Math.floor(getRangeValue(this.options.zIndex.value)), initialPosition = this.#calcPosition(position, clamp(zIndexValue, 0, container.zLayers));
		if (!initialPosition) throw new Error(getErrorMessage(ErrorCodes.particlePositionNotFound));
		this.position = initialPosition;
		this.initialPosition = this.position.copy();
		const canvasSize = container.canvas.size;
		this.moveCenter = {
			...getPosition(this.options.move.center, canvasSize),
			radius: this.options.move.center.radius,
			mode: this.options.move.center.mode
		};
		this.direction = getParticleDirectionAngle(this.options.move.direction, this.position, this.moveCenter);
		switch (this.options.move.direction) {
			case MoveDirection.inside:
				this.outType = ParticleOutType.inside;
				break;
			case MoveDirection.outside: this.outType = ParticleOutType.outside;
		}
		this.offset = Vector.origin;
	}
	#normalizeInsideCanvasResult(result, reason) {
		if (typeof result === "boolean") return {
			inside: result,
			reason
		};
		return {
			inside: result.inside,
			margin: result.margin,
			reason: result.reason ?? reason
		};
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/Utils/SpatialHashGrid.js
var SpatialHashGrid = class {
	#cellSize;
	#cells = /* @__PURE__ */ new Map();
	#circlePool = [];
	#circlePoolIdx;
	#pendingCellSize;
	#rectanglePool = [];
	#rectanglePoolIdx;
	constructor(cellSize) {
		this.#cellSize = cellSize;
		this.#circlePoolIdx = 0;
		this.#rectanglePoolIdx = 0;
	}
	get cellSize() {
		return this.#cellSize;
	}
	set cellSize(value) {
		this.#pendingCellSize = value;
	}
	clear() {
		this.#cells.clear();
		const pendingCellSize = this.#pendingCellSize;
		if (pendingCellSize) this.#cellSize = pendingCellSize;
		this.#pendingCellSize = void 0;
	}
	insert(particle) {
		const { x, y } = particle.getPosition(), key = this.#cellKeyFromCoords(x, y);
		if (!this.#cells.has(key)) this.#cells.set(key, []);
		this.#cells.get(key)?.push(particle);
	}
	query(range, check, out = []) {
		const bounds = this.#getRangeBounds(range);
		if (!bounds) return out;
		const minCellX = Math.floor(bounds.minX / this.#cellSize), maxCellX = Math.floor(bounds.maxX / this.#cellSize), minCellY = Math.floor(bounds.minY / this.#cellSize), maxCellY = Math.floor(bounds.maxY / this.#cellSize);
		for (let cx = minCellX; cx <= maxCellX; cx++) for (let cy = minCellY; cy <= maxCellY; cy++) this.#queryCell(cx, cy, range, check, out);
		return out;
	}
	queryCircle(position, radius, check, out = []) {
		const circle = this.#acquireCircle(position.x, position.y, radius);
		try {
			return this.query(circle, check, out);
		} finally {
			this.#circlePoolIdx--;
		}
	}
	queryRectangle(position, size, check, out = []) {
		const rect = this.#acquireRectangle(position.x, position.y, size.width, size.height);
		try {
			return this.query(rect, check, out);
		} finally {
			this.#rectanglePoolIdx--;
		}
	}
	#acquireCircle(x, y, r) {
		const idx = this.#circlePoolIdx++;
		let circle = this.#circlePool[idx];
		if (!circle) {
			circle = new Circle(x, y, r);
			this.#circlePool[idx] = circle;
		}
		return circle.reset(x, y, r);
	}
	#acquireRectangle(x, y, w, h) {
		const idx = this.#rectanglePoolIdx++;
		let rectangle = this.#rectanglePool[idx];
		if (!rectangle) {
			rectangle = new Rectangle(x, y, w, h);
			this.#rectanglePool[idx] = rectangle;
		}
		return rectangle.reset(x, y, w, h);
	}
	#cellKeyFromCoords(x, y) {
		return `${Math.floor(x / this.#cellSize)}_${Math.floor(y / this.#cellSize)}`;
	}
	#getRangeBounds(range) {
		if (range instanceof Circle) {
			const r = range.radius, { x, y } = range.position;
			return {
				minX: x - r,
				maxX: x + r,
				minY: y - r,
				maxY: y + r
			};
		}
		if (range instanceof Rectangle) {
			const { x, y } = range.position, { width, height } = range.size;
			return {
				minX: x,
				maxX: x + width,
				minY: y,
				maxY: y + height
			};
		}
		return null;
	}
	#queryCell(cx, cy, range, check, out) {
		const cellParticles = this.#cells.get(`${cx}_${cy}`);
		if (!cellParticles) return;
		for (const p of cellParticles) {
			if (check && !check(p)) continue;
			if (range.contains(p.getPosition())) out.push(p);
		}
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/ParticlesManager.js
var ParticlesManager = class {
	checkParticlePositionPlugins;
	#array;
	#container;
	#grid;
	#groupLimits;
	#limit;
	#nextId;
	#particleBuckets;
	#particleResetPlugins;
	#particleUpdatePlugins;
	#pluginManager;
	#pool;
	#postParticleUpdatePlugins;
	#postUpdatePlugins;
	#resizeFactor;
	#updatePlugins;
	#zBuckets;
	constructor(pluginManager, container) {
		this.#pluginManager = pluginManager;
		this.#container = container;
		this.#nextId = 0;
		this.#array = [];
		this.#pool = [];
		this.#limit = 0;
		this.#groupLimits = /* @__PURE__ */ new Map();
		this.#particleBuckets = /* @__PURE__ */ new Map();
		this.#zBuckets = this.#createBuckets(this.#container.zLayers);
		this.#grid = new SpatialHashGrid(100);
		this.checkParticlePositionPlugins = [];
		this.#particleResetPlugins = [];
		this.#particleUpdatePlugins = [];
		this.#postUpdatePlugins = [];
		this.#postParticleUpdatePlugins = [];
		this.#updatePlugins = [];
	}
	get count() {
		return this.#array.length;
	}
	get grid() {
		return this.#grid;
	}
	addParticle(position, overrideOptions, group, initializer) {
		if (this.#checkAndApplyLimits(group, this.count)) return;
		try {
			const particle = this.#pool.pop() ?? new Particle(this.#pluginManager, this.#container);
			particle.init(this.#nextId, position, overrideOptions, group);
			let canAdd = true;
			if (initializer) canAdd = initializer(particle);
			if (!canAdd) {
				this.#pool.push(particle);
				return;
			}
			this.#array.push(particle);
			this.#insertParticleIntoBucket(particle);
			this.#nextId++;
			this.#container.dispatchEvent(EventType.particleAdded, { particle });
			return particle;
		} catch (e) {
			getLogger().warning(`error adding particle: ${e}`);
		}
	}
	clear() {
		this.#array = [];
		this.#particleBuckets.clear();
		this.#resetBuckets(this.#container.zLayers);
	}
	destroy() {
		this.#array = [];
		this.#pool.length = 0;
		this.#particleBuckets.clear();
		this.#zBuckets = [];
		this.checkParticlePositionPlugins = [];
		this.#particleResetPlugins = [];
		this.#particleUpdatePlugins = [];
		this.#postUpdatePlugins = [];
		this.#postParticleUpdatePlugins = [];
		this.#updatePlugins = [];
	}
	drawParticles(delta) {
		for (let i = this.#zBuckets.length - 1; i >= 0; i--) {
			const bucket = this.#zBuckets[i];
			if (!bucket) continue;
			for (const particle of bucket) particle.draw(delta);
		}
	}
	filter(condition) {
		return this.#array.filter(condition);
	}
	find(condition) {
		return this.#array.find(condition);
	}
	get(index) {
		return this.#array[index];
	}
	async init() {
		const container = this.#container;
		this.checkParticlePositionPlugins = [];
		this.#updatePlugins = [];
		this.#particleUpdatePlugins = [];
		this.#postUpdatePlugins = [];
		this.#particleResetPlugins = [];
		this.#postParticleUpdatePlugins = [];
		this.#particleBuckets.clear();
		this.#resetBuckets(container.zLayers);
		this.#grid = new SpatialHashGrid(100 * container.retina.pixelRatio);
		this.#applyLimits(container.actualOptions.particles);
		const groups = container.actualOptions.particles.groups;
		for (const group in groups) {
			const groupData = groups[group];
			if (groupData) this.#applyLimits(loadParticlesOptions(this.#pluginManager, this.#container, groupData), group, groupData);
		}
		await this.#initPlugins();
	}
	push(nb, position, overrideOptions, group) {
		for (let i = 0; i < nb; i++) this.addParticle(position, overrideOptions, group);
	}
	async redraw() {
		this.clear();
		await this.init();
		this.#container.canvas.render.drawParticles({
			value: 0,
			factor: 0
		});
	}
	remove(particle, group, override) {
		this.removeAt(this.#array.indexOf(particle), void 0, group, override);
	}
	removeAt(index, quantity = 1, group, override, matchGroup = true) {
		if (index < 0 || index > this.count) return;
		let deleted = 0;
		for (let i = index; deleted < quantity && i < this.count; i++) if (this.#removeParticle(i, group, override, matchGroup)) {
			i--;
			deleted++;
		}
	}
	removeQuantity(quantity, group) {
		this.removeAt(0, quantity, group);
	}
	setDensity() {
		const options = this.#container.actualOptions, groups = options.particles.groups;
		let pluginsCount = 0;
		for (const plugin of this.#container.plugins) if (plugin.particlesDensityCount) pluginsCount += plugin.particlesDensityCount();
		for (const group in groups) {
			const groupData = groups[group];
			if (!groupData) continue;
			const groupDataOptions = loadParticlesOptions(this.#pluginManager, this.#container, groupData);
			this.#applyDensity(groupDataOptions, pluginsCount, group);
		}
		this.#applyDensity(options.particles, pluginsCount);
	}
	setResizeFactor(factor) {
		this.#resizeFactor = factor;
	}
	update(delta) {
		this.#grid.clear();
		for (const plugin of this.#updatePlugins) plugin.update?.(delta);
		const particlesToDelete = this.#updateParticlesPhase1(delta);
		for (const plugin of this.#postUpdatePlugins) plugin.postUpdate?.(delta);
		this.#updateParticlesPhase2(delta, particlesToDelete);
		if (particlesToDelete.size) for (const particle of particlesToDelete) this.remove(particle, particle.group);
		this.#resizeFactor = void 0;
	}
	#addToPool(...particles) {
		this.#pool.push(...particles);
	}
	#applyDensity(options, pluginsCount, group, groupOptions) {
		const numberOptions = options.number;
		if (!numberOptions.density.enable) {
			this.#applyLimits(options, group, groupOptions);
			return;
		}
		const densityFactor = this.#initDensityFactor(numberOptions.density), optParticlesNumber = numberOptions.value, optParticlesLimit = numberOptions.limit.value > 0 ? numberOptions.limit.value : optParticlesNumber, particlesNumber = Math.min(optParticlesNumber, optParticlesLimit) * densityFactor + pluginsCount, particlesCount = Math.min(this.count, this.filter((t) => t.group === group).length);
		if (group === void 0) this.#limit = numberOptions.limit.value * densityFactor;
		else this.#groupLimits.set(group, {
			limit: numberOptions.limit.value * densityFactor,
			mode: toEnumValue(LimitMode, numberOptions.limit.mode, LimitMode.delete)
		});
		if (particlesCount < particlesNumber) this.push(Math.abs(particlesNumber - particlesCount), void 0, options, group);
		else if (particlesCount > particlesNumber) this.removeQuantity(particlesCount - particlesNumber, group);
	}
	#applyLimits(options, group, groupOptions) {
		if (group === void 0) {
			this.#limit = options.number.limit.value;
			const groups = this.#container.actualOptions.particles.groups;
			for (const existingGroup of this.#groupLimits.keys()) if (!(existingGroup in groups)) this.#groupLimits.delete(existingGroup);
		} else {
			const limitValue = groupOptions?.number?.limit?.value ?? options.number.limit.value;
			if (limitValue > 0) this.#groupLimits.set(group, {
				limit: limitValue,
				mode: toEnumValue(LimitMode, groupOptions?.number?.limit?.mode ?? options.number.limit.mode, LimitMode.delete)
			});
			else this.#groupLimits.delete(group);
		}
	}
	#checkAndApplyLimits(group, currentCount) {
		const globalLimit = this.#limit, globalMode = this.#container.actualOptions.particles.number.limit.mode;
		if (globalLimit > 0 && globalMode === LimitMode.wait && currentCount >= globalLimit) return true;
		const groupLimitEntry = group === void 0 ? void 0 : this.#groupLimits.get(group);
		if (groupLimitEntry && groupLimitEntry.limit > 0 && groupLimitEntry.mode === LimitMode.wait) {
			if (this.filter((t) => t.group === group).length >= groupLimitEntry.limit) return true;
		}
		if (groupLimitEntry && groupLimitEntry.limit > 0 && groupLimitEntry.mode === LimitMode.delete) {
			const groupCountToRemove = this.filter((t) => t.group === group).length + 1 - groupLimitEntry.limit;
			if (groupCountToRemove > 0) this.removeQuantity(groupCountToRemove, group);
		}
		if (globalLimit > 0 && globalMode === LimitMode.delete) {
			const globalCountToRemove = this.count + 1 - globalLimit;
			if (globalCountToRemove > 0) this.#removeAny(globalCountToRemove);
		}
		return false;
	}
	#createBuckets(zLayers) {
		const bucketCount = Math.max(Math.floor(zLayers), 1);
		return Array.from({ length: bucketCount }, () => []);
	}
	#getBucketIndex(zIndex) {
		const maxBucketIndex = this.#zBuckets.length - 1;
		if (maxBucketIndex <= 0) return 0;
		return Math.min(Math.max(Math.floor(zIndex), 0), maxBucketIndex);
	}
	#initDensityFactor(densityOptions) {
		const container = this.#container;
		if (!densityOptions.enable) return 1;
		const canvasSize = container.canvas.size, pxRatio = container.retina.pixelRatio;
		if (!canvasSize.width || !canvasSize.height) return 1;
		return canvasSize.width * canvasSize.height / (densityOptions.height * densityOptions.width * pxRatio ** 2);
	}
	async #initDrawersAndUpdaters() {
		const container = this.#container;
		await container.initDrawersAndUpdaters();
		for (const drawer of container.effectDrawers.values()) await drawer.init?.(container);
		for (const drawer of container.shapeDrawers.values()) await drawer.init?.(container);
	}
	async #initPlugins() {
		await this.#initPluginsArrays();
		await this.#initDrawersAndUpdaters();
		let handled = false;
		const container = this.#container;
		for (const plugin of container.plugins) {
			handled = plugin.particlesInitialization?.() ?? handled;
			if (handled) break;
		}
		if (handled) return;
		const particlesOptions = container.actualOptions.particles, groups = particlesOptions.groups;
		for (const group in groups) {
			const groupOptions = groups[group];
			if (!groupOptions) continue;
			for (let i = this.count, j = 0; j < groupOptions.number.value && i < particlesOptions.number.value; i++, j++) this.addParticle(void 0, groupOptions, group);
		}
		for (let i = this.count; i < particlesOptions.number.value; i++) this.addParticle();
	}
	async #initPluginsArrays() {
		const container = this.#container;
		for (const plugin of container.plugins) {
			if (plugin.redrawInit) await plugin.redrawInit();
			if (plugin.checkParticlePosition) this.checkParticlePositionPlugins.push(plugin);
			if (plugin.update) this.#updatePlugins.push(plugin);
			if (plugin.particleUpdate) this.#particleUpdatePlugins.push(plugin);
			if (plugin.postUpdate) this.#postUpdatePlugins.push(plugin);
			if (plugin.particleReset) this.#particleResetPlugins.push(plugin);
			if (plugin.postParticleUpdate) this.#postParticleUpdatePlugins.push(plugin);
		}
	}
	#insertParticleIntoBucket(particle) {
		const bucketIndex = this.#getBucketIndex(particle.position.z), bucket = this.#zBuckets[bucketIndex];
		if (!bucket) return;
		bucket.push(particle);
		this.#particleBuckets.set(particle.id, bucketIndex);
	}
	#removeAny(quantity) {
		this.removeAt(0, quantity, void 0, void 0, false);
	}
	#removeParticle(index, group, override, matchGroup = true) {
		const particle = this.#array[index];
		if (!particle) return false;
		if (matchGroup && particle.group !== group) return false;
		this.#array.splice(index, 1);
		this.#removeParticleFromBucket(particle);
		particle.destroy(override);
		this.#container.dispatchEvent(EventType.particleRemoved, { particle });
		this.#addToPool(particle);
		return true;
	}
	#removeParticleFromBucket(particle) {
		const bucketIndex = this.#particleBuckets.get(particle.id) ?? this.#getBucketIndex(particle.position.z), bucket = this.#zBuckets[bucketIndex];
		if (!bucket) {
			this.#particleBuckets.delete(particle.id);
			return;
		}
		const idx = bucket.findIndex((p) => p.id === particle.id);
		if (idx >= 0) bucket.splice(idx, 1);
		this.#particleBuckets.delete(particle.id);
	}
	#resetBuckets(zLayers) {
		const bucketCount = Math.max(Math.floor(zLayers), 1);
		if (this.#zBuckets.length !== bucketCount) {
			this.#zBuckets = this.#createBuckets(bucketCount);
			return;
		}
		for (const bucket of this.#zBuckets) bucket.length = 0;
	}
	#updateParticleBucket(particle) {
		const newBucketIndex = this.#getBucketIndex(particle.position.z), currentBucketIndex = this.#particleBuckets.get(particle.id);
		if (currentBucketIndex === void 0) {
			this.#insertParticleIntoBucket(particle);
			return;
		}
		if (currentBucketIndex === newBucketIndex) return;
		const currentBucket = this.#zBuckets[currentBucketIndex];
		if (currentBucket) {
			const idx = currentBucket.findIndex((p) => p.id === particle.id);
			if (idx >= 0) currentBucket.splice(idx, 1);
		}
		const newBucket = this.#zBuckets[newBucketIndex];
		if (!newBucket) {
			this.#particleBuckets.set(particle.id, newBucketIndex);
			return;
		}
		newBucket.push(particle);
		if (newBucket.length >= 2) {
			const prev = newBucket[newBucket.length - 2];
			if (prev && particle.id < prev.id) newBucket.sort((a, b) => a.id - b.id);
		}
		this.#particleBuckets.set(particle.id, newBucketIndex);
	}
	#updateParticlesPhase1(delta) {
		const particlesToDelete = /* @__PURE__ */ new Set(), resizeFactor = this.#resizeFactor;
		for (const particle of this.#array) {
			if (resizeFactor && !particle.ignoresResizeRatio) {
				particle.position.x *= resizeFactor.width;
				particle.position.y *= resizeFactor.height;
				particle.initialPosition.x *= resizeFactor.width;
				particle.initialPosition.y *= resizeFactor.height;
			}
			particle.ignoresResizeRatio = false;
			for (const plugin of this.#particleResetPlugins) plugin.particleReset?.(particle);
			for (const plugin of this.#particleUpdatePlugins) {
				if (particle.destroyed) break;
				plugin.particleUpdate?.(particle, delta);
			}
			if (particle.destroyed) {
				particlesToDelete.add(particle);
				continue;
			}
			this.#grid.insert(particle);
		}
		return particlesToDelete;
	}
	#updateParticlesPhase2(delta, particlesToDelete) {
		for (const particle of this.#array) {
			if (particle.destroyed) {
				particlesToDelete.add(particle);
				continue;
			}
			for (const updater of this.#container.particleUpdaters) updater.update(particle, delta);
			if (!particle.spawning) for (const plugin of this.#postParticleUpdatePlugins) plugin.postParticleUpdate?.(particle, delta);
			this.#updateParticleBucket(particle);
		}
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/Retina.js
var Retina = class {
	pixelRatio;
	reduceFactor;
	#container;
	constructor(container) {
		this.#container = container;
		this.pixelRatio = 1;
		this.reduceFactor = 1;
	}
	init() {
		const container = this.#container, options = container.actualOptions;
		this.pixelRatio = options.detectRetina ? devicePixelRatio : 1;
		this.reduceFactor = 1;
		const ratio = this.pixelRatio, canvas = container.canvas, element = canvas.domElement;
		if (element) {
			canvas.size.width = element.offsetWidth * ratio;
			canvas.size.height = element.offsetHeight * ratio;
		}
	}
	initParticle(particle) {
		const options = particle.options, ratio = this.pixelRatio, moveOptions = options.move, moveDistance = moveOptions.distance, props = particle.retina;
		props.maxSpeed = getRangeValue(moveOptions.gravity.maxSpeed) * ratio;
		props.moveDrift = getRangeValue(moveOptions.drift) * ratio;
		props.moveSpeed = getRangeValue(moveOptions.speed) * ratio;
		const maxDistance = props.maxDistance;
		maxDistance.horizontal = moveDistance.horizontal === void 0 ? void 0 : moveDistance.horizontal * ratio;
		maxDistance.vertical = moveDistance.vertical === void 0 ? void 0 : moveDistance.vertical * ratio;
	}
};
//#endregion
//#region ../../engine/dist/browser/Core/Container.js
function guardCheck(container) {
	return !container.destroyed;
}
function updateDelta(delta, value, fpsLimit = 60, smooth = false) {
	delta.value = value;
	delta.factor = smooth ? 60 / fpsLimit : 60 * value / millisecondsToSeconds;
}
function loadContainerOptions(pluginManager, container, ...sourceOptionsArr) {
	const options = new Options(pluginManager, container);
	loadOptions(options, ...sourceOptionsArr);
	return options;
}
var Container = class {
	actualOptions;
	canvas;
	destroyed;
	effectDrawers;
	fpsLimit;
	hdr;
	hdrMode;
	id;
	pageHidden;
	particleCreatedPlugins;
	particleDestroyedPlugins;
	particlePositionPlugins;
	particleUpdaters;
	particles;
	peakNits;
	plugins;
	retina;
	shapeDrawers;
	started;
	zLayers;
	#delay;
	#delayResolve;
	#delayTimeout;
	#delta = {
		value: 0,
		factor: 0
	};
	#dispatchCallback;
	#drawAnimationFrame;
	#duration;
	#eventListeners;
	#firstStart;
	#initialSourceOptions;
	#lastFrameTime;
	#lifeTime;
	#onDestroy;
	#options;
	#paused;
	#pluginManager;
	#smooth;
	#sourceOptions;
	constructor(params) {
		const { dispatchCallback, pluginManager, id, onDestroy, sourceOptions } = params;
		this.#pluginManager = pluginManager;
		this.#dispatchCallback = dispatchCallback;
		this.#onDestroy = onDestroy;
		this.id = Symbol(id);
		this.fpsLimit = 120;
		this.hdr = false;
		this.hdrMode = HdrMode.standard;
		this.peakNits = 400;
		this.#smooth = false;
		this.#delay = 0;
		this.#duration = 0;
		this.#lifeTime = 0;
		this.#firstStart = true;
		this.started = false;
		this.destroyed = false;
		this.#paused = true;
		this.#lastFrameTime = 0;
		this.zLayers = 100;
		this.pageHidden = false;
		this.#sourceOptions = sourceOptions;
		this.#initialSourceOptions = sourceOptions;
		this.effectDrawers = /* @__PURE__ */ new Map();
		this.shapeDrawers = /* @__PURE__ */ new Map();
		this.particleUpdaters = [];
		this.retina = new Retina(this);
		this.canvas = new CanvasManager(this.#pluginManager, this);
		this.particles = new ParticlesManager(this.#pluginManager, this);
		this.plugins = [];
		this.particleDestroyedPlugins = [];
		this.particleCreatedPlugins = [];
		this.particlePositionPlugins = [];
		this.#options = loadContainerOptions(this.#pluginManager, this);
		this.actualOptions = loadContainerOptions(this.#pluginManager, this);
		this.#eventListeners = new EventListeners(this);
		this.dispatchEvent(EventType.containerBuilt);
	}
	get animationStatus() {
		return !this.#paused && !this.pageHidden && guardCheck(this);
	}
	get options() {
		return this.#options;
	}
	get sourceOptions() {
		return this.#sourceOptions;
	}
	addLifeTime(value) {
		this.#lifeTime += value;
	}
	alive() {
		return !this.#duration || this.#lifeTime <= this.#duration;
	}
	destroy(remove = true) {
		if (!guardCheck(this)) return;
		this.stop();
		this.particles.destroy();
		this.canvas.destroy();
		for (const [, effectDrawer] of this.effectDrawers) effectDrawer.destroy?.(this);
		for (const [, shapeDrawer] of this.shapeDrawers) shapeDrawer.destroy?.(this);
		for (const plugin of this.plugins) plugin.destroy?.();
		this.effectDrawers = /* @__PURE__ */ new Map();
		this.shapeDrawers = /* @__PURE__ */ new Map();
		this.particleUpdaters = [];
		this.plugins.length = 0;
		this.destroyed = true;
		this.#onDestroy(remove);
		this.dispatchEvent(EventType.containerDestroyed);
	}
	dispatchEvent(type, data) {
		this.#dispatchCallback(type, {
			container: this,
			data
		});
	}
	draw(force) {
		if (!guardCheck(this)) return;
		let refreshTime = force;
		this.#drawAnimationFrame = animate((timestamp) => {
			if (refreshTime) {
				this.#lastFrameTime = void 0;
				refreshTime = false;
			}
			this.#nextFrame(timestamp);
		});
	}
	async export(type, options = {}) {
		for (const plugin of this.plugins) {
			if (!plugin.export) continue;
			const res = await plugin.export(type, options);
			if (!res.supported) continue;
			return res.blob;
		}
		getLogger().error(`Export plugin with type ${type} not found`);
	}
	async init() {
		if (!guardCheck(this)) return;
		const allContainerPlugins = /* @__PURE__ */ new Map();
		for (const plugin of this.#pluginManager.plugins) {
			const containerPlugin = await plugin.getPlugin(this);
			if (containerPlugin.preInit) await containerPlugin.preInit();
			allContainerPlugins.set(plugin, containerPlugin);
		}
		await this.initDrawersAndUpdaters();
		this.#options = loadContainerOptions(this.#pluginManager, this, this.#initialSourceOptions, this.sourceOptions);
		this.actualOptions = loadContainerOptions(this.#pluginManager, this, this.#options);
		this.#initPlugins(allContainerPlugins);
		this.retina.init();
		this.canvas.init();
		this.updateActualOptions();
		this.canvas.initBackground();
		this.canvas.resize();
		const { delay, duration, fpsLimit, smooth, zLayers } = this.actualOptions, hdrOptions = this.actualOptions.hdr;
		this.hdrMode = toEnumValue(HdrMode, hdrOptions.mode, HdrMode.standard);
		this.peakNits = hdrOptions.peakNits;
		this.zLayers = zLayers;
		this.#duration = getRangeValue(duration) * millisecondsToSeconds;
		this.#delay = getRangeValue(delay) * millisecondsToSeconds;
		this.#lifeTime = 0;
		this.fpsLimit = fpsLimit > 0 ? fpsLimit : 120;
		this.#smooth = smooth;
		for (const plugin of this.plugins) await plugin.init?.();
		await this.particles.init();
		this.dispatchEvent(EventType.containerInit);
		this.particles.setDensity();
		for (const plugin of this.plugins) plugin.particlesSetup?.();
		this.dispatchEvent(EventType.particlesSetup);
	}
	async initDrawersAndUpdaters() {
		const pluginManager = this.#pluginManager;
		this.effectDrawers = await getItemMapFromInitializer(this, pluginManager.initializers.effects);
		this.shapeDrawers = await getItemMapFromInitializer(this, pluginManager.initializers.shapes);
		this.particleUpdaters = await getItemsFromInitializer(this, pluginManager.initializers.updaters);
	}
	pause() {
		if (!guardCheck(this)) return;
		if (this.#drawAnimationFrame !== void 0) {
			cancelAnimation(this.#drawAnimationFrame);
			this.#drawAnimationFrame = void 0;
		}
		if (this.#paused) return;
		for (const plugin of this.plugins) plugin.pause?.();
		if (!this.pageHidden) this.#paused = true;
		this.dispatchEvent(EventType.containerPaused);
	}
	play(force) {
		if (!guardCheck(this)) return;
		const needsUpdate = this.#paused || force;
		if (this.#firstStart && !this.actualOptions.autoPlay) {
			this.#firstStart = false;
			return;
		}
		if (this.#paused) this.#paused = false;
		if (needsUpdate) {
			for (const plugin of this.plugins) if (plugin.play) plugin.play();
		}
		this.dispatchEvent(EventType.containerPlay);
		this.draw(needsUpdate ?? false);
	}
	async refresh() {
		if (!guardCheck(this)) return;
		this.stop();
		return this.start();
	}
	async reset(sourceOptions) {
		if (!guardCheck(this)) return;
		this.#initialSourceOptions = sourceOptions;
		this.#sourceOptions = sourceOptions;
		this.#options = loadContainerOptions(this.#pluginManager, this, this.#initialSourceOptions, this.sourceOptions);
		this.actualOptions = loadContainerOptions(this.#pluginManager, this, this.#options);
		return this.refresh();
	}
	async start() {
		if (!guardCheck(this) || this.started) return;
		await this.init();
		this.started = true;
		await new Promise((resolve) => {
			this.#delayResolve = resolve;
			const start = async () => {
				this.#delayTimeout = void 0;
				this.#delayResolve = void 0;
				this.#eventListeners.addListeners();
				for (const plugin of this.plugins) await plugin.start?.();
				this.dispatchEvent(EventType.containerStarted);
				this.play();
				resolve();
			};
			this.#delayTimeout = setTimeout(() => void start(), this.#delay);
		});
	}
	stop() {
		if (!guardCheck(this) || !this.started) return;
		if (this.#delayTimeout !== void 0) {
			clearTimeout(this.#delayTimeout);
			this.#delayTimeout = void 0;
			this.#delayResolve?.();
			this.#delayResolve = void 0;
		}
		this.#firstStart = true;
		this.started = false;
		this.#eventListeners.removeListeners();
		this.pause();
		this.particles.clear();
		this.canvas.stop();
		for (const plugin of this.plugins) plugin.stop?.();
		this.particleCreatedPlugins.length = 0;
		this.particleDestroyedPlugins.length = 0;
		this.particlePositionPlugins.length = 0;
		this.#sourceOptions = this.#options;
		this.dispatchEvent(EventType.containerStopped);
	}
	updateActualOptions() {
		let refresh = false;
		for (const plugin of this.plugins) if (plugin.updateActualOptions) refresh = plugin.updateActualOptions() || refresh;
		return refresh;
	}
	#initPlugins(allContainerPlugins) {
		this.plugins.length = 0;
		this.particleDestroyedPlugins.length = 0;
		this.particleCreatedPlugins.length = 0;
		this.particlePositionPlugins.length = 0;
		for (const [plugin, containerPlugin] of allContainerPlugins) {
			if (!plugin.needsPlugin(this.actualOptions)) continue;
			this.plugins.push(containerPlugin);
			if (containerPlugin.particleCreated) this.particleCreatedPlugins.push(containerPlugin);
			if (containerPlugin.particleDestroyed) this.particleDestroyedPlugins.push(containerPlugin);
			if (containerPlugin.particlePosition) this.particlePositionPlugins.push(containerPlugin);
		}
	}
	#nextFrame(timestamp) {
		try {
			if (!this.#smooth && this.#lastFrameTime !== void 0 && timestamp < this.#lastFrameTime + 1e3 / this.fpsLimit) {
				this.draw(false);
				return;
			}
			this.#lastFrameTime ??= timestamp;
			updateDelta(this.#delta, timestamp - this.#lastFrameTime, this.fpsLimit, this.#smooth);
			this.addLifeTime(this.#delta.value);
			this.#lastFrameTime = timestamp;
			if (this.#delta.value > 1e3) {
				this.draw(false);
				return;
			}
			this.canvas.render.drawParticles(this.#delta);
			if (!this.alive()) {
				this.destroy();
				return;
			}
			if (this.animationStatus) this.draw(false);
		} catch (e) {
			getLogger().error("error in animation loop", e);
		}
	}
};
//#endregion
export { Container };
