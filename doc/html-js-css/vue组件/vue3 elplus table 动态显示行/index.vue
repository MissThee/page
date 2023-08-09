<template>
	<div class="schedule-list">
		<div class="header">
			<div class="panel">
				<breadcrumb></breadcrumb>
				<search-condition v-model="searchData" :options="searchOptions" @reset="resetHandler" @submit="searchHandler" />
			</div>
		</div>
		<div class="content">
			<div class="date">
				<el-button size="small" @click="previousWeek">上一周</el-button>
				<span class="currDay">{{ showDate }}</span>
				<el-button size="small" @click="nextWeek">下一周</el-button>
			</div>
			<div class="page-table">
				<div class="table-container" ref="tableContainerEl">
					<el-table ref="tableEl" v-loading="isTableRequestLoading||isDeleteLoading" :data="dataForShow" row-key="id" border :max-height="tableMaxHeight" class="table-component">
						<el-table-column prop="id" label="" align="center" min-width="60">
							<template #default="scope">
								<div class="name">
									<div>{{ scope.row.engineer_name }}</div>
									<div>{{ scope.row.engineer_eid }}</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="num" label="" align="center" min-width="180">
							<template #header>
								<div class="ratio">
									<div v-for="(item, index) in detail" :key="index" class="ratio_item">
										<div>已排单量: {{ item.have_arranged_count_of_service }}</div>
										<div>未排上单量: {{ item.not_arrange_count_of_service }}</div>
										<div>可用人数: {{ item.number_of_people }}</div>
										<div>人效: {{ item.avg_engineer_efficiency }}</div>
									</div>
								</div>
							</template>
							<el-table-column
								v-for="(item, index) in weeks"
								:key="index"
								:prop="item.prop" :label="item.label" align="center" min-width="80">
								<template #header>
									<div :class="{ is_active: item.label === date_active }">{{ item.label }}</div>
								</template>
								<template #default="{ row }">
									<div :style="{height:row._height-cellPadding*2-cellBorder+'px'}">
										<el-popover
											placement="top"
											:width="200"
											trigger="hover"
											v-for="(item_c, index_c) in row[item.prop]"
											:key="index_c"
											:persistent="false"
										>
											<template #reference>
												<div class="time-card" :style="{minHeight: `${( cellMinHeight / row[item.prop].length)}px`, marginBottom: `${row[item.prop].length ? tagMarginBottom : 0}px`, background: `#${item_c.color}`}">
													<div class="time-card__text">{{ item_c.name }} {{ item_c.start_time }} 至 {{ item_c.end_time }}</div>
												</div>
											</template>
											<template #default>
												<div>{{ item_c.name }} {{ item_c.start_time }} 至 {{ item_c.end_time }}</div>
											</template>
										</el-popover>
									</div>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Breadcrumb from "src/components/breadcrumb.vue";
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from "vue";
import SearchCondition, { SearchConditionOption } from "../../components/SearchCondition.vue";
import * as scheduleBoardApi from "src/api/scheduleBoard";
import { ElMessage } from "element-plus";

const tableEl = ref();
const dataForShow = ref<Record<string, any>[]>([]);
// 筛选框
const searchOptions = ref<SearchConditionOption[]>([
	{
		key: "city_id",
		label: "城市",
		type: "select",
		isLoading: true,
		options: []
	},
	{
		key: "engineer_id",
		label: "工程师",
		type: "select",
		isLoading: true,
		options: []
	}
]);

// 表头
const weeks = ref([{
	prop: "mon",
	label: "周一"
}, {
	prop: "tue",
	label: "周二"
}, {
	prop: "wed",
	label: "周三"
}, {
	prop: "thu",
	label: "周四"
}, {
	prop: "fri",
	label: "周五"
}, {
	prop: "sat",
	label: "周六"
}, {
	prop: "sun",
	label: "周日"
}]);

const detail = ref([]);

// 获取当前的日期及当前所在一周的日期

