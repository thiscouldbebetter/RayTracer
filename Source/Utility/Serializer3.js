"use strict";
class Serializer {
    deserializeJsonToObjectOfType(objectAsJson, objectType) {
        var objectDeserialized = JSON.parse(objectAsJson);
        for (var fieldName in objectDeserialized) {
            console.log("field is " + fieldName);
        }
        return objectDeserialized;
    }
    serializeObjectToJson(objectToSerialize) {
        var objectAsJson = JSON.stringify(objectToSerialize, null, 4);
        return objectAsJson;
    }
}
