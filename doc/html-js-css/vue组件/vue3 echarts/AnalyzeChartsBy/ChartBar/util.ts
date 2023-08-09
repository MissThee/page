export const barDataConvert = (data: { kpi_name: string[], total_number: number[] }) => ({
  labels: data.kpi_name || [],
  values: data.total_number || []
})

export const barDataConvert_1 = (data: { name: string[], value: number[] }) => ({
  labels: data.name || [],
  values: data.value?.map(e => e || 0) || []
})

