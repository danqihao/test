const bus = new Vue()
$(function () {
  /**
  * @description    设定生产批次
  */
  var selectProductionBatchVM = new Vue({
      el: '#selectProductionBatch',
      data() {
          return {
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
              ajaxData:{
                startTime:"",
                endTiem:"",
              }
          }
      },
      methods: {
        dataChange(){
          var startDate , endDate
          startDate = this.ProductionBatchDate[0]
          endDate = this.ProductionBatchDate[1]
          this.ajaxData.startTime = moment(startDate).format('YYYY-MM-DD HH:mm:ss')
          this.ajaxData.endTime = moment(endDate).format('YYYY-MM-DD HH:mm:ss')
          console.log(this.ajaxData.startTime)
          console.log(this.ajaxData.endTime)
        }
      },
      mounted(){
          const selectProductionBatch = document.getElementById('selectProductionBatch')   //模态框
         
          bus.$on('selectProductionBatch', () => {
            $(selectProductionBatch).modal({
              keyboard: false,
              backdrop: 'static'
            })
            $(selectProductionBatch).modal('show')
            // 模态框关闭的时候检查是否还有模态框
          })
      },
      created() {

      },
      template: `
      <div class="modal fade" id="selectProductionBatch">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">设定生产批次</h4>
              </div>
              <div class="modal-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-12 text-right">
                                <form class="form-inline pull-right" onsubmit="return false;">
                                    <div class="input-group input-group-sm ">
                                        <el-date-picker v-model="ProductionBatchDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" style="height:30px"
                                         :picker-options="pickerOptions2" @change ="dataChange()"
                                        >
                                        </el-date-picker>

                                        <div class="input-group-btn">
                                          <a href="javascript:;" class="btn btn-primary btn-sm"  @click ="dataChange()" >
                                            <i class="fa fa-search"></i>
                                          </a>
                                        </div>
                                    </div>
                                      <div class="input-group input-group-sm">
                                        <input class="form-control" type="text"  placeholder="输入关键字" maxlength="25">
                                        <div class="input-group-btn">
                                          <a href="javascript:;" class="btn btn-primary btn-sm">
                                            <i class="fa fa-search"></i>
                                          </a>
                                        </div>
                                      </div>
                                </form>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 12%;">序号</th>
                                  <th style="width: 25%;">生产日期</th>
                                  <th style="width: 25%;">生产编号</th>
                                  <th style="width: 25%;">生产班次</th>
                                  <th style="width: 12%;">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>

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

  /**
  * @description      设备参数
  */
  var selectDevice = new Vue({
    el: '#selectDevice',
    data() {
      return {
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
        selectedOptions: [],
        selectedOptions2: []
      }
    },
    methods: {
      getCheckedKeys(){
        console.log(this.$refs.tree.getCheckedKeys());
      }
    },
    mounted() {
      // const modal = document.getElementById('selectDevice')   //模态框
      // $(modal).modal({
      //     backdrop: 'static', // 黑色遮罩不可点击
      //     keyboard: false,  // esc按键不可关闭模态框
      //     show: true     //显示
      // })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="selectDevice">
        <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">设备参数</h4>
              </div>
              <div class="modal-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-12 text-right">
                                <el-button type="primary" size="small" >手动采集</el-button>
                            </div>
                          </div>
                        </div>
                        <div class="panel-body-table table-height-10">
                         <!-- <el-tree
                            :data="data2"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="defaultProps">
                          </el-tree> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="row">
                  <div class="col-xs-12 text-center">
                    <el-button type="primary" size="small"  @click ="getCheckedKeys()">确认提交</el-button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      `
  })


  /**
  * @description     设备数据
  */
  var selectDeviceDataVM = new Vue({
    el: '#selectDeviceData',
    data() {
      return {
        dataList:""
      }
    },
    methods: {

    },
    mounted() {
      const cpkDataModel = document.getElementById('selectDeviceData')   //模态框
      bus.$on('selectDeviceData', () => {
        $(selectDeviceData).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(selectDeviceData).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="selectDeviceData">
        <div class="modal-dialog modal-lg">
            <div class="modal-content" >
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
                            <div class="col-xs-12 ">
                               <h4 class="modal-title">设备数据</h4>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 8%;">序号</th>
                                  <th style="width: 15%;">参数名</th>
                                  <th style="width: 15%;">参数值</th>
                                  <th style="width: 15%;">参数单位</th>
                                  <th style="width: 15%;">采集时间</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                
                                </tr>
                                <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>


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

  /**
  * @description   样本参考值
  */

  var querySample = new Vue({
    el: '#sampleReferenceValue',
    data() {
      return {
       
      }
    },
    methods: {

    },
    mounted() {
      const sampleReferenceValue = document.getElementById('sampleReferenceValue')   //模态框
      bus.$on('sampleReferenceValue', () => {
        $(sampleReferenceValue).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(sampleReferenceValue).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="sampleReferenceValue">
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
                               <h4>样本参考值</h4>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 25%;">控制图名称</th>
                                  <th style="width: 25%;">样本k数</th>
                                  <th style="width: 25%;">样本容量n</th>
                                  <th style="width: 25%;">备注</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>-X-R图 ~X-R图 L-S图</td>
                                  <td>一般K=20~25</td>
                                  <td>一般3~6</td>
                                  <td>X图样本容量常取3~5</td>
                                </tr>
                                <tr>
                                  <td>X-Rs图</td>
                                  <td>K=20~30</td>
                                  <td>1</td>
                                  <td>X图样本容量常取3~5</td>
                                </tr>
                                <tr>
                                  <td>Pn图 P图</td>
                                  <td rowspan ="2">一般K=20~25</td>
                                  <td>1/P~5/P</td>
                                  <td rowspan ="2"></td>
                                </tr>
                                <tr>
                                  <td>C图 U图</td>
                                  <td>尽可能使样本缺陷数C= 1~5</td>
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

  /**
 * @description   Cpk值
 */

  var cpkDataModelVM = new Vue({
    el: '#cpkDataModel',
    data() {
      return {
        value6: '',
      }
    },
    methods: {

    },
    mounted() {
      const cpkDataModel = document.getElementById('cpkDataModel')   //模态框
      bus.$on('cpkDataModel', () => {
        $(cpkDataModel).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(cpkDataModel).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="cpkDataModel">
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
                              <h4>Cpk值</h4>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10">
                            <table class="table  table-bordered table-hover">

                              <tbody class="text-center">
                                <tr>
                                  <td> A+≥1.67无缺点考虑降低成本</td>
                                </tr>
                                <tr>
                                  <td> A：1.33≤Cpk<1.67状态良好维持现状</td>
                                </tr>
                                <tr>
                                  <td> B：1.0≤Cpk<1.33改进为A级</td>
                                </tr>
                                <tr>
                                  <td> C：0.67≤Cpk<1.0制程不良较多,必须提升其能力</td>
                                </tr>
                                <tr>
                                  <td> D：Cpk<0.67制程能力较差，考虑整改设计制程</td>
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

  /**
 * @description   选择受控对象
 */
  var selectControlledObjectVM = new Vue({
    el: '#selectControlledObject',
    data() {
        return {
            value6: '',
            iqcAjaxData:{
              materialId:"9baa19b6bde945c7aa9c0c1b879c9d84",
              materialBatch:"",
              startDate:"2018-03-18 00:00:00",
              endDate:"2018-03-18 23:59:59"
            },
            fqcAjaxData:{
              productModel:"51e3bc69424142cd8bdb58ffbff9dd14",
              ProductBatch:"",
              startDate:"2018-03-18 00:00:00",
              endDate:"2018-03-18 23:59:59"
            },
            pqcAjaxData:{
              type:"info",
              semiFinishId:"ca131b5583554ce19c58b95dab5c8475",
              productBatch:"",
              startDate:"2018-03-18 00:00:00",
              endDate:"2018-03-18 23:59:59"
            },
            iqcTbodyData: [],  //渲染表格的数据
            fqcTbodyData: [],  //渲染表格的数据
            pqcTbodyData: [],  //渲染表格的数据
            lines: 0,     //总条数
            pagesize: 10,   //页码
            currenPage: 1   ,//当前页

            iqcCheckData:[],
            fqcCheckData:[],
            pqcCheckData:[],

            iqcCheckNames:[],
            fqcCheckNames:[],
            pqcCheckNames:[],

            iqcCheckDataNum:"0",
            fqcCheckDataNum:"0",
            pqcCheckDataNum:"0",
            CheckDataNum:"0",

            reportFormsType:"IQC报表"

        }
    },
    methods: {
      ManualEntry(){
        bus.$emit('ManuallyEntryData')
      },
      queryQualityIqcData(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryIQCReportUrl,
          data: this.iqcAjaxData,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.iqcTbodyData = result.map.iqcReports
              this.lines = result.map.lines

            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          },

        })
      },
      queryQualityFqcData(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url:queryFQCReportFormsUrl,
          data: this.fqcAjaxData,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.fqcTbodyData = result.map.iqcReports
              this.lines = result.map.lines

            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          },

        })
      },
      queryQualityPqcData(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryPQCReportRecordUrl,
          data: this.pqcAjaxData,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.pqcTbodyData = result.map.iqcReports
              this.lines = result.map.lines

            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          },

        })
      },
      handleCurrentChange(){
          if(this.reportFormsType =="IQC报表"){
            this.iqcAjaxData.headNum = (val - 1) * 10 + 1;
            this.queryQualityIqcData()
          }else if(this.reportFormsType =="FQC报表"){
            this.fqcAjaxData.headNum = (val - 1) * 10 + 1;
            this.queryQualityFqcData()
          }else if(this.reportFormsType =="PQC报表"){
            this.pqcAjaxData.headNum = (val - 1) * 10 + 1;
            this.queryQualityPqcData()
          }
      },
      save(){
        this.$confirm('确定提交选择数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center:true
          }).then(() => {
            const selectControlledObject = document.getElementById('selectControlledObject')   //模态框
            $(selectControlledObject).modal('hide')
            bus.$emit('iqcCheckData',[this.iqcCheckData,this.fqcCheckData,this.pqcCheckData])
            this.iqcCheckDataNum = this.iqcCheckData.length
            this.fqcCheckDataNum = this.fqcCheckData.length
            this.pqcCheckDataNum = this.pqcCheckData.length
            this.CheckDataNum = Number(this.iqcCheckDataNum)+ Number(this.fqcCheckDataNum)+ Number(this.pqcCheckDataNum)
            bus.$emit('CheckDataNum',this.CheckDataNum)
          })
      },
      choice(value, index){
        if(this.reportFormsType =="IQC报表"){
          if (traverseListPush2(this.iqcCheckNames, value.quality_iqc_report_id)) { //已经选择
            traverseListDelete(this.iqcCheckNames,value.quality_iqc_report_id);
            for(let i=0;i<this.iqcCheckData.length;i++){
              if(this.iqcCheckData[i].quality_iqc_report_id == value.quality_iqc_report_id){
              this.iqcCheckData.splice(i,1)
              }
            }
          
          } else {
            traverseListPush(this.iqcCheckNames,value.quality_iqc_report_id)//将功能id放入功能id集合
            this.iqcCheckData.push(value) //存储已选择数据
          }
        }else if(this.reportFormsType =="FQC报表"){
          if (traverseListPush2(this.fqcCheckNames, value.quality_fqc_report_id)) { //已经选择
            traverseListDelete(this.fqcCheckNames,value.quality_fqc_report_id);
            for(let i=0;i<this.fqcCheckData.length;i++){
              if(this.fqcCheckData[i].quality_fqc_report_id == value.quality_fqc_report_id){
              this.fqcCheckData.splice(i,1)
              }
            }
          
          } else {
            traverseListPush(this.fqcCheckNames,value.quality_fqc_report_id)//将功能id放入功能id集合
            this.fqcCheckData.push(value) //存储已选择数据
          }
        }else if(this.reportFormsType =="PQC报表"){
          if (traverseListPush2(this.pqcCheckNames, value.quality_pqc_report_id)) { //已经选择
            traverseListDelete(this.pqcCheckNames,value.quality_pqc_report_id);
            for(let i=0;i<this.pqcCheckData.length;i++){
              if(this.pqcCheckData[i].quality_pqc_report_id == value.quality_pqc_report_id){
              this.pqcCheckData.splice(i,1)
              }
            }
          
          } else {
            traverseListPush(this.pqcCheckNames,value.quality_pqc_report_id)//将功能id放入功能id集合
            this.pqcCheckData.push(value) //存储已选择数据
          }
        }
       
      },
      selectChange(){
        if(this.reportFormsType =="IQC报表"){
          this.queryQualityIqcData()
        }else if(this.reportFormsType =="FQC报表"){
          this.queryQualityFqcData()
        }else if(this.reportFormsType =="PQC报表"){
          this.queryQualityPqcData()
        }
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
    mounted(){
      const selectControlledObject = document.getElementById('selectControlledObject')   //模态框
      bus.$on('ControlledObject', () => {
        $(selectControlledObject).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(selectControlledObject).modal('show')
        this.queryQualityIqcData()
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {
     
    },
    template: `
    <div class="modal fade" id="selectControlledObject">
      <div class="modal-dialog modal-lg">
          <div class="modal-content" >
            <div class="modal-header">
              <button class="close" data-dismiss="modal">
                <span>
                  <i class="fa fa-close"></i>
                </span>
              </button>
              <h4 class="modal-title">受控对象</h4>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                        <div class="col-xs-8">
                          <form class="form-inline pull-left">
                            <h4 style="display:inline-block">选择报表类型:</h4>
                            <select class="form-control input-sm" style="margin-right:20px"  v-model="reportFormsType" @change="selectChange">
                                    <option value="IQC报表" selected="selected">IQC报表</option>
                                    <option value="FQC报表">FPC报表</option>
                                    <option value="PQC报表">PQC报表</option>
                            </select>
                            <h4 style="display:inline-block">选择品质种类:</h4>
                            <select class="form-control input-sm">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                            </select>
                          </form>
                        </div>
                          <div class="col-xs-4 pull-right">
                              <form class="form-inline pull-right" onsubmit="return false;">
                                    <div class="input-group input-group-sm">
                                      <input class="form-control" type="text"  placeholder="输入关键字" maxlength="25">
                                      <div class="input-group-btn">
                                        <a href="javascript:;" class="btn btn-primary btn-sm">
                                          <i class="fa fa-search"></i>
                                        </a>
                                      </div>
                                    </div>
                              </form>
                          </div>
                        </div>
                      </div>
                      <div
                        class="panel-body-table table-height-10">
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='IQC报表'">
                            <thead>
                              <tr>
                                <th style="width: 6%;">序号</th>
                                <th style="width: 12%;">报告名称</th>
                                <th style="width: 12%;">物料名称</th>
                                <th style="width: 12%;">批次</th>
                                <th style="width: 12%;">规格</th>
                                <th style="width: 12%;">型号</th>
                                <th style="width: 12%;">数量</th>
                                <th style="width: 12%;">单位</th>
                                <th style="width: 12%;">检验结果</th>
                                <th style="width: 12%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr  v-for="(value, index) in iqcTbodyData" :key="index" @click="choice(value, index)">
                                <td v-text="index + 1" >
                                </td>
                                <td> {{value.quality_iqc_report_name }}</td>
                                <td>{{value.material.warehouse_material_name }}</td>
                                <td>{{value.warehouse_material_batch }}</td>
                                <td>{{value.material.warehouse_material_standard }}</td>
                                <td>{{value.material.warehouse_material_model }}</td>
                                <td>{{value.warehouse_material_number }}</td>
                                <td>{{value.material.warehouse_material_units }}</td>
                                <td>{{value.quality_iqc_comprehensive_result === '0' ? '合格' : '不合格'}}</td>
                                <td class="table-input-td">
                                  <label class="checkbox-inline">
                                      <input type="checkbox" v-model="iqcCheckNames" :value="value.quality_iqc_report_id"> 
                                  </label>
                                </td>
                              </tr>
                              <tr v-show="!iqcTbodyData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

                            </tbody>
                          </table>
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='FQC报表'">
                            <thead>
                              <tr>
                                <th style="width: 6%;">序号</th>
                                <th style="width: 12%;">报告名称</th>
                                <th style="width: 12%;">报告时间</th>
                                <th style="width: 12%;">生产批次</th>
                                <th style="width: 12%;">检查数量</th>
                                <th style="width: 12%;">良品数</th>
                                <th style="width: 12%;">良品率</th>
                                <th style="width: 12%;">检验结果</th>
                                <th style="width: 12%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr  v-for="(value, index) in fqcTbodyData" :key="index" @click="choice(value, index)">
                                <td v-text="index + 1" >
                                </td>
                                <td> {{value.quality_fqc_report_name }}</td>
                                <td>{{value.quality_fqc_finish_date  | times }}</td>
                                <td>{{value.warehouse_product_batch }}</td>
                                <td>{{value.warehouse_product_inspection_number }}</td>
                                <td>{{value.goodNum}}</td>
                                <td>{{value.goodYield }}</td>
                                <td>{{value.quality_fqc_comprehensive_result === '0' ? '合格':'不合格'}}</td>
                                <td class="table-input-td">
                                  <label class="checkbox-inline">
                                      <input type="checkbox" v-model="fqcCheckNames" :value="value.quality_fqc_report_id"> 
                                  </label>
                                </td>
                              </tr>
                              <tr v-show="!fqcTbodyData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

                            </tbody>
                          </table>
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='PQC报表'">
                            <thead>
                              <tr>
                                <th style="width: 6%;">序号</th>
                                <th style="width: 12%;">报告名称</th>
                                <th style="width: 12%;">完成时间</th>
                                <th style="width: 12%;">半成品</th>
                                <th style="width: 12%;">生产批次</th>
                                <th style="width: 12%;">检验结果</th>
                                <th style="width: 12%;">检查数量</th>
                                <th style="width: 12%;">良品数</th>
                                <th style="width: 12%;">良品率</th>
                                <th style="width: 12%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr  v-for="(value, index) in pqcTbodyData" :key="index" @click="choice(value, index)">
                                <td v-text="index + 1" >
                                </td>
                                <td> {{value.quality_pqc_report_name }}</td>
                                <td>{{value.quality_pqc_accomplish_date  | times }}</td>
                                <td>{{value.semiFinishName }}</td>
                                <td>{{value.quality_pqc_product_batch }}</td>
                                <td>{{value.quality_pqc_comprehensive_result === '0' ? '合格':'不合格'}}</td>
                                <td>{{value.semi_finish_number }}</td>
                                <td>{{value.semi_finish_good_number}}</td>
                                <td>{{value.semi_finish_good_rate }}</td>
                               
                                <td class="table-input-td">
                                  <label class="checkbox-inline">
                                      <input type="checkbox" v-model="pqcCheckNames" :value="value.quality_pqc_report_id"> 
                                  </label>
                                </td>
                              </tr>
                              <tr v-show="!pqcTbodyData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

                            </tbody>
                          </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                      <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total=lines></el-pagination>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
            <div class="row">
              <div class="col-xs-12 text-center">
                <button
                  class="btn btn-primary"
                  @click ="save()"
                  >
                  提交
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
        </div>
    </div>
    `
  })
  /**
 * @description   已经选择的选择受控对象
 */
  var ControlledObjectData = new Vue({
    el: '#ControlledObjectData',
    data() {
        return {
            iqcCheckData:[],
            fqcCheckData:[],
            pqcCheckData:[],
            reportFormsType:"IQC报表"
        }
    },
    methods: {
      selectChange(){
        if(this.reportFormsType =="IQC报表"){
          reportFormsType="IQC报表"
        }else if(this.reportFormsType =="FQC报表"){
          reportFormsType="FQC报表"
        }else if(this.reportFormsType =="PQC报表"){
          reportFormsType="PQC报表"
        }
      }
     

    },
    mounted(){
     
      const ControlledObjectData = document.getElementById('ControlledObjectData')   //模态框
      bus.$on('ControlledObjectData', () => {
        $(ControlledObjectData).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(ControlledObjectData).modal('show')
       
        // 模态框关闭的时候检查是否还有模态框
      })
      bus.$on('iqcCheckData',(result)=>{
        this.iqcCheckData = result[0]
        this.fqcCheckData = result[1]
        this.pqcCheckData = result[2]
      })
     
     
    },
    created() {
     
    },
    template: `
    <div class="modal fade" id="ControlledObjectData">
      <div class="modal-dialog modal-lg">
          <div class="modal-content" >
            <div class="modal-header">
              <button class="close" data-dismiss="modal">
                <span>
                  <i class="fa fa-close"></i>
                </span>
              </button>
              <h4 class="modal-title">受控对象</h4>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                        <div class="col-xs-8">
                          <form class="form-inline pull-left">
                            <h4 style="display:inline-block">选择报表类型:</h4>
                            <select class="form-control input-sm" style="margin-right:20px"  v-model="reportFormsType" @change="selectChange">
                                    <option value="IQC报表" selected="selected">IQC报表</option>
                                    <option value="FQC报表">FPC报表</option>
                                    <option value="PQC报表">PQC报表</option>
                            </select>
                            <h4 style="display:inline-block">选择品质种类:</h4>
                            <select class="form-control input-sm">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                            </select>
                          </form>
                        </div>
                          <div class="col-xs-4 pull-right">
                             
                          </div>
                        </div>
                      </div>
                      <div
                        class="panel-body-table table-height-10">
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='IQC报表'">
                            <thead>
                              <tr>
                                <th style="width: 6%;">序号</th>
                                <th style="width: 12%;">报告名称</th>
                                <th style="width: 12%;">物料名称</th>
                                <th style="width: 12%;">批次</th>
                                <th style="width: 12%;">规格</th>
                                <th style="width: 12%;">型号</th>
                                <th style="width: 12%;">数量</th>
                                <th style="width: 12%;">单位</th>
                                <th style="width: 12%;">检验结果</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr  v-for="(value, index) in iqcCheckData" :key="index" >
                                <td v-text="index + 1" >
                                </td>
                                <td> {{value.quality_iqc_report_name }}</td>
                                <td>{{value.material.warehouse_material_name }}</td>
                                <td>{{value.warehouse_material_batch }}</td>
                                <td>{{value.material.warehouse_material_standard }}</td>
                                <td>{{value.material.warehouse_material_model }}</td>
                                <td>{{value.warehouse_material_number }}</td>
                                <td>{{value.material.warehouse_material_units }}</td>
                                <td>{{value.quality_iqc_comprehensive_result === '0' ? '合格' : '不合格'}}</td>
                              </tr>
                              <tr v-show="!iqcCheckData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

                            </tbody>
                          </table>
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='FQC报表'">
                              <thead>
                                <tr>
                                  <th style="width: 6%;">序号</th>
                                  <th style="width: 12%;">报告名称</th>
                                  <th style="width: 12%;">报告时间</th>
                                  <th style="width: 12%;">生产批次</th>
                                  <th style="width: 12%;">检查数量</th>
                                  <th style="width: 12%;">良品数</th>
                                  <th style="width: 12%;">良品率</th>
                                  <th style="width: 12%;">检验结果</th>
                                  <th style="width: 12%;">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr  v-for="(value, index) in fqcCheckData" :key="index">
                                  <td v-text="index + 1" >
                                  </td>
                                  <td> {{value.quality_fqc_report_name }}</td>
                                  <td>{{value.quality_fqc_finish_date  | times }}</td>
                                  <td>{{value.warehouse_product_batch }}</td>
                                  <td>{{value.warehouse_product_inspection_number }}</td>
                                  <td>{{value.goodNum}}</td>
                                  <td>{{value.goodYield }}</td>
                                  <td>{{value.quality_fqc_comprehensive_result === '0' ? '合格':'不合格'}}</td>
                                  <td class="table-input-td">
                                    <label class="checkbox-inline">
                                        <input type="checkbox" v-model="fqcCheckNames" :value="value.quality_fqc_report_id"> 
                                    </label>
                                  </td>
                                </tr>
                                <tr v-show="!fqcCheckData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

                              </tbody>
                          </table>
                          <table class="table  table-bordered table-hover"  v-show = "reportFormsType =='PQC报表'">
                            <thead>
                              <tr>
                                <th style="width: 6%;">序号</th>
                                <th style="width: 12%;">报告名称</th>
                                <th style="width: 12%;">完成时间</th>
                                <th style="width: 12%;">半成品</th>
                                <th style="width: 12%;">生产批次</th>
                                <th style="width: 12%;">检验结果</th>
                                <th style="width: 12%;">检查数量</th>
                                <th style="width: 12%;">良品数</th>
                                <th style="width: 12%;">良品率</th>
                                <th style="width: 12%;">操作</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr  v-for="(value, index) in pqcCheckData" :key="index">
                                <td v-text="index + 1" >
                                </td>
                                <td> {{value.quality_pqc_report_name }}</td>
                                <td>{{value.quality_pqc_accomplish_date  | times }}</td>
                                <td>{{value.semiFinishName }}</td>
                                <td>{{value.quality_pqc_product_batch }}</td>
                                <td>{{value.quality_pqc_comprehensive_result === '0' ? '合格':'不合格'}}</td>
                                <td>{{value.semi_finish_number }}</td>
                                <td>{{value.semi_finish_good_number}}</td>
                                <td>{{value.semi_finish_good_rate }}</td>
                              
                                <td class="table-input-td">
                                  <label class="checkbox-inline">
                                      <input type="checkbox" v-model="pqcCheckNames" :value="value.quality_pqc_report_id"> 
                                  </label>
                                </td>
                              </tr>
                              <tr v-show="!pqcCheckData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>

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
    `
  })
  /**
 * @description   手动录入数据
 */
  var ManuallyEntryDataVM = new Vue({
    el: '#ManuallyEntryData',
    data() {
        return {
           datas:[{
            capacityNum:"",
            kindNum:"",
            status:"",
            badCode:""
           }]
        }
    },
    methods: {
      add(){
        this.datas.push({
          capacityNum:"",
          kindNum:"",
          status:"",
          badCode:""
        })
      },
      search(){
        console.log(this.datas)
      },
      reset(){
        var num =  this.datas.length 
        if(num>1){
          this.datas.splice(1,num)
          this.datas[0].capacityNum="",
          this.datas[0].kindNum="",
          this.datas[0].status="",
          this.datas[0].badCode=""
        }else{
          this.datas[0].capacityNum="",
          this.datas[0].kindNum="",
          this.datas[0].status="",
          this.datas[0].badCode=""
        }
      }
    },
    mounted(){
      const ManuallyEntryData = document.getElementById('ManuallyEntryData')   //模态框
      bus.$on('ManuallyEntryData', () => {
        $(ManuallyEntryData).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(ManuallyEntryData).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
    <div class="modal fade" id="ManuallyEntryData">
      <div class="modal-dialog modal-lg">
          <div class="modal-content" >
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
                          <div class="col-xs-5 ">
                             <h4 class="modal-title">手动录入数据</h4>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right">
                              <fieldset>
                                 <a href="javascript:;" class="btn btn-primary btn-sm " @click = "add()">添加</a>
                              </fieldset>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div
                        class="panel-body-table table-height-10">
                          <table class="table  table-bordered table-hover">
                            <thead>
                              <tr>
                                <th style="width: 12%;">样本容量编号</th>
                                <th style="width: 18%;">样编号</th>
                                <th style="width: 18%;">状态</th>
                                <th style="width: 18%;">不良代号</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(value,index) in datas">
                                <td class="table-input-td"><input type="text" class="table-input" :value="value.capacityNum" v-model="datas[index].capacityNum"></td>
                                <td class="table-input-td"><input type="text" class="table-input" :value="value.kindNum" v-model="datas[index].kindNum"></td>
                               <!-- <td class="table-input-td"><input type="text" class="table-input" :value="value.status" v-model="datas[index].status"></td>-->
                                <td class="table-input-td" >
                                    <select class="form-control input-sm" :value="value.status" v-model="datas[index].status">
                                      <option value="">请选择</option>
                                      <option value="合格">合格</option>
                                      <option value="不合格">不合格</option>
                                      <option value="不良">不良</option>
                                    </select>
                                </td>
                                <td class="table-input-td"><input type="text" class="table-input" :value="value.badCode" v-model="datas[index].badCode"></td>
                               
                              </tr>

                            </tbody>
                          </table>
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
  /**
 * @description   上传Excel
 */
  var upLoadVM = new Vue({
    el: '#upLoad',
    data() {
        return {
            value6: '',
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

        }
    },
    methods: {
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    },
    mounted(){
      const upLoad = document.getElementById('upLoad')   //模态框
         
      bus.$on('upLoad', () => {
        $(upLoad).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(upLoad).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
    <div class="modal fade" id="upLoad"  >
      <div class="modal-dialog">
          <div class="modal-content" >
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
                          <div class="col-xs-12 ">
                             <h4 class="modal-title">上传文件</h4>
                          </div>
                        </div>
                      </div>
                      <div
                      <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-remove="beforeRemove"
                          multiple
                          :limit="3"
                          :on-exceed="handleExceed"
                          :file-list="fileList">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip"  style="height:60px !important">只能选择Excel文件，且不超过500kb</div>
                        </el-upload>
                         
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

   /**
  * @description     选择物料检验项目
  */
  var selectMaterielProjectVM = new Vue({
    el: '#selectMaterielProject',
    data() {
      return {
        ajaxData:{
          headNum:1,
          projectName:"",
          projectTypeId:""
        },
        tbodyData:[],
        projectType:[],

        lines:0, //条数
        search:'', //搜索框值
        selected:'', //选择
        currenPage:1, //当前页
        pagesize: 10,   //页码
      }
    },
    methods: {
      queryMaterielProject(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryQualityProjectUrl,
          data: this.ajaxData,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.tbodyData = result.map.projectInfo
              this.lines = result.map.lines
            }
            else {
              this.tbodyData = []
              this.lines = 0
            }
          },

        })
      },
      queryProjectType(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryQualityProjectTypeUrl,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.projectType = result.map.projectInfo
            }
            else {
              this.projectType = []
            }

          },

        })
      },
      handleCurrentChange(val){
        this.ajaxData.projectName = this.search
        this.ajaxData.projectTypeId = this.selected
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        this.queryMaterielProject()
      },
      //搜索框
      searchs(){
        this.ajaxData.projectName = this.search
        this.ajaxData.projectTypeId = this.selected
        this.currenPage = 1
        this.queryMaterielProject()
      },
      selectChange(){
        this.ajaxData.projectName = this.search
        this.ajaxData.projectTypeId = this.selected
        this.currenPage = 1
        this.queryMaterielProject()
      },
      check(val){
        const selectMaterielProject = document.getElementById('selectMaterielProject')   //模态框
        $(selectMaterielProject).modal('hide')

        bus.$emit('MaterielProjectData',val)
      }
    },
    mounted() {
      const selectMaterielProject = document.getElementById('selectMaterielProject')   //模态框
     
      bus.$on('selectMaterielProject', () => {
        this.queryMaterielProject()
        this.queryProjectType()
        $(selectMaterielProject).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(selectMaterielProject).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="selectMaterielProject">
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
                          <div class="col-xs-4">
                            <h4> 选择检验类型</h4>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right">
                              <fieldset>
                                <select class="form-control input-sm" v-model="selected" @change="selectChange">
                                  <option value="" >全部类型</option>
                                  <option v-for="(value, index) in projectType" :value="value.quality_project_type_id">{{value.quality_project_type_name}}</option>
                                </select>

                                <div class="input-group input-group-sm fuzzy-search-group">
                                  <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs">
                                  <div class="input-group-btn" @click="searchs()">
                                    <button type="button" class="btn btn-primary head-main-btn-2">
                                      <i class="fa fa-search"></i>
                                    </button>
                                  </div>
                                </div>
                              </fieldset>
                            </form>
                          </div>
                          
                        </div>
                      </div>

                      <div class="table-height-10">
                        <table class="table table-bordered table-hover text-m">
                          <thead>
                            <tr>
                              <th style="width: 15%;"> 序号</th>
                              <th style="width: 30%;">检测项目 </th>
                              <th style="width: 30%;">检测类型</th>
                              <th style="width: 15%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(value,index) in tbodyData"  :key="index">
                              <td>{{index+1}}</td>
                              <td>{{value.qualityProjects.quality_project_name}}</td>
                              <td>{{value.qualityProjectType.quality_project_type_name}}</td>
                              <td class="table-input-td">
                                <a class="table-link" @click="check(value)" href="javascript:void(0);">
                                  <i class="fa fa-plus fa-fw"></i>选择</a>
                              </td>
                            </tr>
                            <tr v-show="!tbodyData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                        <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total=lines></el-pagination>
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
   /**
  * @description     选择检验物料物料
  */
  var selectMaterielVM = new Vue({
    el: '#selectMateriel',
    data() {
      return {
        ajaxData:{
          type:"info",
          key:"keyWord",
          value:"",
          headNum:1
        },
        tbodyData:[],

        lines:0, //条数
        search:'', //搜索框值
        currenPage:1, //当前页
        pagesize: 10,   //页码
      }
    },
    methods: {
      queryMateriel(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryMaterialsUrl,
          data: this.ajaxData,
          beforeSend: (xml) => {
          },
          success: (result, status, xhr) => {
            if (result.status == 0) {
              this.tbodyData = result.map.materials
              this.lines = result.map.materialInfoLine
            }
            else {
              this.tbodyData = []
              this.lines = 0
            }
          },

        })
      },
      handleCurrentChange(val){
        this.ajaxData.value = this.search
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        this.queryMateriel()
      },
      //搜索框
      searchs(){
        this.ajaxData.value = this.search
        this.currenPage = 1
        this.queryMateriel()
      },
      check(val){
        const selectMateriel = document.getElementById('selectMateriel')   //模态框
        $(selectMateriel).modal('hide')
        bus.$emit('MaterielData',val)
    
        setTimeout(function(){
          bus.$emit('selectMaterielProject') 
        },1000);
      }
      
    },
    mounted() {
      const selectMateriel = document.getElementById('selectMateriel')   //模态框
    
      bus.$on('selectMateriel', () => {
        this.queryMateriel()
        $(selectMateriel).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(selectMateriel).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    created() {

    },
    template: `
      <div class="modal fade" id="selectMateriel">
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
                          <div class="col-xs-4">
                            <h4> 选择检验物料</h4>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right">
                              <fieldset>
                                <div class="input-group input-group-sm">
                                  <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs">
                                  <div class="input-group-btn" @click="searchs()">
                                    <button type="button" class="btn btn-primary">
                                      <i class="fa fa-search"></i>
                                    </button>
                                  </div>
                                </div>
                              </fieldset>
                            </form>
                          </div>
                          
                        </div>
                      </div>

                      <div class="table-height-10">
                        <table class="table table-bordered table-hover text-m">
                          <thead>
                            <tr>
                              <th style="width: 8%;"> 序号</th>
                              <th style="width: 20%;">物料名称 </th>
                              <th style="width: 15%;">物料规格</th>
                              <th style="width: 12%;">物料型号</th>
                              <th style="width: 10%;">单位</th>
                              <th style="width: 10%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(value,index) in tbodyData"  :key="index">
                              <td>{{index+1}}</td>
                              <td>{{value.warehouse_material_name}}</td>
                              <td>{{value.warehouse_material_standard}}</td>
                              <td>{{value.warehouse_material_model}}</td>
                              <td>{{value.warehouse_material_units}}</td>
                              <td class="table-input-td">
                                <a class="table-link" @click="check(value)" href="javascript:void(0);">
                                  <i class="fa fa-plus fa-fw"></i>选择</a>
                              </td>
                            </tr>
                            <tr v-show="!tbodyData.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="panel-footer panel-footer-table text-right">
                        <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total=lines></el-pagination>
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

  /**
* @description 选择设备模态框(单选)
*/

  var selectDeviceVM = new Vue({
    el: '#selectDevice',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'all', keyWord: '',typeId:""},//搜索参数
        devicesName:name,

        selected:"",
        tbodyData: [],  //表格数据
        deviceType: [],  //设备类型

        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('selectDevice')   //模态框
     

      bus.$on('selectDevice', () => {
        this.queryFun()
        this.queryDeviceType()
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })

     
     
    },
    methods: {
      //加载数据
      queryFun() {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryDevicesUrl,
          data: this.searchData,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.devices
              this.lines = result.map.lines
            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          }

        })

      },
      queryDeviceType(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryDevicesTypesUrl,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.deviceType = result.map.devices_control_devices_type
            }
            else {
              this.deviceType = []
            }

          }

        })
      },
      check(val){
        const modal = document.getElementById('selectDevice')   //模态框
        $(modal).modal('hide')
        bus.$emit('deviceData',val)

        setTimeout(function(){
          bus.$emit('selectDeviceParamter') 
        },1000);
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum
        this.queryFun()
      },
      selectChange(){
        this.searchData.typeId = this.selected
        this.searchData.type = "typeId"
        this.currenPage = 1
        this.queryFun()
      },

    },

    template: `
      <div class="modal fade" id="selectDevice">
        <div class="modal-dialog">
            <div class="modal-content" >
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
                               <h4 class="modal-title">选择设备</h4>
                            </div>
                            <div class="col-xs-6">
                              <form class="form-inline pull-right" onsubmit="return false;">
                                <select class="form-control input-sm" v-model="selected" @change="selectChange">
                                  <option value="" >全部类型</option>
                                  <option v-for="(value, index) in deviceType" :value="value.devices_control_devices_type_id">{{value.devices_control_devices_type_name}}</option>
                                </select>  
                              </form>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10"
                          v-loading="loading"
                          >
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 8%;">序号</th>
                                  <th style="width: 20%;">设备名称</th>
                                  <th style="width: 18%;">设备编号</th>
                                  <th style="width: 15%;">设备状态</th>
                                  <th style="width: 8%;">操作</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(value,index) in tbodyData"  :key="index">
                                  <td>{{index+1}}</td>
                                  <td>{{value.devices_control_devices_name}}</td>
                                  <td>{{value.devices_control_devices_number}}</td>
                                  <td>{{value.devices_control_devices_status_name}}</td>
                                  <td class="table-input-td">
                                    <a class="table-link" @click="check(value)" href="javascript:void(0);">
                                      <i class="fa fa-plus fa-fw"></i>选择</a>
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
  /**
* @description 选择设备参数模态框(单选)
*/

  var selectDeviceParamterVM = new Vue({
    el: '#selectDeviceParamter',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'parameterTypeQuery',parameterTypeId:""},//搜索参数

        selected:"",
        tbodyData: [],  //表格数据
        paramterType: [],  //设备类型

        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('selectDeviceParamter')   //模态框
    
      bus.$on('selectDeviceParamter', () => {
        this.queryParamterType()
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })

     
     
    },
    methods: {
      //加载数据
      queryFun() {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryNormParameterUrl,
          data: this.searchData,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.resultListTree
              this.lines = result.map.counts
            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          }

        })

      },
      queryParamterType(){
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryParameterTypeUrl,
          data:{
            type:"vague",
            status:0
          },
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.paramterType = result.map.resultList
            }
            else {
              this.deviceType = []
            }

          }

        })
      },
      check(val){
        const modal = document.getElementById('selectDeviceParamter')   //模态框
        $(modal).modal('hide')

        bus.$emit('deviceParamter',val)
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum
        this.queryFun()
      },
      selectChange(){
        this.searchData.parameterTypeId = this.selected
        this.currenPage = 1
        this.queryFun()
      },

    },

    template: `
      <div class="modal fade" id="selectDeviceParamter">
        <div class="modal-dialog">
            <div class="modal-content" >
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
                               <h4 class="modal-title">选择设备参数</h4>
                            </div>
                            <div class="col-xs-6">
                              <form class="form-inline pull-right" onsubmit="return false;">
                                <select class="form-control input-sm" v-model="selected" @change="selectChange">
                                  <option value="" >全部类型</option>
                                  <option v-for="(value, index) in paramterType" :value="value.standard_parameter_type_id">{{value.standard_parameter_type_name}}</option>
                                </select>  
                              </form>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10"
                          v-loading="loading"
                          >
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 8%;">序号</th>
                                  <th style="width: 20%;">参数名称</th>
                                  <th style="width: 18%;">参数规格</th>
                                  <th style="width: 15%;">参数备注</th>
                                  <th style="width: 8%;">操作</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(value,index) in tbodyData"  :key="index">
                                  <td>{{index+1}}</td>
                                  <td>{{value.standardParameterList[0].standard_parameter_name}}</td>
                                  <td>{{value.standardParameterList[0].standard_parameter_specifications}}</td>
                                  <td>{{value.standardParameterList[0].standard_parameter_describle}}</td>
                                  <td class="table-input-td">
                                    <a class="table-link" @click="check(value)" href="javascript:void(0);">
                                      <i class="fa fa-plus fa-fw"></i>选择</a>
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

   // 选择半成品
  var panelBodyTableVM = new Vue({
    el: '#selectSemiProduct',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'vague', status: 0, keyWord: '' },//搜索参数
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('selectSemiProduct')   //模态框
    

      bus.$on('selectSemiProduct', () => {
        this.queryFun()
        $(modal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modal).modal('show')
        // 模态框关闭的时候检查是否还有模态框
      })
    },
    methods: {
      //加载数据
      queryFun() {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: querySemiFinishedProductModelUrl,
          data: this.searchData,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.SemiFinishs
              this.lines = result.map.lines
            }
            else {
              this.tbodyData = []
              this.lines = 0
            }

          },

        })
      },

      // 模糊搜索
      search() {
        this.currenPage = 1
        this.searchData.keyWord = this.searchDataInput
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      check(val){
        const modal = document.getElementById('selectSemiProduct')   //模态框
        $(modal).modal('hide')

        bus.$emit('selectSemiProductName',val)

        setTimeout(function(){
          bus.$emit('selectMaterielProject') 
        },1000);
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
 			<div class="modal fade" id="selectSemiProduct">
				<div class="modal-dialog">
            <div class="modal-content" >
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">选择半成品</h4>
              </div>
              <div class="modal-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-6">
                                  <h5 class="panel-title"></h5>
                            </div>
                            <div class="col-xs-6">
                              <form class="form-inline pull-right" onsubmit="return false;" >
                                      <div class="input-group input-group-sm ">
                                        <input class="form-control" type="text"
                                          @keyup.enter ="search()"
                                          v-model.trim = "searchDataInput"
                                          placeholder="输入关键字" maxlength="25"
                                        >
                                        <div class="input-group-btn">
                                          <a
                                            href="javascript:;"
                                            class="btn btn-primary btn-sm"
                                            @click.stop.prevent ="search()"
                                            >
                                            <i class="fa fa-search"></i>
                                          </a>
                                        </div>
                                      </div>
                                </form>
                            </div>
                          </div>
                        </div>
                        <div
                          class="panel-body-table table-height-10"
                           v-loading="loading"
                          >
                            <table class="table  table-bordered table-hover">
                              <thead>
                                <tr>
                                  <th style="width: 10%;">序号</th>
                                  <th style="width: 30%;">半成品名称</th>
                                  <th style="width: 30%;">半成品描述</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="check(value)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.semi_finish_name">
                                  </td>
                                  <td v-text="value.semi_finish_describe">
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
