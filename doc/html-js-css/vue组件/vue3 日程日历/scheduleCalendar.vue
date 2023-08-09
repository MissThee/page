<template>
	<div class="schedule-calendar">
		<div class="wrapper" ref="wrapperEl">
			<div class="header" ref="headerEl">
				<div class="header__cell" :style="{height:headerHeight+'px',width:leftSideWidth+'px',borderRightColor:splitLineColor}"></div>
				<template v-for="(column,columnIndex) in data" :key="columnIndex">
					<div class="header__cell" :style="{height:headerHeight+'px',width:columnWidth+'px',borderRightColor:splitLineColor}">
						<div class="header__cell__text">{{ column.title }}</div>
					</div>
				</template>
			</div>
			<div class="side" ref="sideEl" :style="{width:leftSideWidth+'px',top:headerHeight+'px'}">
				<template v-for="(hour,index) in dateLineArr" :key="hour">
					<div class="side__cell" :style="{height:dateLineArr.length===index+1?'': (hourHeight*step+'px'),borderTopColor:splitLineColor}">
						<div class="side__cell__text" :style="{marginTop:dateLineArr.length===index+1?'-1.5em':'',width:leftSideWidth+'px'}">{{ getTimeStrByHour(hour) }}</div>
					</div>
				</template>
			</div>
			<div class="content" ref="contentEl" :style="{left:leftSideWidth+'px',top:headerHeight+'px'}">
				<el-scrollbar style="height: 100%;" @scroll="scrollHandler">
					<div class="column-wrapper" :style="{height: hourHeight * (timeEnd-timeStart) + 'px',minWidth:data.length*columnWidth+'px'}">
						<div class="backdrop">
							<template v-for="(hour,index) in dateLineArr" :key="hour">
								<div style="border-top: 1px solid;width: 100%" :style="{height:dateLineArr.length===index+1?'': (hourHeight*step+'px'),borderTopColor:splitLineColor}" />
							</template>
						</div>
						<template v-for="(column,columnIndex) in data" :key="columnIndex">
							<div class="column" :style="{width: columnWidth+'px',borderRight:'1px solid '+splitLineColor}">
								<template v-for="(item) in column.data" :key="item.service_id">
									<!--	此处暂用两个el-popover弹出组件，仅弹出框位置不同，互相隐藏，实现弹出框总靠近中间。依靠监听鼠标位置，改变popoverPlacement参数触发隐藏		-->
									<el-popover :ref="popoverRefSet" trigger="click" placement="right" transition="none" width="400">
										<div class="schedule-popover-pad">
											<div class="text">{{ item.appointment_time ? item.appointment_time.substring(0, 16) : "" }}</div>
											<div class="text">{{ item.service_status_str }}</div>
											<div class="text title">服务内容</div>
											<div class="text">{{ item.target_name }}</div>
											<div class="text title">上门地址</div>
											<div class="text">{{ item.address }}</div>
											<div class="text title">工程师</div>
											<div class="text">{{ item.engineer_name }}</div>
											<div style="color: blue;cursor: pointer" @click="showDetailHandler(item.service_id)">查看服务单</div>
										</div>
										<template #reference>
											<div class="info-card" v-show="popoverPlacement==='right'" :style="{top:getCardPositionByStartTimeStr(item.start_time)+'px',height:Number(item.service_time) * hourHeight+'px'}">
												<div class="info-card__bg" />
												<div class="info-card__content">
													<div>{{ item.target_name }}</div>
													<div style="height: 10px" />
													<div>{{ item.address }}</div>
													<div style="height: 10px" />
													<div>{{ item.engineer_name }}</div>
												</div>
											</div>
										</template>
									</el-popover>
									<el-popover :ref="popoverRefSet" trigger="click" placement="left" transition="none" width="400">
										<div class="schedule-popover-pad">
											<div class="text">{{ item.appointment_time ? item.appointment_time.substring(0, 16) : "" }}</div>
											<div class="text">{{ item.service_status_str }}</div>
											<div class="text title">服务内容</div>
											<div class="text">{{ item.target_name }}</div>
											<div class="text title">上门地址</div>
											<div class="text">{{ item.address }}</div>
											<div class="text title">工程师</div>
											<div class="text">{{ item.engineer_name }}</div>
											<div style="color: blue;cursor: pointer" @click="showDetailHandler(item.service_id)">查看服务单</div>
										</div>
										<template #reference>
											<div class="info-card" v-show="popoverPlacement==='left'" :style="{top:getCardPositionByStartTimeStr(item.start_time)+'px',height:Number(item.service_time) * hourHeight+'px'}">
												<div class="info-card__content">
													<div>{{ item.target_name }}</div>
													<div style="height: 10px" />
													<div>{{ item.address }}</div>
													<div style="height: 10px" />
													<div>{{ item.engineer_name }}</div>
												</div>
											</div>
										</template>
									</el-popover>
								</template>
							</div>
						</template>
					</div>
				</el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, defineProps, PropType, toRefs, onBeforeUpdate, onUnmounted, onMounted, nextTick, watch } from "vue";
