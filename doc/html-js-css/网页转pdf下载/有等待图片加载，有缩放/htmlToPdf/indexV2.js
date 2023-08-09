import JsPDF from "jspdf"
import domToImage from 'dom-to-image-more';
import Moment from "moment/moment";
import * as Assets from './assets'


let maskTimer = null
export const loadingMask = (isShow = false) => {
    if (maskTimer !== null) {
        clearTimeout(maskTimer)
        maskTimer = null
    }
    let maskEl = document.getElementById('loadingMask')
    if (!maskEl) {
        maskEl = document.createElement('div')
        maskEl.id = 'loadingMask'
        maskEl.style.transition = 'opacity 0.5s ease-out'
        maskEl.innerHTML = `
<div style="position: fixed;left:0;right:0;top:0;bottom:0;display:flex;align-items: center;justify-content: center;color:gray;font-size: 30px;background: rgba(255,255,255,0.9)">
<span>报告生成中...</span>
<img src="${Assets.loading}" style="height: 30px" alt=""/>
</div>
`
        document.body.append(maskEl)
    }
    if (isShow) {
        maskEl.style.transition = 'none'
        maskEl.style.opacity = '1'
        maskEl.style.pointerEvents = 'auto'
    } else {
        maskEl.style.transition = 'opacity 0.5s ease-out'
        maskEl.style.opacity = '0'
        maskTimer = setTimeout(() => {
            maskEl.style.pointerEvents = 'none'
        }, 500)
    }
}

export const nodeToPdf = (ele, scale) => {
    return new Promise((resolve, reject) => {
        domToImage.toCanvas(ele, {
            style: {},
        })
            .then(canvas => {
                const originWidth = 10 * 37.5
                const imgWidth = originWidth
                const imgHeight = imgWidth / canvas.width * canvas.height
                const format = [imgWidth, imgHeight]
                const pageData = canvas.toDataURL('image/jpg', 1.0)
                const jsPDF = new JsPDF('', 'px', format, true)
                jsPDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                // 多页的话使用addPage增加页面，再addImage在新页面内增加内容
                // jsPDF.addPage()
                // jsPDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                resolve(jsPDF)
            })
            .catch((err) => reject(err))
            .finally(() => {
                loadingMask(false)
            })
    })
}

// 等待当前页面所有图片下载完
const allImageLoaded = (imgSrcList) => {
    imgSrcList = imgSrcList || Array.from(document.getElementsByTagName('img')).map(e => e.src)
    if (!imgSrcList || imgSrcList.length === 0) {
        return Promise.resolve()
    } else {
        const imgLoadPromiseArr = []
        imgSrcList.forEach(src => {
            const imgLoadPromise = new Promise((resolve) => {
                const img = new Image()
                img.src = src
                img.onload = () => {
                    resolve()
                }
            })
            imgLoadPromiseArr.push(imgLoadPromise)
        })
        return Promise.all(imgLoadPromiseArr)
    }
}

// 生成、下载pdf
export const makeAndDownloadPDFV2 = (node, name, reportScale = 1) => {

    const waitPromise = new Promise((resolve) => {
        setTimeout(resolve, 3000)
        // 最久等3秒，下载不完图也开始生成PDF
    })
    return Promise.any([waitPromise, allImageLoaded()]).then(() => {
        setTimeout(() => {
            loadingMask(true)
            // 修改缩放等级和根节点宽度，任何尺寸的web窗口生成同质量PDF
            const originFontSize = document.documentElement.style.fontSize
            document.documentElement.style.fontSize = `${reportScale * 37.5 / window.devicePixelRatio}px`

            setTimeout(() => {
                nodeToPdf(node, reportScale)
                    .then((pdf) => {
                        pdf.save(`${name || ''}_${Moment().format('YYYY-MM-DD')}.pdf`)
                    })
                    .catch((e) => {
                        console.error('pdf生成异常', e)
                    })
                    .finally(() => {
                        // 恢复为当前移动端尺寸
                        document.documentElement.style.fontSize = originFontSize
                    })
            }, 500) // 等van-image的loading动画结束。（图片已经加载完了，但组件loading效果会延迟一些消失）
        })
    })
}
