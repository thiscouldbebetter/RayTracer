"use strict";
class Mesh {
    constructor(name, vertices, faces) {
        this.name = name;
        this.vertices = vertices;
        this.faces = faces;
        this.recalculateDerivedValues();
        this.VertexWeightsAtSurfacePos = [];
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
            if (face.plane.normal.dotProduct(ray.direction) < 0) {
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
        var vertexWeightsAtSurfacePos = face.vertexWeightsAtSurfacePosAddToList(this, // mesh
        surfacePos, this.VertexWeightsAtSurfacePos);
        surfaceMaterial.overwriteWith(face.material(scene));
        if (surfaceMaterial.texture == null) {
            surfaceColor.overwriteWith(surfaceMaterial.color);
        }
        else {
            var texelColor = face.texelColorForVertexWeights(surfaceMaterial.texture, vertexWeightsAtSurfacePos);
            if (texelColor != null) {
                surfaceColor.overwriteWith(texelColor);
            }
        }
        surfaceNormal.overwriteWith(face.normalForVertexWeights(vertexWeightsAtSurfacePos));
        return surfaceColor;
    }
}
// constants
Mesh.VerticesInATriangle = 3;
