
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

	// Helpers.

	static intensityForCollisionAndCamera
	(
		collision: Collision,
		camera: Camera,
		sceneRenderer: SceneRenderer,
		scene: Scene,
		directionFromObjectToLight: Coords,
		directionFromObjectToLightDotSurfaceNormal: number,
		intensityAdjusted: number
	): number
	{
		var returnValue = 0;

		if (directionFromObjectToLightDotSurfaceNormal > 0)
		{
			var objectIsLitByThisLight = false;

			if (sceneRenderer.shadowsAreEnabled)
			{
				var rayFromObjectToBeLitToLight =
					Ray.fromStartPosAndDirection
					(
						collision.pos,
						directionFromObjectToLight
					);

				var collisionsBlockingLight = 
					scene.collisionsOfRayWithObjectsMinusExceptionAddToList
					(
						rayFromObjectToBeLitToLight,
						collision.shapeCollidingFirst(), // objectToExcept
						[]
					);

				objectIsLitByThisLight =
					(collisionsBlockingLight.length == 0);
			}

			returnValue = Lighting.intensityForCollisionAndCamera_2
			(
				objectIsLitByThisLight,
				camera,
				collision,
				directionFromObjectToLight,
				directionFromObjectToLightDotSurfaceNormal,
				intensityAdjusted
			);
		}

		return returnValue;
	}

	static _directionFromObjectToViewer: Coords = Coords.create();

	static intensityForCollisionAndCamera_2
	(
		objectIsLitByThisLight: boolean,
		camera: Camera,
		collision: Collision,
		directionFromObjectToLight: Coords,
		directionFromObjectToLightDotSurfaceNormal: number,
		intensityAdjusted: number
	): number
	{
		var returnValue = 0;

		if (objectIsLitByThisLight)
		{
			var material = collision.surfaceMaterial;
			var materialOptics = material.optics;

			var diffuseComponent = 
				materialOptics.diffuse
				* directionFromObjectToLightDotSurfaceNormal
				* intensityAdjusted;

			var surfaceNormal = collision.surfaceNormal;

			var directionOfReflection = 
				this._directionOfReflection
					.overwriteWith(surfaceNormal)
					.multiplyScalar(2 * directionFromObjectToLightDotSurfaceNormal)
					.subtract(directionFromObjectToLight);

			var directionFromObjectToViewer =
				this._directionFromObjectToViewer
					.overwriteWith(camera.pos)
					.subtract(collision.pos)
					.normalize();

			var specularComponent = 
				materialOptics.specular
				* Math.pow
				(
					directionOfReflection.dotProduct(directionFromObjectToViewer),
					materialOptics.shininess
				)
				* intensityAdjusted;

			returnValue = diffuseComponent + specularComponent;
		}

		return returnValue;
	}

	static _directionOfReflection: Coords = Coords.create();
}
