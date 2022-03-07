const getDistanceKmByPoint = (lng1, lat1, lng2, lat2) => { // 计算两个坐标点的直线距离 km
		const radLat1 = lat1 * Math.PI / 180.0;
		const radLat2 = lat2 * Math.PI / 180.0;
		const a = radLat1 - radLat2;
		const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		let result = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) *
			Math
			.pow(Math.sin(b / 2), 2)));
		result = result * 6378.137;
		result = Math.round(result * 10000) / 10000;
		return result
	};