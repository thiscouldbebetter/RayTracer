
class Face
{
	constructor
	(
		materialName, vertexIndices, textureUVsForVertices, normalsForVertices
	)
	{
		this.materialName = materialName;
		this.vertexIndices = vertexIndices;
		this.textureUVsForVertices = textureUVsForVertices;
		this.normalsForVertices = normalsForVertices;

		this.DisplacementFromVertexNextToPos = new Coords();
		this.TexelColor = Color.blank();
		this.VertexValueInterpolated = new Coords();
		this.VertexValueWeighted = new Coords();
	}

	buildTriangles(mesh)
	{
		// instance variables

		if (this.vertexIndices.length == 3)
		{
			this.triangles = [ this ];
		}
		else if (this.vertexIndices.length == 4)
		{
			this.triangles = 
			[
				this.buildTriangle(0, 1, 2).recalculateDerivedValues(mesh),
				this.buildTriangle(2, 3, 0).recalculateDerivedValues(mesh),
			];
		}
		else
		{
			var errorMessage = "A Face may only have 3 or 4 vertices.";
			throw errorMessage;
		}
	}

	buildTriangle(vertexIndexIndex0, vertexIndexIndex1, vertexIndexIndex2)
	{
		var vertexIndex0 = this.vertexIndices[vertexIndexIndex0];
		var vertexIndex1 = this.vertexIndices[vertexIndexIndex1];
		var vertexIndex2 = this.vertexIndices[vertexIndexIndex2];
		
		var returnValue = new Face
		(
			this.materialName, 
			[
				vertexIndex0,
				vertexIndex1,
				vertexIndex2,
			],
			(
				this.textureUVsForVertices == null
				? null
				:
				[
					this.textureUVsForVertices[vertexIndexIndex0],
					this.textureUVsForVertices[vertexIndexIndex1],
					this.textureUVsForVertices[vertexIndexIndex2],
				]
			),
			(
				this.normalsForVertices == null 
				? null
				:
				[
					this.normalsForVertices[vertexIndexIndex0],
					this.normalsForVertices[vertexIndexIndex1],
					this.normalsForVertices[vertexIndexIndex2],
				]
			)
		);

		return returnValue;
	}

	interpolateVertexValuesWeighted(vertexValues, weights)
	{
		var valueInterpolated = this.VertexValueInterpolated.overwriteWith
		(
			vertexValues[0]
		).multiplyScalar
		(
			weights[0]
		);

		var vertexValueWeighted = this.VertexValueWeighted;

		for (var i = 1; i < vertexValues.length; i++)
		{
			vertexValueWeighted.overwriteWith
			(
				vertexValues[i]
			).multiplyScalar
			(
				weights[i]
			);

			valueInterpolated.add(vertexValueWeighted);
		}

		return valueInterpolated;
	}

	material(scene)
	{
		return scene.materialByName(this.materialName);
	}

	normalForVertexWeights(vertexWeights)
	{
		var returnValue;

		if (this.normalsForVertices == null)
		{
			returnValue = this.plane.normal;
		}
		else
		{
			returnValue = this.interpolateVertexValuesForWeights
			(
				this.normalsForVertices,
				vertexWeights
			);
		}
		
		return returnValue;	
	}

	recalculateDerivedValues(mesh)
	{
		if (this.normalsForVertices != null)
		{
			for (var i = 0; i < this.normalsForVertices.length; i++)
			{
				var normalForVertex = normalsForVertices[i];
				normalForVertex.normalize();
			}
		}

		var vertices = this.vertices(mesh);

		if (this.plane == null)
		{
			this.plane = new Plane
			(
				Vertex.positionsForMany(vertices)
			);
		}
		else
		{
			this.plane.recalculateDerivedValues();
		}


		if (this.triangles == null)
		{	
			this.buildTriangles(mesh);
		}
		else
		{
			if (this.triangles.length > 1)
			{
				for (var t = 0; t < this.triangles.length; t++)
				{
					var triangle = this.triangles[t];
					triangle.recalculateDerivedValues(mesh);
				}
			}
		}

		if (this.edges == null)
		{
			this.edges = [];

			for (var i = 0; i < this.vertexIndices.length; i++)
			{
				var iNext = NumberHelper.wrapValueToRange
				(
					i + 1, this.vertexIndices.length
				);

				var vertexIndex = this.vertexIndices[i];
				var vertexIndexNext = this.vertexIndices[iNext];

				var edge = new Edge([vertexIndex, vertexIndexNext]);
				
				this.edges.push(edge);
			}

		}

		for (var i = 0; i < this.edges.length; i++)
		{
			this.edges[i].recalculateDerivedValues(mesh, this);
		}

		return this;
	}

	texelColorForVertexWeights(texture, vertexWeights)
	{
		var texelUV = this.interpolateVertexValuesWeighted
		(
			this.textureUVsForVertices,
			vertexWeights
		);

		var texelColor = this.TexelColor;

		texture.colorSetFromUV(texelColor, texelUV);

		return texelColor;
	}

	vertexWeightsAtSurfacePosAddToList(mesh, surfacePos, weights)
	{
		var vertices = this.vertices(mesh);
		
		var edges = this.edges;

		var areaOfFace = edges[1].displacement.clone().crossProduct
		(
			edges[0].displacement
		).magnitude() / 2;

		var displacementFromVertexNextToPos =
			this.DisplacementFromVertexNextToPos;

		for (var i = 0; i < vertices.length; i++)
		{
			var iNext = NumberHelper.wrapValueToRange(i + 1, vertices.length);

			var vertex = vertices[i];
			var vertexNext = vertices[iNext];

			displacementFromVertexNextToPos.overwriteWith
			(
				surfacePos
			).subtract
			(
				vertexNext.pos
			);

			var displacementOfEdgeNext = edges[iNext].displacement;

			var areaOfTriangleFormedByEdgeNextAndPos = displacementOfEdgeNext.clone().crossProduct
			(
				displacementFromVertexNextToPos
			).magnitude() / 2;

			var weightOfVertex = 
				areaOfTriangleFormedByEdgeNextAndPos
				/ areaOfFace;
			
			weights[i] = weightOfVertex;
		}

		return weights;
	}

	vertex(mesh, vertexIndexIndex)
	{
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}

	vertices(mesh)
	{
		var returnValues = [];

		for (var i = 0; i < this.vertexIndices.length; i++)
		{
			var vertexIndex = this.vertexIndices[i];
			var vertex = mesh.vertices[vertexIndex];
			returnValues.push(vertex);
		}

		return returnValues;
	}

	// cloneable

	clone()
	{
		// todo - Deep clone.
		return new Face
		(
			this.materialName, 
			this.vertexIndices, 
			this.textureUVsForVertices, 
			this.normalsForVertices
		);
	}

	// strings

	toString(mesh)
	{
		var returnValue = this.vertices(mesh).join("->");
		return returnValue;
	}

}
