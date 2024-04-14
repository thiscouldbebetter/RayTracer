"use strict";
class Vertex {
    constructor(pos) {
        this.pos = pos;
    }
    clone() {
        return new Vertex(this.pos.clone());
    }
    static positionsForMany(vertices) {
        var returnValues = [];
        for (var i = 0; i < vertices.length; i++) {
            returnValues.push(vertices[i].pos);
        }
        return returnValues;
    }
    // strings
    toString() {
        return this.pos.toString();
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
        typeSetOnObject(Coords, this.pos);
        return this;
    }
}
