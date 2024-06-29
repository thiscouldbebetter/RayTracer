
class LightDirectional
{
	typeName: string; // For serialization.

	intensity: number;
	direction: Coords;

	_directionFromObjectToViewer: Coords;
	_directionInverted: Coords;
	_surfaceNormal: Coords;

	constructor(intensity: number, direction: Coords)
	{
		this.typeName = LightDirectional.name;

		this.intensity = intensity;
		this.direction = direction.normalize();
	}

	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera
	): number
	{
		this.temporaryVariablesInitializeIfNecessary();

		var surfaceNormal = this._surfaceNormal.overwriteWith(normal);

		var directionFromObjectToLight =
			this._directionInverted.overwriteWith(this.direction).invert();

		var directionFromObjectToLightDotSurfaceNormal =
			directionFromObjectToLight.dotProduct
			(
				surfaceNormal
			);

		var returnValue = 0;

		if (directionFromObjectToLightDotSurfaceNormal > 0)
		{
			var diffuseComponent = 
				material.diffuse
				* directionFromObjectToLightDotSurfaceNormal
				* this.intensity;

			var directionOfReflection = 
				surfaceNormal.multiplyScalar
				(
					2 * directionFromObjectToLightDotSurfaceNormal
				).subtract
				(
					directionFromObjectToLight
				);

			var directionFromObjectToViewer =
				this._directionFromObjectToViewer
					.overwriteWith(camera.pos)
					.subtract(collision.pos)
					.normalize();

			var specularComponent = 
				material.specular
				* Math.pow
				(
					directionOfReflection.dotProduct(directionFromObjectToViewer),
					material.shininess
				)
				* this.intensity;

			returnValue = diffuseComponent + specularComponent;
		}

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

		if (this._surfaceNormal == null)
		{
			this._surfaceNormal = Coords.create();
		}
	}
}
