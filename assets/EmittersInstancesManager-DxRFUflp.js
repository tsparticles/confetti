const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/EmitterInstance-DwncUuYM.js","assets/Utils-WJDuie34.js","assets/Constants-ohzUY8CX.js","assets/TypeUtils-uwhvQEh7.js","assets/index-Dei_f8wi.js","assets/index-DqaiQJNG.css"])))=>i.map(i=>d[i]);
import { a as isNumber } from "./TypeUtils-uwhvQEh7.js";
import { S as __vitePreload, t as Emitter } from "./index-Dei_f8wi.js";
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
		return this.addEmitters(container, [{
			options,
			position
		}]).then((t) => t[defaultIndex]);
	}
	async addEmitters(container, emitters) {
		const { EmitterInstance } = await __vitePreload(async () => {
			const { EmitterInstance } = await import("./EmitterInstance-DwncUuYM.js");
			return { EmitterInstance };
		}, __vite__mapDeps([0,1,2,3,4,5])), res = [];
		for (const { options, position } of emitters) {
			const emitterOptions = new Emitter();
			emitterOptions.load(options);
			const emitter = new EmitterInstance(this.#pluginManager, container, (emitter) => {
				this.removeEmitter(container, emitter);
			}, emitterOptions, position);
			await emitter.init();
			this.getArray(container).push(emitter);
			res.push(emitter);
		}
		return res;
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
		container.addEmitters = async (emitters) => this.addEmitters(container, emitters);
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
		const index = this.getArray(container).indexOf(emitter), deleteCount = 1;
		if (index >= 0) this.getArray(container).splice(index, deleteCount);
	}
};
//#endregion
export { EmittersInstancesManager };
