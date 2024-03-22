
class Image2
{
	name: string;
	sizeInPixels: Coords;
	imageData: any;

	_systemImage: any;
	_systemImageIsLoaded: boolean;

	constructor
	(
		name: string,
		sizeInPixels: Coords,
		imageData: any
	)
	{
		this.name = name;
		this.sizeInPixels = sizeInPixels;
		this.imageData = imageData;
	}

	systemImageSendToCallback(callback: any): void
	{
		if (this._systemImage != null)
		{
			callback(this._systemImage);
		}
		else
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
			systemImage.onload = (event: any) =>
			{
				var imgElement = event.target;
				imgElement.isLoaded = true;
				callback(imgElement);
			}
			systemImage.src = imageFromCanvasURL;

			this._systemImage = systemImage;
		}
	}
}
