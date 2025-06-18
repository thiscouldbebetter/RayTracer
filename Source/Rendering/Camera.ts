
class Camera implements Serializable<Camera>
{
	viewSize: Coords;
	focalLength: number;
	pos: Coords;
	orientation: Orientation;

	_directionToPixel: Coords;
	_displacementToPixel: Coords;
	_rayToPixelAtPos: Ray;
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
	}

	static fromViewSizeFocalLengthPosAndOrientation
	(
		viewSize: Coords,
		focalLength: number,
		pos: Coords,
		orientation: Orientation
	): Camera
	{
		return new Camera(viewSize, focalLength, pos, orientation);
	}

	displacementToPixelAtPos(pixelPos: Coords): Coords
	{
		if (this._displacementToPixel == null)
		{
			this._displacementToPixel = Coords.create();
		}
		var displacementToPixel = this._displacementToPixel;

		var cameraOrientation = this.orientation;
		var cameraOrientationTemp = Orientation.Instances().Camera;
		var cameraForward = cameraOrientationTemp.forward;
		var cameraRight = cameraOrientationTemp.right;
		var cameraDown = cameraOrientationTemp.down;
		var displaySizeInPixelsHalf = this.viewSizeHalf();

		// Perspective projection.

		displacementToPixel.overwriteWith
		(
			cameraRight
				.overwriteWith(cameraOrientation.right)
				.multiplyScalar(pixelPos.x - displaySizeInPixelsHalf.x)
		).add
		(
			cameraDown
				.overwriteWith(cameraOrientation.down)
				.multiplyScalar(pixelPos.y - displaySizeInPixelsHalf.y)
		);

		if (this.focalLength != null)
		{
			displacementToPixel.add
			(
				cameraForward
					.overwriteWith(cameraOrientation.forward)
					.multiplyScalar(this.focalLength)
			);
		}

		return displacementToPixel;
	}

	directionToPixelAtPos(pixelPos: Coords): Coords
	{
		if (this._directionToPixel == null)
		{
			this._directionToPixel = Coords.create();
		}

		var displacementToPixel =
			this.displacementToPixelAtPos(pixelPos);

		var directionToPixel =
			this._directionToPixel;

		directionToPixel
			.overwriteWith(displacementToPixel)
			.normalize();

		return directionToPixel;
	}

	rayToPixelAtPos(pixelPos: Coords): Ray
	{
		if (this._rayToPixelAtPos == null)
		{
			this._rayToPixelAtPos = Ray.create();
		}

		var rayToPixelAtPos = this._rayToPixelAtPos;

		var rayStartPos = rayToPixelAtPos.startPos;
		var rayDirection = rayToPixelAtPos.direction;

		rayStartPos.overwriteWith(this.pos);

		if (this.focalLength == null)
		{
			// Parallel projection.

			var displacementToPixelAtPos =
				this.displacementToPixelAtPos(pixelPos);
			var forward = this.orientation.forward;
			rayStartPos
				.add(displacementToPixelAtPos);
			rayDirection
				.overwriteWith(forward);

			// hack
			// Back up the ray start pos,
			// because otherwise anything "behind" the camera,
			// like the ground plane in the demo,
			// will be cut off.
			rayStartPos.subtract
			(
				forward.clone().multiplyScalar(1000)
			);
		}
		else
		{
			// Perspective projection.
			var directionToPixelAtPos =
				this.directionToPixelAtPos(pixelPos);
			rayDirection
				.overwriteWith(directionToPixelAtPos);
		}

		return rayToPixelAtPos;
	}

	viewSizeHalf(): Coords
	{
		if (this._viewSizeHalf == null)
		{
			this._viewSizeHalf = this.viewSize.clone().half();
		}
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
