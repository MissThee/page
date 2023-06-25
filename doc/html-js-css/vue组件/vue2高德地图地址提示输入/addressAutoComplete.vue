<template>
	<el-autocomplete
		class="address-auto-complete"
		v-model="placeData.value"
		:fetch-suggestions="cityAreaAutoSearch"
		placeholder="请输入"
		@select="cityAreaCompleteSelectHandler"
		@blur="cityAreaCompleteBlurHandler"
		@change="cityAreaCompleteChangeHandler"
		:type="autoSize?'input':'textarea'"
		:autoSize="autoSize"
	/>
</template>

<script lang="ts" setup>
export interface AreaItem {
	value: string,
	lng?: number,
	lat?: number
}

// 地址补全
import { ref, defineProps, defineEmits, PropType, watch } from "vue";

const props = defineProps({
	searchCity: String,
	modelValue: Object as PropType<AreaItem>,
	autoSize: Boolean
});

const placeData = ref<AreaItem>({ value: "" });

watch(() => props.modelValue, (newVal) => {
	placeData.value = newVal?.value ? JSON.parse(JSON.stringify(newVal)) : { value: "" };
}, { deep: true, immediate: true });

let cityAreaSelectedItem: AreaItem | undefined = undefined; // 当前选中的地址项
let cityAreaFirstItem: AreaItem | undefined = undefined; // 当前提示列表第一项
const AMap = (window as any).AMap;
const cityAreaAutoSearch = (queryString: string, cb: any) => {
	if (!queryString.trim()) {
		cityAreaFirstItem = undefined;
		cb([]);
	} else {
		AMap.plugin("AMap.AutoComplete", () => {
			// console.log("搜索城市",  props.searchCity);
			const autoComplete = new AMap.AutoComplete({ city: props.searchCity || "全国" });
			autoComplete.search(queryString.trim(), function(status: string, result: { info: string, tips: { id: string, name: string, district: string, location: { lng: number, lat: number } }[] }) {
				if (status === "complete" && result?.info === "OK") {
					const resultList = result.tips
						.filter(e => e.location)// 过滤掉没有经纬度的
						.map(e => {
							// 将描述和名字中间重复的文字剔除，构建选项列表
							let districtCutIndex = null;
							for (let i = Math.min(e.district.length, e.name.length); i > 0; i--) {
								const suffixText = e.name.substring(0, i);
								if (e.district.endsWith(suffixText)) {
									districtCutIndex = i;
								}
							}
							// console.log(e.district, e.name);
							const valueTmp = districtCutIndex === null ? (e.district + e.name) : (e.district + e.name.substring(districtCutIndex));
							return {
								id: e.id,
								value: valueTmp,
								lng: e.location.lng,
								lat: e.location.lat
							};
						});
					cityAreaFirstItem = resultList[0];
					cb(resultList);
				}
			});
		});
	}
};
const emit = defineEmits(["update:modelValue"]);
const cityAreaCompleteSelectHandler = (item: AreaItem) => {
	// 选中提示项时，记录当前选中项，给表单内容赋值
	cityAreaSelectedItem = item;
	placeData.value = cityAreaSelectedItem ? JSON.parse(JSON.stringify(cityAreaSelectedItem)) : { value: "" };
	emit("update:modelValue", placeData.value?.value ? placeData.value : undefined);
};
const cityAreaCompleteBlurHandler = () => {
	// 未选中 失去焦点 自动选择第一个
	if (!cityAreaSelectedItem) {
		cityAreaSelectedItem = cityAreaFirstItem;
	}
	placeData.value = cityAreaSelectedItem ? JSON.parse(JSON.stringify(cityAreaSelectedItem)) : { value: "" };
	emit("update:modelValue", placeData.value?.value ? placeData.value : undefined);
};
const cityAreaCompleteChangeHandler = () => {
	cityAreaSelectedItem = undefined;
};
</script>

<style scoped>

</style>
