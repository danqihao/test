Vue.config.productionTip = false
// 公共ajax请求函数
function mesReq (URL, init, config) {
  let myHeaders = new Headers()
  // myHeaders.append('Content-Type', 'application/json; charset=UTF-8')
  let myBody = ''
  if (init) {
    if (init.body.constructor === FormData) {
      myBody = init.body
    }
    else if (config && config.type === 'formData') {
      let fromData = new FormData()
      for (const [key, value] of Object.entries(init.body)) {
        if (typeof value === 'object' && value instanceof File !== true) {
          let keyValue = JSON.stringify(value)
          fromData.append(key, keyValue)
        }
        else {
          fromData.append(key, value)
        }
      }
      myBody = fromData
    }
    else if (config && config.type === 'json') {
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      let tempObject = {}
      for (const [key, value] of Object.entries(init.body)) {
        if (typeof value === 'object' && value instanceof File !== true) {
          tempObject[key] = JSON.stringify(value)
        }
        else {
          tempObject[key] = value
        }
      }
      myBody = jQuery.param(tempObject)
    }
    else {
      myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      let tempObject = {}
      /* for (const [key, value] of Object.entries(init.body)) {
        if (typeof value === 'object' && value instanceof File !== true && value instanceof Array !== true) {
          tempObject[key] = JSON.stringify(value)
        }
        else {
          tempObject[key] = value
        }
      } */
      for (const [key, value] of Object.entries(init.body)) {
        // if (typeof value === 'object' && value instanceof File !== true && value instanceof Array !== true) {
        if (typeof value === 'object' && value instanceof File !== true) {
          if (value instanceof Array === true && typeof value[0] === 'object') {
            tempObject[key] = JSON.stringify(value)
          }
          else if (value instanceof Array === true && (typeof value[0] === 'string' || typeof value[0] === 'number')) {
            tempObject[key] = value
          }
          else {
            tempObject[key] = JSON.stringify(value)
          }
        }
        else {
          tempObject[key] = value
        }
      }
      myBody = jQuery.param(tempObject)
    }
  }

  const myInit = {
    mode: init.mode || 'cors',
    method: init.method || 'POST',
    headers: init.headers || myHeaders,
    body: myBody,
    credentials: 'include'
  }
  let mesloadBox = null
  const req = new Request(URL, myInit)
  return new Promise((resolve, reject) => {
    fetch(req).then((res) => {
      if (config && config.panel !== undefined) {
        mesloadBox = new MesloadBox(config.panel, {
          errorContent: '服务器连接错误，请检查网络链接',
          primaryContent: '服务器连接错误，请检查网络链接',
          warningContent: '参数错误，请联系管理员',
          infoContent: '没有此类数据，请重新输入',
        })
      }
      if (mesloadBox) {
        mesloadBox.loadingShow()
      }
      if (res.ok) {
        res.json().then((data) => {
          if (data.status === 0) {
            if (mesloadBox) {
              mesloadBox.hide()
            }
            resolve(data)
          }
          else if (data.status === 1) {
            if (mesloadBox) {
              mesloadBox.warningShow()
            }
            console.log('status=1')
            reject(data)
          }
          else if (data.status === 2) {
            if (mesloadBox) {
              mesloadBox.infoShow()
            }
            console.log('status=2')
            reject(data)
          }
          else {
            if (mesloadBox) {
              mesloadBox.infoShow()
            }
            reject(data)
            console.log('status=*')
          }
        }).catch((err) => {
          reject(err)
          console.log('返回值不是json格式')
        })
      } else {
        if (mesloadBox) {
          mesloadBox.errorShow()
        }
        reject(res.status)
        console.log(res.status, res.statusText)
      }
    }).catch((err) => {
      if (mesloadBox) {
        mesloadBox.errorShow()
      }
      console.log('出错了')
      reject(err)
    })
  })
}

// 标准时间
Vue.filter('standardTime', function (value) {
  if (!value) return ''
  return moment(value).format('YYYY-MM-DD HH:mm')
})

// 审核状态
Vue.filter('approvalState', function (value) {
  if (!value) return ''
  switch (Number(value)) {
    case 0:
      return '未开始'
      break;
    case 1:
      return '等待审核'
      break;
    case 2:
      return '审核未通过'
      break;
    case 3:
      return '审核通过'
      break;
    case 4:
      return '关闭生产后等待审核'
      break;
    case 5:
      return '关闭生产后审核未通过'
      break;
    case 6:
      return '关闭审核后通过'
      break;
    default:
      return '状态错误'
      break;
  }
})

// 生产状态
Vue.filter('productionState', function (value) {
  if (!value) return ''
  switch (Number(value)) {
    case 0:
      return '未开始'
      break;
    case 1:
      return '生产中'
      break;
    case 2:
      return '暂停'
      break;
    case 3:
      return '生产完成'
      break;
    case 4:
      return '停止'
      break;
    default:
      return '状态错误'
      break;
  }
})

