"use strict";
class SerializableHelper {
    static objectOfTypeFromJson(objectType, objectAsJson) {
        var objectDeserialized = JSON.parse(objectAsJson);
        var objectWithTypes = SerializableHelper.typeSetOnObject(objectType, objectDeserialized);
        return objectWithTypes;
    }
    static typeSetOnObject(objectType, objectToSetTypesOn) {
        var returnValue = null;
        if (objectToSetTypesOn != null) {
            Object.setPrototypeOf(objectToSetTypesOn, objectType.prototype);
            var objectWithTypes = objectToSetTypesOn.prototypesSet();
            returnValue = objectWithTypes;
        }
        return returnValue;
    }
    static typeSetOnObjectFromTypeArray(objectToSetTypeOn, typesToChooseFrom) {
        var typeName = objectToSetTypeOn.typeName;
        var typeToSet = typesToChooseFrom.find(x => x.name == typeName);
        if (typeToSet == null) {
            throw new Error("Unexpected type: " + typeName + ".");
        }
        else {
            SerializableHelper.typeSetOnObject(typeToSet, objectToSetTypeOn);
        }
        return objectToSetTypeOn;
    }
}
