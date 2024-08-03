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
    // methods
    clone() {
        var returnValue = new Mesh(this.name, Cloneable.cloneMany(this.vertices), Cloneable.cloneMany(this.faces));
        return returnValue;
    }
    overwriteWith(other) {
        Cloneable.overwriteManyWithOthers(this.vertices, other.vertices);
        return this;
    }
    recalculateDerivedValues() {
        for (var f = 0; f < this.faces.length; f++) {
            var face = this.faces[f];
            face.recalculateDerivedValues(this);
        }
    }
    // collidable
    addCollisionsWithRayToList(ray, listToAddTo) {
        for (var f = 0; f < this.faces.length; f++) {
            var face = this.faces[f];
            var facePlane = face.plane(this);
            if (facePlane.normal.dotProduct(ray.direction) < 0) {
                var collision = new Collision().rayAndFace(ray, this, // mesh
                face);
                if (collision.colliderByName(Face.name) != null) {
                    collision.colliderByNameSet("Collidable", this);
                    listToAddTo.push(collision);
                }
            }
        }
        return listToAddTo;
    }
    surfaceMaterialColorAndNormalForCollision(scene, collisionClosest, surfaceMaterial, surfaceColor, surfaceNormal) {
        var face = collisionClosest.colliderByName("Triangle");
        var surfacePos = collisionClosest.pos;
        var _vertexWeightsAtSurfacePos = face.vertexWeightsAtSurfacePosAddToList(this, // mesh
        surfacePos, this._vertexWeightsAtSurfacePos);
        var faceMaterial = face.material(scene);
        surfaceMaterial.overwriteWith(faceMaterial);
        var textureShouldBeUsed = surfaceMaterial.textureIsSetAndLoaded();
        if (textureShouldBeUsed == false) {
            surfaceColor.overwriteWith(surfaceMaterial.color);
        }
        else {
            var texelColor = face.texelColorForVertexWeights(surfaceMaterial.texture, _vertexWeightsAtSurfacePos);
            if (texelColor != null) {
                surfaceColor.overwriteWith(texelColor);
            }
        }
        surfaceNormal.overwriteWith(face.normalForVertexWeights(_vertexWeightsAtSurfacePos));
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
        this.faces.forEach(x => typeSetOnObject(Face, x));
        return this;
    }
}
// constants
Mesh.VerticesInATriangle = 3;
