window.addEventListener('load', (event) => {
  let localVuex = new Vue()
  function queryStep () {
    const stepManageSwiper = document.getElementById('stepManage')
    const panel = stepManageSwiper.querySelector('.content-body .panel')
    const stepDetailModal = document.getElementById('queryStepDetailModal')
    const stepDetailModalContent = stepDetailModal.querySelector('.modal-content')
    let stepManageTableVM = new Vue({
      el: panel,
      data () {
        return {
          URL: queryStepOutlineUrl,
          queryBarInit: {
            status: true,
            keyWord: true,
            productType: true,
            polarity: true
          },
          bodyParam: {
            productTypeId: '0c917e720da04cdaa873652a1c0e1bfd',
            polarity: '',
            keyword: '',
            status: 0,
            headNum: 1
          },
          tableData: [],
          pageSize: 10,
          total: 0,
          currentPage: 1,
          stepDetailData: {}
        }
      },
      methods: {
        momentTime (value) {
          return moment(value).format('YYYY-MM-DD HH:mm')
        },
        showStepModal () {
          const addStepModal = document.getElementById('addStepModal')
          $(addStepModal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(addStepModal).modal('show')
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
          const reqInit = {
            body: this.bodyParam
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          this.tableData = []
          mesReq(this.URL, reqInit, reqConfig).then((data) => {
            const map = data.map
            const counts = map.counts
            const dataList = map.workstepList
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              this.tableData.push(value)
            }
          })
        },
        // 显示工步详情模态框
        showStepDetailModal (stepData) {
          const stepDetailModal = document.getElementById('queryStepDetailModal')
          vuex.$emit('addStepDetailData', stepData)
          $(stepDetailModal).modal({
            keyboard: false,
            backdrop: 'static'
          })
          $(stepDetailModal).modal('show')
        },
        // 启用工步
        enableStep (step, index) {
          if (step === undefined) {
            return
          }
          else {
            const url = modifyStepVersionsStatusUrl
            const bodyParam = {
              type: 'recover',
              stepIds: []
            }
            bodyParam.stepIds.push(step.craft_control_workstep_id)
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
        // 弃用工步
        disableStep (step, index) {
          if (step === undefined) {
            return
          }
          else {
            const url = modifyStepVersionsStatusUrl
            const bodyParam = {
              type: 'deprecated',
              stepIds: []
            }
            bodyParam.stepIds.push(step.craft_control_workstep_id)
            const reqInit = {
              body: bodyParam
            }
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
        saveRowDataToTemplate (stepData) {
          const bodyParam = {
            stepIds: []
          }
          bodyParam.stepIds.push(stepData.craft_control_workstep_id)
          const url = queryStepParticularsUrl
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
                    v-text="'新增工步'"
                    @click.prevent="showStepModal">
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
                  <th style="width: 15%;">工步名称</th>
                  <th style="width: 15%;">工步编号</th>
                  <th style="width: 15%;">工步版本</th>
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
                  <td v-text="value.craft_control_workstep_name">
                  </td>
                  <td v-text="value.craft_control_workstep_num">
                  </td>
                  <td v-text="value.craft_control_workstep_version">
                  </td>
                  <td v-text="value.product_model_genre">
                  </td>
                  <td class="table-input-td">
                    <a
                      class="table-link"
                      href="javascript:;"
                      @click="showStepDetailModal(value)"
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
                      @click="disableStep(value, index)"
                    >
                      <i class="fa fa-trash-o fa-fw"></i>弃用
                    </a>
                    <a
                      class="table-link text-success"
                      href="javascript:;"
                      v-if="bodyParam.status === 1"
                      @click="enableStep(value, index)"
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
                @current-change="searchServerData(currentPage)"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      `
    })
    let stepDetailModalVM = new Vue({
      el: stepDetailModalContent,
      data () {
        return {
          baseInfo: {},
          stepParam: [],
          useMaterial: [],
          processDirection: []
        }
      },
      methods: {
        momentTime (value) {
          return moment(value).format('YYYY-MM-DD HH:mm')
        },
        stepDetailValueType (valueType) {
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
        stepDetailValueParam (stepParam) {
          switch (stepParam.craft_workstep_parameter_value_type) {
            case 'constantValue':
              return `${stepParam.workstep_parameter_constant_value}`
              break;
            case 'rangeValue':
              return `最小值: ${stepParam.workstep_parameter_minimum_value}, 最大值: ${stepParam.workstep_parameter_max_value}`
              break;
            case 'deviationValue':
              return `值: ${stepParam.workstep_parameter_constant_value}, 浮动范围: ${stepParam.workstep_parameter_error_value}`
              break;
            default:
              return ''
              break;
          }
        }
      },
      mounted () {
        vuex.$on('addStepDetailData', (stepData) => {
          if (stepData === undefined) {
            return
          }
          else {
            const bodyParam = {
              stepIds: []
            }
            bodyParam.stepIds.push(stepData.craft_control_workstep_id)
            const url = queryStepParticularsUrl
            const reqInit = {
              body: bodyParam
            }
            mesReq(url, reqInit).then((data) => {
              const map = data.map
              this.baseInfo = map.workstepList[0]
              this.stepParam = map.workstepList[0].workstepParameterList
              this.useMaterial = map.workstepList[0].useMaterielList
              this.processDirection = map.workstepList[0].processDescribleList
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
            <h4 class="modal-title">查询工步详情</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#stepDetailBaseInfo" data-toggle="tab">基础信息</a>
              </li>
              <li>
                <a href="#stepDetailStepParamInfo" data-toggle="tab">工步参数</a>
              </li>
              <li>
                <a href="#stepDetailMaterialInfo" data-toggle="tab">使用物料</a>
              </li>
              <li>
                <a href="#stepDetailProcessInfo" data-toggle="tab">过程说明</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="stepDetailBaseInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:15%">
                          工步名称
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.craft_control_workstep_name"
                        >
                        </td>
                        <th style="width:15%">
                          工步编号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.craft_control_workstep_num"
                        >
                        </td>
                        <th style="width:15%">
                          工步版本号
                        </th>
                        <td
                          style="width:18.3%"
                          v-text="baseInfo.craft_control_workstep_version"
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
                          v-text="baseInfo.product_type_name"
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
                          极性
                        </th>
                        <td
                          v-text="baseInfo.product_polar"
                        >
                        </td>
                      </tr>
                      <tr>
                        <th>
                          录入人员
                        </th>
                        <td
                          v-text="baseInfo.craft_control_workstep_creation_staff"
                        >
                        </td>
                        <th>
                          录入时间
                        </th>
                        <td
                          v-text="momentTime(baseInfo.craft_control_workstep_creation_time)"
                        >
                        </td>
                        <th>
                          备注
                        </th>
                        <td
                          v-text="baseInfo.craft_control_workstep_describle"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="stepDetailStepParamInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:15%">
                          名称
                        </th>
                        <th style="width:15%">
                          值类型
                        </th>
                        <th style="width:55%">
                          值
                        </th>
                        <th style="width:10%">
                          单位
                        </th>
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
                          v-text="value.craft_workstep_parameter_name"
                        >
                        </td>
                        <td
                          v-text="stepDetailValueType(value.craft_workstep_parameter_value_type)"
                        >
                        </td>
                        <td
                          v-text="stepDetailValueParam(value)"
                        >
                        </td>
                        <td
                          v-text="value.workstep_parameter_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="stepDetailMaterialInfo">
                <div class="panel panel-default relative">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th style="width:5%">
                          序号
                        </th>
                        <th style="width:20%">
                          名称
                        </th>
                        <th style="width:20%">
                          规格
                        </th>
                        <th style="width:20%">
                          型号
                        </th>
                        <th style="width:20%">
                          数量
                        </th>
                        <th style="width:15%">
                          单位
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(value, key) in useMaterial"
                        :key="key"
                      >
                        <td
                          v-text="key + 1"
                        >
                        </td>
                        <td
                          v-text="value.craft_materiel_name"
                        >
                        </td>
                        <td
                          v-text="value.craft_materiel_specifications"
                        >
                        </td>
                        <td
                          v-text="value.craft_materiel_model"
                        >
                        </td>
                        <td
                          v-text="value.craft_materiel_value"
                        >
                        </td>
                        <td
                          v-text="value.craft_materiel_unit"
                        >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane" id="stepDetailProcessInfo">
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
                        v-for="(value, index) in processDirection"
                      >
                        <td
                          v-text="index + 1"
                        >
                        </td>
                        <td
                          v-text="value.proceeding"
                        >
                        </td>
                        <td
                          v-text="value.explain"
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
  queryStep()

  function addStep () {
    const stepManageSwiper = document.getElementById('stepManage')
    const panel = stepManageSwiper.querySelector('.content-body .panel')
    const panelHeading = panel.querySelector('.panel-heading')
    const btnToolbar = panelHeading.querySelector('.col-xs-4')
    const addStepModa = document.getElementById('addStepModal')
    let addStepModalVM = new Vue({
      el: addStepModa,
      data () {
        return {
          baseInfo: {
            stepName: '',
            stepID: '',
            stepNumber: '',
            stepVersion: '',
            isRepeatStepVersion: false,
            belongProductTypeName: '',
            belongProductTypeID: '',
            belongProductModelType: '',
            belongProductModelTypeID: '',
            polarityParam: ['正极', '负极'],
            selectedPolarity: '正极',
            staffName: USERNAME,
            staffID: USERID,
            comment: ''
          },
          stepParam: [
            /* {
              ID: 'efa1dfd23bfe40eea4a315fa0b13cb68',
              standardParameterId: '',
              paramName: '工步参数1',
              selectedValueType: 'fixedValue',
              specifications: '434',
              unit: [
                {
                  parameter_unit: 'kg'
                }
              ],
              selectedUnit: ''
              fixedValue: 20,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              devicesTypeID: '225dc1e3e3534c4ab4b8d17cb792310e'
            } */
          ],
          devicesTypeOption: [],
          materialParam: [
            /* {
              craft_materiel_name: data.standardParameterList[0].standard_parameter_name, // 使用物料名
              craft_materiel_specifications: data.standardParameterList[0].standard_parameter_specifications, // 规格
              craft_materiel_model: data.standard_parameter_type_id, // 型号
              craft_materiel_value: data.quantity, // 值
              craft_materiel_unit: '', // 单位
              craft_materiel_order: this.materialParam.length, // 顺序
              craft_materiel_id: data.standardParameterList[0].standard_parameter_id, // 使用物料id
            } */
          ],
          processDetail: [
            /* {
              no: 1,
              matter: 'adas',
              detail: 'sfsdf fsfffsf'
            } */
          ]
        }
      },
      computed: {
        processDetailRowIndex () {
          const total = this.processDetail.length
          return total + 1
        },
        savaAddStepBodyParam () {
          const baseInfo = this.baseInfo
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
          const stepParameter = () => {
            const stepParam = this.stepParam
            let mergeParam = []
            if (stepParam.length === 0) {
              return []
            }
            else {
              for (const [key, value] of stepParam.entries()) {
                const valueType = (selectedValueType) => {
                  switch (selectedValueType) {
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
                let tempObject = {
                  craft_control_workstep_id: value.ID,
                  standard_parameter_id: value.standardParameterId,
                  craft_workstep_parameter_name: value.paramName,  // 参数名称
                  craft_workstep_parameter_value_type: valueType(value.selectedValueType), //值类型
                  workstep_parameter_constant_value: value.fixedValue, // 恒定值
                  workstep_parameter_minimum_value: value.scopeValue.minValue, // 最小值
                  workstep_parameter_left_border: '<=',  // 左边界 <=
                  workstep_parameter_right_border: '<=',  // 右边界 <=
                  workstep_parameter_max_value: value.scopeValue.maxValue,  // 最大值
                  workstep_parameter_unit: value.selectedUnit,    // 单位
                  devices_control_devices_type_id: value.devicesTypeID,  // 设备类型id
                  craft_control_workstep_order: key + 1,  // 顺序
                  workstep_parameter_error_value: value.floatScopeValue// 误差值
                }
                mergeParam.push(tempObject)
              }
            }
            return mergeParam
          }
          /* const materialParam = () => {
            const Param = this.materialParam
            let mergeParam = []
            if (Param.length === 0) {
              return []
            }
            else {
              for (const [key, value] of Param.entries()) {
                let tempObject = {
                  craft_materiel_name: value.standardParameterList[0].standard_parameter_name, // 使用物料名
                  craft_materiel_specifications: value.standardParameterList[0].standard_parameter_specifications, // 规格
                  craft_materiel_model: value.standard_parameter_type_id, // 型号
                  craft_materiel_value: value.quantity, // 值
                  craft_materiel_unit: value.standardParameterList[0].selectedUnit, // 单位
                  craft_materiel_order: key + 1, // 顺序
                  craft_materiel_id: value.standardParameterList[0].standard_parameter_id, // 使用物料id
                }
                mergeParam.push(tempObject)
              }
            }
            return mergeParam
          } */
          let materialParam = this.materialParam
          materialParam.forEach((value, index) => {
            delete materialParam[index].craft_materiel_unitList
          })

          let bodyParam = {
            jsonObject: {
              craft_control_workstep_name: baseInfo.stepName, // 工步名称
              craft_control_workstep_num: baseInfo.stepNumber, // 工步编号
              craft_workstep_basics_id: baseInfo.stepID, // 工步基础信息id
              craft_control_workstep_version: baseInfo.stepVersion, // 工步版本
              product_type_name: baseInfo.belongProductTypeName, // 产品类型名称
              product_model_type_id: baseInfo.belongProductTypeID, // 产品类型id
              product_model_genre: baseInfo.belongProductModelType,  // 产品型号
              product_model_id: baseInfo.belongProductModelTypeID, // 产品id
              product_polar: baseInfo.selectedPolarity, // 产品极性
              craft_control_workstep_creation_staff: baseInfo.staffName, // 工步创建人员
              craft_control_workstep_creation_staff_id: baseInfo.staffID, // 工步创建人员ID
              craft_control_workstep_describle: baseInfo.comment, // 工步备注
              workstepParameterList: stepParameter(), // 工步参数
              useMaterielList: materialParam // 使用物料
            },
            processDescribleStrs: processDescribe(), // 工步过程说明
          }

          return bodyParam
        }
      },
      watch: {
      },
      methods: {
        // 存储参数类型
        saveValueType (value, index) {
          this.stepParam[index].selectedValueType = value
        },
        // 存储固定值
        saveFixedValue (value, index) {
          this.stepParam[index].fixedValue = value
        },
        // 存储范围值
        saveScopeValue (value, index) {
          this.stepParam[index].scopeValue.minValue = value.minValue
          this.stepParam[index].scopeValue.maxValue = value.maxValue
        },
        // 存储浮动值
        saveFloatValue (value, index) {
          this.stepParam[index].fixedValue = value.value
          this.stepParam[index].floatScopeValue = value.floatScopeValue
        },
        // 添加过程描述行
        addProcessDetailRow () {
          let rowData = {
            no: this.processDetailRowIndex,
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
        // 公共模态框显示
        commonModalShow (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config)
        },
        // 选取工步后执行存储
        getSelectedStepParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            this.baseInfo.stepName = data.stepName
            this.baseInfo.stepID = data.ID
            this.baseInfo.stepNumber = data.stepNumber
          })
        },
        // 查询工步版本号是否重复
        isRrepeatStepVersion (stepID, stepVersion) {
          const url = queryStepVersionsUrl
          const reqInit = {
            body: {
              type: 'isExist',
              stepBasicsId: stepID,
              versionsNumber: stepVersion,
              headNum: 1
            }
          }
          mesReq(url, reqInit).then((data) => {
            if (data.null !== null) {
              this.baseInfo.isRepeatStepVersion = false
            }
            else {
              this.info.isRepeatStepVersion = true
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
            this.baseInfo.belongProductModelType = data.product_model_genre
            this.baseInfo.belongProductModelTypeID = data.product_model_id
          })
        },
        // 选取员工参数后执行存储
        getSelectedStaffParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            this.baseInfo.staffName = data.role_staff_name
            this.baseInfo.staffID = data.role_staff_id
          })
        },
        // 选取标准参数后执行存储
        getSelectedStandardParameterParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            const stepParam = {
              ID: '',
              paramName: '',
              selectedValueType: 'fixedValue',
              specifications: '',
              unit: '',
              fixedValue: 0,
              scopeValue: {
                minValue: 0,
                maxValue: 0
              },
              floatScopeValue: 0,
              devicesTypeID: ''
            }

            stepParam.ID = data.standardParameterList[0].craft_control_workstep_id
            stepParam.standardParameterId = data.standardParameterList[0].standard_parameter_id
            stepParam.paramName = data.standardParameterList[0].standard_parameter_name
            stepParam.unit = data.standardParameterList[0].standardParameterUnitList
            stepParam.specifications = data.standardParameterList[0].standard_parameter_specifications
            this.stepParam.push(stepParam)
          })
        },
        // 删除标准参数行
        deleteStandardParamRow (index) {
          this.stepParam.splice(index, 1)
        },
        // 选取物料参数后执行存储
        getSelectedMaterialParam (modalName, config) {
          window.commonModal.commonModalMediumVM.modalShow(modalName, config).then((data) => {
            console.log(data)
            const itemParam = {
              craft_materiel_name: data.warehouse_material_name, // 使用物料名
              craft_materiel_specifications: data.warehouse_material_standard, // 规格
              craft_materiel_model: data.warehouse_material_model, // 型号
              craft_materiel_value: 0, // 值
              craft_materiel_unit: data.warehouse_material_units, // 单位
              craft_materiel_order: this.materialParam.length + 1, // 顺序
              craft_materiel_id: data.warehouse_material_id, // 使用物料id
            }
            this.materialParam.push(itemParam)
          })
        },
        // 删除物料参数行
        deleteMaterialParamRow (index) {
          this.materialParam.splice(index, 1)
        },
        // 选取设备类型参数后执行存储
        getDevicesTypeOptionData () {
          const URL = queryDevicesTypesUrl
          const reqInit = {
            body: {
            }
          }
          const reqConfig = {
            panel: this.$refs.panel
          }
          mesReq(URL, reqInit, reqConfig).then((data) => {
            this.tableData = []
            const map = data.map
            const dataList = map.devices_control_devices_type
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.devicesTypeOption.push(rowData)
            }
          })
        },
        // 存储工步数据到服务器
        saveStepDataToServer (bodyParam) {
          console.log(bodyParam)
          const reqInit = {
            body: bodyParam
          }
          const reqConfig = {
            type: 'json'
          }
          const url = saveStepUrl
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
        this.getDevicesTypeOptionData()
        localVuex.$on('saveStepDataToTemplate', stepData => {
          const map = stepData.map
          const baseInfo = map.workstepList[0]
          const processDescribleList = baseInfo.processDescribleList
          const useMaterielList = baseInfo.useMaterielList
          const workstepParameterList = baseInfo.workstepParameterList
          this.baseInfo = {
            stepName: baseInfo.craft_control_workstep_name,
            stepID: baseInfo.craft_control_workstep_id,
            stepNumber: baseInfo.craft_control_workstep_num,
            stepVersion: baseInfo.craft_control_workstep_version,
            isRepeatStepVersion: true,
            belongProductTypeName: baseInfo.product_type_name,
            belongProductTypeID: baseInfo.product_model_type_id,
            belongProductModelType: baseInfo.product_model_genre,
            belongProductModelTypeID: baseInfo.product_model_id,
            polarityParam: ['正极', '负极'],
            selectedPolarity: baseInfo.product_polar,
            staffName: baseInfo.craft_control_workstep_creation_staff,
            staffID: baseInfo.craft_control_workstep_creation_staff_id,
            comment: baseInfo.craft_control_workstep_describle
          }

          // 工步参数
          this.stepParam = []
          for (const [index, item] of workstepParameterList.entries()) {
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
                  return ''
                  break;
              }
            }
            const itemParam = {
              standardParameterId: item.standard_parameter_id,
              ID: item.craft_workstep_parameter_id,
              paramName: item.craft_workstep_parameter_name,
              selectedValueType: valueType(item.craft_workstep_parameter_value_type),
              specifications: item.standard_parameter_specifications,
              unit: [
                {
                  parameter_unit: item.workstep_parameter_unit
                }
              ],
              selectedUnit: item.workstep_parameter_unit,
              fixedValue: item.workstep_parameter_constant_value,
              scopeValue: {
                minValue: item.workstep_parameter_minimum_value,
                maxValue: item.workstep_parameter_max_value
              },
              floatScopeValue: item.workstep_parameter_error_value,
              devicesTypeID: item.devices_control_devices_type_id
            }
            this.stepParam.push(itemParam)
          }

          // 物料参数
          this.materialParam = []
          for (const [index, item] of useMaterielList.entries()) {
            const itemParam = {
              craft_materiel_name: item.craft_materiel_name,
              craft_materiel_specifications: item.craft_materiel_specifications,
              craft_materiel_model: item.craft_materiel_model,
              craft_materiel_value: item.craft_materiel_value,
              craft_materiel_unitList: [
                {
                  parameter_unit: item.craft_materiel_unit
                }
              ],
              craft_materiel_unit: item.craft_materiel_unit,
              craft_materiel_order: item.craft_materiel_order,
              craft_materiel_id: item.craft_materiel_id
            }
            this.materialParam.push(item)
          }

          // 工序参数
          this.processDetail = []
          for (const [index, item] of processDescribleList.entries()) {
            const itemParam = {
              no: index + 1,
              matter: item.proceeding,
              detail: item.explain
            }
            this.processDetail.push(itemParam)
          }
        })
      },
      components: {
        fixedValue: Vue.component('mes-fixed-value-input'),
        scopeValue: Vue.component('mes-scope-value-input'),
        floatValue: Vue.component('mes-float-value-input'),
      },
      template: `
        <div class="modal fade" id="addStepModal">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">新增工步</h4>
              </div>
              <div class="modal-body">
                <ul class="nav nav-tabs">
                  <li class="active">
                    <a href="#addStepModalBasic" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>基础信息</a>
                  </li>
                  <li>
                    <a href="#addStepModalParam" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>工步参数</a>
                  </li>
                  <li>
                    <a href="#addStepModalMaterial" data-toggle="tab"><i style="color:red">*&nbsp;&nbsp;</i>使用物料</a>
                  </li>
                  <li>
                    <a href="#addStepModalDetails" data-toggle="tab">过程说明</a>
                  </li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane active" id="addStepModalBasic">
                    <div class="panel panel-default relative">
                      <div class="panel-body">
                        <form class="form-inline form-table">
                          <div class="row">
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工步名称</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  readonly
                                  v-model="baseInfo.stepName"
                                >
                                <a
                                  @click="getSelectedStepParam('queryStepNameModal')"
                                  class="input-btn"
                                  title="查询工步名称"
                                  href="javascript:;"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工步编号</label>
                                <input
                                 type="text"
                                 class="form-control"
                                 readonly
                                 v-model="baseInfo.stepNumber"
                                >
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div
                                :class="{'form-group': true, 'pull-right': true, 'has-error': baseInfo.isRepeatStepVersion}"
                              >
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>工步版本号</label>
                                <input
                                 type="text"
                                 class="form-control"
                                 placeholder="选择工步后再输入"
                                 v-model="baseInfo.stepVersion"
                                 @change="isRrepeatStepVersion(baseInfo.stepID, baseInfo.stepVersion)"
                                >
                                <a
                                  class="input-btn"
                                  href="javascript:;"
                                  title="查询工步历史版本"
                                  @click="commonModalShow('queryStepVersionModal', {ID: baseInfo.stepID})"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                                <span
                                  class="tip tip-error"
                                  v-show="baseInfo.isRepeatStepVersion"
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
                                  class="input-btn" href="javascript:;"
                                  @click="getSelectedProductNumberParam('queryProductnumberModal', {productTypeId: baseInfo.belongProductTypeID})"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group form-input-select pull-right">
                                <label class="control-label"><i style="color:red">*&nbsp;&nbsp;</i>极性</label>
                                <select
                                  class="form-control"
                                  v-model="baseInfo.selectedPolarity"
                                >
                                  <option
                                    v-for="(item, index) in baseInfo.polarityParam"
                                    :key="index"
                                    v-text="item"
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
                                  href="javascript:;"
                                  @click="getSelectedStaffParam('queryStaffInfoModal')"
                                >
                                  <i class="fa fa-search"></i>
                                </a>
                                -->
                              </div>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <div class="form-group form-input-select pull-right">
                                <label class="control-label">备注</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  v-model="baseInfo.comment"
                                >
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane" id="addStepModalParam">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                              type="button"
                              class="btn btn-primary"
                              @click="getSelectedStandardParameterParam('queryStandardParameterModal')"
                            >
                              <i class="fa fa-search"></i>
                              添加工步参数
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
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 5%;">序号</th>
                            <th style="width: 15%;">参数名称</th>
                            <th style="width: 10%;">取值类型</th>
                            <th style="width: 25%;">值</th>
                            <th style="width: 10%;">单位</th>
                            <th style="width: 15%;">设备类型</th>
                            <th style="width: 10%;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in stepParam"
                          >
                            <td
                              v-text="index + 1"
                            >
                            </td>
                            <td
                              v-text="item.paramName"
                            >
                            </td>
                            <mes-value-type-select
                              @selectedValueTypeEvent="saveValueType"
                              :now-index="index"
                              :template-selected-value-type="item.selectedValueType"
                            >
                            </mes-value-type-select>
                            <component
                              :is="item.selectedValueType"
                              :now-index="index"
                              :default-value="{
                                fixedValue: item.fixedValue,
                                minValue: item.scopeValue.minValue,
                                maxValue: item.scopeValue.maxValue,
                                floatScopeValue: item.floatScopeValue
                              }"
                              @saveFixedValue="saveFixedValue"
                              @saveScopeValue="saveScopeValue"
                              @saveFloatValue="saveFloatValue"
                            >
                            </component>
                            <td
                              class="table-input-td"
                            >
                              <select
                                class="form-control"
                                v-model="stepParam[index].selectedUnit"
                              >
                                <option
                                  disabled
                                  value=""
                                  v-text="'选择单位'"
                                >
                                </option>
                                <option
                                  v-for="(item, index) in stepParam[index].unit"
                                  :key="index"
                                  :value="item.parameter_unit"
                                  v-text="item.parameter_unit"
                                >
                                </option>
                              </select>
                            </td>
                            <td
                              class="table-input-td"
                            >
                              <select
                                class="form-control"
                                v-model="stepParam[index].devicesTypeID"
                              >
                                <option
                                  disabled
                                  value=""
                                  v-text="'设备类型'"
                                >
                                </option>
                                <option
                                  v-for="(item, index) in devicesTypeOption"
                                  :key="index"
                                  :value="item.devices_control_devices_type_id"
                                  v-text="item.devices_control_devices_type_name"
                                >
                                </option>
                              </select>
                            </td>
                            <td class="table-input-td">
                              <a
                                class="table-link text-danger"
                                href="javascript:;"
                                @click="deleteStandardParamRow(index)"
                              >
                                <i class="fa fa-trash-o fa-fw"></i>删除
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="addStepModalMaterial">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                              type="button"
                              class="btn btn-primary"
                              @click="getSelectedMaterialParam('queryMaterialStandardInfoModal')"
                            >
                              <i class="fa fa-search"></i>
                              添加物料
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
                            <th style="width: 20%;">名称</th>
                            <th style="width: 15%;">规格</th>
                            <th style="width: 15%;">型号</th>
                            <th style="width: 15%;">数量</th>
                            <th style="width: 10%;">单位</th>
                            <th style="width: 15%;">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(item, index) in materialParam"
                          >
                            <td
                              v-text="index + 1"
                            >
                            </td>
                            <td
                              v-text="item.craft_materiel_name"
                            >
                            </td>
                            <td
                              v-text="item.craft_materiel_specifications"
                            >
                            </td>
                            <td
                              v-text="item.craft_materiel_model"
                            >
                            </td>
                            <td class="table-input-td">
                              <input
                                type="text"
                                placeholder="请输入"
                                class="form-control"
                                v-model="item.craft_materiel_value"
                              >
                            </td>
                            <td
                              v-text="item.craft_materiel_unit"
                            >
                            </td>
                            <td class="table-input-td">
                              <a
                                class="table-link text-danger"
                                href="javascript:;"
                                @click="deleteMaterialParamRow(index)"
                              >
                                <i class="fa fa-trash-o fa-fw"></i>删除
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="tab-pane" id="addStepModalDetails">
                    <div class="panel panel-default relative">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                            <button
                            type="button"
                            class="btn btn-primary"
                            @click="addProcessDetailRow"
                            >
                              <i class="fa fa-plus fa-fw"></i>
                              添加行
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
                      @click="saveStepDataToServer(savaAddStepBodyParam)"
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
  addStep()
})