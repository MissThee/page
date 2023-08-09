import JsPDF from "jspdf"
import domToImage from 'dom-to-image-more';
import * as Assets from './assets'

const reportWidth = 1700
const reportBgColor = '#F3F5FA'
const reportPadding = '0 10px'

let maskTimer: NodeJS.Timer | null = null
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
<div style="position: fixed;z-index:10000;left:0;right:0;top:0;bottom:0;display:flex;align-items: center;justify-content: center;color:gray;font-size: 20px;background: rgba(255,255,255,0.9)">
<span>PDF生成中...</span>
<img src="${Assets.loading}" style="height: 20px" alt=""/>
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
            if (maskEl) {
                maskEl.style.pointerEvents = 'none'
            }
        }, 500)
    }
}

export const nodeToPdf = (el: HTMLElement) => new Promise((resolve, reject) => {
    loadingMask(true)
    const originWidthStyle = el.style.width
    const originPaddingStyle = el.style.padding
    const originBackgroundColorStyle = el.style.backgroundColor
    el.style.width = reportWidth + 'px'
    el.style.padding = reportPadding
    el.style.backgroundColor = reportBgColor
    window.dispatchEvent(new Event('resize'))
    setTimeout(() => {
        domToImage.toCanvas(el, {quality: 1})
            .then((canvas: HTMLCanvasElement) => {
                //a4纸的尺寸[595.28, 841.89]
                const pageWidth = 595.28
                const pageHeight = pageWidth / canvas.width * canvas.height
                const format = [pageWidth, pageHeight]
                const pageData = canvas.toDataURL('image/jpg', 1.0)
                const jsPDF = new JsPDF('', 'pt', format, true)
                jsPDF.addImage(pageData, 'JPEG', 0, 0, pageWidth, pageHeight)
                // 多页的话使用addPage增加页面，再addImage在新页面内增加内容
                // jsPDF.addPage()
                // jsPDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                resolve(jsPDF)
            })
            .catch((err: any) => reject(err))
            .finally(() => {
                el.style.width = originWidthStyle
                el.style.padding = originPaddingStyle
                el.style.backgroundColor = originBackgroundColorStyle
                window.dispatchEvent(new Event('resize'))
                setTimeout(() => {
                    loadingMask(false)
                }, 1000)
            })
    }, 500)
})
// 制作一个水印图片
const makePic = (text: string) => {
    const can = document.createElement('canvas')
    can.width = 450 // 设置水印之间的左右间距
    can.height = 350 // 设置水印之间的上下间距

    const cans = can.getContext('2d')
    if (cans) {
        cans.rotate((-20 * Math.PI) / 180)
        cans.font = '14px Vedana'
        cans.fillStyle = '#f0f0f0'
        cans.textAlign = 'left'
        cans.textBaseline = 'middle'
        cans.fillText(text, can.width / 20, can.height)
        return can.toDataURL('image/png')
    }
    return ''
}

const watermarkId = 'watermarkForPDF'
const addWaterMarkToNode = (el: HTMLElement, text: string) => {
    const watermark = document.createElement('div')
    watermark.id = watermarkId
    watermark.style.position = 'absolute'
    watermark.style.pointerEvents = 'none'
    watermark.style.top = '0'
    watermark.style.bottom = '0'
    watermark.style.left = '0'
    watermark.style.right = '0'
    watermark.style.backgroundImage = `url('${makePic(text)}')`
    watermark.style.zIndex = '10000'
    removeWaterMarkFromNode(el)
    el.append(watermark)
}

const removeWaterMarkFromNode = (el: HTMLElement) => {
    const watermarkOld = document.getElementById(watermarkId)
    if (watermarkOld) {
        el.removeChild(watermarkOld)
    }
}
// 生成、下载pdf
export const makeAndDownloadPDF = (el: HTMLElement, opt: {
    name: string,
    watermark: string
}) => {
    if (opt?.watermark) {
        addWaterMarkToNode(el, opt.watermark)
    }
    setTimeout(() => {
        nodeToPdf(el)
            .then((pdf: any) => {
                pdf.save(`${opt.name || '未命名'}.pdf`)
                ElMessage.success('PDF生成完毕，请留意浏览器下载列表')
            })
            .catch((e) => {
                console.error('pdf生成异常', e)
            })
            .finally(() => {
                removeWaterMarkFromNode(el)
            })
    })
}
