
class Polar
{
	azimuth: number;
	elevation: number;
	radius: number

	constructor(azimuth: number, elevation: number, radius: number)
	{
		this.azimuth = azimuth;
		this.elevation = elevation;
		this.radius = radius;
	}

	static create(): Polar
	{
		return new Polar(0, 0, 0);
	}

	fromCoords(coordsToConvert: Coords): Polar
	{
		this.radius = coordsToConvert.magnitude();

		this.azimuth = Math.atan2
		(
			coordsToConvert.y,
			coordsToConvert.x
		) / Constants.RadiansPerCircle;

		if (this.azimuth < 0)
		{
			this.azimuth += 1;
		}

		this.elevation = Math.asin
		(
			coordsToConvert.z / this.radius
		) / Constants.RadiansPerRightAngle;

		return this;
	}

	toCoords(coordsToOverwrite: Coords): Coords
	{
		var azimuthInRadians = this.azimuth * Constants.RadiansPerCircle;
		var elevationInRadians = this.elevation * Constants.RadiansPerRightAngle;
		var cosineOfElevation = Math.cos(elevationInRadians);

		coordsToOverwrite.overwriteWithXYZ
		(
			cosineOfElevation * Math.cos(azimuthInRadians),
			cosineOfElevation * Math.sin(azimuthInRadians),
			Math.sin(elevationInRadians)
		).multiplyScalar
		(
			this.radius
		);

		return coordsToOverwrite;
	}
}
