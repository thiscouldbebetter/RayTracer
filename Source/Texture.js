"use strict";
class Texture {
    constructor(name, image) {
        this.name = name;
        this.image = image;
        this._loaded = false;
    }
    colorSetFromUV(texelColor, texelUV) {
        var imageSizeInPixels = this.image.sizeInPixels();
        var g = this.graphics();
        var texelColorComponents = g.getImageData(texelUV.x * imageSizeInPixels.x, texelUV.y * imageSizeInPixels.y, 1, 1).data;
        texelColor.components(texelColorComponents[0] / Color.ComponentMax, texelColorComponents[1] / Color.ComponentMax, texelColorComponents[2] / Color.ComponentMax, 1 // alpha
        );
        return texelColor;
    }
    graphics() {
        if (this._graphics == null) {
            var canvas = document.createElement("canvas");
            this._graphics =
                canvas.getContext("2d", { willReadFrequently: true });
        }
        return this._graphics;
    }
    loadAndSendToCallback(callback) {
        var texture = this;
        var g = this.graphics();
        this.image.systemImageSendToCallback((systemImage) => {
            g.drawImage(systemImage, 0, 0);
            texture._loaded = true;
            callback(texture);
        });
    }
    loaded() {
        return this._loaded;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(ImageFromStrings, this.image);
        return this;
    }
}
