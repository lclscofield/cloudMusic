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

let id = getParameterByName('id')
let query = new AV.Query('Song')
query.get(id).then(function (song) {
  let {
    url,
    lyric
  } = song.attributes
  let video = document.createElement('video')
  video.src = url
  video.play()
  let arr = []
  let parts = lyric.split('\n')
  parts.forEach(function (string, index) {
    let str = string.split(']')
    str[0] = Number(str[0].slice(1, str[0].indexOf(':'))) * 60 + Number(str[0].slice(str[0].indexOf(':') + 1))
    arr.push({
      time: str[0],
      lyric: str[1]
    })
  })
  console.log(arr)
  setInterval(function () {
    let current = video.currentTime
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length) {
        console.log(arr[i].lyric)
      } else if (arr[i].time <= current && arr[i + 1].time > current) {
        console.log(arr[i].lyric)
        break
      }
    }
  }, 500)
})