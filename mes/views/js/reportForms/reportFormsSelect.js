
/**
* @description 选择工序模态框(单选)
*/
function selectProcessModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'vague', keyword: '', status: 0 },//搜索参数
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('commonModal3')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })

    },
    methods: {
      //加载数据
      queryFun(data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryWorkstageBasicsUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.workstageBasicsList
              this.lines = result.map.count
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
        this.searchData.keyword = this.searchDataInput
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="commonModal3">
				<div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">选择工序</h4>
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
                                  <th style="width: 40%;">工序名称</th>
                                  <th style="width: 40%;">工序编号</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="choice(value, index)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.workstage_name">
                                  </td>
                                  <td v-text="value.workstage_number">
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择半成品模态框(单选)
*/
function selectSemiFinishModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
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
      const modal = document.getElementById('commonModal3')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })
      // $(modal).on('hidden.bs.modal', function (e) {
      //   $('body').addClass('modal-open')
      // })
    },
    methods: {
      //加载数据
      queryFun(data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: querySemiFinishedProductModelUrl,
          data: data,
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
      choice(value, index) {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="commonModal3">
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
                                    @click="choice(value, index)"
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择物料模态框(单选)
*/
function selectMaterialModal(resolve, searchType) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        searchType: searchType,
        loading: false,  //loading加载
        searchData: { headNum: 1, type: searchType, key: '', value: '' },//搜索参数
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('commonModal3')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })

    },
    methods: {
      //加载数据
      queryFun(data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryMaterialsUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              if (searchType === 'info') {

                // result.map.materials.forEach((value,index) => {
                //   let tempObj = {
                //     warehouse_material_batch: '',
                //     material: value
                //   }
                //   this.tbodyData.push(tempObj)
                // });
                this.tbodyData = result.map.materials
                this.lines = result.map.materialInfoLine
              } else if (searchType === 'record') {
                this.tbodyData = result.map.materialRecords
                this.lines = result.map.materialRecordLines
              }

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
        this.searchData.key = 'keyWord'
        this.searchData.value = this.searchDataInput
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="commonModal3">
				<div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title" v-text="searchType === 'info' ? '选择物料' :'选择物料批次' "></h4>
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
                                    <th style="width: 8%;">序号</th>
                                    <th style="width: 20%;">物料名称</th>
                                    <th style="width: 15%;">规格</th>
                                    <th style="width: 15%;">型号</th>
                                    <th style="width: 20%;" v-if="searchType === 'record' ">批次</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="choice(value, index)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.warehouse_material_name" v-if="searchType === 'info' ">
                                  </td>
                                  <td v-text="value.warehouse_material_standard" v-if="searchType === 'info' ">
                                  </td>
                                  <td v-text="value.warehouse_material_model" v-if="searchType === 'info' ">
                                  </td>

                                  <td  v-if="searchType === 'record' ">
                                  {{value.material ? value.material.warehouse_material_name : ''}}
                                  </td>
                                  <td v-text="value.material ? value.material.warehouse_material_standard : ''" v-if="searchType === 'record' ">
                                  </td>
                                  <td v-text="value.material ? value.material.warehouse_material_model : ''" v-if="searchType === 'record' ">
                                  </td>
                                  <td v-text="value.material ? value.warehouse_material_batch : ''" v-if="searchType === 'record' ">
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择电池型号模态框(单选)
*/
function selectBatterylModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, productName: '' },//搜索参数
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('commonModal3')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })

    },
    methods: {
      //加载数据
      queryFun(data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryProductInfosUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.products
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
        this.searchData.productName = this.searchDataInput
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="commonModal3">
				<div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">选择电池型号</h4>
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
                                    <th style="width: 30%;">电池名称</th>
                                    <th style="width: 20%;">电池型号</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="choice(value, index)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.warehouse_product_name">
                                  </td>
                                  <td v-text="value.warehouse_product_size">
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择设备类型模态框(单选)
*/
function selectDevicesTypeModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#selectDevicesTypeModal',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'all', keyWord: '' },//搜索参数
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 100,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('selectDevicesTypeModal')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })
     
    },
    methods: {
      //加载数据
      queryFun(data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryDevicesTypesUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.devices_control_devices_type
              this.lines = result.map.devices_control_devices_type.length
            }
            else {
              this.tbodyData = []
              this.lines = 0

            }

          },

        })

      },

      // 模糊搜索
      // search() {
      //   this.currenPage = 1
      //   this.searchData.type = 'key'
      //   this.searchData.keyWord = this.searchDataInput
      //   this.queryFun(this.searchData)
      // },
      //选择后执行的操作
      choice(value, index) {
        const modal = $(document.getElementById('selectDevicesTypeModal'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="selectDevicesTypeModal">
				<div class="modal-dialog">
            <div class="modal-content" >
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">选择设备类型</h4>
              </div>
              <div class="modal-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-6">
                                  <h5 class="panel-title">设备类型</h5>
                            </div>
                            <div class="col-xs-6">
                              <form class="form-inline pull-right" onsubmit="return false;">
                                      <!--<div class="input-group input-group-sm ">
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
                                      </div>-->
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
                                  <th style="width: 80%;">设备类型</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="choice(value, index)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.devices_control_devices_type_name">
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择设备模态框(单选)
*/
function selectDevicesModal(resolve,id,name) {
  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'all', keyWord: '', typeId:id},//搜索参数
        devicesName:name,
        tbodyData: [],  //表格数据
        searchDataInput: '',//搜索框的数据
        lines: 0,     //总条数
        pagesize: 10,   //页码
        currenPage: 1   //当前页
      }
    },
    //弹出模态框
    mounted() {
      const modal = document.getElementById('commonModal3')   //模态框
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
      //加载数据
      queryFun(data) {
        if(data.typeId !== ''){
          data.type = 'typeId'
        }
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryDevicesUrl,
          data: data,
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

      // 模糊搜索
      search() {
        this.currenPage = 1
        this.searchData.type = 'key'
        this.searchData.keyWord = this.searchDataInput
        this.queryFun(this.searchData)

      },
      //选择后执行的操作
      choice(value, index) {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(value)  //返回数据
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
 			<div class="modal fade" id="commonModal3">
				<div class="modal-dialog">
            <div class="modal-content" >
              <div class="modal-header">
                <button class="close" data-dismiss="modal">
                  <span>
                    <i class="fa fa-close"></i>
                  </span>
                </button>
                <h4 class="modal-title">选择设备</h4>
              </div>
              <div class="modal-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-sm-12">
                      <div class="panel panel-default">
                        <div class="panel-heading panel-heading-table">
                          <div class="row">
                            <div class="col-xs-6">
                                  <h5 class="panel-title" v-show="devicesName !== ''">{{devicesName + '类型下的设备'}}</h5>
                            </div>
                            <div class="col-xs-6">
                              <form class="form-inline pull-right" onsubmit="return false;">
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
                                  <th style="width: 40%;">设备名称</th>
                                  <th style="width: 40%;">设备编号</th>

                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                    v-show="tbodyData.length"
                                    v-for="(value, index) in tbodyData"
                                    :key="index"
                                    @click="choice(value, index)"
                                    style="cursor:pointer"
                                  >
                                  <td v-text="index + 1">
                                  </td>
                                  <td v-text="value.devices_control_devices_name">
                                  </td>
                                  <td v-text="value.devices_control_devices_number">
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
  panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

}

/**
* @description 选择生产计划批次模态框(单选)
*/
function batchNumberModal(resolve){
  const swiper = document.getElementsByTagName('body')  //右侧外部swiper
  var mesloadBox = new MesloadBox(swiper, {
      // 主数据载入窗口
      warningContent: '没有此类信息，请重新选择或输入'
  })

  let batchNumberModel  = new Vue({
      el:'#batchNumberModel',
      data() {
          return {
              models:false,
              checked:[],
              dataList:[], //遍历数据
              tsDataList:[], //分页暂存数据
              lines:0, //条数
              search:'', //搜索框值
              currenPage:1, //当前页
              pagesize: 10,   //页码
              ajaxData:{type:'production',productionStatus:'complete',headNum:1}
          }
      },
      created(){
          this.queryFun()
      },
      mounted(){
          const modal = document.getElementById('batchNumberModel')   //模态框
          $(modal).modal({
              backdrop: 'static', // 黑色遮罩不可点击
              keyboard: false,  // esc按键不可关闭模态框
              show: true     //显示
          })
      },
      methods:{
        queryFun(){
            //循环查询已经选择的
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryDraftPlanOutlineUrl,
              data:this.ajaxData,
              beforeSend: function (xml) {
                  // ajax发送前
                  mesloadBox.loadingShow()
              },
              success:  (result, status, xhr) => {
                  mesloadBox.hide()
                  if(result.status === 0 ){
                      this.dataList = result.map.plans
                      this.lines = result.map.line
                      // this.dataList = pagination(1, this.pagesize, this.tsDataList)
                  }
              }
          })
        },
        choice(val, index){
            const modal = $(document.getElementById('batchNumberModel'))   //模态框
            modal.modal('hide')
            resolve(this.dataList[index])
        },

        //分页变化
        handleCurrentChange(val){
          // this.dataList = pagination(val, this.pagesize, this.tsDataList)
          let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
          this.currenPage = val
          this.ajaxData.headNum = headNum
          this.queryFun()
        },
      },
      template:`
      <div class="modal fade" id="batchNumberModel">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <button class="close" data-dismiss="modal">
                          <span>
                              <i class="fa fa-close"></i>
                          </span>
                      </button>
                      <h4 class="modal-title">生产计划批次</h4>
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
                                                  <!--<div class="input-group input-group-sm fuzzy-search-group">
                                                      <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                      <div class="input-group-btn" @click="searchs()">
                                                          <button type="button" class="btn btn-primary">
                                                              <i class="fa fa-search"></i>
                                                          </button>
                                                      </div>
                                                  </div>-->
                                              </form>
                                          </div>
                                      </div>
                                      <div class="table-height-10">
                                          <table class="table table-bordered table-hover">
                                              <thead>
                                                  <tr>
                                                      <th style="width: 10%">序号</th>
                                                      <th style="width: 80%">生产批号</th>

                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr v-for="(val,index) in dataList" @click="choice(val, index)" >
                                                      <td>{{index+1}}</td>
                                                      <td>{{val.production_plan_batch_number}}</td>

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
* @description 选择车间模态框(单选)
*/
function workshopModel(resolve){
  const swiper = document.getElementsByTagName('body')  //右侧外部swiper
  var mesloadBox = new MesloadBox(swiper, {
      // 主数据载入窗口
      warningContent: '没有此类信息，请重新选择或输入'
  })
  let workshopModel  = new Vue({
      el:'#workshopModel',
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
                  workshopName: '',
                  headNum: 1
              }
          }
      },
      methods:{
          workshopAjax(){
              $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryWorkshopsUrl,
                  data:this.ajaxData,
                  beforeSend: function (xml) {
                      // ajax发送前
                      mesloadBox.loadingShow()
                  },
                  success:  (result, status, xhr) => {
                      mesloadBox.hide()
                      if(result.status === 0 ){
                          this.dataList = result.map.workshopInfos
                          this.lines = result.map.lines
                      }else{
                          this.dataList = []
                          this.lines = 0
                      }
                  }
              })
          },
          choice(val, index){
              const modal = $(document.getElementById('workshopModel'))   //模态框
              modal.modal('hide')
              resolve(this.dataList[index])
          },
          //分页变化
          handleCurrentChange(val){
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              this.workshopAjax()
          },
          //搜索框
          searchs(){
              this.ajaxData.workshopName = this.search
              this.currenPage = 1
              this.workshopAjax()
          }
      },
      created(){
          this.workshopAjax()
      },
      mounted(){
          const modal = document.getElementById('workshopModel')   //模态框
          $(modal).modal({
              backdrop: 'static', // 黑色遮罩不可点击
              keyboard: false,  // esc按键不可关闭模态框
              show: true     //显示
          })

      },

      template:`
      <div class="modal fade" id="workshopModel">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <button class="close" data-dismiss="modal">
                          <span>
                              <i class="fa fa-close"></i>
                          </span>
                      </button>
                      <h4 class="modal-title">车间</h4>
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
                                          <table class="table table-bordered table-hover">
                                              <thead>
                                                  <tr>
                                                      <th style="width: 10%">序号</th>
                                                      <th style="width: 80%">车间</th>

                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr v-for="(val,index) in dataList" @click="choice(val, index)">
                                                      <td>{{index+1}}</td>
                                                      <td>{{val.role_workshop_name}}</td>

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
* @description 选择工序模态框(单选)
*/
function workstageModal(resolve, url, data, name){
  const swiper = document.getElementsByTagName('body')  //右侧外部swiper
  var mesloadBox = new MesloadBox(swiper, {
      // 主数据载入窗口
      warningContent: '没有此类信息，请重新选择或输入'
  })

  let workstageModal  = new Vue({
      el:'#workstageModal',
      data() {
          return {
              models:false,
              checked:[],
              dataList:[], //遍历数据
              lines:0, //条数
              search:'', //搜索框值
              currenPage:1, //当前页
              pagesize: 10,   //页码
              ajaxData:data,
              workshopName:name
          }
      },
      methods:{
          workshopAjax(){
              $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: url,
                  data:this.ajaxData,
                  beforeSend: function (xml) {
                      // ajax发送前
                      mesloadBox.loadingShow()
                  },
                  success:  (result, status, xhr) => {
                      mesloadBox.hide()
                      if(result.status === 0 ){
                          if(this.ajaxData.type == 'vague'){
                              this.dataList = result.map.workstageBasicsList
                              this.lines = result.map.count
                          }else{
                              this.dataList = result.map.workstages
                              this.lines = result.map.lines
                          }

                      }else{
                          this.dataList = []
                          this.lines = 0
                      }
                  }
              })
          },
          choice(val, index){
              const modal = $(document.getElementById('workstageModal'))   //模态框
              modal.modal('hide')
              resolve(this.dataList[index])
          },
          //分页变化
          handleCurrentChange(val){
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              this.workshopAjax()
          },
          //搜索框
          searchs(){
              this.ajaxData.keyword = this.search
              this.currenPage = 1
              this.workshopAjax()
          }
      },
      created(){
          this.workshopAjax()
      },
      mounted(){
          const modal = document.getElementById('workstageModal')   //模态框
          $(modal).modal({
              backdrop: 'static', // 黑色遮罩不可点击
              keyboard: false,  // esc按键不可关闭模态框
              show: true     //显示
          })

      },

      template:`
      <div class="modal fade" id="workstageModal">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <button class="close" data-dismiss="modal">
                          <span>
                              <i class="fa fa-close"></i>
                          </span>
                      </button>
                      <h4 class="modal-title">工序</h4>
                  </div>
                  <div class="modal-body">
                      <div class="container-fluid">
                          <div class="row">
                              <div class="col-sm-12">
                                  <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-6">
                                            <h5 class="panel-title" v-show="workshopName !== ''">{{workshopName + '下的工序'}}</h5>
                                          </div>
                                          <div class="col-xs-6">
                                              <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                  <div class="input-group input-group-sm fuzzy-search-group" v-if="ajaxData.type == 'vague'">
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
                                      </div>
                                      <div class="table-height-10">
                                          <table class="table table-bordered table-hover">
                                              <thead>
                                                  <tr>
                                                      <th style="width: 10%">序号</th>
                                                      <th style="width: 80%">工序</th>

                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr v-for="(val,index) in dataList" @click="choice(val, index)">
                                                      <td>{{index+1}}</td>
                                                      <td>{{val.workstage_name}}</td>

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
  * @description 选人模态框(单选)
 */
function peopleModel(resolve, url, data) {
  const swiper = document.getElementsByTagName('body')  //右侧外部swiper
  var mesloadBox = new MesloadBox(swiper, {
    // 主数据载入窗口
    warningContent: '没有此类信息，请重新选择或输入'
  })
  function queryFun(url, data) {
    $.ajax({
      type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
      url: url,
      data: data,
      beforeSend: function (xml) {
        // ajax发送前
        mesloadBox.loadingShow()
      },
      success: function (result, status, xhr) {
        mesloadBox.hide()
        if (result.status === 0) {
          Vue.set(staffModel, 'dataList', result.map.staffs)
          Vue.set(staffModel, 'lines', result.map.lines)
        } else {
          Vue.set(staffModel, 'dataList', [])
          Vue.set(staffModel, 'lines', 0)
        }
      }
    })
  }
  let staffModel = new Vue({
    el: '#staffModel',
    data() {
      return {
        models: false,
        checked: [],
        dataList: [], //遍历数据
        lines: 0, //条数
        search: '', //搜索框值
        currenPage: 1, //当前页
        pagesize: 10,   //页码
        ajaxData: {
          type: 'info',
          staffName: '',
          headNum: 1
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryStaffUrl,
        data: { type: 'info', headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.staffs
            this.lines = result.map.lines
          }
        }
      })

    },
    mounted() {
      const modal = document.getElementById('staffModel')   //模态框
      $(modal).modal({
        backdrop: 'static', // 黑色遮罩不可点击
        keyboard: false,  // esc按键不可关闭模态框
        show: true     //显示
      })

    },
    methods: {
      choice(val, index) {
        const modal = $(document.getElementById('staffModel'))   //模态框
        modal.modal('hide')
        resolve(this.dataList[index])
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryStaffUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.staffName = this.search
        this.currenPage = 1
        queryFun(queryStaffUrl, this.ajaxData)
      }
    },
    template: `
            <div class="modal fade" id="staffModel" style="z-index:10000">
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
                                                <table class="table table-bordered table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th style="width: 10%">序号</th>
                                                            <th style="width: 80%">人员名称</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.role_staff_name}}</td>

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
