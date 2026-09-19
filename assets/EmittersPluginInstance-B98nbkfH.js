import { t as isArray } from "./TypeUtils-CAcPJyQQ.js";
//#region ../../plugins/emitters/dist/browser/EmittersPluginInstance.js
var EmittersPluginInstance = class {
	#container;
	#instancesManager;
	constructor(instancesManager, container) {
		this.#instancesManager = instancesManager;
		this.#container = container;
		this.#instancesManager.initContainer(container);
	}
	async init() {
		const emittersOptions = this.#container.actualOptions.emitters;
		if (isArray(emittersOptions)) for (const emitterOptions of emittersOptions) await this.#instancesManager.addEmitter(this.#container, emitterOptions);
		else await this.#instancesManager.addEmitter(this.#container, emittersOptions);
	}
	pause() {
		for (const emitter of this.#instancesManager.getArray(this.#container)) emitter.pause();
	}
	play() {
		for (const emitter of this.#instancesManager.getArray(this.#container)) emitter.play();
	}
	resize() {
		for (const emitter of this.#instancesManager.getArray(this.#container)) emitter.resize();
	}
	stop() {
		this.#instancesManager.clear(this.#container);
	}
	update(delta) {
		this.#instancesManager.getArray(this.#container).forEach((emitter) => {
			emitter.update(delta);
		});
	}
};
//#endregion
export { EmittersPluginInstance };
