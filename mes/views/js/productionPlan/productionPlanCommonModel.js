const productionPlanVuex = new Vue()

// 审核状态
function productionPlanApproveStateTransition (stateNumber) {
  switch (Number(stateNumber)) {
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
}

// 生产状态
function productionPlanProductionStateTransition (stateNumber) {
  switch (Number(stateNumber)) {
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
}

// 模态框显示的时候如果还有模态框就到Body上添加'modal-open'
$('.modal').on('hidden.bs.modal', function (e) {

  // 页面全部模态框
  const pageAllModal = document.getElementsByClassName('modal-backdrop')
  // 模态框dom转为数组
  const pageAllModalArray = [...pageAllModal]
  const isNotContainClassIn = pageAllModalArray.some((value, index) => {
    return value.classList.contains('in')
  })
  if (isNotContainClassIn === true) {
    $('body').addClass('modal-open')
  }
})
window.addEventListener('load', (event) => {
  const localVuex = new Vue()
  // 生产计划详情模态框
  const productionPlanDetail = document.getElementById('productionPlanDetailModal')
  // 生产计划详情模态框的对话框
  const productionPlanDetailModalDialog = productionPlanDetail.querySelector('.modal-dialog')
  // 物料详情模态框
  const materialDetaiModal = document.getElementById('materialDetailModal')
  // 物料详情模态框的对话框
  const materialDetaiModalDialog = materialDetaiModal.querySelector('.modal-dialog')
  // 工单详情模态框
  const workOrderDetailModal = document.getElementById('workOrderDetailModal')
  // 工单详情模态框的对话框
  const workOrderDetailModalDialog = workOrderDetailModal.querySelector('.modal-dialog')
  // 添加生产计划模态框
  const addProductionPlanModal = document.getElementById('addProductionPlanModal')
  // 添加生产计划模态框对话框
  const addProductionPlanModalModalDialog = addProductionPlanModal.querySelector('.modal-dialog')

  // 计划审批模态框VM
  let planApprovalModalPanelVM = new Vue({
    el: document.querySelector('#planApprovalModal .modal-dialog'),
    data () {
      return {
        textareaData: '',
        planId: '',
        approvalType: ''
      }
    },
    methods: {
      submitApprovalContent (passOrNoPass, options) {
        swal({
          title: '确定要提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          console.log(this.approvalType, 131323)
            return new Promise((resolve, reject) => {
              const url = modifyPlanCheckStatusUrl
              const reqInit = {
                body: {
                  type: 'pass',
                  userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                  planIds: [this.planId],
                  explain: this.textareaData
                }
              }
              if (this.approvalType === '4' && passOrNoPass === 'pass') {
                reqInit.body.type = 'closePass'
              } else if (passOrNoPass === 'pass') {
                reqInit.body.type = 'pass'
              } else if (this.approvalType === '4' && passOrNoPass === 'notPass') {
                reqInit.body.type = 'closeRepulse'
              } else if (passOrNoPass === 'notPass') {
                reqInit.body.type = 'notPass'
              }

              mesReq(url, reqInit).then((response) => {
                console.log(response)
              }).then((data) => {
                console.log(data)
                resolve()
                swal({
                  title: '成功',
                  type: 'success',
                  timer: 1000
                })
              }).catch((err) => {
                reject(err)
                swal({
                  title: err.msg || '提交失败',
                  type: 'error',
                })
              })
            })
          })
      }
    },
    mounted () {
      localVuex.$on('showPlanApprovalModal', (options) => {
        console.log(options.approvalType)
        if (!options.planId) {
          return
        }
        this.planId = options.planId
        this.approvalType = options.approvalType
        const modal = document.getElementById('planApprovalModal')
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
      })
    },
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">计划审批</h4>
          </div>
          <div class="modal-body">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model='textareaData'
            >
            </el-input>
          </div>
          <div class="modal-footer">
            <div class="row">
              <div class="col-xs-6">
                <!--<button class="btn btn-primary pull-left">打印</button>-->
              </div>
              <div class="col-xs-6">
                <button
                  class="btn btn-success modal-submit"
                  v-text="'审核通过'"
                  @click="submitApprovalContent('pass')"
                >
                </button>
                <button
                  class="btn btn-danger modal-submit"
                  v-text="'驳回'"
                  @click="submitApprovalContent('notPass')"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 计划转交模态框VM
  let planCareofModalPanelVM = new Vue({
    el: document.querySelector('#planCareofModal .modal-dialog'),
    data () {
      return {
        textareaData: '',
        planId: '',
        careofStaff: {
          role_staff_name: '',
          role_staff_id: ''
        },
      }
    },
    methods: {
      saveSelectedCreationStaff (config) {
        const modalName = 'mesQueryUserInfoModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          Object.assign(this.careofStaff, {
            role_staff_name: data.role_user_name,
            role_staff_id: data.role_user_id
          })
        })
      },
      submitCareofContent (approvalType, options) {
        swal({
          title: '确定要提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            const url = planCheckPowerTransferUrl
            const reqInit = {
              body: {
                userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                userName:USERNAME,
                planId: this.planId,
                transferUserName: this.careofStaff.role_staff_name,
                transferUserId: this.careofStaff.role_staff_id,
                explain: this.textareaData
              }
            }
            mesReq(url, reqInit).then((response) => {
              console.log(response)
            }).then((data) => {
              console.log(data)
              resolve()
              swal({
                title: '成功',
                type: 'success',
                timer: 1000
              })
            }).catch((err) => {
              reject(err)
              swal({
                title: err.msg || '提交失败',
                type: 'error',
              })
            })
          })
        })
      }
    },
    mounted () {
      localVuex.$on('showplanCareofModal', (options) => {
        if (!options.planId) {
          return
        }
        this.planId = options.planId
        const modal = document.getElementById('planCareofModal')
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
      })
    },
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">计划转交</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline form-table">
              <div class="row">
                <div class="col-md-4 col-xs-6">
                  <div class="form-group pull-right">
                    <label class="control-label">转交人</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="careofStaff.role_staff_name"
                      readonly
                    >
                    <a
                      class="input-btn"
                      @click="saveSelectedCreationStaff()"
                      title="转交人"
                      href="javascript:;"
                    >
                      <i class="fa fa-search"></i>
                    </a>
                  </div>
                </div>
              </div>
            </form>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model='textareaData'
            >
            </el-input>
          </div>
          <div class="modal-footer">
            <div class="row">
              <div class="col-xs-6">
                <!--<button class="btn btn-primary pull-left">打印</button>-->
              </div>
              <div class="col-xs-6">
                <button
                  class="btn btn-danger modal-submit"
                  v-text="'提交'"
                  @click="submitCareofContent()"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 二维码模态框VM
  let QCCodeVM = new Vue({
    el: document.querySelector('#QCCodeModal .modal-dialog'),
    data () {
      return {
        url: createQRCodeUrl,
        bodyParam: null
      }
    },
    methods: {
      setModalImgHerf (QCCode) {
        let searchParam = new URLSearchParams()
        searchParam.append('data', QCCode)
        this.bodyParam = searchParam
      }
    },
    mounted () {
      localVuex.$on('showQCCodeModal', (QCCode) => {
        console.log(QCCode)
        if (!QCCode) {
          return
        }
        this.setModalImgHerf(QCCode)
        const modal = document.getElementById('QCCodeModal')
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
      })
    },
    template: `
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">二维码</h4>
          </div>
          <div class="modal-body center-block">
            <img v-if="bodyParam" :src="url + '?' + bodyParam">
          </div>
        </div>
      </div>
    `
  })

  // 生产计划详情VM
  let productionPlanDetailVM = new Vue({
    el: productionPlanDetailModalDialog,
    data () {
      return {
        needShowModule: {
          productionPlanDetail: false, // 生产计划详情
          // 生产计划子模块
          productionPlanDetailSubmodule: {
            baseInfo: false, // 基础信息
            domList: false, // dom清单
            workOrder: false // 工单信息
          },
          productionProcessDetail: false, // 生产过程详情
          productionSchedule: false, // 生产进度
          approveDetai: false // 审批详情
        },
        planId: '' // 生产计划id
      }
    },
    computed: {},
    watch: {},
    methods: {
    },
    mounted () {
      // 显示生产计划详情模态框
      productionPlanVuex.$on('showProductionPlanDetailModal', options => {
        $(productionPlanDetail).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(productionPlanDetail).modal('show')
        this.planId = options.planId || ''
        // 合并需要显示的模块
        Object.assign(this.needShowModule, options.needShowModule)
      })
    },
    components: {
      // 生产计划详情基础
      productionPlanDetailBase: {
        data () {
          return {
            URL: queryPlanParticularsUrl,
            responseBaseInfo: {},
            responseBomList: [],
            responseWorkOrderList: [],
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 需要显示的模块
          needShowModule: {
            type: Object,
            default: {
              baseInfo: false, // 基础信息
              domList: false, // dom清单
              workOrder: false // 工单信息
            },
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: true
          }
        },
        methods: {
          searchServerData (planId) {
            const reqInit = {
              body: {
                planId: planId
              }
            }
            mesReq(this.URL, reqInit).then((data) => {
              const map = data.map
              const responseData = map.plan
              this.responseBaseInfo = responseData
              this.responseBomList = responseData.planUseMaterialList
              this.responseWorkOrderList = responseData.workOrderList
            })
          }
        },
        mounted () {
          this.searchServerData(this.planId)
          if (this.planId !== '') {
            // 显示生产计划详情模态框
            productionPlanVuex.$on('showProductionPlanDetailModal', options => {
              this.searchServerData(options.planId)
            })
          }
        },
        components: {
          // 基础信息
          baseInfo: {
            data () {
              return {
              }
            },
            props: {
              // 生产计划id
              responseBaseInfo: {
                type: Object,
                required: true
              }
            },
            methods: {
              showQCCode () {
                const QCCode = this.responseBaseInfo.production_plan_QRCode || '15616512316546'
                console.log(QCCode)
                localVuex.$emit('showQCCodeModal', QCCode)
              }
            },
            mounted () {
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>基础信息</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:15%">
                        订单编号
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_order_number">
                      </td>
                      <th style="width:15%">
                        是否新产
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_judge_whether">
                      </td>
                      <th style="width:15%">
                        生产批号
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_batch_number">
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        生产优先级
                      </th>
                      <td v-text="responseBaseInfo.production_plan_production_priority">
                      </td>
                      <th>
                        产品类型
                      </th>
                      <td v-text="responseBaseInfo.product_type_name">
                      </td>
                      <th>
                        产品型号
                      </th>
                      <td v-text="responseBaseInfo.product_model_name">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工艺
                      </th>
                      <td v-text="responseBaseInfo.craft_name">
                      </td>
                      <th>
                        工艺版本
                      </th>
                      <td v-text="responseBaseInfo.craft_versions">
                      </td>
                      <th>
                        生产线
                      </th>
                      <td v-text="responseBaseInfo.product_line_name">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        优率
                      </th>
                      <td v-text="responseBaseInfo.production_plan_optimal_rate">
                      </td>
                      <th>
                        产品容量（Ah）
                      </th>
                      <td v-text="responseBaseInfo.product_model_capacity">
                      </td>
                      <th>
                        产品型号单位
                      </th>
                      <td v-text="responseBaseInfo.product_model_unit">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        订单生产数
                      </th>
                      <td v-text="responseBaseInfo.production_order_production_number">
                      </td>
                      <th>
                        批次排产数
                      </th>
                      <td v-text="responseBaseInfo.production_batch_production_number">
                      </td>
                      <th>
                        排产优率
                      </th>
                      <td v-text="responseBaseInfo.production_scheduling_optimization_rate">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        预计产出量
                      </th>
                      <td v-text="responseBaseInfo.production_expected_output">
                      </td>
                      <th>
                        排产容量(WAH)
                      </th>
                      <td v-text="responseBaseInfo.production_scheduling_capacity">
                      </td>
                      <th>
                        创建人
                      </th>
                      <td v-text="responseBaseInfo.production_founder_staff">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        计划审核人
                      </th>
                      <td v-text="responseBaseInfo.production_verifier_staff">
                      </td>
                      <th>
                        生产计划负责人
                      </th>
                      <td v-text="responseBaseInfo.production_responsible_staff">
                      </td>
                      <th>
                        创建时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_creation_time | standardTime}}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        预定开始时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_scheduled_start_time | standardTime}}
                      </td>
                      <th>
                        预定完成时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_estimated_completion_time | standardTime}}
                      </td>
                      <th>
                        实际产出量
                      </th>
                      <td v-text="responseBaseInfo.production_actual_output">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        实际开始时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_actual_start_time | standardTime}}
                      </td>
                      <th>
                        实际完成时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_actual_finish_time | standardTime}}
                      </td>
                      <th>
                        一二维码
                      </th>
                      <td class="table-input-td">
                        <a
                          href="javascript:;"
                          class="table-link"
                          @click="showQCCode"
                        >
                          <i class="fa fa-tasks fa-fw"></i>点击查看
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },

          // bom清单
          domList: {
            data () {
              return {
              }
            },
            props: {
              // 生产计划id
              responseBomList: {
                type: Array,
                required: true
              }
            },
            methods: {
              // 显示物料清单详情模态框
              showMaterialDetailModal (index) {
                productionPlanVuex.$emit('showMaterialDetailModal', { currentMaterialData: this.responseBomList[index]})
              }
            },
            mounted () {
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>BOM清单</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:5%">
                        序号
                      </th>
                      <th style="width:10%">
                        名称
                      </th>
                      <th style="width:10%">
                        规格
                      </th>
                      <th style="width:10%">
                        型号
                      </th>
                      <th style="width:10%">
                        供应商
                      </th>
                      <th style="width:10%">
                        所需总数
                      </th>
                      <th style="width:10%">
                        单位
                      </th>
                      <th style="width:10%">
                        实际库存
                      </th>
                      <th style="width:10%">
                        预计库存
                      </th>
                      <th style="width:15%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in responseBomList"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_name"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_standard"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_model"
                      >
                      </td>
                      <td
                        v-text="value.supplier_name"
                      >
                      </td>
                      <td
                        v-text="value.plan_required_amount"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_units"
                      >
                      </td>
                      <td
                        v-text="value.plan_quotes_actual_inventory"
                      >
                      </td>
                      <td
                        v-text="value.plan_quotes_anticipated_stock"
                      >
                      </td>
                      <td class="table-input-td">
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click="showMaterialDetailModal(index)"
                        >
                          <i class="fa fa-tasks fa-fw"></i>物料详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },

          // 工单信息
          workOrder: {
            data () {
              return {
                URL: '',
                queryBarInit: {
                },
                bodyParam: {
                  headNum: 1
                },
                tableData: [],
                pageSize: 10,
                total: 0,
                currentPage: 1
              }
            },
            props: {
              // 生产计划id
              responseWorkOrderList: {
                type: Array,
                required: true
              }
            },
            methods: {
              // 显示工单详情
              showWorkOrderDetailModal (workOrderId) {
                productionPlanVuex.$emit('showWorkOrderDetailModal', workOrderId)
              }
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>工单信息</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:5%">
                        序号
                      </th>
                      <th style="width:8%">
                        工单号
                      </th>
                      <th style="width:8%">
                        工序
                      </th>
                      <th style="width:5%">
                        级性
                      </th>
                      <th style="width:8%">
                        半成品型号
                      </th>
                      <th style="width:8%">
                        预计产出量
                      </th>
                      <th style="width:8%">
                        生产车间
                      </th>
                      <th style="width:8%">
                        预定完成时间
                      </th>
                      <th style="width:8%">
                        工单负责人
                      </th>
                      <th style="width:20%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in responseWorkOrderList"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.work_order_number"
                      >
                      </td>
                      <td
                       v-text="value.planQuotesWorkstage.workstage_name"
                      >
                      </td>
                      <td
                       v-text="value.planQuotesWorkstage.workstage_polarity"
                      >
                      </td>
                      <td
                       v-text="value.planQuotesWorkstage.semi_finish_genre"
                      >
                      </td>
                      <td
                       v-text="value.planQuotesWorkstage.expected_output"
                      >
                      </td>
                      <td
                       v-text="value.role_workshop_name"
                      >
                      </td>
                      <td>
                        {{value.work_order_estimated_completion_time | standardTime}}
                      </td>
                      <td
                       v-text="value.work_order_responsible"
                      >
                      </td>
                      <td class="table-input-td">
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click="showWorkOrderDetailModal(value.work_order_id)"
                        >
                          <i class="fa fa-tasks fa-fw"></i>工单详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          }
        },
        template: `
          <div>
            <base-info
              v-if="needShowModule.baseInfo"
              :responseBaseInfo="responseBaseInfo"
            >
            </base-info>
            <dom-list
              v-if="needShowModule.domList"
              :responseBomList="responseBomList"
            >
            </dom-list>
            <work-order
              v-if="needShowModule.workOrder"
              :responseWorkOrderList="responseWorkOrderList"
            >
            </work-order>
          </div>
        `
      },

      // 生产过程详情
      productionPlanDetailProcess: {
        data () {
          return {
            productionProcessDetailList: []
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: true
          }
        },
        computed: {

        },
        methods: {
          searchServerData () {
            const url = queryPlanProcessParticularsUrl
            const reqInit = {
              body: {
                planId: this.planId
              }
            }
            mesReq(url, reqInit).then((data) => {
              const map = data.map
              const line = map.line
              const dataList = map.PlanProcessRecords
              this.productionProcessDetailList = dataList
            })
          },
          standardTime(value) {
            if (!value) return ''
            return moment(value).format('YYYY-MM-DD HH:mm')
          }
        },
        mounted () {
          if (this.isShow === true) {
            this.searchServerData()
            // 显示生产计划详情模态框
            productionPlanVuex.$on('showProductionPlanDetailModal', options => {

              this.searchServerData()
            })
          }
        },
        components: {
        },
        template: `
          <div class="panel panel-default relative">
            <div class="panel-body">
              <el-steps
                space="100px"
                :active="productionProcessDetailList.length"
                finish-status="success"
                process-status="process"
                direction="vertical"
              >
                <el-step
                  v-for="(value, index) in productionProcessDetailList"
                  :key="index"
                  :title="value.process_records_operator + '    ' + standardTime(value.process_records_operation_time) + '    ' + value.process_records_operation_type"
                  :description="value.process_records_operating_instructions"
                >
                </el-step>
              </el-steps>
            </div>
          </div>
        `
      },

      // 生产进度详情
      productionPlanDetailSchedule: {
        data () {
          return {
            progress: 0,
            productionScheduleDetailList: []
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: true
          }
        },
        computed: {

        },
        methods: {
          searchServerData () {
            const url = queryPlanEvolveParticularsUrl
            const reqInit = {
              body: {
                planId: this.planId
              }
            }
            mesReq(url, reqInit).then((data) => {
              const map = data.map
              const line = map.line
              const dataList = map.workOrders
              this.progress = map.evolve
              this.productionScheduleDetailList = dataList
            })

          },
          standardTime (value) {
            if (!value) return ''
            return moment(value).format('YYYY-MM-DD HH:mm')
          },
          scheduleState (expectedQuantity, actualQuantity) {
            if (expectedQuantity < actualQuantity) {
              return 'process '
            }
            else {
              return 'success'
            }
          }
        },
        mounted () {
          if (this.isShow === true) {
            this.searchServerData()
            // 显示生产计划详情模态框
            productionPlanVuex.$on('showProductionPlanDetailModal', options => {
              this.searchServerData()
            })
          }
        },
        components: {
        },
        template: `
          <div>
            <div class="panel panel-default relative">
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <h4>生产计划总进度</h4>
                  </div>
                  <div class="col-xs-8">
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <el-progress
                  :text-inside="true"
                  :stroke-width="25"
                  :percentage="progress"
                >
                </el-progress>
              </div>
            </div>
            <div class="panel panel-default relative">
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <h4>工单生产进度</h4>
                  </div>
                  <div class="col-xs-8">
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <el-steps
                  space="100px"
                  :active="productionScheduleDetailList.length"
                  finish-status="success"
                  process-status="process"
                  direction="vertical"
                >
                  <el-step
                    v-for="(value, index) in productionScheduleDetailList"
                    :key="index"
                    :title="value.work_order_number"
                    :status="scheduleState(value.work_order_expected_output, value.work_order_actual_output)"
                    :description="'预计产出量: ' + value.work_order_expected_output + '    ' + '实际产出量: ' + value.work_order_actual_output"
                  >
                  </el-step>
                </el-steps>
              </div>
            </div>
          </div>
        `
      },

      // 审核详情
      productionPlanDetailApprove: {
        data () {
          return {
            approveDetailList: []
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: true
          }
        },
        computed: {
        },
        methods: {
          searchServerData () {
            const url = queryPlanCheckParticularsUrl
            const reqInit = {
              body: {
                planId: this.planId
              }
            }
            mesReq(url, reqInit).then((data) => {
              const map = data.map
              const line = map.line
              const dataList = map.PlanProcessRecords
              this.approveDetailList = dataList
            })

          },
          standardTime (value) {
            if (!value) return ''
            return moment(value).format('YYYY-MM-DD HH:mm')
          }
        },
        mounted () {
          if (this.isShow === true) {
            this.searchServerData()
            // 显示生产计划详情模态框
            productionPlanVuex.$on('showProductionPlanDetailModal', options => {
              this.searchServerData()
            })
          }
        },
        components: {
        },
        template: `
          <div class="panel panel-default relative">
            <div class="panel-body">
              <el-steps
                space="100px"
                :active="approveDetailList.length"
                finish-status="success"
                process-status="process"
                direction="vertical"
              >
                <el-step
                  v-for="(value, index) in approveDetailList"
                  :key="index"
                  :title="value.process_records_operator + '    ' + standardTime(value.process_records_operation_time) + '    ' + value.process_records_operation_type"
                  :description="value.process_records_operating_instructions"
                >
                </el-step>
              </el-steps>
            </div>
          </div>
        `
      },

      // 计划设置
      productionPlanDetailConfig: {
        data () {
          return {
            dataList: [],
            activeNames: ['1', '2', '3', '4']
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: true
          },
          needShowModule: {
            type: Object,
            default: {
              // 计划调度
              dispatch: false,
              // 重新发起
              resubmit: false,
              // 关闭
              close: false,
              // 审核通过后的关闭
              planSuccessClose: false,
              // 永久关闭
              perpetualClose: false,
              // 下发
              issued: false,
              // 恢复计划
              recoverPlan: false,
              // 关闭生产
              planCloseProduction: false,
              // 计划处理
              approvalHandle: true,
              // 转交
              careof: true,
              // 暂停生产
              pauseProduction: true,
              // 恢复生产
              continueProduction: true,
              // 生产完成
              finishProduction: true
            }
          }
        },
        computed: {
        },
        methods: {
          // 计划调度
          planDispatch () {
          },
          // 重新发起
          planResubmit () {
            swal({
              title: '确定要重新发起吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanCheckStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'closeWait',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId]
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((data) => {
                  console.log(data)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 永久关闭
          planPerpetualClose () {
            swal({
              title: '确定要永久关闭吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = removePlanUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planId: this.planId,
                    userName: USERNAME
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((data) => {
                  console.log(data)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 关闭
          planClose () {
            swal({
              title: '确定要关闭吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = removePlanUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    userName: USERNAME || '测试管理员',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planId: this.planId,
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((response) => {
                  console.log(response)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 下发
          planIssued () {
            swal({
              title: '确定要下发吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanProductionStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'inProduction',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId],
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((response) => {
                  console.log(response)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 恢复计划
          planRecoverPlan () {
            swal({
              title: '确定要恢复计划吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyDraftPlanStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'recover',
                    // userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId],
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((data) => {
                  console.log(data)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 关闭生产
          planCloseProduction () {
            swal({
              title: '确定要关闭生产吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanCheckStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'closeWait',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId]
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((data) => {
                  console.log(data)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 审批处理
          planApprovalHandle () {
            const options = {
              planId: this.planId,
              approvalType: 1
            }

            const reqInit = {
              body: {
                planId: options.planId
              }
            }

            mesReq(queryPlanParticularsUrl, reqInit).then((data) => {
              options.approvalType = data.map.plan.planStatus.plan_audit_status
              localVuex.$emit('showPlanApprovalModal', options)
            })
          },
          // 转交
          planCareof () {
            const options = {
              planId: this.planId
            }
            localVuex.$emit('showplanCareofModal', options)
          },
          // 暂停生产
          pauseProduction () {
            console.log(this.planId)
            swal({
              title: '确定要暂停吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanProductionStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'pause',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId],
                    explain: ''
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((response) => {
                  console.log(response)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 恢复生产
          continueProduction () {
            swal({
              title: '确定要恢复生产吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanProductionStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'inProduction',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId],
                    explain: ''
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((response) => {
                  console.log(response)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
          // 生产完成
          finishProduction () {
            swal({
              title: '确定要完成生产吗?',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                const url = modifyPlanProductionStatusUrl
                const reqConfig = null
                const reqInit = {
                  body: {
                    type: 'complete',
                    userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                    planIds: [this.planId],
                    explain: ''
                  }
                }
                mesReq(url, reqInit, reqConfig).then((response) => {
                  console.log(response)
                }).then((response) => {
                  console.log(response)
                  resolve()
                  swal({
                    title: '成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败',
                    type: 'error',
                  })
                })
              })
            })
          },
        },
        mounted () {
          console.log(this.isShow)
          if (this.isShow) {
          }
        },
        components: {
        },
        template: `
          <div class="panel panel-default relative">
            <div class="panel-body">
              <el-collapse>

                <!- 我发起的 ->
                <el-collapse-item
                  title="我发起的"
                  v-model="activeNames"
                >
                  <el-row style="margin-bottom: 20px">
                    <el-col :span="24">
                      <!--
                        <el-button
                          :disabled="!needShowModule.dispatch"
                          type="primary"
                          @click="planDispatch"
                        >
                        计划调度
                        </el-button>
                      -->

                      <el-button
                        :disabled="!needShowModule.resubmit"
                        type="primary"
                        @click="planResubmit"
                      >
                        重新发起
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.close"
                        type="primary"
                        @click="planClose"
                      >
                        关闭
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.planSuccessClose"
                        type="primary"
                        @click="planCloseProduction"
                      >
                        审核通过后关闭
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.perpetualClose"
                        type="primary"
                        @click="planPerpetualClose"
                      >
                        永久关闭
                      </el-button>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-button
                        :disabled="!needShowModule.issued"
                        type="primary"
                        @click="planIssued"
                      >
                        下发
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.recoverPlan"
                        type="primary"
                        @click="planRecoverPlan"
                      >
                        恢复计划
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.planCloseProduction"
                        type="primary"
                        @click="planCloseProduction"
                      >
                        关闭生产
                      </el-button>
                    </el-col>
                  </el-row>

                </el-collapse-item>

                <!- 我审核的 ->
                <el-collapse-item
                  title="我审核的"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-button
                        :disabled="!needShowModule.approvalHandle"
                        type="primary"
                        @click="planApprovalHandle"
                      >
                        计划审批
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.careof"
                        type="primary"
                        @click="planCareof"
                      >
                        转交
                      </el-button>
                    </el-col>
                  </el-row>
                </el-collapse-item>

                <!- 我负责的 ->
                <el-collapse-item
                  title="我负责的"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-button
                        :disabled="!needShowModule.pauseProduction"
                        type="primary"
                        @click="pauseProduction"
                      >
                        暂停生产
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.continueProduction"
                        type="primary"
                        @click="continueProduction"
                      >
                        恢复生产
                      </el-button>

                      <el-button
                        :disabled="!needShowModule.finishProduction"
                        type="primary"
                        @click="finishProduction"
                      >
                        完成生产
                      </el-button>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        `
      }
    },
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">生产计划信息</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li
                class="active"
                v-if="needShowModule.productionPlanDetail"
              >
                <a href="#productionPlanDetailBase" data-toggle="tab">生产计划详情</a>
              </li>
              <li
                v-if="needShowModule.productionProcessDetail"
              >
                <a href="#productionPlanDetailProcess" data-toggle="tab">生产过程详情</a>
              </li>
              <li
                v-if="needShowModule.productionSchedule"
              >
                <a href="#productionPlanDetailSchedule" data-toggle="tab">生产进度详情</a>
              </li>
              <li
                v-if="needShowModule.approveDetai"
              >
                <a href="#productionPlanDetailApprove" data-toggle="tab">审核详情</a>
              </li>
              <li
                v-if="needShowModule.config"
              >
                <a href="#productionPlanDetailConfig" data-toggle="tab">计划操作</a>
              </li>
            </ul>
            <div class="tab-content">
              <!-- 生产计划详情基础 -->
              <div
                class="tab-pane active"
                id="productionPlanDetailBase"
                v-if="needShowModule.productionPlanDetail"
              >
                <production-plan-detail-base
                  :is-show="needShowModule.productionPlanDetail"
                  :need-show-module="needShowModule.productionPlanDetailSubmodule"
                  :plan-id="planId"
                >
                </production-plan-detail-base>
              </div>

              <!-- 生产计划详情过程 -->
              <div
                class="tab-pane"
                id="productionPlanDetailProcess"
                v-if="needShowModule.productionProcessDetail"
              >
                <production-plan-detail-process
                  :is-show="needShowModule.productionProcessDetail"
                  :plan-id="planId"
                >
                </production-plan-detail-process>
              </div>

              <!-- 生产进度详情 -->
              <div
                class="tab-pane"
                id="productionPlanDetailSchedule"
                v-if="needShowModule.productionSchedule"
              >
                <production-plan-detail-schedule
                  :is-show="needShowModule.productionSchedule"
                  :plan-id="planId"
                >
                </production-plan-detail-schedule>
              </div>

              <!-- 审核详情 -->
              <div
                class="tab-pane"
                id="productionPlanDetailApprove"
                v-if="needShowModule.approveDetai"
              >
                <production-plan-detail-approve
                  :is-show="needShowModule.approveDetai"
                  :plan-id="planId"
                >
                </production-plan-detail-approve>
              </div>

              <!-- 计划设置 -->
              <div
                class="tab-pane"
                id="productionPlanDetailConfig"
                v-if="needShowModule.config"
              >
                <production-plan-detail-config
                  :is-show="needShowModule.config"
                  :need-show-module="needShowModule.configSubmodule"
                  :plan-id="planId"
                >
                </production-plan-detail-config>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 物料详情VM
  let materialDetailVM = new Vue({
    el: materialDetaiModalDialog,
    data () {
      return {
        tableData: {}
      }
    },
    methods: {
    },
    mounted () {
      productionPlanVuex.$on('showMaterialDetailModal', (options) => {
        this.tableData = options.currentMaterialData
        $(materialDetaiModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(materialDetaiModal).modal('show')

        // 模态框关闭的时候检查是否还有模态框
      })
    },
    template: `
      <div class="modal-dialog modal-xm">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">物料详情</h4>
          </div>
          <div class="modal-body">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width:15%">
                    物料名称
                  </th>
                  <td
                    style="width:18.3%"
                    v-text="tableData.warehouse_material_name"
                  >
                  </td>
                  <th style="width:15%">
                    规格
                  </th>
                  <td
                    style="width:18.3%"
                    v-text="tableData.warehouse_material_standard"
                  >
                  </td>
                  <th style="width:15%">
                    型号
                  </th>
                  <td
                    style="width:18.3%"
                    v-text="tableData.warehouse_material_model"
                  >
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    供应商
                  </th>
                  <td
                    v-text="tableData.supplier_name"
                  >
                  </td>
                  <th>
                    单位
                  </th>
                  <td
                    v-text="tableData.warehouse_material_units"
                  >
                  </td>
                  <th>
                    备注
                  </th>
                  <td
                    v-text="tableData.plan_quotes_material_describe"
                  >
                  </td>
                </tr>
                <tr>
                  <th>
                    类型
                  </th>
                  <td
                    v-text="tableData.plan_quotes_material_type"
                  >
                  </td>
                  <th>
                    生产所需总量
                  </th>
                  <td
                    v-text="tableData.plan_required_amount"
                  >
                  </td>
                  <th>
                    需要领取数量
                  </th>
                  <td
                    v-text="tableData.plan_quantity_required"
                  >
                  </td>
                </tr>
                <tr>
                  <th>
                    实领数量
                  </th>
                  <td
                    v-text="tableData.plan_get_number"
                  >
                  </td>
                  <th>
                    收调批数量
                  </th>
                  <td
                    v-text="tableData.plan_quantity_received"
                  >
                  </td>
                  <th>
                    物料总数
                  </th>
                  <td
                    v-text="tableData.plan_material_amount"
                  >
                  </td>
                </tr>
                <tr>
                  <th>
                    退料数量
                  </th>
                  <td
                    v-text="tableData.plan_return_material"
                  >
                  </td>
                  <th>
                    补料数量
                  </th>
                  <td
                    v-text="tableData.plan_supplement_material"
                  >
                  </td>
                  <th>
                    调批数量
                  </th>
                  <td
                    v-text="tableData.plan_transfer_number"
                  >
                  </td>
                </tr>
                <tr>
                  <th>
                    实际库存量
                  </th>
                  <td
                    v-text="tableData.plan_quotes_actual_inventory"
                  >
                  </td>
                  <th>
                    预计库存量
                  </th>
                  <td
                    v-text="tableData.plan_quotes_anticipated_stock"
                  >
                  </td>
                  <th>
                  </th>
                  <td
                    v-text=""
                  >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `
  })

  // 工单详情VM
  let workOrderDetailModelVM = new Vue({
    el: workOrderDetailModalDialog,
    data () {
      return {
        // 生产计划
        productionPlan: {},
        // 工单
        workOrder: {},
        // 工序
        workStage: {},
        // 工步list
        stepList: [],
        // 工单状态
        workOrderStatus: {},
        // 环境参数
        environmentParamList: [],
        // 半成品参数
        semiFinishedProduct: [],
        // 工单过程详情
        workOrderPerocessList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      // 获取工单详情数据
      getWorkOrderDetailData (workOrderId) {
        const url = queryWorkOrderParticularsUrl
        const reqInit = {
          body: {
            workOrderId: workOrderId
          }
        }
        mesReq(url, reqInit).then((data) => {
          const map = data.map
          const workOrder = map.workOrder
          const workStage = workOrder.planQuotesWorkstage
          const productionPlan = workOrder.plan
          const workOrderStatus = workOrder.workOrder
          this.productionPlan = productionPlan
          this.workOrder = workOrder
          this.workStage = workStage
          this.workOrderStatus = workOrderStatus

          /* // 找出工步参数
          for (const [index, value] of stepList.entries()) {
            this.stepList.push(value.workstep)
          }

          // 找出环境参数
          this.environmentParamList = useParametersList.filter((value, index) => {
            return value.standard_parameter_type_name === '环境参数'
          })

          // 半成品参数
          this.semiFinishedProduct = useParametersList.filter((value, index) => {
            return value.standard_parameter_type_name !== '环境参数'
          }) */
        })
      },
      // 获取工单过程数据
      getWorkOrderProcessData (workOrderId) {
        const url = queryWorkOrderProcessParticularsUrl
        const reqInit = {
          body: {
            workOrderId: workOrderId
          }
        }
        mesReq(url, reqInit).then((data) => {
          const map = data.map
          const dataList = map.processRecord
          this.workOrderPerocessList = dataList
        })
      },
      // 标准时间
      standardTime (value) {
        if (!value) return ''
        return moment(value).format('YYYY-MM-DD HH:mm')
      }
    },
    mounted () {
      // 显示生产计划详情模态框
      productionPlanVuex.$on('showWorkOrderDetailModal', workOrderId => {
        // 获取工单详情数据
        this.getWorkOrderDetailData(workOrderId)
        // 获取工单过程数据
        this.getWorkOrderProcessData(workOrderId)

        $(workOrderDetailModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(workOrderDetailModal).modal('show')
      })
    },
    components: {
      // 生产计划详情基础
      productionPlanDetailBase: {
        data () {
          return {
            URL: queryPlanParticularsUrl,
            responseBaseInfo: {},
            responseBomList: [],
            responseWorkOrderList: [],
          }
        },
        props: {
          // 是否显示
          isShow: {
            type: Boolean,
            default: false,
            required: true
          },
          // 需要显示的模块
          needShowModule: {
            type: Object,
            default: {
              baseInfo: false, // 基础信息
              domList: false, // dom清单
              workOrder: false // 工单信息
            },
            required: true
          },
          // 生产计划id
          planId: {
            type: String,
            default: '',
            required: false
          }
        },
        methods: {
          searchServerData () {
            const reqInit = {
              body: {
                planId: this.planId
              }
            }
            mesReq(this.URL, reqInit).then((data) => {
              const map = data.map
              const responseData = map.plan
              this.responseBaseInfo = responseData
              this.responseBomList = responseData.planUseMaterialList
              this.responseWorkOrderList = responseData.workOrderList
              console.log(this.responseBaseInfo)
            })
          }
        },
        mounted () {
          this.searchServerData()
          if (this.planId !== '') {
            // 显示生产计划详情模态框
            productionPlanVuex.$on('showProductionPlanDetailModal', options => {
              this.searchServerData()
            })
          }
        },
        components: {
          // 基础信息
          baseInfo: {
            data () {
              return {

              }
            },
            props: {
              // 生产计划id
              responseBaseInfo: {
                type: Object,
                required: true
              }
            },
            methods: {
            },
            mounted () {
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>基础信息</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:15%">
                        订单编号
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_order_number">
                      </td>
                      <th style="width:15%">
                        是否新产
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_judge_whether">
                      </td>
                      <th style="width:15%">
                        生产批号
                      </th>
                      <td style="width:18.3%" v-text="responseBaseInfo.production_plan_batch_number">
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        生产优先级
                      </th>
                      <td v-text="responseBaseInfo.production_plan_production_priority">
                      </td>
                      <th>
                        产品类型
                      </th>
                      <td v-text="responseBaseInfo.product_type_name">
                      </td>
                      <th>
                        产品型号
                      </th>
                      <td v-text="responseBaseInfo.product_model_name">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工艺
                      </th>
                      <td v-text="responseBaseInfo.craft_name">
                      </td>
                      <th>
                        工艺版本
                      </th>
                      <td v-text="responseBaseInfo.craft_versions">
                      </td>
                      <th>
                        生产线
                      </th>
                      <td v-text="responseBaseInfo.product_line_name">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        优率
                      </th>
                      <td v-text="responseBaseInfo.production_plan_optimal_rate">
                      </td>
                      <th>
                        产品容量（Ah）
                      </th>
                      <td v-text="responseBaseInfo.product_model_capacity">
                      </td>
                      <th>
                        产品型号单位
                      </th>
                      <td v-text="responseBaseInfo.product_model_unit">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        订单生产数
                      </th>
                      <td v-text="responseBaseInfo.production_order_production_number">
                      </td>
                      <th>
                        批次排产数
                      </th>
                      <td v-text="responseBaseInfo.production_batch_production_number">
                      </td>
                      <th>
                        排产优率
                      </th>
                      <td v-text="responseBaseInfo.production_scheduling_optimization_rate">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        预计产出量
                      </th>
                      <td v-text="responseBaseInfo.production_expected_output">
                      </td>
                      <th>
                        排产容量(WAH)
                      </th>
                      <td v-text="responseBaseInfo.production_scheduling_capacity">
                      </td>
                      <th>
                        创建人
                      </th>
                      <td v-text="responseBaseInfo.production_founder_staff">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        计划审核人
                      </th>
                      <td v-text="responseBaseInfo.production_verifier_staff">
                      </td>
                      <th>
                        生产计划负责人
                      </th>
                      <td v-text="responseBaseInfo.production_responsible_staff">
                      </td>
                      <th>
                        创建时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_creation_time | standardTime}}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        预定开始时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_scheduled_start_time | standardTime}}
                      </td>
                      <th>
                        预定完成时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_estimated_completion_time | standardTime}}
                      </td>
                      <th>
                        实际产出量
                      </th>
                      <td v-text="responseBaseInfo.production_actual_output">
                      </td>
                    </tr>
                    <tr>
                      <th>
                        实际开始时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_actual_start_time | standardTime}}
                      </td>
                      <th>
                        实际完成时间
                      </th>
                      <td>
                        {{responseBaseInfo.production_actual_finish_time | standardTime}}
                      </td>
                      <th>
                      </th>
                      <td v-text="">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },

          // dom清单
          domList: {
            data () {
              return {
              }
            },
            props: {
              // 生产计划id
              responseBomList: {
                type: Array,
                required: true
              }
            },
            methods: {
              // 显示物料清单详情模态框
              showMaterialDetailModal (index) {
                productionPlanVuex.$emit('showMaterialDetailModal', { currentMaterialData: this.responseBomList[index] })
              }
            },
            mounted () {
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>BOM清单</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:5%">
                        序号
                      </th>
                      <th style="width:10%">
                        名称
                      </th>
                      <th style="width:10%">
                        规格
                      </th>
                      <th style="width:10%">
                        型号
                      </th>
                      <th style="width:10%">
                        供应商
                      </th>
                      <th style="width:10%">
                        所需总数
                      </th>
                      <th style="width:10%">
                        单位
                      </th>
                      <th style="width:10%">
                        实际库存
                      </th>
                      <th style="width:10%">
                        预计库存
                      </th>
                      <th style="width:15%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in responseBomList"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_name"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_standard"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_model"
                      >
                      </td>
                      <td
                        v-text="value.supplier_name"
                      >
                      </td>
                      <td
                        v-text="value.plan_required_amount"
                      >
                      </td>
                      <td
                        v-text="value.warehouse_material_units"
                      >
                      </td>
                      <td
                        v-text="value.plan_quotes_actual_inventory"
                      >
                      </td>
                      <td
                        v-text="value.plan_quotes_anticipated_stock"
                      >
                      </td>
                      <td class="table-input-td">
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click="showMaterialDetailModal(index)"
                        >
                          <i class="fa fa-tasks fa-fw"></i>物料详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },

          // 工单信息
          workOrder: {
            data () {
              return {
                URL: '',
                queryBarInit: {
                },
                bodyParam: {
                  headNum: 1
                },
                tableData: [],
                pageSize: 10,
                total: 0,
                currentPage: 1
              }
            },
            props: {
              // 生产计划id
              responseWorkOrderList: {
                type: Array,
                required: true
              }
            },
            methods: {
              // 显示工单详情
              showWorkOrderDetailModal (workOrderId) {
                productionPlanVuex.$emit('showWorkOrderDetailModal', workOrderId)
              }
            },
            template: `
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>工单信息</h4>
                    </div>
                    <div class="col-xs-8">
                    </div>
                  </div>
                </div>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:5%">
                        序号
                      </th>
                      <th style="width:8%">
                        工单编号
                      </th>
                      <th style="width:8%">
                        工序
                      </th>
                      <th style="width:5%">
                        级性
                      </th>
                      <th style="width:8%">
                        半成品型号
                      </th>
                      <th style="width:8%">
                        预计产出量
                      </th>
                      <th style="width:8%">
                        生产车间
                      </th>
                      <th style="width:8%">
                        预定完成时间
                      </th>
                      <th style="width:8%">
                        工单负责人
                      </th>
                      <th style="width:20%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in responseWorkOrderList"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.work_order_number"
                      >
                      </td>
                      <td
                       v-text=""
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td
                       v-text="value."
                      >
                      </td>
                      <td class="table-input-td">
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click=""
                        >
                          <i class="fa fa-tasks fa-fw"></i>过程详情
                        </a>
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click="showWorkOrderDetailModal"
                        >
                          <i class="fa fa-tasks fa-fw"></i>工单详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="panel-footer">
                  <div class="pull-right">
                    <el-pagination
                      background
                      :page-size="pageSize"
                      layout="total, prev, pager, next"
                      :current-page.sync="currentPage"
                      :total="total"
                      @current-change="searchServerData"
                    >
                    </el-pagination>
                  </div>
                </div>
              </div>
            `
          }
        },
        template: `
          <div>
            <base-info
              v-if="needShowModule.baseInfo"
              :responseBaseInfo="responseBaseInfo"
            >
            </base-info>
            <dom-list
              v-if="needShowModule.domList"
              :responseBomList="responseBomList"
            >
            </dom-list>
            <work-order
              v-if="needShowModule.workOrder"
              :responseWorkOrderList="responseWorkOrderList"
            >
            </work-order>
          </div>
        `
      },

      // 生产过程详情
      productionPlanDetailProcess: {
        template: `
          <div class="panel panel-default relative">
            <div class="panel-body">
              <el-steps
                space="100px"
                :active="2"
                finish-status="success"
                process-status="process"
                direction="vertical"
              >
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
              </el-steps>
            </div>
          </div>
        `
      },

      // 生产进度详情
      productionPlanDetailSchedule: {
        template: `
          <div>
            <div class="panel panel-default relative">
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <h4>生产计划总进度</h4>
                  </div>
                  <div class="col-xs-8">
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <el-progress
                  :text-inside="true"
                  :stroke-width="25"
                  :percentage="70"
                >
                </el-progress>
              </div>
            </div>
            <div class="panel panel-default relative">
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <h4>工单生产进度</h4>
                  </div>
                  <div class="col-xs-8">
                  </div>
                </div>
              </div>
              <div class="panel-body">
                <el-steps
                  space="100px"
                  :active="2"
                  finish-status="success"
                  process-status="process"
                  direction="vertical"
                >
                  <el-step title="步骤 1"></el-step>
                  <el-step title="步骤 2"></el-step>
                  <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
                </el-steps>
              </div>
            </div>
          </div>
        `
      },

      // 审核详情
      productionPlanDetailApprove: {
        template: `
          <div class="panel panel-default relative">
            <div class="panel-body">
              <el-steps
                space="100px"
                :active="2"
                finish-status="success"
                process-status="process"
                direction="vertical"
              >
                <el-step title="步骤 1"></el-step>
                <el-step title="步骤 2"></el-step>
                <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
              </el-steps>
            </div>
          </div>
        `
      }
    },
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">工单详情</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#workOrderDetailBase" data-toggle="tab">基础信息</a>
              </li>
              <!--
              <li>
                <a href="#workOrderDetailStep" data-toggle="tab">工步信息</a>
              </li>
              <li>
                <a href="#workOrderDetailEnvironment" data-toggle="tab">环境参数</a>
              </li>
              <li>
                <a href="#workOrderDetailSemiFinishedProduct" data-toggle="tab">半成品参数</a>
              </li>
              <li>
                <a href="#workOrderDetailOther" data-toggle="tab">其它参数</a>
              </li>
              -->
              <li>
                <a href="#workOrderProcess" data-toggle="tab">工单过程</a>
              </li>
            </ul>
            <div class="tab-content">
              <!-- 生产计划详情基础 -->
              <div class="tab-pane active" id="workOrderDetailBase">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:15%">
                        工单号
                      </th>
                      <td
                        style="width:18.3%"
                        v-text="workOrder.work_order_number"
                      >
                      </td>
                      <th style="width:15%">
                        预计产出量
                      </th>
                      <td
                        style="width:18.3%"
                        v-text="workOrder.work_order_expected_output"
                      >
                      </td>
                      <th style="width:15%">
                        生产车间
                      </th>
                      <td
                        style="width:18.3%"
                        v-text="workOrder.role_workshop_name"
                      >
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        工单创建人
                      </th>
                      <td
                      v-text="workOrder.work_order_creators"
                      >
                      </td>
                      <th>
                        工单负责人
                      </th>
                      <td
                      v-text="workOrder.work_order_responsible"
                      >
                      </td>
                      <th>
                        工序负责人
                      </th>
                      <td
                         v-text="workOrder.planQuotesWorkstage ? workOrder.planQuotesWorkstage.workstage_responsible : '' "
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        预定开始时间
                      </th>
                      <td>
                        {{workOrder.work_order_scheduled_start_time | standardTime}}
                      </td>
                      <th>
                        预定完成时间
                      </th>
                      <td>
                        {{workOrder.work_order_estimated_completion_time | standardTime}}
                      </td>
                      <th>
                        实际产出量
                      </th>
                      <td
                        v-text="workOrder.work_order_actual_output"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        实际开始时间
                      </th>
                      <td>
                        {{workOrder.work_order_actual_start_time | standardTime}}
                      </td>
                      <th>
                        实际完成时间
                      </th>
                      <td>
                        {{workOrder.work_order_actual_finish_time | standardTime}}
                      </td>
                      <th>
                        班次
                      </th>
                      <td
                        v-text="workOrder.work_order_classes"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工序名称
                      </th>
                      <td
                        v-text="workStage.workstage_name"
                      >
                      </td>
                      <th>
                        工序编号
                      </th>
                      <td
                        v-text="workStage.workstage_number"
                      >
                      </td>
                      <th>
                        级性
                      </th>
                      <td
                        v-text="workStage.workstage_polarity"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工序版本号
                      </th>
                      <td
                        v-text="workStage.workstage_versions"
                      >
                      </td>
                      <th>
                        工序优率
                      </th>
                      <td
                        v-text="workStage.workstage_quality_rate"
                      >
                      </td>
                      <th>
                        预计产出量
                      </th>
                      <td
                        v-text="workStage.expected_output"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        半成品单位
                      </th>
                      <td
                        v-text="workStage.semi_finish_unit"
                      >
                      </td>
                      <th>
                        半成品类型
                      </th>
                      <td
                        v-text="workStage.semi_finish_type_name"
                      >
                      </td>
                      <th>
                        半成品型号
                      </th>
                      <td
                        v-text="workStage.semi_finish_genre"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        创建时间
                      </th>
                      <td>
                        {{workOrder.work_order_creation_time | standardTime}}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--
              <div class="tab-pane" id="workOrderDetailBase">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width:15%">
                        工单号
                      </th>
                      <td
                        style="width:18.3%"
                        v-text="responseData.work_order_number"
                      >
                      </td>
                      <th style="width:15%">
                        所属生产批号
                      </th>
                      <td
                        style="width:18.3%"
                        v-text=""
                      >
                      </td>
                      <th style="width:15%">
                        产品型号
                      </th>
                      <td
                        style="width:18.3%"
                        v-text="workstage.product_model_genre"
                      >
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>
                        工艺
                      </th>
                      <td
                        v-text="responseData.craft_name"
                      >
                      </td>
                      <th>
                        工艺版本
                      </th>
                      <td
                        v-text="responseData.craft_versions"
                      >
                      </td>
                      <th>
                        工序
                      </th>
                      <td
                        v-text="workstage.workstage_name"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工序优率
                      </th>
                      <td
                         v-text="workstage.workstage_quality_rate"
                      >
                      </td>
                      <th>
                        工序负责人
                      </th>
                      <td
                         v-text="workstage.workstage_creation_staff"
                      >
                      </td>
                      <th>
                        级性
                      </th>
                      <td
                         v-text="workstage.workstage_polarity"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        半成品类型
                      </th>
                      <td
                         v-text="workstage.semi_finish_type_name"
                      >
                      </td>
                      <th>
                        半成品型号
                      </th>
                      <td
                         v-text="workstage.semi_finish_genre"
                      >
                      </td>
                      <th>
                        预计产出量
                      </th>
                      <td
                        v-text="responseData.production_expected_output"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        半成品单位
                      </th>
                      <td
                        v-text="workstage.semi_finish_unit"
                      >
                      </td>
                      <th>
                        生产线
                      </th>
                      <td
                        v-text="responseData.product_line_name"
                      >
                      </td>
                      <th>
                        生产车间
                      </th>
                      <td
                        v-text="responseData.role_workshop_name"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        生产优先级
                      </th>
                      <td
                        v-text="responseData.production_plan_production_priority"
                      >
                      </td>
                      <th>
                        工单创建人
                      </th>
                      <td
                        v-text="responseData.work_order_creators"
                      >
                      </td>
                      <th>
                        工单负责人
                      </th>
                      <td
                        v-text="responseData.work_order_responsible"
                      >
                      </td>
                    </tr>
                    <tr>
                      <th>
                        工单创建时间
                      </th>
                      <td>
                        {{responseData.work_order_creation_time | standardTime}}
                      </td>
                      <th>
                        预定开始时间
                      </th>
                      <td>
                         {{responseData.work_order_scheduled_start_time | standardTime}}
                      </td>
                      <th>
                        预定完成时间
                      </th>
                      <td>
                         {{responseData.work_order_estimated_completion_time | standardTime}}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        实际产出量
                      </th>
                      <td
                        v-text="responseData.work_order_actual_output"
                      >
                      </td>
                      <th>
                        实际开始时间
                      </th>
                      <td>
                        {{responseData.work_order_actual_start_time | standardTime}}
                      </td>
                      <th>
                        实际完成时间
                      </th>
                      <td>
                        {{responseData.work_order_actual_finish_time | standardTime}}
                      </td>
                    </tr>
                    <tr>
                      <th>
                        班次
                      </th>
                      <td
                        v-text="responseData.work_order_classes"
                      >
                      </td>
                      <th>

                      </th>
                      <td
                        v-text=""
                      >
                      </td>
                      <th>

                      </th>
                      <td
                        v-text=""
                      >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane" id="workOrderDetailStep">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 5%;">序号</th>
                      <th style="width: 15%;">工步名称</th>
                      <th style="width: 15%;">工步编号</th>
                      <th style="width: 10%;">工步版本</th>
                      <th style="width: 10%;">所属产品类型</th>
                      <th style="width: 10%;">产品型号</th>
                      <th style="width: 10%;">极性</th>
                      <th style="width: 25%;">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in stepList"
                      :key="index"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.craft_control_workstep_name"
                      >
                      </td>
                      <td
                        v-text="value.craft_control_workstep_num"
                      >
                      </td>
                      <td
                        v-text="value.craft_control_workstep_version"
                      >
                      </td>
                      <td
                        v-text="value.product_type_name"
                      >
                      </td>
                      <td
                        v-text="value.product_model_genre"
                      >
                      </td>
                      <td
                        v-text="value.product_polar"
                      >
                      </td>
                      <td class="table-input-td">
                        <a href="javascript:;" class="table-link">
                          <i class="fa fa-tasks fa-fw"></i>详情
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane" id="workOrderDetailEnvironment">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 10%;">序号</th>
                      <th style="width: 30%;">参数</th>
                      <th style="width: 30%;">参考值</th>
                      <th style="width: 30%;">单位</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in environmentParamList"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.workstage_use_parameter_name"
                      >
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'constantValue'"
                      >
                        {{value.workstage_use_parameter_constant_value}}
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'rangeValue'"
                      >
                        ≤{{value.workstage_use_parameter_minimum_value}}≤{{value.workstage_use_parameter_max_value}}
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'deviationValue'"
                      >
                        {{value.workstage_use_parameter_constant_value}}±workstage_use_parameter_error_value
                      </td>
                      <td
                        v-text="value.workstage_use_parameter_unit"
                      >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane" id="workOrderDetailSemiFinishedProduct">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 10%;">序号</th>
                      <th style="width: 30%;">参数</th>
                      <th style="width: 30%;">参考值</th>
                      <th style="width: 30%;">单位</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in semiFinishedProduct"
                    >
                      <td
                        v-text="index + 1"
                      >
                      </td>
                      <td
                        v-text="value.workstage_use_parameter_name"
                      >
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'constantValue'"
                      >
                        {{value.workstage_use_parameter_constant_value}}
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'rangeValue'"
                      >
                        ≤{{value.workstage_use_parameter_minimum_value}}≤{{value.workstage_use_parameter_max_value}}
                      </td>
                      <td
                        v-show="value.workstage_use_parameter_value_type === 'deviationValue'"
                      >
                        {{value.workstage_use_parameter_constant_value}}±workstage_use_parameter_error_value
                      </td>
                      <td
                        v-text="value.workstage_use_parameter_unit"
                      >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tab-pane" id="workOrderDetailOther">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style="width: 10%;">序号</th>
                      <th style="width: 15%;">参数</th>
                      <th style="width: 30%;">参数类型</th>
                      <th style="width: 15%;">参考值</th>
                      <th style="width: 30%;">单位</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr

                    >
                      <td
                        v-text=""
                      >
                      </td>
                      <td
                        v-text=""
                      >
                      </td>
                      <td
                        v-text=""
                      >
                      </td>
                      <td
                        v-text=""
                      >
                      </td>
                      <td
                        v-text=""
                      >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              -->
              <div class="tab-pane" id="workOrderProcess">
                <el-steps
                  v-if="workOrderPerocessList.length"
                  space="100px"
                  :active="workOrderPerocessList.length"
                  finish-status="success"
                  process-status="process"
                  direction="vertical"
                >
                <el-step
                  v-for="(value, index) in workOrderPerocessList"
                  :key="index"
                  :title="value.process_records_operator + '    ' + standardTime(value.process_records_operation_time) + '    ' + value.process_records_operation_type"
                  :description="value.process_records_operating_instructions"
                >
                </el-step>
              </el-steps>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 添加生产计划模态框VM
  let addProductionPlanVM = new Vue({
    el: addProductionPlanModalModalDialog,
    data () {
      return {
        // 添加生产计划的类型
        addProductionPlanType: '',
        // 父级传递的生产计划信息
        productionPlanId: '',
        // 生产计划详细信息
        productionPlanDetailInfo: {
          baseInfo: null,
          bomList: null,
          workOrderList: null
        },
        // 计划类型
        planType: [],
        // 选中的计划类型
        selectedPlanType: '生产计划',
        // 条形码
        RQcode: '',
        orderNumber: '', // 订单编号
        // 是否新产
        whetherForNewSeleteOPtions: ['是', '否'],
        // 选择的是否新产
        selectedWhetherForNew: '是',
        productionPlanBatchNumber: '', // 生产计划批号
        // 生产优先级
        productionPriorityGrade: [],
        // 选中的生产优先级
        selectedProductionPriorityGrade: '正常',
        // 产品类型
        productType: {
          product_model_type_id: '',
          product_type_name: '',
          product_type_number: '',
          product_type_status: ''
        },
        // 产品型号
        productModelNumber: {
          product_model_name: '', // 型号名称
          product_model_id: '', // 型号id
          product_model_capacity: 0, // 容量
          product_model_capacity_unit: '', // 容量单位
          product_model_unit: '', // 产品型号单位
        },
        // 工艺
        craft: {
          craft_id: '',
          craft_name: '',
          craft_number: '',
          craft_versions: '',
          craft_quality_rate: 0, // 优率
          product_line_name: '', // 生产线
          product_line_id: '', // 生产线id
        },
        orderProductionQuantity: 0, // 订单生产数
        batchSchedulingQuantity: 0, // 批次排产数
        productionQuantity: 0, // 预计产出量
        productionCapacity: 0, // 排产容量
        // 创建人
        creationStaff: {
          role_staff_name: USERNAME || '管理员',
          role_staff_id: USERID || 'eafbdeecabb14446a31d75d223586dfc'
        },
        // 计划审批人
        planApprovalStaff: {
          role_staff_name: '',
          role_staff_id: ''
        },
        // 生产计划负责人
        productionPlanLeader: {
          role_staff_name: '',
          role_staff_id: ''
        },
        workStageDataList: [], // 工序数据列表
        // 工序用户输入的数据列表
        workStageUserInputDataList: [
          /* {
            productionQuanlity: 0,
            productionLeaderName: '',
            productionLeaderId: ''
          } */
        ],
        // 非正常的生产计划类型时用户选择
        notStandardProductionPlanUserSelectedWorkStageList: new Set()
      }
    },
    computed: {
      bodyParam () {
        const quotesWorkstage = () => {
          if (this.addProductionPlanType === 'split' || this.addProductionPlanType === 'merge') {
            return this.workStageDataList
          } else {
            const workStageList = []
            if (this.selectedPlanType !== '生产计划') {
              for (const [index, value] of this.notStandardProductionPlanUserSelectedWorkStageList.entries()) {
                workStageList.push(value)
              }
            }
            else {
              for (const [index, value] of this.workStageDataList.entries()) {
                /* const workStage = {
                  plan_quotes_workstage_id: '', // 生产计划—工序id
                  production_plan_id: '', // 生产计划id
                  workstage_name: value.workstage_name, // 工序名称
                  workstage_basics_id: '', // 工序基础信息id
                  workstage_number: value.workstage_number, // 工序编号
                  workstage_polarity: value.workstage_polarity, // 极性
                  workstage_versions: value.workstage_versions, // 工序版本号
                  workstage_quality_rate: value.workstage_quality_rate, // 工序优率
                  workstage_id: value.workstage_id, // 工序id
                  expected_output: value.expected_output, // 预计产出量
                  semi_finish_unit: value.semi_finish_unit, // 半成品单位
                  semi_finish_type_name: value.semi_finish_type_name, // 半成品类型
                  semi_finish_type_id: value.semi_finish_type_id, // 半成品类型id
                  semi_finish_genre: value.semi_finish_genre, // 半成品型号
                  semi_finish_id: value.semi_finish_id, // 半成品型号id
                  workstage_responsible: value.workstage_responsible, // 工序负责人
                  workstage_responsible_id: value.workstage_responsible_id, // 工序负责人id
                  quotes_workstage_order: index, // 顺序
                } */
                workStageList.push(value)
              }
            }
            return workStageList
          }
        }
        const addProductionPlanStartTime = document.getElementById('addProductionPlanStartTime')
        const addProductionPlanEndTime = document.getElementById('addProductionPlanEndTime')
        const addProductionPlanStartValue = new Date(addProductionPlanStartTime.value).getTime()
        const addProductionPlanEndTimeValue = new Date(addProductionPlanEndTime.value).getTime()
        const body = {
          plan: {
            production_plan_id: '', //生产计划id
            production_plan_type: this.selectedPlanType, //生产计划类型
            production_plan_type_id: '', //生产计划类型id
            production_plan_QRCode: this.RQcode, //生产计划QRCode
            production_plan_order_number: this.orderNumber, //订单编号
            production_plan_order_number_id: '', //订单编号id
            production_plan_judge_whether: this.selectedWhetherForNew, //是否新产
            production_plan_batch_number: this.productionPlanBatchNumber, //生产批号
            production_plan_production_priority: this.selectedProductionPriorityGrade, //生产优先级
            product_type_name: this.productType.product_type_name, //产品类型
            product_type_id: this.productType.product_model_type_id, //产品类型id
            product_model_name: this.productModelNumber.product_model_name, //产品型号
            product_model_id: this.productModelNumber.product_model_id, //产品型号id
            craft_name: this.craft.craft_name, //工艺名称
            workstage_basics_id: '', //工序基础信息id
            craft_versions: this.craft.craft_versions, //工艺版本号
            craft_id: this.craft.craft_id, //工艺id
            product_line_name: this.craft.product_line_name, //生产线
            product_line_id: this.craft.product_line_id, //生产线id
            production_plan_optimal_rate: this.craft.craft_quality_rate, //优率
            product_model_capacity: this.productModelNumber.product_model_capacity, //产品容量
            product_model_capacity_unit: this.productModelNumber.product_model_capacity_unit, //产品额定容量单位
            product_model_unit: this.productModelNumber.product_model_unit, //产品单位
            craft_bom_name: '', //BOM名称
            craft_bom_version: '', //BOM版本
            craft_bom_id: '', //BOM版本id
            production_order_production_number: this.orderProductionQuantity, //订单生产数
            production_batch_production_number: this.batchSchedulingQuantity, //批次排产数
            production_scheduling_optimization_rate: this.craft.craft_quality_rate, //排产优率
            production_expected_output: this.productionQuantity, //预计产出量
            production_scheduling_capacity: Number.parseFloat(this.productionCapacity), //排产容量
            production_capacity_unit: 'mAh', //排产容量单位
            production_founder_staff: this.creationStaff.role_staff_name, //创建人
            production_founder_staff_id: this.creationStaff.role_staff_id, //创建人id
            production_verifier_staff: this.planApprovalStaff.role_staff_name, //审核人
            production_verifier_staff_id: this.planApprovalStaff.role_staff_id, //审核人id
            production_responsible_staff: this.productionPlanLeader.role_staff_name, //负责人
            production_responsible_staff_id: this.productionPlanLeader.role_staff_id, //负责人id
            production_creation_time: '', //创建时间
            production_scheduled_start_time: addProductionPlanStartValue, //预定开始时间
            production_estimated_completion_time: addProductionPlanEndTimeValue, //预定完成时间
            production_actual_output: '', //实际产出量
            production_actual_start_time: '', //实际开始时间
            production_actual_finish_time: '', //实际完成时间
          },
          quotesWorkstage: quotesWorkstage()
        }

        return body
      }
    },
    watch: {
      batchSchedulingQuantity (value, oldvalue) {
        const batchSchedulingQuantity = Number.parseFloat(this.batchSchedulingQuantity) // 批次排产数
        const goodProductRate = Number.parseFloat(this.craft.craft_quality_rate) // 良品率
        const productCapacity = Number.parseFloat(this.productModelNumber.product_model_capacity) // 产品容量

        // 设置预计产出量和排产容量
        if (batchSchedulingQuantity && goodProductRate) {
          this.productionQuantity = Number.parseInt(batchSchedulingQuantity * Number.parseFloat('0.' + goodProductRate))
          if (productCapacity) {
            this.productionCapacity = (this.productionQuantity * productCapacity) + 'mAh'
          }
        }
      },
      orderNumber (value, oldValue) {
        // this.queryWhetherForNew()
        this.getProductPlanBatchNumber()
      },
      orderProductionQuantity (value, oldValue) {
        this.setWorkOrderProductionQuanlity(value, oldValue)
      }
    },
    methods: {
      // 显示生产计划模态框
      showAddProductionPlanModal ({
        // 添加生产计划类型
        addProductionPlanType,
        // 生产计划信息
        productionPlanId,
        // 订单生产数
        orderProductionQuantity,
        // 订单排产数
        batchSchedulingQuantity
      } = {
          // 添加生产计划类型
          addProductionPlanType: '',
          // 生产计划信息
          productionPlanId: '',
          // 订单生产数
          orderProductionQuantity: 0,
          // 订单排产数
          batchSchedulingQuantity: 0
        }) {
          $(addProductionPlanModal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(addProductionPlanModal).modal('show')
          // 获取添加生产计划的类型
          this.addProductionPlanType = addProductionPlanType
          // 添加生产计划
          this.productionPlanId = productionPlanId
          // 运行初始化生产计划
          this.initAddProductionPlan({
            // 添加生产计划类型
            addProductionPlanType: addProductionPlanType,
            // 生产计划信息
            productionPlanId: productionPlanId,
            // 订单生产数
            orderProductionQuantity: orderProductionQuantity,
            // 订单排产数
            batchSchedulingQuantity: batchSchedulingQuantity
          })
      },
      // 初初始化添加生产计划
      async initAddProductionPlan (options) {
        // 正常的生产计划
        if (options.addProductionPlanType === 'normal' || options.addProductionPlanType === '') {
          return
        }
        // 合并与拆分生产计划
        else if (options.addProductionPlanType === 'merge' || options.addProductionPlanType === 'split') {
          // 生产计划id
          const productionPlanId = this.productionPlanId
          // 获取生产计划详细信息
          await this.getProductionPlanDetailInfo(productionPlanId)
          // 基础信息
          const baseInfo = this.productionPlanDetailInfo.baseInfo
          // 添加数据
          Object.assign(this, {
            // 选中的计划类型
            selectedPlanType: baseInfo.production_plan_type,
            // 订单编号
            orderNumber: baseInfo.production_plan_order_number,
            // 选择的是否新产
            selectedWhetherForNew: baseInfo.production_plan_judge_whether || '否',
            // 生产计划批号
            productionPlanBatchNumber: baseInfo.production_plan_batch_number,
            // 选中的生产优先级
            selectedProductionPriorityGrade: baseInfo.production_plan_production_priority,
            // 产品类型
            productType: {
              product_model_type_id: baseInfo.product_type_id,
              product_type_name: baseInfo.product_type_name,
              product_type_number: '',
              product_type_status: ''
            },
            // 产品型号
            productModelNumber: {
              product_model_name: baseInfo.product_model_name, // 型号名称
              product_model_id: baseInfo.product_model_id, // 型号id
              product_model_capacity: baseInfo.product_model_capacity, // 容量
              product_model_capacity_unit: baseInfo.product_model_capacity_unit, // 容量单位
              product_model_unit: baseInfo.product_model_unit, // 产品型号单位
            },
            // 工艺
            craft: {
              craft_id: baseInfo.craft_id,
              craft_name: baseInfo.craft_name,
              craft_number: '',
              craft_versions: baseInfo.craft_versions,
              craft_quality_rate: baseInfo.production_plan_optimal_rate, // 优率
              product_line_name: baseInfo.product_line_name, // 生产线
              product_line_id: baseInfo.product_line_id, // 生产线id
            },
            orderProductionQuantity: options.orderProductionQuantity || baseInfo.production_order_production_number, // 订单生产数
            batchSchedulingQuantity: options.batchSchedulingQuantity || baseInfo.production_batch_production_number, // 批次排产数
            productionQuantity: baseInfo.production_expected_output, // 预计产出量
            productionCapacity: baseInfo.production_scheduling_capacity, // 排产容量
            // 创建人
            creationStaff: {
              role_staff_name: baseInfo.production_founder_staff,
              role_staff_id: baseInfo.production_founder_staff_id
            },
            // 计划审批人
            planApprovalStaff: {
              role_staff_name: baseInfo.production_verifier_staff,
              role_staff_id: baseInfo.production_verifier_staff_id
            },
            // 生产计划负责人
            productionPlanLeader: {
              role_staff_name: baseInfo.production_responsible_staff,
              role_staff_id: baseInfo.production_responsible_staff_id
            },
            expectedStartTime: moment(baseInfo.production_scheduled_start_time).format('YYYY-MM-DD HH:mm:ss'), // 预计开始时间
            expectedFinishTime: moment(baseInfo.production_estimated_completion_time).format('YYYY-MM-DD HH:mm:ss'), // 预计完成时间
          })
          // 添加工艺版本id对应的工序时候传的options
          const getProductionPlanDetailInfoOptions = {
            craftId: this.craft.craft_id
          }
          // 添加工艺版本id对应得工序
          this.addCraftInsideProcess(getProductionPlanDetailInfoOptions)
          this.getProductPlanBatchNumber()
        }
      },
      // 不是普通新增生产计划时获取生产计划详细信息
      getProductionPlanDetailInfo (planId) {
        const url = queryPlanParticularsUrl
        const reqInit = {
          body: {
            planId: planId
          }
        }
        return new Promise((resolve, reject) => {
          mesReq(url, reqInit).then((data) => {
            const map = data.map
            const responseData = map.plan
            this.productionPlanDetailInfo.baseInfo = responseData
            this.productionPlanDetailInfo.bomList = responseData.planUseMaterialList
            this.productionPlanDetailInfo.workOrderList = responseData.workOrderList
            resolve()
          }).catch(reason => {
            reject()
          })
        })
      },
      // 获取生产计划类型
      getProductPlanType () {
        const url = queryPlanTypeUrl
        let body = {
          keyword: '',
          status: 0,
          headNum: 1
        }
        mesReq(url, {
          body: {}
        }).then((data) => {
          this.planType = []
          const map = data.map
          const counts = map.line
          const dataList = map.planTypes
          // this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.planType.push(rowData)
          }
        })
      },
      /* // 查看是否新产
      queryWhetherForNew () {
        const url = queryPlanIsNewestUrl
        let body = {
          orderNumber: this.orderNumber
        }
        mesReq(url, {
          body: body
        }).then((data) => {
          console.log(data)
          if (data.msg === 0) {
            this.whetherForNew = '是'
          }
          else {
            this.whetherForNew = '否'
          }
        })
      }, */
      // 获取生产计划批号
      getProductPlanBatchNumber () {
        const url = createPlanBatchNumberUrl
        let body = {
          orderNumber: this.orderNumber,
          productionLineId: this.craft.product_line_id
        }
        let isVoid = null
        for (const [key, value] of Object.entries(body)) {
          if (value === '') {
            isVoid = true
          }
          else {
            isVoid = false
          }
        }
        if (!isVoid) {
            return new Promise((resolve, reject) => {
                mesReq(url, {
                    body: body
                }).then((data) => {
                    this.productionPlanBatchNumber = data.map.planBatchNumber
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        }
      },
      // 获取生产优先级类型
      getPriorityGradeType () {
        const url = queryPlanPriorityUrl
        let body = {
          keyword: '',
          status: 0,
          headNum: 1
        }
        mesReq(url, {
          body: {}
        }).then((data) => {
          console.log(data)
          this.productionPriorityGrade = []
          const map = data.map
          const counts = map.line
          const dataList = map.planPrioritys
          // this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.productionPriorityGrade.push(rowData)
          }
        })
      },
      // 存储产品类型
      saveSelectedProductType (config) {
        const modalName = 'queryProductTypeModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          for (const [key, value] of Object.entries(this.productType)) {
            this.productType[key] = data[key]
          }
        })
      },
      // 存储产品型号
      saveSelectedproductModelNumber (config) {
        const modalName = 'queryProductnumberModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          console.log(data)
          for (const [key, value] of Object.entries(this.productModelNumber)) {
            this.productModelNumber[key] = data[key]
          }
          console.log(this.productModelNumber)
        })
      },
      // 存储工艺
      saveSelectedCraft (config) {
          const modalName = 'queryCraftModal'
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            for (const [key, value] of Object.entries(this.craft)) {
              this.craft[key] = data[key]
            }
            // 获取生产计划批号
            this.getProductPlanBatchNumber().then(() => {
              // 查询工艺版本对应的工序
              const craftId = this.craft.craft_id
              const addCraftInsideProcessOptions = {
                craftId: ''
              }
              if (craftId !== '') {
                addCraftInsideProcessOptions.craftId = craftId
              }
              this.addCraftInsideProcess(addCraftInsideProcessOptions).then(() => {
                // 重新计算预计产出量
                this.setWorkOrderProductionQuanlity(this.orderProductionQuantity)
              })
            })
          })
      },
      // 存储选择的用户
      saveSelectedCreationStaff (config) {
        const modalName = 'mesQueryUserInfoModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          console.log(data)
          Object.assign(this[config.staffType], {
            role_staff_name: data.role_user_name,
            role_staff_id: data.role_user_id
          })
        })
      },
      // 添加工艺版本id对应得工序
      addCraftInsideProcess (options) {
        const url = queryWorkStageInfoUrl
        const body = {
          craftId: options.craftId
        }
        return new Promise((resolve, reject) => {
            mesReq(url, {
                body: body
            }).then((data) => {
                this.workStageDataList = []
                const map = data.map
                const counts = map.line
                const dataList = map.workstageList
                // this.total = counts
                this.workStageDataList = dataList
                // 为工序中用户需要填入的信息填充数组
                this.workStageUserInputDataList = new Array(dataList.length).fill({
                    productionQuanlity: 0,
                    productionLeaderName: '',
                    productionLeaderId: ''
                })
                let productionQuanlity = this.workStageDataList
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
      },
      // 存储选择的工单负责人
      saveSelectedWorkOrderStaff (config, index) {
        const modalName = 'mesQueryUserInfoModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          this.workStageDataList[index].workstage_responsible = data.role_user_name
          this.workStageDataList[index].workstage_responsible_id = data.role_user_id
          this.$forceUpdate()
        })
      },
      // 输入订单数的时候设置工单的生产量
    setWorkOrderProductionQuanlity (value, oldValue) {
        let productionQuanlity = value
        const workStageList = this.workStageDataList
        if (workStageList.length && this.workStageUserInputDataList.length) {
          for (const [index, value] of workStageList.entries()) {
            const optimalRate = Number('0.' + Number.parseFloat(value.workstage_quality_rate))
            productionQuanlity *= optimalRate
            this.workStageDataList[index].expected_output = Number.parseInt(productionQuanlity)
            // console.log("计算产出量：", this.workStageDataList[index].expected_output);
          }
          this.$forceUpdate()
        }
      },
      // 存储新增生产计划
      saveAddProductPlan () {
        console.log(this.bodyParam)
        const reqInit = {
          body: this.bodyParam
        }
        const reqConfig = {}
        const url = savePlanUrl
        swal({
          title: '确定提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          if (this.addProductionPlanType === 'split') {
            productionPlanVuex.$emit('returnSplitAddProductionPlanData', this.bodyParam.plan)
          }
          else if (this.addProductionPlanType === 'merge') {
            productionPlanVuex.$emit('returnMergeAddProductionPlanData', this.bodyParam.plan)
          }
          else {
            return new Promise((resolve, reject) => {
              mesReq(url, reqInit, reqConfig).then((data) => {
                console.log(data)
              }).then((data) => {
                console.log(data)
                resolve()
                swal({
                  title: '成功',
                  type: 'success',
                  timer: 1000
                })
              }).catch((err) => {
                reject(err)
                swal({
                  title: err.msg || '提交失败,请检查必选项',
                  type: 'error',
                })
              })
            })
          }
        })
      },
      // 选择工步
      selectedWorkStage (index) {
        // 初始化判断
        if (!index > -1 && !this.workStageDataList.length) {
          return
        }
        // 选择的行数据
        const selectedRowData = this.workStageDataList[index]
        // 是否包含选择的行数据
        const isIncludeRowData = () => {
          return this.notStandardProductionPlanUserSelectedWorkStageList.has(selectedRowData)
        }

        // 新建生产计划模态框
        const addProductionPlanModal = document.getElementById('addProductionPlanModal')
        // 所有选择按钮
        const selectedIcon = addProductionPlanModal.getElementsByClassName('selectedIcon')

        if (isIncludeRowData()) {
          // 包含的话走这里
          this.notStandardProductionPlanUserSelectedWorkStageList.delete(selectedRowData)
          selectedIcon[index].classList.remove('fa-check-square-o')
          selectedIcon[index].classList.add('fa-square-o')
          console.log(this.notStandardProductionPlanUserSelectedWorkStageList.size)
        }
        else {
          // 不包含的话走这里
          this.notStandardProductionPlanUserSelectedWorkStageList.add(selectedRowData)
          selectedIcon[index].classList.remove('fa-square-o')
          selectedIcon[index].classList.add('fa-check-square-o')
          console.log(this.notStandardProductionPlanUserSelectedWorkStageList.size)
        }
      },
      // 显示工序详情
      showProcessDetail (index) {
        productionPlanVuex.$emit('addProcessDetailData', this.workStageDataList[index].workstage_id)
      }
    },
    mounted () {
      // 获取生产计划类型
      this.getProductPlanType()
      // 获取生产优先级类型
      this.getPriorityGradeType()
      // 显示生产计划模态框
      productionPlanVuex.$on('showAddProductionPlanModal', this.showAddProductionPlanModal)
    },
    components: {},
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">新增生产计划</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#addProductionPlanBasic" data-toggle="tab">基础信息</a>
              </li>
              <li>
                <a href="#addProductionPlanProcess" data-toggle="tab">工序</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="addProductionPlanBasic">
                <div class="panel panel-default relative">
                  <div class="panel-body">
                    <form class="form-inline form-table">
                      <div class="row">
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">计划类型<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <select
                              class="form-control"
                              v-model="selectedPlanType"
                              :disabled="addProductionPlanType === 'merge' || addProductionPlanType === 'split'"
                            >
                              <option
                                v-for="(value, index) in planType"
                                :key="index"
                                v-text="value"
                                :value="value"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">条形码<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model.trim.lazy="RQcode"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">订单编号<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model.trim.lazy="orderNumber"
                              :readonly="addProductionPlanType === 'merge' || addProductionPlanType === 'split'"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">是否新产</label>
                            <select
                              class="form-control"
                              v-model="selectedWhetherForNew"
                              :disabled="addProductionPlanType === 'merge' || addProductionPlanType === 'split'"
                            >
                              <option
                                v-for="(value, index) in whetherForNewSeleteOPtions"
                                :key="index"
                                v-text="value"
                                :value="value"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">生产批号<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="productionPlanBatchNumber"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">生产优先级<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <select
                              class="form-control"
                              v-model="selectedProductionPriorityGrade"
                            >
                              <option
                                v-for="(value, index) in productionPriorityGrade"
                                :key="index"
                                v-text="value"
                                :value="value"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">产品类型<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="productType.product_type_name"
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedProductType"
                              title="查询产品类型"
                              href="javascript:;"
                              v-show="addProductionPlanType === 'normal'"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">产品型号<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="productModelNumber.product_model_name"
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedproductModelNumber({productTypeId:productType.product_model_type_id})"
                              title="查询产品型号"
                              href="javascript:;"
                              v-show="addProductionPlanType === 'normal'"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">工艺<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="craft.craft_name"
                              readonly
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedCraft"
                              title="查询工步名称"
                              href="javascript:;"
                              v-show="addProductionPlanType === 'normal'"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">工艺版本</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="craft.craft_versions"
                              readonly
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">生产线</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="craft.product_line_name"
                              readonly
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">优率</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="craft.craft_quality_rate"
                              readonly
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">产品容量</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productModelNumber.product_model_capacity + productModelNumber.product_model_capacity_unit"
                              readonly
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">产品单位</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productModelNumber.product_model_unit"
                              readonly
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">订单生产数<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model.number.trim.lazy="orderProductionQuantity"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">批次排产数<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model.number.trim="batchSchedulingQuantity"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计产出量</label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="productionQuantity"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">排产容量</label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="productionCapacity"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">创建人</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="creationStaff.role_staff_name"
                              readonly
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedCreationStaff({staffType:'creationStaff'})"
                              v-show="addProductionPlanType === 'normal'"
                              title="查询创建人"
                              href="javascript:;"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">计划审批人<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="planApprovalStaff.role_staff_name"
                              readonly
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedCreationStaff({staffType:'planApprovalStaff'})"
                              title="查询计划审批人"
                              href="javascript:;"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">计划负责人<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productionPlanLeader.role_staff_name"
                              readonly
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedCreationStaff({staffType:'productionPlanLeader'})"
                              title="计划负责人"
                              href="javascript:;"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计开始时间<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                              class="form-control"
                              id="addProductionPlanStartTime"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计完成时间<i style="color: red;">*&nbsp;&nbsp;</i></label>
                            <input
                              type="text"
                              onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                              class="form-control"
                              id="addProductionPlanEndTime"
                            >
                          </div>
                        </div>

                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="tab-pane" id="addProductionPlanProcess">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:10%">
                          工序名称
                        </th>
                        <th style="width:10%">
                          工序编号
                        </th>
                        <th style="width:10%">
                          极性
                        </th>
                        <th style="width:10%">
                          版本
                        </th>
                        <th style="width:10%">
                          优率
                        </th>
                        <th style="width:10%">
                          预计产出量
                        </th>
                        <th style="width:10%">
                          单位
                        </th>
                        <th style="width:10%">
                          工序负责人
                        </th>
                        <th style="width:15%">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, index) in workStageDataList"
                        :key="index"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="value.workstage_name"
                        >
                        </td>
                        <td
                          v-text="value.workstage_number"
                        >
                        <td
                          v-text="value.workstage_polarity"
                        >
                        </td>
                        <td
                          v-text="value.workstage_versions"
                        >
                        </td>
                        <td
                          v-text="value.workstage_quality_rate"
                        >
                        </td>
                        <td
                          v-text="value.expected_output"
                        >
                        </td>
                        <!--
                          <td
                            v-text="this.workStageUserInputDataList[index].productionQuanlity"
                          >
                          </td>
                        -->
                        <td
                          v-text="value.semi_finish_unit"
                        >
                        </td>
                        <td class="table-input-td">
                        <!--
                          <input
                            class="form-control
                            table-input input-sm"
                            v-model="this.workStageUserInputDataList[index].productionLeaderName"
                            @focus="saveSelectedWorkOrderStaff(null, index)"
                          >
                          </input>
                        -->
                          <input
                            class="form-control
                            table-input input-sm"
                            placeholder="选择负责人"
                            v-model="value.workstage_responsible"
                            @focus="saveSelectedWorkOrderStaff(null, index)"
                          >
                          </input>
                        </td>
                        <td class="table-input-td">
                          <a
                            class="table-link"
                            href="javascript:;"
                            @click="selectedWorkStage(index)"
                            v-show="selectedPlanType !== '生产计划'"
                          >
                            <i class="selectedIcon fa fa-square-o fa-lg fa-fw"></i>选择
                          </a>
                          <a
                            class="table-link"
                            href="javascript:;"
                            @click="showProcessDetail(index)"
                          >
                            <i class="fa fa-tasks fa-fw"></i>详情
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div class="row">
              <div class="col-xs-6">
                <!--<button class="btn btn-primary pull-left">打印</button>-->
              </div>
              <div class="col-xs-6">
                <button
                  class="btn btn-primary modal-submit"
                  v-text="'确认提交'"
                  @click="saveAddProductPlan"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 工序详情模态框VM
  let processDetailModalVM = new Vue({
    el: document.getElementById('queryProcessDetailModal').querySelector('.modal-content'),
    data () {
      return {
        baseInfo: {},
        useStepParam: [],
        environmentparam: [],
        semiFinishedProductParam: [],
        processDirection: [],
        pictureInfo: [],
        pictureUrl: BASE_PATH + '/' + 'downloadFile.do'
      }
    },
    methods: {
      processDetailValueType (valueType) {
        switch (valueType) {
          case 'constantValue':
            return '固定值'
            break;
          case 'rangeValue':
            return '范围值'
            break;
          case 'deviationValue':
            return '浮动值'
            break;
          default:
            return ''
            break;
        }
      },
      detailValueParam (data) {
        switch (data.workstage_use_parameter_value_type) {
          case 'constantValue':
            return `${data.workstage_use_parameter_constant_value}`
            break;
          case 'rangeValue':
            return `最小值: ${data.workstage_use_parameter_minimum_value}, 最大值: ${data.workstage_use_parameter_max_value}`
            break;
          case 'deviationValue':
            return `值: ${data.workstage_use_parameter_constant_value}, 浮动范围: ${data.workstage_use_parameter_error_value}`
            break;
          default:
            return ''
            break;
        }
      }
    },
    mounted () {
      productionPlanVuex.$on('addProcessDetailData', (processId) => {
        if (processId === undefined) {
          return
        }
        else {
          $(document.getElementById('queryProcessDetailModal')).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(document.getElementById('queryProcessDetailModal')).modal('show')
          const bodyParam = {
            workstageIds: []
          }
          bodyParam.workstageIds.push(processId)
          const url = BASE_PATH + '/' + 'queryWorkstageParticulars.do'
          const reqInit = {
            body: bodyParam
          }
          mesReq(url, reqInit).then((data) => {
            const map = data.map
            const processList = map.workstageList[0]
            const useParamList = processList.useParametersList
            if (this.pictureInfo.length) {
              this.pictureInfo = map.pictureInfo[0]
            }
            this.baseInfo = processList
            this.useStepParam = processList.stageAndStepRelationList
            this.environmentparam = (() => {
              return useParamList.filter(function (elem) {
                return elem.standard_parameter_type_name === '环境参数'
              })
            })()
            console.log(this.environmentparam)
            this.semiFinishedProductParam = (() => {
              return useParamList.filter(function (elem) {
                return elem.standard_parameter_type_name !== '环境参数'
              })
            })()
            this.processDirection = processList.processDescribleList
          })
        }
      })
    },
    template: `
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">查询工序</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#processDetailBaseInfo" data-toggle="tab">基础信息</a>
              </li>
              <li>
                <a href="#processDetailStepInfo" data-toggle="tab">工步</a>
              </li>
              <li>
                <a href="#processDetailEnvironmentInfo" data-toggle="tab">环境参数</a>
              </li>
              <li>
                <a href="#processDetailSemifinishedInfo" data-toggle="tab">半成品参数</a>
              </li>
              <li>
                <a href="#processDetailProcessInfo" data-toggle="tab">过程说明</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="processDetailBaseInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:15%">
                          工序名称
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_name"
                        >
                        </td>
                        <th style="width:15%">
                          工序编号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_number"
                        >
                        </td>
                        <th style="width:15%">
                          工序版本号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_versions"
                        >
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          所属产品类型
                        </th>
                        <td
                          v-text="baseInfo.product_model_type_name"
                        >
                        </td>
                        <th>
                          产品型号
                        </th>
                        <td
                          v-text="baseInfo.product_model_genre"
                        >
                        </td>
                        <th>
                          优率
                        </th>
                        <td
                          v-text="baseInfo.workstage_quality_rate"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          半成品类型
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_type_name"
                        >
                        </td>
                        <th>
                          半成品型号
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_genre"
                        >
                        </td>
                        <th>
                          半成品单位
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_unit"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          极性
                        </th>
                        <td
                          v-text="baseInfo.workstage_polarity"
                        >
                        </td>
                        <th>
                          录入人员
                        </th>
                        <td
                          v-text="baseInfo.workstage_creation_staff"
                        >
                        </td>
                        <th>
                          备注
                        </th>
                        <td
                          v-text="baseInfo.workstage_describe"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          过程图例
                        </th>
                        <td class="table-input-td">
                          <a
                            v-if="pictureInfo.img_name"
                            :href="pictureUrl + '?fileName=' + pictureInfo.img_name"
                            class="table-link"
                            download="工序过程图例"
                          >
                            <i class="fa fa-tasks fa-fw"></i>查看图片
                          </a>
                        </td>
                        <th>
                        </th>
                        <td>
                        </td>
                        <th>
                        </th>
                        <td>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailStepInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          工步名称
                        </th>
                        <th style="width:20%">
                          工步编号
                        </th>
                        <th style="width:10%">
                          极性
                        </th>
                        <th style="width:15%">
                          工步版本
                        </th>
                        <th style="width:15%">
                          所属产品类型
                        </th>
                        <th style="width:15%">
                          产品型号
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in useStepParam"
                        :key="index"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_name"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_num"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_polar"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_version"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_type_name"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_model_genre"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailEnvironmentInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          参数名称
                        </th>
                        <th style="width:20%">
                          参数类型
                        </th>
                        <th style="width:40%">
                          值
                        </th>
                        <th style="width:15%">
                          单位
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key) in environmentparam"
                        :key="key"
                      >
                        <td
                          v-text="key + 1"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_name"
                        >
                        </td>
                        <td
                          v-text="processDetailValueType(value.workstage_use_parameter_value_type)"
                        >
                        </td>
                        <td
                          v-text="detailValueParam(value)"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailSemifinishedInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          参数名称
                        </th>
                        <th style="width:20%">
                          参数类型
                        </th>
                        <th style="width:40%">
                          值
                        </th>
                        <th style="width:15%">
                          单位
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key) in semiFinishedProductParam"
                        :key="key"
                      >
                        <td
                          v-text="key + 1"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_name"
                        >
                        </td>
                        <td
                          v-text="processDetailValueType(value.workstage_use_parameter_value_type)"
                        >
                        </td>
                        <td
                          v-text="detailValueParam(value)"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailProcessInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:30%">
                          事项
                        </th>
                        <th style="width:65%">
                          说明
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in processDirection"
                        :key="index"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="item.proceeding"
                        >
                        </td>
                        <td
                           v-text="item.explain"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
  })
})