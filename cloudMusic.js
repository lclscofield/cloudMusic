// tabs
let tabsNode = document.querySelector('.tabs')
let tabs = tabsNode.children
let tabsContent = document.querySelectorAll('.tabs-content>li')
tabsNode.addEventListener('click', function (e) { // mouseover 可以换成 click 点击事件
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
























var APP_ID = '2zDrWgAws4gjpLRoSFJKxFw3-gzGzoHsz'
var APP_KEY = 'thxthBXWnp8r4Odyu6B0OFoz'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

// var query = new AV.Query('Song')
// query.find().then(function(results){
//   for(let i =0; i < results.length; i++){
//     console.log(results[i].attributes)
//   }
// })