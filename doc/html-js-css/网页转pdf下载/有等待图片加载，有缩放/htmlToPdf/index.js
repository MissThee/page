import JsPDF from "jspdf"
import domToImage from 'dom-to-image-more';
import Moment from "moment/moment";
import * as Assets from './assets'

// 调整此值可以改变输出质量，越大质量越高
const reportSize = 1500 //px 540为旧版pc端1:1 750第二版1:1

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

export const nodeToPdf = (ele) => {
    return new Promise((resolve, reject) => {
        domToImage.toCanvas(ele, {
            style: {
                'font-size': `${reportSize / 10}px`,
                'width': `${reportSize}px`,
            },
        })
            .then(canvas => {
                //a4纸的尺寸[595.28, 841.89]
                const a4PDFPaperSize = {
                    w: 595.28,
                    h: 841.89,
                }
                let imgWidth = a4PDFPaperSize.w
                let imgHeight = imgWidth / canvas.width * canvas.height
                const format = [imgWidth, imgHeight]
                const pageData = canvas.toDataURL('image/jpg', 1.0)
                const jsPDF = new JsPDF('', 'pt', format, true)
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
export const allImageLoaded = (imgSrcList) => {
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
export const makeAndDownloadPDF = (node, name) => {
    const waitPromise = new Promise((resolve) => {
        setTimeout(resolve, 3000)
        // 最久等3秒，下载不完图也开始生成PDF
    })

    setTimeout(() => {
        Promise.all([waitPromise, allImageLoaded]).then(() => {
            loadingMask(true)
            // 修改缩放等级和根节点宽度，任何尺寸的web窗口生成同质量PDF
            const originFontSize = document.documentElement.style.fontSize
            document.documentElement.style.fontSize = `${reportSize / 10}px`
            document.documentElement.style.width = `${reportSize}px`
            document.documentElement.style.margin = `auto`

            setTimeout(() => {
                nodeToPdf(node)
                    .then((pdf) => {
                        pdf.save(`${name || ''}_${Moment().format('YYYY-MM-DD')}.pdf`)
                    })
                    .catch((e) => {
                        console.error('pdf生成异常', e)
                    })
                    .finally(() => {
                        // 恢复为当前移动端尺寸
                        document.documentElement.style.fontSize = originFontSize
                        document.documentElement.style.width = 'auto'
                    })
            }, 500) // 等van-image的loading动画结束。（图片已经加载完了，但组件loading效果会延迟一些消失）
        })
    })
}
