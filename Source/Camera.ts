
class Camera implements Serializable<Camera>
{
	viewSize: Coords;
	focalLength: number;
	pos: Coords;
	orientation: Orientation;

	_viewSizeHalf: Coords;

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

		this._viewSizeHalf = this.viewSize.clone().half();
	}

	viewSizeHalf(): Coords
	{
		return this._viewSizeHalf;
	}

	// Serializable.

	fromJson(objectAsJson: string): Camera
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Camera
	{
		var typeSetOnObject = SerializableHelper.typeSetOnObject;

		typeSetOnObject(Coords, this.viewSize);
		typeSetOnObject(Coords, this.pos);
		typeSetOnObject(Orientation, this.orientation);

		return this;
	}

}
