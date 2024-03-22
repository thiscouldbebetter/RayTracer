
class Sphere
{
	constructor(name, materialName, radius, centerPos, orientation)
	{
		this.name = name;
		this.materialName = materialName;
		this.radius = radius;
		this.centerPos = centerPos;
		this.orientation = orientation;

		this.TexelUV = new Coords();
	}

	// collidable

	addCollisionsWithRayToList(ray, listToAddTo)
	{
		var collision = new Collision().rayAndSphere
		(
			ray,
			this
		);

		if (collision.colliders["Sphere"] != null)
		{
			collision.colliders["Collidable"] = this;
			listToAddTo.push(collision);
		}

		return listToAddTo;
	}

	material(scene)
	{
		return scene.materialByName(this.materialName);
	}

	surfaceMaterialColorAndNormalForCollision
	(
		scene, 
		collisionClosest,
		surfaceMaterial,
		surfaceColor,
		surfaceNormal
	)
	{
		var sphere = collisionClosest.colliders["Sphere"];
		var surfacePos = collisionClosest.pos;
		surfaceMaterial.overwriteWith(sphere.material(scene));

		surfaceNormal.overwriteWith
		(
			surfacePos
		).subtract
		(
			sphere.centerPos
		).normalize();

		if (surfaceMaterial.texture == null)
		{
			surfaceColor.overwriteWith
			(
				surfaceMaterial.color
			);
		}
		else
		{
			var surfaceNormalInLocalCoords = new TransformOrient
			(
				this.orientation
			).transformCoords
			(
				surfaceNormal.clone()
			);

			var surfaceNormalInLocalCoordsAsPolar = new Polar().fromCoords
			(
				surfaceNormalInLocalCoords
			);

			var texelUV = this.TexelUV;
			texelUV.overwriteWithXYZ
			(
				surfaceNormalInLocalCoordsAsPolar.azimuth,
				(1 + surfaceNormalInLocalCoordsAsPolar.elevation) / 2
			); // todo

			surfaceMaterial.texture.colorSetFromUV
			(
				surfaceColor,
				texelUV
			);
		}

		return surfaceColor;
	}
}
