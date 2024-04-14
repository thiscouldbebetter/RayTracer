
class Lighting
{
	lights: Light[];

	constructor(lights: Light[])
	{
		this.lights = lights;
	}

	static Temp: Coords = Coords.create();
	static Temp2: Coords = Coords.create();
	static Temp3: Coords = Coords.create();
}
