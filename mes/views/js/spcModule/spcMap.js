$(function () {
    var Vuex = new Vue()

    // type: 'median',
    // orderType: 'random',
    // deviceId: '771f54c4905411e7966812eb78deb327',
    // deviceParameter: '测试参数1',
    // startTime: '2017-12-21 13:23:36',
    // endTime: '2018-01-01 13:23:36',
    // a: '2',
    // averaget: '15',
    // sampleSize: '5',
    // sampleNumber: '25',

    // var forms = new FormData()
    // forms.append('file', { uid: 1521599650565, name: "a0d369614bf3aa98ed3e6b723f14ea34.jpg", webkitRelativePath: ""})
    // $.ajax({
    //     type: 'POST', dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
    //     url: querySPCDataCollectionUrl,
    //     data: {
    //         type: 'info'
    //     },
    //     success: function (result, status, xhr) {

    //     }
    // })


    let map = new Vue({
        el: '#container',
        data() {
            return {
                //基础数据
                picType: '', // 图类
                yAxisName1: '平均值', //y轴名字
                yAxisName2: '极差值', //y轴名字
                allData:[], //存放所有数据
                pagingData: [],//存放分页数据
                orderData: {
                    CL: '',
                    LCL: '',
                    RCL: '',
                    RUCL: '',
                    UCL: '',
                    CPK:'',
                },
                lines: 0, //条数
                currenPage: 1, //当前页
                pagesize: 10,
                //平均值图表配置
                averageData: {
                    columns: ['平均值', '样本数'],
                    rows: [],
                },
                averageSettings: {
                    metrics: ['平均值'],
                    dimension: ['样本数'],
                    label: {
                        normal: {
                            show: true
                        }
                    }
                },
                averageDataEmpty: false,
                //极差值图表配置
                rangeData: {
                    columns: ['极差值', '样本数'],
                    rows: [],
                    dataEmpty: true
                },
                rangeSettings: {
                    metrics: ['极差值'],
                    dimension: ['样本数'],
                    label: {
                        normal: {
                            show: true
                        }
                    }
                },
                rangeDataEmpty: false,
                rangeColors: ['#61a0a8']
            }
        },
        methods: {
            //查询基础信息ajax
            qunFun(url,data) {
                $.ajax({
                    type: 'POST',
                    url: url,
                    data:data,
                    success: (result, status, xhr) => {
                        if (result.status === 0) {
                            this.orderData.CL = result.map.CL
                            this.orderData.LCL = result.map.LCL
                            this.orderData.RCL = result.map.RCL
                            this.orderData.RUCL = result.map.RUCL
                            this.orderData.UCL = result.map.UCL
                            this.orderData.CPK = result.map.cpk
                            this.lines = result.map.srList.length
                            this.allData = result.map.srList
                            this.pagingData = pagination(1, this.pagesize, this.allData)
                            this.dataClassification(this.pagingData)
                        } else if (result.status === 2) {
                            this.averageDataEmpty = true
                            this.rangeDataEmpty = true
                            swal({
                                title: result.msg,
                                type: 'error',
                                allowEscapeKey: false, // 用户按esc键不退出
                                allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                showCancelButton: false, // 显示用户取消按钮
                                confirmButtonText: '确定',
                            })
                        } else{
                            this.averageDataEmpty = true
                            this.rangeDataEmpty = true
                            swal({
                                title: result.msg,
                                type: 'error',
                                allowEscapeKey: false, // 用户按esc键不退出
                                allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                                showCancelButton: false, // 显示用户取消按钮
                                confirmButtonText: '确定',
                            })
                        }
                    }
                })
            },
            //折线图数据分类
            dataClassification(data) {
                let average = []
                let range = []
                let value = {},value2={}
                if (this.picType == '-X-R图') {
                    data.forEach((value, index) => {
                        this.averageData.rows.push({ '平均值': value.average_value, '样本数': value.dataList.length })
                        this.rangeData.rows.push({ '极差值': value.extreme_value, '样本数': value.dataList.length })
                    })
                } else if (this.picType == '~X-R图') {
                    this.averageData.columns = '中位值'
                    data.forEach((value, index) => {
                        this.averageData.rows.push({ '中位值': value.median_value, '样本数': value.dataList.length })
                        this.rangeData.rows.push({ '极差值': value.extreme_value, '样本数': value.dataList.length })
                    })
                }

                // data.forEach((value, index) => {
                //     this.averageData.rows.push({ '平均值': value.average_value, '样本数': value.dataList.length })
                //     this.rangeData.rows.push({ '极差值': value.extreme_value, '样本数': value.dataList.length })
                // })

            },
            //查看样本数
            check(data) {
                Vuex.$emit('sampleNumModel',data)
            },
            deviceParamter(data) {
               return data.split('/')[1]
            },
            //分页
            handleCurrentChange(val) {
                this.pagingData = pagination(val, this.pagesize, this.allData)
            },
        },
        created() {
            $.ajax({
                type: 'POST',
                url: querySPCDataCollectionUrl,
                data: {
                    type: 'detail',
                    dataId: window.location.href.split('?')[1].split('=')[1]
                },
                success: (result, status, xhr) => {
                    if (result.status === 0) {
                        this.picType = result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name
                        if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == '-X-R图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type == '') {
                            let data = {
                                type: 'average', //搜索类型
                                orderType: 'random', //排序类别
                                deviceId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id, //设备id
                                deviceParameter: this.deviceParamter(result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_paramter), //设备参数
                                startTime: moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime: moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryDeviceAverageXRUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == '-X-R图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id == '') {
                            let data = {
                                type: 'average', //搜索类型
                                orderType: 'random', //排序类别
                                qualityType: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type,//品质类型
                                valueType: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_standard, //值类别（criterion标准实测、单面、双面）
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                projectId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //检验项目id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityAverageXRUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == '~X-R图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type == '') {
                            let data = {
                                type: 'median', //搜索类型
                                orderType: 'random', //排序类别
                                deviceId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id, //设备id
                                deviceParameter: this.deviceParamter(result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_paramter), //设备参数
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryDeviceAverageXRUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == '~X-R图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id == '') {
                            let data = {
                                type: 'median', //搜索类型
                                orderType: 'random', //排序类别
                                qualityType: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type,//品质类型
                                valueType: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_standard, //值类别（criterion标准实测、单面、双面）
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                projectId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //检验项目id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityAverageXRUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'L-S图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type == '') {
                            let data = {
                                // orderType: 'random', //排序类别
                                deviceId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id, //设备id
                                deviceParameter: this.deviceParamter(result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_paramter), //设备参数
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryDeviceLSUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'L-S图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id == '') {
                            let data = {
                                // orderType: 'random', //排序类别
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                projectId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //检验项目id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityLSUrl, data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'X-Rs图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type == '') {
                            let data = {
                                orderType: 'random', //排序类别
                                deviceId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id, //设备id
                                deviceParameter: this.deviceParamter(result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_paramter), //设备参数
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryDeviceXRSUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'X-Rs图' && result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_device_id == '') {
                            let data = {
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                orderType: 'random', //排序类别
                                valueType: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_standard, //值类别（criterion标准实测、单面、双面）
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                projectId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //检验项目id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                a: result.map.spcDataMap[0].quality_spc_right_border, //规格正负A
                                averaget: result.map.spcDataMap[0].quality_spc_left_border, //平均规格
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityXRSUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'C图') {
                            let data = {
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityCUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'U图') {
                            let data = {
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityUUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'Pn图') {
                            let data = {
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityPnUrl,data)
                        } else if (result.map.spcDataMap[0].spcChartDOs[0].quality_spc_chart_name == 'P图') {
                            let data = {
                                type: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_report_type, //搜索类型
                                qualityId: result.map.spcDataMap[0].spcCharaterDOs[0].quality_spc_test_project_id, //物料id或半成品id
                                startTime:  moment(result.map.spcDataMap[0].quality_spc_character_start_time).format('YYYY-MM-DD HH:mm:ss'), //开始时间
                                endTime:  moment(result.map.spcDataMap[0].quality_spc_character_end_time).format('YYYY-MM-DD HH:mm:ss'), //结束时间
                                sampleSize: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_size, //样本容量
                                sampleNumber: result.map.spcDataMap[0].spcSampleDOs[0].quality_spc_sample_number //样本数量
                            }
                            this.qunFun(queryQualityPUrl,data)
                        }
                    }
                }
            })
        },
        filters: {
            times(val) {
                if (val !== '' && val !== null) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            status(val) {
                var status = map.orderData.UCL > Math.max.apply(null, val) ? '正常' : '失控'
                return status
            }
        },
        template: `
            <div id="container">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-size:16px">查看控制图</span>
                        <el-button style="float: right; padding: 3px 0" type="text">历史数据</el-button>
                    </div>
                    <ve-line :data="averageData" :settings="averageSettings" :data-empty="averageDataEmpty" height=300px></ve-line>
                    <ve-line :data="rangeData" :settings="rangeSettings" :colors="rangeColors" :data-empty="rangeDataEmpty" height=300px></ve-line>
                    <el-card class="box-card" body-style="padding:10px 20px">
                        <el-row :gutter="20">
                            <el-col :span="5">{{'UCL：'+orderData.UCL}}</el-col>
                            <el-col :span="5">{{'CL：'+orderData.CL}} </el-col>
                            <el-col :span="5">{{'LCL：'+orderData.LCL}}</el-col>
                            <el-col :span="5">{{'CPK：'+orderData.CPK}}</el-col>
                            <el-col :span="4">{{'CPK(参考值)：'}}</el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:3px;" style="border-radius:0">
                         <div class="panel">
                            <!--panel-heading end -->
                            <div class="panel-body-table table-height-10">
                                <table class="table table-bordered table-hover" v-if="picType =='-X-R图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;">序号</th>
                                            <th style="width: 15%;">状态</th>
                                            <th style="width: 15%;">平均值</th>
                                            <th style="width: 15%;">极差值</th>
                                            <th style="width: 15%;">最大值</th>
                                            <th style="width: 15%;">最小值</th>
                                            <th style="width: 15%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.average_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.min_value}}</td>
                                            <td><a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>查看样本数</a></td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered table-hover" v-if="picType =='~X-R图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;">序号</th>
                                            <th style="width: 15%;">状态</th>
                                            <th style="width: 15%;">中位值</th>
                                            <th style="width: 15%;">极差值</th>
                                            <th style="width: 15%;">最大值</th>
                                            <th style="width: 15%;">最小值</th>
                                            <th style="width: 15%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.median_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.min_value}}</td>
                                            <td><a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>查看样本数</a></td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered table-hover" v-if="picType =='L-S图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 8%;">序号</th>
                                            <th style="width: 8%;">状态</th>
                                            <th style="width: 15%;">最大平均值</th>
                                            <th style="width: 15%;">最小平均值</th>
                                            <th style="width: 10%;">平均极差</th>
                                            <th style="width: 10%;">范围中值</th>
                                            <th style="width: 10%;">最大值</th>
                                            <th style="width: 10%;">最小值</th>
                                            <th style="width: 14%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.average_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.min_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.min_value}}</td>
                                            <td><a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>查看样本数</a></td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered table-hover" v-if="picType =='X-Rs图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 8%;">序号</th>
                                            <th style="width: 10%;">状态</th>
                                            <th style="width: 15%;">平均值</th>
                                            <th style="width: 15%;">极差值</th>
                                            <th style="width: 17%;">移动极差值</th>
                                            <th style="width: 10%;">最大值</th>
                                            <th style="width: 10%;">最小值</th>
                                            <th style="width: 15%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.average_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.max_value}}</td>
                                            <td>{{value.min_value}}</td>
                                            <td><a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>查看样本数</a></td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered table-hover" v-if="picType =='Pn图' || picType =='P图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;">序号</th>
                                            <th style="width: 20%;">不良项</th>
                                            <th style="width: 10%;">状态</th>
                                            <th style="width: 20%;">不合格品数</th>
                                            <th style="width: 40%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.average_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>样本数量</a>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>状态</a>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>不良项</a>
                                            </td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                                <table class="table table-bordered table-hover" v-if="picType =='C图' || picType =='U图'">
                                    <thead>
                                        <tr>
                                            <th style="width: 10%;">序号</th>
                                            <th style="width: 20%;">不良项</th>
                                            <th style="width: 10%;">状态</th>
                                            <th style="width: 20%;">缺陷数</th>
                                            <th style="width: 40%;">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(value,index) in pagingData">
                                            <td>{{index+1}}</td>
                                            <td>{{value.dataList | status}}</td>
                                            <td>{{value.average_value}}</td>
                                            <td>{{value.extreme_value}}</td>
                                            <td>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>样本数量</a>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>状态</a>
                                                <a href="javascript:void(0);" @click="check(value.dataList)"><i class="fa fa-tasks fa-fw"></i>不良项</a>
                                            </td>
                                        </tr>
                                        <tr v-show="!pagingData.length"><td colspan=8 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="panel-footer panel-footer-table text-right">
                               <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                            </div>
                            <!--panel-footer end -->
                        </div>
                    </el-card>
                </el-card>

            </div>
        `
    })

    let sampleNum = new Vue({
        el: '#sampleNumModel',
        data() {
            return {
                dataList:[],
            }
        },
        created() {
        },
        methods: {
        },
        mounted() {
            Vuex.$on('sampleNumModel', (data) => {
                this.dataList = data
                const modal = document.getElementById('sampleNumModel')   //模态框
                $(modal).modal({
                    backdrop: 'static', // 黑色遮罩不可点击
                    keyboard: false,  // esc按键不可关闭模态框
                    show: true     //显示
                })
            })
        },
        template: `
        <div class="modal fade" id="sampleNumModel">
            <div class="modal-dialog ">
                <div class="modal-content" >
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
                                <div class="col-xs-12">
                                    <h4>查看样本数</h4>
                                </div>
                                </div>
                            </div>
                            <div
                                class="panel-body-table table-height-10">
                                <table class="table  table-bordered table-hover">

                                    <tbody class="text-center">
                                    <tr v-for="(value,index) in dataList">
                                        <td width="20%">{{index+1}}</td>
                                        <td width="80%">{{value}}</td>
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
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        `
    })
})
