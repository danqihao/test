window.addEventListener('load', (event) => {
  const localVuex = new Vue()

  // 我发起的生产计划管理页面
  function iStartProductionPlanManagePages () {
    const pages = document.getElementById('productionPlanManage1-3-1')
    // 审核中的面板
    const approvePanel = document.querySelector('#iStartProductionPlanManageApprove .panel')
    // 生产中的面板
    const inProductionPanel = document.querySelector('#iStartProductionPlanManageInProduction .panel')
    // 已完成的面板
    const finishPanel = document.querySelector('#iStartProductionPlanManageFinish .panel')
    // 停止的面板
    const closePanel = document.querySelector('#iStartProductionPlanManageClose .panel')

    // 审核中的VM
    let approvePanelVM = new Vue({
      el: approvePanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'check',
            checkStatus: 'checkUnderway',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {
      },
      methods: {
        productionPlanApproveStateTransition,
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
        },
        // 根据状态显示按钮
        approveStateShowButton (approvalState) {
          const allButton = {
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
            closeProduction: false,
            // 计划通过后关闭
            planSuccessClose: false
          }
          switch (Number(approvalState)) {
            // 审核未通过
            case 2:
              allButton.resubmit = true
              allButton.close = true
              allButton.dispatch = true
              break;
            // 审核通过
            case 3:
              allButton.issued = true
              allButton.planSuccessClose = true
              allButton.dispatch = true
              break;
            // 关闭生产审核未通过
            case 5:
              allButton.resubmit = true
              allButton.recoverPlan = true
              break;
            // 关闭审核通过
            case 6:
              allButton.perpetualClose = true
              break;
            default:
              break;
          }
          return allButton
        },
        // 显示生产计划详情模态框
        showProductionPlanDetailModal (index) {
          // 审核状态
          const approveState = this.tableData[index].planStatus.plan_audit_status
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
              approveDetai: true,
              // 设置
              config: true,
              // 设置子模块
              configSubmodule: this.approveStateShowButton(approveState)
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }

          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
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
                  <th style="width: 15%;">订单编号</th>
                  <th style="width: 15%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">预定完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">审核状态</th>
                  <th style="width: 25%;">操作</th>
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
                    {{value.planStatus.plan_audit_status | approvalState}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="9">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 生产中的VM
    let inProductionPanelVM = new Vue({
      el: inProductionPanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            productionStatus: 'inProduction',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {

      },
      methods: {
        productionPlanApproveStateTransition,
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
              // 设置
              config: true,
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
                closeProduction: true
              }
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
                  :init="queryBarInit"
                  @search="searchBarQuery"
                >
                </mes-process-searchbar>
              </div>
            </div>
          </div>
          <div class="panel-body-table table-height-15">
            <table
              class="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 10%;">订单编号</th>
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产进度</th>
                  <th style="width: 10%;">审核状态</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 25%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td
                    v-text="value.production_plan_production_priority"
                  >
                  </td>
                  <td>
                    {{productionPlanApproveStateTransition(value.planStatus.plan_audit_status)}}
                  </td>
                  <td>
                    {{productionPlanProductionStateTransition(value.planStatus.plan_production_status)}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 完成的VM
    let finishPanelVM = new Vue({
      el: finishPanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            productionStatus: 'complete',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {

      },
      methods: {
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
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
                closeProduction: false
              }
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
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
                  <th style="width: 15%;">订单编号</th>
                  <th style="width: 15%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 25%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td
                    v-text="value.production_plan_production_priority"
                  >
                  </td>
                  <td
                  >
                    {{productionPlanProductionStateTransition(value.planStatus.plan_production_status)}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 停止的VM
    let closePanelVM = new Vue({
      el: closePanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            productionStatus: 'stop',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {
      },
      methods: {
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
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
                closeProduction: false
              }
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
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
                  <th style="width: 15%;">订单编号</th>
                  <th style="width: 15%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">状态</th>
                  <th style="width: 25%;">生产状态</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td
                    v-text="value.production_plan_production_priority"
                  >
                  </td>
                  <td
                  >
                    {{productionPlanProductionStateTransition(value.planStatus.plan_production_status)}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })
  }
  iStartProductionPlanManagePages()

  // 我审核的生产计划管理页面
  function iApproveProductionPlanManagePages () {
    const pages = document.getElementById('productionPlanManage1-3-2')
    // 等待审核面板
    const awaitApprovePanel = document.querySelector('#iApproveProductionPlanManageAwaitApprove .panel')
    // 审批历史面板
    const historyApprovePanel = document.querySelector('#iApproveProductionPlanManageHistoryApprove .panel')

    // 等待审核面板VM
    let awaitApprovePanelVM = new Vue({
      el: awaitApprovePanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'check',
            checkStatus: 'waitCheck',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {
      },
      methods: {
        productionPlanApproveStateTransition,
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              approveDetai: true,
              // 设置
              config: true,
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
                closeProduction: false,
                // 计划审批
                approvalHandle: true,
                // 转交
                careof: true
              }
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
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
                  <th style="width: 15%;">订单编号</th>
                  <th style="width: 15%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">预定完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">审核状态</th>
                  <th style="width: 25%;">操作</th>
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
                    {{productionPlanApproveStateTransition(value.planStatus.plan_audit_status)}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="9">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 审批历史面板VM
    let historyApprovePanelVM = new Vue({
      el: historyApprovePanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            // type: 'production',
            type: 'check',
            checkStatus: 'checkHistory',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {

      },
      methods: {
        productionPlanApproveStateTransition,
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
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
                closeProduction: false,
                // 审批处理
                approvalHandle: false,
                // 转交
                careof: false
              }
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
                  :init="queryBarInit"
                  @search="searchBarQuery"
                >
                </mes-process-searchbar>
              </div>
            </div>
          </div>
          <div class="panel-body-table table-height-15">
            <table
              class="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 10%;">订单编号</th>
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">审核状态</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 25%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td
                    v-text="value.production_plan_production_priority"
                  >
                  </td>
                  <td>
                    {{productionPlanApproveStateTransition(value.planStatus.plan_audit_status)}}
                  </td>
                  <td>
                    {{productionPlanProductionStateTransition(value.planStatus.plan_production_status)}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })
  }
  iApproveProductionPlanManagePages()

  // 我负责的生产计划管理页面
  function iResponsibleProductionPlanManagePages () {
    const pages = document.getElementById('productionPlanManage1-3-3')
    // 正在进行面板
    const underwayPanel = document.querySelector('#iResponsibleProductionPlanManageUnderway .panel')
    // 已完成面板
    const finishPanel = document.querySelector('#iResponsibleProductionPlanManageFinish .panel')
    // 已关闭面板
    const closedPanel = document.querySelector('#iResponsibleProductionPlanManageClosed .panel')

    // 正在进行面板
    let underwayPanelVM = new Vue({
      el: underwayPanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            keyword: '',
            productionStatus: 'productionUnderway',
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
      computed: {
      },
      methods: {
        productionPlanApproveStateTransition,
        productionPlanProductionStateTransition,
        // 根据状态显示按钮
        approveStateShowButton (productionState) {
          const allButton = {
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
            pauseProduction: true,
            // 恢复生产
            continueProduction: true,
            // 生产完成
            finishProduction: true
          }
          switch (productionState) {
            // 生产中
            case 1:
              allButton.pauseProduction = true
              allButton.finishProduction = true
              break;
            // 暂停
            case 2:
              allButton.continueProduction = true
              allButton.finishProduction = true
              break;
            default:
              break;
          }
          return allButton
        },
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          console.log(queryParam)
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
        },
        // 显示生产计划详情模态框
        showProductionPlanDetailModal (index) {
          const productionState = this.tableData[index].planStatus.plan_production_status
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
              // 设置
              config: true,
              // 设置子模块
              configSubmodule: this.approveStateShowButton(productionState)
            },
            // 生产计划id
            planId: this.tableData[index].production_plan_id || ''
          }
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
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
            <table
              class="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 10%;">订单编号</th>
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 15%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td>
                    {{value.production_plan_production_priority}}
                  </td>
                  <td
                    v-text="productionPlanProductionStateTransition(value.planStatus.plan_production_status)"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 已完成面板
    let finishPanelVM = new Vue({
      el: finishPanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            keyword: '',
            productionStatus: 'complete',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {

      },
      methods: {
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
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
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
                  :init="queryBarInit"
                  @search="searchBarQuery"
                >
                </mes-process-searchbar>
              </div>
            </div>
          </div>
          <div class="panel-body-table table-height-15">
            <table
              class="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 10%;">订单编号</th>
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 15%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td>
                    {{value.production_plan_production_priority}}
                  </td>
                  <td
                    v-text="productionPlanProductionStateTransition(value.planStatus.plan_production_status)"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 已停止面板
    let closedPanelVM = new Vue({
      el: closedPanel,
      data () {
        return {
          URL: queryDraftPlanOutlineUrl,
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'production',
            keyword: '',
            productionStatus: 'stop',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1
        }
      },
      computed: {

      },
      methods: {
        productionPlanProductionStateTransition,
        // 搜索服务器数据
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
          }
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.plans
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        // 搜索栏搜索
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
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
              productionProcessDetail: true,
              // 生产进度详情
              productionSchedule: true,
              // 审核详情
              approveDetai: true,
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
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
      },
      template: `
        <div
          class="panel panel-default"
          ref="panel"
        >
          <div class="panel-heading panel-heading-table">
            <div class="row">
              <div class="col-xs-4">
                <h4></h4>
              </div>
              <div class="col-xs-8">
                <mes-process-searchbar
                  :init="queryBarInit"
                  @search="searchBarQuery"
                >
                </mes-process-searchbar>
              </div>
            </div>
          </div>
          <div class="panel-body-table table-height-15">
            <table
              class="table table-hover table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 10%;">订单编号</th>
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 10%;">实际完成日期</th>
                  <th style="width: 10%;">生产优先级</th>
                  <th style="width: 10%;">生产状态</th>
                  <th style="width: 15%;">操作</th>
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
                    {{value.production_actual_start_time | standardTime}}
                  </td>
                  <td>
                    {{value.production_plan_production_priority}}
                  </td>
                  <td
                    v-text="productionPlanProductionStateTransition(value.planStatus.plan_production_status)"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="10">
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
                @current-change="searchServerData"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })
  }
  iResponsibleProductionPlanManagePages()

  // 计划调度管理页面
  function planDispatchManagePage () {
    const planDispatchSwiper = document.getElementById('productionPlanManage1-3-4')
    const planDispatchSwiperPanel = planDispatchSwiper.querySelector('.panel-group .panel')

    // 计划调度VM
    let planDispatchManageVM = new Vue({
      el: planDispatchSwiperPanel,
      data () {
        return {
          queryBarInit: {
            keyWord: true
          },
          bodyParam: {
            type: 'check',
            checkStatus: 'checkPass',
            keyword: '',
            userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
            headNum: 1
          },
          selectedIconClassList: [
            /* {
              'fa': true,
              'fa-square-o': true,
              'fa-check-square-o': false,
              'fa-lg': true,
              'fa-fw': true,
            } */
          ],
          selectedRowData: new Set(),
          tableData: [],
          pageSize: 15,
          total: 0,
          currentPage: 1,
          isUpdateTable: false
        }
      },
      computed: {
      },
      methods: {
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
              approveDetai: true,
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
          console.log(productionPlanDetailModalOptions)
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
        searchBarQuery (queryParam) {
          console.log(queryParam)
          if (queryParam !== undefined) {
            this.bodyParam.keyword = queryParam.keyword
            this.bodyParam.productionStatus = queryParam.productionState
          }
          this.currentPage = 1
          this.pageTurning()
        },
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
              this.selectedIconClassList = []
              console.log(data)
              const map = data.map
              const counts = map.line
              const dataList = map.plans
              this.total = counts
              for (const [index, value] of dataList.entries()) {
                this.tableData.push(value)

                // 判断是否已经选中
                const isIncludeRowData = () => {
                  return this.selectedRowData.has(value)
                }

                if (isIncludeRowData()) {
                  // 已包含走这里
                  this.selectedIconClassList[index] = {
                    'fa': true,
                    'fa-square-o': false,
                    'fa-check-square-o': true,
                    'fa-lg': true,
                    'fa-fw': true,
                    'selectedIcon': true
                  }
                }
                else {
                  // 未包含走这里
                  this.selectedIconClassList[index] = {
                    'fa': true,
                    'fa-square-o': true,
                    'fa-check-square-o': false,
                    'fa-lg': true,
                    'fa-fw': true,
                    'selectedIcon': true
                  }
                }
              }
              this.isUpdateTable = false
            })
            .catch(reason => {
              this.tableData = []
              this.selectedIconClassList = []
            })
        },
        planMerge () {
          console.log(this.selectedRowData.size)
          if (this.selectedRowData.size > 1) {
            const productionTypeId = [...this.selectedRowData][0].product_type_id
            const craftId = [...this.selectedRowData][0].craft_id
            let isEqualityPlan = false
            const selectedRowDataArray = [...this.selectedRowData]
            isEqualityPlan = selectedRowDataArray.every((value, index) => {
              return productionTypeId === value.product_type_id && craftId === value.craft_id
            })

            if (isEqualityPlan) {
              localVuex.$emit('showPlanMergeModal', [...this.selectedRowData])
            } else {
              this.$message({
                message: '请选择相同的产品与工艺',
                type: 'warning'
              });
            }
          }
          else {
            this.$message({
              message: '计划整合最少需要选择2条以上',
              type: 'warning'
            });
          }
        },
        planSplit (index) {
          localVuex.$emit('showPlanSplitModal', this.tableData[index])
        },
        selectedRow (index) {
          // 初始化判断
          if (!index > -1 && !this.tableData.length) {
            return
          }
          // 选择的行数据
          const selectedRowData = this.tableData[index]
          // 是否包含选择的行数据
          const isIncludeRowData = () => {
            return this.selectedRowData.has(selectedRowData)
          }
          // 所有选择按钮
          const planDispatchSwiping = document.getElementById('productionPlanManage1-3-4')
          const selectedIcon = planDispatchSwiping.getElementsByClassName('selectedIcon')

          if (isIncludeRowData()) {
            // 包含的话走这里
            this.selectedRowData.delete(selectedRowData)
            selectedIcon[index].classList.remove('fa-check-square-o')
            selectedIcon[index].classList.add('fa-square-o')
            console.log(this.selectedIconClassList[index])
          }
          else {
            // 不包含的话走这里
            this.selectedRowData.add(selectedRowData)
            selectedIcon[index].classList.remove('fa-square-o')
            selectedIcon[index].classList.add('fa-check-square-o')
            console.log(this.selectedIconClassList[index])
          }
          console.log(this.selectedRowData)
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
                    v-text="'计划整合'"
                    @click.prevent="planMerge"
                  >
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
                  <th style="width: 10%;">生产批号</th>
                  <th style="width: 10%;">订单生产数</th>
                  <th style="width: 15%;">预定完成日期</th>
                  <th style="width: 10%;">工艺</th>
                  <th style="width: 10%;">工艺版本</th>
                  <th style="width: 10%;">产品型号</th>
                  <th style="width: 15%;">操作</th>
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
                    v-text="value.craft_name"
                  >
                  </td>
                  <td
                    v-text="value.craft_versions"
                  >
                  </td>
                  <td
                    v-text="value.product_model_name"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="selectedRow(index)"
                    >
                      <i :class="selectedIconClassList[index]"></i>选择
                    </a>
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="planSplit(index)"
                    >
                      <i class="fa fa-puzzle-piece fa-lg fa-fw"></i>拆分
                    </a>
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="showProductionPlanDetailModal(index)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>计划详情
                    </a>
                  </td>
                </tr>
                <tr v-show="tableData.length === 0">
                  <td class="text-center" colspan="10">
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
                @current-change="pageTurning"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })

    // 计划整合VM
    let planMergeModalVM = new Vue({
      el: document.querySelector('#planMergeModal .modal-dialog'),
      data () {
        return {
          selectedPlanList: [],
          mergePlan: null,
        }
      },
      methods: {
        // 添加数据到表格
        addDataTotable (selectedPlanList) {
          this.selectedPlanList = selectedPlanList
          console.log(this.selectedPlanList)
          const modal = document.getElementById('planMergeModal')
          $(modal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(modal).modal('show')
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
              approveDetai: true,
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
                closeProduction: false,
                // 计划审批
                approvalHandle: false,
                // 转交
                careof: false
              }
            },
            // 生产计划id
            planId: this.selectedPlanList[index].production_plan_id || ''
          }
          // 发出显示生产计划模态框
          productionPlanVuex.$emit('showProductionPlanDetailModal', productionPlanDetailModalOptions)
        },
        // 移除生产计划
        removeProductionPlan (index) {
          this.selectedPlanList.splice(index, 1)
        },
        // 整合生产计划
        mergeProductionPlan () {
          const addProductionPlanOptions = {
            // 添加生产计划类型
            addProductionPlanType: 'merge',
            // 生产计划信息
            productionPlanId: this.selectedPlanList[0].production_plan_id,
            // 订单生产数
            orderProductionQuantity: (() => {
              let total = 0
              this.selectedPlanList.forEach((value, index) => {
                total += Number(value.production_order_production_number)
              })
              return total
            })(),
            // 订单排产数
            batchSchedulingQuantity: (() => {
              let total = 0
              this.selectedPlanList.forEach((value, index) => {
                total += Number(value.production_batch_production_number)
              })
              return total
            })(),
          }
          productionPlanVuex.$emit('showAddProductionPlanModal', addProductionPlanOptions)
        },
        // 存储整合生产计划
        saveMergeProductionPlan () {
          const url = planMergeUrl
          const reqInit = {
            body: {
              userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
              planIds: this.selectedPlanList.map((value, index) => {
                return value.production_plan_id
              }),
              plan: this.mergePlan
            }
          }
          const reqConfig = {}
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
              planDispatchManageVM.$data.isUpdateTable = true
              $('#planMergeModal').modal('hide')
              $('#addProductionPlanModal').modal('hide')
            }).catch((err) => {
              reject(err)
              swal({
                title: err.msg || '提交失败,请检查必选项',
                type: 'error',
              })
            })
          })
        }
      },
      mounted () {
        localVuex.$on('showPlanMergeModal', this.addDataTotable)
        productionPlanVuex.$on('returnMergeAddProductionPlanData', (data) => {
          console.log(data)
          this.mergePlan = data
          this.saveMergeProductionPlan()
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
              <h4 class="modal-title">生产计划整合</h4>
            </div>
            <div class="modal-body">
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <h4>已选择的工序</h4>
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
                        订单编号
                      </th>
                      <th style="width:10%">
                        生产批号
                      </th>
                      <th style="width:10%">
                        订单生产数
                      </th>
                      <th style="width:15%">
                        预定开始时间
                      </th>
                      <th style="width:10%">
                        工艺
                      </th>
                      <th style="width:10%">
                        工艺版本
                      </th>
                      <th style="width:10%">
                        产品型号
                      </th>
                      <th style="width:20%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in selectedPlanList"
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
                        v-text="value.craft_name"
                      >
                      </td>
                      <td
                        v-text="value.craft_versions"
                      >
                      </td>
                      <td
                        v-text="value.product_model_name"
                      >
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
                          @click="removeProductionPlan(index)"
                        >
                          <i class="fa fa-tasks fa-fw"></i>移除
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
                    v-text="'整合'"
                    @click="mergeProductionPlan"
                  >
                  </button>
                  <button
                    class="btn btn-primary modal-submit"
                    v-text="'提交'"
                    @click="saveMergeProductionPlan"
                  >
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })

    // 计划拆分VM
    let planSplitModalVM = new Vue({
      el: document.querySelector('#planSplitModal .modal-dialog'),
      data () {
        return {
          index: 0,
          selectedPlan: null,
          planSplitList: [
            /* {
              plan: null,
              quotesWorkstage: null
            } */
          ],
          splitNumberSelectOPtions: [2, 3, 4, 5, 6, 7, 8, 9, 10],
          selectedSplitNumber: ''
        }
      },
      methods: {
        // 显示计划拆分模态框
        planSplit (selectedPlan) {
          this.selectedPlan = selectedPlan
          const modal = document.getElementById('planSplitModal')
          $(modal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(modal).modal('show')
        },
        // 根据拆分数量表格显示
        splitQuatityShowTable () {
          const quatity = this.selectedSplitNumber
          if (!quatity) {
            return
          }
          this.planSplitList = Array(quatity)
          this.planSplitList.fill({
            plan: {},
            quotesWorkstage: []
          })
        },
        // 显示新增生产计划模态框
        showAddProductionPlanModal (index) {
          this.index = index
          const addProductionPlanOptions = {
            // 添加生产计划类型
            addProductionPlanType: 'split',
            // 生产计划信息
            productionPlanId: this.selectedPlan.production_plan_id,
            // 订单生产数
            orderProductionQuantity: 0,
            // 订单排产数
            batchSchedulingQuantity: 0,
          }
          productionPlanVuex.$emit('showAddProductionPlanModal', addProductionPlanOptions)
        },
        // 存储计划拆分
        savePlanSplit () {
          const url = planSplitUrl
          const reqInit = {
            body: {
              userId: USERID || 'eafbdeecabb14446a31d75d223586dfc',
              planId: this.selectedPlan.production_plan_id,
              plans: this.planSplitList
            }
          }
          const reqConfig = {}
          swal({
            title: '确定提交吗？',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
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
                  planDispatchManageVM.$data.isUpdateTable = true
                  $('#planMergeModal').modal('hide')
                }).catch((err) => {
                  reject(err)
                  swal({
                    title: err.msg || '提交失败,请检查必选项',
                    type: 'error',
                  })
                })
              })
          })
        }
      },
      mounted () {
        localVuex.$on('showPlanSplitModal', this.planSplit)
        productionPlanVuex.$on('returnSplitAddProductionPlanData', (data) => {
          console.log(data)
          const quatity = this.selectedSplitNumber
          if (!quatity) {
            return
          }
          let tempArray = []
          for (const [index, value] of this.planSplitList.entries()) {
            if (value.craft_name) {
              tempArray[index] = value
            }
            else {
              tempArray[index] = {
                plan: {},
                quotesWorkstage: []
              }
            }
          }
          tempArray[this.index] = data
          this.planSplitList = tempArray
          $('#addProductionPlanModal').modal('hide')
          this.$forceUpdate()
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
              <h4 class="modal-title">计划拆分</h4>
            </div>
            <div class="modal-body">
              <div class="panel panel-default relative">
                <div class="panel-heading panel-heading-table">
                  <div class="row">
                    <div class="col-xs-4">
                      <form class="form-inline">
                        <select
                          class="form-control input-sm"
                          v-model="selectedSplitNumber"
                          @change="splitQuatityShowTable"
                        >
                          <option
                            disabled
                            value=""
                            v-text="'选择拆分数量'"
                          >
                          </option>
                          <option
                            v-for="(value, index) in splitNumberSelectOPtions"
                            :key="index"
                            v-text="value"
                            :value="value"
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
                        订单编号
                      </th>
                      <th style="width:10%">
                        订单生产数
                      </th>
                      <th style="width:15%">
                        预定开始时间
                      </th>
                      <th style="width:10%">
                        工艺
                      </th>
                      <th style="width:10%">
                        工艺版本
                      </th>
                      <th style="width:10%">
                        产品型号
                      </th>
                      <th style="width:20%">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, index) in planSplitList"
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
                        v-text="value.production_order_production_number"
                      >
                      </td>
                      <td>
                        {{value.production_scheduled_start_time | standardTime}}
                      </td>
                      <td
                        v-text="value.craft_name"
                      >
                      </td>
                      <td
                        v-text="value.craft_versions"
                      >
                      </td>
                      <td
                        v-text="value.product_model_name"
                      >
                      </td>
                      <td class="table-input-td">
                        <a
                          class="table-link"
                          href="javascript:;"
                          @click="showAddProductionPlanModal(index)"
                        >
                          <i class="fa fa-tasks fa-fw"></i>设置计划
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
                    v-text="'提交'"
                    @click="savePlanSplit"
                  >
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })
  }
  planDispatchManagePage()
})