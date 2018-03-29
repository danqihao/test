window.addEventListener('load', (event) => {
  // 公共全局状态管理
  window.vuex = new Vue()

  // 公共模态框中
  window.commonModal = {
    commonModalMediumVM: new Vue({
      el: '#commonModal .modal-dialog',
      data () {
        return {
          modal: document.getElementById('commonModal'),
          modalName: '', // = queryStepNameModal
          config: null,
          selectedData: '',
          state: false
        }
      },
      components: {
        // 查询工步名模态框
        queryStepNameModal: Vue.component('mes-query-step-name-modal'),
        // 查询工步版本态框
        queryStepVersionModal: Vue.component('mes-query-step-version-modal'),
        // 查询工步模态框
        queryStepModal: Vue.component('mes-query-step-modal'),
        // 查询工序模态框
        queryStepProcessModal: Vue.component('mes-query-process-modal'),
        // 查询产品类型模态框
        queryProductTypeModal: Vue.component('mes-query-product-type-modal'),
        // 查询产品类型下的产品型号模态框
        queryProductnumberModal: Vue.component('mes-query-product-number-modal'),
        // 查询标准参数模态框
        queryStandardParameterModal: Vue.component('mes-query-standard-parameter-modal'),
        // 查询半成品类型模态框
        querySemiFinishedTypeModal: Vue.component('mes-query-semifinished-type-modal'),
        // 查询半成品类型下的半成品型号模态框
        querySemifinishedNumberModal: Vue.component('mes-query-semifinished-number-modal'),
        // 查询设备类型模态框
        queryDevicesTypeModal: Vue.component('mes-query-devices-type-modal'),
        // 查询员工信息模态框
        queryStaffInfoModal: Vue.component('mes-query-staff-info-modal'),
        // 查询工序版本模态框
        queryProcessVersionModal: Vue.component('mes-query-process-version-modal'),
        // 查询工艺模态框
        queryCraftModal: Vue.component('mes-query-craft-modal'),
        // 查询生产车间
        queryWorkshopModal: Vue.component('mes-query-workshop-modal'),
        // 查询用户模态框
        mesQueryUserInfoModal: Vue.component('mes-query-user-info-modal'),
        // 查询物料标准参数
        queryMaterialStandardInfoModal: Vue.component('mes-query-material-standard-info-modal'),
      },
      methods: {
        // 设置数据值
        setDataValue (value) {
          this.selectedData = value
          this.state = true
        },
        // 模态框显示
        modalShow (modalName, config) {
          this.modalName = modalName
          this.state = false
          if (config !== undefined) {
            this.config = config
          }
          $(this.modal).modal({
            keyboard: false,
            backdrop: false
          })
          $(this.modal).modal('show')
          return new Promise((resolve, reject) => {
            this.$watch('state', (value, oldValue) => {
              if (value === true) {
                resolve(this.selectedData)
              }
            })
          })
        },
        // 模态框隐藏
        modalHide () {
          $(this.modal).modal('hide')
        }
      },
      template: `
        <component
          :is="modalName"
          :config="config"
          @set-data-value="setDataValue"
          @modal-hide="modalHide"
        >
        </component>
      `
    })
  }
})
