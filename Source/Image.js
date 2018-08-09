
function Image(name, sizeInPixels, imageData)
{
	this.name = name;
	this.sizeInPixels = sizeInPixels;
	this.imageData = imageData;
}

{
	Image.prototype.systemImage = function()
	{
		if (this._systemImage == null)
		{		
			var canvas = document.createElement("canvas");
			canvas.width = this.sizeInPixels.x;
			canvas.height = this.sizeInPixels.y;

			var graphics = canvas.getContext("2d");
			graphics.putImageData(this.imageData, 0, 0);

			var imageFromCanvasURL = canvas.toDataURL("image/png");

			var systemImage = document.createElement("img");
			systemImage.width = canvas.width;
			systemImage.height = canvas.height;
			systemImage.isLoaded = false;
			systemImage.onload = function(event) 
			{ 
				event.target.isLoaded = true; 
			}
			systemImage.src = imageFromCanvasURL;

			this._systemImage = systemImage;

		}		

		return this._systemImage;
		
	}
}
