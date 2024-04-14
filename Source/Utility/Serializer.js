"use strict";
class Serializer {
    constructor(typesToSerialize) {
        typesToSerialize = typesToSerialize || [];
        this.typesToSerializeByName = new Map([
            [Array.name, Array],
            [Boolean.name, Boolean],
            [Number.name, Number],
            [String.name, String]
        ]);
        typesToSerialize.forEach(
        // Not clear why it must be done this way
        // rather than passing an array of arrays
        // to the Map constructor, but that didn't work.
        x => this.typesToSerializeByName.set(x.name, x));
        this.fieldNameType = "_type";
        this.fieldToIgnorePrefix = "_";
        this.primitiveTypeNamesAsMap = new Map([
            Boolean.name,
            Number.name,
            String.name
        ].map(x => [x, x]));
    }
    deserialize(stringToDeserialize) {
        var objectDeserialized = JSON.parse(stringToDeserialize);
        this.typeAnnotationsAddOrRemoveOnObjectAndDescendants(objectDeserialized, false, // addRatherThanRemoveTypeAnnotations
        true // setPrototypesOnObjectsFromTypeField
        );
        return objectDeserialized;
    }
    serialize(objectToSerialize) {
        this.typeAnnotationsAddOrRemoveOnObjectAndDescendants(objectToSerialize, true, // addRatherThanRemoveTypeAnnotations
        false // setPrototypesOnObjectsFromTypeField
        );
        var objectSerialized = JSON.stringify(objectToSerialize, null, 4);
        this.typeAnnotationsAddOrRemoveOnObjectAndDescendants(objectToSerialize, false, // addRatherThanRemoveTypeAnnotations
        false // setPrototypesOnObjectsFromTypeField
        );
        return objectSerialized;
    }
    typeAnnotationsAddOrRemoveOnObjectAndDescendants(objectToAnnotate, addRatherThanRemoveTypeAnnotations, setPrototypesOnObjectsFromTypeField) {
        if (objectToAnnotate == null) {
            return;
        }
        var objectTypeName = (setPrototypesOnObjectsFromTypeField && objectToAnnotate[this.fieldNameType] != null)
            ? objectToAnnotate[this.fieldNameType]
            : objectToAnnotate.constructor.name;
        var objectWithTypeShouldBeAnnotated = this.typesToSerializeByName.size == 0
            || this.typesToSerializeByName.has(objectTypeName);
        if (objectWithTypeShouldBeAnnotated == false) {
            return;
        }
        var objectIsPrimitive = this.primitiveTypeNamesAsMap.has(objectTypeName);
        if (objectIsPrimitive == false) {
            var objectIsArray = (objectTypeName == Array.name);
            if (objectIsArray) {
                for (var i = 0; i < objectToAnnotate.length; i++) {
                    var element = objectToAnnotate[i];
                    this.typeAnnotationsAddOrRemoveOnObjectAndDescendants(element, addRatherThanRemoveTypeAnnotations, setPrototypesOnObjectsFromTypeField);
                }
            }
            else {
                // Object is reference type?  What about functions?
                var serializePrepare = objectToAnnotate.serializePrepare;
                if (serializePrepare != null) {
                    serializePrepare.call(objectToAnnotate);
                }
                if (addRatherThanRemoveTypeAnnotations) {
                    objectToAnnotate[this.fieldNameType] = objectTypeName;
                }
                else {
                    if (setPrototypesOnObjectsFromTypeField) {
                        objectTypeName = objectToAnnotate[this.fieldNameType];
                        var objectType = this.typesToSerializeByName.get(objectTypeName);
                        Object.setPrototypeOf(objectToAnnotate, objectType.prototype);
                    }
                    delete objectToAnnotate[this.fieldNameType];
                }
                for (var propertyName in objectToAnnotate) {
                    var propertyShouldBeAnnotated = (propertyName.startsWith(this.fieldToIgnorePrefix) == false);
                    if (propertyShouldBeAnnotated) {
                        var propertyValue = objectToAnnotate[propertyName];
                        this.typeAnnotationsAddOrRemoveOnObjectAndDescendants(propertyValue, addRatherThanRemoveTypeAnnotations, setPrototypesOnObjectsFromTypeField);
                    }
                }
            }
        }
    }
}
