
function ImageHelper()
{}
{
	// static methods

	ImageHelper.buildImageFromStrings = function
	(
		name, 
		scaleMultiplier, 
		stringsForPixels
	)
	{
		var sizeInPixels = new Coords
		(
			stringsForPixels[0].length, stringsForPixels.length
		);

		var canvas = document.createElement("canvas");
		canvas.width = sizeInPixels.x * scaleMultiplier;
		canvas.height = sizeInPixels.y * scaleMultiplier;

		var graphics = canvas.getContext("2d");

		var pixelPos = new Coords(0, 0);
		var colorForPixel = Color.Instances.Transparent;

		for (var y = 0; y < sizeInPixels.y; y++)
		{
			var stringForPixelRow = stringsForPixels[y];
			pixelPos.y = y * scaleMultiplier;

			for (var x = 0; x < sizeInPixels.x; x++)
			{
				var charForPixel = stringForPixelRow[x];
				pixelPos.x = x * scaleMultiplier;

				colorForPixel = Color.Instances._All[charForPixel];

				graphics.fillStyle = colorForPixel.systemColor();
				graphics.fillRect
				(
					pixelPos.x, pixelPos.y, 
					scaleMultiplier, scaleMultiplier
				);				
			}
		}
		
		var imageData = graphics.getImageData
		(
			0, 0, sizeInPixels.x, sizeInPixels.y
		);

		var returnValue = new Image
		(
			name, sizeInPixels, imageData
		);

		return returnValue;
	}
}
