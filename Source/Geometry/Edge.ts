
class Edge implements Serializable<Edge>
{
	vertexIndices: number[];

	constructor(vertexIndices: number[])
	{
		this.vertexIndices = vertexIndices;
	}

	static fromVertexIndices(vertexIndices: number[]): Edge
	{
		return new Edge(vertexIndices);
	}

	static fromVertexIndexPair
	(
		vertexIndex0: number, vertexIndex1: number
	): Edge
	{
		return new Edge( [vertexIndex0, vertexIndex1] );
	}

	recalculateDerivedValues(): void
	{
		this._vertices = null;
		this._displacement = null;
		this._direction = null;
		this._transverse = null;
	}

	vertex(mesh: Mesh, vertexIndexIndex: number): Vertex
	{
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}

	// Serializable.

	fromJson(objectAsJson: string): Edge
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Edge
	{
		return this;
	}

	// Temporary values.

	vertices(mesh: Mesh): Vertex[]
	{
		if (this._vertices == null)
		{
			var vertex0 = this.vertex(mesh, 0);
			var vertex1 = this.vertex(mesh, 1);
			this._vertices = [vertex0, vertex1];
		}
		return this._vertices;
	}
	private _vertices: Vertex[];

	displacement(mesh: Mesh): Coords
	{
		if (this._displacement == null)
		{
			var vertices = this.vertices(mesh);

			this._displacement =
				vertices[1].pos
				.clone()
				.subtract
				(
					vertices[0].pos
				);
		}

		return this._displacement;
	}
	private _displacement: Coords;

	direction(mesh: Mesh): Coords
	{
		if (this._direction == null)
		{
			var displacement = this.displacement(mesh);
			this._direction =
				displacement
					.clone()
					.normalize();
		};

		return this._direction;
	}
	private _direction: Coords;

	transverse(mesh: Mesh, face: Face): Coords
	{
		if (this._transverse == null)
		{
			var direction = this.direction(mesh)
			var facePlane = face.plane(mesh);
			this._transverse =
				direction
					.clone()
					.crossProduct
					(
						facePlane.normal
					);
		}

		return this._transverse;
	}
	private _transverse: Coords;

}
