
//   品质报表
var queryPQCUnqualifiedReportUrl = BASE_PATH + "/queryPQCUnqualifiedReport.do"; // 统计PQC报表与其不良记录
var queryPQCReportRecordUrl = BASE_PATH + "/queryPQCReportRecord.do"; // 查询PQC报表
var queryIQCUnqualifiedReportUrl = BASE_PATH + "/queryIQCUnqualifiedReport.do"; // 统计iqc报表与其不良记录
var queryIQCReportUrl = BASE_PATH + "/queryIQCReport.do"; // 查询IQC报表
var queryFQCReportFormsUrl = BASE_PATH + "/queryFQCReportForms.do"; // 查询FQC报表
var queryWorkstageAscendUrl = BASE_PATH + "/queryWorkstageAscend.do"; // 查询工序优率,不良率,坏品率报表
var queryWorkOrderAscendUrl = BASE_PATH + "/queryWorkOrderAscend.do"; // 查询工单优率,不良率,坏品率报表
var queryProductInfosUrl = BASE_PATH + "/queryProductInfos.do"; // 查询工单优率,不良率,坏品率报表

let leftNav = $('#mainLeftSidebar .sidebar-nav');// 左侧边栏
let leftNavLink = leftNav.find('a').filter('[href^="#"]');// 左侧变栏对应的swiper



