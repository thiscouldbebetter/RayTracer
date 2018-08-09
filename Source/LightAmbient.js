
function LightAmbient(intensity)
{
	this.intensity = intensity;
}

{
	LightAmbient.prototype.intensityForCollisionNormalAndCamera = function(collision, normal, camera)
	{
		return this.intensity;
	}
}
