"use strict";
class Texture {
    constructor(name, image) {
        this.name = name;
        this.image = image;
        this._loaded = false;
    }
    static fromNameAndImage(name, image) {
        return new Texture(name, image);
    }
    colorSetFromUv(texelColor, texelUV) {
        var imageSizeInPixels = this.image.sizeInPixels();
        var g = this.graphics();
        var texelColorComponents = g.getImageData(texelUV.x * imageSizeInPixels.x, texelUV.y * imageSizeInPixels.y, 1, 1).data;
        texelColor.componentsRGBASet(texelColorComponents[0] / Color.ComponentMax, texelColorComponents[1] / Color.ComponentMax, texelColorComponents[2] / Color.ComponentMax, 1 // alpha
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
    // Clonable.
    clone() {
        return Texture.fromNameAndImage(this.name, this.image);
    }
    overwriteWith(other) {
        this.name = other.name;
        this.image = other.image;
        return this;
    }
    // Serializable.
    fromJson(objectAsJson) {
        throw new Error("To be implemented!");
    }
    toJson() {
        throw new Error("To be implemented!");
    }
    prototypesSet() {
        ImageHelper.imageTypeSet(this.image);
        return this;
    }
}
