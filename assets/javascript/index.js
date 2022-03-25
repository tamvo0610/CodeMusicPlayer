var $id = document.getElementById.bind(document),
    $class = document.getElementsByClassName.bind(document),
    $tag = document.getElementsByTagName.bind(document),
    $ = document.querySelector.bind(document),
    $$ = document.querySelectorAll.bind(document)
const 
    headerH2= $("header > h2"),
    cdThumb = $(".cd-thumb"),
    audio = $("audio"),
    cd = $(".cd"),
    currentTime = $(".currenttime-song"),
    durationTime = $(".duration-song"),
    rangeBar = $("input[id=progress]")
const PlAYER_STORAGE_KEY = "MUSIC_APP";
const app = {
    // sliderIndex: 0,
    songsData : [
        {
            background: './assets/img/songs/0.webp',
            name: 'Anh Đã Lạc Vào',
            singer: 'Green, Đại Mèo Remix',
            pathSong: './assets/music/list-song/0.mp3'
        },
        {
            background: './assets/img/songs/1.webp',
            name: 'Chạy Về Khóc Với Anh',
            singer: 'Erik, Duzme Remix',
            pathSong: './assets/music/list-song/1.mp3'
        },
        {
            background: './assets/img/songs/2.jpeg',
            name: 'Sẵn Sàng Yêu Em Đi Thôi',
            singer: 'Woni, Minh Tú, Đại Mèo Remix',
            pathSong: './assets/music/list-song/2.mp3'
        },
        {
            background: './assets/img/songs/3.webp',
            name: 'Gieo Quẻ',
            singer: 'Hoàng Thuỳ Linh, ĐEN, Orinn Remix',
            pathSong: './assets/music/list-song/3.mp3'
        },
        {
            background: './assets/img/songs/4.webp',
            name: 'Vui Lắm Nha',
            singer: 'Hương Ly, Jombie, RIN Music Remix',
            pathSong: './assets/music/list-song/4.m4a'
        },
        {
            background: './assets/img/songs/5.webp',
            name: 'Lưu Số Em Đi',
            singer: 'Huỳnh Văn, V.P. Tiên, Đại Mèo Remix',
            pathSong: './assets/music/list-song/5.m4a'
        },
        {
            background: './assets/img/songs/6.webp',
            name: 'Như Một Người Dưng',
            singer: 'Nguyễn Thạc Bảo Ngọc, Remix',
            pathSong: './assets/music/list-song/6.mp3'
        },
        {
            background: './assets/img/songs/13.webp',
            name: '2 Phút Hơn',
            singer: 'Phao, KAIZ Remix',
            pathSong: './assets/music/list-song/13.m4a'
        },
        {
            background: './assets/img/songs/8.jpg',
            name: 'Tình Yêu Ngủ Quên',
            singer: 'Hoàng Tôn, LyHan, Orinn Remix',
            pathSong: './assets/music/list-song/8.mp3'
        },
        {
            background: './assets/img/songs/12.webp',
            name: 'Ánh mắt ta chạm nhau',
            singer: 'Ngô Lan Hương, Đại Mèo remix',
            pathSong: './assets/music/list-song/12.m4a'
        }
    ],
    currentIndex: 0,
    isPlay: false,
    isRepeat: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PlAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songsData[this.currentIndex]
            }
        })
    },
    renderSong: function(){
        var htmlBody = this.songsData.map(function(song, index){
            return `
                            <div class="song ${index === app.currentIndex ? "active":""}" data-index = ${index}>
                                <div class="thumb" style="background-image: url('${song.background}')"></div>
                                <div class="body">
                                    <h3 class="title">${song.name}</h3>
                                    <p class="author">${song.singer}</p>
                                </div>
                                <div class="option">
                                    <i class="fas fa-ellipsis-h"></i>
                                </div>
                            </div>
                    `
        })
        $(".playlist").innerHTML = htmlBody.join("")
    },
    loadCurrentSong: function(){
        const inThis = this
        // let currentSong = this.songsData[this.currentIndex]
        headerH2.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.background}")`
        audio.src = this.currentSong.pathSong
        setInterval(function(){
            const {duration,currentTime} = audio
            if(!duration){
                $(".duration-song").textContent = "00:00"
            } else {
                $(".duration-song").textContent = inThis.formatTimer(audio.duration)
            }          
                $(".currenttime-song").textContent = inThis.formatTimer(audio.currentTime)
        },1)
    },
    handleEvents: function(){
        const inThis = this
        // Xử lý CD thumb xoay tròn
        cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],
            {
                duration: 10000,
                iterations: Infinity
            })
        // Xử lý ảnh bài hát khi scroll)
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollWidth = window.scrollY
            let newWidth = cdWidth - scrollWidth
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0
            cd.style.opacity = newWidth / cdWidth
        }
        // Render btn Play khi song playing
        audio.onplay = function(){
            inThis.isPlay = true
            $(".player").classList.add("playing")
            inThis.renderSong()
        }
        // Render btn Play khi song pausing
        audio.onpause = function(){
            inThis.isPlay = false
            $(".player").classList.remove("playing")
        }
        // Play BTN
        $(".btn-toggle-play").onclick = function(){
            if(!inThis.isPlay){
                audio.play()
            } else {
                audio.pause()
            }
        }
        // Prev BTN
        $(".btn-prev").onclick = function(){
            if(inThis.isRandom){
                inThis.randomSong()  
            } else {
                inThis.prevSong()
            }
            audio.play()
        }
        // Next BTN
        $(".btn-next").onclick = function(){
            if(inThis.isRandom){
                inThis.randomSong()  
            } else {
                inThis.nextSong() 
            }
            audio.play()
            
        }
        // Tự động next bài khi end
        audio.onended = function(){
            if(inThis.isRepeat){
                audio.play()
            } else {
                $(".btn-next").click() 
            }
        }
        
        // Repeat BTN
        $(".btn-repeat").onclick = function(){
            inThis.isRepeat = !inThis.isRepeat
            $(".btn-repeat").classList.toggle("active", inThis.isRepeat)
            inThis.setConfig('isRepeat',inThis.isRepeat)
            // audio.loop = inThis.isRepeat // Gán boolen cho loop để repeat bài hát
        }
        // Random BTN
        $(".btn-random").onclick = function(){
            inThis.isRandom = !inThis.isRandom
            $(".btn-random").classList.toggle("active", inThis.isRandom)
            inThis.setConfig('isRandom',inThis.isRandom)
        }    
        // Thanh Remain
        audio.ontimeupdate = function(){
            if(audio.duration){          
                rangeBar.max = audio.duration
                rangeBar.value = audio.currentTime
            }
        }
        rangeBar.onchange = function(){
            audio.currentTime = rangeBar.value
        } 
        // Audio
        $("input[id=volume]").onchange = function(e){
            audio.volume = e.target.value/100
        }
        // Lắng nghe khi click vào playsist
        // $(".playlist").onclick = function(e){
        //     const songNode = e.target.closest(".song:not(.active)")
        //     console.log(songNode)
        //     if( songNode || e.target.closest(".option")){
        //         if(songNode){
        //             console.log(songNode.dataset.index)
        //         }
        //     }
        // }
    
        $(".playlist").onclick = function(e){
                const condition1 = e.target.closest(".song:not(.active)"),
                        condition2 = e.target.closest(".option")
                if( condition1 || condition2){
                    if(condition1){
                        let newIndex = Number(condition1.getAttribute("data-index"))
                        inThis.currentIndex = newIndex
                        inThis.loadCurrentSong()
                        inThis.renderSong()
                        audio.play()
                    }
                    
                }  
                
            }
            // myloadCurrentSong: function(){
    //     this.songsData.forEach(function(data, index){
    //         // console.log(data)
    //         // console.log($$(".song")[index])
    //         $$(".song")[index].onclick = function(){
    //             currentIndex = index
    //             console.log(currentIndex)
               
    //         }
    },
    /* ------------------------------------- FUNCTION */
    formatTimer: function(number){
        const minute = Math.floor(number/60)
        const second = Math.floor(number - minute * 60)
        return `${minute < 10 ? "0" + minute: minute}:${second < 10 ? "0" + second: second}`
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songsData.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songsData.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songsData.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    start: function(){
        this.loadConfig()
        // Định nghĩa các thuộc tính
        this.defineProperties()
        // Render
        this.renderSong()
        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong()
        // Lắng nghe sự kiện DOM
        setInterval(this.displayTimer,500)
        this.handleEvents()
        
        $(".btn-random").classList.toggle("active", this.isRandom)
        $(".btn-repeat").classList.toggle("active", this.isRepeat)
    }
}
app.start()