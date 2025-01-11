function bellCurve(x, scale, standardDeviation, mean) {
	return scale * (1 / (standardDeviation * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * ((x - mean) / standardDeviation) ** 2);
}