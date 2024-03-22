
class Polar
{
	constructor(azimuth, elevation, radius)
	{
		this.azimuth = azimuth;
		this.elevation = elevation;
		this.radius = radius;
	}

	fromCoords(coordsToConvert)
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

	toCoords(coordsToOverwrite)
	{
		var azimuthInRadians = this.azimuth * Constants.RadiansPerCircle;
		var elevationInRadians = this.elevation * Constants.RadiansPerRightAngle;
		var cosineOfElevation = Math.cos(elevationInRadians);

		coordsToOverwrite.overwriteWithXYZ
		(
			cosineOfElevation * Math.cos(this.azimuth),
			cosineOfElevation * Math.sin(this.azimuth),
			Math.sin(elevationInRadians)
		).multiplyScalar
		(
			this.radius
		);
	}
}
