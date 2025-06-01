"use strict";
class SceneRenderer {
    constructor(lightingIsEnabled, shadowsAreEnabled, texturesAreEnabled, renderToBufferFirst) {
        this.lightingIsEnabled = lightingIsEnabled;
        this.shadowsAreEnabled = shadowsAreEnabled;
        this.texturesAreEnabled = texturesAreEnabled;
        this.renderToBufferFirst = renderToBufferFirst;
    }
    static minimal() {
        return new SceneRenderer(false, false, false, false);
    }
    static maximal() {
        return new SceneRenderer(true, true, true, false); // todo - Enable renderToBufferFirst.
    }
    sceneRender(scene) {
        var displaySize = scene.camera.viewSize;
        var displayToRenderToFirst = this.renderToBufferFirst
            ? new DisplayBuffer(displaySize)
            : new DisplayGraphics(displaySize);
        var timeBeforeRender = new Date();
        scene.loadForRendererAndSendToCallback(this, (sceneLoaded) => {
            this.sceneRender_SceneLoaded(sceneLoaded, this, // sceneRender
            displayToRenderToFirst, timeBeforeRender);
        });
    }
    sceneRender_SceneLoaded(sceneLoaded, sceneRenderer, displayToRenderToFirst, timeBeforeRender) {
        sceneRenderer.drawSceneToDisplay(sceneLoaded, displayToRenderToFirst);
        if (this.renderToBufferFirst) {
            var displayFinal = new DisplayGraphics(sceneLoaded.camera.viewSize);
            displayToRenderToFirst.drawToOther(displayFinal);
        }
        var timeAfterRender = new Date();
        var renderTimeInMilliseconds = timeAfterRender.valueOf()
            - timeBeforeRender.valueOf();
        console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
    }
    drawSceneToDisplay(scene, display) {
        this.drawSceneToDisplay_InitializeTemporaryVariables();
        this.drawSceneToDisplay_Background(scene, display);
        var sizeInTiles = Coords.fromXY(1, 1);
        var tileSizeInPixels = display.sizeInPixels
            .clone()
            .divide(sizeInTiles);
        var tilePosInTiles = Coords.create();
        var tileBounds = Bounds.create();
        for (var y = 0; y < sizeInTiles.y; y++) {
            tilePosInTiles.y = y;
            for (var x = 0; x < sizeInTiles.x; x++) {
                tilePosInTiles.x = x;
                this.drawSceneToDisplay_ForTilePosAndBounds(scene, display, tileSizeInPixels, tilePosInTiles, tileBounds);
            }
        }
    }
    drawSceneToDisplay_ForTilePosAndBounds(scene, display, tileSizeInPixels, tilePosInTiles, tileBounds) {
        tileBounds.min
            .overwriteWith(tilePosInTiles)
            .multiply(tileSizeInPixels);
        tileBounds.max
            .overwriteWith(tileBounds.min)
            .add(tileSizeInPixels);
        this.drawSceneToDisplay_PixelsGetAndDrawForBounds(scene, display, tileBounds);
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
        pane.drawSceneForRenderer(scene, this);
        pane.drawToDisplay(display);
    }
    drawSceneToDisplay_ColorSetFromPixelAtPos(scene, surfaceColor, pixelPos) {
        var collisionClosest = this.drawSceneToDisplay_Pixel_FindClosestCollision(scene, pixelPos);
        if (collisionClosest != null) {
            var shape = collisionClosest.colliderByName(ShapeHelper.name);
            var surfaceNormal = this._surfaceNormal;
            var surfaceMaterial = this._material;
            shape.surfaceMaterialColorAndNormalForCollision(scene, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal);
            var intensityFromLightsAll = this.intensityFromLightsAll(collisionClosest, surfaceMaterial, surfaceNormal, scene);
            surfaceColor.multiply(intensityFromLightsAll);
        }
        return collisionClosest;
    }
    drawSceneToDisplay_Pixel_FindClosestCollision(scene, pixelPos) {
        var camera = scene.camera;
        var rayFromCameraToPixel = this.rayFromCameraToPixelAtPos(camera, pixelPos);
        var collisions = this._collisions;
        collisions.length = 0;
        collisions = scene.collisionsOfRayWithObjectsMinusExceptionAddToList(rayFromCameraToPixel, null, // objectToExcept
        collisions);
        var collisionClosest = Collision.closestOf(collisions);
        return collisionClosest;
    }
    intensityFromLightsAll(collisionClosest, surfaceMaterial, surfaceNormal, scene) {
        var intensityFromLightsAll = 0;
        if (this.lightingIsEnabled == false) {
            intensityFromLightsAll = 1;
        }
        else {
            var lights = scene.lighting.lights;
            for (var i = 0; i < lights.length; i++) {
                var light = lights[i];
                var intensity = light.intensityForCollisionMaterialNormalAndCamera(collisionClosest, surfaceMaterial, surfaceNormal, scene.camera, this, scene);
                intensityFromLightsAll += intensity;
            }
        }
        return intensityFromLightsAll;
    }
    rayFromCameraToPixelAtPos(camera, pixelPos) {
        if (this._rayFromCameraToPixelAtPos == null) {
            this._rayFromCameraToPixelAtPos = Ray.create();
        }
        var directionFromEyeToPixel = camera.directionToPixelPos(pixelPos);
        this._rayFromCameraToPixelAtPos.startPosAndDirectionSet(camera.pos, directionFromEyeToPixel);
        return this._rayFromCameraToPixelAtPos;
    }
}
