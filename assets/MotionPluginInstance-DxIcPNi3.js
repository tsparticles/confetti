import { h as safeMatchMedia } from "./Utils-BJNts6wb.js";
//#region ../../plugins/motion/dist/browser/MotionPluginInstance.js
var defaultFactor = 1;
var defaultReduce = 1;
var disableReduce = 0;
var identity = 1;
var MotionPluginInstance = class {
	#container;
	constructor(container) {
		this.#container = container;
	}
	async init() {
		const container = this.#container, options = container.actualOptions.motion;
		if (!(options && (options.disable || options.reduce.value))) {
			container.retina.reduceFactor = 1;
			return;
		}
		const mediaQuery = safeMatchMedia("(prefers-reduced-motion: reduce)");
		if (!mediaQuery) {
			container.retina.reduceFactor = defaultFactor;
			return;
		}
		this.#handleMotionChange(mediaQuery);
		const handleChange = () => {
			(async () => {
				this.#handleMotionChange(mediaQuery);
				try {
					await container.refresh();
				} catch {}
			})();
		};
		mediaQuery.addEventListener("change", handleChange);
		await Promise.resolve();
	}
	#handleMotionChange(mediaQuery) {
		const container = this.#container, motion = container.actualOptions.motion;
		if (!motion) return;
		if (mediaQuery.matches) if (motion.disable) container.retina.reduceFactor = disableReduce;
		else container.retina.reduceFactor = motion.reduce.value ? identity / motion.reduce.factor : defaultFactor;
		else container.retina.reduceFactor = defaultReduce;
	}
};
//#endregion
export { MotionPluginInstance };
