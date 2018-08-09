
function Plane(positionsOnPlane)
{
	this.positionsOnPlane = positionsOnPlane;
	this.normal = new Coords(0, 0, 0);
	this.recalculateDerivedValues();
}

{
	Plane.prototype.recalculateDerivedValues = function()
	{
		var pos0 = this.positionsOnPlane[0];
		var displacementFromPos0To1 = this.positionsOnPlane[1].clone().subtract(pos0);
		var displacementFromPos0To2 = this.positionsOnPlane[2].clone().subtract(pos0);
		this.normal.overwriteWith
		(
			displacementFromPos0To1
		).crossProduct
		(
			displacementFromPos0To2
		).normalize();

		this.distanceFromOrigin = this.normal.dotProduct(pos0);
	}
}
