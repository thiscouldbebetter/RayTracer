"use strict";
class Collision {
    constructor() {
        this.pos = Coords.create();
        this.distanceToCollision = null;
        this.shapesColliding = [];
        this.surfaceMaterial = Material.fromName(Collision.name);
        this.surfaceNormal = Coords.create();
        this.surfaceColor = Color.create();
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
    shapeCollidingAdd(shape) {
        this.shapesColliding.push(shape);
        var shapeTypeName = shape.constructor.name;
        this.shapesCollidingByName().set(shapeTypeName, shape);
        return this;
    }
    shapeCollidingFinal() {
        return this.shapesColliding[this.shapesColliding.length - 1];
    }
    shapeCollidingFirst() {
        return this.shapesColliding[0];
    }
    shapeCollidingWithName(name) {
        return this.shapesCollidingByName().get(name);
    }
    shapesCollidingByName() {
        if (this._shapesCollidingByName == null) {
            this._shapesCollidingByName = new Map();
        }
        return this._shapesCollidingByName;
    }
    shapesCollidingByNameReset() {
        this._shapesCollidingByName = null;
        return this;
    }
    rayAndFace(ray, mesh, face) {
        var plane = face.plane();
        this.rayAndPlane(ray, plane);
        var colliderPlane = this.shapeCollidingWithName(Plane.name);
        if (colliderPlane != null) {
            var collisionPosIsWithinFace = this.isPosWithinFace(mesh, face);
            if (collisionPosIsWithinFace) {
                this.shapeCollidingAdd(face);
                var faceTriangles = face.triangles();
                for (var t = 0; t < faceTriangles.length; t++) {
                    var triangle = faceTriangles[t];
                    var collisionPosIsWithinTriangle = this.isPosWithinFace(mesh, triangle);
                    if (collisionPosIsWithinTriangle) {
                        this.shapeCollidingAdd(triangle);
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
            this.shapeCollidingAdd(plane);
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
            this.shapeCollidingAdd(sphere);
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
            var facePlane = face.plane();
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
