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

// 更新歌曲
let APP_ID = '2zDrWgAws4gjpLRoSFJKxFw3-gzGzoHsz'
let APP_KEY = 'thxthBXWnp8r4Odyu6B0OFoz'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

let query = new AV.Query('Song')
let hotSongs = document.querySelector('.hot-music>.songs')
query.find().then(function (results) {
  for (let i = 0; i < results.length; i++) {
    let song = results[i].attributes
    if (i < 9) {
      let a = `<a>
               <div class="num">0${i+1}</div>
               <div class="song">
                 <div class="songText">
                   <h3>${song.name}</h3>
                   <p><i class="sqIcon"></i>${song.singer} - ${song.album}</p>
                 </div>
                 <div class="playButton-wrapper"><span class="playButton"></span></div>
               </div>
             </a>`
      hotSongs.insertAdjacentHTML('beforeend', a)
    } else {
      let a = `<a>
      <div class="num">${i+1}</div>
      <div class="song">
        <div class="songText">
          <h3>${song.name}</h3>
          <p><i class="sqIcon"></i>${song.singer} - ${song.album}</p>
        </div>
        <div class="playButton-wrapper"><span class="playButton"></span></div>
      </div>
    </a>`
      hotSongs.insertAdjacentHTML('beforeend', a)
    }
  }
})