import * as ScheduleApi from "src/api/schedule";
import { useRouter } from "vue-router";
// export interface ScheduleData {
// 	title: string;
// 	data: {
// 		service_id: number, // 服务单id
// 		start_time: string, // 开始时间 yyyy-MM-dd HH:mm （决定日程卡片位置）
// 		end_time: string, // 结束时间 yyyy-MM-dd HH:mm
// 		service_time: string, // 服务时长 （决定日程卡片高度）
// 		appointment_time: string, // 服务时间点
// 		service_status_str: string, // 服务状态
// 		target_name: string,// 任务内容
// 		address: string, // 地点
// 		engineer_name: string, // 工程师姓名
// 	}[];
// }

const leftSideWidth = 70;
const headerHeight = 50;

const splitLineColor = "#DCDCDC";
const hourHeight = 200;
const columnWidth = 200;
const timeStart = 8; // 小时
const timeEnd = 20; // 小时
const step = 0.5; // 小时

const props = defineProps({
	data: Array as PropType<ScheduleApi.ScheduleData[]>
});
const { data } = toRefs(props);

const getHourByTimeStr = (timeStr: string) => { // "8:30" 转为 8.5
	const splitStrArr = timeStr?.split(":");
	try {
		if (splitStrArr.length === 2) {
			const hour = Number.parseInt(splitStrArr[0], 10);
			const minute = Number.parseInt(splitStrArr[1], 10);
			return hour + minute / 60;
		} else {
			return 0;
		}
	} catch (e) {
		console.error("getHourByTimeStr 出错", e);
		return 0;
	}
};

const getTimeStrByHour = (hour: number) => { // 8.5 转为 "8:30"
	try {
		const hourNum = Math.floor(hour);
		const minuteNum = (hour * 10) % 10 * 60 / 10;
		return hourNum + ":" + (minuteNum < 10 ? "0" : "") + minuteNum;
	} catch (e) {
		console.error("getTimeStrByHour 出错", e);
		return "";
	}
};

const getCardPositionByStartTimeStr = (str: string) => { // 获取卡片起始位置
	const cardStartTime = getHourByTimeStr(str);
	if (cardStartTime) {
		return (cardStartTime - timeStart) * hourHeight;
	}
	return 0;
};


const dateLineArr = ref<number[]>([]); // 构建时间间隔数据
for (let i = timeStart; i <= timeEnd; i += step) {
	dateLineArr.value.push(i);
}
const sideEl = ref<HTMLDivElement>();
const headerEl = ref<HTMLDivElement>();
const contentEl = ref<HTMLDivElement>();
const popoverListRef = ref<any>([]);
const popoverPlacement = ref<string>("right");
let popoverIndex = 0;

