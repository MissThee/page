export const chartWordCloudDataConvert = (data?: any) => {
  return data?.map((e: any) => ({name: e.kpi_name, value: Number(e.kpi_number) || 0})) || []
}