
class LightPoint
{
	intensity: number;
	pos: Coords;

	constructor(intensity: number, pos: Coords)
	{
		this.intensity = intensity;
		this.pos = pos;
	}

	intensityForCollisionMaterialNormalAndCamera
	(
		collision: Collision,
		material: Material,
		normal: Coords,
		camera: Camera
	): number
	{
		var displacementFromObjectToLight = Lighting.Temp;

		displacementFromObjectToLight.overwriteWith
		(
			this.pos
		).subtract
		(
			collision.pos
		);

		var distanceFromLightToObject =
			displacementFromObjectToLight.magnitude();
		var distanceFromLightToObjectSquared = Math.pow
		(
			distanceFromLightToObject, 2
		);

		var surfaceNormal = Lighting.Temp2.overwriteWith(normal);

		var directionFromObjectToLight =
			displacementFromObjectToLight.normalize();

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
				* this.intensity
				/ distanceFromLightToObjectSquared;

			var directionOfReflection = 
				surfaceNormal.multiplyScalar
				(
					2 * directionFromObjectToLightDotSurfaceNormal
				).subtract
				(
					directionFromObjectToLight
				);

			var directionFromObjectToViewer = Lighting.Temp3.overwriteWith
			(
				camera.pos
			).subtract
			(
				collision.pos
			).normalize();
	
			var specularComponent = 
				material.specular
				* Math.pow
				(
					directionOfReflection.dotProduct(directionFromObjectToViewer),
					material.shininess
				)
				* this.intensity
				/ distanceFromLightToObjectSquared;

			returnValue = diffuseComponent + specularComponent;
		}

		return returnValue;
	}
}
