
class LightAmbient
{
	typeName: string; // For serialization.

	intensity: number;

	constructor(intensity: number)
	{
		this.typeName = LightAmbient.name;

		this.intensity = intensity;
	}

	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera
	): number
	{
		return this.intensity;
	}
}
