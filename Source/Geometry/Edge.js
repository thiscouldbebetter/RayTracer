"use strict";
class Edge {
    constructor(vertexIndices) {
        this.vertexIndices = vertexIndices;
    }
    static fromVertexIndices(vertexIndices) {
        return new Edge(vertexIndices);
    }
    static fromVertexIndexPair(vertexIndex0, vertexIndex1) {
        return new Edge([vertexIndex0, vertexIndex1]);
    }
    recalculateDerivedValues() {
        this._vertices = null;
        this._displacement = null;
        this._direction = null;
        this._transverse = null;
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
        return this;
    }
    // Temporary values.
    vertices(mesh) {
        if (this._vertices == null) {
            var vertex0 = this.vertex(mesh, 0);
            var vertex1 = this.vertex(mesh, 1);
            this._vertices = [vertex0, vertex1];
        }
        return this._vertices;
    }
    displacement(mesh) {
        if (this._displacement == null) {
            var vertices = this.vertices(mesh);
            this._displacement =
                vertices[1].pos
                    .clone()
                    .subtract(vertices[0].pos);
        }
        return this._displacement;
    }
    direction(mesh) {
        if (this._direction == null) {
            var displacement = this.displacement(mesh);
            this._direction =
                displacement
                    .clone()
                    .normalize();
        }
        ;
        return this._direction;
    }
    transverse(mesh, face) {
        if (this._transverse == null) {
            var direction = this.direction(mesh);
            var facePlane = face.plane();
            this._transverse =
                direction
                    .clone()
                    .crossProduct(facePlane.normal);
        }
        return this._transverse;
    }
}
