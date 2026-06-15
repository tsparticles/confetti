import { $ as getRangeValue, J as getDistance, K as clamp, Q as getRandom, S as RotateDirection, Y as getDistances, dt as half, ft as millisecondsToSeconds, lt as doublePI } from "./index-L6ijel9b.js";
//#region ../../plugins/move/dist/browser/Utils.js
var minVelocity = 0, identity = 1, moveSpeedFactor = 60, minSpinRadius = 0, spinFactor = .01, defaultPathDelay = 0, noDecay = 1;
function applyDistance(particle) {
	const initialPosition = particle.initialPosition, { dx, dy } = getDistances(initialPosition, particle.position), dxFixed = Math.abs(dx), dyFixed = Math.abs(dy), { maxDistance } = particle.retina, hDistance = maxDistance.horizontal, vDistance = maxDistance.vertical;
	if (!hDistance && !vDistance) return;
	if ((((hDistance && dxFixed >= hDistance) ?? false) || ((vDistance && dyFixed >= vDistance) ?? false)) && !particle.misplaced) {
		particle.misplaced = !!hDistance && dxFixed > hDistance || !!vDistance && dyFixed > vDistance;
		if (hDistance) particle.velocity.x = particle.velocity.y * half - particle.velocity.x;
		if (vDistance) particle.velocity.y = particle.velocity.x * half - particle.velocity.y;
	} else if ((!hDistance || dxFixed < hDistance) && (!vDistance || dyFixed < vDistance) && particle.misplaced) particle.misplaced = false;
	else if (particle.misplaced) {
		const pos = particle.position, vel = particle.velocity;
		if (hDistance && (pos.x < initialPosition.x && vel.x < minVelocity || pos.x > initialPosition.x && vel.x > minVelocity)) vel.x *= -getRandom();
		if (vDistance && (pos.y < initialPosition.y && vel.y < minVelocity || pos.y > initialPosition.y && vel.y > minVelocity)) vel.y *= -getRandom();
	}
}
function move(particle, moveOptions, moveSpeed, maxSpeed, moveDrift, reduceFactor, delta) {
	applyPath(particle, delta);
	const gravityOptions = particle.gravity, gravityFactor = gravityOptions?.enable && gravityOptions.inverse ? -1 : identity;
	if (moveDrift && moveSpeed) particle.velocity.x += moveDrift * delta.factor / (moveSpeedFactor * moveSpeed);
	if (gravityOptions?.enable && moveSpeed) particle.velocity.y += gravityFactor * (gravityOptions.acceleration * delta.factor) / (moveSpeedFactor * moveSpeed);
	const decay = particle.moveDecay;
	particle.velocity.multTo(decay ?? noDecay);
	const velocity = particle.velocity.mult(moveSpeed);
	if (gravityOptions?.enable && maxSpeed > minVelocity && (!gravityOptions.inverse && velocity.y >= minVelocity && velocity.y >= maxSpeed || gravityOptions.inverse && velocity.y <= minVelocity && velocity.y <= -maxSpeed)) {
		velocity.y = gravityFactor * maxSpeed;
		if (moveSpeed) particle.velocity.y = velocity.y / moveSpeed;
	}
	const zIndexOptions = particle.options.zIndex, zVelocityFactor = (identity - particle.zIndexFactor) ** zIndexOptions.velocityRate;
	velocity.multTo(zVelocityFactor);
	velocity.multTo(reduceFactor);
	const { position } = particle;
	position.addTo(velocity);
	if (moveOptions.vibrate) {
		position.x += Math.sin(position.x * Math.cos(position.y)) * reduceFactor;
		position.y += Math.cos(position.y * Math.sin(position.x)) * reduceFactor;
	}
}
function spin(container, particle, moveSpeed, reduceFactor) {
	if (!particle.spin) return;
	const spinClockwise = particle.spin.direction === RotateDirection.clockwise, updateFunc = {
		x: spinClockwise ? Math.cos : Math.sin,
		y: spinClockwise ? Math.sin : Math.cos
	};
	particle.position.x = particle.spin.center.x + particle.spin.radius * updateFunc.x(particle.spin.angle) * reduceFactor;
	particle.position.y = particle.spin.center.y + particle.spin.radius * updateFunc.y(particle.spin.angle) * reduceFactor;
	particle.spin.radius += particle.spin.acceleration * reduceFactor;
	const maxCanvasSize = Math.max(container.canvas.size.width, container.canvas.size.height), halfMaxSize = maxCanvasSize * half;
	if (particle.spin.radius > halfMaxSize) {
		particle.spin.radius = halfMaxSize;
		particle.spin.acceleration *= -1;
	} else if (particle.spin.radius < minSpinRadius) {
		particle.spin.radius = minSpinRadius;
		particle.spin.acceleration *= -1;
	}
	particle.spin.angle += moveSpeed * spinFactor * (identity - particle.spin.radius / maxCanvasSize);
}
function applyPath(particle, delta) {
	const pathOptions = particle.options.move.path;
	if (!pathOptions.enable) return;
	const pathDelay = particle.pathDelay ?? defaultPathDelay;
	if (particle.lastPathTime <= pathDelay) {
		particle.lastPathTime += delta.value;
		return;
	}
	const path = particle.pathGenerator?.generate(particle, delta);
	if (path) particle.velocity.addTo(path);
	if (pathOptions.clamp) {
		particle.velocity.x = clamp(particle.velocity.x, -1, identity);
		particle.velocity.y = clamp(particle.velocity.y, -1, identity);
	}
	particle.lastPathTime -= pathDelay;
}
function getProximitySpeedFactor(particle) {
	return particle.slow.inRange ? particle.slow.factor : identity;
}
function initSpin(container, particle) {
	const spinOptions = particle.options.move.spin;
	if (!spinOptions.enable) return;
	const spinPos = spinOptions.position ?? {
		x: 50,
		y: 50
	}, spinFactor = .01, spinCenter = {
		x: spinPos.x * spinFactor * container.canvas.size.width,
		y: spinPos.y * spinFactor * container.canvas.size.height
	}, distance = getDistance(particle.getPosition(), spinCenter), spinAcceleration = getRangeValue(spinOptions.acceleration);
	particle.retina.spinAcceleration = spinAcceleration * container.retina.pixelRatio;
	particle.spin = {
		center: spinCenter,
		direction: particle.velocity.x >= minVelocity ? RotateDirection.clockwise : RotateDirection.counterClockwise,
		angle: getRandom() * doublePI,
		radius: distance,
		acceleration: particle.retina.spinAcceleration
	};
}
//#endregion
//#region ../../plugins/move/dist/browser/MovePluginInstance.js
var defaultSizeFactor = 1, defaultDeltaFactor = 1;
var MovePluginInstance = class {
	availablePathGenerators;
	pathGenerators;
	#container;
	#pluginManager;
	constructor(pluginManager, container) {
		this.#pluginManager = pluginManager;
		this.#container = container;
		this.availablePathGenerators = /* @__PURE__ */ new Map();
		this.pathGenerators = /* @__PURE__ */ new Map();
	}
	destroy() {
		this.availablePathGenerators = /* @__PURE__ */ new Map();
		this.pathGenerators = /* @__PURE__ */ new Map();
	}
	isEnabled(particle) {
		return !particle.destroyed && particle.options.move.enable;
	}
	particleCreated(particle) {
		const moveOptions = particle.options.move, gravityOptions = moveOptions.gravity, pathOptions = moveOptions.path;
		particle.moveDecay = 1 - getRangeValue(moveOptions.decay);
		particle.pathDelay = getRangeValue(pathOptions.delay.value) * millisecondsToSeconds;
		if (pathOptions.generator) {
			let pathGenerator = this.pathGenerators.get(pathOptions.generator);
			if (!pathGenerator) {
				pathGenerator = this.availablePathGenerators.get(pathOptions.generator);
				if (pathGenerator) {
					this.pathGenerators.set(pathOptions.generator, pathGenerator);
					pathGenerator.init();
				}
			}
			particle.pathGenerator = pathGenerator;
		}
		particle.gravity = {
			enable: gravityOptions.enable,
			acceleration: getRangeValue(gravityOptions.acceleration),
			inverse: gravityOptions.inverse
		};
		initSpin(this.#container, particle);
	}
	particleDestroyed(particle) {
		particle.pathGenerator?.reset(particle);
	}
	particleUpdate(particle, delta) {
		const moveOptions = particle.options.move;
		if (!moveOptions.enable) return;
		const container = this.#container, slowFactor = getProximitySpeedFactor(particle), reduceFactor = container.retina.reduceFactor, baseSpeed = particle.retina.moveSpeed, moveDrift = particle.retina.moveDrift, maxSize = particle.size.max, sizeFactor = moveOptions.size ? particle.getRadius() / maxSize : defaultSizeFactor, deltaFactor = delta.factor || defaultDeltaFactor, moveSpeed = baseSpeed * sizeFactor * slowFactor * deltaFactor * half, maxSpeed = particle.retina.maxSpeed;
		if (moveOptions.spin.enable) spin(container, particle, moveSpeed, reduceFactor);
		else move(particle, moveOptions, moveSpeed, maxSpeed, moveDrift, reduceFactor, delta);
		applyDistance(particle);
	}
	preInit() {
		return this.#init();
	}
	redrawInit() {
		return this.#init();
	}
	update() {
		for (const pathGenerator of this.pathGenerators.values()) pathGenerator.update();
	}
	async #init() {
		const availablePathGenerators = await this.#pluginManager.getPathGenerators?.(this.#container, true);
		if (!availablePathGenerators) return;
		this.availablePathGenerators = availablePathGenerators;
		this.pathGenerators = /* @__PURE__ */ new Map();
		for (const pathGenerator of this.pathGenerators.values()) pathGenerator.init();
	}
};
//#endregion
export { MovePluginInstance };
