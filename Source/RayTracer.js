"use strict";
class RayTracer {
    sceneRender(scene) {
        var sceneRenderer = SceneRenderer.maximal(); // todo - Make configurable through UI.
        sceneRenderer.sceneRender(scene);
    }
}
