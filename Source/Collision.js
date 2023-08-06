
class Collision
{
	constructor()
	{
		this.pos = new Coords();
		this.distanceToCollision = null;
		this.colliders = [];
	}

	// instance methods

	rayAndFace(ray, mesh, face)
	{
		this.rayAndPlane
		(
			ray,
			face.plane
		);

		if (this.colliders["Plane"] != null)
		{
			if (this.isPosWithinFace(mesh, face) == false)
			{
				this.colliders["Face"] = null;
			}
			else
			{
				this.colliders["Face"] = face;
	
				for (var t = 0; t < face.triangles.length; t++)
				{
					var triangle = face.triangles[t];
					if (this.isPosWithinFace(mesh, triangle) == true)
					{
						this.colliders["Triangle"] = triangle;
						break;
					}
				}
			}
		}

		return this;
	}

	rayAndPlane(ray, plane)
	{
		this.distanceToCollision = 
			(
				plane.distanceFromOrigin 
				- plane.normal.dotProduct(ray.startPos)
			)
			/ plane.normal.dotProduct(ray.direction);

		if (this.distanceToCollision >= 0)
		{
			this.pos.overwriteWith
			(
				ray.direction
			).multiplyScalar
			(
				this.distanceToCollision
			).add
			(
				ray.startPos
			);

			this.colliders["Plane"] = plane;
		}

		return this;
	}

	rayAndSphere(ray, sphere)
	{
		var rayDirection = ray.direction;
		var displacementFromSphereCenterToCamera = ray.startPos.clone().subtract
		(
			sphere.centerPos
		);
		var sphereRadius = sphere.radius;
		var sphereRadiusSquared = sphereRadius * sphereRadius;

		var a = rayDirection.dotProduct(rayDirection);

		var b = 2 * rayDirection.dotProduct
		(
			displacementFromSphereCenterToCamera
		);

		var c = displacementFromSphereCenterToCamera.dotProduct
		(
			displacementFromSphereCenterToCamera
		) - sphereRadiusSquared;

		var discriminant = (b * b) - 4 * a * c;

		if (discriminant >= 0)
		{
			var rootOfDiscriminant = Math.sqrt(discriminant);

			var distanceToCollision1 = 
				(rootOfDiscriminant - b) 
				/ (2 * a);

			var distanceToCollision2 = 
				(0 - rootOfDiscriminant - b) 
				/ (2 * a);

			if (distanceToCollision1 >= 0)
			{
				if (distanceToCollision2 >= 0 && distanceToCollision2 < distanceToCollision1)
				{
					this.distanceToCollision = distanceToCollision2;
				}
				else
				{
					this.distanceToCollision = distanceToCollision1;
				}
			}
			else
			{
				this.distanceToCollision = distanceToCollision2;				
			}
	
			this.pos.overwriteWith
			(
				ray.direction
			).multiplyScalar
			(
				this.distanceToCollision
			).add
			(
				ray.startPos
			);

			this.colliders["Sphere"] = sphere;
		}

		return this;
	}

	isPosWithinFace(mesh, face)
	{
		var displacementFromVertex0ToCollision = new Coords();

		var isPosWithinAllEdgesOfFaceSoFar = true;

		var edges = face.edges;

		for (var i = 0; i < edges.length; i++)
		{
			var edge = edges[i];

			displacementFromVertex0ToCollision.overwriteWith
			(
				this.pos
			).subtract
			(
				edge.vertex(mesh, 0).pos
			);

			var edgeTransverse = edge.direction.clone().crossProduct
			(
				face.plane.normal
			);

			// hack?
			var epsilon = .01;

			if (displacementFromVertex0ToCollision.dotProduct(edgeTransverse) >= epsilon)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}	
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

}
