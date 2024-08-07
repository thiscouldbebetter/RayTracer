"use strict";
class SceneRenderer {
    constructor(lightingIsEnabled, shadowsAreEnabled, texturesAreEnabled) {
        this.lightingIsEnabled = lightingIsEnabled;
        this.shadowsAreEnabled = shadowsAreEnabled;
        this.texturesAreEnabled = texturesAreEnabled;
    }
    static minimal() {
        return new SceneRenderer(false, false, false);
    }
    static maximal() {
        return new SceneRenderer(true, true, true);
    }
    drawSceneToDisplay(scene, display) {
        this.scene = scene;
        this.drawSceneToDisplay_InitializeTemporaryVariables();
        this.drawSceneToDisplay_Background(scene, display);
        var sizeInTiles = Coords.fromXY(1, 1);
        var tileSizeInPixels = display.sizeInPixels.clone().divide(sizeInTiles);
        var tilePosInTiles = Coords.create();
        var tileBounds = new Bounds(Coords.create(), Coords.create());
        for (var y = 0; y < sizeInTiles.y; y++) {
            tilePosInTiles.y = y;
            for (var x = 0; x < sizeInTiles.x; x++) {
                tilePosInTiles.x = x;
                tileBounds.min.overwriteWith(tilePosInTiles).multiply(tileSizeInPixels);
                tileBounds.max.overwriteWith(tileBounds.min).add(tileSizeInPixels);
                this.drawSceneToDisplay_PixelsGetAndDrawForBounds(scene, display, tileBounds);
            }
        }
    }
    drawSceneToDisplay_InitializeTemporaryVariables() {
        this._collisions = [];
        this._directionFromEyeToPixel = Coords.create();
        this._displacementFromEyeToPixel = Coords.create();
        this._material = Material.fromNameAndColor("DisplayMaterial", Color.blank("MaterialColor"));
        this._pixelColor = Color.blank("PixelColor");
        this._surfaceNormal = Coords.create();
        this._texelColor = Color.blank("TexelColor");
        this._texelUV = Coords.create();
        this._vertexWeightsAtSurfacePos = [];
    }
    drawSceneToDisplay_Background(scene, display) {
        display.fillWithColor(scene.backgroundColor);
    }
    drawSceneToDisplay_PixelsGetAndDrawForBounds(scene, display, bounds) {
        var boundsMin = bounds.min;
        var boundsMax = bounds.max;
        var pane = new Pane(boundsMin, boundsMax);
        this.drawSceneToDisplay_PaneRender(scene, display, pane);
        pane.drawToDisplay(display);
    }
    drawSceneToDisplay_PaneRender(scene, display, pane) {
        var pixelColor = this._pixelColor;
        var paneSize = pane.sizeInPixels;
        var boundsMin = pane.boundsMin;
        var pixelPosAbsolute = Coords.create();
        var pixelPosRelative = Coords.create();
        for (var y = 0; y < paneSize.y; y++) {
            pixelPosRelative.y = y;
            for (var x = 0; x < paneSize.x; x++) {
                pixelPosRelative.x = x;
                pixelPosAbsolute
                    .overwriteWith(pixelPosRelative)
                    .add(boundsMin);
                var collisionForRayFromCameraToPixel = this.drawSceneToDisplay_ColorSetFromPixelAtPos(scene, pixelColor, pixelPosAbsolute);
                if (collisionForRayFromCameraToPixel != null) {
                    pane.pixelAtPosRelativeSetToColor(pixelPosRelative, pixelColor);
                }
            }
        }
    }
    drawSceneToDisplay_ColorSetFromPixelAtPos(scene, surfaceColor, pixelPos) {
        var collisionClosest = this.drawSceneToDisplay_Pixel_FindClosestCollision(scene, pixelPos);
        if (collisionClosest != null) {
            var shape = collisionClosest.colliderByName(ShapeHelper.name);
            var surfaceNormal = this._surfaceNormal;
            var surfaceMaterial = this._material;
            shape.surfaceMaterialColorAndNormalForCollision(scene, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal);
            var intensityFromLightsAll = 0;
            if (this.lightingIsEnabled == false) {
                intensityFromLightsAll = 1;
            }
            else {
                var lights = scene.lighting.lights;
                for (var i = 0; i < lights.length; i++) {
                    var light = lights[i];
                    var intensity = light.intensityForCollisionMaterialNormalAndCamera(collisionClosest, surfaceMaterial, surfaceNormal, scene.camera, this);
                    intensityFromLightsAll += intensity;
                }
            }
            surfaceColor.multiply(intensityFromLightsAll);
        }
        return collisionClosest;
    }
    drawSceneToDisplay_Pixel_FindClosestCollision(scene, pixelPos) {
        var camera = scene.camera;
        var cameraOrientation = camera.orientation;
        var displacementFromEyeToPixel = this._displacementFromEyeToPixel;
        var cameraOrientationTemp = Orientation.Instances().Camera;
        var cameraForward = cameraOrientationTemp.forward;
        var cameraRight = cameraOrientationTemp.right;
        var cameraDown = cameraOrientationTemp.down;
        var displaySizeInPixelsHalf = camera.viewSizeHalf();
        displacementFromEyeToPixel.overwriteWith(cameraForward.overwriteWith(cameraOrientation.forward).multiplyScalar(camera.focalLength)).add(cameraRight.overwriteWith(cameraOrientation.right).multiplyScalar(pixelPos.x - displaySizeInPixelsHalf.x)).add(cameraDown.overwriteWith(cameraOrientation.down).multiplyScalar(pixelPos.y - displaySizeInPixelsHalf.y));
        var directionFromEyeToPixel = this._directionFromEyeToPixel;
        directionFromEyeToPixel.overwriteWith(displacementFromEyeToPixel).normalize();
        var rayFromEyeToPixel = new Ray(camera.pos, directionFromEyeToPixel);
        var collisions = this._collisions;
        collisions.length = 0;
        collisions = scene.collisionsOfRayWithObjectsMinusExceptionAddToList(rayFromEyeToPixel, null, // objectToExcept
        collisions);
        var collisionClosest = null;
        if (collisions.length > 0) {
            collisionClosest = collisions[0];
            for (var c = 1; c < collisions.length; c++) {
                var collision = collisions[c];
                if (collision.distanceToCollision < collisionClosest.distanceToCollision) {
                    collisionClosest = collision;
                }
            }
        }
        return collisionClosest;
    }
}
