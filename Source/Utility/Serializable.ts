
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
		Object.setPrototypeOf(objectToSetTypesOn, objectType.prototype);
		var objectWithTypes = objectToSetTypesOn.prototypesSet();
		return objectWithTypes;
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