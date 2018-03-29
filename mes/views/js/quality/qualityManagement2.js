/*
 * @Author: jieker
 * @Date: 2017-12-13 09:59:12
 * @Last Modified by: jieker
 * @Last Modified time: 2018-03-02 17:42:17
 */


$(function () {
    let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
      leftNavLink = leftNav.find('a').filter('[href^="#"]') // 左侧变栏对应的swiper

    leftNavLink.on('click', function (event) {
      let targetHref = event.currentTarget.getAttribute('href');

      switch (targetHref) {
        case '#checkItemTypeManage': {	//项目类型管理
          function createElement() {
            const swiper = document.getElementById('checkItemTypeManage')   //右侧外部swiper
            const inerSwiper = document.getElementById('checkItemTypeManageInerSwiper') // 右侧内部swiper
            const panel = inerSwiper.querySelector('.panel')  // 内部swiper的面板
            const vueel = panel.querySelector('.vueel')
            const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
            const headBtnAdd = panelHeading.querySelector('.head-btn-add')  // 头部新增按钮
            const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
            const panelFooter = panel.querySelector('.panel-footer')  //面版底部

            let vuex = new Vue()
            let tbodyData = [];

            //查询函数
            function queryFun(url, data) {
              $.ajax({
                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                url: queryItemTypeUrl,
                success: function (result, status, xhr) {
                  tbodyData = JSON.parse(result)
                  let panelBodyTableVM = new Vue({
                    el: vueel,
                    data() {
                      return {
                        tbodyData
                      }
                    },
                    computed: {
                      isIncludeData() {
                        return this.tbodyData.length > 0 ? true : false
                      },
                      returnItemType() {
                        return this.tbodyData
                      }
                    },
                    methods: {
                      modify(value) {   //修改
                        const modal = document.getElementById('addChecItemTypeModal')   //模态框

                        $(modal).modal({
                          backdrop: 'static', // 黑色遮罩不可点击
                          keyboard: false,  // esc按键不可关闭模态框
                          show: true        //显示
                        })

                        itemTypeModal(value)

                      },
                      remove(value) { //删除

                        swal({
                          title: '您确定要删除此条数据吗？',
                          text: '删除后将无法查询',
                          type: 'question',
                          showCancelButton: true,
                          confirmButtonText: '确定',
                          cancelButtonText: '取消'
                        }).then(function () {

                        })
                      },
                      handleCurrentChange(val) {  //获取当前页
                        // console.log(`当前页: ${val}`);
                        queryFun()
                      }

                    },
                    template: `
                      <div class="vueel">
                        <div class="panel-body-table table-height-10">
                          <table class="table  table-bordered table-hover">
                            <thead>
                              <tr>
                                <th style="width: 5%;">序号</th>
                                <th style="width: 30%;">类型名称</th>
                                <th style="width: 30%;">区分</th>
                                <th style="width: 30%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                <td v-text="index+1">
                                </td>
                                <td v-text="value.typeName">
                                </td>
                                <td v-text="value.typeExplain">
                                </td>
                                <td class="table-input-td">
                                  <a class="table-link" @click ="modify(value)" href="javascript:;">
                                    <i class="fa fa-pencil-square-o"></i>修改</a>
                                  <a class="table-link text-danger" @click ="remove(value)" href="javascript:;">
                                    <i class="fa fa-trash-o"></i>删除</a>
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
                          :total=12>
                          </el-pagination>
                        </div>
                      </div>
                    `
                  })

                  // if (result.status === 0) {
                  // }
                  // else {
                    // swallFail();	//操作失败
                  // }
                }
              })
            }
            queryFun()


            //新增按钮单击事件
            headBtnAdd.onclick = function (e) {
              let itemType =  {
                typeName: '',
                typeExplain: ''
              }
              itemTypeModal(itemType)

            }
          }
          createElement()
         }
          break;
        case '#checkItemManage': {  //检验项目管理
          function createElement() {
            const swiper = document.getElementById('checkItemManage')   //右侧外部swiper
            const inerSwiper = document.getElementById('checkItemManageInerSwiper') // 右侧内部swiper
            const panel = inerSwiper.querySelector('.panel')  // 内部swiper的面板
            const vueel = panel.querySelector('.vueel')
            const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
            const headBtnAdd = panelHeading.querySelector('.head-btn-add')  // 头部新增按钮
            const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
            const panelFooter = panel.querySelector('.panel-footer')  //面版底部

            let vuex = new Vue()
            let tbodyData = [];

            //查询函数
            function queryFun(url, data) {
              $.ajax({
                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                url: queryItemUrl,
                success: function (result, status, xhr) {
                  tbodyData = JSON.parse(result)
                  console.log(1111)
                  let panelBodyTableVM = new Vue({
                    el: vueel,
                    data() {
                      return {
                        tbodyData
                      }
                    },
                    computed: {
                      isIncludeData() {
                        return this.tbodyData.length > 0 ? true : false
                      },
                      returnItemType() {
                        return this.tbodyData
                      }
                    },
                    methods: {
                      modify(value) {   //修改
                        const modal = document.getElementById('addChecItemTypeModal')   //模态框

                        $(modal).modal({
                          backdrop: 'static', // 黑色遮罩不可点击
                          keyboard: false,  // esc按键不可关闭模态框
                          show: true        //显示
                        })

                        itemTypeModal(value)

                      },
                      remove(value) { //删除

                        swal({
                          title: '您确定要删除此条数据吗？',
                          text: '删除后将无法查询',
                          type: 'question',
                          showCancelButton: true,
                          confirmButtonText: '确定',
                          cancelButtonText: '取消'
                        }).then(function () {

                        })
                      },
                      handleCurrentChange(val) {  //获取当前页
                        // console.log(`当前页: ${val}`);
                        queryFun()
                      }

                    },
                    template: `
                      <div class="vueel">
                        <div class="panel-body-table table-height-10">
                          <table class="table  table-bordered table-hover">
                            <thead>
                              <tr>
                                <th style="width: 5%;">序号</th>
                                <th style="width: 30%;">类型名称</th>
                                <th style="width: 30%;">区分</th>
                                <th style="width: 30%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                                <td v-text="index+1">
                                </td>
                                <td v-text="value.typeName">
                                </td>
                                <td v-text="value.typeExplain">
                                </td>
                                <td class="table-input-td">
                                  <a class="table-link" @click ="modify(value)" href="javascript:;">
                                    <i class="fa fa-pencil-square-o"></i>修改</a>
                                  <a class="table-link text-danger" @click ="remove(value)" href="javascript:;">
                                    <i class="fa fa-trash-o"></i>删除</a>
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
                          :total=12>
                          </el-pagination>
                        </div>
                      </div>
                    `
                  })

                  // if (result.status === 0) {
                  // }
                  // else {
                  // swallFail();	//操作失败
                  // }
                }
              })
            }
            queryFun()


            //新增按钮单击事件
            headBtnAdd.onclick = function (e) {
              let itemType = {
                typeName: '',
                typeExplain: ''
              }
              itemTypeModal(itemType)

            }
          }
          createElement()
          }
          break;
        case '#measureManage': {	//测试量具管理

          }
          break;
        case '#badnessCodeManage': { //不良代号管理

          }
          break;

        case '#inQualityReport': {	//进货检验报告
            const swiper = document.getElementById('inQualityReport')   //右侧外部swiper
            const inerSwiper = document.getElementById('inQualityReportInerSwiper') // 右侧内部swiper
            const panel = inerSwiper.querySelector('.panel')  // 内部swiper的面板
            const vueel = panel.querySelector('.vueel')
            const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
            const headBtnAdd = panelHeading.querySelector('.head-btn-add')  // 头部新增按钮
            const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
            const panelFooter = panel.querySelector('.panel-footer')  //面版底部
            const modal = document.getElementById('addInQualityReportModal')   //模态框
            function queryFun(url, data) {
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryIQCReportUrl,
                    data:data,
                    beforeSend: function (xml) {
						// ajax发送前
						mesloadBox.loadingShow()
					},
                    success: function (result, status, xhr) {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            Vue.set(panelBodyTableVM,'dataList',result.map.iqcReports)
                            Vue.set(panelBodyTableVM,'lines',result.map.lines)
                        }else{
                            Vue.set(panelBodyTableVM,'dataList',[])
                            Vue.set(panelBodyTableVM,'lines',0)
                        }

                    }
                })
            }
            queryFun(queryIQCReportUrl,{headNum:1})
                //主页
            let panelBodyTableVM = new Vue({
                el:inerSwiper,
                data() {
                    return {
                        models:false,
                        dataList:'', //遍历数据
                        lines:0, //条数
                        search:'', //搜索框值
                        currenPage:1, //当前页
                        pagesize: 10,   //页码
                        ajaxData:{
                            reportName: '',
                            headNum: 1
                        }
                    }
                },
                methods:{
                    //详情
                    detailsModel(val){
                        model('details', val.quality_iqc_report_id)
                    },
                    //修改
                    modificationModel(val){
                        model('modificationModel', val.quality_iqc_report_id)
                    },
                    //新增
                    add(){
                        let promise = new Promise(function (resolve, reject) {
                            optionModel('inQualityReportInerSwiper',resolve,queryIQCTemplateUrl,{type:'material',headNum:1})
                        })
                        promise.then( (resolveData) => {
                            model('add', resolveData.iqcTemplates.toString(), resolveData.materials)
                        })
                    },
                    //分页变化
                    handleCurrentChange(val){
                        this.ajaxData.headNum = (val - 1) * 10 + 1;
                        queryFun(queryIQCReportUrl,this.ajaxData)
                    },
                    //搜索框
                    searchs(){
                        this.ajaxData.reportName = this.search
                        this.currenPage = 1
                        queryFun(queryIQCReportUrl,this.ajaxData)
                    },
                    deletes(id){
                        swal({
                            title: '您确定要删除此条数据吗？',
                            text: '删除后将无法查询',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(function () {
                            $.ajax({
                                url: modifyIQCReportUrl,
                                type: 'POST',
                                data: {
                                    'reportId':id,
                                    'status': 1,
                                },
                                success: function (result) {
                                    if (result.status === 0) {
                                        swal({
                                            title: '删除成功',
                                            type: 'success',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        }).then(
                                            () => {
                                            },
                                            (dismiss) => {
                                                queryFun(queryIQCReportUrl,{headNum:1})
                                            })
                                    }
                                    else {
                                        swal({
                                            title: '删除失败',
                                            type: 'warning',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        })
                                    }
                                }
                            })
                        })
                    }
                },
                template:`
                <div class="swiper-slide swiper-no-swiping" id="inQualityReportInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()" >新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                    <div class="input-group-btn"  @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="vueel">
                                    <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover table-condensed">
                                        <thead>
                                            <tr>
                                                <th style="width: 4%;">序号</th>
                                                <th style="width: 10%;">报告名称</th>
                                                <th style="width: 10%;">物料名称</th>
                                                <th style="width: 10%;">批次</th>
                                                <th style="width: 10%;">规格</th>
                                                <th style="width: 10%;">型号</th>
                                                <th style="width: 10%;">数量</th>
                                                <th style="width: 10%;">单位</th>
                                                <th style="width: 10%;">检验结果</th>
                                                <th style="width: 10%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_report_name}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_name :''}}</td>
                                                <td>{{value.warehouse_material_batch}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_standard :''}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_model :''}}</td>
                                                <td>{{value.warehouse_material_number}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_units :''}}</td>
                                                <td>{{value.quality_iqc_comprehensive_result ? '合格' : '不合格'}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;"><i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;"  @click="deletes(value.quality_iqc_report_id)"><i class="fa fa-trash-o"></i>删除</a>
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
                `
            })
            //新增、详情、修改模态框
            function model(type, id, materials){
                if(type !== 'add'){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryIQCReportRecordUrl,
                        data:{reportId: id},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(addInQualityReportModal,'iqcReports',result.map.iqcReports[0])
                                Vue.set(addInQualityReportModal,'iqcRecords',result.map.iqcRecords)
                                if(result.map.iqcUnqualifieds){
                                    Vue.set(addInQualityReportModal,'iqcUnqualified',result.map.iqcUnqualifieds)
                                }
                                var data = {  //设置时ajax传输的数据
                                    quality_iqc_report_name:result.map.iqcReports[0].quality_iqc_report_name,  //报告名称
                                    quality_iqc_report_number:result.map.iqcReports[0].quality_iqc_report_number, // 报告单号
                                    quality_iqc_inspection_date:result.map.iqcReports[0].quality_iqc_inspection_date,//报检日期
                                    quality_iqc_examine:result.map.iqcReports[0].quality_iqc_examine,  //审核人
                                    quality_iqc_approve:result.map.iqcReports[0].quality_iqc_approve,  //批准人
                                    quality_iqc_examine_date:result.map.iqcReports[0].quality_iqc_examine_date, //审核日期
                                    quality_iqc_approve_date:result.map.iqcReports[0].quality_iqc_approve_date, //批准日期
                                    warehouse_material_batch:result.map.iqcReports[0].warehouse_material_batch,//物料批好
                                    warehouse_material_number:result.map.iqcReports[0].warehouse_material_number,//物料数量
                                    quality_iqc_good_product_number:result.map.iqcReports[0].quality_iqc_good_product_number,//良品数
                                    quality_iqc_good_product_rate:result.map.iqcReports[0].quality_iqc_good_product_rate,//良品率
                                    quality_iqc_comprehensive_result:result.map.iqcReports[0].quality_iqc_comprehensive_result, //综合判定(0:合格 1：不合格)
                                }
                                var data2 = [],iqcResults=[]
                                result.map.iqcRecords.forEach((val,key) =>{
                                    data2.push([])
                                    val.qualityProjects.forEach((value,index) =>{
                                        data2[key].push({   //检验项目
                                            quality_iqc_project_result_id:value.iqcProjectResult.quality_iqc_project_result_id,
                                            quality_project_id:value.quality_project_id, //项目id
                                            quality_iqc_project_number:value.iqcProjectResult.quality_iqc_project_number, //抽检数量
                                            quality_iqc_project_value:value.iqcProjectResult.quality_iqc_project_value,//抽检值（数据集合，用逗号隔开）
                                            quality_iqc_project_average_value:value.iqcProjectResult.quality_iqc_project_average_value,  //平均值
                                            quality_iqc_project_range:value.iqcProjectResult.quality_iqc_project_range,  //极差
                                            quality_iqc_project_determine:value.iqcProjectResult.quality_iqc_project_determine, //判定结果
                                        })
                                    })
                                })
                                result.map.iqcResults.forEach((val,key) => {
                                    iqcResults.push({  //检验结果
                                        quality_iqc_report_id:val.quality_iqc_report_id,
                                        quality_iqc_result_id:val.qualityProject.iqcResult.quality_iqc_result_id,
                                        quality_project_name:val.qualityProject.quality_project_name,
                                        quality_project_id:val.qualityProject.quality_project_id, //项目id
                                        quality_iqc_check_level:val.quality_iqc_check_level, //检查水平
                                        quality_iqc_receive_ac_level:val.quality_iqc_receive_ac_level, //ac接收水平
                                        quality_iqc_receive_rc_level:val.quality_iqc_receive_rc_level, //re接收水平
                                        quality_iqc_result_number:val.quality_iqc_result_number, //抽样数量
                                        quality_iqc_check_result:val.quality_iqc_check_result, //检验结果（0：合格1：不合格）
                                        quality_iqc_checker:val.quality_iqc_checker, //检验员id
                                        quality_iqc_check_date:val.quality_iqc_check_date, //检验日期
                                    })
                                })
                                Vue.set(addInQualityReportModal,'iqcResult',iqcResults)
                                Vue.set(addInQualityReportModal,'iqcProjectResult',data2)
                                Vue.set(addInQualityReportModal,'iqcReport',data)
                                Vue.set(addInQualityReportModal,'examines',result.map.iqcReports[0].quality_iqc_examine)
                                Vue.set(addInQualityReportModal,'approves',result.map.iqcReports[0].quality_iqc_approve)
                                if(result.map.iqcReports[0].supplier){
                                    Vue.set(addInQualityReportModal,'supplier',result.map.iqcReports[0].supplier.supplier_name)
                                }
                            }else{
                                Vue.set(addInQualityReportModal,'iqcReports',[])
                                Vue.set(addInQualityReportModal,'iqcRecords',[])
                            }

                        }
                    })
                }else{
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryIQCTemplateUrl,
                        data:{type:'material', templateId:id,headNum:1},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(addInQualityReportModal,'iqcReports',result.map.iqcTemplates[0])
                                Vue.set(addInQualityReportModal,'iqcRecords',result.map.materialTemplates)
                                var data = [],iqcResults=[]
                                result.map.materialTemplates.forEach((val,key) =>{
                                    data.push([])
                                    // data2.push([])
                                    val.qualityProjects.forEach((value,index) =>{
                                        // if(val.quality_project_type_name == '检验结果'){
                                        //     // data2[key].push({
                                        //     //     quality_project_id:value.quality_project_id, //项目id
                                        //     //     quality_iqc_check_level:'', //检查水平
                                        //     //     quality_iqc_receive_ac_level:'', //ac接收水平
                                        //     //     quality_iqc_receive_rc_level:'', //re接收水平
                                        //     //     quality_iqc_result_number:'', //抽样数量
                                        //     //     quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
                                        //     //     quality_iqc_checker:'', //检验员id
                                        //     //     quality_iqc_checker_name:'', //检验员
                                        //     //     quality_iqc_check_date:'', //检验日期
                                        //     // })
                                        // }else{
                                            data[key].push({
                                                quality_project_id:value.quality_project_id, //项目id
                                                quality_iqc_project_number:'', //抽检数量
                                                quality_iqc_project_value:'',//抽检值（数据集合，用逗号隔开）
                                                quality_iqc_project_average_value:'',  //平均值
                                                quality_iqc_project_range:'',  //极差
                                                quality_iqc_project_determine:'', //判定结果
                                            })
                                        // }
                                    })
                                })
                                //设置新增时ajax传输的数据
                                result.map.iqcResults.forEach((val,key) => {
                                    iqcResults.push({
                                        quality_iqc_result_id:val.qualityProject.iqcResult.quality_iqc_result_id,
                                        quality_project_name:val.qualityProject.quality_project_name,
                                        quality_project_id:val.qualityProject.quality_project_id, //项目id
                                        quality_iqc_check_level:'', //检查水平
                                        quality_iqc_receive_ac_level:'', //ac接收水平
                                        quality_iqc_receive_rc_level:'', //re接收水平
                                        quality_iqc_result_number:'', //抽样数量
                                        quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
                                        quality_iqc_checker:'', //检验员id
                                        quality_iqc_check_date:'', //检验日期
                                    })
                                })
                                Vue.set(addInQualityReportModal,'iqcResult',iqcResults)
                                Vue.set(addInQualityReportModal,'iqcProjectResult',data)
                            }else if(result.status === 2){
                                Vue.set(addInQualityReportModal,'iqcReports',result.map.iqcTemplates[0])
                                Vue.set(addInQualityReportModal,'iqcRecords',[])
                            }else{
                                Vue.set(addInQualityReportModal,'iqcReports',[])
                                Vue.set(addInQualityReportModal,'iqcRecords',[])
                            }

                        }
                    })
                }

                let addInQualityReportModal = new Vue({
                    el:'#addInQualityReportModal',
                    data(){
                        return {
                            iqcReports:[],//基础数据
                            iqcRecords:[],//项目
                            isShow:false, //判断是否是详情
                            isShowAdd:false, //判断是否是修改
                            add:false,  //判断是否是新增
                            examines:'', //审核人
                            approves:'', //批准人
                            supplier:'', //供应商
                            illegal:[],//选中的不合格代号
                            iqcUnqualified:[], // 不合格内容
                            //基础信息
                            iqcReport:{
                                quality_iqc_template_id:id, //模板id
                                warehouse_material_id:'', //物料id
                                quality_iqc_report_name:'',  //报告名称
                                quality_iqc_report_number:'', // 报告单号
                                quality_iqc_inspection_date:'',//报检日期
                                quality_iqc_examine:'',  //审核人
                                quality_iqc_approve:'',  //批准人
                                quality_iqc_examine_date:'', //审核日期
                                quality_iqc_approve_date:'', //批准日期,
                                quality_iqc_good_product_number:'',//良品数
                                quality_iqc_good_product_rate:'',//良品率
                                supplier_id:'', //供应商id
                                warehouse_material_batch:'',//物料批好
                                warehouse_material_number:'',//物料数量
                                quality_iqc_comprehensive_result:'', //综合判定(0:合格 1：不合格)
                            },
                            //检验结果
                            iqcResult:[{
                                quality_project_id:'', //项目id
                                quality_iqc_check_level:'', //检查水平
                                quality_iqc_receive_ac_level:'', //ac接收水平
                                quality_iqc_receive_rc_level:'', //re接收水平
                                quality_iqc_result_number:'', //抽样数量
                                quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
                                quality_iqc_checker:'', //检验员id
                                quality_iqc_check_date:'', //检验日期
                            }],
                            //检验项目
                            iqcProjectResult:[{
                                quality_project_id:'', //项目id
                                quality_iqc_project_number:'', //抽检数量
                                quality_iqc_project_value:'',//抽检值（数据集合，用逗号隔开）
                                quality_iqc_project_average_value:'',  //平均值
                                quality_iqc_project_range:'',  //极差
                                quality_iqc_project_determine:'', //判定结果
                            }],
                            sendJudgment:{
                                iqcReport:0, //基础信息
                                iqcUnqualified:0, //不合格内容
                                iqcResult:0, //检查结果
                                iqcProjectResult:0 //项目
                            }
                            // iqcUnqualified:{
                            //     quality_iqc_unqualified_content:'', //不合格内容
                            //     quality_sample_number:'',  //抽样数量
                            //     quality_iqc_unqualified_number:'',  //不良数量
                            //     quality_iqc_unqualified_probability:'',  //不良率
                            // }
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
                        if(type == 'modificationModel'){
                            this.isShowAdd = true
                        }else if(type == 'add'){
                            this.add = true
                            this.iqcReport.warehouse_material_id = materials
                        }else if(type == 'details'){
                            this.isShow = true
                        }
                    },
                    methods:{
                        //点击检验工具事件
                        measuringTool(){},
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
                        examine(key,index){
                            let promise = new Promise( (resolve, reject) => {
                                sampling(resolve,this.iqcProjectResult[key][index].quality_iqc_project_number,this.iqcProjectResult[key][index].quality_iqc_project_value)
                            })
                            promise.then( (resolveData) => {
                                this.iqcProjectResult[key][index].quality_iqc_project_average_value = resolveData.mean
                                this.iqcProjectResult[key][index].quality_iqc_project_range = resolveData.ranges
                                this.iqcProjectResult[key][index].quality_iqc_project_number = resolveData.samplingNumber
                                this.iqcProjectResult[key][index].quality_iqc_project_value = resolveData.samplingValue
                            })
                        },
                        //不合格内容增加项目
                        addIllegal(){
                            let promise = new Promise( (resolve, reject) => {
                                unhealthy(resolve, null, null, this.iqcUnqualified)
                            })
                            promise.then( (resolveData) => {
                                resolveData.forEach((val,key) => {
                                    this.iqcUnqualified.push(
                                        {
                                            quality_unqualified_id:val.quality_unqualified_id, //不良现象id
                                            quality_unqualified_code:val.quality_unqualified_code, //不良现象代号
                                            quality_iqc_unqualified_content:'', //不合格内容
                                            quality_sample_number:'',  //抽样数量
                                            quality_iqc_unqualified_number:'',  //不良数量
                                            quality_iqc_unqualified_probability:'',  //不良率
                                        }
                                    )
                                })
                                // this.$message({
                                //     message: '添加成功',
                                //     type: 'success'
                                //   });
                            })

                        },
                        //选择批准人和审核人事件
                        people(types, key){
                            let promise = new Promise(function (resolve, reject) {
                                peopleModel(resolve,null,null)
                            })
                            promise.then( (resolveData) => {
                                if(types == '批准人'){
                                    this.iqcReport.quality_iqc_approve = resolveData.role_staff_id
                                    this.approves = resolveData.role_staff_name
                                    if(type === 'add'){
                                        this.iqcReport.quality_iqc_approve_date = moment().format('YYYY-MM-DD HH:mm:ss')
                                    }
                                }else if(types == '审核人'){
                                    this.iqcReport.quality_iqc_examine = resolveData.role_staff_id
                                    this.examines = resolveData.role_staff_name
                                    if(type === 'add'){
                                        this.iqcReport.quality_iqc_examine_date = moment().format('YYYY-MM-DD HH:mm:ss')
                                    }
                                }else{
                                    this.iqcResult[key].quality_iqc_checker = resolveData.role_staff_name
                                    if(type === 'add'){
                                        this.iqcResult[key].quality_iqc_check_date = moment().format('YYYY-MM-DD HH:mm:ss')
                                    }
                                }

                            })
                        },
                         //增加检验结果
                        // addIqcProject(){
                        //     let promise = new Promise( (resolve, reject) => {
                        //         iqcProject(resolve, null, null, this.iqcResult, '18760315ee2b4eee866bd0df97e08b7b')
                        //     })
                        //     promise.then( (resolveData) => {
                        //         console.log(resolveData)
                        //          this.iqcResult.push({
                        //             quality_project_id:resolveData.quality_project_id, //项目id
                        //             quality_project_name:resolveData.qualityProjects.quality_project_name,
                        //             quality_iqc_check_level:'', //检查水平
                        //             quality_iqc_receive_ac_level:'', //ac接收水平
                        //             quality_iqc_receive_rc_level:'', //re接收水平
                        //             quality_iqc_result_number:'', //抽样数量
                        //             quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
                        //             quality_iqc_checker:'', //检验员id
                        //             quality_iqc_checker_name:'', //检验员
                        //             quality_iqc_check_date:'', //检验日期
                        //         })
                        //     })
                        // },
                        //供应商时间
                        suppliers(){
                            let promise = new Promise(function (resolve, reject) {
                                supplierModel(resolve,null,null)
                            })
                            promise.then( (resolveData) => {
                                this.iqcReport.supplier_id = resolveData.supplier_id
                                this.supplier = resolveData.supplier_name
                            })
                        },
                        //移除事件
                        deletes(type,index){
                            swal({
                                title: '您确定要移除此条数据吗？',
                                text: '数据移除后无法恢复',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then( () => {
                               if(type == 'iqcUnqualified'){
                                    if(this.iqcUnqualified[index].quality_iqc_unqualified_id){
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: removeIQCUnqualifiedUrl,
                                            data:{iqcUnqualified:JSON.stringify([this.iqcUnqualified[index]])},// 综合判定(0:合格 1：不合格)
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    this.iqcUnqualified.splice(index,1)
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail();	//操作失败
                                                }
                                            }
                                        })
                                    }else{
                                        this.iqcUnqualified.splice(index,1)
                                    }
                                }else{
                                    this.iqcResult.splice(index,1)
                                }
                            })
                        },
                        //提交事件
                        submit(){
                            if(this.iqcReport.quality_iqc_report_name == ''){
                                this.$message.error({
                                    message: '报告名称未填写',
                                    type: 'warning'
                                })
                            }else if(this.iqcReport.quality_iqc_report_number == ''){
                                this.$message.error({
                                    message: '报告单号未填写',
                                    type: 'warning'
                                })
                            }else if(this.iqcReport.quality_iqc_inspection_date == ''){
                                this.$message.error({
                                    message: '报验日期未填写',
                                    type: 'warning'
                                })
                            }else if(this.iqcReport.warehouse_material_batch == ''){
                                this.$message.error({
                                    message: '物料批号未填写',
                                    type: 'warning'
                                })
                            }else if(this.iqcReport.warehouse_material_number == ''){
                                this.$message.error({
                                    message: '物料数量未填写',
                                    type: 'warning'
                                })
                            }else{
                                swal({
                                    title: '您确定要提交本次操作吗?',
                                    text: '请确保填写信息无误后点击确定按钮',
                                    type: 'question',
                                    allowEscapeKey: false, // 用户按esc键不退出
                                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                    showCancelButton: true, // 显示用户取消按钮
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then( () => {
                                    var data = [],data2 = []
                                    this.iqcProjectResult.forEach((val,key) => {
                                        val.forEach((value,index) => {
                                            data.push(value)
                                        })
                                    })

                                    if(type == 'modificationModel'){
                                        //修改提交按钮
                                        if(this.sendJudgment.iqcReport > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCReportUrl,
                                                data:{reportId:id, // iqc检验报告id
                                                    reportName:this.iqcReport.quality_iqc_report_name,  // 报告名称
                                                    reportNumber:this.iqcReport.quality_iqc_report_number,  // iqc单据编号
                                                    materialBatch:this.iqcReport.warehouse_material_batch, // 物料批号
                                                    materialNumber:this.iqcReport.warehouse_material_number, // 物料数量
                                                    inspectionDates:this.iqcReport.quality_iqc_inspection_date, // 报检日期
                                                    examine:this.iqcReport.quality_iqc_examine,// 审核人
                                                    examineDate:this.iqcReport.quality_iqc_examine_date,// 审核日期
                                                    approve:this.iqcReport.quality_iqc_approve, // 批准人
                                                    goodNumber:this.iqcReport.quality_iqc_good_product_number, // 良品数
                                                    approveDate:this.iqcReport.quality_iqc_approve_date,// 批准日期
                                                    results:this.iqcReport.quality_iqc_comprehensive_result},// 综合判定(0:合格 1：不合格)
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCReportUrl,{headNum:1})
                                                        const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                        if(this.sendJudgment.iqcResult > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCResultUrl,
                                                data:{ iqcResult:JSON.stringify(this.iqcResult)},// 综合判定(0:合格 1：不合格)
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCReportUrl,{headNum:1})
                                                        const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                        if(this.sendJudgment.iqcProjectResult > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCProjectResultUrl,
                                                data:{iqcProjectResult:JSON.stringify(data)},// 综合判定(0:合格 1：不合格)
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCReportUrl,{headNum:1})
                                                        const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                        if(this.sendJudgment.iqcUnqualified > 1){
                                            // var judge = true
                                            // this.iqcUnqualified.forEach((val,key) => {
                                            //     if(!val.quality_iqc_unqualified_id){
                                            //         judge = false
                                            //     }
                                            // })
                                            // if(judge){
                                                // $.ajax({
                                                //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                //     url: removeIQCUnqualifiedUrl,
                                                //     data:{iqcResult:JSON.stringify(data)},// 综合判定(0:合格 1：不合格)
                                                //     success: function (result, status, xhr) {
                                                //         if(result.status === 0 ){
                                                //             queryFun(queryIQCReportUrl,{headNum:1})
                                                //             const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                //             swallSuccess2(modal)	//操作成功提示并刷新页面
                                                //         }else{
                                                //             swallFail();	//操作失败
                                                //         }
                                                //     }
                                                // })
                                            // }else{
                                                $.ajax({
                                                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                    url: modifyIQCUnqualifiedUrl,
                                                    data:{iqcUnqualified:JSON.stringify(this.iqcUnqualified)},// 综合判定(0:合格 1：不合格)
                                                    success: function (result, status, xhr) {
                                                        if(result.status === 0 ){
                                                            queryFun(queryIQCReportUrl,{headNum:1})
                                                            const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                            swallSuccess2(modal)	//操作成功提示并刷新页面
                                                        }else{
                                                            swallFail();	//操作失败
                                                        }
                                                    }
                                                })
                                            // }
                                        }

                                    }else{
                                        // this.iqcResult.forEach((val,key) => {
                                        //     val.forEach((value,index) => {
                                        //         data2.push(value)
                                        //     })
                                        // })
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: saveIQCReportUrl,
                                            data:{iqcReport:JSON.stringify(this.iqcReport), iqcResult:JSON.stringify(this.iqcResult), iqcUnqualified:JSON.stringify(this.iqcUnqualified), iqcProjectResult:JSON.stringify(data)},
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryIQCReportUrl,{headNum:1})
                                                    const modal = document.getElementById('addInQualityReportModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail();	//操作失败
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        },
                    },
                    filters:{
                        times(val){
                            if(val !== '' && val !== null){
                                return moment(val).format('YYYY-MM-DD HH:mm:ss')
                            }
                        },
                        quality_iqc_unqualified_probability(index){
                            if(addInQualityReportModal.iqcUnqualified[index].quality_sample_number !='' &&  addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number !=''){
                                var num =  Math.round((addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number/addInQualityReportModal.iqcUnqualified[index].quality_sample_number) * 10000)/100
                                return num + '%'
                            }
                        },
                        adverse(val){
                            if(val !== '' && val !== null){
                                return val+'%'
                            }else{
                                return ''
                            }
                        },

                    },
                    watch:{
                        iqcReport:{
                            handler(newValue, oldValue) {
                                this.sendJudgment.iqcReport++
                    　　　　 },
                    　　     deep: true
                        },
                        iqcResult:{
                            handler(newValue, oldValue) {
                                this.sendJudgment.iqcResult++
                    　　　　 },
                    　　　　 deep: true
                        },
                        iqcUnqualified:{
                            handler(newValue, oldValue) {
                                this.sendJudgment.iqcUnqualified++
                    　　　　 },
                    　　　　 deep: true
                        },
                        iqcProjectResult:{
                            handler(newValue, oldValue) {
                                this.sendJudgment.iqcProjectResult++
                    　　　　 },
                    　　　　 deep: true
                        },
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
                                    <h4 class="modal-title">新增进货检验报告</h4>
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
                                                                <!-- <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" v-if="isShowAdd" @click="material()">选择物料模板</button>
                                                                </form> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed" >
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:14%">报告名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.quality_iqc_report_name">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_report_name}}</td>

                                                                    <th style="width:14%">IQC单号</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.quality_iqc_report_number">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_report_number}}</td>

                                                                    <th style="width:14%">报验日期</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                            <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="iqcReport.quality_iqc_inspection_date | times" @blur="iqcReport.quality_iqc_inspection_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                        </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_inspection_date | times}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">物料名称</th>
                                                                    <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_name : ''}}</td>

                                                                    <th style="width:14%">规格</th>
                                                                    <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_standard : ''}}</td>

                                                                    <th style="width:14%">型号</th>
                                                                    <td style="width:19%" >{{iqcReports.material ? iqcReports.material.warehouse_material_model : ''}}</td>

                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">物料批号</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.warehouse_material_batch">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.warehouse_material_batch}}</td>

                                                                    <th style="width:14%">数 量</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.warehouse_material_number">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.warehouse_material_number}}</td>

                                                                    <th style="width:14%">单 位</th>
                                                                    <td style="width:19%">{{iqcReports.warehouse_material_units}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">良品数</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="iqcReport.quality_iqc_good_product_number">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_good_product_number}}</td>

                                                                    <th style="width:14%">良品率</th>

                                                                    <td style="width:19%">{{iqcReport.quality_iqc_good_product_rate | adverse}}</td>

                                                                    <th style="width:14%">供应厂商</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" @click="suppliers()" :value="supplier">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.supplier ? iqcReports.supplier.supplier_name : ''}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">审核人</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="examines" @click="people('审核人')">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_examine}}</td>

                                                                    <th style="width:14%">审核日期</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="iqcReport.quality_iqc_examine_date | times"  @blur="iqcReport.quality_iqc_examine_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_examine_date | times}}</td>

                                                                    <th style="width:14%"></th>
                                                                    <td class="table-input-td">

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">批准人</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="approves" @click="people('批准人')">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_approve}}</td>

                                                                    <th style="width:14%">批准日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="iqcReport.quality_iqc_approve_date | times" @blur="iqcReport.quality_iqc_approve_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_approve_date | times}}</td>

                                                                    <th style="width:14%">综合判定结果</th>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcReport.quality_iqc_comprehensive_result" :disabled="isShow">
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

                                                <!-- 检验结果 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
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
                                                                <tr v-for="(val, index) in iqcResult">
                                                                    <th>{{val.quality_project_name}}</th>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_check_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_check_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_receive_ac_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_receive_ac_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_receive_rc_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_receive_rc_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_result_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_result_number}}</td>

                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="val.quality_iqc_check_result" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="val.quality_iqc_checker" @click="people('iqcResult',index)">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_checker}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="val.quality_iqc_check_date | times" @blur="val.quality_iqc_check_date = $event.target.value" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_check_date | times}}</td>
                                                                </tr>
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
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">不合格内容</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIllegal()" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">不良代号</th>
                                                                    <th style="width:10%">抽样数</th>
                                                                    <th style="width:10%">不良数</th>
                                                                    <th style="width:10%">不良率</th>
                                                                    <th style="width:10%">备注</th>
                                                                    <th style="width:5%" v-if="!isShow">操作</th>
                                                                </tr>
                                                                <tr v-show="!iqcUnqualified.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>
                                                                    <tr v-for="(value, index) in iqcUnqualified">

                                                                    <td>{{value.quality_unqualified_code}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_sample_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.quality_sample_number}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_iqc_unqualified_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.quality_iqc_unqualified_number}}</td>

                                                                    <!--<td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_iqc_unqualified_probability">
                                                                    </td>-->
                                                                    <td>{{index | quality_iqc_unqualified_probability}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on">
                                                                    </td>
                                                                    <td v-if="isShow"></td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes('iqcUnqualified',index)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--外观-->
                                                <el-collapse accordion  v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name !== '尺寸检验' && val.quality_project_type_name !== 'RS控制' && val.quality_project_type_name !== '附录' && val.quality_project_type_name !== '检验结果'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
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
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

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
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">尺寸检验</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
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

                                                                    <td class="table-input-td"><a class="table-link" @click="examine(key,index)" href="javascript:;">查看</a></td>


                                                                    <td>{{iqcProjectResult[key][index] ? iqcProjectResult[key][index].quality_iqc_project_average_value : ''}}</td>


                                                                    <td>{{iqcProjectResult[key][index] ? iqcProjectResult[key][index].quality_iqc_project_range : ''}}</td>

                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
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
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">RS控制</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
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
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="iqcProjectResult[key][index].quality_iqc_project_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectResult ? value.iqcProjectResult.quality_iqc_project_number : ''}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
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
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">附录</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
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
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-if="!isShow">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                })
            }
            //新增选择物料模板模态框
            function materialModel(resolve, url, data){
                function queryFun(url, data) {
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: url,
                        data:data,
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(materialTemplate,'dataList',result.map.projectInfo)
                                Vue.set(materialTemplate,'lines',result.map.lines)
                            }else{
                                Vue.set(materialTemplate,'dataList',[])
                                Vue.set(materialTemplate,'lines',0)
                            }
                        }
                    })
                }
                queryFun(queryQualityProjectTypeUrl,{headNum:1})
                let materialTemplate = new Vue({
                    el:'#materialTemplate',
                    data(){
                        return{
                            dataList:[], //遍历数据
                            lines:0, //条数
                            search:'', //搜索框值
                            currenPage:1, //当前页
                            pagesize: 10,   //页码
                            ajaxData:{
                                projectTypeId: '',
                                projectTypeName: '',
                                headNum: 1
                            }
                        }
                    },
                    methods:{
                        restore(index){
                            resolve(this.dataList[index])
                            const modal = $(document.getElementById('materialTemplate'))   //模态框
                            modal.modal('hide')
                        },
                            //分页变化
                        handleCurrentChange(val){
                            this.ajaxData.headNum = (val - 1) * 10 + 1;
                            queryFun(queryQualityProjectTypeUrl,this.ajaxData)
                        },
                        //搜索框
                        searchs(){
                            this.ajaxData.projectTypeName = this.search
                            this.currenPage = 1
                            queryFun(queryQualityProjectTypeUrl,this.ajaxData)
                        }
                    },
                    mounted(){
                        const modal = document.getElementById('materialTemplate')   //模态框
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
                    <div class="modal fade" id="materialTemplate">
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
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="col-xs-6"></div>
                                                        <div class="col-xs-6">
                                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                                    <div class="input-group-btn" @click="searchs()">>
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
                                                                    <th style="width: 20%">模板名称</th>
                                                                    <th style="width: 20%">物料名称</th>
                                                                    <th style="width: 20%">类模板名称</th>
                                                                    <th style="width: 20%">版本</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(val,index) in dataList" @click="restore(index)" style="cursor:pointer">
                                                                    <td>{{val.quality_project_type_name}}</td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
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
            //尺寸特性抽样结果查看
            function sampling(resolve, number, value){
                let samplingResults = new Vue({
                    el:'#samplingResults ',
                    data(){
                        return {
                            isShow:true,
                            samplingRow:[],
                            mean:'',
                            ranges:''
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
                        if(number !== ''){
                            number = number.split(',')
                            value = value.split(',')
                            var data = []
                            number.forEach((val,key) => {
                                data.push({number:val, result:value[key]})
                            })
                            this.samplingRow =  data
                        }
                    },
                    methods:{
                        //提交按钮事件
                        submit(){
                            var samplingNumber = [],samplingValue = []
                            this.samplingRow.forEach((val,index) => {
                                samplingNumber.push(val.number)
                                samplingValue.push(val.result)
                            })
                            resolve({mean:this.mean,ranges:this.ranges,samplingNumber:samplingNumber.toString(),samplingValue:samplingValue.toString()})
                            const modal = $(document.getElementById('samplingResults'))   //模态框
                            modal.modal('hide')
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        },
                        //增加抽样记录行事件
                        addSamplingRow(){
                            this.isShow = false
                            this.samplingRow.push({number:'', result:''})
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                        },
                        //移除事件
                        deletes(index){
                            swal({
                                title: '您确定要移除此条数据吗？',
                                text: '数据移除后无法恢复',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then( () => {
                                this.samplingRow.splice(index,1)
                            })
                        }
                    },
                    computed:{
                        totals:{
                            get(){
                                var sum = 0
                                this.samplingRow.forEach((value, key) => {
                                    sum += Number(value.result)
                                })
                                sum = sum/this.samplingRow.length
                                if(!sum){
                                    sum = ''
                                }
                                sum = Number(sum).toFixed(2)
                                this.mean = sum
                                return sum
                            }
                        },
                        range:{
                            get(){
                                var sum = [],max,min,num

                                this.samplingRow.forEach((value, key) => {
                                    sum.push(Number(value.result))
                                })
                                max = Math.max.apply(null, sum)
                                min = Math.min.apply(null, sum)
                                num = max-min
                                if(num == -Infinity){
                                    num = ''
                                }
                                num = Number(num).toFixed(2)
                                this.ranges = num
                                return num
                            }
                        }
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
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="addSamplingRow()">增加抽样记录行</button>
                                                                </form>
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
                                                                    <th style="width: 10%">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-show="!samplingRow.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>

                                                                <tr v-for="(val,index) in samplingRow">
                                                                    <td>{{index+1}}</td>
                                                                    <td class="table-input-td">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="samplingRow[index].number">
                                                                    </td>
                                                                    <td class="table-input-td">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="samplingRow[index].result">
                                                                    </td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>
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
                                                                    <td>{{totals}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width: 50%">极差</th>
                                                                    <td>{{range}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()">保存</button>
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

        case '#materialClassTemplateManager': {	//类模板管理
            const swiper = document.getElementById('materialClassTemplateManager')   //右侧外部swiper
            const inerSwiper = document.getElementById('materialClassTemplateManagerInerSwiper') // 右侧内部swiper
            const panel = inerSwiper.querySelector('.panel')  // 内部swiper的面板
            const vueel = panel.querySelector('.vueel')
            const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
            const headBtnAdd = panelHeading.querySelector('.head-btn-add')  // 头部新增按钮
            const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
            const panelFooter = panel.querySelector('.panel-footer')  //面版底部
            function queryFun(url, data) {
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
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
                            Vue.set(panelBodyTableVM,'dataList',result.map.iqcTemplates)
                            Vue.set(panelBodyTableVM,'lines',result.map.lines)
                        }else{
                            Vue.set(panelBodyTableVM,'dataList',[])
                            Vue.set(panelBodyTableVM,'lines',0)
                        }
                    }
                })
            }
            queryFun(queryIQCTemplateUrl,{type:'class',headNum:1})
            let panelBodyTableVM = new Vue({
                el:inerSwiper,
                data(){
                    return{
                        dataList:'', //遍历数据
                        lines:0, //条数
                        search:'', //搜索框值
                        currenPage:1, //当前页
                        pagesize: 10,   //页码
                        ajaxData:{
                            type: 'class',
                            templateName: '',
                            headNum: 1
                        }
                    }
                },
                methods:{
                    //详情
                    detailsModel(value){
                        model('details', value.quality_iqc_template_id)
                    },
                    //修改
                    modificationModel(value){
                        model('modificationModel', value.quality_iqc_template_id)
                    },
                    //新增
                    add(){
                        model('add','add')
                    },
                    //分页变化
                    handleCurrentChange(val){
                        this.ajaxData.headNum = (val - 1) * 10 + 1;
                        queryFun(queryIQCTemplateUrl,this.ajaxData)
                    },
                    //搜索框
                    searchs(){
                        this.ajaxData.templateName = this.search
                        this.currenPage = 1
                        queryFun(queryIQCTemplateUrl,this.ajaxData)
                    },
                    deletes(id){
                        swal({
                            title: '您确定要删除此条数据吗？',
                            text: '删除后将无法查询',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(function () {
                            $.ajax({
                                url: modifyIQCTemplateUrl,
                                type: 'POST',
                                data: {
                                    'templateId':id,
                                    'status': 1,
                                },
                                success: function (result) {
                                    if (result.status === 0) {
                                        swal({
                                            title: '删除成功',
                                            type: 'success',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        }).then(
                                            () => {
                                            },
                                            (dismiss) => {
                                                queryFun(queryIQCTemplateUrl,{type:'class',headNum:1})
                                            })
                                    }
                                    else {
                                        swal({
                                            title: '删除失败',
                                            type: 'warning',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        })
                                    }
                                }
                            })
                        })
                    }
                },
                filters:{
                    times(val){
                        return moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                template:`
                <div class="swiper-slide swiper-no-swiping" id="materialClassTemplateManagerInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
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
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover table-condensed">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">模板类型</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">创建时间</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_template_name}}</td>
                                                <td>{{value.quality_iqc_template_type}}</td>
                                                <td>{{value.quality_iqc_template_edittion}}</td>
                                                <td>{{value.quality_iqc_template_date | times}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_iqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
            })
            //新增 修改 详情 模态框
            function model(type, id){
                if(type !== 'add'){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryIQCTemplateUrl,
                        data:{type:'class',templateId:id,headNum:1},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                var data = [], id=[], length = 0,iqcResults=[]
                                Vue.set(addMaterialClassTemplateModal,'iqcTemplates',result.map.iqcTemplates[0])
                                // if(type !== 'add'){
                                    Vue.set(addMaterialClassTemplateModal,'checkout',result.map.templates)
                                    result.map.templates.forEach((val,key) =>{ //二维数组遍历
                                        data.push([])
                                        val.qualityProjects.forEach((value,index) =>{
                                            length++
                                            // id.push(value.qualityTypeProject.quality_type_project_id)//修改时查询已添加的项目
                                            data[key].push(value)
                                        })
                                    })
                                    result.map.iqcResults.forEach((val,key) => {
                                        iqcResults.push({
                                            quality_iqc_template_id:id,
                                            quality_project_name:val.qualityProject.quality_project_name,
                                            quality_project_id:val.qualityProject.quality_project_id, //项目id
                                            // quality_iqc_check_level:val.quality_iqc_check_level, //检查水平
                                            // quality_iqc_receive_ac_level:val.quality_iqc_receive_ac_level, //ac接收水平
                                            // quality_iqc_receive_rc_level:val.quality_iqc_receive_rc_level, //re接收水平
                                            // quality_iqc_result_number:val.quality_iqc_result_number, //抽样数量
                                            // quality_iqc_check_result:val.quality_iqc_check_result, //检验结果（0：合格1：不合格）
                                            // quality_iqc_checker:'', //检验员id
                                            // quality_iqc_checker_name:'', //检验员
                                            // quality_iqc_check_date:val.quality_iqc_check_date, //检验日期
                                        })
                                    })
                                    // Vue.set(addMaterialClassTemplateModal,'projectTypes',id) //修改时查询已添加的项目
                                    Vue.set(addMaterialClassTemplateModal,'iqcResult',iqcResults) //修改时查询已添加的检验项
                                    Vue.set(addMaterialClassTemplateModal,'addStayArray',data) //修改时查询已添加的检验项
                                    Vue.set(addMaterialClassTemplateModal,'addStayArray2',length) //修改时查询已添加的检验项
                                    Vue.set(addMaterialClassTemplateModal.basiCinformation,'remarks',result.map.iqcTemplates[0].quality_iqc_remarks) //修改传入名字
                                    Vue.set(addMaterialClassTemplateModal.basiCinformation,'templateName',result.map.iqcTemplates[0].quality_iqc_template_name) //修改传入名字
                                    Vue.set(addMaterialClassTemplateModal.basiCinformation,'templateType',result.map.iqcTemplates[0].quality_iqc_template_type) //修改传入类型
                                // }else{
                                    // result.map.templates.forEach((val,key) =>{
                                    //     if(val.quality_project_type_name == '检验结果'){
                                    //         data.push(val)
                                    //         Vue.set(addMaterialClassTemplateModal,'checkout',data)
                                    //     }
                                    // })
                                // }
                            }else if(result.status === 2){
                                // if(type !== 'add'){
                                    Vue.set(addMaterialClassTemplateModal,'iqcTemplates',result.map.iqcTemplates[0])
                                    Vue.set(addMaterialClassTemplateModal,'checkout',[])
                                // }else{
                                //     // var data = [{
                                //     //     quality_project_type_name:'检验结果',
                                //     //     quality_project_type_detail:'检验结果',
                                //     //     quality_project_type_id:'18760315ee2b4eee866bd0df97e08b7b'
                                //     // }]
                                //     Vue.set(addMaterialClassTemplateModal,'iqcTemplates',[])
                                //     Vue.set(addMaterialClassTemplateModal,'checkout',[])
                                // }
                            }else{
                                Vue.set(addMaterialClassTemplateModal,'iqcTemplates',[])
                                Vue.set(addMaterialClassTemplateModal,'checkout',[])
                            }

                        }
                    })
                }
                let addMaterialClassTemplateModal = new Vue({
                    el:'#addMaterialClassTemplateModal',
                    data(){
                        return {
                            iqcTemplates:[],
                            checkout:[{
                                quality_project_type_name:"附录",
                                quality_project_type_detail:"附录",
                                quality_project_type_id:"e94cfab7bd364ddc81803ac29a30b451"
                            }], //增加检验项时加的数组
                            addStayArray:[[]], //添加项目时添加的行数
                            addStayArray2:'', //添加项目时添加的行数
                            basiCinformation:{
                                templateId:'',
                                templateName:'', // 模板名称
                                templateType:'',// 模板类型
                                iqcRemarks:'', // 备注
                                remarks:'',
                                projectTypes:'',
                                iqcResult:''
                            },
                            iqcResult:[],
                            headText:'类模板详情',//模态框
                            projectTypes:[], // 修改时添加的中间表
                            distinction:'', //区分新增和修改的传值
                            isShow:type == 'details',
                            guise:false,
                            add:false, // 点击新增时判断条件
                            iqcResultNum:0
                        }
                    },
                    //渲染结束后执行
                    mounted(){
                        const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                        $(modal).modal({
                            backdrop: 'static', // 黑色遮罩不可点击
                            keyboard: false,  // esc按键不可关闭模态框
                            show: true     //显示
                        })
                    },
                    //实例执行前事件
                    created(){
                        if(type == 'modificationModel'){
                            this.headText = '修改类模板'
                        }else if(type == 'add'){
                            this.headText = '新增类模板'
                            this.add = true //点击新增
                        }
                    },
                    methods:{
                        //增加检验项
                        condensationTest(index){
                            let promise = new Promise( (resolve, reject) => {
                                condensation(resolve, null, null, this.checkout)
                            })
                            promise.then( (resolveData) => {
                            // this.basiCinformation.p1 = resolveData.typeNam
                                for(i = 0 ; i < resolveData.length; i++){
                                    this.addStayArray.push([])
                                }
                                this.checkout =this.checkout.concat(resolveData)
                            })

                        },
                        //增加项目
                        addIqcProject(index,type){
                            let promise = new Promise( (resolve, reject) => {
                                if(type === 'iqcResult'){
                                    iqcProject(resolve, null, null, this.iqcResult, '18760315ee2b4eee866bd0df97e08b7b')
                                }else{
                                    iqcProject(resolve, null, null, this.addStayArray[index], this.checkout[index].quality_project_type_id)
                                }
                            })
                            promise.then( (resolveData) => {
                                if(type === 'iqcResult'){
                                    resolveData.forEach((val,key) => {
                                        this.iqcResult.push({
                                            quality_project_name:val.qualityProjects.quality_project_name,
                                            quality_project_id:val.qualityProjects.quality_project_id, //项目id
                                        })
                                    })
                                }else{
                                    resolveData.forEach((val,key) => {
                                        this.addStayArray[index].push(val)
                                    })
                                }
                            })
                        },
                        //移除检验项
                        removeIqcProject(index){
                            swal({
                                title: '您确定要移除此条数据吗？',
                                text: '数据移除后无法恢复',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then( () => {
                                this.addStayArray.splice(index,1)
                                this.checkout.splice(index,1)
                            })
                        },
                        //提交按钮
                        submit(){
                            var addStayArray = false
                            this.addStayArray.forEach((val,key) => {
                                if(val.length == 0){
                                    addStayArray = true
                                }
                            })
                            if(this.basiCinformation.templateName == ''){
                                this.$message.error({
                                    message: '模板名称未填写',
                                    type: 'warning'
                                })
                            }else if(this.basiCinformation.templateType == ''){
                                this.$message.error({
                                    message: '模板类型未填写',
                                    type: 'warning'
                                })
                            }else if(addStayArray){
                                this.$message.error({
                                    message: '有检验项未添加项目',
                                    type: 'warning'
                                })
                            }else if(this.iqcResult.length == 0){
                                this.$message.error({
                                    message: '检验结果未添加项目',
                                    type: 'warning'
                                })
                            }else{
                                var id = []
                                var select = false
                                swal({
                                    title: '您确定要提交本次操作吗?',
                                    text: '请确保填写信息无误后点击确定按钮',
                                    type: 'question',
                                    allowEscapeKey: false, // 用户按esc键不退出
                                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                    showCancelButton: true, // 显示用户取消按钮
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then( () => {
                                    if(type == 'modificationModel'){
                                        var addStayArrayLength = 0
                                        this.addStayArray.forEach((val, key) => { // 遍历获取所有中间表id
                                            val.forEach((value, index) => {
                                                addStayArrayLength++
                                                if(value.quality_type_project_id){
                                                    this.projectTypes.push(value.quality_type_project_id)
                                                    select = true
                                                }else{
                                                    this.projectTypes.push(value.qualityTypeProject.quality_type_project_id)
                                                }
                                            })
                                        })
                                        if(addStayArrayLength !== this.addStayArray2){
                                            select = true
                                        }
                                        this.basiCinformation.templateId = this.iqcTemplates.quality_iqc_template_id
                                        if(!select && this.iqcResultNum < 2){
                                              //基础信息改动发送ajax
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCTemplateUrl,
                                                data:this.basiCinformation,
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCTemplateUrl,{type:'class',headNum:1})
                                                        const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }else{
                                             //检验项目改动发送ajax
                                            var templateName = this.iqcTemplates.quality_iqc_template_name,
                                                templateType = this.iqcTemplates.quality_iqc_template_type,
                                                iqcRemarks = this.iqcTemplates.quality_iqc_remarks
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: saveIQCTemplateUrl,
                                                data: {'templateName':templateName,'templateType':templateType,'iqcRemarks':iqcRemarks, 'projectTypes':this.projectTypes.toString(), 'iqcResult': JSON.stringify(this.iqcResult)},
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCTemplateUrl,{type:'class',headNum:1})
                                                        const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }

                                    }else{
                                        this.addStayArray.forEach((val, key) => { // 遍历获取所有中间表id
                                            val.forEach((value, index) => {
                                                id.push(value.quality_type_project_id)
                                            })
                                        })
                                        this.basiCinformation.projectTypes = id.toString()
                                        this.basiCinformation.iqcResult = JSON.stringify(this.iqcResult)
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: saveIQCTemplateUrl,
                                            data:this.basiCinformation,
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryIQCTemplateUrl,{type:'class',headNum:1})
                                                    const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail();	//操作失败
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        },
                        //日期
                        dates(e, type, type2){
                            this.$set(eval(""+type+""), type2, e.target.value)
                        },
                        //删除
                        deletes(index, type){
                            swal({
                                title: '您确定要移除此条数据吗？',
                                text: '数据移除后无法恢复',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then( () => {
                                if(type=="iqcResult"){
                                    this.iqcResult.splice(index,1)
                                }else{
                                    this.addStayArray[index].splice(type,1)
                                }
                            })
                        }
                    },
                    watch:{
                        iqcResult:{
                            handler(newValue, oldValue) {
                    　　　　　　this.iqcResultNum++
                    　　　　},
                    　　　　deep: true
                        }
                    },
                    template:`
                    <div class="modal fade" id="addMaterialClassTemplateModal">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">{{headText}}</h4>
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
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="condensationTest()" v-show="!isShow">增加检验项</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="basiCinformation.templateName" @input="basiCinformation.templateName = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_name}}</td>

                                                                    <th style="width:20%">模板类型</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="basiCinformation.templateType" @input="basiCinformation.templateType = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_type}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">备注</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="add ? basiCinformation.iqcRemarks : iqcTemplates.quality_iqc_remarks" @input="add ? basiCinformation.iqcRemarks = $event.target.value : basiCinformation.remarks = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_remarks}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td style="width:30%">{{add ? '' : iqcTemplates.quality_iqc_template_edittion}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <!-- 检验项 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIqcProject(0,'iqcResult')" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width:45%">检验项目</th>
                                                                    <th style="width:45%">说明</th>
                                                                    <th style="width:10%" v-show="!isShow">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-if="!iqcResult.length" >
                                                                <td colspan=15 class="text-center text-warning">待加...</td>
                                                                </tr>
                                                                <tr v-for="(value, index) in iqcResult">
                                                                    <td>{{value.qualityProjects ? value.qualityProjects.quality_project_name : value.quality_project_name}}</td>
                                                                    <td>暂无</td>
                                                                    <td class="table-input-td" v-show="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index, 'iqcResult')"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <el-collapse accordion v-for="(val, index) in checkout">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" v-show="!isShow" @click.stop="removeIqcProject(index)" v-if="val.quality_project_type_name !== '附录'">移除检验项</button>
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIqcProject(index)" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width:45%">检验项目</th>
                                                                    <th style="width:45%">说明</th>
                                                                    <th style="width:10%" v-show="!isShow">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-if="add ? !addStayArray[index].length : false">
                                                                    <td colspan=15 class="text-center text-warning">待加...</td>
                                                                </tr>
                                                                <tr v-for="(value, indexs) in addStayArray[index]">
                                                                    <td>{{value.qualityProjects ? value.qualityProjects.quality_project_name : value.quality_project_name}}</td>
                                                                    <td>暂无</td>
                                                                    <td class="table-input-td" v-show="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index, indexs)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!isShow">确认提交</button>
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
        case '#materialTemplateManager': {	//物料模板管理
            const swiper = document.getElementById('materialTemplateManager')   //右侧外部swiper
            const inerSwiper = document.getElementById('materialTemplateManagerInerSwiper') // 右侧内部swiper
            const panel = inerSwiper.querySelector('.panel')  // 内部swiper的面板
            const vueel = panel.querySelector('.vueel')
            const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
            const headBtnAdd = panelHeading.querySelector('.head-btn-add')  // 头部新增按钮
            const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
            const panelFooter = panel.querySelector('.panel-footer')  //面版底部
            function queryFun(url, data) {
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
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
                            Vue.set(panelBodyTableVM,'dataList',result.map.iqcTemplates)
                            Vue.set(panelBodyTableVM,'lines',result.map.lines)
                        }else{
                            Vue.set(panelBodyTableVM,'dataList',[])
                            Vue.set(panelBodyTableVM,'lines',0)
                        }
                    }
                })
            }
            queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
            //主页
            let panelBodyTableVM = new Vue({
                el:inerSwiper,
                data(){
                    return{
                        dataList:'', //遍历数据
                        lines:0, //条数
                        search:'', //搜索框值
                        currenPage:1, //当前页
                        pagesize: 10,   //页码
                        ajaxData:{
                            type:'material',
                            templateName: '',
                            headNum: 1
                        }
                    }
                },
                methods:{
                    //详情
                    detailsModel(id){
                        model('details', id)
                    },
                    //修改
                    modificationModel(id){
                        model('modificationModel', id)
                    },
                    //新增
                    add(){
                        let promise = new Promise(function (resolve, reject) {
                            optionModel('materialTemplateManager',resolve,queryIQCTemplateUrl,{type:'class',headNum:1})
                        })
                        promise.then( (resolveData) => {
                            model('add', resolveData.iqcTemplates.toString(), resolveData.materials)
                        })
                    },
                    dates(e, type, type2){
                        this.$set(eval(""+type+""), type2, e.target.value)
                    },
                    //分页变化
                    handleCurrentChange(val){
                        this.ajaxData.headNum = (val - 1) * 10 + 1;
                        queryFun(queryIQCTemplateUrl,this.ajaxData)
                    },
                    //搜索框
                    searchs(){
                        this.ajaxData.templateName = this.search
                        this.currenPage = 1
                        queryFun(queryIQCTemplateUrl,this.ajaxData)
                    },
                    deletes(id){
                        swal({
                            title: '您确定要删除此条数据吗？',
                            text: '删除后将无法查询',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(function () {
                            $.ajax({
                                url: modifyIQCTemplateUrl,
                                type: 'POST',
                                data: {
                                    'templateId':id,
                                    'status': 1,
                                },
                                success: function (result) {
                                    if (result.status === 0) {
                                        swal({
                                            title: '删除成功',
                                            type: 'success',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        }).then(
                                            () => {
                                            },
                                            (dismiss) => {
                                                queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
                                            })
                                    }
                                    else {
                                        swal({
                                            title: '删除失败',
                                            type: 'warning',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        })
                                    }
                                }
                            })
                        })
                    }
                },
                template:`
                <div class="swiper-slide swiper-no-swiping" id="materialTemplateManagerInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1"  @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
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
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover table-condensed">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">物料名称</th>
                                                <th style="width: 15%;">类模板名称</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_template_name}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_name : '暂无数据'}}</td>
                                                <td>{{value.quality_iqc_template_type}}</td>
                                                <td>{{value.quality_iqc_template_edittion}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value.quality_iqc_template_id)" href="javascript:;">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value.quality_iqc_template_id)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_iqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
            })

            //新增，修改，详情模态框
            function model(type, id, materials){
                //不同模态框传不同的值
                var byValue = ''
                if(type == 'add'){
                    byValue = 'class'
                }else{
                    byValue = 'material'
                }
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryIQCTemplateUrl,
                    data:{type:byValue, templateId:id, headNum:1},
                    success: function (result, status, xhr) {
                        if(result.status === 0){
                            var data = [],projectStandards = [],projectAppliances = [],iqcResults = [],projectAppliancesLength = 0
                            Vue.set(addMaterialTemplateModal,'iqcTemplates',result.map.iqcTemplates[0]) //给vue实例设置遍历数据
                            if(type == 'add'){
                                Vue.set(addMaterialTemplateModal,'templates',result.map.templates)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal.iqcTemplate,'quality_iqc_template_type',result.map.iqcTemplates[0].quality_iqc_template_name)  //给vue实例设置遍历数据
                                result.map.templates.forEach((val,key) =>{ //提供选择了类模板的项目
                                    projectStandards.push([])//创建二维数据
                                    projectAppliances.push([])//创建二维数据
                                     val.qualityProjects.forEach((value, index) => {
                                        data.push(value.qualityTypeProject.quality_type_project_id)
                                        if(val.quality_project_type_name === '附录'){
                                        }else if(val.quality_project_type_name === '尺寸检验'){
                                            projectStandards[key].push({
                                                quality_project_id:value.quality_project_id,  // 推入提交格式
                                                quality_iqc_project_standard: '',
                                                quality_iqc_project_units:'',
                                                quality_iqc_project_up:'',
                                                quality_iqc_project_down:'',
                                                quality_iqc_project_criterion:''})
                                        }else{
                                            projectStandards[key].push({
                                                quality_project_id:value.quality_project_id,  // 推入提交格式
                                                quality_iqc_project_criterion:''})
                                        }
                                        if(val.quality_project_type_name !== '附录'){
                                            projectAppliances[key].push({
                                                quality_project_appliance_id:'',
                                                quality_project_id:value.quality_project_id,
                                                quality_appliance_id:'',
                                                quality_appliance_number:''
                                            })
                                            projectAppliancesLength++
                                        }
                                     })
                                })
                                result.map.iqcResults.forEach((val,index) => {
                                    iqcResults.push({
                                        quality_iqc_result_id:val.quality_iqc_result_id,
                                        quality_project_name:val.qualityProject.quality_project_name,
                                        quality_project_id:val.qualityProject.quality_project_id
                                    })
                                })
                                Vue.set(addMaterialTemplateModal,'projectAppliancesLength',projectAppliancesLength)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'iqcResult',iqcResults)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectTypes',data.toString())  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectStandards',projectStandards)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectAppliances',projectAppliances)  //给vue实例设置遍历数据
                            }else{
                                Vue.set(addMaterialTemplateModal,'templates',result.map.materialTemplates)  //给vue实例设置遍历数据
                                result.map.materialTemplates.forEach((val,key) =>{ //提供选择了类模板的项目
                                    projectStandards.push([])//创建二维数据
                                    projectAppliances.push([])
                                    val.qualityProjects.forEach((value, index) => {
                                        data.push(value.qualityTypeProject.quality_type_project_id)

                                        if(value.iqcProjectStandard){
                                            if(val.quality_project_type_name === '附录'){
                                            }else if(val.quality_project_type_name === '尺寸检验'){
                                                projectStandards[key].push({
                                                    quality_iqc_project_standard_id:value.iqcProjectStandard.quality_iqc_project_standard_id,
                                                    quality_project_id:value.quality_project_id,  // 推入提交格式
                                                    quality_iqc_project_standard:value.iqcProjectStandard.quality_iqc_project_standard,
                                                    quality_iqc_project_units:value.iqcProjectStandard.quality_iqc_project_units,
                                                    quality_iqc_project_up:value.iqcProjectStandard.quality_iqc_project_up,
                                                    quality_iqc_project_down:value.iqcProjectStandard.quality_iqc_project_down,
                                                    quality_iqc_project_criterion:value.iqcProjectStandard.quality_iqc_project_criterion})
                                            }else{
                                                projectStandards[key].push({
                                                    quality_iqc_project_standard_id:value.iqcProjectStandard.quality_iqc_project_standard_id,
                                                    quality_project_id:value.quality_project_id,  // 推入提交格式
                                                    quality_iqc_project_criterion:value.iqcProjectStandard.quality_iqc_project_criterion})
                                            }

                                        }else{
                                            if(val.quality_project_type_name === '附录'){
                                            }else if(val.quality_project_type_name === '尺寸检验'){
                                                projectStandards[key].push({
                                                    quality_project_id:value.quality_project_id,  // 推入提交格式
                                                    quality_iqc_project_standard: '',
                                                    quality_iqc_project_units:'',
                                                    quality_iqc_project_up:'',
                                                    quality_iqc_project_down:'',
                                                    quality_iqc_project_criterion:''})
                                            }else{
                                                projectStandards[key].push({
                                                    quality_project_id:value.quality_project_id,  // 推入提交格式
                                                    quality_iqc_project_criterion:''})
                                            }
                                        }
                                        if(value.qualityIqcAppliance){
                                            // applianceName[key].push({applianceNumber : value.qualityIqcAppliance.quality_appliance_number})
                                            projectAppliances[key].push({
                                                quality_project_appliance_id:value.qualityIqcAppliance.quality_project_appliance_id,
                                                quality_iqc_template_id:result.map.iqcTemplates[0].quality_iqc_template_id,
                                                quality_project_id:value.quality_project_id,
                                                quality_appliance_id:value.qualityIqcAppliance.quality_appliance_id,
                                                quality_appliance_number:value.qualityIqcAppliance.quality_appliance_number,
                                            })
                                        }else{
                                            // applianceName[key].push({applianceNumber : ''})
                                            projectAppliances[key].push({
                                                quality_project_appliance_id:'',
                                                quality_iqc_template_id:'',
                                                quality_project_id:'',
                                                quality_appliance_id:'',
                                                quality_appliance_number:'',
                                            })
                                        }
                                    })
                                })
                                result.map.iqcResults.forEach((val,index) => {
                                    iqcResults.push({
                                        quality_iqc_result_id:val.quality_iqc_result_id,
                                        quality_project_name:val.qualityProject.quality_project_name,
                                        quality_project_id:val.qualityProject.quality_project_id
                                    })
                                })
                                Vue.set(addMaterialTemplateModal,'iqcResult',iqcResults)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectAppliances',projectAppliances)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectTypes',data.toString())  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal,'projectStandards',projectStandards)  //给vue实例设置遍历数据
                                // Vue.set(addMaterialTemplateModal,'applianceName',applianceName)  //给vue实例设置遍历数据
                                Vue.set(addMaterialTemplateModal.iqcTemplate,'quality_iqc_template_name',result.map.iqcTemplates[0].quality_iqc_template_name)  //给vue实例设置遍历数据
                            }

                        }else if(result.status === 2){
                            Vue.set(addMaterialTemplateModal,'iqcTemplates',result.map.iqcTemplates[0])
                            Vue.set(addMaterialTemplateModal,'templates',[])
                        }else{
                            Vue.set(addMaterialTemplateModal,'iqcTemplates',[])
                            Vue.set(addMaterialTemplateModal,'templates',[])
                        }

                    }
                })
                let addMaterialTemplateModal = new Vue({
                    el:'#addMaterialTemplateModal',
                    data(){
                        return {
                            iqcTemplates:'',
                            templates:[],
                            projectTypes:'', //检验项项目id
                            materialsName:'',
                            iqcTemplate:{  //基础信息
                                quality_iqc_template_name:'',
                                warehouse_material_id:'',
                                quality_iqc_template_type:''
                            },
                            iqcTemplate_quality_iqc_template_name:0,//检测修改时是否发送基础信息ajax
                            projectAppliances:[], //项目标准
                            isShow:type == 'details',
                            isShow2:type == 'modificationModel',
                            add:false,
                            headText:'物料模板详情',//模态框
                            inspection : [], //检验方式数据
                            inspectionselected:'',//检验方式选中的数据
                            appliancesId:[], //选择器具的时候判断条件
                            // appliancesName:[], //选择器具后表格添加名字
                            projectStandards:[],//检验标准
                            projectStandardsNum:0, //检测修改时是否发送标准ajax
                            projectAppliancesNum:0, //检测修改时是否发送器具ajax
                            // applianceName:[], //选择检验方式后在表格中显示的内容
                            // applianceJudge:[], //判断选择是否重复选择器具
                            iqcResult:[], //检验结果
                            projectAppliancesLength:0, //检验方式判定结果
                        }
                    },
                    mounted(){
                        const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                        $(modal).modal({
                            backdrop: 'static', // 黑色遮罩不可点击
                            keyboard: false,  // esc按键不可关闭模态框
                            show: true     //显示
                        })
                    },
                    created(){
                        if(type == 'modificationModel'){
                            this.headText = '修改物料模板'
                            this.shiyan = this.basiCinformation2
                        }else if(type == 'details'){
                            this.shiyan = this.basiCinformation2
                        }else if(type == 'add'){
                            this.add = true
                            this.headText = '新增物料模板'
                            this.materialsName = materials.warehouse_material_name
                            this.iqcTemplate.warehouse_material_id = materials.warehouse_material_id
                        }
                    },
                    methods:{
                        condensationTest(){
                            condensation()
                        },
                        addIqcProject(){
                            iqcProject()
                        },
                        //器具选择事件
                        appliance(index, index2){
                            let promise = new Promise(function (resolve, reject) {
                                applianceModel(resolve, queryApplianceUrl, {headNum:1})
                            })
                            promise.then( (resolveData) => {
                                this.projectAppliances[index][index2].quality_appliance_id = resolveData.quality_appliance_id
                                this.projectAppliances[index][index2].quality_appliance_number = resolveData.quality_appliance_number
                                // if(this.appliancesId.length){   //选择了的器具进行遍历
                                //     this.appliancesId.forEach((val,key) => { //遍历已选择的器具

                                //         if(val == id){ //没选择的器具添加
                                //             this.applianceJudge.push(true)

                                //         }else{    //选择了的器具重新选择
                                //             this.applianceJudge.push(false)
                                //         }
                                //     })
                                //     var subscript = this.applianceJudge.indexOf(true)

                                //     if(subscript !== -1){
                                //         this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                                //         this.projectAppliances.splice(subscript, 1, {'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                                //     }else{
                                //         this.appliancesId.push(id)
                                //         this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                                //         this.projectAppliances.push({'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                                //     }

                                // }else{  //没有选择了的器具直接添加
                                //     this.appliancesId.push(id)
                                //     this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                                //     this.projectAppliances.push({'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                                // }

                            })
                        },
                        submit(){
                            var data = [],projectAppliances = [],projectStandards = false
                            this.projectStandards.forEach((val,key) => {
                                val.forEach((value,index) => {
                                    data.push(value)
                                })
                            })
                            this.projectAppliances.forEach((val,key) => {
                                val.forEach((value,index) => {
                                    if(value.quality_appliance_id !== ''){
                                        projectAppliances.push(value)
                                    }
                                })
                            })
                            console.log(data)
                            data.forEach((value,index) => {
                                // for(var val in value){
                                //     if(value[val] == ''){
                                //        projectStandards = true
                                //     }
                                // }
                                if(value.quality_iqc_project_criterion === ""){
                                    projectStandards = true
                                }
                            })
                            if(this.iqcTemplate.quality_iqc_template_name == ''){
                                this.$message.error({
                                    message: `模板名称未填写`,
                                    type: 'warning'
                                  });
                            }else if(projectAppliances.length < this.projectAppliancesLength){
                                this.$message.error({
                                    message: `检验项中有检验方式未选择`,
                                    type: 'warning'
                                  });
                            }else if(projectStandards){
                                this.$message.error({
                                    message: `检验项中有项目标准未填写`,
                                    type: 'warning'
                                  });
                            }else{
                                swal({
                                    title: '您确定要提交本次操作吗?',
                                    text: '请确保填写信息无误后点击确定按钮',
                                    type: 'question',
                                    allowEscapeKey: false, // 用户按esc键不退出
                                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                    showCancelButton: true, // 显示用户取消按钮
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then( () => {
                                    if(type == 'modificationModel'){
                                        //修改提交按钮
                                        if(this.iqcTemplate_quality_iqc_template_name > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCTemplateUrl,
                                                data:{ templateId:id,templateName:this.iqcTemplate.quality_iqc_template_name},
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
                                                        const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                        if(this.projectStandardsNum > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCProjectStandardUrl,
                                                data:{
                                                    iqcProjectStandards: JSON.stringify(data)
                                                },
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
                                                        const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                        if(this.projectAppliancesNum > 1){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyIQCProjectApplianceUrl,
                                                data:{
                                                    projectAppliances: JSON.stringify(projectAppliances)
                                                },
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
                                                        const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail();	//操作失败
                                                    }
                                                }
                                            })
                                        }

                                    }else{
                                        //新增提交按钮

                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: saveIQCMaterialTemplateUrl,
                                            data:{
                                                iqcTemplate:JSON.stringify(this.iqcTemplate), //基础信息
                                                iqcResult:JSON.stringify(this.iqcResult),
                                                projectTypes:this.projectTypes.toString(),  //项目信息
                                                projectAppliances:JSON.stringify(projectAppliances),  //器具信息
                                                projectStandards: JSON.stringify(data)
                                            },
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryIQCTemplateUrl,{type:'material',headNum:1})
                                                    const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail();	//操作失败
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        },
                    },
                    watch:{
                        projectStandards:{
                            handler(newValue, oldValue) {
                    　　　　　　this.projectStandardsNum++
                    　　　　},
                    　　　　deep: true
                        },
                        iqcTemplate:{
                            handler(newValue, oldValue) {
                    　　　　　　this.iqcTemplate_quality_iqc_template_name++
                    　　　　},
                    　　　　deep: true
                        },
                        projectAppliances:{
                            handler(newValue, oldValue) {
                    　　　　　　this.projectAppliancesNum++
                    　　　　},
                    　　　　deep: true
                        },

                    },
                    template:`
                    <div class="modal fade" id="addMaterialTemplateModal">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">{{headText}}</h4>
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
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcTemplate.quality_iqc_template_name">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_name}}</td>

                                                                    <th style="width:20%">类模板名称</th>
                                                                    <td style="width:30%" v-if="add">{{iqcTemplate.quality_iqc_template_type}}</td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.quality_iqc_template_type}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">物料名称</th>
                                                                    <td style="width:30%" v-if="add">{{materialsName}}</td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.material ? iqcTemplates.material.warehouse_material_name : ''}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="add"></td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.quality_iqc_template_edittion}}</td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>

                                                <!-- 检验结果 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:12%">区 分</th>
                                                                    <th style="width:12%">检查水平</th>
                                                                    <th style="width:12%">AC</th>
                                                                    <th style="width:12%">RC</th>
                                                                    <th style="width:12%">抽样数量</th>
                                                                    <th style="width:12%">检验结果</th>
                                                                    <th style="width:12%">检验员</th>
                                                                    <th style="width:12%">检验日期</th>
                                                                </tr>
                                                                <tr v-for="(val, index) in iqcResult">
                                                                    <th>{{val.quality_project_name}}</th>
                                                                    <td class="text-center text-warning" colspan="7">
                                                                        在报告中填写...
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 外观 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name !== '尺寸检验' && val.quality_project_type_name !== '附录' && val.quality_project_type_name !== '检验结果'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:33%">检验内容</th>
                                                                    <th style="width:33%">检测方式</th>
                                                                    <th style="width:33%">检验标准</th>
                                                                </tr>

                                                                <tr v-for="(value, key) in val.qualityProjects">
                                                                    <td>{{value.quality_project_name}}</td>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" @click="appliance(index, key)" :value="projectAppliances[index][key].quality_appliance_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{projectAppliances[index][key].quality_appliance_number}}</td>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="projectStandards[index][key].quality_iqc_project_criterion " @input="projectStandards[index][key].quality_iqc_project_criterion = $event.target.value">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard ? value.iqcProjectStandard.quality_iqc_project_criterion : ''}}</td>

                                                                </tr>


                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 尺寸特性 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name == '尺寸检验'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">尺寸检验</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">检验项目</th>
                                                                    <th style="width:10%">检测方式</th>
                                                                    <th style="width:10%">检验标准</th>
                                                                    <th style="width:10%">规格</th>
                                                                    <th style="width:10%">单位</th>
                                                                    <th style="width:10%">上限</th>
                                                                    <th style="width:10%">下限</th>
                                                                </tr>
                                                                <tr v-for="(value, key) in val.qualityProjects">

                                                                    <td>{{value.quality_project_name}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" @click="appliance(index, key)" :value="projectAppliances[index][key].quality_appliance_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{projectAppliances[index][key].quality_appliance_number}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_criterion">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_standard">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_standard}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_units">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_units}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_up">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_up}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_down">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_down}}</td>

                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 尺寸特性 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name == '附录'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">附录</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                        <tbody>
                                                            <tr>
                                                                <th style="width:10%">附录名称</th>
                                                                <th style="width:10%">备注</th>
                                                            </tr>

                                                            <tr v-for="(value, key) in val.qualityProjects">
                                                                <td>{{value.quality_project_name}}</td>
                                                                <td>暂无</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!isShow">确认提交</button>
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
        case '#processQualityReport': {	//品质报告

          }
          break;
        case '#processTemplateManage': {	//检测方案管理

          }
          break;
        case '#processPlanManage': {	//检测计划管理

          }
          break;
        case '#finalQualityReport': {	//电芯出货报告
            const swiper = document.getElementById('finalQualityReport')   //右侧外部swiper
            function queryFun(url, data) {
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
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
                            Vue.set(panelBodyTableVM,'dataList',result.map.fqcReportList)
                            Vue.set(panelBodyTableVM,'lines',result.map.line)
                        }else{
                            Vue.set(panelBodyTableVM,'dataList',[])
                            Vue.set(panelBodyTableVM,'lines',0)
                        }
                    }
                })
            }
            queryFun(queryFQCReportUrl,{headNum:1})

            let panelBodyTableVM = new Vue({
                el:'#finalQualityReportInerSwiper',
                data(){
                    return{
                        dataList:[],
                        lines:0, //条数
                        search:'', //搜索框值
                        currenPage:1, //当前页
                        pagesize: 10,   //页码
                        ajaxData:{
                            reportName: '',
                            headNum: 1
                        }
                    }
                },
                methods:{
                     //详情
                     detailsModel(val){
                        model('details', val.quality_fqc_report_id)
                    },
                    //修改
                    modificationModel(val){
                        model('modificationModel', val.quality_fqc_report_id)
                    },
                    //新增
                    add(){
                        let promise = new Promise( (resolve, reject) => {
                            reportTemplate(resolve, null, null)
                        })
                        promise.then( (resolveData) => {
                            model('add',resolveData.quality_fqc_template_id)
                        })
                    },
                     //分页变化
                     handleCurrentChange(val){
                        this.ajaxData.headNum = (val - 1) * 10 + 1;
                        queryFun(queryFQCReportUrl,this.ajaxData)
                    },
                    //搜索框
                    searchs(){
                        this.ajaxData.reportName = this.search
                        this.currenPage = 1
                        queryFun(queryFQCReportUrl,this.ajaxData)
                    },
                    deletes(id){

                        swal({
                            title: '您确定要移除此条数据吗？',
                            text: '数据移除后无法恢复',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then( () => {
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: removeFQCReportUrl,
                                data:{reportId:id},
                                success: function (result, status, xhr) {
                                    if (result.status === 0) {
                                        swal({
                                            title: '删除成功',
                                            type: 'success',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        }).then(
                                            () => {
                                            },
                                            (dismiss) => {
                                                queryFun(queryFQCReportUrl,{headNum:1})
                                            })
                                    }
                                    else {
                                        swal({
                                            title: '删除失败',
                                            type: 'warning',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        })
                                    }
                                }
                            })
                        })
                    },
                },
                template:`
                <div class="swiper-slide swiper-no-swiping" id="finalQualityReportInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
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
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover table-condensed">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">报告名称</th>
                                                <th style="width: 15%;">报告类型</th>
                                                <th style="width: 15%;">电池型号</th>
                                                <th style="width: 15%;">电池批号</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_fqc_report_name}}</td>
                                                <td>{{value.quality_fqc_report_type}}</td>
                                                <td>{{value.warehouse_product_model}}</td>
                                                <td>{{value.warehouse_product_batch}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_fqc_report_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
            })

            //新增、详情、修改模态框
            function model(type, id){
                if(type !== 'add'){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryFQCReportUrl,
                        data:{reportId: id},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(addFinalQualityReportModal,'fqcReport',result.map.fqcReport)
                                Vue.set(addFinalQualityReportModal,'fqcProjectResultList',result.map.fqcReport.fqcProjectResultList)
                                Vue.set(addFinalQualityReportModal,'fqcUnqualifiedList',result.map.fqcReport.fqcUnqualifiedList[0])
                                var fqcProjectResultListJsonStr = []

                                // Vue.set(addFinalQualityReportModal,'approves',result.map.fqcReport.quality_fqc_check_people)
                                 var fQCReports = { //新增时发送的ajax数据
                                    quality_fqc_report_id:result.map.fqcReport.quality_fqc_report_id,//ifqc检验报告id
                                    quality_fqc_template_id:result.map.fqcReport.quality_fqc_template_id, //fqc检验模板id
                                    quality_fqc_report_number:result.map.fqcReport.quality_fqc_report_number,//报检单号
                                    product_model_id:result.map.fqcReport.product_model_id, // 产品id
                                    quality_fqc_report_name:result.map.fqcReport.quality_fqc_report_name,//报告名称
                                    quality_fqc_report_type:result.map.fqcReport.quality_fqc_report_type,//报告类型
                                    quality_fqc_customer_name:result.map.fqcReport.quality_fqc_customer_name, //客户名称
                                    warehouse_product_batch:result.map.fqcReport.warehouse_product_batch,  //电池批号
                                    warehouse_product_inspection_number:result.map.fqcReport.warehouse_product_inspection_number,  //报检数量
                                    warehouse_product_sample_number:result.map.fqcReport.warehouse_product_sample_number,  //抽样数量
                                    quality_fqc_publish_date:result.map.fqcReport.quality_fqc_publish_date, //发布日期
                                    quality_fqc_check_peopleid:result.map.fqcReport.quality_fqc_check_peopleid, //检验人员id
                                    quality_fqc_check_auditor: result.map.fqcReport.quality_fqc_check_auditor, //审核人员
                                    quality_fqc_check_auditor_id: result.map.fqcReport.quality_fqc_check_auditor_id,//审核人员
                                    quality_fqc_check_people:result.map.fqcReport.quality_fqc_check_people, //检验人员
                                    quality_fqc_check_date:result.map.fqcReport.quality_fqc_check_date, //检验日期
                                    quality_fqc_check_auditor_date:result.map.fqcReport.quality_fqc_check_auditor_date,//审核日期
                                    warehouse_product_capacity_grade:result.map.fqcReport.warehouse_product_capacity_grade, //容量档次
                                    warehouse_product_model:result.map.fqcReport.warehouse_product_model, //电池型号
                                    quality_fqc_comprehensive_result:result.map.fqcReport.quality_fqc_comprehensive_result, //综合判定(0:合格 1：不合格)
                                }
                                var fqcUnqualified = { //新增时发送的ajax数据
                                    quality_fqc_unqualified_id:result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_id,
                                    quality_fqc_unqualified_probability:result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_probability, //不良率
                                    quality_fqc_unqualified_number:result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_number, //不良数量
                                }

                                result.map.fqcReport.fqcProjectResultList.forEach((val,key) => {
                                    fqcProjectResultListJsonStr.push({
                                        quality_fqc_project_result_id:val.quality_fqc_project_result_id, //id
                                        quality_fqc_project_content:val.quality_fqc_project_content, //不良内容
                                        quality_fqc_project_determine:val.quality_fqc_project_determine, //判断
                                        quality_fqc_project_number:val.quality_fqc_project_number, //不良数量
                                        quality_fqc_project_aql_criterion:val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_aql_criterion, //判定标准(AQL)
                                        quality_fqc_project_il_criterion:val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_il_criterion, //判定标准(IL)
                                        quality_fqc_project_check_method:val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_check_method, //测试方法
                                        quality_fqc_project_criterion:val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_criterion, //检验标准
                                    })
                                })
                                Vue.set(addFinalQualityReportModal,'fQCReports',fQCReports)
                                Vue.set(addFinalQualityReportModal,'fqcUnqualified',fqcUnqualified)
                                Vue.set(addFinalQualityReportModal,'fqcProjectResultListJsonStr',fqcProjectResultListJsonStr)
                            }else{
                                var fQCReports = { //新增时发送的ajax数据
                                    quality_fqc_template_id:'', //fqc检验模板id
                                    quality_fqc_report_number:'',//报检单号
                                    product_model_id:'', // 产品id
                                    quality_fqc_report_name:'',//报告名称
                                    quality_fqc_report_type:'',//报告类型
                                    quality_fqc_customer_name:'', //客户名称
                                    warehouse_product_batch:'',  //电池批号
                                    warehouse_product_inspection_number:'',  //报检数量
                                    warehouse_product_sample_number:'',  //抽样数量
                                    quality_fqc_publish_date:'', //发布日期
                                    quality_fqc_check_people:'', //检验人员
                                    quality_fqc_check_peopleid:'', //检验人员id
                                    quality_fqc_check_auditor: '', //审核人员
                                    quality_fqc_check_auditor_id: '',//审核人员
                                    quality_fqc_check_date:'', //检验日期
                                    quality_fqc_check_auditor_date:'',//审核日期
                                    warehouse_product_capacity_grade:'', //容量档次
                                    warehouse_product_model:'', //电池型号
                                    quality_fqc_comprehensive_result:'', //综合判定(0:合格 1：不合格)
                                }
                                Vue.set(addFinalQualityReportModal,'fQCReports',[])
                            }

                        }
                    })
                }else{
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryFQCTemplateUrl,
                        data:{templateId: id},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(addFinalQualityReportModal,'fqcReport', result.map.fqcTemplate)
                                Vue.set(addFinalQualityReportModal,'fqcProjectResultList', result.map.fqcTemplate.templateProjectList)
                                var fQCReports = { //新增时发送的ajax数据
                                    quality_fqc_template_id:'', //fqc检验模板id
                                    product_model_id:'', // 产品id
                                    quality_fqc_report_name:'',//报告名称
                                    quality_fqc_report_type: result.map.fqcTemplate.quality_fqc_template_type,//报告类型
                                    quality_fqc_customer_name:'', //客户名称
                                    warehouse_product_batch:'',  //电池批号
                                    warehouse_product_inspection_number:'',  //报检数量
                                    warehouse_product_sample_number:'',  //抽样数量
                                    quality_fqc_publish_date:'', //发布日期
                                    quality_fqc_check_people:'', //检验人员
                                    quality_fqc_check_peopleid:'', //检验人员id
                                    quality_fqc_check_auditor:'', //审核人员
                                    quality_fqc_check_auditor_id: '',//审核人员
                                    quality_fqc_check_date:'', //检验日期
                                    quality_fqc_check_auditor_date:'',//审核日期
                                    warehouse_product_capacity_grade:'', //容量档次
                                    warehouse_product_model:'', //电池型号
                                    quality_fqc_comprehensive_result:'', //综合判定(0:合格 1：不合格)
                                }
                                var fqcProjectResultListJsonStr = []
                                result.map.fqcTemplate.templateProjectList.forEach((val,key) => {
                                    fqcProjectResultListJsonStr.push({
                                        quality_project_id:val.qualityTypeProject.quality_project_id, //不良内容
                                        quality_fqc_project_content:'', //不良内容
                                        quality_fqc_project_determine:'-1', //判断
                                        quality_fqc_project_number:'', //不良数量
                                        quality_fqc_project_aql_criterion:val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion, //判定标准(AQL)
                                        quality_fqc_project_il_criterion:val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion, //判定标准(IL)
                                        quality_fqc_project_check_method:val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method, //测试方法
                                        quality_fqc_project_criterion:val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion, //检验标准
                                    })
                                })
                                Vue.set(addFinalQualityReportModal,'fQCReports',fQCReports)
                                Vue.set(addFinalQualityReportModal,'fqcProjectResultListJsonStr',fqcProjectResultListJsonStr)
                            }
                        }
                    })

                }
                let addFinalQualityReportModal = new Vue({
                    el:'#addFinalQualityReportModal',
                    data(){
                        return {
                            add:false,
                            modificationModel:false,
                            details:false,
                            fqcReport:[], //基础信息
                            fqcProjectResultList:[], //项目内容
                            fqcUnqualifiedList:[], //综合结果
                            headText:'出货报告',
                            fQCReports:{ //新增时发送的ajax数据
                                quality_fqc_template_id:'', //fqc检验模板id
                                product_model_id:'', // 产品id
                                quality_fqc_report_number:'',//报检单号
                                quality_fqc_report_name:'',//报告名称
                                quality_fqc_report_type:'',//报告类型
                                quality_fqc_customer_name:'', //客户名称
                                warehouse_product_batch:'',  //电池批号
                                warehouse_product_inspection_number:'',  //报检数量
                                warehouse_product_sample_number:'',  //抽样数量
                                quality_fqc_publish_date:'', //发布日期
                                quality_fqc_check_people:'', //检验人员
                                quality_fqc_check_peopleid:'', //检验人员id
                                quality_fqc_check_auditor:'', //审核人员
                                quality_fqc_check_auditor_id: '',//审核人员
                                quality_fqc_check_date:'', //检验日期
                                quality_fqc_check_auditor_date:'',//审核日期
                                warehouse_product_capacity_grade:'', //容量档次
                                warehouse_product_model:'', //电池型号
                                quality_fqc_comprehensive_result:'', //综合判定(0:合格 1：不合格)
                            },
                            fqcProjectResultListJsonStr:[], //发送项目
                            fqcUnqualified:{ //新增时发送的ajax数据
                                quality_fqc_unqualified_probability:'', //不良率
                                quality_fqc_unqualified_number:'', //不良数量
                            }
                        }
                    },
                    methods:{
                        //选择模板
                        optionalModule(){
                            let promise = new Promise( (resolve, reject) => {
                                reportTemplate(resolve, null, null)
                            })
                            promise.then( (resolveData) => {
                                // console.log(resolveData)
                                // $.ajax({
                                //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                //     url: queryFQCTemplateUrl,
                                //     data:{templateId:resolveData.quality_fqc_template_id,headNum:1},
                                //     success:  (result, status, xhr) => {
                                //         if(result.status === 0 ){

                                //         }
                                //     }
                                // })
                            })

                        },
                        //选择批准人和审核人事件
                        people(type2){
                            let promise = new Promise(function (resolve, reject) {
                                peopleModel(resolve,null,null)
                            })
                            promise.then( (resolveData) => {
                                if(type2 == '检验员'){
                                    this.fQCReports.quality_fqc_check_people = resolveData.role_staff_name
                                    this.fQCReports.quality_fqc_check_peopleid = resolveData.role_staff_id
                                    if(type === 'add'){
                                        this.fQCReports.quality_fqc_check_date = moment().format('YYYY-MM-DD HH:mm:ss')
                                    }
                                }else{
                                    this.fQCReports.quality_fqc_check_auditor = resolveData.role_staff_name
                                    this.fQCReports.quality_fqc_check_auditor_id = resolveData.role_staff_id
                                    if(type === 'add'){
                                        this.fQCReports.quality_fqc_check_auditor_date = moment().format('YYYY-MM-DD HH:mm:ss')
                                    }
                                }
                            })
                        },
                         //产品选择
                        product(){
                            let promise = new Promise(function (resolve, reject) {
                                productModel(resolve,null,null)
                            })
                            promise.then( (resolveData) => {
                                this.fQCReports.warehouse_product_model = resolveData.productModel.warehouse_product_model_name
                                this.fQCReports.product_model_id = resolveData.warehouse_product_id
                            })
                        },
                        //确认按钮
                        submit(){
                            if(this.fQCReports.quality_fqc_customer_name == ''){
                                this.$message.error({
                                    message: '客户名称未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.quality_fqc_report_name == ''){
                                this.$message.error({
                                    message: '报告名称未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.quality_fqc_report_number == ''){
                                this.$message.error({
                                    message: '报检单号未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.warehouse_product_batch == ''){
                                this.$message.error({
                                    message: '电池批号未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.quality_fqc_publish_date == ''){
                                this.$message.error({
                                    message: '报检日期未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.warehouse_product_capacity_grade == ''){
                                this.$message.error({
                                    message: '容量档次未填写',
                                    type: 'warning'
                                })
                            }else if(this.fQCReports.warehouse_product_model == ''){
                                this.$message.error({
                                    message: '电池型号未填写',
                                    type: 'warning'
                                })
                            }else{
                                swal({
                                    title: '您确定要提交本次操作吗?',
                                    text: '请确保填写信息无误后点击确定按钮',
                                    type: 'question',
                                    allowEscapeKey: false, // 用户按esc键不退出
                                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                    showCancelButton: true, // 显示用户取消按钮
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then( () => {
                                    var data = {
                                        quality_fqc_report_id:this.fQCReports.quality_fqc_report_id,//ifqc检验报告id
                                        quality_fqc_template_id:id, //fqc检验模板id
                                        quality_fqc_report_number:this.fQCReports.quality_fqc_report_number,//报检单号
                                        quality_fqc_report_name:this.fQCReports.quality_fqc_report_name,//报告名称
                                        quality_fqc_report_type:this.fQCReports.quality_fqc_report_type,//报告类型
                                        quality_fqc_customer_name:this.fQCReports.quality_fqc_customer_name, //客户名称
                                        warehouse_product_batch:this.fQCReports.warehouse_product_batch,  //电池批号
                                        warehouse_product_inspection_number:this.fQCReports.warehouse_product_inspection_number,  //报检数量
                                        warehouse_product_sample_number:this.fQCReports.warehouse_product_sample_number,  //抽样数量
                                        quality_fqc_publish_date2:this.fQCReports.quality_fqc_publish_date, //发布日期
                                        quality_fqc_check_people:this.fQCReports.quality_fqc_check_people, //检验人员
                                        quality_fqc_check_peopleid:this.fQCReports.quality_fqc_check_peopleid, //检验人员id
                                        quality_fqc_check_auditor:this.fQCReports.quality_fqc_check_auditor, //审核人员
                                        quality_fqc_check_auditor_id:this.fQCReports.quality_fqc_check_auditor_id,//审核人员
                                        quality_fqc_check_date2:this.fQCReports.quality_fqc_check_date, //检验日期
                                        quality_fqc_check_auditor_date2:this.fQCReports.quality_fqc_check_auditor_date,//审核日期
                                        warehouse_product_capacity_grade:this.fQCReports.warehouse_product_capacity_grade, //容量档次
                                        warehouse_product_model:this.fQCReports.warehouse_product_model, //电池型号
                                        product_model_id:this.fQCReports.product_model_id, //产品id
                                        quality_fqc_unqualified_id:this.fqcUnqualified.quality_fqc_unqualified_id,
                                        quality_fqc_comprehensive_result:this.fQCReports.quality_fqc_comprehensive_result,//综合判定(0:合格 1：不合格)
                                        quality_fqc_unqualified_probability:this.fqcUnqualified.quality_fqc_unqualified_probability, //不良率
                                        quality_fqc_unqualified_number:this.fqcUnqualified.quality_fqc_unqualified_number,
                                        fqcProjectResultListJsonStr:JSON.stringify(this.fqcProjectResultListJsonStr)}
                                    if(type=='add'){

                                        //新增提交
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: saveFQCReportUrl,
                                            data:data,
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryFQCReportUrl,{headNum:1})
                                                    const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail2(result.msg);	//操作失败
                                                }
                                            }
                                        })
                                    }else{
                                        //修改提交按钮
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: modifyFQCReportUrl,
                                            data:data,
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryFQCReportUrl,{headNum:1})
                                                    const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail2(result.msg);	//操作失败
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    },
                    computed:{
                        quality_fqc_unqualified_probability:{
                            get(){
                                var sum
                                if(this.fQCReports.warehouse_product_sample_number != '' && this.fQCReports.warehouse_product_sample_number != ''){
                                    var sum =  Math.round((this.fqcUnqualified.quality_fqc_unqualified_number/ this.fQCReports.warehouse_product_sample_number) * 10000)/100 + '%'
                                }else{
                                    sum = ''
                                }
                                this.fqcUnqualified.quality_fqc_unqualified_probability = sum
                                return sum
                            }
                        }
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
                    created(){
                        if(type == 'modificationModel'){
                            this.headText = '修改出货报告'
                            this.modificationModel = true
                        }else if(type == 'add'){
                            this.headText = '新增出货报告'
                            this.add = true
                        }else if(type == 'details'){
                            this.details = true
                        }
                    },

                    template:`
                    <!-- 新增出货报告模态框 -->
                    <div class="modal fade" id="addFinalQualityReportModal">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">{{headText}}</h4>
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
                                                                <!--<form class="form-inline pull-right">
                                                                   <button type="button" class="btn btn-primary btn-sm" @click="optionalModule()">选择报告模板</button>
                                                                </form> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:14%">报告名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_report_name">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_report_name}}</td>

                                                                    <th style="width:14%">报告类型</th>
                                                                    <td style="width:19%">{{fQCReports.quality_fqc_report_type}}</td>

                                                                    <th style="width:14%">电池批号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_batch">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_batch}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">报检单号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_report_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_report_number}}</td>

                                                                    <th style="width:14%">报检日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="fQCReports.quality_fqc_publish_date | times" @blur="fQCReports.quality_fqc_publish_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_publish_date | times}}</td>

                                                                    <th style="width:14%">客户名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_customer_name">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_customer_name}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">电池型号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_model" @click="product()">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_model}}</td>

                                                                    <th style="width:14%">容量档次</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_capacity_grade">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_capacity_grade}}</td>

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
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fQCReports.warehouse_product_sample_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_sample_number}}</td>

                                                                    <th style="width:14%">不良数量</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcUnqualified.quality_fqc_unqualified_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcUnqualifiedList.quality_fqc_unqualified_number}}</td>

                                                                    <th style="width:14%">不良率</th>
                                                                    <td style="width:19%">{{quality_fqc_unqualified_probability}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">报检数量</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fQCReports.warehouse_product_inspection_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_inspection_number}}</td>


                                                                    <th style="width:14%">检验人员</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" @click="people('检验员')" :value="fQCReports.quality_fqc_check_people">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_people}}</td>

                                                                    <th style="width:14%">检验日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="fQCReports.quality_fqc_check_date | times" @blur="fQCReports.quality_fqc_check_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_date | times}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">审核人员</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on"  @click="people('审核人')" :value="fQCReports.quality_fqc_check_auditor">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_auditor}}</td>

                                                                    <th style="width:14%">审查日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="fQCReports.quality_fqc_check_auditor_date | times"  @blur="fQCReports.quality_fqc_check_auditor_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_auditor_date | times}}</td>

                                                                    <th style="width:14%">综合判定</th>
                                                                    <td class="table-input-td" style="width:19%">
                                                                        <select class="form-control" v-model="fQCReports.quality_fqc_comprehensive_result" :disabled="details">
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
                                                                <tr v-show="!fqcProjectResultList.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>

                                                                <tr v-if="!add" v-for="(val,index) in fqcProjectResultList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{val.qualityProject.quality_project_name}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_il_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_aql_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_check_method}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_determine" :disabled="details">
                                                                            <option value="-1">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_content">
                                                                    </td>
                                                                    <td v-if="details">{{val.quality_fqc_project_content}}</td>

                                                                    <td class="table-input-td"  v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_number">
                                                                    </td>
                                                                    <td v-if="details">{{val.quality_fqc_project_number}}</td>
                                                                </tr>
                                                                <tr v-if="add" v-for="(val,index) in fqcProjectResultList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.quality_project_name}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control"  v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_determine" :disabled="details">
                                                                            <option value="-1">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_content">
                                                                    </td>
                                                                    <td v-show="details">{{val.quality_fqc_project_content}}</td>

                                                                    <td class="table-input-td" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_number">
                                                                    </td>
                                                                    <td v-show="details">{{val.quality_fqc_project_number}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!details">确认提交</button>
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
        case '#finaltemplateManage': {	//电芯出货报告模板管理
            const swiper = document.getElementById('finaltemplateManage')   //右侧外部swiper
            function queryFun(url, data) {
                var mesloadBox = new MesloadBox(swiper, {
                    // 主数据载入窗口
                    warningContent: '没有此类信息，请重新选择或输入'
                })
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
                            Vue.set(panelBodyTableVM,'dataList',result.map.fqctemplateList)
                            Vue.set(panelBodyTableVM,'lines',result.map.line)
                        }else{
                            Vue.set(panelBodyTableVM,'dataList',[])
                            Vue.set(panelBodyTableVM,'lines',0)
                        }
                    }
                })
            }
            queryFun(queryFQCTemplateUrl,{headNum:1})

            let panelBodyTableVM = new Vue({
                el:'#finaltemplateManageInerSwiper',
                data(){
                    return{
                        dataList:[],
                        lines:0, //条数
                        search:'', //搜索框值
                        currenPage:1, //当前页
                        pagesize: 10,   //页码
                        ajaxData:{
                            templateName: '',
                            headNum: 1
                        }
                    }
                },
                methods:{
                    //详情
                    detailsModel(val){
                        model('details', val.quality_fqc_template_id)
                    },
                    //修改
                    modificationModel(val){
                        model('modificationModel', val.quality_fqc_template_id)
                    },
                    //新增
                    add(){
                        model('add')
                    },
                    //分页变化
                    handleCurrentChange(val){
                        this.ajaxData.headNum = (val - 1) * 10 + 1;
                        queryFun(queryFQCTemplateUrl,this.ajaxData)
                    },
                    //搜索框
                    searchs(){
                        this.ajaxData.templateName = this.search
                        this.currenPage = 1
                        queryFun(queryFQCTemplateUrl,this.ajaxData)
                    },
                    //删除
                    deletes(id){
                        swal({
                            title: '您确定要移除此条数据吗？',
                            text: '数据移除后无法恢复',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then( () => {
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: removeFQCTemplateUrl,
                                data:{templateId:id},
                                success: function (result, status, xhr) {
                                    if(result.status === 0 ){
                                        swal({
                                            title: '删除成功',
                                            type: 'success',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        }).then(() => {},
                                            (dismiss) => {
                                                queryFun(queryFQCTemplateUrl,{headNum:1})
                                            }
                                        )
                                    }else{
                                        swal({
                                            title: '删除失败',
                                            type: 'warning',
                                            timer: '1000',
                                            allowEscapeKey: false, // 用户按esc键不退出
                                            allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                            showCancelButton: false, // 显示用户取消按钮
                                            showConfirmButton: false, // 显示用户确认按钮
                                        })
                                    }
                                }
                            })
                        })
                    }
                },
                template:`
                <div class="swiper-slide swiper-no-swiping" id="finaltemplateManageInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
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
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover table-condensed">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">模板类型</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_fqc_template_name}}</td>
                                                <td>{{value.quality_fqc_template_type}}</td>
                                                <td>{{value.quality_fqc_template_edittion}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_fqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
            })

            //新增、详情、修改模态框
            function model(type, id){
                if(type !== 'add'){
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryFQCTemplateUrl,
                        data:{templateId: id},
                        success: function (result, status, xhr) {
                            if(result.status === 0 ){
                                Vue.set(addFinaltemplateModal,'fqcTemplate',result.map.fqcTemplate)

                                var data = {
                                            quality_fqc_template_id:result.map.fqcTemplate.quality_fqc_template_id,
                                            quality_fqc_template_name:result.map.fqcTemplate.quality_fqc_template_name,
                                            quality_fqc_template_type:result.map.fqcTemplate.quality_fqc_template_type,
                                        }
                                Vue.set(addFinaltemplateModal,'fQCInformation',data)
                                var project = []
                                result.map.fqcTemplate.templateProjectList.forEach((value,index) => {
                                    project.push({
                                        quality_project_id: value.qualityTypeProject.quality_project_id,
                                        quality_fqc_project_aql_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion,
                                        quality_fqc_project_check_method: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method,
                                        quality_fqc_project_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion,
                                        quality_fqc_project_il_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion,
                                        quality_fqc_project_standard_id: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_standard_id,
                                    })
                                    result.map.fqcTemplate.templateProjectList[index].quality_project_id =  value.qualityTypeProject.quality_project_id
                                })
                                Vue.set(addFinaltemplateModal,'templateProjectList',result.map.fqcTemplate.templateProjectList)
                                Vue.set(addFinaltemplateModal,'templateProjectList2',result.map.fqcTemplate.templateProjectList)
                                Vue.set(addFinaltemplateModal,'fqcProjectStandardJsonStr',project)
                                Vue.set(addFinaltemplateModal.fQCTemplates,'quality_fqc_template_name',result.map.fqcTemplate.quality_fqc_template_name)
                                Vue.set(addFinaltemplateModal.fQCTemplates,'quality_fqc_template_type',result.map.fqcTemplate.quality_fqc_template_type)
                                Vue.set(addFinaltemplateModal.fQCTemplates,'quality_fqc_template_number',result.map.fqcTemplate.quality_fqc_template_number)
                            }else{
                                Vue.set(addFinaltemplateModal,'fqcTemplate',[])
                                Vue.set(addFinaltemplateModal,'templateProjectList',[])
                            }
                        }
                    })
                }
                let addFinaltemplateModal = new Vue({
                    el:'#addFinaltemplateModal',
                    data(){
                        return {
                            add:false,
                            modificationModel:false,
                            details:false,
                            fqcTemplate:[], //基础信息
                            templateProjectList:[], //检验内容
                            templateProjectList2:[], //检验内容
                            fQCInformation:[], //修改模板发送的ajax数据
                            headText:'出货报告模板', //模态框标题
                            fQCTemplates:{
                                quality_fqc_template_name:'',
                                quality_fqc_template_type:'',
                                quality_fqc_template_number:''
                            },
                            qualityProjectIds:[],
                            fqcProjectStandardJsonStr:[],
                        }
                    },
                    methods:{
                        //点击增加项目事件
                        addProject(){
                            let promise = new Promise( (resolve, reject) => {
                                iqcProject(resolve, null, null, this.templateProjectList,'')
                            })
                            promise.then( (resolveData) => {
                                resolveData.forEach((val,key) => {
                                    this.templateProjectList.push(val)
                                    this.qualityProjectIds.push(val.quality_type_project_id)
                                    this.fqcProjectStandardJsonStr.push({
                                        quality_project_id:val.quality_project_id,
                                        quality_fqc_project_aql_criterion:'',
                                        quality_fqc_project_check_method:'',
                                        quality_fqc_project_criterion:'',
                                        quality_fqc_project_il_criterion:'',
                                    })
                                })
                            })
                        },
                        //点击项目移除事件
                        deletes(index){
                            swal({
                                title: '您确定要移除此条数据吗？',
                                text: '数据移除后无法恢复',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: '确定',
                                cancelButtonText: '取消'
                            }).then( () => {
                                this.templateProjectList.splice(index,1)
                                this.qualityProjectIds.splice(index,1)
                                this.fqcProjectStandardJsonStr.splice(index,1)
                            })
                        },
                        submit(){
                            //    for(var val in this.fQCTemplates){
                            //        console.log(this.fQCTemplates[val])
                            //    }
                            var fqcProjectStandardJsonStr = false
                            this.fqcProjectStandardJsonStr.forEach((value,key) => {
                                for(var val in value){
                                    if(value[val] == ''){
                                        fqcProjectStandardJsonStr = true
                                    }
                                }
                            })

                            if(this.fQCTemplates.quality_fqc_template_name == ''){
                                this.$message.error({
                                    message: '模板名称未添加',
                                    type: 'warning'
                                  })
                            }else if(this.fQCTemplates.quality_fqc_template_type == ''){
                                this.$message.error({
                                    message: '模板类型未选择',
                                    type: 'warning'
                                  })
                            }else if(this.fQCTemplates.quality_fqc_template_number == ''){
                                this.$message.error({
                                    message: '模板编号未选择',
                                    type: 'warning'
                                  })
                            }else if(this.templateProjectList.length == 0){
                                this.$message.error({
                                    message: '检验内容未添加',
                                    type: 'warning'
                                  })
                            }else if(fqcProjectStandardJsonStr){
                                this.$message.error({
                                    message: '检验内容有数据未填写',
                                    type: 'warning'
                                  })
                            }else{
                                swal({
                                    title: '您确定要提交本次操作吗?',
                                    text: '请确保填写信息无误后点击确定按钮',
                                    type: 'question',
                                    allowEscapeKey: false, // 用户按esc键不退出
                                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                    showCancelButton: true, // 显示用户取消按钮
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then( () => {
                                    if(type == 'add'){
                                        $.ajax({
                                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                            url: saveFQCTemplateUrl,
                                            data:{
                                                'type':'Newlyadd',
                                                'quality_fqc_template_name':this.fQCTemplates.quality_fqc_template_name,
                                                'quality_fqc_template_type':this.fQCTemplates.quality_fqc_template_type,
                                                'quality_fqc_template_number':this.fQCTemplates.quality_fqc_template_number,
                                                qualityProjectIds:this.qualityProjectIds,
                                                fqcProjectStandardJsonStr:JSON.stringify(this.fqcProjectStandardJsonStr)},
                                            success: function (result, status, xhr) {
                                                if(result.status === 0 ){
                                                    queryFun(queryFQCTemplateUrl,{headNum:1})
                                                    const modal = document.getElementById('addFinaltemplateModal')   //模态框
                                                    swallSuccess2(modal)	//操作成功提示并刷新页面
                                                }else{
                                                    swallFail2(result.msg);	//操作失败
                                                }
                                            }
                                        })
                                    }else{
                                        var data = []
                                        this.templateProjectList.forEach((val, key) => {
                                            this.templateProjectList2.forEach((value, index) => {
                                                if(val.quality_project_id !== value.quality_project_id){
                                                    data.push(false)
                                                }
                                            })
                                        })
                                        if(!data.length){
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: modifyFQCTemplateUrl,
                                                data:{'quality_fqc_template_id':id,
                                                    'quality_fqc_template_name':this.fQCTemplates.quality_fqc_template_name,
                                                    'quality_fqc_template_type':this.fQCTemplates.quality_fqc_template_type,
                                                    'quality_fqc_template_number':this.fQCTemplates.quality_fqc_template_number,
                                                    fqcProjectStandardJsonStr:JSON.stringify(this.fqcProjectStandardJsonStr)},
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryFQCTemplateUrl,{headNum:1})
                                                        const modal = document.getElementById('addFinaltemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail2(result.msg);	//操作失败
                                                    }
                                                }
                                            })
                                        }else{
                                            $.ajax({
                                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                                url: saveFQCTemplateUrl,
                                                data:{
                                                    'type':'olderadd',
                                                    'quality_fqc_template_name':this.fQCTemplates.quality_fqc_template_name,
                                                    'quality_fqc_template_type':this.fQCTemplates.quality_fqc_template_type,
                                                    'quality_fqc_template_number':this.fQCTemplates.quality_fqc_template_number,
                                                    qualityProjectIds:this.qualityProjectIds,
                                                    fqcProjectStandardJsonStr:JSON.stringify(this.fqcProjectStandardJsonStr)},
                                                success: function (result, status, xhr) {
                                                    if(result.status === 0 ){
                                                        queryFun(queryFQCTemplateUrl,{headNum:1})
                                                        const modal = document.getElementById('addFinaltemplateModal')   //模态框
                                                        swallSuccess2(modal)	//操作成功提示并刷新页面
                                                    }else{
                                                        swallFail2(result.msg);	//操作失败
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }

                    },
                    watch:{
                        fQCTemplates:{
                            handler: function (val, oldVal) {
                            },
                            deep: true
                        },
                        deep:true
                    },
                    mounted(){
                        const modal = document.getElementById('addFinaltemplateModal')   //模态框
                        $(modal).modal({
                            backdrop: 'static', // 黑色遮罩不可点击
                            keyboard: false,  // esc按键不可关闭模态框
                            show: true     //显示
                        })
                    },
                    created(){
                        if(type == 'modificationModel'){
                            this.headText = '修改出货报告模板'
                            this.modificationModel = true
                        }else if(type == 'add'){
                            this.headText = '新增出货报告模板'
                            this.add = true
                        }else if(type == 'details'){
                            this.details = true
                        }
                    },
                    template:`
                    <div class="modal fade" id="addFinaltemplateModal">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">{{headText}}</h4>
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
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCTemplates.quality_fqc_template_name">
                                                                    </td>
                                                                    <td style="width:30%" v-show="details">{{fqcTemplate.quality_fqc_template_name}}</td>

                                                                    <th style="width:20%">模板编号</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCTemplates.quality_fqc_template_number">
                                                                    </td>
                                                                    <td style="width:30%">{{fQCTemplates.quality_fqc_template_numbe}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">模板类型</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="add">
                                                                        <select class="form-control" v-model="fQCTemplates.quality_fqc_template_type">
                                                                            <option disabled value="">请选择(必选)</option>
                                                                            <option value="CELL">CELL</option>
                                                                            <option value="PACK">PACK</option>
                                                                        </select>
                                                                    </td>
                                                                    <td style="width:30%" v-show="!add">{{fqcTemplate.quality_fqc_template_type}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td style="width:30%">{{fqcTemplate.quality_fqc_template_edittion}}</td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">检验内容</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="addProject()" v-show="!details">增加项目</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:8%">序号</th>
                                                                    <th style="width:15%">检验项目</th>
                                                                    <th style="width:15%">检验标准</th>
                                                                    <th style="width:15%">判定标准(IL)</th>
                                                                    <th style="width:15%">判定标准(AQL)</th>
                                                                    <th style="width:15%">测试方法</th>
                                                                    <th style="width:12%" v-show="!details">操作</th>
                                                                </tr>
                                                                <tr v-show="!templateProjectList.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>
                                                                <tr v-for="(val, index) in templateProjectList">
                                                                    <td>{{index+1}}</td>

                                                                    <td v-if="add">{{val.qualityProjects.quality_project_name}}</td>
                                                                    <td v-if="!add">{{val.qualityTypeProject ? val.qualityTypeProject.qualityProjects.quality_project_name : val.qualityProjects.quality_project_name}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_il_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_aql_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_check_method">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method : ''}}</td>
                                                                    <td class="table-input-td" v-if="!details">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index)">
                                                                            <i class="fa fa-times"></i>移除</a>
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
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()">确认提交</button>
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
        case '#SPCMange': {	//控制图列表

          }
          break;
      }
    })
    leftNavLink.eq(6).trigger('click');

      /**
   * @description 项目类型模态框
   * @param {obj} vue实例data
   */
    function itemTypeModal(data) {
      const modal = document.getElementById('addChecItemTypeModal')   //模态框
      const modalHeader = modal.querySelector('.modal-header')  //模态框头部
      const modalFooter = modal.querySelector('.modal-footer')  //模态框底部
      const modalFooterBtn = modalFooter.querySelector('.modal-submit')  //模态框底部提交按钮
      const panel = modal.querySelector('.panel')  // 内部swiper的面板
      const panelHeading = panel.querySelector('.panel-heading')  // 面板头部
      const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody
      // const panelFooter = panel.querySelector('.panel-footer')  //面版底部
      let vuex = new Vue()

      let modalBodyTableVM = new Vue({
        el: panelBody,
        data() {
          return {
            data
          }
        },
        computed: {

        },

        template: `
                <div class="panel-body-table">
                  <table class="table table-bordered">
                    <tbody>
                      <tr>
                        <th style="width:20%">类型名称</th>
                        <td class="table-input-td" style="width:30%">
                          <input type="text" class="table-input" v-model.trim="data.typeName" placeholder="请输入(必填)" autocomplete="on">
                        </td>
                      </tr>
                      <tr>
                        <th style="width:20%">区分</th>
                        <td class="table-input-td" style="width:30%">
                            <select v-model="data.typeExplain" class="form-control table-input input-sm">
                              <option disabled value="">请选择</option>
                              <option>IQC</option>
                              <option>PQC</option>
                              <option>FQC</option>
                              <option>其它</option>
                            </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                 </div>
                `
      })

    }
    //IQC增加检验项
    function condensation(resolve, url, data, pitchOn){
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
                        addCondensation.$data.checked.forEach((value, key) =>{
                            result.map.projectInfo.forEach((val, keys) =>{
                                if(value == val.quality_project_type_id){
                                    result.map.projectInfo[keys].selected = true
                                }
                            })
                        })

                        Vue.set(addCondensation,'dataList',result.map.projectInfo)
                        Vue.set(addCondensation,'lines',result.map.lines)
                    }else{
                        Vue.set(addCondensation,'dataList',[])
                        Vue.set(addCondensation,'lines',0)
                    }
                }
            })
        }

        let addCondensation  = new Vue({
            el:'#addCondensation',
            data() {
                return {
                    models:false,
                    checked:[],
                    dataList:[], //遍历数据
                    lines:0, //条数
                    search:'', //搜索框值
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    selectData:[],//已选择的返回数据
                    ajaxData:{
                        projectTypeId: '',
                        projectTypeName: '',
                        headNum: 1
                    }
                }
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryQualityProjectTypeUrl,
                    data:{headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.projectInfo
                            this.lines = result.map.lines
                            this.dataList.forEach((value, key) => {
                                pitchOn.forEach((val, keys) => {
                                    if(value.quality_project_type_id == val.quality_project_type_id){
                                        this.dataList[key].selected = true
                                        this.checked.push(value.quality_project_type_id)
                                    }
                                })
                            })
                        }
                    }
                })
            },
            mounted(){
                const modal = document.getElementById('addCondensation')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                //点击选择
                choice(val, index){
                    if(val.selected){
                        return false
                    }else{
                        val.selected = true //设置为已选择
                        this.checked.push(val.quality_project_type_id) //存储已选择数据
                        this.selectData.push(val)

                    }
                },
                save(){
                    const modal = $(document.getElementById('addCondensation'))   //模态框
                    modal.modal('hide')
                    resolve(this.selectData)
                },
                 //分页变化
                 handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryQualityProjectTypeUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.projectTypeName = this.search
                    this.currenPage = 1
                    queryFun(queryQualityProjectTypeUrl,this.ajaxData)
                }
            },
            watch: {
                dataList: {
                  handler(newValue, oldValue) {
                    // console.log(newValue)
                  },
                  deep: true
                }
            },
            template:`
            <div class="modal fade" id="addCondensation">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">增加检验项</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 72%">检验项名称</th>
                                                            <th style="width: 8%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class=" val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.quality_project_type_name}}</td>
                                                            <td class="table-input-td">
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" :value="val.quality_project_type_id" v-model="checked" onclick="return false">
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
                        <div class="modal-footer">
                            <div class="row">
                            <div class="col-xs-12 text-center">
                                <button class="btn btn-primary" @click ="save()">
                                确认
                                </button>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            `
        })


    }
    //IQC增加项目
    function iqcProject(resolve, url, data, pitchOn, id){
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
                        addProject.$data.checked.forEach((value, key) =>{
                            result.map.projectInfo.forEach((val, keys) =>{
                                if(value == val.quality_project_id){
                                    result.map.projectInfo[keys].selected = true
                                }
                            })
                        })
                        Vue.set(addProject,'dataList',result.map.projectInfo)
                        Vue.set(addProject,'lines',result.map.lines)
                    }else{
                        Vue.set(addProject,'dataList',[])
                        Vue.set(addProject,'lines',0)
                    }
                }
            })
        }
        let addProject  = new Vue({
            el:'#addProject',
            data() {
                return {
                    models:false,
                    checked:[],
                    dataList:[], //遍历数据
                    lines:0, //条数
                    search:'', //搜索框值
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    selectData:[],//已选择的返回数据
                    ajaxData:{
                        headNum: 1,
                        projectName: '',
                        projectId:'',
                        projectTypeId:id
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryQualityProjectUrl,
                    data:{projectTypeId:id,headNum:1,projectId:'',projectName:''},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.projectInfo
                            this.lines = result.map.lines
                            this.dataList.forEach((value, key) => {
                                pitchOn.forEach((val, keys) => {
                                    if(value.quality_project_id == val.quality_project_id){
                                        this.dataList[key].selected = true
                                        this.checked.push(value.quality_project_id)
                                    }
                                })
                            })
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('addProject')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                choice(val, index){
                    if(val.selected){
                        return false
                    }else{
                        // const modal = $(document.getElementById('addProject'))   //模态框
                        // modal.modal('hide')
                        // resolve(this.dataList[index])
                        val.selected = true //设置为已选择
                        this.checked.push(val.quality_project_id) //存储已选择数据
                        this.selectData.push(val)
                    }

                },
                save(){
                    const modal = $(document.getElementById('addProject'))   //模态框
                    modal.modal('hide')
                    resolve(this.selectData)
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryQualityProjectUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.projectName = this.search
                    this.currenPage = 1
                    queryFun(queryQualityProjectUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="addProject">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">增加项目</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 10%">序号</th>
                                                            <th style="width: 30%">项目名称</th>
                                                            <th style="width: 30%">项目类型</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.qualityProjects.quality_project_name}}</td>
                                                            <td>{{val.qualityProjectType.quality_project_type_name}}</td>
                                                            <td class="table-input-td">
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" :value="val.quality_project_id" v-model="checked" onclick="return false">
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
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <button class="btn btn-primary" @click ="save()">
                                    确认
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })

    }

    //新增前选择模板，物料模态框
    function optionModel(type, resolve, url, data){
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
                        Vue.set(optionTemplateModel,'stencilList',result.map.iqcTemplates)
                        Vue.set(optionTemplateModel,'lines',result.map.lines)
                    }else{
                        Vue.set(optionTemplateModel,'stencilList',[])
                        Vue.set(optionTemplateModel,'lines',0)
                    }
                }
            })
        }
        queryFun(url, data)
        function queryFun2(url, data) {
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
                        Vue.set(optionTemplateModel,'materialList',result.map.materials)
                        Vue.set(optionTemplateModel,'lines2',result.map.materialInfoLine)
                    }else{
                        Vue.set(optionTemplateModel,'materialList',[])
                        Vue.set(optionTemplateModel,'lines2',0)
                    }
                }
            })
        }
        queryFun2(queryMaterialsUrl,{type: 'info',value:'',key:'keyWord', headNum:1})
        let optionTemplateModel = new Vue({
            el:'#optionTemplateModel',
            data(){
                return{
                    checkeds:[],
                    checkeds2:[],
                    disabled:true,
                    isShow:true,
                    stencilList:[], //遍历数据
                    materialList:[], //遍历数据
                    material:'',
                    lines:0, //条数
                    lines2:0, //条数
                    search:'', //搜索框值
                    search2:'', //搜索框值
                    currenPage:1, //当前页
                    currenPage2:1, //当前页
                    pagesize: 10,   //页码
                    headText:'请选择类模板和物料',//模态框标题
                    ajaxData:{ //类
                        type:'class',
                        templateName:'',
                        headNum: 1
                    },
                    ajaxData2:{ //物料
                        type: 'info',
                        value:'',
                        key:'keyWord',
                        headNum:1
                    }
                }
            },
            methods:{
                checked(id, type){
                    if(type == 'checkeds'){
                        this.checkeds = []
                        this.checkeds.push(id.quality_iqc_template_id)
                        if(id.material){
                            this.material = id.material.warehouse_material_id
                        }
                    }else if(type == 'checkeds2'){
                        this.checkeds2 = []
                        this.material = id,
                        this.checkeds2.push(id.warehouse_material_id)
                    }
                    if(this.isShow){
                        if(this.checkeds.length && this.checkeds2.length){
                            this.disabled = false
                        }else{
                            this.disabled = true
                        }
                    }else{
                        if(this.checkeds.length){
                            this.disabled = false
                        }else{
                            this.disabled = true
                        }
                    }
                },
                submit(){
                    const modal = $(document.getElementById('optionTemplateModel'))   //模态框
                    modal.modal('hide')
                    resolve({
                        iqcTemplates:this.checkeds,
                        materials:this.material
                    })
                },
                 //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryIQCTemplateUrl,this.ajaxData)
                },
                handleCurrentChange2(val){
                    this.ajaxData2.headNum = (val - 1) * 10 + 1;
                    queryFun2(queryMaterialsUrl,this.ajaxData2)

                },
                //搜索框
                searchs(type){
                    if(type == '1'){
                        this.ajaxData.templateName = this.search
                        this.currenPage = 1
                        queryFun(queryIQCTemplateUrl,this.ajaxData)
                    }else if(type == '2'){
                        this.currenPage2 = 1
                        this.ajaxData2.value = this.search2
                        queryFun2(queryMaterialsUrl,this.ajaxData2)
                    }

                }
            },
            created(){
                if(type == 'inQualityReportInerSwiper'){
                    this.isShow = false
                    this.ajaxData.type='material'
                    this.headText = '选择物料模板'
                }
            },
            mounted(){
                const modal = document.getElementById('optionTemplateModel')   //模态框
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
                <div class="modal fade" id="optionTemplateModel">
                    <div :class=" isShow ? 'modal-dialog modal-lg' : 'modal-dialog'" >
                        <div class="modal-content">
                            <div class="modal-header">
                                <button class="close" data-dismiss="modal">
                                    <span>
                                        <i class="fa fa-close"></i>
                                    </span>
                                </button>
                                <h4 class="modal-title">{{headText}}</h4>
                            </div>
                            <div class="modal-body">
                                <div class="container-fluid">
                                    <div class="row">
                                        <div :class="[isShow ? 'col-sm-6' : 'col-sm-12']">
                                            <!--类模板-->
                                            <div class="panel panel-default">
                                                <div class="panel-heading panel-heading-table">
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <h5 class="panel-title">模板</h5>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs('1')">
                                                                    <div class="input-group-btn" @click="searchs('1')">
                                                                        <button type="button" class="btn btn-primary">
                                                                            <i class="fa fa-search"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div  class="table-height-10">
                                                    <table class="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th style="width: 10%">序号</th>
                                                                <th style="width: 80%">模板名称</th>
                                                                <th style="width: 10%">操作</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(val,index) in stencilList" @click="checked(val,'checkeds')" style="cursor:pointer">
                                                                <td>{{index+1}}</td>
                                                                <td>{{val.quality_iqc_template_name}}</td>
                                                                <td class="table-input-td">
                                                                    <label class="checkbox-inline">
                                                                        <input type="checkbox" :value="val.quality_iqc_template_id" v-model="checkeds" onclick="return false">
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                            <tr v-show="!stencilList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="panel-footer panel-footer-table text-right">
                                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-6" v-if="isShow">
                                            <!--选择物料-->
                                            <div class="panel panel-default">
                                                <div class="panel-heading panel-heading-table">
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <h5 class="panel-title">物料</h5>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search2" @keyup.enter ="searchs('2')">
                                                                    <div class="input-group-btn" @click="searchs('2')">
                                                                        <button type="button" class="btn btn-primary">
                                                                            <i class="fa fa-search"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div  class="table-height-10">
                                                    <table class="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th style="width: 10%">序号</th>
                                                                <th style="width: 80%">物料名称</th>
                                                                <th style="width: 10%">操作</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="(val,index) in materialList" @click="checked(val,'checkeds2')" onclick="return false">
                                                                <td>{{index+1}}</td>
                                                                <td>{{val.warehouse_material_name}}</td>
                                                                <td class="table-input-td">
                                                                    <label class="checkbox-inline">
                                                                        <input type="checkbox" :value="val.warehouse_material_id" v-model="checkeds2">
                                                                    </label>
                                                                </td>
                                                            </tr>
                                                            <tr v-show="!materialList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="panel-footer panel-footer-table text-right">
                                                    <el-pagination @current-change="handleCurrentChange2" background small layout="total,prev,pager,next" :current-page="currenPage2" :page-size="pagesize" :total="lines2"></el-pagination>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="row">
                                    <div class="col-xs-12 text-center">
                                        <button class="btn btn-primary modal-submit" @click="submit()" :disabled="disabled">确认选择</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
    }

    //IQC选择器具
    function applianceModel(resolve, url, data){
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
                        Vue.set(chooseAppliance,'dataList',result.map.qualityIqcApplianceDO)
                        Vue.set(chooseAppliance,'lines',result.map.lines)
                    }else{
                        Vue.set(chooseAppliance,'dataList',[])
                        Vue.set(chooseAppliance,'lines',0)
                    }
                }
            })
        }
        let chooseAppliance  = new Vue({
            el:'#chooseAppliance',
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
                        applianceName: '',
                        headNum: 1
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryApplianceUrl,
                    data:{headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.qualityIqcApplianceDO
                            this.lines = result.map.lines
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('chooseAppliance')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                choice(val, index){
                    const modal = $(document.getElementById('chooseAppliance'))   //模态框
                    modal.modal('hide')
                    resolve(this.dataList[index])
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryApplianceUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.applianceName = this.search
                    this.currenPage = 1
                    queryFun(queryApplianceUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="chooseAppliance">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">检验工具</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 35%">器具</th>
                                                            <th style="width: 35%">编号</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.quality_appliance_name}}</td>
                                                            <td>{{val.quality_appliance_number}}</td>
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
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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

    //供应商选择模态框
    function supplierModel(resolve, url, data){
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
                        Vue.set(supplierModel,'dataList',result.map.suppliers)
                        Vue.set(supplierModel,'lines',result.map.lines)
                    }else{
                        Vue.set(supplierModel,'dataList',[])
                        Vue.set(supplierModel,'lines',0)
                    }
                }
            })
        }
        let supplierModel  = new Vue({
            el:'#supplierModel',
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
                        type: "all",
                        headNum: 1,
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: querySuppliersUrl,
                    data:{type:'all',headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.suppliers
                            this.lines = result.map.lines
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('supplierModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                choice(val, index){
                    const modal = $(document.getElementById('supplierModel'))   //模态框
                    modal.modal('hide')
                    resolve(this.dataList[index])
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(querySuppliersUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.staffName = this.search
                    this.currenPage = 1
                    queryFun(querySuppliersUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="supplierModel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">供应商</h4>
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
                                                            <th style="width: 35%">供应商</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.supplier_name}}</td>
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

    //fqc选择模板
    function reportTemplate(resolve, url, data){
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
                        Vue.set(reportTemplateModel,'dataList',result.map.fqctemplateList)
                        Vue.set(reportTemplateModel,'lines',result.map.line)
                    }else{
                        Vue.set(reportTemplateModel,'dataList',[])
                        Vue.set(reportTemplateModel,'lines',0)
                    }
                }
            })
        }
        let reportTemplateModel  = new Vue({
            el:'#reportTemplateModel',
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
                        templateName: '',
                        headNum: 1
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryFQCTemplateUrl,
                    data:{headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.fqctemplateList
                            this.lines = result.map.line
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('reportTemplateModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                //点击选择事件
                choice(val, index){
                    this.checked = []
                    this.checked.push(index)
                    // const modal = $(document.getElementById('reportTemplateModel'))   //模态框
                    // modal.modal('hide')
                    // resolve(this.dataList[index])
                },
                //确认事件
                submit(){
                    var index = this.checked.toString()//将索引值弄出来
                    const modal = $(document.getElementById('reportTemplateModel'))   //模态框
                    modal.modal('hide')
                    resolve(this.dataList[index])//选择传入的数据
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryFQCTemplateUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.templateName = this.search
                    this.currenPage = 1
                    queryFun(queryFQCTemplateUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="reportTemplateModel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">出货报告模板</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 35%">模板名称</th>
                                                            <th style="width: 35%">版本</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.quality_fqc_template_name}}</td>
                                                            <td>{{val.quality_fqc_template_edittion}}</td>
                                                            <td class="table-input-td">
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" v-model="checked" :value="index" onclick="return false">
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
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <button class="btn btn-primary modal-submit" @click="submit()" :disabled="!checked.length">确认选择</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })

    }

    //fqc选择模板
    function productModel(resolve, url, data){
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
                        Vue.set(productOptionModel,'dataList',result.map.products)
                        Vue.set(productOptionModel,'lines',result.map.lines)
                    }else{
                        Vue.set(productOptionModel,'dataList',[])
                        Vue.set(productOptionModel,'lines',0)
                    }
                }
            })
        }
        let productOptionModel  = new Vue({
            el:'#productOptionModel',
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
                        productName: '',
                        headNum: 1
                    }
                }
            },
            created(){
                //循环查询已经选择的
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryProductInfosUrl,
                    data:{headNum:1},
                    beforeSend: function (xml) {
                        // ajax发送前
                        mesloadBox.loadingShow()
                    },
                    success:  (result, status, xhr) => {
                        mesloadBox.hide()
                        if(result.status === 0 ){
                            this.dataList = result.map.products
                            this.lines = result.map.lines
                        }
                    }
                })

            },
            mounted(){
                const modal = document.getElementById('productOptionModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                choice(val, index){
                    const modal = $(document.getElementById('productOptionModel'))   //模态框
                    modal.modal('hide')
                    resolve(this.dataList[index])
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryFQCTemplateUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.productName = this.search
                    this.currenPage = 1
                    queryFun(queryFQCTemplateUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="productOptionModel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">检验工具</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 35%">产品名称</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.productModel.warehouse_product_model_name}}</td>
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

     /**
   * @description 项目类型模态框
   * @param {pitchOn} 已选择的数组
   */
    function unhealthy(resolve, url, data, pitchOn){
        function queryFun(url, data) {
            $.ajax({
                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                url: url,
                data:data,
                success: function (result, status, xhr) {
                    if(result.status === 0 ){
                        unhealthyInformation.$data.checked.forEach((value, key) =>{
                            result.map.unqualityInfo.forEach((val, keys) =>{
                                if(value == val.quality_unqualified_id){
                                    result.map.unqualityInfo[keys].selected = true
                                }
                            })
                        })
                        Vue.set(unhealthyInformation,'dataList',result.map.unqualityInfo)
                        Vue.set(unhealthyInformation,'lines',result.map.lines)
                    }else{
                        Vue.set(unhealthyInformation,'dataList',[])
                        Vue.set(unhealthyInformation,'lines',0)
                    }
                }
            })
        }

        let unhealthyInformation  = new Vue({
            el:'#unhealthyInformation',
            data() {
                return {
                    models:false,
                    checked:[],
                    dataList:[], //遍历数据
                    lines:0, //条数
                    search:'', //搜索框值
                    currenPage:1, //当前页
                    pagesize: 10,   //页码
                    selectData:[],//已选择的返回数据
                    ajaxData:{
                        unqualifiedCode: '',
                        headNum: 1

                    }
                }
            },
            created(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryUnqualifiedtUrl,
                    data:{headNum:1},
                    success:  (result, status, xhr) => {
                        if(result.status === 0 ){
                            this.dataList = result.map.unqualityInfo
                            this.lines = result.map.lines
                            this.dataList.forEach((value, key) => {
                                pitchOn.forEach((val, keys) => {
                                    if(value.quality_unqualified_id == val.quality_unqualified_id){
                                        this.dataList[key].selected = true
                                        this.checked.push(value.quality_unqualified_id)
                                    }
                                })
                            })
                        }
                    }
                })
            },
            mounted(){
                const modal = document.getElementById('unhealthyInformation')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
                $(modal).on('hidden.bs.modal', function (e) {
                    $('body').addClass('modal-open')
                })
            },
            methods:{
                //点击选中当前行
                choice(val, index){
                    if(val.selected){
                        return false
                    }else{
                        val.selected = true //设置为已选择
                        this.checked.push(val.quality_unqualified_id) //存储已选择数据
                        this.selectData.push(val)

                    }
                },
                //确认
                save(){
                    const modal = $(document.getElementById('unhealthyInformation'))   //模态框
                    modal.modal('hide')
                    resolve(this.selectData)
                },
                //分页变化
                handleCurrentChange(val){
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    queryFun(queryUnqualifiedtUrl,this.ajaxData)
                },
                //搜索框
                searchs(){
                    this.ajaxData.unqualifiedCode = this.search
                    this.currenPage = 1
                    queryFun(queryUnqualifiedtUrl,this.ajaxData)
                }
            },
            template:`
            <div class="modal fade" id="unhealthyInformation">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">不良信息</h4>
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
                                                            <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
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
                                                            <th style="width: 35%">不良代号</th>
                                                            <th style="width: 35%">描述</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class=" val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.quality_unqualified_code}}</td>
                                                            <td>{{val.quality_unqualified_detail}}</td>
                                                            <td class="table-input-td">
                                                                <label class="checkbox-inline">
                                                                    <input type="checkbox" :value="val.quality_unqualified_id" v-model="checked" onclick="return false">
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
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col-xs-12 text-center">
                                    <button class="btn btn-primary" @click ="save()">
                                    确认
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })

    }
  })

