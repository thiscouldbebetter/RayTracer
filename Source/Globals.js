"use strict";
class Globals {
    initialize(displaySize, scene) {
        this.display = new Display();
        this.display.initialize(displaySize);
        this.scene = scene;
        this.display.drawScene(this.scene);
    }
}
Globals.Instance = new Globals();
