window.addEventListener('load', (event) => {
  // 中型模态框组件
  // 查询工步名称模态框
  Vue.component('mes-query-step-name-modal', {
    data () {
      return {
        URL: queryStepBasicsUrl,
        queryBarInit: {
          keyWord: true
        },
        bodyParam: {
          type: 'vague',
          stepBasicsId: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.counts
          const dataList = map.resultList
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = {
              ID: '',
              on: 0,
              stepName: '',
              stepNumber: '',
              description: ''
            }
            rowData.ID = value.craft_workstep_basics_id
            rowData.on = index + 1
            rowData.stepName = value.craft_workstep_basics_name
            rowData.stepNumber = value.craft_workstep_basics_num
            rowData.description = value.craft_workstep_basics_describle
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam !== undefined) {
          this.bodyParam.keyword = queryParam.keyword || ''
        }
        this.searchServerData()
        this.currentPage = 1
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
      <div class="modal-dialog modal-xm">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close" data-dismiss="modal">
              <span>
                <i class="fa fa-close"></i>
              </span>
            </button>
            <h4 class="modal-title">查询工步名称</h4>
          </div>
          <div class="modal-body">
            <div class="panel panel-default relative"
            ref="panel"
            >
              <div class="panel-heading panel-heading-table">
                <div class="row">
                  <div class="col-xs-4">
                    <!-- <button type="button" class="btn btn-primary">
                      <i class="fa fa-search"></i>
                      添加参数
                    </button> -->
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
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th style="width: 10%;">序号</th>
                    <th style="width: 15%;">工步名称</th>
                    <th style="width: 15%;">工步编号</th>
                    <th style="width: 30%;">描述</th>
                    <th style="width: 30%;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(value, key) in tableData"
                  >
                    <td
                      v-text="value.on"
                    >
                    </td>
                    <td
                      v-text="value.stepName"
                    >
                    </td>
                    <td
                      v-text="value.stepNumber"
                    >
                    </td>
                    <td
                      v-text="value.description"
                    >
                    </td>
                    <td class="table-input-td">
                      <a
                        href="javascript:;"
                        class="table-link"
                        @click="saveCurrentData(key)"
                      >
                        <i class="fa fa-plus fa-fw"></i>选择
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="panel-footer">
                <div class="pull-right">
                  <el-pagination
                    background
                    :page-size="pageSize"
                    layout="total, prev, pager, next"
                    :current-page.sync="currentPage"
                    :total="total"
                    @current-change="searchServerData"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })
  // 查询工步版本模态框
  Vue.component('mes-query-step-version-modal', {
    data () {
      return {
        URL: queryStepVersionsUrl,
        queryBarInit: {
          keyWord: true
        },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      bodyParam () {
        console.log(this.config)
        return {
          type: 'history',
          stepBasicsId: this.config.ID,
          versionsNumber: '',
          headNum: 1
        }
      }
    },
    methods: {
      searchServerData (curryPage) {
        console.log(this.bodyParam)
        if (curryPage !== undefined) {
          this.bodyParam.headNum = ((curryPage - 1) * 10) + 1
        }
        const reqInit = {
          body: this.bodyParam
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.counts
          const dataList = map.worksteps
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      }
    },
    watch: {
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询工步历史版本</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">工步名称</th>
                  <th style="width: 20%;">工步编号</th>
                  <th style="width: 50%;">描述</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
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
                    v-text="value.craft_control_workstep_describle"
                  >
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="panel-footer panel-footer-table">
              <div class="pull-right">
                <el-pagination
                  background
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="total"
                  @current-change="searchServerData"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  // 查询工序模态框
  Vue.component('mes-query-process-modal', {
    data () {
      return {
        URL: queryWorkstageBasicsUrl,
        queryBarInit: {
          keyWord: true
        },
        bodyParam: {
          type: 'vague',
          productModelId: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.count
          const dataList = map.workstageBasicsList
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = {
              ID: '',
              on: 0,
              processName: '',
              processNumber: '',
              description: ''
            }
            rowData.ID = value.workstage_basics_id
            rowData.on = index + 1
            rowData.processName = value.workstage_name
            rowData.processNumber = value.workstage_number
            rowData.description = value.workstage_basics_describe
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam !== undefined) {
          this.bodyParam.keyword = queryParam.keyword || ''
          this.bodyParam.headNum = ((queryParam.headNum - 1) * 10) + 1 || 1
        }
        this.searchServerData()
        this.currentPage = 1
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      // 添加数据
      this.searchBarQuery()
    },
    template: `
    <div class="modal-dialog modal-xm">
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
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">工序名称</th>
                  <th style="width: 15%;">工序编号</th>
                  <th style="width: 30%;">描述</th>
                  <th style="width: 30%;">操作</th>
                </tr>
              </thead>
              <tbody

              >
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="value.on"
                  >
                  </td>
                  <td
                    v-text="value.processName"
                  >
                  </td>
                  <td
                    v-text="value.processNumber"
                  >
                  </td>
                  <td
                    v-text="value.description"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询产品类型模态框
  Vue.component('mes-query-product-type-modal', {
    data () {
      return {
        URL: queryProductTypeUrl,
        queryBarInit: {
          keyWord: true
        },
        bodyParam: {
          type: 'vague',
          productTypeId: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.lines
          const dataList = map.productTypes
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
          console.log(this.tableData)
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam !== undefined) {
          this.bodyParam.keyword = queryParam.keyword || ''
        }
        this.searchServerData()
        this.currentPage = 1
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      // 添加数据
      this.searchBarQuery()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询产品类型</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">类型名称</th>
                  <th style="width: 15%;">编号</th>
                  <th style="width: 30%;">描述</th>
                  <th style="width: 30%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.product_type_name"
                  >
                  </td>
                  <td
                    v-text="value.product_type_number"
                  >
                  </td>
                  <td
                    v-text="value.product_type_describe"
                  >
                  </td>
                  <td
                    class="table-input-td"
                  >
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询产品类型下的产品型号模态框
  Vue.component('mes-query-product-number-modal', {
    data () {
      return {
        URL: queryProductTypeAboutModelUrl,
        // queryBarInit: {
        //   productType: true
        // },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      bodyParam () {
        return {
          type: 'precise',
          productTypeId: this.config.productTypeId || null,
          status: 0,
          headNum: 1
        }
      }
    },
    methods: {
      searchServerData (curryPage) {
        console.log(this.config)
        if (curryPage !== undefined) {
          this.bodyParam.headNum = ((curryPage - 1) * 10) + 1
        }
        const reqInit = {
          body: this.bodyParam
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.lines
          const dataList = map.productType
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            this.tableData.push(value)
          }
        })
      },
      /* searchBarQuery (queryParam) {
        if (queryParam !== undefined) {
          this.bodyParam.productTypeId = queryParam.productType
        }
        this.searchServerData()
        this.currentPage = 1
      }, */
      saveCurrentData (index) {
        console.log(this.tableData[index])
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询产品型号</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <!-- <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button>
                </div>
                <div class="col-xs-8">
                  <mes-process-searchbar
                    :init="queryBarInit"
                    @search="searchBarQuery"
                  >
                  </mes-process-searchbar>
                </div>
              </div>
            </div> -->
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">产品名称</th>
                  <th style="width: 15%;">产品型号</th>
                  <th style="width: 15%;">产品编号</th>
                  <th style="width: 30%;">备注</th>
                  <th style="width: 15%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.product_model_name"
                  >
                  </td>
                  <td
                    v-text="value.product_model_genre"
                  >
                  </td>
                  <td
                    v-text="value.product_model_number"
                  >
                  </td>
                  <td
                    v-text="value.product_model_describe"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询标准参数模态框
  Vue.component('mes-query-standard-parameter-modal', {
    data () {
      return {
        URL: queryNormParameterUrl,
        queryBarInit: {
          keyWord: true,
          paramType: true
        },
        bodyParam: {
          type: 'parameterTypeQuery',
          normParameterId: '',
          parameterTypeId: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.counts
          const dataList = map.resultListTree
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.keyword = queryParam.keyword || ''
          this.bodyParam.parameterTypeId = queryParam.paramType || ''
          this.searchServerData()
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询标准参数</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">参数名称</th>
                  <th style="width: 15%;">规格</th>
                  <th style="width: 25%;">备注</th>
                  <th style="width: 20%;">操作</th>
                </tr>
              </thead>
              <tbody

              >
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.standardParameterList[0].standard_parameter_name"
                  >
                  </td>
                  <td
                    v-text="value.standardParameterList[0].standard_parameter_specifications"
                  >
                  </td>
                  <td
                    v-text="value.standardParameterList[0].standard_parameter_describle"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询半成品类型模态框
  Vue.component('mes-query-semifinished-type-modal', {
    data () {
      return {
        URL: querySemiFinishedProductTypeUrl,
        queryBarInit: {
          keyWord: true,
        },
        bodyParam: {
          type: 'vague',
          semiFinishedProductTypeId: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.lines
          const dataList = map.semiFinishTypes
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.keyword = queryParam.keyword
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
        console.log(this.tableData[index])
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询半成品类型</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">名称</th>
                  <th style="width: 15%;">编号</th>
                  <th style="width: 40%;">描述</th>
                  <th style="width: 20%;">操作</th>
                </tr>
              </thead>
              <tbody

              >
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_type_name"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_type_number"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_type_describe"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询半成品类型下的半成品型号模态框
  Vue.component('mes-query-semifinished-number-modal', {
    data () {
      return {
        URL: querySemiFinishedProductTypeAboutModelUrl,
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      bodyParam () {
        return {
          semiFinishedProductTypeId: this.config.semifinishedTypeID || null,
          status: 0,
          headNum: 1
        }
      }
    },
    methods: {
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.lines
          const dataList = map.SemiFinishType
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    watch: {
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询半成品型号</h4>
        </div>
        <div class="modal-body">
          <div
          class="panel panel-default relative"
          ref="panel"
          >
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 15%;">名称</th>
                  <th style="width: 15%;">型号</th>
                  <th style="width: 15%;">编号</th>
                  <th style="width: 30%;">单位</th>
                  <th style="width: 30%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_name"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_genre"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_number"
                  >
                  </td>
                  <td
                    v-text="value.semi_finish_unit"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="panel-footer panel-footer-table">
              <div class="pull-right">
                <el-pagination
                  background
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="total"
                  @current-change="searchServerData"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  // 查询设备类型模态框
  Vue.component('mes-query-devices-type-modal', {
    data () {
      return {
        URL: queryDevicesTypesUrl,
        tableData: [],
      }
    },
    methods: {
      searchServerData (curryPage) {
        if (curryPage !== undefined) {
          this.bodyParam.headNum = ((curryPage - 1) * 10) + 1
        }
        const reqInit = {
          body: {
          }
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const dataList = map.devices_control_devices_type
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询设备类型</h4>
        </div>
        <div class="modal-body">
          <div
          class="panel panel-default relative"
          ref="panel"
          >
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">设备类型名称</th>
                  <th style="width: 20%;">所属工艺段</th>
                  <th style="width: 30%;">描述</th>
                  <th style="width: 20%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.devices_control_devices_type_name"
                  >
                  </td>
                  <td
                    v-text="value.devices_control_devices_craft_range"
                  >
                  </td>
                  <td
                    v-text="value.devices_control_devices_type_describe"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
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
  // 查询员工模态框
  Vue.component('mes-query-staff-info-modal', {
    data () {
      return {
        URL: queryStaffUrl,
        queryBarInit: {
          keyWord: true,
        },
        bodyParam: {
          type: 'info',
          staffName: '',
          headNum: 1
        },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    methods: {
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.lines
          const dataList = map.staffs
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.staffName = queryParam.keyword || ''
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询员工信息</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">姓名</th>
                  <th style="width: 10%;">性别</th>
                  <th style="width: 20%;">工号</th>
                  <th style="width: 25%;">备注</th>
                  <th style="width: 15%;">操作</th>
                </tr>
              </thead>
              <tbody

              >
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.role_staff_name"
                  >
                  </td>
                  <td
                    v-text="value.role_staff_sex"
                  >
                  </td>
                  <td
                    v-text="value.role_staff_number"
                  >
                  </td>
                  <td
                    v-text="value.role_remark"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询用户模态框
  Vue.component('mes-query-user-info-modal', {
    data () {
      return {
        URL: BASE_PATH + '/' + "queryAllEmployeeOfUser.do",
        queryBarInit: {
          keyWord: true,
        },
        bodyParam: {
          searchName: '',
          headNum: 1
        },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1,
        tempValue: ''
      }
    },
    methods: {
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.line
          const dataList = map.userList
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            let rowData = value
            try {
              rowData.role_post_name = value.rolePostDO.role_post_name
            } catch (error) {
              rowData.role_post_name = ''
            }
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.searchName = queryParam.keyword || ''
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询用户信息</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 30%;">用户名</th>
                  <th style="width: 30%;">职位</th>
                  <th style="width: 30%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.role_user_name"
                  >
                  </td>
                  <td>
                    {{value.role_post_name}}
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询工序版本模态框
  Vue.component('mes-query-process-version-modal', {
    data () {
      return {
        URL: queryWorkstageVersionsUrl,
        queryBarInit: {},
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      bodyParam () {
        console.log(this.config)
        return {
          type: 'history',
          workstageBasicsId: this.config.ID,
          versionsNumber: '',
          headNum: 1
        }
      }
    },
    methods: {
      searchServerData (curryPage) {
        console.log(this.bodyParam)
        if (curryPage !== undefined) {
          this.bodyParam.headNum = ((curryPage - 1) * 10) + 1
        }
        const reqInit = {
          body: this.bodyParam
        }
        const reqConfig = {
          panel: this.$refs.panel
        }
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.line
          const dataList = map.workstages
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
            console.log(this.tableData)
          }
        })
      }
    },
    watch: {
    },
    mounted () {
      // 添加数据
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询工序历史版本</h4>
        </div>
        <div class="modal-body">
          <div
          class="panel panel-default relative"
          ref="panel"
          >
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">工序名称</th>
                  <th style="width: 20%;">工序编号</th>
                  <th style="width: 50%;">描述</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.workstage_name"
                  >
                  </td>
                  <td
                    v-text="value.workstage_number"
                  >
                  </td>
                  <td
                    v-text="value.workstage_describe"
                  >
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="panel-footer panel-footer-table">
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
        </div>
      </div>
    </div>
    `
  })
  // 查询生产车间模态框
  Vue.component('mes-query-workshop-modal', {
    data () {
      return {
        URL: queryWorkshopsUrl,
        queryBarInit: {
          keyWord: true,
        },
        bodyParam: {
          type: 'info',
          workshopId: '',
          workshopName: '',
          headNum: 1
        },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    methods: {
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
        mesReq(this.URL, reqInit, reqConfig)
          .then((data) => {
            this.tableData = []
            const map = data.map
            const counts = map.lines
            const dataList = map.workshopInfos
            this.total = counts
            for (const [index, value] of dataList.entries()) {
              const rowData = value
              this.tableData.push(rowData)
            }
          })
          .catch(reason => {
            this.tableData = []
          })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.workshopName = queryParam.keyword || ''
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询车间信息</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">车间名称</th>
                  <th style="width: 20%;">地址</th>
                  <th style="width: 15%;">负责人</th>
                  <th style="width: 15%;">备注</th>
                  <th style="width: 15%;">设备数量</th>
                  <th style="width: 25%;">操作</th>
                </tr>
              </thead>
              <tbody

              >
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.role_workshop_name"
                  >
                  </td>
                  <td
                    v-text="value.role_workshop_site"
                  >
                  </td>
                  <td
                    v-text="value.role_workshop_principal"
                  >
                  </td>
                  <td
                    v-text="value.role_workshop_describe"
                  >
                  </td>
                  <td
                    v-text="value.devicescount"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
  // 查询物料标准参数
  Vue.component('mes-query-material-standard-info-modal', {
    data () {
      return {
        URL: BASE_PATH + '/' + 'queryMaterials.do',
        queryBarInit: {
          keyWord: true,
        },
        bodyParam: {
          type: 'info',
          key: 'keyWord',
          value: '',
          headNum: 1
        },
        tableData: [],
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    methods: {
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.materialInfoLine
          const dataList = map.materials
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            this.tableData.push(value)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.value = queryParam.keyword || ''
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-xm">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询物料标准物料</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 10%;">序号</th>
                  <th style="width: 20%;">名称</th>
                  <th style="width: 10%;">规格</th>
                  <th style="width: 20%;">型号</th>
                  <th style="width: 25%;">单位</th>
                  <th style="width: 15%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.warehouse_material_name"
                  >
                  </td>
                  <td
                    v-text="value.warehouse_material_standard"
                  >
                  </td>
                  <td
                    v-text="value.warehouse_material_model"
                  >
                  </td>
                  <td
                    v-text="value.warehouse_material_units"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })

  // 搜索栏组件
  Vue.component('mes-process-searchbar', {
    data () {
      return {
        // 产品类型选项
        productTypeOption: [],
        // 选择的产品类型
        selectedProductType: '',
        // 极性选项
        polarityOption: [
          {
            polarity: '全部极性',
            value: ''
          },
          {
            polarity: '正极',
            value: '正极'
          },
          {
            polarity: '负极',
            value: '负极'
          }
        ],
        // 选择的极性
        selectedPolarity: '',
        // 状态选项
        statusOption: [
          {
            status: '启用',
            value: 0
          },
          {
            status: '未启用',
            value: 1
          },
        ],
        // 选择的状态
        selectedStatus: 0,
        // 关键词
        keyword: '',
        // 参数类型选项
        paramTypeOption: [],
        // 选择的参数类型
        selectedParamType: '',
        // 产品状态选项
        productionStateOption: [
          {
            text: '生产进行中',
            value: 'productionUnderway'
          },
          {
            text: '生产中',
            value: 'inProduction'
          },
          {
            text: '暂停',
            value: 'pause'
          },
          {
            text: '已完成',
            value: 'complete'
          },
          {
            text: '停止',
            value: 'stop'
          }
        ],
        // 选择的产品状态
        selectedProductionState: 'productionUnderway',
        // 产品公版或私版选项
        productionPublicVersionOption: [
          {
            text: '公版',
            value: 'public'
          },
          {
            text: '私版',
            value: 'private'
          }
        ],
        // 选择的公版或私版
        selectedProductionPublicVersion: 'public',
        // 编辑与删除状态
        editAndDeleteStateOption: [
          {
            text: '编辑',
            value: 'edit'
          },
          {
            text: '已删除',
            value: 'delete'
          }
        ],
        // 选择的编辑与删除状态
        selectedEditAndDeleteState: 'edit',
      }
    },
    props: {
      init: {
        type: Object,
        default: () => {
          return {
            // 启用状态
            status: false,
            // 产品类型
            productType: false,
            // 极性
            polarity: false,
            // 关键词
            keyword: false,
            // 参数类型
            paramType: false,
            // 生产状态
            productionState: false,
            // 产品公版或私版
            productionPublicVersion: false,
            // 编辑与删除状态
            editAndDeleteState: false
          }
        },
        // required: true
      },
      emitSearch: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    computed: {
      searchParam () {
        let param = {}
        param.productType = this.selectedProductType // 产品类型
        param.polarity = this.selectedPolarity // 极性
        param.status = this.selectedStatus // 状态
        param.keyword = this.keyword // 关键词
        param.paramType = this.selectedParamType // 参数类型
        param.productionState = this.selectedProductionState // 生产状态
        param.productionPublicVersion = this.selectedProductionPublicVersion // 生产公开版本
        param.editAndDeleteState = this.selectedEditAndDeleteState // 编辑与删除状态
        return param
      }
    },
    watch: {
      emitSearch (value, oldValue) {
        if (value === true) {
          this.triggerSearchEvent()
        }
      }
    },
    methods: {
      // 触发搜索事件
      triggerSearchEvent () {
        this.$emit('search', this.searchParam)
      },
      // 获取产品类型id
      getProductTypeID () {
        let body = {
          type: 'vague',
          productTypeId: '',
          keyword: '',
          status: 0,
          // headNum: 1
        }
        mesReq(queryProductTypeUrl, {
          body: body
        }).then((data) => {
          this.productTypeOption = [
            {
              productTypeName: '全部类型',
              ID: ''
            }
          ]
          const map = data.map.productTypes
          for (const [index, item] of map.entries()) {
            const options = {
              productTypeName: '',
              ID: ''
            }
            options.productTypeName = item.product_type_name
            options.ID = item.product_model_type_id
            this.productTypeOption.push(options)
          }
        })
      },
      // 获取参数类型id
      getParamTypeID () {
        let body = {
          type: 'vague',
          normParameterId: '',
          parameterTypeId: '',
          keyword: '',
          status: 0,
          // headNum: 1
        }
        mesReq(queryParameterTypeUrl, {
          body: body
        }).then((data) => {
          this.paramTypeOption = []
          const map = data.map.resultList
          for (const [index, item] of map.entries()) {
            const options = {
              paramTypeName: '',
              ID: ''
            }
            options.paramTypeName = item.standard_parameter_type_name
            options.ID = item.standard_parameter_type_id
            this.paramTypeOption.push(options)
          }
        })
      }
    },
    mounted () {
      if (this.init.productType) {
        this.getProductTypeID()
      }
      if (this.init.paramType) {
        this.getParamTypeID()
      }
    },
    template: `
      <form class="form-inline pull-right" @submit.prevent>
        <select
          v-if="init.productType"
          class="form-control input-sm"
          v-model="selectedProductType"
          @change="triggerSearchEvent"
        >
          <option
            disabled
            value=""
            v-text="'产品类型'"
          >
          </option>
          <option
            v-for="(item, index) in productTypeOption"
            :key="index"
            v-text="item.productTypeName"
            :value="item.ID"
          >
          </option>
        </select>

        <!-- 编辑与删除下拉选 -->
        <select
          v-if="init.editAndDeleteState"
          class="form-control input-sm"
          v-model="selectedEditAndDeleteState"
          @change="triggerSearchEvent"
        >
          <option
            v-for="(item, index) in editAndDeleteStateOption"
            :key="index"
            v-text="item.text"
            :value="item.value"
          >
          </option>
        </select>

        <!-- 公版与私版下拉选 -->
        <select
          v-if="init.productionPublicVersion"
          class="form-control input-sm"
          v-model="selectedProductionPublicVersion"
          @change="triggerSearchEvent"
        >
          <option
            v-for="(item, index) in productionPublicVersionOption"
            :key="index"
            v-text="item.text"
            :value="item.value"
          >
          </option>
        </select>
        <select
          v-if="init.polarity"
          class="form-control input-sm"
          v-model="selectedPolarity"
          @change="triggerSearchEvent"
        >
          <option
            v-for="(item, index) in polarityOption"
            :key="index"
            v-text="item.polarity"
            :value="item.value"
          >
          </option>
        </select>
        <select
          v-if="init.status"
          class="form-control input-sm"
          v-model="selectedStatus"
          @change="triggerSearchEvent"
        >
          <option
            disabled
            value=""
            v-text="'状态'"
          >
          </option>
          <option
            v-for="(item, index) in statusOption"
            :key="index"
            v-text="item.status"
            :value="item.value"
          >
          </option>
        </select>
        <select
          v-if="init.paramType"
          class="form-control input-sm"
          v-model="selectedParamType"
          @change="triggerSearchEvent"
        >
          <option
            disabled
            value=""
            v-text="'参数类型'"
          >
          </option>
          <option
            v-for="(item, index) in paramTypeOption"
            :key="index"
            v-text="item.paramTypeName"
            :value="item.ID"
          >
          </option>
        </select>
        <select
          v-if="init.productionState"
          class="form-control input-sm"
          v-model="selectedProductionState"
          @change="triggerSearchEvent"
        >
          <option
            v-for="(item, index) in productionStateOption"
            :key="index"
            v-text="item.text"
            :value="item.value"
          >
          </option>
        </select>
        <div
          v-if="init.keyWord"
          class="input-group
          input-group-sm fuzzy-search-group"
        >
          <input
            v-model.trim="keyword"
            class="form-control"
            type="text"
            placeholder="输入关键字"
            @keyup.13="triggerSearchEvent"
          />
          <div class="input-group-btn">
            <button
              type="button"
              class="btn
              btn-primary"
              @click="triggerSearchEvent"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
      </form>
    `
  })

  // 值类型组件
  // 值类型
  Vue.component('mes-value-type-select', {
    data () {
      return {
        valueType: [
          '固定值',
          '范围值',
          '浮动值'
        ],
        selectedValueType: '固定值'
      }
    },
    props: {
      nowIndex: {
        type: Number,
        required: true,
        default: 0
      },
      templateSelectedValueType: {
        type: String,
        default: ''
      }
    },
    watch: {
      selectedValueType (value, oldValue) {
        console.log(value, oldValue)
        switch (value) {
          case '固定值':
            this.$emit('selectedValueTypeEvent', 'fixedValue', this.nowIndex)
            break;
          case '范围值':
            this.$emit('selectedValueTypeEvent', 'scopeValue', this.nowIndex)
            break;
          default:
            this.$emit('selectedValueTypeEvent', 'floatValue', this.nowIndex)
            break;
        }
      }
    },
    mounted () {
      if (this.templateSelectedValueType !== '') {
        switch (this.templateSelectedValueType) {
          case 'fixedValue':
            this.selectedValueType = '固定值'
            break;
          case 'scopeValue':
            this.selectedValueType = '范围值'
            break;
          case 'floatValue':
            this.selectedValueType = '浮动值'
            break;
          default:
            this.selectedValueType = '固定值'
            break;
        }
      }
    },
    template: `
      <td class="table-input-td">
        <select
          class="form-control"
          v-model="selectedValueType"
        >
          <option
            v-for="(item, index) in valueType"
            v-text="item"
            :key="index"
          >
          </option>
        </select>
      </td>
    `
  })
  // 固定值
  Vue.component('mes-fixed-value-input', {
    data () {
      return {
        value: 0
      }
    },
    props: {
      nowIndex: {
        type: Number,
        required: true,
        default: 0
      },
      defaultValue: {
        type: Object,
        default () {
          return {
            fixedValue: 0,
            minValue: 0,
            maxValue: 0,
            floatScopeValue: 0
          }
        }
      }
    },
    mounted () {
      if (this.defaultValue) {
        this.value = this.defaultValue.fixedValue
      }
    },
    template: `
      <td class="table-input-td">
        <input
          type="text"
          class="form-control"
          v-model.lazy.trim.number="value"
          placeholder="值"
        >
      </td>
    `,
    watch: {
      value (value, oldValue) {
        this.$emit('saveFixedValue', value, this.nowIndex)
      }
    }
  })
  // 范围值
  Vue.component('mes-scope-value-input', {
    data () {
      return {
        scopeValue: {
          minValue: 0,
          maxValue: 0
        }
      }
    },
    props: {
      nowIndex: {
        type: Number,
        required: true,
        default: 0
      },
      defaultValue: {
        type: Object,
        default () {
          return {
            fixedValue: 0,
            minValue: 0,
            maxValue: 0,
            floatScopeValue: 0
          }
        }
      }
    },
    mounted () {
      if (this.defaultValue) {
        this.scopeValue.minValue = this.defaultValue.minValue
        this.scopeValue.maxValue = this.defaultValue.maxValue
      }
    },
    template: `
      <td class="table-input-td">
        <form class="form-inline">
          <input
            type="text"
            v-model.lazy.trim.number="scopeValue.minValue"
            class="form-control"
            style="max-width:45%"
            placeholder="最小值"
            @change="saveValue"
          >
          <input
            type="text"
            v-model.lazy.trim.number="scopeValue.maxValue"
            class="form-control"
            style="max-width:45%"
            placeholder="最大值"
            @change="saveValue"
          >
        </form>
      </td>
    `,
    methods: {
      saveValue () {
        this.$emit('saveScopeValue', this.scopeValue, this.nowIndex)
      }
    }
  })
  // 浮动值
  Vue.component('mes-float-value-input', {
    data () {
      return {
        floatValue: {
          value: 0,
          floatScopeValue: 0
        }
      }
    },
    props: {
      nowIndex: {
        type: Number,
        required: true,
        default: 0
      },
      defaultValue: {
        type: Object,
        default () {
          return {
            fixedValue: 0,
            minValue: 0,
            maxValue: 0,
            floatScopeValue: 0
          }
        }
      }
    },
    template: `
      <td class="table-input-td">
        <form class="form-inline">
          <input
            type="text"
            class="form-control"
            style="max-width:45%"
            placeholder="值"
            v-model.lazy.trim.number="floatValue.value"
            @change="saveValue"
          >
          <input
            type="text"
            class="form-control"
            style="max-width:45%"
            placeholder="浮动范围"
            v-model.lazy.trim.number="floatValue.floatScopeValue"
            @change="saveValue"
          >
        </form>
      </td>
    `,
    mounted () {
      if (this.defaultValue) {
        this.floatValue.value = this.defaultValue.fixedValue
        this.floatValue.floatScopeValue = this.defaultValue.floatScopeValue
      }
    },
    methods: {
      saveValue () {
        this.$emit('saveFloatValue', this.floatValue, this.nowIndex)
      }
    }
  })

  // ## 大型模态框组件
  // 查询工步模态框
  Vue.component('mes-query-step-modal', {
    data () {
      return {
        URL: queryStepOutlineUrl,
        queryBarInit: {
          productType: true,
          polarity: true,
          keyWord: true
        },
        bodyParam: {
          productTypeId: '',
          polarity: '',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.counts
          const dataList = map.workstepList
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.productTypeId = queryParam.productType
          this.bodyParam.polarity = queryParam.polarity
          this.bodyParam.keyword = queryParam.keyword
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询工步信息</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
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
                  v-for="(value, key) in tableData"
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
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })

  // 产品工艺
  Vue.component('mes-query-craft-modal', {
    data () {
      return {
        URL: queryCraftOutlineUrl,
        queryBarInit: {
          productType: true,
          keyWord: true,
          status: true,
          productionPublicVersion: true
        },
        bodyParam: {
          productTypeId: '',
          versionType: 'public',
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
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
          this.tableData = []
          const map = data.map
          const counts = map.count
          const dataList = map.craftList
          this.total = counts
          for (const [index, value] of dataList.entries()) {
            const rowData = value
            this.tableData.push(rowData)
          }
        }).catch(reason => {
          this.tableData = []
        })
      },
      searchBarQuery (queryParam) {
        if (queryParam === undefined) {
          return
        }
        else {
          this.bodyParam.productTypeId = queryParam.productType
          this.bodyParam.keyword = queryParam.keyword
          this.bodyParam.versionType = queryParam.productionPublicVersion
          this.bodyParam.status = queryParam.status
          this.searchServerData()
          this.currentPage = 1
        }
      },
      saveCurrentData (index) {
        this.$emit('set-data-value', this.tableData[index])
        this.$emit('modal-hide')
      }
    },
    mounted () {
      this.searchServerData()
    },
    template: `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">
            <span>
              <i class="fa fa-close"></i>
            </span>
          </button>
          <h4 class="modal-title">查询工艺信息</h4>
        </div>
        <div class="modal-body">
          <div
            class="panel panel-default relative"
            ref="panel"
          >
            <div class="panel-heading panel-heading-table">
              <div class="row">
                <div class="col-xs-4">
                  <!-- <button type="button" class="btn btn-primary">
                    <i class="fa fa-search"></i>
                    添加参数
                  </button> -->
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
            <table
              class="table table-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 5%;">序号</th>
                  <th style="width: 15%;">工艺名称</th>
                  <th style="width: 15%;">工艺编号</th>
                  <th style="width: 10%;">工艺版本</th>
                  <th style="width: 15%;">产品类型</th>
                  <th style="width: 15%;">所属产线</th>
                  <th style="width: 10%;">优率</th>
                  <th style="width: 15%;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in tableData"
                  :key="key"
                >
                  <td
                    v-text="key + 1"
                  >
                  </td>
                  <td
                    v-text="value.craft_name"
                  >
                  </td>
                  <td
                    v-text="value.craft_number"
                  >
                  </td>
                  <td
                    v-text="value.craft_versions"
                  >
                  </td>
                  <td
                    v-text="value.product_model_genre"
                  >
                  </td>
                  <td
                    v-text="value.product_line_name"
                  >
                  </td>
                  <td
                    v-text="value.craft_quality_rate"
                  >
                  </td>
                  <td class="table-input-td">
                    <a
                      href="javascript:;"
                      class="table-link"
                      @click="saveCurrentData(key)"
                    >
                      <i class="fa fa-plus fa-fw"></i>选择
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
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
        </div>
      </div>
    </div>
    `
  })
})