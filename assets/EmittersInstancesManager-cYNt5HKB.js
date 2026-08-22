const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EmitterInstance-CqvGZWch.js","assets/Constants-Boin98lu.js","assets/MathUtils-DBT3t4S6.js","assets/TypeUtils-CAcPJyQQ.js","assets/Utils-BJNts6wb.js","assets/Stroke-mHi2yCfv.js","assets/index--u1-ZVm4.js","assets/index-BKsZDV5U.css"])))=>i.map(i=>d[i]);
import { i as isNumber } from "./TypeUtils-CAcPJyQQ.js";
import { t as Emitter, y as __vitePreload } from "./index--u1-ZVm4.js";
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
			const { EmitterInstance } = await import("./EmitterInstance-CqvGZWch.js");
			return { EmitterInstance };
		}, __vite__mapDeps([0,1,2,3,4,5,6,7])), emitter = new EmitterInstance(this.#pluginManager, container, (emitter) => {
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