onBeforeUpdate(() => {
	popoverIndex = 0;
	popoverListRef.value = [];
});
const popoverRefSet = (el: HTMLDivElement) => {
	if (el) popoverListRef.value[popoverIndex++] = el;
};
const hidePopover = () => {
	popoverListRef.value?.forEach((el: any) => {
		el?.hide?.();
	});
};
const scrollHandler = (e: { scrollTop: number, scrollLeft: number }) => {
	console.log("滚动", e);

	sideEl.value?.scrollTo({ top: e.scrollTop });
	headerEl.value?.scrollTo({ left: e.scrollLeft });
	hidePopover();
};
window.addEventListener("resize", hidePopover);
onUnmounted(() => {
	window.removeEventListener("resize", hidePopover);
});
const contentClickHandler = (e: Event) => {
	if (e instanceof PointerEvent || e instanceof MouseEvent) {
		// console.log(popoverPlacement.value);
		popoverPlacement.value = e.clientX - 255 > (contentEl.value?.clientWidth || 0) / 2 ? "left" : "right";
	}
};
onMounted(() => {
	contentEl.value?.addEventListener("click", contentClickHandler);
	contentEl.value?.addEventListener("mousemove", contentClickHandler);
});
onUnmounted(() => {
	contentEl.value?.removeEventListener("click", contentClickHandler);
	contentEl.value?.removeEventListener("mousemove", contentClickHandler);
});
const router = useRouter();
const showDetailHandler = (serviceId: number) => {
	router.push({ path: "/engineerManage/orderDetail", query: { id: serviceId } });
	hidePopover();
};
// 不改变一下大小，横向滚动条不显示，无法横向滚动
watch(() => data?.value?.length, () => {
	setTimeout(() => {
		if (contentEl.value) {
			contentEl.value.style.width = contentEl.value.clientWidth - 1 + "px";
		}
		setTimeout(() => {
			if (contentEl.value) {
				contentEl.value.style.width = "";
			}
		}, 100);
	}, 500);
});
// //测试数据
// const data = [
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "8:00",
// 				"end_time": "10:00",
// 				"service_time": "2.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:30",
// 				"end_time": "12:30",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	},
// 	{
// 		"title": "徐佳孟",
// 		"data": [
// 			{
// 				"service_id": 2,
// 				"start_time": "9:00",
// 				"end_time": "10:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			},
// 			{
// 				"service_id": 3,
// 				"start_time": "11:00",
// 				"end_time": "12:00",
// 				"service_time": "1.00",
// 				"appointment_time": "2022-02-17 10:00:00",
// 				"service_status_str": "待指派",
// 				"target_name": null,
// 				"address": "22北京天安门",
// 				"engineer_name": "徐佳孟(协助工程师)"
// 			}
// 		]
// 	}
//
// ];

</script>

<style scoped lang="scss">
.schedule-calendar {
	background-color: white;
	position: relative;
	overflow: hidden;
	height: 100%;

	.wrapper {
		background-color: #F4F4F4;
		overflow: hidden;
		position: relative;
		height: 100%;

		.header {
			white-space: nowrap;
			overflow: hidden;
			position: relative;

			&__cell {
				position: relative;
				display: inline-block;
				vertical-align: top;
				border-right: 1px solid;

				&__text {
					white-space: pre-wrap;
					position: absolute;
					width: 80%;
					left: 50%;
					top: 50%;
					text-align: center;
					transform: translate(-50%, -50%);
					word-break: break-all
				}
			}
		}

		.side {
			position: absolute;
			left: 0;
			bottom: 0;
			overflow: hidden;

			&__cell {
				vertical-align: top;
				border-top: 1px solid;

				&__text {
					text-align: center;
					font-weight: bold;
					color: #666;
				}
			}
		}

		.content {
			position: absolute;
			overflow: hidden;
			top: 0;
			bottom: 0;
			right: 0;
			background-color: white;

			.column-wrapper {
				white-space: nowrap;
				position: relative;

				.backdrop {
					position: absolute;
					top: 0;
					bottom: 0;
					right: 0;
					left: 0;
				}

				.column {
					display: inline-block;
					position: relative;
					vertical-align: top;
					height: 100%;
				}
			}
		}

	}


	.info-card {
		position: absolute;
		cursor: pointer;
		width: 100%;
		overflow: auto;
		border-left: 4px solid #407891;
		padding: 10px;
		color: #407891;
		background-color: rgba(245, 246, 247, 0.85);
		border-radius: 10px;

		&__content {
			overflow: auto;
			white-space: pre-wrap;
			position: relative;
		}

		&:hover {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
			z-index: 1000;
			background-color: rgba(195, 214, 224, 0.85);

		}
	}
}

.schedule-popover-pad {
	max-width: 300px;
	padding: 5px;

	.text {
		margin-bottom: 8px;
		color: #333;
	}

	.title {
		color: #aaa;
	}
}


</style>
