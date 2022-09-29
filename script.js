const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const MUSIC_KEY_STORAGE = "music_key_storage"
const player = $(".player")
const playist = $(".playist")
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const btn_toggle_play = $(".btn-toggle-play")
const input_range = $("#progress")
const btn_prev = $(".btn-prev")
const btn_next = $(".btn-next")
const btn_random = $(".btn-random")
const btn_repeat = $(".btn-repeat")
const volume_btn=$(".volume-btn")
const input_volume_range=$("#volume-progress")


const apps = {
    currentIndex: 0,
    isPlaying: false,
    isRandomActive: false,
    isRepeatActive: false,
    songsPlayedIndex: [],
    config:JSON.parse(localStorage.getItem(MUSIC_KEY_STORAGE)) || {},
    setConfig:function(key,value) {
        this.config[key]=value
        localStorage.setItem(MUSIC_KEY_STORAGE,JSON.stringify(this.config))
    },
    songs: [
        {
            name: "2AM",
            singer: "Justatee,Bigdaddy",
            path: "assets/mp3/2am_justatee_feat_big_daddy_official_audio_-8582028439297247043.mp3",
            img: "assets/img/img_music_thumb/2am.jpg"
        },
        {
            name: "Thằng điên",
            singer: "Phương Ly,Justatee",
            path: "assets/mp3/thang_dien_justatee_x_phuong_ly_official_mv_-5252447269763228750.mp3",
            img: "assets/img/img_music_thumb/thang_dien.jpg"
        },
        {
            name: "Crying over you",
            singer: "Justatee,Binz",
            path: "assets/mp3/official_mv_crying_over_you_justatee_ft_binz_9102404064129707087.mp3",
            img: "assets/img/img_music_thumb/crying_over_you.jpg"
        },
        {
            name: "Mượn rượu tỏ tình",
            singer: "Bigdaddy,Emily",
            path: "assets/mp3/bigdaddy_x_emily_muon_ruou_to_tinh_official_m_v_303406714030861356.mp3",
            img: "assets/img/img_music_thumb/muon_ruou_to_tinh.jpg"
        },
        {
            name: "Missing you",
            singer: "Phương Ly",
            path: "assets/mp3/missing_you_phuong_ly_x_tinle_official_mv_5184998834266387300.mp3",
            img: "assets/img/img_music_thumb/missing_you.jpg"
        },
        {
            name: "Cứ chill thôi",
            singer: "Ban nhạc Chillies",
            path: "assets/mp3/cu_chill_thoi_chillies_official_music_video_ft_suni_ha_linh_rhymastic_-4235708996696670221.mp3",
            img: "assets/img/img_music_thumb/cu_chill_thoi.jpg"
        },
        {
            name: "Và thế là hết",
            singer: "Ban nhạc Chillies",
            path: "assets/mp3/va_the_la_het_chillies_original_-5107837588992506370.mp3",
            img: "assets/img/img_music_thumb/va_the_la_het.jpg"
        },
        {
            name: "Head in the clouds",
            singer: "Hayd",
            path: "assets/mp3/hayd_head_in_the_clouds_official_video_-1594529789864831455.mp3",
            img: "assets/img/img_music_thumb/head_in_the_clouds.jpg"
        },
        {
            name: "Dancing with your ghost",
            singer: "Sasha Sloan",
            path: "assets/mp3/sasha_sloan_dancing_with_your_ghost_lyric_video_-6966707709794171105.mp3",
            img: "assets/img/img_music_thumb/dancint_with_your_ghost.jpg"
        },
        {
            name: "Let me down slowly",
            singer: "Alec Benjamin",
            path: "assets/mp3/alec_benjamin_let_me_down_slowly_official_music_video_-7584434187561496167.mp3",
            img: "assets/img/img_music_thumb/let_me_down_slowly.jpg"
        }
        
    ],
    // Render the playist song
    render: function () {
        let htmls = ''
        this.songs.forEach(function (song, index) {
            htmls += `
            <div class="song" data-index="${index}">
                <div class="thumb"
                     style="background-image:url(${song.img})"
                >
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="sound-wave">
                    <div class="sound-wave-item"> 
                    </div>
                    <div class="sound-wave-item"> 
                    </div>
                    <div class="sound-wave-item"> 
                    </div>
                </div>
           </div>
            `
        })
        playist.innerHTML = htmls
    },
    // Add the property to object App
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        // create Animation for rotating Cd Thumb
        const animateCdThumb = cdThumb.animate(
            [
                {
                    transform: "rotate(0)"
                },
                {
                    transform: "rotate(360deg)"
                }
            ],
            {
                duration: 4000,
                iterations: Infinity
            }
        )
        animateCdThumb.pause()

        // Xử lí phóng to, thu nhỏ khi kéo danh sách bài hát
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            const decreasePercent = newCdWidth / cdWidth
            if (newCdWidth >= 0) {
                cd.style.width = `${newCdWidth}px`
                cd.style.opacity = `${decreasePercent}`
            }
            else {
                cd.style.width = '0px'
                cd.style.opacity = '0'
            }
        }
        // Xử lí khi click play hoặc pause
        btn_toggle_play.onclick = () => {
            if (this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        //Khi audio play/pause
        audio.onplay = () => {
            animateCdThumb.play()
            this.isPlaying = true
            player.classList.add("playing")
        }
        audio.onpause = () => {
            animateCdThumb.pause()
            this.isPlaying = false
            player.classList.remove("playing")
        }

        //Khi tiến độ bài hát thay đổi
        const onTimeUpdate = () => {
            const currentTime = audio.currentTime
            const duration = audio.duration
            const runningPercent = currentTime / duration
            if (runningPercent) {
                input_range.value = input_range.max * runningPercent
            }
        }
        audio.ontimeupdate = onTimeUpdate


        // Xử lí khi tua song
        input_range.oninput = () => {
            const inputRangePercent = input_range.value / input_range.max
            const currentSecond = inputRangePercent * audio.duration
            audio.ontimeupdate = () => {
            }
            input_range.onmouseup = () => {
                audio.currentTime = currentSecond
                audio.ontimeupdate = onTimeUpdate
            }
        }
        // Xu li khi chinh am luong
        input_volume_range.oninput =() => {
            const percent=input_volume_range.value/ input_volume_range.max
            audio.volume=percent
            volume_btn.classList.toggle("isVolumeNotMute",Boolean(audio.volume))
        }
        // Xử lí khi click prev và next button
        btn_prev.onclick = () => {
            if (this.isRandomActive) {
                this.randomSong()
            }
            else {
                this.prevSong()
                this.songsPlayedIndex = []
            }
            this.loadCurrentSong()
            this.setActiveSong()
            audio.play()
        }
        btn_next.onclick = () => {
            if (this.isRandomActive) {
                this.randomSong()
            }
            else {
                this.nextSong()
                this.songsPlayedIndex = []
            }
            this.loadCurrentSong()
            this.setActiveSong()
            audio.play()
        }
        // Xử lí next song khi audio ended
        audio.onended = () => {
            this.isRepeatActive ? audio.play() : btn_next.click()
        }
        // Xử lí click nút random
        btn_random.onclick = () => {
            btn_random.classList.toggle("active")
            this.isRandomActive = !this.isRandomActive
            this.setConfig("isRandomActive",this.isRandomActive)
        }
        // Xử lí khi click repeat
        btn_repeat.onclick = () => {
            btn_repeat.classList.toggle("active")
            this.isRepeatActive = !this.isRepeatActive
            this.setConfig("isRepeatActive",this.isRepeatActive)
        }
        // Xử lí khi click vào một bài hát
        // Use delegate pattern
        playist.onclick = (e) => {
            const song = e.target.closest(".song:not(.active)")
            // When click into option, not move to that song
            const sound_wave = e.target.closest(".sound-wave")

            if (!sound_wave && song) {
                const index = song.dataset.index
                this.currentIndex = index
                this.setConfig("currentIndex", this.currentIndex)
                this.loadCurrentSong()
                this.setActiveSong()
                audio.play()
            }
        }
    },
    loadConfig:function() {
        this.isRandomActive=this.config["isRandomActive"]
        btn_random.classList.toggle("active",this.isRandomActive || false)
        
        this.isRepeatActive=this.config["isRepeatActive"]
        btn_repeat.classList.toggle("active",this.isRepeatActive || false)
        
        this.currentIndex=this.config["currentIndex"] || 0
    },
    setActiveSong: function () {
        const songs = $$(".song")
        const song = songs[this.currentIndex]

        const prevSongActive = $(".playist .song.active")
        if (prevSongActive) {
            prevSongActive.classList.remove("active")
        }
        song.classList.add("active")
        setTimeout(function () {
            song.scrollIntoView(
                {
                    block: "end",
                    inline: "nearest",
                    behavior: "smooth"
                }
            )
        }, 200)
    },
    randomSong: function () {
        let rand = Math.floor(Math.random() * this.songs.length)
        if (this.songsPlayedIndex.length === this.songs.length) {
            this.songsPlayedIndex = []
        }
        if (this.songsPlayedIndex.length === 0) {
            this.songsPlayedIndex.push(this.currentIndex)
        }
        while (this.songsPlayedIndex.includes(rand)) {
            rand = Math.floor(Math.random() * this.songs.length)
        }
        this.songsPlayedIndex.push(rand)
        this.currentIndex = rand
        this.setConfig("currentIndex", this.currentIndex)
    },
    nextSong: function () {
        if (this.currentIndex === this.songs.length - 1) {
            this.currentIndex = 0
            this.setConfig("currentIndex", this.currentIndex)
        }
        else {
            this.currentIndex++
            this.setConfig("currentIndex", this.currentIndex)
        }
    },
    prevSong: function () {
        if (this.currentIndex === 0) {
            this.currentIndex = this.songs.length - 1
            this.setConfig("currentIndex", this.currentIndex)
        }
        else {
            this.currentIndex--
            this.setConfig("currentIndex", this.currentIndex)
            this.setConfig("currentIndex", this.currentIndex)
        }
    },
    loadCurrentSong: function () {
        const song = this.currentSong
        heading.innerText = song.name
        cdThumb.style.backgroundImage = `url('${song.img}')`
        audio.src = song.path
    },
    start: function () {
        this.loadConfig()

        // Render bài hát
        this.render()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lí các sự kiện (DOM event)
        this.handleEvents()

        //Load the first current song
        this.loadCurrentSong()

        // set the first active song when app started
        this.setActiveSong()

    }
}
apps.start()