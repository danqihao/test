/**
* @description 项目类型,检验方式共用模态框,
* @param {string} type:add  新增
*                     :modfiy 修改
* @param {string} title:模态框标题
* @param {string} targetHref:左菜单激活按钮,用于判断是哪个模块
* @param {string} templateStr:vue实例template
* @param {obj}    data:vue实例data
* @param {function} resolve:Promise回调函数
*/
function basicInfoModal(type, title, targetHref, templateStr, data, resolve) {
  const modal = document.getElementById('basicInfoModal')   //模态框
  const modalHeader = modal.querySelector('.modal-header')  //模态框头部
  const modalTitle = modalHeader.querySelector('.modal-title')  //模态框头部标题
  const modalCloseBtn = modalHeader.querySelector('.close')  //模态框关闭按钮
  const modalFooter = modal.querySelector('.modal-footer')  //模态框底部
  const modalFooterBtn = modalFooter.querySelector('.modal-submit')  //模态框底部提交按钮
  const panel = modal.querySelector('.panel')  // 内部swiper的面板
  const panelBody = panel.querySelector('.panel-body-table')  //面版表格tbody

  modalTitle.innerHTML = title //初始化模态框标题

  let modalBodyTableVM = new Vue({
    el: panelBody,
    data() {
      return {
        data,
        type: type,
      }
    },
    template: templateStr
  })

  //底部提交按钮单击事件
  $(modalFooterBtn).off('click').on('click', function () {

    if (type === 'add') {   //新增
      switch (targetHref) {
        case '#checkItemTypeManage': {
          // console.log(modalBodyTableVM.$data.data.projectTypeName)
          if (modalBodyTableVM.$data.data.projectTypeName !== null && modalBodyTableVM.$data.data.projectTypeName !== '') {
            submitFun(saveQualityProjectTypeUrl, modalBodyTableVM.$data.data, modal, resolve)
          }

          else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#checkItemManage': {

          if (modalBodyTableVM.$data.data.qualityProjectName !== null && modalBodyTableVM.$data.data.qualityProjectName !== '' &&
            modalBodyTableVM.$data.data.qualityProjectTypeId !== null && modalBodyTableVM.$data.data.qualityProjectTypeId !== ''
          ) {
            let submitData = {
              qualityProjectName: modalBodyTableVM.$data.data.qualityProjectName,
              qualityProjectTypeId: modalBodyTableVM.$data.data.qualityProjectTypeId
            }
            submitFun(saveQualityProjecttUrl, submitData, modal, resolve)
          } else {
            swallError()  //格式不正确
          }

          break;
        }
        case '#checkWayManage': {
          if (modalBodyTableVM.$data.data.checkMethodName !== null && modalBodyTableVM.$data.data.checkMethodName !== '') {
            submitFun(saveCheckMethodUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#measureManage': {
          if (modalBodyTableVM.$data.data.applianceName !== null && modalBodyTableVM.$data.data.applianceName !== '' &&
            modalBodyTableVM.$data.data.applianceNumber !== null && modalBodyTableVM.$data.data.applianceNumber !== ''
          ) {
            submitFun(saveApplianceUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#badnessCodeManage': {
          if (modalBodyTableVM.$data.data.unqualifiedCode !== null && modalBodyTableVM.$data.data.unqualifiedCode !== '' &&
            modalBodyTableVM.$data.data.unqualifiedDetail !== null && modalBodyTableVM.$data.data.unqualifiedDetail !== '' &&
            modalBodyTableVM.$data.data.unqualifiedInterceptor !== null && modalBodyTableVM.$data.data.unqualifiedInterceptor !== ''
          ) {
            submitFun(saveUnqualifiedUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
      }

    } else if (type === 'modify') { //修改
      switch (targetHref) {
        case '#checkItemTypeManage': {
          if (modalBodyTableVM.$data.data.quality_project_type_name !== null && modalBodyTableVM.$data.data.quality_project_type_detail !== '') {
            submitFun(modifyQualityProjectTypeUrl, modalBodyTableVM.$data.data, modal, resolve)

          } else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#checkItemManage': {

          if (modalBodyTableVM.$data.data.qualityProjectName !== null && modalBodyTableVM.$data.data.qualityProjectName !== '') {
            let submitData = {
              projectId: modalBodyTableVM.$data.data.projectId,
              projectName: modalBodyTableVM.$data.data.qualityProjectName,
            }
            submitFun(modifyQualityProjectUrl, submitData, modal, resolve)
          } else {
            swallError()  //格式不正确
          }

          break;
        }
        case '#checkWayManage': {
          if (modalBodyTableVM.$data.data.checkMethodName !== null && modalBodyTableVM.$data.data.checkMethodDetail !== '') {
            submitFun(modifyCheckMethodUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#measureManage': {
          if (modalBodyTableVM.$data.data.applianceName !== null && modalBodyTableVM.$data.data.applianceName !== '' &&
            modalBodyTableVM.$data.data.applianceNumber !== null && modalBodyTableVM.$data.data.applianceNumber !== ''
          ) {
            submitFun(modifyApplianceUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
        case '#badnessCodeManage': {
          if (modalBodyTableVM.$data.data.unqualifiedCode !== null && modalBodyTableVM.$data.data.unqualifiedCode !== '' &&
            modalBodyTableVM.$data.data.unqualifiedDetail !== null && modalBodyTableVM.$data.data.unqualifiedDetail !== '' &&
            modalBodyTableVM.$data.data.unqualifiedInterceptor !== null && modalBodyTableVM.$data.data.unqualifiedInterceptor !== ''
          ) {
            submitFun(modifyUnqualifiedUrl, modalBodyTableVM.$data.data, modal, resolve)
          } else {
            swallError()  //格式不正确
          }
          break;
        }
      }

    }
  })
}

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
      $(modal).on('hidden.bs.modal', function (e) {
        $('body').addClass('modal-open')
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
                                  <th style="width: 30%;">工序名称</th>
                                  <th style="width: 30%;">工序编号</th>
                                  <th style="width: 30%;">操作</th>
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
                                  <td class="table-input-td">

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
* @description 选择工序模态框(多选)
* @param dataList {Array} 传输的数据
*/
function selectProcessModal2(resolve, dataList) {
  // console.dir(selectData)
  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'vague', keyword: '', status: 0 },//搜索参数
        tbodyData: [],  //表格数据
        selectData: [],  //选择的数据
        tempChangeList: [],  //临时互传数据
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryWorkstageBasicsUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = '' //清空搜索框

            if (result.status == 0) {
              let tempList = result.map.workstageBasicsList
              this.selectData = [] //清空已选择的数据

              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                tempList[i].selected = false  //所有按钮设置为没选择
                for (let j = 0, len = dataList.length; j < len; j++) {
                  if (dataList[j].process.workstage_basics_id == tempList[i].workstage_basics_id) {
                    tempList[i].selected = true
                    this.selectData.push(dataList[j].process) //存储已选择数据
                  }
                }
              }

              this.tbodyData = tempList
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

        if (value.selected) { //已经选择
          return
        } else {
          this.tbodyData[index].selected = true //设置为已选择
          this.selectData.push(value) //存储已选择数据
          let tempdata = {
            process: value,
            wayStr: '',
            wayList: []
          }
          this.tempChangeList.push(tempdata)  //存入临时数组
        }

      },
      //保存
      save() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        dataList = dataList.concat(this.tempChangeList) //将新增数据加入传过来的数组
        resolve(dataList)  //返回数据
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum
        this.queryFun(this.searchData)
      },
      //关闭模态框
      closeModal() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        if (this.tempChangeList.length > 0) {  //判断是否有修改数据
          if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
            modal.modal('hide')
          }
        } else {
          modal.modal('hide')
        }
      }

    },

    template: `
        <div class="modal fade" id="commonModal3">
          <div class="modal-dialog">
              <div class="modal-content" >
                <div class="modal-header">
                  <button class="close"   @click ="closeModal()">
                    <span>
                      <i class="fa fa-close"></i>
                    </span>
                  </button>
                  <h4 class="modal-title">选择方案</h4>
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
                                          <input
                                            type="text"
                                            class="form-control"
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
                              <table class="table  table-bordered">
                                <thead>
                                  <tr>
                                    <th style="width: 10%;">序号</th>
                                    <th style="width: 30%;">工序名称</th>
                                    <th style="width: 30%;">工序编号</th>
                                    <th style="width: 30%;">操作</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                      v-show="tbodyData.length"
                                      v-for="(value, index) in tbodyData"
                                      :key="index"
                                      @click="choice(value, index)"
                                      style="cursor:pointer"
                                      :class="value.selected ? 'bg-success':'' "
                                    >
                                    <td v-text="index + 1">
                                    </td>
                                    <td v-text="value.workstage_name">
                                    </td>
                                    <td v-text="value.workstage_number">
                                    </td>
                                    <td class="table-input-td">
                                      <label class="checkbox-inline">
                                        <input
                                          type="checkbox"
                                          onclick="return false"
                                          :value="value"
                                          v-model="selectData"
                                        >
                                      </label>
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
                      <button
                        class="btn btn-primary"
                        @click ="save()"
                      >
                        保存
                      </button>
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
* @description 选择方案模态框(单选)
*/
function selectPQCWayModal2(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'info', templateId: '', templateName: '', methodId: '', craftId: '' },//搜索参数
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryPQCTemplateUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.pqcTemplates
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
        this.searchData.templateName = this.searchDataInput
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
                <h4 class="modal-title">选择方案</h4>
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
                                    <th style="width: 12%;">序号</th>
                                    <th style="width: 22%;">方案名称</th>
                                    <th style="width: 22%;">方案编号</th>
                                    <th style="width: 22%;">工序</th>
                                    <th style="width: 22%;">检验方式</th>
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
                                    <td v-text="value.quality_pqc_template_name">
                                    </td>
                                    <td v-text="value.quality_pqc_template_number">
                                    </td>
                                     <td v-text="value.workstageName">
                                    </td>
                                    <td v-text="value.modelName">
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
* @description 选择项目模态框(多选)
* @param dataList {Array} 传输的数据
* @param projectTypeId {String} 项目类型id
*/
function selectItemModal(resolve, dataList, projectTypeId) {
  // console.log(dataList)
  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        qualityProjectTypeList: qualityProjectTypeList, //类型集合用于生成下拉选
        searchData: { headNum: 1, projectName: '', projectTypeId: projectTypeId },//搜索参数
        tbodyData: [],  //表格数据
        selectData: [],  //选择的数据
        tempChangeList: [],  //临时互传数据
        searchDataSelect: '',//下拉选选择的数据
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryQualityProjectUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = '' //清空搜索框

            if (result.status == 0) {
              let tempList = result.map.projectInfo
              this.selectData = [] //清空已选择的数据

              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                tempList[i].selected = false  //所有按钮设置为没选择
                for (let j = 0, len = dataList.length; j < len; j++) {
                  if (dataList[j].item.qualityTypeProject.quality_project_id == tempList[i].quality_project_id) {
                    tempList[i].selected = true
                    this.selectData.push(tempList[i]) //存储已选择数据
                  }
                }
              }

              //设置已选择但保存的为已选择
              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                for (let j = 0, len = this.tempChangeList.length; j < len; j++) {
                  if (this.tempChangeList[j].item.quality_project_id == tempList[i].quality_project_id) {
                    tempList[i].selected = true
                    this.selectData.push(this.tempChangeList[j].item) //存储已选择数据
                  }
                }
              }

              this.tbodyData = tempList
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
        this.searchData.projectName = this.searchDataInput
        this.searchData.projectType = this.searchDataInput
        this.searchData.projectTypeId = this.searchDataSelect
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        if (value.selected) { //已经选择
          return
        } else {
          this.tbodyData[index].selected = true //设置为已选择
          this.selectData.push(value) //存储已选择数据
          this.tempChangeList.push(value)  //存入临时数组
        }

      },
      //保存
      save() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        // dataList = dataList.concat(this.tempChangeList) //将新增数据加入传过来的数组
        resolve(this.tempChangeList)  //返回选择的数据
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum
        this.queryFun(this.searchData)
      },
      //关闭模态框
      closeModal() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        if (this.tempChangeList.length > 0) {  //判断是否有修改数据
          if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
            modal.modal('hide')
          }
        } else {
          modal.modal('hide')
        }
      }

    },

    template: `
        <div class="modal fade" id="commonModal3">
          <div class="modal-dialog">
              <div class="modal-content" >
                <div class="modal-header">
                  <button class="close"   @click ="closeModal()">
                    <span>
                      <i class="fa fa-close"></i>
                    </span>
                  </button>
                  <h4 class="modal-title">选择项目</h4>
                </div>
                <div class="modal-body">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-sm-12">
                        <div class="panel panel-default">
                          <div class="panel-heading panel-heading-table">
                            <div class="row">
                              <div class="col-xs-3">
                                    <h5 class="panel-title"></h5>
                              </div>
                              <div class="col-xs-9">
                                <form class="form-inline pull-right" onsubmit="return false;" >
                                      <div class="input-group input-group-sm">
                                        <select
                                          class="form-control table-input input-sm"
                                          @change="search()"
                                          v-model="searchDataSelect"
                                          v-bind:value="searchDataSelect"
                                        >
                                          <option  value="">全部类型</option>
                                          <option
                                            v-show="qualityProjectTypeList.length"
                                            v-for="(value, index) in qualityProjectTypeList" :key="index"
                                            v-bind:value="value.quality_project_type_id"
                                          >
                                            {{value.quality_project_type_name}}
                                          </option>
                                        </select>
                                      </div>
                                      <div class="input-group input-group-sm ">
                                        <input
                                          class="form-control" type="text"
                                          @keyup.enter ="search()"
                                          v-model.trim = "searchDataInput"
                                          placeholder="输入关键字" maxlength="25"
                                        />
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
                              <table class="table  table-bordered">
                                <thead>
                                  <tr>
                                    <th style="width: 10%;">序号</th>
                                    <th style="width: 30%;">项目名称</th>
                                    <th style="width: 30%;">项目类型</th>
                                    <th style="width: 30%;">操作</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                      v-show="tbodyData.length"
                                      v-for="(value, index) in tbodyData"
                                      :key="index"
                                      @click="choice(value, index)"
                                      style="cursor:pointer"
                                      :class="value.selected ? 'bg-success':'' "
                                    >
                                    <td v-text="index + 1">
                                    </td>
                                    <td v-text="value.qualityProjects.quality_project_name">
                                    </td>
                                    <td v-text="value.qualityProjectType.quality_project_type_name">
                                    </td>
                                    <td class="table-input-td">
                                      <label class="checkbox-inline">
                                        <input
                                          type="checkbox"
                                          onclick="return false"
                                          :value="value"
                                          v-model="selectData"
                                        >
                                      </label>
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
                              background
                              small
                              layout="total, prev, pager, next"
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
                      <button
                        class="btn btn-primary"
                        @click ="save()"
                      >
                        保存
                      </button>
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
* @description 选择不良内容模态框(多选)
* @param dataList {Array} 传输的数据
*/
function selectBadnessModal(resolve, dataList) {
  console.log(dataList)
  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, unqualifiedId: '', unqualifiedCode: '', unqualifiedDetail: '', unqualifiedSign: '' },//搜索参数
        tbodyData: [],  //表格数据
        selectData: [],  //选择的数据
        tempChangeList: [],  //临时互传数据
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryUnqualifiedUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = '' //清空搜索框

            if (result.status == 0) {
              let tempList = result.map.unqualityInfo
              this.selectData = [] //清空已选择的数据

              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                tempList[i].selected = false  //所有按钮设置为没选择
                for (let j = 0, len = dataList.length; j < len; j++) {
                  if (dataList[j].quality_unqualified_code == tempList[i].quality_unqualified_code) {
                    tempList[i].selected = true
                    this.selectData.push(tempList[i]) //存储已选择数据
                  }
                }
              }

              // //设置已选择但未保存的为已选择
              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                for (let j = 0, len = this.tempChangeList.length; j < len; j++) {
                  if (this.tempChangeList[j].quality_unqualified_code == tempList[i].quality_unqualified_code) {
                    tempList[i].selected = true
                    this.selectData.push(this.tempChangeList[j].item) //存储已选择数据
                  }
                }
              }

              this.tbodyData = tempList
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
        this.searchData.unqualifiedCode = this.searchDataInput
        this.searchData.unqualifiedDetail = this.searchDataInput
        this.searchData.unqualifiedSign = this.searchDataInput
        this.queryFun(this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        if (value.selected) { //已经选择
          return
        } else {
          this.tbodyData[index].selected = true //设置为已选择
          this.selectData.push(value) //存储已选择数据
          this.tempChangeList.push(value)  //存入临时数组
        }

      },
      //保存
      save() {
        // console.dir(this.tempChangeList)
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        resolve(this.tempChangeList)  //返回选择的数据
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum
        this.queryFun(this.searchData)
      },
      //关闭模态框
      closeModal() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        if (this.tempChangeList.length > 0) {  //判断是否有修改数据
          if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
            modal.modal('hide')
          }
        } else {
          modal.modal('hide')
        }
      }

    },

    template: `
        <div class="modal fade" id="commonModal3">
          <div class="modal-dialog">
              <div class="modal-content" >
                <div class="modal-header">
                  <button class="close"   @click ="closeModal()">
                    <span>
                      <i class="fa fa-close"></i>
                    </span>
                  </button>
                  <h4 class="modal-title">选择不良内容</h4>
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
                                        <input
                                          class="form-control" type="text"
                                          @keyup.enter ="search()"
                                          v-model.trim = "searchDataInput"
                                          placeholder="输入关键字" maxlength="25"
                                        />
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
                              <table class="table  table-bordered">
                                <thead>
                                  <tr>
                                    <th style="width: 10%;">序号</th>
                                    <th style="width: 30%;">不良代码</th>
                                    <th style="width: 30%;">不良描述</th>
                                    <th style="width: 30%;">操作</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                      v-show="tbodyData.length"
                                      v-for="(value, index) in tbodyData"
                                      :key="index"
                                      @click="choice(value, index)"
                                      style="cursor:pointer"
                                      :class="value.selected ? 'bg-success':'' "
                                    >
                                    <td v-text="index + 1">
                                    </td>
                                    <td v-text="value.quality_unqualified_code">
                                    </td>
                                    <td v-text="value.quality_unqualified_detail">
                                    </td>
                                    <td class="table-input-td">
                                      <label class="checkbox-inline">
                                        <input
                                          type="checkbox"
                                          onclick="return false"
                                          :value="value"
                                          v-model="selectData"
                                        >
                                      </label>
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
                              background
                              small
                              layout="total, prev, pager, next"
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
                      <button
                        class="btn btn-primary"
                        @click ="save()"
                      >
                        保存
                      </button>
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
* @description 选择物料模态框(多选)
* @param dataList {Array} 传输的数据
*/
function selectMaterialModal(resolve, dataList) {
  // console.dir(dataList)
  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: true,  //loading加载
        materialTypeList: materialTypeList, //类型集合用于生成下拉选
        searchData: { headNum: 1, type: 'info', key: '', value: '' },//搜索参数,用于模糊搜索
        tbodyData: [],  //表格数据
        selectData: [],  //选择的数据
        tempChangeList: [],  //临时互传数据
        searchDataSelect: '',//下拉选选择的数据
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
      queryFun(url, data) {
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: url,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = '' //清空搜索框

            if (result.status == 0) {
              let tempList = result.map.materials
              this.selectData = [] //清空已选择的数据

              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                tempList[i].selected = false  //所有按钮设置为没选择
                for (let j = 0, len = dataList.length; j < len; j++) {
                  if (dataList[j].item.warehouse_material_id == tempList[i].warehouse_material_id) {
                    tempList[i].selected = true
                    this.selectData.push(dataList[j].item) //存储已选择数据
                  }
                }
              }

              //设置已选择但保存的为已选择
              for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                for (let j = 0, len = this.tempChangeList.length; j < len; j++) {
                  if (this.tempChangeList[j].item.warehouse_material_id == tempList[i].warehouse_material_id) {
                    tempList[i].selected = true
                    this.selectData.push(this.tempChangeList[j].item) //存储已选择数据
                  }
                }
              }

              this.tbodyData = tempList
              this.lines = result.map.materialInfoLine

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
        this.queryFun(queryMaterialsUrl, this.searchData)
      },
      // 按类型查找
      typeSearch() {
        this.currenPage = 1
        this.searchData.key = 'materialTypeId'
        this.searchData.value = this.searchDataSelect

        if (this.searchDataSelect == '') {
          this.searchData.key = ''
          this.searchData.value = ''
        }
        this.queryFun(queryMaterialsUrl, this.searchData)
      },
      //选择后执行的操作
      choice(value, index) {
        if (value.selected) { //已经选择
          return
        } else {
          this.tbodyData[index].selected = true //设置为已选择
          this.selectData.push(value) //存储已选择数据

          this.tempChangeList.push(value)  //存入临时数组
        }

      },
      //保存
      save() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        modal.modal('hide')
        // dataList = dataList.concat(this.tempChangeList) //将新增数据加入传过来的数组
        resolve(this.tempChangeList)  //返回数据
      },
      //监听页面变化实现分页功能
      handleCurrentChange(val) {  //获取当前页
        let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
        this.currenPage = val
        this.searchData.headNum = headNum

        this.queryFun(queryMaterialsUrl, this.searchData)
      },
      //关闭模态框
      closeModal() {
        const modal = $(document.getElementById('commonModal3'))   //模态框
        if (this.tempChangeList.length > 0) {  //判断是否有修改数据
          if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
            modal.modal('hide')
          }
        } else {
          modal.modal('hide')
        }
      }

    },

    template: `
        <div class="modal fade" id="commonModal3" v-loading="loading">
          <div class="modal-dialog">
              <div class="modal-content" >
                <div class="modal-header">
                  <button class="close"   @click ="closeModal()">
                    <span>
                      <i class="fa fa-close"></i>
                    </span>
                  </button>
                  <h4 class="modal-title">选择物料</h4>
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
                                      <div class="input-group input-group-sm">
                                        <!--
                                        <select
                                          class="form-control table-input input-sm"
                                          @change = "typeSearch()"
                                          v-model="searchDataSelect"
                                          v-bind:value="searchDataSelect"
                                        >
                                          <option  value="">全部类型</option>
                                          <option
                                            v-show="materialTypeList.length"
                                            v-for="(value, index) in materialTypeList" :key="index"
                                            v-bind:value="value.warehouse_material_type_id">{{value.warehouse_material_type_name}}
                                          </option>
                                        </select>
                                        -->
                                      </div>
                                      <div class="input-group input-group-sm ">
                                        <input
                                          class="form-control" type="text"
                                          @keyup.enter ="search()"
                                          v-model.trim = "searchDataInput"
                                          placeholder="输入关键字" maxlength="25"
                                        />
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
                              <table class="table  table-bordered">
                                <thead>
                                  <tr>
                                    <th style="width: 10%;">序号</th>
                                    <th style="width: 30%;">物料名称</th>
                                    <th style="width: 20%;">规格</th>
                                    <th style="width: 20%;">型号</th>
                                    <th style="width: 20%;">操作</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                      v-show="tbodyData.length"
                                      v-for="(value, index) in tbodyData"
                                      :key="index"
                                      @click="choice(value, index)"
                                      style="cursor:pointer"
                                      :class="value.selected ? 'bg-success':'' "
                                    >
                                    <td v-text="index + 1">
                                    </td>
                                    <td v-text="value.warehouse_material_name">
                                    </td>
                                    <td v-text="value.warehouse_material_standard">
                                    </td>
                                    <td v-text="value.warehouse_material_model">
                                    </td>
                                    <td class="table-input-td">
                                      <label class="checkbox-inline">
                                        <input
                                          type="checkbox"
                                          onclick="return false"
                                          :value="value"
                                          v-model="selectData"
                                        >
                                      </label>
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
                      <button
                        class="btn btn-primary"
                        @click ="save()"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      `
  })
  panelBodyTableVM.queryFun(queryMaterialsUrl, panelBodyTableVM.searchData)

}

/**
* @description 选择员工模态框(单选)
*/
function selectStaffModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'info', staffName: '' },//搜索参数
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryStaffUrl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.staffs
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
        this.searchData.staffName = this.searchDataInput
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
                <h4 class="modal-title">选择员工</h4>
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
                                  <th style="width: 45%;">员工姓名</th>
                                  <th style="width: 45%;">员工工号</th>
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
                                  <td v-text="value.role_staff_name">
                                  </td>
                                  <td v-text="value.role_staff_number">
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
function selectDevicesModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: { headNum: 1, type: 'all', keyWord: '' },//搜索参数
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

          },

        })
      },

      // 模糊搜索
      search() {
        this.currenPage = 1
        this.searchData.type = 'keyWord'
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
                <h4 class="modal-title">选择员工</h4>
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
                                  <th style="width: 45%;">设备名称</th>
                                  <th style="width: 45%;">设备编号</th>
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
      $(modal).on('hidden.bs.modal', function (e) {
        $('body').addClass('modal-open')
      })
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
                                  <th style="width: 30%;">操作</th>
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
                                  <td class="table-input-td">

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
* @description 选择工单模态框(单选)
*/
function selectWorkOrderModal(resolve) {

  // 当前页面vue实例
  let panelBodyTableVM = new Vue({
    el: '#commonModal3',
    data() {
      return {
        loading: false,  //loading加载
        searchData: {
          type: 'planQuotesWorkstage', //必传，查询类型,取值"planQuotesWorkstage：通过生产计划引用的工序id查询","plan：通过生产计划id查询","vague：模糊搜索",
          planQuotesWorkstageId: '5d128759dc8748869a0327191fb686e5', //选择传送，生产计划引用工序的id
          planId: '', //选择传送，生产计划id
          workshopId: '', //选择传送，车间id
          workstageId: '', //选择传送，工序id
          workOrderProductionStatus: '', //选择传送，工单的生产状态
          keyword: '', //选择传送，关键字
          userId: '', //选择传送，用户id
          headNum: 1, //不是必传，分页执行搜索的下标
        },//搜索参数
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
        $.ajax({
          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
          url: queryWorkOrderOutlineURl,
          data: data,
          beforeSend: (xml) => {
            this.loading = true
          },
          success: (result, status, xhr) => {
            this.loading = false
            this.searchDataInput = ''
            if (result.status == 0) {
              this.tbodyData = result.map.workstages
              this.lines = result.map.line
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
                                  <th style="width: 30%;">工序名称</th>
                                  <th style="width: 30%;">工序编号</th>
                                  <th style="width: 30%;">操作</th>
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
                                  <td class="table-input-td">

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

// selectWorkOrderModal()

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
function condensation(resolve, url, data, pitchOn) {
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
          addCondensation.$data.checked.forEach((value, key) => {
            result.map.projectInfo.forEach((val, keys) => {
              if (value == val.quality_project_type_id) {
                result.map.projectInfo[keys].selected = true
              }
            })
          })

          Vue.set(addCondensation, 'dataList', result.map.projectInfo)
          Vue.set(addCondensation, 'lines', result.map.lines)
        } else {
          Vue.set(addCondensation, 'dataList', [])
          Vue.set(addCondensation, 'lines', 0)
        }
      }
    })
  }

  let addCondensation = new Vue({
    el: '#addCondensation',
    data() {
      return {
        models: false,
        checked: [],
        dataList: [], //遍历数据
        lines: 0, //条数
        search: '', //搜索框值
        currenPage: 1, //当前页
        pagesize: 10,   //页码
        selectData: [],//已选择的返回数据
        ajaxData: {
          projectTypeId: '',
          projectTypeName: '',
          headNum: 1
        }
      }
    },
    created() {
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryQualityProjectTypeUrl,
        data: { headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.projectInfo
            this.lines = result.map.lines
            this.dataList.forEach((value, key) => {
              pitchOn.forEach((val, keys) => {
                if (value.quality_project_type_id == val.quality_project_type_id) {
                  this.dataList[key].selected = true
                  console.log(this.checked)
                  this.checked.push(value.quality_project_type_id)
                }
              })
            })
          }
        }
      })
    },
    mounted() {
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
    methods: {
      //点击选择
      choice(val, index) {
        if (val.selected) {
          return false
        } else {
          val.selected = true //设置为已选择
          this.checked.push(val.quality_project_type_id) //存储已选择数据
          this.selectData.push(val)

        }
      },
      save() {
        const modal = $(document.getElementById('addCondensation'))   //模态框
        modal.modal('hide')
        resolve(this.selectData)
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryQualityProjectTypeUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.projectTypeName = this.search
        this.currenPage = 1
        queryFun(queryQualityProjectTypeUrl, this.ajaxData)
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
    template: `
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
function iqcProject(resolve, url, data, pitchOn, id) {
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
          addProject.$data.checked.forEach((value, key) => {
            result.map.projectInfo.forEach((val, keys) => {
              if (value == val.quality_project_id) {
                result.map.projectInfo[keys].selected = true
              }
            })
          })
          Vue.set(addProject, 'dataList', result.map.projectInfo)
          Vue.set(addProject, 'lines', result.map.lines)
        } else {
          Vue.set(addProject, 'dataList', [])
          Vue.set(addProject, 'lines', 0)
        }
      }
    })
  }
  let addProject = new Vue({
    el: '#addProject',
    data() {
      return {
        models: false,
        checked: [],
        dataList: [], //遍历数据
        lines: 0, //条数
        search: '', //搜索框值
        currenPage: 1, //当前页
        pagesize: 10,   //页码
        selectData: [],//已选择的返回数据
        ajaxData: {
          headNum: 1,
          projectName: '',
          projectId: '',
          projectTypeId: id
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryQualityProjectUrl,
        data: { projectTypeId: id, headNum: 1, projectId: '', projectName: '' },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.projectInfo
            this.lines = result.map.lines
            this.dataList.forEach((value, key) => {
              pitchOn.forEach((val, keys) => {
                if (value.quality_project_id == val.quality_project_id) {
                  this.dataList[key].selected = true
                  this.checked.push(value.quality_project_id)
                }
              })
            })
          }
        }
      })

    },
    mounted() {
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
    methods: {
      choice(val, index) {
        if (val.selected) {
          return false
        } else {
          // const modal = $(document.getElementById('addProject'))   //模态框
          // modal.modal('hide')
          // resolve(this.dataList[index])
          val.selected = true //设置为已选择
          this.checked.push(val.quality_project_id) //存储已选择数据
          this.selectData.push(val)
        }

      },
      save() {
        const modal = $(document.getElementById('addProject'))   //模态框
        modal.modal('hide')
        resolve(this.selectData)
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryQualityProjectUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.projectName = this.search
        this.currenPage = 1
        queryFun(queryQualityProjectUrl, this.ajaxData)
      }
    },
    template: `
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
function optionModel(type, resolve, url, data) {
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
          Vue.set(optionTemplateModel, 'stencilList', result.map.iqcTemplates)
          Vue.set(optionTemplateModel, 'lines', result.map.lines)
        } else {
          Vue.set(optionTemplateModel, 'stencilList', [])
          Vue.set(optionTemplateModel, 'lines', 0)
        }
      }
    })
  }
  queryFun(url, data)
  function queryFun2(url, data) {
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
          Vue.set(optionTemplateModel, 'materialList', result.map.materials)
          Vue.set(optionTemplateModel, 'lines2', result.map.materialInfoLine)
        } else {
          Vue.set(optionTemplateModel, 'materialList', [])
          Vue.set(optionTemplateModel, 'lines2', 0)
        }
      }
    })
  }
  queryFun2(queryMaterialsUrl, { type: 'info', value: '', key: 'keyWord', headNum: 1 })
  let optionTemplateModel = new Vue({
    el: '#optionTemplateModel',
    data() {
      return {
        checkeds: [],
        checkeds2: [],
        disabled: true,
        isShow: true,
        stencilList: [], //遍历数据
        materialList: [], //遍历数据
        material: '',
        lines: 0, //条数
        lines2: 0, //条数
        search: '', //搜索框值
        search2: '', //搜索框值
        currenPage: 1, //当前页
        currenPage2: 1, //当前页
        pagesize: 10,   //页码
        headText: '请选择类模板和物料',//模态框标题
        ajaxData: { //类
          type: 'class',
          templateName: '',
          headNum: 1
        },
        ajaxData2: { //物料
          type: 'info',
          value: '',
          key: 'keyWord',
          headNum: 1
        }
      }
    },
    methods: {
      checked(id, type) {
        if (type == 'checkeds') {
          this.checkeds = []
          this.checkeds.push(id.quality_iqc_template_id)
          if (id.material) {
            this.material = id.material.warehouse_material_id
          }
        } else if (type == 'checkeds2') {
          this.checkeds2 = []
          this.material = id,
            this.checkeds2.push(id.warehouse_material_id)
        }
        if (this.isShow) {
          if (this.checkeds.length && this.checkeds2.length) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        } else {
          if (this.checkeds.length) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        }
      },
      submit() {
        const modal = $(document.getElementById('optionTemplateModel'))   //模态框
        modal.modal('hide')
        resolve({
          iqcTemplates: this.checkeds,
          materials: this.material
        })
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryIQCTemplateUrl, this.ajaxData)
      },
      handleCurrentChange2(val) {
        this.ajaxData2.headNum = (val - 1) * 10 + 1;
        queryFun2(queryMaterialsUrl, this.ajaxData2)

      },
      //搜索框
      searchs(type) {
        if (type == '1') {
          this.ajaxData.templateName = this.search
          this.currenPage = 1
          queryFun(queryIQCTemplateUrl, this.ajaxData)
        } else if (type == '2') {
          this.currenPage2 = 1
          this.ajaxData2.value = this.search2
          queryFun2(queryMaterialsUrl, this.ajaxData2)
        }

      }
    },
    created() {
      if (type == 'inQualityReportInerSwiper') {
        this.isShow = false
        this.ajaxData.type = 'material'
        this.headText = '选择物料模板'
      }
    },
    mounted() {
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
    template: `
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
function applianceModel(resolve, url, data) {
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
          Vue.set(chooseAppliance, 'dataList', result.map.qualityIqcApplianceDO)
          Vue.set(chooseAppliance, 'lines', result.map.lines)
        } else {
          Vue.set(chooseAppliance, 'dataList', [])
          Vue.set(chooseAppliance, 'lines', 0)
        }
      }
    })
  }
  let chooseAppliance = new Vue({
    el: '#chooseAppliance',
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
          applianceName: '',
          headNum: 1
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryApplianceUrl,
        data: { headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.qualityIqcApplianceDO
            this.lines = result.map.lines
          }
        }
      })

    },
    mounted() {
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
    methods: {
      choice(val, index) {
        const modal = $(document.getElementById('chooseAppliance'))   //模态框
        modal.modal('hide')
        resolve(this.dataList[index])
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryApplianceUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.applianceName = this.search
        this.currenPage = 1
        queryFun(queryApplianceUrl, this.ajaxData)
      }
    },
    template: `
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
      $(modal).on('hidden.bs.modal', function (e) {
        $('body').addClass('modal-open')
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
            <div class="modal fade" id="staffModel">
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
function supplierModel(resolve, url, data) {
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
          Vue.set(supplierModel, 'dataList', result.map.suppliers)
          Vue.set(supplierModel, 'lines', result.map.lines)
        } else {
          Vue.set(supplierModel, 'dataList', [])
          Vue.set(supplierModel, 'lines', 0)
        }
      }
    })
  }
  let supplierModel = new Vue({
    el: '#supplierModel',
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
          type: "all",
          headNum: 1,
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: querySuppliersUrl,
        data: { type: 'all', headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.suppliers
            this.lines = result.map.lines
          }
        }
      })

    },
    mounted() {
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
    methods: {
      choice(val, index) {
        const modal = $(document.getElementById('supplierModel'))   //模态框
        modal.modal('hide')
        resolve(this.dataList[index])
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(querySuppliersUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.staffName = this.search
        this.currenPage = 1
        queryFun(querySuppliersUrl, this.ajaxData)
      }
    },
    template: `
            <div class="modal fade" id="supplierModel">
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
function reportTemplate(resolve, url, data) {
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
          Vue.set(reportTemplateModel, 'dataList', result.map.fqctemplateList)
          Vue.set(reportTemplateModel, 'lines', result.map.line)
        } else {
          Vue.set(reportTemplateModel, 'dataList', [])
          Vue.set(reportTemplateModel, 'lines', 0)
        }
      }
    })
  }
  let reportTemplateModel = new Vue({
    el: '#reportTemplateModel',
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
          templateName: '',
          headNum: 1
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryFQCTemplateUrl,
        data: { headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.fqctemplateList
            this.lines = result.map.line
          }
        }
      })

    },
    mounted() {
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
    methods: {
      //点击选择事件
      choice(val, index) {
        this.checked = []
        this.checked.push(index)
        // const modal = $(document.getElementById('reportTemplateModel'))   //模态框
        // modal.modal('hide')
        // resolve(this.dataList[index])
      },
      //确认事件
      submit() {
        var index = this.checked.toString()//将索引值弄出来
        const modal = $(document.getElementById('reportTemplateModel'))   //模态框
        modal.modal('hide')
        resolve(this.dataList[index])//选择传入的数据
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryFQCTemplateUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.templateName = this.search
        this.currenPage = 1
        queryFun(queryFQCTemplateUrl, this.ajaxData)
      }
    },
    template: `
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

//电池型号
function productModel(resolve, url, data) {
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
          Vue.set(productOptionModel, 'dataList', result.map.products)
          Vue.set(productOptionModel, 'lines', result.map.lines)
        } else {
          Vue.set(productOptionModel, 'dataList', [])
          Vue.set(productOptionModel, 'lines', 0)
        }
      }
    })
  }
  let productOptionModel = new Vue({
    el: '#productOptionModel',
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
          productName: '',
          headNum: 1
        }
      }
    },
    created() {
      //循环查询已经选择的
      $.ajax({
        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
        url: queryProductInfosUrl,
        data: { headNum: 1 },
        beforeSend: function (xml) {
          // ajax发送前
          mesloadBox.loadingShow()
        },
        success: (result, status, xhr) => {
          mesloadBox.hide()
          if (result.status === 0) {
            this.dataList = result.map.products
            this.lines = result.map.lines
          }
        }
      })

    },
    mounted() {
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
    methods: {
      choice(val, index) {
        const modal = $(document.getElementById('productOptionModel'))   //模态框
        modal.modal('hide')
        resolve(this.dataList[index])
      },
      //分页变化
      handleCurrentChange(val) {
        this.ajaxData.headNum = (val - 1) * 10 + 1;
        queryFun(queryFQCTemplateUrl, this.ajaxData)
      },
      //搜索框
      searchs() {
        this.ajaxData.productName = this.search
        this.currenPage = 1
        queryFun(queryFQCTemplateUrl, this.ajaxData)
      }
    },
    template: `
            <div class="modal fade" id="productOptionModel">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close" data-dismiss="modal">
                                <span>
                                    <i class="fa fa-close"></i>
                                </span>
                            </button>
                            <h4 class="modal-title">电池型号</h4>
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
                                                            <th style="width: 35%">电池型号</th>
                                                            <th style="width: 10%">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
                                                            <td>{{index+1}}</td>
                                                            <td>{{val.warehouse_product_size }}</td>
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


    // //IQC增加不良信息
    // function unhealthy(resolve, url, data, pitchOn){
    //     function queryFun(url, data) {
    //         $.ajax({
    //             type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
    //             url: url,
    //             data:data,
    //             success: function (result, status, xhr) {
    //                 if(result.status === 0 ){
    //                     unhealthyInformation.$data.checked.forEach((value, key) =>{
    //                         result.map.unqualityInfo.forEach((val, keys) =>{
    //                             if(value == val.quality_unqualified_id){
    //                                 result.map.unqualityInfo[keys].selected = true
    //                             }
    //                         })
    //                     })
    //                     Vue.set(unhealthyInformation,'dataList',result.map.unqualityInfo)
    //                     Vue.set(unhealthyInformation,'lines',result.map.lines)
    //                 }else{
    //                     Vue.set(unhealthyInformation,'dataList',[])
    //                     Vue.set(unhealthyInformation,'lines',0)
    //                 }
    //             }
    //         })
    //     }

    //     let unhealthyInformation  = new Vue({
    //         el:'#unhealthyInformation',
    //         data() {
    //             return {
    //                 models:false,
    //                 checked:[],
    //                 dataList:[], //遍历数据
    //                 lines:0, //条数
    //                 search:'', //搜索框值
    //                 currenPage:1, //当前页
    //                 pagesize: 10,   //页码
    //                 ajaxData:{
    //                     projectTypeId: '',
    //                     projectTypeName: '',
    //                     headNum: 1
    //                 }
    //             }
    //         },
    //         created(){
    //             $.ajax({
    //                 type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
    //                 url: queryUnqualifiedtUrl,
    //                 data:{headNum:1},
    //                 success:  (result, status, xhr) => {
    //                     if(result.status === 0 ){
    //                         this.dataList = result.map.unqualityInfo
    //                         this.lines = result.map.lines
    //                         this.dataList.forEach((value, key) => {
    //                             pitchOn.forEach((val, keys) => {
    //                                 if(value.quality_unqualified_id == val.quality_unqualified_id){
    //                                     this.dataList[key].selected = true
    //                                     this.checked.push(value.quality_unqualified_id)
    //                                 }
    //                             })
    //                         })
    //                     }
    //                 }
    //             })
    //         },
    //         mounted(){
    //             const modal = document.getElementById('unhealthyInformation')   //模态框
    //             $(modal).modal({
    //                 backdrop: 'static', // 黑色遮罩不可点击
    //                 keyboard: false,  // esc按键不可关闭模态框
    //                 show: true     //显示
    //             })
    //             $(modal).on('hidden.bs.modal', function (e) {
    //                 $('body').addClass('modal-open')
    //             })
    //         },
    //         methods:{
    //             choice(val, index){
    //                 if(val.selected){
    //                     return false
    //                 }else{
    //                     const modal = $(document.getElementById('unhealthyInformation'))   //模态框
    //                     modal.modal('hide')
    //                     resolve(this.dataList[index])
    //                 }
    //             },
    //              //分页变化
    //              handleCurrentChange(val){
    //                 this.ajaxData.headNum = (val - 1) * 10 + 1;
    //                 queryFun(queryUnqualifiedtUrl,this.ajaxData)
    //             },
    //             //搜索框
    //             searchs(){
    //                 this.ajaxData.projectTypeName = this.search
    //                 this.currenPage = 1
    //                 queryFun(queryUnqualifiedtUrl,this.ajaxData)
    //             }
    //         },
    //         template:`
    //         <div class="modal fade" id="unhealthyInformation">
    //             <div class="modal-dialog">
    //                 <div class="modal-content">
    //                     <div class="modal-header">
    //                         <button class="close" data-dismiss="modal">
    //                             <span>
    //                                 <i class="fa fa-close"></i>
    //                             </span>
    //                         </button>
    //                         <h4 class="modal-title">不良信息</h4>
    //                     </div>
    //                     <div class="modal-body">
    //                         <div class="container-fluid">
    //                             <div class="row">
    //                                 <div class="col-sm-12">
    //                                     <div class="panel panel-default">
    //                                         <div class="panel-heading panel-heading-table">
    //                                             <div class="col-xs-6"></div>
    //                                             <div class="col-xs-6">
    //                                                 <form class="form-inline pull-right" action="" onsubmit="return false;">
    //                                                     <div class="input-group input-group-sm fuzzy-search-group">
    //                                                         <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
    //                                                         <div class="input-group-btn" @click="searchs()">
    //                                                             <button type="button" class="btn btn-primary">
    //                                                                 <i class="fa fa-search"></i>
    //                                                             </button>
    //                                                         </div>
    //                                                     </div>
    //                                                 </form>
    //                                             </div>
    //                                         </div>
    //                                         <div class="table-height-10">
    //                                             <table class="table table-bordered">
    //                                                 <thead>
    //                                                     <tr>
    //                                                         <th style="width: 20%">序号</th>
    //                                                         <th style="width: 35%">不良代号</th>
    //                                                         <th style="width: 35%">描述</th>
    //                                                         <th style="width: 10%">操作</th>
    //                                                     </tr>
    //                                                 </thead>
    //                                                 <tbody>
    //                                                     <tr v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class=" val.selected ? 'bg-success':'' ">
    //                                                         <td>{{index+1}}</td>
    //                                                         <td>{{val.quality_unqualified_code}}</td>
    //                                                         <td>{{val.quality_unqualified_detail}}</td>
    //                                                         <td class="table-input-td">
    //                                                             <label class="checkbox-inline">
    //                                                                 <input type="checkbox" v-model="checked" onclick="return false">
    //                                                             </label>
    //                                                         </td>
    //                                                     </tr>
    //                                                     <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
    //                                                 </tbody>
    //                                             </table>
    //                                         </div>
    //                                         <div class="panel-footer panel-footer-table text-right">
    //                                             <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //         `
    //     })

    // }




