const currDT = ref();
const aryDay = ["日", "一", "二", "三", "四", "五", "六"];
const firstDay = ref(); //页面显示的第一天
const lastDay = ref();  //页面显示的最后一天
const date = new Date; //获取完整日期
const date_active = `${date.getMonth() + 1}月${date.getDate()}日 星期${aryDay[date.getDay()]}`; //当前高亮日期
const showDate = ref();
//初始化日期加载
const initDate = () => {
	currDT.value = new Date();
	showDate.value = currDT.value.toLocaleDateString();
	let dw = currDT.value.getDay(); //从Date对象返回一周中的某一天(0~6)
	let tdDT; // 日期
	for (var i = 0; i < 7; i++) {
		tdDT = getDays()[i];
		dw = tdDT.getDay(); //星期几
		weeks.value[i]["label"] = `${tdDT.getMonth() + 1}月${tdDT.getDate()}日 星期${aryDay[dw]}`;
	}
	//重新赋值
	lastDay.value = getDays()[6]; //本周的最后一天
	firstDay.value = getDays()[0]; //本周的第一天
};


//取得当前日期一周内的某一天
function getWeek(i: number) {
	var now = new Date();
	var n = now.getDay();
	var start = new Date();
	start.setDate(now.getDate() - n + i); //取得一周内的第一天、第二天、第三天...
	return start;
}

//取得当前日期一周内的七天
function getDays() {
	var days = [];
	for (var i = 1; i <= 7; i++) {
		days[i - 1] = getWeek(i);
	}
	return days;
}

//取得下一周的日期数(共七天)
function getNextWeekDatas(ndt: any) {
	var days = [];
	for (var i = 1; i <= 7; i++) {
		var dt = new Date(ndt);
		days[i - 1] = getNextWeek(dt, i);
	}
	return days;
}

//指定日期的下一周(后七天)
function getNextWeek(dt: any, i: any) {
	var today = dt;
	today.setDate(today.getDate() + i);
	return today;
}

//取得上一周的日期数(共七天)
function getPreviousWeekDatas(ndt: any) {
	var days = [];
	for (var i = -7; i <= -1; i++) {
		var dt = new Date(ndt);
		days[7 + i] = getPreviousWeek(dt, i);
	}
	return days;
}

//指定日期的上一周(前七天)
function getPreviousWeek(dt: any, i: any) {
	var today = dt;
	today.setDate(today.getDate() + i);
	return today;
}

//当前日期后第七天
function setCurrDTAfter() {
	currDT.value.setDate(currDT.value.getDate() + 7);
}

//当前日期前第七天
function settCurrDTBefore() {
	currDT.value.setDate(currDT.value.getDate() - 7);
}

// 上一周
const previousWeek = () => {
	settCurrDTBefore();
	showDate.value = currDT.value.toLocaleDateString(); //显示日期
	//在表格中显示一周的日期
	let dw = currDT.value.getDay(); //从Date对象返回一周中的某一天(0~6)
	let tdDT; //日期
	for (var i = 0; i < 7; i++) {
		tdDT = getPreviousWeekDatas(firstDay.value)[i];
		dw = tdDT.getDay(); //星期几
		weeks.value[i]["label"] = `${tdDT.getMonth() + 1}月${tdDT.getDate()}日 星期${aryDay[dw]}`;
	}
	//重新赋值
	lastDay.value = getPreviousWeekDatas(firstDay.value)[6]; //注意赋值顺序1
	firstDay.value = getPreviousWeekDatas(firstDay.value)[0]; //注意赋值顺序2
	searchRequest();
};

//下一周
function nextWeek() {
	setCurrDTAfter(); //重设时间
	showDate.value = currDT.value.toLocaleDateString(); //显示日期

	//在表格中显示一周的日期
	let dw = currDT.value.getDay(); //从Date对象返回一周中的某一天(0~6)
	let tdDT; //日期
	for (var i = 0; i < 7; i++) {
		tdDT = getNextWeekDatas(lastDay.value)[i];
		dw = tdDT.getDay(); //星期几
		weeks.value[i]["label"] = `${tdDT.getMonth() + 1}月${tdDT.getDate()}日 星期${aryDay[dw]}`;
	}
	//重新赋值
	firstDay.value = getNextWeekDatas(lastDay.value)[0]; //注意赋值顺序1
	lastDay.value = getNextWeekDatas(lastDay.value)[6]; //注意赋值顺序2
	searchRequest();
}


