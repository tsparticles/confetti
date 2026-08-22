//#region ../../plugins/emitters/dist/browser/ShapeManager.js
var shapeGenerators = /* @__PURE__ */ new Map();
var ShapeManager = class {
	addShapeGenerator(name, generator) {
		if (!this.getShapeGenerator(name)) shapeGenerators.set(name, generator);
	}
	getShapeGenerator(name) {
		return shapeGenerators.get(name);
	}
	getSupportedShapeGenerators() {
		return shapeGenerators.keys();
	}
};
//#endregion
export { ShapeManager };
