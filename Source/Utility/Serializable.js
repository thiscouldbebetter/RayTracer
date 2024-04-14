"use strict";
class SerializableHelper {
    static objectOfTypeFromJson(objectType, objectAsJson) {
        var objectDeserialized = JSON.parse(objectAsJson);
        var objectWithTypes = SerializableHelper.typeSetOnObject(objectType, objectDeserialized);
        return objectWithTypes;
    }
    static typeSetOnObject(objectType, objectToSetTypesOn) {
        Object.setPrototypeOf(objectToSetTypesOn, objectType.prototype);
        var objectWithTypes = objectToSetTypesOn.prototypesSet();
        return objectWithTypes;
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
