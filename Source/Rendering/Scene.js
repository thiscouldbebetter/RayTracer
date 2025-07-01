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
    static demo(camera) {
        var materialEyeball = this.demo_MaterialEyeball();
        var materialGround = Material.Instances().Green;
        var materialRTBang = this.demo_MaterialRTBang();
        var materials = [
            materialEyeball,
            materialGround,
            materialRTBang
        ];
        var backgroundColor = Color.Instances().BlueDark;
        var lighting = this.demo_Lighting();
        var meshMonolith = this.demo_MeshMonolith(materialRTBang);
        var meshGround = this.demo_MeshGround(materialGround);
        var sphereEyeball = this.demo_SphereEyeball(materialEyeball);
        var shapeDefinitions = [
            sphereEyeball,
            meshMonolith,
            meshGround
        ];
        var shapeBuilders = shapeDefinitions.map(x => ShapeBuilder.fromNameShapeDefinitionAndPos(x.name + "1", x, Coords.zeroes()));
        var shapeBuilderMonolith2 = ShapeBuilder.fromNameShapeDefinitionAndPos("Monolith2", meshMonolith, Coords.fromXY(0, 300));
        shapeBuilders.push(shapeBuilderMonolith2);
        var scene = new Scene("Scene0", materials, backgroundColor, lighting, camera, shapeDefinitions, shapeBuilders);
        return scene;
    }
    static demo_Camera(shouldUseParallelProjection) {
        var displaySize = Coords.fromXYZ(320, 240, 960);
        var focalLength = shouldUseParallelProjection
            ? null
            : 200;
        var camera = Camera.fromViewSizeFocalLengthPosAndOrientation(displaySize.clone(), focalLength, Coords.fromXYZ(-150, -300, -100), // pos
        Orientation.fromForwardAndDown(Coords.fromXYZ(1, 2, .1), Coords.fromXYZ(0, 0, 1)));
        return camera;
    }
    static demo_Lighting() {
        return Lighting.fromLights([
            LightAmbient.fromIntensity(.05),
            LightDirectional
                .fromIntensityAndDirection(.5, Coords.fromXYZ(1, 1, 1)),
            LightPoint
                .fromIntensityAndPos(60000, Coords.fromXYZ(200, -200, -300)),
        ]);
    }
    static demo_MaterialEyeball() {
        /*
        var imageEyeball = new ImageFromStrings
        (
            "ImageEyeball",
            [
                "k","b","w","w","w","w","w","w","w","w"
            ]
        );
        */
        var imageEyeball = ImageFromDataUrl.fromNameAndDataUrl("ImageEyeball", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAICAYAAAA4GpVBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAZSURBVBhXYwCC/0wMi14AKSBgAvExCQYGAMRUBpJwU7r/AAAAAElFTkSuQmCC");
        var materialEyeball = Material.fromNameColorOpticsAndTextures("MaterialEyeball", Color.Instances().White, Material_Optics.fromAmbientDiffuseSpecularAndShininess(1, // diffuse
        1, // specular
        .2, // shininess
        10), [
            new Texture("TextureEyeball", imageEyeball)
        ]);
        return materialEyeball;
    }
    static demo_MaterialRTBang() {
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
        var materialRTBang = new Material("RTBang", Color.Instances().White, Material_Optics.fromAmbientDiffuseSpecularAndShininess(1, // ambient
        1, // diffuse
        .2, // specular
        10 // shininess
        ), [
            Texture.fromNameAndImage("RTBang", imageRTBang)
        ]);
        return materialRTBang;
    }
    static demo_MeshGround(materialGround) {
        //return this.demo_MeshGround_Rectangle(materialGround);
        return this.demo_MeshGround_Grid(materialGround);
    }
    static demo_MeshGround_Grid(materialGround) {
        var meshGroundDimensionInPixels = 2000;
        var meshGroundDimensionInCells = 8; // todo - Anything greater fails.
        var meshGround = MeshBuilder.gridFromNameMaterialAndSizesInCellsAndPixels("Ground", materialGround, Coords.fromXY(1, 1)
            .multiplyScalar(meshGroundDimensionInCells), Coords.fromXY(1, 1)
            .multiplyScalar(meshGroundDimensionInPixels));
        var offset = Coords.fromXY(-1, -1)
            .multiplyScalar(meshGroundDimensionInPixels)
            .half();
        var transformCenter = TransformTranslate.fromOffset(offset);
        meshGround.transformApply(transformCenter);
        var transformFlipUpright = TransformOrient.fromOrientation(Orientation.fromForwardAndDown(Coords.fromXYZ(1, 0, 0), Coords.fromXYZ(0, 0, -1)));
        meshGround.transformApply(transformFlipUpright);
        /*
        MeshBuilder.meshVerticesDisplaceRandomlyToDistanceMax
        (
            meshGround,
            100
        );
        */
        return meshGround;
    }
    static demo_MeshGround_Rectangle(materialGround) {
        var meshGround = MeshBuilder.rectangleFromNameSizeAndMaterial("Ground", Coords.fromXY(1, 1).multiplyScalar(2000), materialGround);
        return meshGround;
    }
    static demo_MeshMonolith(materialRTBang) {
        var meshMonolithSize = Coords.fromXYZ(80, 20, 180);
        var meshMonolith = MeshBuilder.boxFromNameMaterialAndSize("Monolith", materialRTBang, meshMonolithSize);
        return meshMonolith;
    }
    static demo_SphereEyeball(materialEyeball) {
        var sphereEyeball = new Sphere("SphereEyeball", materialEyeball.name, 100, // radius
        Disposition.fromPosAndOri(Coords.fromXYZ(200, 200, -270), // center
        Orientation.fromForwardAndDown(Coords.fromXYZ(1, 0, 0), Coords.fromXYZ(1, 1, 0) // down = SE
        )));
        return sphereEyeball;
    }
    static demoWithProjectionParallel() {
        var camera = this.demo_Camera(true);
        return this.demo(camera);
    }
    static demoWithProjectionPerspective() {
        var camera = this.demo_Camera(false);
        return this.demo(camera);
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
            var materialsToLoad = this.materials;
            var materialsCount = materialsToLoad.length;
            var materialsLoadedSoFarCount = 0;
            var scene = this;
            for (var m = 0; m < materialsToLoad.length; m++) {
                var materialToLoad = materialsToLoad[m];
                materialToLoad.loadAndSendToCallback((materialLoaded) => {
                    materialsLoadedSoFarCount++;
                    if (materialsLoadedSoFarCount >= materialsCount) {
                        callback(scene);
                    }
                });
            }
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
        var sceneAsObjectSerializable = this.toObjectSerializable();
        var sceneAsJson = JSON.stringify(sceneAsObjectSerializable, null, 4);
        return sceneAsJson;
    }
    toObjectSerializable() {
        SerializableHelper.temporaryFieldsRemoveFromObjectAndDescendants(this, 0);
        var thisAsObject = {
            "name": this.name,
            "materials": this.materials.map(x => x.toObjectSerializable()),
            "backgroundColor": this.backgroundColor,
            "lighting": this.lighting,
            "camera": this.camera,
            "shapeDefinitions": this.shapeDefinitions,
            "shapeBuilders": this.shapeBuilders
        };
        return thisAsObject;
    }
}
