// 初始化
let APP_ID = '2zDrWgAws4gjpLRoSFJKxFw3-gzGzoHsz'
let APP_KEY = 'thxthBXWnp8r4Odyu6B0OFoz'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

// 拿到 url 中的 id
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// 找到 id 对应歌曲并播放
let id = getParameterByName('id')
let query = new AV.Query('Song')
query.get(id).then(function (song) {
  let {
    name,
    singer,
    url,
    lyric,
    bg,
    img
  } = song.attributes
  // 加载背景图片
  let bgImg = document.querySelector('section.bg')
  bgImg.style.backgroundImage = `url('${bg}')`
  // 加载封面
  let coverImg = document.querySelector('section.top .cover-content')
  coverImg.style.backgroundImage = `url('${img}')`

  let arr = []
  let parts = lyric.split('\n') // 截取每段歌词
  parts.forEach(function (string, index) {
    let str = string.split(']')
    str[0] = Number(str[0].slice(1, str[0].indexOf(':'))) * 60 + Number(str[0].slice(str[0].indexOf(':') + 1))
    arr.push({
      time: str[0],
      lyric: str[1]
    }) // 把每段歌词放到数组中
  })
  // 加载歌曲名和歌手
  let h2 = document.querySelector('.song-content h2')
  h2.innerHTML = `${name} - <span>${singer}</span>`
  // 加载歌词
  let inner = document.querySelector('.song-content .song-lyric-inner')
  for (let i = 0; i < arr.length; i++) {
    inner.insertAdjacentHTML('beforeend', `<p>${arr[i].lyric}</p>`)
  }
  // 点击播放按钮播放
  let playBtn = document.querySelector('.top span.playBtn')
  playBtn.addEventListener('click', function () {
    playBtn.classList.remove('pause')
    play(url, arr, inner, playBtn)
  })
  // 播放
  play(url, arr, inner, playBtn)
})

// 播放
function play(url, arr, inner, playBtn) {
  // 视频播放
  let video = document.createElement('video')
  video.src = url
  video.play()
  // 封面旋转
  let cover = document.querySelector('.top .cover')
  cover.classList.add('playing')
  // 歌词滚动
  let p = document.querySelectorAll('.song-content .song-lyric-inner p')
  p[0].style.color = `rgb(255, 255, 255)`
  let time = setInterval(function () {
    let current = video.currentTime
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) {
        if (current >= arr[i].time) {
          p[i - 1].style.color = ``
          p[i].style.color = `rgb(255, 255, 255)`
          inner.style.transform = `translateY(-${(i-1)*32}px)`
          if (video.ended) {
            p[0].style.color = `rgb(255, 255, 255)`
            inner.style.transform = `translateY(0px)`
            cover.classList.remove('playing')
            cover.classList.add('initial')
            playBtn.classList.add('pause')
            clearInterval(time)
          }
        }
      } else
      if (current >= arr[i].time && current < arr[i + 1].time) {
        if (i === 0) {
          p[i].style.color = `rgb(255, 255, 255)`
        } else {
          p[i - 1].style.color = ``
          p[i].style.color = `rgb(255, 255, 255)`
          inner.style.transform = `translateY(-${(i-1)*32}px)`
        }
        break
      }
    }
  }, 300)
}