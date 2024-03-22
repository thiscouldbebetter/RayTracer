
class Coords
{
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static create(): Coords
	{
		return new Coords(0, 0, 0);
	}

	static fromXY(x: number, y: number): Coords
	{
		return new Coords(x, y, 0);
	}

	// constants

	static NumberOfDimensions: number = 3;

	// instance methods

	add(other: Coords): Coords
	{
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;

		return this;
	}

	clone(): Coords
	{
		return new Coords(this.x, this.y, this.z);
	}

	crossProduct(other: Coords): Coords
	{
		this.overwriteWithXYZ
		(
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x
		);

		return this;
	}

	dimension(dimensionIndex: number): number
	{
		return (dimensionIndex == 0 ? this.x : dimensionIndex == 1 ? this.y : this.z);
	}

	dimensionValues(): number[]
	{
		return [ this.x, this.y, this.z ];
	}

	divide(other: Coords): Coords
	{
		this.x /= other.x;
		this.y /= other.y;
		this.z /= other.z;

		return this;
	}

	divideScalar(scalar: number): Coords
	{
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;

		return this;
	}

	dotProduct(other: Coords): number
	{
		var returnValue =
			this.x * other.x
			+ this.y * other.y
			+ this.z * other.z;

		return returnValue;
	}

	magnitude(): number
	{
		var returnValue = Math.sqrt
		(
			this.x * this.x
			+ this.y * this.y
			+ this.z * this.z
		);

		return returnValue;
	}

	multiply(other: Coords): Coords
	{
		this.x *= other.x;
		this.y *= other.y;
		this.z *= other.z;

		return this;
	}

	multiplyScalar(scalar: number): Coords
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	}

	normalize(): Coords
	{
		return this.divideScalar(this.magnitude() );
	}

	overwriteWith(other: Coords): Coords
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;

		return this;
	}

	overwriteWithXYZ(x: number, y: number, z: number): Coords
	{
		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	}

	subtract(other: Coords): Coords
	{
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;

		return this;
	}

	toString(): string
	{
		var returnValue =
			"(" + this.x + "," + this.y + "," + this.z + ")";

		return returnValue;
	}

	trimToRange(range: Coords): Coords
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
