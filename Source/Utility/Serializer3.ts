
class Serializer
{
	deserializeJsonToObjectOfType(objectAsJson: string, objectType: any): any
	{
		var objectDeserialized = JSON.parse(objectAsJson);

		for (var fieldName in objectDeserialized)
		{
			console.log("field is " + fieldName);
		}

		return objectDeserialized;
	}

	serializeObjectToJson(objectToSerialize: any): string
	{
		var objectAsJson = JSON.stringify(objectToSerialize, null, 4);

		return objectAsJson;
	}
}