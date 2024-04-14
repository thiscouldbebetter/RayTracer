
class Lighting implements Serializable<Lighting>
{
	lights: Light[];

	constructor(lights: Light[])
	{
		this.lights = lights;
	}

	static Temp: Coords = Coords.create();
	static Temp2: Coords = Coords.create();
	static Temp3: Coords = Coords.create();

	// Serializable.

	fromJson(objectAsJson: string): Lighting
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Lighting
	{
		this.lights.forEach(x => Object.setPrototypeOf(x, LightPoint.prototype) ); // hack
		return this;
	}

}
