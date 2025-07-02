
class LightAmbient
{
	typeName: string; // For serialization.

	intensity: number;

	constructor(intensity: number)
	{
		this.typeName = LightAmbient.name;

		this.intensity = intensity;
	}

	static fromIntensity(intensity: number): LightAmbient
	{
		return new LightAmbient(intensity);
	}

	intensityForCollisionAndCamera
	(
		collision: Collision,
		camera: Camera,
		sceneRenderer: SceneRenderer,
		scene: Scene
	): number
	{
		return this.intensity;
	}
}
