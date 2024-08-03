
class Color
{
	name: string;
	codeChar: string;
	componentsRGBA: number[];

	constructor
	(
		name: string,
		codeChar: string,
		componentsRGBA: number[]
	)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.componentsRGBA = componentsRGBA || [0, 0, 0, 0];
	}

	static create(): Color
	{
		return new Color(null, null, null);
	}

	// constants

	static NumberOfComponentsRGBA: number = 4;
	static ComponentMax: number = 255;

	// instances

	static _instances: Color_Instances;
	static Instances(): Color_Instances
	{
		if (Color._instances == null)
		{
			Color._instances = new Color_Instances();
		}
		return Color._instances;
	}

	// static methods

	static blank(name: string): Color
	{
		return new Color(name, "x", [0, 0, 0, 0]);
	}

	static byCodeChar(codeChar: string): Color
	{
		return Color.Instances().byCodeChar(codeChar);
	}

	clone(): Color
	{
		return new Color
		(
			this.name, 
			this.codeChar, 
			[
				this.componentsRGBA[0],
				this.componentsRGBA[1],
				this.componentsRGBA[2],
				this.componentsRGBA[3],
			]
		);
	}

	components(red: number, green: number, blue: number, alpha: number): void
	{
		this.componentsRGBA[0] = red;
		this.componentsRGBA[1] = green;
		this.componentsRGBA[2] = blue;
		this.componentsRGBA[3] = alpha;
	}

	multiply(scalar: number): Color
	{
		for (var i = 0; i < 3; i++)
		{
			this.componentsRGBA[i] *= scalar;
		}

		return this;
	}

	overwriteWith(other: Color): Color
	{
		this.name = other.name;
		this.codeChar = other.codeChar;
		for (var i = 0; i < this.componentsRGBA.length; i++)
		{
			this.componentsRGBA[i] = other.componentsRGBA[i];
		}

		return this;
	}

	systemColor(): string
	{
		var returnValue = 
			"rgba(" 
			+ Math.round(Color.ComponentMax * this.componentsRGBA[0]) + ", " 
			+ Math.round(Color.ComponentMax * this.componentsRGBA[1]) + ", " 
			+ Math.round(Color.ComponentMax * this.componentsRGBA[2]) + ", "
			+ this.componentsRGBA[3] 
			+ ")";

		return returnValue;	
	}

	// Serializable.

	fromJson(objectAsJson: string): Color
	{
		throw new Error("To be implemented!");
	}

	toJson(): string
	{
		throw new Error("To be implemented!");
	}

	prototypesSet(): Color
	{
		// Do nothing.
		return this;
	}

}

class Color_Instances
{
	Transparent: Color;

	Blue: Color;
	BlueDark: Color;
	Black: Color;
	Cyan: Color;
	Gray: Color;
	Green: Color;
	GreenDark: Color;
	Orange: Color;
	OrangeDark: Color;
	Red: Color;
	RedDark: Color;
	Violet: Color;
	VioletDark: Color;
	White: Color;
	Yellow: Color;
	YellowDark: Color;

	_All: Color[];
	_AllByCodeChar: Map<string, Color>;

	constructor()
	{
		this.Transparent = new Color("Transparent", ".", [0, 0, 0, 0]);

		this.Black 	= new Color("Black",	"k", [0, 0, 0, 1]);
		this.Blue 	= new Color("Blue", 	"b", [0, 0, 1, 1]);
		this.BlueDark 	= new Color("BlueDark", "B", [0, 0, .5, 1]);
		this.Cyan 	= new Color("Cyan", 	"c", [0, 1, 1, 1]);
		this.Gray 	= new Color("Gray", 	"a", [.5, .5, .5, 1]);
		this.Green 	= new Color("Green", 	"g", [0, 1, 0, 1]);
		this.GreenDark 	= new Color("GreenDark", "G", [0, .5, 0, 1]);
		this.Orange 	= new Color("Orange", 	"o", [1, .5, 0, 1]);
		this.OrangeDark	= new Color("OrangeDark", "O", [.5, .25, 0, 1]);
		this.Red 	= new Color("Red", 	"r", [1, 0, 0, 1]);
		this.RedDark 	= new Color("RedDark", 	"R", [.5, 0, 0, 1]);
		this.Violet 	= new Color("Violet", 	"v", [1, 0, 1, 1]);
		this.VioletDark	= new Color("VioletDark","V", [.5, 0, .5, 1]);
		this.White 	= new Color("White", 	"w", [1, 1, 1, 1]);
		this.Yellow 	= new Color("Yellow", 	"y", [1, 1, 0, 1]);
		this.YellowDark	= new Color("YellowDark", "Y", [.5, .5, 0, 1]);

		this._All = 
		[
			this.Transparent,

			this.Blue,
			this.BlueDark,
			this.Black,
			this.Cyan,
			this.Gray,
			this.Green,
			this.GreenDark,
			this.Orange,
			this.OrangeDark,
			this.Red,
			this.RedDark,
			this.Violet,
			this.VioletDark,
			this.White,
			this.Yellow,
			this.YellowDark,
		];

		this._AllByCodeChar =
			new Map(this._All.map(x => [x.codeChar, x]) );
	}

	byCodeChar(codeChar: string): Color
	{
		return this._AllByCodeChar.get(codeChar);
	}
}
