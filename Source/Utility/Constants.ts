
class Constants
{
	static DegreesPerCircle: number = 360;
	static RadiansPerCircle: number = 2 * Math.PI;
	static RadiansPerRightAngle: number = Math.PI / 2;
	static RadiansPerDegree: number = 
		Constants.RadiansPerCircle
		/ Constants.DegreesPerCircle;
}
