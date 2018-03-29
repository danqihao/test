
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
                ; (function () {
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

                                ajaxData:{
                                    devicesId:'', //设备id
                                    devicesName:'',//设备名称
                                    devicesTypeId:'', // 设备类型ID
                                    devicesTypeName:'', // 设备类型名称
                                    startTime:'',// 异常记录开始时间
                                    endTime:'',// 异常记录结束时间
                                    headNum:1 //下标
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
                            },
                            // 查询
                            search() {
                                this.currenPage = 1
                                this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime} 条件查询报表`

                                this.tbodyData = [
                                    { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },
                                    { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },
                                    { v1: '分容', v2: '2018.1.15  11:30:12', v3: '201801015001', v4: '1950', v5: '3768', v6: '4331', v7: '9' },
                                ]

                                // this.searchData.planName = this.searchDataInput
                                // this.queryFun(this.searchData)
                            },

                            // 选择工序
                            selectProcess(type) {
                                if(type === '工序'){
                                    let promise = new Promise((resolve, reject) => {
                                        selectProcessModal(resolve)
                                    })
                                    promise.then((resolveData) => {
                                        this.craftName = resolveData.workstage_name
                                        this.craftId = resolveData.workstage_basics_id
                                    })
                                }else{
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
                        created(){
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

                                ajaxData:{
                                    workstageId:'283b7b8fd83040d789b0dec1b88d79e4', //工序id
                                    workstageName:'',//工序名称
                                    startDate:'2018-02-04 15:54:04',// 异常记录开始时间
                                    endDate:'2018-02-08 15:54:04',// 异常记录结束时间
                                    headNum:1 //下标
                                },

                                elementQuantityCount:'', // 总合计
                                rejectsBatchQuantitySum:'',// 不良合计

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
                                            this.elementQuantityCount = result.map.elementQuantityCount
                                            this.rejectsBatchQuantitySum = result.map.rejectsBatchQuantitySum
                                            this.lines = result.map.line

                                        }
                                        else {
                                            this.tbodyData = []
                                            this.elementQuantityCount = ''
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
                            },
                            // 查询
                            search() {
                                // var data = this.ajaxData.startDate == '' || this.ajaxData.endDate == ''
                                if(this.ajaxData.workstageId == ''){
                                    this.$message.error({
                                        message: '请选择一个工序再查询',
                                    })
                                }else if(this.ajaxData.startDate == '' || this.ajaxData.endDate == ''){
                                    this.$message.error({
                                        message: '请选择一段时间再查询',
                                    })
                                }else{
                                    this.currenPage = 1
                                    this.reportFormsName = `${this.ajaxData.startDate} - ${this.ajaxData.endDate} 工序生产报表`
                                    this.queryFun()
                                }

                            },

                            // 选择工序
                            selectProcess(type) {
                                if(type === '车间'){
                                    this.ajaxData.workstageName = ''
                                    this.ajaxData.workstageId = ''
                                    let promise = new Promise((resolve, reject) => {
                                        workshopModel(resolve)
                                    })
                                    promise.then((resolveData) => {
                                        this.workshopName = resolveData.role_workshop_name
                                        this.workshopId = resolveData.role_workshop_id
                                    })
                                }else{
                                    let promise = new Promise((resolve, reject) => {
                                        if(this.workshopId == ''){
                                            workstageModal(resolve,queryWorkstageBasicsUrl,{type:'vague',keyword:'',headNum:1,status:0},'')
                                        }else{
                                            workstageModal(resolve,queryWorkShopInfosUrl,{type:'workstage',workshopId:this.workshopId},this.workshopName)
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

                        created(){
                            // this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                            // this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
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
                                                <label class="control-label">工 序</label>
                                                <input type="text" class="form-control" placeholder="选择工序(可选)" v-model="ajaxData.workstageName" @focus="selectProcess('工序')">
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
                                            <td v-text="value.product_element_num">
                                            </td>
                                            <td v-text="value.rejects_batch_quantity">
                                            </td>
                                            <td>{{value.adverse_rate !== null ? value.adverse_rate +'%' : ''}}
                                            </td>
                                            <td v-text="elementQuantityCount" :rowspan="tbodyData.length" v-if="index==0">
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
            case '#productionReachRF': {	//计划达成率报表
                ; (function () {
                    const swiper = document.getElementById('productionReachRF')   //右侧外部swiper
                    const inerSwiper = document.getElementById('productionReachRFInerSwiper') // 右侧内部swiper
                    let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

                    // 当前页面vue实例
                    let panelBodyTableVM = new Vue({
                        el: inerSwiper,
                        data() {
                            return {
                                searchData: { headNum: 1, type: 'info', planId: '', planName: '' },//搜索参数
                                tbodyData: [],

                                workshopId: '',  //车间id
                                workshopName: '',  //车间名称

                                ajaxData:{
                                    workstageId:'283b7b8fd83040d789b0dec1b88d79e4', //工序id
                                    workstageName:'',//工序名称
                                    startDate:'2018-02-04 15:54:04',// 异常记录开始时间
                                    endDate:'2018-02-08 15:54:04',// 异常记录结束时间
                                    headNum:1 //下标
                                },
                                expectedOutputCount:'', //计划产出总数量
                                elementQuantityCount:'', //实际产出总数量
                                reachRateCount:'', //总达成率
                                rejectsBatchQuantitySum:'', //总不良品数

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
                                        this.expectedOutputCount =  result.map.expectedOutputCount
                                        this.elementQuantityCount =  result.map.elementQuantityCount
                                        this.reachRateCount =  result.map.reachRateCount
                                        this.rejectsBatchQuantitySum =  result.map.rejectsBatchQuantitySum
                                        this.lines = result.map.line
                                    }
                                    else {
                                        this.expectedOutputCount = ''
                                        this.elementQuantityCount = ''
                                        this.reachRateCount =  ''
                                        this.rejectsBatchQuantitySum =  ''
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
                            },
                            // 查询
                            search() {
                                if(this.ajaxData.workstageId == ''){
                                    this.$message.error({
                                        message: '请选择一个工序再查询',
                                    })
                                }else if(this.ajaxData.startDate == '' || this.ajaxData.endDate == ''){
                                    this.$message.error({
                                        message: '请选择一段时间再查询',
                                    })
                                }else{
                                    this.currenPage = 1
                                    this.reportFormsName = `${this.ajaxData.startDate} - ${this.ajaxData.endDate} 计划达成率报表`
                                    this.queryFun()
                                }

                            },

                            // 选择工序
                            selectProcess(type) {
                                if(type === '车间'){
                                    this.ajaxData.workstageName = ''
                                    this.ajaxData.workstageId = ''
                                    let promise = new Promise((resolve, reject) => {
                                        workshopModel(resolve)
                                    })
                                    promise.then((resolveData) => {
                                        this.workshopName = resolveData.role_workshop_name
                                        this.workshopId = resolveData.role_workshop_id
                                    })
                                }else{
                                    let promise = new Promise((resolve, reject) => {
                                        if(this.workshopId == ''){
                                            workstageModal(resolve,queryWorkstageBasicsUrl,{type:'vague',keyword:'',headNum:1,status:0},'')
                                        }else{
                                            workstageModal(resolve,queryWorkShopInfosUrl,{type:'workstage',workshopId:this.workshopId},this.workshopName)
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

                        created(){
                            //this.ajaxData.startDate = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                            //this.ajaxData.endDate = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
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
                                                <label class="control-label">工 序</label>
                                                <input type="text" class="form-control" placeholder="选择工序(可选)" v-model="ajaxData.workstageName" @focus="selectProcess('工序')">
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
                                            <td v-text="value.product_element_num">
                                            </td>
                                            <td v-text="value.plan_optimal_rate">
                                            </td>
                                            <td v-text="elementQuantityCount" :rowspan="tbodyData.length" v-if="index==0">
                                            </td>
                                            <td v-text="reachRateCount" :rowspan="tbodyData.length" v-if="index==0">
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

                                ajaxData:{
                                    devicesId:'', //设备id
                                    devicesName:'',//设备名称
                                    devicesTypeId:'', // 设备类型ID
                                    devicesTypeName:'', // 设备类型名称
                                    startTime:'',// 异常记录开始时间
                                    endTime:'',// 异常记录结束时间
                                    headNum:1 //下标
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
                                            result.map.oees.forEach((val,key) => { //遍历出去重的数据
                                                exceptionsList.push(val.devices_control_devices_number)
                                            })
                                            exceptionsList = [...new Set(exceptionsList)] //去重的数据

                                            exceptionsList.forEach((value,index) => { //创建不重复类型的二维数组
                                                this.tbodyData.push([])
                                            })
                                            result.map.oees.forEach((val,key) => {  //推入不重复类型的二维数组
                                                exceptionsList.forEach((value,index) => {
                                                    if(val.devices_control_devices_number == value){
                                                        this.tbodyData[index].push(val)
                                                    }
                                                })
                                            })
                                            this.lines = result.map.lines
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
                                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 查询
                            search() {
                                if(this.ajaxData.startTime == '' || this.ajaxData.endTime == ''){
                                    this.$message.error({
                                        message: '请选择一段时间再查询',
                                    })
                                }else{
                                    this.currenPage = 1
                                    this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备OEE报表`
                                    this.queryFun()
                                }
                            },
                            // 选择设备类型
                            selectDevicesType(){
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
                                if(this.ajaxData.devicesTypeId !== ''){
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,this.ajaxData.devicesTypeId,this.ajaxData.devicesTypeName)
                                    })
                                    promise.then((resolveData) => {
                                        this.ajaxData.devicesName = resolveData.devices_control_devices_number
                                        this.ajaxData.devicesId = resolveData.devices_control_devices_id
                                    })
                                }else{
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,'','')
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

                        created(){
                            this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                            this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
                        },

                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            average(val){
                                var num = 0
                                val.forEach((value,index) => {
                                    num += Number(value.devices_oees)
                                })
                                num = num/val.length
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
                                    <table class="table  table-bordered table-hover">
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
                                        <td v-text="key + 1" :rowspan="val.length" v-if="index == 0">
                                        </td>
                                        <td v-text="value.devices_control_devices_number" :rowspan="val.length" v-if="index == 0">
                                        </td>
                                        <td v-text="value.work_order_number">
                                        </td>

                                        <td>{{value.loadTime | times}}</td>

                                        <td>{{value.downTime | times}}</td>

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
                                ajaxData:{
                                    devicesId:'', //设备id
                                    devicesName:'',//设备名称
                                    devicesTypeId:'', // 设备类型ID
                                    devicesTypeName:'', // 设备类型名称
                                    startTime:'',// 异常记录开始时间
                                    endTime:'',// 异常记录结束时间
                                    headNum:1 //下标
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
                                            result.map.exceptions.forEach((val,key) => { //遍历出去重的数据
                                                exceptionsList.push(val.devices_control_devices_number)
                                            })
                                            exceptionsList = [...new Set(exceptionsList)] //去重的数据

                                            exceptionsList.forEach((value,index) => { //创建不重复类型的二维数组
                                                this.tbodyData.push([])
                                            })
                                            result.map.exceptions.forEach((val,key) => {  //推入不重复类型的二维数组
                                                exceptionsList.forEach((value,index) => {
                                                    if(val.devices_control_devices_number == value){
                                                        this.tbodyData[index].push(val)
                                                    }
                                                })
                                            })

                                            this.lines = result.map.lines
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
                                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 查询
                            search() {
                                if(this.ajaxData.startTime == '' || this.ajaxData.endTime == ''){
                                    this.$message.error({
                                        message: '请选择一段时间再查询',
                                    })
                                }else{
                                    this.currenPage = 1
                                    this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备异常报表`
                                    this.queryFun()
                                }
                            },
                            // 选择设备类型
                            selectDevicesType(){
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
                                if(this.ajaxData.devicesTypeId !== ''){
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,this.ajaxData.devicesTypeId,this.ajaxData.devicesTypeName)
                                    })
                                    promise.then((resolveData) => {
                                        this.ajaxData.devicesName = resolveData.devices_control_devices_number
                                        this.ajaxData.devicesId = resolveData.devices_control_devices_id
                                    })
                                }else{
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,'','')
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

                        created(){
                            this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                            this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
                        },
                        filters:{
                            times(val){
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
                                        <table class="table  table-bordered table-hover">
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
                                                <td v-text="value.devices_control_devices_number">
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


                                ajaxData:{
                                    devicesId:'', //设备id
                                    devicesName:'',//设备名称
                                    devicesTypeId:'', // 设备类型ID
                                    devicesTypeName:'', // 设备类型名称
                                    startTime:'',// 异常记录开始时间
                                    endTime:'',// 异常记录结束时间
                                    headNum:1 //下标
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
                                        result.map.malfunctions.forEach((val,key) => { //遍历出去重的数据
                                            exceptionsList.push(val.devices.devices_control_devices_number)
                                        })
                                        exceptionsList = [...new Set(exceptionsList)] //去重的数据

                                        exceptionsList.forEach((value,index) => { //创建不重复类型的二维数组
                                            this.tbodyData.push([])
                                        })
                                        result.map.malfunctions.forEach((val,key) => {  //推入不重复类型的二维数组
                                            exceptionsList.forEach((value,index) => {
                                                if(val.devices.devices_control_devices_number == value){
                                                    this.tbodyData[index].push(val)
                                                }
                                            })
                                        })
                                        this.lines = result.map.malfunctionLines
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
                                this.ajaxData.startTime = moment(yesterday).format('YYYY-MM-DD HH:mm:ss')
                                this.ajaxData.endTime = moment(currentTime - 1).format('YYYY-MM-DD HH:mm:ss')
                            },
                            // 查询
                            search() {
                                if(this.ajaxData.startTime == '' || this.ajaxData.endTime == ''){
                                    this.$message.error({
                                        message: '请选择一段时间再查询',
                                    })
                                }else{
                                    this.currenPage = 1
                                    this.reportFormsName = `${this.ajaxData.startTime} - ${this.ajaxData.endTime}  设备维修报表`

                                    this.queryFun()
                                }
                            },
                            // 选择设备类型
                            selectDevicesType(){
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
                                if(this.ajaxData.devicesTypeId !== ''){
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,this.ajaxData.devicesTypeId,this.ajaxData.devicesTypeName)
                                    })
                                    promise.then((resolveData) => {
                                        this.ajaxData.devicesName = resolveData.devices_control_devices_name
                                        this.ajaxData.devicesId = resolveData.devices_control_devices_id
                                    })
                                }else{
                                    let promise = new Promise((resolve, reject) => {
                                        selectDevicesModal(resolve,'','')
                                    })
                                    promise.then((resolveData) => {
                                        this.ajaxData.devicesName = resolveData.devices_control_devices_name
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

                        created(){
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
                                                        @blur="startTime = $event.target.value"
                                                        v-bind:value="ajaxData.startTime"
                                                    >
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="结束时间(必选)"
                                                        onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})"
                                                        @blur="endTime = $event.target.value"
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
                                        <table class="table  table-bordered table-hover">
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



        }
    })
    leftNavLink.eq(2).trigger('click');

})

