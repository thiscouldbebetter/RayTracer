"use strict";
class Mesh {
    constructor(name, vertices, faces) {
        this.typeName = Mesh.name;
        this.name = name;
        this.vertices = vertices;
        this.faces = faces;
        this.recalculateDerivedValues();
        this._vertexWeightsAtSurfacePos = [];
    }
    static fromNameVerticesAndFaces(name, vertices, faces) {
        return new Mesh(name, vertices, faces);
    }
    // methods
    clone() {
        var returnValue = Mesh.fromNameVerticesAndFaces(this.name, this.vertices.map(x => x.clone()), this.faces.map(x => x.clone()));
        return returnValue;
    }
    overwriteWith(other) {
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].overwriteWith(other.vertices[i]);
        }
        return this;
    }
    recalculateDerivedValues() {
        for (var f = 0; f < this.faces.length; f++) {
            var face = this.faces[f];
            face.recalculateDerivedValues(this);
        }
    }
    // Shape.
    addCollisionsWithRayToList(ray, listToAddTo) {
        for (var f = 0; f < this.faces.length; f++) {
            var face = this.faces[f];
            var facePlane = face.plane(this);
            if (facePlane.normal.dotProduct(ray.direction) < 0) {
                var collision = new Collision().rayAndFace(ray, this, // mesh
                face);
                if (collision.colliderByName(Face.name) != null) {
                    collision.colliderByNameSet(ShapeHelper.name, this);
                    listToAddTo.push(collision);
                }
            }
        }
        return listToAddTo;
    }
    surfaceMaterialColorAndNormalForCollision(scene, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal) {
        var face = collisionClosest.colliderByName("Triangle");
        if (face == null) {
            throw new Error("todo");
        }
        var surfacePos = collisionClosest.pos;
        var _vertexWeightsAtSurfacePos = face.vertexWeightsAtSurfacePosAddToList(this, // mesh
        surfacePos, this._vertexWeightsAtSurfacePos);
        surfaceNormal.overwriteWith(face.normalForVertexWeights(_vertexWeightsAtSurfacePos));
        var faceMaterial = face.material(scene);
        surfaceMaterial.overwriteWith(faceMaterial);
        surfaceColor
            .overwriteWith(surfaceMaterial.color);
        var textures = surfaceMaterial.textures;
        for (var t = 0; t < textures.length; t++) {
            var texture = textures[t];
            var texelColor = face.texelColorForVertexWeights(texture, _vertexWeightsAtSurfacePos);
            if (texelColor != null) {
                surfaceColor.overwriteWith(texelColor);
            }
            break; // todo
        }
        return surfaceColor;
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
        this.faces.forEach(x => typeSetOnObject(Face, x));
        return this;
    }
}
// constants
Mesh.VerticesInATriangle = 3;
