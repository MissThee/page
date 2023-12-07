const getTimestampByStr = (dateStr) => { // 字符串日期yyyy-MM-dd hh:mm:[ss]  转时间戳 
		if (!dateStr) {
			return 0
		}
		let timestamp = Date.parse(new Date(dateStr))
		if (!timestamp) {
			const arr = dateStr.split(/[- : \/]/);
			timestamp = new Date(
				arr[0] || 1970,
				(arr[1] || 1) - 1,
				arr[2] || 1,
				arr[3] || 0,
				arr[4] || 0,
				arr[5] || 0);
		}
		return timestamp
	}