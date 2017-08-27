// tabs
let tabsNode = document.querySelector('.tabs')
let tabs = tabsNode.children
let tabsContent = document.querySelectorAll('.tabs-content>li')
tabsNode.addEventListener('click', function (e) {
  let element = e.target
  while (element.tagName !== 'LI') { //点击事件优化
    if (element === tabsNode) {
      element = null
      break
    }
    element = element.parentNode
  }
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i] === element) {
      tabs[i].classList.add('active')
      tabsContent[i].classList.add('active')
    } else {
      tabs[i].classList.remove('active')
      tabsContent[i].classList.remove('active')
    }
  }
})

// 加载歌曲
// 初始化
let APP_ID = '2zDrWgAws4gjpLRoSFJKxFw3-gzGzoHsz'
let APP_KEY = 'thxthBXWnp8r4Odyu6B0OFoz'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

let query = new AV.Query('Song')
let newMusic = document.querySelector('.newMusic>.songs')
let hotSong = document.querySelector('.hot-music>.songs')
let loading = document.querySelectorAll('.songs .songs-loading')
query.find().then(function (results) {
  // 删除加载占位图
  for (let i = 0; i < loading.length; i++) {
    loading[i].parentNode.removeChild(loading[i])
  }
  // 从数据库加载数据
  for (let i = 0; i < results.length - 10; i++) {
    let song = results[i].attributes
    // 加载最新音乐
    if (i < 10) {
      let a = `
      <a>
        <div class="song">
          <div class="songText">
            <h3>${song.name}</h3>
            <p><i></i>${song.singer} - ${song.album}</p>
          </div>
          <div class="playButton-wrapper"><span class="playButton"></span></div>
        </div>
      </a>
      `
      newMusic.insertAdjacentHTML('beforeend', a)
    }
    // 加载热门音乐
    if (i < 9) { // 加载热门音乐前 10 首
      let a = `
      <a>
        <div class="num">0${i+1}</div>
        <div class="song">
          <div class="songText">
            <h3>${song.name}</h3>
            <p><i></i>${song.singer} - ${song.album}</p>
          </div>
          <div class="playButton-wrapper"><span class="playButton"></span></div>
        </div>
      </a>
      `
      hotSong.insertAdjacentHTML('beforeend', a)
    } else {
      let a = `
      <a>
        <div class="num">${i+1}</div>
        <div class="song">
          <div class="songText">
            <h3>${song.name}</h3>
            <p><i></i>${song.singer} - ${song.album}</p>
          </div>
          <div class="playButton-wrapper"><span class="playButton"></span></div>
        </div>
      </a>
      `
      hotSong.insertAdjacentHTML('beforeend', a)
    }
  }
  // 随机加载 sq 图标
  let icons = document.querySelectorAll('i')
  for (let i = 0; i < icons.length; i++) {
    if (Math.random() * 2 < 1) {
      icons[i].classList.add('sqIcon')
    }
  }
})
// 点击加载后 10 首歌
let hotBottom = document.querySelector('.hot-bottom')
let clickTrue = true
hotBottom.addEventListener('click', function (e) {
  if (clickTrue === true) {
    query.find().then(function (results) {
      // 从数据库加载后 10 首热门音乐
      for (let i = 10; i < results.length; i++) {
        let song = results[i].attributes
        let a = `
      <a>
        <div class="num">${i+1}</div>
        <div class="song">
          <div class="songText">
            <h3>${song.name}</h3>
            <p><i></i>${song.singer} - ${song.album}</p>
          </div>
          <div class="playButton-wrapper"><span class="playButton"></span></div>
        </div>
      </a>
      `
        hotSong.insertAdjacentHTML('beforeend', a)
        // 随机给新的歌曲添加 sq 图标
        let icon = document.querySelectorAll('.hot-music>.songs i')[i]
        if (Math.random() * 2 < 1) {
          icon.classList.add('sqIcon')
        }
      }
    })
  }
  clickTrue = false
})