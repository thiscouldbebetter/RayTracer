
class LightPoint
{
	typeName: string; // For serialization.

	intensity: number;
	pos: Coords;

	_directionFromObjectToViewer: Coords;
	_directionOfReflection: Coords;
	_displacementFromObjectToLight: Coords;

	constructor(intensity: number, pos: Coords)
	{
		this.typeName = LightPoint.name;

		this.intensity = intensity;
		this.pos = pos;
	}

	static fromIntensityAndPos(intensity: number, pos: Coords): LightPoint
	{
		return new LightPoint(intensity, pos);
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

		var displacementFromObjectToLight =
			this._displacementFromObjectToLight
				.overwriteWith(this.pos)
				.subtract(collision.pos);

		var distanceFromLightToObject =
			displacementFromObjectToLight.magnitude();
		var distanceFromLightToObjectSquared =
			Math.pow(distanceFromLightToObject, 2);

		var directionFromObjectToLight =
			displacementFromObjectToLight.normalize();

		var directionFromObjectToLightDotSurfaceNormal =
			directionFromObjectToLight
				.dotProduct(collision.surfaceNormal);

		var intensityAdjusted =
			this.intensity / distanceFromLightToObjectSquared;

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
		if (this._displacementFromObjectToLight == null)
		{
			this._displacementFromObjectToLight = Coords.create();
		}
	}
}
