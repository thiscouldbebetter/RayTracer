
function Coords(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
}

{
	// constants

	Coords.NumberOfDimensions = 3;

	// instance methods

	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;

		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y, this.z);
	}

	Coords.prototype.crossProduct = function(other)
	{
		this.overwriteWithXYZ
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);

		return this;
	}

	Coords.prototype.dimensionValues = function()
	{
		return [ this.x, this.y, this.z ];
	}

	Coords.prototype.divide = function(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;

		return this;
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	Coords.prototype.dotProduct = function(other)
	{
		var returnValue =
			this.x * other.x
			+ this.y * other.y
			+ this.z * other.z;

		return returnValue;
	}

	Coords.prototype.magnitude = function()
	{
		var returnValue = Math.sqrt
		(
			this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);

		return returnValue;
	}

	Coords.prototype.multiply = function(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;

		return this;
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	Coords.prototype.normalize = function()
	{
		return this.divideScalar(this.magnitude());
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;

		return this;
	}

	Coords.prototype.overwriteWithXYZ = function(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;

		return this;
	}

	Coords.prototype.toString = function()
	{
		var returnValue = "(" + this.x + "," + this.y + "," + this.z + ")";

		return returnValue;
	}

	Coords.prototype.trimToRange = function(range)
	{
		if (this.x < 0)
		{
			this.x = 0;
		}
		else if (this.x > range.x)
		{
			this.x = range.x;
		}

		if (this.y < 0)
		{
			this.y = 0;
		}
		else if (this.y > range.y)
		{
			this.y = range.y;
		}

		if (this.z < 0)
		{
			this.z = 0;
		}
		else if (this.z > range.z)
		{
			this.z = range.z;
		}

		return this;
	}
}
