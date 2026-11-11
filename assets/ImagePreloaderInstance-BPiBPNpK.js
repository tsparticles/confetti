//#region ../../shapes/image/dist/browser/ImagePreloaderInstance.js
var ImagePreloaderInstance = class {
	#container;
	#engine;
	constructor(engine, container) {
		this.#engine = engine;
		this.#container = container;
	}
	destroy() {
		this.#engine.images?.delete(this.#container);
	}
};
//#endregion
export { ImagePreloaderInstance };
