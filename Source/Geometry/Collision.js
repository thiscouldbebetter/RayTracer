"use strict";
class Collision {
    constructor() {
        this.pos = Coords.create();
        this.distanceToCollision = null;
        this.colliders = [];
        this._collidersByName = new Map();
    }
    // instance methods
    static closestOf(collisions) {
        var collisionClosest = null;
        if (collisions.length > 0) {
            collisionClosest = collisions[0];
            for (var c = 1; c < collisions.length; c++) {
                var collision = collisions[c];
                var collisionIsClosestSoFar = collision.distanceToCollision
                    < collisionClosest.distanceToCollision;
                if (collisionIsClosestSoFar) {
                    collisionClosest = collision;
                }
            }
        }
        return collisionClosest;
    }
    colliderByName(name) {
        return this._collidersByName.get(name);
    }
    colliderByNameSet(name, value) {
        this.colliders.push(value);
        this._collidersByName.set(name, value);
    }
    colliderFirst() {
        return this.colliders[0];
    }
    rayAndFace(ray, mesh, face) {
        var plane = face.plane(mesh);
        this.rayAndPlane(ray, plane);
        var colliderPlane = this.colliderByName(Plane.name);
        if (colliderPlane != null) {
            var collisionPosIsWithinFace = this.isPosWithinFace(mesh, face);
            if (collisionPosIsWithinFace == false) {
                this.colliderByNameSet(Face.name, null);
            }
            else {
                this.colliderByNameSet(Face.name, face);
                var faceTriangles = face.triangles(mesh);
                for (var t = 0; t < faceTriangles.length; t++) {
                    var triangle = faceTriangles[t];
                    var collisionPosIsWithinTriangle = this.isPosWithinFace(mesh, triangle);
                    if (collisionPosIsWithinTriangle) {
                        this.colliderByNameSet("Triangle", triangle);
                        break;
                    }
                }
            }
        }
        return this;
    }
    rayAndPlane(ray, plane) {
        this.distanceToCollision =
            (plane.distanceFromOrigin
                - plane.normal.dotProduct(ray.startPos))
                / plane.normal.dotProduct(ray.direction);
        if (this.distanceToCollision >= 0) {
            this.pos.overwriteWith(ray.direction).multiplyScalar(this.distanceToCollision).add(ray.startPos);
            this.colliderByNameSet(Plane.name, plane);
        }
        return this;
    }
    rayAndSphere(ray, sphere) {
        var rayDirection = ray.direction;
        var displacementFromSphereCenterToCamera = ray.startPos
            .clone()
            .subtract(sphere.disp.pos);
        var sphereRadius = sphere.radius;
        var sphereRadiusSquared = sphereRadius * sphereRadius;
        var a = rayDirection.dotProduct(rayDirection);
        var b = 2 * rayDirection.dotProduct(displacementFromSphereCenterToCamera);
        var c = displacementFromSphereCenterToCamera.dotProduct(displacementFromSphereCenterToCamera) - sphereRadiusSquared;
        var discriminant = (b * b) - 4 * a * c;
        if (discriminant >= 0) {
            var rootOfDiscriminant = Math.sqrt(discriminant);
            var distanceToCollision1 = (rootOfDiscriminant - b)
                / (2 * a);
            var distanceToCollision2 = (0 - rootOfDiscriminant - b)
                / (2 * a);
            if (distanceToCollision1 >= 0) {
                if (distanceToCollision2 >= 0
                    && distanceToCollision2 < distanceToCollision1) {
                    this.distanceToCollision = distanceToCollision2;
                }
                else {
                    this.distanceToCollision = distanceToCollision1;
                }
            }
            else {
                this.distanceToCollision = distanceToCollision2;
            }
            this.pos.overwriteWith(ray.direction).multiplyScalar(this.distanceToCollision).add(ray.startPos);
            this.colliderByNameSet(Sphere.name, sphere);
        }
        return this;
    }
    isPosWithinFace(mesh, face) {
        var displacementFromVertex0ToCollision = Coords.create();
        var isPosWithinAllEdgesOfFaceSoFar = true;
        var edges = face.edges();
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var edgeVertex0 = edge.vertex(mesh, 0);
            displacementFromVertex0ToCollision
                .overwriteWith(this.pos)
                .subtract(edgeVertex0.pos);
            var facePlane = face.plane(mesh);
            var edgeDirection = edge.direction(mesh);
            var edgeTransverse = edgeDirection
                .clone()
                .crossProduct(facePlane.normal);
            // hack?
            var epsilon = .01;
            var displacementDotEdgeTransverse = displacementFromVertex0ToCollision.dotProduct(edgeTransverse);
            if (displacementDotEdgeTransverse >= epsilon) {
                isPosWithinAllEdgesOfFaceSoFar = false;
                break;
            }
        }
        return isPosWithinAllEdgesOfFaceSoFar;
    }
}
