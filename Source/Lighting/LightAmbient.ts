
class LightAmbient
{
	intensity: number;

	constructor(intensity: number)
	{
		this.intensity = intensity;
	}

	intensityForCollisionNormalAndCamera
	(
		collision: Collision,
		normal: Coords,
		camera: Camera
	)
	{
		return this.intensity;
	}
}
