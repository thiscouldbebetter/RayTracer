
class LightDirectional
{
	intensity: number;
	orientation: Orientation;

	constructor(intensity: number, orientation: Orientation)
	{
		this.intensity = intensity;
		this.orientation = orientation;
	}

	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera
	): number
	{
		return 0; // todo
	}
}
