// tabs
let tabsNode = document.querySelector('.tabs')
let tabs = tabsNode.children
let tabsContent = document.querySelectorAll('.tabs-content>li')
tabsNode.addEventListener('click', function (e) {
  let event = e.target
  while (event.tagName !== 'LI') { //点击事件优化
    if (event === tabsNode) {
      event = null
      break
    }
    event = event.parentNode
  }
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i] === event) {
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
query.find().then(function (results) {
  // 删除加载占位图
  let loading = document.querySelectorAll('.songs .songs-loading')
  for (let i = 0; i < loading.length; i++) {
    loading[i].parentNode.removeChild(loading[i])
  }

  // 从数据库加载数据
  for (let i = 0; i < results.length - 10; i++) {
    let song = results[i].attributes
    // 加载最新音乐
    let newMusic = document.querySelector('.newMusic>.songs')
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
    let hotSong = document.querySelector('.hot-music>.songs')
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

    // 加载热门搜索
    for (let i = 0; i < results.length; i++) {
      let song = results[i].attributes
      let hotSearch = document.querySelector('.search-hot ul')
      if (document.querySelectorAll('.search-hot ul li').length < 7) {
        if (Math.random() * 2 < 1) {
          let hotSearchLi = `<li>${song.name}</li>`
          hotSearch.insertAdjacentHTML('beforeend', hotSearchLi)
        }
      }
    }
  }

  // 随机加载 sq 图标
  let icons = document.querySelectorAll('.hot-music>.songs i, .newMusic>.songs i')
  for (let i = 0; i < icons.length; i++) {
    if (Math.random() * 2 < 1) {
      icons[i].classList.add('sqIcon')
    }
  }

})


// 点击查看完整榜单，加载后 10 首歌
let hotBottom = document.querySelector('.hot-bottom')
let clickTrue = true
hotBottom.addEventListener('click', function (e) {
  let hotSong = document.querySelector('.hot-music>.songs')
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

// 搜索功能
let search = document.querySelector('#search')
let searchHintUl = document.querySelector('.searchHint ul')
let searchHint = document.querySelector('.searchHint')
// 输入事件
search.addEventListener('input', input)

function input() {
  let value = search.value.trim()
  searchChange(value)
  query.contains('name', value)
  query.find().then(function (results) {
    for (let i = 0; i < results.length; i++) {
      let song = results[i].attributes
      searchHintUl.innerHTML = ''
      let li = `<li><i></i><span>${song.name}</span></li>`
      searchHintUl.insertAdjacentHTML('beforeend', li)
    }
  })
}
// 清除提示，添加删除按钮
let labelHint = document.querySelector('#search+label')
let searchDefault = document.querySelector('.search-default')

function searchChange(value) {
  searchDefault.classList.add('hidden') // 隐藏 search-default
  clearSearch.classList.add('active') // 显示删除按钮
  labelHint.classList.remove('hint') // 隐藏 labelHint
  searchHint.classList.remove('hidden') // 显示 searchHint
  // 显示 h3
  let h3 = document.querySelector('.searchHint h3')
  h3.classList.add('active')
  h3.innerHTML = `搜索“${value}”`
  // 清除搜索提示
  searchHintUl.innerHTML = ''
  // 清空搜索结果
  searchResult.innerHTML = ''
  // 搜索值为空时
  if (!value) {
    searchDefault.classList.remove('hidden')
    labelHint.classList.add('hint')
    clearSearch.classList.remove('active')
    h3.classList.remove('active')
    searchHintUl.innerHTML = ''
    searchHint.classList.add('hidden')
    searchResult.innerHTML = ''
    noResult.classList.remove('active')
    return
  }
}
// 按回车显示搜索结果，并将搜索值写入历史
search.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    search.blur()
    show()
  }
})
// 显示搜索结果，并将搜索值写入历史
let searchResult = document.querySelector('.search .songs')
let searchHistoryUl = document.querySelector('.search-history ul')
let noResult = document.querySelector('.noResult div')

function show() {
  let value = search.value.trim()
  // 添加历史搜索，判断是否有重复历史搜索，如有则不添加重复历史
  if (searchHistoryUl.children.length === 0) {
    let liHistory = `
    <li>
    <i class="history-timeIcon"></i>
    <div class="history-name">
      <span>${value}</span>
      <i class="history-deleteIcon"></i>
    </div>
    </li>
    `
    searchHistoryUl.insertAdjacentHTML('beforeend', liHistory)
  } else {
    let num = 0
    for (let i = 0; i < searchHistoryUl.children.length; i++) {
      if (value !== searchHistoryUl.children[i].innerText.trim()) {
        num++
      }
    }
    if (num === searchHistoryUl.children.length) {
      let liHistory = `
      <li>
      <i class="history-timeIcon"></i>
      <div class="history-name">
        <span>${value}</span>
        <i class="history-deleteIcon"></i>
      </div>
      </li>
      `
      searchHistoryUl.insertAdjacentHTML('beforeend', liHistory)
    }
  }

  // 显示搜索结果
  query.contains('name', value)
  query.find().then(function (results) {
    if (results.length === 0) {
      let h3 = document.querySelector('.searchHint h3')
      h3.classList.remove('active')
      searchHintUl.innerHTML = ''
      searchHint.classList.add('hidden')
      noResult.classList.add('active')
    }
    for (let i = 0; i < results.length; i++) {
      let song = results[i].attributes
      let h3 = document.querySelector('.searchHint h3')
      h3.classList.remove('active')
      searchHintUl.innerHTML = ''
      searchHint.classList.add('hidden')
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
      searchResult.insertAdjacentHTML('beforeend', a)
    }
  })
}

// 点击清除搜索值
let clearSearch = document.querySelector('.input .clearSearch>i')
clearSearch.addEventListener('click', function (e) {
  search.value = ''
  searchChange(search.value)
})

// 点击搜索历史搜索或删除
searchHistoryUl.addEventListener('click', function (e) {
  let event = e.target
  if (event.tagName === 'SPAN') {
    search.value = event.innerText
    input()
    show()
  }
  if (event.tagName === 'I') {
    while (event.tagName !== 'LI') {
      if (event === searchHistoryUl) {
        event = null
        break
      }
      event = event.parentNode
    }
    event.parentNode.removeChild(event)
  }
})

// 点击热门搜索传值给搜索框
let hotSearch = document.querySelector('.search-hot ul')
hotSearch.addEventListener('click', function (e) {
  let event = e.target
  while (event.tagName !== 'LI') {
    if (event === hotSearch) {
      event = null
      break
    }
    event = event.parentNode
  }
  search.value = event.innerText
  input()
  show()
})

// 点击 searchHint 传值给搜索框
searchHintUl.addEventListener('click', function (e) {
  let event = e.target
  while (event.tagName !== 'LI') {
    if (event === searchHintUl) {
      event = null
      break
    }
    event = event.parentNode
  }
  search.value = event.innerText
  input()
  show()
})