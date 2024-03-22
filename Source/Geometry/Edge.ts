
class Edge
{
	vertexIndices: number[];

	vertices: Vertex[];
	displacement: Coords;
	direction: Coords;
	transverse: Coords;

	constructor(vertexIndices: number[])
	{
		this.vertexIndices = vertexIndices;

		this.vertices = null;
		this.displacement = Coords.create();
		this.direction = Coords.create();
		this.transverse = Coords.create();
	}

	recalculateDerivedValues(mesh: Mesh, face: Face): void
	{
		if (this.vertices == null)
		{
			this.vertices = [this.vertex(mesh, 0), this.vertex(mesh, 1)];
		}

		this.displacement.overwriteWith
		(
			this.vertices[1].pos
		).subtract
		(
			this.vertices[0].pos
		);

		this.direction.overwriteWith
		(
			this.displacement
		).normalize();

		this.transverse.overwriteWith
		(
			this.direction
		).crossProduct
		(
			face.plane.normal
		);
	}

	vertex(mesh: Mesh, vertexIndexIndex: number): Vertex
	{
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}
}
