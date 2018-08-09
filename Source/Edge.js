
function Edge(vertexIndices)
{
	this.vertexIndices = vertexIndices;

	this.vertices = null;
	this.displacement = new Coords();
	this.direction = new Coords();
	this.transverse = new Coords();
}

{
	Edge.prototype.recalculateDerivedValues = function(mesh, face)
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

	Edge.prototype.vertex = function(mesh, vertexIndexIndex)
	{
		var vertexIndex = this.vertexIndices[vertexIndexIndex];
		var vertex = mesh.vertices[vertexIndex];
		return vertex;
	}
}
