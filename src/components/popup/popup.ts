// import './popup.css'    //全局css操作

let styles = require('./popup.css')     // 此引入方式可直接使用

// import styles from './popup.css'    //需要配置 popup.cc.d.ts 的声明文件

interface Ipopup {
    width?: string
    height?: string
    title?: string
    pos?: string
    mask?: boolean
    content?: (content: HTMLElement) => void
}

interface Icomponent {
    temContainer: HTMLElement
    init: () => void
    template: () => void
    handle: () => void
}

function popup(options: Ipopup) {
    return new Popup(options)
}

class Popup implements Icomponent {
    temContainer
    mask

    constructor(private settings: Ipopup) {
        //设置默认值
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            title: '',
            pos: 'center',
            mask: true,
            content: function () {}
        }, this.settings)

        this.init()
    }

    //初始化
    init() {
        this.template()
        this.settings.mask && this.createMask()
        this.handle()
        this.contentCallback()
    }

    //创建模板
    template() {
        this.temContainer = document.createElement('div')

        this.temContainer.className = styles.popup
        this.temContainer.style.width = this.settings.width
        this.temContainer.style.height = this.settings.height

        this.temContainer.innerHTML = `
            <div class="${styles['popup-title']}">
                <h3>${this.settings.title}</h3>
                <i class="iconfont icon-guanbi"></i>
            </div>
            <div class="${styles['popup-content']}"></div> 
        `
        document.body.appendChild(this.temContainer)

        if (this.settings.pos == 'left') {
            this.temContainer.style.left = 0
            this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight) + 'px'
        } else if (this.settings.pos == 'right') {
            this.temContainer.style.right = 0
            this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight) + 'px'
        } else {
            this.temContainer.style.left = (window.innerWidth - this.temContainer.offsetWidth) / 2 + 'px'
            this.temContainer.style.top = (window.innerHeight - this.temContainer.offsetHeight) / 2 + 'px'
        }

    }

    //事件绑定
    handle() {
        let popupClose = this.temContainer.querySelector(`.${styles['popup-title']} i`)

        popupClose.addEventListener('click', () => {
            document.body.removeChild(this.temContainer)
            this.settings.mask && document.body.removeChild(this.mask)
        })
    }

    createMask() {
        this.mask = document.createElement('div')

        this.mask.className = styles.mask
        this.mask.style.width = '100%'
        this.mask.style.height = document.body.offsetHeight + 'px'
        document.body.appendChild(this.mask)
    }

    contentCallback() {
        let popupContent = this.temContainer.querySelector(`.${styles['popup-content']}`)

        this.settings.content(popupContent)
    }
}

export default popup