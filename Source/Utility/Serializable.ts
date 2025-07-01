
interface Serializable<T>
{
	fromJson(objectAsJson: string): T;
	prototypesSet(): T;
	toJson(): string;
	toObjectSerializable(): any;
}

class SerializableHelper
{
	static objectOfTypeFromJson(objectType: any, objectAsJson: string): any
	{
		var objectDeserialized = JSON.parse(objectAsJson);
		var objectWithTypes =
			SerializableHelper.typeSetOnObject(objectType, objectDeserialized);
		return objectWithTypes;
	}

	static temporaryFieldsRemoveFromObjectAndDescendants
	(
		objectToRemoveFrom: any, depth: number
	): void
	{
		for (var fieldName in objectToRemoveFrom)
		{
			if (fieldName.startsWith("_") )
			{
				delete objectToRemoveFrom[fieldName];
			}
			else
			{
				var fieldValue = objectToRemoveFrom[fieldName];
				if (fieldValue != null)
				{
					var fieldTypeName = fieldValue.constructor.name;
					var fieldTypeIsPrimitive = (fieldTypeName == String.name);
					if (fieldTypeIsPrimitive == false)
					{
						SerializableHelper.temporaryFieldsRemoveFromObjectAndDescendants
						(
							fieldValue, depth + 1
						);
					}
				}
			}
		}
	}

	static typeSetOnObject(objectType: any, objectToSetTypesOn: Serializable<any>): any
	{
		var returnValue: any = null;

		if (objectToSetTypesOn != null)
		{
			Object.setPrototypeOf(objectToSetTypesOn, objectType.prototype);
			var objectWithTypes = objectToSetTypesOn.prototypesSet();
			returnValue = objectWithTypes;
		}

		return returnValue;
	}

	static typeSetOnObjectFromTypeArray
	(
		objectToSetTypeOn: any,
		typesToChooseFrom: any[]
	): any
	{
		var typeName = objectToSetTypeOn.typeName;

		var typeToSet = typesToChooseFrom.find(x => x.name == typeName);

		if (typeToSet == null)
		{
			throw new Error("Unexpected type: " + typeName + ".");
		}
		else
		{
			SerializableHelper.typeSetOnObject(typeToSet, objectToSetTypeOn);
		}

		return objectToSetTypeOn;
	}
}