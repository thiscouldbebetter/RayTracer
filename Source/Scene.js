"use strict";
class Scene {
    constructor(name, materials, backgroundColor, lighting, camera, shapeDefinitions, shapeBuilders) {
        this.name = name;
        this.materials = materials;
        this.backgroundColor = backgroundColor;
        this.lighting = lighting;
        this.camera = camera;
        this.shapeDefinitions = shapeDefinitions;
        this.shapeBuilders = shapeBuilders;
    }
    static create() {
        return new Scene(null, null, null, null, null, null, null);
    }
    static demo() {
        var imageRTBang = new ImageFromStrings("RTBang", [
            "RRRRRRRRRRRRRRRR",
            "RRcccccRcccccRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcRRRcRRRcRRRcR",
            "RRcccccRRRcRRRcR",
            "RRcRRcRRRRcRRRRR",
            "RRcRRRcRRRcRRRcR",
            "RRRRRRRRRRRRRRRR",
        ]);
        var materialRTBang = new Material("RTBang", Color.Instances().White, 1, // diffuse
        1, // specular
        .2, // shininess
        10, // diffuse
        new Texture("RTBang", imageRTBang));
        var meshMonolith = MeshHelper.transformMeshVertexPositions(MeshHelper.buildCubeUnit("Monolith", materialRTBang), new TransformMultiple([
            new TransformScale(new Coords(40, 10, 90)),
            new TransformTranslate(new Coords(0, 0, -90)),
        ]));
        var meshGround = new Mesh("Ground", 
        // vertices
        [
            new Vertex(new Coords(-1000, -1000, 0)),
            new Vertex(new Coords(1000, -1000, 0)),
            new Vertex(new Coords(1000, 1000, 0)),
            new Vertex(new Coords(-1000, 1000, 0)),
        ], 
        // faces
        [
            new Face(Material.Instances().Green.name, [3, 2, 1, 0], null, null)
        ]);
        var imageEyeball = new ImageFromStrings("ImageEyeball", [
            "k", "b", "w", "w", "w", "w", "w", "w", "w", "w"
        ]);
        var materialEyeball = new Material("MaterialEyeball", Color.Instances().White, 1, // diffuse
        1, // specular
        .2, // shininess
        10, // diffuse
        new Texture("TextureEyeball", imageEyeball));
        var materials = [
            materialEyeball,
            materialRTBang,
            Material.Instances().Green,
        ];
        var sphereEyeball = new Sphere("SphereEyeball", materialEyeball.name, 100, // radius
        new Coords(200, 200, -270), new Orientation(new Coords(1, 0, 0), new Coords(1, 1, 0) // down = SE
        ));
        var lighting = new Lighting(
        // lights
        [
            new LightAmbient(.05),
            new LightDirectional(.5, new Coords(1, 1, 1)),
            // new LightPoint(30000, new Coords(-200, -200, -300)),
            new LightPoint(60000, new Coords(200, -200, -300)),
            // new LightPoint(30000, new Coords(200, 200, -300)),
        ]);
        var displaySize = new Coords(320, 240, 960);
        var camera = new Camera(displaySize.clone(), 200, // focalLength
        new Coords(-150, -300, -60), // pos
        new Orientation(new Coords(1, 2, 0), // forward
        new Coords(0, 0, 1) // down
        ));
        var shapeDefinitions = [
            sphereEyeball,
            meshMonolith,
            meshGround,
        ];
        var scene = new Scene("Scene0", materials, Color.Instances().BlueDark, // backgroundColor
        lighting, camera, shapeDefinitions, shapeDefinitions.map(x => new ShapeBuilder(x.name, new Coords(0, 0, 0))));
        return scene;
    }
    collisionsOfRayWithObjectsMinusExceptionAddToList(ray, shapeToExcept, collisionsSoFar) {
        var shapes = this.shapes();
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape != shapeToExcept) {
                shape.addCollisionsWithRayToList(ray, collisionsSoFar);
            }
        }
        return collisionsSoFar;
    }
    loadForRendererAndSendToCallback(sceneRenderer, callback) {
        if (sceneRenderer.texturesAreEnabled) {
            var materialsCount = this.materials.length;
            var materialsLoadedSoFarCount = 0;
            var scene = this;
            this.materials.forEach(m => m.loadAndSendToCallback((materialLoaded) => {
                materialsLoadedSoFarCount++;
                if (materialsLoadedSoFarCount >= materialsCount) {
                    callback(scene);
                }
            }));
        }
        else {
            callback(this);
        }
    }
    materialByName(name) {
        if (this._materialsByName == null) {
            this._materialsByName = new Map(this.materials.map(x => [x.name, x]));
        }
        return this._materialsByName.get(name);
    }
    shapeDefinitionByName(name) {
        return this.shapeDefinitions.find(x => x.name == name);
    }
    shapes() {
        if (this._shapes == null) {
            this._shapes = this.shapeBuilders.map(x => x.toShape(this));
        }
        return this._shapes;
    }
    // Serializable.
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        this.materials.forEach(x => typeSetOnObject(Material, x));
        typeSetOnObject(Color, this.backgroundColor);
        typeSetOnObject(Lighting, this.lighting);
        typeSetOnObject(Camera, this.camera);
        this.shapeDefinitions.forEach(x => ShapeHelper.typeSetOnShape(x));
        this.shapeBuilders.forEach(x => Object.setPrototypeOf(x, ShapeBuilder.prototype));
        return this;
    }
    fromJson(objectAsJson) {
        var scene;
        try {
            scene = SerializableHelper.objectOfTypeFromJson(Scene, objectAsJson);
        }
        catch (err) {
            console.log("Error deserializing scene.");
        }
        return scene;
    }
    static fromJson(objectAsJson) {
        return Scene.create().fromJson(objectAsJson);
    }
    toJson() {
        Scene.temporaryFieldsRemoveFromObjectAndDescendants(this, 0);
        var sceneAsJson = JSON.stringify(this, null, 4);
        return sceneAsJson;
    }
    static temporaryFieldsRemoveFromObjectAndDescendants(objectToRemoveFrom, depth) {
        for (var fieldName in objectToRemoveFrom) {
            if (fieldName.startsWith("_")) {
                delete objectToRemoveFrom[fieldName];
            }
            else {
                var fieldValue = objectToRemoveFrom[fieldName];
                if (fieldValue != null) {
                    var fieldTypeName = fieldValue.constructor.name;
                    var fieldTypeIsPrimitive = (fieldTypeName == String.name);
                    if (fieldTypeIsPrimitive == false) {
                        Scene.temporaryFieldsRemoveFromObjectAndDescendants(fieldValue, depth + 1);
                    }
                }
            }
        }
    }
}
