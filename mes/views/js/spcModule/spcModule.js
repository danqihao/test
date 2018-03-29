$(function () {
    Vue.filter("times", (val) =>{   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面  
        if(val !== ''){
            return moment(val).format('YYYY-MM-DD HH:mm:ss')
         }
    });  
    //页面布局
    var wrapper = new Vue({
        el: '#mainRightContent',
        data(){
            return {
                options: [ //绘图种类
                    {
                    value: '计量图',
                    label: '计量图',
                        children: [
                        {
                            value: '-X-R图',
                            label: '-X-R图',
                        },
                        {
                            value: '~X-R图',
                            label: '~X-R图',
                        },
                        {
                            value: 'L-S图',
                            label: 'L-S图',
                        },
                        {
                            value: 'X-Rs图',
                            label: 'X-Rs图',
                        }
                        ]
                    }, {
                        value: '计数图',
                        label: '计数图',
                        children: [
                        {
                            value: 'Pn图',
                            label: 'Pn图',
                        },
                        {
                            value: 'P图',
                            label: 'P图',
                        },
                        {
                            value: 'C图',
                            label: 'C图',
                        },
                        {
                            value: 'U图',
                            label: 'U图',
                        }
                        ]
                    }
                ],
                selectedOptions: ["计量图","-X-R图"],
                options2: [
                    {
                        value: '1',
                        label: '1'
                    }, {
                        value: '2',
                        label: '2'
                    }, {
                        value: '3',
                        label: '3'
                    }, {
                        value: '4',
                        label: '4'
                    }, {
                        value: '5',
                        label: '5'
                    }, {
                        value: '自定义',
                        label: '自定义'
                    }
                    
                ],
                value: '',
                options3: [
                    {
                        value: '简单随机抽样',
                        label: '简单随机抽样'
                    }
                ],
                tbodyData: [],//生成的数据

                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1 ,  //当前页
              
                chart:{
                    quality_spc_chart_type:"计量图", //图表类型
                    quality_spc_chart_name:"-X-R图",//图表名称
                },
                SPCDataCollection:{
                    quality_spc_chart_cpk:"", //cpk值
                    quality_spc_left_border:"",//  规格范围(左边) ,  
                    quality_spc_right_border:"",// 规格范围(右边) 
                    quality_spc_creator: USERNAME || "张三",//创建人
                    quality_spc_creator_id:USERID || "e0814095529e4662afcff54b5923c073" ,//创建人id
                    quality_spc_character_start_timeStr :"",//受控质量特性起始时间
                    quality_spc_character_end_timeStr :"",//受控质量特性结束时间
                },
                SPCCharater:[
                    {
                        quality_spc_device_paramter:"",//设备参数
                        quality_spc_device_paramter_id:"",//设备参数id
                        quality_spc_device_id:"",//设备id
                        quality_spc_report_type:"",//报告种类
                        quality_spc_test_project:"",//检验项目
                        quality_spc_test_project_id:"",//检验项目id
                        quality_spc_test_type:"",//检验类型
                        quality_spc_test_type_id:"",//检验类型id
                        quality_spc_test_standard:"",//检验标准
                        quality_spc_quality_type:"",//品质类型
                       
                    }
                ],
                SPCSample:{
                    quality_spc_sample_size:"",//样本容量
                    quality_spc_sample_number:[],//样本数量
                    quality_spc_sample_way:"简单随机抽样",//抽样方式
                },
                sampleSizeValue:"",
                custom:true,

                ajaxData:{
                    headNum:1
                },

                //   日期
                ProductionBatchDate: "",
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                checkDataNum:"0",

                MaterielName:"",//物料名称
                MaterielId:"",//物料名称y
                MaterielProjectName:"",//物料检验项目
                MaterielProjectId:"",//物料检验项目y

                deviceName:"",//设备名称
                deviceId:"",//设备名称
                deviceParamterName:"" ,//设备参数
                deviceParamterId:"" ,//设备参数

                selectSemiProductName:"" ,//半成品名称
                selectSemiProductId:"" ,//半成品名称
                testStandard:"", //检测标准

                reportType:"IQC报告",  //报告类型
                qualityType:"",  //品质类型

                batteryId:"",//成品电池id
                batteryName:"",//成品电池
                batteryModel:"",//成品电池类型

                selectType:"设备参数"

                
            }
        },
        methods: {
            querySPCDataCollection(){
                $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: querySPCDataCollectionUrl,
                    data: {
                       type:"info",
                       headNum:1
                    },
                    beforeSend: (xml) => {
                    },
                    success: (result, status, xhr) => {
                        if (result.status === 0) {
                            this.tbodyData = result.map.spcDataMap
                            this.lines =  result.map.spcDataMap.length
                        }else{
                            this.tbodyData = []
                            this.lines = 0
                        }
                    }
                })
            },
            reMove(val){
                this.$confirm('确定删除此条消息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center:true
                }).then(() => {
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: removeSPCDataCollectionUrl,
                        data: {
                            dataId:val
                        },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            if (result.status === 0) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.querySPCDataCollection()
                            }else {
                                this.$message({
                                    message: '删除失败',
                                    type: 'success'
                                });
                            }
                        }
                    })
                })
               
            },
            handleCurrentChange(val){
                this.ajaxData.headNum = (val - 1) * 10 + 1;
                this.querySPCDataCollection()
            },
            handleChange() {
            //    this.reset()
               this.chart.quality_spc_chart_type = this.selectedOptions[0]
               this.chart.quality_spc_chart_name = this.selectedOptions[1]

               if( this.chart.quality_spc_chart_type =="计数图"){
                this.selectType = "报告种类"
               }
           
            },
          
            search(){
                if(this.chart.quality_spc_chart_type =="计量图" ){
                    if ( this.SPCDataCollection.quality_spc_chart_cpk == '') {
                        this.$message.error('请选择一个cpk值');
                        return false
                    }
                    if(this.SPCDataCollection.quality_spc_left_border == '' && this.SPCDataCollection.quality_spc_right_border == ''){
                        this.$message.error('请选择规格范围');
                        return false
                    }
                    if(this.SPCDataCollection.quality_spc_character_start_timeStr == ''){
                        this.$message.error('请选择合理时间段');
                        return false
                    }
                    if(this.SPCSample.quality_spc_sample_size == '' && this.SPCSample.quality_spc_sample_number.length == 0){
                        this.$message.error('请输入样本合理容量与数量');
                        return false
                    }
                    if(this.selectType =="设备参数"){
                        if (this.deviceName == '') {
                            this.$message.error('请选择一个设备');
                            return false
                        }
                        if(this.deviceParamterName == ''){
                            this.$message.error('请选择一个设备参数');
                            return false
                        }
                        this.SPCCharater[0]. quality_spc_device_paramter = `${this.deviceName}/${this.deviceParamterName}`
                        this.SPCCharater[0]. quality_spc_device_paramter_id = this.deviceParamterId
                        this.SPCCharater[0]. quality_spc_device_id = this.deviceId
                        this.SPCCharater[0]. quality_spc_report_type = ""
                        this.SPCCharater[0]. quality_spc_test_project = ""
                        this.SPCCharater[0]. quality_spc_test_project_id = ""
                        this.SPCCharater[0]. quality_spc_test_type = ""
                        this.SPCCharater[0]. quality_spc_test_type_id = ""
                        this.SPCCharater[0]. quality_spc_test_standard = ""
                        this.SPCCharater[0]. quality_spc_quality_type = ""
                    }else if(this.selectType =="报告种类"){
                        if(this.reportType =="IQC报告"){
                            if(this.MaterielName == ''){
                                this.$message.error('请选择检验物料');
                                return false
                            }
                            if(this.MaterielProjectName == ''){
                                this.$message.error('请选择检验项目');
                                return false
                            }
                            this.SPCCharater[0]. quality_spc_device_paramter = ""
                            this.SPCCharater[0]. quality_spc_device_paramter_id = ""
                            this.SPCCharater[0]. quality_spc_device_id = ""
                            this.SPCCharater[0]. quality_spc_report_type = this.reportType
                            this.SPCCharater[0]. quality_spc_test_project = this.MaterielName
                            this.SPCCharater[0]. quality_spc_test_project_id = this.MaterielId
                            this.SPCCharater[0]. quality_spc_test_type = this.MaterielProjectName
                            this.SPCCharater[0]. quality_spc_test_type_id = this.MaterielProjectId
                            this.SPCCharater[0]. quality_spc_test_standard = ""
                            this.SPCCharater[0]. quality_spc_quality_type = ""
                        }else if(this.reportType =="PQC报告"){
                            if(this.selectSemiProductName == ''){
                                this.$message.error('请选择检验项目');
                                return false
                            }
                            if(this.testStandard == ''){
                                this.$message.error('请选择检验标准');
                                return false
                            }
                            this.SPCCharater[0]. quality_spc_device_paramter = ""
                            this.SPCCharater[0]. quality_spc_device_paramter_id = ""
                            this.SPCCharater[0]. quality_spc_device_id = ""
                            this.SPCCharater[0]. quality_spc_report_type =  this.reportType
                            this.SPCCharater[0]. quality_spc_test_project = this.selectSemiProductName
                            this.SPCCharater[0]. quality_spc_test_project_id = this.selectSemiProductId
                            this.SPCCharater[0]. quality_spc_test_type = this.MaterielProjectName
                            this.SPCCharater[0]. quality_spc_test_type_id = this.MaterielProjectId
                            this.SPCCharater[0]. quality_spc_test_standard = this.testStandard
                            this.SPCCharater[0]. quality_spc_quality_type =   ""
                        }
                    }
               }else if(this.chart.quality_spc_chart_type =="计数图"){
                    if(this.SPCSample.quality_spc_sample_size == '' && this.SPCSample.quality_spc_sample_number.length == 0){
                        this.$message.error('请输入样本合理容量与数量');
                        return false
                    }
                    this.SPCDataCollection.quality_spc_chart_cpk = ""
                    this.SPCDataCollection.quality_spc_left_border = ""
                    this.SPCDataCollection.quality_spc_right_border = ""
                    this.SPCCharater[0]. quality_spc_device_paramter = ""
                    this.SPCCharater[0]. quality_spc_device_paramter_id = ""
                    this.SPCCharater[0]. quality_spc_device_id =""
                    this.SPCCharater[0]. quality_spc_test_type = ""
                    this.SPCCharater[0]. quality_spc_test_type_id = ""
                    this.SPCCharater[0]. quality_spc_report_type =  this.reportType
                    if(this.reportType =="IQC报告"){
                        if(this.MaterielName == ''){
                            this.$message.error('请选择检验项目');
                            return false
                        }
                        this.SPCCharater[0]. quality_spc_test_project = this.MaterielName
                        this.SPCCharater[0]. quality_spc_test_project_id = this.MaterielId
                    }else if(this.reportType =="PQC报告"){
                        if(this.selectSemiProductName == ''){
                            this.$message.error('请选择检验项目');
                            return false
                        }
                        this.SPCCharater[0]. quality_spc_test_project =  this.selectSemiProductName
                        this.SPCCharater[0]. quality_spc_test_project_id =  this.selectSemiProductId
                    }else if(this.reportType =="FQC报告"){
                        if(this.batteryName == ''){
                            this.$message.error('请选择检验项目');
                            return false
                        }
                        this.SPCCharater[0]. quality_spc_test_project = this.batteryName
                        this.SPCCharater[0]. quality_spc_test_project_id = this.batteryId
                    }
                    if(this.qualityType == ''){
                        this.$message.error('请选择品质类型');
                        return false
                    }
                    this.SPCCharater[0]. quality_spc_test_standard = ""
                    this.SPCCharater[0]. quality_spc_quality_type = this.qualityType
               }
               if(true){
                this.$confirm('确定信息无误提交?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center:true
                }).then(() => {
                    $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveSPCDataCollectionUrl,
                        data: {
                            quality_spc_chart_type: this.chart.quality_spc_chart_type,
                            quality_spc_chart_name: this.chart.quality_spc_chart_name ,//图表名称
                            quality_spc_chart_cpk: this.SPCDataCollection.quality_spc_chart_cpk, //cpk值
                            quality_spc_left_border: this.SPCDataCollection.quality_spc_left_border, //规格范围(左边)  
                            quality_spc_right_border: this.SPCDataCollection.quality_spc_right_border, //规格范围(右边) 
                            quality_spc_creator: this.SPCDataCollection.quality_spc_creator,//创建人
                            quality_spc_creator_id: this.SPCDataCollection.quality_spc_creator_id ,//创建人id
                            quality_spc_character_start_timeStr: this.SPCDataCollection.quality_spc_character_start_timeStr ,//创建人id
                            quality_spc_character_end_timeStr: this.SPCDataCollection.quality_spc_character_end_timeStr ,//创建人id
                            quality_spc_sample_size:this.SPCSample.quality_spc_sample_size,//样本容量
                            quality_spc_sample_number:this.SPCSample.quality_spc_sample_number.toString(),//样本数量
                            quality_spc_sample_way:this.SPCSample.quality_spc_sample_way,//抽样方式
                            SPCCharaters:  JSON.stringify(this.SPCCharater)
                        },
                        beforeSend: (xml) => {
                        },
                        success: (result, status, xhr) => {
                            if (result.status === 0) {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.querySPCDataCollection()
                            } else {
                                this.$message.error('提交失败，请重新尝试');
                            }
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
               }
                
               
             
                 


            },
            reset(){
                this.chart.quality_spc_chart_type = ""
                this.chart.quality_spc_chart_name = ""
                this.SPCDataCollection.quality_spc_chart_cpk = ""
                this.SPCDataCollection.quality_spc_left_border = ""
                this.SPCDataCollection.quality_spc_right_border = ""
                this.SPCDataCollection.quality_spc_character_start_timeStr = ""
                this.SPCDataCollection.quality_spc_character_end_timeStr = ""
                this.SPCSample.quality_spc_sample_size = ""
                this.SPCSample.quality_spc_sample_number = []
               

            },
            selectNumber(){
                if(this.SPCSample.quality_spc_sample_size !== "自定义"){
                    this.sampleSizeValue = Number(this.SPCSample.quality_spc_sample_size)
                }else{

                    this.custom  = false
                    this.SPCSample.quality_spc_sample_size =""
                    this.SPCSample.quality_spc_sample_number =[]
                }
            },
            customBlur(type,index){
                if(type =="quality_spc_sample_size"){
                    var re = /^[0-9]+$/ ;
                    if(re.test(this.SPCSample.quality_spc_sample_size)){
                        this.sampleSizeValue = Number(this.SPCSample.quality_spc_sample_size)
                    }else{
                        this.$message.error({
                            message: '请输入一个整数',
                          })
                        this.SPCSample.quality_spc_sample_size =""
                    }
                }else if(type =="Cpk"){
                    if(!isNaN(this.SPCDataCollection.quality_spc_chart_cpk)){
                       
                    }else{
                        this.$message.error({
                            message: '请输入一个数值',
                          })
                        this.SPCDataCollection.quality_spc_chart_cpk =""
                    }
                }
                else if(type =="quality_spc_sample_number"){
                    if(!isNaN(this.SPCSample.quality_spc_sample_number[index-1])){
                       
                    }else{
                        this.SPCSample.quality_spc_sample_number[index-1] =""
                        this.$message.error({
                            message: '请输入一个数值',
                          })
                    }
                }
                else if(type =="quality_spc_left_border"){
                    if(!isNaN(this.SPCDataCollection.quality_spc_left_border)){
                       
                    }else{
                        this.SPCDataCollection.quality_spc_left_border =""
                        this.$message.error({
                            message: '请输入一个数值',
                          })
                    }
                }
                else if(type =="quality_spc_right_border"){
                    if(!isNaN(this.SPCDataCollection.quality_spc_right_border)){
                       
                    }else{
                        this.SPCDataCollection.quality_spc_right_border =""
                        this.$message.error({
                            message: '请输入一个数值',
                          })
                    }
                }
               
               
            },
            upLoad(){
                bus.$emit('upLoad')
            },
            selectProductionBatch(){
                bus.$emit('selectProductionBatch')
            },
            sampleReferenceValue(){
                bus.$emit('sampleReferenceValue')
            },
            seeCpkValue(){
                bus.$emit('cpkDataModel')
            },
            selectDeviceData(){
                bus.$emit('selectDeviceData')
            },
            ControlledObject(){
                bus.$emit('ControlledObject')
            },
            ControlledObjectData(){
                bus.$emit('ControlledObjectData')
            },
            dataChange(){
                var startDate , endDate
                startDate = this.ProductionBatchDate[0]
                endDate = this.ProductionBatchDate[1]
                this.SPCDataCollection.quality_spc_character_start_timeStr = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
                this.SPCDataCollection.quality_spc_character_end_timeStr = moment(endDate).format('YYYY-MM-DD HH:mm:ss')
            },
            selectSemiProduct(){
                bus.$emit('selectSemiProduct') 
            },
            checkMaterial(){
                bus.$emit('selectMateriel') 
            },
            checkDevice(){
                bus.$emit('selectDevice') 
            },
            selectProduct(){
                let promise = new Promise((resolve, reject) => {
                    selectBatterylModal(resolve)
                  })
                promise.then((resolveData) => {
                this.batteryId = resolveData.warehouse_product_id
                this.batteryName = resolveData.warehouse_product_name
                this.batteryModel = resolveData.warehouse_product_size
                })
            },
            selectMaterial(type){
                let promise = new Promise((resolve, reject) => {
                    selectMaterialModal(resolve, type)
                  })
                  promise.then((resolveData) => {
                    if (type === 'info') {  //选择物料
                     // this.materialId = resolveData.warehouse_material_id
                      this.MaterielName = resolveData.warehouse_material_name
                      this.MaterielId = resolveData.warehouse_material_id
                     // this.unit = resolveData.warehouse_material_units
                    }
                    if (type === 'record') {  //选择物料批次
                      this.materialBatch = resolveData.warehouse_material_batch
                    }
  
                  })
            },
            checkSemiProduct(){

                let promise = new Promise((resolve, reject) => {
                  selectSemiFinishModal(resolve)
                })
                promise.then((resolveData) => {
                  this.selectSemiProductId = resolveData.semi_finish_id
                  this.selectSemiProductName = resolveData.semi_finish_name
                })
            },
            Look(val){
                //window.open('../../mes/views.spcMap.html')	
               // window.open('../../spcMap.html?SPCId=' + val )	

            },
            loadExcel(){
                var form = $("<form>");//定义一个form表单
                form.attr("style", "display:none");
                form.attr("target", "");
                form.attr("method", "post");
                form.attr("action", BASE_PATH + "/downloadSPCExcel.do");
                var input1 = $("<input>");
                input1.attr("type", "hidden");
                input1.attr("name", "exportData");
                input1.attr("value", (new Date()).getMilliseconds());
                $("body").append(form);//将表单放置在web中
                form.append(input1);
                form.submit();//表单提交
            }
           
           
        },
        mounted(){
            this.querySPCDataCollection()
            bus.$on('CheckDataNum',(result)=>{
                this.checkDataNum = result
            })
            bus.$on('MaterielData',(result)=>{
                this.MaterielName = result.warehouse_material_name
                this.MaterielId = result.warehouse_material_id
            })
            bus.$on('MaterielProjectData',(result)=>{
                this.MaterielProjectName = result.qualityProjects.quality_project_name
                this.MaterielProjectId = result.qualityProjects.quality_project_id
            })
            bus.$on('deviceData',(result)=>{
                this.deviceName = result.devices_control_devices_name
                this.deviceId = result.devices_control_devices_id
            })
            bus.$on('deviceParamter',(result)=>{
                this.deviceParamterName = result.standardParameterList[0].standard_parameter_name
                this.deviceParamterId= result.standardParameterList[0].standard_parameter_id
            })
            bus.$on('selectSemiProductName',(result)=>{
                this.selectSemiProductName = result.semi_finish_name
                this.selectSemiProductId = result.semi_finish_id
            })
        },
        template: `
        <div id="mainRightContent">
            <el-card class="box-card" style="margin:0 15px 0 10px;min-height: 500px;">
                <el-card class="box-card" style="margin:0 10px;">
                    <!--绘图种类-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="3" style="font-size:15px ;font-weight:bold;" class="text-right ellipsis">绘图种类：</el-col>
                        <el-col :span="6">
                            <el-cascader :options="options" v-model="selectedOptions" @change="handleChange" size="small">
                            </el-cascader>
                        </el-col>
                    </el-row>
                    <!--受控质量特征-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="3" style="font-size:15px ;font-weight:bold;" class="text-right ellipsis">受控质量特征</el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">起始日期与时间:</el-col>
                        <el-col :span="6">
                            <el-date-picker v-model="ProductionBatchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" style="height:30px"
                            :picker-options="pickerOptions2" @change ="dataChange()"
                            >
                             </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计量图'">
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">选择报告种类:</el-col>
                        <el-col :span="6">
                            <el-select v-model="selectType" placeholder="请选择" size="small">
                                <el-option value="设备参数" size="medium">设备参数
                                </el-option>
                                <el-option value="报告种类" size="medium">报告种类
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计量图' && selectType=='设备参数'" >
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">选择设备参数：</el-col>
                        <el-col :span="6">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "checkDevice()" :value="deviceName +'/'+deviceParamterName"></el-input>
                        </el-col>
                        <!--查看设备参数-->
                        <el-col :span="8" :offset="0" v-show="selectedOptions[0] == '计量图'">
                             <!--<el-button type="primary" size="small" @click ="selectDeviceData()">点击查看</el-button>-->
                             <!-- <a class="table-link text-primary"  @click="selectDeviceData()" href="javascript:;" > 点击查看</a>-->
                           
                         </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectType=='报告种类' || selectedOptions[0] == '计数图'" >
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">品质报告种类:</el-col>
                        <el-col :span="6">
                            <el-select v-model="reportType" placeholder="请选择" size="small">
                                <el-option value="IQC报告" size="medium">IQC报告
                                </el-option>
                                <el-option value="PQC报告" size="medium">PQC报告
                                </el-option>
                                <el-option value="FQC报告" size="medium" v-show="selectedOptions[0] == '计数图'">FQC报告
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="reportType=='IQC报告' && selectType=='报告种类'" >
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">品质检验物料:</el-col>
                        <el-col :span="6" v-show="selectedOptions[0] == '计量图'">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "checkMaterial()" :value="MaterielName +'/'+MaterielProjectName"></el-input>
                        </el-col>
                        <el-col :span="6" v-show="selectedOptions[0] == '计数图'">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "selectMaterial('info')" :value="MaterielName"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="reportType=='FQC报告' && selectType=='报告种类'" >
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">选择成品检验项目:</el-col>
                        <el-col :span="6">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "selectProduct()" :value="batteryName"></el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="reportType=='PQC报告' && selectType=='报告种类'" >
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">选择检验半成品:</el-col>
                        <el-col :span="6"  v-show="selectedOptions[0] == '计量图'">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "selectSemiProduct()" :value="selectSemiProductName+'/'+MaterielProjectName"" ></el-input>
                        </el-col>
                        <el-col :span="6"  v-show="selectedOptions[0] == '计数图'">
                             <el-input  placeholder="请选择" size="small" style="max-width:200px"  @focus= "checkSemiProduct()" :value="selectSemiProductName" ></el-input>
                        </el-col>
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis"  v-show="selectedOptions[0] == '计量图'">选择检验标准:</el-col>
                        <el-col :span="6" v-show="selectedOptions[0] == '计量图'">
                            <el-select  placeholder="请选择" size="small" v-model="testStandard">
                                <el-option value="标准实测" size="medium">标准实测
                                </el-option>
                                <el-option value="单面实测" size="medium">单面实测
                                </el-option>
                                <el-option value="双面实测" size="medium">双面实测
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <!--选择品质参数-->
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计数图'">

                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis">选择品质类型：</el-col>
                        <el-col :span="5">
                            <el-select  placeholder="请选择" size="small" v-model="qualityType">
                                <el-option value="不良数" size="medium">不良数
                                </el-option>
                                <el-option value="不良率" size="medium">不良率
                                </el-option>
                            </el-select>
                        </el-col>

                    </el-row>
                    <!--选择品质数据-->
                    <!--<el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计数图'">
                        <el-col :span="3" style="font-size:14px" class="text-right ellipsis" >选择品质数据：</el-col>
                        <el-col :span="3">
                            <el-button type="primary" size="small" @click ="ControlledObject()">点击选择</el-button>
                        </el-col>
                        <el-col :span="3">
                           <span>已选择{{checkDataNum}}条数据</span>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" size="small" @click ="ControlledObjectData()">点击查看</el-button>
                        </el-col>
                    </el-row>-->

                    <!--录入数据-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="3" style="font-size:15px ;font-weight:bold;" class="text-right ellipsis">手动录入数据：</el-col>
                        <el-col :span="21">
                            <el-button type="primary" size="small" plain @click = "loadExcel()">下载Excel模板</el-button>
                            <el-button type="primary" size="small" plain @click= "upLoad()"> 上传Excel模板</el-button>
                        </el-col>
                    </el-row>
                    <!--样本控制-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="3"  style="font-size:15px ;font-weight:bold;"  class="text-right ellipsis">样本控制：</el-col>
                        <el-col :span="6">
                            <el-button type="primary" size="small" plain @click="sampleReferenceValue()">查看样本参考值</el-button>
                        </el-col>
                    </el-row>
                     <!--样本容量-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">

                        <el-col :span="3" class="text-right ellipsis">样本容量：</el-col>
                        <el-col :span="5"  v-if = "custom == true">
                            <el-select v-model="SPCSample.quality_spc_sample_size" placeholder="请选择" size="small"  @change = "selectNumber()">
                                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5" v-if = "custom == false">
                            <el-input  placeholder="请输入" size="small" style="max-width:200px" v-model="SPCSample.quality_spc_sample_size" @blur= "customBlur('quality_spc_sample_size')"></el-input>
                        </el-col>

                        <el-col :span="3" class="text-right ellipsis" v-show="selectedOptions[1] != 'P图' && selectedOptions[1] != 'U图'">样本数量：</el-col>
                        <el-col :span="5" v-show="selectedOptions[1] != 'P图' && selectedOptions[1] != 'U图'">
                            <el-input  placeholder="请输入样本数量" size="small" style="max-width:200px" v-model="SPCSample.quality_spc_sample_number[0]" @blur= "customBlur('quality_spc_sample_number')"></el-input>
                        </el-col>

                        <el-col :span="3" class="text-right ellipsis">抽样方式：</el-col>
                        <el-col :span="5">
                            <el-select v-model="SPCSample.quality_spc_sample_way" placeholder="请选择" size="small">
                                <el-option v-for="item in options3" :key="item.value" :label="item.label":value="item.value" size="medium">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-container  v-show="selectedOptions[1] == 'P图' || selectedOptions[1] == 'U图'">
                        <el-main >
                            <el-col :span="8" class="text-right ellipsis" v-for = "index in sampleSizeValue" >
                                <el-row style="height:40px;line-height:40px">
                                    <el-col :span="8" class="text-right ellipsis">样本数量{{index}}：</el-col>
                                    <el-col :span="14" :offset="2">
                                        <el-input  placeholder="请输入样本数量" size="small" style="max-width:200px" v-model="SPCSample.quality_spc_sample_number[index-1]" @blur= "customBlur('quality_spc_sample_number',index)"></el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-main>
                    </el-container>

                   
                    <!--选择Cpk值-->
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计量图'" >
                        <el-col :span="3" class="text-right ellipsis"  style="font-size:15px ;font-weight:bold;" >输入Cpk值：</el-col>
                        <el-col :span="5">
                            <el-input  placeholder="请输入" size="small" style="" v-model="SPCDataCollection.quality_spc_chart_cpk" @blur= "customBlur('Cpk')"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" size="small" plain @click="seeCpkValue()">查看Cpk值</el-button>
                        </el-col>
                    </el-row>
                    <!--输入规格范围-->
                    <el-row :gutter="20" style="height:40px;line-height:40px" v-show="selectedOptions[0] == '计量图'" >
                        <el-col :span="3" class="text-right ellipsis"  style="font-size:15px ;font-weight:bold;" >输入规格范围:</el-col>
                        <el-col :span="2">
                            <el-input   size="small" style=""  @blur= "customBlur('quality_spc_left_border')"  v-model="SPCDataCollection.quality_spc_left_border"></el-input>
                        </el-col>
                        <el-col :span="0.5">
                            <span>±</span>
                        </el-col>
                        <el-col :span="2">
                            <el-input  size="small" style=""  @blur= "customBlur('quality_spc_right_border')"  v-model="SPCDataCollection.quality_spc_right_border"></el-input>
                        </el-col>
                       
                    </el-row>
                    <!--生成-->
                    <el-row :gutter="20" style="height:40px;line-height:40px">
                        <el-col :span="24" class="text-center">
                            <el-button type="primary" size="medium" @click="search()">生成</el-button>
                            <el-button size="medium"  @click="reset()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" style="margin:0 15px 0 10px;min-height: 500px;">
                    <div class="panel panel-default" >
                        <div class="panel-heading panel-heading-table">
                            <div class="row">
                            <div class="col-xs-12">
                                <h5 class="panel-title" >spc数据明细</h5>
                            </div>
                            </div>
                        </div>
                        <div class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style="width: 6%;">序号</th>
                                    <th style="width: 10%;">检测项目</th>
                                    <th style="width: 15%;">图类</th>
                                    <th style="width: 8%;">样本容量</th>
                                   <!-- <th style="width: 15%;">生产批次</th>
                                    <th style="width: 15%;">设备编号</th>
                                    <th style="width: 15%;">品质参数</th> -->
                                    <th style="width: 8%;">制图人</th>
                                    <th style="width: 12%;">制图时间</th>
                                    <th style="width: 12%;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr  v-for="(value,index) in tbodyData">
                                <td>{{index+1}}</td>
                                <td v-if="value.spcCharaterDOs[0].quality_spc_test_project">{{value.spcCharaterDOs[0].quality_spc_test_project}}</td>
                                <td v-else="value.spcCharaterDOs[0].quality_spc_test_project">{{value.spcCharaterDOs[0].quality_spc_device_paramter}}</td>
                                <td>{{value.spcChartDOs[0].quality_spc_chart_type}}/{{value.spcChartDOs[0].quality_spc_chart_name}}</td>
                                <td>{{value.spcSampleDOs[0].quality_spc_sample_size}}</td>
                                <!-- <td v-if="value.spcChartDOs[0].quality_spc_chart_type =='计量图'">{{value.spcCharaterDOs[0].quality_spc_character_value}}</td>
                                <td v-if="value.spcChartDOs[0].quality_spc_chart_type !=='计量图'">/</td>
                                <td v-if="value.spcChartDOs[0].quality_spc_chart_type =='计量图'">{{value.spcCharaterDOs[1].quality_spc_character_value}}</td>
                                <td v-if="value.spcChartDOs[0].quality_spc_chart_type !=='计量图'">/</td>
                                <td v-if="value.spcChartDOs[0].quality_spc_chart_type =='计数图'">{{value.spcCharaterDOs[0].quality_spc_character_value}}</td>
                                <td v-if="value.spcChartDOs[0].quality_spc_chart_type !=='计数图'">/</td> -->
                                <td>{{value.quality_spc_creator}}</td>
                                <td>{{value.quality_spc_creator_time | times}}</td>
                                <td class="table-input-td">
                                    <a class="table-link " :href="'./spcMap.html?SPCId='+ value.quality_spc_data_collection_id" target="_blank" @click="Look(value.quality_spc_data_collection_id)"><i class="fa fa-tasks fa-fw"></i>查看spc图</a>
                                    <a class="table-link " href="javascript:;" @click="reMove(value.quality_spc_data_collection_id)">	<i class="fa fa-trash-o fa-fw"></i>删除</a>
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
                </el-card>
            </el-card>
           
        </div>
        `
    })
})
