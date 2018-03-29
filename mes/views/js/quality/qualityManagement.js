
let leftNav = $('#mainLeftSidebar .sidebar-nav');// 左侧边栏
let leftNavLink = leftNav.find('a').filter('[href^="#"]');// 左侧变栏对应的swiper
let qualityProjectTypeList = [];  //存储检验项目类型
let checkWayList = [];  //存储检验方式
let materialTypeList = [];  //存储设备类型,物料类型
let classList = [];  //存储班次



$(function () {

  // $('.modal').on('hidden.bs.modal', function (e) {
  //   // 页面全部模态框
  //   const pageAllModal = document.getElementsByClassName('modal')
  //   // 模态框转为数组
  //   const pageAllModalArray = [...pageAllModal]
  //   const isNotContainClassIn = pageAllModalArray.some((value, index) => {
  //     return value.classList.contains('in')
  //   })
  //   if (isNotContainClassIn === true) {
  //     $('body').addClass('modal-open')
  //   }
  // })

  /**
  * @description :获取检验项目类型集合
  */
  ; (function loadCheckItemType() {
    $.ajax({
      type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
      data: { headNum: '', projectTypeId: '', projectTypeName: '' },
      url: queryQualityProjectTypeUrl,
      success: function (result, status, xhr) {
        if (result.status === 0) {
          qualityProjectTypeList = result.map.projectInfo
        }
        else {
          swallFail();	//操作失败
        }
      }
    })
  }());

  /**
  * @description :获取检验方式类型集合
  */
  ; (function loadCheckWay() {
    $.ajax({
      type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
      data: { headNum: '', checkMethodId: '', checkMethodName: '' },
      url: queryCheckMethodUrl,
      success: function (result, status, xhr) {
        if (result.status === 0) {
          checkWayList = result.map.qualityCheckMethodDO
        }
        else {
          swallFail();	//操作失败
        }
      }
    })
  }());

  /**
* @description :获取设备类型,物料类型
*/
  // ; (function loadMaterialType() {
  //   $.ajax({
  //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
  //     url: queryCategoryUrl,
  //     success: function (result, status, xhr) {
  //       materialTypeList = result.map.materialType
  //     }
  //   })
  // }());

  /**
* @description :获取班次集合
*/
  ; (function loadJobNumberList() {
    $.ajax({
      type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
      data: { headNum: 1, type: 'info' },
      url: queryClassesUrl,
      success: function (result, status, xhr) {
        classList = result.map.classes
      }
    })
  }());



  leftNavLink.on('click', function (event) {
    let targetHref = event.currentTarget.getAttribute('href');

    switch (targetHref) {
      case '#checkItemTypeManage': {	//项目类型管理
        ; (function () {
          const swiper = document.getElementById('checkItemTypeManage')   //右侧外部swiper
          const inerSwiper = document.getElementById('checkItemTypeManageInerSwiper') // 右侧内部swiper
          const modal = document.getElementById('basicInfoModal')   //要弹出的模态框

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框
          // 弹出模态框vue实例对应的template
          let templateStr = `
              <div class="panel-body-table">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th style="width:20%">名称</th>
                      <td class="table-input-td" style="width:30%">
                        <input
                          type="text"
                          class="table-input"
                          v-model.trim="data.projectTypeName"
                          maxlength="25"
                          placeholder="请输入(必填)"
                          autocomplete="on"
                        >
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">说明</th>
                       <td class="table-input-td" style="width:30%">
                        <input
                          type="text"
                          class="table-input"
                          v-model.trim="data.projectTypeDetail"
                          placeholder="请输入" autocomplete="on"
                        >
                      </td>
                    </tr>
                    <tr v-if="type === 'add' " >
                      <th style="width:20%">是否可修改删除</th>
                       <td class="table-input-td" style="width:30%">
                        <select
                          class="form-control table-input input-sm"
                          v-model.trim="data.isModify"
                          v-bind:value="data.isModify"
                        >
                            <option value="0">是</option>
                            <option value="1">否</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              `
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, projectTypeId: '', projectTypeName: '' },//搜索参数
                tbodyData: [],  //表格数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryQualityProjectTypeUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.searchDataInput = ''
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

              //新增
              add() {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = {
                  projectTypeName: '',
                  projectTypeDetail: '',
                  isModify: '0',
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('add', '新增项目类型', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //修改
              modify(value) {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })
                let submitData = {
                  projectTypeId: value.quality_project_type_id,
                  projectTypeName: value.quality_project_type_name,
                  projectTypeDetail: value.quality_project_type_detail,
                  isModify: '0',
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('modify', '修改项目类型', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {
                // console.log(value.quality_project_type_id)
                let submitData = {
                  projectTypeId: value.quality_project_type_id
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(removeQualityProjectTypeUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.projectTypeName = this.searchDataInput
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },
            template: `
              <div class="swiper-slide swiper-no-swiping" id="checkItemTypeManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm ">
                                    <input class="form-control" type="text"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字" maxlength="25">
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
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 10%;">序号</th>
                              <th style="width: 30%;">类型名称</th>
                              <th style="width: 30%;">说明</th>
                              <th style="width: 30%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td
                                v-text="index + 1"
                              >
                              </td>
                              <td v-text="value.quality_project_type_name">
                              </td>
                              <td v-text="value.quality_project_type_detail">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="modify(value)" href="javascript:;" v-show="value.quality_type_status == '0'">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>

                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;" v-show="value.quality_type_status == '0'">
                                  <i class="fa fa-trash-o"></i>删除</a>

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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#checkItemManage': {  //检验项目管理
        ; (function () {
          const swiper = document.getElementById('checkItemManage')   //右侧外部swiper
          const inerSwiper = document.getElementById('checkItemManageInerSwiper') // 右侧内部swiper
          const modal = document.getElementById('basicInfoModal')   //要弹出的模态框

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 弹出模态框vue实例对应的template
          let templateStr = `
              <div class="panel-body-table">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th style="width:20%">名称</th>
                      <td class="table-input-td" style="width:30%">
                        <input  type="text"
                        class="table-input"
                        v-model.trim="data.qualityProjectName"
                        placeholder="请输入(必填)"
                        autocomplete="on">
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">项目类型</th>
                       <td
                        class="table-input-td" style="width:30%"
                        v-if="data.isModifyProjectType"
                       >
                        <select
                          class="form-control table-input input-sm"
                          v-model.trim="data.qualityProjectTypeId"
                          v-bind:value="data.qualityProjectTypeId"
                        >
                            <option disabled value="">请选择</option>
                              <option
                              v-show="data.qualityProjectTypeList.length"
                              v-for="(value, index) in data.qualityProjectTypeList"
                              :key="index"
                              v-bind:value="value.quality_project_type_id">
                              {{value.quality_project_type_name}}
                            </option>
                        </select>
                      </td>
                      <td
                        style="width:30%"
                        v-else = "data.isModifyProjectType"
                        v-text = "data.projectTypeName"
                      >
                      </td>
                     </tr>
                  </tbody>
                </table>
               </div>
              `
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                qualityProjectTypeList: qualityProjectTypeList, //类型集合用于生成下拉选
                searchData: { headNum: 1, projectName: '', projectTypeId: '' },//搜索参数
                tbodyData: [],  //表格数据
                searchDataSelect: '',//下拉选选择的数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryQualityProjectUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.searchDataInput = '' //清空搜索框
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

              //新增
              add() {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = { //要提交的数据
                  qualityProjectName: '',
                  qualityProjectTypeId: '',
                  qualityProjectTypeList: qualityProjectTypeList,
                  isModifyProjectType: true
                }

                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('add', '新增项目', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //修改
              modify(value) {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = { //要提交的数据
                  projectId: value.qualityProjects.quality_project_id,
                  qualityProjectName: value.qualityProjects.quality_project_name,
                  projectTypeName: value.qualityProjectType.quality_project_type_name,
                  qualityProjectTypeId: value.qualityProjectType.quality_project_type_id,
                  qualityProjectTypeList: qualityProjectTypeList,
                  isModifyProjectType: false //不可修改项目类型
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('modify', '修改项目', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {
                // console.log(value.quality_project_type_id)
                let submitData = {
                  projectId: value.quality_type_project_id
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(removeQualityProjectUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索和下拉选搜索
              search() {
                this.currenPage = 1
                this.searchData.projectName = this.searchDataInput
                this.searchData.projectType = this.searchDataInput
                this.searchData.projectTypeId = this.searchDataSelect
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="checkItemManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm">
                                     <select
                                      class="form-control table-input input-sm"
                                       @change = "search()"
                                      v-model.trim="searchDataSelect"
                                      v-bind:value="searchDataSelect"
                                    >
                                      <option  value="">全部类型</option>
                                      <option
                                        v-show="qualityProjectTypeList.length"
                                        v-for="(value, index) in qualityProjectTypeList" :key="index"
                                        v-bind:value="value.quality_project_type_id">{{value.quality_project_type_name}}
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
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
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
                            >
                              <td v-text="index + 1">
                              </td>
                              <td v-text="value.qualityProjects.quality_project_name">
                              </td>
                              <td v-text="value.qualityProjectType.quality_project_type_name">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#checkWayManage': {  //检验方式管理
        ; (function () {
          const swiper = document.getElementById('checkWayManage')   //右侧外部swiper
          const inerSwiper = document.getElementById('checkWayManageInerSwiper') // 右侧内部swiper
          const modal = document.getElementById('basicInfoModal')   //要弹出的模态框

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框
          // 弹出模态框vue实例对应的template
          let templateStr = `
              <div class="panel-body-table">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th style="width:20%">名称</th>
                      <td class="table-input-td" style="width:30%">
                        <input
                          type="text"
                          class="table-input"
                          v-model.trim="data.checkMethodName"
                          maxlength="25"
                          placeholder="请输入(必填)"
                          autocomplete="on"
                        >
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">说明</th>
                       <td class="table-input-td" style="width:30%">
                        <input
                          type="text"
                          class="table-input"
                          v-model.trim="data.checkMethodDetail"
                          placeholder="请输入" autocomplete="on"
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              `
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, checkMethodId: '', checkMethodName: '' },//搜索参数
                tbodyData: [],  //表格数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryCheckMethodUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.searchDataInput = ''
                    if (result.status == 0) {
                      this.tbodyData = result.map.qualityCheckMethodDO
                      this.lines = result.map.lines
                    }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = {
                  checkMethodName: '',
                  checkMethodDetail: ''
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('add', '新增检验方式', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //修改
              modify(value) {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })
                let submitData = {
                  checkMethodId: value.quality_check_method_id,
                  checkMethodName: value.quality_check_method_name,
                  checkMethodDetail: value.quality_check_method_detail,
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('modify', '修改检验方式', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {
                // console.log(value.quality_project_type_id)
                let submitData = {
                  checkMethodId: value.quality_check_method_id
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(removeCheckMethodUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.checkMethodName = this.searchDataInput
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="checkWayManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm ">
                                    <input class="form-control" type="text"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字" maxlength="25">
                                    <div class="input-group-btn">
                                      <a href="javascript:;" class="btn btn-primary btn-sm" @click.stop.prevent ="search()">
                                       <i class="fa fa-search"></i>
                                      </a>
                                    </div>
                                  </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 10%;">序号</th>
                              <th style="width: 30%;">类型名称</th>
                              <th style="width: 30%;">说明</th>
                              <th style="width: 30%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td
                                v-text="index + 1"
                              >
                              </td>
                              <td v-text="value.quality_check_method_name">
                              </td>
                              <td v-text="value.quality_check_method_detail">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#measureManage': {	//测试量具管理
        ; (function () {
          const swiper = document.getElementById('measureManage')   //右侧外部swiper
          const inerSwiper = document.getElementById('measureManageInerSwiper') // 右侧内部swiper
          const modal = document.getElementById('basicInfoModal')   //要弹出的模态框

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框
          // 弹出模态框vue实例对应的template
          let templateStr = `
              <div class="panel-body-table">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th style="width:20%">代号</th>
                      <td class="table-input-td" style="width:30%">
                        <input  type="text" class="table-input" v-model.trim="data.applianceNumber" placeholder="请输入(必填)" autocomplete="on">
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">名称</th>
                      <td class="table-input-td" style="width:30%">
                        <input  type="text" class="table-input" v-model.trim="data.applianceName" placeholder="请输入(必填)" autocomplete="on">
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">说明</th>
                       <td class="table-input-td" style="width:30%">
                        <input type="text" class="table-input" v-model.trim="data.applianceDetail" placeholder="请输入" autocomplete="on">
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              `
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1,applianceId: '', applianceName: '', applianceNumber: '', applianceDetail: '' },//搜索参数
                tbodyData: [],  //表格数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryApplianceUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.searchDataInput = ''
                    if (result.status == 0) {
                      this.tbodyData = result.map.qualityIqcApplianceDO
                      this.lines = result.map.lines
                    }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = {
                  applianceName: '',
                  applianceName: '',
                  applianceDetail: ''
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('add', '新增器具', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //修改
              modify(value) {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })
                let submitData = {
                  applianceId: value.quality_appliance_id,
                  applianceName: value.quality_appliance_name,
                  applianceNumber: value.quality_appliance_number,
                  applianceDetail: value.quality_appliance_detail,
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('modify', '修改器具', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {
                // console.log(value.quality_project_type_id)
                let submitData = {
                  applianceId: value.quality_appliance_id
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(removeApplianceUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.applianceName = this.searchDataInput
                this.searchData.applianceNumber = this.searchDataInput

                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="measureManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm ">
                                    <input class="form-control" type="text"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字" maxlength="25">
                                    <div class="input-group-btn">
                                      <a href="javascript:;" class="btn btn-primary btn-sm" @click.stop.prevent ="search()">
                                       <i class="fa fa-search"></i>
                                      </a>
                                    </div>
                                  </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 5%;">序号</th>
                              <th style="width: 20%;">代号</th>
                              <th style="width: 20%;">名称</th>
                              <th style="width: 35%;">说明</th>
                              <th style="width: 20%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td
                                v-text="index + 1"
                              >
                              </td>
                              <td v-text="value.quality_appliance_number">
                              </td>
                              <td v-text="value.quality_appliance_name">
                              </td>
                              <td v-text="value.quality_appliance_detail">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#badnessCodeManage': { //不良代号管理
        ; (function () {
          const swiper = document.getElementById('badnessCodeManage')   //右侧外部swiper
          const inerSwiper = document.getElementById('badnessCodeManageInerSwiper') // 右侧内部swiper
          const modal = document.getElementById('basicInfoModal')   //要弹出的模态框

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框
          // 弹出模态框vue实例对应的template
          let templateStr = `
              <div class="panel-body-table">
                <table class="table table-bordered">
                  <tbody>
                    <tr>
                      <th style="width:20%">不良代码</th>
                      <td class="table-input-td" style="width:30%">
                        <input  type="text" class="table-input" v-model.trim="data.unqualifiedCode" placeholder="请输入(必填)" autocomplete="on">
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">不良描述</th>
                      <td class="table-input-td" style="width:30%">
                        <input  type="text" class="table-input" v-model.trim="data.unqualifiedDetail" placeholder="请输入(必填)" autocomplete="on">
                      </td>
                    </tr>
                    <tr>
                      <th style="width:20%">拦截标识</th>
                       <td class="table-input-td" style="width:30%">
                        <input type="text" class="table-input" v-model.trim="data.unqualifiedInterceptor" placeholder="请输入(必填)" autocomplete="on">
                      </td>
                    </tr>
                  </tbody>
                </table>
               </div>
              `
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: inerSwiper,
            data() {
              return {
                searchData: { headNum: 1, keyWord: ''},//搜索参数
                tbodyData: [],  //表格数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryUnqualifiedUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    this.searchDataInput = ''
                    if (result.status == 0) {
                      this.tbodyData = result.map.unqualityInfo
                      this.lines = result.map.lines
                    }
                    else {
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })

                let submitData = {
                  unqualifiedCode: '',
                  unqualifiedDetail: '',
                  unqualifiedInterceptor: ''
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('add', '新增不良代号', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //修改
              modify(value) {

                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true        //显示
                })
                let submitData = {
                  unqualifiedId: value.quality_unqualified_id,
                  unqualifiedCode: value.quality_unqualified_code,
                  unqualifiedDetail: value.quality_unqualified_detail,

                  unqualifiedInterceptor: value.quality_unqualified_interceptor,
                }
                let promise = new Promise((resolve, reject) => {
                  basicInfoModal('modify', '修改项目类型', targetHref, templateStr, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {
                // console.log(value.quality_project_type_id)
                let submitData = {
                  unqualifiedId: value.quality_unqualified_id
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(removeUnqualifiedUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.keyWord = this.searchDataInput
                // this.searchData.unqualifiedCode = this.searchDataInput
                // this.searchData.unqualifiedDetail = this.searchDataInput
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="badnessCodeManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm ">
                                    <input class="form-control" type="text"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字" maxlength="25">
                                    <div class="input-group-btn">
                                      <a href="javascript:;" class="btn btn-primary btn-sm" @click.stop.prevent ="search()">
                                       <i class="fa fa-search"></i>
                                      </a>
                                    </div>
                                  </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 5%;">序号</th>
                              <th style="width: 20%;">不良代码</th>
                              <th style="width: 35%;">不良描述</th>
                              <th style="width: 20%;">拦截标识</th>
                              <th style="width: 20%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td
                                v-text="index + 1"
                              >
                              </td>
                              <td v-text="value.quality_unqualified_code">
                              </td>
                               <td v-text="value.quality_unqualified_detail">
                              </td>
                              <td v-text="value.quality_unqualified_interceptor">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
               `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

        }())
      }
        break;
      case '#inQualityReport': {	//进货检验报告
        const swiper = document.getElementById('inQualityReport')   //右侧外部swiper
        const inerSwiper = document.getElementById('inQualityReportInerSwiper') // 右侧内部swiper

        function queryFun(url, data) {
          var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
          })
          $.ajax({
            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
            url: queryIQCReportUrl,
            data: data,
            beforeSend: function (xml) {
              // ajax发送前
              mesloadBox.loadingShow()
            },
            success: function (result, status, xhr) {
              mesloadBox.hide()
              if (result.status === 0) {
                Vue.set(panelBodyTableVM, 'dataList', result.map.iqcReports)
                Vue.set(panelBodyTableVM, 'lines', result.map.lines)
              } else {
                Vue.set(panelBodyTableVM, 'dataList', [])
                Vue.set(panelBodyTableVM, 'lines', 0)
              }

            }
          })
        }
        queryFun(queryIQCReportUrl, { headNum: 1 })
        //主页
        let panelBodyTableVM = new Vue({
          el: inerSwiper,
          data() {
            return {
              models: false,
              dataList: '', //遍历数据
              lines: 0, //条数
              search: '', //搜索框值
              currenPage: 1, //当前页
              pagesize: 10,   //页码
              ajaxData: {
                reportName: '',
                headNum: 1
              }
            }
          },
          methods: {
            //详情
            detailsModel(val) {
              model('details', val.quality_iqc_report_id)
            },
            //修改
            modificationModel(val) {
              model('modificationModel', val.quality_iqc_report_id)
            },
            //新增
            add() {
              let promise = new Promise(function (resolve, reject) {
                optionModel('inQualityReportInerSwiper', resolve, queryIQCTemplateUrl, { type: 'material', headNum: 1 })
              })
              promise.then((resolveData) => {
                model('add', resolveData.iqcTemplates.toString(), resolveData.materials)
              })
            },
            //分页变化
            handleCurrentChange(val) {
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              queryFun(queryIQCReportUrl, this.ajaxData)
            },
            //搜索框
            searchs() {
              this.ajaxData.reportName = this.search
              this.currenPage = 1
              queryFun(queryIQCReportUrl, this.ajaxData)
            },
            deletes(id) {
              swal({
                title: '您确定要删除此条数据吗？',
                text: '删除后将无法查询',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(function () {
                $.ajax({
                  url: modifyIQCReportUrl,
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  data: {
                    'reportId': id,
                    'status': 1,
                  },
                  success: function (result) {
                    if (result.status === 0) {
                      swal({
                        title: '删除成功',
                        type: 'success',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      }).then(
                        () => {
                        },
                        (dismiss) => {
                          queryFun(queryIQCReportUrl, { headNum: 1 })
                        })
                    }
                    else {
                      swal({
                        title: '删除失败',
                        type: 'warning',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      })
                    }
                  }
                })
              })
            }
          },
          template: `
                <div class="swiper-slide swiper-no-swiping" id="inQualityReportInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()" >新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                    <div class="input-group-btn"  @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="vueel">
                                    <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover ">
                                        <thead>
                                            <tr>
                                                <th style="width: 4%;">序号</th>
                                                <th style="width: 10%;">报告名称</th>
                                                <th style="width: 10%;">物料名称</th>
                                                <th style="width: 10%;">批次</th>
                                                <th style="width: 10%;">规格</th>
                                                <th style="width: 10%;">型号</th>
                                                <th style="width: 10%;">数量</th>
                                                <th style="width: 10%;">单位</th>
                                                <th style="width: 10%;">检验结果</th>
                                                <th style="width: 16%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_report_name}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_name :''}}</td>
                                                <td>{{value.warehouse_material_batch}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_standard :''}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_model :''}}</td>
                                                <td>{{value.warehouse_material_number}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_units :''}}</td>
                                                <td>{{value.quality_iqc_comprehensive_result ? '合格' : '不合格'}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;"><i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;"  @click="deletes(value.quality_iqc_report_id)"><i class="fa fa-trash-o"></i>删除</a>
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
                `
        })
        //新增、详情、修改模态框
        function model(type, id, materials) {
          if (type !== 'add') {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryIQCReportRecordUrl,
              data: { reportId: id },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(addInQualityReportModal, 'iqcReports', result.map.iqcReports[0])
                  Vue.set(addInQualityReportModal, 'iqcRecords', result.map.iqcRecords)
                  if (result.map.iqcUnqualifieds) {
                    Vue.set(addInQualityReportModal, 'iqcUnqualified', result.map.iqcUnqualifieds)
                  }
                  var data = {
                    quality_iqc_report_name: result.map.iqcReports[0].quality_iqc_report_name,  //报告名称
                    quality_iqc_report_number: result.map.iqcReports[0].quality_iqc_report_number, // 报告单号
                    quality_iqc_inspection_date: result.map.iqcReports[0].quality_iqc_inspection_date,//报检日期
                    quality_iqc_examine: result.map.iqcReports[0].quality_iqc_examine,  //审核人
                    quality_iqc_approve: result.map.iqcReports[0].quality_iqc_approve,  //批准人
                    quality_iqc_examine_date: result.map.iqcReports[0].quality_iqc_examine_date, //审核日期
                    quality_iqc_approve_date: result.map.iqcReports[0].quality_iqc_approve_date, //批准日期
                    warehouse_material_batch: result.map.iqcReports[0].warehouse_material_batch,//物料批好
                    warehouse_material_number: result.map.iqcReports[0].warehouse_material_number,//物料数量
                    quality_iqc_comprehensive_result: result.map.iqcReports[0].quality_iqc_comprehensive_result, //综合判定(0:合格 1：不合格)
                  }
                  var data2 = [], iqcResults = []
                  result.map.iqcRecords.forEach((val, key) => {
                    data2.push([])
                    val.qualityProjects.forEach((value, index) => {
                      data2[key].push({
                        quality_iqc_project_result_id: value.iqcProjectResult.quality_iqc_project_result_id,
                        quality_project_id: value.quality_project_id, //项目id
                        quality_iqc_project_number: value.iqcProjectResult.quality_iqc_project_number, //抽检数量
                        quality_iqc_project_value: value.iqcProjectResult.quality_iqc_project_value,//抽检值（数据集合，用逗号隔开）
                        quality_iqc_project_average_value: value.iqcProjectResult.quality_iqc_project_average_value,  //平均值
                        quality_iqc_project_range: value.iqcProjectResult.quality_iqc_project_range,  //极差
                        quality_iqc_project_determine: value.iqcProjectResult.quality_iqc_project_determine, //判定结果
                      })
                    })
                  })
                  result.map.iqcResults.forEach((val, key) => {
                    iqcResults.push({
                      quality_iqc_report_id: val.quality_iqc_report_id,
                      quality_iqc_result_id: val.qualityProject.iqcResult.quality_iqc_result_id,
                      quality_project_name: val.qualityProject.quality_project_name,
                      quality_project_id: val.qualityProject.quality_project_id, //项目id
                      quality_iqc_check_level: val.quality_iqc_check_level, //检查水平
                      quality_iqc_receive_ac_level: val.quality_iqc_receive_ac_level, //ac接收水平
                      quality_iqc_receive_rc_level: val.quality_iqc_receive_rc_level, //re接收水平
                      quality_iqc_result_number: val.quality_iqc_result_number, //抽样数量
                      quality_iqc_check_result: val.quality_iqc_check_result, //检验结果（0：合格1：不合格）
                      quality_iqc_checker: val.quality_iqc_checker, //检验员id
                      quality_iqc_check_date: val.quality_iqc_check_date, //检验日期
                    })
                  })
                  if (result.map.iqcReports[0].supplier) {
                    Vue.set(addInQualityReportModal, 'supplier', result.map.iqcReports[0].supplier.supplier_name)
                    data.supplier_id = result.map.iqcReports[0].supplier.supplier_id
                  }
                  Vue.set(addInQualityReportModal, 'iqcResult', iqcResults)
                  Vue.set(addInQualityReportModal, 'iqcProjectResult', data2)
                  Vue.set(addInQualityReportModal, 'iqcReport', data)
                  Vue.set(addInQualityReportModal, 'examines', result.map.iqcReports[0].quality_iqc_examine)
                  Vue.set(addInQualityReportModal, 'approves', result.map.iqcReports[0].quality_iqc_approve)

                } else {
                  Vue.set(addInQualityReportModal, 'iqcReports', [])
                  Vue.set(addInQualityReportModal, 'iqcRecords', [])
                }

              }
            })
          } else {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryIQCTemplateUrl,
              data: { type: 'material', templateId: id, headNum: 1 },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(addInQualityReportModal, 'iqcReports', result.map.iqcTemplates[0])
                  Vue.set(addInQualityReportModal, 'iqcRecords', result.map.materialTemplates)
                  var data = [], iqcResults = []
                  result.map.materialTemplates.forEach((val, key) => {
                    data.push([])
                    // data2.push([])
                    val.qualityProjects.forEach((value, index) => {
                      // if(val.quality_project_type_name == '检验结果'){
                      //     // data2[key].push({
                      //     //     quality_project_id:value.quality_project_id, //项目id
                      //     //     quality_iqc_check_level:'', //检查水平
                      //     //     quality_iqc_receive_ac_level:'', //ac接收水平
                      //     //     quality_iqc_receive_rc_level:'', //re接收水平
                      //     //     quality_iqc_result_number:'', //抽样数量
                      //     //     quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
                      //     //     quality_iqc_checker:'', //检验员id
                      //     //     quality_iqc_checker_name:'', //检验员
                      //     //     quality_iqc_check_date:'', //检验日期
                      //     // })
                      // }else{
                      data[key].push({
                        quality_project_id: value.quality_project_id, //项目id
                        quality_iqc_project_number: '', //抽检数量
                        quality_iqc_project_value: '',//抽检值（数据集合，用逗号隔开）
                        quality_iqc_project_average_value: '',  //平均值
                        quality_iqc_project_range: '',  //极差
                        quality_iqc_project_determine: '', //判定结果
                      })
                      // }
                    })
                  })
                  result.map.iqcResults.forEach((val, key) => {
                    iqcResults.push({
                      quality_iqc_result_id: val.qualityProject.iqcResult.quality_iqc_result_id,
                      quality_project_name: val.qualityProject.quality_project_name,
                      quality_project_id: val.qualityProject.quality_project_id, //项目id
                      quality_iqc_check_level: '', //检查水平
                      quality_iqc_receive_ac_level: '', //ac接收水平
                      quality_iqc_receive_rc_level: '', //re接收水平
                      quality_iqc_result_number: '', //抽样数量
                      quality_iqc_check_result: '', //检验结果（0：合格1：不合格）
                      quality_iqc_checker: '', //检验员id
                      quality_iqc_check_date: '', //检验日期
                    })
                  })
                  Vue.set(addInQualityReportModal, 'iqcResult', iqcResults)
                  Vue.set(addInQualityReportModal, 'iqcProjectResult', data)
                } else if (result.status === 2) {
                  Vue.set(addInQualityReportModal, 'iqcReports', result.map.iqcTemplates[0])
                  Vue.set(addInQualityReportModal, 'iqcRecords', [])
                } else {
                  Vue.set(addInQualityReportModal, 'iqcReports', [])
                  Vue.set(addInQualityReportModal, 'iqcRecords', [])
                }

              }
            })
          }

          let addInQualityReportModal = new Vue({
            el: '#addInQualityReportModal',
            data() {
              return {
                iqcReports: [],//基础数据
                iqcRecords: [],//项目
                isShow: false,
                isShowAdd: false,
                add: false,
                headText: '新增进货检验报告',//模态框
                examines: '', //审核人
                approves: '', //批准人
                supplier: '', //供应商
                iqcUnqualified: [], // 不合格内容
                iqcReport: {
                  quality_iqc_template_id: id,
                  warehouse_material_id: '',
                  quality_iqc_report_name: '',  //报告名称
                  quality_iqc_report_number: '', // 报告单号
                  quality_iqc_inspection_date: '',//报检日期
                  quality_iqc_examine: '',  //审核人
                  quality_iqc_approve: '',  //批准人
                  quality_iqc_examine_date: '', //审核日期
                  quality_iqc_approve_date: '', //批准日期,
                  supplier_id: '', //供应商id
                  warehouse_material_batch: '',//物料批好
                  warehouse_material_number: '',//物料数量
                  quality_iqc_comprehensive_result: '', //综合判定(0:合格 1：不合格)
                },
                iqcResult: [{
                  quality_project_id: '', //项目id
                  quality_iqc_check_level: '', //检查水平
                  quality_iqc_receive_ac_level: '', //ac接收水平
                  quality_iqc_receive_rc_level: '', //re接收水平
                  quality_iqc_result_number: '', //抽样数量
                  quality_iqc_check_result: '', //检验结果（0：合格1：不合格）
                  quality_iqc_checker: '', //检验员id
                  quality_iqc_check_date: '', //检验日期
                }],
                iqcProjectResult: [{
                  quality_project_id: '', //项目id
                  quality_iqc_project_number: '', //抽检数量
                  quality_iqc_project_value: '',//抽检值（数据集合，用逗号隔开）
                  quality_iqc_project_average_value: '',  //平均值
                  quality_iqc_project_range: '',  //极差
                  quality_iqc_project_determine: '', //判定结果
                }],
                sendJudgment: {
                  iqcReport: 0, //基础信息
                  iqcUnqualified: 0, //不合格内容
                  iqcResult: 0, //检查结果
                  iqcProjectResult: 0 //项目
                }
                // iqcUnqualified:{
                //     quality_iqc_unqualified_content:'', //不合格内容
                //     quality_sample_number:'',  //抽样数量
                //     quality_iqc_unqualified_number:'',  //不良数量
                //     quality_iqc_unqualified_probability:'',  //不良率
                // }
              }
            },
            mounted() {
              const modal = document.getElementById('addInQualityReportModal')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })


            },
            created() {
              if (type == 'modificationModel') {
                this.isShowAdd = true
                this.headText = '修改进货检验报告'
              } else if (type == 'add') {
                this.add = true
                this.iqcReport.warehouse_material_id = materials
                this.headText = '新增进货检验报告'
              } else if (type == 'details') {
                this.isShow = true
                this.headText = '进货检验报告详情'
              }
            },
            methods: {
              //点击检验工具事件
              measuringTool() { },
              //选择物料模板事件
              material() {
                let promise = new Promise(function (resolve, reject) {
                  materialModel(resolve, null, null)
                })
                promise.then((resolveData) => {
                  console.log(resolveData)
                })

              },
              //尺寸特性查看事件
              examine(key, index) {
                let promise = new Promise((resolve, reject) => {
                  sampling(resolve, this.iqcProjectResult[key][index].quality_iqc_project_number, this.iqcProjectResult[key][index].quality_iqc_project_value)
                })
                promise.then((resolveData) => {
                  this.iqcProjectResult[key][index].quality_iqc_project_average_value = resolveData.mean
                  this.iqcProjectResult[key][index].quality_iqc_project_range = resolveData.ranges
                  this.iqcProjectResult[key][index].quality_iqc_project_number = resolveData.samplingNumber
                  this.iqcProjectResult[key][index].quality_iqc_project_value = resolveData.samplingValue
                })
              },
              //不合格内容增加项目
              addIllegal() {
                // let promise = new Promise( (resolve, reject) => {
                //     unhealthy(resolve, null, null, this.illegal)
                // })
                // promise.then( (resolveData) => {
                this.iqcUnqualified.push(
                  {
                    quality_iqc_unqualified_content: '', //不合格内容
                    quality_sample_number: '',  //抽样数量
                    quality_iqc_unqualified_number: '',  //不良数量
                    quality_iqc_unqualified_probability: '',  //不良率
                  }
                )
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                // })

              },
              //选择批准人和审核人事件
              people(types, key) {
                let promise = new Promise(function (resolve, reject) {
                  peopleModel(resolve, null, null)
                })
                promise.then((resolveData) => {
                  if (types == '批准人') {
                    this.iqcReport.quality_iqc_approve = resolveData.role_staff_id
                    this.approves = resolveData.role_staff_name
                    if (type === 'add') {
                      this.iqcReport.quality_iqc_approve_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  } else if (types == '审核人') {
                    this.iqcReport.quality_iqc_examine = resolveData.role_staff_id
                    this.examines = resolveData.role_staff_name
                    if (type === 'add') {
                      this.iqcReport.quality_iqc_examine_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  } else {
                    this.iqcResult[key].quality_iqc_checker = resolveData.role_staff_name
                    if (type === 'add') {
                      this.iqcResult[key].quality_iqc_check_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  }

                })
              },
              //增加检验结果
              // addIqcProject(){
              //     let promise = new Promise( (resolve, reject) => {
              //         iqcProject(resolve, null, null, this.iqcResult, '18760315ee2b4eee866bd0df97e08b7b')
              //     })
              //     promise.then( (resolveData) => {
              //         console.log(resolveData)
              //          this.iqcResult.push({
              //             quality_project_id:resolveData.quality_project_id, //项目id
              //             quality_project_name:resolveData.qualityProjects.quality_project_name,
              //             quality_iqc_check_level:'', //检查水平
              //             quality_iqc_receive_ac_level:'', //ac接收水平
              //             quality_iqc_receive_rc_level:'', //re接收水平
              //             quality_iqc_result_number:'', //抽样数量
              //             quality_iqc_check_result:'', //检验结果（0：合格1：不合格）
              //             quality_iqc_checker:'', //检验员id
              //             quality_iqc_checker_name:'', //检验员
              //             quality_iqc_check_date:'', //检验日期
              //         })
              //     })
              // },
              //供应商时间
              suppliers() {
                let promise = new Promise(function (resolve, reject) {
                  supplierModel(resolve, null, null)
                })
                promise.then((resolveData) => {
                  this.iqcReport.supplier_id = resolveData.supplier_id
                  this.supplier = resolveData.supplier_name
                })
              },
              //移除事件
              deletes(type, index) {
                swal({
                  title: '您确定要移除此条数据吗？',
                  text: '数据移除后无法恢复',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  if (type == 'iqcUnqualified') {
                    if (this.iqcUnqualified[index].quality_iqc_unqualified_id) {
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: removeIQCUnqualifiedUrl,
                        data: { iqcUnqualified: JSON.stringify([this.iqcUnqualified[index]]) },// 综合判定(0:合格 1：不合格)
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            this.iqcUnqualified.splice(index, 1)
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail();	//操作失败
                          }
                        }
                      })
                    } else {
                      this.iqcUnqualified.splice(index, 1)
                    }
                  } else {
                    this.iqcResult.splice(index, 1)
                  }
                })
              },
              //提交事件
              submit() {
                if (this.iqcReport.quality_iqc_report_name == '') {
                  this.$message.error({
                    message: '报告名称未填写',
                    type: 'warning'
                  })
                } else if (this.iqcReport.quality_iqc_report_number == '') {
                  this.$message.error({
                    message: '报告单号未填写',
                    type: 'warning'
                  })
                } else if (this.iqcReport.quality_iqc_inspection_date == '') {
                  this.$message.error({
                    message: '报验日期未填写',
                    type: 'warning'
                  })
                } else if (this.iqcReport.warehouse_material_batch == '') {
                  this.$message.error({
                    message: '物料批号未填写',
                    type: 'warning'
                  })
                } else if (this.iqcReport.warehouse_material_number == '') {
                  this.$message.error({
                    message: '物料数量未填写',
                    type: 'warning'
                  })
                } else if (this.sendJudgment.iqcReport <= 1 && this.sendJudgment.iqcResult <= 1 && this.sendJudgment.iqcProjectResult <= 1 && this.sendJudgment.iqcUnqualified <= 1) {
                  this.$message.error({
                    message: '请确认是否修改信息',
                    type: 'warning'
                  })
                }else {
                  swal({
                    title: '您确定要提交本次操作吗?',
                    text: '请确保填写信息无误后点击确定按钮',
                    type: 'question',
                    allowEscapeKey: false, // 用户按esc键不退出
                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                    showCancelButton: true, // 显示用户取消按钮
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    var data = [], data2 = []
                    this.iqcProjectResult.forEach((val, key) => {
                      val.forEach((value, index) => {
                        data.push(value)
                      })
                    })

                    if (type == 'modificationModel') {
                      //修改提交按钮
                      if (this.sendJudgment.iqcReport > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCReportUrl,
                          data: {
                            reportId: id, // iqc检验报告id
                            reportName: this.iqcReport.quality_iqc_report_name,  // 报告名称
                            reportNumber: this.iqcReport.quality_iqc_report_number,  // iqc单据编号
                            materialBatch: this.iqcReport.warehouse_material_batch, // 物料批号
                            materialNumber: this.iqcReport.warehouse_material_number, // 物料数量
                            inspectionDates: this.iqcReport.quality_iqc_inspection_date, // 报检日期
                            examine: this.iqcReport.quality_iqc_examine,// 审核人
                            examineDate: this.iqcReport.quality_iqc_examine_date,// 审核日期
                            approve: this.iqcReport.quality_iqc_approve, // 批准人
                            approveDate: this.iqcReport.quality_iqc_approve_date,// 批准日期
                            supplierId: this.iqcReport.supplier_id, // 供应商id
                            results: this.iqcReport.quality_iqc_comprehensive_result
                          },// 综合判定(0:合格 1：不合格)
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCReportUrl, { headNum: 1 })
                              const modal = document.getElementById('addInQualityReportModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.sendJudgment.iqcResult > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCResultUrl,
                          data: { iqcResult: JSON.stringify(this.iqcResult) },// 综合判定(0:合格 1：不合格)
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCReportUrl, { headNum: 1 })
                              const modal = document.getElementById('addInQualityReportModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.sendJudgment.iqcProjectResult > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCProjectResultUrl,
                          data: { iqcProjectResult: JSON.stringify(data) },// 综合判定(0:合格 1：不合格)
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCReportUrl, { headNum: 1 })
                              const modal = document.getElementById('addInQualityReportModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.sendJudgment.iqcUnqualified > 1) {
                        // var judge = true
                        // this.iqcUnqualified.forEach((val,key) => {
                        //     if(!val.quality_iqc_unqualified_id){
                        //         judge = false
                        //     }
                        // })
                        // if(judge){
                        // $.ajax({
                        //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        //     url: removeIQCUnqualifiedUrl,
                        //     data:{iqcResult:JSON.stringify(data)},// 综合判定(0:合格 1：不合格)
                        //     success: function (result, status, xhr) {
                        //         if(result.status === 0 ){
                        //             queryFun(queryIQCReportUrl,{headNum:1})
                        //             const modal = document.getElementById('addInQualityReportModal')   //模态框
                        //             swallSuccess2(modal)	//操作成功提示并刷新页面
                        //         }else{
                        //             swallFail();	//操作失败
                        //         }
                        //     }
                        // })
                        // }else{
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCUnqualifiedUrl,
                          data: { iqcUnqualified: JSON.stringify(this.iqcUnqualified) },// 综合判定(0:合格 1：不合格)
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCReportUrl, { headNum: 1 })
                              const modal = document.getElementById('addInQualityReportModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                        // }
                      }

                    } else {
                      // this.iqcResult.forEach((val,key) => {
                      //     val.forEach((value,index) => {
                      //         data2.push(value)
                      //     })
                      // })
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveIQCReportUrl,
                        data: { iqcReport: JSON.stringify(this.iqcReport), iqcResult: JSON.stringify(this.iqcResult), iqcUnqualified: JSON.stringify(this.iqcUnqualified), iqcProjectResult: JSON.stringify(data) },
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryIQCReportUrl, { headNum: 1 })
                            const modal = document.getElementById('addInQualityReportModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail();	//操作失败
                          }
                        }
                      })
                    }
                  })
                }
              },
            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              },
              quality_iqc_unqualified_probability(index) {
                if (addInQualityReportModal.iqcUnqualified[index].quality_sample_number != '' && addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number != '') {
                  var num = Math.round((addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number / addInQualityReportModal.iqcUnqualified[index].quality_sample_number) * 10000) / 100
                  return num + '%'
                }
              }
            },
            watch: {
              iqcReport: {
                handler(newValue, oldValue) {
                  console.log(this.sendJudgment)
                  this.sendJudgment.iqcReport++
                },
                deep: true
              },
              iqcResult: {
                handler(newValue, oldValue) {
                  this.sendJudgment.iqcResult++
                },
                deep: true
              },
              iqcUnqualified: {
                handler(newValue, oldValue) {
                  this.sendJudgment.iqcUnqualified++
                },
                deep: true
              },
              iqcProjectResult: {
                handler(newValue, oldValue) {
                  this.sendJudgment.iqcProjectResult++
                },
                deep: true
              },
            },
            template: `
                    <div class="modal fade" id="addInQualityReportModal">
                        <div class="modal-dialog modal-lg">
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
                                            <div class="col-sm-12">
                                                <!--基础信息-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">基础信息</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <!-- <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" v-if="isShowAdd" @click="material()">选择物料模板</button>
                                                                </form> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed" >
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:14%">报告名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.quality_iqc_report_name">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_report_name}}</td>

                                                                    <th style="width:14%">IQC单号</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.quality_iqc_report_number">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_report_number}}</td>

                                                                    <th style="width:14%">报验日期</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                            <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="iqcReport.quality_iqc_inspection_date | times" @blur="iqcReport.quality_iqc_inspection_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                        </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_inspection_date | times}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">物料名称</th>
                                                                    <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_name : ''}}</td>

                                                                    <th style="width:14%">规格</th>
                                                                    <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_standard : ''}}</td>

                                                                    <th style="width:14%">型号</th>
                                                                    <td style="width:19%" >{{iqcReports.material ? iqcReports.material.warehouse_material_model : ''}}</td>

                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">物料批号</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.warehouse_material_batch">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.warehouse_material_batch}}</td>

                                                                    <th style="width:14%">数 量</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                         <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcReport.warehouse_material_number" onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]/" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.warehouse_material_number}}</td>

                                                                    <th style="width:14%">单 位</th>
                                                                    <td style="width:19%">{{iqcReports.material ? iqcReports.material.warehouse_material_units : ''}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">审核人</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="examines" @click="people('审核人')">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_examine}}</td>

                                                                    <th style="width:14%">审核日期</th>
                                                                        <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="iqcReport.quality_iqc_examine_date | times"  @blur="iqcReport.quality_iqc_examine_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_examine_date | times}}</td>

                                                                    <th style="width:14%">综合判定结果</th>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcReport.quality_iqc_comprehensive_result" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">批准人</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="approves" @click="people('批准人')">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_approve}}</td>

                                                                    <th style="width:14%">批准日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="iqcReport.quality_iqc_approve_date | times" @blur="iqcReport.quality_iqc_approve_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.quality_iqc_approve_date | times}}</td>

                                                                    <th style="width:14%">供应厂商</th>
                                                                    <td class="table-input-td" style="width:19%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" @click="suppliers()" :value="supplier">
                                                                    </td>
                                                                    <td style="width:19%" v-if="isShow">{{iqcReports.supplier ? iqcReports.supplier.supplier_name : ''}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </div>

                                                </div>

                                                <!-- 检验结果 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">区 分</th>
                                                                    <th style="width:10%">检查水平</th>
                                                                    <th style="width:10%">AC</th>
                                                                    <th style="width:10%">RC</th>
                                                                    <th style="width:10%">抽样数量</th>
                                                                    <th style="width:10%">检验结果</th>
                                                                    <th style="width:10%">检验员</th>
                                                                    <th style="width:15%">检验日期</th>
                                                                </tr>
                                                                <tr v-for="(val, index) in iqcResult">
                                                                    <th>{{val.quality_project_name}}</th>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_check_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_check_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_receive_ac_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_receive_ac_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_receive_rc_level">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_receive_rc_level}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="val.quality_iqc_result_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_result_number}}</td>

                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="val.quality_iqc_check_result" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="val.quality_iqc_checker" @click="people('iqcResult',index)">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_checker}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="val.quality_iqc_check_date | times" @blur="val.quality_iqc_check_date = $event.target.value" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td v-if="isShow">{{val.quality_iqc_check_date | times}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--不合格内容-->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">不合格内容</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIllegal()" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:18%">不合格内容</th>
                                                                    <th style="width:18%">抽样数</th>
                                                                    <th style="width:18%">不良数</th>
                                                                    <th style="width:18%">不良率</th>
                                                                    <th style="width:18%">备注</th>
                                                                    <th style="width:10%" v-if="!isShow">操作</th>
                                                                </tr>
                                                                <tr v-show="!iqcUnqualified.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>
                                                                    <tr v-for="(value, index) in iqcUnqualified">
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_iqc_unqualified_content">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.quality_iqc_unqualified_content}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_sample_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.quality_sample_number}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_iqc_unqualified_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.quality_iqc_unqualified_number}}</td>

                                                                    <!--<td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="value.quality_iqc_unqualified_probability">
                                                                    </td>-->
                                                                    <td>{{index | quality_iqc_unqualified_probability}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on">
                                                                    </td>
                                                                    <td v-if="isShow"></td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes('iqcUnqualified',index)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--外观-->
                                                <el-collapse accordion  v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name !== '尺寸检验' && val.quality_project_type_name !== 'RS控制' && val.quality_project_type_name !== '附录' && val.quality_project_type_name !== '检验结果'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">检验内容</th>
                                                                    <th style="width:20%">检测方式</th>
                                                                    <th style="width:20%">检验标准</th>
                                                                    <th style="width:20%">检验结果</th>
                                                                </tr>

                                                                <tr v-for = "(value, index) in val.qualityProjects">
                                                                    <td>{{value.quality_project_name}}</td>
                                                                    <td>{{value.qualityIqcAppliance ? value.qualityIqcAppliance.quality_appliance_number : ''}}</td>
                                                                    <td>{{value.iqcProjectStandard ? value.iqcProjectStandard.quality_iqc_project_criterion : ''}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                </tr>


                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--尺寸检验-->
                                                <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == '尺寸检验'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">尺寸检验</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:9%">检验项目</th>
                                                                    <th style="width:7%">检验工具</th>
                                                                    <th style="width:7%">检验标准</th>
                                                                    <th style="width:7%">规格</th>
                                                                    <th style="width:7%">单位</th>
                                                                    <th style="width:6%">上限</th>
                                                                    <th style="width:6%">下限</th>
                                                                    <th style="width:7%">抽验情况</th>
                                                                    <th style="width:7%">平均值</th>
                                                                    <th style="width:7%">极差</th>
                                                                    <th style="width:10%">判定</th>
                                                                </tr>
                                                                <tr v-for="(value, index) in val.qualityProjects">

                                                                    <td>{{value.quality_project_name}}</td>

                                                                    <td>{{value.qualityIqcAppliance.quality_appliance_number}}</td>

                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>

                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_standard}}</td>

                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_units}}</td>

                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_up}}</td>

                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_down}}</td>

                                                                    <td class="table-input-td"><a class="table-link" @click="examine(key,index)" href="javascript:;">查看</a></td>


                                                                    <td>{{iqcProjectResult[key][index] ? iqcProjectResult[key][index].quality_iqc_project_average_value : ''}}</td>


                                                                    <td>{{iqcProjectResult[key][index] ? iqcProjectResult[key][index].quality_iqc_project_range : ''}}</td>

                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--RS控制-->
                                                <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == 'RS控制'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">RS控制</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">检验项目</th>
                                                                    <th style="width:10%">检验工具</th>
                                                                    <th style="width:10%">检验标准</th>
                                                                    <th style="width:10%">抽验数量</th>
                                                                    <th style="width:10%"> RS判定</th>
                                                                </tr>

                                                                <tr v-for="(value, index) in val.qualityProjects">
                                                                    <td>{{value.quality_project_name}}</td>
                                                                    <td>{{value.qualityIqcAppliance.quality_appliance_number}}</td>
                                                                    <td>{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="iqcProjectResult[key][index].quality_iqc_project_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectResult ? value.iqcProjectResult.quality_iqc_project_number : ''}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!--附录-->
                                                <el-collapse accordion v-for="(val, key) in iqcRecords" v-if="val.quality_project_type_name == '附录'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">附录</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">附录</th>
                                                                    <th style="width:10%">备注</th>
                                                                    <th style="width:10%">结果</th>
                                                                </tr>

                                                                <tr v-for="(value, index) in val.qualityProjects">
                                                                    <td>{{value.quality_project_name}}</td>
                                                                    <td>{{value.iqcResult}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="iqcProjectResult[key][index].quality_iqc_project_determine" :disabled="isShow">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-if="!isShow">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })
        }
        //新增选择物料模板模态框
        function materialModel(resolve, url, data) {
          function queryFun(url, data) {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: url,
              data: data,
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(materialTemplate, 'dataList', result.map.projectInfo)
                  Vue.set(materialTemplate, 'lines', result.map.lines)
                } else {
                  Vue.set(materialTemplate, 'dataList', [])
                  Vue.set(materialTemplate, 'lines', 0)
                }
              }
            })
          }
          queryFun(queryQualityProjectTypeUrl, { headNum: 1 })
          let materialTemplate = new Vue({
            el: '#materialTemplate',
            data() {
              return {
                dataList: [], //遍历数据
                lines: 0, //条数
                search: '', //搜索框值
                currenPage: 1, //当前页
                pagesize: 10,   //页码
                ajaxData: {
                  projectTypeId: '',
                  projectTypeName: '',
                  headNum: 1
                }
              }
            },
            methods: {
              restore(index) {
                resolve(this.dataList[index])
                const modal = $(document.getElementById('materialTemplate'))   //模态框
                modal.modal('hide')
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
            mounted() {
              const modal = document.getElementById('materialTemplate')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })

            },
            template: `
                    <div class="modal fade" id="materialTemplate">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">物料模板</h4>
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
                                                                    <div class="input-group-btn" @click="searchs()">>
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
                                                                    <th style="width: 20%">模板名称</th>
                                                                    <th style="width: 20%">物料名称</th>
                                                                    <th style="width: 20%">类模板名称</th>
                                                                    <th style="width: 20%">版本</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="(val,index) in dataList" @click="restore(index)" style="cursor:pointer">
                                                                    <td>{{val.quality_project_type_name}}</td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
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
        //尺寸特性抽样结果查看
        function sampling(resolve, number, value) {
          let samplingResults = new Vue({
            el: '#samplingResults ',
            data() {
              return {
                isShow: true,
                samplingRow: [],
                mean: '',
                ranges: ''
              }
            },
            mounted() {
              const modal = document.getElementById('samplingResults')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })
              $(modal).on('hidden.bs.modal', function (e) {
                $('body').addClass('modal-open')
              })
            },
            created() {
              if (number !== '') {
                number = number.split(',')
                value = value.split(',')
                var data = []
                number.forEach((val, key) => {
                  data.push({ number: val, result: value[key] })
                })
                this.samplingRow = data
              }
            },
            methods: {
              //提交按钮事件
              submit() {
                var samplingNumber = [], samplingValue = []
                this.samplingRow.forEach((val, index) => {
                  samplingNumber.push(val.number)
                  samplingValue.push(val.result)
                })
                resolve({ mean: this.mean, ranges: this.ranges, samplingNumber: samplingNumber.toString(), samplingValue: samplingValue.toString() })
                const modal = $(document.getElementById('samplingResults'))   //模态框
                modal.modal('hide')
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
              },
              //增加抽样记录行事件
              addSamplingRow() {
                this.isShow = false
                this.samplingRow.push({ number: '', result: '' })
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
              },
              //移除事件
              deletes(index) {
                swal({
                  title: '您确定要移除此条数据吗？',
                  text: '数据移除后无法恢复',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  this.samplingRow.splice(index, 1)
                })
              }
            },
            computed: {
              totals: {
                get() {
                  var sum = 0
                  this.samplingRow.forEach((value, key) => {
                    sum += Number(value.result)
                  })
                  sum = sum / this.samplingRow.length
                  if (!sum) {
                    sum = ''
                  }
                  sum = Number(sum).toFixed(2)
                  this.mean = sum
                  return sum
                }
              },
              range: {
                get() {
                  var sum = [], max, min, num

                  this.samplingRow.forEach((value, key) => {
                    sum.push(Number(value.result))
                  })
                  max = Math.max.apply(null, sum)
                  min = Math.min.apply(null, sum)
                  num = max - min
                  if (num == -Infinity) {
                    num = ''
                  }
                  num = Number(num).toFixed(2)
                  this.ranges = num
                  return num
                }
              }
            },
            watch: {
              samplingRow: {
                handler: function (val, oldVal) {
                  // console.log(val)
                },
                deep: true
              },
              deep: true
            },
            template: `
                    <div class="modal fade" id="samplingResults">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" data-dismiss="modal">
                                        <span>
                                            <i class="fa fa-close"></i>
                                        </span>
                                    </button>
                                    <h4 class="modal-title">物料模板</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="container-fluid">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <!--抽样情况-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">抽样情况</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="addSamplingRow()">增加抽样记录行</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width: 10%">序号</th>
                                                                    <th style="width: 40%">抽样数量</th>
                                                                    <th style="width: 40%">抽样结果</th>
                                                                    <th style="width: 10%">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-show="!samplingRow.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>

                                                                <tr v-for="(val,index) in samplingRow">
                                                                    <td>{{index+1}}</td>
                                                                    <td class="table-input-td">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="samplingRow[index].number">
                                                                    </td>
                                                                    <td class="table-input-td">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="samplingRow[index].result">
                                                                    </td>
                                                                    <td class="table-input-td">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <!--抽样结果-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">抽样结果</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width: 50%">平均值</th>
                                                                    <td>{{totals}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width: 50%">极差</th>
                                                                    <td>{{range}}</td>
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
                                            <button class="btn btn-primary modal-submit" @click="submit()">保存</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })
        }

      }
        break;
      case '#materialClassTemplateManager': {	//类模板管理
        const swiper = document.getElementById('materialClassTemplateManager')   //右侧外部swiper
        const inerSwiper = document.getElementById('materialClassTemplateManagerInerSwiper') // 右侧内部swiper

        function queryFun(url, data) {
          var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
          })
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
                Vue.set(panelBodyTableVM, 'dataList', result.map.iqcTemplates)
                Vue.set(panelBodyTableVM, 'lines', result.map.lines)
              } else {
                Vue.set(panelBodyTableVM, 'dataList', [])
                Vue.set(panelBodyTableVM, 'lines', 0)
              }
            }
          })
        }
        queryFun(queryIQCTemplateUrl, { type: 'class', headNum: 1 })
        let panelBodyTableVM = new Vue({
          el: inerSwiper,
          data() {
            return {
              dataList: '', //遍历数据
              lines: 0, //条数
              search: '', //搜索框值
              currenPage: 1, //当前页
              pagesize: 10,   //页码
              ajaxData: {
                type: 'class',
                templateName: '',
                headNum: 1
              }
            }
          },
          methods: {
            //详情
            detailsModel(value) {
              model('details', value.quality_iqc_template_id)
            },
            //修改
            modificationModel(value) {
              model('modificationModel', value.quality_iqc_template_id)
            },
            //新增
            add() {
              model('add', 'add')
            },
            //分页变化
            handleCurrentChange(val) {
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              queryFun(queryIQCTemplateUrl, this.ajaxData)
            },
            //搜索框
            searchs() {
              this.ajaxData.templateName = this.search
              this.currenPage = 1
              queryFun(queryIQCTemplateUrl, this.ajaxData)
            },
            deletes(id) {
              swal({
                title: '您确定要删除此条数据吗？',
                text: '删除后将无法查询',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(function () {
                $.ajax({
                  url: modifyIQCTemplateUrl,
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  data: {
                    'templateId': id,
                    'status': 1,
                  },
                  success: function (result) {
                    if (result.status === 0) {
                      swal({
                        title: '删除成功',
                        type: 'success',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      }).then(
                        () => {
                        },
                        (dismiss) => {
                          queryFun(queryIQCTemplateUrl, { type: 'class', headNum: 1 })
                        })
                    }
                    else {
                      swal({
                        title: '删除失败',
                        type: 'warning',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      })
                    }
                  }
                })
              })
            }
          },
          filters: {
            //时间戳转日期
            times(val) {
              return moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          template: `
                <div class="swiper-slide swiper-no-swiping" id="materialClassTemplateManagerInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!--panel-heading end -->
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover ">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">模板类型</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">创建时间</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_template_name}}</td>
                                                <td>{{value.quality_iqc_template_type}}</td>
                                                <td>{{value.quality_iqc_template_edittion}}</td>
                                                <td>{{value.quality_iqc_template_date | times}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_iqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
        })
        //新增 修改 详情 模态框
        function model(type, id) {
          if (type !== 'add') {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryIQCTemplateUrl,
              data: { type: 'class', templateId: id, headNum: 1 },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  var data = [], id = [], length = 0, iqcResults = []
                  Vue.set(addMaterialClassTemplateModal, 'iqcTemplates', result.map.iqcTemplates[0])
                  // if(type !== 'add'){
                  Vue.set(addMaterialClassTemplateModal, 'checkout', result.map.templates)
                  result.map.templates.forEach((val, key) => { //二维数组遍历
                    data.push([])
                    val.qualityProjects.forEach((value, index) => {
                      length++
                      // id.push(value.qualityTypeProject.quality_type_project_id)//修改时查询已添加的项目
                      data[key].push(value)
                    })
                  })
                  result.map.iqcResults.forEach((val, key) => {
                    iqcResults.push({
                      quality_iqc_template_id: id,
                      quality_project_name: val.qualityProject.quality_project_name,
                      quality_project_id: val.qualityProject.quality_project_id, //项目id
                      // quality_iqc_check_level:val.quality_iqc_check_level, //检查水平
                      // quality_iqc_receive_ac_level:val.quality_iqc_receive_ac_level, //ac接收水平
                      // quality_iqc_receive_rc_level:val.quality_iqc_receive_rc_level, //re接收水平
                      // quality_iqc_result_number:val.quality_iqc_result_number, //抽样数量
                      // quality_iqc_check_result:val.quality_iqc_check_result, //检验结果（0：合格1：不合格）
                      // quality_iqc_checker:'', //检验员id
                      // quality_iqc_checker_name:'', //检验员
                      // quality_iqc_check_date:val.quality_iqc_check_date, //检验日期
                    })
                  })
                  // Vue.set(addMaterialClassTemplateModal,'projectTypes',id) //修改时查询已添加的项目
                  Vue.set(addMaterialClassTemplateModal, 'iqcResult', iqcResults) //修改时查询已添加的检验项
                  Vue.set(addMaterialClassTemplateModal, 'addStayArray', data) //修改时查询已添加的检验项
                  Vue.set(addMaterialClassTemplateModal, 'addStayArray2', length) //修改时查询已添加的检验项
                  Vue.set(addMaterialClassTemplateModal.basiCinformation, 'remarks', result.map.iqcTemplates[0].quality_iqc_remarks) //修改传入名字
                  Vue.set(addMaterialClassTemplateModal.basiCinformation, 'templateName', result.map.iqcTemplates[0].quality_iqc_template_name) //修改传入名字
                  Vue.set(addMaterialClassTemplateModal.basiCinformation, 'templateType', result.map.iqcTemplates[0].quality_iqc_template_type) //修改传入类型
                  // }else{
                  // result.map.templates.forEach((val,key) =>{
                  //     if(val.quality_project_type_name == '检验结果'){
                  //         data.push(val)
                  //         Vue.set(addMaterialClassTemplateModal,'checkout',data)
                  //     }
                  // })
                  // }
                } else if (result.status === 2) {
                  // if(type !== 'add'){
                  Vue.set(addMaterialClassTemplateModal, 'iqcTemplates', result.map.iqcTemplates[0])
                  Vue.set(addMaterialClassTemplateModal, 'checkout', [])
                  // }else{
                  //     // var data = [{
                  //     //     quality_project_type_name:'检验结果',
                  //     //     quality_project_type_detail:'检验结果',
                  //     //     quality_project_type_id:'18760315ee2b4eee866bd0df97e08b7b'
                  //     // }]
                  //     Vue.set(addMaterialClassTemplateModal,'iqcTemplates',[])
                  //     Vue.set(addMaterialClassTemplateModal,'checkout',[])
                  // }
                } else {
                  Vue.set(addMaterialClassTemplateModal, 'iqcTemplates', [])
                  Vue.set(addMaterialClassTemplateModal, 'checkout', [])
                }

              }
            })
          }
          let addMaterialClassTemplateModal = new Vue({
            el: '#addMaterialClassTemplateModal',
            data() {
              return {
                iqcTemplates: [],
                checkout: [{
                  quality_project_type_name: "附录",
                  quality_project_type_detail: "附录",
                  quality_project_type_id: "e94cfab7bd364ddc81803ac29a30b451"
                }], //增加检验项时加的数组
                addStayArray: [[]], //添加项目时添加的行数
                addStayArray2: '', //添加项目时添加的行数
                basiCinformation: {
                  templateId: '',
                  templateName: '', // 模板名称
                  templateType: '',// 模板类型
                  iqcRemarks: '', // 备注
                  remarks: '',
                  projectTypes: '',
                  iqcResult: ''
                },
                iqcResult: [],
                headText: '类模板详情',//模态框
                projectTypes: [], // 修改时添加的中间表
                distinction: '', //区分新增和修改的传值
                isShow: type == 'details',
                guise: false,
                add: false, // 点击新增时判断条件
                iqcResultNum: 0
              }
            },
            //渲染结束后执行
            mounted() {
              const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })
            },
            //实例执行前事件
            created() {
              if (type == 'modificationModel') {
                this.headText = '修改类模板'
              } else if (type == 'add') {
                this.headText = '新增类模板'
                this.add = true //点击新增
              }
            },
            methods: {
              //增加检验项
              condensationTest(index) {
                let promise = new Promise((resolve, reject) => {
                  condensation(resolve, null, null, this.checkout)
                })
                promise.then((resolveData) => {
                  // this.basiCinformation.p1 = resolveData.typeNam
                  for (i = 0; i < resolveData.length; i++) {
                    this.addStayArray.push([])
                  }
                  this.checkout = this.checkout.concat(resolveData)
                })

              },
              //增加项目
              addIqcProject(index, type) {
                let promise = new Promise((resolve, reject) => {
                  if (type === 'iqcResult') {
                    iqcProject(resolve, null, null, this.iqcResult, '18760315ee2b4eee866bd0df97e08b7b')
                  } else {
                    iqcProject(resolve, null, null, this.addStayArray[index], this.checkout[index].quality_project_type_id)
                  }
                })
                promise.then((resolveData) => {
                  if (type === 'iqcResult') {
                    resolveData.forEach((val, key) => {
                      this.iqcResult.push({
                        quality_project_name: val.qualityProjects.quality_project_name,
                        quality_project_id: val.qualityProjects.quality_project_id, //项目id
                      })
                    })
                  } else {
                    resolveData.forEach((val, key) => {
                      this.addStayArray[index].push(val)
                    })
                  }
                })
              },
              //移除检验项
              removeIqcProject(index) {
                swal({
                  title: '您确定要移除此条数据吗？',
                  text: '数据移除后无法恢复',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  this.addStayArray.splice(index, 1)
                  this.checkout.splice(index, 1)
                })
              },
              //提交按钮
              submit() {
                var addStayArray = false
                this.addStayArray.forEach((val, key) => {
                  if (val.length == 0) {
                    addStayArray = true
                  }
                })
                if (this.basiCinformation.templateName == '') {
                  this.$message.error({
                    message: '模板名称未填写',
                    type: 'warning'
                  })
                } else if (this.basiCinformation.templateType == '') {
                  this.$message.error({
                    message: '模板类型未填写',
                    type: 'warning'
                  })
                } else if (addStayArray) {
                  this.$message.error({
                    message: '有检验项未添加项目',
                    type: 'warning'
                  })
                } else if (this.iqcResult.length == 0) {
                  this.$message.error({
                    message: '检验结果未添加项目',
                    type: 'warning'
                  })
                } else {
                  var id = []
                  var select = false
                  swal({
                    title: '您确定要提交本次操作吗?',
                    text: '请确保填写信息无误后点击确定按钮',
                    type: 'question',
                    allowEscapeKey: false, // 用户按esc键不退出
                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                    showCancelButton: true, // 显示用户取消按钮
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    if (type == 'modificationModel') {
                      var addStayArrayLength = 0
                      this.addStayArray.forEach((val, key) => { // 遍历获取所有中间表id
                        val.forEach((value, index) => {
                          addStayArrayLength++
                          if (value.quality_type_project_id) {
                            this.projectTypes.push(value.quality_type_project_id)
                            select = true
                          } else {
                            this.projectTypes.push(value.qualityTypeProject.quality_type_project_id)
                          }
                        })
                      })
                      if (addStayArrayLength !== this.addStayArray2) {
                        select = true
                      }
                      this.basiCinformation.templateId = this.iqcTemplates.quality_iqc_template_id
                      if (!select && this.iqcResultNum < 2) {
                        //基础信息改动发送ajax
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCTemplateUrl,
                          data: this.basiCinformation,
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCTemplateUrl, { type: 'class', headNum: 1 })
                              const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            }
                            else if (result.status === 1) {
                              swallFail2(result.msg); //操作失败
                             }
                             else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      } else {
                        //检验项目改动发送ajax
                        var templateName = this.iqcTemplates.quality_iqc_template_name,
                          templateType = this.iqcTemplates.quality_iqc_template_type,
                          iqcRemarks = this.iqcTemplates.quality_iqc_remarks
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: saveIQCTemplateUrl,
                          data: { 'templateName': templateName, 'templateType': templateType, 'iqcRemarks': iqcRemarks, 'projectTypes': this.projectTypes.toString(), 'iqcResult': JSON.stringify(this.iqcResult) },
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCTemplateUrl, { type: 'class', headNum: 1 })
                              const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }

                    } else {
                      this.addStayArray.forEach((val, key) => { // 遍历获取所有中间表id
                        val.forEach((value, index) => {
                          id.push(value.quality_type_project_id)
                        })
                      })
                      this.basiCinformation.projectTypes = id.toString()
                      this.basiCinformation.iqcResult = JSON.stringify(this.iqcResult)
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveIQCTemplateUrl,
                        data: this.basiCinformation,
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryIQCTemplateUrl, { type: 'class', headNum: 1 })
                            const modal = document.getElementById('addMaterialClassTemplateModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail();	//操作失败
                          }
                        }
                      })
                    }
                  })
                }
              },
              //日期
              dates(e, type, type2) {
                this.$set(eval("" + type + ""), type2, e.target.value)
              },
              //删除
              deletes(index, type) {
                swal({
                  title: '您确定要移除此条数据吗？',
                  text: '数据移除后无法恢复',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  if (type == "iqcResult") {
                    this.iqcResult.splice(index, 1)
                  } else {
                    this.addStayArray[index].splice(type, 1)
                  }
                })
              }
            },
            watch: {
              iqcResult: {
                handler(newValue, oldValue) {
                  this.iqcResultNum++
                },
                deep: true
              }
            },
            template: `
                    <div class="modal fade" id="addMaterialClassTemplateModal">
                        <div class="modal-dialog modal-lg">
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
                                            <div class="col-sm-12">
                                                <!-- 基础信息 -->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">基础信息</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="condensationTest()" v-show="!isShow">增加检验项</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="basiCinformation.templateName" @input="basiCinformation.templateName = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_name}}</td>

                                                                    <th style="width:20%">模板类型</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="basiCinformation.templateType" @input="basiCinformation.templateType = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_type}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">备注</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="add ? basiCinformation.iqcRemarks : iqcTemplates.quality_iqc_remarks" @input="add ? basiCinformation.iqcRemarks = $event.target.value : basiCinformation.remarks = $event.target.value">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_remarks}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td style="width:30%">{{add ? '' : iqcTemplates.quality_iqc_template_edittion}}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <!-- 检验项 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIqcProject(0,'iqcResult')" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width:45%">检验项目</th>
                                                                    <th style="width:45%">说明</th>
                                                                    <th style="width:10%" v-show="!isShow">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-if="!iqcResult.length" >
                                                                <td colspan=15 class="text-center text-warning">待加...</td>
                                                                </tr>
                                                                <tr v-for="(value, index) in iqcResult">
                                                                    <td>{{value.qualityProjects ? value.qualityProjects.quality_project_name : value.quality_project_name}}</td>
                                                                    <td>暂无</td>
                                                                    <td class="table-input-td" v-show="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index, 'iqcResult')"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <el-collapse accordion v-for="(val, index) in checkout">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                    <div class="col-xs-8">
                                                                        <form class="form-inline pull-right">
                                                                            <button type="button" class="btn btn-primary btn-sm" v-show="!isShow" @click.stop="removeIqcProject(index)" v-if="val.quality_project_type_name !== '附录'">移除检验项</button>
                                                                            <button type="button" class="btn btn-primary btn-sm" @click.stop="addIqcProject(index)" v-show="!isShow">增加项目</button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <thead>
                                                                <tr>
                                                                    <th style="width:45%">检验项目</th>
                                                                    <th style="width:45%">说明</th>
                                                                    <th style="width:10%" v-show="!isShow">操作</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-if="add ? !addStayArray[index].length : false">
                                                                    <td colspan=15 class="text-center text-warning">待加...</td>
                                                                </tr>
                                                                <tr v-for="(value, indexs) in addStayArray[index]">
                                                                    <td>{{value.qualityProjects ? value.qualityProjects.quality_project_name : value.quality_project_name}}</td>
                                                                    <td>暂无</td>
                                                                    <td class="table-input-td" v-show="!isShow">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index, indexs)"><i class="fa fa-times"></i>移除</a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!isShow">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })
        }

      }
        break;
      case '#materialTemplateManager': {	//物料模板管理
        const swiper = document.getElementById('materialTemplateManager')   //右侧外部swiper
        const inerSwiper = document.getElementById('materialTemplateManagerInerSwiper') // 右侧内部swiper

        function queryFun(url, data) {
          var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
          })
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
                Vue.set(panelBodyTableVM, 'dataList', result.map.iqcTemplates)
                Vue.set(panelBodyTableVM, 'lines', result.map.lines)
              } else {
                Vue.set(panelBodyTableVM, 'dataList', [])
                Vue.set(panelBodyTableVM, 'lines', 0)
              }
            }
          })
        }
        queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
        //主页
        let panelBodyTableVM = new Vue({
          el: inerSwiper,
          data() {
            return {
              dataList: '', //遍历数据
              lines: 0, //条数
              search: '', //搜索框值
              currenPage: 1, //当前页
              pagesize: 10,   //页码
              ajaxData: {
                type: 'material',
                templateName: '',
                headNum: 1
              }
            }
          },
          methods: {
            //详情
            detailsModel(id) {
              model('details', id)
            },
            //修改
            modificationModel(id) {
              model('modificationModel', id)
            },
            //新增
            add() {
              let promise = new Promise(function (resolve, reject) {
                optionModel('materialTemplateManager', resolve, queryIQCTemplateUrl, { type: 'class', headNum: 1 })
              })
              promise.then((resolveData) => {
                model('add', resolveData.iqcTemplates.toString(), resolveData.materials)
              })
            },
            dates(e, type, type2) {
              this.$set(eval("" + type + ""), type2, e.target.value)
            },
            //分页变化
            handleCurrentChange(val) {
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              queryFun(queryIQCTemplateUrl, this.ajaxData)
            },
            //搜索框
            searchs() {
              this.ajaxData.templateName = this.search
              this.currenPage = 1
              queryFun(queryIQCTemplateUrl, this.ajaxData)
            },
            deletes(id) {
              swal({
                title: '您确定要删除此条数据吗？',
                text: '删除后将无法查询',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(function () {
                $.ajax({
                  url: modifyIQCTemplateUrl,
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  data: {
                    'templateId': id,
                    'status': 1,
                  },
                  success: function (result) {
                    if (result.status === 0) {
                      swal({
                        title: '删除成功',
                        type: 'success',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      }).then(
                        () => {
                        },
                        (dismiss) => {
                          queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
                        })
                    }
                    else {
                      swal({
                        title: '删除失败',
                        type: 'warning',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      })
                    }
                  }
                })
              })
            }
          },
          template: `
                <div class="swiper-slide swiper-no-swiping" id="materialTemplateManagerInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1"  @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter ="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!--panel-heading end -->
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover ">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">物料名称</th>
                                                <th style="width: 15%;">类模板名称</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_iqc_template_name}}</td>
                                                <td>{{value.material ? value.material.warehouse_material_name : '暂无数据'}}</td>
                                                <td>{{value.quality_iqc_template_type}}</td>
                                                <td>{{value.quality_iqc_template_edittion}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value.quality_iqc_template_id)" href="javascript:;">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value.quality_iqc_template_id)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_iqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
        })

        //新增，修改，详情模态框
        function model(type, id, materials) {
          //不同模态框传不同的值
          var byValue = ''
          if (type == 'add') {
            byValue = 'class'
          } else {
            byValue = 'material'
          }
          $.ajax({
            type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
            url: queryIQCTemplateUrl,
            data: { type: byValue, templateId: id, headNum: 1 },
            success: function (result, status, xhr) {
              if (result.status === 0) {
                var data = [], projectStandards = [], projectAppliances = [], iqcResults = [], projectAppliancesLength = 0
                Vue.set(addMaterialTemplateModal, 'iqcTemplates', result.map.iqcTemplates[0]) //给vue实例设置遍历数据
                if (type == 'add') {
                  Vue.set(addMaterialTemplateModal, 'templates', result.map.templates)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal.iqcTemplate, 'quality_iqc_template_type', result.map.iqcTemplates[0].quality_iqc_template_name)  //给vue实例设置遍历数据
                  result.map.templates.forEach((val, key) => { //提供选择了类模板的项目
                    projectStandards.push([])//创建二维数据
                    projectAppliances.push([])//创建二维数据
                    val.qualityProjects.forEach((value, index) => {
                      data.push(value.qualityTypeProject.quality_type_project_id)
                      if (val.quality_project_type_name === '附录') {
                      } else if (val.quality_project_type_name === '尺寸检验') {
                        projectStandards[key].push({
                          quality_project_id: value.quality_project_id,  // 推入提交格式
                          quality_iqc_project_standard: '',
                          quality_iqc_project_units: '',
                          quality_iqc_project_up: '',
                          quality_iqc_project_down: '',
                          quality_iqc_project_criterion: ''
                        })
                      } else {
                        projectStandards[key].push({
                          quality_project_id: value.quality_project_id,  // 推入提交格式
                          quality_iqc_project_criterion: ''
                        })
                      }
                      if (val.quality_project_type_name !== '附录') {
                        projectAppliances[key].push({
                          quality_project_appliance_id: '',
                          quality_project_id: value.quality_project_id,
                          quality_appliance_id: '',
                          quality_appliance_number: ''
                        })
                        projectAppliancesLength++
                      }
                    })
                  })
                  result.map.iqcResults.forEach((val, index) => {
                    iqcResults.push({
                      quality_iqc_result_id: val.quality_iqc_result_id,
                      quality_project_name: val.qualityProject.quality_project_name,
                      quality_project_id: val.qualityProject.quality_project_id
                    })
                  })
                  Vue.set(addMaterialTemplateModal, 'projectAppliancesLength', projectAppliancesLength)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'iqcResult', iqcResults)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectTypes', data.toString())  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectStandards', projectStandards)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectAppliances', projectAppliances)  //给vue实例设置遍历数据
                } else {
                  Vue.set(addMaterialTemplateModal, 'templates', result.map.materialTemplates)  //给vue实例设置遍历数据
                  result.map.materialTemplates.forEach((val, key) => { //提供选择了类模板的项目
                    projectStandards.push([])//创建二维数据
                    projectAppliances.push([])
                    val.qualityProjects.forEach((value, index) => {
                      data.push(value.qualityTypeProject.quality_type_project_id)

                      if (value.iqcProjectStandard) {
                        if (val.quality_project_type_name === '附录') {
                        } else if (val.quality_project_type_name === '尺寸检验') {
                          projectStandards[key].push({
                            quality_iqc_project_standard_id: value.iqcProjectStandard.quality_iqc_project_standard_id,
                            quality_project_id: value.quality_project_id,  // 推入提交格式
                            quality_iqc_project_standard: value.iqcProjectStandard.quality_iqc_project_standard,
                            quality_iqc_project_units: value.iqcProjectStandard.quality_iqc_project_units,
                            quality_iqc_project_up: value.iqcProjectStandard.quality_iqc_project_up,
                            quality_iqc_project_down: value.iqcProjectStandard.quality_iqc_project_down,
                            quality_iqc_project_criterion: value.iqcProjectStandard.quality_iqc_project_criterion
                          })
                        } else {
                          projectStandards[key].push({
                            quality_iqc_project_standard_id: value.iqcProjectStandard.quality_iqc_project_standard_id,
                            quality_project_id: value.quality_project_id,  // 推入提交格式
                            quality_iqc_project_criterion: value.iqcProjectStandard.quality_iqc_project_criterion
                          })
                        }

                      } else {
                        if (val.quality_project_type_name === '附录') {
                        } else if (val.quality_project_type_name === '尺寸检验') {
                          projectStandards[key].push({
                            quality_project_id: value.quality_project_id,  // 推入提交格式
                            quality_iqc_project_standard: '',
                            quality_iqc_project_units: '',
                            quality_iqc_project_up: '',
                            quality_iqc_project_down: '',
                            quality_iqc_project_criterion: ''
                          })
                        } else {
                          projectStandards[key].push({
                            quality_project_id: value.quality_project_id,  // 推入提交格式
                            quality_iqc_project_criterion: ''
                          })
                        }
                      }
                      if (value.qualityIqcAppliance) {
                        // applianceName[key].push({applianceNumber : value.qualityIqcAppliance.quality_appliance_number})
                        projectAppliances[key].push({
                          quality_project_appliance_id: value.qualityIqcAppliance.quality_project_appliance_id,
                          quality_iqc_template_id: result.map.iqcTemplates[0].quality_iqc_template_id,
                          quality_project_id: value.quality_project_id,
                          quality_appliance_id: value.qualityIqcAppliance.quality_appliance_id,
                          quality_appliance_number: value.qualityIqcAppliance.quality_appliance_number,
                        })
                      } else {
                        // applianceName[key].push({applianceNumber : ''})
                        projectAppliances[key].push({
                          quality_project_appliance_id: '',
                          quality_iqc_template_id: '',
                          quality_project_id: '',
                          quality_appliance_id: '',
                          quality_appliance_number: '',
                        })
                      }
                    })
                  })
                  result.map.iqcResults.forEach((val, index) => {
                    iqcResults.push({
                      quality_iqc_result_id: val.quality_iqc_result_id,
                      quality_project_name: val.qualityProject.quality_project_name,
                      quality_project_id: val.qualityProject.quality_project_id
                    })
                  })
                  Vue.set(addMaterialTemplateModal, 'iqcResult', iqcResults)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectAppliances', projectAppliances)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectTypes', data.toString())  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal, 'projectStandards', projectStandards)  //给vue实例设置遍历数据
                  // Vue.set(addMaterialTemplateModal,'applianceName',applianceName)  //给vue实例设置遍历数据
                  Vue.set(addMaterialTemplateModal.iqcTemplate, 'quality_iqc_template_name', result.map.iqcTemplates[0].quality_iqc_template_name)  //给vue实例设置遍历数据
                }

              } else if (result.status === 2) {
                Vue.set(addMaterialTemplateModal, 'iqcTemplates', result.map.iqcTemplates[0])
                Vue.set(addMaterialTemplateModal, 'templates', [])
              } else {
                Vue.set(addMaterialTemplateModal, 'iqcTemplates', [])
                Vue.set(addMaterialTemplateModal, 'templates', [])
              }

            }
          })
          let addMaterialTemplateModal = new Vue({
            el: '#addMaterialTemplateModal',
            data() {
              return {
                iqcTemplates: '',
                templates: [],
                projectTypes: '', //检验项项目id
                materialsName: '',
                iqcTemplate: {  //基础信息
                  quality_iqc_template_name: '',
                  warehouse_material_id: '',
                  quality_iqc_template_type: ''
                },
                iqcTemplate_quality_iqc_template_name: 0,//检测修改时是否发送基础信息ajax
                projectAppliances: [], //项目标准
                isShow: type == 'details',
                isShow2: type == 'modificationModel',
                add: false,
                headText: '物料模板详情',//模态框
                inspection: [], //检验方式数据
                inspectionselected: '',//检验方式选中的数据
                appliancesId: [], //选择器具的时候判断条件
                // appliancesName:[], //选择器具后表格添加名字
                projectStandards: [],//检验标准
                projectStandardsNum: 0, //检测修改时是否发送标准ajax
                projectAppliancesNum: 0, //检测修改时是否发送器具ajax
                // applianceName:[], //选择检验方式后在表格中显示的内容
                // applianceJudge:[], //判断选择是否重复选择器具
                iqcResult: [], //检验结果
                projectAppliancesLength: 0, //检验方式判定结果
              }
            },
            mounted() {
              const modal = document.getElementById('addMaterialTemplateModal')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })
            },
            created() {
              if (type == 'modificationModel') {
                this.headText = '修改物料模板'
                this.shiyan = this.basiCinformation2
              } else if (type == 'details') {
                this.shiyan = this.basiCinformation2
              } else if (type == 'add') {
                this.add = true
                this.headText = '新增物料模板'
                this.materialsName = materials.warehouse_material_name
                this.iqcTemplate.warehouse_material_id = materials.warehouse_material_id
              }
            },
            methods: {
              condensationTest() {
                condensation()
              },
              addIqcProject() {
                iqcProject()
              },
              //器具选择事件
              appliance(index, index2) {
                let promise = new Promise(function (resolve, reject) {
                  applianceModel(resolve, queryApplianceUrl, { headNum: 1 })
                })
                promise.then((resolveData) => {
                  this.projectAppliances[index][index2].quality_appliance_id = resolveData.quality_appliance_id
                  this.projectAppliances[index][index2].quality_appliance_number = resolveData.quality_appliance_number
                  // if(this.appliancesId.length){   //选择了的器具进行遍历
                  //     this.appliancesId.forEach((val,key) => { //遍历已选择的器具

                  //         if(val == id){ //没选择的器具添加
                  //             this.applianceJudge.push(true)

                  //         }else{    //选择了的器具重新选择
                  //             this.applianceJudge.push(false)
                  //         }
                  //     })
                  //     var subscript = this.applianceJudge.indexOf(true)

                  //     if(subscript !== -1){
                  //         this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                  //         this.projectAppliances.splice(subscript, 1, {'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                  //     }else{
                  //         this.appliancesId.push(id)
                  //         this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                  //         this.projectAppliances.push({'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                  //     }

                  // }else{  //没有选择了的器具直接添加
                  //     this.appliancesId.push(id)
                  //     this.applianceName[index][index2].applianceNumber =  resolveData.quality_appliance_number
                  //     this.projectAppliances.push({'quality_project_id':id,'quality_appliance_id':resolveData.quality_appliance_id})
                  // }

                })
              },
              submit() {
                var data = [], projectAppliances = [], projectStandards = false
                this.projectStandards.forEach((val, key) => {
                  val.forEach((value, index) => {
                    data.push(value)
                  })
                })
                this.projectAppliances.forEach((val, key) => {
                  val.forEach((value, index) => {
                    if (value.quality_appliance_id !== '') {
                      projectAppliances.push(value)
                    }
                  })
                })
                console.log(data)
                data.forEach((value, index) => {
                  // for(var val in value){
                  //     if(value[val] == ''){
                  //        projectStandards = true
                  //     }
                  // }
                  if (value.quality_iqc_project_criterion === "") {
                    projectStandards = true
                  }
                })
                if (this.iqcTemplate.quality_iqc_template_name == '') {
                  this.$message.error({
                    message: `模板名称未填写`,
                    type: 'warning'
                  });
                } else if (projectAppliances.length < this.projectAppliancesLength) {
                  this.$message.error({
                    message: `检验项中有检验方式未选择`,
                    type: 'warning'
                  });
                } else if (projectStandards) {
                  this.$message.error({
                    message: `检验项中有项目标准未填写`,
                    type: 'warning'
                  });
                } else if (this.iqcTemplate_quality_iqc_template_name <= 1 && this.projectStandardsNum <= 1 && this.projectAppliancesNum <= 1) {
                  this.$message.error({
                    message: '请确认是否修改信息',
                    type: 'warning'
                  })
                }else {
                  swal({
                    title: '您确定要提交本次操作吗?',
                    text: '请确保填写信息无误后点击确定按钮',
                    type: 'question',
                    allowEscapeKey: false, // 用户按esc键不退出
                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                    showCancelButton: true, // 显示用户取消按钮
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    if (type == 'modificationModel') {
                      //修改提交按钮
                      if (this.iqcTemplate_quality_iqc_template_name > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCTemplateUrl,
                          data: { templateId: id, templateName: this.iqcTemplate.quality_iqc_template_name },
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
                              const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.projectStandardsNum > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCProjectStandardUrl,
                          data: {
                            iqcProjectStandards: JSON.stringify(data)
                          },
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
                              const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.projectAppliancesNum > 1) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyIQCProjectApplianceUrl,
                          data: {
                            projectAppliances: JSON.stringify(projectAppliances)
                          },
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
                              const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }

                    } else {
                      //新增提交按钮

                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveIQCMaterialTemplateUrl,
                        data: {
                          iqcTemplate: JSON.stringify(this.iqcTemplate), //基础信息
                          iqcResult: JSON.stringify(this.iqcResult),
                          projectTypes: this.projectTypes.toString(),  //项目信息
                          projectAppliances: JSON.stringify(projectAppliances),  //器具信息
                          projectStandards: JSON.stringify(data)
                        },
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryIQCTemplateUrl, { type: 'material', headNum: 1 })
                            const modal = document.getElementById('addMaterialTemplateModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail();	//操作失败
                          }
                        }
                      })
                    }
                  })
                }
              },
            },
            watch: {
              projectStandards: {
                handler(newValue, oldValue) {
                  this.projectStandardsNum++
                },
                deep: true
              },
              iqcTemplate: {
                handler(newValue, oldValue) {
                  this.iqcTemplate_quality_iqc_template_name++
                },
                deep: true
              },
              projectAppliances: {
                handler(newValue, oldValue) {
                  this.projectAppliancesNum++
                },
                deep: true
              },

            },
            template: `
                    <div class="modal fade" id="addMaterialTemplateModal">
                        <div class="modal-dialog modal-lg">
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
                                            <div class="col-sm-12">
                                                <!-- 基础信息 -->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">基础信息</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="iqcTemplate.quality_iqc_template_name">
                                                                    </td>
                                                                    <td style="width:30%" v-if="isShow">{{iqcTemplates.quality_iqc_template_name}}</td>

                                                                    <th style="width:20%">类模板名称</th>
                                                                    <td style="width:30%" v-if="add">{{iqcTemplate.quality_iqc_template_type}}</td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.quality_iqc_template_type}}</td>

                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">物料名称</th>
                                                                    <td style="width:30%" v-if="add">{{materialsName}}</td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.material ? iqcTemplates.material.warehouse_material_name : ''}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td class="table-input-td" style="width:30%" v-if="add"></td>
                                                                    <td style="width:30%" v-if="isShow || isShow2">{{iqcTemplates.quality_iqc_template_edittion}}</td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>

                                                <!-- 检验结果 -->
                                                <el-collapse accordion>
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">检验结果</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:12%">区 分</th>
                                                                    <th style="width:12%">检查水平</th>
                                                                    <th style="width:12%">AC</th>
                                                                    <th style="width:12%">RC</th>
                                                                    <th style="width:12%">抽样数量</th>
                                                                    <th style="width:12%">检验结果</th>
                                                                    <th style="width:12%">检验员</th>
                                                                    <th style="width:12%">检验日期</th>
                                                                </tr>
                                                                <tr v-for="(val, index) in iqcResult">
                                                                    <th>{{val.quality_project_name}}</th>
                                                                    <td class="text-center text-warning" colspan="7">
                                                                        在报告中填写...
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 外观 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name !== '尺寸检验' && val.quality_project_type_name !== '附录' && val.quality_project_type_name !== '检验结果'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">{{val.quality_project_type_name}}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:33%">检验内容</th>
                                                                    <th style="width:33%">检测方式</th>
                                                                    <th style="width:33%">检验标准</th>
                                                                </tr>

                                                                <tr v-for="(value, key) in val.qualityProjects">
                                                                    <td>{{value.quality_project_name}}</td>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" @click="appliance(index, key)" :value="projectAppliances[index][key].quality_appliance_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{projectAppliances[index][key].quality_appliance_number}}</td>
                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="projectStandards[index][key].quality_iqc_project_criterion " @input="projectStandards[index][key].quality_iqc_project_criterion = $event.target.value">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard ? value.iqcProjectStandard.quality_iqc_project_criterion : ''}}</td>

                                                                </tr>


                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 尺寸特性 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name == '尺寸检验'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">尺寸检验</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:10%">检验项目</th>
                                                                    <th style="width:10%">检测方式</th>
                                                                    <th style="width:10%">检验标准</th>
                                                                    <th style="width:10%">规格</th>
                                                                    <th style="width:10%">单位</th>
                                                                    <th style="width:10%">上限</th>
                                                                    <th style="width:10%">下限</th>
                                                                </tr>
                                                                <tr v-for="(value, key) in val.qualityProjects">

                                                                    <td>{{value.quality_project_name}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" @click="appliance(index, key)" :value="projectAppliances[index][key].quality_appliance_number">
                                                                    </td>
                                                                    <td v-if="isShow">{{projectAppliances[index][key].quality_appliance_number}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_criterion">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_criterion}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_standard">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_standard}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_units">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_units}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_up">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_up}}</td>

                                                                    <td class="table-input-td" v-if="!isShow">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="projectStandards[index][key].quality_iqc_project_down">
                                                                    </td>
                                                                    <td v-if="isShow">{{value.iqcProjectStandard.quality_iqc_project_down}}</td>

                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                                <!-- 尺寸特性 -->
                                                <el-collapse accordion v-for="(val, index) in templates" v-if="val.quality_project_type_name == '附录'">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <div class="panel-heading panel-heading-table">
                                                                <div class="row">
                                                                    <div class="col-xs-4">
                                                                        <h5 class="panel-title">附录</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                        <table class="table table-bordered table-condensed">
                                                        <tbody>
                                                            <tr>
                                                                <th style="width:10%">附录名称</th>
                                                                <th style="width:10%">备注</th>
                                                            </tr>

                                                            <tr v-for="(value, key) in val.qualityProjects">
                                                                <td>{{value.quality_project_name}}</td>
                                                                <td>暂无</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    </el-collapse-item>
                                                </el-collapse>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                <div class="row">
                                        <div class="col-xs-12 text-center">
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!isShow">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })

        }
      }
        break;
      case '#processQualityReport': {	//品质报告
        ; (function () {
          const swiper = document.getElementById('processQualityReport')   //右侧外部swiper

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#processQualityReportInerSwiper',
            data() {
              return {
                searchData: {
                  headNum: 1, // 下标
                  type: 'info', // 搜索类型
                  reportId: '', // 模板id
                  reportName: '', // 模板名
                  startDate: '', // 开始时间
                  endDate: '', // 结束时间
                },//搜索参数
                tbodyData: [],
                searchDataSelect: '',//下拉选选择的数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1,   //当前页

                checkWayList: checkWayList,//检验方式集合
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCReportRecordUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.pqcReport
                      this.lines = result.map.lines
                    }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                let promise = new Promise((resolve, reject) => {
                  ADMModal('新增品质报告', '', resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //详情
              detail(value) {
                let reportId = value.quality_pqc_report_id
                ADMModal('品质报告详情', reportId)
              },

              //修改
              modify(value) {
                let reportId = value.quality_pqc_report_id
                let promise = new Promise((resolve, reject) => {
                  ADMModal('修改品质报告', reportId, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //删除
              remove(value, index) {
                let submitData = {
                  reportId: value.quality_pqc_report_id,
                  status: 1
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(modifyPQCReportUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.reportName = this.searchDataInput
                // this.searchData.craftId = this.searchDataSelect
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum
                // console.log(`当前页: ${val}`);

                this.queryFun(this.searchData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD')
                }
              }
            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="processQualityReportInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm">
                                  <!--
                                     <select
                                      class="form-control table-input input-sm"
                                       @change = "search()"
                                      v-model.trim="searchDataSelect"
                                      v-bind:value="searchDataSelect"
                                    >
                                      <option  value="">全部类型</option>
                                      <option
                                        v-show="checkWayList.length"
                                        v-for="(value, index) in checkWayList" :key="index"
                                        v-bind:value="value.quality_check_method_id">{{value.quality_check_method_name}}
                                      </option>
                                    </select>
                                  -->
																	</div>
                                  <div class="input-group input-group-sm ">
                                    <input class="form-control" type="text"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字" maxlength="25"
                                    >
                                    <div class="input-group-btn">
                                      <a href="javascript:;" class="btn btn-primary btn-sm" @click.stop.prevent ="search()">
                                       <i class="fa fa-search"></i>
                                      </a>
                                    </div>
                                  </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 6%;">序号</th>
                              <th style="width: 14%;">报告名称</th>
                              <th style="width: 20%;">生产批次</th>
                              <th style="width: 10%;">工单号</th>
                              <th style="width: 10%;">班次</th>
                              <th style="width: 10%;">半成品名称</th>
                              <th style="width: 10%;">检验方式</th>
                              <th style="width: 20%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td v-text="index + 1" >
                              </td>
                              <td v-text="value.quality_pqc_report_name">
                              </td>
                              <td v-text="value.quality_pqc_product_batch">
                              </td>
                              <td>{{value.plan_work_order_id }}
                              </td>
                              <td v-text="value.className">
                              </td>
                              <td v-text="value.semiFinishName">
                              </td>
                              <td v-text="value.qualityCheckMethodDO ? value.qualityCheckMethodDO.quality_check_method_name : ''">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="detail(value)" href="javascript:;">
                                  <i class="fa fa-tasks fa-fw"></i>详情</a>
                                 <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

          /**
         * @description 新增,详情,修改,模态框,
         * @param type {String} 模态框类型:新增品质报告,品质报告详情,修改品质报告
         * @param reportId {String} 品质报告id,
         */
          function ADMModal(type, reportId, resolve) {
            // console.log(this.reportId)
            let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                return {
                  type: type,
                  reportId: reportId,
                  searchData: { headNum: 1, type: 'detai', reportId: reportId, templateName: '' },//搜索参数
                  searchData2: { headNum: 1, type: 'detai', templateId: '', templateName: '' },//方案搜索参数

                  isDataChange: false, //判断数据是否改变
                  isBasicInfoDataChange: 0, //判断基础信息是否改变
                  isEnvironmentDataChange: 0, //判断环境条件是否改变
                  isMaterialsDataChange: 0, //判断来料确认是否改变
                  isSemiFinishedDataChange: 0, //判断半成品参数是否改变
                  isDevicesDataChange: 0, //判断设备参数是否改变
                  isOtherDataChange: 0, //判断其它参数是否改变

                  basicInfoData: { //基础信息
                    quality_pqc_report_id: '',  //pqc检验报告id
                    quality_pqc_report_name: `${moment().format('YYYYMMDD')}新建`,     //报告名称
                    quality_pqc_report_number: `${moment().format('YYYYMMDDHHmmss')}`,   //报告编号
                    quality_pqc_template_name: '', //pqc模板名称
                    quality_pqc_template_id: '', //pqc模板id
                    quality_pqc_product_date: ``,   //生产日期
                    devices_control_devices_id: '', //设备id
                    devices_control_devices_number: '', //设备编号
                    role_class_id: '',  //班次id
                    role_class_name: '',  //班次名称
                    quality_pqc_operation: '',  //操作员
                    quality_pqc_operationId: '',  //操作员id
                    production_batch: '', //生产批号
                    workOrderNumber: [],//工单号内容
                    plan_work_order_name: '',  //工单号
                    plan_work_order_id: '', //工单id
                    quality_pqc_checkWay: '', //检验方式
                    quality_pqc_checkWayId: "",//检验方式id
                    semi_finish_id: '', //半成品id
                    semi_finish_name: '', //半成品名称
                    semi_finish_genre: '', //半成品型号
                    semi_finish_unit: '', //半成品单位
                    semi_finish_number: 1, //计划量
                    semi_finish_good_number: '', //良品数
                    semi_finish_good_rate: '', //良品率
                    quality_pqc_comprehensive_result: '', //综合判断
                    quality_pqc_check: '',  //检验员
                    quality_pqc_checkId: '',  //检验员id
                    quality_pqc_check_date: '',  //检验日期
                    quality_pqc_examine: '',  //审查人员
                    quality_pqc_examineId: '',  //审查人员id
                    quality_pqc_examine_date: '',  //审查日期
                    quality_pqc_report_complete: 1, //报告状态
                    quality_pqc_remarks: '无备注',  //备注

                  },
                  environmentData: [],//环境条件
                  materialsData: [],//来料确认
                  semiFinishedData: [],//半成品参数
                  devicesData: [],//设备参数
                  otherData: [],//其它参数
                  badnessAddData: [],//增加的不良内容
                  badnessMOdifyData: [],//修改的不良内容

                  checkWayList: checkWayList,//检验方式集合
                  classList: classList,//班次

                  activeNames: [  //element-UI折叠面板默认打开项配置
                    'ADMModalPanel_1',
                    'ADMModalPanel_2',
                    'ADMModalPanel_3',
                    'ADMModalPanel_4',
                    'ADMModalPanel_5',
                    'ADMModalPanel_6',
                  ],
                  planBatchNumber: [],//生产批次内容
                  iptBatchNumber: '',//输入生产批次号
                  timeout:  null,
                }
              },
              methods: {
                //加载数据,报告
                queryFun(data) {
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCReportRecordUrl,
                    data: data,
                    beforeSend: (xml) => {
                      mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      mesloadBox.hide()
                      if (result.status == 0) {
                        console.log(result)
                        this.environmentData = []  //环境条件
                        this.materialsData = []   //来料确认
                        this.semiFinishedData = []    //半成品参数
                        this.devicesData = []   //设备参数
                        this.otherData = []   //其它参数

                        let pqcReport = result.map.pqcReport
                        let qualityProjectTypes = pqcReport.qualityProjectTypes
                        let materialConfirms = result.map.materialConfirms
                        let PQCUnqualifieds = result.map.PQCUnqualifieds

                        typeof (PQCUnqualifieds) === "undefined" ? this.badnessMOdifyData = [] : this.badnessMOdifyData = PQCUnqualifieds


                        //基础信息
                        {
                          this.basicInfoData.quality_pqc_report_id = pqcReport.quality_pqc_report_id  //pqc检验报告id
                          this.basicInfoData.quality_pqc_report_name = pqcReport.quality_pqc_report_name  //报告名称
                          this.basicInfoData.quality_pqc_report_number = pqcReport.quality_pqc_report_number  //报告编号
                          this.basicInfoData.quality_pqc_template_id = pqcReport.quality_pqc_template_id //pqc模板id
                          this.basicInfoData.quality_pqc_product_date = pqcReport.quality_pqc_product_date //生产日期
                          this.basicInfoData.devices_control_devices_id = pqcReport.devices_control_devices_id //设备id
                          this.basicInfoData.devices_control_devices_number = pqcReport.devicesNumber //设备编号
                          this.basicInfoData.role_class_id = pqcReport.role_class_id //班次id
                          this.basicInfoData.role_class_name = pqcReport.className //班次名称
                          this.basicInfoData.quality_pqc_operation = pqcReport.quality_pqc_operation //操作员
                          this.basicInfoData.production_batch = pqcReport.quality_pqc_product_batch //生产批号
                          this.basicInfoData.plan_work_order_id = pqcReport.plan_work_order_id //工单id
                          this.basicInfoData.plan_work_order_name = pqcReport.workOrderDO ? pqcReport.workOrderDO.work_order_number : ''//工单号
                          this.basicInfoData.quality_check_method_id = pqcReport.qualityCheckMethodDO ? pqcReport.qualityCheckMethodDO.quality_check_method_id : ''//检验方式id
                          this.basicInfoData.quality_check_method_name = pqcReport.qualityCheckMethodDO ? pqcReport.qualityCheckMethodDO.quality_check_method_name : ''//检验方式
                          this.basicInfoData.semi_finish_id = pqcReport.semi_finish_id  //半成品id
                          this.basicInfoData.semi_finish_name = pqcReport.semiFinishName  //半成品名称
                          this.basicInfoData.semi_finish_genre = pqcReport.semi_finish_genre  //半成品型号
                          this.basicInfoData.semi_finish_number = pqcReport.semi_finish_number //计划量
                          this.basicInfoData.semi_finish_good_number = pqcReport.semi_finish_good_number //良品数
                          this.basicInfoData.semi_finish_good_rate = pqcReport.semi_finish_good_rate //良品率
                          this.basicInfoData.quality_pqc_comprehensive_result = pqcReport.quality_pqc_comprehensive_result //综合判断
                          this.basicInfoData.semi_finish_number = pqcReport.semi_finish_number //计划量

                          this.basicInfoData.quality_pqc_check = pqcReport.quality_pqc_check
                          this.basicInfoData.quality_pqc_check_date = pqcReport.quality_pqc_check_date
                          this.basicInfoData.quality_pqc_examine = pqcReport.quality_pqc_examine
                          this.basicInfoData.quality_pqc_examine_date = pqcReport.quality_pqc_examine_date
                          this.basicInfoData.quality_pqc_report_complete = pqcReport.quality_pqc_report_complete
                          this.basicInfoData.quality_pqc_remarks = pqcReport.quality_pqc_remarks
                        }

                        //环境条件,半成品参数,设备参数,其它
                        for (let i = 0, len = qualityProjectTypes.length; i < len; i++) {
                          if (qualityProjectTypes[i].quality_project_type_name == '环境条件') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: qualityProjectTypes[i].qualityProjects[j].pqcReportRecord,  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.environmentData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '设备参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: qualityProjectTypes[i].qualityProjects[j].pqcReportRecord,  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.devicesData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '其它') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: qualityProjectTypes[i].qualityProjects[j].pqcReportRecord,  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.otherData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '半成品参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,
                                standard2: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,
                                record1: qualityProjectTypes[i].qualityProjects[j].pqcReportRecord,  //实测1
                                record2: qualityProjectTypes[i].qualityProjects[j].pqcReportRecord,  //实测2
                                attach: [],
                              };

                              //处理附加参数
                              for (let k = 0, len = qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs.length; k < len; k++) {
                                let tempObj2 = {
                                  quality_pqc_project_attach_id: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].quality_pqc_project_attach_id,
                                  quality_pqc_project_attach_name: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].quality_pqc_project_attach_name,
                                  quality_pqc_project_attach_record: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].pqcProjectAttachRecord,
                                }
                                tempObj.attach.push(tempObj2)
                              }

                              this.semiFinishedData.push(tempObj)
                            }
                          }
                        }
                        //来料确认
                        for (let i = 0, len = materialConfirms.length; i < len; i++) {
                          let tempObj = {
                            item: {
                              warehouse_material_name: materialConfirms[i].materialName,
                              quality_material_confirm_id: materialConfirms[i].quality_material_confirm_id,
                            },
                            standard1: '',
                            standard2: '',
                            attach: [],
                          };
                          //处理来料参数
                          for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                            let tempObj2 = {
                              quality_material_confirm_parameter_id: materialConfirms[i].qualityProjects[j].quality_material_confirm_parameter_id,
                              quality_project_name: materialConfirms[i].qualityProjects[j].quality_project_name,
                              quality_project_record: materialConfirms[i].qualityProjects[j].pqcMaterialRecord,
                            }
                            tempObj.attach.push(tempObj2)
                          }

                          let tempStr = '';
                          for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                            tempStr += `${materialConfirms[i].qualityProjects[j].quality_project_name},`
                          }
                          tempObj.standard1 = tempStr
                          this.materialsData.push(tempObj)
                        }

                      }
                      else {
                        this.searchDataInput = ''
                        this.tbodyData = []
                        this.lines = 0
                      }

                    },

                  })
                },
                //加载数据,模板
                queryFun2(data) {
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCTemplateUrl,
                    data: data,
                    beforeSend: (xml) => {
                      // mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      // mesloadBox.hide()

                      this.environmentData = []  //环境条件
                      this.materialsData = []   //来料确认
                      this.semiFinishedData = []    //半成品参数
                      this.devicesData = []   //设备参数
                      this.otherData = []   //其它参数

                      if (result.status == 0) {

                        let pqcTemplate = result.map.pqcTemplate[0];   //基础信息
                        let qualityProjectTypes = pqcTemplate.qualityProjectTypes;  //环境条件,半成品参数,设备参数,其它
                        let materialConfirms = result.map.materialConfirms; //来料确认

                        //基础信息
                        this.basicInfoData.quality_pqc_checkWay = pqcTemplate.modelName
                        this.basicInfoData.quality_pqc_checkWayId = pqcTemplate.quality_check_method_id
                        //环境条件,半成品参数,设备参数,其它
                        for (let i = 0, len = qualityProjectTypes.length; i < len; i++) {
                          if (qualityProjectTypes[i].quality_project_type_name == '环境条件') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: {
                                  quality_pqc_project_record_id: '',
                                  quality_pqc_project_criterion_value: '实测1'
                                },  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.environmentData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '设备参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: {
                                  quality_pqc_project_record_id: '',
                                  quality_pqc_project_criterion_value: '实测1'
                                },  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.devicesData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '其它') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {   //项目
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准1
                                standard2: '',  //标准2
                                record1: {
                                  quality_pqc_project_record_id: '',
                                  quality_pqc_project_criterion_value: '实测1'
                                },  //实测1
                                record2: '',  //实测2
                                attach: [],   //来料参数或附加参数
                              }
                              this.otherData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '半成品参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: {
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,
                                standard2: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,
                                record1: {
                                  quality_pqc_project_record_id: '',
                                  quality_pqc_project_criterion_one_value: '实测1',
                                  quality_pqc_project_criterion_two_value: '实测2'
                                },  //实测1
                                record2: {
                                  quality_pqc_project_record_id: '',
                                  quality_pqc_project_criterion_one_value: '实测1',
                                  quality_pqc_project_criterion_two_value: '实测2'
                                },  //实测2
                                attach: [],
                              };

                              //处理附加参数
                              for (let k = 0, len = qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs.length; k < len; k++) {
                                let tempObj2 = {
                                  quality_pqc_project_attach_id: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].quality_pqc_project_attach_id,
                                  quality_pqc_project_attach_name: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].quality_pqc_project_attach_name,
                                  quality_pqc_project_attach_record: {
                                    quality_pqc_project_attach_record_id: '',
                                    quality_pqc_project_attach_record_value: '附加参数记录'
                                  },
                                }
                                tempObj.attach.push(tempObj2)
                              }

                              this.semiFinishedData.push(tempObj)
                            }
                          }
                        }
                        //来料确认
                        for (let i = 0, len = materialConfirms.length; i < len; i++) {
                          let tempObj = {
                            item: {
                              warehouse_material_name: materialConfirms[i].materialName,
                              quality_material_confirm_id: materialConfirms[i].quality_material_confirm_id,
                            },
                            standard1: '',
                            standard2: '',
                            attach: [],
                          };
                          //处理来料参数
                          for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                            let tempObj2 = {
                              quality_material_confirm_parameter_id: materialConfirms[i].qualityProjects[j].quality_material_confirm_parameter_id,
                              quality_project_name: materialConfirms[i].qualityProjects[j].quality_project_name,
                              quality_project_record: {
                                quality_material_confirm_record_id: '',
                                quality_material_confirm_value: '来料参数记录'
                              },
                            }
                            tempObj.attach.push(tempObj2)
                          }

                          let tempStr = '';
                          for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                            tempStr += `${materialConfirms[i].qualityProjects[j].quality_project_name},`
                          }
                          tempObj.standard1 = tempStr
                          this.materialsData.push(tempObj)
                        }

                      }
                      else {
                        this.$message.error(`没有返回数据`);

                      }

                    },

                  })
                },
                // 选择检验方案,新增时使用
                selectPqcTemplate() {
                  let promise = new Promise((resolve, reject) => {
                    selectPQCWayModal2(resolve)
                  })
                  promise.then((resolveData) => {
                    this.searchData2.templateId = resolveData.quality_pqc_template_id
                    this.basicInfoData.quality_pqc_template_id = resolveData.quality_pqc_template_id
                    this.queryFun2(this.searchData2)

                  })
                },
                //选择生产批次
                querySearch(queryString, cb) {
                    this.planBatchNumber = this.loadAll(queryString);
                    var planBatchNumber = this.planBatchNumber;
                    var results = queryString ? planBatchNumber.filter(this.createFilter(queryString)) : planBatchNumber;
                    // 调用 callback 返回建议列表的数据
                    cb(results);
                },
                createFilter(queryString) {
                  return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
                  };
                },
                loadAll(queryString) {
                    let arrResult = [];
                    $.ajax({
                      type: "POST", dataType: "json", async : false, xhrFields: { withCredentials: true }, crossDomain: true,
                      url: queryPlanBatchNumberUrl,
                      data:{
                        'headNum': 1,
                        'keyword': queryString
                      },
                      beforeSend: function (xml) {
                          // ajax发送前
                          mesloadBox.loadingShow()
                      },
                      success: function (result, status, xhr) {
                          mesloadBox.hide()
                          if(result.status === 0 ){
                            result.map.plans.map(item => {
                              arrResult.push({
                                value: item.production_plan_batch_number,
                                plan_work_order_id: item.production_plan_id,
                              })
                            });
                            arrResult=arrResult.slice(0,10)
                          }else{
                            arrResult= []
                          }
                      }
                  });
                  return arrResult
                },
                handleSelect(item) {
                  this.basicInfoData.plan_work_order_id = item.plan_work_order_id
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    data: { type: 'plan' , planId: item.plan_work_order_id },
                    url: queryWorkOrderNumUrl,
                    success:  (result, status, xhr) => {
                      let workOrderNumberArray=[];
                      if(result.status === 0 ){
                        result.map.workOrders.map(item =>{
                          workOrderNumberArray.push({
                            value: item.work_order_number,
                            name: item.work_order_number
                          })
                        })
                        this.basicInfoData.workOrderNumber = workOrderNumberArray;
                      }else{
                        this.basicInfoData.workOrderNumber = [];
                      }
                    }
                  })
                },
                //选择设备
                selectDevices() {
                  let promise = new Promise((resolve, reject) => {
                    selectDevicesModal(resolve)
                  })
                  promise.then((resolveData) => {
                    console.log(resolveData)
                    this.basicInfoData.devices_control_devices_number = resolveData.devices_control_devices_number
                    this.basicInfoData.devices_control_devices_id = resolveData.devices_control_devices_id
                  })
                },
                //选择操作员
                selectStaff() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.quality_pqc_operation = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_operationId = resolveData.role_staff_id

                  })
                },
                //选择检查员
                selectStaff2() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.quality_pqc_check = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_checkId = resolveData.role_staff_id
                    if (this.type === '新增品质报告') {
                      this.basicInfoData.quality_pqc_check_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  })
                },
                //选择审核人
                selectStaff3() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.quality_pqc_examine = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_examineId = resolveData.role_staff_id
                    if (this.type === '新增品质报告') {
                      this.basicInfoData.quality_pqc_examine_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  })
                },
                //选择半成品
                selectSemiFinish() {
                  let promise = new Promise((resolve, reject) => {
                    selectSemiFinishModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.semi_finish_name = resolveData.semi_finish_name
                    this.basicInfoData.semi_finish_id = resolveData.semi_finish_id
                    this.basicInfoData.semi_finish_genre = resolveData.semi_finish_genre
                    this.basicInfoData.semi_finish_unit = resolveData.semi_finish_unit
                  })
                },
                //选择不良内容
                addBadness() {

                  let promise = new Promise((resolve, reject) => {
                    let dataList = this.badnessAddData.concat(this.badnessMOdifyData)
                    console.dir(dataList)
                    selectBadnessModal(resolve, dataList)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        quality_pqc_report_id: reportId, //pqc报告id
                        quality_unqualified_id: resolveData[i].quality_unqualified_id, //不良现象id
                        quality_unqualified_code: resolveData[i].quality_unqualified_code, //不良代码
                        // quality_unqualified_detail: resolveData[i].quality_unqualified_detail, //不良描述
                        quality_sample_number: 0, //抽样数量
                        quality_pqc_unqualified_number: 0, //不良数量
                        quality_pqc_unqualified_probability: 0, //不良率
                      }
                      this.badnessAddData.push(tempObj)
                    }

                  })
                },
                //移除不良内容
                removeBadness(index) {
                  arryUnit(this.badnessAddData, index)
                },
                //计算良品率
                calculate() {
                  if (this.basicInfoData.semi_finish_number !== '' && this.basicInfoData.semi_finish_good_number !== '') {
                    this.basicInfoData.semi_finish_good_rate = `${Math.round((this.basicInfoData.semi_finish_good_number / this.basicInfoData.semi_finish_number) * 10000) / 100}%`
                  } else {
                    this.basicInfoData.semi_finish_good_rate = 0
                  }
                },
                //计算不良率
                calculate2(value) {
                  if (value.quality_sample_number !== '' && value.quality_pqc_unqualified_number !== '' && value.quality_pqc_unqualified_number !== 0) {
                    value.quality_pqc_unqualified_probability = `${Math.round((value.quality_pqc_unqualified_number / value.quality_sample_number) * 10000) / 100}%`
                  }
                },
                //来料参数详情
                materiaParamlDetail(value, index) {
                  // console.log(value)
                  let dataList = [];
                  for (let i = 0, len = value.attach.length; i < len; i++) {
                    let tempObj = {
                      quality_material_confirm_parameter_id: value.attach[i].quality_material_confirm_parameter_id, //参数id
                      quality_project_name: value.attach[i].quality_project_name, //参数名称
                      quality_project_record: {
                        quality_material_confirm_record_id: value.attach[i].quality_project_record.quality_material_confirm_record_id,
                        quality_material_confirm_value: value.attach[i].quality_project_record.quality_material_confirm_value,
                      }, //参数记录
                    }
                    dataList.push(tempObj)
                  }

                  let promise = new Promise((resolve, reject) => {

                    materialDetailModal(this.type, resolve, dataList)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.materialsData[index].attach = resolveData

                  })
                },
                //附加参数详情
                attachParamDetail(value, index) {
                  let dataList = [];
                  // console.dir(value)
                  //防止引用相同遍历到另一个数组
                  for (let i = 0, len = value.attach.length; i < len; i++) {
                    let tempObj = {
                      quality_pqc_project_attach_id: value.attach[i].quality_pqc_project_attach_id,
                      quality_pqc_project_attach_name: value.attach[i].quality_pqc_project_attach_name,
                      quality_pqc_project_attach_record: {
                        quality_pqc_project_attach_record_id: value.attach[i].quality_pqc_project_attach_record.quality_pqc_project_attach_record_id,
                        quality_pqc_project_attach_record_value: value.attach[i].quality_pqc_project_attach_record.quality_pqc_project_attach_record_value
                      },
                    }
                    dataList.push(tempObj)
                  }

                  let promise = new Promise((resolve, reject) => {
                    attachParamDetailModal(this.type, resolve, dataList)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.semiFinishedData[index].attach = resolveData
                  })

                },
                //提交
                submit() {
                  let reportRecords = []; //实测内容
                  let explains = [];   //附加说明(不良内容)
                  let materialRecords = [];  //来料参数记录
                  let attachRecords = [];  //附加参数记录

                  if (this.basicInfoData.quality_pqc_report_name === null || this.basicInfoData.quality_pqc_report_name === '') {
                    this.$message.error(`报告名称不能为空`);
                    return;
                  }
                  if (this.basicInfoData.quality_pqc_report_number === null || this.basicInfoData.quality_pqc_report_number === '') {
                    this.$message.error(`报告编号不能为空`);
                    return;
                  }
                  if (
                    this.environmentData.length < 1 &&
                    this.materialsData.length < 1 &&
                    this.semiFinishedData.length < 1 &&
                    this.devicesData.length < 1 &&
                    this.otherData.length < 1
                  ) {
                    this.$message.error(`请在右上角选择一种检验方案`);
                    return;
                  }

                  //遍历环境条件
                  for (let i = 0, len = this.environmentData.length; i < len; i++) {
                    if (this.type === '新增品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于新增
                        quality_project_relation_id: this.environmentData[i].item.qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                        quality_pqc_project_criterion_value: this.environmentData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }

                    if (this.type === '修改品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于修改
                        quality_pqc_project_record_id: this.environmentData[i].record1.quality_pqc_project_record_id, //检验项目记录id
                        quality_pqc_project_criterion_value: this.environmentData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }

                  }

                  //来料确认
                  for (let i = 0, len = this.materialsData.length; i < len; i++) {

                    for (let j = 0, len = this.materialsData[i].attach.length; j < len; j++) {
                      if (this.type === '新增品质报告') {
                        let PQCMaterialParameterDO = {  //来料确认-参数（项目）实体类
                          quality_material_confirm_parameter_id: this.materialsData[i].attach[j].quality_material_confirm_parameter_id,  //检验项目（参数）id
                          quality_material_confirm_value: this.materialsData[i].attach[j].quality_project_record.quality_material_confirm_value //物料或半成品id
                        }
                        materialRecords.push(PQCMaterialParameterDO)
                      }
                    }

                  }

                  //半成品参数
                  for (let i = 0, len = this.semiFinishedData.length; i < len; i++) {
                    if (this.type === '新增品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_project_relation_id: this.semiFinishedData[i].item.qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                        // quality_pqc_project_criterion_value: this.semiFinishedData[i].record1,  //标准
                        quality_pqc_project_criterion_one_value: this.semiFinishedData[i].record1.quality_pqc_project_criterion_one_value,  //标准1
                        quality_pqc_project_criterion_two_value: this.semiFinishedData[i].record2.quality_pqc_project_criterion_two_value  //标准2
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }
                    if (this.type === '修改品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_pqc_project_record_id: this.semiFinishedData[i].record1.quality_pqc_project_record_id, //参数类型-参数关系表id
                        // quality_pqc_project_criterion_value: this.semiFinishedData[i].record1,  //标准
                        quality_pqc_project_criterion_one_value: this.semiFinishedData[i].record1.quality_pqc_project_criterion_one_value,  //标准1
                        quality_pqc_project_criterion_two_value: this.semiFinishedData[i].record2.quality_pqc_project_criterion_two_value  //标准2
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }


                    for (let j = 0, len = this.semiFinishedData[i].attach.length; j < len; j++) {
                      if (this.type === '新增品质报告') {
                        let PQCProjectAttachRecordDO = {  //附加参数记录实体类
                          quality_pqc_project_attach_id: this.semiFinishedData[i].attach[j].quality_pqc_project_attach_id,  //附加说明参数id
                          quality_pqc_project_attach_record_value: this.semiFinishedData[i].attach[j].quality_pqc_project_attach_record.quality_pqc_project_attach_record_value //附加参数名称
                        }
                        attachRecords.push(PQCProjectAttachRecordDO)
                      }
                    }

                  }

                  //遍历设备参数
                  for (let i = 0, len = this.devicesData.length; i < len; i++) {
                    if (this.type === '新增品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_project_relation_id: this.devicesData[i].item.qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                        quality_pqc_project_criterion_value: this.devicesData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }
                    if (this.type === '修改品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_pqc_project_record_id: this.devicesData[i].record1.quality_pqc_project_record_id, //参数类型-参数关系表id
                        quality_pqc_project_criterion_value: this.devicesData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }

                  }

                  //遍历其它参数
                  for (let i = 0, len = this.otherData.length; i < len; i++) {
                    if (this.type === '新增品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_project_relation_id: this.otherData[i].item.qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                        quality_pqc_project_criterion_value: this.otherData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }
                    if (this.type === '修改品质报告') {
                      let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类
                        quality_pqc_project_record_id: this.otherData[i].record1.quality_pqc_project_record_id, //参数类型-参数关系表id
                        quality_pqc_project_criterion_value: this.otherData[i].record1.quality_pqc_project_criterion_value  //标准
                      }
                      reportRecords.push(PQCReportRecordDO)
                    }

                  }

                  if (this.type === '新增品质报告') {
                    let report = { //报告对象
                      quality_pqc_report_id: this.basicInfoData.quality_pqc_report_id,
                      plan_work_order_id: this.basicInfoData.plan_work_order_name, //工单号
                      quality_pqc_report_name: this.basicInfoData.quality_pqc_report_name,     //报告名称
                      quality_pqc_report_number: this.basicInfoData.quality_pqc_report_number,   //报告编号
                      quality_pqc_template_id: this.basicInfoData.quality_pqc_template_id,    //模板id
                      productDate: this.basicInfoData.quality_pqc_product_date,   //生产日期
                      devices_control_devices_id: this.basicInfoData.devices_control_devices_id, //设备id
                      devicesNumber: this.basicInfoData.devices_control_devices_number, //设备编号
                      role_class_id: this.basicInfoData.role_class_id,  //班次id
                      className: this.basicInfoData.role_class_name,  //班次名称
                      quality_pqc_operation: this.basicInfoData.quality_pqc_operation,  //操作员
                      quality_pqc_product_batch: this.basicInfoData.production_batch, //生产批号
                      quality_check_method_id: this.basicInfoData.quality_pqc_checkWayId, //检验方式
                      semi_finish_id: this.basicInfoData.semi_finish_id, //半成品id
                      semiFinishName: this.basicInfoData.semi_finish_name, //半成品名称
                      semi_finish_genre: this.basicInfoData.semi_finish_genre, //半成品型号
                      semi_finish_number: this.basicInfoData.semi_finish_number, //计划量
                      semi_finish_good_number: this.basicInfoData.semi_finish_good_number, //良品数
                      semi_finish_good_rate: this.basicInfoData.semi_finish_good_rate, //良品率
                      quality_pqc_comprehensive_result: this.basicInfoData.quality_pqc_comprehensive_result, //综合判断
                      quality_pqc_check: this.basicInfoData.quality_pqc_check,  //检验员id
                      checkDate: this.basicInfoData.quality_pqc_check_date,  //检验日期
                      createDate: moment().format('YYYY-MM-DD HH:ss:mm'),  //创建日期
                      quality_pqc_examine: this.basicInfoData.quality_pqc_examine,  //审查人员id
                      examineDate: this.basicInfoData.quality_pqc_examine_date,  //审查日期
                      quality_pqc_report_complete: this.basicInfoData.quality_pqc_report_complete, //报告状态
                      quality_pqc_remarks: this.basicInfoData.quality_pqc_remarks,  //备注

                    };
                    // console.dir(report)
                    let submitData = {
                      report: `${JSON.stringify(report)}`,
                      reportRecords: `${JSON.stringify(reportRecords)}`,
                      explains: `${JSON.stringify(this.badnessAddData)}`,
                      materialRecords: `${JSON.stringify(materialRecords)}`,
                      attachRecords: `${JSON.stringify(attachRecords)}`,
                      unqualifieds: `${JSON.stringify(this.badnessAddData)}`,
                    }
                    let promise = new Promise((resolve, reject) => {
                      const modal = document.getElementById('commonModal1')   //模态框
                      submitFun(savePQCReportUrl, submitData, modal, resolve)
                    })
                    promise.then((resolveData) => {
                      resolve({
                        resolveData: true
                      })
                    })

                  }

                  if (this.type === '修改品质报告') {

                    if (this.isBasicInfoDataChange > 1) { //修改基础信息
                      let submitData = {
                        reportId: this.basicInfoData.quality_pqc_report_id,
                        reportName: this.basicInfoData.quality_pqc_report_name,
                        reportNumber: this.basicInfoData.quality_pqc_report_number,
                        devicesId: this.basicInfoData.devices_control_devices_id,
                        finishId: this.basicInfoData.semi_finish_id,
                        productBatch: this.basicInfoData.production_batch,
                        productDate: moment(this.basicInfoData.quality_pqc_product_date).format('YYYY-MM-DD HH:mm:ss'),
                        finishNumber: this.basicInfoData.semi_finish_number,
                        classId: this.basicInfoData.role_class_id,
                        operation: this.basicInfoData.quality_pqc_operation,
                        check: this.basicInfoData.quality_pqc_check,
                        checkDate: moment(this.basicInfoData.quality_pqc_check_date).format('YYYY-MM-DD HH:mm:ss'),
                        examine: this.basicInfoData.quality_pqc_examine,
                        examineDate: moment(this.basicInfoData.quality_pqc_examine_date).format('YYYY-MM-DD HH:mm:ss'),
                        complete: this.basicInfoData.quality_pqc_report_complete,
                        remarks: this.basicInfoData.quality_pqc_remarks,
                      }
                      // console.dir(submitData)
                      let promise = new Promise((resolve, reject) => {
                        const modal = document.getElementById('commonModal1')   //模态框
                        submitFun(modifyPQCReportUrl, submitData, modal, resolve)
                      })
                      promise.then((resolveData) => {
                        resolve({
                          resolveData: true
                        })
                      })
                    }

                    // console.log(this.isEnvironmentDataChange)
                    if (
                      this.isEnvironmentDataChange > 1 ||
                      this.isSemiFinishedDataChange > 1 ||
                      this.isDevicesDataChange > 1 ||
                      this.isOtherDataChange > 1
                     ) {
                      let submitData = {
                        projectRecords: `${JSON.stringify(reportRecords)}`,
                      }
                      let promise = new Promise((resolve, reject) => {
                        const modal = document.getElementById('commonModal1')   //模态框
                        submitFun(modifyPQCProjectRecordUrl, submitData, modal, resolve)
                      })
                      promise.then((resolveData) => {
                        resolve({
                          resolveData: true
                        })
                      })
                    }
                    // console.dir(this.badnessAddData)
                    if (this.badnessAddData.length > 0) { //新增不良
                      let submitData = {
                        unqualifieds: `${JSON.stringify(this.badnessAddData)}`,
                      }
                      let promise = new Promise((resolve, reject) => {
                        const modal = document.getElementById('commonModal1')   //模态框
                        submitFun(savePQCUnqualifiedUrl, submitData, modal, resolve)
                      })
                      promise.then((resolveData) => {
                        resolve({
                          resolveData: true
                        })
                      })
                    }

                  }


                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal1'))   //模态框
                  if (
                    this.isBasicInfoDataChange > 1 ||
                    this.isEnvironmentDataChange > 1 ||
                    this.isSemiFinishedDataChange > 1 ||
                    this.isDevicesDataChange > 1 ||
                    this.isOtherDataChange > 1
                  ) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },
              mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true     //显示
                })
              },
              watch: {
                // 基础信息改变
                basicInfoData: {
                  handler(newValue, oldValue) {
                    this.isBasicInfoDataChange += 1

                  },
                  deep: true
                },
                // 环境条件
                environmentData: {
                  handler(newValue, oldValue) {
                    this.isEnvironmentDataChange += 1

                  },
                  deep: true
                },
                // 来料确认
                materialsData: {
                  handler(newValue, oldValue) {
                    this.isMaterialsDataChange += 1

                  },
                  deep: true
                },
                // 半成品参数
                semiFinishedData: {
                  handler(newValue, oldValue) {
                    this.isSemiFinishedDataChange += 1

                  },
                  deep: true
                },
                // 设备参数
                devicesData: {
                  handler(newValue, oldValue) {
                    this.isDevicesDataChange += 1

                  },
                  deep: true
                },
                // 其它参数
                otherData: {
                  handler(newValue, oldValue) {
                    this.isOtherDataChange += 1

                  },
                  deep: true
                },

              },

              filters: {
                //时间戳转日期
                times(val) {
                  if (val !== '' && val !== null) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                  }
                }
              },
              template: `
                <div class="modal fade" id="commonModal1">
                    <div class="modal-dialog modal-lg">
                      <div class="modal-content" >
                        <div class="modal-header">
                          <button class="close" @click="closeModal()">
                            <span>
                              <i class="fa fa-close"></i>
                            </span>
                          </button>
                          <h4 class="modal-title" v-text = "type"></h4>
                        </div>
                        <div class="modal-body">
                          <div class="container-fluid">
                            <div class="row">
                              <div class="col-sm-12">
                                <el-collapse v-model="activeNames">
                                  <!--基础信息-->
                                  <div class="panel panel-default">
                                    <div class="panel-heading panel-heading-table">
                                      <div class="row">
                                        <div class="col-xs-4">
                                          <h5 class="panel-title">基础信息</h5>
                                        </div>
                                        <div class="col-xs-8">
                                          <form class="form-inline pull-right" onsubmit="return false;">
                                            <button
                                              class="btn btn-primary btn-sm"
                                              @click = "selectPqcTemplate()"
                                              v-if="type === '新增品质报告' "
                                            >
                                              选择检验方案
                                            </button>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <table class="table table-bordered table-condensed">
                                        <tbody v-if="type === '品质报告详情' ">
                                          <tr>
                                            <th style="width:14%">报告名称</th>
                                            <td style="width:19%" v-text="basicInfoData.quality_pqc_report_name">
                                            </td>
                                            <th style="width:14%">表单编号</th>
                                            <td  style="width:19%" v-text="basicInfoData.quality_pqc_report_number">
                                            </td>
                                            <th style="width:14%">生产日期</th>
                                            <td  style="width:19%" >
                                            {{basicInfoData.quality_pqc_product_date | times}}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">生产批次</th>
                                              <td  style="width:19%" v-text="basicInfoData.production_batch">
                                            </td>
                                            <th style="width:14%">工单号</th>
                                            <td style="width:19%">{{basicInfoData.plan_work_order_id}}
                                            </td>
                                            <th style="width:14%">检验方式</th>
                                            <td  style="width:19%">{{basicInfoData.quality_check_method_name}}
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">设备编号</th>
                                            <td  style="width:19%" v-text="basicInfoData.devices_control_devices_number">
                                            </td>
                                            <th style="width:14%">班次</th>
                                            <td  style="width:19%" v-text="basicInfoData.role_class_name">
                                            </td>
                                            <th style="width:14%">操作员</th>
                                            <td  style="width:19%" v-text="basicInfoData.quality_pqc_operation">
                                            </td>
                                          </tr>
                                          <!--
                                          <tr>
                                            <th style="width:14%">半成品名称</th>
                                            <td  style="width:19%" v-text="basicInfoData.semi_finish_name">
                                            </td>
                                            <th style="width:14%">半成品型号</th>
                                            <td  style="width:19%"  v-text="basicInfoData.semi_finish_genre">
                                            </td>
                                            <th style="width:14%">半成品单位</th>
                                            <td  style="width:19%"  v-text="basicInfoData.semi_finish_unit">
                                            </td>
                                          </tr>
                                          -->
                                          <tr>
                                            <th style="width:14%">检查数量</th>
                                            <td  style="width:19%" v-text="basicInfoData.semi_finish_number">
                                            </td>
                                            <th style="width:14%">良品数</th>
                                            <td  style="width:19%" v-text="basicInfoData.semi_finish_good_number">
                                            </td>
                                            <th style="width:14%">良品率</th>
                                            <td  style="width:19%" v-text="basicInfoData.semi_finish_good_rate">
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">检查员</th>
                                            <td  style="width:19%" v-text="basicInfoData.quality_pqc_check">
                                            </td>
                                            <th style="width:14%">检验日期</th>
                                            <td  style="width:19%" >
                                            {{basicInfoData.quality_pqc_check_date | times}}
                                            </td>
                                            <th style="width:14%">完成状态</th>
                                            <td  style="width:19%" v-text="basicInfoData.quality_pqc_report_complete === '0' ? '已完成' : '未完成' ">
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">审核人</th>
                                            <td  style="width:19%" v-text="basicInfoData.quality_pqc_examine">
                                            </td>
                                            <th style="width:14%">审核日期</th>
                                            <td  style="width:19%" >
                                            {{basicInfoData.quality_pqc_examine_date | times}}
                                            </td>
                                            <th style="width:14%">综合判定</th>
                                            <td class="table-input-td" style="width:19%">
                                                <select
                                                  class="form-control table-input input-sm"
                                                  disabled
                                                  v-model.trim="basicInfoData.quality_pqc_comprehensive_result"
                                                  v-bind:value="basicInfoData.quality_pqc_comprehensive_result"
                                                >
                                                    <option disabled value=null>未选择</option>
                                                    <option  value="0">合格</option>
                                                    <option  value="1">不合格</option>
                                                </select>
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">半成品名称</th>
                                            <td  style="width:19%" v-text="basicInfoData.semi_finish_name">
                                            </td>
                                            <th style="width:14%">备注</th>
                                            <td  colspan="3" style="width:86%" v-text="basicInfoData.quality_pqc_remarks">
                                            </td>
                                          </tr>
                                        </tbody>
                                        <tbody v-if="type !== '品质报告详情' ">
                                          <tr>
                                            <th style="width:14%">报告名称</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入(必填)"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.quality_pqc_report_name"
                                                maxlength="20"
                                              >
                                            </td>
                                            <th style="width:14%">表单编号</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入(必填)"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.quality_pqc_report_number"
                                                maxlength="20"
                                              >
                                            </td>
                                            <th style="width:14%">生产日期</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                @blur="basicInfoData.quality_pqc_product_date = $event.target.value"
                                                v-bind:value="basicInfoData.quality_pqc_product_date | times"
                                              >
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">生产批次</th>
                                            <td class="table-input-td" style="width:19%" v-if="type === '新增品质报告'">
                                                <el-autocomplete
                                                v-if="type === '新增品质报告'"
                                                v-model="basicInfoData.production_batch"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入关键字"
                                                :trigger-on-focus="false"
                                                @select="handleSelect"
                                              ></el-autocomplete>
                                            </td>
                                            <td style="width:19%"  v-else>
                                            {{basicInfoData.production_batch}}
                                            </td>
                                            <th style="width:14%">工单号</th>
                                            <td style="width:19%" class="table-input-td" v-if="type === '新增品质报告'">
                                              <select
                                                class="form-control table-input input-sm"
                                                v-model.trim="basicInfoData.plan_work_order_name"
                                                v-bind:value="basicInfoData.plan_work_order_name"
                                                 >
                                                  <option disabled value="">请先输入生产批次</option>
                                                  <option
                                                    v-show="basicInfoData.workOrderNumber.length"
                                                    v-for="(value, index) in basicInfoData.workOrderNumber"
                                                    :key="index"
                                                    :value="value.name"
                                                    v-text="value.name"
                                                    >
                                                  </option>
                                              </select>
                                            </td>
                                            <th style="width:14%">检验方式</th>
                                            <td  style="width:19%" v-text= "basicInfoData.quality_pqc_checkWay">
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">设备编号</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.devices_control_devices_number"
                                                @focus = "selectDevices()"
                                              >
                                            </td>
                                            <th style="width:14%">班次</th>
                                            <td class="table-input-td" style="width:19%">
                                                <select
                                                  class="form-control table-input input-sm"
                                                  v-model.trim="basicInfoData.role_class_id"
                                                  v-bind:value="basicInfoData.role_class_name"
                                                >
                                                    <option disabled value="">请选择</option>
                                                      <option
                                                        v-show="classList.length"
                                                        v-for="(value, index) in classList"
                                                        :key="index"
                                                        v-bind:value="value.role_class_id"
                                                        v-text = "value.role_class_name"
                                                      >
                                                    </option>
                                                </select>
                                            </td>
                                            <th style="width:14%">操作员</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.quality_pqc_operation"
                                                @focus = "selectStaff()"
                                              >
                                            </td>
                                          </tr>
                                          <!--
                                          <tr>
                                            <th style="width:14%">半成品名称</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.semi_finish_name"
                                                @focus = "selectSemiFinish()"
                                              >
                                            </td>
                                            <th style="width:14%">半成品型号</th>
                                            <td  style="width:19%"  v-text="basicInfoData.semi_finish_genre">
                                            </td>
                                            <th style="width:14%">半成品单位</th>
                                            <td  style="width:19%"  v-text="basicInfoData.semi_finish_unit">
                                            </td>
                                          </tr>
                                          -->
                                          <tr>
                                            <th style="width:14%">检查数量</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="number"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.semi_finish_number"
                                                @blur="calculate()"
                                                min="0"
                                              >
                                            </td>
                                            <th style="width:14%">良品数</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="number"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.semi_finish_good_number"
                                                @blur="calculate()"
                                                min="0"
                                              >
                                            </td>
                                            <th style="width:14%">良品率</th>
                                            <td  style="width:19%" v-text ="basicInfoData.semi_finish_good_rate">
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">检查员</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.quality_pqc_check"
                                                @focus = "selectStaff2()"
                                              >
                                            </td>
                                            <th style="width:14%">检验日期</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                @blur="basicInfoData.quality_pqc_check_date = $event.target.value"
                                                v-bind:value="basicInfoData.quality_pqc_check_date | times"
                                              >
                                            </td>
                                            <th style="width:14%">完成状态</th>
                                            <td class="table-input-td" style="width:19%">
                                                <select
                                                  class="form-control table-input input-sm"
                                                  v-model.trim="basicInfoData.quality_pqc_report_complete"
                                                  v-bind:value="basicInfoData.quality_pqc_report_complete"
                                                >
                                                    <option disabled value="">请选择</option>
                                                    <option  value="0">已完成</option>
                                                    <option  value="1">未完成</option>
                                                </select>
                                            </td>
                                          </tr>
                                          <tr>
                                            <th style="width:14%">审核人</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.quality_pqc_examine"
                                                @focus = "selectStaff3()"
                                              >
                                            </td>
                                            <th style="width:14%">审核日期</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                @blur="basicInfoData.quality_pqc_examine_date = $event.target.value"
                                                v-bind:value="basicInfoData.quality_pqc_examine_date | times"
                                                >
                                            </td>
                                            <th style="width:14%">综合判定</th>
                                            <td class="table-input-td" style="width:19%">
                                                <select
                                                  class="form-control table-input input-sm"
                                                  v-model.trim="basicInfoData.quality_pqc_comprehensive_result"
                                                  v-bind:value="basicInfoData.quality_pqc_comprehensive_result"
                                                >
                                                    <option disabled value=null>未选择</option>
                                                    <option  value="0">合格</option>
                                                    <option  value="1">不合格</option>
                                                </select>
                                            </td>
                                            <tr>
                                            <th style="width:14%">半成品名称</th>
                                            <td class="table-input-td" style="width:19%">
                                              <input type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="basicInfoData.semi_finish_name"
                                                @focus = "selectSemiFinish()"
                                              >
                                            </td>
                                            <th style="width:14%">备注</th>
                                            <td class="table-input-td" colspan="3" style="width:86%">
                                              <input type="text"
                                              class="table-input"
                                              placeholder="请输入"
                                              autocomplete="on"
                                              v-model.trim="basicInfoData.quality_pqc_remarks"
                                              maxlength="50"
                                              >
                                            </td>
                                            </tr>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                  </div>
                                  <!--环境条件-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_1">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">环境条件</h5>
                                              </div>
                                              <div class="col-xs-8">
                                                  <form class="form-inline pull-right" onsubmit="return false;" v-if="type === '新增检测方案'">
                                                    <button class="btn btn-primary btn-sm" @click.stop = "addEnvironmentData()">增加参数</button>
                                                  </form>
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:25%">参数名称</th>
                                                <th style="width:25%">标准</th>
                                                <th style="width:25%">实测记录</th>
                                                <th style="width:25%">判定</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="environmentData.length"
                                                v-for="(value, index) in environmentData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td>{{value.standard1 ? value.standard1.quality_pqc_project_criterion : ''}}
                                                </td>
                                                <td v-text="value.record1.quality_pqc_project_criterion_value" v-if="type === '品质报告详情' ">
                                                </td>
                                                <td v-if="type === '品质报告详情' ">
                                                    <select class="form-control table-input input-sm" disabled>
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.record1.quality_pqc_project_criterion_value"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <select class="form-control table-input input-sm">
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                              </tr>
                                              <tr v-show="!environmentData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                  <!--来料确认-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_2">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">来料确认</h5>
                                              </div>
                                              <div class="col-xs-8">

                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                            <table class="table table-bordered table-condensed table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:15%">物料名称</th>
                                                  <th style="width:70%">参数</th>
                                                  <th style="width:15%">详情</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr
                                                  v-show="materialsData.length"
                                                  v-for="(value, index) in materialsData"
                                                  :key="index"
                                                >
                                                <td  v-text="value.item.warehouse_material_name">
                                                </td>
                                                  <td v-text="value.standard1" >
                                                  </td>
                                                  <td class="table-input-td">
                                                    <a
                                                      class="table-link"
                                                      href="javascript:;"
                                                      @click = "materiaParamlDetail(value,index)"
                                                    >
                                                    <i class="fa fa-tasks fa-fw"></i>查看</a>
                                                  </td>
                                                </tr>
                                                <tr v-show="!materialsData.length">
                                                  <td colspan=15 class="text-center text-warning">
                                                  没有可以显示的数据
                                                  </td>
                                                </tr>

                                              </tbody>
                                            </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                  <!--半成品参数-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_3">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">半成品参数</h5>
                                              </div>
                                              <div class="col-xs-8">
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:12%">参数名称</th>
                                                <th style="width:12%">标准一(单面)</th>
                                                <th style="width:12%">实测一</th>
                                                <th style="width:12%">判定</th>
                                                <th style="width:12%">标准一(单面)</th>
                                                <th style="width:12%">实测二</th>
                                                <th style="width:12%">判定</th>
                                                <th style="width:18%">附加参数</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="semiFinishedData.length"
                                                v-for="(value, index) in semiFinishedData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td  v-text="value.standard1.quality_pqc_project_criterion_one">
                                                </td>
                                                <td   v-text="value.record1.quality_pqc_project_criterion_one_value" v-if="type === '品质报告详情' ">
                                                </td>
                                                <td   v-if="type === '品质报告详情' ">
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.record1.quality_pqc_project_criterion_one_value"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <select class="form-control table-input input-sm">
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                                <td  v-text="value.standard2.quality_pqc_project_criterion_two">
                                                </td>
                                                <td v-text="value.record2.quality_pqc_project_criterion_two_value" v-if="type === '品质报告详情' ">
                                                </td>
                                                <td  v-if="type === '品质报告详情' ">
                                                </td>
                                                <td class="table-input-td" v-if=" type !== '品质报告详情'">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.record2.quality_pqc_project_criterion_two_value"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <select class="form-control table-input input-sm">
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                                <td class="table-input-td">
                                                  <a
                                                    class="table-link"
                                                    href="javascript:;"
                                                    @click = "attachParamDetail(value,index)"
                                                  >
                                                  <i class="fa fa-tasks fa-fw"></i>查看</a>
                                                </td>
                                              </tr>
                                              <tr v-show="!semiFinishedData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                  <!--设备参数-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_4">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">设备参数</h5>
                                              </div>
                                              <div class="col-xs-8">
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:25%">参数名称</th>
                                                <th style="width:25%">标准</th>
                                                <th style="width:25%">实测记录</th>
                                                <th style="width:25%">判定</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="devicesData.length"
                                                v-for="(value, index) in devicesData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td >{{value.standard1 ? value.standard1.quality_pqc_project_criterion : ''}}
                                                </td>
                                                <td   v-text="value.record1.quality_pqc_project_criterion_value" v-if="type === '品质报告详情' ">
                                                </td>
                                                <td   v-if="type === '品质报告详情' ">
                                                  <select class="form-control table-input input-sm" disabled>
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.record1.quality_pqc_project_criterion_value"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <select class="form-control table-input input-sm">
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                              </tr>
                                              <tr v-show="!devicesData.length">
                                                <td colspan=15 class="text-center text-warning">
                                              没有可以显示的数据
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                  <!--其它参数-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_5">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">其它参数</h5>
                                              </div>
                                              <div class="col-xs-8">
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:25%">参数名称</th>
                                                <th style="width:25%">标准</th>
                                                <th style="width:25%">实测记录</th>
                                                <th style="width:25%">判定</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="otherData.length"
                                                v-for="(value, index) in otherData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td >{{value.standard1 ? value.standard1.quality_pqc_project_criterion : ''}}
                                                </td>
                                                <td   v-text="value.record1.quality_pqc_project_criterion_value" v-if="type === '品质报告详情' ">
                                                </td>
                                                <td   v-if="type === '品质报告详情' ">
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.record1.quality_pqc_project_criterion_value"
                                                  >
                                                </td>
                                                <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                                  <select class="form-control table-input input-sm">
                                                    <option value="合格">合格</option>
                                                    <option value="不合格">不合格</option>
                                                  </select>
                                                </td>
                                              </tr>
                                              <tr v-show="!otherData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                  <!--不良内容-->
                                  <div class="panel panel-default">
                                    <el-collapse-item name="ADMModalPanel_6">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">不良内容</h5>
                                              </div>
                                              <div class="col-xs-8">
                                                <form class="form-inline pull-right">
                                                  <button
                                                    type="button"
                                                    class="btn btn-primary btn-sm"
                                                    @click.stop="addBadness()"
                                                    v-if="type !== '品质报告详情' "
                                                  >增加不良内容
                                                  </button>
                                                </form>
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:20%">不良代码</th>
                                                  <!--
                                                <th style="width:15%">不良描述</th>
                                                  -->
                                                <th style="width:20%">抽样数量</th>
                                                <th style="width:20%">不良数量</th>
                                                <th style="width:20%">不良率</th>

                                                <th style="width:20%">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="badnessMOdifyData.length"
                                                v-for="(value, index) in badnessMOdifyData"
                                                :key="index"
                                              >
                                                <td  v-text="value.quality_unqualified_code">
                                                </td>
                                                  <!--
                                                <td   v-text="value.quality_unqualified_detail">
                                                </td>
                                                -->
                                                <td v-text="value.quality_sample_number"> </td>
                                                <td v-text="value.quality_pqc_unqualified_number"> </td>
                                                <td v-text="value.quality_pqc_unqualified_probability + '%' "> </td>
                                                <td> </td>

                                              </tr>
                                              <tr
                                                v-show="badnessAddData.length"
                                                v-for="(value, index) in badnessAddData"
                                                :key="index"
                                              >
                                                <td  v-text="value.quality_unqualified_code">
                                                </td>
                                                <td class="table-input-td" >
                                                  <input type="number"
                                                    class="table-input"
                                                    placeholder="请输入(必填)"
                                                    autocomplete="on"
                                                    @blur="calculate2(value)"
                                                    v-model.trim="value.quality_sample_number"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td" >
                                                  <input type="number"
                                                    class="table-input"
                                                    placeholder="请输入(必填)"
                                                    autocomplete="on"
                                                     @blur="calculate2(value)"
                                                    v-model.trim="value.quality_pqc_unqualified_number"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td v-text="value.quality_pqc_unqualified_probability " >
                                                </td>
                                                <td class="table-input-td">
                                                <a href="javascript:;" class="table-link text-danger" @click="removeBadness(index)"><i class="fa fa-times"></i>移除</a>
                                                </td>

                                              </tr>
                                              <tr v-show="!badnessMOdifyData.length && !badnessAddData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                    </el-collapse-item>
                                  </div>
                                </el-collapse>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer">
                        <div class="row">
                              <div class="col-xs-12 text-center">
                                <button
                                  class="btn btn-primary modal-submit"
                                  @click = "submit()"
                                  v-if="type !== '品质报告详情'"
                                >
                                确认提交</button>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              `
            })
            if (type !== '新增品质报告') {
              modalBodyTableVM.queryFun(modalBodyTableVM.searchData)
            }

          }

          /**
         * @description 报告来料参数详情模态框
         * @param type {String} 模态框类型:新增品质报告,品质报告详情,修改品质报告
         * @param dataList {Array} 传输的数据
         */
          function materialDetailModal(type, resolve, dataList) {
            // console.dir(type)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
                return {
                  type: type,
                  tbodyData: dataList,  //表格数据
                  isDataChange: 0, //判断数据是否改变
                }
              },
              //弹出模态框
              mounted() {
                const modal = document.getElementById('commonModal2')   //模态框
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

                //保存后执行的操作
                save() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.type === '新增品质报告') {
                    modal.modal('hide')
                    resolve(this.tbodyData)  //返回数据
                  } else if (this.type === '修改品质报告') {
                    if (this.isDataChange > 0) {
                      console.dir(this.tbodyData)
                      let materialRecords = [];

                      for (let i = 0, len = this.tbodyData.length; i < len; i++) {
                        let PQCMaterialParameterDO = {  //来料确认-参数（项目）实体类
                          quality_material_confirm_record_id: this.tbodyData[i].quality_project_record.quality_material_confirm_record_id,  //检验项目（参数）id
                          quality_material_confirm_value: this.tbodyData[i].quality_project_record.quality_material_confirm_value //物料或半成品id
                        }
                        materialRecords.push(PQCMaterialParameterDO)
                      }

                      let submitData = {
                        materialRecords: `${JSON.stringify(materialRecords)}`,
                      }
                      let promise = new Promise((resolve, reject) => {
                        const modal = document.getElementById('commonModal2')   //模态框
                        submitFun(modifyPQCMaterialRecordUrl, submitData, modal, resolve)
                      })
                      promise.then((resolveData) => {
                        resolve(this.tbodyData)  //返回数据
                      })

                    } else {
                      this.$message.error(`您未做任何修改`);

                    }
                  }

                },

                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.isDataChange > 0) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                },

              },

              watch: {
                tbodyData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1
                    // 　　　　　　console.log(newValue)
                  },
                  deep: true
                },

              },
              template: `
                <div class="modal fade" id="commonModal2">
                  <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button class="close" @click="closeModal()">
                            <span>
                              <i class="fa fa-close"></i>
                            </span>
                          </button>
                          <h4 class="modal-title">来料参数详情</h4>
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
                                      </div>
                                    </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered  table-hover">
                                        <thead>
                                          <tr>
                                            <th style="width: 30%;">参数名称</th>
                                            <th style="width: 30%;">参数值</th>
                                            <th style="width: 30%;">判定</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr
                                              v-show="tbodyData.length"
                                              v-for="(value, index) in tbodyData"
                                              :key="index"
                                            >
                                            <td  v-text="value.quality_project_name">
                                            </td>
                                            <td
                                             v-text="value.quality_project_record.quality_material_confirm_value"
                                             v-if="type === '品质报告详情'"
                                            >
                                            </td>
                                            <td
                                             v-text="v"
                                             v-if="type === '品质报告详情'"
                                            >
                                            </td>
                                            <td class="table-input-td"  v-if="type !== '品质报告详情'">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  v-model.trim="value.quality_project_record.quality_material_confirm_value"
                                                  maxlength="20"
                                                >
                                            </td>
                                            <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                              <select class="form-control table-input input-sm">
                                                <option value="合格">合格</option>
                                                <option value="不合格">不合格</option>
                                              </select>
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
                                  <div class="panel-footer panel-footer-table text-center">
                                    <button
                                      class="btn btn-primary modal-submit"
                                      @click="save()"
                                      v-if="type !== '品质报告详情'"
                                    >保存
                                    </button>
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
            // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

          }

          /**
         * @description 报告附加参数详情模态框
         * @param type {String} 模态框类型:新增品质报告,品质报告详情,修改品质报告
         * @param dataList {Array} 传输的数据
         */
          function attachParamDetailModal(type, resolve, dataList) {
            // console.dir(dataList)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
                return {
                  type: type,
                  tbodyData: dataList,  //表格数据
                  isDataChange: 0, //判断数据是否改变
                }
              },

              mounted() {
                const modal = document.getElementById('commonModal2')   //模态框
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

                //保存后执行的操作
                save() {
                  if (this.type === '新增品质报告') {
                    const modal = $(document.getElementById('commonModal2'))   //模态框
                    modal.modal('hide')
                    resolve(this.tbodyData)  //返回数据
                  } else if (this.type === '修改品质报告') {
                    if (this.isDataChange > 0) {
                      // console.dir(this.tbodyData)
                      let attachRecords = [];

                      for (let i = 0, len = this.tbodyData.length; i < len; i++) {
                        let PQCProjectAttachRecordDO = {  //来料确认-参数（项目）实体类
                          quality_pqc_project_attach_record_id: this.tbodyData[i].quality_pqc_project_attach_record.quality_pqc_project_attach_record_id,  //检验项目（参数）id
                          quality_pqc_project_attach_record_value: this.tbodyData[i].quality_pqc_project_attach_record.quality_pqc_project_attach_record_value //物料或半成品id
                        }
                        attachRecords.push(PQCProjectAttachRecordDO)
                      }

                      let submitData = {
                        attachRecords: `${JSON.stringify(attachRecords)}`,
                      }
                      let promise = new Promise((resolve, reject) => {
                        const modal = document.getElementById('commonModal2')   //模态框
                        submitFun(modifyPQCAttachRecordUrl, submitData, modal, resolve)
                      })
                      promise.then((resolveData) => {
                        resolve(this.tbodyData)  //返回数据
                      })

                    } else {
                      this.$message.error(`您未做任何修改`);

                    }
                  }
                },

                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.isDataChange > 0) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                },

              },

              watch: {
                tbodyData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1
                    // 　　　　　　console.log(newValue)
                  },
                  deep: true
                },

              },
              template: `
                <div class="modal fade" id="commonModal2">
                  <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button class="close" @click="closeModal()">
                            <span>
                              <i class="fa fa-close"></i>
                            </span>
                          </button>
                          <h4 class="modal-title">附加参数详情</h4>
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
                                      </div>
                                    </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered  table-hover">
                                        <thead>
                                          <tr>
                                            <th style="width: 30%;">参数名称</th>
                                            <th style="width: 30%;">参数值</th>
                                            <th style="width: 30%;">判定</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr
                                              v-show="tbodyData.length"
                                              v-for="(value, index) in tbodyData"
                                              :key="index"
                                            >
                                            <td v-text = "value.quality_pqc_project_attach_name">
                                            </td>
                                             <td
                                             v-text="value.quality_pqc_project_attach_record.quality_pqc_project_attach_record_value"
                                             v-if="type === '品质报告详情'"
                                            >
                                            </td>
                                             <td
                                             v-text=""
                                             v-if="type === '品质报告详情'"
                                            >
                                            </td>
                                            <td class="table-input-td"  v-if="type !== '品质报告详情'">
                                              <input
                                                type="text"
                                                class="table-input"
                                                placeholder="请输入"
                                                autocomplete="on"
                                                v-model.trim="value.quality_pqc_project_attach_record.quality_pqc_project_attach_record_value"
                                                maxlength="20"
                                              >
                                            </td>
                                            <td class="table-input-td" v-if="type !== '品质报告详情' ">
                                              <select class="form-control table-input input-sm">
                                                <option value="合格">合格</option>
                                                <option value="不合格">不合格</option>
                                              </select>
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
                                  <div class="panel-footer panel-footer-table text-center">
                                    <button
                                      class="btn btn-primary modal-submit"
                                      @click="save()"
                                      v-if="type !== '品质报告详情'"
                                    >保存
                                    </button>
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

        }())
      }
        break;
      case '#processTemplateManage': {	//检测方案管理
        ; (function () {
          const swiper = document.getElementById('processTemplateManage')   //右侧外部swiper

          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' });   //提示框

          //项目类型id,用于PQC根据项目类型查找项目
          var projectTypeId = {
            p1: '5ea45f22245b436abb92e6c185471ada', //环境条件
            p2: 'f53757ccdc894b259c8d656e3b70b953', //来料参数
            p3: '2b7c6f27d7cb4dc88fccf1f711076cdf', //半成品参数
            p4: '8994cdef601041a5b55936aaf92b89bc', //设备参数
            p5: 'ef3643225fbb4afcaa7f0746c6440e09', //其它
          };

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#processTemplateManageInerSwiper',
            data() {
              return {
                searchData: { headNum: 1, type: 'info', templateId: '', templateName: '', methodId: '', craftId: '' },//搜索参数
                tbodyData: [],
                searchDataSelect: '',//下拉选选择的数据
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1,   //当前页

                checkWayList: checkWayList,//检验方式集合
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCTemplateUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.pqcTemplates
                      this.lines = result.map.lines
                    }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                let promise = new Promise((resolve, reject) => {
                  // addModal(resolve)
                  detailAndModifyModal('新增检测方案', '', true, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //详情
              detail(value) {
                let templateId = value.quality_pqc_template_id  //当前行模板id
                detailAndModifyModal('检验方案详情', templateId, false)
              },

              //修改
              modify(value) {
                let templateId = value.quality_pqc_template_id //当前行模板id

                let promise = new Promise((resolve, reject) => {
                  detailAndModifyModal('修改检测方案', templateId, true, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.queryFun(this.searchData) //重新加载数据
                  }
                })
              },

              //删除
              remove(value, index) {

                let submitData = {
                  templateId: value.quality_pqc_template_id,
                  status: 1
                }

                let promise = new Promise((resolve, reject) => {
                  removeFun(modifyPQCTemplateUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.templateName = this.searchDataInput //模板名称
                this.searchData.methodId = this.searchDataSelect  //检验方式
                this.queryFun(this.searchData)
              },

              //监听页面变化实现分页功能
              handleCurrentChange(val) {  //获取当前页
                let headNum = (val - 1) * 10 + 1  //当前页换算为搜索下标
                this.currenPage = val
                this.searchData.headNum = headNum

                this.queryFun(this.searchData)
              }

            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD')
                }
              }
            },

            template: `
              <div class="swiper-slide swiper-no-swiping" id="processTemplateManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a
                              href="javascript:;"
                              class="btn btn-primary btn-sm"
                              @click ="add()">
                              新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm">
                                     <select
                                      class="form-control table-input input-sm"
                                       @change = "search()"
                                      v-model.trim="searchDataSelect"
                                      v-bind:value="searchDataSelect"
                                    >
                                      <option  value="">全部类型</option>
                                      <option
                                        v-show="checkWayList.length"
                                        v-for="(value, index) in checkWayList" :key="index"
                                        v-bind:value="value.quality_check_method_id">{{value.quality_check_method_name}}
                                      </option>
                                    </select>
																	</div>
                                  <div class="input-group input-group-sm ">
                                    <input
                                      class="form-control"
                                      type="text"
                                      @keyup.enter ="search()"
                                      v-model.trim = "searchDataInput"
                                      placeholder="输入关键字" maxlength="25"
                                    >
                                    <div class="input-group-btn">
                                      <a href="javascript:;" class="btn btn-primary btn-sm" @click.stop.prevent ="search()">
                                       <i class="fa fa-search"></i>
                                      </a>
                                    </div>
                                  </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 6%;">序号</th>
                              <th style="width: 15%;">方案名称</th>
                              <th style="width: 15%;">方案编号</th>
                              <th style="width: 10%;">工序</th>
                              <th style="width: 10%;">检验方式</th>
                              <th style="width: 10%;">版本</th>
                              <th style="width: 15%;">创建日期</th>
                              <th style="width: 19%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td v-text="index + 1" >
                              </td>
                              <td v-text="value.quality_pqc_template_name">
                              </td>
                              <td v-text="value.quality_pqc_template_number">
                              </td>
                              <td v-text="value.workstageName">
                              </td>
                              <td v-text="value.modelName">
                              </td>
                              <td v-text="'版本'+value.quality_pqc_template_edittion">
                              </td>
                              <td >
                              {{value.quality_pqc_template_date | times}}
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="detail(value)" href="javascript:;">
                                  <i class="fa fa-tasks fa-fw"></i>详情</a>
                                 <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

          /**
          * @description 新增,详情,修改模态框,
          * @param type {String} 模态框类型和模态框标题,取值为:'新增检测方案','检验方案详情','修改检测方案'
          * @param templateId {Strin} 方案id,详情和修改时要传
          * @param isModify {boolean} 是否是修改,true:表示修改,false:表示详情
          */
          function detailAndModifyModal(type, templateId, isModify, resolve) {

            let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                return {
                  type: type, //模态框类型和模态框标题
                  searchData: { headNum: 1, type: 'detai', templateId: templateId, templateName: '' },//搜索参数

                  basicInfoDataisChange: 0, //判断基础是否改变
                  isDataChange: 0, //判断数据是否改变
                  isModify: isModify, //判断是否为修改
                  isHistoryTyepAdd: false,  //判断是否从历史版本里修改

                  basicInfoData: { //基础信息
                    templateId: '',     //方案id
                    templateName: `${moment().format('YYYYMMDDHHmm')}新建`,     //方案名称
                    templateNumber: `${moment().format('YYYYMMDDHHmmss')}`,   //方案编号
                    checkModelName: '', //检验方式名称
                    checkModelId: '', //检验方式id
                    workstageName: '',  //工序名称
                    workstageId: '',  //工序id
                    versions: '',  //版本
                    createDate: '',  //创建时间
                    pqcRemarks: '',  //备注
                  },
                  environmentData: [],//环境条件
                  materialsData: [],//来料确认
                  semiFinishedData: [],//半成品参数
                  devicesData: [],//设备参数
                  otherData: [],//其它参数

                  // semi_finish_id: '', //半成品id,用于查询对应的半成品参数
                  checkWayList: checkWayList,//检验方式集合,用于生成下拉选

                  activeNames: [  //element-UI折叠面板
                    'detailAndModifyModal_1',
                    'detailAndModifyModal_2',
                    'detailAndModifyModal_3',
                    'detailAndModifyModal_4',
                    'detailAndModifyModal_5',
                  ],

                }
              },
              methods: {
                //加载模板数据
                queryFun(data) {
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCTemplateUrl,
                    data: data,
                    beforeSend: (xml) => {
                      this.loading = true
                    },
                    success: (result, status, xhr) => {
                      this.loading = true
                      if (result.status == 0) {
                        //先清空对应内容的数据
                         this.environmentData = []//环境条件
                         this.materialsData = []//来料确认
                         this.semiFinishedData = []//半成品参数
                         this.devicesData = []//设备参数
                         this.otherData = []//其它参数

                        let pqcTemplate = result.map.pqcTemplate[0] //基础信息,环境条件,半成品参数,设备参数,其它参数
                        let materialConfirms = result.map.materialConfirms  //来料

                        //基础信息
                        // if (this.type !== "新增检测方案") {
                          this.basicInfoData.templateId = pqcTemplate.quality_pqc_template_id //方案id
                          this.basicInfoData.templateName = pqcTemplate.quality_pqc_template_name //方案名称
                          this.basicInfoData.templateNumber = pqcTemplate.quality_pqc_template_number //方案编号
                          this.basicInfoData.checkModelName = pqcTemplate.modelName //检验方式名称
                        this.basicInfoData.checkModelId = pqcTemplate.quality_check_method_id //检验方式id
                          this.basicInfoData.workstageName = pqcTemplate.workstageName //工序名称
                        this.basicInfoData.workstageId = pqcTemplate.workstage_basics_id //工序id
                          this.basicInfoData.pqcRemarks = pqcTemplate.quality_pqc_remarks //备注
                          this.basicInfoData.versions = pqcTemplate.quality_pqc_template_edittion  //版本
                          this.basicInfoData.createDate = pqcTemplate.quality_pqc_template_date  //创建时间
                        // }

                        let qualityProjectTypes = pqcTemplate.qualityProjectTypes //环境条件,品质半成品参数,设备参数,其它参数
                        let standardParameterTypes = pqcTemplate.standardParameterTypes //工艺半成品参数

                        //遍历环境条件,品质半成品参数,设备参数,其它参数,生成渲染页面所需的数据格式
                        for (let i = 0, len = qualityProjectTypes.length; i < len; i++) {
                          if (qualityProjectTypes[i].quality_project_type_name == '环境条件') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: { //项目参数
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name, //参数名称
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject, //类型-项目中间表id
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard,  //标准一
                                standard2: '', //标准二,只有半成品参数有
                                attach: [], //来料参数或附加参数,只有来料和半成品参数有
                              }
                              this.environmentData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '半成品参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: { //项目参数
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name,//参数名称
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject,  //类型-项目中间表id
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard, //标准一
                                standard2: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard, //标准二,只有半成品参数有
                                attach: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs, //来料参数或附加参数,只有来料和半成品参数有
                              }
                              this.semiFinishedData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '设备参数') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: { //项目参数
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name, //参数名称
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject, //类型-项目中间表id
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard, //标准一
                                standard2: '', //标准二,只有半成品参数有
                                attach: [], //来料参数或附加参数,只有来料和半成品参数有
                              }
                              this.devicesData.push(tempObj)
                            }
                          }
                          if (qualityProjectTypes[i].quality_project_type_name == '其它') {
                            for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                              let tempObj = {
                                item: { //项目参数
                                  quality_project_name: qualityProjectTypes[i].qualityProjects[j].quality_project_name, //参数名称
                                  qualityTypeProject: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject, //类型-项目中间表id
                                },
                                standard1: qualityProjectTypes[i].qualityProjects[j].pqcProjectStandard, //标准一
                                standard2: '', //标准二,只有半成品参数有
                                attach: [], //来料参数或附加参数,只有来料和半成品参数有
                              }
                              this.otherData.push(tempObj)
                            }
                          }
                        }

                        //来料确认
                        for (let i = 0, len = materialConfirms.length; i < len; i++) {
                          let tempObj = {
                            item: { //项目参数
                              warehouse_material_name: materialConfirms[i].materialName, //物料名称
                              quality_material_confirm_id: materialConfirms[i].quality_material_confirm_id, //来料确认id
                            },
                            standard1: '',  //来料参数名称按","拼接的字符串
                            standard2: '',  //没有此项
                            attach: [],     //来料参数
                          }
                          let tempStr = '';
                          for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                            //将来料参数名称按","拼接成字符串
                            tempStr += `${materialConfirms[i].qualityProjects[j].quality_project_name},`

                            let tempObj2 = {  //来料参数项目
                              item: {
                                quality_project_name: materialConfirms[i].qualityProjects[j].quality_project_name, //参数名称
                                qualityTypeProject: materialConfirms[i].qualityProjects[j].qualityTypeProject, //类型-项目中间表id
                              }
                            }
                            tempObj.attach.push(tempObj2)
                          }

                          tempObj.standard1 = tempStr
                          this.materialsData.push(tempObj)
                        }
                        //工艺半成品参数
                        for (let j = 0, len = standardParameterTypes[0].standardParameters.length; j < len; j++) {
                          if (standardParameterTypes[0].standard_parameter_type_name == '半成品参数') {
                            let tempObj = {
                              item: { //项目参数
                                quality_project_name: standardParameterTypes[0].standardParameters[j].standard_parameter_name,//参数名称
                                qualityTypeProject: {
                                  quality_project_id: standardParameterTypes[0].standardParameters[j].standard_parameter_id,//参数id
                                  quality_project_type_id: standardParameterTypes[0].standard_parameter_type_id,//参数类型id
                                  quality_type_project_id: '',  //类型-项目中间表id,
                                }
                              },
                              standard1: standardParameterTypes[0].standardParameters[j].pqcProjectStandard, //标准一
                              standard2: standardParameterTypes[0].standardParameters[j].pqcProjectStandard, //标准二,只有半成品参数有
                              attach: standardParameterTypes[0].standardParameters[j].pqcProjectAttachs, //来料参数或附加参数,只有来料和半成品参数有
                            }
                            this.semiFinishedData.push(tempObj)
                          }

                        }

                      }
                      else {
                        this.searchDataInput = ''
                        this.tbodyData = []
                        this.lines = 0
                      }

                    },

                  })
                },
                //选择历史版本,新增时调用
                selectHistoryVersions() {
                  let promise = new Promise((resolve, reject) => {
                    selectPQCWayModal2(resolve)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.searchData.templateId = resolveData.quality_pqc_template_id  //方案id
                    this.queryFun(this.searchData)

                  })
                },
                //选择工序,新增时调用
                selectProcess() {
                  let promise = new Promise((resolve, reject) => {
                    selectProcessModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.workstageName = resolveData.workstage_name //工序名称
                    this.basicInfoData.workstageId = resolveData.workstage_basics_id //工序id

                    if (this.isHistoryTyepAdd) {
                      this.semiFinishedData = []
                    }
                    // this.basicInfoData.templateName = `${this.basicInfoData.workstageName}${moment().format('DDHHmmss')}`
                    //选择完工序获取对应的半成品id
                    // $.ajax({
                    //   type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    //   data: { 'workstageIds[]': this.basicInfoData.workstageId },
                    //   url: queryWorkstageParticularsUrl,
                    //   success: (result, status, xhr) => {
                    //     let workstageList = result.map.workstageList
                    //       // this.semi_finish_id = workstageList.semi_finish_id  //半成品参数id
                    //     this.semi_finish_id = '889c8411671f4314ba47f003bd0f3144' //半成品参数id
                    //   }
                    // })

                  })
                },
                //增加环境条件,新增时调用
                addEnvironmentData() {
                  let promise = new Promise((resolve, reject) => {
                    selectItemModal(resolve, this.environmentData, projectTypeId.p1)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          quality_project_name: resolveData[i].qualityProjects.quality_project_name, //参数名称
                          qualityTypeProject: {
                            quality_project_id: resolveData[i].quality_project_id,
                            quality_project_type_id: resolveData[i].quality_project_type_id,
                            quality_type_project_id: resolveData[i].quality_type_project_id,
                          }, //类型-项目中间表id
                        },
                        standard1: {
                          quality_pqc_project_criterion: '测试标准1',
                          quality_pqc_project_criterion_one: '测试标准1',
                          quality_pqc_project_criterion_two: '',
                        },
                        attach: [],
                      }
                      this.environmentData.push(tempObj)
                    }

                  })

                },
                //移除环境条件,新增时调用
                removeEnvironmentData(index) {
                   arryUnit(this.environmentData,index)
                },
                //增加来料确认,新增时调用
                addMaterialsData() {
                  let promise = new Promise((resolve, reject) => {
                    selectMaterialModal(resolve, this.materialsData)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          warehouse_material_name: resolveData[i].warehouse_material_name, //参数名称
                          warehouse_material_id: resolveData[i].warehouse_material_id, //物料id
                        },
                        standard1: '',
                        standard2: '',
                        attach: [],
                      }
                      this.materialsData.push(tempObj)
                    }
                  })

                },
                //移除来料确认,新增时调用
                removeMaterialsData(index) {
                  arryUnit(this.materialsData, index)
                },
                //来料参数详情,新增时调用
                materiaParamlDetail(value, index) {

                  let promise = new Promise((resolve, reject) => {
                    let dataList = [];
                    // console.dir(value.attach)
                    //防止引用相同遍历到另一个数组
                    for (let i = 0, len = value.attach.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          quality_project_name: value.attach[i].item.quality_project_name, //参数名称
                          qualityTypeProject: {
                            quality_project_id: value.attach[i].item.qualityTypeProject.quality_project_id,
                            quality_project_type_id: value.attach[i].item.qualityTypeProject.quality_project_type_id,
                            quality_type_project_id: value.attach[i].item.qualityTypeProject.quality_type_project_id,
                          }, //类型-项目中间表id
                        },
                      }
                      dataList.push(tempObj)
                    }
                    materialDetailModal(resolve, dataList)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.materialsData[index].standard1 = ''
                    this.materialsData[index].attach = resolveData

                    //将来料参数按","拼成字符串
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let paramName = resolveData[i].item.quality_project_name;
                      this.materialsData[index].standard1 += `${paramName},`
                    }

                  })
                },

                /**
                 * @description 增加半成品参数,新增时调用
                 * @param {String} paramType 区分从哪引入的参数,semi:工艺半成品参数,basic:品质半成品参数
                 */
                addSemiFinishedData(paramType) {
                  if (paramType === 'semi') { //工艺半成品参数
                    let promise = new Promise((resolve, reject) => {
                      selectsemiParamModal(resolve, this.semiFinishedData)
                    })
                    promise.then((resolveData) => {
                      // console.dir(resolveData)
                      for (let i = 0, len = resolveData.length; i < len; i++) {
                        let tempObj = {
                          item: {
                            quality_project_name: resolveData[i].standardParameterList[0].standard_parameter_name, //参数名称
                            qualityTypeProject: {
                              quality_project_id: resolveData[i].standard_parameter_id, //参数id
                              quality_project_type_id: resolveData[i].standard_parameter_type_id,//参数类型id
                              quality_type_project_id: resolveData[i].type_parameter_relation_id, //参数-参数类型关系表id
                            }, //类型-项目中间表id
                          },
                          standard1: {
                            quality_pqc_project_criterion: '测试标准1',
                            quality_pqc_project_criterion_one: '测试标准1',
                            quality_pqc_project_criterion_two: '',
                          },
                          standard2: {
                            quality_pqc_project_criterion: '测试标准1',
                            quality_pqc_project_criterion_one: '测试标准1',
                            quality_pqc_project_criterion_two: '',
                          },
                          attach: [],
                        }
                        this.semiFinishedData.push(tempObj)
                      }
                    })

                  }
                  if (paramType === 'basic') { //品质半成品参数
                    let promise = new Promise((resolve, reject) => {
                      selectItemModal(resolve, this.semiFinishedData, projectTypeId.p3)
                    })

                    promise.then((resolveData) => {
                      // console.dir(resolveData)
                      for (let i = 0, len = resolveData.length; i < len; i++) {
                        let tempObj = {
                          item: {
                            quality_project_name: resolveData[i].qualityProjects.quality_project_name, //参数名称
                            qualityTypeProject: {
                              quality_project_id: resolveData[i].quality_project_id,  //参数id
                              quality_project_type_id: resolveData[i].quality_project_type_id,
                              quality_type_project_id: resolveData[i].quality_type_project_id,
                            }, //类型-项目中间表id
                          },
                          standard1: {
                            quality_pqc_project_criterion: '测试标准1',
                            quality_pqc_project_criterion_one: '测试标准1',
                            quality_pqc_project_criterion_two: '',
                          },
                          standard2: {
                            quality_pqc_project_criterion: '测试标准1',
                            quality_pqc_project_criterion_one: '测试标准1',
                            quality_pqc_project_criterion_two: '',
                          },
                          attach: [],
                        }
                        this.semiFinishedData.push(tempObj)
                      }
                    })
                  }

                },
                //移除半成品参数,新增时调用
                removeSemiFinishedData(index) {
                  arryUnit(this.semiFinishedData, index)
                },
                //附加参数详情
                attachParamDetail(value, index) {
                  if (this.type === "新增检测方案") {
                    let promise = new Promise((resolve, reject) => {
                      let dataList = [];
                      // console.dir(value.attach)
                      //防止引用相同遍历到另一个数组
                      for (let i = 0, len = value.attach.length; i < len; i++) {
                        let tempObj = {
                          quality_pqc_project_attach_id: value.attach[i].quality_pqc_project_attach_id,
                          quality_pqc_project_attach_name: value.attach[i].quality_pqc_project_attach_name,
                        }
                        dataList.push(tempObj)
                      }
                      attachParamDetailModal('新增附加参数', resolve, dataList)
                    })
                    promise.then((resolveData) => {
                      // console.dir(resolveData)
                      this.semiFinishedData[index].attach = resolveData
                    })
                  }
                  if (this.type !== "新增检测方案") {

                    let promise = new Promise((resolve, reject) => {

                      let dataList = [];
                      // console.dir(value.attach)
                      //防止引用相同遍历到另一个数组
                      for (let i = 0, len = value.attach.length; i < len; i++) {
                        let tempObj = {
                          quality_pqc_project_attach_id: value.attach[i].quality_pqc_project_attach_id,
                          quality_pqc_project_attach_name: value.attach[i].quality_pqc_project_attach_name,
                        }
                        dataList.push(tempObj)
                      }

                      if (isModify) {
                        attachParamDetailModal('修改附加参数', resolve, dataList)
                      } else {
                        attachParamDetailModal('附加参数详情', resolve, dataList)
                      }

                    })
                    promise.then((resolveData) => {
                      // console.dir(resolveData)
                      this.semiFinishedData[index].attach = resolveData
                    })
                  }

                },

                //增加设备参数,新增时调用
                addDevicesData() {
                  let promise = new Promise((resolve, reject) => {
                    selectItemModal(resolve, this.devicesData, projectTypeId.p4)
                  })
                  promise.then((resolveData) => {
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          quality_project_name: resolveData[i].qualityProjects.quality_project_name, //参数名称
                          qualityTypeProject: {
                            quality_project_id: resolveData[i].quality_project_id,
                            quality_project_type_id: resolveData[i].quality_project_type_id,
                            quality_type_project_id: resolveData[i].quality_type_project_id,
                          }, //类型-项目中间表id
                        },
                        standard1: {
                          quality_pqc_project_criterion: '测试标准1',
                          quality_pqc_project_criterion_one: '测试标准1',
                          quality_pqc_project_criterion_two: '',
                        },
                        attach: [],
                      }
                      this.devicesData.push(tempObj)
                    }
                  })
                },
                //移除设备参数,新增时调用
                removeDevicesData(index) {
                  arryUnit(this.devicesData, index)
                },
                //增加其它参数,新增时调用
                addOtherData() {
                  let promise = new Promise((resolve, reject) => {
                    selectItemModal(resolve, this.otherData, projectTypeId.p5)
                  })
                  promise.then((resolveData) => {
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          quality_project_name: resolveData[i].qualityProjects.quality_project_name, //参数名称
                          qualityTypeProject: {
                            quality_project_id: resolveData[i].quality_project_id,
                            quality_project_type_id: resolveData[i].quality_project_type_id,
                            quality_type_project_id: resolveData[i].quality_type_project_id,
                          }, //类型-项目中间表id
                        },
                        standard1: {
                          quality_pqc_project_criterion: '测试标准1',
                          quality_pqc_project_criterion_one: '测试标准1',
                          quality_pqc_project_criterion_two: '',
                        },
                        attach: [],
                      }
                      this.otherData.push(tempObj)
                    }
                  })
                },
                //移除其它参数,新增时调用
                removeOtherData(index) {
                  arryUnit(this.otherData, index)
                },

                //提交
                submit() {
                  //新增
                  let templateProjects = [];  //项目
                  let pqcAttachs = [];  //附加参数
                  let pqcStandards = [];  //检验标准
                  let materialConfirms = [];  //来料
                  let materialParameters = [];  //来料参数

                  //修改
                  let pqcProjectStandards = []; //项目检验标准
                  let projectAttachs = [];  //附加参数


                  if (this.basicInfoData.templateName === null || this.basicInfoData.templateName === '') {
                    this.$message.error(`方案名称不能为空`);
                    return;
                  }
                  if (this.basicInfoData.templateNumber === null || this.basicInfoData.templateNumber === '') {
                    this.$message.error(`方案编号不能为空`);
                    return;
                  }
                  // if (this.basicInfoData.checkModelId === null || this.basicInfoData.checkModelId === '') {
                  //   this.$message({
                  //     message: '检验方式未选择',
                  //     type: 'warning'
                  //   });
                  //   return;
                  // }
                  //  if (this.basicInfoData.workstageId === null || this.basicInfoData.workstageId === '') {
                  //   this.$message({
                  //     message: '工序未选择',
                  //     type: 'warning'
                  //   });
                  //   return;
                  // }

                  // console.dir(this.semiFinishedData)

                  //判断是否添加选项
                  if (this.environmentData.length == 0) {
                    this.$message.error(`环境条件选项未添加`);
                    return;
                  } else {
                    //遍历环境条件
                    for (let i = 0, len = this.environmentData.length; i < len; i++) {
                      // 判断项目是否添加标准
                      if (this.environmentData[i].standard1.quality_pqc_project_criterion === null || this.environmentData[i].standard1.quality_pqc_project_criterion === '') {
                        this.$message.error(`环境条件${this.environmentData[i].item.quality_project_name}标准不能为空`);
                        return;
                      }
                      if (this.type === "新增检测方案") {
                        let templateProjectId = this.environmentData[i].item.qualityTypeProject.quality_type_project_id; //参数类型-参数关系表id
                        templateProjects.push(templateProjectId)
                        let PQCProjectStandardDO = {  //标准实体类
                          quality_project_relation_id: templateProjectId, //参数类型-参数关系表id
                          quality_pqc_project_criterion: this.environmentData[i].standard1.quality_pqc_project_criterion  //标准
                        }
                        pqcStandards.push(PQCProjectStandardDO)
                      }
                      if (this.type === "修改检测方案") {
                        let PQCProjectStandardDO = {  //PQC项目检验标准
                          quality_pqc_project_standard_id: this.environmentData[i].standard1.quality_pqc_project_standard_id,  //检验项目标准id
                          quality_pqc_project_criterion: this.environmentData[i].standard1.quality_pqc_project_criterion  //标准
                        }
                        pqcProjectStandards.push(PQCProjectStandardDO)
                      }

                    }
                  }

                  if (this.type === "新增检测方案") {
                    if (this.materialsData.length == 0) {
                      this.$message.error(`来料确认选项未添加`);
                      return;
                    } else {
                      //遍历来料确认
                      for (let i = 0, len = this.materialsData.length; i < len; i++) {
                        if (this.materialsData[i].attach.length == 0) {
                          this.$message.error(`来料确认${this.materialsData[i].item.warehouse_material_name}未添加检测项`);
                          return;
                        }
                        let PQCMaterialConfirmDO = {  //来料确认实体类
                          quality_material_semi_id: this.materialsData[i].item.warehouse_material_id ? this.materialsData[i].item.warehouse_material_id : this.materialsData[i].item.quality_material_confirm_id  //物料或半成品id
                        }
                        materialConfirms.push(PQCMaterialConfirmDO)
                        for (let j = 0, len = this.materialsData[i].attach.length; j < len; j++) {
                          console.log(this.materialsData)
                          let PQCMaterialParameterDO = {  //来料确认-参数（项目）实体类
                            quality_project_parameter_id: this.materialsData[i].attach[j].item.qualityTypeProject.quality_project_id,  //检验项目（参数）id
                            quality_material_semi_id: this.materialsData[i].item.warehouse_material_id ? this.materialsData[i].item.warehouse_material_id : this.materialsData[i].item.quality_material_confirm_id//物料或半成品id
                          }
                          materialParameters.push(PQCMaterialParameterDO)

                        }
                      }

                    }
                  }


                  //半成品参数
                  for (let i = 0, len = this.semiFinishedData.length; i < len; i++) {
                    // 判断项目是否添加标准
                    if (this.semiFinishedData[i].standard1.quality_pqc_project_criterion === null || this.semiFinishedData[i].standard1.quality_pqc_project_criterion === '') {
                      this.$message.error(`半成品参数${this.semiFinishedData[i].item.quality_project_name}标准不能为空`);
                      return;
                    }
                    if (this.type === "新增检测方案") {
                      let templateProjectId = this.semiFinishedData[i].item.qualityTypeProject.quality_type_project_id; //参数类型-参数关系表id
                      templateProjects.push(templateProjectId)
                      let PQCProjectStandardDO = {  //标准实体类
                        quality_project_relation_id: templateProjectId, //参数类型-参数关系表id
                        quality_pqc_project_criterion: this.semiFinishedData[i].standard1.quality_pqc_project_criterion,  //标准
                        quality_pqc_project_criterion_one: this.semiFinishedData[i].standard1.quality_pqc_project_criterion_one,  //标准1
                        quality_pqc_project_criterion_two: this.semiFinishedData[i].standard2.quality_pqc_project_criterion_two,  //标准2
                      }
                      pqcStandards.push(PQCProjectStandardDO)

                      for (let j = 0, len = this.semiFinishedData[i].attach.length; j < len; j++) {
                        // 判断附加参数是否填写名称
                        if (this.semiFinishedData[i].attach[j].quality_pqc_project_attach_name === null || this.semiFinishedData[i].attach[j].quality_pqc_project_attach_name === '') {
                          this.$message.error(`${this.semiFinishedData[i].item.quality_project_name}附加参数名称未填写`);
                          return;
                        }
                        let PQCMaterialParameterDO = {  //项目-器具实体类
                          quality_project_relation_id: templateProjectId,  //参数类型-参数关系表id
                          quality_pqc_project_attach_name: this.semiFinishedData[i].attach[j].quality_pqc_project_attach_name //附加参数名称
                        }
                        pqcAttachs.push(PQCMaterialParameterDO)

                      }
                    }
                    if (this.type === "修改检测方案") {
                      let PQCProjectStandardDO = {  //PQC项目检验标准
                        quality_pqc_project_standard_id: this.semiFinishedData[i].standard1.quality_pqc_project_standard_id,  //检验项目标准id
                        quality_pqc_project_criterion: this.semiFinishedData[i].standard1.quality_pqc_project_criterion,  //标准
                        quality_pqc_project_criterion_one: this.semiFinishedData[i].standard1.quality_pqc_project_criterion_one,  //标准1
                        quality_pqc_project_criterion_two: this.semiFinishedData[i].standard1.quality_pqc_project_criterion_two,  //标准2
                      }
                      pqcProjectStandards.push(PQCProjectStandardDO)
                    }

                  }

                  //遍历设备参数
                  for (let i = 0, len = this.devicesData.length; i < len; i++) {
                    // 判断项目是否添加标准
                    if (this.devicesData[i].standard1.quality_pqc_project_criterion === null || this.devicesData[i].standard1.quality_pqc_project_criterion === '') {
                      this.$message.error(`设备参数${this.devicesData[i].item.quality_project_name}标准不能为空`);
                      return;
                    }
                    if (this.type === "新增检测方案") {
                      let templateProjectId = this.devicesData[i].item.qualityTypeProject.quality_type_project_id; //参数类型-参数关系表id
                      templateProjects.push(templateProjectId)
                      let PQCProjectStandardDO = {  //标准实体类
                        quality_project_relation_id: templateProjectId, //参数类型-参数关系表id
                        quality_pqc_project_criterion: this.devicesData[i].standard1.quality_pqc_project_criterion  //标准
                      }
                      pqcStandards.push(PQCProjectStandardDO)
                    }
                    if (this.type === "修改检测方案") {
                      let PQCProjectStandardDO = {  //PQC项目检验标准
                        quality_pqc_project_standard_id: this.devicesData[i].standard1.quality_pqc_project_standard_id,  //检验项目标准id
                        quality_pqc_project_criterion: this.devicesData[i].standard1.quality_pqc_project_criterion  //标准
                      }
                      pqcProjectStandards.push(PQCProjectStandardDO)
                    }

                  }

                  //遍历其它参数
                  for (let i = 0, len = this.otherData.length; i < len; i++) {

                    if (this.type === "新增检测方案") {
                      let templateProjectId = this.otherData[i].item.qualityTypeProject.quality_type_project_id; //参数类型-参数关系表id
                      templateProjects.push(templateProjectId)
                      let PQCProjectStandardDO = {  //标准实体类
                        quality_project_relation_id: templateProjectId, //参数类型-参数关系表id
                        quality_pqc_project_criterion: this.otherData[i].standard1.quality_pqc_project_criterion  //标准
                      }
                      pqcStandards.push(PQCProjectStandardDO)
                    }
                    if (this.type === "修改检测方案") {
                      let PQCProjectStandardDO = {  //PQC项目检验标准
                        quality_pqc_project_standard_id: this.otherData[i].standard1.quality_pqc_project_standard_id,  //检验项目标准id
                        quality_pqc_project_criterion: this.otherData[i].standard1.quality_pqc_project_criterion  //标准
                      }
                      pqcProjectStandards.push(PQCProjectStandardDO)
                    }

                  }


                  if (this.type === "新增检测方案") {
                    // console.log(templateProjects.toString())
                    // console.log(JSON.stringify(pqcStandards))
                    // console.log(`${JSON.stringify(pqcStandards)}`)
                    // let tempValue = JSON.stringify(pqcStandards)
                    // console.log(typeof (tempValue))

                    let submitData = {
                      templateName: this.basicInfoData.templateName,
                      templateNumber: this.basicInfoData.templateNumber,
                      checkModelId: this.basicInfoData.checkModelId,
                      workstageId: this.basicInfoData.workstageId,
                      pqcRemarks: this.basicInfoData.pqcRemarks,

                      templateProjects: templateProjects.toString(),
                      // templateProjects: JSON.stringify(templateProjects),
                      pqcAttachs: JSON.stringify(pqcAttachs),
                      pqcStandards: JSON.stringify(pqcStandards),
                      materialConfirms: JSON.stringify(materialConfirms),
                      materialParameters: JSON.stringify(materialParameters),

                    }


                    let promise = new Promise((resolve, reject) => {
                      const modal = document.getElementById('commonModal1')   // 模态框
                      submitFun(savePQCTemplateUrl, submitData, modal, resolve)
                    })

                    promise.then((resolveData) => {
                      resolve({
                        resolveData: true
                      })
                    })
                  }
                  else if (this.type === "修改检测方案") {
                    swal({
                      title: '您确定要提交本次操作吗?',
                      text: '请确保填写信息无误后点击确定按钮',
                      type: 'question',
                      allowEscapeKey: false, // 用户按esc键不退出
                      allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                      showCancelButton: true, // 显示用户取消按钮
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                    }).then( () =>{

                      if (this.basicInfoDataisChange > 1) {

                        // 修改模板基础信息
                        let submitData = {
                          templateId: this.basicInfoData.templateId,
                          templateName: this.basicInfoData.templateName,
                          templateNumber: this.basicInfoData.templateNumber,
                          methodId: this.basicInfoData.checkModelName,
                          note: this.basicInfoData.pqcRemarks,
                        }

                        const modal = document.getElementById('commonModal1')   //模态框

                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyPQCTemplateUrl,
                          data: submitData,
                          success: function (result, status, xhr) {
                            if (result.status == 0) {
                              swallSuccess2(modal)  //操作成功
                              panelBodyTableVM.queryFun(panelBodyTableVM.searchData)
                            }
                            else if (result.status === 1) {
                              if (result.msg !== null) {
                                swallFail2(result.msg); //操作失败
                              } else {
                                swallFail();	//操作失败
                              }

                            }
                            else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }
                      if (this.isDataChange > 5) {
                        // console.log(`${JSON.stringify(pqcProjectStandards)}`)
                        // 修改检验标准
                        let submitData2 = {
                          pqcProjectStandards: `${JSON.stringify(pqcProjectStandards)}`,
                        }

                          const modal = document.getElementById('commonModal1')   //模态框

                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyPQCProjectStandardUrl,
                          data: submitData2,
                          success: function (result, status, xhr) {
                            if (result.status == 0) {

                              swallSuccess2(modal)  //操作成功
                              panelBodyTableVM.queryFun(panelBodyTableVM.searchData)
                            }
                            else if (result.status === 1) {
                              if (result.msg !== null) {
                                swallFail2(result.msg); //操作失败
                              } else {
                                swallFail();	//操作失败
                              }

                            }
                            else {
                              swallFail();	//操作失败
                            }
                          }
                        })
                      }

                      if (this.basicInfoDataisChange <= 1 && this.isDataChange <= 1) {
                        this.$message.error(`您未作任何修改`);
                      }
                    })
                  }



                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal1'))   //模态框
                  if (this.isDataChange > 5 || this.basicInfoDataisChange > 1) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },
              mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true     //显示
                })
              },
              filters: {
                //时间戳转日期
                times(val) {
                  if (val !== '' && val !== null) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                  }
                }
              },
              watch: {
                // 是否是从历史版本新增
                isHistoryTyepAdd: {
                  handler(newValue, oldValue) {
                    if (this.isHistoryTyepAdd === false) {
                      this.environmentData = [] //环境条件
                      this.materialsData = [] //来料确认
                      this.semiFinishedData = []  //半成品参数
                      this.devicesData = [] //设备参数
                      this.otherData = [] //其它参数
                    }
                  },
                  deep: true
                },
                // 基础信息改变
                basicInfoData: {
                  handler(newValue, oldValue) {
                    this.basicInfoDataisChange += 1

                  },
                  deep: true
                },
                // 环境条件改变
                environmentData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1

                  },
                  deep: true
                },
                // 来料确认改变
                materialsData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1

                  },
                  deep: true
                },
                // 半成品参数改变
                semiFinishedData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1

                  },
                  deep: true
                },
                // 设备参数改变
                devicesData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1

                  },
                  deep: true
                },
                // 其它参数改变
                otherData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1

                  },
                  deep: true
                },

              },
              template: `
                <div class="modal fade" id="commonModal1">
                    <div class="modal-dialog modal-lg">
                          <div class="modal-content" >
                            <div class="modal-header">
                              <button class="close" @click="closeModal()" >
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                               <h4 class="modal-title"  v-text="type"></h4>
                            </div>
                            <div class="modal-body">
                              <div class="container-fluid">
                                <div class="row">
                                  <div class="col-sm-12">
                                  <!--折叠面板-->
                                  <el-collapse v-model="activeNames">
                                    <!--基础信息-->
                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">基础信息</h5>
                                          </div>
                                          <div class="col-xs-8">
                                             <form
                                              class="form-inline pull-right"
                                              onsubmit="return false;"
                                              v-if="type === '新增检测方案'"
                                             >
                                              <button
                                                class="btn btn-primary btn-sm"
                                                @click = "selectHistoryVersions()"
                                                v-if="isHistoryTyepAdd == true "
                                              >
                                                选择历史方案
                                              </button>
                                              <label class="checkbox-inline">
                                               <input type="checkbox" v-model.trim="isHistoryTyepAdd">
                                                    从历史方案里新增
                                              </label>
                                             </form>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <table class="table table-bordered table-condensed">
                                          <!--新增使用-->
                                          <tbody v-if="type === '新增检测方案'">
                                            <tr>
                                              <th style="width:14%">方案名称</th>
                                              <td class="table-input-td" style="width:19%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.templateName"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <th style="width:14%">方案编号</th>
                                              <td class="table-input-td" style="width:19%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.templateNumber"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <th style="width:14%">检验方式</th>
                                              <td class="table-input-td" style="width:19%">
                                                  <select
                                                    class="form-control table-input input-sm"
                                                    v-model.trim="basicInfoData.checkModelId"
                                                    v-bind:value="basicInfoData.checkModelName"
                                                  >
                                                      <option disabled value="">请选择</option>
                                                        <option
                                                          v-show="checkWayList.length"
                                                          v-for="(value, index) in checkWayList"
                                                          :key="index"
                                                          v-bind:value="value.quality_check_method_id"
                                                          v-text ="value.quality_check_method_name"
                                                        >
                                                      </option>
                                                  </select>
                                              </td>
                                            </tr>

                                            <tr>
                                              <th style="width:14%">工序名</th>
                                              <td class="table-input-td" style="width:19%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.workstageName"
                                                  @focus = "selectProcess()"
                                                >
                                              </td>
                                              <th style="width:14%">备注</th>
                                              <td colspan="3" class="table-input-td" style="width:19%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.pqcRemarks"
                                                  maxlength="50"
                                                >
                                              </td>

                                            </tr>

                                          </tbody>
                                          <!--修改和详情使用-->
                                          <tbody v-if="type !== '新增检测方案'">
                                            <tr>
                                              <th style="width:14%">方案名称</th>
                                              <td
                                                style="width:19%"
                                                v-text="basicInfoData.templateName"
                                                v-if="isModify === false"
                                               >
                                              </td>
                                              <td
                                                class="table-input-td"
                                                style="width:19%"
                                                v-else="isModify === true"
                                              >
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.templateName"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <th style="width:14%">方案编号</th>
                                              <td
                                                style="width:19%"
                                                v-text="basicInfoData.templateNumber"
                                                v-if="isModify === false"
                                               >
                                              </td>
                                              <td
                                                class="table-input-td"
                                                style="width:19%"
                                                v-else="isModify === true"
                                              >
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.templateNumber"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <th style="width:14%">检验方式</th>
                                              <td
                                                style="width:19%"
                                                v-text="basicInfoData.checkModelName"
                                              >
                                              </td>
                                            </tr>

                                            <tr>
                                              <th style="width:14%">工序名</th>
                                              <td
                                                style="width:19%"
                                                v-text="basicInfoData.workstageName"
                                              >
                                              </td>
                                               <th style="width:14%">创建时间</th>
                                              <td
                                                style="width:19%"
                                              >
                                              {{basicInfoData.createDate | times}}
                                              </td>
                                              <th style="width:14%">版本</th>
                                              <td
                                                style="width:19%"
                                                 v-text="'版本'+basicInfoData.versions"
                                              >
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:14%">备注</th>
                                              <td
                                                colspan="5"
                                                style="width:19%"
                                                v-text="basicInfoData.pqcRemarks"
                                                v-if="isModify === false"
                                               >
                                              </td>
                                              <td
                                                colspan="5"
                                                class="table-input-td"
                                                style="width:19%"
                                                v-else="isModify === true"
                                              >
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.pqcRemarks"
                                                  maxlength="50"
                                                >
                                              </td>

                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                    </div>
                                    <!--环境条件-->
                                    <div class="panel panel-default">
                                      <el-collapse-item name="detailAndModifyModal_1">
                                          <template slot="title">
                                              <div class="panel-heading panel-heading-table">
                                                <div class="row">
                                                  <div class="col-xs-4">
                                                    <h5 class="panel-title">环境条件</h5>
                                                  </div>
                                                  <div class="col-xs-8">
                                                    <form class="form-inline pull-right" onsubmit="return false;" v-if="type === '新增检测方案'">
                                                      <button class="btn btn-primary btn-sm" @click.stop = "addEnvironmentData()" >增加参数</button>
                                                    </form>
                                                  </div>
                                                </div>
                                              </div>
                                          </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:40%">参数名称</th>
                                                <th style="width:40%">标准</th>
                                                <th style="width:20%" v-if="type === '新增检测方案'">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="environmentData.length"
                                                v-for="(value, index) in environmentData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td
                                                v-text="value.standard1.quality_pqc_project_criterion"
                                                v-if="isModify === false"
                                                >
                                                </td>
                                                <td class="table-input-td"  v-else="isModify === true">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入(必填)"
                                                    autocomplete="on"
                                                    v-model.trim="value.standard1.quality_pqc_project_criterion"
                                                    maxlength="20"
                                                >
                                                </td>
                                                <td class="table-input-td" v-if="type === '新增检测方案'">
                                                  <a
                                                    class="table-link text-danger"
                                                    href="javascript:;"
                                                    @click = "removeEnvironmentData(index)"
                                                  >
                                                    <i class="fa fa-times"></i>移除</a>
                                                </td>
                                              </tr>
                                              <tr v-show="!environmentData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                {{type==='新增检测方案'?'待加(必选项)......':'没有可以显示的数据'}}
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                      </el-collapse-item>
                                    </div>
                                    <!--来料确认-->
                                    <div class="panel panel-default">
                                      <el-collapse-item name="detailAndModifyModal_2">
                                        <template slot="title">
                                          <div class="panel-heading panel-heading-table">
                                            <div class="row">
                                              <div class="col-xs-4">
                                                <h5 class="panel-title">来料确认</h5>
                                              </div>
                                              <div class="col-xs-8">
                                                <form class="form-inline pull-right"
                                                  onsubmit="return false;"
                                                  v-if="type === '新增检测方案'"
                                                >
                                                  <button class="btn btn-primary btn-sm" @click.stop = "addMaterialsData()">增加物料</button>
                                                </form>
                                              </div>
                                            </div>
                                          </div>
                                        </template>
                                        <div>
                                            <table class="table table-bordered table-condensed table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:15%">物料名称</th>
                                                  <th style="width:45%">参数</th>
                                                  <th style="width:30%" v-if="type === '新增检测方案'">来料参数</th>
                                                  <th style="width:10%" v-if="type === '新增检测方案'">操作</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr
                                                  v-show="materialsData.length"
                                                  v-for="(value, index) in materialsData"
                                                  :key="index"
                                                >
                                                <td  v-text="value.item.warehouse_material_name">
                                                </td>
                                                  <td v-text="value.standard1 === '' ? '未添加': value.standard1" >
                                                  </td>
                                                  <td class="table-input-td" v-if="type === '新增检测方案'">
                                                    <a
                                                      class="table-link"
                                                      href="javascript:;"
                                                      @click = "materiaParamlDetail(value,index)"
                                                    >
                                                    <i class="fa fa-tasks fa-fw"></i>来料参数</a>
                                                  </td>
                                                  <td class="table-input-td" v-if="type === '新增检测方案'">
                                                    <a
                                                      class="table-link text-danger"
                                                      href="javascript:;"
                                                      @click = "removeMaterialsData(index)"
                                                    >
                                                      <i class="fa fa-times"></i>移除</a>
                                                  </td>
                                                </tr>
                                                <tr v-show="!materialsData.length">
                                                  <td colspan=15 class="text-center text-warning">
                                                  {{type==='新增检测方案'?'待加(必选项)......':'没有可以显示的数据'}}
                                                  </td>
                                                </tr>

                                              </tbody>
                                            </table>
                                        </div>
                                      </el-collapse-item>
                                    </div>
                                    <!--半成品参数-->
                                    <div class="panel panel-default">
                                      <el-collapse-item name="detailAndModifyModal_3">
                                          <template slot="title">
                                            <div class="panel-heading panel-heading-table">
                                              <div class="row">
                                                <div class="col-xs-4">
                                                  <h5 class="panel-title">半成品参数</h5>
                                                </div>
                                                <div class="col-xs-8">
                                                  <form class="form-inline pull-right" onsubmit="return false;" v-if="type === '新增检测方案'">
                                                    <button class="btn btn-primary btn-sm" @click.stop = "addSemiFinishedData('semi')" v-if="basicInfoData.workstageId !== '' ">工艺半成品参数</button>
                                                    <button class="btn btn-primary btn-sm" @click.stop = "addSemiFinishedData('basic')">品质半成品参数</button>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </template>
                                        <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:20%">参数名称</th>
                                                <th style="width:20%">标准一(单面)</th>
                                                <th style="width:20%">标准二(双面)</th>
                                                <th style="width:20%">附加参数</th>
                                                <th style="width:20%" v-if="type === '新增检测方案'">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="semiFinishedData.length"
                                                v-for="(value, index) in semiFinishedData"
                                                :key="index"
                                              >
                                                <td  v-text="value.item.quality_project_name">
                                                </td>
                                                <td
                                                v-text="value.standard1.quality_pqc_project_criterion_one"
                                                v-if="isModify === false"
                                                >
                                                </td>
                                                <td class="table-input-td" v-else="isModify === true">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入(必填)"
                                                    autocomplete="on"
                                                    v-model.trim="value.standard1.quality_pqc_project_criterion_one"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td
                                                v-text="value.standard1.quality_pqc_project_criterion_two"
                                                v-if="isModify === false"
                                                >
                                                </td>
                                                <td class="table-input-td" v-else="isModify === true">
                                                  <input type="text"
                                                    class="table-input"
                                                    placeholder="请输入(选填)"
                                                    autocomplete="on"
                                                    v-model.trim="value.standard2.quality_pqc_project_criterion_two"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td class="table-input-td">
                                                  <a
                                                    class="table-link"
                                                    href="javascript:;"
                                                    @click = "attachParamDetail(value,index)"
                                                  >
                                                    <i class="fa fa-tasks fa-fw"></i>附加参数
                                                  </a>
                                                </td>
                                                <td class="table-input-td" v-if="type === '新增检测方案'">
                                                  <a
                                                    class="table-link text-danger"
                                                    href="javascript:;"
                                                    @click = "removeSemiFinishedData(index)"
                                                  >
                                                    <i class="fa fa-times"></i>移除</a>
                                                </td>
                                              </tr>
                                              <tr v-show="!semiFinishedData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                {{type==='新增检测方案'?'待加(必选项)......':'没有可以显示的数据'}}
                                                </td>
                                              </tr>

                                            </tbody>
                                          </table>
                                        </div>
                                      </el-collapse-item>
                                    </div>
                                    <!--设备参数-->
                                    <div class="panel panel-default">
                                      <el-collapse-item name="detailAndModifyModal_4">
                                          <template slot="title">
                                            <div class="panel-heading panel-heading-table">
                                              <div class="row">
                                                <div class="col-xs-4">
                                                  <h5 class="panel-title">设备参数</h5>
                                                </div>
                                                <div class="col-xs-8">
                                                  <form class="form-inline pull-right" onsubmit="return false;" v-if="type === '新增检测方案'">
                                                    <button class="btn btn-primary btn-sm" @click.stop = "addDevicesData()">增加参数</button>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </template>
                                          <div>
                                            <table class="table table-bordered table-condensed table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:40%">参数名称</th>
                                                  <th style="width:40%">标准</th>
                                                  <th style="width:20%" v-if="type === '新增检测方案'">操作</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr
                                                  v-show="devicesData.length"
                                                  v-for="(value, index) in devicesData"
                                                  :key="index"
                                                >
                                                  <td  v-text="value.item.quality_project_name">
                                                  </td>
                                                  <td
                                                  v-text="value.standard1.quality_pqc_project_criterion"
                                                  v-if="isModify === false"
                                                  >
                                                  </td>
                                                  <td class="table-input-td" v-else="isModify === true">
                                                    <input type="text"
                                                      class="table-input"
                                                      placeholder="请输入"
                                                      autocomplete="on"
                                                      v-model.trim="value.standard1.quality_pqc_project_criterion"
                                                      maxlength="20"
                                                    >
                                                  </td>
                                                  <td class="table-input-td" v-if="type === '新增检测方案'">
                                                    <a
                                                      class="table-link text-danger"
                                                      href="javascript:;"
                                                      @click = "removeDevicesData(index)"
                                                    >
                                                      <i class="fa fa-times"></i>移除</a>
                                                  </td>
                                                </tr>
                                                <tr v-show="!devicesData.length">
                                                  <td colspan=15 class="text-center text-warning">
                                                  {{type==='新增检测方案'?'待加(可选项)......':'没有可以显示的数据'}}
                                                  </td>
                                                </tr>

                                              </tbody>
                                            </table>
                                          </div>
                                      </el-collapse-item>
                                    </div>
                                    <!--其它参数-->
                                    <div class="panel panel-default">
                                      <el-collapse-item name="detailAndModifyModal_5">
                                          <template slot="title">
                                            <div class="panel-heading panel-heading-table">
                                              <div class="row">
                                                <div class="col-xs-4">
                                                  <h5 class="panel-title">其它参数</h5>
                                                </div>
                                                <div class="col-xs-8">
                                                  <form class="form-inline pull-right" onsubmit="return false;" v-if="type === '新增检测方案'">
                                                    <button class="btn btn-primary btn-sm" @click.stop = "addOtherData()">增加参数</button>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </template>
                                          <div>
                                            <table class="table table-bordered table-condensed table-hover">
                                              <thead>
                                                <tr>
                                                  <th style="width:40%">参数名称</th>
                                                  <th style="width:40%">标准</th>
                                                  <th style="width:20%" v-if="type === '新增检测方案'">操作</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr
                                                  v-show="otherData.length"
                                                  v-for="(value, index) in otherData"
                                                  :key="index"
                                                >
                                                  <td  v-text="value.item.quality_project_name">
                                                  </td>
                                                  <td
                                                  v-text="value.standard1.quality_pqc_project_criterion"
                                                  v-if="isModify === false"
                                                  >
                                                  </td>
                                                  <td class="table-input-td" v-else="isModify === true">
                                                    <input type="text"
                                                      class="table-input"
                                                      placeholder="请输入"
                                                      autocomplete="on"
                                                      v-model.trim="value.standard1.quality_pqc_project_criterion"
                                                      maxlength="20"
                                                    >
                                                  </td>
                                                  <td class="table-input-td" v-if="type === '新增检测方案'">
                                                    <a
                                                      class="table-link text-danger"
                                                      href="javascript:;"
                                                      @click = "removeOtherData(index)"
                                                    >
                                                      <i class="fa fa-times"></i>移除</a>
                                                  </td>
                                                </tr>
                                                <tr v-show="!otherData.length">
                                                  <td colspan=15 class="text-center text-warning">
                                                  {{type==='新增检测方案'?'待加(可选项)......':'没有可以显示的数据'}}
                                                  </td>
                                                </tr>

                                              </tbody>
                                            </table>
                                          </div>
                                      </el-collapse-item>
                                    </div>
                                  </el-collapse>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="modal-footer">
                            <div class="row">
                                  <div class="col-xs-12 text-center">
                                    <button
                                      class="btn btn-primary modal-submit"
                                      @click = "submit()"
                                      v-if="type !== '检验方案详情'"
                                    >确认提交
                                    </button>
                                  </div>
                              </div>
                            </div>
                          </div>
                    </div>
                </div>
              `
            })
            if (type !== "新增检测方案") {
              modalBodyTableVM.queryFun(modalBodyTableVM.searchData)
            }

          }

          /**
          * @description 来料参数详情模态框(新增调用)
          * @param dataList {Array} 传输的数据
          */
          function materialDetailModal(resolve, dataList) {
            // console.dir(dataList)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
                return {
                  tbodyData: dataList,  //表格数据
                  isDataChange: false, //判断数据是否改变
                }
              },
              //弹出模态框
              mounted() {
                const modal = document.getElementById('commonModal2')   //模态框
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

                //增加来料参数
                addMaterialsParam() {
                  let promise = new Promise((resolve, reject) => {
                    selectItemModal(resolve, this.tbodyData, projectTypeId.p2)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    for (let i = 0, len = resolveData.length; i < len; i++) {
                      let tempObj = {
                        item: {
                          quality_project_name: resolveData[i].qualityProjects.quality_project_name, //参数名称
                          qualityTypeProject: {
                            quality_project_id: resolveData[i].quality_project_id,
                            quality_project_type_id: resolveData[i].quality_project_type_id,
                            quality_type_project_id: resolveData[i].quality_type_project_id,
                          }, //类型-项目中间表id
                        },
                      }
                      this.tbodyData.push(tempObj)
                    }
                  })

                },
                //移除来料参数
                removeMaterialsParam(index) {
                  arryUnit(this.tbodyData, index)
                },

                //保存后执行的操作
                save() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  modal.modal('hide')
                  resolve(this.tbodyData)  //返回数据
                },

                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.isDataChange) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                },

              },

              watch: {
                tbodyData: {
                  handler(newValue, oldValue) {
                    this.isDataChange = true
                    // 　　　　　　console.log(newValue)
                  },
                  deep: true
                },


              },
              template: `
                <div class="modal fade" id="commonModal2">
                  <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button class="close" @click="closeModal()">
                            <span>
                              <i class="fa fa-close"></i>
                            </span>
                          </button>
                          <h4 class="modal-title">来料参数详情</h4>
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
                                            <button class="btn btn-primary btn-sm" @click = "addMaterialsParam()">增加参数</button>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered table-hover">
                                        <thead>
                                          <tr>
                                            <th style="width: 30%;">参数名称</th>
                                            <th style="width: 30%;">操作</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr
                                              v-show="tbodyData.length"
                                              v-for="(value, index) in tbodyData"
                                              :key="index"
                                            >
                                            <td  v-text="value.item.quality_project_name">
                                            </td>

                                            <td class="table-input-td">
                                              <a
                                                class="table-link text-danger"
                                                href="javascript:;"
                                                @click = "removeMaterialsParam(index)"
                                              >
                                                <i class="fa fa-times"></i>移除</a>
                                            </td>
                                          </tr>
                                          <tr v-show="!tbodyData.length">
                                            <td colspan=15 class="text-center text-warning">
                                            待加......
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                  </div>
                                  <div class="panel-footer panel-footer-table text-center">
                                    <button class="btn btn-primary modal-submit" @click="save()">保存</button>
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
            // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

          }

          /**
          * @description 附加参数详情模态框(根据type区分新增,修改,详情)
          * @param type {Strin} "新增附加参数","修改附加参数","附加参数详情"
          * @param dataList {Array} 传输的数据
          */
          function attachParamDetailModal(type, resolve, dataList) {
            // console.dir(dataList)

            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
                return {
                  type: type,
                  tbodyData: dataList,  //表格数据
                  isDataChange: false, //判断数据是否改变
                }
              },
              //弹出模态框
              mounted() {
                const modal = document.getElementById('commonModal2')   //模态框
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

                //增加附加参数
                addAttachParam() {
                  let tempObj = {
                    quality_pqc_project_attach_id: '',
                    quality_pqc_project_attach_name: '',
                  }
                  this.tbodyData.push(tempObj)
                },
                //移除来料参数
                removeAttachParam(index) {
                  arryUnit(this.tbodyData, index)
                },

                //保存后执行的操作
                save() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  // console.log(this.type == '修改附加参数')
                  if (this.type === '修改附加参数') {
                    let projectAttachs = [];
                    for (let i = 0, len = this.tbodyData.length; i < len; i++) {
                      // 判断附加参数是否填写名称
                      if (this.tbodyData[i].quality_pqc_project_attach_name === null || this.tbodyData[i].quality_pqc_project_attach_name === '') {
                        this.$message.error(`第${i + 1}行附加参数为空`);

                        return;
                      }
                      let PQCProjectAttachDO = {  //附加参数实体类
                        quality_pqc_project_attach_id: this.tbodyData[i].quality_pqc_project_attach_id, //附加参数id
                        quality_pqc_project_attach_name: this.tbodyData[i].quality_pqc_project_attach_name //附加参数id
                      }
                      projectAttachs.push(PQCProjectAttachDO)

                    }
                    let submitData = {
                      projectAttachs: `${JSON.stringify(projectAttachs)}`
                    }
                    let promise = new Promise((resolve, reject) => {
                      submitFun(modifyPQCProjectAttachUrl, submitData, modal, resolve)
                    })
                    promise.then((resolveData) => {
                      resolve(this.tbodyData)  //返回数据
                    })

                  }
                  if (this.type === '新增附加参数') {
                    modal.modal('hide')
                    resolve(this.tbodyData)  //返回数据
                  }

                },

                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.isDataChange) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                },

              },

              watch: {
                tbodyData: {
                  handler(newValue, oldValue) {
                    this.isDataChange = true
                    // 　　　　　　console.log(newValue)
                  },
                  deep: true
                },


              },
              template: `
                    <div class="modal fade" id="commonModal2">
                      <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button class="close" @click="closeModal()">
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                              <h4 class="modal-title" v-text = "type"></h4>
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
                                                <button
                                                  class="btn btn-primary btn-sm"
                                                  @click = "addAttachParam()"
                                                  v-if="type === '新增附加参数'"
                                                >增加参数
                                                </button>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="panel-body-table table-height-10">
                                          <table class="table  table-bordered table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width: 30%;">参数名称</th>
                                                <th style="width: 30%;">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                  v-show="tbodyData.length"
                                                  v-for="(value, index) in tbodyData"
                                                  :key="index"
                                                >
                                                <td class="table-input-td" v-if="type !== '附加参数详情'">
                                                  <input
                                                    type="text"
                                                    class="table-input"
                                                    placeholder="请输入"
                                                    autocomplete="on"
                                                    v-model.trim="value.quality_pqc_project_attach_name"
                                                    maxlength="20"
                                                  >
                                                </td>
                                                <td
                                                  v-if="type === '附加参数详情'"
                                                  v-text = "value.quality_pqc_project_attach_name"
                                                >
                                                </td>
                                                <td class="table-input-td" v-if="type === '新增附加参数'">
                                                  <a
                                                    class="table-link text-danger"
                                                    href="javascript:;"
                                                    @click = "removeAttachParam(index)"
                                                  >
                                                    <i class="fa fa-times"></i>移除</a>
                                                </td>
                                                <td v-if="type !== '新增附加参数'" >
                                                </td>
                                              </tr>
                                              <tr v-show="!tbodyData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                待加......
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                      </div>
                                      <div class="panel-footer panel-footer-table text-center">
                                        <button
                                          class="btn btn-primary modal-submit"
                                          @click="save()"
                                          v-if="type !== '附加参数详情'"
                                        >保存</button>
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
          * @description 选择半成品参数(标准参数中的半成品参数,多选)
          * @param dataList {Array} 传输的数据
          * @param semiFinishId {String} 项目类型id
          */
          function selectsemiParamModal(resolve, dataList) {
            // console.log(dataList)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal3',
              data() {
                return {
                  loading: false,  //loading加载
                  qualityProjectTypeList: qualityProjectTypeList, //类型集合用于生成下拉选
                  searchData: { headNum: 1, type: 'parameterTypeQuery', parameterTypeId: '7c0b2426ca4f4f0ea79143c6a9c5861b' },//搜索参数
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
                    url: queryNormParameterUrl,
                    data: data,
                    beforeSend: (xml) => {
                      this.loading = true
                    },
                    success: (result, status, xhr) => {
                      this.loading = false
                      this.searchDataInput = '' //清空搜索框

                      if (result.status == 0) {
                        let tempList = result.map.resultListTree
                        this.selectData = [] //清空已选择的数据

                        for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                          tempList[i].selected = false  //所有按钮设置为没选择
                          for (let j = 0, len = dataList.length; j < len; j++) {
                            if (dataList[j].item.qualityTypeProject.quality_project_id == tempList[i].standard_parameter_id) {
                              tempList[i].selected = true
                              this.selectData.push(tempList[i]) //存储已选择数据
                            }
                          }
                        }

                        //设置已选择但保存的为已选择
                        for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                          for (let j = 0, len = this.tempChangeList.length; j < len; j++) {
                            if (this.tempChangeList[j].item.quality_project_id == tempList[i].standard_parameter_id) {
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
                                      <div class="col-xs-4">
                                            <h5 class="panel-title">工艺半成品参数</h5>
                                      </div>
                                      <div class="col-xs-8">
                                        <!-- 类型下拉选
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
                                        -->
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
                                            <th style="width: 20%;">参数名称</th>
                                            <th style="width: 20%;">	参数规格</th>
                                            <th style="width: 20%;">	参数规格</th>
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
                                            <td v-text="value.standardParameterList[0].standard_parameter_name">
                                            </td>
                                            <td v-text="value.standardParameterList[0].standard_parameter_specifications">
                                            </td>
                                            <td v-text="value.standardParameterList[0].standard_parameter_describle">
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

        }())
      }
        break;
      case '#processPlanManage': {	//检测计划管理
        ; (function () {
          const swiper = document.getElementById('processPlanManage')   //右侧外部swiper
          let mesloadBox = new MesloadBox(swiper, { warningContent: '没有此类信息，请重新选择或输入' })   //提示框

          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
            el: '#processPlanManageInerSwiper',
            data() {
              return {
                searchData: { headNum: 1, type: 'info', planId: '', planName: '' },//搜索参数
                tbodyData: [],
                searchDataInput: '',//搜索框的数据
                lines: 0,     //总条数
                pagesize: 10,   //页码
                currenPage: 1   //当前页
              }
            },

            methods: {
              //加载数据
              queryFun(data) {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: queryPQCPlanUrl,
                  data: data,
                  beforeSend: (xml) => {
                    mesloadBox.loadingShow()
                  },
                  success: (result, status, xhr) => {
                    mesloadBox.hide()
                    if (result.status == 0) {
                      this.tbodyData = result.map.pqcPlan
                      this.lines = result.map.lines
                    }
                    else {
                      this.searchDataInput = ''
                      this.tbodyData = []
                      this.lines = 0
                    }

                  },

                })
              },

              //新增
              add() {

                let promise = new Promise((resolve, reject) => {
                  addModal('新增PQC检测计划', resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //计划详情
              detail(value) {
                let pqcPlanId = value.quality_pqc_plan_id
                detailAndModifyModal('PQC检测计划详情', pqcPlanId, false)
              },
              //进度详情
              detail2(value) {
                let pqcPlanId = value.quality_pqc_plan_id
                scheduleDetailModal(pqcPlanId)
              },

              //修改
              modify(value) {

                let pqcPlanId = value.quality_pqc_plan_id
                let promise = new Promise((resolve, reject) => {
                  detailAndModifyModal('修改PQC检测计划', pqcPlanId, true, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //成功
                    this.queryFun(this.searchData)    //重新加载数据
                  }
                })

              },

              //删除
              remove(value, index) {
                let submitData = {
                  planId: value.quality_pqc_plan_id,
                  status: 1
                }
                let promise = new Promise((resolve, reject) => {
                  removeFun(modifyPQCPlanUrl, submitData, resolve)
                })
                promise.then((resolveData) => {
                  if (resolveData) {  //修改成功
                    this.tbodyData.splice(index, 1)  //根据下标删除数据
                  }
                })
              },
              // 模糊搜索
              search() {
                this.currenPage = 1
                this.searchData.planName = this.searchDataInput
                this.queryFun(this.searchData)
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
              <div class="swiper-slide swiper-no-swiping" id="processPlanManageInerSwiper">
                <!-- 右侧内部swiper -->
                <div class="row">
                  <div class="col-sm-12">
                    <div class="panel panel-default">
                      <div class="panel-heading panel-heading-table">
                        <div class="row">
                          <div class="col-xs-4">
                             <a href="javascript:;"class="btn btn-primary btn-sm"@click ="add()">新增</a>
                          </div>
                          <div class="col-xs-8">
                            <form class="form-inline pull-right" onsubmit="return false;" >
                                  <div class="input-group input-group-sm ">
                                    <input
                                     type="text"
                                     class="form-control"
                                     @keyup.enter ="search()"
                                     v-model.trim = "searchDataInput"
                                     placeholder="输入关键字"
                                     maxlength="25"
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
                      <div class="panel-body-table table-height-10">
                        <table class="table  table-bordered table-hover">
                          <thead>
                            <tr>
                              <th style="width: 6%;">序号</th>
                              <th style="width: 15%;">计划名称</th>
                              <th style="width: 15%;">计划编号</th>
                              <th style="width: 15%;">批号</th>
                              <th style="width: 8%;">计划进度</th>
                              <th style="width: 8%;">优先级</th>
                              <th style="width: 24%;">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-show="tbodyData.length" v-for="(value, index) in tbodyData" :key="index">
                              <td v-text="index + 1" >
                              </td>
                              <td v-text="value.quality_pqc_plan_name">
                              </td>
                              <td v-text="value.quality_pqc_plan_number">
                              </td>
                              <td v-text="value.quality_pqc_plan_batch">
                              </td>
                              <td >
                              {{value.quality_pqc_plan_schedule}}

                              </td>
                              <td v-text="value.quality_pqc_plan_grade">
                              </td>
                              <td class="table-input-td">
                                <a class="table-link" @click ="detail2(value)" href="javascript:;"> <i class="fa fa-tasks fa-fw"></i>进度</a>
                                <a class="table-link" @click ="detail(value)" href="javascript:;">
                                  <i class="fa fa-tasks fa-fw"></i>详情</a>
                                 <a class="table-link" @click ="modify(value)" href="javascript:;">
                                  <i class="fa fa-pencil-square-o"></i>修改</a>
                                <a class="table-link text-danger" @click ="remove(value,index)" href="javascript:;">
                                  <i class="fa fa-trash-o"></i>删除</a>
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
                    `
          })
          panelBodyTableVM.queryFun(panelBodyTableVM.searchData)

          /**
         * @description 新增PQC检测计划,
         */
          function addModal(type, resolve) {

            let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                return {
                  type: type,  //标题
                  basicInfoData: { //基础信息
                    quality_pqc_plan_name: `${moment().format('YYYYMMDDHHmmss')}新建V1`,  //计划名
                    quality_pqc_plan_number: `${moment().format('YYYYMMDDHHmmss')}`,  //计划编号
                    quality_pqc_plan_batch: '',  //生产批号
                    quality_pqc_plan_schedule: '0%',  //生产进度
                    quality_pqc_plan_grade: '正常',  //优先级
                    // quality_pqc_plan_status: '执行中',  //状态
                    quality_pqc_plan_create: '',  //创建人
                    quality_pqc_plan_createId: '',  //创建人id
                    createDate: '',  //创建日期
                    quality_pqc_plan_examine: '',  //审批人
                    quality_pqc_plan_examineId: '',  //审批人id
                    examineDate: '',  //审批日期
                    startDate: '',  //预开始日期
                    endDate: '',  //预完成日期
                  },
                  processList: [],//工序集合
                  isDataChange: false, //判断数据是否改变
                  checkWayList: checkWayList,//检验方式集合

                }
              },
              methods: {

                //选择创建人
                selectStaff() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.quality_pqc_plan_create = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_plan_createId = resolveData.role_staff_id
                    this.basicInfoData.createDate = moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                },
                //选择审批人
                selectStaff2() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {
                    this.basicInfoData.quality_pqc_plan_examine = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_plan_examineId = resolveData.role_staff_id
                    this.basicInfoData.examineDate = moment().format('YYYY-MM-DD HH:mm:ss')
                  })
                },

                //增加工序
                addProcess() {
                  let promise = new Promise((resolve, reject) => {
                    selectProcessModal2(resolve, this.processList)
                  })
                  promise.then((resolveData) => {
                    this.processList = resolveData
                  })
                },
                //移除工序
                removeProcess(index) {
                  arryUnit(this.processList,index)
                },

                //检验方案详情
                schemeDetai(value, index) {
                  // console.dir(value)

                  let promise = new Promise((resolve, reject) => {
                    let craftId = value.process.workstage_basics_id //工艺id,用于根据工艺id查对应方案
                    let dataList = [];
                    //防止相同的引用,遍历到另一个对象
                    for (let i = 0, len = value.wayList.length; i < len; i++) {
                      let tempObj = {
                        wayMeth: value.wayList[i].wayMeth,  //检验方式
                        checkDate: value.wayList[i].checkDate,//检验日期
                        checkTime: value.wayList[i].checkTime,//检验次数
                        reportRecords: [],  //报告记录
                        materialRecords: [],  //来料参数记录
                        attachRecords: [], //附加参数记录
                      }
                      //遍历附加参数记录
                      for (let j = 0, len = value.wayList[i].attachRecords.length; j < len; j++) {
                        let attachRecordObj = { //附加参数记录实类
                          quality_pqc_project_attach_id: value.wayList[i].attachRecords[j].quality_pqc_project_attach_id,
                          quality_pqc_project_attach_record: value.wayList[i].attachRecords[j].quality_pqc_project_attach_record,
                        }
                        tempObj.attachRecords.push(attachRecordObj)
                      }
                      //遍历来料参数记录
                      for (let j = 0, len = value.wayList[i].materialRecords.length; j < len; j++) {
                        let materialRecordObj = { //来料参数记录实类
                          quality_material_confirm_parameter_id: value.wayList[i].materialRecords[j].quality_material_confirm_parameter_id,
                          quality_project_record: value.wayList[i].materialRecords[j].quality_project_record,
                        }
                        tempObj.materialRecords.push(materialRecordObj)
                      }
                      //遍历检验项记录
                      for (let j = 0, len = value.wayList[i].reportRecords.length; j < len; j++) {
                        let reportRecordObj = { //项目记录实类
                          quality_pqc_project_criterion_one_value: value.wayList[i].reportRecords[j].quality_pqc_project_criterion_one_value,
                          quality_pqc_project_criterion_two_value: value.wayList[i].reportRecords[j].quality_pqc_project_criterion_two_value,
                          quality_pqc_project_criterion_value: value.wayList[i].reportRecords[j].quality_pqc_project_criterion_value,
                          quality_project_relation_id: value.wayList[i].reportRecords[j].quality_project_relation_id,
                        }
                        tempObj.reportRecords.push(reportRecordObj)
                      }

                      dataList.push(tempObj)
                    }
                    // console.dir(dataList)

                    schemeDetailModal(resolve, dataList, craftId)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.processList[index].wayList = resolveData
                    this.processList[index].wayStr = ''
                    for (let i = 0, len = resolveData.length; i < len; i++) { //将检验方式的名称拼成字符串
                      let paramName = resolveData[i].wayMeth.modelName;
                      this.processList[index].wayStr += `${paramName},`
                    }

                  })
                },
                //提交
                submit() {
                  // console.dir(this.processList)
                  let templates = []; //提交给后台的数据集合

                  if (this.basicInfoData.quality_pqc_plan_name === null || this.basicInfoData.quality_pqc_plan_name === '') {
                    this.$message.error(`计划名称不能为空`);
                    return;
                  }
                  if (this.basicInfoData.quality_pqc_plan_number === null || this.basicInfoData.quality_pqc_plan_number === '') {
                    this.$message.error(`计划编号不能为空`);
                    return;
                  }
                  if (this.basicInfoData.startDate === null || this.basicInfoData.startDate === '') {
                    this.$message.error(`预开始日期`);
                    return;
                  }
                  if (this.basicInfoData.endDate === null || this.basicInfoData.endDate === '') {
                    this.$message.error(`预完成日期`);
                    return;
                  }
                  if (this.basicInfoData.quality_pqc_plan_batch === null || this.basicInfoData.quality_pqc_plan_batch === '') {
                    this.$message.error(`生产批号不能为空`);
                    return;
                  }
                  if (this.basicInfoData.quality_pqc_plan_createId === null || this.basicInfoData.quality_pqc_plan_createId === '') {
                    this.$message.error(`创建人不能为空`);
                    return;
                  }

                  if (this.processList.length == 0) {
                    this.$message.error(`未添加工序`);
                    return;
                  } else {
                    for (let i = 0, len = this.processList.length; i < len; i++) {
                      if (this.processList[i].wayList.length == 0) {
                        this.$message.error(`${this.processList[i].process.workstage_name}工序未选择方案`);
                        return;
                      }
                      for (let j = 0, len = this.processList[i].wayList.length; j < len; j++) {

                        // for (let k = 0; k < this.processList[i].wayList[j].checkTime; k++) { //处理次数,每一次对应一个报告

                        // }

                        let PQCTemplateDO = {   //计划-模板实体类
                          quality_pqc_template_id: this.processList[i].wayList[j].wayMeth.quality_pqc_template_id,  //pqc模板id
                          quality_pqc_plan_check_frequency: this.processList[i].wayList[j].checkTime, //检验次数
                          projectAttachRecords: this.processList[i].wayList[j].attachRecords,
                          materialRecords: this.processList[i].wayList[j].materialRecords,
                          reportRecords: this.processList[i].wayList[j].reportRecords,
                        }

                        templates.push(PQCTemplateDO)

                      }
                    }
                  }
                  this.basicInfoData.startDate = moment(this.basicInfoData.startDate).format('YYYY-MM-DD HH:mm:ss')
                  this.basicInfoData.endDate = moment(this.basicInfoData.endDate).format('YYYY-MM-DD HH:mm:ss')
                  this.basicInfoData.examineDate = moment(this.basicInfoData.examineDate).format('YYYY-MM-DD HH:mm:ss')
                  // console.dir(`${JSON.stringify(planTemplates)}`)
                  let submitData = {
                    plans: `${JSON.stringify(this.basicInfoData)}`,
                    templates: `${JSON.stringify(templates)}`,
                  }

                  let promise = new Promise((resolve, reject) => {
                    const modal = document.getElementById('commonModal1')   //模态框
                    submitFun(savePQCPlanUrl, submitData, modal, resolve)
                  })
                  promise.then((resolveData) => {
                    resolve({
                      resolveData: true
                    })
                  })

                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal1'))   //模态框
                  if (this.isDataChange) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },
              mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true     //显示
                })
              },
              watch: {
                basicInfoData: {
                  handler(newValue, oldValue) {
                    this.isDataChange = true
                  },
                  deep: true
                },
                processList: {
                  handler(newValue, oldValue) {
                    this.isDataChange = true
                  },
                  deep: true
                },
              },
              template: `
                <div class="modal fade" id="commonModal1">
                    <div class="modal-dialog modal-lg">
                          <div class="modal-content" >
                            <div class="modal-header">
                              <button class="close" @click = "closeModal()">
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                              <h4 class="modal-title" v-text = "type"></h4>
                            </div>
                            <div class="modal-body">
                              <div class="container-fluid">
                                <div class="row">
                                  <div class="col-sm-12">
                                    <!--基础信息-->
                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">基础信息</h5>
                                          </div>
                                          <div class="col-xs-8">
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <table class="table table-bordered table-condensed ">
                                          <tbody>
                                            <tr>
                                              <th style="width:20%">计划名称</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_name"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <th style="width:20%">计划编号</th>
                                              <td style="width:30%" >{{basicInfoData.quality_pqc_plan_number}}
                                              </td>

                                            </tr>

                                            <tr>
                                              <th style="width:20%">生产批号</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_batch"
                                                >
                                              </td>
                                              <th style="width:20%">计划进度</th>
                                              <td style="width:30%"  v-text="basicInfoData.quality_pqc_plan_schedule">
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">预开始日期</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({minDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.startDate = $event.target.value"
                                                >
                                              </td>
                                              <th style="width:20%">预完成日期</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({minDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.endDate = $event.target.value"
                                                >
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">创建人</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_create"
                                                  @focus = "selectStaff()"
                                                >
                                              </td>
                                              <th style="width:20%">创建日期</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.createDate = $event.target.value"
                                                  v-bind:value = "basicInfoData.createDate"
                                                >
                                              </td>
                                            </tr>
                                             <tr>
                                              <th style="width:20%">审批人</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_examine"
                                                  @focus = "selectStaff2()"
                                                >
                                              </td>
                                              <th style="width:20%">审批日期</th>
                                              <td class="table-input-td" style="width:30%">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.examineDate = $event.target.value"
                                                  v-bind:value = "basicInfoData.examineDate"
                                                >
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">优先级</th>
                                              <td class="table-input-td" style="width:30%">
                                                  <select
                                                    class="form-control table-input input-sm"
                                                    v-model.trim="basicInfoData.quality_pqc_plan_grade"
                                                    v-bind:value="basicInfoData.quality_pqc_plan_grade"
                                                  >
                                                      <option disabled value="">请选择</option>
                                                      <option value = "正常">正常</option>
                                                      <option value = "优先">优先</option>
                                                      <option value = "滞后">滞后</option>

                                                  </select>
                                              </td>
                                              <th style="width:20%"></th>

                                              <td class="table-input-td" style="width:30%">
                                               <!--
                                                  <select
                                                    class="form-control table-input input-sm"
                                                    v-model.trim="basicInfoData.quality_pqc_plan_status"
                                                    v-bind:value="basicInfoData.quality_pqc_plan_status"
                                                  >
                                                      <option disabled value="">请选择</option>
                                                      <option value = "未执行">未执行</option>
                                                      <option value = "执行中">执行中</option>
                                                      <option value = "暂停">暂停</option>
                                                      <option value = "已完成">已完成</option>

                                                  </select>
                                                 -->
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                    </div>
                                    <!--工序-->
                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">工序</h5>
                                          </div>
                                          <div class="col-xs-8">
                                            <form class="form-inline pull-right" onsubmit="return false;">
                                              <button class="btn btn-primary btn-sm" @click = "addProcess()">增加工序</button>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:25%">工序名称</th>
                                                <th style="width:35%">检验方式</th>
                                                <th style="width:15%">检验方案</th>
                                                <th style="width:15%">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="processList.length"
                                                v-for="(value, index) in processList"
                                                :key="index"
                                              >
                                                <td
                                                  v-text ="value.process.workstage_name"
                                                >
                                                </td>
                                                <td v-text="value.wayStr ===''? '未添加':value.wayStr" >
                                                </td>
                                                <td class="table-input-td">
                                                  <a
                                                  class="table-link"
                                                  href="javascript:;"
                                                  @click = "schemeDetai(value,index)"
                                                  >
                                                  <i class="fa fa-tasks fa-fw"></i>查看</a>
                                                </td>
                                                <td class="table-input-td">
                                                  <a
                                                  class="table-link text-danger"
                                                  href="javascript:;"
                                                  @click = "removeProcess(index)"
                                                  >
                                                    <i class="fa fa-times"></i>移除</a>
                                                </td>
                                              </tr>
                                              <tr v-show="!processList.length">
                                                <td colspan=15 class="text-center text-warning">
                                                待加......
                                                </td>
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
                                    <button class="btn btn-primary modal-submit" @click = "submit()">确认提交</button>
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
          * @description 计划详情和修改模态框,
          */
          function detailAndModifyModal(type, pqcPlanId, isModify, resolve) {
            let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                return {
                  type: type,    //标题
                  searchData: { headNum: 1, type: 'template', planId: pqcPlanId, planName: '' },//搜索参数
                  isModify: isModify,
                  basicInfoData: { //基础信息
                    quality_pqc_plan_id: ``,  //计划id
                    quality_pqc_plan_name: ``,  //计划名
                    quality_pqc_plan_number: ``,  //计划编号
                    quality_pqc_plan_batch: '',  //生产批号
                    quality_pqc_plan_schedule: '',  //生产进度
                    quality_pqc_plan_grade: '',  //优先级
                    // quality_pqc_plan_status: '执行中',  //状态
                    quality_pqc_plan_create: '',  //创建人
                    quality_pqc_plan_createId: '',  //创建人id
                    createDate: '',  //创建日期
                    quality_pqc_plan_examine: '',  //审批人
                    quality_pqc_plan_examineId: '',  //审批人id
                    examineDate: '',  //审批日期
                    startDate: '',  //预开始日期
                    endDate: '',  //预完成日期
                  },
                  processList: [],//工序集合
                  isDataChange: 0, //判断数据是否改变
                  checkWayList: checkWayList,//检验方式集合

                }
              },
              methods: {
                //加载数据
                queryFun(data) {
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCPlanUrl,
                    data: data,
                    beforeSend: (xml) => {
                      mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      mesloadBox.hide()
                      if (result.status == 0) {
                        let pqcPlan = result.map.pqcPlan
                        let pqcPlanTemplates = pqcPlan.pqcPlanTemplates

                        this.processList = pqcPlanTemplates

                        this.basicInfoData.quality_pqc_plan_id = pqcPlan.quality_pqc_plan_id
                        this.basicInfoData.quality_pqc_plan_name = pqcPlan.quality_pqc_plan_name
                        this.basicInfoData.quality_pqc_plan_number = pqcPlan.quality_pqc_plan_number
                        this.basicInfoData.quality_pqc_plan_batch = pqcPlan.quality_pqc_plan_batch
                        this.basicInfoData.quality_pqc_plan_schedule = pqcPlan.quality_pqc_plan_schedule
                        this.basicInfoData.quality_pqc_plan_grade = pqcPlan.quality_pqc_plan_grade
                        this.basicInfoData.quality_pqc_plan_create = pqcPlan.quality_pqc_plan_create
                        this.basicInfoData.createDate = pqcPlan.quality_pqc_plan_create_date
                        this.basicInfoData.quality_pqc_plan_examine = pqcPlan.quality_pqc_plan_examine
                        this.basicInfoData.examineDate = pqcPlan.quality_pqc_plan_examine_date
                        this.basicInfoData.startDate = pqcPlan.quality_pqc_plan_start_date
                        this.basicInfoData.endDate = pqcPlan.quality_pqc_plan_end_date

                      }
                      else {
                        this.searchDataInput = ''
                        this.tbodyData = []
                        this.lines = 0
                      }

                    },

                  })
                },

                //选择审批人
                selectStaff2() {
                  let promise = new Promise((resolve, reject) => {
                    selectStaffModal(resolve)
                  })
                  promise.then((resolveData) => {

                    this.basicInfoData.quality_pqc_plan_examine = resolveData.role_staff_name
                    this.basicInfoData.quality_pqc_plan_examineId = resolveData.role_staff_id

                  })
                },

                //提交
                submit() {
                  console.dir(this.processList)
                  let templateIds = [];
                  let planTemplates = [];

                  if (this.basicInfoData.quality_pqc_plan_name === null || this.basicInfoData.quality_pqc_plan_name === '') {
                    this.$message.error(`计划名称不能为空`);

                    return;
                  }
                  if (this.basicInfoData.quality_pqc_plan_number === null || this.basicInfoData.quality_pqc_plan_number === '') {
                    this.$message.error(`计划编号不能为空`);

                    return;
                  }
                  if (this.basicInfoData.startDate === null || this.basicInfoData.startDate === '') {
                    this.$message.error(`预开始日期不能为空`);

                    return;
                  }
                  if (this.basicInfoData.endDate === null || this.basicInfoData.endDate === '') {
                    this.$message.error(`预完成日期不能为空`);

                    return;
                  }
                  if (this.basicInfoData.quality_pqc_plan_batch === null || this.basicInfoData.quality_pqc_plan_batch === '') {
                    this.$message.error(`生产批号不能为空`);

                    return;
                  }


                  let submitData = {
                    planId: this.basicInfoData.quality_pqc_plan_id,
                    planName: this.basicInfoData.quality_pqc_plan_name,
                    // planNumber: this.basicInfoData.quality_pqc_plan_number,
                    planBatch: this.basicInfoData.quality_pqc_plan_batch,
                    startDate: this.basicInfoData.startDate,
                    endDate: this.basicInfoData.endDate,
                    planGrade: this.basicInfoData.quality_pqc_plan_grade,
                    planExamine: this.basicInfoData.quality_pqc_plan_examine,
                    examineDate: this.basicInfoData.examineDate,
                  }

                  let promise = new Promise((resolve, reject) => {
                    const modal = document.getElementById('commonModal1')   //模态框
                    submitFun(modifyPQCPlanUrl, submitData, modal, resolve)
                  })
                  promise.then((resolveData) => {
                    resolve({
                      resolveData: true
                    })
                  })

                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal1'))   //模态框
                  // console.log(this.isDataChange)
                  if (this.isDataChange > 1) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },
              mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true     //显示
                })
              },
              watch: {
                basicInfoData: {
                  handler(newValue, oldValue) {
                    this.isDataChange += 1
                  },
                  deep: true
                },
              },
              filters: {
                //时间戳转日期
                times(val) {
                  if (val !== '' && val !== null) {
                    return moment(val).format('YYYY-MM-DD HH:mm:ss')
                  }
                }
              },
              template: `
                <div class="modal fade" id="commonModal1">
                    <div class="modal-dialog modal-lg">
                          <div class="modal-content" >
                            <div class="modal-header">
                              <button class="close" @click = "closeModal()">
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                              <h4 class="modal-title" v-text = "type"></h4>
                            </div>
                            <div class="modal-body">
                              <div class="container-fluid">
                                <div class="row">
                                  <div class="col-sm-12">
                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">基础信息</h5>
                                          </div>
                                          <div class="col-xs-8">
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <table class="table table-bordered table-condensed">
                                          <tbody>
                                            <tr>
                                              <th style="width:20%">计划名称</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_name"
                                                  maxlength="20"
                                                >
                                              </td>
                                              <td style="width:30%"
                                                v-text="basicInfoData.quality_pqc_plan_name"
                                                v-else = "isModify === false"
                                              >
                                              </td>
                                              <th style="width:20%">计划编号</th>
                                              <td style="width:30%" v-if="isModify === true">{{basicInfoData.quality_pqc_plan_number}}

                                              </td>
                                              <td style="width:30%"
                                                v-text="basicInfoData.quality_pqc_plan_number"
                                                v-else = "isModify === false"
                                              >
                                              </td>
                                            </tr>

                                            <tr>
                                              <th style="width:20%">生产批号</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_batch"
                                                >
                                              </td>
                                              <td style="width:30%"
                                                v-text="basicInfoData.quality_pqc_plan_number"
                                                v-else = "isModify === false"
                                              >
                                              </td>
                                              <th style="width:20%">计划进度</th>
                                              <td style="width:30%"  v-text="basicInfoData.quality_pqc_plan_schedule">
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">预开始日期</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({minDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.startDate = $event.target.value"
                                                  v-bind:value="basicInfoData.startDate | times"
                                                >
                                              </td>
                                              <td  style="width:30%"
                                                v-else = "isModify === false"
                                              >
                                               {{basicInfoData.startDate | times}}
                                              </td>
                                              <th style="width:20%">预完成日期</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                class="table-input"
                                                placeholder="请输入(必填)"
                                                autocomplete="on"
                                                onclick="WdatePicker({minDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                @blur="basicInfoData.endDate = $event.target.value"
                                                v-bind:value="basicInfoData.endDate | times"
                                                >
                                              </td>
                                              <td  style="width:30%"
                                                v-else = "isModify === false"
                                              >
                                              {{basicInfoData.endDate | times}}
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">创建人</th>
                                              <td  style="width:30%"  v-text="basicInfoData.quality_pqc_plan_create">
                                              </td>
                                              <th style="width:20%">创建日期</th>
                                              <td  style="width:30%" >
                                                {{basicInfoData.createDate | times}}
                                              </td>
                                            </tr>
                                             <tr>
                                              <th style="width:20%">审批人</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  v-model.trim="basicInfoData.quality_pqc_plan_examine"
                                                  @focus = "selectStaff2()"
                                                >
                                              </td>
                                              <td style="width:30%"
                                                v-text="basicInfoData.quality_pqc_plan_examine"
                                                v-else = "isModify === false"
                                              >
                                              </td>
                                              <th style="width:20%">审批日期</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                <input type="text"
                                                  class="table-input"
                                                  placeholder="请输入(必填)"
                                                  autocomplete="on"
                                                  onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"
                                                  @blur="basicInfoData.examineDate = $event.target.value"
                                                  v-bind:value = "basicInfoData.examineDate | times"
                                                >
                                              </td>
                                              <td style="width:30%"
                                                v-else = "isModify === false"
                                              >
                                              {{basicInfoData.examineDate | times}}
                                              </td>
                                            </tr>
                                            <tr>
                                              <th style="width:20%">优先级</th>
                                              <td class="table-input-td" style="width:30%" v-if="isModify === true">
                                                  <select
                                                    class="form-control table-input input-sm"
                                                    v-model.trim="basicInfoData.quality_pqc_plan_grade"
                                                    v-bind:value="basicInfoData.quality_pqc_plan_grade"
                                                  >
                                                      <option disabled value="">请选择</option>
                                                      <option value = "正常">正常</option>
                                                      <option value = "优先">优先</option>
                                                      <option value = "滞后">滞后</option>

                                                  </select>
                                              </td>
                                              <td style="width:30%"
                                                v-text="basicInfoData.quality_pqc_plan_grade"
                                                v-else = "isModify === false"
                                              >
                                              </td>
                                              <th style="width:20%"></th>
                                              <td style="width:30%">
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>

                                    </div>

                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">方案详情</h5>
                                          </div>
                                          <div class="col-xs-8">

                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:25%">工序名称</th>
                                                <th style="width:25%">检验方式</th>
                                                <th style="width:25%">检验方案</th>
                                                <th style="width:25%">检验次数</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="processList.length"
                                                v-for="(value, index) in processList"
                                                :key="index"
                                              >
                                                <td v-text ="value.pqcTemplate.quality_pqc_template_name" >
                                                </td>
                                                <td v-text="value.pqcTemplate.quality_pqc_template_name" >
                                                </td>
                                                <td v-text="value.pqcTemplate.quality_pqc_template_name" >
                                                </td>
                                                <td v-text="value.quality_pqc_plan_check_frequency" >
                                                </td>

                                              </tr>
                                              <tr v-show="!processList.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
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
                                    <button
                                      class="btn btn-primary modal-submit"
                                      @click = "submit()"
                                      v-if="isModify === true"
                                      >确认提交
                                    </button>
                                  </div>
                              </div>
                            </div>
                          </div>
                    </div>
                </div>
              `
            })
            modalBodyTableVM.queryFun(modalBodyTableVM.searchData)
          }

          /**
          * @description 进度详情模态框,
          */
          function scheduleDetailModal(pqcPlanId) {
            let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                return {
                  searchData: { headNum: 1, type: 'report', planId: pqcPlanId, planName: '' },//搜索参数
                  tbodyData: [],//工序集合
                  percentage: 0 //进度占比
                }
              },
              methods: {
                //加载数据
                queryFun(data) {
                  $.ajax({
                    type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                    url: queryPQCPlanUrl,
                    data: data,
                    beforeSend: (xml) => {
                      mesloadBox.loadingShow()
                    },
                    success: (result, status, xhr) => {
                      mesloadBox.hide()
                      if (result.status == 0) {
                        let pqcPlan = result.map.pqcPlan  //计划
                        let pqcReports = pqcPlan.pqcReports //报告
                        this.tbodyData = pqcReports

                        let denominator = pqcReports.length;
                        let numerator = 0;
                        for (let i = 0; i < denominator; i++) {  //计算占比
                          if (pqcReports[i].quality_pqc_report_complete == 0) {
                            numerator += 1
                          }
                        }
                        this.percentage = Math.round((numerator / denominator) * 100)

                        //将进度更新到数据库
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyPQCPlanUrl,
                          data: { planId: pqcPlan.quality_pqc_plan_id, planSchedule: `${this.percentage}%` },
                          success: (result, status, xhr) => {

                          }

                        })

                      }
                      else {
                        this.searchDataInput = ''
                        this.tbodyData = []
                        this.percentage = 0
                      }

                    },

                  })
                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal1'))   //模态框
                  modal.modal('hide')
                }
              },
              mounted() {
                const modal = document.getElementById('commonModal1')   //模态框
                $(modal).modal({
                  backdrop: 'static', // 黑色遮罩不可点击
                  keyboard: false,  // esc按键不可关闭模态框
                  show: true     //显示
                })
              },

              template: `
                <div class="modal fade" id="commonModal1">
                    <div class="modal-dialog modal-lg">
                          <div class="modal-content" >
                            <div class="modal-header">
                              <button class="close" @click = "closeModal()">
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                              <h4 class="modal-title">
                             计划进度详情
                              </h4>
                            </div>
                            <div class="modal-body">
                              <div class="container-fluid">
                                <div class="row">
                                  <div class="col-sm-12">
                                      <div style="margin-bottom:18px">
                                        <el-progress
                                          :text-inside="true"
                                          :stroke-width="38"
                                          :percentage="percentage"
                                        >
                                        </el-progress>
                                      </div>
                                    <div class="panel panel-default">
                                      <div class="panel-heading panel-heading-table">
                                        <div class="row">
                                          <div class="col-xs-4">
                                            <h5 class="panel-title">进度详情</h5>
                                          </div>
                                          <div class="col-xs-8">

                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                          <table class="table table-bordered table-condensed table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width:20%">报告名称</th>
                                                <th style="width:20%">生产批次</th>
                                                <th style="width:20%">完成状态</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-show="tbodyData.length"
                                                v-for="(value, index) in tbodyData"
                                                :key="index"
                                              >
                                                <td v-text ="value.quality_pqc_report_name" >
                                                </td>
                                                <td v-text="value.quality_pqc_product_batch" >
                                                </td>
                                                <td
                                                  class="text-success"
                                                  v-if="value.quality_pqc_report_complete === '0'"
                                                  v-text="'已完成'"
                                                >
                                                </td>
                                                <td
                                                  v-if="value.quality_pqc_report_complete === '1'"
                                                  v-text="'未完成'"
                                                >
                                                </td>
                                              </tr>
                                              <tr v-show="!tbodyData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                没有可以显示的数据
                                                </td>
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
            modalBodyTableVM.queryFun(modalBodyTableVM.searchData)
          }

          /**
         * @description 检验方案详情模态框(新增计划调用)
         */
          function schemeDetailModal(resolve, dataList, craftId) {
            // console.dir(dataList)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
                return {
                  tbodyData: dataList,  //表格数据
                  isDataChange: false, //判断数据是否改变
                }
              },
              //弹出模态框
              mounted() {
                const modal = document.getElementById('commonModal2')   //模态框
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

                //增加方案
                addMaterialsParam() {

                  // let craftId = dataList.process.workstage_basics_id  //工艺id
                  // console.log(craftId)
                  let promise = new Promise((resolve, reject) => {
                    selectPQCWayModal(resolve, this.tbodyData, craftId)
                  })
                  promise.then((resolveData) => {
                    // console.dir(resolveData)
                    this.tbodyData = resolveData
                  })

                },
                //移除来料参数
                removeMaterialsParam(index) {
                  arryUnit(this.tbodyData, index)
                },

                //保存后执行的操作
                save() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  modal.modal('hide')
                  console.dir(this.tbodyData)
                  // dataList.wayList = this.tbodyData
                  resolve(this.tbodyData)  //返回数据
                },
                //关闭模态框
                closeModal() {
                  const modal = $(document.getElementById('commonModal2'))   //模态框
                  if (this.isDataChange) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },

              watch: {
                tbodyData: {
                  handler(newValue, oldValue) {
                    this.isDataChange = true
                    // 　　　　　　console.log(newValue)
                  },
                  deep: true
                },


              },
              template: `
                  <div class="modal fade" id="commonModal2">
                      <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <button class="close" @click = "closeModal()">
                                <span>
                                  <i class="fa fa-close"></i>
                                </span>
                              </button>
                              <h4 class="modal-title">检验方案详情</h4>
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
                                                <button class="btn btn-primary btn-sm" @click = "addMaterialsParam()">增加方案</button>
                                            </form>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="panel-body-table table-height-10">
                                          <table class="table  table-bordered table-hover">
                                            <thead>
                                              <tr>
                                                <th style="width: 20%;">检验方式</th>
                                                <th style="width: 20%;">检验方案名称</th>
                                                <th style="width: 20%;">检验次数</th>
                                                <th style="width: 20%;">操作</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                  v-show="tbodyData.length"
                                                  v-for="(value, index) in tbodyData"
                                                  :key="index"
                                                >
                                                <td  v-text = "value.wayMeth.modelName">
                                                </td>
                                                <td  v-text = "value.wayMeth.quality_pqc_template_name">
                                                </td>
                                                <td class="table-input-td">
                                                  <input type="number"
                                                  class="table-input"
                                                  placeholder="请输入"
                                                  autocomplete="on"
                                                  min ="1"
                                                  v-model.trim.number="value.checkTime"
                                                >
                                                </td>
                                                <td class="table-input-td">
                                                  <a
                                                  class="table-link text-danger"
                                                  href="javascript:;"
                                                  @click = "removeMaterialsParam(index)"
                                                  >
                                                    <i class="fa fa-times"></i>移除</a>
                                                </td>
                                              </tr>
                                              <tr v-show="!tbodyData.length">
                                                <td colspan=15 class="text-center text-warning">
                                                待加......
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                      </div>
                                      <div class="panel-footer panel-footer-table text-center">
                                        <button class="btn btn-primary modal-submit" @click="save()">保存</button>
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
          * @description 选择方案模态框(多选)
          */
          function selectPQCWayModal(resolve, dataList, craftId) {
            // console.log(craftId)
            // 当前页面vue实例
            let panelBodyTableVM = new Vue({
              el: '#commonModal3',
              data() {
                return {
                  loading: false,  //loading加载
                  searchData: { headNum: 1, type: 'info', templateId: '', templateName: '', methodId: '', craftId: craftId },//搜索参数
                  tbodyData: [],  //表格数据
                  selectData: [],  //选择的数据
                  tempChangeList: [],  //临时互传数据
                  isDataChange: false, //判断数据是否改变
                  searchDataInput: '',//搜索框的数据
                  lines: 100,     //总条数
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
                      this.searchDataInput = '' //清空搜索框

                      if (result.status == 0) {
                        let tempList = result.map.pqcTemplates
                        // console.dir(tempList)
                        this.selectData = [] //清空已选择的数据

                        for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
                          tempList[i].selected = false  //所有按钮设置为没选择
                          for (let j = 0, len = dataList.length; j < len; j++) {
                            if (dataList[j].wayMeth.quality_pqc_template_id == tempList[i].quality_pqc_template_id) {
                              tempList[i].selected = true
                              this.selectData.push(dataList[j].wayMeth) //存储已选择数据
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
                  this.searchData.templateName = this.searchDataInput
                  this.queryFun(this.searchData)
                },
                //选择后执行的操作
                choice(value, index) {
                  if (value.selected) { //已经选择
                    return
                  } else {
                    this.tbodyData[index].selected = true //设置为已选择
                    this.selectData.push(value) //存储已选择数据
                    let templateId = value.quality_pqc_template_id

                    $.ajax({
                      type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                      url: queryPQCTemplateUrl,
                      data: { headNum: 1, type: 'detai', templateId: templateId, templateName: '', methodId: '', craftId: '' },
                      beforeSend: (xml) => {
                        // this.loading = true
                      },
                      success: (result, status, xhr) => {
                        // this.loading = false
                        if (result.status == 0) {
                          let tempdata = {
                            wayMeth: value,  //检验方式
                            checkDate: '',//检验日期
                            checkTime: 1,//检验次数
                            reportRecords: [],  //报告记录
                            materialRecords: [],  //来料参数记录
                            attachRecords: [], //附加参数记录
                          };
                          let pqcTemplate = result.map.pqcTemplate;   //基础信息
                          let qualityProjectTypes = pqcTemplate[0].qualityProjectTypes;  //环境条件,半成品参数,设备参数,其它
                          let materialConfirms = result.map.materialConfirms; //来料确认

                          //环境条件,半成品参数,设备参数,其它
                          for (let i = 0, len = qualityProjectTypes.length; i < len; i++) {
                            if (qualityProjectTypes[i].quality_project_type_name == '环境条件') {
                              for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                                let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于新增
                                  quality_project_relation_id: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                                  quality_pqc_project_criterion_value: '',  //标准记录
                                  quality_pqc_project_criterion_one_value: '',  //标准1记录
                                  quality_pqc_project_criterion_two_value: ''  //标准2记录
                                }
                                tempdata.reportRecords.push(PQCReportRecordDO)

                              }
                            }
                            if (qualityProjectTypes[i].quality_project_type_name == '设备参数') {
                              for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                                let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于新增
                                  quality_project_relation_id: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                                  quality_pqc_project_criterion_value: '',  //标准记录
                                  quality_pqc_project_criterion_one_value: '',  //标准1记录
                                  quality_pqc_project_criterion_two_value: ''  //标准2记录
                                }
                                tempdata.reportRecords.push(PQCReportRecordDO)
                              }
                            }
                            if (qualityProjectTypes[i].quality_project_type_name == '其它') {
                              for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                                let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于新增
                                  quality_project_relation_id: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                                  quality_pqc_project_criterion_value: '',  //标准记录
                                  quality_pqc_project_criterion_one_value: '',  //标准1记录
                                  quality_pqc_project_criterion_two_value: ''  //标准2记录
                                }
                                tempdata.reportRecords.push(PQCReportRecordDO)
                              }
                            }
                            if (qualityProjectTypes[i].quality_project_type_name == '半成品参数') {
                              for (let j = 0, len = qualityProjectTypes[i].qualityProjects.length; j < len; j++) {
                                let PQCReportRecordDO = {  //pqc报告项目（参数）记录实体类,用于新增
                                  quality_project_relation_id: qualityProjectTypes[i].qualityProjects[j].qualityTypeProject.quality_type_project_id, //参数类型-参数关系表id
                                  quality_pqc_project_criterion_value: '',  //标准记录
                                  quality_pqc_project_criterion_one_value: '',  //标准1记录
                                  quality_pqc_project_criterion_two_value: ''  //标准2记录
                                }
                                tempdata.reportRecords.push(PQCReportRecordDO)

                                //处理附加参数
                                for (let k = 0, len = qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs.length; k < len; k++) {
                                  let tempObj2 = {
                                    quality_pqc_project_attach_id: qualityProjectTypes[i].qualityProjects[j].pqcProjectAttachs[k].quality_pqc_project_attach_id,
                                    quality_pqc_project_attach_record: '',
                                  }
                                  tempdata.attachRecords.push(tempObj2)
                                }

                              }
                            }
                          }
                          //来料确认
                          for (let i = 0, len = materialConfirms.length; i < len; i++) {
                            //处理来料参数
                            for (let j = 0, len = materialConfirms[i].qualityProjects.length; j < len; j++) {
                              let tempObj2 = {
                                quality_material_confirm_parameter_id: materialConfirms[i].qualityProjects[j].quality_material_confirm_parameter_id,
                                quality_project_record: '',
                              }
                              tempdata.materialRecords.push(tempObj2)
                            }

                          }
                          this.tempChangeList.push(tempdata)  //存入临时数组
                        }

                      },

                    })

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
                  if (this.tempChangeList.length !== 0) {  //判断是否有修改数据
                    if (confirm("您修改的数据未保存,确定要离开此页面吗?")) {
                      modal.modal('hide')
                    }
                  } else {
                    modal.modal('hide')
                  }
                }

              },

              watch: {
                tempChangeList: {
                  handler(newValue, oldValue) {
                    isDataChange = true

                  },
                  deep: true
                },

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
                                            <th style="width: 6%;">序号</th>
                                            <th style="width: 20%;">方案名称</th>
                                            <th style="width: 20%;">方案编号</th>
                                            <th style="width: 18%;">工序</th>
                                            <th style="width: 18%;">检验方式</th>
                                            <th style="width: 18%;">操作</th>
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
                                            <td v-text="value.quality_pqc_template_name">
                                            </td>
                                            <td v-text="value.quality_pqc_template_number">
                                            </td>
                                            <td v-text="value.workstageName">
                                            </td>
                                            <td v-text="value.modelName">
                                            </td>
                                            <td class="table-input-td">
                                              <label class="checkbox-inline">
                                                <input
                                                  type="checkbox"
                                                  onclick="return false"
                                                  :value="value"
                                                  v-model.trim="selectData"
                                                >
                                              </label>
                                            </td>
                                          </tr>
                                          <tr v-show="!tbodyData.length">
                                            <td colspan=15 class="text-center text-warning">
                                            该工序下没有对应的方案，请在方案管理里进行添加
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

        }())
      }
        break;
      case '#finalQualityReport': {	//电芯出货报告
        const swiper = document.getElementById('finalQualityReport')   //右侧外部swiper
        function queryFun(url, data) {
          var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
          })
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
                Vue.set(panelBodyTableVM, 'dataList', result.map.fqcReportList)
                Vue.set(panelBodyTableVM, 'lines', result.map.line)
              } else {
                Vue.set(panelBodyTableVM, 'dataList', [])
                Vue.set(panelBodyTableVM, 'lines', 0)
              }
            }
          })
        }
        queryFun(queryFQCReportUrl, { headNum: 1 })

        let panelBodyTableVM = new Vue({
          el: '#finalQualityReportInerSwiper',
          data() {
            return {
              dataList: [],
              lines: 0, //条数
              search: '', //搜索框值
              currenPage: 1, //当前页
              pagesize: 10,   //页码
              ajaxData: {
                reportName: '',
                headNum: 1
              }
            }
          },
          methods: {
            //详情
            detailsModel(val) {
              model('details', val.quality_fqc_report_id)
            },
            //修改
            modificationModel(val) {
              model('modificationModel', val.quality_fqc_report_id)
            },
            //新增
            add() {
              let promise = new Promise((resolve, reject) => {
                reportTemplate(resolve, null, null)
              })
              promise.then((resolveData) => {
                model('add', resolveData.quality_fqc_template_id)
              })
            },
            //分页变化
            handleCurrentChange(val) {
              this.ajaxData.headNum = (val - 1) * 10 + 1;
              queryFun(queryFQCReportUrl, this.ajaxData)
            },
            //搜索框
            searchs() {
              this.ajaxData.reportName = this.search
              this.currenPage = 1
              queryFun(queryFQCReportUrl, this.ajaxData)
            },

            //移除
            deletes(id) {

              swal({
                title: '您确定要移除此条数据吗？',
                text: '数据移除后无法恢复',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: removeFQCReportUrl,
                  data: { reportId: id },
                  success: function (result, status, xhr) {
                    if (result.status === 0) {
                      swal({
                        title: '删除成功',
                        type: 'success',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      }).then(
                        () => {
                        },
                        (dismiss) => {
                          queryFun(queryFQCReportUrl, { headNum: 1 })
                        })
                    }
                    else {
                      swal({
                        title: '删除失败',
                        type: 'warning',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      })
                    }
                  }
                })
              })
            },
          },
          template: `
                <div class="swiper-slide swiper-no-swiping" id="finalQualityReportInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!--panel-heading end -->
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">报告名称</th>
                                                <th style="width: 15%;">报告类型</th>
                                                <th style="width: 15%;">电池型号</th>
                                                <th style="width: 15%;">电池批号</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_fqc_report_name}}</td>
                                                <td>{{value.quality_fqc_report_type}}</td>
                                                <td>{{value.warehouse_product_model}}</td>
                                                <td>{{value.warehouse_product_batch}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_fqc_report_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
        })

        //新增、详情、修改模态框
        function model(type, id) {
          if (type !== 'add') {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryFQCReportUrl,
              data: { reportId: id },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(addFinalQualityReportModal, 'fqcReport', result.map.fqcReport)
                  Vue.set(addFinalQualityReportModal, 'fqcProjectResultList', result.map.fqcReport.fqcProjectResultList)
                  Vue.set(addFinalQualityReportModal, 'fqcUnqualifiedList', result.map.fqcReport.fqcUnqualifiedList[0])
                  var fqcProjectResultListJsonStr = []

                  // Vue.set(addFinalQualityReportModal,'approves',result.map.fqcReport.quality_fqc_check_people)
                  var fQCReports = { //新增时发送的ajax数据
                    quality_fqc_report_id: result.map.fqcReport.quality_fqc_report_id,//ifqc检验报告id
                    quality_fqc_template_id: result.map.fqcReport.quality_fqc_template_id, //fqc检验模板id
                    quality_fqc_report_number: result.map.fqcReport.quality_fqc_report_number,//报检单号
                    product_model_id: result.map.fqcReport.product_model_id, // 产品id
                    quality_fqc_report_name: result.map.fqcReport.quality_fqc_report_name,//报告名称
                    quality_fqc_report_type: result.map.fqcReport.quality_fqc_report_type,//报告类型
                    quality_fqc_customer_name: result.map.fqcReport.quality_fqc_customer_name, //客户名称
                    warehouse_product_batch: result.map.fqcReport.warehouse_product_batch,  //电池批号
                    warehouse_product_inspection_number: result.map.fqcReport.warehouse_product_inspection_number,  //报检数量
                    warehouse_product_sample_number: result.map.fqcReport.warehouse_product_sample_number,  //抽样数量
                    quality_fqc_publish_date: result.map.fqcReport.quality_fqc_publish_date, //发布日期
                    quality_fqc_check_peopleid: result.map.fqcReport.quality_fqc_check_peopleid, //检验人员id
                    quality_fqc_check_auditor: result.map.fqcReport.quality_fqc_check_auditor, //审核人员
                    quality_fqc_check_auditor_id: result.map.fqcReport.quality_fqc_check_auditor_id,//审核人员
                    quality_fqc_check_people: result.map.fqcReport.quality_fqc_check_people, //检验人员
                    quality_fqc_check_date: result.map.fqcReport.quality_fqc_check_date, //检验日期
                    quality_fqc_check_auditor_date: result.map.fqcReport.quality_fqc_check_auditor_date,//审核日期
                    warehouse_product_capacity_grade: result.map.fqcReport.warehouse_product_capacity_grade, //容量档次
                    warehouse_product_model: result.map.fqcReport.warehouse_product_model, //电池型号
                    quality_fqc_comprehensive_result: result.map.fqcReport.quality_fqc_comprehensive_result, //综合判定(0:合格 1：不合格)
                  }
                  var fqcUnqualified = { //新增时发送的ajax数据
                    quality_fqc_unqualified_id: result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_id,
                    quality_fqc_unqualified_probability: result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_probability, //不良率
                    quality_fqc_unqualified_number: result.map.fqcReport.fqcUnqualifiedList[0].quality_fqc_unqualified_number, //不良数量
                  }

                  result.map.fqcReport.fqcProjectResultList.forEach((val, key) => {
                    fqcProjectResultListJsonStr.push({
                      quality_fqc_project_result_id: val.quality_fqc_project_result_id, //id
                      quality_fqc_project_content: val.quality_fqc_project_content, //不良内容
                      quality_fqc_project_determine: val.quality_fqc_project_determine, //判断
                      quality_fqc_project_number: val.quality_fqc_project_number, //不良数量
                      quality_fqc_project_aql_criterion: val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_aql_criterion, //判定标准(AQL)
                      quality_fqc_project_il_criterion: val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_il_criterion, //判定标准(IL)
                      quality_fqc_project_check_method: val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_check_method, //测试方法
                      quality_fqc_project_criterion: val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_criterion, //检验标准
                    })
                  })
                  Vue.set(addFinalQualityReportModal, 'fQCReports', fQCReports)
                  Vue.set(addFinalQualityReportModal, 'fqcUnqualified', fqcUnqualified)
                  Vue.set(addFinalQualityReportModal, 'fqcProjectResultListJsonStr', fqcProjectResultListJsonStr)
                } else {
                  var fQCReports = { //新增时发送的ajax数据
                    quality_fqc_template_id: '', //fqc检验模板id
                    quality_fqc_report_number: '',//报检单号
                    product_model_id: '', // 产品id
                    quality_fqc_report_name: '',//报告名称
                    quality_fqc_report_type: '',//报告类型
                    quality_fqc_customer_name: '', //客户名称
                    warehouse_product_batch: '',  //电池批号
                    warehouse_product_inspection_number: '',  //报检数量
                    warehouse_product_sample_number: '',  //抽样数量
                    quality_fqc_publish_date: '', //发布日期
                    quality_fqc_check_people: '', //检验人员
                    quality_fqc_check_peopleid: '', //检验人员id
                    quality_fqc_check_auditor: '', //审核人员
                    quality_fqc_check_auditor_id: '',//审核人员
                    quality_fqc_check_date: '', //检验日期
                    quality_fqc_check_auditor_date: '',//审核日期
                    warehouse_product_capacity_grade: '', //容量档次
                    warehouse_product_model: '', //电池型号
                    quality_fqc_comprehensive_result: '', //综合判定(0:合格 1：不合格)
                  }
                  Vue.set(addFinalQualityReportModal, 'fQCReports', [])
                }

              }
            })
          } else {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryFQCTemplateUrl,
              data: { templateId: id },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(addFinalQualityReportModal, 'fqcReport', result.map.fqcTemplate)
                  Vue.set(addFinalQualityReportModal, 'fqcProjectResultList', result.map.fqcTemplate.templateProjectList)
                  var fQCReports = { //新增时发送的ajax数据
                    quality_fqc_template_id: '', //fqc检验模板id
                    product_model_id: '', // 产品id
                    quality_fqc_report_name: '',//报告名称
                    quality_fqc_report_type: result.map.fqcTemplate.quality_fqc_template_type,//报告类型
                    quality_fqc_customer_name: '', //客户名称
                    warehouse_product_batch: '',  //电池批号
                    warehouse_product_inspection_number: '',  //报检数量
                    warehouse_product_sample_number: '',  //抽样数量
                    quality_fqc_publish_date: '', //发布日期
                    quality_fqc_check_people: '', //检验人员
                    quality_fqc_check_peopleid: '', //检验人员id
                    quality_fqc_check_auditor: '', //审核人员
                    quality_fqc_check_auditor_id: '',//审核人员
                    quality_fqc_check_date: '', //检验日期
                    quality_fqc_check_auditor_date: '',//审核日期
                    warehouse_product_capacity_grade: '', //容量档次
                    warehouse_product_model: '', //电池型号
                    quality_fqc_comprehensive_result: '', //综合判定(0:合格 1：不合格)
                  }
                  var fqcProjectResultListJsonStr = []
                  result.map.fqcTemplate.templateProjectList.forEach((val, key) => {
                    fqcProjectResultListJsonStr.push({
                      quality_project_id: val.qualityTypeProject.quality_project_id, //不良内容
                      quality_fqc_project_content: '', //不良内容
                      quality_fqc_project_determine: '-1', //判断
                      quality_fqc_project_number: '', //不良数量
                      quality_fqc_project_aql_criterion: val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion, //判定标准(AQL)
                      quality_fqc_project_il_criterion: val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion, //判定标准(IL)
                      quality_fqc_project_check_method: val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method, //测试方法
                      quality_fqc_project_criterion: val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion, //检验标准
                    })
                  })
                  Vue.set(addFinalQualityReportModal, 'fQCReports', fQCReports)
                  Vue.set(addFinalQualityReportModal, 'fqcProjectResultListJsonStr', fqcProjectResultListJsonStr)
                }
              }
            })

          }
          let addFinalQualityReportModal = new Vue({
            el: '#addFinalQualityReportModal',
            data() {
              return {
                add: false,
                modificationModel: false,
                details: false,
                fqcReport: [], //基础信息
                fqcProjectResultList: [], //项目内容
                fqcUnqualifiedList: [], //综合结果
                headText: '出货报告',
                fQCReports: { //新增时发送的ajax数据
                  quality_fqc_template_id: '', //fqc检验模板id
                  product_model_id: '', // 产品id
                  quality_fqc_report_number: '',//报检单号
                  quality_fqc_report_name: '',//报告名称
                  quality_fqc_report_type: '',//报告类型
                  quality_fqc_customer_name: '', //客户名称
                  warehouse_product_batch: '',  //电池批号
                  warehouse_product_inspection_number: '',  //报检数量
                  warehouse_product_sample_number: '',  //抽样数量
                  quality_fqc_publish_date: '', //发布日期
                  quality_fqc_check_people: '', //检验人员
                  quality_fqc_check_peopleid: '', //检验人员id
                  quality_fqc_check_auditor: '', //审核人员
                  quality_fqc_check_auditor_id: '',//审核人员
                  quality_fqc_check_date: '', //检验日期
                  quality_fqc_check_auditor_date: '',//审核日期
                  warehouse_product_capacity_grade: '', //容量档次
                  warehouse_product_model: '', //电池型号
                  quality_fqc_comprehensive_result: '', //综合判定(0:合格 1：不合格)
                },
                fqcProjectResultListJsonStr: [], //发送项目
                fqcUnqualified: { //新增时发送的ajax数据
                  quality_fqc_unqualified_probability: '', //不良率
                  quality_fqc_unqualified_number: '', //不良数量
                }
              }
            },
            methods: {
              //选择模板
              optionalModule() {
                let promise = new Promise((resolve, reject) => {
                  reportTemplate(resolve, null, null)
                })
                promise.then((resolveData) => {
                  // console.log(resolveData)
                  // $.ajax({
                  //     type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  //     url: queryFQCTemplateUrl,
                  //     data:{templateId:resolveData.quality_fqc_template_id,headNum:1},
                  //     success:  (result, status, xhr) => {
                  //         if(result.status === 0 ){

                  //         }
                  //     }
                  // })
                })

              },
              //选择批准人和审核人事件
              people(type2) {
                let promise = new Promise(function (resolve, reject) {
                  peopleModel(resolve, null, null)
                })
                promise.then((resolveData) => {
                  if (type2 == '检验员') {
                    this.fQCReports.quality_fqc_check_people = resolveData.role_staff_name
                    this.fQCReports.quality_fqc_check_peopleid = resolveData.role_staff_id
                    if (type === 'add') {
                      this.fQCReports.quality_fqc_check_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  } else {
                    this.fQCReports.quality_fqc_check_auditor = resolveData.role_staff_name
                    this.fQCReports.quality_fqc_check_auditor_id = resolveData.role_staff_id
                    if (type === 'add') {
                      this.fQCReports.quality_fqc_check_auditor_date = moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                  }
                })
              },
              //产品选择
              product() {
                let promise = new Promise(function (resolve, reject) {
                  productModel(resolve, null, null)
                })
                promise.then((resolveData) => {
                  this.fQCReports.warehouse_product_model = resolveData.warehouse_product_size
                  this.fQCReports.product_model_id = resolveData.warehouse_product_id
                })
              },
              //确认按钮
              submit() {
                if (this.fQCReports.quality_fqc_customer_name == '') {
                  this.$message.error({
                    message: '客户名称未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.quality_fqc_report_name == '') {
                  this.$message.error({
                    message: '报告名称未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.quality_fqc_report_number == '') {
                  this.$message.error({
                    message: '报检单号未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.warehouse_product_batch == '') {
                  this.$message.error({
                    message: '电池批号未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.quality_fqc_publish_date == '') {
                  this.$message.error({
                    message: '报检日期未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.warehouse_product_capacity_grade == '') {
                  this.$message.error({
                    message: '容量档次未填写',
                    type: 'warning'
                  })
                } else if (this.fQCReports.warehouse_product_model == '') {
                  this.$message.error({
                    message: '电池型号未填写',
                    type: 'warning'
                  })
                } else {
                  swal({
                    title: '您确定要提交本次操作吗?',
                    text: '请确保填写信息无误后点击确定按钮',
                    type: 'question',
                    allowEscapeKey: false, // 用户按esc键不退出
                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                    showCancelButton: true, // 显示用户取消按钮
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    var fQCReportListJsonStr = {
                      quality_fqc_report_id: this.fQCReports.quality_fqc_report_id,//ifqc检验报告id
                      quality_fqc_template_id: id, //fqc检验模板id
                      quality_fqc_report_number: this.fQCReports.quality_fqc_report_number,//报检单号
                      quality_fqc_report_name: this.fQCReports.quality_fqc_report_name,//报告名称
                      quality_fqc_report_type: this.fQCReports.quality_fqc_report_type,//报告类型
                      quality_fqc_customer_name: this.fQCReports.quality_fqc_customer_name, //客户名称
                      warehouse_product_batch: this.fQCReports.warehouse_product_batch,  //电池批号
                      warehouse_product_inspection_number: this.fQCReports.warehouse_product_inspection_number,  //报检数量
                      warehouse_product_sample_number: this.fQCReports.warehouse_product_sample_number,  //抽样数量
                      quality_fqc_publish_date: moment(this.fQCReports.quality_fqc_publish_date).format('YYYY-MM-DD HH:mm:ss'), //发布日期
                      quality_fqc_check_people: this.fQCReports.quality_fqc_check_people, //检验人员
                      quality_fqc_check_peopleid: this.fQCReports.quality_fqc_check_peopleid, //检验人员id
                      quality_fqc_check_auditor: this.fQCReports.quality_fqc_check_auditor, //审核人员
                      quality_fqc_check_auditor_id: this.fQCReports.quality_fqc_check_auditor_id,//审核人员
                      quality_fqc_check_date: moment(this.fQCReports.quality_fqc_check_date).format('YYYY-MM-DD HH:mm:ss'), //检验日期
                      quality_fqc_check_auditor_date: moment(this.fQCReports.quality_fqc_check_auditor_date).format('YYYY-MM-DD HH:mm:ss'),//审核日期
                      warehouse_product_capacity_grade: this.fQCReports.warehouse_product_capacity_grade, //容量档次
                      warehouse_product_model: this.fQCReports.warehouse_product_model, //电池型号
                      product_model_id: this.fQCReports.product_model_id, //产品id
                      quality_fqc_comprehensive_result: this.fQCReports.quality_fqc_comprehensive_result,//综合判定(0:合格 1：不合格)

                    }
                    var fqcUnqualifiedListJsonStr = {
                      quality_fqc_report_id: this.fQCReports.quality_fqc_report_id,//ifqc检验报告id
                      quality_fqc_unqualified_id: this.fqcUnqualified.quality_fqc_unqualified_id,
                      quality_fqc_unqualified_probability: this.fqcUnqualified.quality_fqc_unqualified_probability.split('%')[0], //不良率
                      quality_fqc_unqualified_number: this.fqcUnqualified.quality_fqc_unqualified_number,
                    }
                    var data = {
                      quality_fqc_report_id: this.fQCReports.quality_fqc_report_id,//ifqc检验报告id
                      quality_fqc_template_id: id, //fqc检验模板id
                      quality_fqc_report_number: this.fQCReports.quality_fqc_report_number,//报检单号
                      quality_fqc_report_name: this.fQCReports.quality_fqc_report_name,//报告名称
                      quality_fqc_report_type: this.fQCReports.quality_fqc_report_type,//报告类型
                      quality_fqc_customer_name: this.fQCReports.quality_fqc_customer_name, //客户名称
                      warehouse_product_batch: this.fQCReports.warehouse_product_batch,  //电池批号
                      warehouse_product_inspection_number: this.fQCReports.warehouse_product_inspection_number,  //报检数量
                      warehouse_product_sample_number: this.fQCReports.warehouse_product_sample_number,  //抽样数量
                      quality_fqc_publish_date2: moment(this.fQCReports.quality_fqc_publish_date).format('YYYY-MM-DD HH:mm:ss') , //发布日期
                      quality_fqc_check_people: this.fQCReports.quality_fqc_check_people, //检验人员
                      quality_fqc_check_peopleid: this.fQCReports.quality_fqc_check_peopleid, //检验人员id
                      quality_fqc_check_auditor: this.fQCReports.quality_fqc_check_auditor, //审核人员
                      quality_fqc_check_auditor_id: this.fQCReports.quality_fqc_check_auditor_id,//审核人员
                      quality_fqc_check_date2: moment(this.fQCReports.quality_fqc_check_date).format('YYYY-MM-DD HH:mm:ss')  , //检验日期
                      quality_fqc_check_auditor_date2: moment(this.fQCReports.quality_fqc_check_auditor_date).format('YYYY-MM-DD HH:mm:ss') ,//审核日期
                      warehouse_product_capacity_grade: this.fQCReports.warehouse_product_capacity_grade, //容量档次
                      warehouse_product_model: this.fQCReports.warehouse_product_model, //电池型号
                      product_model_id: this.fQCReports.product_model_id, //产品id
                      quality_fqc_unqualified_id: this.fqcUnqualified.quality_fqc_unqualified_id,
                      quality_fqc_comprehensive_result: this.fQCReports.quality_fqc_comprehensive_result,//综合判定(0:合格 1：不合格)
                      quality_fqc_unqualified_probability: this.fqcUnqualified.quality_fqc_unqualified_probability.split('%')[0], //不良率
                      quality_fqc_unqualified_number: this.fqcUnqualified.quality_fqc_unqualified_number,
                      fqcProjectResultListJsonStr: JSON.stringify(this.fqcProjectResultListJsonStr)
                    }
                    if (type == 'add') {

                      //新增提交
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveFQCReportUrl,
                        data: data,
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryFQCReportUrl, { headNum: 1 })
                            const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail2(result.msg);	//操作失败
                          }
                        }
                      })
                    } else {
                      //修改提交按钮
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: modifyFQCReportUrl,
                        data: {
                          fQCReportListJsonStr: JSON.stringify(fQCReportListJsonStr),
                          fqcUnqualifiedListJsonStr: JSON.stringify(fqcUnqualifiedListJsonStr),
                          fqcProjectResultListJsonStr: JSON.stringify(this.fqcProjectResultListJsonStr)
                        },
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryFQCReportUrl, { headNum: 1 })
                            const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail2(result.msg);	//操作失败
                          }
                        }
                      })
                    }
                  })
                }
              }
            },
            computed: {
              quality_fqc_unqualified_probability: {
                get() {
                  var sum
                  if (this.fQCReports.warehouse_product_sample_number != '' && this.fQCReports.warehouse_product_sample_number != '') {
                    var sum = Math.round((this.fqcUnqualified.quality_fqc_unqualified_number / this.fQCReports.warehouse_product_sample_number) * 10000) / 100 + '%'
                  } else {
                    sum = ''
                  }
                  this.fqcUnqualified.quality_fqc_unqualified_probability = sum
                  return sum
                }
              }
            },
            mounted() {
              const modal = document.getElementById('addFinalQualityReportModal')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })
            },
            filters: {
              //时间戳转日期
              times(val) {
                if (val !== '' && val !== null) {
                  return moment(val).format('YYYY-MM-DD HH:mm:ss')
                }
              }
            },
            created() {
              if (type == 'modificationModel') {
                this.headText = '修改出货报告'
                this.modificationModel = true
              } else if (type == 'add') {
                this.headText = '新增出货报告'
                this.add = true
              } else if (type == 'details') {
                this.details = true
              }
            },

            template: `
                    <!-- 新增出货报告模态框 -->
                    <div class="modal fade" id="addFinalQualityReportModal">
                        <div class="modal-dialog modal-lg">
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
                                            <div class="col-sm-12">
                                                <!--基础信息-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">基础信息</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <!--<form class="form-inline pull-right">
                                                                   <button type="button" class="btn btn-primary btn-sm" @click="optionalModule()">选择报告模板</button>
                                                                </form> -->
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:14%">报告名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_report_name">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_report_name}}</td>

                                                                    <th style="width:14%">报告类型</th>
                                                                    <td style="width:19%">{{fQCReports.quality_fqc_report_type}}</td>

                                                                    <th style="width:14%">电池批号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_batch">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_batch}}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th style="width:14%">报检单号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_report_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_report_number}}</td>

                                                                    <th style="width:14%">报检日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" :value="fQCReports.quality_fqc_publish_date | times" @blur="fQCReports.quality_fqc_publish_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_publish_date | times}}</td>

                                                                    <th style="width:14%">客户名称</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.quality_fqc_customer_name">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_customer_name}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">电池型号</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_model" @click="product()">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_model}}</td>

                                                                    <th style="width:14%">容量档次</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCReports.warehouse_product_capacity_grade">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_capacity_grade}}</td>

                                                                    <th style="width:14%"></th>
                                                                    <td class="table-input-td" style="width:19%"></td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <!--综合结果-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">综合结果</h5>
                                                            </div>
                                                            <div class="col-xs-8">

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:14%">抽样数量</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fQCReports.warehouse_product_sample_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_sample_number}}</td>

                                                                    <th style="width:14%">不良数量</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcUnqualified.quality_fqc_unqualified_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcUnqualifiedList.quality_fqc_unqualified_number}}</td>

                                                                    <th style="width:14%">不良率</th>
                                                                    <td style="width:19%">{{quality_fqc_unqualified_probability}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">报检数量</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fQCReports.warehouse_product_inspection_number">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.warehouse_product_inspection_number}}</td>


                                                                    <th style="width:14%">检验人员</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" @click="people('检验员')" :value="fQCReports.quality_fqc_check_people">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_people}}</td>

                                                                    <th style="width:14%">检验日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="fQCReports.quality_fqc_check_date | times" @blur="fQCReports.quality_fqc_check_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_date | times}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:14%">审核人员</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on"  @click="people('审核人')" :value="fQCReports.quality_fqc_check_auditor">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_auditor}}</td>

                                                                    <th style="width:14%">审查日期</th>
                                                                    <td class="table-input-td" style="width:19%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" :value="fQCReports.quality_fqc_check_auditor_date | times"  @blur="fQCReports.quality_fqc_check_auditor_date = $event.target.value"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                    </td>
                                                                    <td style="width:19%" v-show="details">{{fqcReport.quality_fqc_check_auditor_date | times}}</td>

                                                                    <th style="width:14%">综合判定</th>
                                                                    <td class="table-input-td" style="width:19%">
                                                                        <select class="form-control" v-model="fQCReports.quality_fqc_comprehensive_result" :disabled="details">
                                                                            <option value="">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <!--检验内容-->
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">检验内容</h5>
                                                            </div>
                                                            <div class="col-xs-8">

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:5%">序号</th>
                                                                    <th style="width:12%">检验项目</th>
                                                                    <th style="width:9%">检验标准</th>
                                                                    <th style="width:9%">判定标准(IL)</th>
                                                                    <th style="width:9%">判定标准(AQL)</th>
                                                                    <th style="width:8%">测试方法</th>
                                                                    <th style="width:10%">判断</th>
                                                                    <th style="width:9%">不良内容</th>
                                                                    <th style="width:9%">不良数量</th>
                                                                </tr>
                                                                <tr v-show="!fqcProjectResultList.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>

                                                                <tr v-if="!add" v-for="(val,index) in fqcProjectResultList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{val.qualityProject.quality_project_name}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_il_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_aql_criterion}}</td>
                                                                    <td>{{val.qualityProject.fqcProjectStandardList[0].quality_fqc_project_check_method}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_determine" :disabled="details">
                                                                            <option value="-1">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_content">
                                                                    </td>
                                                                    <td v-if="details">{{val.quality_fqc_project_content}}</td>

                                                                    <td class="table-input-td"  v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_number">
                                                                    </td>
                                                                    <td v-if="details">{{val.quality_fqc_project_number}}</td>
                                                                </tr>
                                                                <tr v-if="add" v-for="(val,index) in fqcProjectResultList">
                                                                    <td>{{index+1}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.quality_project_name}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion}}</td>
                                                                    <td>{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method}}</td>
                                                                    <td class="table-input-td">
                                                                        <select class="form-control"  v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_determine" :disabled="details">
                                                                            <option value="-1">未选择</option>
                                                                            <option value="0">合格</option>
                                                                            <option value="1">不合格</option>
                                                                        </select>
                                                                    </td>

                                                                    <td class="table-input-td" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_content">
                                                                    </td>
                                                                    <td v-show="details">{{val.quality_fqc_project_content}}</td>

                                                                    <td class="table-input-td" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="fqcProjectResultListJsonStr[index].quality_fqc_project_number">
                                                                    </td>
                                                                    <td v-show="details">{{val.quality_fqc_project_number}}</td>
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
                                            <button class="btn btn-primary modal-submit" @click="submit()" v-show="!details">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })
        }

      }
        break;
      case '#finaltemplateManage': {	//电芯出货报告模板管理
        const swiper = document.getElementById('finaltemplateManage')   //右侧外部swiper
        function queryFun(url, data) {
          var mesloadBox = new MesloadBox(swiper, {
            // 主数据载入窗口
            warningContent: '没有此类信息，请重新选择或输入'
          })
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
                Vue.set(panelBodyTableVM, 'dataList', result.map.fqctemplateList)
                Vue.set(panelBodyTableVM, 'lines', result.map.line)
              } else {
                Vue.set(panelBodyTableVM, 'dataList', [])
                Vue.set(panelBodyTableVM, 'lines', 0)
              }
            }
          })
        }
        queryFun(queryFQCTemplateUrl, { headNum: 1 })

        let panelBodyTableVM = new Vue({
          el: '#finaltemplateManageInerSwiper',
          data() {
            return {
              dataList: [],
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
          methods: {
            //详情
            detailsModel(val) {
              model('details', val.quality_fqc_template_id)
            },
            //修改
            modificationModel(val) {
              model('modificationModel', val.quality_fqc_template_id)
            },
            //新增
            add() {
              model('add')
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
            },
            //删除
            deletes(id) {
              swal({
                title: '您确定要移除此条数据吗？',
                text: '数据移除后无法恢复',
                type: 'question',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(() => {
                $.ajax({
                  type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                  url: removeFQCTemplateUrl,
                  data: { templateId: id },
                  success: function (result, status, xhr) {
                    if (result.status === 0) {
                      swal({
                        title: '删除成功',
                        type: 'success',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      }).then(() => { },
                        (dismiss) => {
                          queryFun(queryFQCTemplateUrl, { headNum: 1 })
                        }
                        )
                    } else {
                      swal({
                        title: '删除失败',
                        type: 'warning',
                        timer: '1000',
                        allowEscapeKey: false, // 用户按esc键不退出
                        allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                        showCancelButton: false, // 显示用户取消按钮
                        showConfirmButton: false, // 显示用户确认按钮
                      })
                    }
                  }
                })
              })
            }
          },
          template: `
                <div class="swiper-slide swiper-no-swiping" id="finaltemplateManageInerSwiper">
                    <!-- 右侧内部swiper -->
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="panel panel-default">
                                <div class="panel-heading panel-heading-table">
                                    <div class="row">
                                        <div class="col-xs-6">
                                            <form class="form-inline">
                                                <fieldset>
                                                    <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1" @click="add()">新增</a>
                                                </fieldset>
                                            </form>
                                        </div>
                                        <div class="col-xs-6">
                                            <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                <!--搜索框 -->
                                                <div class="input-group input-group-sm fuzzy-search-group">
                                                    <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
                                                    <div class="input-group-btn" @click="searchs()">
                                                        <button type="button" class="btn btn-primary head-main-btn-2">
                                                            <i class="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <!--panel-heading end -->
                                <div class="panel-body-table table-height-10">
                                    <table class="table  table-bordered table-hover ">
                                        <thead>
                                            <tr>
                                                <th style="width: 5%;">序号</th>
                                                <th style="width: 15%;">模板名称</th>
                                                <th style="width: 15%;">模板类型</th>
                                                <th style="width: 15%;">版本</th>
                                                <th style="width: 15%;">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(value,index) in dataList">
                                                <td>{{index+1}}</td>
                                                <td>{{value.quality_fqc_template_name}}</td>
                                                <td>{{value.quality_fqc_template_type}}</td>
                                                <td>{{value.quality_fqc_template_edittion}}</td>
                                                <td class="table-input-td">
                                                    <a class="table-link" @click="detailsModel(value)" href="javascript:void(0);">
                                                        <i class="fa fa-tasks fa-fw"></i>详情</a>
                                                    <a class="table-link" @click="modificationModel(value)" href="javascript:;">
                                                        <i class="fa fa-pencil-square-o"></i>修改</a>
                                                    <a class="table-link text-danger" href="javascript:;" @click="deletes(value.quality_fqc_template_id)">
                                                        <i class="fa fa-trash-o"></i>删除</a>
                                                </td>
                                            </tr>
                                            <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="panel-footer panel-footer-table text-right">
                                    <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination>
                                </div>
                                <!--panel-footer end -->
                            </div>
                        </div>
                    </div>
                </div>
                `
        })

        //新增、详情、修改模态框
        function model(type, id) {
          if (type !== 'add') {
            $.ajax({
              type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
              url: queryFQCTemplateUrl,
              data: { templateId: id },
              success: function (result, status, xhr) {
                if (result.status === 0) {
                  Vue.set(addFinaltemplateModal, 'fqcTemplate', result.map.fqcTemplate)

                  var data = {
                    quality_fqc_template_id: result.map.fqcTemplate.quality_fqc_template_id,
                    quality_fqc_template_name: result.map.fqcTemplate.quality_fqc_template_name,
                    quality_fqc_template_type: result.map.fqcTemplate.quality_fqc_template_type,
                  }
                  Vue.set(addFinaltemplateModal, 'fQCInformation', data)
                  var project = []
                  result.map.fqcTemplate.templateProjectList.forEach((value, index) => {
                    project.push({
                      quality_project_id: value.qualityTypeProject.quality_project_id,
                      quality_fqc_project_aql_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion,
                      quality_fqc_project_check_method: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method,
                      quality_fqc_project_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion,
                      quality_fqc_project_il_criterion: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion,
                      quality_fqc_project_standard_id: value.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_standard_id,
                    })
                    result.map.fqcTemplate.templateProjectList[index].quality_project_id = value.qualityTypeProject.quality_project_id
                  })
                  Vue.set(addFinaltemplateModal, 'templateProjectList', result.map.fqcTemplate.templateProjectList)
                  Vue.set(addFinaltemplateModal, 'templateProjectList2', result.map.fqcTemplate.templateProjectList)
                  Vue.set(addFinaltemplateModal, 'fqcProjectStandardJsonStr', project)
                  Vue.set(addFinaltemplateModal.fQCTemplates, 'quality_fqc_template_name', result.map.fqcTemplate.quality_fqc_template_name)
                  Vue.set(addFinaltemplateModal.fQCTemplates, 'quality_fqc_template_type', result.map.fqcTemplate.quality_fqc_template_type)
                  Vue.set(addFinaltemplateModal.fQCTemplates, 'quality_fqc_template_number', result.map.fqcTemplate.quality_fqc_template_number)
                } else {
                  Vue.set(addFinaltemplateModal, 'fqcTemplate', [])
                  Vue.set(addFinaltemplateModal, 'templateProjectList', [])
                }
              }
            })
          }
          let addFinaltemplateModal = new Vue({
            el: '#addFinaltemplateModal',
            data() {
              return {
                add: false,
                modificationModel: false,
                details: false,
                fqcTemplate: [], //基础信息
                templateProjectList: [], //检验内容
                templateProjectList2: [], //检验内容
                fQCInformation: [], //修改模板发送的ajax数据
                headText: '出货报告模板', //模态框标题
                fQCTemplates: {
                  quality_fqc_template_name: '',
                  quality_fqc_template_type: '',
                  quality_fqc_template_number: ''
                },
                qualityProjectIds: [],
                fqcProjectStandardJsonStr: [],
              }
            },
            methods: {
              //点击增加项目事件
              addProject() {
                let promise = new Promise((resolve, reject) => {
                  iqcProject(resolve, null, null, this.templateProjectList, '')
                })
                promise.then((resolveData) => {
                  resolveData.forEach((val, key) => {
                    this.templateProjectList.push(val)
                    this.qualityProjectIds.push(val.quality_type_project_id)
                    this.fqcProjectStandardJsonStr.push({
                      quality_project_id: val.quality_project_id,
                      quality_fqc_project_aql_criterion: '',
                      quality_fqc_project_check_method: '',
                      quality_fqc_project_criterion: '',
                      quality_fqc_project_il_criterion: '',
                    })
                  })
                })
              },
              //点击项目移除事件
              deletes(index) {
                swal({
                  title: '您确定要移除此条数据吗？',
                  text: '数据移除后无法恢复',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  this.templateProjectList.splice(index, 1)
                  this.qualityProjectIds.splice(index, 1)
                  this.fqcProjectStandardJsonStr.splice(index, 1)
                })
              },
              submit() {
                //    for(var val in this.fQCTemplates){
                //        console.log(this.fQCTemplates[val])
                //    }
                var fqcProjectStandardJsonStr = false
                this.fqcProjectStandardJsonStr.forEach((value, key) => {
                  for (var val in value) {
                    if (value[val] == '') {
                      fqcProjectStandardJsonStr = true
                    }
                  }
                })

                if (this.fQCTemplates.quality_fqc_template_name == '') {
                  this.$message.error({
                    message: '模板名称未添加',
                    type: 'warning'
                  })
                } else if (this.fQCTemplates.quality_fqc_template_type == '') {
                  this.$message.error({
                    message: '模板类型未选择',
                    type: 'warning'
                  })
                } else if (this.fQCTemplates.quality_fqc_template_number == '') {
                  this.$message.error({
                    message: '模板编号未选择',
                    type: 'warning'
                  })
                } else if (this.templateProjectList.length == 0) {
                  this.$message.error({
                    message: '检验内容未添加',
                    type: 'warning'
                  })
                } else if (fqcProjectStandardJsonStr) {
                  this.$message.error({
                    message: '检验内容有数据未填写',
                    type: 'warning'
                  })
                } else {
                  swal({
                    title: '您确定要提交本次操作吗?',
                    text: '请确保填写信息无误后点击确定按钮',
                    type: 'question',
                    allowEscapeKey: false, // 用户按esc键不退出
                    allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
                    showCancelButton: true, // 显示用户取消按钮
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                    if (type == 'add') {
                      $.ajax({
                        type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        url: saveFQCTemplateUrl,
                        data: {
                          'type': 'Newlyadd',
                          'quality_fqc_template_name': this.fQCTemplates.quality_fqc_template_name,
                          'quality_fqc_template_type': this.fQCTemplates.quality_fqc_template_type,
                          'quality_fqc_template_number': this.fQCTemplates.quality_fqc_template_number,
                          qualityProjectIds: this.qualityProjectIds,
                          fqcProjectStandardJsonStr: JSON.stringify(this.fqcProjectStandardJsonStr)
                        },
                        success: function (result, status, xhr) {
                          if (result.status === 0) {
                            queryFun(queryFQCTemplateUrl, { headNum: 1 })
                            const modal = document.getElementById('addFinaltemplateModal')   //模态框
                            swallSuccess2(modal)	//操作成功提示并刷新页面
                          } else {
                            swallFail2(result.msg);	//操作失败
                          }
                        }
                      })
                    } else {
                      var data = []
                      this.templateProjectList.forEach((val, key) => {
                        this.templateProjectList2.forEach((value, index) => {
                          if (val.quality_project_id !== value.quality_project_id) {
                            data.push(false)
                          }
                        })
                      })
                      // if (!data.length) {
                        $.ajax({
                          type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                          url: modifyFQCTemplateUrl,
                          data: {
                            'quality_fqc_template_id': id,
                            'quality_fqc_template_name': this.fQCTemplates.quality_fqc_template_name,
                            'quality_fqc_template_type': this.fQCTemplates.quality_fqc_template_type,
                            'quality_fqc_template_number': this.fQCTemplates.quality_fqc_template_number,
                            fqcProjectStandardJsonStr: JSON.stringify(this.fqcProjectStandardJsonStr)
                          },
                          success: function (result, status, xhr) {
                            if (result.status === 0) {
                              queryFun(queryFQCTemplateUrl, { headNum: 1 })
                              const modal = document.getElementById('addFinaltemplateModal')   //模态框
                              swallSuccess2(modal)	//操作成功提示并刷新页面
                            } else {
                              swallFail2(result.msg);	//操作失败
                            }
                          }
                        })
                      // } else {
                        // $.ajax({
                        //   type: "POST", dataType: "json", xhrFields: { withCredentials: true }, crossDomain: true,
                        //   url: saveFQCTemplateUrl,
                        //   data: {
                        //     'type': 'olderadd',
                        //     'quality_fqc_template_name': this.fQCTemplates.quality_fqc_template_name,
                        //     'quality_fqc_template_type': this.fQCTemplates.quality_fqc_template_type,
                        //     'quality_fqc_template_number': this.fQCTemplates.quality_fqc_template_number,
                        //     qualityProjectIds: this.qualityProjectIds,
                        //     fqcProjectStandardJsonStr: JSON.stringify(this.fqcProjectStandardJsonStr)
                        //   },
                        //   success: function (result, status, xhr) {
                        //     if (result.status === 0) {
                        //       queryFun(queryFQCTemplateUrl, { headNum: 1 })
                        //       const modal = document.getElementById('addFinaltemplateModal')   //模态框
                        //       swallSuccess2(modal)	//操作成功提示并刷新页面
                        //     } else {
                        //       swallFail2(result.msg);	//操作失败
                        //     }
                        //   }
                        // })
                      // }
                    }
                  })
                }
              }

            },
            watch: {
              fQCTemplates: {
                handler: function (val, oldVal) {
                },
                deep: true
              },
              deep: true
            },
            mounted() {
              const modal = document.getElementById('addFinaltemplateModal')   //模态框
              $(modal).modal({
                backdrop: 'static', // 黑色遮罩不可点击
                keyboard: false,  // esc按键不可关闭模态框
                show: true     //显示
              })
            },
            created() {
              if (type == 'modificationModel') {
                this.headText = '修改出货报告模板'
                this.modificationModel = true
              } else if (type == 'add') {
                this.headText = '新增出货报告模板'
                this.add = true
              } else if (type == 'details') {
                this.details = true
              }
            },

            template: `
                    <div class="modal fade" id="addFinaltemplateModal">
                        <div class="modal-dialog modal-lg">
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
                                            <div class="col-sm-12">
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">基础信息</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:20%">模板名称</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCTemplates.quality_fqc_template_name">
                                                                    </td>
                                                                    <td style="width:30%" v-show="details">{{fqcTemplate.quality_fqc_template_name}}</td>

                                                                    <th style="width:20%">模板编号</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fQCTemplates.quality_fqc_template_number">
                                                                    </td>
                                                                    <td style="width:30%" v-show="details">{{fqcTemplate.quality_fqc_template_number}}</td>
                                                                </tr>

                                                                <tr>
                                                                    <th style="width:20%">模板类型</th>
                                                                    <td class="table-input-td" style="width:30%" v-show="add">
                                                                        <select class="form-control" v-model="fQCTemplates.quality_fqc_template_type">
                                                                            <option disabled value="">请选择(必选)</option>
                                                                            <option value="CELL">CELL</option>
                                                                            <option value="PACK">PACK</option>
                                                                        </select>
                                                                    </td>
                                                                    <td style="width:30%" v-show="!add">{{fqcTemplate.quality_fqc_template_type}}</td>

                                                                    <th style="width:20%">{{add ? '' : '版本'}}</th>
                                                                    <td style="width:30%">{{fqcTemplate.quality_fqc_template_edittion}}</td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                                <div class="panel panel-default">
                                                    <div class="panel-heading panel-heading-table">
                                                        <div class="row">
                                                            <div class="col-xs-4">
                                                                <h5 class="panel-title">检验内容</h5>
                                                            </div>
                                                            <div class="col-xs-8">
                                                                <form class="form-inline pull-right">
                                                                    <button type="button" class="btn btn-primary btn-sm" @click="addProject()" v-show="!details">增加项目</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <table class="table table-bordered table-condensed">
                                                            <tbody>
                                                                <tr>
                                                                    <th style="width:8%">序号</th>
                                                                    <th style="width:15%">检验项目</th>
                                                                    <th style="width:15%">检验标准</th>
                                                                    <th style="width:15%">判定标准(IL)</th>
                                                                    <th style="width:15%">判定标准(AQL)</th>
                                                                    <th style="width:15%">测试方法</th>
                                                                    <th style="width:12%" v-show="!details">操作</th>
                                                                </tr>
                                                                <tr v-show="!templateProjectList.length"><td colspan=15 class="text-center text-warning">待加...</td></tr>
                                                                <tr v-for="(val, index) in templateProjectList">
                                                                    <td>{{index+1}}</td>

                                                                    <td v-if="add">{{val.qualityProjects.quality_project_name}}</td>
                                                                    <td v-if="!add">{{val.qualityTypeProject ? val.qualityTypeProject.qualityProjects.quality_project_name : val.qualityProjects.quality_project_name}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_il_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_il_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_aql_criterion">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_aql_criterion : ''}}</td>

                                                                    <td class="table-input-td" v-if="!details">
                                                                        <input type="text" class="table-input" placeholder="请输入(必填)" autocomplete="on" v-model="fqcProjectStandardJsonStr[index].quality_fqc_project_check_method">
                                                                    </td>
                                                                    <td v-if="details">{{val.qualityTypeProject.qualityProjects.fqcProjectStandardList.length !== 0 ? val.qualityTypeProject.qualityProjects.fqcProjectStandardList[0].quality_fqc_project_check_method : ''}}</td>
                                                                    <td class="table-input-td" v-if="!details">
                                                                        <a class="table-link text-danger" href="javascript:;" @click="deletes(index)">
                                                                            <i class="fa fa-times"></i>移除</a>
                                                                    </td>
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
                                            <button class="btn btn-primary modal-submit" @click="submit()">确认提交</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
          })
        }

      }
        break;
    }
  })
  leftNavLink.eq(1).trigger('click');

})

