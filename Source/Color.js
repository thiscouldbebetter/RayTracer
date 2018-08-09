
function Color(name, codeChar, componentsRGBA)
{
	this.name = name;
	this.codeChar = codeChar;
	this.componentsRGBA = componentsRGBA;
}

{
	// constants

	Color.NumberOfComponentsRGBA = 4;
	Color.ComponentMax = 255;

	// instances

	function Color_Instances()
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

		this._All.addLookups("codeChar");

	}

	Color.Instances = new Color_Instances();

	// static methods

	Color.blank = function(name)
	{
		return new Color(name, "x", [0, 0, 0, 0]);
	}

	// instance methods

	Color.prototype.clone = function()
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

	Color.prototype.components = function(red, green, blue, alpha)
	{
		this.componentsRGBA[0] = red;
		this.componentsRGBA[1] = green;
		this.componentsRGBA[2] = blue;
		this.componentsRGBA[3] = alpha;
	}

	Color.prototype.multiply = function(scalar)
	{
		for (var i = 0; i < 3; i++)
		{
			this.componentsRGBA[i] *= scalar;
		}

		return this;
	}

	Color.prototype.overwriteWith = function(other)
	{
		this.name = other.name;
		this.codeChar = other.codeChar;
		for (var i = 0; i < this.componentsRGBA.length; i++)
		{
			this.componentsRGBA[i] = other.componentsRGBA[i];
		}

		return this;
	}

	Color.prototype.systemColor = function()
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
}
