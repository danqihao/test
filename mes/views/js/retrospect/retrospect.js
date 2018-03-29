$(function () {

    let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
        leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
        swiper = document.getElementsByTagName('body'),  //ajax加载时转圈
        mesloadBox = new MesloadBox(swiper, {
        // 主数据载入窗口
        warningContent: '没有此类信息，请重新选择或输入'
        })
        workOrderNum=0,forwardDirectionNum=0,reverseNum=0
        //让vue实例只执行一次
        $('.treeview').click(function(){
            if($(this).index() === 0){
                workOrderNum++
            }else if($(this).index() === 1){
                forwardDirectionNum++
            }else if($(this).index() === 2){
                reverseNum++
            }
        })
    //搜索查询条件
    var searchData = {
        planBatch:'',//生产计划批次
        orderNumber:'',//订单编号
        workOrderNumber:'',//工单号
        finishName:'',// 产出物名称
        finishNumber:'',// 产出物编号
        founderStaffId:'',//生产计划创建人id
        responsibleStaffId:'',//生产计划负责人id
        verifierStaffId:'',//生产计划审核人id
        orderCreatorsId:'',// 工单创建人
        orderResponsibleId:'',// 工单负责人
        workstageResponsibleId:'',//工序负责人id
        operationOperatorId:'',//设备操作人员id
        materialUserId:'',//投料人员id
        materialPickId:'',// 领料人员id
        materialRetreatId:'',//补料人员id
        dispatchStaffId:'',//物料调批人员id
        productRecordId:'',//产出物记录人员id
        scrapRecordId:'',//报废品记录人员id
        rejectsRecordId:'',//不良品记录人员id
        rejectsDisposeId:'',//不良品处理人员id
        classesId:'',//班次id
        workshopId:'',// 车间id
        devicesName:'',// 设备名称
        devicesNumber:'',// 设备编号
        materielName:'',// 物料名称
        materielNumber:'',// 物料编号
        outofstorageBatch:'',//领料批次号
        materialenterBatch:'',//仓储物料入库批次号
        bomName:'',//BOM名称
        bomVersion:'',// BOM版本号
        craftName:'',//工艺名称
        craftVersions:'',//工艺版本号
        temperatureMin:'',// 温度下限
        temperatureMax:'',//温度上限
        humidityMin:'',//湿度下限
        humidityMax:'',//湿度上限
        cleanlinessMin:'',// 清洁度下限
        cleanlinessMax:'',//清洁度上限
        dewPointMin:'',//露点 下限
        dewPointMax:'',//露点 上限
        iqcReportNumber:'',//iqc编号
        pqcReportNumber:'',//pqc编号
        fqcReportNumber:'',//FQC编号
        repairNumber:'',//维修记录编号
        startTime:'',//工单执行时间 下限
        endTime:'',//工单执行时间 上限
        planId:''
    },
    //选择人员时显示在输入框的名字
    searchStaffName = {
        founderStaffId:'',//生产计划创建人id
        responsibleStaffId:'',//生产计划负责人id
        verifierStaffId:'',//生产计划审核人id
        orderCreatorsId:'',// 工单创建人
        orderResponsibleId:'',// 工单负责人
        workstageResponsibleId:'',//工序负责人id
        operationOperatorId:'',//设备操作人员id
        materialUserId:'',//投料人员id
        materialPickId:'',// 领料人员id
        materialRetreatId:'',//补料人员id
        dispatchStaffId:'',//物料调批人员id
        productRecordId:'',//产出物记录人员id
        scrapRecordId:'',//报废品记录人员id
        rejectsRecordId:'',//不良品记录人员id
        rejectsDisposeId:'',//不良品处理人员id
    }


    //  console.log(yan)
    leftNavLink.on('click', function (event) {
        let targetHref = event.currentTarget.getAttribute('href');

        switch (targetHref) {
            case '#workOrderAscend': { 	//工单追溯
                const swiper = document.getElementById('workOrderAscend')   //右侧外部swiper
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
                //主页加载
                function run(){
                    let panelBodyTableVM = new Vue({
                        el:'#workOrderAscend',
                        data(){
                            return{
                                inquireShow:false, //搜索框是否隐藏条件
                                productionShow:false, //是否显示生产计划条件
                                workOrderShow:false,  //是否显示工单信息条件
                                classesData:[], //选择班次时数据
                                workShopData:[], //选择车间时数据
                                productionData:[],//生产计划遍历数据
                                tsproductionData:[],//生产计划遍历数据暂存 分页用
                                workOrderList:[],//工单数据暂存 分页用
                                tsworkOrderList:[],//工单数据
                                searchData:searchData,//ajax要传的数据
                                searchStaffName:searchStaffName,//选择人员时显示在输入框的名字
                                searchValue:'', //搜索框值
                                lines:0, //条数
                                currenPage:1, //当前页
                                pagesize:10,
                                lines2:0, //条数
                                currenPage2:1, //当前页
                                selectData:[],//已选择的返回数据
                                showNumber:['1','2','3','4','5','6','7','8','9','10'],
                                tags: [],
                                searchShow:{ //是否显示搜索条件
                                    classes:false, //班次
                                    staff:false, //人员
                                    environment:false, //环境
                                    devices:false, //设备
                                    material:false, //物料
                                    product:false, //产出物
                                    measurement:false, //测试记录
                                    craft:false, //工艺名称
                                    service:false, //维修记录编号
                                    workOrder:false, //工单执行时间
                                }
                            }
                        },
                        methods:{
                            ajaxData(){
                                $.ajax({
                                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                    url: queryWorkOrderUrl,
                                    data:this.searchData,
                                    beforeSend: (xml) => {
                                        mesloadBox.loadingShow()
                                      },
                                    success: (result, status, xhr) => {
                                        mesloadBox.hide()
                                        if(result.status === 0){
                                           this.tsworkOrderList = result.map.workOrderList
                                           this.workOrderList = pagination(1, this.pagesize, this.tsworkOrderList)
                                           this.lines = result.map.workOrderList.length
                                        }else{
                                            this.workOrderList = []
                                            this.lines = 0
                                        }
                                    }
                                })
                            },
                            //点击增加搜索条件显示查询信息
                            searchCondition(type){
                                // eval(""+type+"")
                                var type =  type.split(',')
                                var is ='this.searchShow.'+type[0]
                                // this.$set(this.searchShow,type, !eval(""+is+""))
                                this.$set(this.searchShow,type[0], true)

                                if(this.tags.length){
                                    var data = []
                                    this.tags.forEach((value,index) => {
                                        data.push(value.name)
                                    })
                                    if(data.indexOf(type[1]) === -1){
                                        this.tags.push( { name: type[1] , searchShow: type[0] })
                                    }
                                }else{
                                    this.tags.push( { name: type[1] , searchShow: type[0] })
                                }

                            },
                            //点击标签x号隐藏对应条件
                            handleClose(tag) {
                                var data = []
                                this.tags.forEach((value,index) => {
                                    data.push(value.name)
                                })
                                this.tags.splice(data.indexOf(tag.name), 1);
                                this.$set(this.searchShow,tag.searchShow, false)
                            },
                            //工单详情
                            workOrderModel(id,workstageId){
                                workOrderDetailsModel(id,workstageId)
                            },
                            //pqc模态框
                            pqcDetailsModel(id){
                                pqcModal(id)
                            },
                            //生产计划详情模态框
                            productionPlanDetails(id){
                                productionPlanDetailsModel(id)
                            },
                            //选择人员模态框
                            staffSelect(name){
                                let promise = new Promise( (resolve, reject) => {
                                    peopleModel(resolve,null,null)
                                })
                                promise.then( (resolveData) => {
                                    this.$set(this.searchData,name, resolveData.role_staff_id)
                                    this.$set(this.searchStaffName,name, resolveData.role_staff_name)
                                })
                            },
                            //点击行数下拉对应工单
                            workOrder(value){
                                this.productionData.forEach((val,key) => {
                                    if(val.production_plan_id == value.production_plan_id){
                                        value.workOrderShow = !value.workOrderShow
                                    }else{
                                        val.workOrderShow = false
                                    }
                                })
                                this.searchData.planId = value.production_plan_id
                                this.ajaxData()
                            },
                            //搜索框
                            searchs(){
                                this.ajaxData.projectTypeName = this.searchs
                                this.currenPage = 1
                                queryFun(queryQualityProjectTypeUrl,this.ajaxData)
                            },
                            //点击更多查询条件显示查询信息
                            search(type){
                                this.searchData.planId = ''
                                var search = false
                                for(val in this.searchData){
                                    if(this.searchData[val] !== ''){
                                        search = true
                                    }
                                }
                                if(search){
                                    this.productionShow = true
                                    this.productionData = []


                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryPlanReviewUrl,
                                        data: this.searchData,
                                        beforeSend: (xml) => {
                                            mesloadBox.loadingShow()
                                        },
                                        success: (result, status, xhr) => {
                                            if(result.status === 0){
                                                result.map.workOrders.forEach((val,key) => {
                                                    val.workOrderShow = false
                                                    this.tsproductionData.push(val)
                                                })
                                                this.productionData = pagination(1, this.pagesize, this.tsproductionData)
                                                this.lines2 = result.map.workOrders.length
                                            }else{
                                                this.productionData = []
                                                this.lines2 = 0
                                            }

                                        }
                                    })
                                }else{
                                    this.$message.error({
                                        message: '请先添加一个搜索条件',
                                        type: 'warning'
                                    })
                                }
                            },
                            //重置搜索
                            reset(){
                                for(val in this.searchData){
                                    this.searchData[val] = ''
                                }
                                for(val in this.searchStaffName){
                                    this.searchStaffName[val] = ''
                                }
                            },
                            //分页变化
                            handleCurrentChange(val){
                                this.productionData = pagination(val, this.pagesize, this.tsproductionData)
                            },
                            handleCurrentChange2(val){
                                // this.productionData = pagination(val, this.pagesize, this.tsproductionData)
                                this.workOrderList = pagination(val, this.pagesize, this.tsworkOrderList)
                            }
                        },
                        created(){
                            //班次
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryClassesUrl,
                                data: {type:'info',headNum:1},
                                success: (result, status, xhr) => {
                                    if(result.status === 0){
                                        this.classesData = result.map.classes
                                    }
                                }
                            })
                            //车间
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryWorkShopInfosUrl,
                                data: {type:'info',headNum:1},
                                success: (result, status, xhr) => {
                                    if(result.status === 0){
                                        this.workShopData = result.map.workshopInfos
                                    }
                                }
                            })
                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            //根据数字判断状态
                            status(val){
                                if(val == 0){
                                    return '未开始'
                                }else if(val == 1){
                                    return '生产中'
                                }else if(val == 2){
                                    return '暂停'
                                }else if(val == 3){
                                    return '生产完成'
                                }else if(val == 4){
                                    return '停止'
                                }else{
                                    return ''
                                }
                            },
                            //不良率加%
                            adverse(val){
                                if(val !== '' && val !== null){
                                    return val+'%'
                                }else{
                                    return 0
                                }
                            },

                            number(val){
                                if(val !== '' && val !== null){
                                    return val
                                }else{
                                    return 0
                                }
                            }
                        },
                        template:`
                        <div id="workOrderAscend" class="swiper-slide">
                            <!-- 右侧外部swiper -->

                            <div class="container-fluid">
                                <div class="row">

                                    <div class="content-header">
                                        <div class="col-xs-10">
                                            <div class="content-header-tab">
                                                <div class="tab-logo">
                                                    <i class="fa fa-window-restore"></i>
                                                </div>
                                                <div class="tab-body">
                                                    <div class="tab-title">
                                                        <p>工单追溯</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="content-body swiper-container">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide swiper-no-swiping" id="workOrderAscendInerSwiper">
                                            <!-- 右侧内部swiper -->
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!-- 搜索框 -->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-6">
                                                                    <h5 class="panel-title">输入查询条件：</h5>
                                                                </div>
                                                                <div class="col-xs-6">
                                                                    <form class="form-inline pull-right">
                                                                        <fieldset>
                                                                            <!--<a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="inquireShow = !inquireShow" v-text="inquireShow ? '隐藏更多查询条件' : '显示更多查询条件'"></a>-->
                                                                        </fieldset>
                                                                    </form>
                                                                    <el-dropdown class="pull-right" @command="searchCondition" :hide-on-click="false">
                                                                        <el-button size="small" split-button type="primary" >
                                                                        增加搜索条件<i class="el-icon-arrow-down el-icon--right"></i>
                                                                        </el-button>
                                                                        <el-dropdown-menu slot="dropdown">
                                                                            <el-dropdown-item command="staff,人员" :class="{ mes_loader_info : searchShow.staff}">人员</el-dropdown-item>
                                                                            <el-dropdown-item command="devices,设备" :class="{ mes_loader_info : searchShow.devices}">设备</el-dropdown-item>
                                                                            <el-dropdown-item command="material,物料" :class="{ mes_loader_info : searchShow.material }">物料</el-dropdown-item>
                                                                            <el-dropdown-item command="classes,班次" :class="{ mes_loader_info : searchShow.classes }">班次</el-dropdown-item>
                                                                            <el-dropdown-item command="product,产出物" :class="{ mes_loader_info : searchShow.product}">产出物</el-dropdown-item>
                                                                            <el-dropdown-item command="measurement,测试记录" :class="{ mes_loader_info : searchShow.measurement}">测试记录</el-dropdown-item>
                                                                            <el-dropdown-item command="craft,工艺名称" :class="{ mes_loader_info : searchShow.craft}">工艺名称</el-dropdown-item>
                                                                            <el-dropdown-item command="workOrder,工单执行时间" :class="{ mes_loader_info : searchShow.workOrder}">工单执行时间</el-dropdown-item>
                                                                            <el-dropdown-item command="service,维修的设备编号" :class="{ mes_loader_info : searchShow.service}">维修的设备编号</el-dropdown-item>
                                                                            <el-dropdown-item command="environment,生产计划的环境参数" :class="{ mes_loader_info : searchShow.environment}">生产计划的环境参数</el-dropdown-item>
                                                                        </el-dropdown-menu>
                                                                    </el-dropdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--panel-heading end -->
                                                        <div class="panel-body-table table-height" style="padding:5px">
                                                            <div class="row" style="padding:5px;border-bottom:1px solid #ebeef5;">
                                                                <div class="col-md-1"></div>
                                                                <div class="col-md-11">
                                                                    <el-tag v-for="tag in tags" :key="tag.name" closable style="margin-right:5px" @close="handleClose(tag)">
                                                                        {{tag.name}}
                                                                    </el-tag>
                                                                </div>
                                                            </div>
                                                            <div class="row" style="padding:5px 0">
                                                                <div class="col-md-4">
                                                                    <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                        <label class="control-label" style="width:105px">生产计划批次号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.planBatch">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                        <label class="control-label" style="width:105px">订单编号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.orderNumber">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                        <label class="control-label" style="width:105px">工单号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.workOrderNumber">
                                                                        </div>
                                                                    </form>
                                                                </div>

                                                            </div>
                                                            <el-collapse v-model="showNumber">
                                                                <!--产出物：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="1" v-if="searchShow.product">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">产出物</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">产出物名称：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.finishName">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">产出物编号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.finishNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--人员：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="2" v-if="searchShow.staff">
                                                                        <template slot="title">
                                                                            <span style="font-size:15px">人员</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">生产计划创建人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.founderStaffId" @click="staffSelect('founderStaffId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">生产计划负责人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.responsibleStaffId" @click="staffSelect('responsibleStaffId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">生产计划审核人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.verifierStaffId" @click="staffSelect('verifierStaffId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">工单创建人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.orderCreatorsId" @click="staffSelect('orderCreatorsId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">工单负责人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.orderResponsibleId" @click="staffSelect('orderResponsibleId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">工序负责人：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.workstageResponsibleId" @click="staffSelect('workstageResponsibleId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">投料人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.materialUserId" @click="staffSelect('materialUserId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">领料人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.materialPickId" @click="staffSelect('materialPickId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">补料人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.materialRetreatId" @click="staffSelect('materialRetreatId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">物料调批人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.dispatchStaffId" @click="staffSelect('dispatchStaffId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">产出物记录人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.productRecordId" @click="staffSelect('productRecordId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">报废品记录人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.scrapRecordId" @click="staffSelect('scrapRecordId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">设备操作人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.operationOperatorId" @click="staffSelect('operationOperatorId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">不良品记录人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.rejectsRecordId" @click="staffSelect('rejectsRecordId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">不良品处理人员：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchStaffName.rejectsDisposeId" @click="staffSelect('rejectsDisposeId')">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--设备：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="3" v-if="searchShow.devices">
                                                                        <template slot="title">
                                                                            <span style="font-size:15px">设备</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">设备名称：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.devicesName">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">设备编号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.devicesNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--物料：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="4" v-if="searchShow.material">
                                                                        <template slot="title">
                                                                            <span style="font-size:15px">物料</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">物料名称：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.materielName">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <!--<div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">物料编号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.materielNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>-->
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">领料批次号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.outofstorageBatch">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">物料批次号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.materialenterBatch">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">BOM名称：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.bomName">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">BOM版本号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.bomVersion">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--测试记录：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="5" v-if="searchShow.measurement">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">测试记录</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">IQC单号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.iqcReportNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">PQC单号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.pqcReportNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">FQC单号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.fqcReportNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--工艺名称：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="6" v-if="searchShow.craft">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">工艺名称</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">工艺名称：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.craftName">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">工艺版本号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="searchData.craftVersions">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--维修的设备编号-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="7" v-if="searchShow.service">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">维修的设备编号</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-4">
                                                                                <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:105px">维修的设备编号：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchData.repairNumber">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--班次：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="8" v-if="searchShow.classes">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">班次</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-2 col-xs-2">
                                                                                <h5 class="modal-title text-center" style="font-size:16px">班次：</h5>
                                                                            </div>
                                                                            <div class="col-md-2 col-xs-5">
                                                                                    <select class="form-control" v-model="searchData.classesId">
                                                                                        <option value="">未选择</option>
                                                                                        <option v-for="(value,index) in classesData" :value="value.role_class_id">{{value.role_class_name}}</option>
                                                                                    </select>

                                                                            </div>
                                                                            <div class="col-md-2 col-xs-2">
                                                                                <h5 class="modal-title text-center" style="font-size:16px">车间：</h5>
                                                                            </div>
                                                                            <div class="col-md-2 col-xs-5">
                                                                                    <select class="form-control" v-model="searchData.workshopId">
                                                                                        <option value="">未选择</option>
                                                                                        <option v-for="(value,index) in workShopData" :value="value.role_workshop_id">{{value.role_workshop_name}}</option>
                                                                                    </select>

                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--生产计划的环境参数:-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="9" v-if="searchShow.environment">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">生产计划的环境参数</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-1">
                                                                            </div>
                                                                            <div class="col-md-5">
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:80px">温度：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="温度下限" maxlength="25" v-model="searchData.temperatureMin">
                                                                                    </div>
                                                                                </form>
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label">~</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="温度上限" maxlength="25" v-model="searchData.temperatureMax">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-5">
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:80px">湿度：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="湿度下限" maxlength="25" v-model="searchData.humidityMin">
                                                                                    </div>
                                                                                </form>
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label">~</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="湿度上限" maxlength="25" v-model="searchData.humidityMax">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        <div class="row" style="padding-top:10px">
                                                                            <div class="col-md-1">
                                                                            </div>
                                                                            <div class="col-md-5">
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:80px">清洁度：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="清洁度下限" maxlength="25" v-model="searchData.cleanlinessMin">
                                                                                    </div>
                                                                                </form>
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label">~</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="清洁度上限" maxlength="25" v-model="searchData.cleanlinessMax">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                            <div class="col-md-5">
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:80px">露点：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="露点下限" maxlength="25" v-model="searchData.dewPointMin">
                                                                                    </div>
                                                                                </form>
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label">~</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="露点上限" maxlength="25" v-model="searchData.dewPointMax">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                                <!--工单执行时间：-->
                                                                <transition name="search">
                                                                    <el-collapse-item name="10" v-if="searchShow.workOrder">
                                                                        <template slot="title">
                                                                        <span style="font-size:15px">工单执行时间</span>
                                                                        </template>
                                                                        <div class="row">
                                                                            <div class="col-md-1"></div>
                                                                            <div class="col-md-5">
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label" style="width:100px">实际执行时间：</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="起始时间" maxlength="25" @blur="searchData.startTime = $event.target.value" :value="searchData.startTime" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                                    </div>
                                                                                </form>
                                                                                <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                    <label class="control-label">至</label>
                                                                                    <div class="input-group input-group-sm fuzzy-search-group">
                                                                                        <input class="form-control" type="text" placeholder="终止时间" maxlength="25" @blur="searchData.endTime = $event.target.value" :value="searchData.endTime" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </el-collapse-item>
                                                                </transition>
                                                            </el-collapse>

                                                        </div>
                                                        <div class="panel-footer panel-footer-table ">
                                                            <div class="col-xs-6 text-right">
                                                            <button class="btn btn-primary submit-reset" @click="reset()">重 置</button>
                                                            </div>
                                                            <div class="col-xs-6 text-left">
                                                            <button class="btn btn-primary submit-search" @click="search()">查 询</button>
                                                            </div>
                                                        </div>
                                                        <!--panel-footer end -->
                                                    </div>
                                                    <!-- 生产计划 -->
                                                    <transition name="search">
                                                        <div class="panel panel-default" v-if="productionShow">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-6">
                                                                        <h5 class="panel-title">生产计划</h5>
                                                                    </div>
                                                                    <div class="col-xs-6">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--panel-heading end -->
                                                            <div class="vueel">
                                                                <div class="panel-body-table table-height-10">
                                                                    <table class="table table-bordered table-hover table-condensed">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style="width: 25%;">订单编号</th>
                                                                                <th style="width: 25%;">生产批号</th>
                                                                                <th style="width: 25%;">订单生产数</th>
                                                                                <th style="width: 25%;">生产状态</th>
                                                                                <th style="width: 25%;">操作</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody style="border:none" v-for="(value,index) in productionData">
                                                                            <tr>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_plan_order_number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_plan_batch_number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_order_production_number | number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.plan_production_status | status}}</td>
                                                                                <td class="table-input-td">
                                                                                    <a class="table-link" @click="productionPlanDetails(value.production_plan_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                    <a class="table-link pull-right" style="color:#000" @click="workOrder(value)" href="javascript:;"><i :class="value.workOrderShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right' "></i></a>
                                                                                </td>
                                                                            </tr>

                                                                            <!-- 工单信息 -->
                                                                            <tr>
                                                                                <td colspan=15 style="padding:0">
                                                                                    <transition name="workOrderFade">
                                                                                        <div class="panel panel-default" v-if="value.workOrderShow" style="overflow:hidden;padding:5px">
                                                                                            <div class="panel-heading panel-heading-table">
                                                                                                <div class="row">
                                                                                                    <div class="col-xs-6">
                                                                                                        <h5 class="panel-title">工单信息</h5>
                                                                                                    </div>
                                                                                                    <div class="col-xs-6">
                                                                                                         <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                                                            <!--搜索框 -->
                                                                                                            <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                <input class="form-control" type="text" placeholder="输入工单号" maxlength="25" v-model="searchData.workOrderNumber" @keyup.enter ="ajaxData()">
                                                                                                                <div class="input-group-btn"  @click="ajaxData()">
                                                                                                                    <button type="button" class="btn btn-primary head-main-btn-2">
                                                                                                                        <i class="fa fa-search"></i>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </form>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <!--panel-heading end -->
                                                                                            <div class="vueel">
                                                                                                <div class="panel-body-table table-height-10">
                                                                                                    <table class="table  table-bordered table-hover table-condensed">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th style="width: 5%;">序号</th>
                                                                                                                <th style="width: 10%;">工单编号</th>
                                                                                                                <th style="width: 10%;">工序</th>
                                                                                                                <th style="width: 10%;">产出物</th>
                                                                                                                <th style="width: 10%;">产出数量</th>
                                                                                                                <th style="width: 10%;">完成时间</th>
                                                                                                                <th style="width: 10%;">不良数</th>
                                                                                                                <th style="width: 10%;">不良率</th>
                                                                                                                <th style="width: 15%;">操作</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr v-for="(value,index) in workOrderList">
                                                                                                                <td>{{index+1}}</td>
                                                                                                                <td>{{value.work_order_number}}</td>
                                                                                                                <td>{{value.workstage_name}}</td>
                                                                                                                <td>{{value.semi_finish_name}}</td>
                                                                                                                <td>{{value.work_order_actual_output  | number}}</td>
                                                                                                                <td>{{value.work_order_actual_finish_time | times}}</td>
                                                                                                                <td>{{value.rejects_batch_quantity | number}}</td>
                                                                                                                <td>{{value.adverse_rate | adverse}}</td>
                                                                                                                <td class="table-input-td">
                                                                                                                    <a class="table-link" @click="workOrderModel(value.work_order_id,value.workstage_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                                                                    <a class="table-link" @click="pqcDetailsModel(value.work_order_id)" href="javascript:;"><i class="fa fa-pencil-square-o"></i>PQC详情</a>
                                                                                                                    <a class="table-link" href="productionPlan.html?num=1" target="_blank"><i class="fa fa-pencil-square-o"></i>生产过程详情</a>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <tr v-if="!workOrderList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                                <div class="panel-footer panel-footer-table text-right">
                                                                                                    <el-pagination @current-change="handleCurrentChange2" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                                                                                </div>
                                                                                            </div>
                                                                                            <!--panel-footer end -->
                                                                                        </div>
                                                                                    </transition>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                        <tbody v-if="!productionData.length"  style="border:none">
                                                                            <tr><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div class="panel-footer panel-footer-table text-right">
                                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage2" :page-size="pagesize" :total="lines2"></el-pagination>
                                                            </div>
                                                            <!--panel-footer end -->
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
                if(workOrderNum < 1){
                    run()
                }
            }
            break;
            case '#forwardDirectionAscend': { //正向追溯
                const swiper = document.getElementById('forwardDirectionAscend')   //右侧外部swiper
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
                function run(){
                    let panelBodyTableVM = new Vue({
                        el:'#forwardDirectionAscend',
                        data(){
                            return{
                                finishedShow:false, //成品信息是否隐藏条件
                                finishedShow2:false, //成品信息是否隐藏条件
                                searchsData:{
                                    materielNumber:'',// 物料编号
                                    materialenterBatch:'',// 仓储物料入库批次号
                                    bomName:'',// BOM名称
                                    bomVersion:'', //BOM版本号
                                    startTime:'',// 生产计划执行时间上限
                                    endTime:'',// 生产计划执行时间下限
                                    planId:''
                                },
                                planList:[], // 基础数据
                                tsplanList:[], // 基础数据暂存 分页用
                                rejectsBatchs:[],
                                lines:0, //条数
                                currenPage:1, //当前页
                                lines2:0, //条数
                                currenPage2:1, //当前页
                                pagesize: 10,   //页码
                            }
                        },
                        methods:{
                            ajaxData(){
                                $.ajax({
                                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                    url: queryFinishedProductUrl,
                                    data: this.searchsData,
                                    beforeSend: (xml) => {
                                        mesloadBox.loadingShow()
                                        },
                                    success: (result, status, xhr) => {
                                        mesloadBox.hide()
                                        if(result.status === 0){
                                            this.rejectsBatchs = result.map.rejectsBatchs
                                            this.lines = result.map.line
                                        }else{
                                            this.rejectsBatchs = []
                                            this.lines = 0
                                        }
                                    }
                                })
                            },
                            //生产详情模态框
                            productionDetails(id){
                                productionDetailsModel(id)
                            },
                            //fqc模态框
                            fqcDetailsModel(value){
                                fqcModel(value)
                            },
                            //pqc模态框
                            pqcDetailsModel(id){
                                pqcModal(id)
                            },
                            //生产计划详情模态框
                            productionPlanDetails(id){
                                productionPlanDetailsModel(id)
                            },
                            //点击行数下拉对应工单
                            workOrder(value){
                                this.planList.forEach((val,key) => {
                                    if(val.production_plan_id == value.production_plan_id){
                                        value.workOrderShow = !value.workOrderShow
                                    }else{
                                        val.workOrderShow = false
                                    }
                                })

                                this.searchsData.planId = value.production_plan_id
                                this.ajaxData()
                            },
                            //点击查询
                            searchs(){

                                this.planList = []
                                this.tsplanList = []
                                var search = false
                                for(val in this.searchsData){
                                    if(this.searchsData[val] !== ''){
                                        search = true
                                    }
                                }
                                if(search){
                                    this.finishedShow=true
                                    this.searchsData.planId = ''
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryPlanBatchUrl,
                                        data:this.searchsData,
                                        beforeSend: (xml) => {
                                            mesloadBox.loadingShow()
                                        },
                                        success: (result, status, xhr) => {
                                            mesloadBox.hide()
                                            if(result.status === 0){
                                                result.map.planList.forEach((val,key) => {
                                                    val.workOrderShow = false
                                                    this.tsplanList.push(val)
                                                })
                                                this.planList = pagination(1, this.pagesize, this.tsplanList)
                                                this.lines2 = result.map.planList.length
                                            }else{
                                                this.planList = []
                                                this.lines2 = 0
                                            }
                                        }
                                    })
                                }else{
                                    this.$message.error({
                                        message: '请先添加一个搜索条件',
                                        type: 'warning'
                                    })
                                }
                            },
                            //重置搜索
                            reset(){

                                for(val in this.searchsData){
                                  this.searchsData[val] = ''
                                }
                            },
                            //分页变化
                            handleCurrentChange(val){
                                this.searchsData.headNum = (val - 1) * 10 + 1;
                                this.ajaxData()
                            },
                            handleCurrentChange2(val){
                                this.planList = pagination(val, this.pagesize, this.tsplanList)
                            }
                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            //不良率加%
                            adverse(val){
                                if(val !== '' && val !== null){
                                    return val+'%'
                                }else{
                                    return 0
                                }
                            },
                            number(val){
                                if(val !== '' && val !== null){
                                    return val
                                }else{
                                    return 0
                                }
                            }
                        },
                        template:`
                        <div id="forwardDirectionAscend" class="swiper-slide">
                            <!-- 右侧外部swiper -->

                            <div class="container-fluid">
                                <div class="row">
                                    <div class="content-header">
                                        <div class="col-xs-10">
                                            <div class="content-header-tab">
                                                <div class="tab-logo">
                                                    <i class="fa fa-window-restore"></i>
                                                </div>
                                                <div class="tab-body">
                                                    <div class="tab-title">
                                                        <p>正向追溯</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="content-body swiper-container">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide swiper-no-swiping" id="forwardDirectionAscendInerSwiper">
                                            <!-- 右侧内部swiper -->
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!-- 搜索框 -->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-6">
                                                                    <h5 class="panel-title">输入查询条件：</h5>
                                                                </div>
                                                                <div class="col-xs-6">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--panel-heading end -->
                                                        <div class="panel-body-table table-height" style="padding:5px">
                                                            <div class="row">
                                                                <!--<div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">物料编号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.materielNumber">
                                                                        </div>
                                                                    </form>
                                                                </div>-->
                                                                 <div class="col-md-1 col-xs-1"></div>
                                                                <div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">BOM名称：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.bomName">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">BOM版本：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.bomVersion">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-4 col-xs-6">
                                                                </div>

                                                            </div>
                                                            <div class="row" style="padding-top:10px">
                                                            <div class="col-md-1 col-xs-1"></div>
                                                                <div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">物料批号 ：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.materialenterBatch">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-5 col-xs-7">
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">实际开始时间：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="起始时间" maxlength="25" @blur="searchsData.startTime = $event.target.value"  :value="searchsData.startTime" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                        </div>
                                                                    </form>
                                                                    <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                        <label class="control-label">到</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="终止时间" maxlength="25" @blur="searchsData.endTime = $event.target.value" :value="searchsData.endTime"   onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                        </div>
                                                                    </form>

                                                                </div>


                                                            </div>
                                                        </div>
                                                        <div class="panel-footer panel-footer-table ">
                                                            <div class="col-xs-6 text-right">
                                                            <button class="btn btn-primary submit-reset" @click="reset()">重 置</button>
                                                            </div>
                                                            <div class="col-xs-6 text-left">
                                                            <button class="btn btn-primary submit-search" @click="searchs()">查 询</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- 成品批次信息 -->
                                                    <transition name="search">
                                                        <div class="panel panel-default" v-if="finishedShow">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-6">
                                                                        <h5 class="panel-title">成品批次信息</h5>
                                                                    </div>
                                                                    <div class="col-xs-6">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--panel-heading end -->
                                                            <div class="vueel">
                                                                <div class="panel-body-table table-height-10">
                                                                    <table class="table  table-bordered table-hover table-condensed">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style="width: 18%;">生产计划批次号</th>
                                                                                <th style="width: 18%;">成品数量</th>
                                                                                <th style="width: 10%;">单位</th>
                                                                                <th style="width: 18%;">不良数</th>
                                                                                <th style="width: 18%;">不良率</th>
                                                                                <th style="width: 18%;">操作</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody v-for="(value,index) in planList" style="border:none">
                                                                            <tr>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_plan_batch_number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_batch_production_number | number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.product_model_unit}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.sumReject | number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.adverse_rate | adverse}}</td>
                                                                                <td class="table-input-td">
                                                                                    <a class="table-link" @click="productionPlanDetails(value.production_plan_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产计划详情</a>
                                                                                    <a class="table-link pull-right" style="color:#000" @click="workOrder(value)" href="javascript:;"><i :class="value.workOrderShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right' "></i></a>

                                                                                </td>
                                                                            </tr>
                                                                            <tr v-if="!planList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                            <tr>
                                                                                <td colspan=15 style="padding:0">
                                                                                    <transition name="workOrderFade">
                                                                                        <!-- 成品信息 -->
                                                                                        <div class="panel panel-default" v-if="value.workOrderShow" style="overflow:hidden;padding:5px">
                                                                                            <div class="panel-heading panel-heading-table">
                                                                                                <div class="row">
                                                                                                    <div class="col-xs-6">
                                                                                                        <h5 class="panel-title">成品信息</h5>
                                                                                                    </div>
                                                                                                    <div class="col-xs-6">
                                                                                                         <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                                                            <!--搜索框 -->
                                                                                                            <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                <input class="form-control" type="text" placeholder="精准查询" maxlength="25" />
                                                                                                                <div class="input-group-btn">
                                                                                                                    <button type="button" class="btn btn-primary head-main-btn-2">
                                                                                                                        <i class="fa fa-search"></i>
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </form>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <!--panel-heading end -->
                                                                                            <div class="vueel">
                                                                                                <div class="panel-body-table table-height-10">
                                                                                                    <table class="table  table-bordered table-hover table-condensed">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th style="width: 5%;">序号</th>
                                                                                                                <th style="width: 10%;">成品名称</th>
                                                                                                                <th style="width: 10%;">成品编号</th>
                                                                                                                <th style="width: 10%;">型号</th>
                                                                                                                <th style="width: 10%;">产出时间</th>
                                                                                                                <th style="width: 15%;">操作</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr v-for="(val,key) in rejectsBatchs">
                                                                                                                <td>{{key+1}}</td>
                                                                                                                <td>{{val.semi_finish_name}}</td>
                                                                                                                <td>{{val.productElementNumber}}</td>
                                                                                                                <td>{{val.semi_finish_genre}}</td>
                                                                                                                <td>{{val.product_element_batch_time | times}}</td>
                                                                                                                <td class="table-input-td">
                                                                                                                    <a class="table-link" @click="productionDetails(value.production_plan_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产详情</a>
                                                                                                                    <a class="table-link" @click="pqcDetailsModel(val.work_order_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                                                                    <a class="table-link" @click="fqcDetailsModel(val)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>FQC详情</a>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            <tr v-if="!rejectsBatchs.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                                <div class="panel-footer panel-footer-table text-right">
                                                                                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                                                                                </div>
                                                                                            </div>
                                                                                            <!--panel-footer end -->
                                                                                        </div>
                                                                                    </transition>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                        <tbody v-if="!planList.length"  style="border:none">
                                                                            <tr><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div class="panel-footer panel-footer-table text-right">
                                                                    <el-pagination @current-change="handleCurrentChange2" background small layout="total,prev,pager,next" :current-page="currenPage2" :page-size="pagesize" :total="lines2"></el-pagination>
                                                                </div>
                                                            </div>
                                                            <!--panel-footer end -->
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
                if(forwardDirectionNum < 1){
                    run()
                }
                //生产详情模态框
                function productionDetailsModel(id){
                    let productionDetails = new Vue({
                        el:'#productionDetails',
                        data(){
                            return{
                                planList:[],
                                workOrderList:[]
                            }
                        },
                        methods:{
                            //工单详情
                            workOrderModel(id){
                                workOrderDetailsModel(id)
                            },
                           //pqc模态框
                            pqcDetailsModel(id){
                                pqcModal(id)
                            },
                        },
                        created(){
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryPlanParticularsUrl,
                                data:{planId:id},
                                beforeSend: (xml) => {
                                    mesloadBox.loadingShow()
                                  },
                                success: (result, status, xhr) => {
                                    mesloadBox.hide()
                                    if(result.status === 0){
                                        this.planList = result.map.plan
                                        this.workOrderList = result.map.plan.workOrderList

                                    }else{
                                        this.planList = []
                                        this.workOrderList = []
                                        this.lines = 0
                                    }
                                }
                            })
                        },
                        //渲染结束后执行
                        mounted(){
                            const modal = document.getElementById('productionDetails')   //模态框
                            $(modal).modal({
                                backdrop: 'static', // 黑色遮罩不可点击
                                keyboard: false,  // esc按键不可关闭模态框
                                show: true     //显示
                            })

                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                        },
                        template:`
                        <div class="modal fade" id="productionDetails">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="close" data-dismiss="modal">
                                            <span>
                                                <i class="fa fa-close"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!-- 生产详情 -->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">生产详情</h5>
                                                                </div>
                                                                <div class="col-xs-8">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:14%">订单编号</th>
                                                                        <td style="width:19%">{{planList.production_plan_order_number}}</td>

                                                                        <th style="width:14%">订单生产数</th>
                                                                        <td style="width:19%">{{planList.production_order_production_number}}</td>

                                                                        <th style="width:14%">是否新产</th>
                                                                        <td style="width:19%">{{planList.production_plan_judge_whether}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">工艺</th>
                                                                        <td style="width:19%">{{planList.craft_name}}</td>

                                                                        <th style="width:14%">工艺版本</th>
                                                                        <td style="width:19%">{{planList.craft_versions}}</td>

                                                                        <th style="width:14%">生产批次</th>
                                                                        <td style="width:19%">{{planList.production_plan_batch_number}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">实际开始日期</th>
                                                                        <td style="width:19%">{{planList.production_actual_start_time | times}}</td>

                                                                        <th style="width:14%">实际结束日期</th>
                                                                        <td style="width:19%">{{planList.production_actual_finish_time | times}}</td>

                                                                        <th style="width:14%">成品型号</th>
                                                                        <td style="width:19%">{{planList.product_model_name}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">成品类型</th>
                                                                        <td style="width:19%">{{planList.product_type_name}}</td>

                                                                        <th style="width:14%">生产线</th>
                                                                        <td style="width:19%">{{planList.product_line_name}}</td>

                                                                        <th style="width:14%">实际产出量</th>
                                                                        <td style="width:19%">{{planList.production_actual_output}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                    <!-- 工 序 -->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">工 序</h5>
                                                                </div>
                                                                <div class="col-xs-8">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:4%">序号</th>
                                                                        <th style="width:9%">工序名称</th>
                                                                        <th style="width:7%">极性</th>
                                                                        <th style="width:6%">版本</th>
                                                                        <th style="width:6%">优率</th>
                                                                        <th style="width:7%">产出量</th>
                                                                        <th style="width:7%">工序负责人</th>
                                                                        <th style="width:20%">操作</th>
                                                                    </tr>
                                                                    <tr v-for="(value,index) in workOrderList">
                                                                        <td>{{index+1}}</td>
                                                                        <td>{{value.workstage_name}}</td>
                                                                        <td>{{value.workstage_polarity}}</td>
                                                                        <td>{{value.production_plan_optimal_rate}}</td>
                                                                        <td>{{value.planQuotesWorkstage.workstage_quality_rate}}</td>
                                                                        <td>{{value.production_actual_output}}</td>
                                                                        <td>{{value.workstage_responsible}}</td>
                                                                        <td class="table-input-td">
                                                                            <a class="table-link" @click="workOrderModel(value.work_order_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                            <a class="table-link" @click="pqcDetailsModel(value.work_order_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                            <a class="table-link" href="productionPlan.html?num=1" target="_blank"><i class="fa fa-tasks fa-fw"></i>生产过程详情</a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
                //FQC模态框
                function fqcModel(value){

                    let addFinalQualityReportModal = new Vue({
                        el:'#addFinalQualityReportModal',
                        data(){
                            return {
                                fqcReport:[], //基础信息
                                fqcProjectResultList:[], //项目内容
                                fqcUnqualifiedList:[],
                            }
                        },
                        methods:{

                        },
                        created(){
                            value.semi_finish_id
                            value.product_element_batch_number
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryFQCReportUrl,
                                data: {  reportId:'63bb2dff1ad44ec98f06c2ef1208c9e7'},
                                beforeSend: (xml) => {
                                    mesloadBox.loadingShow()
                                },
                                success: (result, status, xhr) => {
                                    mesloadBox.hide()
                                    if(result.status === 0){
                                        this.fqcReport = result.map.fqcReport
                                        this.fqcProjectResultList = result.map.fqcReport.fqcProjectResultList
                                        this.fqcUnqualifiedList = result.map.fqcReport.fqcUnqualifiedList[0]
                                    }else{
                                        this.$notify({
                                            title: '没有可以显示的数据',
                                            message: '请确认无误后重新打开',
                                            type: 'warning'
                                        });
                                    }
                                }

                            })
                        },
                        mounted(){
                            const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                            $(modal).modal({
                                backdrop: 'static', // 黑色遮罩不可点击
                                keyboard: false,  // esc按键不可关闭模态框
                                show: true     //显示
                            })
                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            }
                        },
                        template:`
                        <div class="modal fade" id="addFinalQualityReportModal">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="close" data-dismiss="modal">
                                            <span>
                                                <i class="fa fa-close"></i>
                                            </span>
                                        </button>
                                        <h4 class="modal-title">FQC详情</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!--基础信息-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">基础信息</h5>
                                                                </div>
                                                                <div class="col-xs-8">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:14%">报告名称</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_report_name}}</td>

                                                                        <th style="width:14%">报告类型</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_report_type}}</td>

                                                                        <th style="width:14%">电池批号</th>
                                                                        <td style="width:19%">{{fqcReport.warehouse_product_batch}}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="width:14%">报检单号</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_report_number}}</td>

                                                                        <th style="width:14%">报检日期</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_publish_date | times}}</td>

                                                                        <th style="width:14%">客户名称</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_customer_name}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">电池型号</th>
                                                                        <td style="width:19%">{{fqcReport.warehouse_product_model}}</td>

                                                                        <th style="width:14%">容量档次</th>
                                                                        <td style="width:19%">{{fqcReport.warehouse_product_capacity_grade}}</td>

                                                                        <th style="width:14%"></th>
                                                                        <td class="table-input-td" style="width:19%"></td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                    <!--综合结果-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">综合结果</h5>
                                                                </div>
                                                                <div class="col-xs-8">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:14%">抽样数量</th>
                                                                        <td style="width:19%">{{fqcReport.warehouse_product_sample_number}}</td>

                                                                        <th style="width:14%">不良数量</th>
                                                                        <td style="width:19%">{{fqcUnqualifiedList.quality_fqc_unqualified_number}}</td>

                                                                        <th style="width:14%">不良率</th>
                                                                        <td style="width:19%">{{fqcUnqualifiedList.quality_fqc_unqualified_probability}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">报检数量</th>
                                                                        <td style="width:19%">{{fqcReport.warehouse_product_inspection_number}}</td>


                                                                        <th style="width:14%">检验人员</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_check_people}}</td>

                                                                        <th style="width:14%">检验日期</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_check_date | times}}</td>
                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">审核人员</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_check_auditor}}</td>

                                                                        <th style="width:14%">审查日期</th>
                                                                        <td style="width:19%">{{fqcReport.quality_fqc_check_auditor_date | times}}</td>

                                                                        <th style="width:14%">综合判定</th>
                                                                        <td class="table-input-td" style="width:19%">
                                                                            <select class="form-control" v-model="fqcReport.quality_fqc_comprehensive_result" disabled>
                                                                                <option value="">未选择</option>
                                                                                <option value="0">合格</option>
                                                                                <option value="1">不合格</option>
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                    <!--检验内容-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">检验内容</h5>
                                                                </div>
                                                                <div class="col-xs-8">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:5%">序号</th>
                                                                        <th style="width:12%">检验项目</th>
                                                                        <th style="width:9%">检验标准</th>
                                                                        <th style="width:9%">判定标准(IL)</th>
                                                                        <th style="width:9%">判定标准(AQL)</th>
                                                                        <th style="width:8%">测试方法</th>
                                                                        <th style="width:10%">判断</th>
                                                                        <th style="width:9%">不良内容</th>
                                                                        <th style="width:9%">不良数量</th>
                                                                    </tr>

                                                                    <tr v-for="(val,index) in fqcProjectResultList">
                                                                        <td>{{index+1}}</td>

                                                                        <td>{{val.qualityProject.quality_project_name}}</td>

                                                                        <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_criterion}}</td>

                                                                        <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_il_criterion}}</td>

                                                                        <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_aql_criterion}}</td>

                                                                        <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_check_method}}</td>

                                                                        <td class="table-input-td">
                                                                            <select class="form-control" v-model="val.quality_fqc_project_determine" disabled>
                                                                                <option value="-1">未选择</option>
                                                                                <option value="0">合格</option>
                                                                                <option value="1">不合格</option>
                                                                            </select>
                                                                        </td>

                                                                        <td>{{val.quality_fqc_project_content}}</td>

                                                                        <td>{{val.quality_fqc_project_number}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
            }
            break;
            case '#reverseAscend': {  //逆向追溯
                const swiper = document.getElementById('reverseAscend')   //右侧外部swiper
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
                function run(){
                    let panelBodyTableVM = new Vue({
                        el:'#reverseAscend',
                        data(){
                            return{
                                productionShow:false, //点击查询显示生产计划
                                materialShow:false, //点击生产计划对应行显示物料
                                searchsData:{
                                    batchNumber:'', //产出物批号
                                    productNumber:'', //产出物编号
                                    planId:'',
                                },
                                lines:0, //条数
                                currenPage:1, //当前页
                                pagesize: 10,   //页码
                                lines2:0, //条数
                                currenPage2:1, //当前页
                                reversePlanBatchs:[],//基础数据
                                tsreversePlanBatchs:[],//基础数据暂存 分页
                                orderMaterials:[],
                                workstageList:[]
                            }
                        },
                        methods:{
                            workAjax(){
                                $.ajax({
                                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                    url: queryReviewMaterialUrl,
                                    data: this.searchsData,
                                    beforeSend: (xml) => {
                                        mesloadBox.loadingShow()
                                    },
                                    success: (result, status, xhr) => {
                                        mesloadBox.hide()
                                        if(result.status === 0){
                                            this.workstageList = []
                                            var workstageList = []
                                            this.orderMaterials = result.map.orderMaterials

                                            result.map.orderMaterials.forEach((val,key) => { //遍历出去重的数据
                                                workstageList.push(val.workstage_name)
                                            })
                                            workstageList = [...new Set(workstageList)] //去重的数据

                                            workstageList.forEach((value,index) => { //创建不重复类型的二维数组
                                                this.workstageList.push([])
                                            })
                                            result.map.orderMaterials.forEach((val,key) => {  //推入不重复类型的二维数组
                                                workstageList.forEach((value,index) => {
                                                    if(val.workstage_name == value){
                                                        this.workstageList[index].push(val)
                                                    }
                                                })
                                            })

                                            this.lines2 = result.map.line
                                        }else{
                                            this.orderMaterials = []
                                            this.lines2 = 0
                                        }
                                    }
                                })
                            },
                            //IQC详情
                            iqcDetails(value){
                                iqcModel(value)
                            },
                            //物料详情
                            materialDetails(value){
                                materialDetailsModel(value)
                            },
                            //生产计划详情模态框
                            productionPlanDetails(id){
                                productionPlanDetailsModel(id)
                            },
                            //工单详情
                            workOrderModel(id){
                                workOrderDetailsModel(id)
                            },
                           //pqc模态框
                            pqcDetailsModel(id){
                                pqcModal(id)
                            },
                            //点击切换工序信息
                            twoDetails(){

                            },
                            //点击查询
                            searchs(){
                                this.searchsData.planId = ''
                                var search = false
                                for(val in this.searchsData){
                                    if(this.searchsData[val] !== ''){
                                        search = true
                                    }
                                }
                                this.tsreversePlanBatchs = []
                                if(search){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryReviewPlanUrl,
                                        data: this.searchsData,
                                        beforeSend: (xml) => {
                                            mesloadBox.loadingShow()
                                        },
                                        success: (result, status, xhr) => {
                                            mesloadBox.hide()
                                            if (result.status === 0) {

                                                result.map.reversePlanBatchs.forEach((val,key) => {
                                                    val.workOrderShow = false
                                                    this.tsreversePlanBatchs.push(val)
                                                })
                                                this.reversePlanBatchs = pagination(1, this.pagesize, this.tsreversePlanBatchs)
                                                this.lines =  result.map.reversePlanBatchs.length
                                            }else{
                                                this.reversePlanBatchs = []
                                                this.lines = 0
                                            }
                                        }
                                    })
                                    this.productionShow = true
                                }else{
                                    this.$message.error({
                                        message: '请先添加一个搜索条件',
                                        type: 'warning'
                                    })
                                }
                            },
                            //重置搜索
                            reset(){
                                for(val in this.searchsData){
                                    this.searchsData[val] = ''
                                }
                            },
                            //点击行数下拉对应工单
                            workOrder(value){
                                this.reversePlanBatchs.forEach((val,key) => {
                                    if(val.production_plan_id == value.production_plan_id){
                                        value.workOrderShow = !value.workOrderShow
                                    }else{
                                        val.workOrderShow = false
                                    }
                                })
                                this.searchsData.planId = value.production_plan_id
                                this.workAjax()
                            },
                            //分页变化
                            handleCurrentChange(val){
                                this.searchsData.headNum = (val - 1) * 10 + 1;
                                this.workAjax()
                            },
                            handleCurrentChange2(val){
                                this.reversePlanBatchs = pagination(val, this.pagesize, this.tsreversePlanBatchs)
                            }

                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            status(val){
                                if(val == 0){
                                    return '未开始'
                                }else if(val == 1){
                                    return '生产中'
                                }else if(val == 2){
                                    return '暂停'
                                }else if(val == 3){
                                    return '生产完成'
                                }else if(val == 4){
                                    return '停止'
                                }else{
                                    return ''
                                }
                            },
                            number(val){
                                if(val !== '' && val !== null){
                                    return val
                                }else{
                                    return 0
                                }
                            }
                        },
                        template:`
                        <div id="reverseAscend" class="swiper-slide">
                            <!-- 右侧外部swiper -->

                            <div class="container-fluid">
                                <div class="row">
                                    <div class="content-header">
                                        <div class="col-xs-10">
                                            <div class="content-header-tab">
                                                <div class="tab-logo">
                                                    <i class="fa fa-window-restore"></i>
                                                </div>
                                                <div class="tab-body">
                                                    <div class="tab-title">
                                                        <p>逆向追溯</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="container-fluid">
                                <div class="content-body swiper-container">
                                    <div class="swiper-wrapper">
                                        <div class="swiper-slide swiper-no-swiping" id="reverseAscendInerSwiper">
                                            <!-- 右侧内部swiper -->
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!-- 搜索框 -->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-6">
                                                                    <h5 class="panel-title">输入查询条件：</h5>
                                                                </div>
                                                                <div class="col-xs-6">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <!--panel-heading end -->
                                                        <div class="panel-body-table table-height" style="padding:5px">
                                                            <div class="row">
                                                                <div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                        <label class="control-label">电芯批号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.batchNumber">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-3 col-xs-5">
                                                                    <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                        <label class="control-label">电芯编号：</label>
                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="searchsData.productNumber">
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                                <div class="col-md-4 col-xs-6">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="panel-footer panel-footer-table ">
                                                            <div class="col-xs-6 text-right">
                                                            <button class="btn btn-primary submit-reset" @click="reset()">重 置</button>
                                                            </div>
                                                            <div class="col-xs-6 text-left">
                                                            <button class="btn btn-primary submit-search" @click="searchs()">查 询</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- 生产计划 -->
                                                    <transition name="search">
                                                        <div class="panel panel-default" v-if="productionShow">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-6">
                                                                        <h5 class="panel-title">生产计划</h5>
                                                                    </div>
                                                                    <div class="col-xs-6">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <!--panel-heading end -->
                                                            <div class="vueel">
                                                                <div class="panel-body-table table-height-10">
                                                                    <table class="table  table-bordered  table-condensed">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style="width: 20%;">订单编号</th>
                                                                                <th style="width: 20%;">生产批号</th>
                                                                                <th style="width: 20%;">订单生产数</th>
                                                                                <th style="width: 20%;">生产状态</th>
                                                                                <th style="width: 20%;">操作</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody v-for="(value,index) in reversePlanBatchs" style="border:none">
                                                                            <tr>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_plan_order_number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_plan_batch_number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.production_order_production_number | number}}</td>
                                                                                <td @click="workOrder(value)" style="cursor: pointer;">{{value.plan_production_status | status}}</td>

                                                                                <td class="table-input-td">
                                                                                    <a class="table-link" @click="productionPlanDetails(value.production_plan_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                    <a class="table-link pull-right" style="color:#000" @click="workOrder(value)" href="javascript:;"><i :class="value.workOrderShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right' "></i></a>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan=15 style="padding:0">
                                                                                    <transition name="workOrderFade">
                                                                                        <div v-if="value.workOrderShow" style="overflow:hidden;padding:5px">
                                                                                            <ul class="nav nav-tabs" role="tablist">
                                                                                                <li role="presentation" class="active"><a href="#materialsInformation" aria-controls="materialsInformation" role="tab" data-toggle="tab" >物料信息</a></li>
                                                                                                <li role="presentation"><a href="#processInformation" aria-controls="processInformation" role="tab" data-toggle="tab">工序信息</a></li>
                                                                                            </ul>
                                                                                            <div class="tab-content">
                                                                                                <!--物料信息-->
                                                                                                <div role="tabpanel" class="tab-pane active" id="materialsInformation">
                                                                                                    <div class="panel panel-default" >
                                                                                                        <div class="panel-heading panel-heading-table">
                                                                                                            <div class="row">
                                                                                                                <div class="col-xs-6">
                                                                                                                    <h5 class="panel-title">物料信息</h5>
                                                                                                                </div>
                                                                                                                <div class="col-xs-6">
                                                                                                                    <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                                                                        <!--搜索框 -->
                                                                                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                            <input class="form-control" type="text" placeholder="精准查询" maxlength="25" />
                                                                                                                            <div class="input-group-btn">
                                                                                                                                <button type="button" class="btn btn-primary head-main-btn-2">
                                                                                                                                    <i class="fa fa-search"></i>
                                                                                                                                </button>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </form>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <!--panel-heading end -->
                                                                                                        <div class="vueel">
                                                                                                            <div class="panel-body-table table-height-10">
                                                                                                                <table class="table  table-bordered table-hover table-condensed">
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th style="width: 5%;">序号</th>
                                                                                                                            <th style="width: 10%;">物料名称</th>
                                                                                                                            <th style="width: 10%;">物料编号</th>
                                                                                                                            <th style="width: 10%;">物料批次号</th>
                                                                                                                            <th style="width: 10%;">规格</th>
                                                                                                                            <th style="width: 10%;">型号</th>
                                                                                                                            <th style="width: 10%;">单位</th>
                                                                                                                            <th style="width: 15%;">操作</th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody>
                                                                                                                        <tr v-for="(value,index) in orderMaterials">
                                                                                                                            <td>{{index+1}}</td>
                                                                                                                            <td>{{value.craft_materiel_name}}</td>
                                                                                                                            <td>{{value.step_use_material_number}}</td>
                                                                                                                            <td>{{value.material_management_outofstorage_batch}}</td>
                                                                                                                            <td>{{value.craft_materiel_specifications}}</td>
                                                                                                                            <td>{{value.craft_materiel_model}}</td>
                                                                                                                            <td>{{value.craft_materiel_unit}}</td>
                                                                                                                            <td class="table-input-td">
                                                                                                                                <a class="table-link" @click="materialDetails(value.material)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>物料详情</a>
                                                                                                                                <a class="table-link" @click="iqcDetails(value)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>IQC详情</a>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                        <tr v-if="!orderMaterials.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                            <div class="panel-footer panel-footer-table text-right">
                                                                                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage2" :page-size="pagesize" :total="lines2"></el-pagination>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <!--panel-footer end -->

                                                                                                    </div>
                                                                                                </div>
                                                                                                <!-- 工序信息 -->
                                                                                                <div role="tabpanel" class="tab-pane" id="processInformation">
                                                                                                    <div class="panel panel-default">
                                                                                                        <div class="panel-heading panel-heading-table">
                                                                                                            <div class="row">
                                                                                                                <div class="col-xs-6">
                                                                                                                    <h5 class="panel-title">工序信息</h5>
                                                                                                                </div>
                                                                                                                <div class="col-xs-6">
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <!--panel-heading end -->
                                                                                                        <div class="vueel">

                                                                                                            <div class="panel-body-table table-height-10">
                                                                                                                <table class="table  table-bordered table-hover table-condensed">
                                                                                                                    <thead>
                                                                                                                        <tr>
                                                                                                                            <th style="width: 5%;">序号</th>
                                                                                                                            <th style="width: 10%;">工序名称</th>
                                                                                                                            <th style="width: 10%;">工序负责人</th>
                                                                                                                            <th style="width: 10%;">使用物料名称</th>
                                                                                                                            <th style="width: 10%;">物料编号</th>
                                                                                                                            <th style="width: 10%;">物料批次号</th>
                                                                                                                            <th style="width: 15%;">操作</th>
                                                                                                                        </tr>
                                                                                                                    </thead>
                                                                                                                    <tbody v-for="(value,index) in workstageList">
                                                                                                                        <tr v-for="(val,key) in value">
                                                                                                                            <td :rowspan="value.length" v-if="key == 0">{{index+1}}</td>
                                                                                                                            <td :rowspan="value.length"  v-if="key == 0">{{val.workstage_name}}</td>
                                                                                                                            <td :rowspan="value.length" v-if="key == 0">暂无</td>
                                                                                                                            <td>{{val.craft_materiel_name}}</td>
                                                                                                                            <td>{{val.step_use_material_number}}</td>
                                                                                                                            <td>{{val.workstage_name}}</td>
                                                                                                                            <td class="table-input-td" :rowspan="value.length" v-if="key == 0">
                                                                                                                                <a class="table-link" @click="workOrderModel(val.work_order_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                                                                                <a class="table-link" @click="pqcDetailsModel(val.work_order_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                                                                                <a class="table-link" href="productionPlan.html?num=1" target="_blank"><i class="fa fa-tasks fa-fw"></i>生产过程详情</a>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </tbody>
                                                                                                                    <tbody v-if="!workstageList.length">
                                                                                                                        <tr><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                                                                    </tbody>
                                                                                                                </table>
                                                                                                            </div>
                                                                                                            <div class="panel-footer panel-footer-table text-right">
                                                                                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <!--panel-footer end -->
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </transition>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                        <tbody v-if="!reversePlanBatchs.length"  style="border:none">
                                                                            <tr><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div class="panel-footer panel-footer-table text-right">
                                                                    <el-pagination @current-change="handleCurrentChange2" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                                                </div>
                                                            </div>
                                                            <!--panel-footer end -->

                                                        </div>
                                                    </transition>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
                if(reverseNum < 1){
                    run()
                }
                //IQC详情
                function iqcModel(value){
                    let addInQualityReportModal = new Vue({
                        el:'#addInQualityReportModal',
                        data(){
                            return {
                                iqcReports:[],//基础数据
                                iqcRecords:[],//项目
                                iqcResults:[],//检验结果
                                iqcUnqualified:[],
                            }
                        },
                        mounted(){
                            const modal = document.getElementById('addInQualityReportModal')   //模态框
                            $(modal).modal({
                                backdrop: 'static', // 黑色遮罩不可点击
                                keyboard: false,  // esc按键不可关闭模态框
                                show: true     //显示
                            })
                        },
                        created(){
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryIQCReportUrl,
                                data:{materialId: value.craft_materiel_id,materialBatch:value.material_management_outofstorage_batch},
                                success: (result, status, xhr) => {
                                    if(result.status === 0 ){

                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: queryIQCReportRecordUrl,
                                            data:{reportId:result.map.iqcReports[0].quality_iqc_report_id},
                                            success: (result, status, xhr) => {
                                                if(result.status === 0 ){
                                                    this.iqcReports = result.map.iqcReports[0]
                                                    this.iqcRecords = result.map.iqcRecords
                                                    this.iqcResults = result.map.iqcResults
                                                    if(result.map.iqcUnqualifieds){
                                                        this.iqcUnqualified = result.map.iqcUnqualifieds
                                                    }

                                                }else{
                                                    this.iqcReports = []
                                                    this.iqcRecords = []
                                                    this.iqcResults = []
                                                    this.iqcUnqualified = []
                                                }

                                            }
                                        })
                                    }else{
                                        this.iqcReports = []
                                        this.iqcRecords = []
                                        this.iqcResults = []
                                        this.iqcUnqualified = []
                                        this.$notify({
                                            title: '没有可以显示的数据',
                                            message: '请确认无误后重新打开',
                                            type: 'warning'
                                        });
                                    }

                                }
                            })
                        },
                        methods:{
                            //选择物料模板事件
                            material(){
                                let promise = new Promise(function (resolve, reject) {
                                    materialModel(resolve,null,null)
                                })
                                promise.then( (resolveData) => {
                                    console.log(resolveData)
                                })

                            },
                            //尺寸特性查看事件
                            examine(data){
                                sampling(data)
                            },
                        },
                        filters:{
                            times(val){
                                if(val !== '' && val !== null){
                                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                }
                            },
                            determine(val){
                                if(val == 0){
                                    return '合格'
                                }else if(val == 1){
                                    return '不合格'
                                }else{
                                    return '未选择'
                                }
                            }
                        },
                        watch:{
                        //     iqcProjectResult:{
                        //         handler(newValue, oldValue) {
                        //             this.sendJudgment.iqcProjectResult++
                        // 　　　　 },
                        // 　　　　 deep: true
                        //     },
                        },
                        template:`
                        <div class="modal fade" id="addInQualityReportModal">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="close" data-dismiss="modal">
                                            <span>
                                                <i class="fa fa-close"></i>
                                            </span>
                                        </button>
                                        <h4 class="modal-title">IQC详情</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!--基础信息-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">基础信息</h5>
                                                                </div>
                                                                <div class="col-xs-8">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered table-condensed" >
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:14%">报告名称</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_report_name}}</td>

                                                                        <th style="width:14%">IQC单号</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_report_number}}</td>

                                                                        <th style="width:14%">报验日期</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_inspection_date | times}}</td>

                                                                    </tr>

                                                                    <tr>
                                                                        <th style="width:14%">物料名称</th>
                                                                        <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_name : ''}}</td>

                                                                        <th style="width:14%">规格</th>
                                                                        <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_standard : ''}}</td>

                                                                        <th style="width:14%">型号</th>
                                                                        <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_model : ''}}</td>

                                                                    </tr>
                                                                    <tr>
                                                                        <th style="width:14%">物料批号</th>
                                                                        <td style="width:19%">{{iqcReports.warehouse_material_batch}}</td>

                                                                        <th style="width:14%">数 量</th>
                                                                        <td style="width:19%">{{iqcReports.warehouse_material_number}}</td>

                                                                        <th style="width:14%">单 位</th>
                                                                        <td style="width:19%">{{iqcReports.warehouse_material_units}}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="width:14%">审核人</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_examine}}</td>

                                                                        <th style="width:14%">审核日期</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_examine_date | times}}</td>

                                                                        <th style="width:14%">综合判定结果</th>
                                                                        <td class="table-input-td">
                                                                            <select class="form-control" v-model="iqcReports.quality_iqc_comprehensive_result" disabled>
                                                                                <option value="">未选择</option>
                                                                                <option value="0">合格</option>
                                                                                <option value="1">不合格</option>
                                                                            </select>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="width:14%">批准人</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_approve}}</td>

                                                                        <th style="width:14%">批准日期</th>
                                                                        <td style="width:19%">{{iqcReports.quality_iqc_approve_date | times}}</td>

                                                                        <th style="width:14%">供应厂商</th>
                                                                        <td style="width:19%">{{iqcReports.supplier ? iqcReports.supplier.supplier_name : ''}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                        </div>

                                                    </div>

                                                    <!--检验结果-->
                                                    <el-collapse accordion>
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">检验结果</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:10%">区 分</th>
                                                                        <th style="width:10%">检查水平</th>
                                                                        <th style="width:10%">AC</th>
                                                                        <th style="width:10%">RC</th>
                                                                        <th style="width:10%">抽样数量</th>
                                                                        <th style="width:10%">检验结果</th>
                                                                        <th style="width:10%">检验员</th>
                                                                        <th style="width:15%">检验日期</th>
                                                                    </tr>
                                                                    <tr v-for="(value,index) in iqcResults">
                                                                        <th>{{value.qualityProject.quality_project_name}}</th>

                                                                        <td>{{value.quality_iqc_check_level}}</td>

                                                                        <td>{{value.quality_iqc_receive_ac_level}}</td>

                                                                        <td>{{value.quality_iqc_receive_rc_level}}</td>

                                                                        <td>{{value.quality_iqc_result_number}}</td>

                                                                        <td class="table-input-td">
                                                                            <select class="form-control" v-model="value.quality_iqc_check_result" disabled>
                                                                                <option value="null">未选择</option>
                                                                                <option value="0">合格</option>
                                                                                <option value="1">不合格</option>
                                                                            </select>
                                                                        </td>

                                                                        <td>{{value.quality_iqc_checker}}</td>

                                                                        <td>{{value.quality_iqc_check_date | times}}</td>
                                                                    </tr>
                                                                    <tr v-if="!iqcResults.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>

                                                    <!--不合格内容-->
                                                    <el-collapse accordion>
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">不合格内容</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:10%">不合格内容</th>
                                                                        <th style="width:10%">抽样数</th>
                                                                        <th style="width:10%">不良数</th>
                                                                        <th style="width:10%">不良率</th>
                                                                        <th style="width:10%">备注</th>
                                                                    </tr>
                                                                    <tr v-for="(value,index) in iqcUnqualified" >

                                                                        <td>{{value.quality_iqc_unqualified_content}}</td>

                                                                        <td>{{value.quality_sample_number}}</td>

                                                                        <td>{{value.quality_iqc_unqualified_number}}</td>

                                                                        <td>{{value.quality_iqc_unqualified_probability}}</td>

                                                                        <td></td>
                                                                    </tr>
                                                                    <tr v-if="!iqcUnqualified.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>

                                                    <!--外观-->
                                                    <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name !== '尺寸检验' && val.quality_project_type_name !== 'RS控制' && val.quality_project_type_name !== '附录' && val.quality_project_type_name !== '检验结果'">
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:20%">检验内容</th>
                                                                        <th style="width:20%">检测方式</th>
                                                                        <th style="width:20%">检验标准</th>
                                                                        <th style="width:20%">检验结果</th>
                                                                    </tr>
                                                                    <tr v-for = "(value, index) in val.qualityProjects">
                                                                        <td>{{value.quality_project_name}}</td>
                                                                        <td>{{value.qualityIqcAppliance ? value.qualityIqcAppliance.quality_appliance_number : ''}}</td>
                                                                        <td>{{value.iqcProjectStandard ? value.iqcProjectStandard.quality_iqc_project_criterion : ''}}</td>
                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_determine | determine}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>

                                                    <!--尺寸检验-->
                                                    <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == '尺寸检验'">
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">尺寸检验</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:9%">检验项目</th>
                                                                        <th style="width:7%">检验工具</th>
                                                                        <th style="width:7%">检验标准</th>
                                                                        <th style="width:7%">规格</th>
                                                                        <th style="width:7%">单位</th>
                                                                        <th style="width:6%">上限</th>
                                                                        <th style="width:6%">下限</th>
                                                                        <th style="width:7%">抽验情况</th>
                                                                        <th style="width:7%">平均值</th>
                                                                        <th style="width:7%">极差</th>
                                                                        <th style="width:10%">判定</th>
                                                                    </tr>
                                                                    <tr v-for="(value, index) in val.qualityProjects">

                                                                        <td>{{value.quality_project_name}}</td>

                                                                        <td>{{value.qualityIqcAppliance.quality_appliance_number}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_standard}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_units}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_up}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_down}}</td>

                                                                        <td class="table-input-td"><a class="table-link" @click="examine(value.iqcProjectResult)" href="javascript:;">查看</a></td>


                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_average_value}}</td>


                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_range}}</td>

                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_determine | determine}}</td>

                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>

                                                    <!--RS控制-->
                                                    <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == 'RS控制'">
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">RS控制</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:10%">检验项目</th>
                                                                        <th style="width:10%">检验工具</th>
                                                                        <th style="width:10%">检验标准</th>
                                                                        <th style="width:10%">抽验数量</th>
                                                                        <th style="width:10%"> RS判定</th>
                                                                    </tr>

                                                                    <tr v-for="(value, index) in val.qualityProjects">
                                                                        <td>{{value.quality_project_name}}</td>

                                                                        <td>{{value.qualityIqcAppliance.quality_appliance_number}}</td>

                                                                        <td>{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>

                                                                        <td>{{value.iqcProjectResult ? value.iqcProjectResult.quality_iqc_project_number : ''}}</td>

                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_determine | determine}}</td>

                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>

                                                    <!--附录-->
                                                    <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == '附录'">
                                                        <el-collapse-item>
                                                            <template slot="title">
                                                                <div class="panel-heading panel-heading-table">
                                                                    <div class="row">
                                                                        <div class="col-xs-12">
                                                                            <h5 class="panel-title">附录</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </template>
                                                            <table class="table table-bordered table-condensed">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width:10%">附录</th>
                                                                        <th style="width:10%">备注</th>
                                                                        <th style="width:10%">结果</th>
                                                                    </tr>

                                                                    <tr v-for="(value, index) in val.qualityProjects">
                                                                        <td>{{value.quality_project_name}}</td>
                                                                        <td>{{value.iqcResult}}</td>
                                                                        <td>{{value.iqcProjectResult.quality_iqc_project_determine | determine}}</td>

                                                                    </tr>
                                                                    <tr v-if="!iqcRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </el-collapse-item>
                                                    </el-collapse>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
                //尺寸特性抽样结果查看
                function sampling(data){
                    let samplingResults = new Vue({
                        el:'#samplingResults ',
                        data(){
                            return {
                                samplingRow:[],
                                samplingValue:data,

                            }
                        },
                        mounted(){
                            const modal = document.getElementById('samplingResults')   //模态框
                            $(modal).modal({
                                backdrop: 'static', // 黑色遮罩不可点击
                                keyboard: false,  // esc按键不可关闭模态框
                                show: true     //显示
                            })
                            $(modal).on('hidden.bs.modal', function (e) {
                                $('body').addClass('modal-open')
                            })
                        },
                        created(){
                            if(data.quality_iqc_project_number !== "" && data.quality_iqc_project_value !== ""){
                                var num = data.quality_iqc_project_number.split(',')
                                var value = data.quality_iqc_project_value.split(',')

                                num.forEach((val,key) => {
                                    this.samplingRow.push({
                                        num:val,
                                        value:value[key]
                                    })
                                })
                            }
                        },
                        methods:{

                        },

                        watch:{
                            samplingRow:{
                                handler: function (val, oldVal) {
                                    // console.log(val)
                                },
                                deep: true
                            },
                            deep:true
                        },
                        template:`
                        <div class="modal fade" id="samplingResults">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button class="close" data-dismiss="modal">
                                            <span>
                                                <i class="fa fa-close"></i>
                                            </span>
                                        </button>
                                        <h4 class="modal-title">物料模板</h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <!--抽样情况-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">抽样情况</h5>
                                                                </div>
                                                                <div class="col-xs-8">
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th style="width: 10%">序号</th>
                                                                        <th style="width: 40%">抽样数量</th>
                                                                        <th style="width: 40%">抽样结果</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                    <tr v-for="(val,index) in samplingRow">
                                                                        <td>{{index+1}}</td>
                                                                        <td>{{val.num}}</td>

                                                                        <td>{{val.value}}</td>
                                                                    </tr>
                                                                    <tr v-if="!samplingRow.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </div>
                                                    <!--抽样结果-->
                                                    <div class="panel panel-default">
                                                        <div class="panel-heading panel-heading-table">
                                                            <div class="row">
                                                                <div class="col-xs-4">
                                                                    <h5 class="panel-title">抽样结果</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <table class="table table-bordered">
                                                                <tbody>
                                                                    <tr>
                                                                        <th style="width: 50%">平均值</th>
                                                                        <td>{{samplingValue.quality_iqc_project_average_value}}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style="width: 50%">极差</th>
                                                                        <td>{{samplingValue.quality_iqc_project_range}}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `
                    })
                }
            }
            break;
        }
    })
    leftNavLink.eq(0).trigger('click');
    /********************************模态框*****************************/
    //生产计划详情模态框
    function productionPlanDetailsModel(id){
        let productionPlanDetails = new Vue({
            el:'#productionPlanDetails',
            data(){
                return{
                    planData:'', //数据,
                    planUseMaterialList:[], //BOM清单数据
                    lines:0, //条数
                    search:'', //搜索框值
                    currenPage:1, //当前页
                    pagesize: 15,   //页码
                }
            },
            methods:{
                //查看物料使用详情
                materialDetails(id){
                    bomMaterialDetailModal(id)
                },

                //分页变化
                handleCurrentChange(val){
                    // this.ajaxData.headNum = (val - 1) * 10 + 1;
                    // queryFun(queryStaffUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    // this.ajaxData.staffName = this.search
                    // this.currenPage = 1
                    // queryFun(queryStaffUrl,this.ajaxData)
                }
            },
            //渲染前后执行
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPlanParticularsUrl,
                    data: {planId:id},
                    beforeSend: (xml) => {
                        mesloadBox.loadingShow()
                      },
                    success: (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0){
                            this.planData = result.map.plan
                            this.planUseMaterialList = result.map.plan.planUseMaterialList
                            this.lines =  result.map.plan.planUseMaterialList.length
                        }
                    }
                })
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('productionPlanDetails')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
            },
            template:`
            <div class="modal fade" id="productionPlanDetails">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <!-- 生产计划信息 -->
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <h5 class="panel-title">生产计划信息</h5>
                                                    </div>
                                                    <div class="col-xs-8">
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <table class="table table-bordered table-condensed">
                                                    <tbody>
                                                        <tr>
                                                            <th style="width:14%">订单编号</th>
                                                            <td style="width:19%">{{planData.production_plan_order_number}}</td>

                                                            <th style="width:14%">是否新产</th>
                                                            <td style="width:19%">{{planData.production_plan_judge_whether}}</td>

                                                            <th style="width:14%">生产批号</th>
                                                            <td style="width:19%">{{planData.production_plan_batch_number}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">生产优先级</th>
                                                            <td style="width:19%">{{planData.production_plan_production_priority}}</td>

                                                            <th style="width:14%">产品类型</th>
                                                            <td style="width:19%">{{planData.product_type_name}}</td>

                                                            <th style="width:14%">产品型号</th>
                                                            <td style="width:19%">{{planData.product_model_name}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">工艺</th>
                                                            <td style="width:19%">{{planData.craft_name}}</td>

                                                            <th style="width:14%">工艺版本</th>
                                                            <td style="width:19%">{{planData.craft_versions}}</td>

                                                            <th style="width:14%">生产线</th>
                                                            <td style="width:19%">{{planData.product_line_name}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">优率</th>
                                                            <td style="width:19%">{{planData.production_plan_optimal_rate}}</td>

                                                            <th style="width:14%">产品容量</th>
                                                            <td style="width:19%">{{planData.product_model_capacity}}</td>

                                                            <th style="width:14%">产品型号单位</th>
                                                            <td style="width:19%">{{planData.product_model_unit}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">订单生产数</th>
                                                            <td style="width:19%">{{planData.production_order_production_number}}</td>

                                                            <th style="width:14%">批次排产数</th>
                                                            <td style="width:19%">{{planData.production_batch_production_number}}</td>

                                                            <th style="width:14%">排产优率</th>
                                                            <td style="width:19%">{{planData.production_scheduling_optimization_rate}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">实际产出量</th>
                                                            <td style="width:19%">{{planData.production_actual_output}}</td>

                                                            <th style="width:14%">预计产出量</th>
                                                            <td style="width:19%">{{planData.production_expected_output}}</td>

                                                            <th style="width:14%">排产容量</th>
                                                            <td style="width:19%">{{planData.production_scheduling_capacity}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">创建人</th>
                                                            <td style="width:19%">{{planData.production_founder_staff}}</td>

                                                            <th style="width:14%">计划审核人</th>
                                                            <td style="width:19%">{{planData.production_verifier_staff}}</td>

                                                            <th style="width:14%">计划负责人</th>
                                                            <td style="width:19%">{{planData.production_responsible_staff}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">创建时间</th>
                                                            <td style="width:19%">{{planData.production_creation_time | times}}</td>

                                                            <th style="width:14%">预定开始时间</th>
                                                            <td style="width:19%">{{planData.production_scheduled_start_time | times}}</td>

                                                            <th style="width:14%">预定完成时间</th>
                                                            <td style="width:19%">{{planData.production_estimated_completion_time | times}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">实际开始时间</th>
                                                            <td style="width:19%">{{planData.production_actual_start_time | times}}</td>

                                                            <th style="width:14%">实际完成时间</th>
                                                            <td style="width:19%">{{planData.production_actual_finish_time | times}}</td>

                                                            <th style="width:14%"></th>
                                                            <td style="width:19%"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                        <!--使用的BOM清单 -->
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <h5 class="panel-title">使用的BOM清单</h5>
                                                    </div>
                                                    <div class="col-xs-8">
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <table class="table table-bordered table-condensed">
                                                    <tbody>
                                                        <tr>
                                                            <th style="width:5%">序号</th>
                                                            <th style="width:10%">名称</th>
                                                            <th style="width:10%">规格</th>
                                                            <th style="width:15%">型号</th>
                                                            <th style="width:10%">供应商</th>
                                                            <th style="width:10%">所需总量</th>
                                                            <th style="width:10%">单位</th>
                                                            <th style="width:10%">实际库存</th>
                                                            <th style="width:10%">预计库存</th>
                                                            <th style="width:10%">操作</th>
                                                        </tr>
                                                        <tr v-for="(value,index) in planUseMaterialList">
                                                            <td style="width:4%">{{index+1}}</td>
                                                            <td style="width:10%">{{planData.craft_bom_name}}</td>
                                                            <td style="width:10%">{{value.warehouse_material_standard}}</td>
                                                            <td style="width:16%">{{value.warehouse_material_model}}</td>
                                                            <td style="width:10%">{{value.supplier_name}}</td>
                                                            <td style="width:10%">{{value.plan_required_amount}}</td>
                                                            <td style="width:10%">{{value.warehouse_material_units}}</td>
                                                            <td style="width:10%">{{value.plan_quotes_actual_inventory}}</td>
                                                            <td style="width:10%">{{value.plan_quotes_anticipated_stock}}</td>
                                                            <td class="table-input-td" style="width:10%">
                                                                <a class="table-link" @click="materialDetails(planData.craft_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>物料详情</a>
                                                            </td>
                                                        </tr>
                                                        <tr v-show="!planUseMaterialList.length">
                                                            <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :total="lines" :page-size="pagesize"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //PQC模态框
    function pqcModal(reportId) {
        let modalBodyTableVM = new Vue({
            el: '#commonModal1',
            data() {
                return {
                    dataList: [],//
                    materialConfirms:[], //
                    environmentData:[], //环境条件
                    materialsData:[], //来料确认
                    semiFinishedData:[], //半成品参数
                    devicesData:[], //设备参数
                    otherData:[], //其它参数
                }
            },
            methods: {
                queryFun(){
                },
                //来料参数详情
                materiaParamlDetail(data) {
                    // console.log(value)
                    materialDetailModal(data)
                },
                //附加参数详情
                attachParamDetail(data) {
                    attachParamDetailModal(data)
                },
            },
            mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCReportRecordUrl,
                    data: {
                        headNum:1,
                        type:'detai',
                        orderId:reportId},
                    beforeSend: (xml) => {
                        mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0){
                            this.dataList = result.map.pqcReport
                            this.materialConfirms = result.map.materialConfirms

                            result.map.pqcReport.qualityProjectTypes.forEach((val,key) => {
                                if(val.quality_project_type_name === '环境条件'){
                                    this.environmentData = val.qualityProjects
                                }else if(val.quality_project_type_name === '半成品参数'){
                                    this.semiFinishedData = val.qualityProjects
                                }else if(val.quality_project_type_name === '设备参数'){
                                    this.devicesData = val.qualityProjects
                                }else if(val.quality_project_type_name === '其它'){
                                    this.otherData = val.qualityProjects
                                }
                            })
                        }else{
                            this.$notify({
                                title: '没有可以显示的数据',
                                message: '请确认无误后重新打开',
                                type: 'warning'
                            });
                        }
                    }

                })
            },
            filters: {
                times(val) {
                    // return
                    if (val !== '' && val !== null) {
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                parameter(val){
                    var data = []
                    val.forEach((value,key) => {
                        data.push(value.quality_project_name)
                    })
                    return data.toString()
                }
            },
            template: `
            <div class="modal fade" id="commonModal1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">PQC详情</h4>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                                <div class="col-xs-4">
                                                <h5 class="panel-title">基础信息</h5>
                                                </div>
                                                <div class="col-xs-8">


                                                </div>
                                            </div>
                                            </div>
                                            <div>
                                            <table class="table table-bordered table-condensed">
                                                <tbody >
                                                    <tr>
                                                        <th style="width:14%">报告名称</th>
                                                        <td style="width:19%">{{dataList.quality_pqc_report_name}}</td>
                                                        <th style="width:14%">表单编号</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_report_number}}</td>
                                                        <th style="width:14%">生产日期</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_product_date | times}}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style="width:14%">生产批次</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_product_batch}}</td>
                                                        <th style="width:14%">工单号</th>
                                                        <td style="width:19%" >{{dataList.plan_work_order_id}}</td>
                                                        <th style="width:14%">检验方式</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_checkWay}}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style="width:14%">设备编号</th>
                                                        <td  style="width:19%">{{dataList.devicesNumber}}</td>
                                                        <th style="width:14%">班次</th>
                                                        <td  style="width:19%">{{dataList.className}}</td>
                                                        <th style="width:14%">操作员</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_operation}}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style="width:14%">半成品名称</th>
                                                        <td  style="width:19%" >{{dataList.semiFinishName}}</td>
                                                        <th style="width:14%">半成品型号</th>
                                                        <td  style="width:19%" >{{dataList.semi_finish_genre}}</td>
                                                        <th style="width:14%">半成品单位</th>
                                                        <td  style="width:19%" >{{dataList.semi_finish_unit}}</td>
                                                    </tr>

                                                    <tr>
                                                        <th style="width:14%">检查数量</th>
                                                        <td  style="width:19%" >{{dataList.semi_finish_number}}</td>
                                                        <th style="width:14%">良品数</th>
                                                        <td  style="width:19%" >{{dataList.semi_finish_output}}</td>
                                                        <th style="width:14%">良品率</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_result}}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style="width:14%">检查员</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_check}}</td>
                                                        <th style="width:14%">检验日期</th>
                                                        <td  style="width:19%">{{dataList.quality_pqc_check_date | times}}</td>
                                                        <th style="width:14%">完成状态</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_report_complete == 0 ? '已完成' :'未完成'}}</td>
                                                    </tr>
                                                    <tr>
                                                        <th style="width:14%">审核人</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_examine}}</td>
                                                        <th style="width:14%">审核日期</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_examine_date | times}}</td>
                                                        <th style="width:14%">备注</th>
                                                        <td  style="width:19%" >{{dataList.quality_pqc_remarks}}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            </div>

                                        </div>
                                        <!--环境条件-->
                                        <el-collapse accordion>
                                            <el-collapse-item>
                                                <template slot="title">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <h5 class="panel-title">环境条件</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <table class="table table-bordered table-condensed">
                                                    <thead>
                                                    <tr>
                                                        <th style="width:30%">参数名称</th>
                                                        <th style="width:30%">标准</th>
                                                        <th style="width:40%">实测记录</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(value, index) in environmentData">
                                                        <td>{{value.quality_project_name}}</td>
                                                        <td>{{value.pqcProjectStandard.quality_pqc_project_criterion}}</td>
                                                        <td>{{value.pqcReportRecord.quality_pqc_project_criterion_value}}</td>
                                                    </tr>
                                                    <tr v-show="!environmentData.length">
                                                        <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!--来料确认-->
                                        <el-collapse accordion>
                                            <el-collapse-item>
                                                <template slot="title">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <h5 class="panel-title">来料确认</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <table class="table table-bordered table-condensed">
                                                    <thead>
                                                        <tr>
                                                        <th style="width:15%">物料名称</th>
                                                        <th style="width:45%">参数</th>
                                                        <th style="width:15%">详情</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(value, index) in materialConfirms">
                                                        <td>{{value.materialName}}</td>
                                                        <td>{{value.qualityProjects | parameter}}</td>
                                                        <td class="table-input-td">
                                                            <a
                                                            class="table-link"
                                                            href="javascript:;"
                                                            @click = "materiaParamlDetail(value.qualityProjects)"
                                                            >
                                                            <i class="fa fa-tasks fa-fw"></i>查看</a>
                                                        </td>
                                                        </tr>
                                                        <tr v-show="!materialConfirms.length">
                                                            <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!--半成品参数-->
                                        <el-collapse accordion>
                                            <el-collapse-item>
                                                <template slot="title">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <h5 class="panel-title">半成品参数</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <table class="table table-bordered table-condensed">
                                                    <thead>
                                                    <tr>
                                                        <th style="width:15%">参数名称</th>
                                                        <th style="width:15%">标准一(单面)</th>
                                                        <th style="width:15%">实测一</th>
                                                        <th style="width:15%">标准一(单面)</th>
                                                        <th style="width:15%">实测二</th>
                                                        <th style="width:15%">附加参数</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(value, index) in semiFinishedData">
                                                        <td>{{value.quality_project_name}}</td>
                                                        <td>{{value.pqcProjectStandard.quality_pqc_project_criterion_one}}</td>
                                                        <td>{{value.pqcReportRecord.quality_pqc_project_criterion_one_value}}</td>
                                                        <td>{{value.pqcProjectStandard.quality_pqc_project_criterion_two}}</td>
                                                        <td>{{value.pqcReportRecord.quality_pqc_project_criterion_two_value}}</td>
                                                        <td class="table-input-td">
                                                        <a
                                                            class="table-link"
                                                            href="javascript:;"
                                                            @click = "attachParamDetail(value.pqcProjectAttachs)"
                                                        >
                                                        <i class="fa fa-tasks fa-fw"></i>查看</a>
                                                        </td>
                                                    </tr>
                                                    <tr v-show="!semiFinishedData.length">
                                                        <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                    </tr>


                                                    </tbody>
                                                </table>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!--设备参数-->
                                        <el-collapse accordion>
                                            <el-collapse-item>
                                                <template slot="title">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <h5 class="panel-title">设备参数</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <table class="table table-bordered table-condensed">
                                                    <thead>
                                                    <tr>
                                                        <th style="width:30%">参数名称</th>
                                                        <th style="width:30%">标准</th>
                                                        <th style="width:40%">实测记录</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(value, index) in devicesData">
                                                        <td>{{value.quality_project_name}}</td>
                                                        <td>{{value.pqcProjectStandard.quality_pqc_project_criterion}}</td>
                                                        <td>{{value.pqcReportRecord.quality_pqc_project_criterion_value}}</td>

                                                    </tr>
                                                    <tr v-show="!devicesData.length">
                                                        <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </el-collapse-item>
                                        </el-collapse>

                                        <!--其它参数-->
                                        <el-collapse accordion>
                                            <el-collapse-item>
                                                <template slot="title">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <h5 class="panel-title">其它参数</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <table class="table table-bordered table-condensed">
                                                    <thead>
                                                    <tr>
                                                        <th style="width:30%">参数名称</th>
                                                        <th style="width:30%">标准</th>
                                                        <th style="width:40%">实测记录</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr v-for="(value, index) in otherData">
                                                        <td>{{value.quality_project_name}}</td>
                                                        <td>{{value.pqcProjectStandard.quality_pqc_project_criterion}}</td>
                                                        <td>{{value.pqcReportRecord.quality_pqc_project_criterion_value}}</td>
                                                    </tr>
                                                    <tr v-show="!otherData.length">
                                                        <td colspan=15 class="text-center text-warning">没有可以显示的数据</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </el-collapse-item>
                                        </el-collapse>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //PQC报告来料参数详情模态框
    function materialDetailModal(dataList) {
        // console.dir(type)
        // 当前页面vue实例
        let panelBodyTableVM = new Vue({
            el: '#commonModal2',
            data() {
            return {
                tbodyData: dataList,  //表格数据
                isDataChange: 0, //判断数据是否改变
            }
            },
            //弹出模态框
            mounted() {
            const modal = document.getElementById('commonModal2')   //模态框
            $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
            })
            $(modal).on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open')
            })
            },
            methods: {

            },

            watch: {
            tbodyData: {
                handler(newValue, oldValue) {
                this.isDataChange += 1
                // 　　　　　　console.log(newValue)
                },
                deep: true
            },

            },
            template: `
            <div class="modal fade" id="commonModal2">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">
                            <span>
                                <i class="fa fa-close"></i>
                            </span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                <div class="row">
                                    <div class="col-xs-6">
                                    <h5 class="panel-title">来料参数详情</h5>
                                    </div>
                                    <div class="col-xs-6">
                                    </div>
                                </div>
                                </div>
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered">
                                    <thead>
                                        <tr>
                                        <th style="width: 30%;">参数名称</th>
                                        <th style="width: 30%;">参数值</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(val,key) in tbodyData">
                                            <td>{{val.quality_project_name}}</td>
                                            <td>{{val.pqcMaterialRecord.quality_material_confirm_value}}</td>
                                        </tr>
                                        <tr v-show="!tbodyData.length">
                                            <td colspan=15 class="text-center text-warning">
                                            没有可以显示的数据，请重新选择或输入查询条件
                                            </td>
                                          </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
            `
        })
        // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

    }

    //报告附加参数详情模态框
    function attachParamDetailModal(dataList) {
        // console.dir(dataList)
        // 当前页面vue实例
        let panelBodyTableVM = new Vue({
            el: '#commonModal2',
            data() {
            return {
                tbodyData: dataList,  //表格数据
                isDataChange: 0, //判断数据是否改变
            }
            },

            mounted() {
            const modal = document.getElementById('commonModal2')   //模态框
            $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
            })
            $(modal).on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open')
            })
            },
            methods: {

            },

            watch: {
            tbodyData: {
                handler(newValue, oldValue) {
                this.isDataChange += 1
                // 　　　　　　console.log(newValue)
                },
                deep: true
            },

            },
            template: `
            <div class="modal fade" id="commonModal2">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">
                            <span>
                                <i class="fa fa-close"></i>
                            </span>
                        </button>
                        <h4 class="modal-title"></h4>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                <div class="row">
                                    <div class="col-xs-6">
                                        <h5 class="panel-title">附加参数详情</h5>
                                    </div>
                                    <div class="col-xs-6">
                                    </div>
                                </div>
                                </div>
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered">
                                    <thead>
                                        <tr>
                                        <th style="width: 30%;">参数名称</th>
                                        <th style="width: 30%;">参数值</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(val,key) in tbodyData">
                                        <td>{{val.quality_pqc_project_attach_name}}</td>
                                        <td>{{val.pqcProjectAttachRecord.quality_pqc_project_attach_record_value}}</td>
                                        </tr>
                                        <tr v-show="!tbodyData.length">
                                            <td colspan=15 class="text-center text-warning">
                                            没有可以显示的数据，请重新选择或输入查询条件
                                            </td>
                                          </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
            `
        })

    }

    //物料详情模态框
    function materialDetailsModel(value){
        let materialDetails = new Vue({
            el:'#materialDetails',
            data(){
                return{
                    dataList:value
                }
            },
            methods:{
                //查看参数详情模态框
                // parameterDetails(){
                //     parameterDetailsModel()
                // },
                // //查看物料使用详情
                // materialDetails(){
                //     materialDetailsModel()
                // },
                // //查看工步参数
                // stepParameters(){
                //     stepParameter()
                // }
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('materialDetails')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })

            },
            template:`
            <div class="modal fade" id="materialDetails">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <!-- 物料详情 -->
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <h5 class="panel-title">物料详情</h5>
                                                    </div>
                                                    <div class="col-xs-8">
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <table class="table table-bordered table-condensed">
                                                    <tbody>
                                                        <tr>
                                                            <th style="width:14%">物料名称：</th>
                                                            <td style="width:19%">{{dataList.warehouse_material_name}}</td>

                                                            <th style="width:14%">物料规格：</th>
                                                            <td style="width:19%">{{dataList.warehouse_material_standard}}</td>

                                                            <th style="width:14%">物料类型：</th>
                                                            <td style="width:19%">{{dataList.plan_quotes_material_type}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">物料型号：</th>
                                                            <td style="width:19%">{{dataList.warehouse_material_model}}</td>

                                                            <th style="width:14%">供应商：</th>
                                                            <td style="width:19%">{{dataList.supplier_name}}</td>

                                                            <th style="width:14%">单位：</th>
                                                            <td style="width:19%">{{dataList.warehouse_material_units}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">所属仓库：</th>
                                                            <td style="width:19%">{{}}</td>

                                                            <th style="width:14%"></th>
                                                            <td style="width:19%"></td>

                                                            <th style="width:14%"></th>
                                                            <td style="width:19%"></td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //工单详情模态框
    function workOrderDetailsModel(id){
        let workOrderParticulars = new Vue({
            el:'#workOrderParticulars',
            data(){
                return{
                    workOrderData:[],
                    stageAndStepRelationList:[],//工步
                    environmentList:[],//环境参数
                    productList:[], //半成品参数
                    otherList:[], //其他参数
                }
            },
            methods:{
                //查看参数详情模态框
                parameterDetails(){
                    parameterDetailsModel(id)
                },
                //查看物料使用详情
                materialDetails(){
                    materialUseDetailsModel(id)
                },
                //查看设备操作记录
                deviceParameters(id){
                    deviceParametersModel(id)
                },
                //查看工步参数
                stepParameters(id){
                    stepParameter(id)
                }
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryWorkOrderParticularsUrl,
                    data: {workOrderId:'d39175281bbe4fc19632fa97149883e7'},
                    beforeSend: (xml) => {
                        mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0){
                            this.workOrderData = result.map.workOrder
                            //根据物料id获取参数
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: queryWorkstageParticularsUrl,
                                data: {workstageIds:[result.map.workOrder.workstage_id]},
                                beforeSend: (xml) => {
                                    mesloadBox.loadingShow()
                                },
                                success: (result, status, xhr) => {
                                    mesloadBox.hide()
                                    if(result.status === 0){
                                        this.stageAndStepRelationList = result.map.workstageList[0].stageAndStepRelationList //工步
                                        result.map.workstageList[0].useParametersList.forEach((value,index) => {  //参数
                                            if(value.standard_parameter_type_name === '环境参数'){
                                                this.environmentList.push(value)
                                            }else if(value.standard_parameter_type_name === '半成品参数'){
                                                this.productList.push(value)
                                            }else{
                                                this.otherList.push(value)
                                            }
                                        })

                                    }else{
                                        this.stageAndStepRelationList = []
                                        this.environmentList = []
                                        this.productList = []
                                        this.otherList = []
                                    }
                                }
                            })
                        }else{
                            this.workOrderData = []
                        }
                    }
                })

            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('workOrderParticulars')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })

            },
            filters: {
                times(val) {
                    // return
                    if (val !== '' && val !== null) {
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
            },
            template:`
            <div class="modal fade" id="workOrderParticulars">
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
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <!-- 基础信息 -->
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <h5 class="panel-title">基础信息</h5>
                                                    </div>
                                                    <div class="col-xs-8">
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <table class="table table-bordered table-condensed">
                                                    <tbody>
                                                        <tr>
                                                            <th style="width:14%">工单号</th>
                                                            <td style="width:19%">{{workOrderData.work_order_number}}</td>

                                                            <th style="width:14%">所属生产批号</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.production_plan_batch_number : ''}}</td>

                                                            <th style="width:14%">产品型号</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.product_model_name : ''}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">工艺</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.craft_name : ''}}</td>

                                                            <th style="width:14%">工艺版本</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.craft_versions : ''}}</td>

                                                            <th style="width:14%">工序</th>
                                                            <td style="width:19%">{{workOrderData.workstage_name}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">工序优率</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.workstage_quality_rate + '%' : ''}}</td>

                                                            <th style="width:14%">工序负责人</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.workstage_responsible : ''}}</td>

                                                            <th style="width:14%">极性</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.workstage_polarity : ''}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">半成品类型</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.semi_finish_type_name : ''}}</td>

                                                            <th style="width:14%">半成品型号</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.semi_finish_genre : ''}}</td>

                                                            <th style="width:14%">产出量</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.production_actual_output : ''}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">半成品单位</th>
                                                            <td style="width:19%">{{workOrderData.planQuotesWorkstage ? workOrderData.planQuotesWorkstage.semi_finish_unit : ''}}</td>

                                                            <th style="width:14%">生产线</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.product_line_name : ''}}</td>

                                                            <th style="width:14%">生产车间</th>
                                                            <td style="width:19%">{{workOrderData.role_workshop_name}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">完成日期</th>
                                                            <td style="width:19%">{{workOrderData.production_actual_finish_time | times}}</td>

                                                            <th style="width:14%">工单创建人</th>
                                                            <td style="width:19%">{{workOrderData.work_order_creators}}</td>

                                                            <th style="width:14%">工单负责人</th>
                                                            <td style="width:19%">{{workOrderData.work_order_responsible}}</td>
                                                        </tr>

                                                        <tr>
                                                            <th style="width:14%">生产优先级</th>
                                                            <td style="width:19%">{{workOrderData.plan ? workOrderData.plan.production_plan_production_priority : ''}}</td>

                                                            <th style="width:14%">工单创建时间</th>
                                                            <td style="width:19%">{{workOrderData.work_order_creation_time | times}}</td>

                                                            <th style="width:14%"></th>
                                                            <td style="width:19%"></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                        <ul class="nav nav-tabs" role="tablist">
                                            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">工 步</a></li>
                                            <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">环境参数</a></li>
                                            <li role="presentation"><a href="#three" aria-controls="three" role="tab" data-toggle="tab">半成品参数</a></li>
                                            <li role="presentation"><a href="#four" aria-controls="four" role="tab" data-toggle="tab">其他参数</a></li>
                                        </ul>
                                        <div class="tab-content">
                                            <!-- 工 步 -->
                                            <div role="tabpanel" class="tab-pane active" id="home">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title"> 工 步</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:5%">序号</th>
                                                                    <th style="width:20%">工步名称</th>
                                                                    <th style="width:20%">工步版本</th>
                                                                    <th style="width:20%">工步编号</th>
                                                                    <th style="width:35%">操作</th>
                                                                </tr>
                                                                <tr v-for="(value,index) in stageAndStepRelationList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{value.workstep.craft_control_workstep_name}}</td>
                                                                    <td>{{value.workstep.craft_control_workstep_version}}</td>
                                                                    <td>{{value.workstep.craft_control_workstep_num}}</td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link" @click="materialDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看物料使用详情</a>
                                                                        <a class="table-link" @click="stepParameters()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看工步参数</a>
                                                                        <a class="table-link" @click="deviceParameters(value.craft_control_workstep_id)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看设备操作记录</a>
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="!stageAndStepRelationList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                            <!-- 环境参数 -->
                                            <div role="tabpanel" class="tab-pane" id="profile">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">环境参数</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:5%">序号</th>
                                                                    <th style="width:20%">参数名称</th>
                                                                    <th style="width:20%">参考值</th>
                                                                    <th style="width:20%">单位</th>
                                                                    <th style="width:35%">操作</th>
                                                                </tr>
                                                                <tr v-for="(value,index) in environmentList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{value.workstage_use_parameter_name}}</td>
                                                                    <td>{{value.workstage_use_parameter_constant_value}}</td>
                                                                    <td>{{value.workstage_use_parameter_unit}}</td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link" @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="!environmentList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                            <!-- 半成品参数 -->
                                            <div role="tabpanel" class="tab-pane" id="three">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">半成品参数</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:5%">序号</th>
                                                                    <th style="width:20%">参数名称</th>
                                                                    <th style="width:20%">参考值</th>
                                                                    <th style="width:20%">单位</th>
                                                                    <th style="width:35%">操作</th>
                                                                </tr>
                                                                <tr v-for="(value,index) in productList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{value.workstage_use_parameter_name}}</td>
                                                                    <td>{{value.workstage_use_parameter_constant_value}}</td>
                                                                    <td>{{value.workstage_use_parameter_unit}}</td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link"  @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="!productList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                            <!-- 其他参数 -->
                                            <div role="tabpanel" class="tab-pane" id="four">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">其他参数</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:5%">序号</th>
                                                                    <th style="width:20%">参数名称</th>
                                                                    <th style="width:20%">参考值</th>
                                                                    <th style="width:20%">单位</th>
                                                                    <th style="width:35%">操作</th>
                                                                </tr>
                                                                <tr v-for="(value,index) in otherList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{value.workstage_use_parameter_name}}</td>
                                                                    <td>{{value.workstage_use_parameter_constant_value}}</td>
                                                                    <td>{{value.workstage_use_parameter_unit}}</td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link"  @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
                                                                    </td>
                                                                </tr>
                                                                <tr v-if="!otherList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //查看参数详情模态框
    function parameterDetailsModel(id){
        let parameterModel = new Vue({
            el:'#parameterModel',
            data(){
                return{
                    parameteRecords:[]
                }
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryWorkOrderParameteRecordUrl,
                    data: {parameteId:id},
                    beforeSend: (xml) => {
                        mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0){
                            this.parameteRecords = result.map.parameteRecords
                            // this.planUseMaterialList = result.map.plan.planUseMaterialList
                            // this.lines =  result.map.plan.planUseMaterialList.length
                        }
                    }
                })
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('parameterModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            },
            template:`
            <!-- 查看参数记录 -->
            <div class="modal fade" id="parameterModel">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <button class="close" data-dismiss="modal">
                               <span>
                                   <i class="fa fa-close"></i>
                               </span>
                           </button>
                       </div>
                       <div class="modal-body">
                           <div class="container-fluid">
                               <div class="row">
                                   <div class="col-sm-12">
                                       <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h5 class="panel-title">参数详情</h5>
                                                    </div>
                                                    <div class="col-xs-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                               <table class="table table-bordered">
                                                   <thead>
                                                       <tr>
                                                           <th style="width: 20%">实际值</th>
                                                           <th style="width: 20%">记录人</th>
                                                           <th style="width: 30%">记录时间</th>
                                                           <th style="width: 30%">备注</th>
                                                       </tr>
                                                   </thead>
                                                   <tbody>
                                                       <tr v-for="(value,index) in parameteRecords">
                                                           <td>{{value.parameter_record_steady_state_value}}</td>
                                                           <td>{{value.parameter_record_note_taker}}</td>
                                                           <td>{{value.parameter_record_write_time | times}}</td>
                                                           <td>{{value.parameter_record_describe}}</td>
                                                       </tr>
                                                       <tr v-show="!parameteRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                   </tbody>
                                               </table>
                                           </div>
                                           <div class="panel-footer panel-footer-table text-right">
                                               <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
            `
        })
    }

    //查看物料使用详情
    function materialUseDetailsModel(id){
        let materialModel = new Vue({
            el:'#materialModel',
            data(){
                return{
                    materialUseRecords:[],
                    sort:'',
                    lines:0, //条数
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    ajaxData:{
                        type:'norm',
                        workOrderId:id,
                        headNum:1
                    }
                }
            },
            methods:{
                queryFun(){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryWorkOrderStepParameteRecordUrl,
                        data: this.ajaxData,
                        beforeSend: (xml) => {
                            mesloadBox.loadingShow()
                        },
                        success: (result, status, xhr) => {
                            mesloadBox.hide()
                            if(result.status === 0){
                                this.materialUseRecords = result.map.materialUseRecords
                                this.lines =  result.map.line
                            }
                        }
                    })
                },
                 //XX工步物料详情查看
                stepMaterialModel(value){
                    stepMaterialDetailsModel('materialModel',value)
                },
                //点击详情一
                oneDetails(){
                    this.ajaxData.type = 'norm'
                    this.ajaxData.headNum = 1
                    this.currenPage = 1
                    this.queryFun()
                },
                //点击物料名称排序
                twoDetails(){
                   this.sort = 'materialName'
                   this.ajaxData.headNum = 1
                   this.currenPage = 1
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    this.queryFun()
                },
            },
            created(){
               this.oneDetails()
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('materialModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            },
            watch:{
                sort(val){
                    console.log(val)
                    if(this.sort === 'materialName'){
                        this.ajaxData.type = 'materialName'
                    }else if(this.sort === 'materialUseTimeAsc'){
                        this.ajaxData.type = 'materialUseTimeAsc'
                    }else if(this.sort === 'materialUseTimeDesc'){
                        this.ajaxData.type = 'materialUseTimeDesc'
                    }
                    this.queryFun()
                }
            },
            template:`
            <div class="modal fade" id="materialModel">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li role="presentation" class="active"><a href="#oneDetails" aria-controls="oneDetails" role="tab" data-toggle="tab" @click="oneDetails()">详情一</a></li>
                                    <li role="presentation"><a href="#twoDetails" aria-controls="twoDetails" role="tab" data-toggle="tab" @click="twoDetails()">详情二</a></li>
                                </ul>
                                <div class="tab-content">
                                    <!--A模式-->
                                    <div role="tabpanel" class="tab-pane active" id="oneDetails">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h5 class="panel-title">工步物料使用记录</h5>
                                                    </div>
                                                    <div class="col-xs-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 5%">序号</th>
                                                            <th style="width: 10%">物料名称</th>
                                                            <th style="width: 10%">规格</th>
                                                            <th style="width: 10%">型号</th>
                                                            <th style="width: 10%">单位</th>
                                                            <th style="width: 8%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(value,index) in materialUseRecords">
                                                            <td>{{index+1}}</td>
                                                            <td>{{value.craft_materiel_name}}</td>
                                                            <td>{{value.craft_materiel_specifications}}</td>
                                                            <td>{{value.craft_materiel_model}}</td>
                                                            <td>{{value.craft_materiel_unit}}</td>
                                                            <td class="table-input-td"> <a class="table-link" @click="stepMaterialModel(value)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数详情</a></td>
                                                        </tr>
                                                        <tr v-show="!materialUseRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                    <!--B模式-->
                                    <div role="tabpanel" class="tab-pane" id="twoDetails">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-9">
                                                        <h5 class="panel-title">查看工步物料投料详情</h5>
                                                    </div>
                                                    <div class="col-xs-3" style="text-align:right">
                                                        <select class="form-control" v-model="sort" style="width:100%!important">
                                                            <option value="materialName">物料名称排序</option>
                                                            <option value="materialUseTimeAsc">投料时间升序</option>
                                                            <option value="materialUseTimeDesc">投料时间降序</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 5%">序号</th>
                                                            <th style="width: 10%">物料名称</th>
                                                            <th style="width: 8%">规格</th>
                                                            <th style="width: 8%">型号</th>
                                                            <th style="width: 8%">单位</th>
                                                            <th style="width: 15%">投料时间</th>
                                                            <th style="width: 8%">使用数量</th>
                                                            <th style="width: 8%">投料人</th>
                                                            <th style="width: 15%">备注</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(value,index) in materialUseRecords">
                                                            <td>{{index+1}}</td>
                                                            <td>{{value.craft_materiel_name}}</td>
                                                            <td>{{value.craft_materiel_specifications}}</td>
                                                            <td>{{value.craft_materiel_model}}</td>
                                                            <td>{{value.craft_materiel_unit}}</td>
                                                            <td>{{value.step_use_material_time | times}}</td>
                                                            <td>{{value.step_use_material_amount}}</td>
                                                            <td>{{value.step_use_material_user}}</td>
                                                            <td>{{value.step_use_material_describe}}</td>
                                                        </tr>
                                                       <tr v-show="!materialUseRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //查看工步参数
    function stepParameter(id){
        let stepParameterModel = new Vue({
            el:'#stepParameterModel',
            data(){
                return{
                    stepParameteRecords:[],
                    sort:'',
                    lines:0, //条数
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    ajaxData:{
                        type:'norm',
                        workOrderId:'e7bdfd59e1d44aa8bd7518c6defce42d',
                        headNum:1
                    }
                }
            },
            methods:{
                queryFun(){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryWorkOrderStepParameteRecordUrl,
                        data: this.ajaxData,
                        beforeSend: (xml) => {
                            mesloadBox.loadingShow()
                        },
                        success: (result, status, xhr) => {
                            mesloadBox.hide()
                            if(result.status === 0){
                                this.stepParameteRecords = result.map.stepParameteRecords
                                this.lines =  result.map.line
                            }
                        }
                    })
                },
                //XX工步物料详情查看
                stepMaterialModel(value){
                   stepMaterialDetailsModel('stepParameterModel',value)
                },
                //点击详情一
                oneDetails(){
                    this.ajaxData.type = 'norm'
                    this.ajaxData.headNum = 1
                    this.currenPage = 1
                    this.queryFun()
                },
                //点击物料名称排序
                twoDetails(){
                   this.sort = 'stepParameteName'
                   this.ajaxData.headNum = 1
                   this.currenPage = 1
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    this.queryFun()
                },
            },
            created(){
                this.oneDetails()
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('stepParameterModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            },
            watch:{
                sort(val){
                    if(this.sort === 'stepParameteName'){
                        this.ajaxData.type = 'stepParameteName'
                    }else if(this.sort === 'parameteRecordTimeAsc'){
                        this.ajaxData.type = 'parameteRecordTimeAsc'
                    }else if(this.sort === 'parameteRecordTimeDesc'){
                        this.ajaxData.type = 'parameteRecordTimeDesc'
                    }
                    this.queryFun()
                }
            },
            template:`
            <div class="modal fade" id="stepParameterModel">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li role="presentation" class="active"><a href="#oneDetails1" aria-controls="oneDetails1" role="tab" data-toggle="tab" @click="oneDetails()">详情一</a></li>
                                    <li role="presentation"><a href="#twoDetails2" aria-controls="twoDetails2" role="tab" data-toggle="tab" @click="twoDetails()">详情二</a></li>
                                </ul>
                                <div class="tab-content">
                                    <!--A模式-->
                                    <div role="tabpanel" class="tab-pane active" id="oneDetails1">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h5 class="panel-title">工步生产参数记录</h5>
                                                    </div>
                                                    <div class="col-xs-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 5%">序号</th>
                                                            <th style="width: 10%">参数</th>
                                                            <th style="width: 10%">参考值</th>
                                                            <th style="width: 10%">单位</th>
                                                            <th style="width: 10%">设备类型</th>
                                                            <th style="width: 8%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(value,index) in stepParameteRecords">
                                                            <td>{{index+1}}</td>
                                                            <td>{{value.craft_workstep_parameter_name}}</td>
                                                            <td>{{value.workstep_parameter_constant_value}}</td>
                                                            <td>{{value.workstep_parameter_unit}}</td>
                                                            <td>{{value.devices_control_devices_type_name}}</td>
                                                            <td class="table-input-td"> <a class="table-link"  @click="stepMaterialModel(value)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数详情</a></td>
                                                        </tr>
                                                       <tr v-show="!stepParameteRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                    <!--B模式-->
                                    <div role="tabpanel" class="tab-pane" id="twoDetails2">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-9">
                                                        <h5 class="panel-title">工步参数</h5>
                                                    </div>
                                                    <div class="col-xs-3" style="text-align:right">
                                                        <select class="form-control" v-model="sort" style="width:100%!important">
                                                            <option value="stepParameteName">参数名称排序</option>
                                                            <option value="parameteRecordTimeAsc">记录时间升序</option>
                                                            <option value="parameteRecordTimeDesc">记录时间降序</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 5%">序号</th>
                                                            <th style="width: 8%">参数</th>
                                                            <th style="width: 8%">参考值</th>
                                                            <th style="width: 5%">单位</th>
                                                            <th style="width: 8%">设备类型</th>
                                                            <th style="width: 10%">设备编号</th>
                                                            <th style="width: 8%">设备名称</th>
                                                            <th style="width: 8%">记录人</th>
                                                            <th style="width: 8%">记录时间</th>
                                                            <th style="width: 10%">备注</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(value,index) in stepParameteRecords">
                                                            <td>{{index+1}}</td>
                                                            <td>{{value.craft_workstep_parameter_name}}</td>
                                                            <td>{{value.workstep_parameter_constant_value}}</td>
                                                            <td>{{value.workstep_parameter_unit}}</td>
                                                            <td>{{value.devices_control_devices_type_name}}</td>
                                                            <td>{{value.devices_control_devices_number}}</td>
                                                            <td>{{value.devices_control_devices_name}}</td>
                                                            <td>{{value.step_use_note_taker}}</td>
                                                            <td>{{value.step_use_write_time | times}}</td>
                                                            <td>{{value.step_use_describe}}</td>
                                                        </tr>
                                                       <tr v-show="!stepParameteRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }

    //查看设备操作记录
    function deviceParametersModel(id){
        let deviceParametersModel = new Vue({
            el:'#deviceParametersModel',
            data(){
                return{
                    devicesOperationRecords:[]
                }
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryWorkOrderDevicesOperationRecordUrl,
                    data: {stepId:id,headNum:1},
                    beforeSend: (xml) => {
                        mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0){
                            this.devicesOperationRecords = result.map.devicesOperationRecords
                            // this.planUseMaterialList = result.map.plan.planUseMaterialList
                            // this.lines =  result.map.plan.planUseMaterialList.length
                        }
                    }
                })
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('deviceParametersModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            },
            template:`
            <!-- 查看参数记录 -->
            <div class="modal fade" id="deviceParametersModel">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <button class="close" data-dismiss="modal">
                               <span>
                                   <i class="fa fa-close"></i>
                               </span>
                           </button>
                       </div>
                       <div class="modal-body">
                           <div class="container-fluid">
                               <div class="row">
                                   <div class="col-sm-12">
                                       <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h5 class="panel-title">查看设备操作记录</h5>
                                                    </div>
                                                    <div class="col-xs-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                               <table class="table table-bordered">
                                                   <thead>
                                                       <tr>
                                                           <th style="width: 8%">序号</th>
                                                           <th style="width: 15%">设备名称</th>
                                                           <th style="width: 20%">设备编号</th>
                                                           <th style="width: 16%">开始时间</th>
                                                           <th style="width: 16%">结束时间</th>
                                                           <th style="width: 10%">操作人</th>
                                                       </tr>
                                                   </thead>
                                                   <tbody>
                                                       <tr v-for="(value,index) in devicesOperationRecords">
                                                           <td>{{index+1}}</td>
                                                           <td>{{value.devices_control_devices_name}}</td>
                                                           <td>{{value.devices_control_devices_number}}</td>
                                                           <td>{{value.devices_operation_start_time | times}}</td>
                                                           <td>{{value.devices_operation_end_time | times}}</td>
                                                           <td>{{value.devices_operation_operator}}</td>
                                                       </tr>
                                                       <tr v-show="!devicesOperationRecords.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                   </tbody>
                                               </table>
                                           </div>
                                           <div class="panel-footer panel-footer-table text-right">
                                               <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
            `
        })
    }

    //XX工步物料详情查看
    function stepMaterialDetailsModel(type,value){
        let stepMaterialModel = new Vue({
            el:'#stepMaterialModel',
            data(){
                return{
                    dataList:value,
                    show:true
                }
            },
            created(){
                if(type === 'materialModel'){
                    this.show = true
                }else{
                    this.show = false
                }
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('stepMaterialModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            filters:{
                times(val){
                    if(val !== '' && val !== null){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            },
            template:`
            <div class="modal fade" id="stepMaterialModel">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <button class="close" data-dismiss="modal">
                               <span>
                                   <i class="fa fa-close"></i>
                               </span>
                           </button>
                       </div>
                       <div class="modal-body">
                           <div class="container-fluid">
                               <div class="row">
                                   <div class="col-sm-12">
                                       <div class="panel panel-default" v-if="show">
                                            <div >
                                               <table class="table table-bordered">
                                                   <thead>
                                                       <tr>
                                                           <th style="width: 30%">投料时间</th>
                                                           <th style="width: 20%">使用数量</th>
                                                           <th style="width: 20%">投料人</th>
                                                           <th style="width: 30%">备注</th>
                                                       </tr>
                                                   </thead>
                                                   <tbody>
                                                       <tr>
                                                           <td>{{dataList.step_use_material_time | times}}</td>
                                                           <td>{{dataList.step_use_material_amount}}</td>
                                                           <td>{{dataList.step_use_material_user}}</td>
                                                           <td>{{dataList.step_use_material_describe}}</td>
                                                       </tr>
                                                   </tbody>
                                               </table>
                                           </div>

                                       </div>
                                       <div class="panel panel-default" v-if="!show">
                                       <div >
                                          <table class="table table-bordered">
                                              <thead>
                                                  <tr>
                                                      <th style="width: 15%">参数值</th>
                                                      <th style="width: 15%">记录人</th>
                                                      <th style="width: 25%">记录时间</th>
                                                      <th style="width: 15%">设备编号</th>
                                                      <th style="width: 25%">备注</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr>
                                                    <td>{{}}</td>
                                                    <td>{{dataList.step_use_note_taker}}</td>
                                                    <td>{{dataList.step_use_write_time | times}}</td>
                                                    <td>{{dataList.devices_control_devices_number}}</td>
                                                    <td>{{dataList.step_use_describe}}</td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </div>

                                  </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
            `
        })
    }

    //选人模态框
    function peopleModel(resolve, url, data){
        const swiper = document.getElementsByTagName('body')  //右侧外部swiper
        var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
        })
        function queryFun(url, data) {
            $.ajax({
                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                url: url,
                data:data,
                beforeSend: function (xml) {
                    // ajax发送前
                    mesloadBox.loadingShow()
                },
                success: function (result, status, xhr) {
                    mesloadBox.hide()
                    if(result.status === 0 ){
                        Vue.set(staffModel,'dataList',result.map.staffs)
                        Vue.set(staffModel,'lines',result.map.lines)
                    }else{
                        Vue.set(staffModel,'dataList',[])
                        Vue.set(staffModel,'lines',0)
                    }
                }
            })
        }
        let staffModel  = new Vue({
            el:'#staffModel',
            data() {
                return {
                    models:false,
                    checked:[],
                    dataList:[], //遍历数据
                    lines:0, //条数
                    search:'', //搜索框值
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    ajaxData:{
                        type:'info',
                        staffName: '',
                        headNum: 1
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryStaffUrl,
                    data:{type:'info',headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.staffs
                            this.lines = result.map.lines
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('staffModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })

            },
            methods:{
                choice(val, index){
                    const modal = $(document.getElementById('staffModel'))   //模态框
                    modal.modal('hide')
                    resolve(this.dataList[index])
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryStaffUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.staffName = this.search
                    this.currenPage = 1
                    queryFun(queryStaffUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="staffModel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">人员</h4>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="col-xs-6"></div>
                                                <div class="col-xs-6">
                                                    <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                        <div class="input-group input-group-sm fuzzy-search-group">
                                                            <input class="form-control" type="text" placeholder="精准查询" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                            <div class="input-group-btn" @click="searchs()">
                                                                <button type="button" class="btn btn-primary">
                                                                    <i class="fa fa-search"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 20%">序号</th>
                                                            <th style="width: 35%">人员名称</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.role_staff_name}}</td>
                                                            <td class="table-input-td">
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" v-model="checked" onclick="return false">
                                                                </label>
                                                            </td>
                                                        </tr>
                                                        <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div class="panel-footer panel-footer-table text-right">
                                                <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })

    }

    //BOM清单的物料详情
    function bomMaterialDetailModal(id){
        let bomrMaterialModel = new Vue({
            el:'#bomrMaterialModel',
            data(){
                return{
                    dataList:[],
                    lines:0, //条数
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    ajaxData:{
                        craftVersionsId:id,
                        headNum:1,
                        tailNum:10
                    }
                }
            },
            methods:{
                queryFun(){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryCraftUseMaterialMenuUrl,
                        data:this.ajaxData,
                        beforeSend: function (xml) {
                            // ajax发送前
                            mesloadBox.loadingShow()
                        },
                        success:  (result, status, xhr) => {
                            mesloadBox.hide()
                            if(result.status === 0 ){
                                this.dataList = result.map.bom
                                this.lines = result.map.line
                            }
                        }
                    })
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    this.queryFun()
                },
            },
            created(){
               this.queryFun()
            },
            //渲染结束后执行
            mounted(){
                const modal = document.getElementById('bomrMaterialModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            template:`
            <div class="modal fade" id="bomrMaterialModel">
               <div class="modal-dialog">
                   <div class="modal-content">
                       <div class="modal-header">
                           <button class="close" data-dismiss="modal">
                               <span>
                                   <i class="fa fa-close"></i>
                               </span>
                           </button>
                       </div>
                       <div class="modal-body">
                           <div class="container-fluid">
                               <div class="row">
                                   <div class="col-sm-12">
                                       <div class="panel panel-default">
                                            <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                    <div class="col-xs-6">
                                                        <h5 class="panel-title">物料详情</h5>
                                                    </div>
                                                    <div class="col-xs-6">
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="table-height-10">
                                               <table class="table table-bordered">
                                                   <thead>
                                                       <tr>
                                                           <th style="width: 10%">序号</th>
                                                           <th style="width: 20%">物料名称</th>
                                                           <th style="width: 40%">物料型号</th>
                                                           <th style="width: 15%">值</th>
                                                           <th style="width: 15%">单位</th>
                                                       </tr>
                                                   </thead>
                                                   <tbody>
                                                       <tr v-for="(value,index) in dataList">
                                                           <td>{{index+1}}</td>
                                                           <td>{{value.material_name}}</td>
                                                           <td>{{value.material_model}}</td>
                                                           <td>{{value.material_use_value}}</td>
                                                           <td>{{value.material_unit}}</td>
                                                       </tr>
                                                        <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                   </tbody>
                                               </table>
                                           </div>
                                           <div class="panel-footer panel-footer-table text-right">
                                             <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>
            `
        })
    }
  /**
* @description 项目类型模态框
* @param {obj} vue实例data
*/

})
