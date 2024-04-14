
class Serializer
{
	typesToSerializeByName: Map<string, any>;

	fieldNameType: string;
	fieldToIgnorePrefix: string;
	primitiveTypeNamesAsMap: Map<string, string>;

	constructor(typesToSerialize: any[])
	{
		typesToSerialize = typesToSerialize || [];

		this.typesToSerializeByName = new Map<string, any>
		([
			[ Array.name, Array ],
			[ Boolean.name, Boolean ],
			[ Number.name, Number ],
			[ String.name, String ]
		]);

		typesToSerialize.forEach
		(
			// Not clear why it must be done this way
			// rather than passing an array of arrays
			// to the Map constructor, but that didn't work.
			x => this.typesToSerializeByName.set(x.name, x)
		);

		this.fieldNameType = "_type";

		this.fieldToIgnorePrefix = "_";

		this.primitiveTypeNamesAsMap = new Map<string, string>
		(
			[
				Boolean.name,
				Number.name,
				String.name
			].map(x => [x, x])
		);
	}

	deserialize(stringToDeserialize: string): any
	{
		var objectDeserialized =
			JSON.parse(stringToDeserialize);

		this.typeAnnotationsAddOrRemoveOnObjectAndDescendants
		(
			objectDeserialized,
			false, // addRatherThanRemoveTypeAnnotations
			true // setPrototypesOnObjectsFromTypeField
		);

		return objectDeserialized;
	}

	serialize(objectToSerialize: any): string
	{
		this.typeAnnotationsAddOrRemoveOnObjectAndDescendants
		(
			objectToSerialize,
			true, // addRatherThanRemoveTypeAnnotations
			false // setPrototypesOnObjectsFromTypeField
		);

		var objectSerialized =
			JSON.stringify(objectToSerialize, null, 4);

		this.typeAnnotationsAddOrRemoveOnObjectAndDescendants
		(
			objectToSerialize,
			false, // addRatherThanRemoveTypeAnnotations
			false // setPrototypesOnObjectsFromTypeField
		);

		return objectSerialized;
	}

	typeAnnotationsAddOrRemoveOnObjectAndDescendants
	(
		objectToAnnotate: any,
		addRatherThanRemoveTypeAnnotations: boolean,
		setPrototypesOnObjectsFromTypeField: boolean
	): void
	{
		if (objectToAnnotate == null)
		{
			return;
		}

		var objectTypeName =
			(setPrototypesOnObjectsFromTypeField && objectToAnnotate[this.fieldNameType] != null)
			? objectToAnnotate[this.fieldNameType]
			: objectToAnnotate.constructor.name;

		var objectWithTypeShouldBeAnnotated =
			this.typesToSerializeByName.size == 0
			|| this.typesToSerializeByName.has(objectTypeName);

		if (objectWithTypeShouldBeAnnotated == false)
		{
			return;
		}

		var objectIsPrimitive =
			this.primitiveTypeNamesAsMap.has(objectTypeName);

		if (objectIsPrimitive == false)
		{
			var objectIsArray = (objectTypeName == Array.name);

			if (objectIsArray)
			{
				for (var i = 0; i < objectToAnnotate.length; i++)
				{
					var element = objectToAnnotate[i];

					this.typeAnnotationsAddOrRemoveOnObjectAndDescendants
					(
						element,
						addRatherThanRemoveTypeAnnotations,
						setPrototypesOnObjectsFromTypeField
					);
				}
			}
			else
			{
				// Object is reference type?  What about functions?

				var serializePrepare = objectToAnnotate.serializePrepare;
				if (serializePrepare != null)
				{
					serializePrepare.call(objectToAnnotate);
				}

				if (addRatherThanRemoveTypeAnnotations)
				{
					objectToAnnotate[this.fieldNameType] = objectTypeName;
				}
				else
				{
					if (setPrototypesOnObjectsFromTypeField)
					{
						objectTypeName = objectToAnnotate[this.fieldNameType];
						var objectType = this.typesToSerializeByName.get(objectTypeName);
						Object.setPrototypeOf(objectToAnnotate, objectType.prototype);
					}

					delete objectToAnnotate[this.fieldNameType];
				}

				for (var propertyName in objectToAnnotate)
				{
					var propertyShouldBeAnnotated =
						(propertyName.startsWith(this.fieldToIgnorePrefix) == false);

					if (propertyShouldBeAnnotated)
					{
						var propertyValue = objectToAnnotate[propertyName];

						this.typeAnnotationsAddOrRemoveOnObjectAndDescendants
						(
							propertyValue,
							addRatherThanRemoveTypeAnnotations,
							setPrototypesOnObjectsFromTypeField
						);
					}
				}
			}
		}
	}
}