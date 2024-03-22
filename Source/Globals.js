"use strict";
class Globals {
    initialize(displaySize, scene) {
        this.display = new Display();
        this.display.initialize(displaySize);
        this.scene = scene;
        this.scene.loadAndSendToCallback((sceneLoaded) => this.display.drawScene(sceneLoaded));
    }
}
Globals.Instance = new Globals();
