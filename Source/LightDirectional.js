
function LightDirectional(intensity, orientation)
{
	this.intensity = intensity;
	this.orientation = orientation;
}

{
	LightDirectional.prototype.intensityForCollisionMaterialNormalAndCamera = function
	(
		collision, material, normal, camera
	)
	{
		return 0; // todo
	}
}
