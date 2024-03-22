
class NumberHelper
{
	static wrapValueToRange(valueToWrap: number, range: number): number
	{
		while (valueToWrap < 0)
		{
			valueToWrap += range;
		}

		while (valueToWrap >= range)
		{
			valueToWrap -= range;
		}

		return valueToWrap;
	}
}
