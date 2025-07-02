
class LightDirectional
{
	typeName: string; // For serialization.

	intensity: number;
	direction: Coords;

	_directionFromObjectToViewer: Coords;
	_directionInverted: Coords;

	constructor(intensity: number, direction: Coords)
	{
		this.typeName = LightDirectional.name;

		this.intensity = intensity;
		this.direction = direction.normalize();
	}

	static fromIntensityAndDirection
	(
		intensity: number, direction: Coords
	): LightDirectional
	{
		return new LightDirectional(intensity, direction);
	}

	intensityForCollisionAndCamera
	(
		collision: Collision,
		camera: Camera,
		sceneRenderer: SceneRenderer,
		scene: Scene
	): number
	{
		var returnValue = 0;

		this.temporaryVariablesInitializeIfNecessary();

		var surfaceNormal = collision.surfaceNormal;

		var directionFromObjectToLight =
			this._directionInverted
				.overwriteWith(this.direction)
				.invert();

		var directionFromObjectToLightDotSurfaceNormal =
			directionFromObjectToLight
				.dotProduct(surfaceNormal);

		var intensityAdjusted = this.intensity;

		returnValue = Lighting.intensityForCollisionAndCamera
		(
			collision,
			camera,
			sceneRenderer,
			scene,
			directionFromObjectToLight,
			directionFromObjectToLightDotSurfaceNormal,
			intensityAdjusted
		);

		return returnValue;
	}

	temporaryVariablesInitializeIfNecessary(): void
	{
		if (this._directionFromObjectToViewer == null)
		{
			this._directionFromObjectToViewer = Coords.create();
		}

		if (this._directionInverted == null)
		{
			this._directionInverted = Coords.create();
		}
	}
}
