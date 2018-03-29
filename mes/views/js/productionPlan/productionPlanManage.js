window.addEventListener('load', (event) => {
  const localVuex = new Vue()
  const productionPlanManageSwiper = document.getElementById('productionPlanManage1-1')
  const productionPlanManageSwiperPanel = productionPlanManageSwiper.querySelector('.content-body .panel')
  const productionPlanDetail = document.getElementById('productionPlanDetailModal')
  const productionPlanDetailModalDialog = productionPlanDetail.querySelector('.modal-dialog')

  // 生产计划管理VM
  let productionPlanManageVM = new Vue({
    el: productionPlanManageSwiperPanel,
    data () {
      return {
        URL: queryDraftPlanOutlineUrl,
        queryBarInit: {
          keyWord: true,
          productionState: true
        },
        bodyParam: {
          type: 'production',
          productionStatus: '',
          headNum: 1
        },
        tableData: [],
        pageSize: 15,
        total: 0,
        currentPage: 1
      }
    },
    methods: {
      productionPlanApproveStateTransition,
      productionPlanProductionStateTransition,
      showProductionPlanDetailModal (options) {
        const ProductionPlanDetailModalOptions = {
          needShowModule: {
            productionPlanDetail: true,
            productionPlanDetailSubmodule: {
              baseInfo: true,
              domList: true,
              workOrder: true
            },
            productionProcessDetail: true,
            productionSchedule: true,
            approveDetai: true
          },
          planId: options.planId
        }
        productionPlanVuex.$emit('showProductionPlanDetailModal', ProductionPlanDetailModalOptions)
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
        if (curryPage !== undefined) {
          this.bodyParam.headNum = ((curryPage - 1) * 15) + 1
        }
        const reqinit = {
          body: this.bodyParam
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(this.URL, reqinit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.line
          const dataList = map.plans
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        }).catch((reason) => {
          this.tableData = []
        })
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
                <th style="width: 10%;">订单编号</th>
                <th style="width: 10%;">生产批次</th>
                <th style="width: 10%;">订单生产数</th>
                <th style="width: 10%;">预定完成日期</th>
                <th style="width: 10%;">生产优先级</th>
                <th style="width: 10%;">审核状态</th>
                <th style="width: 10%;">生产状态</th>
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
                    class="table-link"
                    href="javascript:;"
                    @click="showProductionPlanDetailModal({planId: value.production_plan_id})"
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
})