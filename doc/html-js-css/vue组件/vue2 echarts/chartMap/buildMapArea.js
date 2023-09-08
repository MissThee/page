import chinaGeo from './china.geo.json'

// interface MapGeo {
//   geometry: {
//     coordinates: any[]
//     type: 'string'
//   },
//   properties: {
//     adcode: number,
//     level: string,
//     name: string,
//   }
// }

// 合并地图区域。
// 参数
// name 新区域名字，
// contain 将哪些区域合并为此区域
// splitOpt?: { name: string, contain: string[] }[], nameMap?: Record<string, string>
export default (splitOpt, nameMap) => {
  const chinaGeoTmp = JSON.parse(JSON.stringify(chinaGeo))
  chinaGeoTmp.features.forEach((e) => {
    // 区域改名
    if (nameMap && nameMap[e.properties.name]) {
      e.properties.name = nameMap[e.properties.name]
    }
    // 裁剪海南的岛屿部分，此图不展示
    if (e.properties.name === '海南' || e.properties.name === '') {
      e.geometry.coordinates.forEach((c1) => {
        c1.forEach((c2) => {
          const tmp = c2.filter((coordinate) => {
            return coordinate[1] > 18.2
          })
          c2.length = 0
          c2.push(...tmp)
        })
      })
    }
  })

  if (!splitOpt) {
    return chinaGeoTmp
  }
  const tmp = {}

  chinaGeoTmp.features.forEach((e) => {
    const group = splitOpt.find(o => o.contain.includes(e.properties.name))
    // 找到当前区域，在哪个分割条件内
    if (group) {
      if (!tmp[group.name]) {
        tmp[group.name] = {
          geometry: {
            coordinates: [],
            type: e.geometry.type
          },
          properties: {
            adcode: e.properties.adcode,
            level: e.properties.level,
            name: group.name,
          }
        }
      }
      tmp[group.name].geometry.coordinates.push(...e.geometry.coordinates)
    } else {
      tmp[e.properties.name + '（无归属）'] = e
    }
  })

  return {type: 'FeatureCollection', features: Object.values(tmp)}
}

