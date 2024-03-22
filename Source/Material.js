"use strict";
class Material {
    constructor(name, color, ambient, diffuse, specular, shininess, texture) {
        this.name = name;
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.texture = texture;
    }
    static fromNameAndColor(name, color) {
        return new Material(name, color, 0, 0, 0, 0, null);
    }
    static Instances() {
        if (Material._instances == null) {
            Material._instances = new Material_Instances();
        }
        return Material._instances;
    }
    // methods
    // cloneable
    clone() {
        return new Material(this.name, this.color.clone(), this.ambient, this.diffuse, this.specular, this.shininess, this.texture);
    }
    overwriteWith(other) {
        this.name = other.name;
        this.color.overwriteWith(other.color);
        this.ambient = other.ambient;
        this.diffuse = other.diffuse;
        this.specular = other.specular;
        this.shininess = other.shininess;
        this.texture = other.texture;
        return this;
    }
}
class Material_Instances {
    constructor() {
        var colors = Color.Instances();
        this.Green = new Material("Green", colors.Green, 1, 1, .2, 0, null);
        this.White = new Material("White", colors.White, 1, 1, .2, 0, null);
    }
}
