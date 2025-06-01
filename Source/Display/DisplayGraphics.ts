
interface Display
{
	drawToOther(other: Display): void;
	fillWithColor(color: Color): void;
	pixelAtPosSetToColor(pixelPos: Coords, pixelColor: Color): void;
	sizeInPixels: Coords;
}

class DisplayGraphics implements Display
{
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;

	graphics: any;

	constructor(sizeInPixels: Coords)
	{
		this.sizeInPixels = sizeInPixels;
		this.sizeInPixelsHalf =
			this.sizeInPixels.clone().divideScalar(2);

		var d = document;
		var canvas = d.createElement("canvas");
		canvas.width = this.sizeInPixels.x;
		canvas.height = this.sizeInPixels.y;

		var divDisplay = d.getElementById("divDisplay");
		divDisplay.innerHTML = "";
		divDisplay.appendChild(canvas);

		this.graphics = canvas.getContext("2d");
	}

	// Drawing.

	drawToOther(other: Display): void
	{
		throw new Error("Not yet implemented!");
	}

	fillWithColor(color: Color): void
	{
		var g = this.graphics;
		g.fillStyle = color.systemColor();
		g.fillRect
		(
			0, 0, 
			this.sizeInPixels.x,
			this.sizeInPixels.y
		);
	}

	pixelAtPosSetToColor(pixelPos: Coords, pixelColor: Color): void
	{
		this.graphics.fillStyle = 
			pixelColor.systemColor();

		this.graphics.fillRect
		(
			pixelPos.x, 
			pixelPos.y, 
			1, 1
		);
	}
}
