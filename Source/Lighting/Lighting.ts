
class Lighting implements Serializable<Lighting>
{
	lights: Light[];

	constructor(lights: Light[])
	{
		this.lights = lights;
	}

	static fromLights(lights: Light[]): Lighting
	{
		return new Lighting(lights);
	}

	// Serializable.

	fromJson(objectAsJson: string): Lighting
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Lighting
	{
		this.lights.forEach
		(
			x =>
			{
				var prototypeToSet =
					x.typeName == LightAmbient.name
					? LightAmbient.prototype
					: x.typeName == LightDirectional.name
					? LightDirectional.prototype
					: x.typeName == LightPoint.name
					? LightPoint.prototype
					: null;

				if (prototypeToSet == null)
				{
					throw new Error("Unrecognized Light type.");
				}

				Object.setPrototypeOf(x, prototypeToSet);
			}
		); // hack
		return this;
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	toObjectSerializable(): any
	{
		return this;
	}

}
