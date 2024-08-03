
class Ray
{
	startPos: Coords; // Also called "the vertex".
	direction: Coords;

	constructor(startPos: Coords, direction: Coords)
	{
		this.startPos = startPos;
		this.direction = direction;
	}
}
