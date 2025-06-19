"use strict";
class ShapeHelper {
    static typeSetOnShape(objectToSetTypeOn) {
        return SerializableHelper.typeSetOnObjectFromTypeArray(objectToSetTypeOn, [Mesh, Sphere]);
    }
}
