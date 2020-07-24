let styles = require('./video.css')

interface Ivideo {
    url: string
    elem: string | HTMLElement
    width?: string
    height?: string
    autoplay?: boolean
}

interface Icomponent {
    temContainer: HTMLElement
    init: () => void
    template: () => void
    handle: () => void
}

function video(options: Ivideo) {
    return new Video(options)
}

class Video implements Icomponent {
    temContainer

    constructor(private settings: Ivideo) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            autoplay: false
        }, this.settings)

        this.init()
    }

    init() {
        this.template()
        this.handle()
    }

    template() {
        this.temContainer = document.createElement('div')

        this.temContainer.className = styles.video
        this.temContainer.style.width = this.settings.width
        this.temContainer.style.height = this.settings.height
        this.temContainer.innerHTML = `
            <video class="${styles['video-content']}" src="${this.settings.url}"></video>
            <div class="${styles['video-controls']}">
                <div class="${styles['video-progress']}">
                    <div class="${styles['video-progress-now']}"></div>
                    <div class="${styles['video-progress-suc']}"></div>
                    <div class="${styles['video-progress-bar']}"></div>
                </div>
                <div class="${styles['video-play']}">
                    <i class="iconfont icon-bofang"></i>
                </div>
                <div class="${styles['video-time']}">
                    <span>00:00</span>  /  <span>00:00</span> 
                </div>
                <div class="${styles['video-full']}">
                    <i class="iconfont icon-quanping"></i>
                </div>
                <div class="${styles['video-volume']}">
                    <i class="iconfont icon-yinliang"></i>
                    <div class="${styles['video-volprogress']}">
                        <div class="${styles['video-volprogress-now']}"></div>
                        <div class="${styles['video-volprogress-bar']}"></div>
                    </div>
                </div>

            </div>
        `

        if (typeof this.settings.elem === 'object') {
            this.settings.elem.appendChild(this.temContainer)
        } else {
            document.querySelector(`${this.settings.elem}`).appendChild(this.temContainer)
        }

    }

    handle() {
        let videoContent: HTMLVideoElement = this.temContainer.querySelector(`.${styles['video-content']}`)
        let videoControls = this.temContainer.querySelector(`.${styles['video-controls']}`)
        let videoPlay = this.temContainer.querySelector(`.${styles['video-controls']} i`)
        let videoTimes = this.temContainer.querySelectorAll(`.${styles['video-time']} span`)
        let videoFull = this.temContainer.querySelector(`.${styles['video-full']} i`)
        let videoProgress = this.temContainer.querySelectorAll(`.${styles['video-progress']} div`)
        let videoVolProgress = this.temContainer.querySelectorAll(`.${styles['video-volprogress']} div`)
        let timer

        videoContent.volume = 0.5   //设置video的初始音量大小

        // video控件 鼠标移入显示控件
        this.temContainer.addEventListener('mouseenter', () => {
            videoControls.style.bottom = 0
        })

        // video控件 鼠标移出隐藏控件
        this.temContainer.addEventListener('mouseleave', () => {
            videoControls.style.bottom = '-50px'
        })

        //监听视频是否加载完毕
        videoContent.addEventListener('canplay', () => {
            console.log('canplay')
            videoTimes[1].innerHTML = formatTime(videoContent.duration)
        })

        // 是否自动播放
        if (this.settings.autoplay) {
            timer = setInterval(playing, 1000)
            videoContent.play()
        }

        //监听视频播放
        videoContent.addEventListener('play', () => {
            videoPlay.className = 'iconfont icon-ziyuan'

            timer = setInterval(playing, 1000)
        })

        //监听视频暂停
        videoContent.addEventListener('pause', () => {
            videoPlay.className = 'iconfont icon-bofang'

            clearInterval(timer)
        })

        //播放  暂停
        videoPlay.addEventListener('click', () => {
            if (videoContent.paused) {
                videoContent.play()
            } else {
                videoContent.pause()
            }
        })

        // 全屏
        videoFull.addEventListener('click', () => {
            videoContent.requestFullscreen()
        })

        // 监听video播放进度条小球的 鼠标事件
        videoProgress[2].addEventListener('mousedown', function (ev: MouseEvent) {
            let downX = ev.pageX
            let downL = this.offsetLeft

            // 拖动鼠标
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth

                if (scale < 0) {
                    scale = 0
                } else if (scale > 1) {
                    scale = 1
                }

                videoProgress[0].style.width = scale * 100 + '%'
                videoProgress[1].style.width = scale * 100 + '%'
                this.style.left = scale * 100 + '%'

                videoContent.currentTime = scale * videoContent.duration
            }

            // 拖动结束
            document.onmouseup = (ev: MouseEvent) => {
                document.onmousemove = document.onmouseup = null
            }

            ev.preventDefault()
        })

        // 监听video音量进度条小球的 鼠标事件
        videoVolProgress[1].addEventListener('mousedown', function (ev: MouseEvent) {
            let downX = ev.pageX
            let downL = this.offsetLeft

            // 拖动鼠标
            document.onmousemove = (ev: MouseEvent) => {
                let scale = (ev.pageX - downX + downL + 8) / this.parentNode.offsetWidth
              
                if (scale < 0) {
                    scale = 0
                } else if (scale > 1) {
                    scale = 1
                }

                videoVolProgress[0].style.width = scale * 100 + '%'
                this.style.left = scale * 100 + '%'

                videoContent.volume = scale
            }

            // 拖动结束
            document.onmouseup = (ev: MouseEvent) => {
                document.onmousemove = document.onmouseup = null
            }

            ev.preventDefault()
        })

        // 格式化时间
        function formatTime(number: number): string {
            let timeNumber = Math.round(number)
            let min = Math.floor(timeNumber / 60)
            let sec = timeNumber % 60

            return setZero(min) + ':' + setZero(sec)
        }

        // 时间补0
        function setZero(number: number) {
            return number < 10 ? '0' + number : '' + number
        }

        //正在播放中
        function playing() {
            let scale = videoContent.currentTime / videoContent.duration
            let scaleSuc = videoContent.buffered.end(0) / videoContent.duration

            videoTimes[0].innerHTML = formatTime(videoContent.currentTime)
            videoProgress[0].style.width = scale * 100 + '%'
            videoProgress[1].style.width = scaleSuc * 100 + '%'
            videoProgress[2].style.left = scale * 100 + '%'
        }
    }
}

export default video