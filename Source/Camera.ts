
class Camera
{
	viewSize: Coords;
	focalLength: number;
	pos: Coords;
	orientation: Orientation;

	constructor
	(
		viewSize: Coords,
		focalLength: number,
		pos: Coords,
		orientation: Orientation
	)
	{
		this.viewSize = viewSize;
		this.focalLength = focalLength;
		this.pos = pos;
		this.orientation = orientation;
	}
}