const requestSelectList = () => { // 请求下拉菜单数据
	scheduleBoardApi.getCitySelectData({ type: 2 })
		.then((res) => {
			searchOptions.value.forEach((e => {
				if (e.type === "select") {
					switch (e.key) {
						case "city_id": // 配置下拉菜单数据
							e.isLoading = false;
							e.options = res.data.city_arr;
							searchData.value.city_id = 35;
							searchRequest();
							break;
					}
				}
			}));
		});
};
const isTableRequestLoading = ref<boolean>(false);
const isDeleteLoading = ref<boolean>(false);
const searchData = ref({
	city_id: 0,
	engineer_id: ''
});
const searchKeyword = ref("");
const pageInfo = ref<{ page: number, size: number }>({
	page: 1,
	size: 10
});
const searchHandler = () => {
	searchRequest();
};
const resetHandler = () => {
	nextTick(()=> {
		searchData.value.city_id = 35;
	})
	searchData.value.engineer_id = ''
	searchRequest()
};
watch(() => pageInfo, () => {
	searchRequest();
}, { deep: true });

watch(() => searchData.value?.city_id, (city_id) => {
	getEngineerList({ city_id });
});

const getEngineerList = (params: any) => {
	scheduleBoardApi.getEngineerSelectData(params)
		.then((res) => {
			searchOptions.value.forEach((e => {
				if (e.type === "select") {
					switch (e.key) {
						case "engineer_id": // 配置下拉菜单数据
							e.isLoading = false;
							e.options = res.data.engineer_arr;
							break;
					}
				}
			}));
		});
};

const tableData = ref<scheduleBoardApi.ListData[]>([]);

const dateRge = (str: Date) => {
	return str.toLocaleDateString().replaceAll("/", "-");
};
const searchRequest = () => { // 发送列表查询请求
	isTableRequestLoading.value = true;
	const searchParam = {
		...(searchData.value || {}),
		start_date: dateRge(new Date(firstDay.value)),
		end_date: dateRge(new Date(lastDay.value)),
		key: searchKeyword.value,
		page: pageInfo.value.page,
		size: pageInfo.value.size
	};
	// console.log("searchParam！！", searchParam);
	scheduleBoardApi.getListData(searchParam)
		.then(res => {
			if (res.errcode === 0) {
				tableData.value = res.data.list;
				detail.value = res.data.header;
			} else {
				ElMessage.error(res.message);
			}
		})
		.finally(() => {
			isTableRequestLoading.value = false;
		});
};

// -------------------------- 表格尺寸调整 --------------------------
const tableContainerEl = ref<HTMLDivElement>();
const tableMaxHeight = ref<number>();
const setTableMaxHeight = () => {
	tableMaxHeight.value = tableContainerEl.value?.clientHeight;
};
onMounted(() => {
	setTableMaxHeight();
	window.addEventListener("resize", setTableMaxHeight);
	initDate();
	requestSelectList();

});
onUnmounted(() => {
	window.removeEventListener("resize", setTableMaxHeight);
});

// -------------------------- 表格动态渲染显示的行 --------------------------
// element-plus 2.3.4
let tableDataCopy: Record<string, any>[] = [];
let showAreaStartIndex = 0;  // 显示部分的第一行序号
let showAreaEndIndex = 0; // 显示部分的最后一行序号
const scrollElClassName = "el-scrollbar__wrap"; // 此节点在2.1.1版本前后ref名称有变化headerWrapper、scrollBarRef,改用类名获取
// 以下属性需保持与css设置的参数相同
const cellPadding = 4; // element-ui单元格的padding
const cellBorder = 1; // element-ui单元格的边框
const tagMinHeight = 33; // 每个tag的高度
const tagMarginBottom = 5; // 每个tag的间隔
const cellMinHeight = 60; // tag最小高度

// 监听数据变化时需重新计算行高
watch(() => tableData.value, (newVal) => {
	tableDataCopy = JSON.parse(JSON.stringify(newVal));
	// 按行遍历数据
	newVal.forEach((row, index) => {
		// 找到此行中数据最大数量，计算占用高度
		let dataNumMaxInRow = 0;
		weeks.value.map(e => e.prop)  // ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
			.forEach(key => {
				dataNumMaxInRow = Math.max(dataNumMaxInRow, row[key]?.length);
			});
		// 每行数据将增加3个辅助参数，此行行高_height，此行上边框距离顶部距离_start，此行下边框距离顶部距离_end
		tableDataCopy[index]._height = Math.max(cellMinHeight, (tagMinHeight + tagMarginBottom) * dataNumMaxInRow) + cellPadding * 2 + cellBorder;
		tableDataCopy[index]._start = tableDataCopy[index - 1]?._end || 0; // 记录每条数据上边距离顶部距离
		tableDataCopy[index]._end = tableDataCopy[index]._start + tableDataCopy[index]._height;// 记录每条数据下边距离顶部距离
	});
	nextTick(() => {
		tableScrollHandler();
	});
}, { deep: true, immediate: true });

