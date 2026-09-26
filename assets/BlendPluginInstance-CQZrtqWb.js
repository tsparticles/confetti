import "./Constants-Boin98lu.js";
import { m as DrawLayer } from "./index-CEomVYk2.js";
//#region ../../plugins/blend/dist/browser/BlendPluginInstance.js
var BlendPluginInstance = class {
	layer = DrawLayer.CanvasSetup;
	#container;
	#defaultCompositeValue;
	constructor(container) {
		this.#container = container;
	}
	drawParticleCleanup(context, particle) {
		if (!particle.options.blend?.enable) return;
		context.globalCompositeOperation = particle.originalBlendMode ?? "source-over";
		particle.originalBlendMode = void 0;
	}
	drawParticleSetup(context, particle) {
		if (!particle.options.blend?.enable) return;
		particle.originalBlendMode = context.globalCompositeOperation;
		context.globalCompositeOperation = particle.options.blend.mode;
	}
	drawSettingsCleanup(context) {
		if (!this.#defaultCompositeValue) return;
		context.globalCompositeOperation = this.#defaultCompositeValue;
	}
	drawSettingsSetup(context) {
		const previousComposite = context.globalCompositeOperation, blend = this.#container.actualOptions.blend;
		this.#defaultCompositeValue = previousComposite;
		context.globalCompositeOperation = blend?.enable ? blend.mode : previousComposite;
	}
};
//#endregion
export { BlendPluginInstance };
