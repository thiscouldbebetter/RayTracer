
class Ray
{
	startPos: Coords; // Also called "the vertex".
	direction: Coords;

	constructor(startPos: Coords, direction: Coords)
	{
		this.startPos = startPos;
		this.direction = direction;
	}

	static create(): Ray
	{
		return new Ray(Coords.create(), Coords.create() );
	}

	startPosAndDirectionSet(startPos: Coords, direction: Coords): Ray
	{
		this.startPos.overwriteWith(startPos);
		this.direction.overwriteWith(direction);
		return this;
	}
}
