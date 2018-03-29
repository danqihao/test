$(function () {
	let leftNav = $('#mainLeftSidebar .sidebar-nav'), // 左侧边栏
		leftNavLink = leftNav.find('a').filter('[href^="#"]') // 左侧变栏对应的swiper

		Vue.filter("times", (val) =>{   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面  
			if(val !== ''){
				return moment(val).format('YYYY-MM-DD hh:mm:ss')
			 }
		});  
		Vue.filter("numberTwo", (val) =>{   //小数点后2位小数
			if(val !== ''){
				var xsd=val.toString().split(".");
				if(xsd.length==1){
					val=val.toString()+".00";
					return val
				}
				if(xsd.length>1){
					if(xsd[1].length<2){
						val=val.toString()+"0";
						return val
					}else if(xsd[1].length>2){
						val=val.toFixed(2)
						return val
					}else{
						return val
					}
				}
			 }
		});  
	
	  leftNavLink.on('click', function (event) {
		let targetHref = event.currentTarget.getAttribute('href'),
		USERNAME  = "张三",
		USERID = "e0814095529e4662afcff54b5923c073"
		switch (targetHref) {
			case '#processBasicInfo':{//工艺基础信息
				function showBasic(url, data) {
					$.ajax({
						type: "POST",
						url: url,
						data:data,
						success: function (result, status, xhr) {
							console.log(result)
							if(result.status === 0 ){
								Vue.set(panelBodyTableVM,'dataList',result.map.craftBasicsList)
								Vue.set(panelBodyTableVM,'lines',result.map.count)
							}else{
								Vue.set(panelBodyTableVM,'dataList',[])
								Vue.set(panelBodyTableVM,'lines',0)
							}
						}
					})
				}
				showBasic(queryCraftBasicsUrl,{type: 'vague',status:0,headNum: 1})

				let panelBodyTableVM = new Vue({
					el:'#processBasicInfoInerSwiper',
					data(){
						return{
							dataList:[],
							selected:0,
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								status: 0,
								keyword: ""

							}
						}
					},
					methods:{
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							showBasic(queryCraftBasicsUrl,this.ajaxData)
						},
						//搜索框
						searchs(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.currenPage = 1
							showBasic(queryCraftBasicsUrl,this.ajaxData)
						},
						changeStatus(val,value){
							console.log(val)
							const bodyParam = {
								type:"",
								craftBasicsIds: []
							  }
							bodyParam.craftBasicsIds.push(value.craft_basics_id)
							console.log(val)
							if(val == 0){
								bodyParam.type = 'deprecated'
								var statusName = "弃用"
							}else if(val == 1){
								bodyParam.type = 'recover'
								var statusName = "启用"
							}
							console.log(bodyParam)
							swal({
								title: '您确定要'+statusName+'吗？',
								text: "",
								type: 'question',
								showCancelButton: true,
								confirmButtonText: '确定',
								cancelButtonText: '取消'
							}).then( () => {
								$.ajax({
									type: "POST",
									url: modifyCraftBasicsStatusUrl,
									data:{
										type:bodyParam.type,
										craftBasicsIds:bodyParam.craftBasicsIds
									},
									success: function (result, status, xhr) {
										if (result.status === 0) {
											swal({
												title: statusName+'成功',
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
													showBasic(queryCraftBasicsUrl,{type: 'vague',status:0,headNum: 1})
												})
										}
										else {
											swal({
												title:  statusName+'失败',
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
						selectChange(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							showBasic(queryCraftBasicsUrl,this.ajaxData)
						},
						add(){
							modal()
						},
						LookDetails(val){
							Details(val)
						}
					},
					mounted(){
					
					},
					template:`
					<div class="swiper-slide swiper-no-swiping" id="processBasicInfoInerSwiper">
						<!-- 内容区域 -->
						<div class="row">
							<div class="col-sm-12">
								<div class="panel panel-default">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
												<form class="form-inline">
													<fieldset>
														<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">新增工艺</a>
													</fieldset>
												</form>
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right">
													<fieldset>
														<select class="form-control input-sm" v-model="selected" @change="selectChange">
															<option value="0" selected>启用</option>
															<option value="1">弃用</option>
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
													<th style="width: 5%;"> 序号</th>
													<th style="width: 20%;">工艺名称 </th>
													<th style="width: 20%;">工艺编号</th>
													<th style="width: 20%;">工艺备注</th>
													<th style="width: 18%;">操作</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="(value,index) in dataList"  :key="index">
													<td>{{index+1}}</td>
													<td>{{value.craft_name}}</td>
													<td>{{value.craft_number}}</td>
													<td>{{value.craft_basics_describe}}</td>
													<td class="table-input-td">
														<a class="table-link" @click="LookDetails(value.craft_basics_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>详情</a>
														<a class="table-link" @click="changeStatus(value.craft_basics_status,value)" v-if="value.craft_basics_status ==0" href="javascript:;">
														<i class="fa fa-trash-o fa-fw"></i>弃用</a>
														<a class="table-link text-danger"  @click="changeStatus(value.craft_basics_status,value)" href="javascript:;" v-if="value.craft_basics_status == 1" >
														<i class="fa fa-check fa-fw"></i>启用</a>
													</td>
												</tr>
												<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
					`
				})

				// 新增
				function modal(){
					let addCraftBasic = new Vue({
						el:"#addCraftBasic",
						data(){
							return{
								craftBasics :{
									craft_name:"",
									craft_number:"",
									craft_basics_describe:"",
									craft_basics_status: 0,
									craft_basics_creation_staff: USERNAME,
									craft_basics_creation_staff_id: USERID,
								}
							}
						},
						mounted(){
							const modal = document.getElementById('addCraftBasic')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						methods:{
							submit(){
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
							}).then( () => {
							//新增提交
							$.ajax({
									type: "POST",
									url: saveCraftBasicsUrl,
									data:this.craftBasics,
									success: function (result, status, xhr) {
											if(result.status === 0 ){
													showBasic(queryCraftBasicsUrl,{type: 'vague',status:0,headNum: 1})
													const modal = document.getElementById('addCraftBasic')   //模态框
													swallSuccess2(modal)	//操作成功提示并刷新页面
											}else{
													swallFail2(result.msg);	//操作失败
											}
									}
							})
						})
                                

							}
						},
						template:`
						<div class="modal fade" id="addCraftBasic">
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
																<h5 class="panel-title">新增工艺基础信息</h5>
															</div>
															
														</div>
													</div>
		
													<table class="table table-bordered">
														<tbody>
															<tr>
																<th style="width:20%">工艺名称</th>
																<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftBasics.craft_name"></td>
															</tr>	
															<tr>
																<th style="width:20%">工艺编号</th>
																<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftBasics.craft_number"></td>
															</tr>	
															<tr>
																<th style="width:20%">备注</th>
																<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftBasics.craft_basics_describe"></td>
															</tr>	
														</tbody>
													</table>
		
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<div class="row">
										<div class="col-xs-12">
											<button type ="button" class="btn btn-primary modal-submit" @click="submit">确认提交</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
						`
					})
				}
				function Details(val){
					$.ajax({
						type: "POST",
						url: queryCraftBasicsUrl,
						data:{
							type: 'precise',
							craftBasicsId:val,
							headNum:1
							
						},
						success: function (result, status, xhr) {
							if(result.status === 0 ){
								Vue.set(addCraftBasic,'dataList',result.map.craftBasicsList[0])
							}else{
								Vue.set(addCraftBasic,'dataList',[])
							}
						}
					})
					let addCraftBasic = new Vue({
						el:"#detailModal",
						data(){
							return{
								dataList:[]
							}
						},
						mounted(){
							const modal = document.getElementById('detailModal')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						methods:{
							
						},
						template:`
						<div class="modal fade" id="detailModal">
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
																<h5 class="panel-title">工艺基础信息详情</h5>
															</div>
															
														</div>
													</div>
		
													<table class="table table-bordered">
														<tbody>
															<tr>
																<th style="width:20%">工艺名称</th>
																<td class="">{{dataList.craft_name}}</td>
															</tr>	
															<tr>
																<th style="width:20%">工艺编号</th>
																<td ></td>														
															</tr>	
															<tr>
																<th style="width:20%">备注</th>
																<td class=""></td>									
															</tr>	
															<tr>
																<th style="width:20%">创建人</th>
																<td ></td>															</tr>	
															<tr>
																<th style="width:20%">创建时间</th>
																<td >{{dataList.craft_basics_creation_time | times}}</td>															</tr>	
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
						`
					})
				}
			}
			 break;
			case '#proSectionBasicInfo':{//工艺段基础信息
				let panelBodyTableVM = new Vue({
					el:'#proSectionBasicInfoInerSwiper',
					data(){
						return{
							dataList:[],
							selected:0,
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								status: 0,
								keyword: ""

							}
						}
					},
					methods:{
						showBasic(){
							$.ajax({
								type: "POST",
								url: queryCraftSegmentBasicsUrl,
								data:this.ajaxData,
								success: (result, status, xhr) =>{
									if(result.status === 0 ){
										this.dataList = result.map.craftSegmentDasicsList
										this.lines = result.map.count
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						},
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							this.showBasic()
						},
						//搜索框
						searchs(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.currenPage = 1
							this.showBasic()
						},
						changeStatus(val,value){
							console.log(val)
							const bodyParam = {
								type:"",
								craftSegmentBasicsIds: []
							}
							bodyParam.craftSegmentBasicsIds.push(value.craft_segment_basics_id)
							console.log(val)
							if(val == 0){
								bodyParam.type = 'deprecated'
								var statusName = "弃用"
							}else if(val == 1){
								bodyParam.type = 'recover'
								var statusName = "启用"
							}
							console.log(bodyParam)
							swal({
								title: '您确定要'+statusName+'吗？',
								text: "",
								type: 'question',
								showCancelButton: true,
								confirmButtonText: '确定',
								cancelButtonText: '取消'
							}).then( () => {
								$.ajax({
									type: "POST",
									url: modifyCraftSegmentBasicsStatusUrl,
									data:{
										type:bodyParam.type,
										craftSegmentBasicsIds:bodyParam.craftSegmentBasicsIds
									},
									success:  (result, status, xhr) =>{
										if (result.status === 0) {
											swal({
												title: statusName+'成功',
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
													this.showBasic()
												})
										}
										else {
											swal({
												title: statusName+'失败',
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
						selectChange(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.showBasic()
						},
						add(){
							modal()
						},
						LookDetails(val){
							Details(val)
						}
					},
					mounted(){
						this.showBasic()
					},
					template:`
					<div class="swiper-slide swiper-no-swiping" id="proSectionBasicInfoInerSwiper">
						<!-- 内容区域 -->
						<div class="row">
							<div class="col-sm-12">
								<div class="panel panel-default">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
												<form class="form-inline">
													<fieldset>
														<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">新增工艺段</a>
													</fieldset>
												</form>
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right">
													<fieldset>
														<select class="form-control input-sm" v-model="selected" @change="selectChange">
															<option value="0" selected>启用</option>
															<option value="1">弃用</option>
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
													<th style="width: 5%;"> 序号</th>
													<th style="width: 20%;">工艺段名称 </th>
													<th style="width: 20%;">工艺段编号</th>
													<th style="width: 20%;">工艺描述</th>
													<th style="width: 18%;">操作</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="(value,index) in dataList"  :key="index">
													<td>{{index+1}}</td>
													<td>{{value.craft_segment_name}}</td>
													<td>{{value.craft_segment_number}}</td>
													<td>{{value.craft_segment_basics_describe}}</td>
													<td class="table-input-td">
														<a class="table-link" @click="LookDetails(value.craft_segment_basics_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>详情</a>
														<a class="table-link" @click="changeStatus(value.craft_segment_basics_status,value)" v-if="value.craft_segment_basics_status ==0" href="javascript:;">
														<i class="fa fa-trash-o fa-fw"></i>弃用</a>
														<a class="table-link text-danger"  @click="changeStatus(value.craft_segment_basics_status,value)" href="javascript:;" v-if="value.craft_segment_basics_status == 1" >
														<i class="fa fa-check fa-fw"></i>启用</a>
													</td>
												</tr>
												<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
					`
				})

				// 新增
				function modal(){
					let addCraftBasic = new Vue({
						el:"#addCraftBasic",
						data(){
							return{
								craftSegmentDasics: {
									craft_segment_name: '',
									craft_segment_number:"",
									craft_segment_basics_describe:"",
									craft_segment_basics_status:0,
									craft_segment_basics_creation_staff: USERNAME,
									craft_segment_basics_creation_staff_id: USERID,
								}
							}
						},
						mounted(){
							const modal = document.getElementById('addCraftBasic')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						methods:{
							submit(){
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
							}).then( () => {
							//新增提交
							$.ajax({
									type: "POST",
									url: saveCraftSegmentBasicsUrl,
									data:this.craftSegmentDasics,
									success:  (result, status, xhr)=> {
											if(result.status === 0 ){
													//showBasic(queryCraftBasicsUrl,{type: 'vague',status:0,headNum: 1})
													//this.showBasic()
													const modal = document.getElementById('addCraftBasic')   //模态框
													swallSuccess2(modal)	//操作成功提示并刷新页面
													panelBodyTableVM.$emit("showBasic")
											}else{
													swallFail2(result.msg);	//操作失败
											}
									}
							})
						})
                                

							}
						},
						template:`
							<div class="modal fade" id="addCraftBasic">
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
																		<h5 class="panel-title">新增工艺基础信息</h5>
																	</div>
																	
																</div>
															</div>
				
															<table class="table table-bordered">
																<tbody>
																	<tr>
																		<th style="width:20%">工艺段名称</th>
																		<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftSegmentDasics.craft_segment_name"></td>
																	</tr>	
																	<tr>
																		<th style="width:20%">工艺段编号</th>
																		<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftSegmentDasics.craft_segment_number"></td>
																	</tr>	
																	<tr>
																		<th style="width:20%">备注</th>
																		<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="craftSegmentDasics.craft_segment_basics_describe"></td>
																	</tr>	
																</tbody>
															</table>
				
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="modal-footer">
											<div class="row">
												<div class="col-xs-12">
													<button type ="button" class="btn btn-primary modal-submit" @click="submit">确认提交</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						`
					})
				}
				function Details(val){
				
					let addCraftBasic = new Vue({
						el:"#detailModal",
						data(){
							return{
								dataList:[]
							}
						},
						mounted(){
							const modal = document.getElementById('detailModal')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
							this.showBasic()
						},
						methods:{
							showBasic(){
								$.ajax({
									type: "POST",
									url: queryCraftSegmentBasicsUrl,
									data:{
										type: 'precise',
										craftSegmentBasicsId:val,
										headNum:1
									},
									success: (result, status, xhr)=> {
										if(result.status === 0 ){
											this.dataList= result.map.CraftSegmentDasicsList[0]
										}else{
											this.dataList=[]
										}
									}
								})
							}
						},
						template:`
						<div class="modal fade" id="detailModal">
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
																<h5 class="panel-title">工艺段基础信息详情</h5>
															</div>
															
														</div>
													</div>
		
													<table class="table table-bordered">
														<tbody>
															<tr>
																<th style="width:20%">工艺段名称</th>
																<td class="">{{dataList.craft_segment_name}}</td>
															</tr>	
															<tr>
																<th style="width:20%">工艺段编号</th>
																<td >{{dataList.craft_segment_number}}</td>														
															</tr>	
															<tr>
																<th style="width:20%">备注</th>
																<td class="">{{dataList.craft_segment_basics_describe}}</td>									
															</tr>	
															<tr>
																<th style="width:20%">创建人</th>
																<td >{{dataList.craft_segment_name}}</td>	</tr>	
															<tr>
																<th style="width:20%">创建时间</th>
																<td >{{dataList.craft_segment_basics_creation_time | times}}</td>	</tr>	
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
						`
					})
				}
			}
			 break;
			case '#parametersMange':{ //参数管理
				let panelBodyTableVM = new Vue({
					el:'#parametersMangeInerSwiper',
					data(){
						return{
							dataList:[],
							selected:0,
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								status: 0,
								keyword: ""

							},
						}
					},
					created(){
						this.showBasic(queryParameterTypeUrl,this.ajaxData) 
					},
					methods:{
						showBasic(url, data){
							$.ajax({
								type: "POST",
								url: url,
								data:data,
								success: (result, status, xhr)=>{
									if(result.status === 0 ){
										this.dataList = result.map.resultList
										this.lines = result.map.counts
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						},
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							showBasic(queryParameterTypeUrl,this.ajaxData)
						},
						//搜索框
						searchs(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.currenPage = 1
							this.showBasic(queryParameterTypeUrl,this.ajaxData)
						},
						changeStatus(val,value){
							const bodyParam = {
								type:"",
								parameterTypeIds: []
							  }
							bodyParam.parameterTypeIds.push(value.standard_parameter_type_id)
							if(val == 0){
								bodyParam.type = 'deprecated'
								var statusName = "弃用"
							}else if(val == 1){
								bodyParam.type = 'recover'
								var statusName = "启用"
							}
							console.log(bodyParam)
							swal({
								title: '您确定要'+statusName+'吗？',
								text: "",
								type: 'question',
								showCancelButton: true,
								confirmButtonText: '确定',
								cancelButtonText: '取消'
							}).then( () => {
								$.ajax({
									type: "POST",
									url: modifyParameterTypeStatusUrl,
									data:{
										type:bodyParam.type,
										parameterTypeIds:bodyParam.parameterTypeIds
									},
									success: function (result, status, xhr) {
										if (result.status === 0) {
											swal({
												title: statusName+'成功',
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
													this.showBasic(queryParameterTypeUrl,{type:'vague',status:0,headNum: 1}) 
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
						selectChange(){
							this.ajaxData.keyword = this.search
							this.ajaxData.status = this.selected
							this.showBasic(queryParameterTypeUrl,this.ajaxData)
						},
						add(){
							modal()
						},
						unitsManage(){
							unitsManages()
						},
						parmManage(){
							parmManages()
						},
						LookDetails(val){
							Details(val)
						}
					},
				
					template:`
					<div class="swiper-slide swiper-no-swiping" id="parametersMangeInerSwiper">
						<!-- 内容区域 -->
						<div class="row">
							<div class="col-sm-12">
								<div class="panel panel-default">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
												<form class="form-inline">
													<fieldset>
														<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">新增参数类别</a>
														<a href="javascript:;" class="btn btn-primary btn-sm" @click="parmManage()">参数管理</a>
														<a href="javascript:;" class="btn btn-primary btn-sm" @click="unitsManage()">单位管理</a>
													</fieldset>
												</form>
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right">
													<fieldset>
														<select class="form-control input-sm" v-model="selected" @change="selectChange">
															<option value="0" selected>启用</option>
															<option value="1">弃用</option>
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
													<th style="width: 5%;"> 序号</th>
													<th style="width: 20%;">参数类型名称 </th>
													<th style="width: 20%;">类别编号</th>
													<th style="width: 20%;">类别描述</th>
													<th style="width: 18%;">操作</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="(value,index) in dataList"  :key="index">
													<td>{{index+1}}</td>
													<td>{{value.standard_parameter_type_name}}</td>
													<td>{{value.standard_parameter_type_num}}</td>
													<td>{{value.standard_parameter_type_describle}}</td>
													<td class="table-input-td">
														<a class="table-link" @click="LookDetails(value.standard_parameter_type_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>详情</a>
														<a class="table-link" @click="LookDetails(value.standard_parameter_type_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>参数详情</a>
														<a class="table-link" @click="LookDetails(value.standard_parameter_type_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>修改参数</a>
														<a class="table-link" @click="changeStatus(value.standard_parameter_type_status,value)" v-if="value.standard_parameter_type_status ==0" href="javascript:;">
														<i class="fa fa-trash-o fa-fw"></i>弃用</a>
														<a class="table-link text-danger"  @click="changeStatus(value.standard_parameter_type_status,value)" href="javascript:;" v-if="value.standard_parameter_type_status == 1" >
														<i class="fa fa-check fa-fw"></i>启用</a>
													</td>
												</tr>
												<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
					`
				})
				//详情
				function Details(val){
					$.ajax({
						type: "POST",
						url: queryParameterTypeUrl,
						data:{
							type: 'precise',
							parameterTypeId:val,
							headNum:1
							
						},
						success: function (result, status, xhr) {
							if(result.status === 0 ){
								Vue.set(addCraftBasic,'dataList',result.map.resultList[0])
							}else{
								Vue.set(addCraftBasic,'dataList',[])
							}
						}
					})
					let addCraftBasic = new Vue({
						el:"#detailModal",
						data(){
							return{
								dataList:[]
							}
						},
						mounted(){
							const modal = document.getElementById('detailModal')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						filters:{
						
						},
						methods:{
							
						},
						template:`
							<div class="modal fade" id="detailModal">
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
																	<h5 class="panel-title">参数类型详情</h5>
																</div>
																
															</div>
														</div>

														<table class="table table-bordered">
															<tbody>
																<tr>
																	<th style="width:20%">类型名称</th>
																	<td class="">{{dataList.standard_parameter_type_name}}</td>
																</tr>	
																<tr>
																	<th style="width:20%">类型编号</th>
																	<td class="">{{dataList.standard_parameter_type_num}}</td>													
																</tr>	
																<tr>
																	<th style="width:20%">备注</th>
																	<td class="">{{dataList.standard_parameter_type_describle}}</td>							
																</tr>	
																<tr>
																	<th style="width:20%">创建人</th>
																	<td class="">{{dataList.standard_parameter_type_name}}</td>												</tr>	
																<tr>
																	<th style="width:20%">创建时间</th>
																	<td >{{dataList.standard_parameter_type_creation_time | times}}</td>															</tr>	
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
							`
					})
				}
				// 单位管理
				function unitsManages(){
					function showBasic(url,data){
						$.ajax({
							type: "POST",
							url: url,
							data:data,
							success: function (result, status, xhr) {
								if(result.status === 0 ){
									Vue.set(unitsManageTable,'dataList',result.map.parameterUnitList)
									Vue.set(unitsManageTable,'lines',result.map.count)
								}else{
									Vue.set(unitsManageTable,'dataList',[])
									Vue.set(unitsManageTable,'lines',0)
								}
							}
						})
					}   
					showBasic(queryStandardParameterUnitsUrl,{type:'vague',status:0,headNum: 1}) 
					
					let unitsManageTable = new Vue({
						el:"#unitsManage",
						data(){
							return{
								dataList:[],
								selected:0,
								lines:0, //条数
								search:'', //搜索框值
								currenPage:1, //当前页
								pagesize: 10,   //页码
								ajaxData:{
									type: 'vague',
									headNum: 1,
									status: 0,
									keyword: ""
								},
							}
						},
						mounted(){
							const modal = document.getElementById('unitsManage')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						filters:{
							times(val){
								if(val !== ''){
									return moment(val).format('YYYY-MM-DD HH:mm:ss')
								}
							}
						},
						methods:{
							handleCurrentChange(val){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								this.ajaxData.headNum = (val - 1) * 10 + 1;
								showBasic(queryStandardParameterUnitsUrl,this.ajaxData)
							},
							//搜索框
							searchs(){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								this.currenPage = 1
								showBasic(queryStandardParameterUnitsUrl,this.ajaxData)
							},
							changeStatus(val,value){
								const bodyParam = {
									type:"",
									unitIds: []
									}
								bodyParam.unitIds.push(value.parameter_unit_id)
								console.log(val)
								if(val == 0){
									bodyParam.type = 'deprecated'
									var statusName = "弃用"
								}else if(val == 1){
									bodyParam.type = 'recover'
									var statusName = "启用"
								}
								console.log(bodyParam)
								swal({
									title: '您确定要'+statusName+'吗？',
									text: "",
									type: 'question',
									showCancelButton: true,
									confirmButtonText: '确定',
									cancelButtonText: '取消'
								}).then( () => {
									$.ajax({
										type: "POST",
										url: modifyStandardParameterUnitStatusUrl,
										data:{
											type:bodyParam.type,
											unitIds:bodyParam.unitIds
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												swal({
													title: statusName+'成功',
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
														showBasic(queryStandardParameterUnitsUrl,{type:'vague',status:0,headNum: 1}) 
													})
											}
											else {
												swal({
													title:result.msg ,
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
							selectChange(){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								showBasic(queryStandardParameterUnitsUrl,this.ajaxData)
							},
							add(){
								modal()
							},
						
							LookDetails(val){
								// Details(val)
							}
						},
						template:`
						<div class="modal fade" id="unitsManage" >
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
																	<form class="form-inline">
																		<fieldset>
																			<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">新增单位</a>
																		</fieldset>
																	</form>
																</div>
																<div class="col-xs-8">
																	<form class="form-inline pull-right">
																		<fieldset>
																			<select class="form-control input-sm" v-model="selected" @change="selectChange">
																				<option value="0" selected>启用</option>
																				<option value="1">弃用</option>
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
																		<th style="width: 6%;"> 序号</th>
																		<th style="width: 18%;">单位名称 </th>
																		<th style="width: 18%;">单位符号</th>
																		<th style="width: 20%;">单位类型</th>
																		<th style="width: 18%;">操作</th>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for="(value,index) in dataList"  :key="index">
																		<td>{{index+1}}</td>
																		<td>{{value.parameter_unit_name}}</td>
																		<td>{{value.parameter_unit}}</td>
																		<td>{{value.parameter_unit_type}}</td>
																		<td class="table-input-td">
																			<a class="table-link" @click="LookDetails(value.standard_parameter_type_id)" href="javascript:void(0);">
																				<i class="fa fa-tasks fa-fw"></i>详情</a>
																			<a class="table-link" @click="changeStatus(value.parameter_unit_status,value)" v-if="value.parameter_unit_status ==0" href="javascript:;">
																			<i class="fa fa-trash-o fa-fw"></i>弃用</a>
																			<a class="table-link text-danger"  @click="changeStatus(value.parameter_unit_status,value)" href="javascript:;" v-if="value.parameter_unit_status == 1" >
																			<i class="fa fa-check fa-fw"></i>启用</a>
																		</td>
																	</tr>
																	<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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

					// 新增
					function modal(){
						let addUnits = new Vue({
							el:"#addUnits",
							data(){
								return{
									standarParameterUnit:{
										parameter_unit_name: '',
										parameter_unit: '',
										parameter_unit_type: "",
										parameter_unit_creation_staff: USERNAME,
										parameter_unit_creation_staff_id: USERID,
									}
								}
							},
							mounted(){
								const modal = document.getElementById('addUnits')   //模态框
								$(modal).modal({
									backdrop: 'static', // 黑色遮罩不可点击
									keyboard: false,  // esc按键不可关闭模态框
									show: true     //显示
								})
								$(modal).off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
									$('body').addClass('modal-open')
								})
							},
							methods:{
								submit(){
									swal({
										title: '您确定要提交本次操作吗?',
										text: '请确保填写信息无误后点击确定按钮',
										type: 'question',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: true, // 显示用户取消按钮
										confirmButtonText: '确定',
										cancelButtonText: '取消',
								}).then( () => {
										//新增提交
										$.ajax({
												type: "POST",
												url: saveStandardParameterUnitUrl,
												data:this.standarParameterUnit,
												success: function (result, status, xhr) {
														if(result.status === 0 ){
															showBasic(queryStandardParameterUnitsUrl,{type:'vague',status:0,headNum: 1}) 
																const modal = document.getElementById('addUnits')   //模态框
																swallSuccess2(modal)	//操作成功提示并刷新页面
														}else{
																swallFail2(result.msg);	//操作失败
														}
												}
										})
										})
																	

								}
							},
							template:`
							<div class="modal fade" id="addUnits">
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
																	<h5 class="panel-title">新增单位信息</h5>
																</div>
																
															</div>
														</div>
			
														<table class="table table-bordered">
															<tbody>
																<tr>
																	<th style="width:20%">单位名称</th>
																	<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="standarParameterUnit.parameter_unit_name"></td>
																</tr>	
																<tr>
																	<th style="width:20%">单位符号</th>
																	<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="standarParameterUnit.parameter_unit"></td>
																</tr>	
																<tr>
																	<th style="width:20%">单位类型</th>
																	<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="standarParameterUnit.parameter_unit_type"></td>
																</tr>	
															</tbody>
														</table>
			
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="modal-footer">
										<div class="row">
											<div class="col-xs-12">
												<button type ="button" class="btn btn-primary modal-submit" @click="submit">确认提交</button>
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
				// 参数管理
				function parmManages(){
					function showBasic(url,data){
						$.ajax({
							type: "POST",
							url: url,
							data:data,
							success: function (result, status, xhr) {
								if(result.status === 0 ){
									Vue.set(parmManageTable,'dataList',result.map.resultListTwo)
									Vue.set(parmManageTable,'lines',result.map.counts)
								}else{
									Vue.set(parmManageTable,'dataList',[])
									Vue.set(parmManageTable,'lines',0)
								}
							}
						})
					}   
					showBasic(queryNormParameterUrl,{type:'vague',status:0,headNum: 1}) 
					
					let parmManageTable = new Vue({
						el:"#parmsManage",
						data(){
							return{
								dataList:[],
								unitIDList:[],
								selected:0,
								lines:0, //条数
								search:'', //搜索框值
								currenPage:1, //当前页
								pagesize: 10,   //页码
								ajaxData:{
									type: 'vague',
									headNum: 1,
									status: 0,
									keyword: ""
								},
							}
						},
						mounted(){
							const modal = document.getElementById('parmsManage')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						filters:{
							times(val){
								if(val !== ''){
									return moment(val).format('YYYY-MM-DD HH:mm:ss')
								}
							}
						},
						methods:{
							handleCurrentChange(val){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								this.ajaxData.headNum = (val - 1) * 10 + 1;
								showBasic(queryNormParameterUrl,this.ajaxData)
							},
							//搜索框
							searchs(){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								this.currenPage = 1
								showBasic(queryNormParameterUrl,this.ajaxData)
							},
							changeStatus(val,value){
								const bodyParam = {
									type:"",
									unitIds: []
									}
								bodyParam.unitIds.push(value.parameter_unit_id)
								console.log(val)
								if(val == 0){
									bodyParam.type = 'deprecated'
									var statusName = "弃用"
								}else if(val == 1){
									bodyParam.type = 'recover'
									var statusName = "启用"
								}
								console.log(bodyParam)
								swal({
									title: '您确定要'+statusName+'吗？',
									text: "",
									type: 'question',
									showCancelButton: true,
									confirmButtonText: '确定',
									cancelButtonText: '取消'
								}).then( () => {
									$.ajax({
										type: "POST",
										url: modifyStandardParameterUnitStatusUrl,
										data:{
											type:bodyParam.type,
											unitIds:bodyParam.unitIds
										},
										success: function (result, status, xhr) {
											if (result.status === 0) {
												swal({
													title: statusName+'成功',
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
														showBasic(queryStandardParameterUnitsUrl,{type:'vague',status:0,headNum: 1}) 
													})
											}
											else {
												swal({
													title:result.msg ,
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
							selectChange(){
								this.ajaxData.keyword = this.search
								this.ajaxData.status = this.selected
								showBasic(queryNormParameterUrl,this.ajaxData)
							},
							add(){
								modal()
							},
							LookDetails(val){
								// Details(val)
							},
							editUnit(val){
								$.ajax({
									type: "POST",
									async: false,
									url: queryParameterUnitsUrl,
									data:{
										realationParameterId: val,
									},
									success:  (result)=>{
										if(result.status===0){
											let map = result.map, // 映射
											unitLists = map.list
											for (let m = 0, len = unitLists.length; m < len; m++ ){
												this.unitIDList.push(unitLists[m].parameter_unit_id) 
												}
										}
									}
								})
								let promise = new Promise((resolve, reject) =>{
									chenkUnits(resolve,this.unitIDList,"edit",val)
								})
								promise.then( (resolveData) => {
									this.unitIDList = resolveData
								})
							}
						},
						template:`
							<div class="modal fade" id="parmsManage" >
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
																		<form class="form-inline">
																			<fieldset>
																				<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">添加参数</a>
																			</fieldset>
																		</form>
																	</div>
																	<div class="col-xs-8">
																		<form class="form-inline pull-right">
																			<fieldset>
																				<select class="form-control input-sm" v-model="selected" @change="selectChange">
																					<option value="0" selected>启用</option>
																					<option value="1">弃用</option>
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
																			<th style="width: 6%;"> 序号</th>
																			<th style="width: 14%;">参数名称 </th>
																			<th style="width: 18%;">参数描述</th>
																			<th style="width: 25%;">操作</th>
																		</tr>
																	</thead>
																	<tbody>
																		<tr v-for="(value,index) in dataList"  :key="index">
																			<td>{{index+1}}</td>
																			<td>{{value.standard_parameter_name}}</td>
																			<td>{{value.standard_parameter_describle}}</td>
																			<td class="table-input-td">
																				<a class="table-link" @click="LookDetails(value.standard_parameter_id)" href="javascript:void(0);">
																					<i class="fa fa-tasks fa-fw"></i>详情</a>
																				<a class="table-link" @click="editUnit(value.standard_parameter_id)" href="javascript:void(0);">
																					<i class="fa fa-tasks fa-fw"></i>编辑单位</a>
																				<a class="table-link" @click="changeStatus(value.standard_parameter_status,value)" v-if="value.standard_parameter_status ==0" href="javascript:;">
																				<i class="fa fa-trash-o fa-fw"></i>弃用</a>
																				<a class="table-link text-danger"  @click="changeStatus(value.standard_parameter_status,value)" href="javascript:;" v-if="value.standard_parameter_status == 1" >
																				<i class="fa fa-check fa-fw"></i>启用</a>
																			</td>
																		</tr>
																		<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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

					// 新增 参数
					function modal(){
						let addParms = new Vue({
							el:"#addParms",
							data(){
								return{
									unitIDList:[],
									jsonObject: {
										standard_parameter_name: '',
										standard_parameter_specifications: "",
										standard_parameter_describle: "",
										standard_parameter_status: 0,
										standard_parameter_creation_staff: USERNAME,
										standard_parameter_creation_staff_id:USERID,
									}
								
								}
							},
							computed(){
							
							},
							mounted(){
								const modal = document.getElementById('addParms')   //模态框
								$(modal).modal({
									backdrop: 'static', // 黑色遮罩不可点击
									keyboard: false,  // esc按键不可关闭模态框
									show: true     //显示
								})
								$(modal).off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
									$('body').addClass('modal-open')
								})
							},
							methods:{
								submit(){
									if(typeof this.jsonObject !== 'string'){
										this.jsonObject=JSON.stringify(this.jsonObject)
									}
									console.log(this.unitIDList)
									swal({
										title: '您确定要提交本次操作吗?',
										text: '请确保填写信息无误后点击确定按钮',
										type: 'question',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不关闭弹窗。
										showCancelButton: true, // 显示用户取消按钮
										confirmButtonText: '确定',
										cancelButtonText: '取消',
								}).then( () => {
										//新增提交
										$.ajax({
												type: "POST",
												url: saveNormParameterUrl,
												data:{
													jsonObject:this.jsonObject,
													unitIds:this.unitIDList
												},
												success: function (result, status, xhr) {
														if(result.status === 0 ){
															showBasic(queryNormParameterUrl,{type:'vague',status:0,headNum: 1}) 
																const modal = document.getElementById('addParms')   //模态框
																swallSuccess2(modal)	//操作成功提示并刷新页面
														}else{
																swallFail2(result.msg);	//操作失败
														}
												}
										})
										})
								},
								checkUnit(){
									let promise = new Promise((resolve, reject) =>{
										chenkUnits(resolve,this.unitIDList)
									})
									promise.then( (resolveData) => {
										this.unitIDList = resolveData
									})
								}
							},
							template:`
									<div class="modal fade" id="addParms">
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
																			<h5 class="panel-title">新增参数</h5>
																		</div>
																		
																	</div>
																</div>
					
																<table class="table table-bordered">
																	<tbody>
																		<tr>
																			<th style="width:20%">参数名称</th>
																			<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="jsonObject.standard_parameter_name"></td>
																		</tr>	
																		<tr>
																			<th style="width:20%">量产规格</th>
																			<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="jsonObject.standard_parameter_specifications"></td>
																		</tr>	
																		<tr>
																			<th style="width:20%">添加单位</th>
																			<td class="table-input-td"><a class="table-link"  href="javascript:void(0);"  @click="checkUnit()"><i class="fa fa-tasks fa-fw"></i>选择单位</a></td>
																		</tr>	
																		<tr>
																			<th style="width:20%">参数描述</th>
																			<td class="table-input-td"><input type="text" class="table-input" placeholder="请输入" autocomplete="on" v-model="jsonObject.standard_parameter_describle"></td>
																		</tr>	
																	</tbody>
																</table>
					
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="modal-footer">
												<div class="row">
													<div class="col-xs-12">
														<button type ="button" class="btn btn-primary modal-submit" @click="submit">确认提交</button>
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
			

			

			} 
		  	break;
			case '#BproductAndparameters':{//半成品与半成品参数维护功能
				let panelBodyTableVM = new Vue({
					el:'#BproductAndparametersInerSwiper',
					data(){
						return{
							dataList:[],
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								status: 0,
								keyWord: ""
							},
						}
					},
					created(){
						this.showBasic(querySemiFinishedProductModelUrl,this.ajaxData) 
					},
					methods:{
						showBasic(url, data){
							$.ajax({
								type: "POST",
								url: url,
								data:data,
								success: (result, status, xhr)=>{
									if(result.status === 0 ){
										this.dataList = result.map.SemiFinishs
										this.lines = result.map.lines
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						},
						handleCurrentChange(val){
							this.ajaxData.keyWord = this.search
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							this.showBasic(querySemiFinishedProductModelUrl,this.ajaxData) 
						},
						//搜索框
						searchs(){
							this.ajaxData.keyWord = this.search
							this.currenPage = 1
							this.showBasic(querySemiFinishedProductModelUrl,this.ajaxData) 
						},
						editParm(val){
							editParms(val)
						},
						LookDetails(val){
							Details(val)
						}
					},
				
					template:`
					<div class="swiper-slide swiper-no-swiping" id="BproductAndparametersInerSwiper">
						<!-- 内容区域 -->
						<div class="row">
							<div class="col-sm-12">
								<div class="panel panel-default">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right">
													<fieldset>
														<div class="input-group input-group-sm fuzzy-search-group">
															<input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
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
													<th style="width: 5%;"> 序号</th>
													<th style="width: 15%;">半成品名称 </th>
													<th style="width: 15%;">半成品编号</th>
													<th style="width: 15%;">半成品型号</th>
													<th style="width: 15%;">半成品描述</th>
													<th style="width: 18%;">操作</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="(value,index) in dataList"  :key="index">
													<td>{{index+1}}</td>
													<td>{{value.semi_finish_name}}</td>
													<td>{{value.semi_finish_number}}</td>
													<td>{{value.semi_finish_genre}}</td>
													<td>{{value.standard_parameter_type_describle}}</td>
													<td class="table-input-td">
														<a class="table-link" @click="LookDetails(value.semi_finish_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>参数详情</a>
														<a class="table-link" @click="editParm(value.semi_finish_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>修改参数</a>
													</td>
												</tr>
												<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
					`
				})

				//参数详情
				function Details(val){
					let addCraftBasic = new Vue({
						el:"#detailModal",
						data(){
							return{
								dataList:[],
								lines:0, //条数
								currenPage:1, //当前页
								pagesize: 10,   //页码	
								ajaxData:{
									headNum:1
								}		
							}				
						},
						mounted(){
							const modal = document.getElementById('detailModal')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
							this.showBasic()
						},
						methods:{
							showBasic(){
								$.ajax({
									type: "POST",
									url:querySemiFinishedProductModelAboutParameterUrl,
									data:{
										semiFinishedProductModelId: val,
										headNum:this.ajaxData.headNum
									},
									success:  (result, status, xhr)=> {
										if(result.status === 0 ){
											this.dataList = result.map.semiFinishRelation
											this.lines = result.map.lines
										}else{
											this.dataList = []
											this.lines = 0
										}
									}
								})
							},
							checkUnit(val){
								unitsDetails(val)
							},
							handleCurrentChange(val){
								this.ajaxData.headNum = (val - 1) * 10 + 1;
								this.showBasic() 
							},
						},
						template:`
								<div class="modal fade" id="detailModal">
										<div class="modal-dialog">
												<div class="modal-content">
														<div class="modal-header">
																<button class="close" data-dismiss="modal">
																		<span >
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
																										<div class="col-xs-6">
																											<h4 class="pentl-title">半成品参数详情</h4>
																										</div>
																									
																								</div>
																								<div class="table-height-10">
																										<table class="table table-bordered">
																												<thead>
																														<tr>
																															<th style="width: 6%;"> 序号</th>
																															<th style="width: 18%;">参数名称 </th>
																															<th style="width: 18%;">参数规格</th>
																															<th style="width: 20%;">参数描述</th>
																															<th style="width: 18%;">操作</th>
																														</tr>
																												</thead>
																												<tbody>
																														<tr v-show='dataList.length' v-for="(val,index) in dataList" style="cursor:pointer">
																																<td>{{index+1}}</td>
																																<td>{{val.standardParameter.standard_parameter_name}}</td>
																																<td>{{val.standardParameter.standard_parameter_specifications}}</td>
																																<td>{{val.standardParameter.standard_parameter_describle}}</td>
																																<td class="table-input-td">
																																	<a class="table-link"  href="javascript:void(0);"  @click="checkUnit(val.standardParameter.standard_parameter_id)"><i class="fa fa-tasks fa-fw"></i>查看单位</a></td>
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

					function unitsDetails(val){
						let unitsDetails = new Vue({
							el:"#unitsDetails",
							data(){
								return{
									dataList:[],
									lines:0, //条数
									currenPage:1, //当前页
									pagesize: 10,   //页码
									ajaxData:{
										headNum:1
									}			
								}
							},
							mounted(){
								const modal = document.getElementById('unitsDetails')   //模态框
								$(modal).modal({
									backdrop: 'static', // 黑色遮罩不可点击
									keyboard: false,  // esc按键不可关闭模态框
									show: true     //显示
								})
								$(modal).on('hidden.bs.modal', function (e) {
									$('body').addClass('modal-open')
								})
								this.showBasic()
							},
						
							methods:{
								showBasic(){
									$.ajax({
										type: "POST",
										url:queryParameterUnitsUrl,
										data:{
											realationParameterId: val,
											headNum:this.ajaxData.headNum
										},
										success:  (result, status, xhr)=> {
											if(result.status === 0 ){
												this.dataList = result.map.list
												this.lines = result.map.lines
											}else{
												this.dataList = []
												this.lines = 0
											}
										}
									})
								},
								handleCurrentChange(val){
									this.ajaxData.headNum = (val - 1) * 10 + 1;
									this.showBasic() 
								},
							},
							template:`
									<div class="modal fade" id="unitsDetails">
											<div class="modal-dialog">
													<div class="modal-content">
															<div class="modal-header">
																	<button class="close" data-dismiss="modal">
																			<span >
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
																											<div class="col-xs-6">
																												<h4 class="pentl-title">查看单位</h4>
																											</div>
																										
																									</div>
																									<div class="table-height-10">
																											<table class="table table-bordered">
																													<thead>
																															<tr>
																																<th style="width: 6%;"> 序号</th>
																																<th style="width: 18%;">单位名称 </th>
																																<th style="width: 18%;">单位符号</th>
																																<th style="width: 20%;">单位类型</th>
																															</tr>
																													</thead>
																													<tbody>
																															<tr v-show='dataList.length' v-for="(val,index) in dataList" style="cursor:pointer">
																																	<td>{{index+1}}</td>
																																	<td>{{val.parameter_unit_name}}</td>
																																	<td>{{val.parameter_unit}}</td>
																																	<td>{{val.parameter_unit_type}}</td>
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
				}
				//修改参数
				function editParms(val){
					let editParms  = new Vue({
						el:'#editParms',
						data() {
								return {
										checked:false,
										checkNames:[],
										selected:"",
										queryParmTypeList:[],
										dataList:[], //遍历数据
										idOnList:[], //遍历数据
										lines:0, //条数
										currenPage:1, //当前页
										pagesize: 10,   //页码
										ajaxData:{
											type: 'parameterTypeQuery',
											headNum: 1,
											parameterTypeId:""
										}
								}
						},
						created(){
							this.queryParmType()
							this.showBasic(val)
						},
						mounted(){
								const modal = document.getElementById('editParms')   //模态框
								$(modal).modal({
										backdrop: 'static', // 黑色遮罩不可点击
										keyboard: false,  // esc按键不可关闭模态框
										show: true     //显示
								})
								$(modal).on('hidden.bs.modal', function (e) {
										$('body').addClass('modal-open')
								})
		
							
						},
						methods:{
								showBasic(val){
									$.ajax({
										type: "POST",
										url: querySemiFinishedProductModelAboutParameterUrl,
										data:{
											semiFinishedProductModelId: val,
										},
										beforeSend: (xml) => {
											this.loading = true
										},
										success:  (result, status, xhr) =>{
											this.loading = false
											if(result.status === 0 ){
												this.idOnList=result.map.semiFinishRelation
												this.lines=result.map.lines
											}else{
												this.idOnList = []
												this.lines = 0
											}
										}
									})
								}, 
								parmTypeAboutParms(){
									$.ajax({
										type: "POST",
										url: queryNormParameterUrl,
										data:this.ajaxData,
										beforeSend: (xml) => {
											this.loading = true
										},
										success:  (result, status, xhr) =>{
											if(result.status === 0 ){
												let tempList = result.map.resultListTree
												this.lines = result.map.counts
												for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
													tempList[i].selected = false  //所有按钮设置为没选择
													for (let j = 0, len = this.idOnList.length; j < len; j++) {
														if (this.idOnList[j].standardParameter.standard_parameter_id ==	tempList[i].standardParameterList[0].standard_parameter_id) {
															tempList[i].selected = true
															this.checkNames.push(this.idOnList[j].standardParameter.standard_parameter_id) //存储已选择数据
														}
													}
												}
												this.dataList=tempList
											}else{
												this.dataList = []
												this.lines = 0
											}
										}
									})
								},
								queryParmType(){
									$.ajax({
										type: "POST",
										url:queryParameterTypeUrl,
										data:{
											type: 'vague',
											status:0,
										},
										success: (result, status, xhr)=>{
											if(result.status === 0 ){
												this.queryParmTypeList = result.map.resultList
												console.log(this.queryParmTypeList)
											}else{
												this.queryParmTypeList = []
											}
										}
									})
								},
								//分页变化
								handleCurrentChange(val){
									this.ajaxData.headNum = (val - 1) * 10 + 1;
									this.ajaxData.parameterTypeId = this.selected;
									this.	parmTypeAboutParms()
								},
								selectChange(){
									this.ajaxData.parameterTypeId =  this.selected;
									this.parmTypeAboutParms()
								},
								//选择后执行的操作
								choice(value, index) {
									if (value.selected) { //已经选择
										this.dataList[index].selected = false
										traverseListDelete(this.checkNames,value.standardParameterList[0].standard_parameter_id);
									} else {
										this.dataList[index].selected = true //设置为已选择
										traverseListPush(this.checkNames,value.standardParameterList[0].standard_parameter_id);	//将功能id放入功能id集合
									}
		
								},
								save(){
									if (true) {
										swal({
											title: '您确定要提交本次操作吗?',
											text: '请确保填写信息无误后点击确定按钮',
											type: 'question',
											allowEscapeKey: false, // 用户按esc键不退出
											allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
											showCancelButton: true, // 显示用户取消按钮
											confirmButtonText: '确定',
											cancelButtonText: '取消',
										}).then( ()=> {

										if(this.idOnList.length!==0){
											$.ajax({
												type: "POST",
												url: maintainSemiFinishedProductModelAboutParameterUrl,
												data: {
													type:"modify",
													semiFinishedProductModelId: val,
													semiFinishedProductParameterIds: this.checkNames
												},
												success:(result, status, xhr)=> {
													if (result.status === 0) {

														const modal = document.getElementById('editParms')   //模态框
													swallSuccess2(modal)	//操作成功提示并刷新页面
													}else {
														let msg = result.msg
														if(msg!==null){
															swallFail2(msg)
														}else{
															swallError();	//格式不正确
														}
													}
												}
											})
										}else{
											$.ajax({
												type: "POST",
												url: maintainSemiFinishedProductModelAboutParameterUrl,
												data: {
													type:"null",
													semiFinishedProductModelId: val,
													semiFinishedProductParameterIds:  this.checkNames
												},
												success: (result, status, xhr) =>{
													if (result.status === 0) {
														const modal = document.getElementById('editParms')   //模态框
														swallSuccess2(modal)	//操作成功提示并刷新页面
													}else {
														let msg = result.msg
														if(msg!==null){
															swallFail2(msg)
														}else{
															swallError();	//格式不正确
														}
													}
												}
											})
										}
										});
									}
									else {
										swallError();	//格式不正确
									}
								}
						},
						template:`
							<div class="modal fade" id="editParms">
									<div class="modal-dialog">
											<div class="modal-content">
													<div class="modal-header">
															<button class="close" data-dismiss="modal">
																	<span >
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
																									<div class="col-xs-6">
																										<h4 class="pentl-title">选择单位</h4>
																									</div>
																									<div class="col-xs-6">
																										<form class="form-inline pull-right">
																											<fieldset>
																												<select class="form-control input-sm" v-model="selected" @change="selectChange">
																													<option value=""  disabled selected>参数类型</option>
																													<option v-for="(item, index) in queryParmTypeList"  :value="item.standard_parameter_type_id"  :key="index">{{item.standard_parameter_type_name}}</option>
																												</select>
																											</fieldset>
																									</form>
																									</div>
																							</div>
																							<div class="table-height-10">
																									<table class="table table-bordered">
																											<thead>
																													<tr>
																														<th style="width: 6%;"> 序号</th>
																														<th style="width: 18%;">参数名称 </th>
																														<th style="width: 20%;">参数描述</th>
																														<th style="width: 18%;">操作</th>
																													</tr>
																											</thead>
																											<tbody>
																													<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																															<td>{{index+1}}</td>
																															<td>{{val.standardParameterList[0].standard_parameter_name}}</td>
																															<td>{{val.standardParameterList[0].standard_parameter_describle}}</td>
																															<td class="table-input-td">
																																	<label class="checkbox-inline">
																																			<input type="checkbox" v-model="checkNames" :value="val.standardParameterList[0].standard_parameter_id" onclick="return"> 
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
						`
					})
				}
			}
				
			break;
			case '#workStepAndParameters':{//工步与工步参数关系维护
				let panelBodyTableVM = new Vue({
					el:'#workStepAndParametersInerSwiper',
					data(){
						return{
							dataList:[],
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								status: 0,
								keyword: ""
							},
						}
					},
					created(){
						this.showBasic(queryStepBasicsUrl,this.ajaxData) 
					},
					methods:{
						showBasic(url, data){
							$.ajax({
								type: "POST",
								url: url,
								data:data,
								success: (result, status, xhr)=>{
									if(result.status === 0 ){
										this.dataList = result.map.resultList
										this.lines = result.map.counts
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						},
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							this.showBasic(queryStepBasicsUrl,this.ajaxData) 
						},
						//搜索框
						searchs(){
							this.ajaxData.keyword = this.search
							this.currenPage = 1
							this.showBasic(queryStepBasicsUrl,this.ajaxData) 
						},
						editParm(val){
							editParms(val)
						},
						LookDetails(val){
							Details(val)
						}
					},
				
					template:`
					<div class="swiper-slide swiper-no-swiping" id="workStepAndParametersInerSwiper">
						<!-- 内容区域 -->
						<div class="row">
							<div class="col-sm-12">
								<div class="panel panel-default">
									<div class="panel-heading panel-heading-table">
										<div class="row">
											<div class="col-xs-4">
											</div>
											<div class="col-xs-8">
												<form class="form-inline pull-right">
													<fieldset>
														<div class="input-group input-group-sm fuzzy-search-group">
															<input class="form-control" type="text" placeholder="输入关键字" maxlength="25" v-model="search" @keyup.enter="searchs()">
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
													<th style="width: 5%;"> 序号</th>
													<th style="width: 15%;">名称名称 </th>
													<th style="width: 15%;">编号编号</th>
													<th style="width: 15%;">半成品描述</th>
													<th style="width: 18%;">操作</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="(value,index) in dataList"  :key="index">
													<td>{{index+1}}</td>
													<td>{{value.craft_workstep_basics_name}}</td>
													<td>{{value.craft_workstep_basics_num}}</td>
													<td>{{value.craft_workstep_basics_describle}}</td>
													<td class="table-input-td">
														<a class="table-link" @click="LookDetails(value.craft_workstep_basics_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>参数详情</a>
														<a class="table-link" @click="editParm(value.craft_workstep_basics_id)" href="javascript:void(0);">
															<i class="fa fa-tasks fa-fw"></i>修改参数</a>
													</td>
												</tr>
												<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
					`
				})

				//参数详情
				function Details(val){
					let addCraftBasic = new Vue({
						el:"#detailModal",
						data(){
							return{
								queryBarInit: {
									deviceType: true,
								},
								dataList:[],
								lines:0, //条数
								currenPage:1, //当前页
								pagesize: 10,   //页码	
								ajaxData:{
									headNum:1
								}		
							}
						},
						mounted(){
							const modal = document.getElementById('detailModal')   //模态框
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
							this.showBasic()
						},
					
						methods:{
							showBasic(){
								$.ajax({
									type: "POST",
									url:queryStepBasicsAboutParameterUrl,
									data:{
										workstepBasicsId: val,
										headNum:this.ajaxData.headNum
									},
									success:  (result, status, xhr)=> {
										if(result.status === 0 ){
											this.dataList = result.map.resultList
											this.lines = result.map.counts
										}else{
											this.dataList = []
											this.lines = 0
										}
									}
								})
							},
						
							checkUnit(val){
								unitsDetails(val)
							},
							handleCurrentChange(val){
								this.ajaxData.headNum = (val - 1) * 10 + 1;
								this.showBasic() 
							},
						},
						template:`
								<div class="modal fade" id="detailModal">
										<div class="modal-dialog">
												<div class="modal-content">
														<div class="modal-header">
																<button class="close" data-dismiss="modal">
																		<span >
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
																										<div class="col-xs-6">
																											<h4 class="pentl-title">工步参数详情</h4>
																										</div>
																									
																								</div>
																								<div class="table-height-10">
																										<table class="table table-bordered">
																												<thead>
																														<tr>
																															<th style="width: 8%;"> 序号</th>
																															<th style="width: 18%;">参数名称 </th>
																															<th style="width: 18%;">参数规格</th>
																															<th style="width: 20%;">参数描述</th>
																															<th style="width: 20%;">设备类型</th>
																															<th style="width: 18%;">操作</th>
																														</tr>
																												</thead>
																												<tbody>
																														<tr v-show='dataList.length' v-for="(val,index) in dataList" style="cursor:pointer">
																																<td>{{index+1}}</td>
																																<td>{{val.standard_parameter_name}}</td>
																																<td>{{val.standard_parameter_specifications}}</td>
																																<td>{{val.standard_parameter_describle}}</td>
																																<td class="table-input-td">
																																	<mes-process-searchbar
																																	:init="queryBarInit"
																																	:deviceType="val.workstepParameterRelation.devices_control_devices_type_id" :disabled=true
																																	>
																																	</mes-process-searchbar>
																																	
																																</td>
																																<td class="table-input-td">
																																	<a class="table-link"  href="javascript:void(0);"  @click="checkUnit(val.standard_parameter_id)"><i class="fa fa-tasks fa-fw"></i>查看单位</a></td>
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
					//查看单位
					function unitsDetails(val){
						let unitsDetails = new Vue({
							el:"#unitsDetails",
							data(){
								return{
									dataList:[],
									lines:0, //条数
									currenPage:1, //当前页
									pagesize: 10,   //页码
									ajaxData:{
										headNum:1
									}			
								}
							},
							mounted(){
								const modal = document.getElementById('unitsDetails')   //模态框
								$(modal).modal({
									backdrop: 'static', // 黑色遮罩不可点击
									keyboard: false,  // esc按键不可关闭模态框
									show: true     //显示
								})
								$(modal).on('hidden.bs.modal', function (e) {
									$('body').addClass('modal-open')
								})
								this.showBasic()
							},
						
							methods:{
								showBasic(){
									$.ajax({
										type: "POST",
										url:queryParameterUnitsUrl,
										data:{
											realationParameterId: val,
											headNum:this.ajaxData.headNum
										},
										success:  (result, status, xhr)=> {
											if(result.status === 0 ){
												this.dataList = result.map.list
												this.lines = result.map.lines
											}else{
												this.dataList = []
												this.lines = 0
											}
										}
									})
								},
								handleCurrentChange(val){
									this.ajaxData.headNum = (val - 1) * 10 + 1;
									this.showBasic() 
								},
							},
							template:`
									<div class="modal fade" id="unitsDetails">
											<div class="modal-dialog">
													<div class="modal-content">
															<div class="modal-header">
																	<button class="close" data-dismiss="modal">
																			<span >
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
																											<div class="col-xs-6">
																												<h4 class="pentl-title">查看单位</h4>
																											</div>
																										
																									</div>
																									<div class="table-height-10">
																											<table class="table table-bordered">
																													<thead>
																															<tr>
																																<th style="width: 6%;"> 序号</th>
																																<th style="width: 18%;">单位名称 </th>
																																<th style="width: 18%;">单位符号</th>
																																<th style="width: 20%;">单位类型</th>
																															</tr>
																													</thead>
																													<tbody>
																															<tr v-show='dataList.length' v-for="(val,index) in dataList" style="cursor:pointer">
																																	<td>{{index+1}}</td>
																																	<td>{{val.parameter_unit_name}}</td>
																																	<td>{{val.parameter_unit}}</td>
																																	<td>{{val.parameter_unit_type}}
																																
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
				}
				//修改参数
				function editParms(val){
					let editParms  = new Vue({
						el:'#editParms',
						data() {
							return {
								queryBarInit: {
									deviceType: true,
								},
								idOnList:[],
								iqcResult:[],
								workstageParameterIds:[],
								tempdata1:[],
								tempdata2:[]
							}
						},
						created(){
							this.showBasic(val)
						},
						mounted(){
								const modal = document.getElementById('editParms')   //模态框
								$(modal).modal({
										backdrop: 'static', // 黑色遮罩不可点击
										keyboard: false,  // esc按键不可关闭模态框
										show: true     //显示
								})
								$(modal).on('hidden.bs.modal', function (e) {
										$('body').addClass('modal-open')
								})
						},
						methods:{
							showBasic(val){
								$.ajax({
									type: "POST",
									url: queryStepBasicsAboutParameterUrl,
									data:{
										workstepBasicsId: val,
									},
									beforeSend: (xml) => {
										this.loading = true
									},
									success:  (result, status, xhr) =>{
										this.loading = false
										if(result.status === 0 ){
											this.idOnList=result.map.resultList
										}else{
											this.idOnList = []
										}
									}
								})
							}, 
							save(){
								const modal = document.getElementById('editParms')   //模态框
								let		 tr = $(modal).find('tbody tr:not(:last-child)')
								for (let i = 0, len = tr.length; i < len; i++){	//遍历行
									let $td = tr.eq(i).find('td')
									this.tempdata1 =tr.eq(i).find("td").eq(1).attr("data")
									this.tempdata2 =tr.eq(i).find("td select").val()
											console.log(this.tempdata2 )
											if(	this.tempdata2!==null && 	this.tempdata2!== undefined ){
												let tempStr = `${this.tempdata1}:${this.tempdata2}`;
												this.workstageParameterIds[i] = tempStr;
											}else{
												this.$message({
													message: '请选择对应的设备',
													type: 'warning'
												})
												return  false
											}
									}
									console.log(this.workstageParameterIds)

								if (true) {
									swal({
										title: '您确定要提交本次操作吗?',
										text: '请确保填写信息无误后点击确定按钮',
										type: 'question',
										allowEscapeKey: false, // 用户按esc键不退出
										allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
										showCancelButton: true, // 显示用户取消按钮
										confirmButtonText: '确定',
										cancelButtonText: '取消',
									}).then( ()=> {

									if(this.idOnList.length!==0){
										$.ajax({
											type: "POST",
											url: maintainStepBasicsAboutParameterUrl,
											data: {
												type:"modify",
												workstepBasicsId:val,
												stepParameterIds:this.workstageParameterIds
											},
											success:(result, status, xhr)=> {
												if (result.status === 0) {

													const modal = document.getElementById('editParms')   //模态框
												swallSuccess2(modal)	//操作成功提示并刷新页面
												}else {
													let msg = result.msg
													if(msg!==null){
														swallFail2(msg)
													}else{
														swallError();	//格式不正确
													}
												}
											}
										})
									}else{
										$.ajax({
											type: "POST",
											url: maintainStepBasicsAboutParameterUrl,
											data: {
												type:"modify",
												workstepBasicsId:val,
												stepParameterIds:this.workstageParameterIds
											},
											success: (result, status, xhr) =>{
												if (result.status === 0) {
													const modal = document.getElementById('editParms')   //模态框
													swallSuccess2(modal)	//操作成功提示并刷新页面
												}else {
													let msg = result.msg
													if(msg!==null){
														swallFail2(msg)
													}else{
														swallError();	//格式不正确
													}
												}
											}
										})
									}
									});
								}
								else {
									swallError();	//格式不正确
								}
							},
							add(){
								let promise = new Promise( (resolve, reject)=> {
									add(resolve,this.iqcResult)
								})
								promise.then( (resolveData) => {
									this.iqcResult=[]
									resolveData.forEach((val,key) => {
										this.iqcResult.push(val)
									})
									console.log(this.iqcResult)
								})
							
							},
							deletes(index){
								swal({
										title: '您确定要移除此条数据吗？',
										text: '数据移除后无法恢复',
										type: 'question',
										showCancelButton: true,
										confirmButtonText: '确定',
										cancelButtonText: '取消'
								}).then( () => {
												this.iqcResult.splice(index,1)

										}
								)
						}
						},
						template:`
							<div class="modal fade" id="editParms">
									<div class="modal-dialog">
											<div class="modal-content">
													<div class="modal-header">
															<button class="close" data-dismiss="modal">
																	<span >
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
																									<div class="col-xs-6">
																										<h4 class="pentl-title">添加工步参数</h4>
																									</div>
																									<div class="col-xs-6">
																										<form class="form-inline pull-right">
																											<fieldset>
																												<a href="javascript:;" class="btn btn-primary btn-sm" @click="add()">新增参数</a>
																											</fieldset>
																										</form>
																									</div>
																							</div>
																							<div class="table-height-9" style="min-height: 375px;">
																									<table class="table table-bordered">
																											<thead>
																													<tr >
																														<th style="width: 8%;"> 序号</th>
																														<th style="width: 18%;">参数名称 </th>
																														<th style="width: 20%;">设备类型</th>
																														<th style="width: 18%;">操作</th>
																													</tr>
																											</thead>
																											<tbody>
																														<tr v-show='iqcResult.length' v-for="(val,index) in iqcResult" style="cursor:pointer">
																																<td>{{index+1}}</td>
																																<td :data ="val.parmID">{{val.parmName}}</td>
																																<td class="table-input-td">
																																	<mes-process-searchbar
																																	:init="queryBarInit"
																																	>
																																	</mes-process-searchbar>
																																	
																																</td>
																																<td class="table-input-td">
																																	<a class="table-link text-danger" href="javascript:;" @click="deletes(index)"><i class="fa fa-times"></i>移除</a>
																																</td>
																														</tr>
																														<tr v-show="!iqcResult.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
						`

				
					})
					function add(resolve,idOnList2) {
						let editParms  = new Vue({
							el:'#editParms2',
							data() {
									return {
											checked:false,
											checkNames:[],
											selected:"",
											queryParmTypeList:[],
											dataList:[], //遍历数据
											idOnList:[], //遍历数据
											lines:0, //条数
											currenPage:1, //当前页
											pagesize: 10,   //页码
											ajaxData:{
												type: 'parameterTypeQuery',
												headNum: 1,
												parameterTypeId:""
											}
									}
							},
							created(){
								this.queryParmType()
								this.showBasic(val)
								this.$emit("showBasic")
							},
							mounted(){
									const modal = document.getElementById('editParms2')   //模态框
									$(modal).modal({
											backdrop: 'static', // 黑色遮罩不可点击
											keyboard: false,  // esc按键不可关闭模态框
											show: true     //显示
									})
									$(modal).on('hidden.bs.modal', function (e) {
											$('body').addClass('modal-open')
									})
									
							},
							methods:{
								showBasic(val){
									$.ajax({
										type: "POST",
										url: queryStepBasicsAboutParameterUrl,
										data:{
											workstepBasicsId: val,
										},
										beforeSend: (xml) => {
											this.loading = true
										},
										success:  (result, status, xhr) =>{
											this.loading = false
											if(result.status === 0 ){
												this.idOnList=result.map.resultList
												console.log(	this.idOnList)
											}else{
												this.idOnList = []
											}
										}
									})
								}, 
								parmTypeAboutParms(){
									$.ajax({
										type: "POST",
										url: queryNormParameterUrl,
										data:this.ajaxData,
										beforeSend: (xml) => {
											this.loading = true
										},
										success:  (result, status, xhr) =>{
											if(result.status === 0 ){
												let tempList = result.map.resultListTree
												this.lines = result.map.counts
												for (let i = 0, len = tempList.length; i < len; i++) {  // 匹配已选择的数据
													tempList[i].selected = false  //所有按钮设置为没选择
													for (let j = 0, len = idOnList2.length; j < len; j++) {
														if (idOnList2[j].parmID ==	tempList[i].standardParameterList[0].standard_parameter_id) {
															tempList[i].selected = true
															this.checkNames.push(idOnList2[j].parmID) //存储已选择数据
														}
													}
													for (let j = 0, len = this.idOnList.length; j < len; j++) {
														if (this.idOnList[j].standard_parameter_id ==	tempList[i].standardParameterList[0].standard_parameter_id) {
															tempList[i].selected = true
															this.checkNames.push(this.idOnList[j].standard_parameter_id) //存储已选择数据
														}
													}
												}
												this.dataList=tempList
											}else{
												this.dataList = []
												this.lines = 0
											}
										}
									})
								},
								queryParmType(){
									$.ajax({
										type: "POST",
										url:queryParameterTypeUrl,
										data:{
											type: 'vague',
											status:0,
										},
										success: (result, status, xhr)=>{
											if(result.status === 0 ){
												this.queryParmTypeList = result.map.resultList
												console.log(this.queryParmTypeList)
											}else{
												this.queryParmTypeList = []
											}
										}
									})
								},
								//分页变化
								handleCurrentChange(val){
									this.ajaxData.headNum = (val - 1) * 10 + 1;
									this.ajaxData.parameterTypeId = this.selected;
									this.	parmTypeAboutParms()
								},
								selectChange(){
									this.ajaxData.parameterTypeId =  this.selected;
									this.parmTypeAboutParms()
								},
								//选择后执行的操作
								choice(val, index) {
									if(val.selected){
										val.selected  = false
										// traverseListDelete(	this.selectData,val);
										// idOnList2.splice(index,1)
										traverseListDelete(	this.checkNames,val.standardParameterList[0].standard_parameter_id);
									}else{
										// const modal = $(document.getElementById('addProject'))   //模态框
										// modal.modal('hide')
										// resolve(this.dataList[index])
										val.selected = true //设置为已选择
										// idOnList2.push(val)
										traverseListPush(this.checkNames,val.standardParameterList[0].standard_parameter_id);	//将功能id放入功能id集合
										//this.checkNames.push(val.standardParameterList[0].standard_parameter_id) //存储已选择数据
										//this.selectData.push(val)
									}
								
								},
								save(){
									const modal = $(document.getElementById('editParms2'))   //模态框
									modal.modal('hide')
									const tr = modal.find("table tbody tr")
								
									idOnList2=[]
									for(let i=0; i<tr.length;i++){
										const bodyParm={
											parmID:"",
											parmName:""
										}
										if(tr.eq(i).hasClass("bg-success")){
											bodyParm.parmID = tr.eq(i).find("td").eq(1).attr("data")
											bodyParm.parmName = tr.eq(i).find("td").eq(1).text()
											idOnList2.push(bodyParm)
										}
									}
									resolve(idOnList2)
								}
							},
							template:`
								<div class="modal fade" id="editParms2">
										<div class="modal-dialog">
												<div class="modal-content">
														<div class="modal-header">
																<button class="close" data-dismiss="modal">
																		<span >
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
																										<div class="col-xs-6">
																											<h4 class="pentl-title">选择单位</h4>
																										</div>
																										<div class="col-xs-6">
																											<form class="form-inline pull-right">
																												<fieldset>
																													<select class="form-control input-sm" v-model="selected" @change="selectChange">
																														<option value=""  disabled selected>参数类型</option>
																														<option v-for="(item, index) in queryParmTypeList"  :value="item.standard_parameter_type_id"  :key="index">{{item.standard_parameter_type_name}}</option>
																													</select>
																												</fieldset>
																										</form>
																										</div>
																								</div>
																								<div class="table-height-10">
																										<table class="table table-bordered">
																												<thead>
																														<tr>
																															<th style="width: 6%;"> 序号</th>
																															<th style="width: 18%;">参数名称 </th>
																															<th style="width: 20%;">参数描述</th>
																															<th style="width: 18%;">操作</th>
																														</tr>
																												</thead>
																												<tbody>
																														<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																																<td>{{index+1}}</td>
																																<td :data="val.standardParameterList[0].standard_parameter_id">{{val.standardParameterList[0].standard_parameter_name}}</td>
																																<td>{{val.standardParameterList[0].standard_parameter_describle}}</td>
																																<td class="table-input-td">
																																	<label class="checkbox-inline">
																																			<input type="checkbox" v-model="checkNames" :value="val.standardParameterList[0].standard_parameter_id" onclick="return"> 
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
							`
						})
					}

				}
			}
				
			break;
			case '#craftSegmentManage':{//工艺段管理
				let bus = new Vue()
				let panelBodyTableVM = new Vue({
					el:'#craftSegmentManageInerSwiper',
					data(){
						return{
							queryBarInit: {
								status: true,
								keyWord: true,
								productType: true,
								polarity: true
							},
							dataList:[],
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								headNum: 1,
								status: 0,
								keyword: "",
								productTypeId: '',
								polarity: "",
							},
						}
					},
					mounted(){
						this.showBasic() 
					},
					methods:{
						showBasic(){
							$.ajax({
								type: "POST",
								url: queryCraftSegmentOutlineUrl,
								data:this.ajaxData,
								success: (result, status, xhr)=>{
									if(result.status === 0 ){
										this.dataList = result.map.craftSegment
										this.lines = result.map.line
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						},
						searchBarQuery (queryParam) {
							if (queryParam !== undefined) {
								this.ajaxData.productTypeId = queryParam.productType
								this.ajaxData.polarity = queryParam.polarity
								this.ajaxData.status = queryParam.status
								this.ajaxData.keyword = queryParam.keyword
							}
							this.showBasic() 
							this.currenPage = 1
						},
						changeStatus(val,value){
							console.log(val)
							const bodyParam = {
								type:"",
								craftSegmentVersionsIds: []
							}
							bodyParam.craftSegmentVersionsIds.push(value.craft_segment_id)
							console.log(val)
							if(val == 0){
								bodyParam.type = 'deprecated'
								var statusName = "弃用"
							}else if(val == 1){
								bodyParam.type = 'recover'
								var statusName = "启用"
							}
							console.log(bodyParam)
							swal({
								title: '您确定要'+statusName+'吗？',
								text: "",
								type: 'question',
								showCancelButton: true,
								confirmButtonText: '确定',
								cancelButtonText: '取消'
							}).then( () => {
								$.ajax({
									type: "POST",
									url: modifyCraftSegmentVersionsStatusUrl,
									data:{
										type:bodyParam.type,
										craftSegmentVersionsIds:bodyParam.craftSegmentVersionsIds
									},
									success:  (result, status, xhr) =>{
										if (result.status === 0) {
											swal({
												title: statusName+'成功',
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
													this.showBasic()
												})
										}
										else {
											swal({
												title: statusName+'失败',
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
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							this.showBasic() 
						},
						addcraftSegmentManage(){
							const modal = document.getElementById('addcraftSegmentManage')
							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
							$(modal).show()
						},
						LookDetails(val){
							const modal = document.getElementById('craftSegmentManageDetail')
							bus.$emit('craftSegmentDetail', val)

							$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
							})
						},
						copy(val){
							bus.$emit('craftSegmentDetail', val)
							bus.$on("copy",(res)=>{
								bus.$emit('copyCraftSegmnt',res)
							})
							// bus.$emit('LookDetails',bus.$emit('craftSegmentDetail', val))
						}
					},
				
					template:`
						<div class="swiper-slide swiper-no-swiping" id="craftSegmentManageInerSwiper">
							<!-- 内容区域 -->
							<div class="row">
								<div class="col-sm-12">
									<div class="panel panel-default">
										<div class="panel-heading panel-heading-table">
											<div class="row">
												<div class="col-xs-4">
													<form class="form-inline">
														<a
															href="javascript:;"
															class="btn btn-primary btn-sm"
															v-text="'新增工艺段'"
															@click.prevent="addcraftSegmentManage">
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
										<div class="table-height-10">
											<table class="table table-bordered table-hover text-m">
												<thead>
													<tr>
														<th style="width: 6%;"> 序号</th>
														<th style="width: 10%;">工艺段名称 </th>
														<th style="width: 10%;">工艺段编号</th>
														<th style="width: 10%;">工艺段版本</th>
														<th style="width: 10%;">产品类型</th>
														<th style="width: 10%;">产品型号</th>
														<th style="width: 10%;">极性</th>
														<th style="width: 10%;">优率</th>
														<th style="width: 12%;">操作</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="(value,index) in dataList"  :key="index">
														<td>{{index+1}}</td>
														<td>{{value.craft_segment_name}}</td>
														<td>{{value.craft_segment_number}}</td>
														<td>{{value.craft_segment_versions}}</td>
														<td>{{value.product_model_type_name}}</td>
														<td>{{value.product_model_genre}}</td>
														<td>{{value.craft_segment_polarity}}</td>
														<td>{{value.craft_segment_quality_rate}}</td>
														<td class="table-input-td">
															<a class="table-link" @click="LookDetails(value.craft_segment_id)" href="javascript:void(0);">
																<i class="fa fa-tasks fa-fw"></i>详情</a>
															<a class="table-link" @click="copy(value.craft_segment_id)" href="javascript:void(0);">
																<i class="fa fa-tasks fa-fw"></i>添加到模板</a>
															<a class="table-link" @click="changeStatus(value.craft_segment_status,value)" v-if="value.craft_segment_status ==0" href="javascript:;">
																<i class="fa fa-trash-o fa-fw"></i>弃用</a>
															<a class="table-link text-danger"  @click="changeStatus(value.craft_segment_status,value)" href="javascript:;" v-if="value.craft_segment_status == 1" >
																<i class="fa fa-check fa-fw"></i>启用</a>
														</td>
													</tr>
													<tr v-show="!dataList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
						`
				})

				//详情
				let craftSegmentDetailVM = new Vue({
					el:"#craftSegmentManageDetail",
					data(){
						return{
							dataList:[],
							segmentWorkstageList:[],
							processDescribles:[],
							valArry:[]
						}
					},
					mounted(){
						bus.$on('craftSegmentDetail', (val) => {
							this.valArry=[]
							this.valArry.push(val)
							$.ajax({
								type: "POST",
								url:queryCraftSegmentParticularsUrl,
								data:{
									craftSegmentVersionsIds: this.valArry,
								},
								success:  (result, status, xhr)=> {
									if(result.status === 0 ){
										this.dataList=[],
										this.segmentWorkstageList=[],
										this.processDescribles=[],
										this.dataList = result.map.craftSegmentList[0]
										this.segmentWorkstageList = result.map.craftSegmentList[0].segmentWorkstageList
										if(result.map.craftSegmentList[0].processDescribles){
											this.processDescribles = result.map.craftSegmentList[0].processDescribles
										}
									//	this.processDescribles = result.map.craftSegmentList[0].processDescribles

										bus.$emit("copy",this.dataList)
									}else{
										this.dataList = []
										this.segmentWorkstageList = []
										this.processDescribles = []
									}
								}
							})
						})

					
					},
				
					methods:{
					
					},
					template:`
							<div class="modal fade" id="craftSegmentManageDetail">
									<div class="modal-dialog  modal-lg">
											<div class="modal-content">
													<div class="modal-header">
															<button class="close" data-dismiss="modal">
																	<span >
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
																									<div class="col-xs-6">
																										<h4 class="pentl-title">工艺段详情</h4>
																									</div>
																								
																							</div>
																							<div >
																								<table class="table table-bordered">
																									<tbody>
																										<tr>
																											<th style="width:10%">工艺段名称</th>
																											<td style="width:20%">{{dataList.craft_name}}</td>
																											<th style="width:10%">工艺段编号</th>
																											<td style="width:20%"></td>					
																											<th style="width:10%">工艺段版本</th>
																											<td style="width:20%"></td>			
																										</tr>	
																									
																										<tr>
																											<th >产品类型</th>
																											<td ></td>			
																											<th >产品类型</th>
																											<td ></td>			
																											<th >产品型号</th>
																											<td ></td>													
																										</tr>	
																									
																										<tr>
																											<th >优率</th>
																											<td ></td>				
																											<th >极性</th>
																											<td ></td>			
																											<th>创建人员</th>
																											<td ></td>																	
																										</tr>	
																									
																										<tr>
																											<th>创建时间</th>
																											<td>{{ }}</td>		
																											<th>备注</th>
																											<td></td>																		
																											<th></th>
																											<td></td>																		
																										</tr>	
																									</tbody>
																									</table>
																							</div>
																					</div>
																					<div class="panel panel-default">
																						<div class="panel-heading panel-heading-table">
																								<div class="col-xs-6">
																									<h4 class="pentl-title">工序信息</h4>
																								</div>
																						</div>
																						<div>
																								<table class="table table-bordered">
																										<thead>
																												<tr>
																													<th style="width: 6%;"> 序号</th>
																													<th style="width: 12%;">工序名称 </th>
																													<th style="width: 12%;">工序编号</th>
																													<th style="width: 12%;">极性</th>
																													<th style="width: 12%;">工序版本</th>
																													<th style="width: 12%;">产品类型</th>
																													<th style="width: 12%;">产品型号</th>
																												</tr>
																										</thead>
																										<tbody>
																												<tr v-show='segmentWorkstageList.length' v-for="(val,index) in segmentWorkstageList">
																														<td>{{index+1}}</td>
																														<td>{{val.workstage.workstage_name}}</td>
																														<td>{{val.workstage.workstage_number}}</td>
																														<td>{{val.workstage.workstage_polarity}}</td>
																														<td>{{val.workstage.workstage_versions}}</td>
																														<td>{{val.workstage.product_model_type_name}}</td>
																														<td>{{val.workstage.product_model_genre}}</td>
																												</tr>
																												<tr v-show="!segmentWorkstageList.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
																										</tbody>
																								</table>
																						</div>
																					</div>
																					<div class="panel panel-default">
																						<div class="panel-heading panel-heading-table">
																								<div class="col-xs-6">
																									<h4 class="pentl-title">事项说明</h4>
																								</div>
																						</div>
																						<div>
																								<table class="table table-bordered">
																										<thead>
																												<tr>
																													<th style="width: 6%;"> 序号</th>
																													<th style="width: 22%;">事项 </th>
																													<th style="width: 72%;">说明</th>
																												</tr>
																										</thead>
																										<tbody>
																												<tr v-show='processDescribles.length' v-for="(val,index) in processDescribles">
																														<td>{{val.order}}</td>
																														<td>{{val.proceeding}}</td>
																														<td>{{val.explain}}</td>
																												</tr>
																												<tr v-show="!processDescribles.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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

				// 新增工艺段管理
				let addcraftSegmentManageVM = new Vue({
					el:"#addcraftSegmentManage",
					data(){
						return{
							dataList:{
								craft_segment_basics_id: '',			//工艺段基础信息id 
								product_model_id: '',	 //产品id
								product_model_type_id: '',	 //产品类型id
								craft_segment_name: '',	//工艺名称 
								craft_segment_number: '',	//工艺编号 
								craft_segment_versions: '',	//工艺版本号
								product_model_type_name: '',		 //产品类型名称
								product_model_genre: '',		//产品型号
								craft_segment_quality_rate: '',		//优率
								craft_segment_polarity:"正极", //极性
								craft_segment_creation_staff: '',		//创建人员
								craft_segment_creation_staff_id: '',		//创建人员id
								craft_segment_describe: ''	//备注描述 y
							},
							productName:'',
							processDescrible:[],
							workstageList:[]
							
						}
					},
					mounted(){
						bus.$on("copyCraftSegmnt" ,(result) => {
							if(result!=="" && result!==undefined &&result!==null){
								this.dataList=""
								this.dataList= result 
								if(result.processDescribles){
									this.processDescrible = result.processDescribles
								}
								this.workstageList = result.segmentWorkstageList
								this.productName = this.dataList.product_model_type_name
								console.log(this.workstageList)
							}

						})
						this.	checkVersion()
						
					},
				
					methods:{
						chechCraftSemi(){
							let promise = new Promise( (resolve, reject)=> {
								choiceCraftSegmentBasic(resolve,this.basicsId)
							})
							promise.then( (resolveData) => {
									this.dataList.craft_segment_basics_id = resolveData.CraftSegmentBasicId
									this.dataList.craft_segment_name = resolveData.CraftSegmentBasicName
									this.dataList.craft_segment_number =resolveData.CraftSegmentBasicNum
							})
						},
						checkVersion(){
							let  target = document.getElementById('checkVersion')   //模态框
							mesPopover = new MesPopover(target, { content: "请输入正确的版本号"});
							mesPopover.hide()

							$.ajax({
								type: "POST",
								url: queryCraftSegmentVersionsUrl,
								data:{
									type: 'isExist',
									craftSegmentBasicsId:this.dataList.craft_segment_basics_id,
									versionsNumber:this.dataList.craft_segment_versions,
								} ,
								success:function(result){
									if(result.status===0){
										mesPopover.hide()
									}else{
										mesPopover.show()
										target.focus()
										return  false
									}
								}
							})
						},
						lookVersion(){
							lookVersion(queryCraftSegmentVersionsUrl,{
									type: 'history',
									craftSegmentBasicsId:	this.dataList.craft_segment_basics_id,
									headNum:1
								}
							)
						},
						choiceProductType(){
							let promise = new Promise( (resolve, reject)=> {
								choiceProductType(resolve)
							})
							promise.then( (resolveData) => {
								this.dataList.product_model_type_id = resolveData.productTypeId
								this.dataList.product_model_type_name = resolveData.productTypeName
								this.productName = this.dataList.product_model_type_name
							})
						},
						choicemodelGenre(){
							if(this.dataList.product_model_type_name===""){
								this.$message({
									message: '请先选择产品类型',
									type: 'warning'
								})
							}else{
								let promise = new Promise( (resolve, reject)=> {
									choicemodelGenre(resolve,	this.dataList.product_model_type_id)
								})
								promise.then( (resolveData) => {
									this.dataList.product_model_genre = resolveData.productmodelGenre
								})
							}
						},
						submit(){
							console.log(this.processDescrible)
						},
						addprocessDescrible(){
							const  temSer={
								order:"",
								proceeding:"",
								explain:""
							}
							this.processDescrible.push(temSer)
						},
						addworkStage(){
							let promise = new Promise( (resolve, reject)=> {
								addworkStage(resolve,this.workstageList )
							})
							promise.then( (resolveData) => {
								this.workstageList=[]
								this.dataList.craft_segment_quality_rate=1
								resolveData.forEach((val,key) => {
									let workstage2 ={
										workstage:""
									}
									workstage2.workstage = val
									this.workstageList.push(workstage2)
								})
								this.workstageList.forEach((val,key)=>{
									this.dataList.craft_segment_quality_rate *= parseFloat(val.workstage.workstage_quality_rate)/100
								})
								this.dataList.craft_segment_quality_rate *=100
								console.log(this.dataList.craft_segment_quality_rate)
							})
						},
						moveUp(val,index){
							if(index >0){
								this.workstageList.splice(index, 1);
								this.workstageList.splice(index-1,0, val);
							}else{
							}
						},
						moveDown(val,index){
							if(index<this.workstageList.length-1){
								let downDate = this.workstageList[index + 1]
								this.workstageList.splice(index+1, 1);
								this.workstageList.splice(index,0, downDate);
							}else{
							}
						}
					
					},
					watch:{
						productName:{
							handler(newValue, oldValue) {
								this.dataList.product_model_genre = ""
				　　　 },
				　　　 deep: true
						}
					},
				
					template:`
							<div class="modal fade" id="addcraftSegmentManage">
									<div class="modal-dialog  modal-lg">
											<div class="modal-content">
													<div class="modal-header">
															<button class="close" data-dismiss="modal">
																	<span >
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
																									<div class="col-xs-6">
																										<h4 class="pentl-title">新增工艺段</h4>
																									</div>
																								
																							</div>
																							<div >
																								<table class="table table-bordered">
																									<tbody>
																										<tr>
																											<th style="width:10%">工艺段名称</th>
																											<td style="width:15%" class="table-input-td">
																												<input type="text" class="table-input" placeholder="点此选择工艺段(必填)"  @click="chechCraftSemi()" :value="this.dataList.craft_segment_name" />
																											</td>
																											<th style="width:10%">工艺段编号</th>
																											<td style="width:20%">{{this.dataList.craft_segment_number}}</td>					
																											<th style="width:10%">工艺段版本</th>
																											<td style="width:20%" class="table-input-td">
																												<div class="input-group input-group-sm">
																													<input type="text" class="table-input" placeholder="填写工艺段版本"  v-model="dataList.craft_segment_versions" v-on:blur="checkVersion()" id="checkVersion"/>
																													<div class="input-group-btn"  @click="lookVersion()">
																															<button type="button" class="btn btn-primary">
																																	<i class="fa fa-search"></i>
																															</button>
																													</div>
																												</div>
																											</td>			
																										</tr>	
																									
																										<tr>
																											<th >产品类型</th>
																											<td style="width:15%" class="table-input-td">
																												<input type="text" class="table-input" placeholder="点此产品类型(必填)"  @click="choiceProductType()" :value="this.dataList.product_model_type_name" />
																											</td>		
																											<th >产品型号</th>
																											<td style="width:15%" class="table-input-td">
																												<input type="text" class="table-input" placeholder="点此产品型号(必填)"  @click="choicemodelGenre()" :value="this.dataList.product_model_genre" />
																											</td>		
																											<th >优率</th>
																											<td >{{dataList.craft_segment_quality_rate | numberTwo}}</td>														
																										</tr>	
																									
																										<tr>
																											<th >极性</th>
																											<td class="table-input-td">
																												<select class="form-control table-input input-sm"   v-model="dataList.craft_segment_polarity" :value="dataList.craft_segment_polarity">
																														<option value="正极" >正极</option>
																														<option value="负极">负极</option>
																												</select>
																											</td>		
																											<th >备注</th>
																											<td colspan="6" class="table-input-td">
																												<input type="text" class="table-input" placeholder="填写说明"  v-model="dataList.craft_segment_describe" :value="dataList.craft_segment_describe"/>

																											</td>		
																										
																										</tr>	
																									</tbody>
																									</table>
																							</div>
																					</div>
																					<div class="panel panel-default">
																						<div class="panel-heading panel-heading-table">
																								<div class="col-xs-6">
																									<h4 class="pentl-title">工序信息</h4>
																								</div>
																								<div class="col-xs-6">
																									<form class="form-inline pull-right">
																										<a
																											href="javascript:;"
																											class="btn btn-primary btn-sm"
																											v-text="'新增说明'"
																											@click.prevent="addworkStage">
																										</a>
																									</form>
																								</div>
																						</div>
																						<div>
																								<table class="table table-bordered">
																										<thead>
																												<tr>
																													<th style="width: 6%;"> 序号</th>
																													<th style="width: 12%;">工序名称 </th>
																													<th style="width: 12%;">工序编号</th>
																													<th style="width: 12%;">极性</th>
																													<th style="width: 12%;">工序版本</th>
																													<th style="width: 12%;">产品类型</th>
																													<th style="width: 12%;">产品型号</th>
																													<th style="width: 12%;">操作</th>
																												</tr>
																										</thead>
																										<tbody>
																												<tr  v-show='workstageList.length' v-for="(val,index) in workstageList">
																														<td>{{index+1}}</td>
																														<td>{{val.workstage.workstage_name}}</td>
																														<td>{{val.workstage.workstage_number}}</td>
																														<td>{{val.workstage.workstage_polarity}}</td>
																														<td>{{val.workstage.workstage_versions}}</td>
																														<td>{{val.workstage.product_model_type_name}}</td>
																														<td>{{val.workstage.product_model_genre}}</td>
																														<td class="table-input-td">
																															<a class="table-link" href="javascript:;" @click="moveUp(val,index)"><i class="fa fa-arrow-up"></i>上移</a>
																															<a class="table-link" href="javascript:;" @click="moveDown(val,index)"><i class="fa fa-arrow-down"></i>下移</a>
																														</td>
																												</tr>
																										</tbody>
																								</table>
																						</div>
																					</div>
																					<div class="panel panel-default">
																						<div class="panel-heading panel-heading-table">
																								<div class="col-xs-6">
																									<h4 class="pentl-title">事项说明</h4>
																								</div>
																								<div class="col-xs-6">
																									<form class="form-inline pull-right">
																										<a
																											href="javascript:;"
																											class="btn btn-primary btn-sm"
																											v-text="'新增说明'"
																											@click.prevent="addprocessDescrible">
																										</a>
																									</form>
																							</div>
																						</div>
																						<div>
																								<table class="table table-bordered">
																										<thead>
																												<tr>
																													<th style="width: 6%;"> 序号</th>
																													<th style="width: 22%;">事项 </th>
																													<th style="width: 72%;">说明</th>
																												</tr>
																										</thead>
																										<tbody>
																												<tr v-show='processDescrible.length' v-for="(val,index) in processDescrible">
																													<td v-text="index+1"></td>
																													<td class="table-input-td">
																														<input type="text" class="table-input"   :value="val.proceeding" v-model="val.proceeding"/>
																													</td>
																													<td class="table-input-td">
																														<input type="text" class="table-input"   :value="val.explain" v-model="val.explain"/>
																													</td>
																												</tr>
																												<tr v-show="!processDescrible.length"><td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择或输入查询条件</td></tr>
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
														<div class="col-xs-12">
															<button type ="button" class="btn btn-primary modal-submit" @click="submit">确认提交</button>
														</div>
													</div>
												</div>
												</div>
										</div>
							</div>
						`
				})

			
			}
				
			break;
		}
	})
	leftNavLink.eq(2).trigger('click');

	
	//选择单位模态框
	function chenkUnits(resolve ,idList,type,val){
		let chenkUnits  = new Vue({
				el:'#chenkUnits',
				data() {
						return {
								loading: false,  //loading加载
								checked:false,
								checkNames:[],
								tempCheckList: [],  //临时互传数据
								dataList:[], //遍历数据
								lines:0, //条数
								search:'', //搜索框值
								currenPage:1, //当前页
								pagesize: 10,   //页码
								ajaxData:{
									type: 'vague',
									headNum: 1,
									keyword: "",
									status:0
								}
						}
				},
				created(){
					this.showBasic(this.ajaxData)
				},
				mounted(){
						const modal = document.getElementById('chenkUnits')   //模态框
						$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
						})
						$(modal).on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
						})

					
				},
				computed:{
					
				},
				methods:{
						showBasic(data){
							$.ajax({
								type: "POST",
								url: queryStandardParameterUnitsUrl,
								data:data,
								beforeSend: (xml) => {
									this.loading = true
								},
								success:  (result, status, xhr) =>{
									this.loading = false
									if(result.status === 0 ){
										let tempList=result.map.parameterUnitList
										this.checkNames = [] //清空已选择的数据
										for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
											tempList[i].selected = false  //所有按钮设置为没选择
											for (let j = 0, len = idList.length; j < len; j++) {
												if (idList[j] == tempList[i].parameter_unit_id) {
													tempList[i].selected = true
													this.checkNames.push(idList[j]) //存储已选择数据
												}
											}
										}

										this.dataList = tempList
										this.lines = result.map.count
									}else{
										this.dataList = []
										this.lines = 0
									}
								}
							})
						}, 
						save(){
							if(type === "edit"){
								console.log(this.checkNames)
								swal({
									title: '您确定要提交本次操作吗?',
									text: '请确保填写信息无误后点击确定按钮',
									type: 'question',
									allowEscapeKey: false, // 用户按esc键不退出
									allowOutsideClick: false, // 用户点击弹窗外部不弃用弹窗。
									showCancelButton: true, // 显示用户取消按钮
									confirmButtonText: '确定',
									cancelButtonText: '取消',
								}).then( ()=>{
									$.ajax({
										type: "POST",
										url: maintainStandardParameterAndUnitsUrl,
										data: {
											type:"modify",
											StandarParameterId:val,
											unitIds:this.checkNames
										},
										success: (result, status, xhr)=> {
											if (result.status === 0) {
												const modal = document.getElementById('chenkUnits')   //模态框
												swallSuccess2(modal)	//操作成功提示并刷新页面
											}else {
												let msg = result.msg
												if(msg!==null){
													swallFail2(msg)
												}else{
													swallError();	//格式不正确
												}
											}
										}
									})
								});
							}else{
								const modal = document.getElementById('chenkUnits')   //模态框
								$(modal).modal('hide')
								// this.tempCheckList=this.tempCheckList.concat(this.checkNames)//存储已选择数据
								resolve(this.checkNames)
							}
						
						},
						//分页变化
						handleCurrentChange(val){
							this.ajaxData.keyword = this.search
							this.ajaxData.headNum = (val - 1) * 10 + 1;
							this.showBasic(this.ajaxData)
						},
						//搜索框
						searchs(){
							this.ajaxData.keyword = this.search
							this.currenPage = 1
							this.showBasic(this.ajaxData)
						},
						//选择后执行的操作
						choice(value, index) {
							if (value.selected) { //已经选择
								this.dataList[index].selected = false
								traverseListDelete(this.checkNames,value.parameter_unit_id);
							} else {
								this.dataList[index].selected = true //设置为已选择
								traverseListPush(this.checkNames,value.parameter_unit_id);	//将功能id放入功能id集合
							}

						},
				},
			
				template:`
					<div class="modal fade" id="chenkUnits">
							<div class="modal-dialog">
									<div class="modal-content">
											<div class="modal-header">
													<button class="close" data-dismiss="modal">
															<span >
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
																							<div class="col-xs-6">
																								<h4 class="pentl-title">选择单位</h4>
																							</div>
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
																												<th style="width: 6%;"> 序号</th>
																												<th style="width: 18%;">单位名称 </th>
																												<th style="width: 18%;">单位符号</th>
																												<th style="width: 20%;">单位类型</th>
																												<th style="width: 18%;">操作</th>
																											</tr>
																									</thead>
																									<tbody>
																											<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																													<td>{{index+1}}</td>
																													<td>{{val.parameter_unit_name}}</td>
																													<td>{{val.parameter_unit}}</td>
																													<td>{{val.parameter_unit_type}}</td>
																													<td class="table-input-td">
																															<label class="checkbox-inline">
																																	<input type="checkbox" v-model="checkNames" :value="val.parameter_unit_id" onclick="return"> 
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
				`
		})
		// chenkUnits.showBasic(chenkUnits.ajaxData)
				
	}
	//选择工艺段基础
	function choiceCraftSegmentBasic(resolve){
		let chenkUnits  = new Vue({
				el:'#choiceCraftSegmentBasic',
				data() {
					return{
						dataList:[],
						lines:0, //条数
						search:'', //搜索框值
						currenPage:1, //当前页
						pagesize: 10,   //页码
						ajaxData:{
							type: 'vague',
							headNum: 1,
							status: 0,
							keyword: ""

						}
					}
				},
				created(){
					this.showBasic()
				},
				mounted(){
						const modal = document.getElementById('choiceCraftSegmentBasic')   //模态框
						$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
						})
						$(modal).on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
						})

					
				},
				computed:{
					
				},
				methods:{
					showBasic(){
						$.ajax({
							type: "POST",
							url: queryCraftSegmentBasicsUrl,
							data:this.ajaxData,
							success: (result, status, xhr) =>{
								if(result.status === 0 ){
									this.dataList = result.map.craftSegmentDasicsList
									this.lines = result.map.count
								}else{
									this.dataList = []
									this.lines = 0
								}
							}
						})
					},
					handleCurrentChange(val){
						this.ajaxData.keyword = this.search
						this.ajaxData.status = this.selected
						this.ajaxData.headNum = (val - 1) * 10 + 1;
						this.showBasic()
					},
					//搜索框
					searchs(){
						this.ajaxData.keyword = this.search
						this.ajaxData.status = this.selected
						this.currenPage = 1
						this.showBasic()
					},
					//选择后执行的操作
					choice(value, index) {
						const modal = document.getElementById('choiceCraftSegmentBasic')   //模态框
					  $(modal).modal('hide')
						resolve({
							CraftSegmentBasicId:value.craft_segment_basics_id,
							CraftSegmentBasicName:value.craft_segment_name,
							CraftSegmentBasicNum:value.craft_segment_number,
						})

					},
				},
			
				template:`
					<div class="modal fade" id="choiceCraftSegmentBasic">
							<div class="modal-dialog">
									<div class="modal-content">
											<div class="modal-header">
													<button class="close" data-dismiss="modal">
															<span >
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
																							<div class="col-xs-6">
																								<h4 class="pentl-title">选择工艺段</h4>
																							</div>
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
																												<th style="width: 6%;"> 序号</th>
																												<th style="width: 18%;">工艺段名称 </th>
																												<th style="width: 18%;">工艺段编号</th>
																												<th style="width: 20%;">工艺段描述</th>
																												<th style="width: 18%;">操作</th>
																											</tr>
																									</thead>
																									<tbody>
																											<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																													<td>{{index+1}}</td>
																													<td>{{val.craft_segment_name}}</td>
																													<td>{{val.craft_segment_number}}</td>
																													<td>{{val.craft_segment_basics_describe}}</td>
																													<td class="table-input-td">
																														<a	href="javascript:;" 	class="table-link">
																															<i class="fa fa-plus fa-fw"></i>选择
																														</a>
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
	//选择产品类型
	function choiceProductType(resolve){
		let choiceProductType  = new Vue({
				el:'#detailModal',
				data() {
					return{
						dataList:[],
						lines:0, //条数
						search:'', //搜索框值
						currenPage:1, //当前页
						pagesize: 10,   //页码
						ajaxData:{
							type: 'vague',
							headNum: 1,
							status: 0,
							keyWord: ""

						}
					}
				},
				created(){
					this.showBasic()
				},
				mounted(){
						const modal = document.getElementById('detailModal')   //模态框
						$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
						})
						$(modal).on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
						})

					
				},
				computed:{
					
				},
				methods:{
					showBasic(){
						$.ajax({
							type: "POST",
							url: queryProductTypeUrl,
							data:this.ajaxData,
							success: (result, status, xhr) =>{
								if(result.status === 0 ){
									this.dataList = result.map.productTypes
									this.lines = result.map.lines
								}else{
									this.dataList = []
									this.lines = 0
								}
							}
						})
					},
					handleCurrentChange(val){
						this.ajaxData.keyWord = this.search
						this.ajaxData.headNum = (val - 1) * 10 + 1;
						this.showBasic()
					},
					//搜索框
					searchs(){
						this.ajaxData.keyWord = this.search
						this.currenPage = 1
						this.showBasic()
					},
					//选择后执行的操作
					choice(value, index) {
						const modal = document.getElementById('detailModal')   //模态框
					  $(modal).modal('hide')
						resolve({
							productTypeId:value.product_model_type_id,
							productTypeName:value.product_type_name,
						})

					},
				},
			
				template:`
					<div class="modal fade" id="detailModal">
							<div class="modal-dialog">
									<div class="modal-content">
											<div class="modal-header">
													<button class="close" data-dismiss="modal">
															<span >
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
																							<div class="col-xs-6">
																								<h4 class="pentl-title">选择产品类型</h4>
																							</div>
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
																												<th style="width: 6%;"> 序号</th>
																												<th style="width: 18%;">类型名称 </th>
																												<th style="width: 18%;">类型编号</th>
																												<th style="width: 20%;">类型描述</th>
																												<th style="width: 18%;">操作</th>
																											</tr>
																									</thead>
																									<tbody>
																											<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																													<td>{{index+1}}</td>
																													<td>{{val.product_type_name}}</td>
																													<td>{{val.product_type_number}}</td>
																													<td>{{val.product_type_describe}}</td>
																													<td class="table-input-td">
																														<a	href="javascript:;" 	class="table-link">
																															<i class="fa fa-plus fa-fw"></i>选择
																														</a>
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
	//选择工序管理
	function addworkStage(resolve,idList){
		let addworkStage  = new Vue({
				el:'#detailModal',
				data() {
					return{
						queryBarInit: {
							keyWord: true,
							productType: true,
							polarity: true
						},
						dataList:[],
						checkNames:[],
						checkVal:[],
						lines:0, //条数
						search:'', //搜索框值
						currenPage:1, //当前页
						pagesize: 10,   //页码
						ajaxData:{
							headNum: 1,
							status: 0,
							keyword: "",
							productTypeId: '',
							polarity: "",
						},
					}
				},
				created(){
					this.showBasic()
				},
				mounted(){
						const modal = document.getElementById('detailModal')   //模态框
						$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
						})
						$(modal).on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
						})

					
				},
				computed:{
					
				},
				methods:{
					showBasic(){
						$.ajax({
							type: "POST",
							url: queryWorkstageOutlineUrl,
							data:this.ajaxData,
							success: (result, status, xhr) =>{
								if(result.status === 0 ){
									let tempList= result.map.workstages
									this.checkNames = [] //清空已选择的数据
									this.checkVal = [] //清空已选择的数据
									for (let i = 0, len = tempList.length; i < len; i++) {  //匹配已选择的数据
										tempList[i].selected = false  //所有按钮设置为没选择
										for (let j = 0, len = idList.length; j < len; j++) {
											if (idList[j].workstage.workstage_id == tempList[i].workstage_id) {
												tempList[i].selected = true
												this.checkNames.push(idList[j].workstage.workstage_id) //存储已选择数据
												this.checkVal.push(tempList[i]) //存储已选择数据
											}
										}
									}

									this.dataList = tempList
									this.lines = result.map.lines
								}else{
									this.dataList = []
									this.lines = 0
								}
							}
						})
					},
					handleCurrentChange(val){
						this.ajaxData.keyword = this.search
						this.ajaxData.productTypeId = this.productTypeId
						this.ajaxData.polarity = this.polarity
						this.ajaxData.headNum = (val - 1) * 10 + 1;
						this.showBasic()
					},
					//搜索框
					searchBarQuery(queryParam){
						if (queryParam !== undefined) {
							this.ajaxData.keyword = queryParam.keyword
							this.ajaxData.productTypeId = queryParam.productType
							this.ajaxData.polarity = queryParam.polarity
						}
						this.currenPage = 1
						this.showBasic()
					},
					//选择后执行的操作
					choice(value, index) {
						if (value.selected) { //已经选择
							this.dataList[index].selected = false
							traverseListDelete(this.checkNames,value.workstage_id);
							for(let i=0;i<this.checkVal.length;i++){
								if(this.checkVal[i].workstage_id == value.workstage_id){
								this.checkVal.splice(i,1)
								}
							}
						
						} else {
							this.dataList[index].selected = true //设置为已选择
							traverseListPush(this.checkNames,value.workstage_id)//将功能id放入功能id集合
							this.checkVal.push(value) //存储已选择数据
						}

					},
					save(){
						const modal = document.getElementById('detailModal')   //模态框
						$(modal).modal('hide')
						resolve(this.checkVal)
				
					
					},
				},
			
				template:`
					<div class="modal fade" id="detailModal">
							<div class="modal-dialog">
									<div class="modal-content">
											<div class="modal-header">
													<button class="close" data-dismiss="modal">
															<span >
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
																							<div class="col-xs-2">
																								<h4 class="pentl-title">选择工序</h4>
																							</div>
																							<div class="col-xs-10" >
																								<mes-process-searchbar
																								:init="queryBarInit"
																								@search="searchBarQuery"
																								>
																								</mes-process-searchbar>
																							</div>
																						
																					</div>
																					<div class="table-height-10">
																							<table class="table table-bordered">
																									<thead>
																											<tr>
																												<th style="width: 6%;"> 序号</th>
																												<th style="width: 18%;">工序名称 </th>
																												<th style="width: 18%;">工序版本</th>
																												<th style="width: 20%;">极性</th>
																												<th style="width: 18%;">操作</th>
																											</tr>
																									</thead>
																									<tbody>
																											<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																													<td>{{index+1}}</td>
																													<td>{{val.workstage_name}}</td>
																													<td>{{val.workstage_versions}}</td>
																													<td>{{val.workstage_polarity}}</td>
																													<td class="table-input-td">
																															<label class="checkbox-inline">
																																	<input type="checkbox" v-model="checkNames" :value="val.workstage_id" onclick="return"> 
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
				`
		})
				
	}
	//选择产品类型对应型号
	function choicemodelGenre(resolve,typeId){
		let choiceProductType  = new Vue({
				el:'#detailModal',
				data() {
					return{
						dataList:[],
						// lines:0, //条数
						// currenPage:1, //当前页
						// pagesize: 10,   //页码
					
					}
				},
				created(){
					this.showBasic()
				},
				mounted(){
						const modal = document.getElementById('detailModal')   //模态框
						$(modal).modal({
								backdrop: 'static', // 黑色遮罩不可点击
								keyboard: false,  // esc按键不可关闭模态框
								show: true     //显示
						})
						$(modal).on('hidden.bs.modal', function (e) {
								$('body').addClass('modal-open')
						})

					
				},
				computed:{
					
				},
				methods:{
					showBasic(){
						$.ajax({
							type: "POST",
							url: queryProductTypeAboutModelUrl,
							data:{
								type: 'precise',
								status:0,
								productTypeId:typeId
							},
							success: (result, status, xhr) =>{
								if(result.status === 0 ){
									this.dataList = result.map.productType
								}else{
									this.dataList = []
								}
							}
						})
					},
					//选择后执行的操作
					choice(value, index) {
						const modal = document.getElementById('detailModal')   //模态框
					  $(modal).modal('hide')
						resolve({
							productmodelGenre:value.product_model_genre,
						})

					},
				},
			
				template:`
					<div class="modal fade" id="detailModal">
							<div class="modal-dialog">
									<div class="modal-content">
											<div class="modal-header">
													<button class="close" data-dismiss="modal">
															<span >
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
																							<div class="col-xs-6">
																								<h4 class="pentl-title">选择产品类型</h4>
																							</div>
																						
																					</div>
																					<div class="table-height-10">
																							<table class="table table-bordered">
																									<thead>
																											<tr>
																												<th style="width: 6%;"> 序号</th>
																												<th style="width: 18%;">产品名称 </th>
																												<th style="width: 18%;">产品型号</th>
																												<th style="width: 20%;">产品编号</th>
																												<th style="width: 18%;">操作</th>
																											</tr>
																									</thead>
																									<tbody>
																											<tr v-show='dataList.length' v-for="(val,index) in dataList" @click="choice(val, index)" style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																													<td>{{index+1}}</td>
																													<td>{{val.product_model_name}}</td>
																													<td>{{val.product_model_genre}}</td>
																													<td>{{val.product_model_number}}</td>
																													<td class="table-input-td">
																														<a	href="javascript:;" 	class="table-link">
																															<i class="fa fa-plus fa-fw"></i>选择
																														</a>
																													</td>
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
										</div>
								</div>
					</div>
				`
		})
				
	}

	// 查看历史版本
	function lookVersion(url, data){
		let lookVersion  = new Vue({
			el:'#detailModal',
			data() {
					return {
							dataList:[], //遍历数据
							lines:0, //条数
							search:'', //搜索框值
							currenPage:1, //当前页
							pagesize: 10,   //页码
							ajaxData:{
								type: 'vague',
								headNum: 1,
								keyword: "",
								status:0
							}
					}
			},
			created(){
				this.showBasic()
			},
			mounted(){
					const modal = document.getElementById('detailModal')   //模态框
					$(modal).modal({
							backdrop: 'static', // 黑色遮罩不可点击
							keyboard: false,  // esc按键不可关闭模态框
							show: true     //显示
					})
					$(modal).on('hidden.bs.modal', function (e) {
							$('body').addClass('modal-open')
					})
					this.showBasic()
				
			},
			computed:{
				
			},
			methods:{
					showBasic(){
						$.ajax({
							type: "POST",
							url: url,
							data:data,
							beforeSend: (xml) => {
								this.loading = true
							},
							success:  (result, status, xhr) =>{
								this.loading = false
								if(result.status === 0 ){
									this.dataList = result.map.craftSegments
									this.lines = result.map.line
								}else{
									this.dataList = []
									this.lines = 0
								}
							}
						})
					}, 
				
					//分页变化
					handleCurrentChange(val){
						this.ajaxData.headNum = (val - 1) * 10 + 1;
						this.showBasic(this.ajaxData)
					},
			},
		
			template:`
				<div class="modal fade" id="detailModal">
						<div class="modal-dialog">
								<div class="modal-content">
										<div class="modal-header">
												<button class="close" data-dismiss="modal">
														<span >
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
																						<div class="col-xs-6">
																							<h4 class="pentl-title">历史版本信息</h4>
																						</div>
																				</div>
																				<div class="table-height-10">
																						<table class="table table-bordered">
																								<thead>
																										<tr>
																											<th style="width: 6%;"> 序号</th>
																											<th style="width: 18%;">版本号 </th>
																											<th style="width: 18%;">产品类型</th>
																											<th style="width: 20%;">产品型号</th>
																											<th style="width: 18%;">极性</th>
																										</tr>
																								</thead>
																								<tbody>
																										<tr v-show='dataList.length' v-for="(val,index) in dataList"  style="cursor:pointer" :class="val.selected ? 'bg-success':'' ">
																												<td>{{index+1}}</td>
																												<td>{{val.craft_segment_versions}}</td>
																												<td>{{val.product_model_type_name}}</td>
																												<td>{{val.product_model_genre}}</td>
																												<td>{{val.craft_segment_polarity}}</td>
																											
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

	// 搜索栏组件
	Vue.component('mes-process-searchbar', {
		data () {
			return {
				productTypeOption: [],
				selectedProductType: '',
				polarityOption: [
					{
						polarity: '全部',
						value: null
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
				selectedPolarity: null,
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
				selectedStatus: 0,
				keyword: '',
				paramTypeOption: [],
				selectedParamType: '',
				deviceTypeOption: [],
				selectedDeviceType: '',
				productionStateOption: [
					{
						text: '正在生产',
						value: 1
					},
					{
						text: '生产完成',
						value: 2
					},
					{
						text: '生产取消',
						value: 3
					}
				],
				selectedProductionState: 1,
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
						//设备类型
						deviceType: false
					}
				},
				// required: true
			},
			deviceType: {
				type: String
			},
			disabled:false
		},
		computed: {
			searchParam () {
				let param = {}
				param.productType = this.selectedProductType
				param.polarity = this.selectedPolarity
				param.status = this.selectedStatus
				param.keyword = this.keyword
				param.paramType = this.selectedParamType
				param.productionState = this.productionState
				return param
			}
			
		},
		watch: {
		},
		methods: {
			triggerSearchEvent () {
				this.$emit('search', this.searchParam)
			},
			getQueryProductTypeID () {
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
			getQueryParamTypeID () {
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
			},
			getQueryDeviceTypeID () {
				$.ajax({
					type: "POST",
					url: queryDevicesTypesUrl,
					success: (result, status, xhr)=>{
						if(result.status === 0 ){
							this.deviceTypeOption = result.map.devices_control_devices_type
						}else{
							this.deviceTypeOption = []
						}
					}
				})
			}
		},
		mounted () {
			if (this.init.productType) {
				this.getQueryProductTypeID()
			}
			if (this.init.paramType) {
				this.getQueryParamTypeID()
			}
			if (this.init.deviceType) {
				this.getQueryDeviceTypeID()
			}
			this.selectedDeviceType = this.deviceType
			console.log(this.selectedDeviceType)
		},
		template: `
			<form class="form-inline pull-right">
				<select
					v-if="init.deviceType"
					class="form-control input-sm  table-input-td"
					v-model="selectedDeviceType"
					@change="triggerSearchEvent"
					:disabled=disabled
					>
					<option
						disabled
						value=""
						v-text="'设备类型'"
					>
					</option>
					<option
						v-for="(item, index) in deviceTypeOption"
						:key="index"
						v-text="item.devices_control_devices_type_name"
						:value="item.devices_control_devices_type_id"
					>
					</option>
				</select>
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
				<select
					v-if="init.polarity"
					class="form-control input-sm"
					v-model="selectedPolarity"
					@change="triggerSearchEvent"
				>
					<option
						disabled
						value=""
						v-text="'极性'"
					>
					</option>
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
						disabled
						value=""
						v-text="'生产状态'"
					>
					</option>
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
	//产品类型
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
        this.tableData = []
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
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
        this.tableData = []
        mesReq(this.URL, reqInit, reqConfig).then((data) => {
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




})

