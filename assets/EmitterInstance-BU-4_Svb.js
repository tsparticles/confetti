import { $ as getRangeValue, B as PixelMode, F as itemFromSingleOrMultiple, L as safeDocument, M as getSize, P as isPointInside, W as calcPositionOrRandomFromSizeRanged, _ as Paint, dt as half, et as randomInRangeValue, ft as millisecondsToSeconds, it as Vector, k as deepExtend, n as EmitterSize, s as rangeColorToHsl, t as Emitter, v as AnimatableColor } from "./index-L6ijel9b.js";
//#region ../../plugins/emitters/dist/browser/EmitterInstance.js
var defaultLifeDelay = 0, minLifeCount = 0, defaultSpawnDelay = 0, defaultEmitDelay = 0, defaultLifeCount = -1, defaultColorAnimationFactor = 1, colorFactor = 3.6, defaultStrokeWidth = 1;
function setParticlesOptionsFillColor(particlesOptions, color, opacity, enable) {
	const paint = particlesOptions.paint ??= new Paint();
	paint.fill = {
		color: AnimatableColor.create(void 0, { value: color }),
		enable,
		opacity
	};
}
function setParticlesOptionsStrokeColor(particlesOptions, color, opacity, width) {
	const paint = particlesOptions.paint ??= new Paint();
	paint.stroke = {
		color: AnimatableColor.create(void 0, { value: color }),
		opacity,
		width
	};
}
var EmitterInstance = class {
	fill;
	name;
	options;
	position;
	size;
	spawnFillColor;
	spawnFillEnabled;
	spawnFillOpacity;
	spawnStrokeColor;
	spawnStrokeOpacity;
	spawnStrokeWidth;
	#container;
	#currentDuration;
	#currentEmitDelay;
	#currentSpawnDelay;
	#duration;
	#emitDelay;
	#firstSpawn;
	#immortal;
	#initialPosition;
	#lifeCount;
	#mutationObserver;
	#particlesOptions;
	#paused;
	#pluginManager;
	#removeCallback;
	#resizeObserver;
	#shape;
	#size;
	#spawnDelay;
	#startParticlesAdded;
	constructor(pluginManager, container, removeCallback, options, position) {
		this.#pluginManager = pluginManager;
		this.#container = container;
		this.#removeCallback = removeCallback;
		this.#currentDuration = 0;
		this.#currentEmitDelay = 0;
		this.#currentSpawnDelay = 0;
		this.#initialPosition = position;
		if (options instanceof Emitter) this.options = options;
		else {
			this.options = new Emitter();
			this.options.load(options);
		}
		this.#spawnDelay = container.retina.reduceFactor ? getRangeValue(this.options.life.delay ?? defaultLifeDelay) * millisecondsToSeconds / container.retina.reduceFactor : Infinity;
		this.position = this.#initialPosition ?? this.#calcPosition();
		this.name = this.options.name;
		this.fill = this.options.fill;
		this.#firstSpawn = !this.options.life.wait;
		this.#startParticlesAdded = false;
		const particlesOptions = deepExtend({}, this.options.particles);
		particlesOptions.move ??= {};
		particlesOptions.move.direction ??= this.options.direction;
		if (this.options.spawn.fill?.color) this.spawnFillColor = rangeColorToHsl(this.#pluginManager, this.options.spawn.fill.color);
		if (this.options.spawn.stroke?.color) this.spawnStrokeColor = rangeColorToHsl(this.#pluginManager, this.options.spawn.stroke.color);
		this.#paused = !this.options.autoPlay;
		this.#particlesOptions = particlesOptions;
		this.#size = this.#calcSize();
		this.size = getSize(this.#size, this.#container.canvas.size);
		this.#lifeCount = this.options.life.count ?? defaultLifeCount;
		this.#immortal = this.#lifeCount <= minLifeCount;
		if (this.options.domId) {
			const element = safeDocument().getElementById(this.options.domId);
			if (element) {
				this.#mutationObserver = new MutationObserver(() => {
					this.resize();
				});
				this.#resizeObserver = new ResizeObserver(() => {
					this.resize();
				});
				this.#mutationObserver.observe(element, {
					attributes: true,
					attributeFilter: [
						"style",
						"width",
						"height"
					]
				});
				this.#resizeObserver.observe(element);
			}
		}
		const shapeOptions = this.options.shape, shapeGenerator = this.#pluginManager.emitterShapeManager?.getShapeGenerator(shapeOptions.type);
		if (shapeGenerator) this.#shape = shapeGenerator.generate(this.#container, this.position, this.size, this.fill, shapeOptions.options);
		this.#container.dispatchEvent("emitterCreated", { emitter: this });
		this.play();
	}
	externalPause() {
		this.#paused = true;
		this.pause();
	}
	externalPlay() {
		this.#paused = false;
		this.play();
	}
	async init() {
		await this.#shape?.init();
	}
	pause() {
		if (this.#paused) return;
		this.#emitDelay = void 0;
	}
	play() {
		if (this.#paused) return;
		if (!((this.#lifeCount > minLifeCount || this.#immortal || !this.options.life.count) && (this.#firstSpawn || this.#currentSpawnDelay >= (this.#spawnDelay ?? defaultSpawnDelay)))) return;
		const container = this.#container;
		if (this.#emitDelay === void 0) {
			const delay = getRangeValue(this.options.rate.delay);
			this.#emitDelay = container.retina.reduceFactor ? delay * millisecondsToSeconds / container.retina.reduceFactor : Infinity;
		}
		if (this.#lifeCount > minLifeCount || this.#immortal) this.#prepareToDie();
	}
	resize() {
		const initialPosition = this.#initialPosition, container = this.#container;
		this.position = initialPosition && isPointInside(initialPosition, container.canvas.size, Vector.origin) ? initialPosition : this.#calcPosition();
		this.#size = this.#calcSize();
		this.size = getSize(this.#size, container.canvas.size);
		this.#shape?.resize(this.position, this.size);
	}
	update(delta) {
		if (this.#paused) return;
		const container = this.#container;
		if (this.#firstSpawn) {
			this.#firstSpawn = false;
			this.#currentSpawnDelay = this.#spawnDelay ?? defaultSpawnDelay;
			this.#currentEmitDelay = this.#emitDelay ?? defaultEmitDelay;
		}
		if (!this.#startParticlesAdded) {
			this.#startParticlesAdded = true;
			this.#emitParticles(this.options.startCount);
		}
		if (this.#duration !== void 0) {
			this.#currentDuration += delta.value;
			if (this.#currentDuration >= this.#duration) {
				this.pause();
				if (this.#spawnDelay !== void 0) this.#spawnDelay = void 0;
				if (!this.#immortal) this.#lifeCount--;
				if (this.#lifeCount > minLifeCount || this.#immortal) {
					this.position = this.#calcPosition();
					this.#shape?.resize(this.position, this.size);
					this.#spawnDelay = container.retina.reduceFactor ? getRangeValue(this.options.life.delay ?? defaultLifeDelay) * millisecondsToSeconds / container.retina.reduceFactor : Infinity;
				} else this.#destroy();
				this.#currentDuration -= this.#duration;
				this.#duration = void 0;
			}
		}
		if (this.#spawnDelay !== void 0) {
			this.#currentSpawnDelay += delta.value;
			if (this.#currentSpawnDelay >= this.#spawnDelay) {
				this.#container.dispatchEvent("emitterPlay");
				this.play();
				this.#currentSpawnDelay -= this.#spawnDelay;
				this.#spawnDelay = void 0;
			}
		}
		if (this.#emitDelay !== void 0) {
			this.#currentEmitDelay += delta.value;
			if (this.#currentEmitDelay >= this.#emitDelay) {
				this.#emit();
				this.#currentEmitDelay -= this.#emitDelay;
			}
		}
	}
	#calcPosition() {
		const container = this.#container;
		if (this.options.domId) {
			const element = safeDocument().getElementById(this.options.domId);
			if (element) {
				const elRect = element.getBoundingClientRect(), pxRatio = container.retina.pixelRatio;
				return {
					x: (elRect.x + elRect.width * half) * pxRatio,
					y: (elRect.y + elRect.height * half) * pxRatio
				};
			}
		}
		return calcPositionOrRandomFromSizeRanged({
			size: container.canvas.size,
			position: this.options.position
		});
	}
	#calcSize() {
		const container = this.#container;
		if (this.options.domId) {
			const element = safeDocument().getElementById(this.options.domId);
			if (element) {
				const elRect = element.getBoundingClientRect();
				return {
					width: elRect.width * container.retina.pixelRatio,
					height: elRect.height * container.retina.pixelRatio,
					mode: PixelMode.precise
				};
			}
		}
		return this.options.size ?? (() => {
			const size = new EmitterSize();
			size.load({
				height: 0,
				mode: PixelMode.percent,
				width: 0
			});
			return size;
		})();
	}
	#destroy = () => {
		this.#mutationObserver?.disconnect();
		this.#mutationObserver = void 0;
		this.#resizeObserver?.disconnect();
		this.#resizeObserver = void 0;
		this.#removeCallback(this);
		this.#container.dispatchEvent("emitterDestroyed", { emitter: this });
	};
	#emit() {
		if (this.#paused) return;
		const quantity = getRangeValue(this.options.rate.quantity);
		this.#emitParticles(quantity);
	}
	#emitParticles(quantity) {
		const singleParticlesOptions = itemFromSingleOrMultiple(this.#particlesOptions) ?? {}, fillHslAnimation = this.options.spawn.fill?.color?.animation, fillEnabled = this.options.spawn.fill?.enable ?? !!this.options.spawn.fill?.color, fillOpacity = this.options.spawn.fill?.opacity === void 0 ? 1 : getRangeValue(this.options.spawn.fill.opacity), strokeHslAnimation = this.options.spawn.stroke?.color?.animation, strokeOpacity = this.options.spawn.stroke?.opacity === void 0 ? 1 : getRangeValue(this.options.spawn.stroke.opacity), strokeWidth = this.options.spawn.stroke?.width === void 0 ? defaultStrokeWidth : getRangeValue(this.options.spawn.stroke.width), reduceFactor = this.#container.retina.reduceFactor, needsFillColorAnimation = !!fillHslAnimation, needsStrokeColorAnimation = !!strokeHslAnimation, needsShapeData = !!this.#shape, needsColorAnimation = needsFillColorAnimation || needsStrokeColorAnimation, needsCopy = needsColorAnimation || needsShapeData, maxValues = needsColorAnimation ? {
			h: 360,
			s: 100,
			l: 100
		} : null, shapeOptions = this.options.shape;
		for (let i = 0; i < quantity * reduceFactor; i++) {
			const particlesOptions = needsCopy ? deepExtend({}, singleParticlesOptions) : singleParticlesOptions;
			this.spawnFillOpacity = fillOpacity;
			this.spawnFillEnabled = fillEnabled;
			this.spawnStrokeOpacity = strokeOpacity;
			this.spawnStrokeWidth = strokeWidth;
			if (this.spawnFillColor) {
				if (fillHslAnimation && maxValues) {
					this.spawnFillColor.h = this.#setColorAnimation(fillHslAnimation.h, this.spawnFillColor.h, maxValues.h, colorFactor);
					this.spawnFillColor.s = this.#setColorAnimation(fillHslAnimation.s, this.spawnFillColor.s, maxValues.s);
					this.spawnFillColor.l = this.#setColorAnimation(fillHslAnimation.l, this.spawnFillColor.l, maxValues.l);
				}
				setParticlesOptionsFillColor(particlesOptions, this.spawnFillColor, this.spawnFillOpacity, this.spawnFillEnabled);
			}
			if (this.spawnStrokeColor) {
				if (strokeHslAnimation && maxValues) {
					this.spawnStrokeColor.h = this.#setColorAnimation(strokeHslAnimation.h, this.spawnStrokeColor.h, maxValues.h, colorFactor);
					this.spawnStrokeColor.s = this.#setColorAnimation(strokeHslAnimation.s, this.spawnStrokeColor.s, maxValues.s);
					this.spawnStrokeColor.l = this.#setColorAnimation(strokeHslAnimation.l, this.spawnStrokeColor.l, maxValues.l);
				}
				setParticlesOptionsStrokeColor(particlesOptions, this.spawnStrokeColor, this.spawnStrokeOpacity, this.spawnStrokeWidth);
			}
			let position = this.position;
			if (this.#shape) {
				const shapePosData = this.#shape.randomPosition();
				if (shapePosData) {
					position = shapePosData.position;
					const replaceData = shapeOptions.replace;
					if (replaceData.color && shapePosData.color) setParticlesOptionsFillColor(particlesOptions, shapePosData.color, replaceData.opacity ? shapePosData.opacity ?? 1 : 1, true);
				} else position = null;
			}
			if (position) this.#container.particles.addParticle(position, particlesOptions);
		}
	}
	#prepareToDie = () => {
		if (this.#paused) return;
		const duration = this.options.life.duration !== void 0 ? getRangeValue(this.options.life.duration) : void 0;
		if ((this.#lifeCount > 0 || this.#immortal) && duration !== void 0 && duration > 0) this.#duration = duration * millisecondsToSeconds;
	};
	#setColorAnimation = (animation, initValue, maxValue, factor = defaultColorAnimationFactor) => {
		const container = this.#container;
		if (!animation.enable) return initValue;
		const colorOffset = randomInRangeValue(animation.offset), delay = getRangeValue(this.options.rate.delay), emitFactor = container.retina.reduceFactor ? delay * millisecondsToSeconds / container.retina.reduceFactor : Infinity;
		return (initValue + getRangeValue(animation.speed) * container.fpsLimit / emitFactor + colorOffset * factor) % maxValue;
	};
};
//#endregion
export { EmitterInstance };