// 表格数据更新、滚动时触发此方法
const tableScrollHandler = () => {
	// 滚动容器的高度
	const scrollContainerHeight = (tableContainerEl.value?.clientHeight || 0) - tableEl.value?.$refs?.headerWrapper?.clientHeight;
	// 获取表格数据滚动的距离
	const scrollTop = tableEl.value.$el.getElementsByClassName(scrollElClassName)[0]?.scrollTop;
	// 辅助标记 是否已经找到当前窗口需显示的第一行数据的序号
	let hasSetStartIndex = false;
	showAreaStartIndex = 0; // 显示数据的第一行序号
	showAreaEndIndex = 0; // 显示数据的最后一行序号
	// 按行高、显示区域高，寻找显示的第一行、最后一行序号
	tableDataCopy.forEach((e, i) => {
		const needShow = e._end >= scrollTop && e._start <= scrollContainerHeight + scrollTop;
		if (needShow) {
			if (!hasSetStartIndex) {
				showAreaStartIndex = i;
				hasSetStartIndex = true;
			}
			showAreaEndIndex = i;
		}
	});
	updateDataForShow(tableDataCopy, showAreaStartIndex, showAreaEndIndex);
	nextTick(()=>{
		tableEl.value?.doLayout()
	})
};
// 获取需显示的行，并在其首尾添加两个占位的空行，高度为不显示的行的行高相加
const updateDataForShow = (data: Record<string, any>[], startIndex: number, endIndex: number) => {
	const result = data.slice(startIndex, endIndex + 1);
	if (startIndex !== 0) {
		// 插入前面的占位空行
		result.unshift({
			id: "rowTop",
			_height: data[startIndex]._start
		});
	}
	if (endIndex !== data.length - 1) {
		// 插入后面的占位空行
		result.push({
			id: "rowBottom",
			_height: (data[data.length - 1]?._end || 0) - data[endIndex]?._end
		});
	}
	dataForShow.value = result;
};
onMounted(() => {
	// table滚动事件
	tableEl.value.$el.getElementsByClassName(scrollElClassName)[0]?.addEventListener("scroll", tableScrollHandler);
	// 窗口resize事件
	window.addEventListener("resize", tableScrollHandler);
});
onBeforeUnmount(() => {
	tableEl.value.$el.getElementsByClassName(scrollElClassName)[0]?.removeEventListener("scroll", tableScrollHandler);
	window.removeEventListener("resize", tableScrollHandler);
});
</script>

<style scoped lang="scss">
.ratio {
	display: flex;
	justify-content: space-around;
	justify-items: center;
}

.currDay {
	font-size: 15px;
	padding: 10px;
}

.date {
	margin-bottom: 10px;
}

.is_active {
	color: var(--el-color-primary)
}

.time-card {
	width: 100%;
	padding: 5px;
	color: #fff;
	background-color: rgba(245, 246, 247, 0.85);
	border-radius: 8px;
	overflow: hidden;
	white-space: nowrap;

	&__text {
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.schedule-list {
	height: 100%;
	display: flex;
	flex-direction: column;

	.header {
		.panel {
			padding: 16px 32px 0;
			background-color: white;
			padding-top: 100px
		}
	}

	.content {
		margin: 24px;
		position: relative;
		overflow: hidden;
		flex: 1;

		.page-table {
			position: relative;
			overflow: hidden;
			height: 100%;

			.table-container {
				position: absolute;
				top: 0;
				bottom: 56px;
				width: 100%;

				.table-component {
					width: 100%;
					border-radius: 8px;
					overflow: hidden;
					border: 1px solid var(--el-table-border-color);
				}

				:deep(.el-table__body .cell) {
					display: flex;

					.name {
						align-self: center;
						width: 100%;
					}

					& > div {
						align-self: center;
						width: 100%;
					}
				}

				.pagination {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 32px;
					margin-top: 24px;
				}
			}
		}
	}
}
</style>
