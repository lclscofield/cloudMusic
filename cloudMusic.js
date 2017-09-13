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
    let query = new AV.Query('Song')
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
// 默认页面
let search = document.querySelector('#search')
search.addEventListener('input', input)
// 默认页面行为-输入事件
// 输入搜索值时的的行为
let timer = null // 设置时钟防止太多请求
function input() {
  let value = search.value.trim() // 获取输入值
  hideDefaultPage() // 隐藏默认页面
  // 获取搜索值并渲染到页面
  let h3 = document.querySelector('.searchHint h3')
  h3.classList.add('active')
  h3.innerHTML = `搜索“${value}”`
  // 函数节流
  if (timer) {
    window.clearTimeout(timer)
  }
  timer = setTimeout(function () {
    showSearchHint(value) // 显示提示页面
    timer = null
  }, 300)
  // 搜索值为空时
  if (!value) {
    showDefaultPage() // 显示默认页面
    hideSearchHint(value) // 隐藏提示页面
  }
}

// 默认页面行为-点击回车键显示搜索结果
// 按回车显示搜索结果，并将搜索值写入历史
search.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    search.blur()
    showSearchResult()
    writeSearchHistory()
    let value = search.value.trim() // 获取输入值
    hideSearchHint(value)
  }
})

// 默认页面行为-点击热门搜索显示搜索结果
// 点击热门搜索传值给搜索框并直接显示搜索结果
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
  hideDefaultPage()
  showSearchResult()
  writeSearchHistory()
})

// 默认页面行为-点击搜索历史显示搜索结果
// 点击搜索历史搜索或删除
let searchHistoryUl = document.querySelector('.search-history ul')
searchHistoryUl.addEventListener('click', function (e) {
  let event = e.target
  if (event.tagName === 'SPAN') {
    search.value = event.innerText
    hideDefaultPage()
    showSearchResult()
    writeSearchHistory()
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

// 隐藏默认页面
let clearSearch = document.querySelector('.input .clearSearch>i')
let searchDefault = document.querySelector('.search-default')
let labelHint = document.querySelector('#search+label')

function hideDefaultPage() {
  searchDefault.classList.add('hidden') // 隐藏 search-default
  clearSearch.classList.add('active') // 显示删除按钮
  labelHint.classList.remove('hint') // 隐藏 labelHint
}

// 显示默认页面
function showDefaultPage() {
  clearSearch.classList.remove('active') // 隐藏删除按钮
  labelHint.classList.add('hint') // 显示 labelHint
  searchDefault.classList.remove('hidden') // 显示默认页面
}

// 写入搜索历史
function writeSearchHistory() {
  let value = search.value.trim() // 获取输入值
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
}


// 提示页面
// 提示页面行为-点击清除搜索值
// 点击清除搜索值
clearSearch.addEventListener('click', function (e) {
  search.value = ''
  input()
})

// 提示页面行为-点击 searchHint 传值给搜索框
// 点击 searchHint 传值给搜索框
let searchHintUl = document.querySelector('.searchHint ul')
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
  hideSearchHint()
  showSearchResult()
  writeSearchHistory()
})

// 显示提示页面
let searchHint = document.querySelector('.searchHint')
let searchResult = document.querySelector('.search .songs')

function showSearchHint(value) {
  searchHintUl.innerHTML = '' // 清除搜索提示
  searchResult.innerHTML = '' // 清空搜索结果
  if (value) {
    // 获取搜索值并渲染到页面
    let h3 = document.querySelector('.searchHint h3')
    h3.classList.add('active')
    h3.innerHTML = `搜索“${value}”`
    // 获取提示结果并渲染到页面
    let query2 = new AV.Query('Song')
    query2.contains('singer', value)
    query2.find().then(function (results) {
      console.log(results)
      if (results.length !== 0) {
        for (let i = 0; i < results.length; i++) {
          let song = results[i].attributes
          let li = `<li><i></i><span>${song.singer}</span></li>`
          searchHintUl.insertAdjacentHTML('beforeend', li)
        }
      } else {
        let query1 = new AV.Query('Song')
        query1.contains('name', value)
        query1.find().then(function (results) {
          for (let i = 0; i < results.length; i++) {
            let song = results[i].attributes
            let li = `<li><i></i><span>${song.name}</span></li>`
            searchHintUl.insertAdjacentHTML('beforeend', li)
          }
        })
      }
    })
  }
  searchHint.classList.remove('hidden') // 显示 searchHint
}

// 隐藏提示页面，清空搜索结果
let noResult = document.querySelector('.noResult div')

function hideSearchHint(value) {
  // 隐藏搜索提示
  let h3 = document.querySelector('.searchHint h3')
  h3.classList.remove('active')

  searchHintUl.innerHTML = '' // 清空搜索提示
  searchResult.innerHTML = '' // 清空搜索结果
  searchHint.classList.add('hidden') // 隐藏提示
  noResult.classList.remove('active') // 隐藏无结果提示
}

// 搜索结果页面
// 显示搜索结果
function showSearchResult() {
  let value = search.value.trim() // 获取输入值
  let query1 = new AV.Query('Song')
  query1.contains('name', value)
  let query2 = new AV.Query('Song')
  query2.contains('singer', value)
  let query = AV.Query.or(query1, query2)
  query.find().then(function (results) {
    if (results.length === 0) {
      noResult.classList.add('active')
      return
    }
    for (let i = 0; i < results.length; i++) {
      let song = results[i].attributes
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