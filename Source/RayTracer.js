"use strict";
class RayTracer {
    sceneRender(scene) {
        var displaySize = scene.camera.viewSize;
        var displayToRenderToFirst = new DisplayGraphics(displaySize);
        var timeBeforeRender = new Date();
        var sceneRenderer = SceneRenderer.maximal(); // todo - Make configurable through UI.
        scene.loadForRendererAndSendToCallback(sceneRenderer, (sceneLoaded) => {
            this.sceneRender_SceneLoaded(sceneLoaded, sceneRenderer, displayToRenderToFirst, timeBeforeRender);
        });
    }
    sceneRender_SceneLoaded(sceneLoaded, sceneRenderer, displayToRenderToFirst, timeBeforeRender) {
        sceneRenderer.drawSceneToDisplay(sceneLoaded, displayToRenderToFirst);
        var timeAfterRender = new Date();
        var renderTimeInMilliseconds = timeAfterRender.valueOf()
            - timeBeforeRender.valueOf();
        console.log("Scene rendered in " + renderTimeInMilliseconds + " ms.");
    }
}
