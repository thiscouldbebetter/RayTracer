
class Collision
{
	pos: Coords;
	distanceToCollision: number;
	shapesColliding: Shape[];

	surfaceMaterial: Material;
	surfaceNormal: Coords;
	surfaceColor: Color;

	deactivated: boolean;

	_shapesCollidingByName: Map<string, Shape>;

	constructor()
	{
		this.pos = Coords.create();
		this.distanceToCollision = null;
		this.shapesColliding = [];

		this.surfaceMaterial = Material.fromName(Collision.name);
		this.surfaceNormal = Coords.create();
		this.surfaceColor = Color.create();

		this.deactivated = false;
	}

	static closestOfActivated(collisions: Collision[]): Collision
	{
		var collisionClosest = null;

		if (collisions.length > 0)
		{
			var collision0 = collisions[0];

			if (collision0.deactivated == false)
			{
				collisionClosest = collision0;

				for (var c = 1; c < collisions.length; c++)
				{
					var collision = collisions[c];

					if (collision.deactivated)
					{
						break;
					}
					else
					{
						var collisionIsClosestSoFar =
							collision.distanceToCollision
							< collisionClosest.distanceToCollision;

						if (collisionIsClosestSoFar)
						{
							collisionClosest = collision;
						}
					}
				}
			}
		}

		return collisionClosest;
	}

	activate(): Collision
	{
		this.deactivated = false;
		return this;
	}

	deactivate(): Collision
	{
		this.deactivated = true;
		return this;
	}

	// Clonable.

	clone(): Collision
	{
		var collisionCloned = new Collision().overwriteWith(this);
		return collisionCloned;
	}

	overwriteWith(other: Collision): Collision
	{
		this.pos.overwriteWith(other.pos);
		this.distanceToCollision = other.distanceToCollision;
		this.shapesColliding.length = other.shapesColliding.length;
		for (var s = 0; s < other.shapesColliding.length; s++)
		{
			this.shapesColliding[s] = other.shapesColliding[s];
		}
		this.surfaceMaterial.overwriteWith(other.surfaceMaterial);
		this.surfaceNormal.overwriteWith(other.surfaceNormal);
		this.surfaceColor.overwriteWith(other.surfaceColor);

		this._shapesCollidingByName = null;

		return this;
	}

	shapeCollidingAdd(shape: Shape): Collision
	{
		this.shapesColliding.push(shape);
		var shapeTypeName = shape.constructor.name;
		this.shapesCollidingByName().set(shapeTypeName, shape);
		return this;
	}

	shapeCollidingFinal(): Shape
	{
		return this.shapesColliding[this.shapesColliding.length - 1];
	}

	shapeCollidingFirst(): Shape
	{
		return this.shapesColliding[0];
	}

	shapeCollidingWithName(name: string): Shape
	{
		return this.shapesCollidingByName().get(name);
	}

	shapesCollidingByName(): Map<string, Shape>
	{
		if (this._shapesCollidingByName == null)
		{
			this._shapesCollidingByName =
				new Map<string, Shape>
				(
					this.shapesColliding
						.map(x => [x.constructor.name, x])
				);
		}
		return this._shapesCollidingByName;
	}

	shapesCollidingByNameReset(): Collision
	{
		this._shapesCollidingByName = null;
		return this;
	}

	rayAndFace(ray: Ray, mesh: Mesh, face: Face): Collision
	{
		var plane = face.plane();
		this.rayAndPlane(ray, plane);

		var colliderPlane = this.shapeCollidingWithName(Plane.name);
		if (colliderPlane != null)
		{
			var collisionPosIsWithinFace =
				this.isPosWithinFace(mesh, face);
			if (collisionPosIsWithinFace)
			{
				this.shapeCollidingAdd(face);

				var faceTriangles = face.triangles();

				for (var t = 0; t < faceTriangles.length; t++)
				{
					var triangle = faceTriangles[t];
					var collisionPosIsWithinTriangle =
						this.isPosWithinFace(mesh, triangle);
					if (collisionPosIsWithinTriangle)
					{
						this.shapeCollidingAdd(triangle);
						break;
					}
				}
			}
		}

		return this;
	}

	rayAndPlane(ray: Ray, plane: Plane): Collision
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

			this.shapeCollidingAdd(plane);
		}

		return this;
	}

	rayAndSphere(ray: Ray, sphere: Sphere): Collision
	{
		var rayDirection = ray.direction;

		var displacementFromSphereCenterToCamera =
			ray.startPos
				.clone()
				.subtract(sphere.disp.pos);

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
				if
				(
					distanceToCollision2 >= 0
					&& distanceToCollision2 < distanceToCollision1
				)
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

			this.shapeCollidingAdd(sphere);
		}

		return this;
	}

	isPosWithinFace(mesh: Mesh, face: Face): boolean
	{
		var displacementFromVertex0ToCollision = Coords.create();

		var isPosWithinAllEdgesOfFaceSoFar = true;

		var edges = face.edges();

		for (var i = 0; i < edges.length; i++)
		{
			var edge = edges[i];

			var edgeVertex0 = edge.vertex(mesh, 0);

			displacementFromVertex0ToCollision
				.overwriteWith(this.pos)
				.subtract(edgeVertex0.pos);

			var facePlane = face.plane();

			var edgeDirection = edge.direction(mesh);

			var edgeTransverse =
				edgeDirection
					.clone()
					.crossProduct(facePlane.normal);

			// hack?
			var epsilon = .01;

			var displacementDotEdgeTransverse =
				displacementFromVertex0ToCollision.dotProduct(edgeTransverse);

			if (displacementDotEdgeTransverse >= epsilon)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

}
