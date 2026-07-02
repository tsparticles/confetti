const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EmitterInstance-vAJnjqV_.js","assets/ColorUtils-Cenbon3h.js","assets/index-PLO5vTpX.js","assets/index-BKsZDV5U.css"])))=>i.map(i=>d[i]);
import { yt as isNumber } from "./ColorUtils-Cenbon3h.js";
import { i as __vitePreload, t as Emitter } from "./index-PLO5vTpX.js";
//#region ../../plugins/emitters/dist/browser/EmittersInstancesManager.js
var defaultIndex = 0;
var EmittersInstancesManager = class {
	#containerArrays;
	#pluginManager;
	constructor(pluginManager) {
		this.#containerArrays = /* @__PURE__ */ new Map();
		this.#pluginManager = pluginManager;
	}
	async addEmitter(container, options, position) {
		const emitterOptions = new Emitter();
		emitterOptions.load(options);
		const { EmitterInstance } = await __vitePreload(async () => {
			const { EmitterInstance } = await import("./EmitterInstance-vAJnjqV_.js");
			return { EmitterInstance };
		}, __vite__mapDeps([0,1,2,3])), emitter = new EmitterInstance(this.#pluginManager, container, (emitter) => {
			this.removeEmitter(container, emitter);
		}, emitterOptions, position);
		await emitter.init();
		this.getArray(container).push(emitter);
		return emitter;
	}
	clear(container) {
		this.initContainer(container);
		this.#containerArrays.set(container, []);
	}
	getArray(container) {
		this.initContainer(container);
		let array = this.#containerArrays.get(container);
		if (!array) {
			array = [];
			this.#containerArrays.set(container, array);
		}
		return array;
	}
	initContainer(container) {
		if (this.#containerArrays.has(container)) return;
		this.#containerArrays.set(container, []);
		container.getEmitter = (idxOrName) => {
			const array = this.getArray(container);
			return idxOrName === void 0 || isNumber(idxOrName) ? array[idxOrName ?? defaultIndex] : array.find((t) => t.name === idxOrName);
		};
		container.addEmitter = async (options, position) => this.addEmitter(container, options, position);
		container.removeEmitter = (idxOrName) => {
			const emitter = container.getEmitter?.(idxOrName);
			if (emitter) this.removeEmitter(container, emitter);
		};
		container.playEmitter = (idxOrName) => {
			const emitter = container.getEmitter?.(idxOrName);
			if (emitter) emitter.externalPlay();
		};
		container.pauseEmitter = (idxOrName) => {
			const emitter = container.getEmitter?.(idxOrName);
			if (emitter) emitter.externalPause();
		};
	}
	removeEmitter(container, emitter) {
		const index = this.getArray(container).indexOf(emitter), minIndex = 0, deleteCount = 1;
		if (index >= minIndex) this.getArray(container).splice(index, deleteCount);
	}
};
//#endregion
export { EmittersInstancesManager };
