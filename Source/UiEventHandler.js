"use strict";
class UiEventHandler {
    static buttonClear_Clicked() {
        var d = document;
        var textareaSceneAsJson = d.getElementById("textareaSceneAsJson");
        textareaSceneAsJson.innerHTML = "";
    }
    static buttonRender_Clicked() {
        var d = document;
        var textareaSceneAsJson = d.getElementById("textareaSceneAsJson");
        var sceneAsJson = textareaSceneAsJson.innerHTML;
        var scene = Scene.fromJson(sceneAsJson);
        if (scene == null) {
            var errorMessage = "The specified JSON for the scene did not have the expected format.";
            alert(errorMessage);
        }
        else {
            var rayTracer = new RayTracer();
            rayTracer.sceneRender(scene);
        }
    }
    static selectDemo_Changed(selectDemo) {
        var d = document;
        var textareaSceneAsJson = d.getElementById("textareaSceneAsJson");
        var demoName = selectDemo.value;
        var scene = demoName == "Perspective"
            ? Scene.demoWithProjectionPerspective()
            : demoName == "Parallel"
                ? Scene.demoWithProjectionParallel()
                : null;
        var sceneAsJson = scene == null
            ? ""
            : scene.toJson();
        textareaSceneAsJson.innerHTML = sceneAsJson;
    }
}
