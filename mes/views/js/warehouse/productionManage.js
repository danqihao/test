window.addEventListener('load', (event) => {
  const localVuex = new Vue()

  // 新增产品按钮
  const addProductionBtn = document.querySelector('#warehouseManagement2-1-1 .head-main-btn-1')
  // 新增产品模态框
  const addProductionModal = document.querySelector('#addProductionModal')
  // 修改产品模态框
  const modifyProductionModal = document.querySelector('#modifyProductionModal')

  // 导入物料信息按钮
  const importMaterialInfoBtn = document.getElementById('importMaterialInfo')
  // 导入物料信息模态框
  const importMaterialInfoModal = document.querySelector('#importMaterialInfoModal')

  // 添加成品
  addProductionBtn.addEventListener('click', event => {
    localVuex.$emit('showAddProductionModal')
  })
  let addProductionModalVM = new Vue({
    el: addProductionModal.querySelector('.modal-dialog'),
    data: {
      productName: '', //成品名称
      productModelId: '', //电芯型号
      productSize: '', //电芯尺寸(直径/高度)
      productCapacity: '', //电芯容量(mAh)
      productResistance: '', //电芯内阻(MaxmΩ)
      productVoltage: '', //电芯电压(v)
      productK: '', //电芯K值(mV/d)
      productShelfLife: '', //保质期
      productionTypeList: null
    },
    watch: {
    },
    methods: {
      // 显示添加成品模态框
      showAddProductionModal (options) {
        $(addProductionModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(addProductionModal).modal('show')
      },
      // 保存成品
      saveAddProductionModal () {
        // this.productShelfLife = new Date(expirationDateValue).getTime()
        const reqInit = {
          body: {
            productName: this.productName, //成品名称
            productModelId: this.productModelId, //电芯型号
            productSize: this.productSize, //电芯尺寸(直径/高度)
            productCapacity: this.productCapacity, //电芯容量(mAh)
            productResistance: this.productResistance, //电芯内阻(MaxmΩ)
            productVoltage: this.productVoltage, //电芯电压(v)
            productK: this.productK, //电芯K值(mV/d)
            productShelfLife: this.productShelfLife //保质期
          }
        }
        const reqConfig = {}
        const url = BASE_PATH + '/' + 'saveProductInfos.do'
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
      },
      // 查询成品型号
      fatchProductionTypeId () {
        const reqInit = {
          body: {
            productModelId: '',
            productModelName: '',
            headNum: 1
          }
        }
        const reqConfig = {}
        const url = BASE_PATH + '/' + 'queryProductModels.do'
        mesReq(url, reqInit, reqConfig).then((data) => {
          this.productionTypeList = data.map.productModels
        })
      }
    },
    mounted () {
      // 显示添加成品模态框
      localVuex.$on('showAddProductionModal', this.showAddProductionModal)

      // 获取成品型号
      this.fatchProductionTypeId()
    },
    components: {},
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">新增成品</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#addProductionPlanBasic" data-toggle="tab">基础信息</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="addProductionPlanBasic">
                <div class="panel panel-default relative">
                  <div class="panel-body">
                    <form class="form-inline form-table">
                      <div class="row">
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">成品名称（必填）</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productName"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯型号（必填）</label>
                            <select
                              class="form-control"
                              v-model="productModelId"
                            >
                              <option
                                v-for="(value, index) in productionTypeList"
                                :key="index"
                                v-text="value.warehouse_product_model_name"
                                :value="value.warehouse_product_model_id"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯尺寸(直径/高度)（必填）</label>
                            <input
                              placeholder="只可输入数字"
                              type="number"
                              class="form-control"
                              v-model.number="productSize"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯容量(mAh)（必填）</label>
                            <input
                              type="number"
                              placeholder="只可输入数字"
                              class="form-control"
                              v-model.number="productCapacity"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯内阻(MaxmΩ)（必填）</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="只可输入数字"
                              v-model.number="productResistance"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯电压(v)（必填）</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="只可输入数字"
                              v-model.number="productVoltage"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯K值(mV/d)（必填）</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="只可输入数字"
                              v-model.number="productK"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">保质期(月)</label>
                            <input
                              type="number"
                              class="form-control"
                              placeholder="只可输入数字"
                              v-model.number="productShelfLife"
                              id="expirationDate"
                            >
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
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
                  @click="saveAddProductionModal"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 修改成品
  let modifyProductionModalVM = new Vue({
    el: modifyProductionModal.querySelector('.modal-dialog'),
    data: {
      serverProductionName: '',
      productId: '', //成品id
      productName: '', //成品名称
      productModelId: '', //电芯型号
      productSize: '', //电芯尺寸(直径/高度)
      productCapacity: '', //电芯容量(mAh)
      productResistance: '', //电芯内阻(MaxmΩ)
      productVoltage: '', //电芯电压(v)
      productK: '', //电芯K值(mV/d)
      productShelfLife: '', //保质期
      productionTypeList: null
    },
    watch: {
    },
    methods: {
      // 查询成品详情
      queryProductionInfo (productionId) {
        console.log(productionId)
        const reqInit = {
          body: {
            productId: productionId,
            productName: '',
            productModelId: '',
            headNum: 1
          }
        }
        const reqConfig = {}
        const url = BASE_PATH + '/' + 'queryProductInfos.do'
        mesReq(url, reqInit, reqConfig).then((data) => {
          currentRowData = data.map.products[0]
          this.productId = currentRowData.warehouse_product_id
          this.serverProductionName = currentRowData.warehouse_product_name
          this.productName = currentRowData.warehouse_product_name
          this.productModelId = currentRowData.productModel.warehouse_product_model_id
          this.productSize = currentRowData.warehouse_product_size
          this.productCapacity = currentRowData.warehouse_product_capacity
          this.productResistance = currentRowData.warehouse_product_resistance
          this.productVoltage = currentRowData.warehouse_product_voltage
          this.productK = currentRowData.warehouse_product_k
          this.productShelfLife = currentRowData.warehouse_product_shelf_life
        })
      },
      // 显示修改成品模态框
      showModifyProductionModal (productionId) {
        this.queryProductionInfo(productionId)
        $(modifyProductionModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(modifyProductionModal).modal('show')
      },
      // 保存成品
      saveAddProductionModal () {
        let reqInit = {
          body: {
            productId: this.productId, //成品id
            productName: this.productName, //成品名称
            productModelId: this.productModelId, //电芯型号
            productSize: this.productSize, //电芯尺寸(直径/高度)
            productCapacity: this.productCapacity, //电芯容量(mAh)
            productResistance: this.productResistance, //电芯内阻(MaxmΩ)
            productVoltage: this.productVoltage, //电芯电压(v)
            productK: this.productK, //电芯K值(mV/d)
            productShelfLife: this.productShelfLife //保质期
          }
        }
        if (reqInit.body.productName === this.serverProductionName) {
          reqInit.body.productName = ''
        }
        const reqConfig = {}
        const url = BASE_PATH + '/' + 'modifyProductInfo.do'
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
      },
      // 查询成品型号
      fatchProductionTypeId () {
        const reqInit = {
          body: {
            productModelId: '',
            productModelName: '',
            headNum: 1
          }
        }
        const reqConfig = {}
        const url = BASE_PATH + '/' + 'queryProductModels.do'
        mesReq(url, reqInit, reqConfig).then((data) => {
          this.productionTypeList = data.map.productModels
        })
      }
    },
    mounted () {
      // 显示添加成品模态框
      window.vuex.$on('showModifyAddProductionModal', this.showModifyProductionModal)

      // 获取成品型号
      this.fatchProductionTypeId()
    },
    components: {},
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">修改成品</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs">
              <li class="active">
                <a href="#addProductionPlanBasic" data-toggle="tab">基础信息</a>
              </li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane active" id="addProductionPlanBasic">
                <div class="panel panel-default relative">
                  <div class="panel-body">
                    <form class="form-inline form-table">
                      <div class="row">
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">成品名称</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productName"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯型号</label>
                            <select
                              class="form-control"
                              v-model="productModelId"
                            >
                              <option
                                v-for="(value, index) in productionTypeList"
                                :key="index"
                                v-text="value.warehouse_product_model_name"
                                :value="value.warehouse_product_model_id"
                              >
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯尺寸(直径/高度)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productSize"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯容量(mAh)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productCapacity"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯内阻(MaxmΩ)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productResistance"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯电压(v)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productVoltage"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">电芯K值(mV/d)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productK"
                            >
                          </div>
                        </div>
                        <div class="col-xs-6">
                          <div class="form-group pull-right">
                            <label class="control-label">保质期(月)</label>
                            <input
                              type="text"
                              class="form-control"
                              v-model="productShelfLife"
                              id="modifyProductionExpirationDate"
                            >
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
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
                  @click="saveAddProductionModal"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  // 导入excel物料信息
  importMaterialInfoBtn.addEventListener('click', event => {
    localVuex.$emit('showImportMaterialInfoModal')
  })

  // 录入物料信息
  let importMaterialInfoVM = new Vue({
    el: importMaterialInfoModal.querySelector('.modal-dialog'),
    data: {
      url: BASE_PATH + '/' + 'importMaterialExcel.do'
    },
    watch: {
    },
    methods: {
      // 显示添加成品模态框
      showImportMaterialInfoModal (options) {
        $(importMaterialInfoModal).modal({
          keyboard: false,
          backdrop: 'static'
        })
        $(importMaterialInfoModal).modal('show')
      },
      uploadFile () {
        const uploadFile = this.$refs.upload.uploadFiles
        console.log(uploadFile)
        const body = new FormData()
        uploadFile.forEach((value, index) => {
          body.append('file', value.raw)
          // body.append('fileName', value.raw)
          // body.append('fileName', 'C:\Users\Administrator\Desktop\物料表数据.xlsx')
        })

        const myInit = {
          mode: 'cors',
          method: 'POST',
          // header: {
          //   'Content-Type': 'application/vnd.ms-excel'
          // },
          body: body,
          credentials: 'include'
        }
        // const req = new Request(this.url, myInit)

        swal({
          title: '确定提交吗？',
          type: 'question',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          return new Promise((resolve, reject) => {
            mesReq(this.url, myInit).then((data) => {
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
                title: err.msg || '提交失败,一次只能上传一个文件,请删除多余的文件',
                type: 'error',
              })
            })
          })
        })
      }
    },
    mounted () {
      // 显示添加成品模态框
      localVuex.$on('showImportMaterialInfoModal', this.showImportMaterialInfoModal)
    },
    components: {},
    template: `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">添加物料信息</h4>
          </div>
          <div class="modal-body">
            <el-upload
              ref="upload"
              :action="url"
              :auto-upload="false"
              :with-credentials="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
            </el-upload>
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
                  @click="uploadFile"
                >
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
})