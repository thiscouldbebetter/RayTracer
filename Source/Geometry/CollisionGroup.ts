
class CollisionGroup
{
	_collisions: Collision[];

	constructor(collisions: Collision[])
	{
		this._collisions = collisions;
	}

	static create(): CollisionGroup
	{
		return new CollisionGroup([]);
	}

	clear(): CollisionGroup
	{
		this._collisions.length = 0;
		return this;
	}

	collisionAdd(collisionToAdd: Collision): CollisionGroup
	{
		var i = 0;
		for (i = 0; i < this._collisions.length; i++)
		{
			var collisionInPlace = this._collisions[i];
			var shouldBreak =
			(
				collisionToAdd.distanceToCollision
				<= collisionInPlace.distanceToCollision
			);
			if (shouldBreak)
			{
				break;
			}
		}

		this._collisions.splice(i, 0, collisionToAdd);

		return this;
	}

	collisionClosest(): Collision
	{
		return this._collisions[0]; // Collision.closestOf(this.collisions);
	}

	collisions(): Collision[]
	{
		return this._collisions;
	}

	hasCollisions(): boolean
	{
		return (this._collisions.length > 0);
	}
}