"use strict";
class Material {
    constructor(name, color, ambient, diffuse, specular, shininess, textures) {
        this.name = name;
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.textures = textures;
    }
    static fromNameAndColor(name, color) {
        return new Material(name, color, 0, 0, 0, 0, []);
    }
    static Instances() {
        if (Material._instances == null) {
            Material._instances = new Material_Instances();
        }
        return Material._instances;
    }
    // methods
    colorSetFromUv(color, textureUv) {
        color.overwriteWith(this.color);
        for (var t = 0; t < this.textures.length; t++) {
            var texture = this.textures[t];
            texture.colorSetFromUv(color, textureUv);
            break; // todo
        }
        return color;
    }
    loadAndSendToCallback(callback) {
        var material = this;
        if (this.textures.length == 0) {
            callback(material);
        }
        else {
            this.textures.forEach(textureToLoad => {
                textureToLoad.loadAndSendToCallback(() => {
                    if (material.texturesAreAllLoaded()) {
                        callback(material);
                    }
                });
            });
        }
    }
    texturesAreAllLoaded() {
        var someTextureIsNotLoaded = this.textures.some(x => x.loaded() == false);
        var allTexturesAreLoaded = (someTextureIsNotLoaded == false);
        return allTexturesAreLoaded;
    }
    // cloneable
    clone() {
        return new Material(this.name, this.color.clone(), this.ambient, this.diffuse, this.specular, this.shininess, this.textures.map(x => x.clone()));
    }
    overwriteWith(other) {
        this.name = other.name;
        this.color.overwriteWith(other.color);
        this.ambient = other.ambient;
        this.diffuse = other.diffuse;
        this.specular = other.specular;
        this.shininess = other.shininess;
        this.textures.length = other.textures.length;
        for (var i = 0; i < this.textures.length; i++) {
            this.textures[i] = other.textures[i];
        }
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
        var typeSetOnObject = SerializableHelper.typeSetOnObject;
        typeSetOnObject(Color, this.color);
        this.textures.forEach(x => typeSetOnObject(Texture, x));
        return this;
    }
}
class Material_Instances {
    constructor() {
        var colors = Color.Instances();
        this.Green = new Material("Green", colors.Green, 1, 1, .2, 0, []);
        this.White = new Material("White", colors.White, 1, 1, .2, 0, []);
    }
}
