import "../assets/layer.css"

function createTpl(data) {
  return `
    <div class="layer-wrap"></div>
    <div class="layer-main">
      <h5 class="layer-title">${data.title}</h5>
      <div class="layer-content">
        <p>${data.msg}</p>
        <div class="layer-btns">
          <!-- 按钮 -->
        </div>
      </div>
    </div>
  `
}

// 弹框包裹元素
let div = null

function openModal(opts) {
  return new Promise((resolve, reject) => {
    if (!!div) {
      closeModal()
    }
    div = document.createElement("div")
    div.innerHTML = createTpl(opts)
    // 为遮罩层添加点击事件
    div.querySelector(".layer-wrap").addEventListener("click", () => {
      closeModal()
      reject()
    })
    let btnWrap = div.querySelector(".layer-btns")
    let btns = opts.btn || ['确定', '取消']
    btns.forEach((item, index) => {
      if (index > 1) return
      let btn = document.createElement("button")
      btn.innerText = item
      btn.addEventListener("click", () => {
        closeModal();
        [resolve, reject][index]();
      })
      btnWrap.appendChild(btn)
    })

    document.body.appendChild(div)
  })
}

function closeModal() {
  if (!!div) {
    document.body.removeChild(div)
    div = null
  }
}

export default {
  info: function (msg) {
    openModal({
      title: "提示",
      btn: ['确定'],
      msg
    }).catch(() => { });
  },
  choose: function (msg) {
    return openModal({
      title: "提示",
      msg,
    })
  }
}