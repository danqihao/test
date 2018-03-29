$(function () {
    
      let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
        leftNavLink = leftNav.find('a').filter('[href^="#"]'), // 左侧变栏对应的swiper
        workOrderNum=0,forwardDirectionNum=0,reverseNum=0
        //让vue实例只执行一次
      $('.treeview').click(function(){
          if($(this).index() === 0){
              workOrderNum++
          }else if($(this).index() === 1){
              forwardDirectionNum++
          }else if($(this).index() === 2){
              reverseNum++
          }
      })
      leftNavLink.on('click', function (event) {
          let targetHref = event.currentTarget.getAttribute('href');
          
          switch (targetHref) {
              case '#workOrderAscend': {
                  //主页加载
                  function run(){
                      let panelBodyTableVM = new Vue({
                          el:'#workOrderAscend',
                          data(){
                              return{
                                  inquireShow:false, //搜索框是否隐藏条件
                                  productionShow:false, //是否显示生产计划条件
                                  workOrderAdministration:false,  //是否显示工单信息条件
                              }
                          },
                          methods:{
                              //点击更多查询条件显示查询信息
                              search(){
                                  this.productionShow = true
                              },
                              //工单详情
                              workOrderModel(){
                                  workOrderDetailsModel()
                              },
                              //pqc模态框
                              pqcDetailsModel(){
                                  pqcModal()
                              },
                              //生产计划详情模态框
                              productionPlanDetails(){
                                  productionPlanDetailsModel()
                              },
                              inquireShows(){
                                  console.log(11)
                              }
                          },
                          template:`
                          <div id="workOrderAscend" class="swiper-slide">
                              <!-- 右侧外部swiper -->
  
                              <div class="container-fluid">
                                  <div class="row">
                                      <div class="content-header">
                                          <div class="col-xs-10">
                                              <div class="content-header-tab">
                                                  <div class="tab-logo">
                                                      <i class="fa fa-window-restore"></i>
                                                  </div>
                                                  <div class="tab-body">
                                                      <div class="tab-title">
                                                          <p>工单追溯</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
  
                              <div class="container-fluid">
                                  <div class="content-body swiper-container">
                                      <div class="swiper-wrapper">
                                          <div class="swiper-slide swiper-no-swiping" id="workOrderAscendInerSwiper">
                                              <!-- 右侧内部swiper -->
                                              <div class="row">
                                                  <div class="col-sm-12">
                                                      <!-- 搜索框 -->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-2">
                                                                      <h5 class="panel-title">输入查询条件：</h5>
                                                                  </div>
                                                                  <div class="col-xs-10">
                                                                      <form class="form-inline pull-right">
                                                                          <fieldset>
                                                                          <!--<a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">班次</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">环境</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">人员</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">设备</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">物料</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">产出物</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">测试记录</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">工艺名称</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">维修记录编号</a>
                                                                              <a href="javascript:;" class="btn btn-primary btn-sm head-main-btn-1">工单执行时间</a>-->
                                                                          </fieldset>
                                                                      </form>
                                                                      <el-dropdown class="pull-right"> 
                                                                          <el-button size="small" split-button type="primary" >
                                                                          增加搜索条件<i class="el-icon-arrow-down el-icon--right"></i>
                                                                          </el-button>
                                                                          <el-dropdown-menu slot="dropdown" command="inquireShows()">
                                                                              <el-dropdown-item>班次</el-dropdown-item>
                                                                              <el-dropdown-item>环境</el-dropdown-item>
                                                                              <el-dropdown-item>人员</el-dropdown-item>
                                                                              <el-dropdown-item>设备</el-dropdown-item>
                                                                              <el-dropdown-item>物料</el-dropdown-item>
                                                                              <el-dropdown-item>产出物</el-dropdown-item>
                                                                              <el-dropdown-item>测试记录</el-dropdown-item>
                                                                              <el-dropdown-item>工艺名称</el-dropdown-item>
                                                                              <el-dropdown-item>维修记录编号</el-dropdown-item>
                                                                              <el-dropdown-item>工单执行时间</el-dropdown-item>
                                                                          </el-dropdown-menu>
                                                                      </el-dropdown>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <!--panel-heading end -->
                                                          <div class="panel-body-table table-height" style="padding:5px">
                                                              <div class="row"> 
                                                                  <div class="col-md-4">
                                                                      <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                          <label class="control-label" style="width:105px">生产计划批次号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-4">
                                                                      <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                          <label class="control-label" style="width:105px">订单编号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-4">
                                                                      <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                          <label class="control-label" style="width:105px">工单号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>  
                                                                      
                                                              </div>
                                                              <!--<div class="row" style="padding-top:10px"> 
                                                                  <div class="col-xs-12">
                                                                      <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                          <label class="control-label">查询时间：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="起始时间" maxlength="25"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                          </div>
                                                                      </form>
                                                                      <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="终止时间" maxlength="25"  onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                          </div>
                                                                      </form>
                                                                      
                                                                  </div>
                                                              </div>-->
                                                             
                                                              <transition name="fade">
                                                                  <div v-show="inquireShow" style="overflow:hidden">
                                                                  <el-collapse>
                                                                      <!--产出物：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">产出物</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">产出物名称：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">产出物编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--人员：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                              <span style="font-size:15px">人员</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">生产计划创建人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">生产计划负责人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">生产计划审核人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">工单创建人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">工单负责人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">工序负责人：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">投料人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">领料人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">补料人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">物料调批人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">产出物记录人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">报废品记录人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">设备操作人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">不良品记录人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">不良品处理人员：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--设备：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                              <span style="font-size:15px">设备</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">设备名称：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">设备编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--物料：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                              <span style="font-size:15px">物料</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">物料名称：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">物料编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">领料批次号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">物料批次号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">BOM名称：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">BOM版本号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--测试记录：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">测试记录</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">IQC编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">PQC编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">FQC编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--工艺名称：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">工艺名称</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">工艺名称：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">工艺版本号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--维修记录编号：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">维修记录编号</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-4">
                                                                                  <form class="form-inline text-center" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:105px">维修记录编号：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--班次：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">班次</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-2 col-xs-2">
                                                                                   <h5 class="modal-title text-center" style="font-size:16px">班次：</h5>
                                                                              </div>
                                                                              <div class="col-md-2 col-xs-5">
                                                                              
                                                                                      <select class="form-control">  
                                                                                          <option value="">未选择</option>
                                                                                          <option value="0">合格</option>
                                                                                          <option value="1">不合格</option>
                                                                                      </select>
                                                                              
                                                                              </div>
                                                                              <div class="col-md-2 col-xs-2">
                                                                                  <h5 class="modal-title text-center" style="font-size:16px">车间：</h5>
                                                                              </div>
                                                                              <div class="col-md-2 col-xs-5">
                                                                              
                                                                                      <select class="form-control">  
                                                                                          <option value="">未选择</option>
                                                                                          <option value="0">合格</option>
                                                                                          <option value="1">不合格</option>
                                                                                      </select>
                                                                                  
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--环境：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">环境</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-1">
                                                                              </div>
                                                                              <div class="col-md-5">
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:80px">温度：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="温度上限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label">~</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="温度下限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-5">
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:80px">湿度：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="湿度上限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label">~</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="湿度下限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                          <div class="row" style="padding-top:10px"> 
                                                                              <div class="col-md-1">
                                                                              </div>
                                                                              <div class="col-md-5">
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:80px">清洁度：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="清洁度上限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label">~</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="清洁度下限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                              <div class="col-md-5">
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:80px">露点：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="露点上限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label">~</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="露点下限" maxlength="25" />
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                      <!--工单执行时间：-->
                                                                      <el-collapse-item>
                                                                          <template slot="title">
                                                                             <span style="font-size:15px">工单执行时间</span>
                                                                          </template>
                                                                          <div class="row"> 
                                                                              <div class="col-md-1"></div>
                                                                              <div class="col-md-5">
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label" style="width:80px">执行时间：</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="起始时间" maxlength="25" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                                      </div>
                                                                                  </form>
                                                                                  <form class="form-inline pull-left" action="" onsubmit="return false;">
                                                                                      <label class="control-label">至</label>
                                                                                      <div class="input-group input-group-sm fuzzy-search-group">
                                                                                          <input class="form-control" type="text" placeholder="终止时间" maxlength="25" onclick="WdatePicker({startDate:'%y-%M-01 00:00:00',dateFmt:'yyyy-MM-dd HH:mm:ss',alwaysUseStartDate:true})">
                                                                                      </div>
                                                                                  </form>
                                                                              </div>
                                                                          </div>
                                                                      </el-collapse-item>
                                                                  </el-collapse>
                                                                  </div>
                                                              </transition>
                                                              <div class="row" style="padding-top:15px"> 
                                                                  <div class="col-xs-12 text-center">
                                                                      <button class="btn btn-primary modal-submit" @click="search()">确认查询</button>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      
                                                          <!--panel-footer end -->
                                                      </div>
                                                      <!-- 生产计划 -->
                                                      <transition name="search">
                                                          <div class="panel panel-default" v-if="productionShow">
                                                              <div class="panel-heading panel-heading-table">
                                                                  <div class="row">
                                                                      <div class="col-xs-6">
                                                                          <h5 class="panel-title">生产计划</h5>
                                                                      </div>
                                                                      <div class="col-xs-6">
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <!--panel-heading end -->
                                                              <div class="vueel">
                                                                  <div class="panel-body-table table-height">
                                                                      <table class="table  table-bordered table-hover table-condensed">
                                                                          <thead>
                                                                              <tr>
                                                                                  <th style="width: 15%;">订单编号</th>
                                                                                  <th style="width: 15%;">生产批号</th>
                                                                                  <th style="width: 15%;">订单生产数</th>
                                                                                  <th style="width: 15%;">生产状态</th>
                                                                                  <th style="width: 15%;">操作</th>
                                                                              </tr>
                                                                          </thead>
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">A001</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">20171129</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">2000</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">已完成</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" @click="productionPlanDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                              <!-- 工单信息 -->
                                                                              <tr>
                                                                                  <td colspan=15 style="padding:0">
                                                                                      <transition name="workOrderFade">
                                                                                          <div class="panel panel-default" v-if="workOrderAdministration" style="overflow:hidden">
                                                                                              <div class="panel-heading panel-heading-table">
                                                                                                  <div class="row">
                                                                                                      <div class="col-xs-6">
                                                                                                          <h5 class="panel-title">工单信息</h5>
                                                                                                      </div>
                                                                                                      <div class="col-xs-6">
                                                                                                          <form class="form-inline pull-right" action="">
                                                                                                              <!--搜索框 -->
                                                                                                              <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                  <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                                                  <div class="input-group-btn">
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
                                                                                              <div class="vueel">
                                                                                                  <div class="panel-body-table table-height-10">
                                                                                                      <table class="table  table-bordered table-hover table-condensed">
                                                                                                          <thead>
                                                                                                              <tr>
                                                                                                                  <th style="width: 5%;">序号</th>
                                                                                                                  <th style="width: 10%;">工单编号</th>
                                                                                                                  <th style="width: 10%;">工序</th>
                                                                                                                  <th style="width: 10%;">产出物</th>
                                                                                                                  <th style="width: 10%;">产出数量</th>
                                                                                                                  <th style="width: 10%;">完成时间</th>
                                                                                                                  <th style="width: 10%;">不良数</th>
                                                                                                                  <th style="width: 10%;">不良率</th>
                                                                                                                  <th style="width: 15%;">操作</th>
                                                                                                              </tr>
                                                                                                          </thead>
                                                                                                          <tbody>
                                                                                                              <tr>
                                                                                                                  <td>1</td>
                                                                                                                  <td>gd025</td>
                                                                                                                  <td>搅拌</td>
                                                                                                                  <td>电池01</td>
                                                                                                                  <td>2000</td>
                                                                                                                  <td>2018.1.1</td>
                                                                                                                  <td>40</td>
                                                                                                                  <td>40%</td>
                                                                                                                  <td class="table-input-td">
                                                                                                                      <a class="table-link" @click="workOrderModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                                                                      <a class="table-link" @click="pqcDetailsModel()" href="javascript:;"><i class="fa fa-pencil-square-o"></i>PQC详情</a>
                                                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-pencil-square-o"></i>生产过程详情</a>
                                                                                                                  </td>
                                                                                                              </tr>
                                                                                                          </tbody>
                                                                                                      </table>
                                                                                                  </div>
                                                                                                  <div class="panel-footer panel-footer-table text-center">
                                                                                                      <ul class="pagination pagination-sm pull-right">
                                                                                                      </ul>
                                                                                                  </div>
                                                                                              </div>
                                                                                              <!--panel-footer end -->
                                                                                          </div>
                                                                                      </transition>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                          <tbody style="border:none">
                                                                              <tr>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">A001</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">20171129</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">2000</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">已完成</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                              <!-- 工单信息 -->
                                                                              <tr>
                                                                                  <td colspan=15 style="padding:0">
                                                                                      <div class="panel panel-default" v-if="false">
                                                                                          <div class="panel-heading panel-heading-table">
                                                                                              <div class="row">
                                                                                                  <div class="col-xs-6">
                                                                                                      <h5 class="panel-title">工单信息</h5>
                                                                                                  </div>
                                                                                                  <div class="col-xs-6">
                                                                                                      <form class="form-inline pull-right" action="">
                                                                                                          <!--搜索框 -->
                                                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                                              <div class="input-group-btn">
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
                                                                                          <div class="vueel">
                                                                                              <div class="panel-body-table table-height-10">
                                                                                                  <table class="table  table-bordered table-hover table-condensed">
                                                                                                      <thead>
                                                                                                          <tr>
                                                                                                              <th style="width: 5%;">序号</th>
                                                                                                              <th style="width: 10%;">工单编号</th>
                                                                                                              <th style="width: 10%;">工序</th>
                                                                                                              <th style="width: 10%;">产出物</th>
                                                                                                              <th style="width: 10%;">产出数量</th>
                                                                                                              <th style="width: 10%;">完成时间</th>
                                                                                                              <th style="width: 10%;">不良数</th>
                                                                                                              <th style="width: 10%;">不良率</th>
                                                                                                              <th style="width: 15%;">操作</th>
                                                                                                          </tr>
                                                                                                      </thead>
                                                                                                      <tbody>
                                                                                                          <tr>
                                                                                                              <td>1</td>
                                                                                                              <td>gd025</td>
                                                                                                              <td>搅拌</td>
                                                                                                              <td>电池01</td>
                                                                                                              <td>2000</td>
                                                                                                              <td>2018.1.1</td>
                                                                                                              <td>40</td>
                                                                                                              <td>40%</td>
                                                                                                              <td class="table-input-td">
                                                                                                                  <a class="table-link" data-toggle-modal-target="#workOrderParticulars" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                                                                  <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-pencil-square-o"></i>PQC详情</a>
                                                                                                                  <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-pencil-square-o"></i>生产过程详情</a>
                                                                                                              </td>
                                                                                                          </tr>
                                                                                                      </tbody>
                                                                                                  </table>
                                                                                              </div>
                                                                                              <div class="panel-footer panel-footer-table text-center">
                                                                                                  <ul class="pagination pagination-sm pull-right">
                                                                                                  </ul>
                                                                                              </div>
                                                                                          </div>
                                                                                          <!--panel-footer end -->
                                                                                      </div>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                          <tbody style="border:none">
                                                                              <tr>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">A001</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">20171129</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">2000</td>
                                                                                  <td @click="workOrderAdministration = !workOrderAdministration" style="cursor: pointer;">已完成</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </div>
                                                              </div>
                                                              <!--panel-footer end -->
                                                          </div>
                                                      </transition>
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
                  if(workOrderNum < 1){
                      run()
                  }
              }
              break;
              case '#forwardDirectionAscend': {
                  function run(){
                      let panelBodyTableVM = new Vue({
                          el:'#forwardDirectionAscend',
                          data(){
                              return{
                                  finishedShow:false, //成品信息是否隐藏条件
                                  finishedShow2:false, //成品信息是否隐藏条件
                              }
                          },
                          methods:{
                              //生产详情模态框
                              productionDetails(){
                                  productionDetailsModel()
                              },
                              //fqc模态框
                              fqcDetailsModel(){
                                  fqcModel()
                              },
                              //pqc模态框
                              pqcDetailsModel(){
                                  pqcModal()
                              },
                              //生产计划详情模态框
                              productionPlanDetails(){
                                  productionPlanDetailsModel()
                              }
                          },
                          template:`
                          <div id="forwardDirectionAscend" class="swiper-slide">
                              <!-- 右侧外部swiper -->
  
                              <div class="container-fluid">
                                  <div class="row">
                                      <div class="content-header">
                                          <div class="col-xs-10">
                                              <div class="content-header-tab">
                                                  <div class="tab-logo">
                                                      <i class="fa fa-window-restore"></i>
                                                  </div>
                                                  <div class="tab-body">
                                                      <div class="tab-title">
                                                          <p>正向追溯</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
  
                              <div class="container-fluid">
                                  <div class="content-body swiper-container">
                                      <div class="swiper-wrapper">
                                          <div class="swiper-slide swiper-no-swiping" id="forwardDirectionAscendInerSwiper">
                                              <!-- 右侧内部swiper -->
                                              <div class="row">
                                                  <div class="col-sm-12">
                                                      <!-- 搜索框 -->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-6">
                                                                      <h5 class="panel-title">输入查询条件：</h5>
                                                                  </div>
                                                                  <div class="col-xs-6">
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <!--panel-heading end -->
                                                          <div class="panel-body-table table-height" style="padding:5px">
                                                              <div class="row"> 
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">物料编号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">物料批号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-4 col-xs-6">
                                                                  </div>
                                                                  <div class="col-md-1 col-xs-2 text-center">
                                                                      <button class="btn btn-primary modal-submit" @click="finishedShow=true">查询</button>
                                                                  </div>  
                                                              </div>
                                                              <div class="row" style="padding-top:10px"> 
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">BOM名称：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">BOM版本：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-4 col-xs-6">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">到</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="终止时间" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">时间：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="起始时间" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-1 col-xs-2 text-center">
                                                                      <button class="btn btn-primary modal-submit" @click="finishedShow=true">查询</button>
                                                                  </div>  
                                                                      
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <!-- 成品批次信息 -->
                                                      <transition name="search">
                                                          <div class="panel panel-default" v-if="finishedShow">
                                                              <div class="panel-heading panel-heading-table">
                                                                  <div class="row">
                                                                      <div class="col-xs-6">
                                                                          <h5 class="panel-title">成品批次信息</h5>
                                                                      </div>
                                                                      <div class="col-xs-6">
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <!--panel-heading end -->
                                                              <div class="vueel">
                                                                  <div class="panel-body-table table-height">
                                                                      <table class="table  table-bordered table-hover table-condensed">
                                                                          <thead>
                                                                              <tr>
                                                                                  <th style="width: 15%;">生产计划批次号</th>
                                                                                  <th style="width: 15%;">成品数量</th>
                                                                                  <th style="width: 15%;">单位</th>
                                                                                  <th style="width: 15%;">不良数</th>
                                                                                  <th style="width: 15%;">不良率</th>
                                                                                  <th style="width: 15%;">操作</th>
                                                                              </tr>
                                                                          </thead>
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">A001</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">500</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">箱</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">1000</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">10%</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" @click="productionPlanDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产计划详情</a>
                                                                                      <a class="table-link" @click="pqcDetailsModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                                      <a class="table-link" @click="fqcDetailsModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>FQC详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td colspan=15 style="padding:0">
                                                                                      <transition name="workOrderFade">
                                                                                      <!-- 成品信息 -->
                                                                                          <div class="panel panel-default" v-if="finishedShow2" style="overflow:hidden">
                                                                                              <div class="panel-heading panel-heading-table">
                                                                                                  <div class="row">
                                                                                                      <div class="col-xs-6">
                                                                                                          <h5 class="panel-title">成品信息</h5>
                                                                                                      </div>
                                                                                                      <div class="col-xs-6">
                                                                                                          <form class="form-inline pull-right" action="">
                                                                                                              <!--搜索框 -->
                                                                                                              <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                  <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                                                  <div class="input-group-btn">
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
                                                                                              <div class="vueel">
                                                                                                  <div class="panel-body-table table-height-10">
                                                                                                      <table class="table  table-bordered table-hover table-condensed">
                                                                                                          <thead>
                                                                                                              <tr>
                                                                                                                  <th style="width: 5%;">序号</th>
                                                                                                                  <th style="width: 10%;">成品名称</th>
                                                                                                                  <th style="width: 10%;">成品编号</th>
                                                                                                                  <th style="width: 10%;">规格</th>
                                                                                                                  <th style="width: 10%;">型号</th>
                                                                                                                  <th style="width: 10%;">产出时间</th>
                                                                                                                  <th style="width: 15%;">操作</th>
                                                                                                              </tr>
                                                                                                          </thead>
                                                                                                          <tbody>
                                                                                                              <tr>
                                                                                                                  <td>1</td>
                                                                                                                  <td>电池001</td>
                                                                                                                  <td>dc20180101</td>
                                                                                                                  <td>A001</td>
                                                                                                                  <td>Z-1</td>
                                                                                                                  <td>2018.1.10</td>
                                                                                                                  <td class="table-input-td">
                                                                                                                      <a class="table-link" @click="productionDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产详情</a>
                                                                                                                  </td>
                                                                                                              </tr>
                                                                                                          </tbody>
                                                                                                      </table>
                                                                                                  </div>
                                                                                                  <div class="panel-footer panel-footer-table text-center">
                                                                                                      <ul class="pagination pagination-sm pull-right">
                                                                                                      </ul>
                                                                                                  </div>
                                                                                              </div>
                                                                                              <!--panel-footer end -->
                                                                                          </div>
                                                                                      </transition>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                          <tbody style="border:none">
                                                                              <tr>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">A001</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">500</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">箱</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">1000</td>
                                                                                  <td @click="finishedShow2 = !finishedShow2" style="cursor: pointer;">10%</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产计划详情</a>
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>FQC详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </div>
                                                              </div>
                                                              <!--panel-footer end -->
                                                          </div>
                                                      </transition>
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
                  if(forwardDirectionNum < 1){
                      run()
                  }
                  //生产详情模态框
                  function productionDetailsModel(){
                      let productionDetails = new Vue({
                          el:'#productionDetails',
                          data(){
                              return{
                              }
                          },
                          methods:{
                              //查看参数详情模态框
                              // parameterDetails(){
                              //     parameterDetailsModel()
                              // },
                              //工单详情
                              workOrderModel(){
                                  workOrderDetailsModel()
                              },
                             //pqc模态框
                              pqcDetailsModel(){
                                  pqcModal()
                              },
                          },
                          //渲染结束后执行
                          mounted(){
                              const modal = document.getElementById('productionDetails')   //模态框
                              $(modal).modal({
                                  backdrop: 'static', // 黑色遮罩不可点击
                                  keyboard: false,  // esc按键不可关闭模态框
                                  show: true     //显示
                              })
                          },
                          template:`
                          <div class="modal fade" id="productionDetails">
                              <div class="modal-dialog modal-lg">
                                  <div class="modal-content">
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
                                                      <!-- 生产详情 -->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-4">
                                                                      <h5 class="panel-title">生产详情</h5>
                                                                  </div>
                                                                  <div class="col-xs-8">
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:14%">订单编号</th>
                                                                          <td style="width:19%">20171129</td>
                                                                          
                                                                          <th style="width:14%">订单生产数</th>
                                                                          <td style="width:19%">3000</td>
                                                                          
                                                                          <th style="width:14%">是否新产</th>
                                                                          <td style="width:19%">否</td>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">工艺</th>
                                                                          <td style="width:19%">A工艺</td>
                                                                          
                                                                          <th style="width:14%">工艺版本</th>
                                                                          <td style="width:19%">v-1.01</td>
                                                                          
                                                                          <th style="width:14%">生产批次</th>
                                                                          <td style="width:19%">2017.1.1</td>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">实际开始日期</th>
                                                                          <td style="width:19%">2017-10-30</td>
                                                                          
                                                                          <th style="width:14%">实际结束日期</th>
                                                                          <td style="width:19%">2017-11-30</td>
                                                                          
                                                                          <th style="width:14%">成品型号</th>
                                                                          <td style="width:19%">18650</td>
                                                                      </tr>
                                                                      
                                                                      <tr>
                                                                          <th style="width:14%">成品类型</th>
                                                                          <td style="width:19%">圆柱电池</td>
                                                                          
                                                                          <th style="width:14%">生产线</th>
                                                                          <td style="width:19%">电池制造线</td>
                                                                          
                                                                          <th style="width:14%">实际产出量</th>
                                                                          <td style="width:19%">3000</td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </div>
              
                                                      </div>
                                                      <!-- 工 序 -->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-4">
                                                                      <h5 class="panel-title">工 序</h5>
                                                                  </div>
                                                                  <div class="col-xs-8">
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:4%">序号</th>
                                                                          <th style="width:9%">工序名称</th>
                                                                          <th style="width:7%">级性</th>
                                                                          <th style="width:6%">版本</th>
                                                                          <th style="width:6%">优率</th>
                                                                          <th style="width:7%">产出量</th>
                                                                          <th style="width:7%">工序负责人</th>
                                                                          <th style="width:20%">操作</th>
                                                                      </tr>
                                                                      <tr>
                                                                          <td>1</td>
                                                                          <td>匀浆</td>
                                                                          <td>正极</td>
                                                                          <td>v-1.01</td>
                                                                          <td>95%</td>
                                                                          <td>3325</td>
                                                                          <td>张三</td>
                                                                          <td class="table-input-td">
                                                                              <a class="table-link" @click="workOrderModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                              <a class="table-link" @click="pqcDetailsModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                              <a class="table-link" @click="stepParameters()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产过程详情</a>
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
                                  </div>
                              </div>
                          </div>
                          `
                      })
                  }
                  //FQC模态框
                  function fqcModel(id){
                         
                      let addFinalQualityReportModal = new Vue({
                          el:'#addFinalQualityReportModal',
                          data(){
                              return {
                                  fqcReport:[], //基础信息
                                  fqcProjectResultList:[], //项目内容
                                  fqcUnqualifiedList:[], //综合结果
                              }
                          },
                          methods:{
                           
                          },
                          computed:{
                          },
                          mounted(){
                              const modal = document.getElementById('addFinalQualityReportModal')   //模态框
                              $(modal).modal({
                                  backdrop: 'static', // 黑色遮罩不可点击
                                  keyboard: false,  // esc按键不可关闭模态框
                                  show: true     //显示
                              })
                          },
                          filters:{
                              times(val){
                                  if(val !== '' && val !== null){
                                      return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                  }
                              }
                          },
                          created(){
                              // $.ajax({
                              //     type: "POST",
                              //     url: queryFQCReportUrl,
                              //     data:{reportId: id},
                              //     success:  (result, status, xhr) =>{
                              //         if(result.status === 0 ){
                              //             Vue.set(addFinalQualityReportModal,'fqcReport',result.map.fqcReport)
                              //             Vue.set(addFinalQualityReportModal,'fqcProjectResultList',result.map.fqcReport.fqcProjectResultList)
                              //             Vue.set(addFinalQualityReportModal,'fqcUnqualifiedList',result.map.fqcReport.fqcUnqualifiedList[0])
                              //         }
                              //     }
                              // })
                          },
                      
                          template:`
                          <div class="modal fade" id="addFinalQualityReportModal">
                              <div class="modal-dialog modal-lg">
                                  <div class="modal-content">
                                      <div class="modal-header">
                                          <button class="close" data-dismiss="modal">
                                              <span>
                                                  <i class="fa fa-close"></i>
                                              </span>
                                          </button>
                                          <h4 class="modal-title">FQC详情</h4>
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
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:14%">报告名称</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">报告类型</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">电池批号</th>
                                                                          <td style="width:19%"></td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style="width:14%">报检单号</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">报检日期</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">客户名称</th>
                                                                          <td style="width:19%"></td>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">电池型号</th>
                                                                          <td style="width:19%"></td>
                                                                          
                                                                          <th style="width:14%">容量档次</th>
                                                                          <td style="width:19%"></td>
                                                                      
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
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">不良数量</th>
                                                                          <td style="width:19%"></td>
                                                                          
                                                                          <th style="width:14%">不良率</th>
                                                                          <td style="width:19%"></td>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">报检数量</th>
                                                                          <td style="width:19%"></td>
                                                                          
  
                                                                          <th style="width:14%">检验人员</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">检验日期</th>
                                                                          <td style="width:19%"></td>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">审核人员</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">审查日期</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">综合判定</th>
                                                                          <td class="table-input-td" style="width:19%">
                                                                              <select class="form-control" disabled>  
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
  
                                                                      <tr>
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td class="table-input-td">
                                                                              <select class="form-control" disabled> 
                                                                                  <option value="-1">未选择</option>
                                                                                  <option value="0">合格</option>
                                                                                  <option value="1">不合格</option>
                                                                              </select>
                                                                          </td>
                                                                          
                                                                          <td></td>
  
                                                                          <td></td>
                                                                      </tr>
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
                          `
                      })
                  }
              }
              break;
              case '#reverseAscend': {
                  function run(){
                      let panelBodyTableVM = new Vue({
                          el:'#reverseAscend',
                          data(){
                              return{
                                  productionShow:false, //点击查询显示生产计划
                                  materialShow:false, //点击生产计划对应行显示物料
                              }
                          },
                          methods:{
                              //IQC详情
                              iqcDetails(){
                                  iqcModel()
                              },
                              //物料详情
                              materialDetails(){
                                  materialDetailsModel()
                              },
                              //生产计划详情模态框
                              productionPlanDetails(){
                                  productionPlanDetailsModel()
                              },
                              //工单详情
                              workOrderModel(){
                                  workOrderDetailsModel()
                              },
                             //pqc模态框
                              pqcDetailsModel(){
                                  pqcModal()
                              },
                          },
                          template:`
                          <div id="reverseAscend" class="swiper-slide">
                              <!-- 右侧外部swiper -->
  
                              <div class="container-fluid">
                                  <div class="row">
                                      <div class="content-header">
                                          <div class="col-xs-10">
                                              <div class="content-header-tab">
                                                  <div class="tab-logo">
                                                      <i class="fa fa-window-restore"></i>
                                                  </div>
                                                  <div class="tab-body">
                                                      <div class="tab-title">
                                                          <p>逆向追溯</p>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
  
                              <div class="container-fluid">
                                  <div class="content-body swiper-container">
                                      <div class="swiper-wrapper">
                                          <div class="swiper-slide swiper-no-swiping" id="reverseAscendInerSwiper">
                                              <!-- 右侧内部swiper -->
                                              <div class="row">
                                                  <div class="col-sm-12">
                                                      <!-- 搜索框 -->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-6">
                                                                      <h5 class="panel-title">输入查询条件：</h5>
                                                                  </div>
                                                                  <div class="col-xs-6">
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <!--panel-heading end -->
                                                          <div class="panel-body-table table-height" style="padding:5px">
                                                              <div class="row"> 
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">电芯批号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-3 col-xs-5">
                                                                      <form class="form-inline pull-right" action="" onsubmit="return false;">
                                                                          <label class="control-label">电芯编号：</label>
                                                                          <div class="input-group input-group-sm fuzzy-search-group">
                                                                              <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                          </div>
                                                                      </form>
                                                                  </div>
                                                                  <div class="col-md-4 col-xs-6">
                                                                  </div>
                                                                  <div class="col-md-1 col-xs-2 text-center">
                                                                      <button class="btn btn-primary modal-submit" @click="productionShow = true">查询</button>
                                                                  </div>  
                                                              </div>
                                                          </div>
                                                      </div>
                                                      <!-- 生产计划 -->
                                                      <transition name="search">
                                                          <div class="panel panel-default" v-if="productionShow">
                                                              <div class="panel-heading panel-heading-table">
                                                                  <div class="row">
                                                                      <div class="col-xs-6">
                                                                          <h5 class="panel-title">生产计划</h5>
                                                                      </div>
                                                                      <div class="col-xs-6">
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <!--panel-heading end -->
                                                              <div class="vueel">
                                                                  <div class="panel-body-table table-height">
                                                                      <table class="table  table-bordered table-hover table-condensed">
                                                                          <thead>
                                                                              <tr>
                                                                                  <th style="width: 15%;">订单编号</th>
                                                                                  <th style="width: 15%;">生产批号</th>
                                                                                  <th style="width: 15%;">订单生产数</th>
                                                                                  <th style="width: 15%;">生产状态</th>
                                                                                  <th style="width: 15%;">操作</th>
                                                                              </tr>
                                                                          </thead>
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">A001</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">20171129</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">2000</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">已完成</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" @click="productionPlanDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td colspan=15 style="padding:0">
                                                                                      <transition name="workOrderFade">
                                                                                          <div v-if="materialShow" style="overflow:hidden">
                                                                                              <!-- 物料信息 -->
                                                                                              <div class="panel panel-default" >
                                                                                                  <div class="panel-heading panel-heading-table">
                                                                                                      <div class="row">
                                                                                                          <div class="col-xs-6">
                                                                                                              <h5 class="panel-title">物料信息</h5>
                                                                                                          </div>
                                                                                                          <div class="col-xs-6">
                                                                                                              <form class="form-inline pull-right" action="">
                                                                                                                  <!--搜索框 -->
                                                                                                                  <div class="input-group input-group-sm fuzzy-search-group">
                                                                                                                      <input class="form-control" type="text" placeholder="输入关键字" maxlength="25" />
                                                                                                                      <div class="input-group-btn">
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
                                                                                                  <div class="vueel">
                                                                                                      <div class="panel-body-table table-height">
                                                                                                          <table class="table  table-bordered table-hover table-condensed">
                                                                                                              <thead>
                                                                                                                  <tr>
                                                                                                                      <th style="width: 5%;">序号</th>
                                                                                                                      <th style="width: 10%;">物料名称</th>
                                                                                                                      <th style="width: 10%;">物料编号</th>
                                                                                                                      <th style="width: 10%;">物料批次号</th>
                                                                                                                      <th style="width: 10%;">规格</th>
                                                                                                                      <th style="width: 10%;">型号</th>
                                                                                                                      <th style="width: 10%;">单位</th>
                                                                                                                      <th style="width: 15%;">操作</th>
                                                                                                                  </tr>
                                                                                                              </thead>
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td>1</td>
                                                                                                                      <td>石墨</td>
                                                                                                                      <td>v-1.01</td>
                                                                                                                      <td>2018.1.1</td>
                                                                                                                      <td>A001</td>
                                                                                                                      <td>Z-1</td>
                                                                                                                      <td>桶</td>
                                                                                                                      <td class="table-input-td">
                                                                                                                          <a class="table-link" @click="materialDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>物料详情</a>
                                                                                                                          <a class="table-link" @click="iqcDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>IQC详情</a>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </div>
                                                                                                      <div class="panel-footer panel-footer-table text-center">
                                                                                                          <ul class="pagination pagination-sm pull-right">
                                                                                                          </ul>
                                                                                                      </div>
                                                                                                  </div>
                                                                                                  <!--panel-footer end -->
                                                                                                  
                                                                                              </div>
                                                                                              <!-- 工序信息 -->
                                                                                              <div class="panel panel-default">
                                                                                                  <div class="panel-heading panel-heading-table">
                                                                                                      <div class="row">
                                                                                                          <div class="col-xs-6">
                                                                                                              <h5 class="panel-title">工序信息</h5>
                                                                                                          </div>
                                                                                                          <div class="col-xs-6">
                                                                                                          </div>
                                                                                                      </div>
                                                                                                  </div>
                                                                                                  <!--panel-heading end -->
                                                                                                  <div class="vueel">
                                                                                                      
                                                                                                      <div class="panel-body-table table-height">
                                                                                                          <table class="table  table-bordered table-hover table-condensed">
                                                                                                              <thead>
                                                                                                                  <tr>
                                                                                                                      <th style="width: 5%;">序号</th>
                                                                                                                      <th style="width: 10%;">工序名称</th>
                                                                                                                      <th style="width: 10%;">工序负责人</th>
                                                                                                                      <th style="width: 10%;">使用物料名称</th>
                                                                                                                      <th style="width: 10%;">物料编号</th>
                                                                                                                      <th style="width: 10%;">物料批次号</th>
                                                                                                                      <th style="width: 15%;">操作</th>
                                                                                                                  </tr>
                                                                                                              </thead>
                                                                                                              <tbody>
                                                                                                                  <tr>
                                                                                                                      <td rowspan="3">1</td>
                                                                                                                      <td rowspan="3">匀浆</td>
                                                                                                                      <td>张</td>
                                                                                                                      <td>石墨</td>
                                                                                                                      <td>v-1.01</td>
                                                                                                                      <td>2018.1.1</td>
                                                                                                                      <td class="table-input-td" rowspan="3">
                                                                                                                          <a class="table-link" @click="workOrderModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>工单详情</a>
                                                                                                                          <a class="table-link" @click="pqcDetailsModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>PQC详情</a>
                                                                                                                          <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>生产过程详情</a>
                                                                                                                      </td>
                                                                                                                  </tr>
                                                                                                                  <tr>
                                                                                                                      <td>张</td>
                                                                                                                      <td>石墨</td>
                                                                                                                      <td>v-1.01</td>
                                                                                                                      <td>2018.1.1</td>
                                                                                                                  </tr>
                                                                                                                  <tr>
                                                                                                                      <td>张</td>
                                                                                                                      <td>石墨</td>
                                                                                                                      <td>v-1.01</td>
                                                                                                                      <td>2018.1.1</td>
                                                                                                                  </tr>
                                                                                                              </tbody>
                                                                                                          </table>
                                                                                                      </div>
                                                                                                      <div class="panel-footer panel-footer-table text-center">
                                                                                                          <ul class="pagination pagination-sm pull-right">
                                                                                                          </ul>
                                                                                                      </div>
                                                                                                  </div>
                                                                                                  <!--panel-footer end -->
                                                                                              </div>
                                                                                          </div>
                                                                                      </transition>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                          <tbody style="border:none">
                                                                              <tr>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">A001</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">20171129</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">2000</td>
                                                                                  <td @click="materialShow = !materialShow" style="cursor: pointer;">已完成</td>
                                                                                  <td class="table-input-td">
                                                                                      <a class="table-link" data-toggle-modal-target="#addInQualityReportModal" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看计划详情</a>
                                                                                  </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </div>
                                                              </div>
                                                              <!--panel-footer end -->
                                                          </div>
                                                      </transition>
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
                  if(reverseNum < 1){
                      run()
                  }
                  //IQC详情
                  function iqcModel(id, materials){
                      let addInQualityReportModal = new Vue({
                          el:'#addInQualityReportModal',
                          data(){
                              return {
                                  iqcReports:[],//基础数据
                                  iqcRecords:[],//项目
                              }
                          },
                          mounted(){
                              const modal = document.getElementById('addInQualityReportModal')   //模态框
                              $(modal).modal({
                                  backdrop: 'static', // 黑色遮罩不可点击
                                  keyboard: false,  // esc按键不可关闭模态框
                                  show: true     //显示
                              })
                          },
                          created(){
                              // $.ajax({
                              //     type: "POST",
                              //     url: queryIQCReportRecordUrl,
                              //     data:{reportId: id},
                              //     success: (result, status, xhr) => {
                              //         if(result.status === 0 ){
                              //             this.iqcReports = result.map.iqcReports[0]
                              //             this.iqcRecords = result.map.iqcRecords
                              //         }else{
                              //             this.iqcReports = []
                              //             this.iqcRecords = []
                              //         }
                                      
                              //     }
                              // })
                          },
                          methods:{
                              //选择物料模板事件
                              material(){
                                  let promise = new Promise(function (resolve, reject) {
                                      materialModel(resolve,null,null)
                                  })
                                  promise.then( (resolveData) => {
                                      console.log(resolveData)
                                  })
                                  
                              },
                              //尺寸特性查看事件
                              examine(key,index){
                                  let promise = new Promise( (resolve, reject) => {
                                      sampling(resolve,this.iqcProjectResult[key][index].quality_iqc_project_number,this.iqcProjectResult[key][index].quality_iqc_project_value)
                                  })
                                  promise.then( (resolveData) => {
                                      this.iqcProjectResult[key][index].quality_iqc_project_average_value = resolveData.mean
                                      this.iqcProjectResult[key][index].quality_iqc_project_range = resolveData.ranges
                                      this.iqcProjectResult[key][index].quality_iqc_project_number = resolveData.samplingNumber
                                      this.iqcProjectResult[key][index].quality_iqc_project_value = resolveData.samplingValue
                                  })
                              },
                          },
                          filters:{
                              times(val){
                                  if(val !== '' && val !== null){
                                      return moment(val).format('YYYY-MM-DD HH:mm:ss')
                                  }
                              },
                              // quality_iqc_unqualified_probability(index){
                              //     if(addInQualityReportModal.iqcUnqualified[index].quality_sample_number !='' &&  addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number !=''){
                              //         var num =  Math.round((addInQualityReportModal.iqcUnqualified[index].quality_iqc_unqualified_number/addInQualityReportModal.iqcUnqualified[index].quality_sample_number) * 10000)/100
                              //         return num + '%'
                              //     }
                              // }
                          },
                          watch:{
                          //     iqcProjectResult:{
                          //         handler(newValue, oldValue) {
                          //             this.sendJudgment.iqcProjectResult++
                          // 　　　　 },
                          // 　　　　 deep: true
                          //     },
                          },
                          template:`
                          <div class="modal fade" id="addInQualityReportModal">
                              <div class="modal-dialog modal-lg">
                                  <div class="modal-content">
                                      <div class="modal-header">
                                          <button class="close" data-dismiss="modal">
                                              <span>
                                                  <i class="fa fa-close"></i>
                                              </span>
                                          </button>
                                          <h4 class="modal-title">IQC详情</h4>
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
                                                              <table class="table table-bordered table-condensed" >
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:14%">报告名称</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">IQC单号</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">报验日期</th>
                                                                          <td style="width:19%" ></td>
                                                                          
                                                                      </tr>
              
                                                                      <tr>
                                                                          <th style="width:14%">物料名称</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">规格</th>
                                                                          <td style="width:19%"></td>
  
                                                                          <th style="width:14%">型号</th>
                                                                          <td style="width:19%" ></td>
  
                                                                      </tr>
                                                                      <tr>
                                                                          <th style="width:14%">物料批号</th>
                                                                          <td style="width:19%" ></td>
  
                                                                          <th style="width:14%">数 量</th>
                                                                          <td style="width:19%" ></td>
                                                                          
                                                                          <th style="width:14%">单 位</th>
                                                                          <td style="width:19%"></td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style="width:14%">审核人</th>
                                                                          <td style="width:19%" ></td>
  
                                                                          <th style="width:14%">审核日期</th>
                                                                          <td style="width:19%" ></td>
  
                                                                          <th style="width:14%">综合判定结果</th>
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control"  disabled> 
                                                                                  <option value="">未选择</option>
                                                                                  <option value="0">合格</option>
                                                                                  <option value="1">不合格</option>
                                                                              </select>
                                                                          </td>
                                                                      </tr>
                                                                      <tr>
                                                                          <th style="width:14%">批准人</th>
                                                                          <td style="width:19%" ></td>
  
                                                                          <th style="width:14%">批准日期</th>
                                                                          <td style="width:19%" ></td>
  
                                                                          <th style="width:14%">供应厂商</th>
                                                                          <td style="width:19%" ></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
  
                                                          </div>
              
                                                      </div>
                                                      <!--检验结果-->
                                                      <div class="panel panel-default">
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
                                                          <div>
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
                                                                      <tr >
                                                                          <th></th>
  
                                                                          <td ></td>
                                                                         
                                                                          <td ></td>
  
                                                                          <td ></td>
  
                                                                          <td ></td>
                                                                          
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control"  disabled> 
                                                                                  <option value="">未选择</option>
                                                                                  <option value="0">合格</option>
                                                                                  <option value="1">不合格</option>
                                                                              </select>
                                                                          </td>
                                                                        
                                                                          <td ></td>
                                                                       
                                                                          <td ></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </div>
                                                      </div>
                                                      
                                                      <!--不合格内容-->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-4">
                                                                      <h5 class="panel-title">不合格内容</h5>
                                                                  </div>
                                                                  <div class="col-xs-8">
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:10%">不合格内容</th>
                                                                          <th style="width:10%">抽样数</th>
                                                                          <th style="width:10%">不良数</th>
                                                                          <th style="width:10%">不良率</th>
                                                                          <th style="width:10%">备注</th>
                                                                      </tr>
                                                                      <tr>
                                                                         
                                                                          <td ></td>
                                                                     
                                                                          <td ></td>
                              
                                                                          <td ></td>
                                                                       
                                                                          <td></td>
  
                                                                          <td ></td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </div>
              
                                                      </div>
                                                      <!--外观-->
                                                      <div class="panel panel-default">
                                                          <div class="panel-heading panel-heading-table">
                                                              <div class="row">
                                                                  <div class="col-xs-4">
                                                                      <h5 class="panel-title"></h5>
                                                                  </div>
                                                                  <div class="col-xs-8">
                                                                      <form class="form-inline pull-right">
                                                                      </form>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:20%">检验内容</th>
                                                                          <th style="width:20%">检测方式</th>
                                                                          <th style="width:20%">检验标准</th>
                                                                          <th style="width:20%">检验结果</th>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control"  disabled> 
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
                                                      <!--尺寸检验-->
                                                      <div class="panel panel-default">
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
                                                          <div>
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
                                                                      <tr>
                                                                          
                                                                          <td></td>
  
                                                                          <td></td>
                                                                          
                                                                          <td></td>
                                                                          
                                                                          <td></td>
                                                                          
                                                                          <td></td>
                                                                      
                                                                          <td></td>
  
                                                                          <td></td>
                                                                      
                                                                          <td class="table-input-td"><a class="table-link" @click="examine(key,index)" href="javascript:;">查看</a></td>
  
                                                                          
                                                                          <td></td>
  
                                                                          
                                                                          <td></td>
  
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control" disabled> 
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
                                                      <!--RS控制-->
                                                      <div class="panel panel-default">
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
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:10%">检验项目</th>
                                                                          <th style="width:10%">检验工具</th>
                                                                          <th style="width:10%">检验标准</th>
                                                                          <th style="width:10%">抽验数量</th>
                                                                          <th style="width:10%"> RS判定</th>
                                                                      </tr>
              
                                                                      <tr >
                                                                          <td></td>
  
                                                                          <td></td>
                                                                      
                                                                          <td></td>
                                                                         
                                                                          <td ></td>
  
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control"  disabled> 
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
                                                      <!--附录-->
                                                      <div class="panel panel-default">
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
                                                          <div>
                                                              <table class="table table-bordered table-condensed">
                                                                  <tbody>
                                                                      <tr>
                                                                          <th style="width:10%">附录</th>
                                                                          <th style="width:10%">备注</th>
                                                                          <th style="width:10%">结果</th>
                                                                      </tr>
              
                                                                      <tr>
                                                                          <td></td>
                                                                          <td></td>
                                                                          <td class="table-input-td"> 
                                                                              <select class="form-control"  disabled> 
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
                  function sampling( number, value){
                      let samplingResults = new Vue({
                          el:'#samplingResults ',
                          data(){
                              return {
                                  isShow:true,
                                  samplingRow:[],
                                  mean:'',
                                  ranges:''
                              }
                          },
                          mounted(){
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
                          created(){
                              if(number !== ''){
                                  number = number.split(',')
                                  value = value.split(',')
                                  var data = []
                                  number.forEach((val,key) => {
                                      data.push({number:val, result:value[key]})
                                  })
                                  this.samplingRow =  data
                              }
                          },
                          methods:{
                             
                          },
                          
                          watch:{
                              samplingRow:{
                                  handler: function (val, oldVal) {
                                      // console.log(val)
                                  },
                                  deep: true
                              },
                              deep:true
                          },
                          template:`
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
                                                                      <tr v-show="!samplingRow.length"><td colspan=15 class="text-center text-warning">暂无数据...</td></tr>
                                                                  
                                                                      <tr v-for="(val,index) in samplingRow">
                                                                          <td>{{index+1}}</td>
                                                                          <td></td>
  
                                                                          <td></td>
  
                                                                          <td></td>
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
      leftNavLink.eq(0).trigger('click');
      /********************************模态框*****************************/
      //生产计划详情模态框
      function productionPlanDetailsModel(){
          let productionPlanDetails = new Vue({
              el:'#productionPlanDetails',
              data(){
                  return{
                  }
              },
              methods:{
                  //查看参数详情模态框
                  // parameterDetails(){
                  //     parameterDetailsModel()
                  // },
                  //查看物料使用详情
                  materialDetails(){
                      materialDetailsModel()
                  },
                  
                  // //查看工步参数
                  // stepParameters(){
                  //     stepParameter()
                  // }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('productionPlanDetails')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
              },
              template:`
              <div class="modal fade" id="productionPlanDetails">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
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
                                          <!--   生产计划信息 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">生产计划信息</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:14%">订单编号</th>
                                                              <td style="width:19%">20171129</td>
                                                              
                                                              <th style="width:14%">是否新产</th>
                                                              <td style="width:19%">否</td>
  
                                                              <th style="width:14%">生产批号</th>
                                                              <td style="width:19%">20171129A59001</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">生产优先级</th>
                                                              <td style="width:19%">紧急\正常</td>
                                                              
                                                              <th style="width:14%">产品类型</th>
                                                              <td style="width:19%">圆柱电池</td>
                                                              
                                                              <th style="width:14%">产品型号</th>
                                                              <td style="width:19%">18650-500</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">工艺</th>
                                                              <td style="width:19%">A工艺</td>
                                                              
                                                              <th style="width:14%">工艺版本</th>
                                                              <td style="width:19%">v-1.01</td>
                                                              
                                                              <th style="width:14%">生产线</th>
                                                              <td style="width:19%">电池试制线</td>
                                                          </tr>
                                                          
                                                          <tr>
                                                              <th style="width:14%">优率</th>
                                                              <td style="width:19%">85.36%</td>
                                                              
                                                              <th style="width:14%">产品容量</th>
                                                              <td style="width:19%">500ma/单位</td>
                                                              
                                                              <th style="width:14%">产品型号单位</th>
                                                              <td style="width:19%">个</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">订单生产数</th>
                                                              <td style="width:19%">3000</td>
                                                              
                                                              <th style="width:14%">批次排产数</th>
                                                              <td style="width:19%">3500</td>
  
                                                              <th style="width:14%">排产优率</th>
                                                              <td style="width:19%">83.35%</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%"></th>
                                                              <td style="width:19%"></td>
                                                              
                                                              <th style="width:14%">预计产出量（</th>
                                                              <td style="width:19%">3045</td>
  
                                                              <th style="width:14%">排产容量(WAH)</th>
                                                              <td style="width:19%">11.33</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">创建人</th>
                                                              <td style="width:19%">张三</td>
                                                              
                                                              <th style="width:14%">计划审核人</th>
                                                              <td style="width:19%">刘伟荣</td>
  
                                                              <th style="width:14%">生产计划负责人</th>
                                                              <td style="width:19%">陈二</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">创建时间</th>
                                                              <td style="width:19%">2017-9-20 12:12:12</td>
                                                              
                                                              <th style="width:14%">预定开始时间</th>
                                                              <td style="width:19%">2017-9-30 00:00:00</td>
  
                                                              <th style="width:14%">预定完成时间</th>
                                                              <td style="width:19%">2017-9-30 12:12:12</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">实际产出量</th>
                                                              <td style="width:19%">3045.28</td>
                                                              
                                                              <th style="width:14%">实际开始时间</th>
                                                              <td style="width:19%">2017-9-30 12:12:12</td>
  
                                                              <th style="width:14%">实际完成时间</th>
                                                              <td style="width:19%">2017-9-30 12:12:12</td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
  
                                          </div>
                                          <!--使用的BOM清单 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">使用的BOM清单</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:4%">序号</th>
                                                              <th style="width:9%">名称</th>
                                                              <th style="width:9%">规格</th>
                                                              <th style="width:9%">型号</th>
                                                              <th style="width:9%">供应商</th>
                                                              <th style="width:9%">所需总量</th>
                                                              <th style="width:9%">单位</th>
                                                              <th style="width:9%">实际库存</th>
                                                              <th style="width:9%">预计库存</th>
                                                              <th style="width:9%">操作</th>
                                                          </tr>
                                                          <tr>
                                                              <td>1</td>
                                                              <td>钴酸锂</td>
                                                              <td>159A</td>
                                                              <td>GB159-01</td>
                                                              <td>广州供应商</td>
                                                              <td>700</td>
                                                              <td>克</td>
                                                              <td>200</td>
                                                              <td>-100</td>
                                                              <td class="table-input-td">
                                                                  <a class="table-link" @click="materialDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>物料详情</a>
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
                      </div>
                  </div>
              </div>
              `
          })
      }
      //PQC模态框
      function pqcModal(reportId) {
          let modalBodyTableVM = new Vue({
              el: '#commonModal1',
              data() {
                  return {
                      dataList: [],//环境条件
                  }
              },
              methods: {
              
                  //来料参数详情
                  materiaParamlDetail() {
                      // console.log(value)
                      materialDetailModal(this.dataList)
                  },
                  //附加参数详情
                  attachParamDetail() {
                      attachParamDetailModal(this.dataList)
                  },
              },
              mounted() {
                  const modal = document.getElementById('commonModal1')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
              },
              created(){
                  // $.ajax({
                  //     type: "POST",
                  //     url: queryPQCReportRecordUrl,
                  //     data: data,
                  //     beforeSend: (xml) => {
                  //         mesloadBox.loadingShow()
                  //     },
                  //     success: (result, status, xhr) => {
  
                  //     }
  
                  // })
                  //加载数据,模板
                      // $.ajax({
                      //     type: "POST",
                      //     url: queryPQCTemplateUrl,
                      //     data: data,
                      //     beforeSend: (xml) => {
                      //         // mesloadBox.loadingShow()
                      //     },
                      //     success: (result, status, xhr) => {
                          
      
                      //     },
      
                      // })
              },
              filters: {
                  times(val) {
                      // return
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
                              <button class="close" data-dismiss="modal">
                                  <span>
                                      <i class="fa fa-close"></i>
                                  </span>
                              </button>
                              <h4 class="modal-title">PQC详情</h4>
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
                                                  </form>
      
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                              <table class="table table-bordered table-condensed">
                                                  <tbody >
                                                      <tr>
                                                          <th style="width:14%">报告名称</th>
                                                          <td style="width:19%">
                                                          </td>
                                                          <th style="width:14%">表单编号</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                          <th style="width:14%">生产日期</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <th style="width:14%">生产批次</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                          <th style="width:14%">工单号</th>
                                                          <td style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">检验方式</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <th style="width:14%">设备编号</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                          <th style="width:14%">班次</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                          <th style="width:14%">操作员</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <th style="width:14%">半成品名称</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">半成品型号</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">半成品单位</th>
                                                          <td  style="width:19%"  >
                                                          </td>
                                                      </tr>
          
                                                      <tr>
                                                          <th style="width:14%">检查数量</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">良品数</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">良品率</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <th style="width:14%">检查员</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">检验日期</th>
                                                          <td  style="width:19%">
                                                          </td>
                                                          <th style="width:14%">完成状态</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                          <th style="width:14%">审核人</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">审核日期</th>
                                                          <td  style="width:19%" >
                                                          </td>
                                                          <th style="width:14%">备注</th>
                                                          <td  style="width:19%" >
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
                                                  <h5 class="panel-title">环境条件</h5>
                                                  </div>
                                                  <div class="col-xs-8">
      
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                              <table class="table table-bordered table-condensed">
                                                  <thead>
                                                  <tr>
                                                      <th style="width:30%">参数名称</th>
                                                      <th style="width:30%">标准</th>
                                                      <th style="width:40%">实测记录</th>
                                                  </tr>
                                                  </thead>
                                                  <tbody>
                                                  <tr>
                                                      <td >测试
                                                      </td>
                                                      <td >
                                                      </td>
                                                      <td>
                                                      
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
                                                  <h5 class="panel-title">来料确认</h5>
                                                  </div>
                                                  <div class="col-xs-8">
      
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                  <thead>
                                                      <tr>
                                                      <th style="width:15%">物料名称</th>
                                                      <th style="width:45%">参数</th>
                                                      <th style="width:15%">详情</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      <tr>
                                                      <td>
                                                      </td>
                                                      <td>
                                                      </td>
                                                      <td class="table-input-td">
                                                          <a
                                                          class="table-link"
                                                          href="javascript:;"
                                                          @click = "materiaParamlDetail()"
                                                          >
                                                          <i class="fa fa-tasks fa-fw"></i>查看</a>
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
                                                  <h5 class="panel-title">半成品参数</h5>
                                                  </div>
                                                  <div class="col-xs-8">
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                              <table class="table table-bordered table-condensed">
                                                  <thead>
                                                  <tr>
                                                      <th style="width:15%">参数名称</th>
                                                      <th style="width:15%">标准一(单面)</th>
                                                      <th style="width:15%">实测一</th>
                                                      <th style="width:15%">标准一(单面)</th>
                                                      <th style="width:15%">实测二</th>
                                                      <th style="width:15%">附加参数</th>
                                                  </tr>
                                                  </thead>
                                                  <tbody>
                                                  <tr>
                                                      <td>
                                                      </td>
                                                      <td>
                                                      </td>
                                                      <td>
                                                  
                                                      </td>
                                                      <td>
                                                      </td>
                                                  
                                                      <td >
                                                      </td>
                                                      <td class="table-input-td">
                                                      <a
                                                          class="table-link"
                                                          href="javascript:;"
                                                          @click = "attachParamDetail()"
                                                      >
                                                      <i class="fa fa-tasks fa-fw"></i>查看</a>
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
                                                  <h5 class="panel-title">设备参数</h5>
                                                  </div>
                                                  <div class="col-xs-8">
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                              <table class="table table-bordered table-condensed">
                                                  <thead>
                                                  <tr>
                                                      <th style="width:30%">参数名称</th>
                                                      <th style="width:30%">标准</th>
                                                      <th style="width:40%">实测记录</th>
                                                  </tr>
                                                  </thead>
                                                  <tbody>
                                                  <tr>
                                                      <td >测试
                                                      </td>
                                                      <td>
                                                      </td>
                                                      <td >
                                                      
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
                                                  <h5 class="panel-title">其它参数</h5>
                                                  </div>
                                                  <div class="col-xs-8">
                                                  </div>
                                              </div>
                                              </div>
                                              <div>
                                              <table class="table table-bordered table-condensed">
                                                  <thead>
                                                  <tr>
                                                      <th style="width:30%">参数名称</th>
                                                      <th style="width:30%">标准</th>
                                                      <th style="width:40%">实测记录</th>
                                                  </tr>
                                                  </thead>
                                                  <tbody>
                                                  <tr>
                                                      <td>测试
                                                      </td>
                                                      <td >
                                                      </td>
                                                      <td >
                                                      
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
                      </div>
                  </div>
              </div>
              `
          })
      }
      //PQC报告来料参数详情模态框
      function materialDetailModal(dataList) {
          // console.dir(type)
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
              return {
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
                                      <h5 class="panel-title">来料参数详情</h5>
                                      </div>
                                      <div class="col-xs-6">
                                      </div>
                                  </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered">
                                      <thead>
                                          <tr>
                                          <th style="width: 30%;">参数名称</th>
                                          <th style="width: 30%;">参数值</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                          <td>测试</td>
                                          <td></td>
                                          </tr>
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
              `
          })
          // panelBodyTableVM.queryFun(panelBodyTableVM.searchData)
  
      }
      //报告附加参数详情模态框
      function attachParamDetailModal(dataList) {
          // console.dir(dataList)
          // 当前页面vue实例
          let panelBodyTableVM = new Vue({
              el: '#commonModal2',
              data() {
              return {
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
                                      <div class="col-xs-6">
                                          <h5 class="panel-title">附加参数详情</h5>
                                      </div>
                                      <div class="col-xs-6">
                                      </div>
                                  </div>
                                  </div>
                                  <div class="panel-body-table table-height-10">
                                      <table class="table  table-bordered">
                                      <thead>
                                          <tr>
                                          <th style="width: 30%;">参数名称</th>
                                          <th style="width: 30%;">参数值</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr>
                                          <td>测试
                                          </td>
                                              <td>
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
  
                      </div>
                  </div>
              </div>
              `
          })
  
      }
      //物料详情模态框
      function materialDetailsModel(){
          let materialDetails = new Vue({
              el:'#materialDetails',
              data(){
                  return{
                  }
              },
              methods:{
                  //查看参数详情模态框
                  // parameterDetails(){
                  //     parameterDetailsModel()
                  // },
                  // //查看物料使用详情
                  // materialDetails(){
                  //     materialDetailsModel()
                  // },
                  // //查看工步参数
                  // stepParameters(){
                  //     stepParameter()
                  // }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('materialDetails')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
              },
              template:`
              <div class="modal fade" id="materialDetails">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
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
                                          <!-- 物料详情 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">物料详情</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:14%">物料名称：</th>
                                                              <td style="width:19%">20171129</td>
                                                              
                                                              <th style="width:14%">物料规格：</th>
                                                              <td style="width:19%">3000</td>
                                                              
                                                              <th style="width:14%">物料类型：</th>
                                                              <td style="width:19%">否</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">物料型号：</th>
                                                              <td style="width:19%">A工艺</td>
                                                              
                                                              <th style="width:14%">供应商：</th>
                                                              <td style="width:19%">v-1.01</td>
                                                              
                                                              <th style="width:14%">单位：</th>
                                                              <td style="width:19%">2017.1.1</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">所属仓库：</th>
                                                              <td style="width:19%">2017-10-30</td>
                                                              
                                                              <th style="width:14%"></th>
                                                              <td style="width:19%"></td>
                                                              
                                                              <th style="width:14%"></th>
                                                              <td style="width:19%"></td>
                                                          </tr>
                                                          
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
              `
          })
      }
      //工单详情模态框
      function workOrderDetailsModel(){
          let workOrderParticulars = new Vue({
              el:'#workOrderParticulars',
              data(){
                  return{
                  }
              },
              methods:{
                  //查看参数详情模态框
                  parameterDetails(){
                      parameterDetailsModel()
                  },
                  //查看物料使用详情
                  materialDetails(){
                      materialUseDetailsModel()
                  },
                  //查看工步参数
                  stepParameters(){
                      stepParameter()
                  }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('workOrderParticulars')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
              },
              template:`
              <div class="modal fade" id="workOrderParticulars">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button class="close" data-dismiss="modal">
                                  <span>
                                      <i class="fa fa-close"></i>
                                  </span>
                              </button>
                              <h4 class="modal-title">工单详情</h4>
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
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:14%">工单号</th>
                                                              <td style="width:19%">gd001</td>
                                                              
                                                              <th style="width:14%">所属生产批号</th>
                                                              <td style="width:19%">20171129A59001</td>
                                                              
                                                              <th style="width:14%">产品型号</th>
                                                              <td style="width:19%">18650-500</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">工艺</th>
                                                              <td style="width:19%">A工艺</td>
                                                              
                                                              <th style="width:14%">工艺版本</th>
                                                              <td style="width:19%">v-1.01</td>
                                                              
                                                              <th style="width:14%">工序</th>
                                                              <td style="width:19%">搅拌</td>
                                                          </tr>
  
                                                          <tr>
                                                              <th style="width:14%">工序优率</th>
                                                              <td style="width:19%">97%</td>
                                                              
                                                              <th style="width:14%">工序负责人</th>
                                                              <td style="width:19%">李元芳</td>
                                                              
                                                              <th style="width:14%">级性</th>
                                                              <td style="width:19%">正级/负极/—</td>
                                                          </tr>
                                                          
                                                          <tr>
                                                              <th style="width:14%">半成品类型</th>
                                                              <td style="width:19%">浆料</td>
                                                              
                                                              <th style="width:14%">半成品型号</th>
                                                              <td style="width:19%">GB-JL002</td>
                                                              
                                                              <th style="width:14%">产出量</th>
                                                              <td style="width:19%">3420</td>
                                                          </tr>
                                                          
                                                          <tr>
                                                              <th style="width:14%">半成品单位</th>
                                                              <td style="width:19%">kg</td>
                                                              
                                                              <th style="width:14%">生产线</th>
                                                              <td style="width:19%">电池试制线</td>
                                                              
                                                              <th style="width:14%">生产车间</th>
                                                              <td style="width:19%">搅拌车间</td>
                                                          </tr>
                                                          
                                                          <tr>
                                                              <th style="width:14%">完成日期</th>
                                                              <td style="width:19%">2017-9-30</td>
                                                              
                                                              <th style="width:14%">工单创建人</th>
                                                              <td style="width:19%">刘伟荣</td>
                                                              
                                                              <th style="width:14%">工单负责人</th>
                                                              <td style="width:19%">陈二</td>
                                                          </tr>
                                                          
                                                          <tr>
                                                              <th style="width:14%">生产优先级</th>
                                                              <td style="width:19%">紧急\正常</td>
                                                              
                                                              <th style="width:14%">工单创建时间</th>
                                                              <td style="width:19%">2017-08-08</td>
                                                              
                                                              <th style="width:14%"></th>
                                                              <td style="width:19%"></td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
  
                                          </div>
                                          <!-- 工 步 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title"> 工 步</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:4%">序号</th>
                                                              <th style="width:9%">工步名称</th>
                                                              <th style="width:9%">参数</th>
                                                              <th style="width:9%">参考值</th>
                                                              <th style="width:9%">单位</th>
                                                              <th style="width:9%">设备类型</th>
                                                              <th style="width:20%">操作</th>
                                                          </tr>
                                                          <tr>
                                                              <td>1</td>
                                                              <td>投料</td>
                                                              <td>转速</td>
                                                              <td>10 < V < 12</td>
                                                              <td>kg</td>
                                                              <td>搅拌</td>
                                                              <td class="table-input-td">
                                                                  <a class="table-link" @click="materialDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看物料使用详情</a>
                                                                  <a class="table-link" @click="stepParameters()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看工步参数</a>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
  
                                          </div>
                                          <!-- 环境参数 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">环境参数</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:4%">序号</th>
                                                              <th style="width:9%">参数名称</th>
                                                              <th style="width:9%">参考值</th>
                                                              <th style="width:9%">单位</th>
                                                              <th style="width:9%">操作</th>
                                                          </tr>
                                                          <tr>
                                                              <td>1</td>
                                                              <td>温度</td>
                                                              <td>10-29</td>
                                                              <td>摄氏度</td>
                                                              <td class="table-input-td">
                                                                  <a class="table-link" @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
  
                                          </div>  
                                          <!-- 半成品参数 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">半成品参数</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:4%">序号</th>
                                                              <th style="width:9%">参数名称</th>
                                                              <th style="width:9%">参考值</th>
                                                              <th style="width:9%">单位</th>
                                                              <th style="width:9%">操作</th>
                                                          </tr>
                                                          <tr>
                                                              <td>1</td>
                                                              <td>粘度*</td>
                                                              <td>10 < V < 12</td>
                                                              <td>阿萨德</td>
                                                              <td class="table-input-td">
                                                                  <a class="table-link"  @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
                                              </div>
  
                                          </div>
                                          <!-- 其他参数 -->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-4">
                                                          <h5 class="panel-title">其他参数</h5>
                                                      </div>
                                                      <div class="col-xs-8">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div>
                                                  <table class="table table-bordered table-condensed">
                                                      <tbody>
                                                          <tr>
                                                              <th style="width:4%">序号</th>
                                                              <th style="width:9%">参数名称</th>
                                                              <th style="width:9%">参考值</th>
                                                              <th style="width:9%">单位</th>
                                                              <th style="width:9%">操作</th>
                                                          </tr>
                                                          <tr>
                                                              <td>1</td>
                                                              <td>粘度*</td>
                                                              <td>10 < V < 12</td>
                                                              <td>sad</td>
                                                              <td class="table-input-td">
                                                                  <a class="table-link"  @click="parameterDetails()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看参数记录</a>
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
                      </div>
                  </div>
              </div>
              `
          })
      }
      //查看参数详情模态框
      function parameterDetailsModel(){
          let parameterModel = new Vue({
              el:'#parameterModel',
              data(){
                  return{
                  }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('parameterModel')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
                  $(modal).on('hidden.bs.modal', function (e) {
                      $('body').addClass('modal-open')
                  })
              },
              template:`
              <!-- 查看参数记录 -->
              <div class="modal fade" id="parameterModel">
                 <div class="modal-dialog">
                     <div class="modal-content">
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
                                                          <h5 class="panel-title">参数详情</h5>
                                                      </div>
                                                      <div class="col-xs-6">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="table-height-10">
                                                 <table class="table table-bordered">
                                                     <thead>
                                                         <tr>
                                                             <th style="width: 20%">实际值</th>
                                                             <th style="width: 20%">记录人</th>
                                                             <th style="width: 20%">记录时间</th>
                                                             <th style="width: 40%">备注</th>
                                                         </tr>
                                                     </thead>
                                                     <tbody>
                                                         <tr>
                                                             <td>测试</td>
                                                             <td></td>
                                                             <td></td>
                                                             <td></td>
                                                         </tr>
                                                         <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                     </tbody>
                                                 </table>
                                             </div>
                                             <div class="panel-footer panel-footer-table text-right">
                                                 <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
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
      //查看物料使用详情   
      function materialUseDetailsModel(){
          let materialModel = new Vue({
              el:'#materialModel',
              data(){
                  return{
                  }
              },
              methods:{
                   //XX工步物料详情查看
                  stepMaterialModel(){
                      stepMaterialDetailsModel()
                  }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('materialModel')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
                  $(modal).on('hidden.bs.modal', function (e) {
                      $('body').addClass('modal-open')
                  })
              },
              template:`
              <div class="modal fade" id="materialModel">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
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
                                          <!--A模式-->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-6">
                                                          <h5 class="panel-title">XX工步物料使用记录</h5>
                                                      </div>
                                                      <div class="col-xs-6">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="table-height-10">
                                                  <table class="table table-bordered">
                                                      <thead>
                                                          <tr>
                                                              <th style="width: 5%">序号</th>
                                                              <th style="width: 10%">物料名称</th>
                                                              <th style="width: 10%">规格</th>
                                                              <th style="width: 10%">型号</th>
                                                              <th style="width: 10%">单位</th>
                                                              <th style="width: 8%">操作</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                              <td>测试</td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td class="table-input-td"> <a class="table-link" @click="stepMaterialModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看</a></td>
                                                          </tr>
                                                          <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                      </tbody>
                                                  </table>
                                              </div>
                                              <div class="panel-footer panel-footer-table text-right">
                                                  <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
                                              </div>
                                          </div>
                                          <!--B模式-->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-6">
                                                          <h5 class="panel-title">查看工步物料投料详情</h5>
                                                      </div>
                                                      <div class="col-xs-6" style="text-align:right">
                                                          <div class="radio radio_retrospect">
                                                              <label style="cursor: pointer">
                                                                  <input type="radio" name="optionsRadios" value="option1" style="margin-top:4px">
                                                                  物料名称排序
                                                              </label>
                                                              <label style="cursor: pointer">
                                                                  <input type="radio" name="optionsRadios" value="option1" style="margin-top:4px">
                                                                  投料时间排序
                                                              </label>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="table-height-10">
                                                  <table class="table table-bordered">
                                                      <thead>
                                                          <tr>
                                                              <th style="width: 5%">序号</th>
                                                              <th style="width: 10%">物料名称</th>
                                                              <th style="width: 8%">规格</th>
                                                              <th style="width: 8%">型号</th>
                                                              <th style="width: 8%">单位</th>
                                                              <th style="width: 10%">投料时间</th>
                                                              <th style="width: 8%">使用数量</th>
                                                              <th style="width: 8%">投料人</th>
                                                              <th style="width: 15%">备注</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                              <td>测试</td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td></td>
                                                          </tr>
                                                          <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                      </tbody>
                                                  </table>
                                              </div>
                                              <div class="panel-footer panel-footer-table text-right">
                                                  <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
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
      //查看工步参数   
      function stepParameter(){
          let stepParameterModel = new Vue({
              el:'#stepParameterModel',
              data(){
                  return{
                  }
              },
              methods:{
                  //XX工步物料详情查看
                  stepMaterialModel(){
                     stepMaterialDetailsModel()
                  }
             },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('stepParameterModel')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
                  $(modal).on('hidden.bs.modal', function (e) {
                      $('body').addClass('modal-open')
                  })
              },
              template:`
              <div class="modal fade" id="stepParameterModel">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
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
                                          <!--A模式-->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-6">
                                                          <h5 class="panel-title">XX工步生产参数记录</h5>
                                                      </div>
                                                      <div class="col-xs-6">
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="table-height-10">
                                                  <table class="table table-bordered">
                                                      <thead>
                                                          <tr>
                                                              <th style="width: 5%">序号</th>
                                                              <th style="width: 10%">参数</th>
                                                              <th style="width: 10%">参考值</th>
                                                              <th style="width: 10%">单位</th>
                                                              <th style="width: 10%">设备类型</th>
                                                              <th style="width: 8%">操作</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                              <td>测试</td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td class="table-input-td"> <a class="table-link"  @click="stepMaterialModel()" href="javascript:;"><i class="fa fa-tasks fa-fw"></i>查看</a></td>
                                                          </tr>
                                                          <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                      </tbody>
                                                  </table>
                                              </div>
                                              <div class="panel-footer panel-footer-table text-right">
                                                  <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
                                              </div>
                                          </div>
                                          <!--B模式-->
                                          <div class="panel panel-default">
                                              <div class="panel-heading panel-heading-table">
                                                  <div class="row">
                                                      <div class="col-xs-6">
                                                          <h5 class="panel-title">工步参数</h5>
                                                      </div>
                                                      <div class="col-xs-6" style="text-align:right">
                                                          <div class="radio radio_retrospect">
                                                              <label style="cursor: pointer">
                                                                  <input type="radio" name="optionsRadios" value="option1" style="margin-top:4px">
                                                                  参数名称排序
                                                              </label>
                                                              <label style="cursor: pointer">
                                                                  <input type="radio" name="optionsRadios" value="option1" style="margin-top:4px">
                                                                  记录时间排序
                                                              </label>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div class="table-height-10">
                                                  <table class="table table-bordered">
                                                      <thead>
                                                          <tr>
                                                              <th style="width: 5%">序号</th>
                                                              <th style="width: 8%">参数</th>
                                                              <th style="width: 8%">参考值</th>
                                                              <th style="width: 5%">单位</th>
                                                              <th style="width: 8%">设备类型</th>
                                                              <th style="width: 12%">设备编号</th>
                                                              <th style="width: 8%">设备名称</th>
                                                              <th style="width: 8%">记录人</th>
                                                              <th style="width: 8%">记录时间</th>
                                                              <th style="width: 15%">备注</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                          <tr>
                                                              <td>测试</td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td></td>
                                                              <td></td>
                                                              <td></td> 
                                                              <td></td>
                                                              <td></td>
                                                          </tr>
                                                          <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                      </tbody>
                                                  </table>
                                              </div>
                                              <div class="panel-footer panel-footer-table text-right">
                                                  <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
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
       //XX工步物料详情查看
      function stepMaterialDetailsModel(){
          let stepMaterialModel = new Vue({
              el:'#stepMaterialModel',
              data(){
                  return{
                  }
              },
              //渲染结束后执行
              mounted(){
                  const modal = document.getElementById('stepMaterialModel')   //模态框
                  $(modal).modal({
                      backdrop: 'static', // 黑色遮罩不可点击
                      keyboard: false,  // esc按键不可关闭模态框
                      show: true     //显示
                  })
                  $(modal).on('hidden.bs.modal', function (e) {
                      $('body').addClass('modal-open')
                  })
              },
              template:`
              <div class="modal fade" id="stepMaterialModel">
                 <div class="modal-dialog">
                     <div class="modal-content">
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
                                             
                                              <div class="table-height-10">
                                                 <table class="table table-bordered">
                                                     <thead>
                                                         <tr>
                                                             <th style="width: 20%">投料时间</th>
                                                             <th style="width: 20%">使用数量</th>
                                                             <th style="width: 20%">投料人</th>
                                                             <th style="width: 40%">备注</th>
                                                         </tr>
                                                     </thead>
                                                     <tbody>
                                                         <tr>
                                                             <td>测试</td>
                                                             <td></td>
                                                             <td></td>
                                                             <td></td>
                                                         </tr>
                                                         <!-- <tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr> -->
                                                     </tbody>
                                                 </table>
                                             </div>
                                             <div class="panel-footer panel-footer-table text-right">
                                                 <!-- <el-pagination @current-change="handleCurrentChange" background small layout="total,prev,pager,next" :current-page="currenPage" :page-size="pagesize" :total="lines"></el-pagination> -->
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
  * @description 项目类型模态框
  * @param {obj} vue实例data
  */
  
  })