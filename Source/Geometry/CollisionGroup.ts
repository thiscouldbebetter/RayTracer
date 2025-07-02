
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
		for (var i = 0; i < this._collisions.length; i++)
		{
			var collision = this._collisions[i];
			if (collision.deactivated)
			{
				break;
			}
			else
			{
				collision.deactivate();
			}
		}
		return this;
	}

	collisionAdd(collisionToAdd: Collision): CollisionGroup
	{
		var i = 0;
		for (i = 0; i < this._collisions.length; i++)
		{
			var collisionInPlace = this._collisions[i];
			if (collisionInPlace.deactivated)
			{
				collisionInPlace
					.overwriteWith(collisionToAdd)
					.activate();
				break;
			}
		}

		if (i >= this._collisions.length)
		{
			this._collisions.push(collisionToAdd.clone() );
		}

		return this;
	}

	collisionClosest(): Collision
	{
		var collision0 =
			Collision.closestOfActivated(this._collisions);
		return collision0;
	}

	collisions(): Collision[]
	{
		return this._collisions;
	}

	hasCollisions(): boolean
	{
		var returnValue =
			this._collisions.length > 0
			&& this._collisions[0].deactivated == false

		return returnValue;
	}
}