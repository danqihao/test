// 环境参数ID fictitiousEnvironmentParameterId
window.addEventListener('load', (event) => {
  /* const testModuls = document.getElementById('testModuls')
  const clickEvent = new MouseEvent('click', {
    'bubbles': true,
    'cancelable': true
  });
  testModuls.dispatchEvent(clickEvent) */
  const vuex = new Vue()
  let localVuex = new Vue()
  function queryProcess () {
    const processManageSwiper = document.getElementById('processManage')
    const panel = processManageSwiper.querySelector('.content-body .panel')
    const processDetailModal = document.getElementById('queryProcessDetailModal')
    const processDetailModalContent = processDetailModal.querySelector('.modal-content')
    let processManageTableVM = new Vue({
      el: panel,
      data () {
        return {
          URL: queryWorkstageOutlineUrl,
          queryBarInit: {
            status: true,
            keyWord: true,
            productType: true,
            polarity: true
          },
          tbodyData: [],
          bodyParam: {
            productTypeId: '',
            polarity: null,
            keyword: '',
            status: 0,
            headNum: 1
          },
          tableData: [],
          pageSize: 10,
          total: 0,
          currentPage: 1
        }
      },
      methods: {
        showAddProcessModal () {
          const addProcessModal = document.getElementById('addProcessModal')
          $(addProcessModal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(addProcessModal).modal('show')
        },
        searchBarQuery (queryParam) {
          if (queryParam !== undefined) {
            this.bodyParam.productTypeId = queryParam.productType
            this.bodyParam.polarity = queryParam.polarity
            this.bodyParam.status = queryParam.status
            this.bodyParam.keyword = queryParam.keyword
          }
          this.searchServerData()
          this.currentPage = 1
        },
        searchServerData (curryPage) {
          if (curryPage !== undefined) {
            this.bodyParam.headNum = ((curryPage - 1) * 10) + 1
          }
          const reqinit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqinit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.line
            const dataList = map.workstages
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
        },
        showProcessDetailModal (processData) {
          vuex.$emit('addProcessDetailData', processData)
          $(processDetailModal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(processDetailModal).modal('show')
        },
        // 启用工序
        enableProcess (process, index) {
          if (process === undefined) {
            return
          }
          else {
            const url = modifyWorkstageVersionsStatusUrl
            const bodyParam = {
              type: 'recover',
              workstageIds: []
            }
            bodyParam.workstageIds.push(process.workstage_id)
            console.log(bodyParam)
            const reqInit = {
              body: bodyParam
            }
            const reqConfig = {}
            swal({
              title: '确定启用吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                mesReq(url, reqInit, reqConfig).then((data) => {
                  console.log(data)
                }).then((data) => {
                  resolve()
                  this.tableData.splice(index, 1)
                  swal({
                    title: '启用成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((reason) => {
                  reject(reason)
                  swal({
                    title: '启用失败，请重试',
                    type: 'error',
                    timer: 1000
                  })
                })
              })
            }).catch((reason) => {
              console.log(reason)
            })
          }
        },
        // 弃用工序
        disableProcess (process, index) {
          if (process === undefined) {
            return
          }
          else {
            const url = modifyWorkstageVersionsStatusUrl
            const bodyParam = {
              type: 'deprecated',
              workstageIds: []
            }
            bodyParam.workstageIds.push(process.workstage_id)
            const reqInit = {
              body: bodyParam
            }
            console.log(reqInit)
            const reqConfig = {}
            swal({
              title: '确定弃用吗？',
              type: 'question',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              return new Promise((resolve, reject) => {
                mesReq(url, reqInit, reqConfig).then((data) => {
                  console.log(data)
                }).then((data) => {
                  resolve()
                  this.tableData.splice(index, 1)
                  swal({
                    title: '弃用成功',
                    type: 'success',
                    timer: 1000
                  })
                }).catch((reason) => {
                  reject(reason)
                  swal({
                    title: '弃用失败，请重试',
                    type: 'error',
                    timer: 1000
                  })
                })
              })
            }).catch((reason) => {
              console.log(reason)
            })
          }
        },
        // 存储行数据到模板中
        saveRowDataToTemplate (processData) {
          const bodyParam = {
            workstageIds: []
          }
          bodyParam.workstageIds.push(processData.workstage_id)
          const url = queryWorkstageParticularsUrl
          const reqInit = {
            body: bodyParam
          }
          mesReq(url, reqInit).then((data) => {
            localVuex.$emit('saveStepDataToTemplate', data)
          })
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
                    v-text="'新增工序'"
                    @click.prevent="showAddProcessModal">
                  </a>
                </form>
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
          <div class="panel-body-table table-height-10">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 15%;">工序名称</th>
                  <th style="width: 15%;">工序编号</th>
                  <th style="width: 15%;">工序版本</th>
                  <th style="width: 15%;">产品型号</th>
                  <th style="width: 35%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-show="tableData.length"
                  v-for="(value, index) in tableData"
                  :key="index"
                >
                  <td v-text="index + 1">
                  </td>
                  <td v-text="value.workstage_name">
                  </td>
                  <td v-text="value.workstage_number">
                  </td>
                  <td v-text="value.workstage_versions">
                  </td>
                  <td v-text="value.product_model_type_name">
                  </td>
                  <td class="table-input-td">
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="showProcessDetailModal(value)"
                    >
                      <i class="fa fa-tasks fa-fw"></i>详情
                    </a>
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="saveRowDataToTemplate(value)"
                    >
                      <i class="fa fa-check fa-fw"></i>添加到模板
                    </a>
                    <a
                      class="table-link text-danger"
                      href="javascript:;"
                      v-if="bodyParam.status === 0"
                      @click="disableProcess(value, index)"
                    >
                      <i class="fa fa-trash-o fa-fw"></i>弃用
                    </a>
                    <a
                      class="table-link text-success"
                      href="javascript:;"
                      v-if="bodyParam.status === 1"
                      @click="enableProcess(value, index)"
                    >
                      <i class="fa fa-check fa-fw"></i>启用
                    </a>
                  </td>
                </tr>
                <tr v-show="!tableData.length">
                  <td class="text-center" colspan="6">
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
    let processDetailModalVM = new Vue({
      el: processDetailModalContent,
      data () {
        return {
          baseInfo: {},
          useStepParam: [],
          environmentparam: [],
          semiFinishedProductParam: [],
          processDirection: [],
          pictureInfo: [],
          pictureUrl: downloadFileUrl
        }
      },
      methods: {
        processDetailValueType (valueType) {
          switch (valueType) {
            case 'constantValue':
              return '固定值'
              break;
            case 'rangeValue':
              return '范围值'
              break;
            case 'deviationValue':
              return '浮动值'
              break;
            default:
              return ''
              break;
          }
        },
        detailValueParam (data) {
          switch (data.workstage_use_parameter_value_type) {
            case 'constantValue':
              return `${data.workstage_use_parameter_constant_value}`
              break;
            case 'rangeValue':
              return `最小值: ${data.workstage_use_parameter_minimum_value}, 最大值: ${data.workstage_use_parameter_max_value}`
              break;
            case 'deviationValue':
              return `值: ${data.workstage_use_parameter_constant_value}, 浮动范围: ${data.workstage_use_parameter_error_value}`
              break;
            default:
              return ''
              break;
          }
        }
      },
      mounted () {
        vuex.$on('addProcessDetailData', (processData) => {
          if (processData === undefined) {
            return
          }
          else {
            const bodyParam = {
              workstageIds: []
            }
            bodyParam.workstageIds.push(processData.workstage_id)
            const url = queryWorkstageParticularsUrl
            const reqInit = {
              body: bodyParam
            }
            mesReq(url, reqInit).then((data) => {
              const map = data.map
              const processList = map.workstageList[0]
              const useParamList = processList.useParametersList
              if (this.pictureInfo.length) {
                this.pictureInfo = map.pictureInfo[0]
              }
              this.baseInfo = processList
              this.useStepParam = processList.stageAndStepRelationList
              this.environmentparam = (() => {
                return useParamList.filter(function (elem) {
                  return elem.standard_parameter_type_name === '环境参数'
                })
              })()
              console.log(this.environmentparam)
              this.semiFinishedProductParam = (() => {
                return useParamList.filter(function (elem) {
                  return elem.standard_parameter_type_name !== '环境参数'
                })
              })()
              this.processDirection = processList.processDescribleList
            })
          }
        })
      },
      template: `
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">查询工序</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#processDetailBaseInfo" data-toggle="tab">基础信息</a>
              </li>
              <li>
                <a href="#processDetailStepInfo" data-toggle="tab">工步</a>
              </li>
              <li>
                <a href="#processDetailEnvironmentInfo" data-toggle="tab">环境参数</a>
              </li>
              <li>
                <a href="#processDetailSemifinishedInfo" data-toggle="tab">半成品参数</a>
              </li>
              <li>
                <a href="#processDetailProcessInfo" data-toggle="tab">过程说明</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="processDetailBaseInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:15%">
                          工序名称
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_name"
                        >
                        </td>
                        <th style="width:15%">
                          工序编号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_number"
                        >
                        </td>
                        <th style="width:15%">
                          工序版本号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.workstage_versions"
                        >
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          所属产品类型
                        </th>
                        <td
                          v-text="baseInfo.product_model_type_name"
                        >
                        </td>
                        <th>
                          产品型号
                        </th>
                        <td
                          v-text="baseInfo.product_model_genre"
                        >
                        </td>
                        <th>
                          优率
                        </th>
                        <td
                          v-text="baseInfo.workstage_quality_rate"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          半成品类型
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_type_name"
                        >
                        </td>
                        <th>
                          半成品型号
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_genre"
                        >
                        </td>
                        <th>
                          半成品单位
                        </th>
                        <td
                          v-text="baseInfo.semi_finish_unit"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          极性
                        </th>
                        <td
                          v-text="baseInfo.workstage_polarity"
                        >
                        </td>
                        <th>
                          录入人员
                        </th>
                        <td
                          v-text="baseInfo.workstage_creation_staff"
                        >
                        </td>
                        <th>
                          备注
                        </th>
                        <td
                          v-text="baseInfo.workstage_describe"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          过程图例
                        </th>
                        <td class="table-input-td">
                          <a
                            v-if="pictureInfo.img_name"
                            :href="pictureUrl + '?fileName=' + pictureInfo.img_name"
                            class="table-link"
                            download="工序过程图例"
                          >
                            <i class="fa fa-tasks fa-fw"></i>查看图片
                          </a>
                        </td>
                        <th>
                        </th>
                        <td>
                        </td>
                        <th>
                        </th>
                        <td>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailStepInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          工步名称
                        </th>
                        <th style="width:20%">
                          工步编号
                        </th>
                        <th style="width:10%">
                          极性
                        </th>
                        <th style="width:15%">
                          工步版本
                        </th>
                        <th style="width:15%">
                          所属产品类型
                        </th>
                        <th style="width:15%">
                          产品型号
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in useStepParam"
                        :key="index"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_name"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_num"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_polar"
                        >
                        </td>
                        <td
                          v-text="item.workstep.craft_control_workstep_version"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_type_name"
                        >
                        </td>
                        <td
                          v-text="item.workstep.product_model_genre"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailEnvironmentInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          参数名称
                        </th>
                        <th style="width:20%">
                          参数类型
                        </th>
                        <th style="width:40%">
                          值
                        </th>
                        <th style="width:15%">
                          单位
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key) in environmentparam"
                        :key="key"
                      >
                        <td
                          v-text="key + 1"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_name"
                        >
                        </td>
                        <td
                          v-text="processDetailValueType(value.workstage_use_parameter_value_type)"
                        >
                        </td>
                        <td
                          v-text="detailValueParam(value)"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailSemifinishedInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          参数名称
                        </th>
                        <th style="width:20%">
                          参数类型
                        </th>
                        <th style="width:40%">
                          值
                        </th>
                        <th style="width:15%">
                          单位
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key) in semiFinishedProductParam"
                        :key="key"
                      >
                        <td
                          v-text="key + 1"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_name"
                        >
                        </td>
                        <td
                          v-text="processDetailValueType(value.workstage_use_parameter_value_type)"
                        >
                        </td>
                        <td
                          v-text="detailValueParam(value)"
                        >
                        </td>
                        <td
                          v-text="value.workstage_use_parameter_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="processDetailProcessInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:30%">
                          事项
                        </th>
                        <th style="width:65%">
                          说明
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in processDirection"
                        :key="index"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="item.proceeding"
                        >
                        </td>
                        <td
                           v-text="item.explain"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    })
  }
  queryProcess()

  function addProcess () {
    const addProcessModal = document.getElementById('addProcessModal')
    let addProcessModalVM = new Vue({
      el: addProcessModal,
      data () {
        return {
          baseInfo: {
            processName: '',
            processID: '',
            processNumber: '',
            processNumberID: '',
            processVersion: '',
            isRepeatProcessVersion: false, // 是否重复工序版本号
            belongProductTypeName: '', // 所属产品类型名
            belongProductTypeID: '',
            belongProductModelType: '', // 所属产品型号
            belongProductModelTypeID: '',
            optimalRate: 0, // 优率
            semifinishedType: '',
            semifinishedTypeID: '',
            semifinishedModelType: '',
            semifinishedModelTypeID: '',
            semifinishedUnit: '', // 半成品单位
            polarityParam: ['正极', '负极'],
            selectedPolarity: '正极',
            staffName: USERNAME,
            staffID: USERID,
            describe: '',
            processPicture: null
          },
          //工步参数
          stepParam: [
            /* {
              craft_control_workstep_id: 'test',
              craft_control_workstep_name: '1',
              craft_control_workstep_num: 'test',
              craft_workstep_basics_id: 'test',
              craft_control_workstep_version: 'test',
              product_type_name: 'test',
              product_model_type_id: 'test',
              product_model_genre: 'test',
              product_model_id: 'test',
              product_polar: 'test',
              craft_control_workstep_creation_time: 'test',
              craft_control_workstep_creation_staff: 'test',
              craft_control_workstep_describle: 'test',
              craft_control_workstep_process_describle: 'test',
              craft_control_workstep_status: 'test'
            } */
          ],
          // 环境参数
          environmentParam: [
            // 温度
            {
              name: '温度',
              type: 'fixedValue',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              unit: '°C'
            },
            // 湿度
            {
              name: '湿度',
              type: 'fixedValue',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              unit: '%RH'
            },
            // 露点
            {
              name: '露点',
              type: 'fixedValue',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              unit: 'g/m³'
            },
            // 清洁度
            {
              name: '清洁度',
              type: 'fixedValue',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              unit: 'μm'
            }
          ],
          // 半成品参数
          semifinishedParam: [
            // {
            //   semifinishedParamName: '哇',
            //   semifinishedParamId: '',
            //   parameterTypeName: '',
            //   parameterTypeId: '',
            //   type: 'fixedValue',
            //   fixedValue: 0,
            //   scopeValue: {
            //     minValue: 0,
            //     maxValue: 0
            //   },
            //   floatScopeValue: 0,
            //   unitList: [
            //     {
            //       parameter_unit: '秒'
            //     }
            //   ],
            //   selectedUnit: '秒'
            // }
          ],
          // 过程描述
          processDetail: [
            /* {
              explain: "50",
              order:"1",
              proceeding:"50"
            } */
          ]
        }
      },
      watch: {},
      computed: {
        addprocessBodyParam () {
          const baseInfo = this.baseInfo
          const stepParamSet = () => {
            const stepParam = this.stepParam
            if (stepParam.length === 0) {
              return []
            }
            else {
              const emptArray = []
              for (const [index, item] of stepParam.entries()) {
                const emptObject = {
                  workstage_workstep_order: index + 1,
                  craft_control_workstep_id: item.craft_control_workstep_id
                }
                emptArray.push(emptObject)
              }
              return emptArray
            }
          }
          const environmentParamSet = () => {
            const environmentParam = this.environmentParam
            const valueType = (selectedValueTypeEvent) => {
              switch (selectedValueTypeEvent) {
                case 'fixedValue':
                  return 'constantValue'
                  break;
                case 'scopeValue':
                  return 'rangeValue'
                  break;
                case 'floatValue':
                  return 'deviationValue'
                  break;
                default:
                  return ''
                  break;
              }
            }
            const emptArray = []
            function getEnvironmentParamId (paramName) {
              switch (paramName) {
                case '温度':
                  return 'temperatureSimulationParameterId'
                  break;
                case '温度':
                  return 'humiditySimulationParameterId000'
                  break;
                case '露点':
                  return 'dewPointSimulationParameterId000'
                  break;
                case '清洁度':
                  return 'cleanlinessSimulationParameterId'
                  break;
                default:
                  return ''
                  break;
              }
            }
            for (const [index, item] of environmentParam.entries()) {
              const emptObject = {
                workstage_use_parameter_name: item.name,     //工序使用参数名称
                workstage_use_parameter_value_type: valueType(item.type),    //使用参数值类型
                workstage_use_parameter_constant_value: item.fixedValue,   //恒定值
                workstage_use_parameter_left_border: '<=',      //左边界
                workstage_use_parameter_right_border: '<=',  //右边界
                workstage_use_parameter_minimum_value: item.scopeValue.minValue,    //最小值
                workstage_use_parameter_max_value: item.scopeValue.maxValue,     //最大值
                standard_parameter_id: getEnvironmentParamId(item.name),      //标准参数id
                workstage_use_parameter_order: index + 1,    //使用参数顺序
                standard_parameter_type_name: '环境参数',    //参数类型名称
                standard_parameter_type_id: 'fictitiousParameterTypeId0000000',     //参数类型id
                workstage_use_parameter_error_value: item.floatScopeValue,   //误差值
                workstage_use_parameter_unit: item.unit
              }
              emptArray.push(emptObject)
            }
            return emptArray
          }
          const semifinishedParamSet = () => {
            const semifinishedParam = this.semifinishedParam
            const emptArray = [...environmentParamSet()]
            const valueType = (selectedValueTypeEvent) => {
              switch (selectedValueTypeEvent) {
                case 'fixedValue':
                  return 'constantValue'
                  break;
                case 'scopeValue':
                  return 'rangeValue'
                  break;
                case 'floatValue':
                  return 'deviationValue'
                  break;
                default:
                  return ''
                  break;
              }
            }
            if (semifinishedParam.length === 0) {
              return emptArray
            }
            else {
              for (const [index, item] of semifinishedParam.entries()) {
                const emptObject = {
                  workstage_use_parameter_name: item.semifinishedParamName,     //工序使用参数名称
                  workstage_use_parameter_value_type: valueType(item.type),    //使用参数值类型
                  workstage_use_parameter_constant_value: item.fixedValue,   //恒定值
                  workstage_use_parameter_left_border: '<=',      //左边界
                  workstage_use_parameter_right_border: '<=',  //右边界
                  workstage_use_parameter_minimum_value: item.scopeValue.minValue,    //最小值
                  workstage_use_parameter_max_value: item.scopeValue.maxValue,     //最大值
                  standard_parameter_id: item.semifinishedParamId,      //标准参数id
                  workstage_use_parameter_order: index + 1,    //使用参数顺序
                  standard_parameter_type_name: item.name,    //参数类型名称
                  standard_parameter_type_id: item.parameterTypeId,     //参数类型id
                  workstage_use_parameter_error_value: item.floatScopeValue,   //误差值
                  workstage_use_parameter_unit: item.selectedUnit
                  // semi_finish_unit: item.selectedUnit
                }
                emptArray.push(emptObject)
              }
              return emptArray
            }
          }
          const processDescribe = () => {
            const processDetail = this.processDetail
            let processDetailArray = []
            if (processDetail.length === 0) {
              return ''
            }
            else {
              for (const [key, value] of processDetail.entries()) {
                const order = value.no
                const proceeding = value.matter
                const explain = value.detail
                const processDetailRow = {
                  order,
                  proceeding,
                  explain
                }
                processDetailArray.push(processDetailRow)
              }
            }
            return processDetailArray
          }
          const bodyParam = {
            files: baseInfo.processPicture,
            processDescribleStrs: processDescribe(),
            jsonObject: {
              workstage_basics_id: baseInfo.processID, // 工序基础信息id
              product_model_id: baseInfo.belongProductModelTypeID, // 产品型号id
              product_model_type_id: baseInfo.belongProductTypeID, // 产品类型id
              workstage_name: baseInfo.processName, // 工序名称
              workstage_number: baseInfo.processNumber, // 工序编号
              workstage_versions: baseInfo.processVersion, // 工序版本
              product_model_type_name: baseInfo.belongProductTypeName, // 产品类型名称
              product_model_genre: baseInfo.belongProductModelType, // 产品型号
              workstage_quality_rate: baseInfo.optimalRate, // 优率
              semi_finish_genre: baseInfo.semifinishedModelType, // 半成品型号
              semi_finish_id: baseInfo.semifinishedTypeID, // 半成品型号id
              semi_finish_type_name: baseInfo.semifinishedType, // 半成品类型名称
              semi_finish_unit: baseInfo.semifinishedUnit, // 半成品单位
              workstage_polarity: baseInfo.selectedPolarity, // 极性
              workstage_creation_staff: baseInfo.staffName, // 创建人员
              workstage_creation_staff_id: baseInfo.staffID, // 创建人员ID
              workstage_describe: baseInfo.describe, // 备注
              stageAndStepRelationList: stepParamSet(),
              useParametersList: semifinishedParamSet()
            }
          }
          /* let fromData = new FormData()
          for (const [key, value] of Object.entries(bodyParam)) {
            if (typeof value === 'object' && value instanceof File !== true) {
              let keyValue = JSON.stringify(value)
              fromData.append(key, keyValue)
            }
            else {
              fromData.append(key, value)
            }
          } */
          return bodyParam
        }
      },
      methods: {
        // 公共模态框显示
        commonModalShow (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config)
        },
        // 选取工序后执行存储
        getSelectedProcessParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            this.baseInfo.processName = data.processName
            this.baseInfo.processID = data.ID
            this.baseInfo.processNumber = data.processNumber
          })
        },
        // 查询工序版本号是否重复
        isRrepeatProcessVersion (processID, processVersion) {
          console.log(processID, processVersion)
          const url = queryWorkstageVersionsUrl
          const reqInit = {
            body: {
              type: 'isExist',
              workstageBasicsId: processID,
              versionsNumber: processVersion,
              headNum: 1
            }
          }
          mesReq(url, reqInit).then((data) => {
            if (data.null !== null) {
              this.baseInfo.isRepeatProcessVersion = false
            }
            else {
              this.info.isRepeatProcessVersion = true
            }
          })
        },
        // 选取产品类型后执行存储
        getSelectedProductTypeParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            this.baseInfo.belongProductTypeName = data.product_type_name
            this.baseInfo.belongProductTypeID = data.product_model_type_id
          })
        },
        // 选取产品型号后执行存储
        getSelectedProductNumberParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            this.baseInfo.belongProductModelType = data.product_model_genre
            this.baseInfo.belongProductModelTypeID = data.product_model_id
          })
        },
        // 选取半成品类型后执行存储
        getSelectedSemifinishedTypeParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            this.baseInfo.semifinishedType = data.semi_finish_type_name
            this.baseInfo.semifinishedTypeID = data.semi_finish_type_id
            console.log(this.baseInfo.semifinishedTypeID)
          })
        },
        // 选取半成品型号后执行存储
        getSelectedSemifinishedModelTypeParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            this.baseInfo.semifinishedModelType = data.semi_finish_genre
            this.baseInfo.semifinishedModelTypeID = data.product_model_id
            this.baseInfo.semifinishedUnit = data.semi_finish_unit
          })
        },
        // 优率输入格式
        optimalRateInputFormat (value, oldValue) {
          let parseFloatValue = parseFloat(value)
          if (typeof parseFloatValue !== 'number') {
            this.baseInfo.optimalRate = ''
          }
          else if (parseFloatValue > 100) {
            this.baseInfo.optimalRate = 100
          }
          else {
            parseFloatValue = parseFloatValue.toFixed(2)
            this.baseInfo.optimalRate = parseFloatValue
          }
        },
        // 选取员工参数后执行存储
        getSelectedStaffParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            this.baseInfo.staffName = data.role_staff_name
            this.baseInfo.staffID = data.role_staff_id
          })
        },
        // 存储过程图例
        saveFile (event) {
          this.baseInfo.processPicture = event.target.files[0]
          console.log(this.baseInfo.processPicture instanceof File)

        },
        // 选取工步参数后执行存储
        getSelectedStepParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            this.stepParam.push(data)
          })
        },
        // 添加工步面板的表格操作
        addStepPanelTableHandle (index) {

          const upMove = (index) => {
            if (index === 0) {
              return
            }
            else {
              const insertRowIndex = index - 1
              const selectedData = this.stepParam[index]
              this.stepParam.splice(index, 1)
              this.stepParam.splice(insertRowIndex, 0, selectedData)
            }
          }
          const downMove = (index) => {
            if (index === this.stepParam.length) {
              return
            }
            else {
              const insertRowIndex = index + 1
              const selectedData = this.stepParam[index]
              this.stepParam.splice(index, 1)
              this.stepParam.splice(insertRowIndex, 0, selectedData)
            }
          }
          const deleteRow = (index) => {
            this.stepParam.splice(index, 1)
          }
          return {
            upMove,
            downMove,
            deleteRow
          }
        },
        // 环境参数存储参数类型
        environmentParamSaveValueType (value, index) {
          this.environmentParam[index].type = value
        },
        // 环境参数存储固定值
        environmentParamSaveFixedValue (value, index) {
          this.environmentParam[index].fixedValue = value
        },
        // 环境参数存储范围值
        environmentParamSaveScopeValue (value, index) {

          this.environmentParam[index].scopeValue.minValue = value.minValue
          this.environmentParam[index].scopeValue.maxValue = value.maxValue
        },
        // 环境参数存储浮动值
        environmentParamSaveFloatValue (value, index) {
          this.environmentParam[index].fixedValue = value.value
          this.environmentParam[index].floatScopeValue = value.floatScopeValue
        },
        // 选取半成品参数后执行存储
        getSelectedSemifinishedTypeProductParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            const paramType = {
              semifinishedParamName: '',
              semifinishedParamId: '',
              parameterTypeName: '',
              parameterTypeId: '',
              type: 'fixedValue',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              unitList: [
                {
                  parameter_unit: ''
                }
              ],
              selectedUnit: ''
            }
            paramType.semifinishedParamName = data.standardParameterList[0].standard_parameter_name
            paramType.semifinishedParamId = data.standardParameterList[0].standard_parameter_id
            paramType.parameterTypeName = data.standard_parameter_type_name || ''
            paramType.parameterTypeId = data.standard_parameter_type_id
            paramType.unitList = data.standardParameterList[0].standardParameterUnitList
            this.semifinishedParam.push(paramType)
          })
        },
        // 半成品参数存储参数类型
        semifinishedParamSaveValueType (value, index) {
          this.semifinishedParam[index].type = value
        },
        // 半成品参数存储固定值
        semifinishedParamSaveFixedValue (value, index) {
          this.semifinishedParam[index].fixedValue = value
        },
        // 半成品参数存储范围值
        semifinishedParamSaveScopeValue (value, index) {
          this.semifinishedParam[index].scopeValue.minValue = value.minValue
          this.semifinishedParam[index].scopeValue.maxValue = value.maxValue
        },
        // 半成品参数存储浮动值
        semifinishedParamSaveFloatValue (value, index) {
          this.semifinishedParam[index].fixedValue = value.value
          this.semifinishedParam[index].floatScopeValue = value.floatScopeValue
        },
        // 删除半成品参数
        deleteSemifinishedParam (index) {
          this.semifinishedParam.splice(index, 1)
        },
        // 添加过程描述行
        addProcessDetailRow () {
          const processDetailLength = this.processDetail.length + 1
          let rowData = {
            no: processDetailLength,
            matter: '',
            detail: ''
          }
          this.processDetail.push(rowData)
        },
        // 删除过程描述行
        deleteProcessDetailRow (index) {
          this.processDetail.splice(index, 1)
          this.processDetail.forEach((currentValue, index) => {
            currentValue.no = index + 1
          });
        },
        // 存储工序数据到服务器
        saveProcessDataToServer (bodyParam) {
          console.log(bodyParam)
          const reqInit = {
            body: bodyParam
          }
          const reqConfig = {
            type: 'formData'
          }
          const url = saveWorkstageUrl
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
        // 监听数据参数
        const watchDataParam = () => {
          // this.$watch('baseInfo.semifinishedTypeID', this.getSelectedSemifinishedTypeProductParam)
          this.$watch('baseInfo.optimalRate', this.optimalRateInputFormat)
        }
        watchDataParam()
        localVuex.$on('saveStepDataToTemplate', processData => {
          console.log(processData)
          const map = processData.map
          const baseInfo = map.workstageList[0]
          const stepParam = baseInfo.stageAndStepRelationList
          const searchEnvironmentParam = environmentParamList => {
            return environmentParamList.filter((value, index) => {
              return value.standard_parameter_type_name === '环境参数'
            })
          }
          const searchSemifinishedParam = semifinishedParamList => {
            return semifinishedParamList.filter((value, index) => {
              return value.standard_parameter_type_name !== '环境参数'
            })
          }
          const environmentParam = searchEnvironmentParam(baseInfo.useParametersList)
          const semifinishedParam = searchSemifinishedParam(baseInfo.useParametersList)
          const processDetail = baseInfo.processDescribleList

          this.baseInfo = {
            processName: baseInfo.workstage_name,
            processID: baseInfo.workstage_id,
            processNumber: baseInfo.workstage_number,
            processNumberID: null,
            processVersion: baseInfo.workstage_versions,
            isRepeatProcessVersion: true, // 是否重复工序版本号
            belongProductTypeName: baseInfo.product_model_type_name, // 所属产品类型名
            belongProductTypeID: baseInfo.product_model_type_id,
            belongProductModelType: baseInfo.product_model_genre, // 所属产品型号
            belongProductModelTypeID: baseInfo.product_model_id,
            optimalRate: baseInfo.workstage_quality_rate, // 优率
            semifinishedType: baseInfo.semi_finish_type_name,
            semifinishedTypeID: baseInfo.semi_finish_id,
            semifinishedModelType: baseInfo.semi_finish_genre,
            semifinishedModelTypeID: null,
            semifinishedUnit: baseInfo.semi_finish_unit, // 半成品单位
            polarityParam: ['正极', '负极'],
            selectedPolarity: baseInfo.workstage_polarity,
            staffName: baseInfo.workstage_creation_staff,
            staffID: baseInfo.workstage_creation_staff_id,
            describe: baseInfo.workstage_describe,
            processPicture: null
          }
          this.stepParam = []
          for (const [index, value] of stepParam.entries()) {
            this.stepParam.push(value.workstep)
          }

          for (const [parentIndex, parentValue] of environmentParam.entries()) {
            const parentParamTypeName = parentValue.workstage_use_parameter_name
            for (const [childIndex, childValue] of this.environmentParam.entries()) {
              const childParamTypeName = childValue.name
              if (Object.is(parentParamTypeName, childParamTypeName)) {
                const valueType = serverTypeValue => {
                  switch (serverTypeValue) {
                    case 'constantValue':
                      return 'fixedValue'
                      break;
                    case 'rangeValue':
                      return 'scopeValue'
                      break;
                    case 'deviationValue':
                      return 'floatValue'
                      break;
                    default:
                      return 'fixedValue'
                      break;
                  }
                }
                childValue.type = valueType(parentValue.workstage_use_parameter_value_type)
                childValue.fixedValue = parentValue.workstage_use_parameter_constant_value
                childValue.scopeValue.minValue = parentValue.workstage_use_parameter_minimum_value
                childValue.scopeValue.maxValue = parentValue.workstage_use_parameter_max_value
                childValue.floatScopeValue = parentValue.workstage_use_parameter_error_value
                childValue.unit = parentValue.workstage_use_parameter_unit
              }
            }
          }

          // 半成品参数
          this.semifinishedParam = []
          for (const [index, value] of semifinishedParam.entries()) {
            const valueType = serverTypeValue => {
              switch (serverTypeValue) {
                case 'constantValue':
                  return 'fixedValue'
                  break;
                case 'rangeValue':
                  return 'scopeValue'
                  break;
                case 'deviationValue':
                  return 'floatValue'
                  break;
                default:
                  return 'fixedValue'
                  break;
              }
            }
            const itemValue = {
              semifinishedParamName: value.workstage_use_parameter_name,
              semifinishedParamId: value.workstage_use_parameter_main_id,
              parameterTypeName: value.standard_parameter_type_name,
              parameterTypeId: value.standard_parameter_type_id,
              type: valueType(value.workstage_use_parameter_value_type),
              fixedValue: value.workstage_use_parameter_constant_value,
              scopeValue: {
                minValue: value.workstage_use_parameter_minimum_value,
                maxValue: value.workstage_use_parameter_max_value
              },
              floatScopeValue: value.workstage_use_parameter_error_value,
              unitList: [
                {
                  parameter_unit: value.workstage_use_parameter_unit
                }
              ],
              selectedUnit: value.workstage_use_parameter_unit
            }
            this.semifinishedParam.push(itemValue)
          }

          this.processDetail = []
          for (const [index, value] of processDetail.entries()) {
            const itemValue = {
              no: value.order,
              matter: value.proceeding,
              detail: value.explain
            }
            this.processDetail.push(itemValue)
          }
        })
      },
      components: {
        fixedValue: Vue.component('mes-fixed-value-input'),
        scopeValue: Vue.component('mes-scope-value-input'),
        floatValue: Vue.component('mes-float-value-input'),
      },
      // <div class="modal fade in" id="addProcessModal" style="display:block">
      template: `
        <div class="modal fade" id="addProcessModal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">新增工序</h4>
              </div>
              <div class="modal-body">
                <ul class="nav nav-tabs">
                  <li class="active">
                    <a href="#addProcessModalBasic" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>基础信息</a>
                  </li>
                  <li>
                    <a href="#addProcessModalStep" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>工步</a>
                  </li>
                  <li>
                    <a href="#addProcessModalEnvironment" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>环境参数</a>
                  </li>
                  <li>
                    <a href="#addProcessModalSemifinished" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>半成品参数</a>
                  </li>
                  <li>
                    <a href="#addProcessModalProcess" data-toggle="tab">过程说明</a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane active" id="addProcessModalBasic">
                    <div class="panel panel-default relative">
                      <div class="panel-body">
                        <form class="form-inline form-table">
                          <div class="row">
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工序名称</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.processName"
                                >
                                <a
                                  class="input-btn"
                                  title="查询工序名称"
                                  href="javascript:;"
                                  @click="getSelectedProcessParam('queryStepProcessModal')"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工序编号</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  v-model="baseInfo.processNumber"
                                  readonly
                                >
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工序版本号</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  placeholder="选择工序后再输入"
                                  v-model="baseInfo.processVersion"
                                  @change="isRrepeatProcessVersion(baseInfo.processID, baseInfo.processVersion)"
                                >
                                <a
                                  class="input-btn"
                                  title="查询工序版本号"
                                  href="javascript:;"
                                  @click="commonModalShow('queryProcessVersionModal', {ID: baseInfo.processID})"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                                <span
                                  class="tip tip-error"
                                  v-show="baseInfo.isRepeatProcessVersion"
                                  v-text="'版本号重复，请重新输入'"
                                >
                                </span>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>所属产品类型</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.belongProductTypeName"
                                >
                                <a
                                  class="input-btn"
                                  title="查询产品类型"
                                  href="javascript:;"
                                  @click="getSelectedProductTypeParam('queryProductTypeModal')"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>产品型号</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.belongProductModelType"
                                >
                                <a
                                  class="input-btn"
                                  title="查询产品型号"
                                  href="javascript:;"
                                  @click="getSelectedProductNumberParam('queryProductnumberModal', {productTypeId: baseInfo.belongProductTypeID})"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>优率</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  v-model.trim.number="baseInfo.optimalRate"
                                >
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>半成品类型</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.semifinishedType"
                                >
                                <a
                                  class="input-btn"
                                  title="查询半成品类型"
                                  href="javascript:;"
                                  @click="getSelectedSemifinishedTypeParam('querySemiFinishedTypeModal')"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>半成品型号</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.semifinishedModelType"
                                >
                                <a
                                  class="input-btn"
                                  title="查询半成品型号"
                                  href="javascript:;"
                                  @click="getSelectedSemifinishedModelTypeParam('querySemifinishedNumberModal', {semifinishedTypeID: baseInfo.semifinishedTypeID})"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>半成品单位</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.semifinishedUnit"
                                >
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>极性</label>
                                <select
                                  class="form-control"
                                  v-model="baseInfo.selectedPolarity"
                                >
                                  <option
                                    v-for="(value, key) in baseInfo.polarityParam"
                                    :key="key"
                                    :value="value"
                                    v-text="value"
                                  >
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>录入人员</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.staffName"
                                >
                                <!--
                                <a
                                  class="input-btn"
                                  title="查询录入人员"
                                  href="javascript:;"
                                  @click="getSelectedStaffParam('queryStaffInfoModal')"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                                -->
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label">备注</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  v-model="baseInfo.describe"
                                >
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>过程图例</label>
                                <input
                                  style="max-width: 157px"
                                  type="file"
                                  class="form-control"
                                  accept="image/*"
                                  @change="saveFile"
                                >
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane" id="addProcessModalStep">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                              type="button"
                              class="btn btn-primary"
                              @click="getSelectedStepParam('queryStepModal')"
                            >
                              <i class="fa fa-search"></i> 添加工步
                            </button>
                          </div>
                          <div class="col-xs-8">
                          </div>
                        </div>
                      </div>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 5%;">序号</th>
                            <th style="width: 13%;">工步名称</th>
                            <th style="width: 13%;">工步编号</th>
                            <th style="width: 10%;">极性</th>
                            <th style="width: 13%;">工步版本</th>
                            <th style="width: 13%;">所属产品类型</th>
                            <th style="width: 13%;">所属产品型号</th>
                            <th style="width: 20%;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(value, key) in stepParam"
                            :key="key"
                          >
                            <td
                              v-text="key + 1"
                            >
                            </td>
                            <td
                              v-text="value.craft_control_workstep_name"
                            >
                            </td>
                            <td
                              v-text="value.craft_control_workstep_num"
                            >
                            </td>
                            <td
                              v-text="value.product_polar"
                            >
                            </td>
                            <td
                              v-text="value.craft_control_workstep_version"
                            >
                            </td>
                            <td
                              v-text="value.product_type_name"
                            >
                            </td>
                            <td
                              v-text="value.product_model_genre"
                            >
                            </td>
                            <td class="table-input-td">
                              <a
                                class="table-link"
                                href="javascript:;"
                                @click="addStepPanelTableHandle().upMove(key)"
                              >
                                <i class="fa fa-sort-asc fa-fw"></i>上移
                              </a>
                              <a
                                class="table-link"
                                href="javascript:;"
                                @click="addStepPanelTableHandle().downMove(key)"
                              >
                                <i class="fa fa-sort-desc fa-fw"></i>下移
                              </a>
                              <a
                                class="table-link text-danger"
                                href="javascript:;"
                                @click="addStepPanelTableHandle().deleteRow(key)"
                              >
                                <i class="fa fa-trash-o fa-fw"></i>删除
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="addProcessModalEnvironment">
                    <div class="panel panel-default relative">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 20%;">名称</th>
                            <th style="width: 20%;">参数类型</th>
                            <th style="width: 45%;">值</th>
                            <th style="width: 15%;">单位</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(value, key) in environmentParam"
                            :key="key"
                          >
                            <td
                              v-text="value.name"
                            >
                            </td>
                            <mes-value-type-select
                              @selectedValueTypeEvent="environmentParamSaveValueType"
                              :nowIndex="key"
                              :template-selected-value-type="value.type"
                            >
                            </mes-value-type-select>
                            <component
                              :is="value.type"
                              :nowIndex="key"
                              :default-value="{
                                fixedValue: value.fixedValue,
                                minValue: value.scopeValue.minValue,
                                maxValue: value.scopeValue.maxValue,
                                floatScopeValue: value.floatScopeValue
                              }"
                              @saveFixedValue="environmentParamSaveFixedValue"
                              @saveScopeValue="environmentParamSaveScopeValue"
                              @saveFloatValue="environmentParamSaveFloatValue"
                            >
                            </component>
                            <td class="table-input-td">
                              <input
                                type="text"
                                placeholder="值"
                                class="form-control"
                                v-model="value.unit"
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="addProcessModalSemifinished">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                              type="button"
                              class="btn btn-primary"
                              @click="getSelectedSemifinishedTypeProductParam('queryStandardParameterModal', {semifinishedTypeID: baseInfo.semifinishedTypeID})"
                            >
                              <i class="fa fa-search"></i> 添加半成品参数
                            </button>
                          </div>
                          <div class="col-xs-8">
                          </div>
                        </div>
                      </div>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 5%;">序号</th>
                            <th style="width: 20%;">名称</th>
                            <th style="width: 15%;">参数类型</th>
                            <th style="width: 35%;">值</th>
                            <th style="width: 10%;">单位</th>
                            <th style="width: 15%;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(value, key) in semifinishedParam"
                            :key="key"
                          >
                            <td
                              v-text="key + 1"
                            >
                            </td>
                            <td
                              v-text="value.semifinishedParamName"
                            >
                            </td>
                            <mes-value-type-select
                              @selectedValueTypeEvent="semifinishedParamSaveValueType"
                              :template-selected-value-type="value.type"
                              :nowIndex="key"
                            >
                            </mes-value-type-select>
                            <component
                              :is="value.type"
                              :nowIndex="key"
                              :default-value="{
                                fixedValue: value.fixedValue,
                                minValue: value.scopeValue.minValue,
                                maxValue: value.scopeValue.maxValue,
                                floatScopeValue: value.floatScopeValue
                              }"
                              @saveFixedValue="semifinishedParamSaveFixedValue"
                              @saveScopeValue="semifinishedParamSaveScopeValue"
                              @saveFloatValue="semifinishedParamSaveFloatValue"
                            >
                            </component>
                            <td
                              class="table-input-td"
                            >
                              <select
                                class="form-control"
                                v-model="semifinishedParam[key].selectedUnit"
                              >
                                <option
                                  disabled
                                  value=""
                                  v-text="'选择单位'"
                                >
                                </option>
                                <option
                                  v-for="(item, index) in semifinishedParam[key].unitList"
                                  :key="index"
                                  :value="item.parameter_unit"
                                  v-text="item.parameter_unit"
                                >
                                </option>
                              </select>
                            </td>
                            <td class="table-input-td">
                              <a
                                href="javascript:;"
                                class="table-link text-danger"
                                @click="deleteSemifinishedParam(key)"
                              >
                                <i class="fa fa-trash-o fa-fw"></i>删除
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="addProcessModalProcess">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                              type="button"
                              class="btn btn-primary"
                              @click="addProcessDetailRow"
                            >
                              <i class="fa fa-plus fa-fw"></i>添加行
                            </button>
                          </div>
                          <div class="col-xs-8">
                            <!-- <form class="form-inline pull-right">
                            <button type="button" class="btn btn-primary">
                            <i class="fa fa-search"></i>
                            </button>
                            </form> -->
                          </div>
                        </div>
                      </div>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 5%;">序号</th>
                            <th style="width: 15%;">事项</th>
                            <th style="width: 65%;">说明</th>
                            <th style="width: 15%;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in processDetail"
                          >
                            <td
                              v-text="item.no"
                            >

                            </td>
                            <td class="table-input-td">
                             <input
                              type="text"
                              placeholder="请输入"
                              class="form-control"
                              v-model="item.matter"
                             >
                            </td>
                            <td class="table-input-td">
                             <input
                              type="text"
                              placeholder="请输入"
                              class="form-control"
                              v-model="item.detail"
                             >
                            </td>
                            <td class="table-input-td">
                              <a
                              class="table-link text-danger"
                              href="javascript:;"
                              @click="deleteProcessDetailRow(index)"
                              >
                                <i class="fa fa-trash-o fa-fw"></i>删除
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                      v-text="'确认提交'"
                      @click="saveProcessDataToServer(addprocessBodyParam)"
                    >
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
  addProcess()
})