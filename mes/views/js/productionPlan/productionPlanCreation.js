window.addEventListener('load', (event) => {
  // const testModuls = document.getElementById('testPages')
  // const clickEvent = new MouseEvent('click', {
  //   'bubbles': true,
  //   'cancelable': true
  // })
  // testModuls.dispatchEvent(clickEvent)

  const localVuex = new Vue()
  // 生产计划管理swiper
  const productionPlanManageSwiper = document.getElementById('productionPlanManage1-2')
  const productionPlanManageSwiperPanel = productionPlanManageSwiper.querySelector('.content-body .panel')

  // 工单全部创建模态框
  const workOrderAllCreationModal = document.getElementById('workOrderAllCreationModal')
  const workOrderAllCreationModalDialog = workOrderAllCreationModal.querySelector('.modal-dialog')

  // 工单设置
  const workOrderSetingModal = document.getElementById('workOrderSetingModal')
  const workOrderSetingModalDialog = workOrderSetingModal.querySelector('.modal-dialog')

  // 拆分工单
  const splitWorkOrderModal = document.getElementById('splitWorkOderModal')
  const splitWorkOrderModalDialog = splitWorkOrderModal.querySelector('.modal-dialog')

  // 资源分配
  const resourceAllocationModal = document.getElementById('resourceAllocationModal')
  const resourceAllocationModalDialog = resourceAllocationModal.querySelector('.modal-dialog')

  // 添加工单
  const addWorkOrderModal = document.getElementById('addWorkOrderModal')
  const addWorkOrderModalDialog = addWorkOrderModal.querySelector('.modal-dialog')

  // 生产计划管理VM
  let addProductionPlanManageVM = new Vue({
    el: productionPlanManageSwiperPanel,
    data () {
      return {
        URL: '',
        queryBarInit: {
          keyWord: true,
          editAndDeleteState: true
        },
        bodyParam: {
          type: 'draft',
          draftStatus: 'edit',
          keyword: '',
          userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
          headNum: 1
        },
        tableData: [],
        pageSize: 15,
        total: 0,
        currentPage: 1,
        isUpdateTable: false
      }
    },
    methods: {
      // 显示添加生产计划模态框
      showAddProductionPlanModal (data) {
        const options = {
          // 添加生产计划类型
          addProductionPlanType: 'normal',
          // 生产计划信息
          productionPlanId: '',
          // 订单生产数
          orderProductionQuantity: 0,
          // 订单排产数
          batchSchedulingQuantity: 0
        }
        productionPlanVuex.$emit('showAddProductionPlanModal', options)
      },
      // 显示生产计划详情模态框
      showProductionPlanDetailModal (index) {
        const productionPlanDetailModalOptions = {
          needShowModule: {
            // 生产计划基础详情
            productionPlanDetail: true,
            // 生产计划基础详情子模块
            productionPlanDetailSubmodule: {
              // 基础信息
              baseInfo: true,
              // dom列表
              domList: true,
              // 工单
              workOrder: true
            },
            // 生产过程详情
            productionProcessDetail: false,
            // 生产进度详情
            productionSchedule: false,
            // 审核详情
            approveDetai: false,
            // 设置
            config: false,
            // 设置子模块
            configSubmodule: {
              // 计划调度
              dispatch: false,
              // 重新发起
              resubmit: false,
              // 关闭
              close: false,
              // 永久关闭
              perpetualClose: false,
              // 下发
              issued: false,
              // 恢复计划
              recoverPlan: false,
              // 关闭生产
              planCloseProduction: false,
              // 计划审批
              approvalHandle: false,
              // 转交
              careof: false,
              // 暂停生产
              pauseProduction: false,
              // 恢复生产
              continueProduction: false,
              // 生产完成
              finishProduction: false
            }
          },
          // 生产计划id
          planId: this.tableData[index].production_plan_id || ''
        }

        // 发出显示生产计划模态框
        productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
      },
      // 搜索栏搜索
      searchBarQuery (queryParam) {
        console.log(queryParam)
        if (queryParam !== undefined) {
          this.bodyParam.keyword = queryParam.keyword
          this.bodyParam.draftStatus = queryParam.editAndDeleteState
        }
        this.currentPage = 1
        this.pageTurning()
      },
      // 翻页
      pageTurning (curryPage) {
        const url = queryDraftPlanOutlineUrl
        if (curryPage) {
          this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
        }
        const reqInit = {
          body: this.bodyParam
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(url, reqInit, reqConfig)
          .then((data) => {
            this.tableData = []
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              this.tableData.push(value)
            }
            this.isUpdateTable = false
          })
          .catch(reason => {
            this.tableData = []
            this.selectedIconClassList = []
          })
      },
      // 弃用计划
      planDeprecated (index) {
        swal({
          title: '确定要弃用吗？',
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
                type: 'deprecated',
                planIds: [this.tableData[index].production_plan_id],
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
              this.isUpdateTable = true
            }).catch((err) => {
              reject(err)
              swal({
                title: err.msg || '弃用失败',
                type: 'error',
              })
            })
          })
        })
      },
      // 恢复计划
      planRecover (index) {
        swal({
          title: '确定要恢复吗？',
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
                planIds: [this.tableData[index].production_plan_id],
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
              this.isUpdateTable = true
            }).catch((err) => {
              reject(err)
              swal({
                title: err.msg || '恢复失败',
                type: 'error',
              })
            })
          })
        })
      },
      // 删除计划
      planRemove (index) {
        swal({
          title: '确定要删除吗？删除后不可恢复',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            const url = removeDraftPlanUrl
            const reqConfig = null
            const reqInit = {
              body: {
                // planId: [this.tableData[index].production_plan_id],
                planId: this.tableData[index].production_plan_id
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
              this.isUpdateTable = true
            }).catch((err) => {
              reject(err)
              swal({
                title: err.msg || '恢复失败',
                type: 'error',
              })
            })
          })
        })
      },
      // 显示创建全部工单
      showWorkOrderAllCreation (index) {
        const planId = this.tableData[index].production_plan_id
        localVuex.$emit('showWorkOrderAllCreationModal', planId)
      },
      // 显示资源分配模态框
      showResuorceAllocation (index) {
        const plan = this.tableData[index]
        localVuex.$emit('showResourceAllocationModal', plan)
      },
      // 提交审核
      submitApprove (index) {
        swal({
          title: '确定要提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            console.log(this.tableData)
            const url = modifyPlanCheckStatusUrl
            const reqInit = {
              body: {
                type: 'normalWait',
                userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
                planIds: [this.tableData[index].production_plan_id]
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
              this.isUpdateTable = true
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
    template: `
      <div
        class="panel panel-default"
        ref="panel"
      >
        <div class="panel-heading panel-heading-table">
          <div class="row">
            <div class="col-xs-4">
              <form class="form-inline">
                <a
                  href="javascript:;"
                  class="btn btn-primary btn-sm"
                  v-text="'新建生产计划'"
                  @click.prevent="showAddProductionPlanModal">
                </a>
              </form>
            </div>
            <div class="col-xs-8">
              <mes-process-searchbar
                :emitSearch="isUpdateTable"
                :init="queryBarInit"
                @search="searchBarQuery"
              >
              </mes-process-searchbar>
            </div>
          </div>
        </div>
        <div class="panel-body-table table-height-15">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th style="width: 5%;">序号</th>
                <th style="width: 10%;">订单编号</th>
                <th style="width: 10%;">生产批次</th>
                <th style="width: 10%;">订单生产数</th>
                <th style="width: 15%;">预定完成日期</th>
                <th style="width: 10%;">生产优先级</th>
                <th style="width: 10%;">保存时间</th>
                <th style="width: 30%;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(value, index) in tableData"
                :key="index"
              >
                <td
                  v-text="index + 1"
                >
                </td>
                <td
                  v-text="value.production_plan_order_number"
                >
                </td>
                <td
                  v-text="value.production_plan_batch_number"
                >
                </td>
                <td
                  v-text="value.production_order_production_number"
                >
                </td>
                <td>
                  {{value.production_estimated_completion_time | standardTime}}
                </td>
                <td
                  v-text="value.production_plan_production_priority"
                >
                </td>
                <td>
                  {{value.production_creation_time | standardTime}}
                </td>
                <td class="table-input-td">
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="showProductionPlanDetailModal(index)"
                  >
                    <i class="fa fa-tasks fa-fw"></i>计划详情
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="showResuorceAllocation(index)"
                    v-show="bodyParam.draftStatus === 'edit'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>资源分配
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="showWorkOrderAllCreation(index)"
                    v-show="bodyParam.draftStatus === 'edit'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>生成工单
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="planDeprecated(index)"
                    v-show="bodyParam.draftStatus === 'edit'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>弃用
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="planRecover(index)"
                    v-show="bodyParam.draftStatus === 'delete'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>恢复
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="planRemove(index)"
                    v-show="bodyParam.draftStatus === 'delete'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>删除
                  </a>
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="submitApprove(index)"
                    v-show="bodyParam.draftStatus === 'edit'"
                  >
                    <i class="fa fa-tasks fa-fw"></i>提交审核
                  </a>
                </td>
              </tr>
              <tr v-show="!tableData.length">
                <td class="text-center" colspan="8">
                  无数据，请按条件查询
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-footer">
          <div class="pull-right">
            <el-pagination
              background
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total"
              :current-page.sync="currentPage"
              @current-change="pageTurning(currentPage)"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    `
  })

  // 生成全部工单模态框
  let workOrderAllCreationModalVM = new Vue({
    el: workOrderAllCreationModalDialog,
    data () {
      return {
        planId: '',
        tableData: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      // 获取计划引用的工序
      getPlanQuotesWorkstage (planId) {
        this.planId = planId
        const url = queryPlanQuotesWorkstageUrl
        const reqInit = {
          body: {
            planId: planId
          }
        }
        const reqConfig = null
        mesReq(url, reqInit, reqConfig)
          .then((data) => {
            this.tableData = []
            const map = data.map
            const counts = map.line
            const dataList = map.quotesWorkstages
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              this.tableData.push(value)
            }
            console.log(this.tableData)
          })
          .catch(reason => {
            this.tableData = []
            console.log('失败了')
          })
      },
      // 显示工单设置模态框
      showWorkOrderSetingModal (index) {
        const options = {
          planId: this.planId,
          workstageId: this.tableData[index].workstage_id,
          workstageOrder: this.tableData[index].quotes_workstage_order
        }
        localVuex.$emit('showWorkOrderSetingModal', options)
      }
    },
    mounted () {
      // 显示创建模态框
      localVuex.$on('showWorkOrderAllCreationModal', planId => {

        // 获取生产计划id所对应工序
        this.getPlanQuotesWorkstage(planId)

        $(workOrderAllCreationModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(workOrderAllCreationModal).modal('show')
      })
    },
    components: {
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
            <h4 class="modal-title">工序生成工单</h4>
          </div>
          <div class="modal-body">
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
                <th style="width:8%">
                  优率
                </th>
                <th style="width:8%">
                  预计产出量
                </th>
                <th style="width:8%">
                  单位
                </th>
                <th style="width:8%">
                  工序负责人
                </th>
                <th style="width:13%">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(value, index) in tableData"
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
                </td>
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
                <td
                  v-text="value.semi_finish_unit"
                >
                </td>
                <td
                  v-text="value.workstage_responsible"
                >
                </td>
                <td class="table-input-td">
                  <a
                    class="table-link"
                    href="javascript:;"
                    @click="showWorkOrderSetingModal(index)"
                  >
                    <i class="fa fa-tasks fa-fw"></i>查看工单
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    `
  })

  // 工单设置模态框
  let workOrderSetingModalVM = new Vue({
    el: workOrderSetingModalDialog,
    data () {
      return {
        tableData: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      // 获取计划引用的工单
      getPlanQuotesWorkOrder (options) {
        console.log(options)
        const url = queryWorkOrderOutlineUrl
        const reqInit = {
          // body: {
          //   type: 'planQuotesWorkstage',
          //   planId: options.planId,
          //   // planQuotesWorkstageId: options.planQuotesWorkstageId
          //   workstageId: options.workstageId,
          //   planQuotesWorkstageId: options.workstageId
          // }
          body: {
            type: 'plan',
            planId: options.planId,
            workstageId: options.workstageId,
            workstageOrder: options.workstageOrder
          }
        }
        const reqConfig = null
        mesReq(url, reqInit, reqConfig)
          .then((data) => {
            this.tableData = []
            const map = data.map
            const counts = map.line
            const dataList = map.workOrders
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              this.tableData.push(value)
            }
          })
          .catch(reason => {
            this.tableData = []
            console.log('失败了')
          })
      },
      // 显示工单详情模态框
      showWorkOrderDetailModal (index) {
        const workOrderId = this.tableData[index].work_order_id
        productionPlanVuex.$emit('showWorkOrderDetailModal', workOrderId)
      },
      // 修改工单
      modifyWorkOrder (index) {
        const options = {
          type: 'modify',
          workOrder: this.tableData[index]
        }
        localVuex.$emit('showAddWorkOrderModal', options)
      },
      // 添加工单
      addWorkOrder (index) {
        const options = {
          type: 'save',
          workOrder: this.tableData[0]
        }
        localVuex.$emit('showAddWorkOrderModal', options)
      },
      // 拆分工单
      splitWorkOder (index) {
        localVuex.$emit('showSplitWorkOrderModal', this.tableData[index].work_order_id)
      },
      // 删除工单
      removeWorkOder (index) {
        swal({
          title: '确定要删除吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            const url = removeWorkOrderUrl
            const reqConfig = null
            const reqInit = {
              body: {
                workOrderIds: [this.tableData[index].work_order_id]
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
                title: err.msg || '删除失败',
                type: 'error',
              })
            })
          })
        })
      }
    },
    mounted () {
      // 显示创建模态框
      localVuex.$on('showWorkOrderSetingModal', options => {
        // 获取生产计划id所对应工序
        this.getPlanQuotesWorkOrder(options)

        $(workOrderSetingModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(workOrderSetingModal).modal('show')
      })
    },
    components: {
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
            <h4 class="modal-title">工单设置</h4>
          </div>
          <div class="modal-body">
            <div
              class="panel panel-default relative"
              ref="panel"
            >
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="addWorkOrder"
                    >
                      <i class="fa fa-search"></i>
                      添加工单
                    </button>
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
                    <th style="width:20%">
                      工单号
                    </th>
                    <th style="width:20%">
                      预计产出量
                    </th>
                    <th style="width:20%">
                      预计完成时间
                    </th>
                    <th style="width:35%">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(value, index) in tableData"
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
                      v-text="value.work_order_expected_output"
                    >
                    </td>
                    <td>
                      {{value.work_order_estimated_completion_time | standardTime}}
                    </td>
                    <td class="table-input-td">
                      <a
                        class="table-link"
                        href="javascript:;"
                        @click="showWorkOrderDetailModal(index)"
                      >
                        <i class="fa fa-tasks fa-fw"></i>工单详情
                      </a>
                      <a
                        class="table-link"
                        href="javascript:;"
                        @click="modifyWorkOrder(index)"
                      >
                        <i class="fa fa-tasks fa-fw"></i>修改
                      </a>
                      <a
                        class="table-link"
                        href="javascript:;"
                        @click="splitWorkOder(index)"
                      >
                        <i class="fa fa-tasks fa-fw"></i>拆分
                      </a>
                      <a
                        v-show="tableData.length > 1"
                        class="table-link"
                        href="javascript:;"
                        @click="removeWorkOder(index)"
                      >
                        <i class="fa fa-tasks fa-fw"></i>删除
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 添加工单
  let addWorkOrderModalVM = new Vue({
    el: addWorkOrderModalDialog,
    data: {
      type: 'save',
      baseWorkOrder: {},
      classSelectOptions: [],
      selectedClass: null,
    },
    computed: {
      bodyParam () {
        const quotesWorkstage = () => {
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

        const body = {
          plan: {
            production_plan_id: '', //生产计划id
            production_plan_type: this.selectedPlanType, //生产计划类型
            production_plan_type_id: '', //生产计划类型id
            production_plan_QRCode: '', //生产计划QRCode
            production_plan_order_number: this.orderNumber, //订单编号
            production_plan_order_number_id: '', //订单编号id
            production_plan_judge_whether: this.whetherForNew, //是否新产
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
            production_capacity_unit: 'wah', //排产容量单位
            production_founder_staff: this.creationStaff.role_staff_name, //创建人
            production_founder_staff_id: this.creationStaff.role_staff_id, //创建人id
            production_verifier_staff: this.planApprovalStaff.role_staff_name, //审核人
            production_verifier_staff_id: this.planApprovalStaff.role_staff_id, //审核人id
            production_responsible_staff: this.productionPlanLeader.role_staff_name, //负责人
            production_responsible_staff_id: this.productionPlanLeader.role_staff_id, //负责人id
            production_creation_time: '', //创建时间
            production_scheduled_start_time: new Date(this.expectedStartTime).getTime(), //预定开始时间
            production_estimated_completion_time: new Date(this.expectedFinishTime).getTime(), //预定完成时间
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
    },
    methods: {
      // 生成工单号
      getWorkOrderNumber () {
        console.log(this.baseWorkOrder)
        const url = createWorkOrderNumberUrl
        let body = {
          planId: this.baseWorkOrder.plan.production_plan_id,
          planBatchNumber: this.baseWorkOrder.plan.production_plan_batch_number, // 生产计划批号
          workstageMark: Number.parseInt(Math.random() * 10000), // 工序代号
          workstageId: this.baseWorkOrder.workstage_id, // 工序id
        }
        mesReq(url, {
          body: body
        })
          .then((data) => {
            Vue.set(this.baseWorkOrder, 'work_order_number', data.map.workOrderNumber)
          })
      },
      // 显示添加工单模态框
      showAddWorkOrderModal (options) {
        console.log(options)
        this.type = options.type
        this.baseWorkOrder = Object.assign({}, options.workOrder)
        if (options.type === 'save') {
          this.getWorkOrderNumber()
        }
        this.$forceUpdate()
        $(addWorkOrderModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(addWorkOrderModal).modal('show')
      },
      // 存储选择的用户
      saveSelectedCreationStaff (config) {
        const modalName = 'mesQueryUserInfoModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          Vue.set(this.baseWorkOrder, 'work_order_responsible', data.role_user_name)
          Vue.set(this.baseWorkOrder, 'work_order_responsible_id', data.role_user_id)
        })
      },
      // 获取生产线信息
      getProductionLineInfo () {
        const url = queryClassesUrl
        let body = {
          type: 'info',
          headNum: ''
        }
        mesReq(url, {
          body: body
        })
          .then((data) => {
          this.classSelectOptions = []
          const map = data.map
          const counts = map.lines
          const dataList = map.classes
          // this.total = counts
          for (const [index, value] of dataList.entries()) {
            this.classSelectOptions.push(value)
          }
          })
          .catch(reason => {
            this.classSelectOptions = []
          })
      },
      // 选择生产车间
      selectWorkshop (config) {
        const modalName = 'queryWorkshopModal'
        window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
          console.log(data)
          Vue.set(this.baseWorkOrder, 'role_workshop_name', data.role_workshop_name)
          Vue.set(this.baseWorkOrder, 'role_workshop_id', data.role_workshop_id)
        })
      },
      // 存储选择的班次
      savaSelectedClass () {
        console.log(this.baseWorkOrder.work_order_scheduled_start_time)
        this.baseWorkOrder.work_order_classes = this.selectedClass.role_class_name
        this.baseWorkOrder.work_order_classes_id = this.selectedClass.role_class_id
        console.log(this.baseWorkOrder.work_order_scheduled_start_time)
      },
      // 保存工单
      savaWorkOrder () {
        const addWorkOrderStartTime = document.getElementById('addWorkOrderStartTime')
        const addWorkOrderEndTime = document.getElementById('addWorkOrderEndTime')
        const addWorkOrderStartTimeValue = addWorkOrderStartTime.value
        const addWorkOrderEndTimeValue = addWorkOrderEndTime.value
        this.baseWorkOrder.work_order_scheduled_start_time = new Date(addWorkOrderStartTimeValue).getTime()
        this.baseWorkOrder.work_order_estimated_completion_time = new Date(addWorkOrderEndTimeValue).getTime()
        const reqInit = {
          body: {
            type: this.type,
            workOrders: [this.baseWorkOrder]
          }
        }
        const reqConfig = {}
        const url = saveWorkOrderUrl
        swal({
          title: '确定提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          // if (this.addProductionPlanType === 'split') {
          //   productionPlanVuex.$emit('returnSplitAddProductionPlanData', this.bodyParam)
          //   swal({
          //     title: '成功',
          //     type: 'success',
          //     timer: 1000
          //   })
          // }
          // else if (this.addProductionPlanType === 'merge') {
          //   productionPlanVuex.$emit('returnMergeAddProductionPlanData', this.bodyParam)
          //   swal({
          //     title: '成功',
          //     type: 'success',
          //     timer: 1000
          //   })
          // }
          // else {
          //   return new Promise((resolve, reject) => {
          //     mesReq(url, reqInit, reqConfig).then((data) => {
          //       console.log(data)
          //     }).then((data) => {
          //       console.log(data)
          //       resolve()
          //       swal({
          //         title: '成功',
          //         type: 'success',
          //         timer: 1000
          //       })
          //     }).catch((err) => {
          //       reject(err)
          //       swal({
          //         title: err.msg || '提交失败,请检查必选项',
          //         type: 'error',
          //       })
          //     })
          //   })
          // }
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
        })
      },
    },
    mounted () {
      // 显示添加工单模态框
      localVuex.$on('showAddWorkOrderModal', this.showAddWorkOrderModal)
      // 运行获取生产线信息
      this.getProductionLineInfo()
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
            <h4 v-if="type === 'save'" class="modal-title">新增工单</h4>
            <h4 v-else class="modal-title">修改工单</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#addProductionPlanBasic" data-toggle="tab">基础信息</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="addProductionPlanBasic">
                <div class="panel panel-default relative">
                  <div class="panel-body">
                    <form class="form-inline form-table">
                      <div class="row">
                        <div
                          class="col-md-4 col-xs-6"
                          v-show="type === 'save'"
                        >
                          <div
                            class="form-group pull-right"
                          >
                            <label class="control-label">工单二维码</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="baseWorkOrder.work_order_QRCode"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">工单编号</label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="baseWorkOrder.work_order_number"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计产出量</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="baseWorkOrder.work_order_expected_output"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">生产车间</label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="baseWorkOrder.role_workshop_name"
                            >
                            <a
                              class="input-btn"
                              @click="selectWorkshop"
                              title="查询生产车间"
                              href="javascript:;"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">工单负责人</label>
                            <input
                              type="text"
                              class="form-control"
                              readonly
                              v-model="baseWorkOrder.work_order_responsible"
                            >
                            <a
                              class="input-btn"
                              @click="saveSelectedCreationStaff"
                              title="查询工单负责人"
                              href="javascript:;"
                            >
                              <i class="fa fa-search"></i>
                            </a>
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计开始时间</label>
                            <input
                              type="text"
                              onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'})"
                              class="form-control"
                              id="addWorkOrderStartTime"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">预计完成时间</label>
                            <input
                              type="text"
                              onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'})"
                              class="form-control"
                              id="addWorkOrderEndTime"
                            >
                          </div>
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">班次</label>
                            <select
                              class="form-control"
                              v-model="selectedClass"
                              @change="savaSelectedClass"
                            >
                              <option
                                v-for="(value, index) in classSelectOptions"
                                :key="index"
                                :value="value"
                                v-text="value.role_class_name"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
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
                  @click="savaWorkOrder"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 拆分工单模态框
  let splitWorkOrderModalVM = new Vue({
    el: splitWorkOrderModalDialog,
    data () {
      return {
        splitWorkOderSelectOptionsData: [2,3,4,5,6,7,8,9,10],
        splitWorkOderQuantity: 2,
        splitWorkOderDataList: [0, 0]
      }
    },
    computed: {},
    watch: {},
    methods: {
      // 存储拆分后的工单
      savaSplitWorkOder () {
        const hasZero = this.splitWorkOderDataList.some((value, index) => {
          return value <= 0
        })
        if (hasZero) {
          this.$message({
            message: '生产数不能为0',
            type: 'warning'
          });
        } else {
          swal({
            title: '确定要提交吗？',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            return new Promise((resolve, reject) => {
              const url = splitWorkOrderUrl
              const reqInit = {
                body: {
                  workOrderId: this.workOrderId,
                  productionQuantity: this.splitWorkOderDataList
                }
              }
              const reqConfig = null
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
        }
      },
      createInput () {
        this.splitWorkOderDataList = new Array(this.splitWorkOderQuantity)
        this.splitWorkOderDataList.fill(0)
      }
    },
    mounted () {
      // 显示创建模态框
      localVuex.$on('showSplitWorkOrderModal', workOrderId => {
        this.workOrderId = workOrderId

        $(splitWorkOrderModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(splitWorkOrderModal).modal('show')
      })
    },
    components: {
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
            <h4 class="modal-title">拆分工单</h4>
          </div>
          <div class="modal-body">
            <form class="form-inline form-table">
              <div class="row">
                <div class="col-md-4 col-xs-6">
                  <div class="form-group pull-right">
                    <label class="control-label">拆分数量</label>
                    <select
                      class="form-control"
                      v-model="splitWorkOderQuantity"
                      @change="createInput"
                    >
                      <option
                        v-for="(value, index) in splitWorkOderSelectOptionsData"
                        :key="index"
                        v-text="value"
                        :value="value"
                      >
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div
                  class="col-md-4 col-xs-6"
                  v-for="(value, index) in splitWorkOderDataList"
                >
                  <div class="form-group pull-right">
                    <label class="control-label">工单{{index + 1}}预计产出量</label>
                    <input
                      class="form-control"
                      v-model="splitWorkOderDataList[index]"
                    >
                    </input>
                  </div>
                </div>
              </div>
            </form>
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
                  @click="savaSplitWorkOder"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 资源分配模态框
  let resourceAllocationModalVM = new Vue({
    el: resourceAllocationModalDialog,
    data () {
      return {
        plan: {},
        planUseMaterialList: [],
        bomVersionList: [],
        selectedBomIndex: ''
      }
    },
    computed: {},
    watch: {
      selectedBomIndex (valueI, oldValue) {
        this.planUseMaterialList.forEach((valueJ, index) => {
          Vue.set(valueJ, 'supplier_name', this.bomVersionList[valueI].craftBomMaterial.supplier_name)
          Vue.set(valueJ, 'supplier_id', this.bomVersionList[valueI].craftBomMaterial.supplier_id)
        })
        Object.assign(this.plan, {
          craft_bom_name: this.bomVersionList[valueI].craftBomMaterial.craft_bom_name,
          craft_bom_version: this.bomVersionList[valueI].craftBomMaterial.craft_bom_version,
          craft_bom_id: this.bomVersionList[valueI].craftBomMaterial.craft_bom_id
        })
      }
    },
    methods: {
      // 获取计划引用的物料
      getPlanUseMaterials (plan) {
        this.plan = plan
        const url = planResourceAllocationUrl
        const reqInit = {
          body: {
            plan: {
              // craft_bom_id: this.plan.craft_bom_id,
              // craft_id: this.plan.craft_id,
              // production_plan_id: this.plan.product_type_id
              craft_bom_id: '111111',
              craft_id: 'c15eea6c1e214310b9bc785e10e465d6',
              production_plan_id: '0f64f209c70a4150a5bd6878314d57ec'
            }
          }
        }
        const reqConfig = null
        mesReq(url, reqInit, reqConfig)
          .then((data) => {
            this.planUseMaterialList = []
            this.bomVersionList = []
            const map = data.map
            this.planUseMaterialList = map.planUseMaterials
            this.bomVersionList = map.BOMs
          })
          .catch(reason => {
            this.planUseMaterialList = []
            this.bomListL = []
            console.log('失败了')
          })
      },
      // 存储资源分配数据
      savaPlanUseMaterials () {
        swal({
          title: '确定要提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            const url = savePlanResourceAllocationUrl
            const reqInit = {
              body: {
                type: 'modify',
                plan: this.plan,
                planUseMaterials: this.planUseMaterialList
              }
            }
            console.log(reqInit)
            const reqConfig = null
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
      // 显示物料清单详情模态框
      showMaterialDetailModal (index) {
        productionPlanVuex.$emit('showMaterialDetailModal', { currentMaterialData: this.planUseMaterialList[index] })
      }
    },
    mounted () {
      // 显示创建模态框
      localVuex.$on('showResourceAllocationModal', plan => {
        this.plan = plan
        // 获取生产计划id所对应工序
        this.getPlanUseMaterials(plan)

        $(resourceAllocationModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(resourceAllocationModal).modal('show')
      })
    },
    components: {
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
            <h4 class="modal-title">资源分配</h4>
          </div>
          <div class="modal-body">
            <div
              class="panel panel-default"
              ref="panel"
            >
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <form class="form-inline">
                      <select
                        class="form-control input-sm"
                        v-model="selectedBomIndex"
                      >
                        <option
                          value=""
                          disabled
                          v-text="'选择bom版本'"
                        >
                        </option>
                        <option
                          v-for="(value, index) in bomVersionList"
                          :key="index"
                          :value="index"
                          v-text="value.craftBomMaterial.supplier_name"
                        >
                        </option>
                      </select>
                    </form>
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
                      所需总量
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
                    v-for="(value, index) in planUseMaterialList"
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
                      v-text="value.plan_quantity_required"
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
                        <i class="fa fa-tasks fa-fw"></i>详情
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                  @click="savaPlanUseMaterials"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
})