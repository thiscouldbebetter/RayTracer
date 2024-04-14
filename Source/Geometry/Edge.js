"use strict";
class Edge {
    constructor(vertexIndices) {
        this.vertexIndices = vertexIndices;
        this.vertices = null;
        this.displacement = Coords.create();
        this.direction = Coords.create();
        this.transverse = Coords.create();
    }
    recalculateDerivedValues(mesh, face) {
        if (this.vertices == null) {
            this.vertices = [this.vertex(mesh, 0), this.vertex(mesh, 1)];
        }
        this.displacement.overwriteWith(this.vertices[1].pos).subtract(this.vertices[0].pos);
        this.direction.overwriteWith(this.displacement).normalize();
        this.transverse.overwriteWith(this.direction).crossProduct(face.plane(mesh).normal);
    }
    vertex(mesh, vertexIndexIndex) {
        var vertexIndex = this.vertexIndices[vertexIndexIndex];
        var vertex = mesh.vertices[vertexIndex];
        return vertex;
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
        this.vertices.forEach(x => typeSetOnObject(Vertex, x));
        typeSetOnObject(Coords, this.displacement);
        typeSetOnObject(Coords, this.direction);
        typeSetOnObject(Coords, this.transverse);
        return this;
    }
}
