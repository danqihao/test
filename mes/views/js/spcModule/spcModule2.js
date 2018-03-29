
$(function () {
  let leftNav = $('#mainLeftSidebar .sidebar-nav');// 左侧边栏
  let leftNavLink = leftNav.find('a').filter('[href^="#"]');// 左侧变栏对应的swiper

  leftNavLink.on('click', function (event) {
    let targetHref = event.currentTarget.getAttribute('href');

    switch (targetHref) {
      case '#MetrologicalControl': {	//计量型控制图
         (function () {
            const swiper = document.getElementById('MetrologicalControl')   //右侧外部swiper
            const inerSwiper = document.getElementById('MetrologicalControlInerSwiper') // 右侧内部swiper
            let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
               
              }
            },

            methods: {
             

            },
            created() {
             
            },
            template: `
            <div id="MetrologicalControlInerSwiper">
              nihoi
            </div>
                                `
          })


        }())
      }
        break;
 

    }
  })
  leftNavLink.eq(1).trigger('click');

})

