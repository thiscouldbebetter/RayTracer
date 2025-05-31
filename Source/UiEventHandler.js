"use strict";
class UiEventHandler {
    static buttonClear_Clicked() {
        var d = document;
        var textareaSceneAsJson = d.getElementById("textareaSceneAsJson");
        textareaSceneAsJson.innerHTML = "";
    }
    static buttonDemoLoad_Clicked() {
        var d = document;
        var textareaSceneAsJson = d.getElementById("textareaSceneAsJson");
        var scene = Scene.demo();
        var sceneAsJson = scene.toJson();
        textareaSceneAsJson.innerHTML = sceneAsJson;
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
}