$(function () {

  leftNavLink.on('click', function (event) {
    let targetHref = event.currentTarget.getAttribute('href');

    let currentTime = new Date(new Date().setHours(0, 0, 0, 0)); //当天0点时间戳(秒)
    let yesterday = currentTime - 86400000    //昨天0点时间戳(秒)
    let lastweek = currentTime - 86400000 * 7    //7天前0点时间戳(秒)
    let lastmonth = currentTime - 86400000 * 30    //7天前0点时间戳(秒)

    switch (targetHref) {
      case '#conditionQueryRF': {	//条件查询报表
         (function () {
          const swiper = document.getElementById('conditionQueryRF')   //右侧外部swiper
          const inerSwiper = document.getElementById('conditionQueryRFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框


          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, type: 'info', planId: '', planName: '' },//搜索参数
                tbodyData: [],

                craftId: '',  //工序id
                craftName: '',  //工序名称
                productionBatch: '',  //生产批号
                batteryNumber: '',  //电池编号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                ajaxData: {
                  devicesId: '', //设备id
                  devicesName: '',//设备名称
                  devicesTypeId: '', // 设备类型ID
                  devicesTypeName: '', // 设备类型名称
                  startTime: '',// 异常记录开始时间
                  endTime: '',// 异常记录结束时间
                  headNum: 1 //下标
                },

                reportFormsName: '',  //报表名称

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCPlanUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.pqcPlan
                      this.lines = result.map.lines
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.craftId = ''
                this.craftName = ''
                this.batteryModel = ''
                this.productionBatch = ''
                this.batteryNumber = ''
                this.ajaxData.startTime = ''
                this.ajaxData.endTime = ''
                this.tbodyData=[]
              },
              // 查询
              search() {
                this.currenPage = 1
                this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime} 条件查询报表`

                this.tbodyData = [
                  // { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },
                  // { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },
                  // { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },

                ]
                // console.log(this.searchData)
                // this.searchData.planName = this.searchDataInput
                // this.queryFun(this.searchData)
              },

              // 选择工序
              selectProcess(type) {
                if (type === '工序') {
                  let promise = new Promise((resolve, reject) => {
                    selectProcessModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.craftName = resolveData.workstage_name
                    this.craftId = resolveData.workstage_basics_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    batchNumberModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.productionBatch = resolveData.production_plan_batch_number
                  })
                }

              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },
            created() {
              this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },
            template: `
                        <div class="swiper-slide swiper-no-swiping" id="conditionQueryRFInerSwiper">
                            <!-- 右侧内部swiper -->
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="panel panel-default">
                                        <div class="panel-body-table ">

                                            <form class="form-inline form-table">
                                            <div class="row">

                                                <div class="col-md-4 col-xs-6">
                                                <div class="form-group ">
                                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>工 序</label>
                                                    <input type="text" class="form-control" placeholder="选择工序(必选)" v-model="craftName" @focus="selectProcess('工序')">
                                                    <a title="选择工序" href="javascript:;" class="input-btn" @click="selectProcess('工序')">
                                                        <i class="fa fa-search"></i>
                                                    </a>
                                                </div>
                                                </div>
                                                <div class="col-md-4 col-xs-6">
                                                <div class="form-group " >
                                                    <label class="control-label">批 号</label>
                                                    <input type="text" class="form-control" placeholder="输入生产批号(可选)" v-model="productionBatch">
                                                    <a title="选择生产批号" href="javascript:;" class="input-btn" @click="selectProcess('批号')">
                                                        <i class="fa fa-search"></i>
                                                    </a>
                                                </div>
                                                </div>
                                                <div class="col-md-4 col-xs-6">
                                                <div class="form-group">
                                                    <label class="control-label">电芯编号</label>
                                                    <input type="text" class="form-control" placeholder="输入电芯编号(可选)" v-model="batteryNumber">

                                                </div>
                                                </div>

                                            </div>
                                            <div class="row">

                                                <div class="col-md-12 col-xs-12 ">
                                                    <div class="form-group">
                                                        <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                                        <input type="text" class="form-control" placeholder="开始时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="startTime = $event.target.value" v-bind:value="startTime" >
                                                        <input type="text" class="form-control" placeholder="结束时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="endTime = $event.target.value" v-bind:value="endTime">
                                                        <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getYesterday()">&nbsp&nbsp&nbsp&nbsp昨天</a>
                                                        <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastweek()">&nbsp7天</a>
                                                        <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastmonths()">&nbsp1个月</a>
                                                    </div>
                                                </div>
                                            </div>
                                            </form>

                                        </div>
                                        <div class="panel-footer panel-footer-table ">
                                            <div class="col-xs-6 text-right">
                                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                                            </div>
                                            <div class="col-xs-6 text-left">
                                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="panel panel-default" >
                                        <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                            <div class="col-xs-12">
                                                <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                                            </div>
                                            </div>
                                        </div>
                                        <div class="panel-body-table table-height-10">
                                            <table class="table  table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                <th style="width: 4%;">序号</th>
                                                <th style="width: 10%;">工序</th>
                                                <th style="width: 10%;">生产计划批号</th>
                                                <th style="width: 10%;">数据采集时间</th>
                                                <th style="width: 10%;">电芯编号</th>
                                                <th style="width: 10%;">设定电流（mA）</th>
                                                <th style="width: 10%;">容量（mAh）</th>
                                                <th style="width: 10%;">开路电压（mV）</th>
                                                <th style="width: 10%;">电阻</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                                <td v-text="index + 1" >
                                                </td>
                                                <td v-text="value.v1">
                                                </td>
                                                <td v-text="value.v2">
                                                </td>
                                                <td v-text="value.v3">
                                                </td>
                                                <td v-text="value.v4">
                                                </td>
                                                <td v-text="value.v5">
                                                </td>
                                                <td v-text="value.v6">
                                                </td>
                                                <td v-text="value.v7">
                                                </td>
                                                <td v-text="value.v8">
                                                </td>
                                                </tr>
                                                <tr v-show="!tbodyData.length">
                                                <td colspan=15 class="text-center text-warning">

                                               此功能暂未开放！
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                        </div>
                                        <div class="panel-footer panel-footer-table text-right">
                                            <el-pagination
                                            @current-change="handleCurrentChange"
                                            background small
                                            layout="total,prev,pager,next"
                                            :current-page="currenPage"
                                            :page-size="pagesize"
                                            :total="lines"
                                            >
                                            </el-pagination>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;
      case '#processProductionRF': {  //工序生产报表
        ; (function () {
          const swiper = document.getElementById('processProductionRF')   //右侧外部swiper
          const inerSwiper = document.getElementById('processProductionRFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, type: 'info', planId: '', planName: '' },//搜索参数
                tbodyData: [],

                workshopId: '',  //工序id
                workshopName: '',  //工序名称

                ajaxData: {
                  workstageId:'', //工序id
                  workstageName:'',//工序名称
                  startDate:'',// 异常记录开始时间
                  endDate:'',// 异常记录结束时间
                  headNum:1 //下标
                },

                productElementQuantity: '', // 总合计
                rejectsBatchQuantitySum: '',// 不良合计

                reportFormsName: '',  //报表名称

                lines: 0,     //总条数
                pagesize: 15,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun() {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkOrderOutlineFormsUrl,
                  data: this.ajaxData,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.workstageAndWorkOrderAscends
                      this.productElementQuantity = result.map.productElementQuantity
                      this.rejectsBatchQuantitySum = result.map.rejectsBatchQuantitySum
                      this.lines = result.map.line

                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.tbodyData = []
                      this.productElementQuantity = ''
                      this.rejectsBatchQuantitySum = ''
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.workshopId = ''
                this.workshopName = ''
                this.ajaxData.workstageName = ''
                this.ajaxData.workstageId = ''
                this.ajaxData.startDate = ''
                this.ajaxData.endDate = ''
                this.tbodyData=[]
                // this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                // this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 查询
              search() {
                //  var data = this.ajaxData.startDate == '' || this.ajaxData.endDate == ''
                if (this.ajaxData.workstageId == '') {
                  this.$message.error({
                    message: '请选择一个工序再查询',
                  })
                } else if (this.ajaxData.startDate == '' || this.ajaxData.endDate == '') {
                  this.$message.error({
                    message: '请选择一段时间再查询',
                  })
                } else {
                  this.currenPage = 1
                  this.reportFormsName = `${this.ajaxData.startDate} - ${this.ajaxData.endDate} 工序生产报表`
                  this.queryFun()
                }

              },

              // 选择工序
              selectProcess(type) {
                if (type === '车间') {
                  this.ajaxData.workstageName = ''
                  this.ajaxData.workstageId = ''
                  let promise = new Promise((resolve, reject) => {
                    workshopModel(resolve)
                  })
                  promise.then((resolveData) => {
                    this.workshopName = resolveData.role_workshop_name
                    this.workshopId = resolveData.role_workshop_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    if (this.workshopId == '') {
                      workstageModal(resolve, queryWorkstageBasicsUrl, { type: 'vague', keyword: '', headNum: 1, status: 0 }, '')
                    } else {
                      workstageModal(resolve, queryWorkShopInfosUrl, { type: 'workstage', workshopId: this.workshopId }, this.workshopName)
                    }
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.workstageName = resolveData.workstage_name
                    this.ajaxData.workstageId = resolveData.workstage_basics_id
                  })
                }

              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startDate = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startDate = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.ajaxData.headNum = headNum
                this.queryFun()
              }

            },

            created() {
              this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },

            template: `
                        <div class="swiper-slide swiper-no-swiping" id="processProductionRFInerSwiper">
                            <!-- 右侧内部swiper -->
                            <div class="row">
                            <div class="col-sm-12">
                                <div class="panel panel-default">
                                <div class="panel-body-table ">

                                    <form class="form-inline form-table">
                                    <div class="row">

                                        <div class="col-md-4 col-xs-6">
                                            <div class="form-group ">
                                                <label class="control-label" style="margin-left:12px">车 间</label>
                                                <input type="text" class="form-control" placeholder="选择车间(可选)" v-model="workshopName" @focus="selectProcess('车间')">
                                                <a title="选择工序" href="javascript:;" class="input-btn" @click="selectProcess('车间')">
                                                    <i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-xs-6">
                                            <div class="form-group " >
                                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>工 序</label>
                                                <input type="text" class="form-control" placeholder="选择工序(必选)" v-model="ajaxData.workstageName" @focus="selectProcess('工序')">
                                                <a title="选择生产批号" href="javascript:;" class="input-btn" @click="selectProcess('工序')">
                                                    <i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                        </div>


                                    </div>
                                    <div class="row">

                                        <div class="col-md-12 col-xs-12 ">
                                            <div class="form-group">
                                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                                <input type="text" class="form-control" placeholder="开始时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="ajaxData.startDate = $event.target.value" v-bind:value="ajaxData.startDate" >
                                                <input type="text" class="form-control" placeholder="结束时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="ajaxData.endDate = $event.target.value" v-bind:value="ajaxData.endDate">
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getYesterday()">&nbsp&nbsp&nbsp&nbsp昨天</a>
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastweek()">&nbsp7天</a>
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastmonths()">&nbsp1个月</a>
                                            </div>

                                        </div>

                                    </div>
                                    </form>

                                </div>
                                <div class="panel-footer panel-footer-table ">
                                    <div class="col-xs-6 text-right">
                                    <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                                    </div>
                                    <div class="col-xs-6 text-left">
                                    <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                                    </div>
                                </div>

                                </div>
                                <div class="panel panel-default" >
                                  <div class="panel-heading panel-heading-table">
                                      <div class="row">
                                      <div class="col-xs-12">
                                          <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                                      </div>
                                      </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered table-hover">
                                      <thead>
                                          <tr>
                                              <th style="width: 6%;">工序</th>
                                              <th style="width: 10%;">生产计划批次号</th>
                                              <th style="width: 10%;">型号</th>
                                              <th style="width: 10%;">计划数量</th>
                                              <th style="width: 10%;">实际完成数量</th>
                                              <th style="width: 10%;">不良数量</th>
                                              <th style="width: 10%;">不良率</th>
                                              <th style="width: 10%;">完成合计</th>
                                              <th style="width: 10%;">不良合计</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr v-for="(value, index) in tbodyData" :key="index">
                                              <td v-text="value.workstage_name" :rowspan="tbodyData.length" v-if="index==0">
                                              </td>
                                              <td v-text="value.production_plan_batch_number">
                                              </td>
                                              <td v-text="value.product_model_name">
                                              </td>
                                              <td v-text="value.production_expected_output">
                                              </td>
                                              <td v-text="value.good_products_num">
                                              </td>
                                              <td v-text="value.rejects_batch_quantity">
                                              </td>
                                              <td>{{value.adverse_rate !== null ? value.adverse_rate +'%' : ''}}
                                              </td>
                                              <td v-text="productElementQuantity" :rowspan="tbodyData.length" v-if="index==0">
                                              </td>
                                              <td v-text="rejectsBatchQuantitySum" :rowspan="tbodyData.length" v-if="index==0">
                                              </td>
                                          </tr>
                                          <tr v-show="!tbodyData.length">
                                              <td colspan=15 class="text-center text-warning">
                                              没有可以显示的数据，请重新选择或输入查询条件
                                              </td>
                                          </tr>
                                      </tbody>
                                      </table>
                                  </div>
                                  <div class="panel-footer panel-footer-table text-right">
                                      <el-pagination
                                      @current-change="handleCurrentChange"
                                      background small
                                      layout="total,prev,pager,next"
                                      :current-page="currenPage"
                                      :page-size="pagesize"
                                      :total="lines"
                                      >
                                      </el-pagination>
                                  </div>

                                </div>
                            </div>
                            </div>
                        </div>
                                `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;
      // case '#productionStatusRF': {  //生产状态报表
      // }
        break;
      case '#productionReachRF': {	//计划达成率报表
        (function () {
          const swiper = document.getElementById('productionReachRF')   //右侧外部swiper
          const inerSwiper = document.getElementById('productionReachRFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, type: 'info', planId: '', planName: ''},//搜索参数
                tbodyData: [],

                workshopId: '',  //车间id
                workshopName: '',  //车间名称

                ajaxData: {
                  workstageId: '', //工序id
                  workstageName: '',//工序名称
                  startDate: '',// 异常记录开始时间
                  endDate: '',// 异常记录结束时间
                  headNum: 1 //下标
                },


                reportFormsName: '',  //报表名称

                lines: 0,     //总条数
                pagesize: 15,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun() {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkOrderOutlineFormsUrl,
                  data: this.ajaxData,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.workstageAndWorkOrderAscends
                      this.lines = result.map.line
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {

                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.workshopId = ''
                this.workshopName = ''
                this.ajaxData.workstageName = ''
                this.ajaxData.workstageId = ''
                this.ajaxData.startDate = ''
                this.ajaxData.endDate = ''
                this.tbodyData=[]
              },
              // 查询
              search() {
                if (this.ajaxData.workstageId == '') {
                  this.$message.error({
                    message: '请选择一个工序再查询',
                  })
                } else if (this.ajaxData.startDate == '' || this.ajaxData.endDate == '') {
                  this.$message.error({
                    message: '请选择一段时间再查询',
                  })
                } else {
                  this.currenPage = 1
                  this.reportFormsName = `${this.ajaxData.startDate} - ${this.ajaxData.endDate} 计划达成率报表`
                  this.queryFun()
                }

              },

              // 选择工序
              selectProcess(type) {
                if (type === '车间') {
                  this.ajaxData.workstageName = ''
                  this.ajaxData.workstageId = ''
                  let promise = new Promise((resolve, reject) => {
                    workshopModel(resolve)
                  })
                  promise.then((resolveData) => {
                    this.workshopName = resolveData.role_workshop_name
                    this.workshopId = resolveData.role_workshop_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    if (this.workshopId == '') {
                      workstageModal(resolve, queryWorkstageBasicsUrl, { type: 'vague', keyword: '', headNum: 1, status: 0 }, '')
                    } else {
                      workstageModal(resolve, queryWorkShopInfosUrl, { type: 'workstage', workshopId: this.workshopId }, this.workshopName)
                    }
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.workstageName = resolveData.workstage_name
                    this.ajaxData.workstageId = resolveData.workstage_basics_id
                  })
                }

              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startDate = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startDate = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.ajaxData.headNum = headNum
                this.queryFun()
              }

            },

            created() {
              this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },

            template: `
                        <div class="swiper-slide swiper-no-swiping" id="productionReachRFInerSwiper">
                            <!-- 右侧内部swiper -->
                            <div class="row">
                            <div class="col-sm-12">
                                <div class="panel panel-default">
                                <div class="panel-body-table ">

                                    <form class="form-inline form-table">
                                    <div class="row">

                                        <div class="col-md-4 col-xs-6">
                                            <div class="form-group ">
                                                <label class="control-label" style="margin-left:12px">车 间</label>
                                                <input type="text" class="form-control" placeholder="选择车间(可选)" v-model="workshopName" @focus="selectProcess('车间')">
                                                <a title="选择工序" href="javascript:;" class="input-btn" @click="selectProcess('车间')">
                                                    <i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-xs-6">
                                            <div class="form-group " >
                                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>工 序</label>
                                                <input type="text" class="form-control" placeholder="选择工序(必选)" v-model="ajaxData.workstageName" @focus="selectProcess('工序')">
                                                <a title="选择生产批号" href="javascript:;" class="input-btn" @click="selectProcess('工序')">
                                                    <i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                        </div>


                                    </div>
                                    <div class="row">

                                        <div class="col-md-12 col-xs-12 ">
                                            <div class="form-group">
                                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                                <input type="text" class="form-control" placeholder="开始时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="ajaxData.startDate = $event.target.value" v-bind:value="ajaxData.startDate" >
                                                <input type="text" class="form-control" placeholder="结束时间(必选)" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})" @blur="ajaxData.endDate = $event.target.value" v-bind:value="ajaxData.endDate">
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getYesterday()">&nbsp&nbsp&nbsp&nbsp昨天</a>
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastweek()">&nbsp7天</a>
                                                <a href="javascript:;" class="table-link" style="font-size:14px;" @click="getLastmonths()">&nbsp1个月</a>
                                            </div>

                                        </div>

                                    </div>
                                    </form>

                                </div>
                                <div class="panel-footer panel-footer-table ">
                                    <div class="col-xs-6 text-right">
                                    <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                                    </div>
                                    <div class="col-xs-6 text-left">
                                    <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                                    </div>
                                </div>

                                </div>
                                <div class="panel panel-default" >
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                    <div class="col-xs-12">
                                        <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                                    </div>
                                    </div>
                                </div>
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover">
                                    <thead>
                                        <tr>
                                        <th style="width: 6%;">工序</th>
                                        <th style="width: 13%;">生产计划批次号</th>
                                        <th style="width: 13%;">计划产量</th>
                                        <th style="width: 13%;">实际产量</th>
                                        <th style="width: 13%;">计划达成率</th>
                                        <th style="width: 13%;">总产量</th>
                                        <th style="width: 13%;">总达成率</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                            <td v-text="value.workstage_name" :rowspan="tbodyData.length" v-if="index==0">
                                            </td>
                                            <td v-text="value.production_plan_batch_number">
                                            </td>
                                            <td v-text="value.production_expected_output">
                                            </td>
                                            <td v-text="value.good_products_num">
                                            </td>
                                            <td v-text="value.v4">
                                            </td>
                                            <td v-text="value.v5">
                                            </td>
                                            <td v-text="value.v6">
                                            </td>
                                        </tr>
                                        <tr v-show="!tbodyData.length">
                                            <td colspan=15 class="text-center text-warning">
                                            没有可以显示的数据，请重新选择或输入查询条件
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination
                                    @current-change="handleCurrentChange"
                                    background small
                                    layout="total,prev,pager,next"
                                    :current-page="currenPage"
                                    :page-size="pagesize"
                                    :total="lines"
                                    >
                                    </el-pagination>
                                </div>

                                </div>
                            </div>
                            </div>
                        </div>
                                `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;

      case '#devicesOEERF': { //设备OEE报表
        ; (function () {
          const swiper = document.getElementById('devicesOEERF')   //右侧外部swiper
          const inerSwiper = document.getElementById('devicesOEERFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                tbodyData: [],

                ajaxData: {
                  devicesId: '', //设备id
                  devicesName: '',//设备名称
                  devicesTypeId: '', // 设备类型ID
                  devicesTypeName: '', // 设备类型名称
                  startTime: '',// 异常记录开始时间
                  endTime: '',// 异常记录结束时间
                  headNum: 1 //下标
                },

                reportFormsName: '',  //报表名称

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun() {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryDevicesOEEUrl,
                  data: this.ajaxData,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.oees

                      this.tbodyData = []
                      var exceptionsList = []
                      result.map.oees.forEach((val, key) => { //遍历出去重的数据
                        exceptionsList.push(val.devices_control_devices_name)
                      })
                      exceptionsList = [...new Set(exceptionsList)] //去重的数据

                      exceptionsList.forEach((value, index) => { //创建不重复类型的二维数组
                        this.tbodyData.push([])
                      })
                      result.map.oees.forEach((val, key) => {  //推入不重复类型的二维数组
                        exceptionsList.forEach((value, index) => {
                          if (val.devices_control_devices_name == value) {
                            this.tbodyData[index].push(val)
                          }
                        })
                      })
                      this.lines = result.map.lines
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.ajaxData.devicesId = ''
                this.ajaxData.devicesTypeId = ''
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesTypeName = ''
                this.ajaxData.startTime = ''
                this.ajaxData.endTime =''
                this.tbodyData=[]
              },
              // 查询
              search() {
                if (this.ajaxData.startTime == '' || this.ajaxData.endTime == '') {
                  this.$message.error({
                    message: '请选择一段时间再查询',
                  })
                } else {
                  this.currenPage = 1
                  this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备OEE报表`
                  this.queryFun()
                }
              },
              // 选择设备类型
              selectDevicesType() {
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesId = ''
                let promise = new Promise((resolve, reject) => {
                  selectDevicesTypeModal(resolve)
                })
                promise.then((resolveData) => {
                  this.ajaxData.devicesTypeName = resolveData.devices_control_devices_type_name
                  this.ajaxData.devicesTypeId = resolveData.devices_control_devices_type_id
                })
              },
              // 选择设备编号
              selectDevices() {
                if (this.ajaxData.devicesTypeId !== '') {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, this.ajaxData.devicesTypeId, this.ajaxData.devicesTypeName)
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, '', '')
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                }

              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.ajaxData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },

            created() {
              this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },

            filters: {
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
              average(val) {
                var num = 0
                val.forEach((value, index) => {
                  num += Number(value.devices_oees)
                })
                num = num / val.length
                return num + '%'
              }
            },
            template: `
                        <div class="swiper-slide swiper-no-swiping" id="devicesOEERFInerSwiper">
                            <!-- 右侧内部swiper -->
                            <div class="row">
                            <div class="col-sm-12">
                                <div class="panel panel-default">
                                <div class="panel-body-table ">

                                    <form class="form-inline form-table">
                                    <div class="row">

                                        <div class="col-md-4 col-xs-6">
                                        <div class="form-group">
                                            <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备类型</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="选择设备类型(可选)"
                                                v-model="ajaxData.devicesTypeName"
                                                @focus="selectDevicesType()"
                                            >
                                            <a
                                                title="选择设备"
                                                href="javascript:;"
                                                class="input-btn"
                                                @click="selectDevicesType()"
                                            ><i class="fa fa-search"></i>
                                            </a>
                                        </div>
                                        </div>
                                        <div class="col-md-4 col-xs-6">
                                            <div class="form-group">
                                                <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备编号</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="选择设备编号(可选)"
                                                    v-model="ajaxData.devicesName"
                                                    @focus="selectDevices()"
                                                >
                                                <a
                                                    title="选择设备"
                                                    href="javascript:;"
                                                    class="input-btn"
                                                    @click="selectDevices()"
                                                ><i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-xs-6">
                                        </div>

                                    </div>
                                    <div class="row">

                                        <div class="col-md-12 col-xs-12 ">
                                        <div class="form-group">
                                            <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="开始时间(必选)"
                                                onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                                @blur="ajaxData.startTime = $event.target.value"
                                                v-bind:value="ajaxData.startTime"
                                            >
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="结束时间(必选)"
                                                onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                                @blur="ajaxData.endTime = $event.target.value"
                                                v-bind:value="ajaxData.endTime"
                                            >
                                            <a
                                                href="javascript:;"
                                                class="table-link"
                                                style="font-size:14px;"
                                                @click="getYesterday()"
                                            >&nbsp&nbsp&nbsp&nbsp昨天
                                            </a>
                                            <a
                                                href="javascript:;"
                                                class="table-link"
                                                style="font-size:14px;"
                                                @click="getLastweek()"
                                            >&nbsp7天
                                            </a>
                                            <a
                                                href="javascript:;"
                                                class="table-link"
                                                style="font-size:14px;"
                                                @click="getLastmonths()"
                                            >&nbsp1个月
                                            </a>
                                        </div>

                                        </div>

                                    </div>
                                    </form>

                                </div>
                                <div class="panel-footer panel-footer-table ">
                                    <div class="col-xs-6 text-right">
                                    <button class="btn btn-primary submit-reset" @click="reset()">重 置</button>
                                    </div>
                                    <div class="col-xs-6 text-left">
                                    <button class="btn btn-primary submit-search" @click="search()">查 询</button>
                                    </div>
                                </div>

                                </div>
                                <div class="panel panel-default" >
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                    <div class="col-xs-12">
                                        <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                                    </div>
                                    </div>
                                </div>
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered">
                                    <thead>
                                        <tr>
                                        <th style="width: 12%;">设备名称</th>
                                        <th style="width: 12%;">设备编号</th>
                                        <th style="width: 12%;">工单编号</th>
                                        <th style="width: 12%;">负荷时间</th>
                                        <th style="width: 12%;">停机时间</th>
                                        <th style="width: 12%;">设备稼动率</th>
                                        <th style="width: 12%;">OEE</th>
                                        <th style="width: 12%;">平均OEE</th>
                                        </tr>
                                    </thead>
                                    <tbody v-for="(val, key) in tbodyData" style="border:0">
                                        <tr v-for="(value, index) in val">
                                        <td v-text="value.devices_control_devices_name" :rowspan="val.length" v-if="index == 0">
                                        </td>
                                        <td v-text="value.devices_control_devices_number" :rowspan="val.length" v-if="index == 0">
                                        </td>
                                        <td v-text="value.work_order_number">
                                        </td>

                                        <td>{{value.loadTime }}</td>

                                        <td>{{value.downTime}}</td>

                                        <td v-text="value.devices_utilization_rate + '%'">
                                        </td>

                                        <td v-text="value.devices_oees + '%'">
                                        </td>

                                        <td  :rowspan="val.length" v-if="index == 0">
                                            {{val | average}}
                                        </td>

                                        </tr>
                                    </tbody>
                                    <tbody v-show="!tbodyData.length">
                                        <tr>
                                            <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据，请重新选择或输入查询条件
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination
                                    @current-change="handleCurrentChange"
                                    background small
                                    layout="total,prev,pager,next"
                                    :current-page="currenPage"
                                    :page-size="pagesize"
                                    :total="lines"
                                    >
                                    </el-pagination>
                                </div>

                                </div>
                            </div>
                            </div>
                        </div>
                                `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#devicesAbnormalRF': {	//设备异常报表
        ; (function () {
          const swiper = document.getElementById('devicesAbnormalRF')   //右侧外部swiper
          const inerSwiper = document.getElementById('devicesAbnormalRFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                tbodyData: [],
                ajaxData: {
                  devicesId: '', //设备id
                  devicesName: '',//设备名称
                  devicesTypeId: '', // 设备类型ID
                  devicesTypeName: '', // 设备类型名称
                  startTime: '',// 异常记录开始时间
                  endTime: '',// 异常记录结束时间
                  headNum: 1 //下标
                },

                reportFormsName: '',  //报表名称

                lines: 0,       //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun() {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryDevicesExceptionUrl,
                  data: this.ajaxData,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = []
                      var exceptionsList = []
                      result.map.exceptions.forEach((val, key) => { //遍历出去重的数据
                        exceptionsList.push(val.devices_control_devices_name)
                      })
                      exceptionsList = [...new Set(exceptionsList)] //去重的数据

                      exceptionsList.forEach((value, index) => { //创建不重复类型的二维数组
                        this.tbodyData.push([])
                      })
                      result.map.exceptions.forEach((val, key) => {  //推入不重复类型的二维数组
                        exceptionsList.forEach((value, index) => {
                          if (val.devices_control_devices_name == value) {
                            this.tbodyData[index].push(val)
                          }
                        })
                      })

                      this.lines = result.map.lines
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.ajaxData.devicesId = ''
                this.ajaxData.devicesTypeId = ''
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesTypeName = ''
                this.ajaxData.startTime = ''
                this.ajaxData.endTime =''
                this.tbodyData=[]
              },
              // 查询
              search() {
                if (this.ajaxData.startTime == '' || this.ajaxData.endTime == '') {
                  this.$message.error({
                    message: '请选择一段时间再查询',
                  })
                } else {
                  this.currenPage = 1
                  this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备异常报表`
                  this.queryFun()
                }
              },
              // 选择设备类型
              selectDevicesType() {
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesId = ''
                let promise = new Promise((resolve, reject) => {
                  selectDevicesTypeModal(resolve)
                })
                promise.then((resolveData) => {
                  this.ajaxData.devicesTypeName = resolveData.devices_control_devices_type_name
                  this.ajaxData.devicesTypeId = resolveData.devices_control_devices_type_id
                })
              },
              // 选择设备编号
              selectDevices() {
                if (this.ajaxData.devicesTypeId !== '') {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, this.ajaxData.devicesTypeId, this.ajaxData.devicesTypeName)
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, '', '')
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                }
              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.ajaxData.headNum = headNum
                this.queryFun()
              }

            },

            created() {
              this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },
            filters: {
              times(val) {
                return moment(val).format('YYYY-MM-DD HH:mm:ss')
              }
            },
            template: `
                        <div class="swiper-slide swiper-no-swiping" id="devicesAbnormalRFInerSwiper">
                            <!-- 右侧内部swiper -->
                            <div class="row">
                            <div class="col-sm-12">
                                <div class="panel panel-default">
                                    <div class="panel-body-table ">

                                        <form class="form-inline form-table">
                                        <div class="row">

                                            <div class="col-md-4 col-xs-6">
                                            <div class="form-group">
                                                <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备类型</label>

                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="选择设备类型(可选)"
                                                    v-model="ajaxData.devicesTypeName"
                                                    @focus="selectDevicesType()"
                                                >
                                                <a
                                                    title="选择设备"
                                                    href="javascript:;"
                                                    class="input-btn"
                                                    @click="selectDevicesType()"
                                                ><i class="fa fa-search"></i>
                                                </a>
                                            </div>
                                            </div>
                                            <div class="col-md-4 col-xs-6">
                                                <div class="form-group">
                                                    <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备编号</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="选择设备编号(可选)"
                                                        v-model="ajaxData.devicesName"
                                                        @focus="selectDevices()"
                                                    >
                                                    <a
                                                        title="选择设备"
                                                        href="javascript:;"
                                                        class="input-btn"
                                                        @click="selectDevices()"
                                                    ><i class="fa fa-search"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-xs-6">
                                            </div>

                                        </div>
                                        <div class="row">

                                            <div class="col-md-12 col-xs-12 ">
                                            <div class="form-group">
                                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="开始时间(必选)"
                                                    onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                                    @blur="ajaxData.startTime = $event.target.value"
                                                    v-bind:value="ajaxData.startTime"
                                                >
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="结束时间(必选)"
                                                    onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                                    @blur="ajaxData.endTime = $event.target.value"
                                                    v-bind:value="ajaxData.endTime"
                                                >
                                                <a
                                                    href="javascript:;"
                                                    class="table-link"
                                                    style="font-size:14px;"
                                                    @click="getYesterday()"
                                                >&nbsp&nbsp&nbsp&nbsp昨天
                                                </a>
                                                <a
                                                    href="javascript:;"
                                                    class="table-link"
                                                    style="font-size:14px;"
                                                    @click="getLastweek()"
                                                >&nbsp7天
                                                </a>
                                                <a
                                                    href="javascript:;"
                                                    class="table-link"
                                                    style="font-size:14px;"
                                                    @click="getLastmonths()"
                                                >&nbsp1个月
                                                </a>
                                            </div>

                                            </div>

                                        </div>
                                        </form>

                                    </div>
                                    <div class="panel-footer panel-footer-table">
                                        <div class="col-xs-6 text-right">
                                        <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                                        </div>
                                        <div class="col-xs-6 text-left">
                                        <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                                        </div>
                                    </div>

                                </div>
                                <div class="panel panel-default">
                                    <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                        <div class="col-xs-12">
                                            <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                                        </div>
                                        </div>
                                    </div>
                                    <div class="panel-body-table table-height-10">
                                        <table class="table  table-bordered ">
                                        <thead>
                                            <tr>
                                            <th style="width: 12%;">设备名称</th>
                                            <th style="width: 12%;">设备编号</th>
                                            <th style="width: 12%;">发生异常时间</th>
                                            <th style="width: 12%;">发生异常地点</th>
                                            <th style="width: 12%;">异常部位</th>
                                            <th style="width: 12%;">异常描述</th>
                                            <th style="width: 12%;">异常总次数</th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="(val, key) in tbodyData" style="border:0">
                                            <tr v-for="(value, index) in val">
                                                <td v-text="value.devices_control_devices_name" :rowspan="val.length" v-if="index == 0">
                                                </td>
                                                <td v-text="value.devices_control_devices_number" :rowspan="val.length" v-if="index == 0">
                                                </td>
                                                <td >{{value.devices_exception_record_time | times}}
                                                </td>
                                                <td v-text="value.devices_exception_record_site">
                                                </td>
                                                <td v-text="value.devices_exception_record_part">
                                                </td>
                                                <td v-text="value.devices_exception_record_detail">
                                                </td>
                                                <td :rowspan="val.length" v-if="index == 0">{{val.length + '次'}}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-show="!tbodyData.length">
                                        <tr>
                                            <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据，请重新选择或输入查询条件
                                            </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                    </div>
                                    <div class="panel-footer panel-footer-table text-right">
                                        <el-pagination
                                        @current-change="handleCurrentChange"
                                        background small
                                        layout="total,prev,pager,next"
                                        :current-page="currenPage"
                                        :page-size="pagesize"
                                        :total="lines"
                                        >
                                        </el-pagination>
                                    </div>

                                </div>
                            </div>
                            </div>
                        </div>
                                `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;
      case '#devicesMaintainRF': {	//设备维修报表
        ; (function () {
          const swiper = document.getElementById('devicesMaintainRF')   //右侧外部swiper
          const inerSwiper = document.getElementById('devicesMaintainRFInerSwiper') // 右侧内部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, type: 'info', planId: '', planName: '' },//搜索参数
                tbodyData: [],


                ajaxData: {
                  devicesId: '', //设备id
                  devicesName: '',//设备名称
                  devicesTypeId: '', // 设备类型ID
                  devicesTypeName: '', // 设备类型名称
                  startTime: '',// 异常记录开始时间
                  endTime: '',// 异常记录结束时间
                  headNum: 1 //下标
                },

                reportFormsName: '',  //报表名称

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun() {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryDevicesExceptionAndMalfunctionUrl,
                  data: this.ajaxData,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = []
                      var exceptionsList = []
                      result.map.malfunctions.forEach((val, key) => { //遍历出去重的数据
                        exceptionsList.push(val.devices.devices_control_devices_name)
                      })
                      exceptionsList = [...new Set(exceptionsList)] //去重的数据

                      exceptionsList.forEach((value, index) => { //创建不重复类型的二维数组
                        this.tbodyData.push([])
                      })
                      result.map.malfunctions.forEach((val, key) => {  //推入不重复类型的二维数组
                        exceptionsList.forEach((value, index) => {
                          if (val.devices.devices_control_devices_name == value) {
                            this.tbodyData[index].push(val)
                          }
                        })
                      })
                      this.lines = result.map.malfunctionLines
                    }
                    else if (result.status === 2) {
                      this.tbodyData = []
                      swallFail2(result.msg);
                     }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },
              // 重置查询条件
              reset() {
                this.ajaxData.devicesId = ''
                this.ajaxData.devicesTypeId = ''
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesTypeName = ''
                this.ajaxData.startTime = ''
                this.ajaxData.endTime = ''
                this.tbodyData=[]
              },
              // 查询
              search() {
                if (this.ajaxData.startTime == '' || this.ajaxData.endTime == '') {
                  this.$message.error({
                    message: '请选择一段时间再查询',
                  })
                } else {
                  this.currenPage = 1
                  this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备维修报表`

                  this.queryFun()
                }
              },
              // 选择设备类型
              selectDevicesType() {
                this.ajaxData.devicesName = ''
                this.ajaxData.devicesId = ''
                let promise = new Promise((resolve, reject) => {
                  selectDevicesTypeModal(resolve)
                })
                promise.then((resolveData) => {
                  this.ajaxData.devicesTypeName = resolveData.devices_control_devices_type_name
                  this.ajaxData.devicesTypeId = resolveData.devices_control_devices_type_id
                })
              },
              // 选择设备编号
              selectDevices() {
                if (this.ajaxData.devicesTypeId !== '') {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, this.ajaxData.devicesTypeId, this.ajaxData.devicesTypeName)
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                } else {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve, '', '')
                  })
                  promise.then((resolveData) => {
                    this.ajaxData.devicesName = resolveData.devices_control_devices_number
                    this.ajaxData.devicesId = resolveData.devices_control_devices_id
                  })
                }

              },
              // 获取昨天
              getYesterday() {
                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.ajaxData.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.ajaxData.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.ajaxData.headNum = headNum
                this.queryFun()
              }

            },

            created() {
              this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
              this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="devicesMaintainRFInerSwiper">
                  <!-- 右侧内部swiper -->
                  <div class="row">
                  <div class="col-sm-12">
                      <div class="panel panel-default">
                      <div class="panel-body-table ">

                          <form class="form-inline form-table">
                              <div class="row">

                                  <div class="col-md-4 col-xs-6">
                                  <div class="form-group">
                                      <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备类型</label>
                                      <input
                                          type="text"
                                          class="form-control"
                                          placeholder="选择设备类型(可选)"
                                          v-model="ajaxData.devicesTypeName"
                                          @focus="selectDevicesType()"
                                      >
                                      <a
                                          title="选择设备"
                                          href="javascript:;"
                                          class="input-btn"
                                          @click="selectDevicesType()"
                                      ><i class="fa fa-search"></i>
                                      </a>
                                  </div>
                                  </div>
                                  <div class="col-md-4 col-xs-6">
                                      <div class="form-group">
                                          <label class="control-label"><i>&nbsp;&nbsp;&nbsp;&nbsp;</i>设备编号</label>
                                          <input
                                              type="text"
                                              class="form-control"
                                              placeholder="选择设备编号(可选)"
                                              v-model="ajaxData.devicesName"
                                              @focus="selectDevices()"
                                          >
                                          <a
                                              title="选择设备"
                                              href="javascript:;"
                                              class="input-btn"
                                              @click="selectDevices()"
                                          ><i class="fa fa-search"></i>
                                          </a>
                                      </div>
                                  </div>
                                  <div class="col-md-4 col-xs-6">
                                  </div>

                              </div>
                              <div class="row">

                                  <div class="col-md-12 col-xs-12 ">
                                  <div class="form-group">
                                      <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                      <input
                                          type="text"
                                          class="form-control"
                                          placeholder="开始时间(必选)"
                                          onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                          @blur="ajaxData.startTime = $event.target.value"
                                          v-bind:value="ajaxData.startTime"
                                      >
                                      <input
                                          type="text"
                                          class="form-control"
                                          placeholder="结束时间(必选)"
                                          onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                          @blur="ajaxData.endTime = $event.target.value"
                                          v-bind:value="ajaxData.endTime"
                                      >
                                      <a
                                          href="javascript:;"
                                          class="table-link"
                                          style="font-size:14px;"
                                          @click="getYesterday()"
                                      >&nbsp&nbsp&nbsp&nbsp昨天
                                      </a>
                                      <a
                                          href="javascript:;"
                                          class="table-link"
                                          style="font-size:14px;"
                                          @click="getLastweek()"
                                      >&nbsp7天
                                      </a>
                                      <a
                                          href="javascript:;"
                                          class="table-link"
                                          style="font-size:14px;"
                                          @click="getLastmonths()"
                                      >&nbsp1个月
                                      </a>
                                  </div>

                                  </div>

                              </div>
                          </form>

                      </div>
                      <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                          <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                          <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                      </div>

                      </div>
                      <div class="panel panel-default" >
                      <div class="panel-heading panel-heading-table">
                          <div class="row">
                          <div class="col-xs-12">
                              <h5 class="panel-title" v-text="reportFormsName">报表明细</h5>
                          </div>
                          </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                          <table class="table  table-bordered ">
                          <thead>
                              <tr>
                              <th style="width: 12%;">设备名称</th>
                              <th style="width: 12%;">设备编号</th>
                              <th style="width: 12%;">维修原因</th>
                              <th style="width: 12%;">处理情况</th>
                              <th style="width: 12%;">维修时间</th>
                              <th style="width: 12%;">维修次数</th>
                              </tr>
                          </thead>
                          <tbody v-for="(val, key) in tbodyData" style="border:0">
                              <tr v-for="(value, index) in val">
                                  <td v-text="value.devices.devices_control_devices_name" :rowspan="val.length" v-if="index == 0">
                                  </td>
                                  <td v-text="value.devices.devices_control_devices_number" :rowspan="val.length" v-if="index == 0">
                                  </td>
                                  <td v-text="value.devices_malfunction_record_describe">
                                  </td>
                                  <td v-text="value.devices_malfunction_record_status">
                                  </td>
                                  <td v-text="value.devices_malfunction_record_time">
                                  </td>
                                  <td v-text="val.length + '次'" :rowspan="val.length" v-if="index == 0">
                                  </td>
                              </tr>

                          </tbody>
                          <tbody v-show="!tbodyData.length">
                          <tr>
                              <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                              </td>
                          </tr>
                          </tbody>
                          </table>
                          </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                          <el-pagination
                          @current-change="handleCurrentChange"
                          background small
                          layout="total,prev,pager,next"
                          :current-page="currenPage"
                          :page-size="pagesize"
                          :total="lines"
                          >
                          </el-pagination>
                      </div>

                      </div>
                  </div>
                  </div>
              </div>
                        `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#IQCgoodRateRF': {	//IQC优率报表
        ; (function () {
          const swiper = document.getElementById('IQCgoodRateRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#IQCgoodRateRFInerSwiper',
            data() {
              return {
                searchData: {
                  // headNum: 1,
                  // reportId: '', //报告id()
                  materialId: '', // 物料id
                  materialBatch: '', // 物料批次
                  startDate: '', // 开始时间
                  endDate: '', // 结束时间
                },//搜索参数
                tbodyData: [],  //渲染表格的数据

                materialId: '',  //物料id
                materialName: '',  //物料名称
                materialBatch: '',  //物料批号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                isDetail: false,  //控制是否显示明细按钮,当没数据时不显示

                reportSum: 0,  //检测报告数
                goodReportSum: 0,  //合格报告数
                goodReportRate: 0,  //报告合格率
                examineSum: 0, //检查数量
                unit: '', //单位
                goodExamineSum: 0,  //良品数
                goodExamineRate: 0,  //良品率

                currentPageExamineSum: 0, //当前页检查数量
                currentPageGoodExamineSum: 0,  //当前页良品数
                currentPageGoodExamineRate: 0,  //当前页良品率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'IQCgoodRateRF_1',
                ],

                tempArry:[],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页


              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime} -- ${this.endTime} IQC优率报表`
                // console.log(data)
                 if(data.materialId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryIQCReportUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    //初始化数据
                    this.reportSum = 0,  //检测报告数
                    this.goodReportSum = 0,  //合格报告数
                    this.goodReportRate = 0,  //报告合格率
                    this.examineSum = 0, //检查数量
                    this.goodExamineSum = 0,  //良品数
                    this.goodExamineRate = 0,  //良品率

                    this.currentPageExamineSum = 0
                    this.currentPageGoodExamineSum = 0
                    this.currentPageGoodExamineRate = 0

                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tempArry = result.map.iqcReports
                      this.lines = result.map.lines

                      this.reportSum = this.tempArry.length //检测报告数
                      this.tempArry.forEach((value, index) => {
                        if (value.quality_iqc_comprehensive_result === '0') {
                          this.goodReportSum += 1  //合格报告数
                        }
                        this.examineSum += parseInt(value.warehouse_material_number)  //检查数量
                        // this.goodExamineSum += parseInt(value.quality_iqc_good_product_number) //良品数
                        if(value.quality_iqc_good_product_number){
                        this.goodExamineSum += parseInt(value.quality_iqc_good_product_number) //良品数
                        }
                      })

                      //防止0/0出现NAN,分母不能为0
                      if (this.reportSum > 0) {
                        this.goodReportRate = Math.round((this.goodReportSum / this.reportSum) * 10000) / 100 //报告合格率
                      }

                      //防止0/0出现NAN,分母不能为0
                      if (this.examineSum > 0) {
                        this.goodExamineRate = Math.round((this.goodExamineSum / this.examineSum) * 10000) / 100  //良品率
                      }

                      this.lines = this.tempArry.length //总条数

                      this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                      this.computedCurrentPage(this.tbodyData)
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg); //操作失败
                     }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              }
              },

              // 重置搜索条件
              reset() {
                this.materialId = ''
                this.materialName = ''
                this.materialBatch = ''
                this.startTime =''
                this.endTime = ''
                this.tbodyData = []

              },
              // 查询
              search() {
                if (this.materialId === null || this.materialId === '') {
                  this.$message.error(`物料未选择`);
                  return;
                }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }

                this.currenPage = 1
                // this.searchData.
                this.searchData.materialId = this.materialId
                this.searchData.materialBatch = this.materialBatch
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime

                this.queryFun(this.searchData)
              },

              //统计当前页
              computedCurrentPage(arry) {
                this.currentPageExamineSum = 0
                this.currentPageGoodExamineSum = 0
                this.currentPageGoodExamineRate = 0

                arry.forEach((value, index) => {
                  this.currentPageExamineSum += parseInt(value.warehouse_material_number)  //检查数量
                  // this.currentPageGoodExamineSum += parseInt(value.quality_iqc_good_product_number) //良品数
                  if(value.quality_iqc_good_product_number){
                    this.currentPageGoodExamineSum += parseInt(value.quality_iqc_good_product_number) //良品数
                  }

                  //防止0/0出现NAN,分母不能为0
                  if (this.currentPageExamineSum > 0) {
                    this.currentPageGoodExamineRate = Math.round((this.currentPageGoodExamineSum / this.currentPageExamineSum) * 10000) / 100  //良品率
                  }
                })
              },

              // 选择物料
              selectMaterial(type) {
                // console.log(type)
                let promise = new Promise((resolve, reject) => {
                  selectMaterialModal(resolve, type)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  if (type === 'info') {  //选择物料
                    this.materialId = resolveData.warehouse_material_id
                    this.materialName = resolveData.warehouse_material_name
                    this.unit = resolveData.warehouse_material_units
                  }
                  if (type === 'record') {  //选择物料批次
                    this.materialBatch = resolveData.warehouse_material_batch
                  }

                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val

                this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);

                this.computedCurrentPage(this.tbodyData)
                // this.searchData.headNum = headNum
                // this.queryFun(this.searchData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="IQCgoodRateRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                        <div class="panel panel-default">
                          <div class="panel-body-table ">

                            <form class="form-inline form-table">
                              <div class="row">

                                <div class="col-md-4 col-xs-6">
                                  <div class="form-group ">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择物料</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        placeholder="选择物料(必选)"
                                        v-model="materialName"
                                        @focus="selectMaterial('info')"
                                      >
                                      <a
                                        title="选择物料"
                                        href="javascript:;"
                                        class="input-btn"
                                        @click="selectMaterial('info')"
                                      ><i class="fa fa-search"></i>
                                      </a>
                                  </div>
                                </div>
                                <div class="col-md-4 col-xs-6">
                                  <div class="form-group " >
                                    <label class="control-label">	物料批次</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        placeholder="输入物料批次(可选)"
                                        v-model="materialBatch"
                                      >
                                      <a
                                        title="选择物料批次"
                                        href="javascript:;"
                                        class="input-btn"
                                        @click="selectMaterial('record')"
                                      ><i class="fa fa-search"></i>
                                      </a>
                                  </div>
                                </div>
                                <div class="col-md-4 col-xs-6">

                                </div>

                              </div>
                              <div class="row">

                                <div class="col-md-12 col-xs-12 ">
                                  <div class="form-group">
                                      <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="startTime"
                                        placeholder="开始时间(必选)"
                                        onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                        @blur="startTime = $event.target.value"
                                        v-bind:value="startTime"
                                      >
                                      <input
                                        type="text"
                                        class="form-control"
                                        id="endTime"
                                        placeholder="结束时间(必选)"
                                        onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                        @blur="endTime = $event.target.value"
                                        v-bind:value="endTime"
                                      >
                                      <a
                                        href="javascript:;"
                                        class="table-link"
                                        style="font-size:14px;"
                                        @click="getYesterday()"
                                      >&nbsp&nbsp&nbsp&nbsp昨天
                                      </a>
                                      <a
                                        href="javascript:;"
                                        class="table-link"
                                        style="font-size:14px;"
                                        @click="getLastweek()"
                                      >&nbsp7天
                                      </a>
                                    <a
                                        href="javascript:;"
                                        class="table-link"
                                        style="font-size:14px;"
                                        @click="getLastmonths()"
                                      >&nbsp1个月
                                      </a>
                                  </div>

                                </div>

                              </div>
                            </form>

                          </div>
                          <div class="panel-footer panel-footer-table ">
                            <div class="col-xs-6 text-right">
                              <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                            </div>
                            <div class="col-xs-6 text-left">
                              <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                            </div>
                          </div>

                        </div>
                        <div class="panel panel-default">
                          <div class="panel-heading panel-heading-table">
                            <div class="row">
                              <div class="col-xs-8">
                                <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                              </div>
                              <div class="col-xs-4 text-right">
                              </div>
                            </div>
                          </div>
                          <div class="panel-body-table">
                            <table class="table  table-bordered table-hover ">
                              <tbody>
                                <tr>
                                  <th style="width:10%">检测报告数</th>
                                  <td style="width:10%" v-text="reportSum">
                                  </td>
                                  <th style="width:10%">合格报告数</th>
                                  <td style="width:10%" v-text="goodReportSum">
                                  </td>
                                  <th style="width:10%">报告合格率</th>
                                  <td style="width:10%" v-text="goodReportRate + '%' ">
                                  </td>
                                  <th style="width:10%"></th>
                                  <td style="width:10%"></td>
                                </tr>
                                <tr>
                                  <th>检查数量</th>
                                  <td v-text="examineSum">
                                  </td>
                                  <th>单位</th>
                                  <td v-text="unit">
                                  </td>
                                  <th>良品数</th>
                                  <td v-text="goodExamineSum">
                                  </td>
                                  <th>良品率</th>
                                  <td v-text="goodExamineRate + '%' ">
                                  </td>
                                </tr>
                              </tbody>

                            </table>
                          </div>

                        </div>
                        <div class="panel panel-default" >
                            <el-collapse-item name="IQCgoodRateRF_1">
                                <template slot="title">
                                  <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                      <div class="col-xs-4">
                                        <h5 class="panel-title">报表明细</h5>
                                      </div>
                                      <div class="col-xs-8">

                                      </div>
                                    </div>
                                  </div>
                                </template>

                            <div class="panel-body-table table-height-10">
                              <table class="table  table-bordered table-hover table-condensed" style="border-top:1px solid #ddd;">
                                <thead>
                                  <tr>
                                    <th style="width: 6%;">序号</th>
                                    <th style="width: 13%;">报告编号</th>
                                    <th style="width: 15%;">时间</th>
                                    <th style="width: 10%;">物料名称</th>
                                    <th style="width: 13%;">物料批次</th>
                                    <th style="width: 8%;">判定</th>
                                    <th style="width: 10%;">检查数量</th>
                                    <th style="width: 10%;">良品数</th>
                                    <th style="width: 16%;">良品率</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                    <td v-text="index + 1" >
                                    </td>
                                    <td v-text="value.quality_iqc_report_number">
                                    </td>
                                    <td v-text="">
                                    {{value.quality_iqc_inspection_date | times}}
                                    </td>
                                    <td v-text="value.quality_iqc_report_name">
                                    </td>
                                    <td v-text="value.warehouse_material_batch">
                                    </td>
                                    <td>
                                    {{value.quality_iqc_comprehensive_result === '0' ? '合格' : '不合格'}}
                                    </td>
                                    <td>{{value.warehouse_material_number ?  value.warehouse_material_number : 0}}
                                    </td>
                                    <td>{{value.quality_iqc_good_product_number ?  value.quality_iqc_good_product_number : 0}}
                                    </td>
                                    <td>{{value.quality_iqc_good_product_rate ? value.quality_iqc_good_product_rate + '%' : '0%'}}
                                    </td>
                                  </tr>

                                  <tr v-show="!tbodyData.length">
                                    <td colspan=15 class="text-center text-warning">
                                    没有可以显示的数据，请重新选择或输入查询条件
                                    </td>
                                  </tr>

                                  <tr>
                                    <th colspan="6">当页统计</th>
                                    <td v-text="currentPageExamineSum"></td>
                                    <td v-text="currentPageGoodExamineSum"></td>
                                    <td v-text="currentPageGoodExamineRate + '%' "></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div class="panel-footer panel-footer-table text-right">
                              <el-pagination
                                @current-change="handleCurrentChange"
                                background small
                                layout="total,prev,pager,next"
                                :current-page="currenPage"
                                :page-size="pagesize"
                                :total="lines"
                              >
                              </el-pagination>
                            </div>
                          </el-collapse-item>
                        </div>
                     </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#IQCbadnessRF': {	//IQC不良内容统计及分布
        ; (function () {
          const swiper = document.getElementById('IQCbadnessRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#IQCbadnessRFInerSwiper',
            data() {
              return {
                searchData: {
                  // headNum: 1,
                  materialId: '', // 物料id
                  materialBatch: '', // 物料批次
                  startDate: '', // 开始时间
                  endDate: '', // 结束时间
                },//搜索参数
                tbodyData: [],

                materialId: '',  //物料id
                materialName: '',  //物料名称
                materialBatch: '',  //物料批号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                badnessSum: 0, //不良总次数

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {

                this.reportFormsName = `${this.startTime} -- ${this.endTime} IQC不良内容统计及分布`
                if(data.materialId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryIQCUnqualifiedReportUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()

                    this.tbodyData = []
                    this.badnessSum = 0

                    if (result.status == 0) {
                      let groupArry = [];
                      let unqualifieds = result.map.unqualifieds

                      this.badnessSum = unqualifieds.length

                      unqualifieds.forEach((value,index) => {  //分组
                        groupArry.push(value.quality_unqualified_code)
                      })
                      groupArry = [...new Set(groupArry)]

                      groupArry.forEach((value, index) => {  //生成渲染页面数据
                        let tempObj = {
                          badness_code: value,  //不良代号
                          badness_detail: '',  //不良描述
                          badness_sum: 0,  //不良次数
                          badness_rate:0,  //不良占比
                        }
                        unqualifieds.forEach((value2, index2) => {  //遍历后台数据
                          if (value === value2.quality_unqualified_code) {
                            tempObj.badness_sum += 1
                          }
                        })
                        //防止0/0出现NAN,分母不能为0
                        if (this.badnessSum > 0) {
                          tempObj.badness_rate = Math.round((tempObj.badness_sum / this.badnessSum) * 10000) / 100  //不良占比
                        }

                        this.tbodyData.push(tempObj)
                      })

                      // console.dir(11)
                    }
                    else if (result.status === 2) {
                      swal({
                        title: '没有可显示的数据',
                        type: 'question',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        confirmButtonText: '确定',
                      })
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              }
              },
              // 重置搜索条件
              reset() {
                this.materialId = ''
                this.materialName = ''
                this.materialBatch = ''
                this.startTime = ''
                this.endTime =''
                this.tbodyData = []
              },
              // 查询
              search() {
                if (this.materialId === null || this.materialId === '') {
                  this.$message.error(`物料未选择`);
                  return;
                }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }

                this.currenPage = 1

                this.searchData.materialId = this.materialId
                this.searchData.materialBatch = this.materialBatch
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime

                this.queryFun(this.searchData)
              },


              // 选择物料
              selectMaterial(type) {
                let promise = new Promise((resolve, reject) => {
                  selectMaterialModal(resolve, type)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  if (type === 'info') {  //选择物料
                    this.materialId = resolveData.warehouse_material_id
                    this.materialName = resolveData.warehouse_material_name
                    this.unit = resolveData.warehouse_material_units
                  }
                  if (type === 'record') {  //选择物料批次
                    this.materialBatch = resolveData.warehouse_material_batch
                  }

                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="IQCbadnessRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-body-table ">

                        <form class="form-inline form-table">
                          <div class="row">

                            <div class="col-md-4 col-xs-6">
                              <div class="form-group ">
                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择物料</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="选择物料(必选)"
                                    v-model="materialName"
                                    @focus="selectMaterial('info')"
                                  >
                                  <a
                                    title="选择物料"
                                    href="javascript:;"
                                    class="input-btn"
                                    @click="selectMaterial('info')"
                                  ><i class="fa fa-search"></i>
                                  </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group " >
                                <label class="control-label">物料批次</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="输入物料批次(可选)"
                                    v-model="materialBatch"
                                  >
                                  <a
                                    title="选择物料批次号"
                                    href="javascript:;"
                                    class="input-btn"
                                    @click="selectMaterial('record')"
                                  ><i class="fa fa-search"></i>
                                  </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">

                            </div>

                          </div>
                          <div class="row">

                            <div class="col-md-12 col-xs-12 ">
                              <div class="form-group">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="开始时间(必选)"
                                    onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                    @blur="startTime = $event.target.value"
                                    v-bind:value="startTime"
                                  >
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="结束时间(必选)"
                                    onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                    @blur="endTime = $event.target.value"
                                    v-bind:value="endTime"
                                  >
                                  <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getYesterday()"
                                  >&nbsp&nbsp&nbsp&nbsp昨天
                                  </a>
                                  <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getLastweek()"
                                  >&nbsp7天
                                  </a>
                                 <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getLastmonths()"
                                  >&nbsp1个月
                                  </a>
                              </div>

                            </div>

                          </div>
                        </form>

                      </div>
                      <div class="panel-footer panel-footer-table ">
                        <div class="col-xs-6 text-right">
                          <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                        </div>
                        <div class="col-xs-6 text-left">
                          <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                        </div>
                      </div>

                    </div>
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-12">
                            <h5 class="panel-title" v-text="reportFormsName">不良分布</h5>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover table-condensed">
                          <thead>
                            <tr>
                              <th style="width: 6%;">序号</th>
                              <th style="width: 13%;">不良代号</th>
                              <th style="width: 13%;">不良描述</th>
                              <th style="width: 13%;">不良次数</th>
                              <th style="width: 62%;">不良占比</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td v-text="index + 1" >
                              </td>
                              <td v-text="value.badness_code">
                              </td>
                              <td v-text="value.badness_detail">
                              </td>
                              <td v-text="value.badness_sum">
                              </td>
                              <td v-text="value.badness_rate +'%' ">
                              </td>
                            </tr>

                            <tr v-show="!tbodyData.length">
                              <td colspan=15 class="text-center text-warning">
                              没有可以显示的数据，请重新选择或输入查询条件
                              </td>
                            </tr>

                            <tr>
                              <th colspan="3">当页统计</th>
                              <td v-text="badnessSum"></td>
                              <td></td>

                            </tr>

                          </tbody>
                        </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                        <el-pagination
                          @current-change="handleCurrentChange"
                          background small
                          layout="total,prev,pager,next"
                          :current-page="currenPage"
                          :page-size="pagesize"
                          :total="lines"
                        >
                        </el-pagination>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss'))
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss'))
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#PQCgoodRateRF': {	//PQC优率报表
        ; (function () {
          const swiper = document.getElementById('PQCgoodRateRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#PQCgoodRateRFInerSwiper',
            data() {
              return {
                searchData: {
                  // headNum: 1, // 下标
                  type: 'info', // 搜索类型
                  reportId: '', // 模板id
                  reportName: '', // 模板名
                  semiFinishId: '', // 半成品
                  productBatch: '', // 生产批次
                  startDate: '', // 开始时间
                  endDate: '', // 结束时间
                },//搜索参数
                tbodyData: [],

                semi_finish_id: '',  //半成品id
                semi_finish_name: '',  //半成品名称
                productionBatch: '',  //生产批号
                startDate: '',  //开始时间
                endDate: '',  //结束时间

                reportFormsName: '',  //报表名称
                isDetail: false,

                reportSum: 0,  //检测报告数
                goodReportSum: 0,  //合格报告数
                goodReportRate: 0,  //报告合格率
                examineSum: 0, //检查数量
                unit: '', //单位
                goodExamineSum: 0,  //良品数
                goodExamineRate: 0,  //良品率

                currentPageExamineSum: 0, //当前页检查数量
                currentPageGoodExamineSum: 0,  //当前页良品数
                currentPageGoodExamineRate: 0,  //当前页良品率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'PQCgoodRateRF_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.semi_finish_name}${this.searchData.startDate}日 - ${this.searchData.endDate}日 PQC优率报表`
                // if(data.reportId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCReportRecordUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    this.reportSum = 0,  //检测报告数
                    this.goodReportSum = 0,  //合格报告数
                    this.goodReportRate = 0,  //报告合格率
                    this.examineSum = 0, //检查数量
                    this.goodExamineSum = 0,  //良品数
                    this.goodExamineRate = 0,  //良品率

                    this.currentPageExamineSum = 0  //检查数量
                    this.currentPageGoodExamineSum = 0  //良品数
                    this.currentPageGoodExamineRate = 0   //良品率

                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tempArry = result.map.pqcReport
                      this.lines = result.map.lines

                      this.reportSum = this.tempArry.length //检测报告数
                      this.tempArry.forEach((value, index) => {
                        if (value.quality_pqc_comprehensive_result === '0') {
                          this.goodReportSum += 1  //合格报告数
                        }
                        this.examineSum += parseInt(value.semi_finish_number)  //检查数量
                        this.goodExamineSum += parseInt(value.semi_finish_good_number) //良品数
                        //防止0/0出现NAN,分母不能为0
                        if (this.reportSum > 0) {
                          this.goodReportRate = Math.round((this.goodReportSum / this.reportSum) * 10000) / 100 //报告合格率
                        }
                        //防止0/0出现NAN,分母不能为0
                        if (this.examineSum > 0) {
                          this.goodExamineRate = Math.round((this.goodExamineSum / this.examineSum) * 10000) / 100  //良品率
                        }

                        this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                        this.computedCurrentPage(this.tbodyData)

                      })
                    }
                    else if (result.status === 2) {
                      swal({
                        title: '没有可显示的数据',
                        type: 'question',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        confirmButtonText: '确定',
                      })
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              // }
              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentPageExamineSum = 0  //检查数量
                this.currentPageGoodExamineSum = 0  //良品数
                this.currentPageGoodExamineRate = 0   //良品率

                arry.forEach((value, index) => {
                  this.currentPageExamineSum += parseInt(value.semi_finish_number)  //检查数量
                  this.currentPageGoodExamineSum += parseInt(value.semi_finish_good_number) //良品数
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentPageExamineSum > 0) {
                    this.currentPageGoodExamineRate = Math.round((this.currentPageGoodExamineSum / this.currentPageExamineSum) * 10000) / 100  //良品率
                  }
                })
              },
              // 重置搜索条件
              reset() {
                this.searchData.semiFinishId = ''
                this.semi_finish_name = ''
                this.searchData.productBatch = ''
                this.searchData.startDate = ''
                this.searchData.endDate = ''
                this.tbodyData = []
              },
              // 查询
              search() {
                if (this.searchData.semiFinishId === null || this.searchData.semiFinishId === '') {
                  this.$message.error(`半成品未选择`);
                  return;
                }
                if (this.searchData.startDate === null || this.searchData.startDate === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.searchData.endDate === null || this.searchData.endDate === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1

                // this.searchData.planName = this.searchDataInput
                this.queryFun(this.searchData)
              },

              // 选择半成品
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectSemiFinishModal(resolve)
                })
                promise.then((resolveData) => {

                  this.searchData.semiFinishId = resolveData.semi_finish_id
                  this.semi_finish_name = resolveData.semi_finish_name
                  this.unit = resolveData.semi_finish_unit
                })
              },
              // 选择生产批号
              selectProductionBatch() {
                let promise = new Promise((resolve, reject) => {
                  batchNumberModal(resolve)
                })
                promise.then((resolveData) => {
                  //  console.log(resolveData)
                  this.searchData.productBatch = resolveData.production_plan_batch_number

                })
              },
              // 获取昨天
              getYesterday() {
                this.searchData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.searchData.startDate = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.searchData.startDate = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                this.computedCurrentPage(this.tbodyData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="PQCgoodRateRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>半&nbsp&nbsp成&nbsp&nbsp品</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择半成品(必选)"
                                      v-model="semi_finish_name"
                                      @focus="selectProcess()"
                                    >
                                    <a
                                      title="选择半成品"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProcess()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " >
                                  <label class="control-label">生产批号</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="输入生产批号(可选)"
                                      v-model="searchData.productBatch"
                                    >
                                    <a
                                      title="选择生产批号"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProductionBatch()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="searchData.startDate = $event.target.value"
                                      v-bind:value="searchData.startDate"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="searchData.endDate = $event.target.value"
                                      v-bind:value="searchData.endDate"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>

                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-8">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-4 text-right">
                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">检测报告数</th>
                                <td style="width:10%" v-text="reportSum">
                                </td>
                                <th style="width:10%">合格报告数</th>
                                <td style="width:10%" v-text="goodReportSum">
                                </td>
                                <th style="width:10%">报告合格率</th>
                                <td style="width:10%" v-text="goodReportRate + '%' ">
                                </td>
                                <th style="width:10%"></th>
                                <td style="width:10%"></td>
                              </tr>
                              <tr>
                                <th>检查数量</th>
                                <td v-text="examineSum">
                                </td>
                                <th>单位</th>
                                <td v-text="unit">
                                </td>
                                <th>良品数</th>
                                <td v-text="goodExamineSum">
                                </td>
                                <th>良品率</th>
                                <td v-text="goodExamineRate + '%' ">
                                </td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                        <el-collapse-item name="PQCgoodRateRF_1">
                            <template slot="title">
                              <div class="panel-heading panel-heading-table">
                                <div class="row">
                                  <div class="col-xs-4">
                                    <h5 class="panel-title">报表明细</h5>
                                  </div>
                                  <div class="col-xs-8">

                                  </div>
                                </div>
                              </div>
                            </template>
                            <div class="panel-body-table table-height-10">
                              <table class="table  table-bordered table-hover">
                                <thead>
                                  <tr>
                                    <th style="width: 5%;">序号</th>
                                    <th style="width: 13%;">报告名称</th>
                                    <th style="width: 18%;">完成时间</th>
                                    <th style="width: 10%;">半成品</th>
                                    <th style="width: 13%;">生产批次</th>
                                    <th style="width: 8%;">判定</th>
                                    <th style="width: 8%;">检查数量</th>
                                    <th style="width: 8%;">良品数</th>
                                    <th style="width: 18%;">良品率</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                    <td v-text="index + 1" >
                                    </td>
                                    <td v-text="value.quality_pqc_report_name">
                                    </td>
                                    <td >
                                    {{value.quality_pqc_accomplish_date | times}}
                                    </td>
                                    <td v-text="value.semiFinishName">
                                    </td>
                                    <td v-text="value.quality_pqc_product_batch">
                                    </td>
                                    <td >
                                    {{value.quality_pqc_comprehensive_result === '0' ? '合格':'不合格'}}
                                    </td>
                                    <td v-text="value.semi_finish_number">
                                    </td>
                                    <td v-text="value.semi_finish_good_number">
                                    </td>
                                    <td v-text="value.semi_finish_good_rate + '%' ">
                                    </td>
                                  </tr>
                                  <tr>
                                    <th colspan="6">当页统计</th>
                                    <td v-text="currentPageExamineSum"></td>
                                    <td v-text="currentPageGoodExamineSum"></td>
                                    <td v-text="currentPageGoodExamineRate + '%' "></td>
                                  </tr>

                                  <tr v-show="!tbodyData.length">
                                    <td colspan=15 class="text-center text-warning">
                                    没有可以显示的数据，请重新选择或输入查询条件
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div class="panel-footer panel-footer-table text-right">
                              <el-pagination
                                @current-change="handleCurrentChange"
                                background small
                                layout="total,prev,pager,next"
                                :current-page="currenPage"
                                :page-size="pagesize"
                                :total="lines"
                              >
                              </el-pagination>
                            </div>
                          </el-collapse-item>
                      </div>
                    </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM.searchData, 'startDate', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM.searchData, 'endDate', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间


        }())
      }
        break;
      case '#PQCbadnessRF': {	//PQC不良内容统计及分布
        ; (function () {
          const swiper = document.getElementById('PQCbadnessRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#PQCbadnessRFInerSwiper',
            data() {
              return {
                searchData: {
                  // headNum: 1, // 下标
                  workstageId: '', // 工序id
                  semiFinishId:'',// 半成品id
                  productBatch: '', // 生产批次
                  startDate: '', // 开始时间
                  endDate: '', // 结束时间
                },//搜索参数
                tbodyData: [],

                semi_finish_id: '',  //半成品id
                semi_finish_name: '',  //半成品名称
                productionBatch: '',  //生产批号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                badnessSum: 0, //不良总次数

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.craftName}${this.startTime}日 - ${this.endTime}日 PQC不良内容统计及分布`
                console.log(data)
                // if(data.workstageId){
                $.ajax({

                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCUnqualifiedReportUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.tbodyData = []
                    this.badnessSum = 0

                    if (result.status == 0) {
                      // this.tbodyData = result.map.pqcPlan
                      // this.lines = result.map.lines

                      let groupArry = [];
                      let unqualifieds = result.map.unqualifieds

                      this.badnessSum = unqualifieds.length

                      unqualifieds.forEach((value, index) => {  //取出不良代号进行分组
                        groupArry.push(value.quality_unqualified_code)
                      })
                      groupArry = [...new Set(groupArry)]

                      groupArry.forEach((value, index) => {  //生成渲染页面数据
                        let tempObj = {
                          badness_code: value,  //不良代号
                          badness_detail: '',  //不良描述
                          badness_sum: 0,  //不良次数
                          badness_rate: 0,  //不良占比
                        }
                        unqualifieds.forEach((value2, index2) => {  //遍历后台数据
                          if (value === value2.quality_unqualified_code) {
                            tempObj.badness_sum += 1
                          }
                        })
                        tempObj.badness_rate = Math.round((tempObj.badness_sum / this.badnessSum) * 10000) / 100  //不良占比

                        this.tbodyData.push(tempObj)
                      })


                    }
                    else if (result.status === 2) {
                      swal({
                        title: '没有可显示的数据',
                        type: 'question',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        confirmButtonText: '确定',
                      })
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              // }
              },
              // 重置搜索条件
              reset() {
                this.searchData.semiFinishId = ''
                this.semi_finish_name = ''
                this.searchData.productBatch = ''
                this.searchData.startDate = ''
                this.searchData.endDate =''
                this.tbodyData = []
              },
              // 查询
              search() {
                if (this.searchData.semiFinishId === null || this.searchData.semiFinishId === '') {
                  this.$message.error(`半成品未选择`);
                  return;
                }
                if (this.searchData.startDate === null || this.searchData.startDate === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.searchData.endDate === null || this.searchData.endDate === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1

                // this.searchData.planName = this.searchDataInput
                this.queryFun(this.searchData)
              },

              // 选择半成品
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectSemiFinishModal(resolve)
                })
                promise.then((resolveData) => {
                  this.searchData.semiFinishId = resolveData.semi_finish_id
                  this.semi_finish_name = resolveData.semi_finish_name
                  this.unit = resolveData.semi_finish_unit
                })
              },
              // 选择生产批号
              selectProductionBatch() {
                let promise = new Promise((resolve, reject) => {
                  batchNumberModal(resolve)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  // this.productionBatch = resolveData.production_batch_production_number
                  this.searchData.productBatch=resolveData.production_plan_batch_number

                })
              },
              // 获取昨天
              getYesterday() {
                this.searchData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.searchData.startDate = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.searchData.startDate = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.searchData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="PQCbadnessRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-body-table ">

                        <form class="form-inline form-table">
                          <div class="row">

                            <div class="col-md-4 col-xs-6">
                              <div class="form-group ">
                                <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>半&nbsp&nbsp成&nbsp&nbsp品</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="选择半成品(必选)"
                                    v-model="semi_finish_name"
                                    @focus="selectProcess()"
                                  >
                                  <a
                                    title="选择半成品"
                                    href="javascript:;"
                                    class="input-btn"
                                    @click="selectProcess()"
                                  ><i class="fa fa-search"></i>
                                  </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group " >
                                <label class="control-label">生产批号</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="输入生产批号(可选)"
                                    v-model="searchData.productBatch"
                                  >
                                  <a
                                    title="选择生产批号"
                                    href="javascript:;"
                                    class="input-btn"
                                    @click="selectProductionBatch()"
                                  ><i class="fa fa-search"></i>
                                  </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">

                            </div>

                          </div>
                          <div class="row">

                            <div class="col-md-12 col-xs-12 ">
                              <div class="form-group">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="开始时间(必选)"
                                    onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                    @blur="searchData.startDate = $event.target.value"
                                    v-bind:value="searchData.startDate"
                                  >
                                  <input
                                    type="text"
                                    class="form-control"
                                    placeholder="结束时间(必选)"
                                    onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                    @blur="searchData.endDate = $event.target.value"
                                    v-bind:value="searchData.endDate"
                                  >
                                  <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getYesterday()"
                                  >&nbsp&nbsp&nbsp&nbsp昨天
                                  </a>
                                  <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getLastweek()"
                                  >&nbsp7天
                                  </a>
                                 <a
                                    href="javascript:;"
                                    class="table-link"
                                    style="font-size:14px;"
                                    @click="getLastmonths()"
                                  >&nbsp1个月
                                  </a>
                              </div>

                            </div>

                          </div>
                        </form>

                      </div>
                      <div class="panel-footer panel-footer-table ">
                        <div class="col-xs-6 text-right">
                          <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                        </div>
                        <div class="col-xs-6 text-left">
                          <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                        </div>
                      </div>

                    </div>

                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <h5 class="panel-title">不良分布</h5>
                          </div>
                          <div class="col-xs-8">

                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 6%;">序号</th>
                              <th style="width: 13%;">不良代号</th>
                              <th style="width: 13%;">不良描述</th>
                              <th style="width: 13%;">不良次数</th>
                              <th style="width: 56%;">不良占比</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td v-text="index + 1" >
                              </td>
                              <td v-text="value.badness_code">
                              </td>
                              <td v-text="value.badness_detail">
                              </td>
                              <td v-text="value.badness_sum">
                              </td>
                              <td v-text="value.badness_rate +'%' ">
                              </td>
                            </tr>

                            <tr v-show="!tbodyData.length">
                              <td colspan=15 class="text-center text-warning">
                              没有可以显示的数据，请重新选择或输入查询条件
                              </td>
                            </tr>

                            <tr>
                              <th colspan="3">当页统计</th>
                              <td v-text="badnessSum"></td>
                              <td ></td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                        <el-pagination
                          @current-change="handleCurrentChange"
                          background small
                          layout="total,prev,pager,next"
                          :current-page="currenPage"
                          :page-size="pagesize"
                          :total="lines"
                        >
                        </el-pagination>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM.searchData, 'startDate', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM.searchData, 'endDate', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间



        }())
      }
        break;
      case '#FQCgondAndBadnessRF': {	//FQC报表
        ; (function () {
          const swiper = document.getElementById('FQCgondAndBadnessRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#FQCgondAndBadnessRFInerSwiper',
            data() {
              return {
                searchData: {
                  // headNum: 1, //非必传，分页执行搜索的下标
                  productModel: '', //必传，电池型号
                  ProductBatch: '', //选择传送，电池批号
                  startDate: '', //必传，开始日期（完成时间）
                  endDate: '', //必传，结束日期（完成时间）
                },//搜索参数
                tbodyData: [],

                batteryId: '',  //电池id
                batteryName: '',  //电池名称
                batteryModel: '',  //电池型号
                productionBatch: '',  //电池批号
                startTime:'',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                isDetail: false,

                reportSum: 0,  //检测报告数
                goodReportSum: 0,  //合格报告数
                goodReportRate: 0,  //报告合格率
                examineSum: 0, //检查数量
                unit: '', //单位
                goodExamineSum: 0,  //良品数
                goodExamineRate: 0,  //良品率

                currentPageExamineSum: 0, //当前页检查数量
                currentPageGoodExamineSum: 0,  //当前页良品数
                currentPageGoodExamineRate: 0,  //当前页良品率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'FQCgondAndBadnessRF_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime}日 - ${this.endTime}日 PQC优率报表`

                // if (data.productModel) {
                  console.log(data)
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryFQCReportFormsUrl,
                    data: data,
                    beforeSend: (xml) => {
                      mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      mesloadBox.hide()
                      this.reportSum = 0,  //检测报告数
                      this.goodReportSum = 0,  //合格报告数
                      this.goodReportRate = 0,  //报告合格率
                      this.examineSum = 0, //检查数量
                      this.unit = '', //单位
                      this.goodExamineSum = 0,  //良品数
                      this.goodExamineRate = 0,  //良品率

                      this.currentPageExamineSum = 0  //检查数量
                      this.currentPageGoodExamineSum = 0  //良品数
                      this.currentPageGoodExamineRate = 0   //良品率

                      if (result.status == 0) {
                        this.tempArry = result.map.fqcReports
                        this.lines = result.map.line

                        this.reportSum = this.tempArry.length //检测报告数
                        this.tempArry.forEach((value, index) => {
                          if (value.quality_fqc_comprehensive_result === '0') {
                            this.goodReportSum += 1  //合格报告数
                          }
                          this.examineSum += parseInt(value.warehouse_product_inspection_number)  //检查数量
                          this.goodExamineSum += parseInt(value.goodNum) //良品数
                          // this.goodExamineSum += parseInt(1) //良品数

                          //防止0/0出现NAN,分母不能为0
                          if (this.reportSum > 0) {
                            this.goodReportRate = Math.round((this.goodReportSum / this.reportSum) * 10000) / 100 //报告合格率
                          }
                          //防止0/0出现NAN,分母不能为0
                          if (this.examineSum > 0) {
                            this.goodExamineRate = Math.round((this.goodExamineSum / this.examineSum) * 10000) / 100  //良品率
                          }

                          this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                          this.computedCurrentPage(this.tbodyData)

                        })
                      }
                      else if (result.status === 2) {
                        swallFail2(result.msg);
                      }
                      else {
                        this.tbodyData = []
                        this.lines = 0
                      }

                    },

                  })
                // }

              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentPageExamineSum = 0  //检查数量
                this.currentPageGoodExamineSum = 0  //良品数
                this.currentPageGoodExamineRate = 0   //良品率

                arry.forEach((value, index) => {
                  this.currentPageExamineSum += parseInt(value.warehouse_product_inspection_number)  //检查数量
                  this.currentPageGoodExamineSum += parseInt(value.goodNum) //良品数
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentPageExamineSum > 0) {
                    this.currentPageGoodExamineRate = Math.round((this.currentPageGoodExamineSum / this.currentPageExamineSum) * 10000) / 100  //良品率
                  }

                })
              },
              // 重置搜索条件查询条件
              reset() {
                this.batteryId = ''
                this.batteryName = ''
                this.batteryModel = ''
                this.productionBatch = ''
                this.startTime = ''
                this.endTime = ''
                this.tbodyData = []
              },
              // 查询
              search() {

                if (this.batteryId === null || this.batteryId === '') {
                  this.$message.error(`电池型号不能为空`);
                  return;
                }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1

                this.searchData.productModel = this.batteryModel
                this.searchData.ProductBatch = this.productionBatch
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime
                this.queryFun(this.searchData)
              },

              // 选择电池型号
              selectBattery() {
                let promise = new Promise((resolve, reject) => {
                  selectBatterylModal(resolve)
                })
                promise.then((resolveData) => {
                  this.batteryId = resolveData.warehouse_product_id
                  this.batteryName = resolveData.warehouse_product_name
                  this.batteryModel = resolveData.warehouse_product_size
                })
              },
              // 选择生产批号
              selectProductionBatch() {
                let promise = new Promise((resolve, reject) => {
                  batchNumberModal(resolve)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  // this.productionBatch = resolveData.production_batch_production_numberproduction_plan_batch_number
                   this.productionBatch = resolveData.production_plan_batch_number


                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                this.computedCurrentPage(this.tbodyData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="FQCgondAndBadnessRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>电池型号</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择电池型号(必选)"
                                      v-model="batteryModel"
                                      @focus="selectBattery()"
                                    >
                                    <a
                                      title="选择电池型号"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectBattery()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " >
                                  <label class="control-label">生产批号</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="输入生产批号(可选)"
                                      v-model="productionBatch"
                                    >
                                    <a
                                      title="选择生产批号"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProductionBatch()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>

                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-10">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-2 text-right">

                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">检测报告数</th>
                                <td style="width:10%" v-text="reportSum">
                                </td>
                                <th style="width:10%">合格报告数</th>
                                <td style="width:10%" v-text="goodReportSum">
                                </td>
                                <th style="width:10%">报告合格率</th>
                                <td style="width:10%" v-text="goodReportRate + '%' ">
                                </td>

                              </tr>
                              <tr>
                                <th>检查数量</th>
                                <td v-text="examineSum">
                                </td>

                                </td>
                                <th>良品数</th>
                                <td v-text="goodExamineSum">
                                </td>
                                <th>良品率</th>
                                <td v-text="goodExamineRate + '%' ">
                                </td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                          <el-collapse-item name="FQCgondAndBadnessRF_1">
                              <template slot="title">
                                <div class="panel-heading panel-heading-table">
                                  <div class="row">
                                    <div class="col-xs-4">
                                      <h5 class="panel-title">报表明细</h5>
                                    </div>
                                    <div class="col-xs-8">

                                    </div>
                                  </div>
                                </div>
                              </template>

                          <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 5%;">序号</th>
                                  <th style="width: 15%;">报告编号</th>
                                  <th style="width: 18%;">时间</th>
                                  <th style="width: 14%;">生产批次</th>
                                  <th style="width: 12%;">判定</th>
                                  <th style="width: 12%;">检查数量</th>
                                  <th style="width: 12%;">良品数</th>
                                  <th style="width: 12%;">良品率</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td v-text="value.quality_fqc_report_number">
                                  </td>
                                  <td>
                                  {{value.quality_fqc_finish_date | times}}
                                  </td>
                                  <td v-text="value.warehouse_product_batch">
                                  </td>
                                  <td>
                                  {{value.quality_fqc_comprehensive_result === '0' ? '合格':'不合格'}}
                                  </td>
                                  <td v-text="value.warehouse_product_inspection_number">
                                  </td>
                                  <td v-text="value.goodNum">
                                  </td>
                                  <td v-text="value.goodYield">
                                  </td>
                                </tr>
                                <tr>
                                  <th colspan="5">当页统计</th>
                                  <td v-text="currentPageExamineSum"></td>
                                  <td v-text="currentPageGoodExamineSum"></td>
                                  <td v-text="currentPageGoodExamineRate + '%' "></td>
                                </tr>

                                <tr v-show="!tbodyData.length">
                                  <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="panel-footer panel-footer-table text-right">
                            <el-pagination
                              @current-change="handleCurrentChange"
                              background small
                              layout="total,prev,pager,next"
                              :current-page="currenPage"
                              :page-size="pagesize"
                              :total="lines"
                            >
                            </el-pagination>
                          </div>
                        </el-collapse-item>
                      </div>
                    </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;
      case '#processGoodAndBadnessRF': {	//工序优率及不良率
        ; (function () {
          const swiper = document.getElementById('processGoodAndBadnessRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#processGoodAndBadnessRFInerSwiper',
            data() {
              return {
                searchData: {
                  headNum: 1,
                  type: 'day', //必传，需要执行的操作类型
                  workstageId: '', //非必传，工序id
                  startDate: '',
                  endDate: '',
                },//搜索参数
                tbodyData: [],

                reportType: 'd',  //报表类型
                craftId: '',  //工序id
                craftName: '',  //工序名称
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                td2Title: '时间',  //单元格表头
                isDetail:false,

                outputSum: 0,  //总产出量
                goodOutputSum: 0,  //	总良品数
                goodOutputRate: 0,  //总优率
                badOutputSum: 0,  //总不良数
                badOutputRate: 0,  //总不良率

                currentOutputSum: 0, //当前页产出量
                currentGoodOutputSum: 0,  //当前页良品数
                currentGoodOutputRate: 0,  //当前页良品率
                currentBadOutputSum: 0,  //当前页不良数
                currentBadOutputRate: 0,  //当前页不良率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'processGoodAndBadnessRF_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime}日 - ${this.endTime}日 工序优率及不良率报表`
                //清空统计数据
                this.outputSum = 0
                this.goodOutputSum = 0
                this.goodOutputRate = 0
                this.badOutputSum = 0
                this.badOutputRate = 0
                //清空当前页数据
                this.currentOutputSum = 0  //当前页检查数量
                this.currentGoodOutputSum = 0  //当前页良品数
                this.currentGoodOutputRate = 0   //当前页良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                this.tempArry = []
               if(data.workstageId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkstageAscendUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      // console.dir(result.map.workstageAscends)
                      this.tempArry = result.map.workOrderAscends
                      // this.lines = this.tempArry.length

                      this.tempArry.forEach((value, index) => {
                        this.outputSum += parseInt(value.product_element_num)  //总产出量
                        this.goodOutputSum += parseInt(value.good_products_num) //总良品数
                        this.badOutputSum += parseInt(value.rejects_batch_quantity) //总不良数
                      })
                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.goodOutputRate = Math.round((this.goodOutputSum / this.outputSum) * 10000) / 100 //总优率
                      }
                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.badOutputRate = Math.round((this.badOutputSum / this.outputSum) * 10000) / 100  //总不良率
                      }

                      this.lines = this.tempArry.length //总条数
                      this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                      this.computedCurrentPage(this.tbodyData)
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              }
              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentOutputSum = 0  //检查数量
                this.currentGoodOutputSum = 0  //良品数
                this.currentGoodOutputRate = 0   //良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                arry.forEach((value, index) => {
                  this.currentOutputSum += parseInt(value.product_element_num)  //当前页产出量
                  this.currentGoodOutputSum += parseInt(value.good_products_num) //当前页良品数
                  this.currentBadOutputSum += parseInt(value.rejects_batch_quantity) //当前页不良数
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentGoodOutputRate = Math.round((this.currentGoodOutputSum / this.currentOutputSum) * 10000) / 100  //当前页良品率
                  }
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentBadOutputRate = Math.round((this.currentBadOutputSum / this.currentOutputSum) * 10000) / 100  //当前页不良率
                  }
                })
              },
              // 重置搜索条件
              reset() {
                this.reportType = 'd'
                this.craftId = ''
                this.startTime =''
                this.endTime =''
                this.tbodyData = []
              } ,
              // 查询
              search() {
                if (this.reportType !== 'all') {  //当不上工序报表的时候工序必选
                  if (this.craftId === null || this.craftId === '') {
                    this.$message.error(`工序未选择`);
                    return;
                  }
                }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1

                if (this.reportType === 'all') {
                  this.searchData.type = 'workstage'
                  this.td2Title = '工序'
                  this.craftId = '' //重置工艺
                } else {
                  this.td2Title = '时间'
                }
                if (this.reportType === 'd') {
                  this.searchData.type = 'day'
                }
                if (this.reportType === 'w') {
                  this.searchData.type = 'week'
                }
                if (this.reportType === 'm') {
                  this.searchData.type = 'month'
                }

                this.searchData.workstageId = this.craftId
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime
                this.queryFun(this.searchData)

              },

              // 获取报表类型
              getReportType() {

                this.startTime = '' //重置开始时间
                this.endTime = '' //重置结束时间
              },
              // 选择工序
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectProcessModal(resolve)
                })
                promise.then((resolveData) => {
                  this.craftName = resolveData.workstage_name
                  this.craftId = resolveData.workstage_basics_id
                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                this.computedCurrentPage(this.tbodyData)

                // this.queryFun(this.searchData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="processGoodAndBadnessRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择报表类型</label>
                                  <select
                                    class="form-control"
                                    v-model.trim="reportType"
                                    v-bind:value="reportType"
                                    @change="getReportType()"
                                  >
                                    <option value="all">工序报表</option>
                                    <option value="d">日报表</option>
                                    <option value="w">周报表</option>
                                    <option value="m">月报表</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " v-show="reportType !== 'all'">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择工序</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择工序(必选)"
                                      v-model="craftName"
                                      @focus="selectProcess()"
                                    >
                                    <a
                                      title="选择工序"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProcess()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group" v-show="reportType === 'd' || reportType === 'all'">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>
                                <div class="form-group" v-show="reportType === 'w' ">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-{%M-1}'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-{%M-1}'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                </div>
                                <div class="form-group" v-show="reportType === 'm' ">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-{%M-1}'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM',maxDate:'%y-{%M-1}'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                </div>
                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-8">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-4 text-right">

                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">总产出量</th>
                                <td style="width:10%" v-text="outputSum">
                                </td>
                                <th style="width:10%">总良品数</th>
                                <td style="width:10%" v-text="goodOutputSum">
                                </td>
                                <th style="width:10%">总优率</th>
                                <td style="width:10%" v-text="goodOutputRate + '%' ">
                                </td>
                              </tr>
                              <tr>
                                <th>总不良数</th>
                                <td v-text="badOutputSum"></td>
                                <th>总不良率</th>
                                <td v-text="badOutputRate + '%' "></td>
                                <th></th>
                                <td></td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                            <el-collapse-item name="processGoodAndBadnessRF_1">
                                <template slot="title">
                                  <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                      <div class="col-xs-4">
                                        <h5 class="panel-title">报表明细</h5>
                                      </div>
                                      <div class="col-xs-8">

                                      </div>
                                    </div>
                                  </div>
                                </template>

                          <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover table-condensed">
                              <thead>
                                <tr>
                                  <th style="width: 6%;">序号</th>
                                  <th style="width: 15%;" v-text="td2Title">时间</th>
                                  <th style="width: 15%;">产出量</th>
                                  <th style="width: 15%;">良品数</th>
                                  <th style="width: 15%;">优率</th>
                                  <th style="width: 15%;">不良数</th>
                                  <th style="width: 19%;">不良率</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td v-text="value.workstage_name" v-if="td2Title==='工序' ">
                                  </td>
                                  <td v-if="td2Title==='时间' ">
                                  {{value.work_order_time | times}}
                                  </td>
                                  <td v-text="value.product_element_num">
                                  </td>
                                  <td v-text="value.good_products_num">
                                  </td>
                                  <td v-text="value.good_products_rate">
                                  </td>
                                  <td v-text="value.rejects_batch_quantity">
                                  </td>
                                  <td v-text="value.adverse_rate">
                                  </td>
                                </tr>
                                <tr>

                                </tr>
                                <tr v-show="!tbodyData.length">
                                  <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                                  </td>
                                </tr>

                                <tr>
                                  <th colspan="2">当页统计</th>
                                  <td v-text="currentOutputSum"></td>
                                  <td v-text="currentGoodOutputSum"></td>
                                  <td v-text="currentGoodOutputRate + '%' "></td>
                                  <td v-text="currentBadOutputSum"></td>
                                  <td v-text="currentBadOutputRate + '%' "></td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                          <div class="panel-footer panel-footer-table text-right">
                            <el-pagination
                              @current-change="handleCurrentChange"
                              background small
                              layout="total,prev,pager,next"
                              :current-page="currenPage"
                              :page-size="pagesize"
                              :total="lines"
                            >
                            </el-pagination>
                          </div>
                          </el-collapse-item>
                      </div>
                    </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#processBadProduct': {	//综合坏品及坏品分布
        ; (function () {
          const swiper = document.getElementById('processBadProduct')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#processBadProductInerSwiper',
            data() {
              return {
                searchData: {
                  headNum: 1,
                  type: 'day', //必传，需要执行的操作类型
                  workstageId: '', //非必传，工序id
                  startDate: '',
                  endDate: '',
                },//搜索参数
                tbodyData: [],

                reportType: 'd',  //报表类型
                craftId: '',  //工序id
                craftName: '',  //工序名称
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                td2Title: '时间',  //单元格表头
                isDetail: false,

                outputSum: 0,  //总产出量
                goodOutputSum: 0,  //	总良品数
                goodOutputRate: 0,  //总优率
                badOutputSum: 0,  //总不良数
                badOutputRate: 0,  //总不良率

                currentOutputSum: 0, //当前页产出量
                currentGoodOutputSum: 0,  //当前页良品数
                currentGoodOutputRate: 0,  //当前页良品率
                currentBadOutputSum: 0,  //当前页不良数
                currentBadOutputRate: 0,  //当前页不良率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'processBadProduct_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime}日 - ${this.endTime}日 工序优率及不良率报表`
                //清空统计数据
                this.outputSum = 0
                this.goodOutputSum = 0
                this.goodOutputRate = 0
                this.badOutputSum = 0
                this.badOutputRate = 0
                //清空当前页数据
                this.currentOutputSum = 0  //当前页检查数量
                this.currentGoodOutputSum = 0  //当前页良品数
                this.currentGoodOutputRate = 0   //当前页良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率


                this.tempArry = []
                if(data.workstageId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkstageAscendUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      // console.dir(result.map.workstageAscends)
                      this.tempArry = result.map.workOrderAscends
                      // this.lines = this.tempArry.length

                      this.tempArry.forEach((value, index) => {
                        this.outputSum += parseInt(value.product_element_num)  //总产出量
                        this.goodOutputSum += parseInt(value.good_products_num) //总良品数
                        this.badOutputSum += parseInt(value.scrap_num) //总不良数
                      })

                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.goodOutputRate = Math.round((this.goodOutputSum / this.outputSum) * 10000) / 100 //总优率
                      }
                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.badOutputRate = Math.round((this.badOutputSum / this.outputSum) * 10000) / 100  //总不良率
                      }

                      this.lines = this.tempArry.length //总条数
                      this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                      this.computedCurrentPage(this.tbodyData)
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              }
              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentOutputSum = 0  //检查数量
                this.currentGoodOutputSum = 0  //良品数
                this.currentGoodOutputRate = 0   //良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                arry.forEach((value, index) => {
                  this.currentOutputSum += parseInt(value.product_element_num)  //当前页产出量
                  this.currentGoodOutputSum += parseInt(value.good_products_num) //当前页良品数
                  this.currentBadOutputSum += parseInt(value.scrap_num) //当前页不良数
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentGoodOutputRate = Math.round((this.currentGoodOutputSum / this.currentOutputSum) * 10000) / 100  //当前页良品率
                  }
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentBadOutputRate = Math.round((this.currentBadOutputSum / this.currentOutputSum) * 10000) / 100  //当前页不良率
                  }
                })
              },
              // 重置搜索条件
              reset() {
                this.reportType = 'd'
                this.craftId = ''
                this.startTime =''
                this.endTime =''
                this.tbodyData = []
              },
              // 查询
              search() {


                if (this.reportType === 'all') {
                  this.searchData.type = 'workstage'
                  this.td2Title = '工序'
                  this.craftId = '' //重置工艺
                } else {
                  this.td2Title = '时间'
                }
                if (this.reportType === 'd') {
                  this.searchData.type = 'day'
                }
                if (this.reportType === 'w') {
                  this.searchData.type = 'week'
                }
                if (this.reportType === 'm') {
                  this.searchData.type = 'month'
                }

                if (this.reportType !== 'all') {  //当不上工序报表的时候工序必选
                  if (this.craftId === null || this.craftId === '') {
                    this.$message.error(`工序未选择`);
                    return;
                  }
                }

                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1
                this.searchData.workstageId = this.craftId
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime
                this.queryFun(this.searchData)
              },

              // 获取报表类型
              getReportType() {

                this.startTime = '' //重置开始时间
                this.endTime = '' //重置结束时间
              },
              // 选择工序
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectProcessModal(resolve)
                })
                promise.then((resolveData) => {
                  this.craftName = resolveData.workstage_name
                  this.craftId = resolveData.workstage_basics_id
                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                this.computedCurrentPage(this.tbodyData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="processBadProductInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>报表类型</label>
                                  <select
                                    class="form-control"
                                    v-model.trim="reportType"
                                    v-bind:value="reportType"
                                    @change="getReportType()"
                                  >
                                    <option value="all">工序报表</option>
                                    <option value="d">日报表</option>
                                    <option value="w">周报表</option>
                                    <option value="m">月报表</option>
                                  </select>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " v-show="reportType !== 'all'">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择工序</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择工序(必选)"
                                      v-model="craftName"
                                      @focus="selectProcess()"
                                    >
                                    <a
                                      title="选择工序"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProcess()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group" v-show="reportType === 'd' || reportType === 'all'">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>
                                <div class="form-group" v-show="reportType === 'w' ">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                </div>
                                <div class="form-group" v-show="reportType === 'm' ">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束月份(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                </div>
                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-8">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-4 text-right">

                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">总产出量</th>
                                <td style="width:10%" v-text="outputSum">
                                </td>
                                <th style="width:10%">总良品数</th>
                                <td style="width:10%" v-text="goodOutputSum">
                                </td>
                                <th style="width:10%">总优率</th>
                                <td style="width:10%" v-text="goodOutputRate + '%' ">
                                </td>
                              </tr>
                              <tr>
                                <th>总不良数</th>
                                <td v-text="badOutputSum"></td>
                                <th>总不良率</th>
                                <td v-text="badOutputRate + '%' "></td>
                                <th></th>
                                <td></td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                          <el-collapse-item name="processBadProduct_1">
                              <template slot="title">
                                <div class="panel-heading panel-heading-table">
                                  <div class="row">
                                    <div class="col-xs-4">
                                      <h5 class="panel-title">报表明细</h5>
                                    </div>
                                    <div class="col-xs-8">

                                    </div>
                                  </div>
                                </div>
                              </template>

                          <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover table-condensed">
                              <thead>
                                <tr>
                                  <th style="width: 6%;">序号</th>
                                  <th style="width: 15%;" v-text="td2Title">时间</th>
                                  <th style="width: 15%;">产出量</th>
                                  <th style="width: 15%;">坏品数</th>
                                  <th style="width: 15%;">坏品率</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td v-text="value.workstage_name" v-if="td2Title==='工序' ">
                                  </td>
                                  <td v-if="td2Title==='时间' ">
                                  {{value.work_order_time | times}}
                                  </td>
                                  <td v-text="value.product_element_num">
                                  </td>

                                  <td v-text="value.scrap_num">
                                  </td>
                                  <td v-text="value.scrap_rate">
                                  </td>
                                </tr>
                                <tr>

                                </tr>
                                <tr v-show="!tbodyData.length">
                                  <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="panel-footer panel-footer-table text-right">
                            <el-pagination
                              @current-change="handleCurrentChange"
                              background small
                              layout="total,prev,pager,next"
                              :current-page="currenPage"
                              :page-size="pagesize"
                              :total="lines"
                            >
                            </el-pagination>
                          </div>
                         </el-collapse-item>
                      </div>
                   </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#workOrderGoodAndBadnessRF': {	//工单优率及不良率
        ; (function () {
          const swiper = document.getElementById('workOrderGoodAndBadnessRF')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#workOrderGoodAndBadnessRFInerSwiper',
            data() {
              return {
                searchData: {
                  headNum: 1,
                  workstageId: '',
                  productionBatch: '',
                  startDate: '',
                  endDate: '',
                },//搜索参数
                tbodyData: [],

                craftId: '',  //工序id
                craftName: '',  //工序名称
                productionBatch: '',  //生产批号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                isDetail: false,

                workOrderSum: 0,  //工单总数
                outputSum: 0,  //总产出量
                goodOutputSum: 0,  //	总良品数
                goodOutputRate: 0,  //总优率
                badOutputSum: 0,  //总不良数
                badOutputRate: 0,  //总不良率

                currentOutputSum: 0, //当前页产出量
                currentGoodOutputSum: 0,  //当前页良品数
                currentGoodOutputRate: 0,  //当前页良品率
                currentBadOutputSum: 0,  //当前页不良数
                currentBadOutputRate: 0,  //当前页不良率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'workOrderGoodAndBadnessRF_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime}日 - ${this.endTime}日 工单优率及不良率`
                // 清空统计数据
                this.workOrderSum = 0
                this.outputSum = 0
                this.goodOutputSum = 0
                this.goodOutputRate = 0
                this.badOutputSum = 0
                this.badOutputRate = 0
                //清空当前页数据
                this.currentOutputSum = 0  //当前页检查数量
                this.currentGoodOutputSum = 0  //当前页良品数
                this.currentGoodOutputRate = 0   //当前页良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                this.tempArry = []
                if(data.workstageId){
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkOrderAscendUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tempArry = result.map.workOrderAscends

                      this.tempArry.forEach((value, index) => {
                        this.outputSum += parseInt(value.product_element_num)  //总产出量
                        this.goodOutputSum += parseInt(value.good_products_num) //总良品数
                        this.badOutputSum += parseInt(value.rejects_batch_quantity) //总不良数
                      })
                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.goodOutputRate = Math.round((this.goodOutputSum / this.outputSum) * 10000) / 100 //总优率
                      }
                      //防止0/0出现NAN,分母不能为0
                      if (this.outputSum > 0) {
                        this.badOutputRate = Math.round((this.badOutputSum / this.outputSum) * 10000) / 100  //总不良率
                      }

                      this.lines = this.tempArry.length //总条数
                      this.workOrderSum = this.tempArry.length  //工单总数
                      this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                      this.computedCurrentPage(this.tbodyData)
                    }
                    else if (result.status === 2) {
                      swallFail2(result.msg);
                     }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }
                  },
                })

              }
              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentOutputSum = 0  //检查数量
                this.currentGoodOutputSum = 0  //良品数
                this.currentGoodOutputRate = 0   //良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                arry.forEach((value, index) => {
                  this.currentOutputSum += parseInt(value.product_element_num)  //当前页产出量
                  this.currentGoodOutputSum += parseInt(value.good_products_num) //当前页良品数
                  this.currentBadOutputSum += parseInt(value.rejects_batch_quantity) //当前页不良数

                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentGoodOutputRate = Math.round((this.currentGoodOutputSum / this.currentOutputSum) * 10000) / 100  //当前页良品率
                  }
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentBadOutputRate = Math.round((this.currentBadOutputSum / this.currentOutputSum) * 10000) / 100  //当前页不良率
                  }
                })
              },
              // 重置搜索条件
              reset() {
                this.craftId = '' //重置工艺
                this.craftName = '' //重置工艺
                this.productionBatch = '' //重置生产批次
                this.startTime = '' //重置开始时间
                this.endTime = '' //重置结束时间
                this.tbodyData = []//重置表格
              },
              // 查询
              search() {
                  if (this.craftId === null || this.craftId === '') {
                    this.$message.error(`工艺未选择`);
                    return;
                  }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1
                // this.searchData.workstageId = this.craftId
                this.searchData.workstageId = '283b7b8fd83040d789b0dec1b88d79e5'  //测试用

                this.searchData.productionBatch = this.productionBatch
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime
                console.log(this.searchData.workstageId)
                this.queryFun(this.searchData)
              },

              // 选择工序
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectProcessModal(resolve)
                })
                promise.then((resolveData) => {
                  this.craftName = resolveData.workstage_name
                  this.craftId = resolveData.workstage_basics_id

                })
              },
              // 选择生产批号
              selectProductionBatch() {
                let promise = new Promise((resolve, reject) => {
                  batchNumberModal(resolve)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  // this.productionBatch = resolveData.production_batch_production_number
                  this.productionBatch = resolveData.production_plan_batch_number

                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                // let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="workOrderGoodAndBadnessRFInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择工序</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择工序(必选)"
                                      v-model="craftName"
                                      @focus="selectProcess()"
                                    >
                                    <a
                                      title="选择工序"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProcess()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " >
                                  <label class="control-label">生产批号</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="输入生产批号(可选)"
                                      v-model="productionBatch"
                                    >
                                    <a
                                      title="选择生产批号"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProductionBatch()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>

                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-8">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-4 text-right">

                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">总产出量</th>
                                <td style="width:10%" v-text="outputSum">
                                </td>
                                <th style="width:10%">总良品数</th>
                                <td style="width:10%" v-text="goodOutputSum">
                                </td>
                                <th style="width:10%">总优率</th>
                                <td style="width:10%" v-text="goodOutputRate + '%' ">
                                </td>
                              </tr>
                              <tr>
                                <th>工单总数</th>
                                <td v-text="workOrderSum">
                                </td>
                                <th>总不良数</th>
                                <td v-text="badOutputSum"></td>
                                <th>总不良率</th>
                                <td v-text="badOutputRate + '%' "></td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                          <el-collapse-item name="workOrderGoodAndBadnessRF_1">
                              <template slot="title">
                                <div class="panel-heading panel-heading-table">
                                  <div class="row">
                                    <div class="col-xs-4">
                                      <h5 class="panel-title">报表明细</h5>
                                    </div>
                                    <div class="col-xs-8">

                                    </div>
                                  </div>
                                </div>
                              </template>

                          <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover table-condensed">
                              <thead>
                                <tr>
                                  <th style="width: 5%;">序号</th>
                                  <th style="width: 18%;">时间</th>
                                  <th style="width: 11%;">工单编号</th>
                                  <th style="width: 11%;">计划批次</th>
                                  <th style="width: 11%;">产出量</th>
                                  <th style="width: 11%;">良品数</th>
                                  <th style="width: 11%;">良品率</th>
                                  <th style="width: 11%;">不良数</th>
                                  <th style="width: 12%;">不良率</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td>
                                  {{value.work_order_time | times}}
                                  </td>
                                  <td v-text="value.work_order_number">
                                  </td>
                                  <td v-text="value.production_plan_batch_number">
                                  </td>
                                  <td v-text="value.product_element_num">
                                  </td>
                                  <td v-text="value.good_products_num">
                                  </td>
                                  <td v-text="value.good_products_rate">
                                  </td>
                                  <td v-text="value.rejects_batch_quantity">
                                  </td>
                                  <td v-text="value.adverse_rate">
                                  </td>
                                </tr>
                                <tr>
                                  <th colspan="4">当页统计</th>
                                  <td v-text="currentOutputSum"></td>
                                  <td v-text="currentGoodOutputSum"></td>
                                  <td v-text="currentGoodOutputRate + '%' "></td>
                                  <td v-text="currentBadOutputSum"></td>
                                  <td v-text="currentBadOutputRate + '%' "></td>
                                </tr>

                                <tr v-show="!tbodyData.length">
                                  <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="panel-footer panel-footer-table text-right">
                            <el-pagination
                              @current-change="handleCurrentChange"
                              background small
                              layout="total,prev,pager,next"
                              :current-page="currenPage"
                              :page-size="pagesize"
                              :total="lines"
                            >
                            </el-pagination>
                          </div>
                          </el-collapse-item>
                      </div>
                   </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)


        }())
      }
        break;
      case '#workOrdersBadProduct': {	//工单坏品及坏品分布
        ; (function () {
          const swiper = document.getElementById('workOrdersBadProduct')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#workOrdersBadProductInerSwiper',
            data() {
              return {
                searchData: {
                  headNum: 1,
                  workstageId: '',
                  productionBatch: '',
                  startDate: '',
                  endDate: '',
                },//搜索参数
                tbodyData: [],

                craftId: '',  //工序id
                craftName: '',  //工序名称
                productionBatch: '',  //生产批号
                startTime: '',  //开始时间
                endTime: '',  //结束时间

                reportFormsName: '',  //报表名称
                isDetail: false,

                workOrderSum: 0,  //工单总数
                outputSum: 0,  //总产出量
                goodOutputSum: 0,  //	总良品数
                goodOutputRate: 0,  //总优率
                badOutputSum: 0,  //总不良数
                badOutputRate: 0,  //总不良率

                currentOutputSum: 0, //当前页产出量
                currentGoodOutputSum: 0,  //当前页良品数
                currentGoodOutputRate: 0,  //当前页良品率
                currentBadOutputSum: 0,  //当前页不良数
                currentBadOutputRate: 0,  //当前页不良率

                activeNames: [  //element-UI折叠面板默认打开项配置
                  'workOrdersBadProduct_1',
                ],

                tempArry: [],  //总数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
            },
            methods: {
              //加载数据
              queryFun(data) {
                this.reportFormsName = `${this.startTime}日 - ${this.endTime}日 工单优率及不良率`
                // 清空统计数据
                this.workOrderSum = 0
                this.outputSum = 0
                this.goodOutputSum = 0
                this.goodOutputRate = 0
                this.badOutputSum = 0
                this.badOutputRate = 0
                //清空当前页数据
                this.currentOutputSum = 0  //当前页检查数量
                this.currentGoodOutputSum = 0  //当前页良品数
                this.currentGoodOutputRate = 0   //当前页良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                this.tempArry = []
                if(data.workstageId){
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryWorkOrderAscendUrl,
                    data: data,
                    beforeSend: (xml) => {
                      mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      mesloadBox.hide()
                      if (result.status == 0) {
                        this.tempArry = result.map.workOrderAscends

                        this.tempArry.forEach((value, index) => {
                          this.outputSum += parseInt(value.product_element_num)  //总产出量
                          this.goodOutputSum += parseInt(value.good_products_num) //总良品数
                          this.badOutputSum += parseInt(value.scrap_num) //总不良数
                        })
                        //防止0/0出现NAN,分母不能为0
                        if (this.outputSum > 0) {
                          this.goodOutputRate = Math.round((this.goodOutputSum / this.outputSum) * 10000) / 100 //总优率
                        }
                        //防止0/0出现NAN,分母不能为0
                        if (this.outputSum > 0) {
                          this.badOutputRate = Math.round((this.badOutputSum / this.outputSum) * 10000) / 100  //总不良率
                        }

                        this.lines = this.tempArry.length //总条数
                        this.workOrderSum = this.tempArry.length  //工单总数
                        this.tbodyData = pagination(this.currenPage, this.pagesize, this.tempArry);
                        this.computedCurrentPage(this.tbodyData)
                      }
                      else if (result.status === 2) {
                        swallFail2(result.msg);
                       }
                      else {
                        this.tbodyData = []
                        this.lines = 0
                        if (result.msg) {
                          swallFail2(result.msg); //操作失败
                        } else {
                          swallFail()
                        }

                      }
                    },
                  })
                }

              },
              //统计当前页
              computedCurrentPage(arry) {
                this.currentOutputSum = 0  //检查数量
                this.currentGoodOutputSum = 0  //良品数
                this.currentGoodOutputRate = 0   //良品率
                this.currentBadOutputSum = 0   //当前页不良数
                this.currentBadOutputRate = 0   //当前页不良率

                arry.forEach((value, index) => {
                  this.currentOutputSum += parseInt(value.product_element_num)  //当前页产出量
                  this.currentGoodOutputSum += parseInt(value.good_products_num) //当前页良品数
                  this.currentBadOutputSum += parseInt(value.scrap_num) //当前页不良数

                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentGoodOutputRate = Math.round((this.currentGoodOutputSum / this.currentOutputSum) * 10000) / 100  //当前页良品率
                  }
                  //防止0/0出现NAN,分母不能为0
                  if (this.currentOutputSum > 0) {
                    this.currentBadOutputRate = Math.round((this.currentBadOutputSum / this.currentOutputSum) * 10000) / 100  //当前页不良率
                  }

                })
              },
              // 重置搜索条件
              reset() {
                this.craftId = '' //重置工艺
                this.craftName = '' //重置工艺
                this.productionBatch = '' //重置生产批次
                this.startTime = '' //重置开始时间
                this.endTime = '' //重置结束时间
                this.tbodyData = []
              },
              // 查询
              search() {
                  if (this.craftId === null || this.craftId === '') {
                    this.$message.error(`工艺未选择`);
                    return;
                  }
                if (this.startTime === null || this.startTime === '') {
                  this.$message.error(`开始时间不能为空`);
                  return;
                }
                if (this.endTime === null || this.endTime === '') {
                  this.$message.error(`结束时间不能为空`);
                  return;
                }
                this.currenPage = 1
                this.searchData.workstageId = this.craftId
                this.searchData.productionBatch = this.productionBatch
                this.searchData.startDate = this.startTime
                this.searchData.endDate = this.endTime
                this.queryFun(this.searchData)
              },

              // 选择工序
              selectProcess() {
                let promise = new Promise((resolve, reject) => {
                  selectProcessModal(resolve)
                })
                promise.then((resolveData) => {
                  this.craftName = resolveData.workstage_name
                  this.craftId = resolveData.workstage_basics_id
                })
              },
              // 选择生产批号
              selectProductionBatch() {
                let promise = new Promise((resolve, reject) => {
                  batchNumberModal(resolve)
                })
                promise.then((resolveData) => {
                  // console.dir(resolveData)
                  // this.productionBatch = resolveData.production_batch_production_number
                  this.productionBatch = resolveData.production_plan_batch_number

                })
              },
              // 获取昨天
              getYesterday() {
                this.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上周
              getLastweek() {
                this.startTime = moment(lastweek).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              // 获取上月
              getLastmonths() {
                this.startTime = moment(lastmonth).format('YYYY-MM-DD HH:mm:ss')
                this.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
              },
              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="workOrdersBadProductInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <el-collapse v-model="activeNames">
                      <div class="panel panel-default">
                        <div class="panel-body-table ">

                          <form class="form-inline form-table">
                            <div class="row">

                              <div class="col-md-4 col-xs-6">
                                <div class="form-group ">
                                  <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>选择工序</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="选择工序(必选)"
                                      v-model="craftName"
                                      @focus="selectProcess()"
                                    >
                                    <a
                                      title="选择工序"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProcess()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">
                                <div class="form-group " >
                                  <label class="control-label">生产批号</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="输入生产批号(可选)"
                                      v-model="productionBatch"
                                    >
                                    <a
                                      title="选择生产批号"
                                      href="javascript:;"
                                      class="input-btn"
                                      @click="selectProductionBatch()"
                                    ><i class="fa fa-search"></i>
                                    </a>
                                </div>
                              </div>
                              <div class="col-md-4 col-xs-6">

                              </div>

                            </div>
                            <div class="row">

                              <div class="col-md-12 col-xs-12 ">
                                <div class="form-group">
                                    <label class="control-label"><i style="color: red;">*&nbsp;&nbsp;</i>起止日期</label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="开始时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="startTime = $event.target.value"
                                      v-bind:value="startTime"
                                    >
                                    <input
                                      type="text"
                                      class="form-control"
                                      placeholder="结束时间(必选)"
                                      onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})"
                                      @blur="endTime = $event.target.value"
                                      v-bind:value="endTime"
                                    >
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getYesterday()"
                                    >&nbsp&nbsp&nbsp&nbsp昨天
                                    </a>
                                    <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastweek()"
                                    >&nbsp7天
                                    </a>
                                  <a
                                      href="javascript:;"
                                      class="table-link"
                                      style="font-size:14px;"
                                      @click="getLastmonths()"
                                    >&nbsp1个月
                                    </a>
                                </div>

                              </div>

                            </div>
                          </form>

                        </div>
                        <div class="panel-footer panel-footer-table ">
                          <div class="col-xs-6 text-right">
                            <button class="btn btn-primary submit-reset" @click="reset()">重置 </button>
                          </div>
                          <div class="col-xs-6 text-left">
                            <button class="btn btn-primary submit-search" @click="search()">查询 </button>
                          </div>
                        </div>

                      </div>
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-8">
                              <h5 class="panel-title" v-text="reportFormsName">统计</h5>
                            </div>
                            <div class="col-xs-4 text-right">
                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table">
                          <table class="table  table-bordered table-hover">
                            <tbody>
                              <tr>
                                <th style="width:10%">总产出量</th>
                                <td style="width:10%" v-text="outputSum">
                                </td>
                                <th style="width:10%">总良品数</th>
                                <td style="width:10%" v-text="goodOutputSum">
                                </td>
                                <th style="width:10%">总优率</th>
                                <td style="width:10%" v-text="goodOutputRate + '%' ">
                                </td>
                              </tr>
                              <tr>
                                <th>工单总数</th>
                                <td v-text="workOrderSum">
                                </td>
                                <th>总坏品数</th>
                                <td v-text="badOutputSum"></td>
                                <th>总坏品率</th>
                                <td v-text="badOutputRate + '%' "></td>
                              </tr>
                            </tbody>

                          </table>
                        </div>

                      </div>
                      <div class="panel panel-default" >
                        <el-collapse-item name="workOrdersBadProduct_1" >
                            <template slot="title" style="border-bottom:1px solid #ebeef5">
                              <div class="panel-heading panel-heading-table">
                                <div class="row">
                                  <div class="col-xs-4">
                                    <h5 class="panel-title">报表明细</h5>
                                  </div>
                                  <div class="col-xs-8">

                                  </div>
                                </div>
                              </div>
                            </template>
                          <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover" style="border-top:1px solid #ddd;">
                              <thead>
                                <tr>
                                  <th style="width: 7%;">序号</th>
                                  <th style="width: 18%;">工单编号</th>
                                  <th style="width: 15%;">时间</th>
                                  <th style="width: 15%;">计划批次</th>
                                  <th style="width: 15%;">产出量</th>
                                  <th style="width: 15%;">坏品数</th>
                                  <th style="width: 16%;">坏品率</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td>
                                  {{value.work_order_time | times}}
                                  </td>
                                  <td v-text="value.work_order_number">
                                  </td>
                                  <td v-text="value.production_plan_batch_number">
                                  </td>
                                  <td v-text="value.product_element_num">
                                  </td>
                                  <td v-text="value.scrap_num">
                                  </td>
                                  <td v-text="value.scrap_rate">
                                  </td>
                                </tr>
                                <tr>
                                  <th colspan="4">当页统计</th>
                                  <td ></td>
                                  <td ></td>
                                  <td ></td>
                                </tr>
                                <tr v-show="!tbodyData.length">
                                  <td colspan=15 class="text-center text-warning">
                                  没有可以显示的数据，请重新选择或输入查询条件
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="panel-footer panel-footer-table text-right">
                            <el-pagination
                              @current-change="handleCurrentChange"
                              background small
                              layout="total,prev,pager,next"
                              :current-page="currenPage"
                              :page-size="pagesize"
                              :total="lines"
                            >
                            </el-pagination>
                          </div>
                        </el-collapse-item>
                      </div>
                   </el-collapse>
                  </div>
                </div>
              </div>
                    `
          })
          Vue.set(panelBodyTableVM, 'startTime', moment(yesterday).format('YYYY-MM-DD HH:mm:ss')) //设置默认开始时间
          Vue.set(panelBodyTableVM, 'endTime', moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')) //设置默认结束时间
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;

    }
  })
  leftNavLink.eq(1).trigger('click');

})

