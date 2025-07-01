
class Coords implements Serializable<Coords>
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

	static fromXYZ(x: number, y: number, z: number): Coords
	{
		return new Coords(x, y, z);
	}

	static ones(): Coords
	{
		return new Coords(1, 1, 1);
	}

	static zeroes(): Coords
	{
		return new Coords(0, 0, 0);
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

	dimensionSet(dimensionIndex: number, value: number): Coords
	{
		if (dimensionIndex == 0)
		{
			this.x = value;
		}
		else if (dimensionIndex == 1)
		{
			this.y = value;
		}
		else if (dimensionIndex == 2)
		{
			this.z = value;
		}
		else
		{
			throw new Error("DimensionIndex too high!");
		}

		return this;
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

	doublify(): Coords
	{
		return this.multiplyScalar(2);
	}

	half(): Coords
	{
		return this.divideScalar(2);
	}

	invert(): Coords
	{
		return this.multiplyScalar(-1);
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

	randomize(): Coords
	{
		this.x = Math.random();
		this.y = Math.random();
		this.z = Math.random();
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

	zSet(value: number): Coords
	{
		this.z = value;
		return this;
	}

	// Serializable.

	fromJson(objectAsJson: string): Coords
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Coords
	{
		return this;
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	toObjectSerializable(): any
	{
		return this;
	}

}
