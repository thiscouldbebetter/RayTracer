"use strict";
class Material {
    constructor(name, color, optics, textures) {
        this.name = name;
        this.color = color;
        this.optics = optics;
        this.textures = textures;
    }
    static fromNameAndColor(name, color) {
        return new Material(name, color, Material_Optics.zeroes(), []);
    }
    static fromNameColorOpticsAndTextures(name, color, optics, textures) {
        return new Material(name, color, optics, textures);
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
        return new Material(this.name, this.color.clone(), this.optics.clone(), this.textures.map(x => x.clone()));
    }
    overwriteWith(other) {
        this.name = other.name;
        this.color.overwriteWith(other.color);
        this.optics.overwriteWith(other.optics);
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
        var m = (n, c, o, t) => Material.fromNameColorOpticsAndTextures(n, c, o, t);
        var mo = (a, d, sp, sh) => Material_Optics.fromAmbientDiffuseSpecularAndShininess(a, d, sp, sh);
        this.Green = m("Green", colors.Green, mo(1, 1, .2, 0), []);
        this.White = m("White", colors.White, mo(1, 1, .2, 0), []);
    }
}
class Material_Optics {
    constructor(ambient, diffuse, specular, shininess) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
    }
    static fromAmbientDiffuseSpecularAndShininess(ambient, diffuse, specular, shininess) {
        return new Material_Optics(ambient, diffuse, specular, shininess);
    }
    static zeroes() {
        return Material_Optics.fromAmbientDiffuseSpecularAndShininess(0, 0, 0, 0);
    }
    // Clonable.
    clone() {
        return new Material_Optics(this.ambient, this.diffuse, this.specular, this.shininess);
    }
    overwriteWith(other) {
        this.ambient = other.ambient;
        this.diffuse = other.diffuse;
        this.specular = other.specular;
        this.shininess = other.shininess;
        return this;
    }
}
