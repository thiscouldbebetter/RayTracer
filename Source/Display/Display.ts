
class Display
{
	sizeInPixels: Coords;
	sizeInPixelsHalf: Coords;

	graphics: any;

	initialize(sizeInPixels: Coords): void
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
