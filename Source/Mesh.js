
class Mesh
{
	constructor
	(
		name, 
		vertices, 
		faces
	)
	{
		this.name = name;
		this.vertices = vertices;
		this.faces = faces;
		this.recalculateDerivedValues();

		this.VertexWeightsAtSurfacePos = [];
	}

	// constants

	static VerticesInATriangle = 3;

	// methods

	clone()
	{
		var returnValue = new Mesh
		(
			this.name,
			Cloneable.cloneMany(this.vertices), 
			Cloneable.cloneMany(this.faces)
		);

		return returnValue;
	}

	overwriteWith(other)
	{
		Cloneable.overwriteManyWithOthers(this.vertices, other.vertices);
	}

	recalculateDerivedValues()
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			face.recalculateDerivedValues(mesh);
		}
	}

	// collidable

	addCollisionsWithRayToList(ray, listToAddTo)
	{	
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
	
			if (face.plane.normal.dotProduct(ray.direction) < 0)
			{
				var collision = new Collision().rayAndFace
				(
					ray,
					this, // mesh
					face
				);

				if (collision.colliders["Face"] != null)
				{
					collision.colliders["Collidable"] = this;
					listToAddTo.push(collision);
				}
			}
		}

		return listToAddTo;
	}

	recalculateDerivedValues()
	{
		for (var f = 0; f < this.faces.length; f++)
		{
			var face = this.faces[f];
			face.recalculateDerivedValues(this);
		}
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
		var face = collisionClosest.colliders["Triangle"];
		var surfacePos = collisionClosest.pos;

		var vertexWeightsAtSurfacePos = face.vertexWeightsAtSurfacePosAddToList
		(
			this, // mesh
			surfacePos,
			this.VertexWeightsAtSurfacePos
		);

		surfaceMaterial.overwriteWith(face.material(scene));

		if (surfaceMaterial.texture == null)
		{
			surfaceColor.overwriteWith
			(
				surfaceMaterial.color
			);
		}
		else
		{
			var texelColor = face.texelColorForVertexWeights
			(
				surfaceMaterial.texture, 
				vertexWeightsAtSurfacePos
			);

			if (texelColor != null)
			{
				surfaceColor.overwriteWith(texelColor);
			}
		}

		surfaceNormal.overwriteWith
		(
			face.normalForVertexWeights
			(
				vertexWeightsAtSurfacePos
			)
		); 

		return surfaceColor;
	}
}
