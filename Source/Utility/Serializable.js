"use strict";
class SerializableHelper {
    static objectOfTypeFromJson(objectType, objectAsJson) {
        var objectDeserialized = JSON.parse(objectAsJson);
        var objectWithTypes = SerializableHelper.typeSetOnObject(objectType, objectDeserialized);
        return objectWithTypes;
    }
    static temporaryFieldsRemoveFromObjectAndDescendants(objectToRemoveFrom, depth) {
        for (var fieldName in objectToRemoveFrom) {
            if (fieldName.startsWith("_")) {
                delete objectToRemoveFrom[fieldName];
            }
            else {
                var fieldValue = objectToRemoveFrom[fieldName];
                if (fieldValue != null) {
                    var fieldTypeName = fieldValue.constructor.name;
                    var fieldTypeIsPrimitive = (fieldTypeName == String.name);
                    if (fieldTypeIsPrimitive == false) {
                        SerializableHelper.temporaryFieldsRemoveFromObjectAndDescendants(fieldValue, depth + 1);
                    }
                }
            }
        }
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
