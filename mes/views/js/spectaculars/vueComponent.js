$(function () {
    let currentTime = new Date(new Date().setHours(0, 0, 0, 0)); //当天0点时间戳(秒)
    let yesterday = currentTime - 86400000    //昨天0点时间戳(秒)
    let lastweek = currentTime - 86400000 * 7    //7天前0点时间戳(秒)
    let lastmonth = currentTime - 86400000 * 30    //7天前0点时间戳(秒)


    let bus = new Vue();
    let Vuex = new Vue();



    //右侧导航条
    Vue.component('mes-nav', {
        data() {
            return {
                indexShow: "addkanban", //需要显示的页面
                kanbanShow: '2', //1是宣传看板，2是其它看板
                configurationShow: '1', //1是宣传看板，2是其它看板 宣传看板配置该显示的内容和其他看板不一致
                planId: '', //已选择的方案id
                nowShow: '',//当前显示配置的看板
                publicity: [], //宣传看板存放区
                production: [], //生产看板存放区
                device: [], //设备看板存放区
                quality: [], //质量看板存放区
                boardPic:[],
                boardVideo:"",
                videoAdress:"",
                settingDataLt:[],
                settingDataRt:[],
                settingDataLb:[],
                settingDataRb:[],
                boardAreaCharts: '',//区域数据
                ltCharts:[// 左上图
                    // {
                    //     typeName:"柱状图",
                    //     workstageName:"哈哈哈",
                    //     ltChartData: {
                    //         columns: ['型号', '计划数量', '实际数量'],
                    //         rows: [
                    //             { '计划数量': 1523, '实际数量': 1523 ,'型号': '1月1日'},
                    //             { '计划数量': 1223, '实际数量': 1523 ,'型号': '1月1日'},
                    //             { '计划数量': 2123, '实际数量': 1523 , '型号': '1月1日'}
                    //         ]
                    //     },
                    //     ltChartSettings: {
                    //         metrics: ['计划数量', '实际数量'],
                    //         dimension: ['型号']
                    //     }
                    // }

                ],
                rtCharts:[],
                lbCharts:[],
                rbCharts:[],
            }
        },
        methods: {
            queryPropagandaBoard(){
                //this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]
                $.ajax({//生产看板查询表内容
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryBoardPlanUrl,
                    data: { type: 'boardPlanConfigures', planId: this.planId, headNum: 1 },
                    beforeSend: (xml) => {
                        this.loading = true
                    },
                    success: (result, status, xhr) => {
                        if (result.status == 0) {
                            this.loading = false
                           // this.boardPlan = result.map.boardPlan
                            this.boardAreaCharts = result.map.boardPlan.boardAreaCharts

                            //this.projectManagement.name = result.map.boardPlan.board_plan_name
                            //this.projectManagement.peopleName = result.map.boardPlan.board_plan_creator
                            //this.projectManagement.time = result.map.boardPlan.board_plan_create_time

                            var lt = [], lb = [], rt = [], rb = [], ltData = [], lbData = [], rtData = [], rbData = []
                            this.boardAreaCharts.forEach((val, key) => {
                                if (val.board_area_configure_id === 'da6c7f0a00544cdca3f9ac8c251412fb') {
                                    lt.push(val)
                                } else if (val.board_area_configure_id === '2a1119f4ff6647ba8f6b6688c70ec8c5') {
                                    lb.push(val)
                                } else if (val.board_area_configure_id === 'cffb025256024ba786f5ba6c5bd05f1f') {
                                    rt.push(val)
                                } else if (val.board_area_configure_id === '1ea89b0188164365a11a50118ad8fd84') {
                                    rb.push(val)
                                }
                            })
                            lb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        lbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData: moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }else{
                                        lbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }
                                }else if(val.board_type_name !=="表格"){
                                    lbData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData:   moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData: moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData: moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }else{
                                        rbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }
                                }else if(val.board_type_name !=="表格"){
                                    rbData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData:   moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData: moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            if (ltData.length) {
                                this.settingDataLt = ltData
                            } else if (lbData.length) {
                                this.settingDataLb = lbData
                            } else if (rtData.length) {
                                this.settingDataRt = rtData
                            } else if (rbData.length) {
                                this.settingDataRb = rbData
                            }
                            this.settingDataLb.forEach((val,key)=>{//左下数据请求
                                if(val.name === "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划数量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数量"){

                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName).push(yName1).push(yName2)
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName).push(yName1).push(yName2)
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "电芯数据查询报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                       // url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }
                                                        rows.push({
                                                            '型号':value.product_model_name,
                                                            '计划数量':expectedOutput,
                                                            '实际数量':elementNum,
                                                            '产出率':outputRate
                                                        })
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: ['计划数量', '实际数量', '产出率'],
                                                            showLine: ['产出率'],
                                                            axisSite: { right: ['产出率'] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataRb.forEach((val,key)=>{//左下数据请求
                                if(val.name === "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划数量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数量"){

                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName).push(yName1).push(yName2)
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName).push(yName1).push(yName2)
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "电芯数据查询报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                       // url:  queryWorkOrderOutlineFormsUrl,
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        val.optionName.forEach((value,key)=>{
                                                            XoptionName={}
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }
                                                        rows.push({
                                                            '型号':value.product_model_name,
                                                            '计划数量':expectedOutput,
                                                            '实际数量':elementNum,
                                                            '产出率':outputRate
                                                        })
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: ['计划数量', '实际数量', '产出率'],
                                                            showLine: ['产出率'],
                                                            axisSite: { right: ['产出率'] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })


                        }
                        else {
                            this.loading = false
                            this.$message.error('获取数据失败，请重新尝试');
                        }

                    },
                })


            },
            queryProductBoard(){
                this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]

                $.ajax({//生产看板查询表内容
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryBoardPlanUrl,
                    // data: { type: 'boardPlanConfigures', planId: '51e3bc69424142cd8bdb58ffbff9dd14', headNum: 1 },
                    data: { type: 'boardPlanConfigures', planId: this.planId, headNum: 1 },
                    beforeSend: (xml) => {
                        this.loading = true
                    },
                    success: (result, status, xhr) => {
                        if (result.status == 0) {
                            this.loading = false
                           // this.boardPlan = result.map.boardPlan
                            this.boardAreaCharts = result.map.boardPlan.boardAreaCharts

                            //this.projectManagement.name = result.map.boardPlan.board_plan_name
                            //this.projectManagement.peopleName = result.map.boardPlan.board_plan_creator
                            //this.projectManagement.time = result.map.boardPlan.board_plan_create_time

                            var lt = [], lb = [], rt = [], rb = [], ltData = [], lbData = [], rtData = [], rbData = []
                            this.boardAreaCharts.forEach((val, key) => {
                                if (val.board_area_configure_id === 'da6c7f0a00544cdca3f9ac8c251412fb') {
                                    lt.push(val)
                                } else if (val.board_area_configure_id === 'cffb025256024ba786f5ba6c5bd05f1f') {
                                    lb.push(val)
                                } else if (val.board_area_configure_id === '2a1119f4ff6647ba8f6b6688c70ec8c5') {
                                    rt.push(val)
                                } else if (val.board_area_configure_id === '1ea89b0188164365a11a50118ad8fd84') {
                                    rb.push(val)
                                }
                            })
                            lt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        ltData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }else{
                                        ltData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else if(val.board_type_name =="表格"){
                                    ltData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: val.board_area_end_date,
                                        startData: val.board_area_start_date,
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rtData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }else{
                                        rtData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else if(val.board_type_name =="表格"){
                                    rtData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: val.board_area_end_date,
                                        startData: val.board_area_start_date,
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            lb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        if(val.boardAxis[2]){
                                            lbData.push({
                                                workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                                id : val.board_area_chart_id,//图标id
                                                typeName : val.board_type_name,//表类型名称
                                                name: val.board_report_form_name,//表名称
                                                endData: val.board_area_end_date,
                                                startData: val.board_area_start_date,
                                                samplingNumber: val.board_area_sampling_number,//抽样数量
                                                intervalStatus: val.board_area_interval_status,//是否轮播
                                                intervalTime: val.board_area_interval_time,//轮播间隔时间
                                                xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                                yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                                yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                            })
                                        }else{
                                            lbData.push({
                                                workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                                id : val.board_area_chart_id,//图标id
                                                typeName : val.board_type_name,//表类型名称
                                                name: val.board_report_form_name,//表名称
                                                endData: val.board_area_end_date,
                                                startData: val.board_area_start_date,
                                                samplingNumber: val.board_area_sampling_number,//抽样数量
                                                intervalStatus: val.board_area_interval_status,//是否轮播
                                                intervalTime: val.board_area_interval_time,//轮播间隔时间
                                                xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                                yName1: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
    
                                            })
                                        }
                                        
                                    }else{
                                        lbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            // xName: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            // yName: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }
                                }else if(val.board_type_name =="表格"){
                                    lbData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: val.board_area_end_date,
                                        startData: val.board_area_start_date,
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName:  val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[2].boardAxisOptions[0].board_axis_options_name//y轴名称
                                        })
                                    }else{
                                        rbData.push({
                                            workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: val.board_area_end_date,
                                            startData: val.board_area_start_date,
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else if(val.board_type_name =="表格"){
                                    rbData.push({
                                        workstageId: val.boardReportSearchs[1].board_report_search_id || 0,//工序id
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: val.board_area_end_date,
                                        startData: val.board_area_start_date,
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            if (ltData.length) {
                                this.settingDataLt = ltData
                            } 
                            if (lbData.length) {
                                this.settingDataLb = lbData
                            } 
                             if (rtData.length) {
                                this.settingDataRt = rtData
                            } 
                            if (rbData.length) {
                                this.settingDataRb = rbData
                            }
                            console.log(this.settingDataLb)
                            this.settingDataLt.forEach((val,key)=>{//左上数据请求
                                if(val.name === "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划数量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数量"){

                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName:result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1) 
                                                    if(val.yName2){
                                                    columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName:result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1) 
                                                if(val.yName2){
                                                  columns.push(val.yName2)
                                                }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "电芯数据查询报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName:result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1) 
                                                if(val.yName2){
                                                  columns.push(val.yName2)
                                                }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="电芯编号"){
                                                            XoptionName.电芯编号 = value.work_order_time
                                                        }
                                                        if(val.yName1 ==="设定电流"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="电压"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="电阻"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName1 ==="容量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="设定电流"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="电压"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="电阻"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="容量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataRt.forEach((val,key)=>{//右上数据请求
                                if(val.name === "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划数量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数量"){

                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                         
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "电芯数据查询报表"){//没写
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1) 
                                                if(val.yName2){
                                                  columns.push(val.yName2)
                                                }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="电芯编号"){
                                                            XoptionName.电芯编号 = value.work_order_time
                                                        }
                                                        if(val.yName1 ==="设定电流"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="电压"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="电阻"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName1 ==="容量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="设定电流"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="电压"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="电阻"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="容量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataLb.forEach((val,key)=>{//左下数据请求
                                if(val.name === "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                    //    / data: { workstageId: '5258f6cb3d5449a2bf8af01c467422ab', startDate: '2017-02-01 00:00:00', endDate: '2018-03-26 23:59:59', headNum:1 },
                                        data: { workstageId:val.workstageId , startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        console.log(val.xName)
                                                        console.log(val.yName)
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批次号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批次号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName == "生产批次号" && val.yName == "实际完成数量"){
                                                            rows.push({
                                                                '生产批次号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName == "工序" && val.yName == "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                    console.log(this.lbCharts)
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                       console.log(XoptionName2)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name == "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name == "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name == "计划数量"){
                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name == "实际完成数量"){
                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name == "不良数量"){
                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name == "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }
                                                            console.log(XoptionName)
                                                        })

                                                       rows.push(XoptionName)
                                                       console.log( rows)
                                                    })
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName:result.map.workstage_name,
                                                        typeName:  "表格",
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                        columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '5258f6cb3d5449a2bf8af01c467422ab', startDate: '2017-02-01 00:00:00', endDate: '2018-03-26 23:59:59', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)
                                                    console.log(val.xName)
                                                    console.log(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划产量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际产量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划产量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际产量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, 
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划产量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际产量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "电芯数据查询报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                       // url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }
                                                        rows.push({
                                                            '型号':value.product_model_name,
                                                            '计划数量':expectedOutput,
                                                            '实际数量':elementNum,
                                                            '产出率':outputRate
                                                        })
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: ['计划数量', '实际数量', '产出率'],
                                                            showLine: ['产出率'],
                                                            axisSite: { right: ['产出率'] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataRb.forEach((val,key)=>{//右下数据请求
                                if(val.name == "工序生产报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际完成数量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划数量"){
                                                            XoptionName2.计划数量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){
                                                            XoptionName2.实际完成数量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数量"){
                                                            XoptionName2.不良数量 = 'scrapNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'scrapRate'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划数量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际完成数量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数量"){

                                                                XoptionName.scrapNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.scrapRate = value2.scrap_rate
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                   
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output //
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }

                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName1 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        if(val.yName2 ==="计划数量"){
                                                            XoptionName.计划数量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际完成数量"){
                                                            XoptionName.实际完成数量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 = outputRate
                                                        }
                                                        if(val.yName2 ==="不良数量"){
                                                            XoptionName.不良数量 = value.scrap_num
                                                        }
                                                        rows.push(XoptionName)
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name == "计划达成率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: val.workstageId, startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划达成率':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '日期':value.work_order_time,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "生产批号" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '生产批号':value.production_plan_batch_number,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划达成率"){
                                                            rows.push({
                                                                '工序':value.product_model_name, //工序 用型号代替了
                                                                '不良数量':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "计划产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '计划数量':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "实际产量"){
                                                            rows.push({
                                                                '工序':value.product_model_name,
                                                                '实际完成数量':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "折线图",
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                        columns.push(val.yName1) 
                                                    if(val.yName2){
                                                      columns.push(val.yName2)
                                                    }
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.work_order_time
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.production_plan_batch_number
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.product_model_name
                                                        }
                                                        if(val.yName1 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName1 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName1 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }
                                                        if(val.yName2 ==="计划产量"){
                                                            XoptionName.计划产量 = value.production_expected_output
                                                        }
                                                        if(val.yName2 ==="实际产量"){
                                                            XoptionName.实际产量 = value.product_element_num
                                                        }
                                                        if(val.yName2 ==="计划达成率"){
                                                            XoptionName.计划达成率 = value.plan_optimal_rate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: val.yName2 ?[val.yName1,val.yName2]:[val.yName1],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name == "电芯数据查询报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderOutlineFormsUrl,
                                        // data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { workstageId: '283b7b8fd83040d789b0dec1b88d79e4', startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        if(val.xName === "电芯编号" && val.yName === "电阻"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电阻':value.plan_optimal_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "电压"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '电压':value.production_expected_output,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "容量"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '容量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "电芯编号" && val.yName === "设定电流"){
                                                            rows.push({
                                                                '电芯编号':value.work_order_time,
                                                                '设定电流':value.product_element_num,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workstageName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                            XoptionName2.生产批次号 = 'batchNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划产量"){
                                                            XoptionName2.计划产量 = 'expectedOutput'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "实际产量"){
                                                            XoptionName2.实际产量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "计划达成率"){
                                                            XoptionName2.计划达成率 = 'planOptimalRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workstageAndWorkOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workstageName = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "生产批次号"){
                                                                XoptionName.batchNumber = value2.production_plan_batch_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划产量"){

                                                                XoptionName.expectedOutput = value2.production_expected_output
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "实际产量"){

                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "计划达成率"){

                                                                XoptionName.planOptimalRate = value2.plan_optimal_rate
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var expectedOutput = value.production_expected_output
                                                        var elementNum = value.product_element_num
                                                        var outputRate = elementNum/expectedOutput

                                                        if(outputRate !== ''){
                                                            var xsd=outputRate.toString().split(".");
                                                            if(xsd.length==1){
                                                                outputRate=outputRate.toString()+".00";
                                                            }
                                                            if(xsd.length>1){
                                                                if(xsd[1].length<2){
                                                                    outputRate=outputRate.toString()+"0";
                                                                }else if(xsd[1].length>2){
                                                                    outputRate=outputRate.toFixed(2)
                                                                }
                                                            }
                                                         }
                                                        rows.push({
                                                            '型号':value.product_model_name,
                                                            '计划数量':expectedOutput,
                                                            '实际数量':elementNum,
                                                            '产出率':outputRate
                                                        })
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: ['计划数量', '实际数量', '产出率'],
                                                            showLine: ['产出率'],
                                                            axisSite: { right: ['产出率'] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })


                        }
                        else {
                            this.loading = false
                            this.$message.error('获取数据失败，请重新尝试');
                        }

                    },
                })
            },
            queryDeviceBoard(){
                //this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]

                $.ajax({//生产看板查询表内容
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryBoardPlanUrl,
                    // data: { type: 'boardPlanConfigures', planId: '51e3bc69424142cd8bdb58ffbff9dd14', headNum: 1 },
                    data: { type: 'boardPlanConfigures', planId: this.planId, headNum: 1 },
                    beforeSend: (xml) => {
                        this.loading = true
                    },
                    success: (result, status, xhr) => {
                        if (result.status == 0) {
                            this.loading = false
                           // this.boardPlan = result.map.boardPlan
                            this.boardAreaCharts = result.map.boardPlan.boardAreaCharts

                            //this.projectManagement.name = result.map.boardPlan.board_plan_name
                            //this.projectManagement.peopleName = result.map.boardPlan.board_plan_creator
                            //this.projectManagement.time = result.map.boardPlan.board_plan_create_time

                            var lt = [], lb = [], rt = [], rb = [], ltData = [], lbData = [], rtData = [], rbData = []
                            this.boardAreaCharts.forEach((val, key) => {
                                if (val.board_area_configure_id === 'da6c7f0a00544cdca3f9ac8c251412fb') {
                                    lt.push(val)
                                } else if (val.board_area_configure_id === 'cffb025256024ba786f5ba6c5bd05f1f') {
                                    lb.push(val)
                                } else if (val.board_area_configure_id === '2a1119f4ff6647ba8f6b6688c70ec8c5') {
                                    rt.push(val)
                                } else if (val.board_area_configure_id === '1ea89b0188164365a11a50118ad8fd84') {
                                    rb.push(val)
                                }
                            })
                            lt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        ltData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        ltData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }

                                }else{
                                    ltData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                        searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rtData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        rtData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }

                                }else{
                                    rtData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                        searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            lb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        lbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        lbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }

                                }else{
                                    lbData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                        searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        rbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }

                                }else{
                                    rbData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                        searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            if (ltData.length) {
                                this.settingDataLt = ltData
                            } 
                            if (lbData.length) {
                                this.settingDataLb = lbData
                            } 
                            if (rtData.length) {
                                this.settingDataRt = rtData
                            } 
                            if (rbData.length) {
                                this.settingDataRb = rbData
                            }
                            this.settingDataLt.forEach((val,key)=>{//左上数据请求
                                if(val.name === "设备OEE报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryDevicesOEEUrl,
                                        // data: { devicesId: '771f54c4905411e7966812eb78deb327',devicesName:"", startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.oees.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '设备编号':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }

                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                            XoptionName2.设备稼动率 = 'devicesUtilizationRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "负荷时间"){
                                                            XoptionName2.负荷时间 = 'loadTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "停机时间"){
                                                            XoptionName2.停机时间 = 'downTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                            XoptionName2.OEE = 'oee'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.oees.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                                XoptionName.devicesUtilizationRate = value2.devices_utilization_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){

                                                                XoptionName.workOrderNum = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "负荷时间"){

                                                                XoptionName.loadTime = value2.loadTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "停机时间"){

                                                                XoptionName.downTime = value2.downTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                                XoptionName.oee = value2.devices_oees
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1)
                                                    columns.push(val.yName2)
                                                    result.map.oees.forEach((value,key)=>{

                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.endData
                                                        }
                                                        if(val.xName ==="设备编号"){
                                                            XoptionName.设备编号 = value.devices_control_devices_number
                                                        }
                                                        if(val.yName1 ==="负荷时间"){
                                                            XoptionName.负荷时间 =value.loadTime
                                                        }
                                                        if(val.yName1 ==="停机时间"){
                                                            XoptionName.停机时间 =  value.downTime
                                                        }
                                                        if(val.yName1 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 = value.devices_utilization_rate
                                                        }
                                                        if(val.yName1 ==="OEE"){
                                                            XoptionName.OEE =  value.devices_oees
                                                        }
                                                        if(val.yName2 ==="负荷时间"){
                                                            XoptionName.负荷时间 = value.loadTime
                                                        }
                                                        if(val.yName2 ==="停机时间"){
                                                            XoptionName.停机时间 = value.downTime
                                                        }
                                                        if(val.yName2 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 =  value.devices_utilization_rate
                                                        }
                                                        if(val.yName2 ==="OEE"){
                                                            XoptionName.OEE = value.devices_oees
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备异常报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionUrl,
                                       // data: { workstageId: '51e3bc69424142cd8bdb58ffbff9dd14', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.exceptions.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                            XoptionName2.发生异常时间 = 'recordTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                            XoptionName2.部位 = 'recordHandling'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                            XoptionName2.异常次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.exceptions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            var time = value.devices_exception_record_time
                                                            var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                                XoptionName.recordTime = time2
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                                XoptionName.recordHandling = value2.devices_exception_record_handling
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                  
                                                    this.ltCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                       
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }




                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备维修报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionAndMalfunctionUrl,
                                        //data: { devicesId: '51e3bc69424142cd8bdb58ffbff9dd14', devicesTypeId:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                            XoptionName2.维修原因 = 'recordDescribe'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                            XoptionName2.处理情况 = 'recordStatus'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                            XoptionName2.维修时间 = "recordTime"
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                            XoptionName2.维修次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.malfunctions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           // var time = value.devices_exception_record_time
                                                           // var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                                XoptionName.recordDescribe = value2.devices_malfunction_record_describe
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                                XoptionName.recordStatus = value2.devices_malfunction_record_status
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                                XoptionName.recordTime =  value2.devices_malfunction_record_time
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }



                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataRt.forEach((val,key)=>{//左上数据请求
                                if(val.name === "设备OEE报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryDevicesOEEUrl,
                                        //data: { devicesId: '771f54c4905411e7966812eb78deb327',devicesName:"", startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.oees.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '设备编号':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }

                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                            XoptionName2.设备稼动率 = 'devicesUtilizationRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "负荷时间"){
                                                            XoptionName2.负荷时间 = 'loadTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "停机时间"){
                                                            XoptionName2.停机时间 = 'downTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                            XoptionName2.OEE = 'oee'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.oees.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                                XoptionName.devicesUtilizationRate = value2.devices_utilization_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){

                                                                XoptionName.workOrderNum = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "负荷时间"){

                                                                XoptionName.loadTime = value2.loadTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "停机时间"){

                                                                XoptionName.downTime = value2.downTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                                XoptionName.oee = value2.devices_oees
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1)
                                                    columns.push(val.yName2)
                                                    result.map.oees.forEach((value,key)=>{

                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.endData
                                                        }
                                                        if(val.xName ==="设备编号"){
                                                            XoptionName.设备编号 = value.devices_control_devices_number
                                                        }
                                                        if(val.yName1 ==="负荷时间"){
                                                            XoptionName.负荷时间 =value.loadTime
                                                        }
                                                        if(val.yName1 ==="停机时间"){
                                                            XoptionName.停机时间 =  value.downTime
                                                        }
                                                        if(val.yName1 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 = value.devices_utilization_rate
                                                        }
                                                        if(val.yName1 ==="OEE"){
                                                            XoptionName.OEE =  value.devices_oees
                                                        }
                                                        if(val.yName2 ==="负荷时间"){
                                                            XoptionName.负荷时间 = value.loadTime
                                                        }
                                                        if(val.yName2 ==="停机时间"){
                                                            XoptionName.停机时间 = value.downTime
                                                        }
                                                        if(val.yName2 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 =  value.devices_utilization_rate
                                                        }
                                                        if(val.yName2 ==="OEE"){
                                                            XoptionName.OEE = value.devices_oees
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备异常报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionUrl,
                                       // data: { workstageId: '51e3bc69424142cd8bdb58ffbff9dd14', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.exceptions.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                            XoptionName2.发生异常时间 = 'recordTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                            XoptionName2.部位 = 'recordHandling'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                            XoptionName2.异常次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.exceptions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            var time = value.devices_exception_record_time
                                                            var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                                XoptionName.recordTime = time2
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                                XoptionName.recordHandling = value2.devices_exception_record_handling
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }




                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备维修报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionAndMalfunctionUrl,
                                        //data: { devicesId: '51e3bc69424142cd8bdb58ffbff9dd14', devicesTypeId:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.rtCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                            XoptionName2.维修原因 = 'recordDescribe'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                            XoptionName2.处理情况 = 'recordStatus'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                            XoptionName2.维修时间 = "recordTime"
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                            XoptionName2.维修次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.malfunctions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           // var time = value.devices_exception_record_time
                                                           // var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                                XoptionName.recordDescribe = value2.devices_malfunction_record_describe
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                                XoptionName.recordStatus = value2.devices_malfunction_record_status
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                                XoptionName.recordTime =  value2.devices_malfunction_record_time
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rtCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }



                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataLb.forEach((val,key)=>{//左上数据请求
                                if(val.name === "设备OEE报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryDevicesOEEUrl,
                                        data: { devicesTypeId: '72ccacf5a4554388b1236209cca91dbf',devicesName:"", startDate: '2018-02-04 15:54:04', endDate: '2018-03-27 15:54:04', headNum:1 },
                                        //data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)
                                                    console.log(val.xName)
                                                    console.log(val.yName)

                                                    result.map.oees.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }

                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                            XoptionName2.设备稼动率 = 'devicesUtilizationRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "负荷时间"){
                                                            XoptionName2.负荷时间 = 'loadTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "停机时间"){
                                                            XoptionName2.停机时间 = 'downTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                            XoptionName2.OEE = 'oee'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.oees.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                                XoptionName.devicesUtilizationRate = value2.devices_utilization_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){

                                                                XoptionName.workOrderNum = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "负荷时间"){

                                                                XoptionName.loadTime = value2.loadTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "停机时间"){

                                                                XoptionName.downTime = value2.downTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                                XoptionName.oee = value2.devices_oees
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                   
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    console.log(val.yName1)
                                                    console.log(val.yName2)
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1)
                                                    columns.push(val.yName2)
                                                    result.map.oees.forEach((value,key)=>{

                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.endData
                                                        }
                                                        if(val.xName ==="设备编号"){
                                                            XoptionName.设备编号 = value.devices_control_devices_number
                                                        }
                                                        if(val.yName1 ==="负荷时间"){
                                                            XoptionName.负荷时间 =value.loadTime
                                                        }
                                                        if(val.yName1 ==="停机时间"){
                                                            XoptionName.停机时间 =  value.downTime
                                                        }
                                                        if(val.yName1 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 = value.devices_utilization_rate
                                                        }
                                                        if(val.yName1 ==="OEE"){
                                                            XoptionName.OEE =  value.devices_oees
                                                        }
                                                        if(val.yName2 ==="负荷时间"){
                                                            XoptionName.负荷时间 = value.loadTime
                                                        }
                                                        if(val.yName2 ==="停机时间"){
                                                            XoptionName.停机时间 = value.downTime
                                                        }
                                                        if(val.yName2 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 =  value.devices_utilization_rate
                                                        }
                                                        if(val.yName2 ==="OEE"){
                                                            XoptionName.OEE = value.devices_oees
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备异常报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionUrl,
                                        data: { devicesTypeId: '36ef089a78a34c818bad76e12e4e260b', startDate: '2018-02-04 15:54:04', endDate: '2018-03-27 15:54:04', headNum:1 },
                                        // data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)
                                                    console.log(val.typeName)

                                                    result.map.exceptions.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                            XoptionName2.发生异常时间 = 'recordTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                            XoptionName2.部位 = 'recordHandling'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                            XoptionName2.异常次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.exceptions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            var time = value.devices_exception_record_time
                                                            var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                                XoptionName.recordTime = time2
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                                XoptionName.recordHandling = value2.devices_exception_record_handling
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }




                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备维修报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionAndMalfunctionUrl,
                                        data: { devicesTypeId: '0525f108fd1840148006fe93e9476886', devicesTypeId:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        //data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.malfunctions.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '维修次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备类型':value.devices.devicesType,
                                                                '维修次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备编号':value.devices.devices_control_devices_number,
                                                                '维修次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.lbCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                            XoptionName2.维修原因 = 'recordDescribe'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                            XoptionName2.处理情况 = 'recordStatus'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                            XoptionName2.维修时间 = "recordTime"
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                            XoptionName2.维修次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.malfunctions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           // var time = value.devices_exception_record_time
                                                           // var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                         
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                                XoptionName.recordDescribe = value2.devices_malfunction_record_describe
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                                XoptionName.recordStatus = value2.devices_malfunction_record_status
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                                XoptionName.recordTime =  value2.devices_malfunction_record_time
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.lbCharts.push({
                                                        workstageName:val.searchTwoName,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }



                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                            this.settingDataRb.forEach((val,key)=>{//左上数据请求
                                if(val.name === "设备OEE报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryDevicesOEEUrl,
                                        // data: { devicesId: '771f54c4905411e7966812eb78deb327',devicesName:"", startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.oees.forEach((value,key)=>{
                                                        if(val.xName === "日期" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "日期" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '日期':value.loadTime,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '工单编号':value.production_plan_batch_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "负荷时间"){
                                                            rows.push({
                                                                '设备编号':value.loadTime,
                                                                '负荷时间':value.loadTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "停机时间"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '停机时间':value.downTime,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "设备稼动率"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '设备稼动率':value.devices_utilization_rate,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                'OEE':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "平均OEE"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '平均OEE':value.devices_oees,
                                                            })
                                                        }

                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                            XoptionName2.设备稼动率 = 'devicesUtilizationRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "负荷时间"){
                                                            XoptionName2.负荷时间 = 'loadTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "停机时间"){
                                                            XoptionName2.停机时间 = 'downTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                            XoptionName2.OEE = 'oee'
                                                        }
                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.oees.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备稼动率"){
                                                                XoptionName.devicesUtilizationRate = value2.devices_utilization_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){

                                                                XoptionName.workOrderNum = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "负荷时间"){

                                                                XoptionName.loadTime = value2.loadTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "停机时间"){

                                                                XoptionName.downTime = value2.downTime
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "OEE"){
                                                                XoptionName.oee = value2.devices_oees
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName).push(val.yName1).push(val.yName2)
                                                    result.map.oees.forEach((value,key)=>{

                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }
                                                        if(val.xName ==="日期"){
                                                            XoptionName.日期 = value.endData
                                                        }
                                                        if(val.xName ==="设备编号"){
                                                            XoptionName.设备编号 = value.devices_control_devices_number
                                                        }
                                                        if(val.yName1 ==="负荷时间"){
                                                            XoptionName.负荷时间 =value.loadTime
                                                        }
                                                        if(val.yName1 ==="停机时间"){
                                                            XoptionName.停机时间 =  value.downTime
                                                        }
                                                        if(val.yName1 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 = value.devices_utilization_rate
                                                        }
                                                        if(val.yName1 ==="OEE"){
                                                            XoptionName.OEE =  value.devices_oees
                                                        }
                                                        if(val.yName2 ==="负荷时间"){
                                                            XoptionName.负荷时间 = value.loadTime
                                                        }
                                                        if(val.yName2 ==="停机时间"){
                                                            XoptionName.停机时间 = value.downTime
                                                        }
                                                        if(val.yName2 ==="设备稼动率"){
                                                            XoptionName.设备稼动率 =  value.devices_utilization_rate
                                                        }
                                                        if(val.yName2 ==="OEE"){
                                                            XoptionName.OEE = value.devices_oees
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.oees[0].devices_control_devices_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备异常报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionUrl,
                                       // data: { workstageId: '51e3bc69424142cd8bdb58ffbff9dd14', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.exceptions.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "异常次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                            XoptionName2.发生异常时间 = 'recordTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                            XoptionName2.部位 = 'recordHandling'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                            XoptionName2.异常次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.exceptions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            var time = value.devices_exception_record_time
                                                            var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                          
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "发生异常时间"){
                                                                XoptionName.recordTime = time2
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "部位"){
                                                                XoptionName.recordHandling = value2.devices_exception_record_handling
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "异常次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: result.map.exceptions[0].devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }




                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "设备维修报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryDevicesExceptionAndMalfunctionUrl,
                                        //data: { devicesId: '51e3bc69424142cd8bdb58ffbff9dd14', devicesTypeId:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { devicesId:val.searchOneId, devicesName:val.searchOneName,devicesTypeId:val.searchTwoId,devicesTypeName:val.searchTwoName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workstageAndWorkOrderAscends.forEach((value,key)=>{
                                                        var time = value.devices_exception_record_time
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备类型" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备类型':value.devices_exception_record_time,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                        if(val.xName === "设备编号" && val.yName === "维修次数"){
                                                            rows.push({
                                                                '设备编号':value.devices_control_devices_number,
                                                                '异常次数':1,
                                                            })
                                                        }
                                                    })
                                                    this.rbCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                            XoptionName2.设备名称 = 'deviceName'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                            XoptionName2.设备编号 = 'deviceNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                            XoptionName2.维修原因 = 'recordDescribe'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                            XoptionName2.处理情况 = 'recordStatus'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                            XoptionName2.维修时间 = "recordTime"
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                            XoptionName2.维修次数 = "recordNum"
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.malfunctions.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                           // var time = value.devices_exception_record_time
                                                           // var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "设备名称"){
                                                                XoptionName.deviceName = value2.devices.devices_control_devices_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "设备编号"){
                                                                XoptionName.deviceNum = value2.devices.devices_control_devices_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修原因"){
                                                                XoptionName.recordDescribe = value2.devices_malfunction_record_describe
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "处理情况"){
                                                                XoptionName.recordStatus = value2.devices_malfunction_record_status
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修时间"){
                                                                XoptionName.recordTime =  value2.devices_malfunction_record_time
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "维修次数"){
                                                                XoptionName.recordNum = "1"
                                                            }


                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.rbCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }



                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })


                        }
                        else {
                            this.loading = false
                            this.$message.error('获取数据失败，请重新尝试');
                        }

                    },
                })
            },
            queryQualityBoard(){
                //this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]
                $.ajax({//
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryBoardPlanUrl,
                   // data: { type: 'boardPlanConfigures', planId: '51e3bc69424142cd8bdb58ffbff9dd14', headNum: 1 },
                    data: { type: 'boardPlanConfigures', planId: this.planId, headNum: 1 },
                    beforeSend: (xml) => {
                        this.loading = true
                    },
                    success: (result, status, xhr) => {
                        if (result.status == 0) {
                            this.loading = false
                           // this.boardPlan = result.map.boardPlan
                            this.boardAreaCharts = result.map.boardPlan.boardAreaCharts

                            //this.projectManagement.name = result.map.boardPlan.board_plan_name
                            //this.projectManagement.peopleName = result.map.boardPlan.board_plan_creator
                            //this.projectManagement.time = result.map.boardPlan.board_plan_create_time

                            var lt = [], lb = [], rt = [], rb = [], ltData = [], lbData = [], rtData = [], rbData = []
                            this.boardAreaCharts.forEach((val, key) => {
                                if (val.board_area_configure_id === 'da6c7f0a00544cdca3f9ac8c251412fb') {
                                    lt.push(val)
                                } else if (val.board_area_configure_id === '2a1119f4ff6647ba8f6b6688c70ec8c5') {
                                    lb.push(val)
                                } else if (val.board_area_configure_id === 'cffb025256024ba786f5ba6c5bd05f1f') {
                                    rt.push(val)
                                } else if (val.board_area_configure_id === '1ea89b0188164365a11a50118ad8fd84') {
                                    rb.push(val)
                                }
                            })
                            lt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        ltData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        ltData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else{
                                    ltData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rt.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rtData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        rtData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else{
                                    rtData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            lb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        lbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        lbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else{
                                    lbData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            rb.forEach((val, key) => {
                                let endDate = Number(val.board_area_end_date)//结束时间
                                let startData = Number(val.board_area_start_date )//开始时间
                                if(val.board_type_name !=="表格"){
                                    if(val.board_type_name ==="柏拉图"){
                                        rbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchTwoName: val.boardReportSearchs[0].board_report_search_name,// id
                                            searchOneId: val.boardReportSearchs[1].board_report_search_id,//名称
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type ="x"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName1: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//y轴名称
                                            yName2: val.boardAxis[0].board_axis_type ="y"?val.boardAxis[0].boardAxisOptions[0].board_axis_options_name:val.boardAxis[3].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }else{
                                        rbData.push({
                                            searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                            searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                            id : val.board_area_chart_id,//图标id
                                            typeName : val.board_type_name,//表类型名称
                                            name: val.board_report_form_name,//表名称
                                            endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                            startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                            samplingNumber: val.board_area_sampling_number,//抽样数量
                                            intervalStatus: val.board_area_interval_status,//是否轮播
                                            intervalTime: val.board_area_interval_time,//轮播间隔时间
                                            xName: val.boardAxis[0].board_axis_type =="x" ? val.boardAxis[0].boardAxisOptions[0].board_axis_options_name: val.boardAxis[1].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                            yName: val.boardAxis[1].board_axis_type =="y" ? val.boardAxis[1].boardAxisOptions[0].board_axis_options_name: val.boardAxis[0].boardAxisOptions[0].board_axis_options_name,//x轴名称
                                        })
                                    }
                                }else{
                                    rbData.push({
                                        searchTwoId: val.boardReportSearchs[0].board_report_search_id,// id
                                        searchOneName: val.boardReportSearchs[1].board_report_search_name,//名称
                                        id : val.board_area_chart_id,//图标id
                                        typeName : val.board_type_name,//表类型名称
                                        name: val.board_report_form_name,//表名称
                                        endData: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                                        startData:moment(startData).format('YYYY-MM-DD HH:mm:ss'),//开始时间
                                        samplingNumber: val.board_area_sampling_number,//抽样数量
                                        intervalStatus: val.board_area_interval_status,//是否轮播
                                        intervalTime: val.board_area_interval_time,//轮播间隔时间
                                        optionName: val.boardAxis,//表头名称
                                    })
                                }

                            })
                            if (ltData.length) {
                                this.settingDataLt = ltData
                            } 
                            if (lbData.length) {
                                this.settingDataLb = lbData
                            } 
                            if (rtData.length) {
                                this.settingDataLb = rtData
                            } 
                            if (rbData.length) {
                                this.settingDataRb = rbData
                            }
                            this.settingDataLt.forEach((val,key)=>{//左上数据请求
                                if(val.name === "IQC优率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryIQCReportUrl,
                                        data: { materialId: 'cc65f3b988a3455fa5137b6c55df0425',materialBatch:"", startDate: '2018-02-04 15:54:04', endDate: '2018-03-06 15:54:04', headNum:1 },
                                        //data: { materialId: val.searchTwoId, materialBatch: val.searchOneName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.iqcReports.forEach((value,key)=>{
                                                        var time = value.quality_iqc_inspection_date
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "合格数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格数':value.quality_iqc_good_product_number,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "合格率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格率':value.quality_iqc_good_product_rate,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.quality_iqc_good_product_number,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.quality_iqc_good_product_rate,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "合格数"){
                                                            rows.push({
                                                                '物料批次号':value.warehouse_material_batch,
                                                                '合格数':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "合格率"){
                                                            rows.push({
                                                                '物料批次号':value.warehouse_material_batch,
                                                                '合格率':value.quality_iqc_good_product_rate,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "良品数"){
                                                            rows.push({
                                                                '物料批次号':value.warehouse_material_batch,
                                                                '良品数':value.quality_iqc_good_product_number,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "良品率"){
                                                            rows.push({
                                                                '物料批次号':value.warehouse_material_batch,
                                                                '良品率':value.quality_iqc_good_product_rate,
                                                            })
                                                        }


                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.iqcReports[0].material.warehouse_material_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                            XoptionName2.检测时间 = 'testTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                            XoptionName2.检测报告数 = 'testNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格报告数"){
                                                            XoptionName2.合格报告数 = 'qualifiedNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格率"){
                                                            XoptionName2.合格率 = 'qualifiedRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                       console.log(XoptionName2)
                                                    })
                                                    result.map.iqcReports.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                                XoptionName.testTime = moment(value2.quality_iqc_inspection_date).format('YYYY-MM-DD hh:mm:ss')
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                                XoptionName.testNum = value2.warehouse_material_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "合格报告数"){

                                                                XoptionName.qualifiedNum = value2.quality_iqc_good_product_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "合格率"){

                                                                XoptionName.qualifiedRate = value2.quality_iqc_good_product_rate
                                                            }
                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                  
                                                    this.ltCharts.push({
                                                        workstageName: result.map.iqcReports[0].quality_iqc_report_name,
                                                        typeName:  "表格",
                                                        
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1)
                                                    columns.push(val.yName2)
                                                   
                                                    result.map.iqcReports.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                            XoptionName.时间 =  moment(value2.quality_iqc_inspection_date).format('YYYY-MM-DD hh:mm:ss')
                                                        }
                                                        if(val.xName ==="物料批次号"){
                                                            XoptionName.物料批次号 = value.warehouse_material_batch
                                                        }

                                                        if(val.yName1 ==="合格数"){
                                                            XoptionName.合格数 =value.quality_iqc_good_product_number
                                                        }
                                                        if(val.yName1 ==="合格率"){
                                                            XoptionName.合格率 =  value.quality_iqc_good_product_rate
                                                        }
                                                        if(val.yName1 ==="良品数"){
                                                            XoptionName.良品数 = value.quality_iqc_good_product_number
                                                        }
                                                        if(val.yName1 ==="良品率"){
                                                            XoptionName.良品率 =  value.quality_iqc_good_product_rate
                                                        }
                                                        if(val.yName2 ==="合格数"){
                                                            XoptionName.合格数 =value.quality_iqc_good_product_number
                                                        }
                                                        if(val.yName2 ==="合格率"){
                                                            XoptionName.合格率 =  value.quality_iqc_good_product_rate
                                                        }
                                                        if(val.yName2 ==="良品数"){
                                                            XoptionName.良品数 = value.quality_iqc_good_product_number
                                                        }
                                                        if(val.yName2 ==="良品率"){
                                                            XoptionName.良品率 =  value.quality_iqc_good_product_rate
                                                        }


                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.iqcReports[0].quality_iqc_report_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }
                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "IQC不良内容统计及分布报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryIQCUnqualifiedReportUrl,
                                        //data: { materialId: '51e3bc69424142cd8bdb58ffbff9dd14', materialBatch:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { materialId: val.searchTwoId, materialBatch: val.searchOneName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                var unqualifiedNumTotal =  result.map.unqualifiedLines
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.unqualifieds.forEach((value,key)=>{
                                                        if(val.xName === "不良描述" && val.yName === "不良次数"){

                                                            rows.push({
                                                                '不良描述':value.quality_iqc_unqualified_remark,
                                                                '不良次数':value.quality_iqc_unqualified_number,
                                                            })
                                                        }
                                                        if(val.xName === "不良描述" && val.yName === "不良率"){
                                                            var unqualifiedNum  = value.quality_iqc_unqualified_number
                                                            rows.push({
                                                                '不良描述':value.quality_iqc_unqualified_remark,
                                                                '不良率': value.quality_iqc_unqualified_probability ,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "不良次数"){
                                                            rows.push({
                                                                '物料批次号':val.materialBatch,
                                                                '不良次数':value.quality_iqc_unqualified_number,
                                                            })
                                                        }
                                                        if(val.xName === "物料批次号" && val.yName === "不良率"){
                                                            var unqualifiedNum  = value.quality_iqc_unqualified_number
                                                            rows.push({
                                                                '物料批次号':value.devices_control_devices_number,
                                                                '不良率': value.quality_iqc_unqualified_probability ,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "不良代号"){
                                                            XoptionName2.不良代号 = 'unqualifiedCode'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良描述"){
                                                            XoptionName2.不良描述 = 'unqualifiedRemark'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良次数"){
                                                            XoptionName2.不良次数 = 'unqualifiedNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'unqualifiedRate'
                                                        }


                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.unqualifieds.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{

                                                           
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "不良代号"){
                                                                XoptionName.unqualifiedCode = value2.quality_unqualified_code
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良描述"){
                                                                XoptionName.unqualifiedRemark = value2.quality_iqc_unqualified_remark
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良次数"){
                                                                XoptionName.unqualifiedNumber = value2.quality_iqc_unqualified_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.unqualifiedRate = value2.quality_iqc_unqualified_probability
                                                            }

                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(val.xName)
                                                    columns.push(val.yName1)
                                                    columns.push(val.yName2)
                                                    result.map.unqualifieds.forEach((value,key)=>{

                                                        if(val.xName ==="不良描述"){
                                                            XoptionName.不良描述 =   value.quality_iqc_unqualified_remark
                                                        }
                                                        if(val.xName ==="物料批次号"){
                                                            XoptionName.物料批次号 = value.warehouse_material_batch
                                                        }

                                                        if(val.yName1 ==="不良次数"){
                                                            XoptionName.不良次数 =  value.quality_iqc_unqualified_number
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 =   value.quality_iqc_unqualified_probability
                                                        }
                                                        if(val.yName2 ==="不良次数"){
                                                            XoptionName.不良次数 =  value.quality_iqc_unqualified_number
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 =   value.quality_iqc_unqualified_probability
                                                        }



                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.searchTwoName,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [val.yName1,val.yName2],
                                                            showLine: [val.yName2],
                                                            axisSite: { right: [val.yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }
                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "PQC优率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryPQCReportRecordUrl,
                                        //data: { materialId: '51e3bc69424142cd8bdb58ffbff9dd14', materialBatch:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { reportId: val.searchTwoId, reportName: val.searchOneName,startDate: val.startData, endDate: val.endData, headNum:1 ,type:"info"},
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.pqcReport.forEach((value,key)=>{
                                                        var time = value.quality_pqc_create_date
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "合格数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格数':1,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "合格率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格率':1,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.semi_finish_good_number,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.semi_finish_good_rate,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "合格数"){
                                                            rows.push({
                                                                '生产批次号':value.quality_pqc_product_batch,
                                                                '合格数':1,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "合格率"){
                                                            rows.push({
                                                                '生产批次号':value.quality_pqc_product_batch,
                                                                '合格率':1,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "良品数"){
                                                            rows.push({
                                                                '生产批次号':value.quality_pqc_product_batch,
                                                                '良品数':value.semi_finish_good_number,
                                                            })
                                                        }
                                                        if(val.xName === "生产批次号" && val.yName === "良品率"){
                                                            rows.push({
                                                                '生产批次号':value.quality_pqc_product_batch,
                                                                '良品率':value.semi_finish_good_rate,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}, goodReportSum = 0 , examineSum,reportSum
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                            XoptionName2.检测时间 = 'testTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                            XoptionName2.检测报告数 = 'testNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格报告数"){
                                                            XoptionName2.合格报告数 = 'goodnum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格率"){
                                                            XoptionName2.合格率 = 'goodRate'
                                                        }
                                                    })
                                                    if(result.map.pqcReport.length){
                                                        reportSum = result.map.pqcReport.length
                                                    }
                                                    result.map.pqcReport.forEach((value2,key2)=>{
                                                        if (value.quality_pqc_comprehensive_result === '0') {
                                                            goodReportSum += 1  //合格报告数
                                                          }
                                                          examineSum += parseInt(value.semi_finish_number)  //检查数量
                                                          goodExamineSum += parseInt(value.semi_finish_good_number) //良品数
                                                          //防止0/0出现NAN,分母不能为0
                                                          if (reportSum > 0) {
                                                            goodReportRate = Math.round((goodReportSum /reportSum) * 10000) / 100 //报告合格率
                                                          }
                                                    })
                                                    val.optionName.forEach((value,key)=>{

                                                        XoptionName={}
                                                        if(value.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                            XoptionName.testTime =val.startDate +"-" + val.endDate
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                            XoptionName.testNum =reportSum
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "合格报告数"){
                                                            XoptionName.goodnum = goodReportSum
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "合格率"){
                                                            XoptionName.goodRate = goodReportRate
                                                        }

                                                    })

                                                    this.ltCharts.push({
                                                        workstageName: result.map.malfunctions[0].devices.devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:XoptionName
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.pqcReport.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                            XoptionName.时间 =   value.quality_pqc_check_date
                                                        }
                                                        if(val.xName ==="生产批次号"){
                                                            XoptionName.生产批次号 = value.quality_pqc_product_batch
                                                        }

                                                        if(val.yName1 ==="合格数"){
                                                            XoptionName.合格数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName1 ==="合格率"){
                                                            XoptionName.合格率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName1 ==="良品数"){
                                                            XoptionName.良品数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName1 ==="良品率"){
                                                            XoptionName.良品率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName2 ==="合格数"){
                                                            XoptionName.合格数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName2 ==="合格率"){
                                                            XoptionName.合格率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName2 ==="良品数"){
                                                            XoptionName.良品数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName2 ==="良品率"){
                                                            XoptionName.良品率 =   value.semi_finish_good_rate
                                                        }



                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "FQC优率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url: queryFQCReportFormsUrl,
                                        //data: { productModel: '51e3bc69424142cd8bdb58ffbff9dd14', ProductBatch:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { productModel: val.searchTwoName, ProductBatch: val.searchOneName,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.fqcReports.forEach((value,key)=>{
                                                        var time = value.quality_pqc_create_date
                                                        var time2  =  moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "合格数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格数':1,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "合格率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '合格率':1,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.semi_finish_good_number,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.semi_finish_good_rate,
                                                            })
                                                        }
                                                        if(val.xName === "电池批号" && val.yName === "合格数"){
                                                            rows.push({
                                                                '电池批号':value.quality_pqc_product_batch,
                                                                '合格数':1,
                                                            })
                                                        }
                                                        if(val.xName === "电池批号" && val.yName === "合格率"){
                                                            rows.push({
                                                                '电池批号':value.quality_pqc_product_batch,
                                                                '合格率':1,
                                                            })
                                                        }
                                                        if(val.xName === "电池批号" && val.yName === "良品数"){
                                                            rows.push({
                                                                '电池批号':value.quality_pqc_product_batch,
                                                                '良品数':value.semi_finish_good_number,
                                                            })
                                                        }
                                                        if(val.xName === "电池批号" && val.yName === "良品率"){
                                                            rows.push({
                                                                '电池批号':value.quality_pqc_product_batch,
                                                                '良品率':value.semi_finish_good_rate,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}, goodReportSum = 0 , examineSum,reportSum
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                            XoptionName2.检测时间 = 'testTime'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                            XoptionName2.检测报告数 = 'testNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格报告数"){
                                                            XoptionName2.合格报告数 = 'goodnum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "合格率"){
                                                            XoptionName2.合格率 = 'goodRate'
                                                        }
                                                    })
                                                    if(result.map.fqcReports.length){
                                                        reportSum = result.map.fqcReports.length
                                                    }
                                                    result.map.fqcReports.forEach((value2,key2)=>{
                                                        if (value.quality_pqc_comprehensive_result === '0') {
                                                            goodReportSum += 1  //合格报告数
                                                          }
                                                          examineSum += parseInt(value.semi_finish_number)  //检查数量
                                                          goodExamineSum += parseInt(value.semi_finish_good_number) //良品数
                                                          //防止0/0出现NAN,分母不能为0
                                                          if (reportSum > 0) {
                                                            goodReportRate = Math.round((goodReportSum /reportSum) * 10000) / 100 //报告合格率
                                                          }
                                                    })
                                                    val.optionName.forEach((value,key)=>{

                                                        XoptionName={}
                                                        if(value.boardAxisOptions[0].board_axis_options_name === "检测时间"){
                                                            XoptionName.testTime =val.startDate +"-" + val.endDate
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "检测报告数"){
                                                            XoptionName.testNum =reportSum
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "合格报告数"){
                                                            XoptionName.goodnum = goodReportSum
                                                        }
                                                        else if(value.boardAxisOptions[0].board_axis_options_name === "合格率"){
                                                            XoptionName.goodRate = goodReportRate
                                                        }

                                                    })

                                                    this.ltCharts.push({
                                                        workstageName: result.map.malfunctions[0].devices.devices_control_devices_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:XoptionName
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.fqcReports.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                            XoptionName.时间 =   value.quality_pqc_check_date
                                                        }
                                                        if(val.xName ==="电池批号"){
                                                            XoptionName.电池批号 = value.quality_pqc_product_batch
                                                        }

                                                        if(val.yName1 ==="合格数"){
                                                            XoptionName.合格数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName1 ==="合格率"){
                                                            XoptionName.合格率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName1 ==="良品数"){
                                                            XoptionName.良品数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName1 ==="良品率"){
                                                            XoptionName.良品率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName2 ==="合格数"){
                                                            XoptionName.合格数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName2 ==="合格率"){
                                                            XoptionName.合格率 =   value.semi_finish_good_rate
                                                        }
                                                        if(val.yName2 ==="良品数"){
                                                            XoptionName.良品数 =  value.semi_finish_good_number
                                                        }
                                                        if(val.yName2 ==="良品率"){
                                                            XoptionName.良品率 =   value.semi_finish_good_rate
                                                        }



                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "工序优率及不良率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkstageAscendUrl,
                                        //data: { workstageId: '771f54c4905411e7966812eb78deb327', type:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { type: val.searchTwoName, workstageId: val.searchOneid,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workOrderAscends.forEach((value,key)=>{
                                                        var time = value.work_order_time
                                                        var time2 = moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "产出量"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.good_products_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.good_products_rate,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "不良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '不良品数':value.rejects_batch_quantity,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "不良品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '不良品率':value.adverse_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "产出量"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '产出量':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "良品数"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '良品数':value.good_products_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "良品率"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '良品率':value.good_products_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良品数"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '不良品数':value.rejects_batch_quantity,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "不良品率"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '不良品率':value.adverse_rate,
                                                            })
                                                        }


                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workStage'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                            XoptionName2.产出量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "良品数"){
                                                            XoptionName2.良品数 = 'goodNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "优率"){
                                                            XoptionName2.优率 = 'goodRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数"){
                                                            XoptionName2.不良数 = 'badNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'badRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workStage = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "良品数"){
                                                                XoptionName.goodNum = value2.good_products_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "优率"){
                                                                XoptionName.goodRate = value2.good_products_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数"){
                                                                XoptionName.badNum = value2.rejects_batch_quantity
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.badRate = value2.adverse_rate
                                                            }
                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.workOrderAscends.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                           // XoptionName.时间 =   value.work_order_time
                                                            XoptionName.时间 =   moment( value.work_order_time).format('YYYY-MM-DD hh:mm:ss')
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.workstage_name
                                                        }

                                                        if(val.yName1 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName1 ==="良品数"){
                                                            XoptionName.良品数 =   value.good_products_num
                                                        }
                                                        if(val.yName1 ==="优率"){
                                                            XoptionName.优率 =  value.good_products_rate
                                                        }
                                                        if(val.yName1 ==="不良品数"){
                                                            XoptionName.不良品数 =   value.rejects_batch_quantity
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 =   value.adverse_rate
                                                        }
                                                        if(val.yName2 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName2 ==="良品数"){
                                                            XoptionName.良品数 =   value.good_products_num
                                                        }
                                                        if(val.yName2 ==="优率"){
                                                            XoptionName.优率 =  value.good_products_rate
                                                        }
                                                        if(val.yName2 ==="不良品数"){
                                                            XoptionName.不良品数 =   value.rejects_batch_quantity
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 =   value.adverse_rate
                                                        }




                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "综合坏品及坏品分布报表"){//没写
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkstageAscendUrl,
                                        //data: { workstageId: '771f54c4905411e7966812eb78deb327', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { type: val.searchTwoName, workstageId: val.searchOneid,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] ,badOutputSum = 0,outputSum = 0,badOutputRate = 1
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workOrderAscends.forEach((value,key)=>{
                                                        var time = value.work_order_time
                                                        var time2 = moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        badOutputSum += parseInt(value.scrap_num) //总不良数
                                                        outputSum += parseInt(value.product_element_num)  //总产出量

                                                        if (outputSum > 0) {
                                                            badOutputRate = Math.round((badOutputSum / outputSum) * 10000) / 100  //总不良率
                                                          }
                                                        if(val.xName === "时间" && val.yName === "产出量"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "坏品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '坏品数':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "坏品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '坏品率':value.scrap_rate,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "总坏品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '总坏品数':badOutputSum,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "总坏品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '总坏品率':badOutputRate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "产出量"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "坏品数"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '坏品数':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "坏品率"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '坏品率':value.scrap_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "总坏品数"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '总坏品数':badOutputSum,
                                                            })
                                                        }
                                                        if(val.xName === "工序" && val.yName === "总坏品率"){
                                                            rows.push({
                                                                '工序':val.workstage_name,
                                                                '总坏品率':badOutputRate,
                                                            })
                                                        }


                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                            XoptionName2.工序 = 'workStage'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                            XoptionName2.产出量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "坏品数"){
                                                            XoptionName2.坏品数 = 'badNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "坏品率"){
                                                            XoptionName2.坏品率 = 'badRate'
                                                        }


                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工序"){
                                                                XoptionName.workStage = value2.workstage_name
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "坏品数"){
                                                                XoptionName.badNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "坏品率"){
                                                                XoptionName.badRate = value2.scrap_rate
                                                            }
                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={},badOutputSum = 0,outputSum = 0,badOutputRate = 1
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.workOrderAscends.forEach((value,key)=>{

                                                        badOutputSum += parseInt(value.scrap_num) //总不良数
                                                        outputSum += parseInt(value.product_element_num)  //总产出量

                                                        if (outputSum > 0) {
                                                            badOutputRate = Math.round((badOutputSum / outputSum) * 10000) / 100  //总不良率
                                                          }

                                                        if(val.xName ==="时间"){
                                                           // XoptionName.时间 =   value.work_order_time
                                                            XoptionName.时间 =   moment( value.work_order_time).format('YYYY-MM-DD hh:mm:ss')
                                                        }
                                                        if(val.xName ==="工序"){
                                                            XoptionName.工序 = value.workstage_name
                                                        }

                                                        if(val.yName1 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName1 ==="坏品数"){
                                                            XoptionName.坏品数 =   value.scrap_num
                                                        }
                                                        if(val.yName1 ==="坏品率"){
                                                            XoptionName.坏品率 =  value.scrap_rate
                                                        }
                                                        if(val.yName1 ==="总坏品数"){
                                                            XoptionName.总坏品数 =   badOutputSum
                                                        }
                                                        if(val.yName1 ==="总坏品率"){
                                                            XoptionName.总坏品率 = badOutputRate
                                                        }
                                                        if(val.yName2 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName2 ==="坏品数"){
                                                            XoptionName.坏品数 =   value.scrap_num
                                                        }
                                                        if(val.yName2 ==="坏品率"){
                                                            XoptionName.坏品率 =  value.scrap_rate
                                                        }
                                                        if(val.yName2 ==="总坏品数"){
                                                            XoptionName.总坏品数 =   badOutputSum
                                                        }
                                                        if(val.yName2 ==="总坏品率"){
                                                            XoptionName.总坏品率 = badOutputRate
                                                        }

                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName:  result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "工单优率及不良率报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderAscendUrl,
                                        // data: { workstageId: '771f54c4905411e7966812eb78deb327', startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { productionBatch: val.searchOneName, workstageId: val.searchTwoid,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workOrderAscends.forEach((value,key)=>{
                                                        var time = value.work_order_time
                                                        var time2 = moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "产出量"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.good_products_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "优率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.good_products_rate,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "不良品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '不良品数':value.rejects_batch_quantity,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "不良率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '不良品率':value.adverse_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "产出量"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '产出量':value.devices_oees,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "良品数"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '良品数':value.good_products_num,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "优率"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '良品率':value.good_products_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "不良品数"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '不良品数':value.rejects_batch_quantity,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "不良率"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '不良品率':value.adverse_rate,
                                                            })
                                                        }


                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName: val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                            XoptionName2.产出量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "良品数"){
                                                            XoptionName2.良品数 = 'goodNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "优率"){
                                                            XoptionName2.优率 = 'goodRate'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良数"){
                                                            XoptionName2.不良数 = 'badNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                            XoptionName2.不良率 = 'badRate'
                                                        }

                                                    //    XoptionName3 = JSON.stringify(XoptionName2)
                                                    //    console.log(XoptionName3)
                                                    })
                                                    result.map.workOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                                XoptionName.workOrderNumber = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "良品数"){
                                                                XoptionName.goodNum = value2.good_products_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "优率"){
                                                                XoptionName.goodRate = value2.good_products_rate
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良数"){
                                                                XoptionName.badNum = value2.rejects_batch_quantity
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "不良率"){
                                                                XoptionName.badRate = value2.adverse_rate
                                                            }
                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                    console.log(rows)
                                                    // result.map.oees.forEach((value,key)=>{
                                                    //     rows[key]
                                                    //     rows.push({
                                                    //         'planNumber':value.production_plan_batch_number,
                                                    //         'modelName':value.product_model_name,
                                                    //         'expectedOutput':value.production_expected_output,
                                                    //         'elementNum':value.product_element_num,
                                                    //     })
                                                    // })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  "表格",
                                                        // labelAndProp: {
                                                        //     '设备名称': 'deviceName',
                                                        //     '工单编号': 'workOrderNum',
                                                        //     '负荷时间': 'loadTime',
                                                        //     '停机时间': 'downTime',
                                                        //     '设备稼动率': 'devicesUtilizationRate',
                                                        //     'OEE': 'oee',
                                                        // },
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.workOrderAscends.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                           // XoptionName.时间 =   value.work_order_time
                                                            XoptionName.时间 =   moment( value.work_order_time).format('YYYY-MM-DD hh:mm:ss')
                                                        }
                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }

                                                        if(val.yName1 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName1 ==="良品数"){
                                                            XoptionName.良品数 =   value.good_products_num
                                                        }
                                                        if(val.yName1 ==="优率"){
                                                            XoptionName.优率 =  value.good_products_rate
                                                        }
                                                        if(val.yName1 ==="不良品数"){
                                                            XoptionName.不良品数 =   value.rejects_batch_quantity
                                                        }
                                                        if(val.yName1 ==="不良率"){
                                                            XoptionName.不良率 =   value.adverse_rate
                                                        }
                                                        if(val.yName2 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName2 ==="良品数"){
                                                            XoptionName.良品数 =   value.good_products_num
                                                        }
                                                        if(val.yName2 ==="优率"){
                                                            XoptionName.优率 =  value.good_products_rate
                                                        }
                                                        if(val.yName2 ==="不良品数"){
                                                            XoptionName.不良品数 =   value.rejects_batch_quantity
                                                        }
                                                        if(val.yName2 ==="不良率"){
                                                            XoptionName.不良率 =   value.adverse_rate
                                                        }




                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: val.materialName,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                                if(val.name === "工单坏品及坏品分布报表"){
                                    $.ajax({
                                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                        url:  queryWorkOrderAscendUrl,
                                       // data: { workstageId: '771f54c4905411e7966812eb78deb327', productionBatch:"",startDate: '2018-02-04 15:54:04', endDate: '2018-02-05 15:54:04', headNum:1 },
                                        data: { productionBatch: val.searchOneName, workstageId: val.searchTwoid,startDate: val.startData, endDate: val.endData, headNum:1 },
                                        beforeSend: (xml) => {
                                            this.loading = true
                                        },
                                        success: (result, status, xhr) => {
                                            if (result.status == 0) {
                                                this.loading = false
                                                //this.ltChartData.workShopName = result.map.workstage_name
                                                if(val.typeName === "折线图" || val.typeName === "柱状图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = []
                                                    columns.push(val.xName,val.yName)
                                                    dimension.push(val.xName)
                                                    metrics.push(val.yName)

                                                    result.map.workOrderAscends.forEach((value,key)=>{
                                                        var time = value.work_order_time
                                                        var time2 = moment(time).format('YYYY-MM-DD hh:mm:ss')
                                                        if(val.xName === "时间" && val.yName === "产出量"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "坏品数"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品数':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "时间" && val.yName === "坏品率"){
                                                            rows.push({
                                                                '时间':time2,
                                                                '良品率':value.scrap_rate,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "产出量"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '产出量':value.product_element_num,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "坏品数"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '良品数':value.scrap_num,
                                                            })
                                                        }
                                                        if(val.xName === "工单编号" && val.yName === "坏品率"){
                                                            rows.push({
                                                                '工单编号':val.work_order_number,
                                                                '良品率':value.scrap_rate,
                                                            })
                                                        }
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  val.typeName,
                                                        ltChartData: {
                                                            columns: columns,
                                                            rows:rows
                                                        },
                                                        ltChartSettings:{
                                                            metrics: metrics,
                                                            dimension: dimension
                                                        }
                                                    })
                                                }
                                                if(val.typeName === "表格"){
                                                    var rows = [], XoptionName ={} ,XoptionName2={}
                                                    val.optionName.forEach((value2,key2)=>{
                                                        if(value2.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                            XoptionName2.工单编号 = 'workOrderNumber'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                            XoptionName2.产出量 = 'elementNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "坏品数"){
                                                            XoptionName2.坏品数 = 'badNum'
                                                        }
                                                        else if(value2.boardAxisOptions[0].board_axis_options_name === "坏品率"){
                                                            XoptionName2.坏品率 = 'badRate'
                                                        }
                                                    })
                                                    result.map.workOrderAscends.forEach((value2,key2)=>{
                                                        XoptionName={}
                                                        val.optionName.forEach((value,key)=>{
                                                            if(value.boardAxisOptions[0].board_axis_options_name === "工单编号"){
                                                                XoptionName.workOrderNumber = value2.work_order_number
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "产出量"){
                                                                XoptionName.elementNum = value2.product_element_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "坏品数"){
                                                                XoptionName.badNum = value2.scrap_num
                                                            }
                                                            else if(value.boardAxisOptions[0].board_axis_options_name === "坏品率"){
                                                                XoptionName.badRate = value2.scrap_rate
                                                            }
                                                        })

                                                       rows.push(XoptionName)
                                                    })
                                                  
                                                    this.ltCharts.push({
                                                        workstageName: result.map.workOrderAscends[0].workstage_name,
                                                        typeName:  "表格",
                                                       
                                                        labelAndProp: XoptionName2,
                                                        workShopProductTableData:rows
                                                    })
                                                    console.log( this.ltCharts)
                                                }
                                                if(val.typeName === "柏拉图"){
                                                    var columns = [] ,rows = [] ,metrics = [] ,dimension = [] , XoptionName ={} ,XoptionName2={}
                                                    columns.push(xName)
                                                    columns.push(yName1)
                                                    columns.push(yName2)
                                                    result.map.workOrderAscends.forEach((value,key)=>{

                                                        if(val.xName ==="时间"){
                                                           // XoptionName.时间 =   value.work_order_time
                                                            XoptionName.时间 =   moment( value.work_order_time).format('YYYY-MM-DD hh:mm:ss')
                                                        }
                                                        if(val.xName ==="工单编号"){
                                                            XoptionName.工单编号 = value.work_order_number
                                                        }

                                                        if(val.yName1 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName1 ==="坏品数"){
                                                            XoptionName.良品数 =   value.scrap_num
                                                        }
                                                        if(val.yName1 ==="坏品率"){
                                                            XoptionName.优率 =  value.scrap_rate
                                                        }
                                                        if(val.yName2 ==="产出量"){
                                                            XoptionName.产出量 =  value.product_element_num
                                                        }
                                                        if(val.yName2 ==="坏品数"){
                                                            XoptionName.良品数 =   value.scrap_num
                                                        }
                                                        if(val.yName2 ==="坏品率"){
                                                            XoptionName.优率 =  value.scrap_rate
                                                        }






                                                        rows.push(XoptionName)
                                                    })
                                                    this.ltCharts.push({
                                                        workstageName:  result.map.workOrderAscends[0].work_order_number,
                                                        typeName:  "柏拉图",
                                                        ltChartData: {
                                                            //columns: ['型号', '计划数量', '实际数量', '产出率'],
                                                            columns:columns,
                                                            rows: rows
                                                          },
                                                        ltChartSettings: {
                                                            metrics: [yName1,yName2],
                                                            showLine: [yName2],
                                                            axisSite: { right: [yName2] },
                                                            yAxisType: ['KMB', 'percent'],
                                                            yAxisName: ['数值', '比率'],
                                                            label: {
                                                              normal: { show: true, position: 'top' }
                                                            }
                                                        },
                                                    })
                                                }


                                            }
                                            else {
                                                this.loading = false
                                                this.$message.error('获取数据失败，请重新尝试');
                                            }

                                        },
                                    })
                                }
                            })
                           


                        }
                        else {
                            this.loading = false
                            this.$message.error('获取数据失败，请重新尝试');
                        }

                    },
                })
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath)
                this.planId = key  //保存id
                if (keyPath[0] === '1') {
                    this.indexShow = 'kanban'

                    //区别是宣传看板还是其他看板
                    if (keyPath[1] === '1-1') {
                        this.kanbanShow = '1'
                        this.queryPropagandaBoard()
                        bus.$emit("queryPropagandaBoard",[this.lbCharts,this.rbCharts])
                    } else {
                        this.kanbanShow = '2'
                        if(keyPath[1] === '1-2'){
                        this.queryProductBoard()
                        bus.$emit("queryProductBoard",[this.ltCharts,this.rtCharts,this.lbCharts,this.rbCharts])
                        }
                        else if(keyPath[1] === '1-3'){
                        this.queryDeviceBoard()
                        bus.$emit("queryDeviceBoard",[this.ltCharts,this.rtCharts,this.lbCharts,this.rbCharts])
                        }
                        else if(keyPath[1] === '1-4'){
                        this.queryQualityBoard()
                        bus.$emit("queryQualityBoard",[this.ltCharts,this.rtCharts,this.lbCharts,this.rbCharts])
                        }
                    }
                } else if (keyPath[0] === '3') {
                    this.indexShow = 'configuration'
                    if (keyPath[1] === '3-1') {
                        this.configurationShow = '1'
                        this.nowShow = '宣传看板'
                    } else if (keyPath[1] === '3-2'){
                        this.configurationShow = '2'
                        this.nowShow = '生产看板'
                    } else if (keyPath[1] === '3-3') {
                        this.configurationShow = '2'
                        this.nowShow = '设备看板'
                    } else if (keyPath[1] === '3-4') {
                        this.configurationShow = '2'
                        this.nowShow = '质量看板'
                    }
                } 
                this.$emit('switcher', [this.indexShow, this.kanbanShow, this.configurationShow, this.planId, this.nowShow])
            },
            //获取全部方案分类
            navAjax() {
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryBoardPlanUrl,
                    data: { type: 'info', headNum: 1 },
                    beforeSend: (xml) => {
                    },
                    success: (result, status, xhr) => {
                        if (result.status == 0) {
                            this.publicity = []
                            this.production = []
                            this.device = []
                            this.quality = []
                            result.map.boardPlans.forEach((value, index) => {
                                if (value.board_plan_type == '宣传看板') {
                                    this.publicity.push(value)
                                } else if (value.board_plan_type == '生产看板') {
                                    this.production.push(value)
                                } else if (value.board_plan_type == '设备看板') {
                                    this.device.push(value)
                                } else if (value.board_plan_type == '质量看板') {
                                    this.quality.push(value)
                                }
                            })
                        }
                        else {

                        }

                    }
                })

            },

        },
        mounted() {
            Vuex.$on('refresh', this.navAjax)
        },
        created() {
            this.navAjax()
        },
        template: `
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @select="handleSelect" :collapse="true" style="height:100%;" background-color="#eef1f6">

            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-picture"></i>
                    <span slot="title">导航一·</span>
                </template>
                <el-menu-item-group>
                    <el-submenu index="1-1">
                        <span slot="title">宣传看板</span>
                        <el-menu-item v-for="(value,index) in publicity" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-2">
                        <span slot="title">生产看板</span>
                        <el-menu-item v-for="(value,index) in production" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-3">
                        <span slot="title">设备看板</span>
                        <el-menu-item v-for="(value,index) in device" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-4">
                        <span slot="title">质量看板</span>
                        <el-menu-item v-for="(value,index) in quality" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                </el-menu-item-group>
            </el-submenu>

            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航三</span>
                </template>
                <el-menu-item-group>
                    <el-submenu index="3-1">
                        <span slot="title">宣传看板配置</span>
                        <el-menu-item v-for="(value,index) in publicity" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3-2">
                        <span slot="title">生产看板配置</span>
                        <el-menu-item v-for="(value,index) in production" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3-3">
                        <span slot="title">设备看板配置</span>
                        <el-menu-item v-for="(value,index) in device" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3-4">
                        <span slot="title">质量看板配置</span>
                        <el-menu-item v-for="(value,index) in quality" :index="value.board_plan_id">{{value.board_plan_name}}</el-menu-item>
                    </el-submenu>
                </el-menu-item-group>
            </el-submenu>

            <!--<el-menu-item index="4">
                <i class="el-icon-plus""></i>
                <span slot="title">增删方案</span>
            </el-menu-item>-->

        </el-menu>
        `
    })

     /**
     * @description da6c7f0a00544cdca3f9ac8c251412fb 左上
     * @description 2a1119f4ff6647ba8f6b6688c70ec8c5 右上
     * @description cffb025256024ba786f5ba6c5bd05f1f 左下
     * @description 1ea89b0188164365a11a50118ad8fd84 右下
     **/
    //看板配置页面
    Vue.component('mes-configuration', {
        props: ['configurationShow', 'planId','nowShow'], //区别是宣传看板还是其他看板

        data() {
            return {
                /*********    共用       *************/
                    upLoadBillboardPicUrl: upLoadBillboardPicUrl,
                    uploadBillboardVedioUrl: uploadBillboardVedioUrl,
                    settingData: [{
                        //图标id
                        id: '',

                        //区域名称
                        name: '',

                        //选择报表
                        selectRetrospect: '',

                        //选择看板类型
                        selectBoardType: '',


                        //选择搜索类型1
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '',
                        selectOptionIdOne: '',

                        //选择搜索类型2
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '',
                        selectOptionIdTwo: '',

                        //看板类型是表格后选择表头的数据
                        theadSelects: [],
                        theadId: [],

                        //判断是否选择轮播图
                        selectCarousel: '0',

                        //选中查看轮播图后显示的内容
                        carouselTime: '3',

                        //选择x轴
                        xId: '',
                        xSelector: '',

                        //选择y轴
                        yid: '',
                        ySelector: '',
                        ySelectorArray: [],

                        //选择起始时间
                        startTime: '',

                        //选择随机抽样
                        selectorTime: 30,

                        xData: [],
                        yData: [],
                        theadData: [],
                    }],
                /*********    方案管理   *************/
                    selectActive: '方案管理', //判断是那个标签页
                    type: 'add',//判断是添加还是修改方案
                    planType:'',//看板名称
                    dialogFormVisible: false, //添加新方案模态框隐藏条件
                    addprojectManagement: { //新增方案
                        type:'',
                        name: '', //方案名称
                        peopleName: '',//方案创建人
                        peopleId: '',//方案创建人
                        time: '',//方案创建时间
                    },
                    formLabelWidth: '120px',
                    projectManagement: { //方案管理
                        type: '',
                        name: '', //方案名称
                        peopleName: '',//方案创建人
                        peopleId: '',//方案创建人
                        time: '',//方案创建时间
                    },

                /*********    区域       *************/
                    //看板方案配置数据   lt:左上,rt:右上,lb:左下,rb:右下
                    configurationLoading: false, //加载提示框

                    boardPlan: '', //配置基础数据

                    configureId: '', //区域配置Id

                    reportFormsData:[],//报表类型

                    settingDataLt: [ //左上

                    ],
                    settingDataRt: [ //右上

                    ],
                    settingDataLb: [ //左下

                    ],
                    settingDataRb: [ //左下

                    ],

                /*********    轮播图     *************/
                    videoLoading: false, //loading加载条件
                    pictureTableData: [], //图片表格
                    multipleSelection: [], //选中的图片
                    pickerOptions2:{
                        shortcuts: [{
                            text: '昨天',
                            onClick(picker) {
                                const end = new Date(new Date().setHours(0, 0, 0, 0));
                                const start = new Date(new Date().setHours(0, 0, 0, 0));
                                start.setTime(start.getTime() - 86400000);
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近七天',
                            onClick(picker) {
                                const end = new Date(new Date().setHours(0, 0, 0, 0));
                                const start = new Date(new Date().setHours(0, 0, 0, 0));
                                start.setTime(start.getTime() - 86400000 * 7 );
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date(new Date().setHours(0, 0, 0, 0));
                                const start = new Date(new Date().setHours(0, 0, 0, 0));
                                start.setTime(start.getTime() - 86400000 * 30 );
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                    },
                    ajaxData: {
                        PlanId: '',
                        headNum:1
                    },
                    pictureList: [], //选择了图片的数组
                    allPictureData: [], // 已上传的所有图片
                    lines: 0, //图片个数
                    pagesize: 10, //显示条数
                    currenPage: 1, //当前显示页

                /*********    视频       *************/
                    videoList: [], //选择了视频的数组
                    videoTableData: [],  //视频表格
                    uploaSdate: false,  //上传时加载图标显示
                    videoLines: 0, //视频个数
                    videoCurrenPage: 1, //当前显示页
                    ajaxDataVideo: {
                        PlanId:'',
                        headNum: 1
                    },
            }
        },
        methods: {
            //配置数据
            alwaysData() {
                //报表类型
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryReportFormUrl,
                    data: { type: this.nowShow, headNum: 1 },
                    beforeSend: (xml) => {
                        this.configurationLoading = true
                    },
                    success: (result, status, xhr) => {
                        //报表类型
                        this.reportFormsData = []
                        var reportFormsId = []
                        result.map.boardTypes.forEach((value, index) => {
                            this.reportFormsData.push(value)
                            reportFormsId.push(value.board_report_form_id)

                        })
                        //图表数据
                        $.ajax({
                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                            url: queryBoardPlanUrl,
                            data: { type: 'boardPlanConfigures', planId: this.planId, headNum: 1 },
                            beforeSend: (xml) => {
                            },
                            success: (result, status, xhr) => {
                                if (result.status == 0) {
                                    this.configurationLoading = false
                                    this.reset() //重置数据
                                    //给区域配置数据
                                    this.projectManagement.name = result.map.boardPlan.board_plan_name
                                    this.projectManagement.peopleName = result.map.boardPlan.board_plan_creator
                                    this.projectManagement.time = result.map.boardPlan.board_plan_create_time
                                    this.planType = result.map.boardPlan.board_plan_type
                                    var lt = [], lb = [], rt = [], rb = [], ltData = [], lbData = [], rtData = [], rbData = []
                                    if (result.map.boardPlan.boardAreaCharts.length) {
                                        //基础数据
                                        result.map.boardPlan.boardAreaCharts.forEach((val, key) => {
                                            // this.$set(eval("" + value + ""), name, val.board_area_chart_name)
                                            if (val.board_area_configure_id === 'da6c7f0a00544cdca3f9ac8c251412fb') {
                                                lt.push(val)
                                            } else if (val.board_area_configure_id === '2a1119f4ff6647ba8f6b6688c70ec8c5') {
                                                rt.push(val)
                                            } else if (val.board_area_configure_id === 'cffb025256024ba786f5ba6c5bd05f1f') {
                                                lb.push(val)
                                            } else if (val.board_area_configure_id === '1ea89b0188164365a11a50118ad8fd84') {
                                                rb.push(val)
                                            }
                                        })
                                        this.circulationData(lt, ltData) //配置数据遍历共用函数
                                        this.circulationData(lb, lbData)//配置数据遍历共用函数
                                        this.circulationData(rt, rtData)//配置数据遍历共用函数
                                        this.circulationData(rb, rbData)//配置数据遍历共用函数
                                        if (ltData.length) {
                                            this.settingDataLt = ltData
                                        }
                                        if (lbData.length) {
                                            this.settingDataLb = lbData
                                        }
                                        if (rtData.length) {
                                            this.settingDataRt = rtData
                                        }
                                        if (rbData.length) {
                                            this.settingDataRb = rbData
                                        }

                                    } else {
                                        this.reset() //重置数据
                                    }
                                }
                                else {
                                    this.$message.error('获取数据失败，请重新尝试');
                                }

                            },
                        })
                    },
                })
            },
            //配置数据遍历共用函数
            circulationData(dataList,data) {
                dataList.forEach((val, key) => {
                    data.push({
                        id: val.board_area_chart_id,//图标id
                        name: val.board_area_chart_name,//区域名称
                        selectRetrospect: val.board_report_form_id,//选择报表
                        selectBoardType: val.board_type_id,  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: val.board_area_interval_status, //判断是否选择轮播图
                        carouselTime: val.board_area_interval_time,//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yId: '',
                        ySelector: '',//选择y轴
                        ySelectorArray: [],
                        startTime: '', //选择起始时间
                        selectorTime: val.board_area_sampling_number,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    })

                    val.boardReportSearchs.forEach((value, index) => { //搜索类型
                        if (value.board_report_search_order == 0) {
                            data[key].searchIdOne = value.boardReportFormSearchDOs.board_report_form_search_id, //搜索类型id
                                data[key].searchTypeOne = value.board_report_search_name,
                                data[key].searchTypeIdOne = value.board_report_search_id,
                                data[key].selectOptionNameOne = value.boardReportFormSearchDOs.board_report_search_value, //搜索类型id
                                data[key].selectOptionIdOne = value.boardReportFormSearchDOs.board_report_search_value_id //搜索类型id
                        } else if (value.board_report_search_order == 1) {
                            data[key].searchIdTwo = value.boardReportFormSearchDOs.board_report_form_search_id, //搜索类型id
                                data[key].searchTypeTwo = value.board_report_search_name,
                                data[key].searchTypeIdTwo = value.board_report_search_id,
                                data[key].selectOptionNameTwo = value.boardReportFormSearchDOs.board_report_search_value, //搜索类型id
                                data[key].selectOptionIdTwo = value.boardReportFormSearchDOs.board_report_search_value_id //搜索类型id
                        }
                    })
                    this.selectFrom(data[key])  //查询报表类型

                    data[key].startTime = [val.board_area_start_date, val.board_area_end_date]  //起始时间

                    val.boardAxis.forEach((value, index) => { //x,y,表格
                        if (value.board_axis_type === 'x') {
                            data[key].xId = value.board_axis_id
                            data[key].xSelector = value.boardAxisOptions[0].board_axis_options_id
                        } else if (value.board_axis_type === 'y') {
                            data[key].yId = value.board_axis_id
                            data[key].ySelector = value.boardAxisOptions[0].board_axis_options_id
                            data[key].ySelectorArray.push(value.boardAxisOptions[0].board_axis_options_id)
                        } else if (value.board_axis_type === '表格') {
                            data[key].theadSelects.push(value.board_axis_options_id)
                            data[key].theadId.push({ id: value.board_axis_id, selectId: value.board_axis_options_id })
                        }
                    })
                })
            },
            /*********    方案管理     *************/
                //选择创建人
                selectPeople(type) {
                    let promise = new Promise((resolve, reject) => {
                        peopleModel(resolve, null, null)
                    })
                    promise.then((resolveData) => {
                        if (type == 'add') {
                            this.addprojectManagement.peopleName = resolveData.role_staff_name
                            this.addprojectManagement.peopleId = resolveData.role_staff_id
                        } else {
                            this.projectManagement.peopleName = resolveData.role_staff_name
                            this.projectManagement.peopleId = resolveData.role_staff_id
                        }
                    })
                },
                //添加新方案
                addScheme() {
                    this.type = "add"
                    this.dialogFormVisible = true
                    this.addprojectManagement.peopleName = creator
                    this.addprojectManagement.time = moment().format('YYYY-MM-DD HH:mm:ss')
                },
                 //删除此方案
                removeScheme() {
                    this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        $.ajax({
                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                            url: removeBoardPlanUrl,
                            data: {
                                planId: this.planId
                            },
                            beforeSend: (xml) => {
                            },
                            success: (result, status, xhr) => {
                                if (result.status === 0) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                } else {
                                    this.$message.error('删除失败，请重新尝试');
                                }
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                },
                //添加新方案点击确认发送ajax
                addSchemeAjax() {
                    if (this.addprojectManagement.name == '') {
                        this.$message.error('请填写一个方案名称');
                    } else if (this.addprojectManagement.peopleName == '') {
                        this.$message.error('请选择一个创建人');
                    } else if (this.addprojectManagement.time == '') {
                        this.$message.error('请选择一个时间');
                    } else if (this.addprojectManagement.type == '') {
                        this.$message.error('请选择一个看板类型');
                    } else {
                        var data = {
                            board_plan_type: this.addprojectManagement.type,
                            board_plan_name: this.addprojectManagement.name,
                            board_plan_creator_id: this.addprojectManagement.peopleId,
                            board_plan_creator: this.addprojectManagement.peopleName,
                            board_plan_create_time: this.addprojectManagement.time
                        }

                        this.dialogFormVisible = false
                        $.ajax({
                            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                            url: saveBoardPlanUrl,
                            data: {
                                'boardPlan': JSON.stringify(data),
                                'areaChart': '',
                                'boardAxis': ''
                            },
                            beforeSend: (xml) => {
                                this.$emit('loadingShow', true)
                            },
                            success: (result, status, xhr) => {
                                if (result.status == 0) {
                                    this.$emit('loadingShow', false)
                                    this.$message({
                                        message: '添加成功,请尽快完成新方案的区域配置',
                                        type: 'success'
                                    });
                                    Vuex.$emit('refresh')
                                }
                                else {
                                    this.$emit('loadingShow', false)
                                    this.$message.error('添加失败，请确认无误后重新添加');
                                }

                            },

                        })
                    }

                },
                //切换标签页事件
                selectHover(tab, event) {
                    if (this.selectActive == '轮播图') {
                        this.configureId = ""
                    } else if (this.selectActive == '视频') {
                        this.configureId = ""
                    } else if (this.selectActive == '左上区') {
                        this.configureId = "da6c7f0a00544cdca3f9ac8c251412fb"
                    } else if (this.selectActive == '右上区') {
                        this.configureId = "2a1119f4ff6647ba8f6b6688c70ec8c5"
                    } else if (this.selectActive == '左下区') {
                        this.configureId = "cffb025256024ba786f5ba6c5bd05f1f"
                    } else if (this.selectActive == '右下区') {
                        this.configureId = "1ea89b0188164365a11a50118ad8fd84"
                    }
                },
                //点击保存事件
                projectsumbit() {
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: modifyBoardPlanUrl,
                        data: {
                            planId: this.planId,
                            planType: this.nowShow,
                            planName: this.projectManagement.name,
                            creatorId: this.projectManagement.peopleId,
                            creator: this.projectManagement.peopleName,
                        },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            if (result.status === 0) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                result.map.boardTypes.forEach((val, index) => {
                                    if (val.board_axis_type === '表头') {
                                        value.theadData.push(val)
                                    } else if (val.board_axis_type === 'x') {
                                        value.xData.push(val)
                                    } else if (val.board_axis_type === 'y') {
                                        value.yData.push(val)
                                    }
                                })
                            } else {
                                this.$message.error({
                                    message: '保存失败'
                                });
                            }
                        }
                    })
                },

            /*********    轮播图       *************/
                //已选择的图片
                uploadAmount(file, fileList) {
                    // console.log(file, fileList)
                    this.pictureList = fileList
                },
                //点击开始上传图片
                startUploadPicture() {
                    let form = new FormData()
                    for (let value of this.pictureList) {
                        form.append('file', value.raw)
                        form.append('PlanId', this.planId)
                    }
                    fetch(this.upLoadBillboardPicUrl, {
                        method: 'POST',
                        body: form
                    }).then(
                        (response) => {
                            if (response.ok) {
                                response.json().then(
                                    (data) => {
                                        if (data.status === 0) {
                                            this.uploaSdate = false
                                            this.$message({
                                                message: '文件上传成功!',
                                                type: 'success'
                                            })
                                            this.allPicture()
                                            this.pictureList = []
                                        }
                                        else {
                                            this.uploaSdate = false
                                            this.$message({
                                                message: '上传失败请重新操作!',
                                                type: 'warning'
                                            })
                                        }
                                    }
                                )
                            }
                        },
                        () => {
                            this.uploaSdate = false
                            this.$message({
                                message: '上传失败请重新操作!',
                                type: 'warning'
                            })
                        }
                        )
                },
                //轮播图点击播放选中事件
                submitSelectPicture(rows) {
                    const idList = []
                    for (let iterator of rows) {
                        const id = iterator.id
                        idList.push(id)
                    }
                    const form = new FormData()
                    form.append('picIds', idList)
                    fetch(insertBillboardPicProgramUrl, {
                        method: 'POST',
                        body: form
                    }).then(
                        (response) => {
                            if (response.ok) {
                                response.json().then((data) => {
                                    this.$message({
                                        message: '提交成功!',
                                        type: 'success'
                                    })
                                })
                            }
                            else {
                                this.$message({
                                    message: '提交失败!',
                                    type: 'warning'
                                })
                            }
                        },
                        () => {
                            this.$message({
                                message: '提交失败!',
                                type: 'warning'
                            })
                        }
                        )
                },
                //轮播图点击删除选中事件
                pictureDelete(rows, index) {
                    let idStringJoint = ''
                    if (rows instanceof Array) {
                        let tempArray = []
                        for (let iterator of rows) {
                            let id = iterator.id
                            tempArray.push(id)
                        }
                        console.log(tempArray)
                        let tempSrting = tempArray.join(',')
                        idStringJoint = tempSrting
                    }
                    else {
                        idStringJoint = rows.id
                    }
                    const form = new FormData()
                    form.append('ids', idStringJoint)
                    fetch(deleteBillboardPicsUrl, {
                        method: 'POST',
                        body: form
                    }).then(
                        (response) => {
                            if (response.ok) {
                                response.json().then((data) => {
                                    if (data.status === 0) {
                                        this.$message({
                                            message: '删除成功!',
                                            type: 'success'
                                        })
                                        this.allPicture()
                                    } else {
                                        this.$message({
                                            message: '删除失败, 请重新操作!',
                                            type: 'warning'
                                        })
                                    }
                                })
                            }
                            else {
                                this.$message({
                                    message: '删除失败, 请重新操作!',
                                    type: 'warning'
                                })
                            }
                        },
                        () => {
                            this.$message({
                                message: '删除失败, 请重新操作!!',
                                type: 'success'
                            })
                        }
                        ).catch()
                },
                //分页变化
                handleCurrentChange(val) {
                    this.ajaxData.headNum = (val - 1) * 10 + 1;
                    this.allPicture()
                },
                //获取已上传的图片
                allPicture() {
                    this.ajaxData.PlanId = this.planId
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryBillboardPicUrl,
                        data: this.ajaxData,
                        beforeSend: (xml) => {
                            this.videoLoading = true
                        },
                        success: (result, status, xhr) => {
                            if (result.status == 0) {
                                this.videoLoading = false
                                this.pictureTableData = []
                                this.multipleSelection = []
                                this.lines = result.map.counts

                                result.map.bbplist.forEach((value, index) => {
                                    this.pictureTableData.push({
                                        id: value.img_id,
                                        number: index + 1,
                                        time: moment(value.img_save_time).format('YYYY-MM-DD HH:mm:ss'),
                                        name: value.img_name,
                                        format: value.img_format,
                                        size: value.img_size
                                    })
                                })
                                $.ajax({
                                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                    url: queryUsedBillboardPicProgramUrl,
                                    data: {},
                                    beforeSend: (xml) => {
                                    },
                                    success: (result, status, xhr) => {
                                        if (result.status == 0) {
                                            this.pictureTableData.forEach((value, index) => {
                                                result.map.picNameList.forEach((val, key) => {
                                                    if (value.id == val.img_id) {
                                                        this.multipleSelection.push(value)
                                                    }
                                                })
                                            })
                                        }
                                    }

                                })
                            } else if (result.status == 2) {
                                this.videoLoading = false
                                this.pictureTableData = []
                                this.multipleSelection = []
                            }
                            else {
                                this.allPictureData = []
                                this.lines = 0
                                this.$message.error({
                                    message: '获取图片失败!',
                                })
                            }

                        },

                    })

                },
                //表格选中
                handleSelectionChange(val) {
                    this.multipleSelection = val;
                },


            /*********    视频        *************/
                //已选择的视频
                uploadAmountVideo(file, fileList) {
                    this.videoList = fileList
                },
                //点击开始上传视频
                startUploadVideo() {
                    if (this.videoList.length) {
                        let form = new FormData()
                        // PlanId
                        for (let value of this.videoList) {
                            form.append('file', value.raw)
                            form.append('PlanId', this.planId)
                        }
                        this.uploaSdate = true
                        this.$message({
                            message: '正在上传文件, 请勿关闭窗口',
                            type: 'warning'
                        })
                        fetch(uploadBillboardVedioUrl, {
                            method: 'POST',
                            body: form
                        }).then(
                            (response) => {
                                if (response.ok) {
                                    response.json().then(
                                        (data) => {
                                            if (data.status === 0) {
                                                this.uploaSdate = false
                                                this.$message({
                                                    message: '文件上传成功!',
                                                    type: 'success'
                                                })
                                                this.allVideo()
                                                this.videoList = []
                                            }
                                        }
                                    )
                                }
                            },
                            () => {
                                this.uploaSdate = false
                                this.$message({
                                    message: '文件上传失败, 请重新操作!',
                                    type: 'warning'
                                })
                            }
                            )
                    } else {
                        this.$message({
                            message: '文件上传失败, 请重新操作!',
                            type: 'warning'
                        })
                    }

                },
                //点击使用视频
                videoSelectUse(row) {
                    const form = new FormData()
                    form.append('vedioIds', row.id)
                    fetch(insertBillboardVedioProgramUrl, {
                        method: 'POST',
                        body: form
                    }).then(
                        (response) => {
                            if (response.ok) {
                                response.json().then((data) => {
                                    this.$message({
                                        message: '提交成功!',
                                        type: 'success'
                                    })
                                })
                            }
                            else {
                                this.$message({
                                    message: '提交失败, 请重新操作!',
                                    type: 'warning'
                                })
                            }
                        },
                        () => {
                            this.$message({
                                message: '提交失败, 请重新操作!',
                                type: 'warning'
                            })
                        }
                        )
                },
                //点击删除视频
                videoDelete(row) {
                    const form = new FormData()
                    form.append('vedioId', row.id)
                    form.append('vedioUrl', row.url)
                    fetch(deleteBillboardVedioUrl, {
                        method: 'POST',
                        body: form
                    }).then(
                        (response) => {
                            if (response.ok) {
                                response.json().then((data) => {
                                    if (data.status === 0) {
                                        this.$message({
                                            message: '删除成功!',
                                            type: 'success'
                                        })
                                        this.allVideo()
                                    } else {
                                        this.$message({
                                            message: '删除失败, 请重新操作!',
                                            type: 'warning'
                                        })
                                    }
                                })
                            }
                            else {
                                this.$message({
                                    message: '删除失败, 请重新操作!',
                                    type: 'warning'
                                })
                            }
                        },
                        () => {
                            this.$message({
                                message: '删除失败, 请重新操作!',
                                type: 'warning'
                            })
                        }
                        )
                },
                //获取已上传的视频
                allVideo() {
                    this.ajaxDataVideo.PlanId  = this.planId
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: selectVedioInfoUrl,
                        data: this.ajaxDataVideo,
                        beforeSend: (xml) => {
                            this.videoLoading = true
                        },
                        success: (result, status, xhr) => {
                            if (result.status == 0) {
                                this.videoLoading = false
                                this.videoTableData = []
                                this.videoLines = result.map.counts

                                result.map.bbvList.forEach((value, index) => {
                                    this.videoTableData.push({
                                        id: value.billboard_vedio_id,
                                        number: index + 1,
                                        time: moment(value.billboard_vedio_save_time).format('YYYY-MM-DD HH:mm:ss'),
                                        name: value.billboard_vedio_name,
                                        format: value.billboard_vedio_format,
                                        size: value.billboard_vedio_size
                                    })
                                })
                            } else if (result.status == 2) {
                                this.videoLoading = false
                                this.videoTableData = []
                            } else {
                                this.videoTableData = []
                                this.videoLines = 0
                                this.$message.error({
                                    message: '获取视频失败!',
                                })
                            }

                        },

                    })
                },
                handleCurrentChangeVideo(val) {
                    this.ajaxDataVideo.headNum = (val - 1) * 10 + 1;
                    this.allVideo()
                },

            /*********    区域        *************/
                //清空数据
                reset() {
                    this.settingDataLt = [{
                        id: '',//图表id
                        name: '',//区域名称
                        selectRetrospect: '',//选择报表
                        selectBoardType: '',  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: '0', //判断是否选择轮播图
                        carouselTime: '3',//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yid: '',
                        ySelector: '',//选择y轴
                        startTime: '', //选择起始时间
                        selectorTime: 30,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    }]
                    this.settingDataRt = [{
                        id: '',//图表id
                        name: '',//区域名称
                        selectRetrospect: '',//选择报表
                        selectBoardType: '',  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: '0', //判断是否选择轮播图
                        carouselTime: '3',//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yid: '',
                        ySelector: '',//选择y轴
                        startTime: '', //选择起始时间
                        selectorTime: 30,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    }]
                    this.settingDataLb = [{
                        id: '',//图表id
                        name: '',//区域名称
                        selectRetrospect: '',//选择报表
                        selectBoardType: '',  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: '0', //判断是否选择轮播图
                        carouselTime: '3',//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yid: '',
                        ySelector: '',//选择y轴
                        startTime: '', //选择起始时间
                        selectorTime: 30,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    }]
                    this.settingDataRb = [{
                        id: '',//图表id
                        name: '',//区域名称
                        selectRetrospect: '',//选择报表
                        selectBoardType: '',  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: '0', //判断是否选择轮播图
                        carouselTime: '3',//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yid: '',
                        ySelector: '',//选择y轴
                        startTime: '', //选择起始时间
                        selectorTime: 30,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    }]

                },
                //选择报表后对应的xy轴和搜索类型
                selectFrom(value, switchover) {

                    if (switchover == 'switchover') {
                        value.theadSelects = []
                        value.xSelector = ''
                        value.ySelector = ''
                        value.selectOptionIdOne = ''
                        value.selectOptionNameOne = ''
                        value.selectOptionIdTwo = ''
                        value.selectOptionNameTwo = ''
                        value.selectBoardType = ''
                    }

                    //给xY轴分类

                    this.xyTypeAjax(value.selectRetrospect,value)

                    //给搜索类型分类
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryReportFormTypeUrl,
                        data: { formId: value.selectRetrospect, headNum: 1 },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            if (result.status === 0) {
                                result.map.boardTypes.forEach((val, key) => {
                                    if (val.board_report_search_order == 0) {
                                        value.searchTypeOne = val.board_report_search_name
                                        value.searchTypeIdOne = val.board_report_search_id

                                    } else if (val.board_report_search_order == 1) {
                                        value.searchTypeTwo = val.board_report_search_name
                                        value.searchTypeIdTwo = val.board_report_search_id
                                    }
                                })
                            }
                        },
                    })
                },
                //X/y轴类型
                xyTypeAjax(id, value) {
                    // id.forEach((val, key) => {
                    // $.ajax({
                    //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    //     url: queryAxisOptionsUrl,
                    //     data: { formId:val },
                    //     beforeSend: (xml) => {
                    //     },
                    //     success: (result, status, xhr) => {
                    //         var theadData = [],
                    //             xData = [],
                    //             yData = []
                    //         result.map.boardTypes.forEach((value, index) => {
                    //             if (value.board_axis_type === '表头') {
                    //                 theadData.push(value)
                    //             } else if (value.board_axis_type === 'x') {
                    //                 xData.push(value)
                    //             } else if (value.board_axis_type === 'y') {
                    //                 yData.push(value)
                    //             }
                    //         })
                    //         this.theadData.push(theadData)
                    //         this.xData.push(xData)
                    //         this.yData.push(yData)
                    //     }
                    // })
                    // }
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: queryAxisOptionsUrl,
                        data: { formId: id },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            value.theadData = []
                            value.xData = []
                            value.yData = []
                            result.map.boardTypes.forEach((val, index) => {
                                if (val.board_axis_type === '表头') {
                                    value.theadData.push(val)
                                } else if (val.board_axis_type === 'x') {
                                    value.xData.push(val)
                                } else if (val.board_axis_type === 'y') {
                                    value.yData.push(val)
                                }
                            })
                        }
                    })
                },
                //搜索类型选项
                selectProcess(type,value) {
                    if (type == '车间') {
                        value.selectOptionNameTwo = ''
                        value.selectOptionIdTwo = ''
                        let promise = new Promise((resolve, reject) => {
                            workshopModel(resolve)
                        })
                        promise.then((resolveData) => {
                            value.selectOptionNameOne = resolveData.role_workshop_name
                            value.selectOptionIdOne = resolveData.role_workshop_id
                        })
                    } else if (type == '工序') {
                        let promise = new Promise((resolve, reject) => {
                            if (value.selectOptionIdOne == '') {
                                workstageModal(resolve, queryWorkstageBasicsUrl, { type: 'vague', keyword: '', headNum: 1, status: 0 }, '')
                            } else {
                                workstageModal(resolve, queryWorkShopInfosUrl, { type: 'workstage', workshopId: value.selectOptionIdOne }, value.selectOptionNameOne)
                            }
                        })
                        promise.then((resolveData) => {
                            value.selectOptionNameTwo = resolveData.workstage_name
                            value.selectOptionIdTwo = resolveData.workstage_basics_id
                        })
                    } else if (type == '设备类型') {
                        value.selectOptionNameTwo = ''
                        value.selectOptionIdTwo = ''
                        let promise = new Promise((resolve, reject) => {
                            selectDevicesTypeModal(resolve)
                        })
                        promise.then((resolveData) => {
                            value.selectOptionNameOne = resolveData.devices_control_devices_type_name
                            value.selectOptionIdOne = resolveData.devices_control_devices_type_id
                        })
                    } else if (type == '设备编号') {
                        if (value.selectOptionIdOne !== '') {
                            let promise = new Promise((resolve, reject) => {
                                selectDevicesModal(resolve, value.selectOptionIdOne, value.selectOptionNameOne)
                            })
                            promise.then((resolveData) => {
                                value.selectOptionNameTwo = resolveData.devices_control_devices_number
                                value.selectOptionIdTwo = resolveData.devices_control_devices_id
                            })
                        } else {
                            let promise = new Promise((resolve, reject) => {
                                selectDevicesModal(resolve, '', '')
                            })
                            promise.then((resolveData) => {
                                value.selectOptionNameTwo = resolveData.devices_control_devices_number
                                value.selectOptionIdTwo = resolveData.devices_control_devices_id
                            })
                        }
                    } else if (type == '物料') {
                        let promise = new Promise((resolve, reject) => {
                            selectMaterialModal(resolve, 'info')
                        })
                        promise.then((resolveData) => {
                            value.selectOptionIdOne = resolveData.warehouse_material_id
                            value.selectOptionNameOne = resolveData.warehouse_material_name
                        })
                    } else if (type == '物料批次') {
                        let promise = new Promise((resolve, reject) => {
                            selectMaterialModal(resolve, 'record')
                        })
                        promise.then((resolveData) => {
                            value.selectOptionIdTwo = resolveData.warehouse_material_batch
                            value.selectOptionNameTwo = resolveData.warehouse_material_batch
                        })
                    } else if (type == '半成品') {
                        let promise = new Promise((resolve, reject) => {
                            selectSemiFinishModal(resolve)
                        })
                        promise.then((resolveData) => {
                            value.selectOptionIdOne = resolveData.semi_finish_id
                            value.selectOptionNameOne = resolveData.semi_finish_name
                        })
                    } else if (type == '生产批号') {
                        let promise = new Promise((resolve, reject) => {
                            batchNumberModal(resolve)
                        })
                        promise.then((resolveData) => {
                            console.log(resolveData)
                            value.selectOptionIdTwo = resolveData.production_plan_batch_number
                            value.selectOptionNameTwo = resolveData.production_plan_batch_number
                        })
                    } else if (type == '电池型号') {
                        let promise = new Promise((resolve, reject) => {
                            selectBatterylModal(resolve)
                        })
                        promise.then((resolveData) => {
                            // value.selectOptionIdOne = resolveData.warehouse_product_id
                            value.selectOptionIdOne = resolveData.warehouse_product_size
                            // value.selectOptionNameOne = resolveData.warehouse_product_name
                            value.selectOptionNameOne = resolveData.warehouse_product_size
                        })
                    } else if (type == '选择工序') {
                        let promise = new Promise((resolve, reject) => {
                            if (value.selectOptionIdOne == '') {
                                workstageModal(resolve, queryWorkstageBasicsUrl, { type: 'vague', keyword: '', headNum: 1, status: 0 }, '')
                            } else {
                                workstageModal(resolve, queryWorkShopInfosUrl, { type: 'workstage', workshopId: value.selectOptionIdOne }, value.selectOptionNameOne)
                            }
                        })
                        promise.then((resolveData) => {
                            value.selectOptionNameOne = resolveData.workstage_name
                            value.selectOptionIdOne = resolveData.workstage_basics_id
                        })
                    }

                },
                //添加轮播图
                addcarousel(value) {
                    value.push({
                        id: '',//图表id
                        name: '',//区域名称
                        selectRetrospect: '',//选择报表
                        selectRetrospectIndex: '',//根据index切换xy轴
                        selectBoardType: '',  //选择看板类型
                        searchIdOne: '', //搜索类型id
                        searchTypeOne: '车间',
                        searchTypeIdOne: '',
                        selectOptionNameOne: '', //选择车间
                        selectOptionIdOne: '',//选择车间
                        searchIdTwo: '', //搜索类型id
                        searchTypeTwo: '工序',
                        searchTypeIdTwo: '',
                        selectOptionNameTwo: '', //选择工序
                        selectOptionIdTwo: '',//选择工序
                        theadSelects: [], //看板类型是表格后选择表头的数据
                        theadId: [],
                        selectCarousel: '0', //判断是否选择轮播图
                        carouselTime: '3',//选中查看轮播图后显示的内容
                        xId: '',
                        xSelector: '', //选择x轴
                        yid: '',
                        ySelector: '',//选择y轴
                        ySelectorArray: [],
                        startTime: '', //选择起始时间
                        selectorTime: 30,//选择随机抽样
                        xData: [],
                        yData: [],
                        theadData: [],
                    })
                },
                //删除轮播图
                removecarousel(valueList, index) {
                    this.$confirm('此操作将永久删除该图, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (valueList[index].id !== '') {
                            $.ajax({
                                type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                                url: removeBoardAreaChartUrl,
                                data: {
                                    areaChartId: valueList[index].id
                                },
                                beforeSend: (xml) => {
                                },
                                success: (result, status, xhr) => {
                                    if (result.status === 0) {
                                        valueList.splice(index, 1)
                                        this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        this.alwaysData()
                                    } else {
                                        this.$message.error('删除失败，请重新尝试');
                                    }
                                }
                            })
                        } else {
                            valueList.splice(index, 1)
                        }
                    }).catch(() => {
                            console.log(22)
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                },
                //保存轮播图
                savecarousel(valueList, value, index) {
                    var areaChart = {
                        board_area_chart_id: value.id, //看板图表id
                        board_area_chart_name: value.name, //看板图表名称
                        board_plan_id: this.planId, //看板方案id
                        board_area_configure_id: this.configureId, //区域配置id
                        board_type_id: value.selectBoardType, //看板类型id
                        board_report_form_id: value.selectRetrospect, //报表id
                        board_area_start_date: moment(value.startTime[0]).format('YYYY-MM-DD HH:mm:ss'), //开始日期
                        board_area_end_date:  moment(value.startTime[1]).format('YYYY-MM-DD HH:mm:ss'), //结束日期
                        board_area_interval_status: value.selectCarousel, //是否轮播(0:是1:否)
                        board_area_interval_time: value.carouselTime, //轮播间隔时间
                        board_area_sampling_number: value.selectorTime,//抽样数量
                    }
                    if (value.id == '') {  //因为修改和新增传的值类型不一样
                        var url = saveBoardPlanConfigureUrl
                        var areaChartData = areaChart
                    } else {
                        var url = modifyBoardAreaChartsUrl
                        var areaChartData = []
                        areaChartData.push(areaChart)
                    }

                    var searchValueData = [
                        {
                            board_report_form_search_id: value.searchIdOne, //报表-搜索条件id
                            board_area_chart_id: value.id, //看板图表id
                            board_report_search_id: value.searchTypeIdOne, // 搜索类型id
                            board_report_search_value: value.selectOptionNameOne, //搜索值
                            board_report_search_value_id: value.selectOptionIdOne// 值id
                        },{
                            board_report_form_search_id: value.searchIdTwo, //报表-搜索条件id
                            board_area_chart_id: value.id,  //看板图表id
                            board_report_search_id: value.searchTypeIdTwo, //搜索类型id
                            board_report_search_value: value.selectOptionNameTwo, //搜索值
                            board_report_search_value_id: value.selectOptionIdTwo // 值id
                        }
                    ]

                    var boardAxisData =[
                        {
                            board_axis_id: value.xId, //看板x/y轴/表头id
                            board_area_chart_id: value.id, //看板图表id
                            board_axis_options_id: value.xSelector, //看板x/y轴/表头选项id
                            board_axis_type: 'x' //x/y轴/表头类型（x,y,表头）
                        }
                    ]

                    var array = [...new Set(value.ySelectorArray)] //为y轴去重
                    if (value.selectBoardType == "2432758be3ad4beaabf84297dd9906f6") { //柏拉图可多选
                        array.forEach((val, key) => {
                            boardAxisData.push({
                                board_axis_id: value.yId, //看板x/y轴/表头id
                                board_area_chart_id: value.id, //看板图表id
                                board_axis_options_id: val, //看板x/y轴/表头选项id
                                board_axis_type: 'y' //x/y轴/表头类型（x,y,表头）
                            })
                        })
                    } else {
                        boardAxisData.push({
                            board_axis_id: value.yId, //看板x/y轴/表头id
                            board_area_chart_id: value.id, //看板图表id
                            board_axis_options_id: value.ySelector, //看板x/y轴/表头选项id
                            board_axis_type: 'y' //x/y轴/表头类型（x,y,表头）
                        })
                    }
                    if (value.theadSelects.length && value.selectBoardType == 'd9afbd838db242bda0b282aeda5e5b5c') { //如果选择了表格的话
                        value.theadSelects.forEach((val, key) => {
                            boardAxisData.push({
                                board_axis_id: '', //看板x/y轴/表头id
                                board_area_chart_id: value.id, //看板图表id
                                board_axis_options_id: val, //看板x/y轴/表头选项id
                                board_axis_type: '表格' //x/y轴/表头类型（x,y,表头）
                            })
                        })
                        boardAxisData.forEach((val, key) => {
                            value.theadId.forEach((v, k) => {
                                if (val.board_axis_options_id === v.selectId) {
                                    val.board_axis_id = v.id
                                }
                            })
                        })

                        // var select = true //
                        // value.theadSelects.forEach((val, key) => {
                        //     value.theadId.forEach((v, k) => {
                        //         if (val.board_axis_options_id !== v.selectId) {
                        //             // val.board_axis_id = v.id
                        //             select = false
                        //         }
                        //     })
                        // })
                        // if (select) {

                        // }
                    }
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: url,
                        data: {
                            "areaChart": JSON.stringify(areaChartData),
                            "searchValue": JSON.stringify(searchValueData),
                            "boardAxis": JSON.stringify(boardAxisData),
                        },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            if (result.status === 0) {
                                if (url == saveBoardPlanConfigureUrl) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                } else if (url == modifyBoardAreaChartsUrl) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                }
                                this.alwaysData()
                            } else {
                                if (url == saveBoardPlanConfigureUrl) {
                                    this.$message.error('添加失败，请重新尝试');
                                } else if (url == modifyBoardAreaChartsUrl) {
                                    if (result.msg) {
                                        this.$message.error(result.msg);
                                    } else {
                                        this.$message.error('修改失败，请重新尝试');
                                    }
                                }

                            }
                        }
                    })
                }
        },
        computed: {
            // x() {
            //     this.firstName + ' ' + this.lastName
            // }
        },
        created() {
            this.alwaysData()
            if (this.configurationShow == '1') {
                this.allPicture()
                this.allVideo()
            }
        },
        watch: {
            planId:{
                handler(newValue, oldValue) {
                    // console.log(newValue)
                    this.alwaysData()
                    if (this.configurationShow == '1') {
                        this.allPicture()
                        this.allVideo()
                    }
                    // console.log(newValue)
                }
            },
            settingDataLt: {
                handler(newValue, oldValue) {
                    // console.log('lt')
                    // console.log(newValue)
                },
                deep: true
            },
            // settingDataRt: {
            //     handler(newValue, oldValue) {
            //         console.log('rt')
            //     },
            //     deep: true
            // },
            settingDataRb: {
                handler(newValue, oldValue) {
                    // console.log('rb')
                    // console.log(newValue)
                },
                deep: true
            },
            settingDataLb: {
                handler(newValue, oldValue) {
                    // console.log('lb')
                    // console.log(newValue)
                },
                deep: true
            },
        },
        template: `
        <el-container>
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-breadcrumb separator-class="el-icon-arrow-right" class="typeface" style="height:40px;line-height:40px;">
                            <el-breadcrumb-item>{{planType}}</el-breadcrumb-item>
                            <el-breadcrumb-item style="font-size:17px;">{{projectManagement.name}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="12" style="text-align:right">
                        <el-button type="primary" plain @click="addScheme()">添加新方案</el-button>
                        <el-button type="danger" plain @click="removeScheme()">删除此方案</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-main style="padding-top:0">
                <el-tabs type="border-card" style="height:100%;overflow-y:auto" v-model="selectActive" @tab-click="selectHover" v-loading="configurationLoading">
                    <el-tab-pane label="方案管理" name="方案管理">
                        <el-card class="box-card" style="height:95%;">
                            <el-row :gutter="20">
                                <el-col :span="8">
                                    <el-form :inline="true" class="demo-form-inline" size="small" >
                                        <el-form-item label="方案名称">
                                            <el-input placeholder="方案名称" v-model="projectManagement.name"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="8">
                                    <el-form :inline="true" class="demo-form-inline" size="small" >
                                        <el-form-item label="方案创建人">
                                            <el-input placeholder="方案创建人" v-model="projectManagement.peopleName" @focus="selectPeople()" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                                <el-col :span="8">
                                    <el-form :inline="true" class="demo-form-inline" size="small">
                                        <el-form-item label="创建时间">
                                            <el-date-picker v-model="projectManagement.time" type="datetime" placeholder="选择日期时间" size="small" :disabled="true"></el-date-picker>
                                        </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="padding-left:10px">
                                <el-col :span="23" style="text-align:right">
                                    <el-button type="primary" size="medium" plain @click="projectsumbit()"">保存</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="左上区" name="左上区" v-if="configurationShow !== '1'">
                        <el-card class="box-card" v-for="(value,index) in settingDataLt" :class="{v_margin : index !== 0}">
                            <el-row :gutter="20">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">名称</el-col>
                                <el-col :span="5">
                                    <el-input placeholder="名称" v-model="value.name" size="small" style="max-width:200px"></el-input>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">报表</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="报表(首选)" v-model="value.selectRetrospect" @change="selectFrom(value,'switchover')" size="small">
                                        <el-option v-for="(val,key) in reportFormsData" :label="val.board_report_form_name" :value="val.board_report_form_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">{{value.searchTypeOne}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeOne" v-model="value.selectOptionNameOne" @focus="selectProcess(value.searchTypeOne,value)" v-show="value.searchTypeOne !='报表类型'" size="small" style="max-width:200px"></el-input>
                                     <el-select placeholder="选择报表类型" v-model="value.selectOptionNameOne"  v-show="value.searchTypeOne =='报表类型'" size="small">
                                        <el-option label="工序报表" value="workstage"></el-option>
                                        <el-option label="日报表" value="day"></el-option>
                                        <el-option label="周报表" value ="week"></el-option>
                                        <el-option label="月报表" value="month"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">时间</el-col>
                                <el-col :span="13">
                                    <el-date-picker  type="datetimerange" v-model="value.startTime"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" size="small"></el-date-picker>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis"  v-show="value.selectOptionNameOne != 'workstage'">{{value.searchTypeTwo}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeTwo" v-model="value.selectOptionNameTwo" @focus="selectProcess(value.searchTypeTwo,value)"  v-show="value.selectOptionNameOne != 'workstage'" size="small" style="max-width:200px"></el-input>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">看板类型</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="看板类型" v-model="value.selectBoardType" size="small">
                                        <el-option label="折线图" value="050696bee7c04195b45b9011d3913379"></el-option>
                                        <el-option label="柏拉图" value="2432758be3ad4beaabf84297dd9906f6"></el-option>
                                        <el-option label="柱状图" value ="d951823154e34c03a00ae07bbae6c02a"></el-option>
                                        <el-option label="表格" value="d9afbd838db242bda0b282aeda5e5b5c"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">X轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择X轴" v-model="value.xSelector" size="small">
                                         <el-option v-for="(val,key) in value.xData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">Y轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择Y轴" v-model="value.ySelector" size="small" v-show="value.selectBoardType != '2432758be3ad4beaabf84297dd9906f6'" >
                                         <el-option v-for="(val,key) in value.yData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                     <el-select v-model="value.ySelectorArray" multiple collapse-tags  placeholder="选择Y轴" size="small" v-show="value.selectBoardType == '2432758be3ad4beaabf84297dd9906f6'" style="font-size:13px">
                                        <el-option v-for="(val,key) in value.yData" :key="val.board_axis_options_name" :label="val.board_axis_options_name" :value="val.board_axis_options_id">
                                        </el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.xSelector !== '日期'">随机抽样</el-col>
                                <el-col :span="5" v-show="value.xSelector !== '日期'">
                                    <el-select placeholder="选择抽样数" v-model="value.selectorTime" size="small">
                                        <el-option label="10" value="10"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="30" value="30"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">是否轮播</el-col>
                                <el-col :span="5" style="font-size:15px;height:32px;line-height:28px">
                                    <el-switch v-model="value.selectCarousel" active-value="1" inactive-value="0" ></el-switch>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectCarousel !== '0'">轮播时间</el-col>
                                <el-col :span="5" v-show="value.selectCarousel !== '0'">
                                    <el-select placeholder="选择轮播时间" v-model="value.carouselTime" size="small">
                                        <el-option label="3秒" value="3"></el-option>
                                        <el-option label="5秒" value="5"></el-option>
                                        <el-option label="7秒" value="7"></el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="16" v-show="value.selectBoardType !== 'd9afbd838db242bda0b282aeda5e5b5c' && value.selectBoardType !== '表格'"><div style="width：300px;height:10px"></div></el-col>
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">表头</el-col>
                                <el-col :span="13" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">
                                    <el-checkbox-group v-model="value.theadSelects" size="small">
                                        <el-checkbox-button v-for="thead in value.theadData" :label="thead.board_axis_options_id" :key="thead.board_axis_options_id">{{thead.board_axis_options_name}}</el-checkbox-button>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" @click="addcarousel(settingDataLt)" size="small">添加轮播图</el-button>
                                    <el-button type="danger" v-show="index !== 0" @click="removecarousel(settingDataLt,index)" size="small">删除轮播图</el-button>
                                    <el-button type="primary" plain @click="savecarousel(settingDataLt,value,index)" size="small">保存</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="右上区" name="右上区"  v-if="configurationShow !== '1'">
                         <el-card class="box-card" v-for="(value,index) in settingDataRt" :class="{v_margin : index !== 0}">
                            <el-row :gutter="20">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">名称</el-col>
                                <el-col :span="5">
                                    <el-input placeholder="名称" v-model="value.name" size="small" style="max-width:200px"></el-input>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">报表</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="报表(首选)" v-model="value.selectRetrospect" @change="selectFrom(value,'switchover')" size="small">
                                        <el-option v-for="(val,key) in reportFormsData" :label="val.board_report_form_name" :value="val.board_report_form_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">{{value.searchTypeOne}}</el-col>
                                <el-col :span="5">
                                     <el-input :placeholder="'选择'+value.searchTypeOne" v-model="value.selectOptionNameOne" @focus="selectProcess(value.searchTypeOne,value)" v-show="value.searchTypeOne !='报表类型'" size="small" style="max-width:200px"></el-input>
                                     <el-select placeholder="选择报表类型" v-model="value.selectOptionNameOne"  v-show="value.searchTypeOne =='报表类型'" size="small">
                                        <el-option label="工序报表" value="workstage"></el-option>
                                        <el-option label="日报表" value="day"></el-option>
                                        <el-option label="周报表" value ="week"></el-option>
                                        <el-option label="月报表" value="month"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">时间</el-col>
                                <el-col :span="13">
                                    <el-date-picker  type="datetimerange" v-model="value.startTime"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" size="small"></el-date-picker>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" v-show="value.selectOptionNameOne != 'workstage'" class="text-right ellipsis">{{value.searchTypeTwo}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeTwo" v-model="value.selectOptionNameTwo" @focus="selectProcess(value.searchTypeTwo,value)" v-show="value.selectOptionNameOne != 'workstage'" size="small" style="max-width:200px"></el-input>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">看板类型</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="看板类型" v-model="value.selectBoardType" size="small">
                                        <el-option label="折线图" value="050696bee7c04195b45b9011d3913379"></el-option>
                                        <el-option label="柏拉图" value="2432758be3ad4beaabf84297dd9906f6"></el-option>
                                        <el-option label="柱状图" value ="d951823154e34c03a00ae07bbae6c02a"></el-option>
                                        <el-option label="表格" value="d9afbd838db242bda0b282aeda5e5b5c"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">X轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择X轴" v-model="value.xSelector" size="small">
                                         <el-option v-for="(val,key) in value.xData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">Y轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择Y轴" v-model="value.ySelector" size="small" v-show="value.selectBoardType != '2432758be3ad4beaabf84297dd9906f6'" >
                                         <el-option v-for="(val,key) in value.yData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                     <el-select v-model="value.ySelectorArray" multiple collapse-tags  placeholder="选择Y轴" size="small" v-show="value.selectBoardType == '2432758be3ad4beaabf84297dd9906f6'" style="font-size:12px">
                                        <el-option v-for="(val,key) in value.yData" :key="val.board_axis_options_name" :label="val.board_axis_options_name" :value="val.board_axis_options_id">
                                        </el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.xSelector !== '日期'">随机抽样</el-col>
                                <el-col :span="5" v-show="value.xSelector !== '日期'">
                                    <el-select placeholder="选择抽样数" v-model="value.selectorTime" size="small">
                                         <el-option label="10" value="10"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="30" value="30"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">是否轮播</el-col>
                                <el-col :span="5" style="font-size:15px;height:32px;line-height:28px">
                                    <el-switch v-model="value.selectCarousel" active-value="1" inactive-value="0" ></el-switch>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectCarousel !== '0'">轮播时间</el-col>
                                <el-col :span="5" v-show="value.selectCarousel !== '0'">
                                    <el-select placeholder="选择轮播时间" v-model="value.carouselTime" size="small">
                                        <el-option label="3秒" value="3"></el-option>
                                        <el-option label="5秒" value="5"></el-option>
                                        <el-option label="7秒" value="7"></el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="16" v-show="value.selectBoardType !== 'd9afbd838db242bda0b282aeda5e5b5c' && value.selectBoardType !== '表格'"><div style="width：300px;height:10px"></div></el-col>
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">表头</el-col>
                                <el-col :span="13" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">
                                    <el-checkbox-group v-model="value.theadSelects" size="small">
                                        <el-checkbox-button v-for="thead in value.theadData" :label="thead.board_axis_options_id" :key="thead.board_axis_options_id">{{thead.board_axis_options_name}}</el-checkbox-button>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" @click="addcarousel(settingDataRt)" size="small">添加轮播图</el-button>
                                    <el-button type="danger" v-show="index !== 0" @click="removecarousel(settingDataRt,index)" size="small">删除轮播图</el-button>
                                    <el-button type="primary" plain @click="savecarousel(settingDataRt,value,index)" size="small">保存</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="轮播图" name="轮播图" v-if="configurationShow == '1'">
                        <el-row :gutter="20" style="height:100%;">
                            <el-col :span="12" style="height:100%;">
                                <el-card class="box-card" style="height:100%;overflow:auto">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">上传图片</span>
                                        <el-button style="float: right;" type="success" size="medium" @click="startUploadPicture()">开始上传</el-button>
                                    </div>
                                    <el-upload
                                        class="upload-demo"
                                        ref="upload"
                                        :http-request="startUploadPicture"
                                        :on-change="uploadAmount"
                                        :action="upLoadBillboardPicUrl"
                                        :file-list="pictureList"
                                        :auto-upload="false"
                                        :multiple="true"
                                        accept="image/jpeg,image/jpg,image/npg"
                                        list-type="picture">
                                        <el-button size="small" type="primary">选择文件</el-button>
                                        <div slot="tip" class="el-upload__tip" style="font-size:14px">只能上传jpeg, jpg, npg的图片文件, 图片名称不能超过10个字, 推荐尺寸880px * 480px</div>
                                    </el-upload>
                                </el-card>
                            </el-col>
                            <el-col :span="12" style="height:100%;" v-loading="videoLoading">
                                <el-card class="box-card" style="height:100%; overflow:auto" :body-style="{height:'100%'}">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">选择图片</span>
                                        <el-button style="float: right;margin-left:5px" type="danger" size="medium" @click="pictureDelete(multipleSelection)">删除选中</el-button>
                                        <el-button style="float: right;" type="success" size="medium"  @click="submitSelectPicture(multipleSelection)">播放选中</el-button>
                                    </div>
                                    <el-table ref="multipleTable" :data="pictureTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                                        <el-table-column type="selection" width="55"></el-table-column>
                                        <el-table-column prop="number" label="序号":min-width="80"></el-table-column>
                                        <el-table-column prop="time" label="上传日期" :min-width="120"></el-table-column>
                                        <el-table-column prop="name" label="名称" :min-width="150"></el-table-column>
                                        <el-table-column prop="format" label="格式" :min-width="80"></el-table-column>
                                        <el-table-column prop="size" label="大小" :min-width="80"></el-table-column>
                                        <el-table-column :min-width="80" prop="edit" label="编辑" fixed="right">
                                            <template slot-scope="scope">
                                                <el-button type="danger" size="small" @click="pictureDelete(scope.row, scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination class="text-right" @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane label="视频" name="视频" v-if="configurationShow == '1'">
                        <el-row :gutter="20"  style="height:100%;">
                            <el-col :span="12"  style="height:100%;">
                                <el-card class="box-card"  style="height:100%;overflow:auto">
                                <div slot="header" class="clearfix">
                                    <span style="font-size:16px">上传视频</span>
                                    <el-button style="float: right;" type="success" size="medium" @click="startUploadVideo" :loading="uploaSdate">开始上传</el-button>
                                </div>

                                <el-upload
                                    class="upload-demo"
                                    ref="uploadVideo"
                                    :http-request="startUploadVideo"
                                     :on-change="uploadAmountVideo"
                                    :action="uploadBillboardVedioUrl"
                                    :file-list="videoList"
                                    :auto-upload="false"
                                    :multiple="true"
                                    accept="video/mp4,video/webm,video/ogg"
                                    list-type="picture">
                                    <el-button size="small" type="primary">选择文件</el-button>
                                    <div slot="tip" class="el-upload__tip" style="font-size:14px">只能上传video/mp4, video/webm, video/ogg文件</div>
                                </el-upload>

                                </el-card>
                            </el-col>
                            <el-col :span="12" style="height:100%;" v-loading="videoLoading">
                                <el-card class="box-card"  style="height:100%;overflow:auto">
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">选择视频</span>
                                    </div>
                                    <el-table ref="multipleTable" :data="videoTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                                        <el-table-column prop="number" label="序号":min-width="80"></el-table-column>
                                        <el-table-column prop="time" label="上传日期" :min-width="120"></el-table-column>
                                        <el-table-column prop="name" label="名称" :min-width="150"></el-table-column>
                                        <el-table-column prop="format" label="格式" :min-width="80"></el-table-column>
                                        <el-table-column prop="size" label="大小" :min-width="80"></el-table-column>
                                        <el-table-column :min-width="160" prop="edit" label="编辑" fixed="right">
                                            <template slot-scope="scope">
                                                <el-button type="success" size="small" @click="videoSelectUse(scope.row)">使用</el-button>
                                                <el-button type="danger" size="small" @click="videoDelete(scope.row)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination class="text-right" @current-change="handleCurrentChangeVideo" background small layout="total,prev,pager,next" :current-page="videoCurrenPage" :page-size="pagesize" :total="videoLines"></el-pagination>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-tab-pane>


                    <el-tab-pane label="左下区" name="左下区">
                        <el-card class="box-card" v-for="(value,index) in settingDataLb" :class="{v_margin : index !== 0}">
                            <el-row :gutter="20">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">名称</el-col>
                                <el-col :span="5">
                                    <el-input placeholder="名称" v-model="value.name" size="small" style="max-width:200px"></el-input>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">报表</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="报表(首选)" v-model="value.selectRetrospect" @change="selectFrom(value,'switchover')" size="small">
                                        <el-option v-for="(val,key) in reportFormsData" :label="val.board_report_form_name" :value="val.board_report_form_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">{{value.searchTypeOne}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeOne" v-model="value.selectOptionNameOne" @focus="selectProcess(value.searchTypeOne,value)" v-show="value.searchTypeOne !='报表类型'" size="small" style="max-width:200px"></el-input>
                                     <el-select placeholder="选择报表类型" v-model="value.selectOptionNameOne"  v-show="value.searchTypeOne =='报表类型'" size="small">
                                        <el-option label="工序报表" value="workstage"></el-option>
                                        <el-option label="日报表" value="day"></el-option>
                                        <el-option label="周报表" value ="week"></el-option>
                                        <el-option label="月报表" value="month"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">时间</el-col>
                                <el-col :span="13">
                                    <el-date-picker  type="datetimerange" v-model="value.startTime"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" size="small"></el-date-picker>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" v-show="value.selectOptionNameOne != 'workstage'" class="text-right ellipsis">{{value.searchTypeTwo}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeTwo" v-model="value.selectOptionNameTwo" @focus="selectProcess(value.searchTypeTwo,value)" v-show="value.selectOptionNameOne != 'workstage'" size="small" style="max-width:200px"></el-input>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">看板类型</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="看板类型" v-model="value.selectBoardType" size="small">
                                        <el-option label="折线图" value="050696bee7c04195b45b9011d3913379"></el-option>
                                        <el-option label="柏拉图" value="2432758be3ad4beaabf84297dd9906f6"></el-option>
                                        <el-option label="柱状图" value ="d951823154e34c03a00ae07bbae6c02a"></el-option>
                                        <el-option label="表格" value="d9afbd838db242bda0b282aeda5e5b5c"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">X轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择X轴" v-model="value.xSelector" size="small">
                                         <el-option v-for="(val,key) in value.xData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">Y轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择Y轴" v-model="value.ySelector" size="small" v-show="value.selectBoardType != '2432758be3ad4beaabf84297dd9906f6'" >
                                         <el-option v-for="(val,key) in value.yData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                     <el-select v-model="value.ySelectorArray" multiple collapse-tags  placeholder="选择Y轴" size="small" v-show="value.selectBoardType == '2432758be3ad4beaabf84297dd9906f6'" style="font-size:12px">
                                        <el-option v-for="(val,key) in value.yData" :key="val.board_axis_options_name" :label="val.board_axis_options_name" :value="val.board_axis_options_id">
                                        </el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.xSelector !== '日期'">随机抽样</el-col>
                                <el-col :span="5" v-show="value.xSelector !== '日期'">
                                    <el-select placeholder="选择抽样数" v-model="value.selectorTime" size="small">
                                         <el-option label="10" value="10"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="30" value="30"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">是否轮播</el-col>
                                <el-col :span="5" style="font-size:15px;height:32px;line-height:28px">
                                    <el-switch v-model="value.selectCarousel" active-value="1" inactive-value="0" ></el-switch>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectCarousel !== '0'">轮播时间</el-col>
                                <el-col :span="5" v-show="value.selectCarousel !== '0'">
                                    <el-select placeholder="选择轮播时间" v-model="value.carouselTime" size="small">
                                        <el-option label="3秒" value="3"></el-option>
                                        <el-option label="5秒" value="5"></el-option>
                                        <el-option label="7秒" value="7"></el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="16" v-show="value.selectBoardType !== 'd9afbd838db242bda0b282aeda5e5b5c' && value.selectBoardType !== '表格'"><div style="width：300px;height:10px"></div></el-col>
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">表头</el-col>
                                <el-col :span="13" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">
                                    <el-checkbox-group v-model="value.theadSelects" size="small">
                                        <el-checkbox-button v-for="thead in value.theadData" :label="thead.board_axis_options_id" :key="thead.board_axis_options_id">{{thead.board_axis_options_name}}</el-checkbox-button>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" @click="addcarousel(settingDataLb)" size="small">添加轮播图</el-button>
                                    <el-button type="danger" v-show="index !== 0" @click="removecarousel(settingDataLb,index)" size="small">删除轮播图</el-button>
                                    <el-button type="primary" plain @click="savecarousel(settingDataLb,value,index)" size="small">保存</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="右下区" name="右下区">
                        <el-card class="box-card" v-for="(value,index) in settingDataRb" :class="{v_margin : index !== 0}">
                            <el-row :gutter="20">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">名称</el-col>
                                <el-col :span="5">
                                    <el-input placeholder="名称" v-model="value.name" size="small" style="max-width:200px"></el-input>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">报表</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="报表(首选)" v-model="value.selectRetrospect" @change="selectFrom(value,'switchover')" size="small">
                                        <el-option v-for="(val,key) in reportFormsData" :label="val.board_report_form_name" :value="val.board_report_form_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">{{value.searchTypeOne}}</el-col>
                                <el-col :span="5">
                                   <el-input :placeholder="'选择'+value.searchTypeOne" v-model="value.selectOptionNameOne" @focus="selectProcess(value.searchTypeOne,value)" v-show="value.searchTypeOne !='报表类型'" size="small" style="max-width:200px"></el-input>
                                     <el-select placeholder="选择报表类型" v-model="value.selectOptionNameOne"  v-show="value.searchTypeOne =='报表类型'" size="small">
                                        <el-option label="工序报表" value="workstage"></el-option>
                                        <el-option label="日报表" value="day"></el-option>
                                        <el-option label="周报表" value ="week"></el-option>
                                        <el-option label="月报表" value="month"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">时间</el-col>
                                <el-col :span="13">
                                    <el-date-picker  type="datetimerange" v-model="value.startTime"  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" size="small"></el-date-picker>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" v-show="value.selectOptionNameOne != 'workstage'" class="text-right ellipsis">{{value.searchTypeTwo}}</el-col>
                                <el-col :span="5">
                                    <el-input :placeholder="'选择'+value.searchTypeTwo" v-model="value.selectOptionNameTwo" @focus="selectProcess(value.searchTypeTwo,value)" v-show="value.selectOptionNameOne != 'workstage'" size="small" style="max-width:200px"></el-input>
                                </el-col>
                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">看板类型</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="看板类型" v-model="value.selectBoardType" size="small">
                                        <el-option label="折线图" value="050696bee7c04195b45b9011d3913379"></el-option>
                                        <el-option label="柏拉图" value="2432758be3ad4beaabf84297dd9906f6"></el-option>
                                        <el-option label="柱状图" value ="d951823154e34c03a00ae07bbae6c02a"></el-option>
                                        <el-option label="表格" value="d9afbd838db242bda0b282aeda5e5b5c"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">X轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择X轴" v-model="value.xSelector" size="small">
                                         <el-option v-for="(val,key) in value.xData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">Y轴</el-col>
                                <el-col :span="5">
                                    <el-select placeholder="选择Y轴" v-model="value.ySelector" size="small" v-show="value.selectBoardType != '2432758be3ad4beaabf84297dd9906f6'">
                                         <el-option v-for="(val,key) in value.yData" :label="val.board_axis_options_name" :value="val.board_axis_options_id"></el-option>
                                    </el-select>
                                     <el-select v-model="value.ySelectorArray" multiple collapse-tags  placeholder="选择Y轴" size="small" v-show="value.selectBoardType == '2432758be3ad4beaabf84297dd9906f6'" style="font-size:12px">
                                        <el-option v-for="(val,key) in value.yData" :key="val.board_axis_options_name" :label="val.board_axis_options_name" :value="val.board_axis_options_id">
                                        </el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.xSelector !== '日期'">随机抽样</el-col>
                                <el-col :span="5" v-show="value.xSelector !== '日期'">
                                    <el-select placeholder="选择抽样数" v-model="value.selectorTime" size="small">
                                         <el-option label="10" value="10"></el-option>
                                        <el-option label="20" value="20"></el-option>
                                        <el-option label="30" value="30"></el-option>
                                    </el-select>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis">是否轮播</el-col>
                                <el-col :span="5" style="font-size:15px;height:32px;line-height:28px">
                                    <el-switch v-model="value.selectCarousel" active-value="1" inactive-value="0" ></el-switch>
                                </el-col>

                                <el-col :span="3" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectCarousel !== '0'">轮播时间</el-col>
                                <el-col :span="5" v-show="value.selectCarousel !== '0'">
                                    <el-select placeholder="选择轮播时间" v-model="value.carouselTime" size="small">
                                        <el-option label="3秒" value="3"></el-option>
                                        <el-option label="5秒" value="5"></el-option>
                                        <el-option label="7秒" value="7"></el-option>
                                    </el-select>
                                </el-col>

                            </el-row>

                            <el-row :gutter="20" style="margin-top:15px">
                                <el-col :span="16" v-show="value.selectBoardType !== 'd9afbd838db242bda0b282aeda5e5b5c' && value.selectBoardType !== '表格'"><div style="width：300px;height:10px"></div></el-col>
                                <el-col :span="2" style="font-size:15px;height:32px;line-height:32px" class="text-right ellipsis" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">表头</el-col>
                                <el-col :span="13" v-show="value.selectBoardType === 'd9afbd838db242bda0b282aeda5e5b5c' || value.selectBoardType === '表格'">
                                    <el-checkbox-group v-model="value.theadSelects" size="small">
                                        <el-checkbox-button v-for="thead in value.theadData" :label="thead.board_axis_options_id" :key="thead.board_axis_options_id">{{thead.board_axis_options_name}}</el-checkbox-button>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" @click="addcarousel(settingDataRb)" size="small">添加轮播图</el-button>
                                    <el-button type="danger" v-show="index !== 0" @click="removecarousel(settingDataRb,index)" size="small">删除轮播图</el-button>
                                    <el-button type="primary" plain @click="savecarousel(settingDataRb,value,index)" size="small">保存</el-button>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>


                </el-tabs>
            </el-main>
            <el-dialog title="新增方案" :visible.sync="dialogFormVisible">
                <el-form :model="addprojectManagement">
                    <el-form-item label="看板" :label-width="formLabelWidth">
                        <el-select v-model="addprojectManagement.type" placeholder="请选择看板类型" style="width:50%">
                            <el-option label="宣传看板" value="宣传看板"></el-option>
                            <el-option label="生产看板" value="生产看板"></el-option>
                            <el-option label="设备看板" value="设备看板"></el-option>
                            <el-option label="质量看板" value="质量看板"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth">
                        <el-input v-model="addprojectManagement.name" auto-complete="off" style="width:50%"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" :label-width="formLabelWidth">
                        <el-input v-model="addprojectManagement.peopleName" auto-complete="off" style="width:50%" @focus="selectPeople('add')" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" :label-width="formLabelWidth">
                       <el-date-picker v-model="addprojectManagement.time" type="datetime" placeholder="选择日期时间"  style="width:50%" :disabled="true"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addSchemeAjax()">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>
        `
    })


    //添加删除看板方案
    Vue.component('mes-addkanban', {
        data() {
            return {
                tableData3: [
                    {
                        date: '方案一',
                    }, {
                        date: '方案二',
                    }, {
                        date: '方案三',
                    },
                ]
            }
        },

        template: `
            <el-row :gutter="10" style="height:100%;">
                <el-col :span="6" style="height:100%;">
                    <el-card class="box-card" style="height:100%;" :body-style="{height:'90%', overflow: 'auto' }">
                        <div slot="header" class="clearfix" >
                            <span style="font-size:16px">宣传看板</span>
                            <el-button style="float: right;" type="success" size="medium">添加方案</el-button>
                        </div>
                            <el-table :data="tableData3" style="width: 100%" height="100%">
                            <el-table-column prop="date" label="方案名称" width="170"></el-table-column>
                            <el-table-column prop="name" label="操作" width="50" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" style="color:#f78989">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="6" style="height:100%;">
                    <el-card class="box-card"  style="height:100%;" :body-style="{height:'90%', overflow: 'auto' }">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">生产看板</span>
                            <el-button style="float: right;" type="success" size="medium">添加方案</el-button>
                        </div>
                        <el-table :data="tableData3" style="width: 100%" height="100%">
                            <el-table-column prop="date" label="方案名称" width="170"></el-table-column>
                            <el-table-column prop="name" label="操作" width="50" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" style="color:#f78989">删除</el-button>
                                </template>
                            </el-table-column>
                         </el-table>
                    </el-card>
                </el-col>
                <el-col :span="6" style="height:100%;">
                    <el-card class="box-card"  style="height:100%;" :body-style="{height:'90%', overflow: 'auto' }">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">设备看板</span>
                            <el-button style="float: right;" type="success" size="medium">添加方案</el-button>
                        </div>
                         <el-table :data="tableData3" style="width: 100%" height="100%">
                            <el-table-column prop="date" label="方案名称" width="170"></el-table-column>
                            <el-table-column prop="name" label="操作" width="50" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" style="color:#f78989">删除</el-button>
                                </template>
                            </el-table-column>
                         </el-table>
                    </el-card>
                </el-col>
                <el-col :span="6" style="height:100%;">
                    <el-card class="box-card"  style="height:100%;" :body-style="{height:'90%', overflow: 'auto' }">
                        <div slot="header" class="clearfix">
                            <span style="font-size:16px">质量看板</span>
                            <el-button style="float: right;" type="success" size="medium">添加方案</el-button>
                        </div>
                         <el-table :data="tableData3" style="width: 100%" height="100%">
                            <el-table-column prop="date" label="方案名称" width="170"></el-table-column>
                            <el-table-column prop="name" label="操作" width="50" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" style="color:#f78989">删除</el-button>
                                </template>
                            </el-table-column>
                         </el-table>
                    </el-card>
                </el-col>
            </el-row>
        `
    })

    //看板页面
    Vue.component('mes-kanban', {
        props: ['kanbanShow'], //区别是宣传看板还是其他看板
        data() {
            return {
                time: 'YYYY-MM-DD hh:mm:ss',
                loading: false, //加载显示条件
                boardPlan: '', //基础数据
                boardPic:[],
                boardVideo:"",
                videoAdress:"",
                settingDataLt:"",
                boardAreaCharts: '',//区域数据
                ltnterval: '',//左上 轮播时间
                ltCharts:[// 左上折线图
                    // {
                    //     typeName:"柱状图",
                    //     workstageName:"哈哈哈",
                    //     ltChartData: {
                    //         columns: ['型号', '计划数量', '实际数量'],
                    //         rows: [
                    //             { '计划数量': 1523, '实际数量': 1523 ,'型号': '1月1日'},
                    //             { '计划数量': 1223, '实际数量': 1523 ,'型号': '1月1日'},
                    //             { '计划数量': 2123, '实际数量': 1523 , '型号': '1月1日'}
                    //         ]
                    //     },
                    //     ltChartSettings: {
                    //         metrics: ['计划数量', '实际数量'],
                    //         dimension: ['型号']
                    //     }
                    // },
                    // {
                    //     typeName:"柏拉图",
                    //     workstageName:"你好",
                    //     ltChartData: {
                    //         columns: ['型号', '计划数量', '实际数量', '产出率'],
                    //         rows: [
                    //           { '型号': '10月30日', '计划数量': 1500, '实际数量': 1400, '产出率': 0.93 },
                    //           { '型号': '10月31日', '计划数量': 1450, '实际数量': 1350, '产出率': 0.93 },
                    //           { '型号': '10月1日', '计划数量': 1300, '实际数量': 1200, '产出率': 0.92},
                    //         ]
                    //       },
                    //     ltChartSettings: {
                    //         metrics: ['计划数量', '实际数量', '产出率'],
                    //         // stack: { '生产量': ['良品数量', '不良品数量'] },
                    //         showLine: ['产出率'],
                    //         axisSite: { right: ['产出率'] },
                    //         yAxisType: ['KMB', 'percent'],
                    //         yAxisName: ['数值', '比率'],
                    //         label: {
                    //           normal: { show: true, position: 'top' }
                    //         }
                    //     },
                    // }
                ],
                // ltChartData: {
                //     workstageName:"",
                //     columns: ['型号', '计划数量', '实际数量'],
                //     rows: []
                // },
                // ltChartSettings: {
                //     metrics: ['计划数量', '实际数量'],
                //     dimension: ['型号']
                // },
                rtCharts:[],
                lbCharts:[],
                rbCharts:[],
                chartData3: {
                    columns: ['日期', '成本', '利润', '占比', '其他'],
                    rows: [
                        { '日期': '1月1日', '成本': 1523, '利润': 1523, '占比': 0.12, '其他': 100 },
                        { '日期': '1月2日', '成本': 1223, '利润': 1921, '占比': 0.345, '其他': 100 },
                        { '日期': '1月3日', '成本': 2123, '利润': 5523, '占比': 0.7, '其他': 100 },
                        { '日期': '1月4日', '成本': 4123, '利润': 6523, '占比': 0.31, '其他': 100 }
                    ]
                },
                chartSettings3: {
                    axisSite: { right: ['占比'] },
                    yAxisType: ['KMB', 'percent'],
                    yAxisName: ['数值', '比率'],
                    showLine:['占比']
                }
            }

        },
        methods: {
            getTime(){
                setInterval(()=> {
                    var time = new Date();
                    var day
                    if(time.getDay()==0) day = " 星期日"
                    if(time.getDay()==1) day = " 星期一"
                    if(time.getDay()==2) day = " 星期二"
                    if(time.getDay()==3) day = " 星期三"
                    if(time.getDay()==4) day = " 星期四"
                    if(time.getDay()==5) day = " 星期五"
                    if(time.getDay()==6) day = " 星期六"
                    // 程序计时的月从0开始取值后+1
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var min = time.getMinutes();
                    var s = time.getSeconds();
                    if(m<10){
                        m= "0" + m
                    }
                    if(d<10){
                        d= "0" + d
                    }
                    if(h<10){
                        h= "0" + h
                    }
                    if(min<10){
                        min= "0" + min
                    }
                    if(s<10){
                        s= "0" + s
                    }
                    var t = time.getFullYear() + "-" + m + "-" + d + " " +h + ":" + min + ":" + s + day;
                    this.time = t;
                   }, 1000);
            },

        },
        created() {

            $.ajax({//查询图片
                type: "POST",
                url: queryUsedBillboardPicProgramUrl, //请求 图片
                data:{headNum:1,Keyword:""},
                beforeSend: (xml) => {
                    this.loading = true
                },
                success: (result, status, xhr) => {
                    if (result.status == 0) {
                        this.loading = false
                        //this.boardPic = result.map.picNameList
                        this.boardPic = []
                        result.map.picNameList.forEach((val, key)=>{
                            var boardPicAdress = ""
                            boardPicAdress = BASE_PATH + "/"+ val.img_url
                            this.boardPic.push(boardPicAdress)
                        })

                    }
                    else {
                        this.loading = false
                        this.$message.error('获取数据失败，请重新尝试');
                    }

                },
            })
            $.ajax({//查询视频
                type: "POST",
                url: queryUsedBillboardVedioProgramUrl,
               // data:{headNum:1,type:"vague"},
                beforeSend: (xml) => {
                    this.loading = true
                },
                success: (result, status, xhr) => {
                    if (result.status == 0) {
                        this.loading = false
                        this.boardVideo = result.map.vedioNameList[0].billboard_vedio_url
                        this.videoAdress =  BASE_PATH + "/"+   this.boardVideo
                    }
                    else {
                        this.loading = false
                        this.$message.error('获取数据失败，请重新尝试');
                    }

                },
            })
        },
        mounted(){

            this.getTime()

            bus.$on('queryPropagandaBoard',(result)=>{
                this.lbCharts=[], this.rbCharts=[]
                this.lbCharts  = result[0]
                this.rbCharts  = result[1]
            }); //bus触发事件
            bus.$on('queryProductBoard',(result)=>{
                this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]
                this.ltCharts  = result[0]
                this.rtCharts  = result[1]
                this.lbCharts  = result[2]
                this.rbCharts  = result[3]
            }); //bus触发事件
            bus.$on('queryDeviceBoard',(result)=>{
                this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]
                this.ltCharts  = result[0]
                this.rtCharts  = result[1]
                this.lbCharts  = result[2]
                this.rbCharts  = result[3]
            }); //bus触发事件
            bus.$on('queryQualityBoard',(result)=>{
                this.ltCharts=[], this.rtCharts=[], this.lbCharts=[], this.rbCharts=[]
                this.ltCharts  = result[0]
                this.rtCharts  = result[1]
                this.lbCharts  = result[2]
                this.rbCharts  = result[3]
            }); //bus触发事件

        },
        template: `
        <div style="height:100%" v-loading="loading">
            <el-row style="height:47%;padding:15px 0" :gutter="20">
                <el-col :span="12" style="height: 100%;">
                    <video style="width:100%;height:100%;backgroundColor:black" controls="controls" loop="loop" autoplay :src="videoAdress"   v-if="kanbanShow === '1'">

                    </video>

                    <el-carousel style="height: 100%;" v-if="kanbanShow === '2'" :interval ="100000" >

                        <el-carousel-item style="height: 100%;" v-for="(value,index) in ltCharts" v-show = "ltCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                         <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>

                        <el-carousel-item  v-show = "!ltCharts.length">
                            <h4>暂无数据</h4>
                        </el-carousel-item>

                    </el-carousel>
                </el-col>
                <el-col :span="12" style="height: 100%;">

                    <el-carousel style="height: 100%;" indicator-position="none"  v-if="kanbanShow === '1'">
                        <el-carousel-item v-for="img in boardPic"  v-show = "boardPic.length">
                            <a href="#">
                                <img :src="img" style="height: 100%">
                            </a>
                        </el-carousel-item>
                        <el-carousel-item  v-show = "!boardPic.length">
                              <h4>暂无数据</h4>
                        </el-carousel-item>
                    </el-carousel>

                     <el-carousel style="height: 100%;" v-if="kanbanShow === '2'" >

                        <el-carousel-item style="height: 100%;" v-for="(value,index) in rtCharts" v-show = "rtCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                         <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>

                        <el-carousel-item  v-show = "!rtCharts.length">
                             <h4>暂无数据</h4>
                        </el-carousel-item>

                    </el-carousel>

                </el-col>
            </el-row>
            <el-row style="height:47%;padding:15px 0" :gutter="20">
                <el-col :span="12" style="height: 100%;">
                    <el-carousel style="height: 100%;" v-if="kanbanShow === '1'">
                        <el-carousel-item style="height: 100%;" v-for="(value,index) in lbCharts" v-show = "lbCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                        <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>

                        <el-carousel-item  v-show = "!lbCharts.length">
                            <h4>暂无数据</h4>
                        </el-carousel-item>
                    </el-carousel>
                    <el-carousel style="height: 100%;" v-if="kanbanShow === '2'" >

                        <el-carousel-item style="height: 100%;" v-for="(value,index) in lbCharts" v-show = "lbCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                        <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>

                        <el-carousel-item  v-show = "!lbCharts.length">
                             <h4>暂无数据</h4>
                        </el-carousel-item>

                    </el-carousel>


                </el-col>
                <el-col :span="12" style="height:100%;" :gutter="20">

                    <el-carousel style="height: 100%;" v-if="kanbanShow === '1'" >

                        <el-carousel-item style="height: 100%;" v-for="(value,index) in rbCharts" v-show = "rbCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                        <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>
                        <el-carousel-item  v-show = "!rbCharts.length">
                            <h4>暂无数据</h4>
                        </el-carousel-item>
                    </el-carousel>
                    <el-carousel style="height: 100%;" v-if="kanbanShow === '2'" >

                        <el-carousel-item style="height: 100%;" v-for="(value,index) in rbCharts" v-show = "rbCharts.length">
                            <el-card class="box-card" style="height: 100%" :body-style="{height:'95%', padding: '0px' }"  >
                                    <div slot="header" class="clearfix">
                                        <span style="font-size:16px">{{value.workstageName}}</span>
                                    </div>
                                    <ve-histogram :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '柱状图' || value.typeName === '柏拉图'"></ve-histogram>
                                    <ve-line :data="value.ltChartData" :settings="value.ltChartSettings" v-if="value.typeName === '折线图'"></ve-line>
                                    <el-table :data="value.workShopProductTableData" style="width: 100%" v-if="value.typeName === '表格'">
                                        <el-table-column v-for="(value, key, index) of value.labelAndProp" :prop="value" :label="key" :key="index">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </el-carousel-item>

                        <el-carousel-item  v-show = "!rbCharts.length">
                             <h4>暂无数据</h4>
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
            <el-row style="height:6%;padding:10px 0" :gutter="20">
                <el-col :span="24" >
                    <div class="grid-content bg-purple pull-right" style="font-size:23px">
                         <span v-text="time" clsss="pull-right"></span>
                    </div>
                </el-col>
            </el-row>

        </div>
        `
    })

})
