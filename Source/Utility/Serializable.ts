
interface Serializable<T>
{
	toJson(): string;
	fromJson(objectAsJson: string): T;
	prototypesSet(): T;
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