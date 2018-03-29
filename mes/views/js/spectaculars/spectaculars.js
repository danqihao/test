$(function () {
    //全局注册的组件
    let bus = new Vue();
    //创建事件中心
    //宣传看板

    //页面布局
    var wrapper = new Vue({
        el: '#wrapper',
        data() {
            return {
                indexShow: "kanban", //需要显示的内容
               // indexShow: "configuration",
                kanbanShow: '1',     //区别是宣传看板还是其他看板
                configurationShow: '2', //1是宣传看板，2是其它看板 宣传看板配置该显示的内容和其他看板不一致
                planId: '', //已选择的方案id
                loading: false,
                nowShow: '',//当前显示配置的看板
            }
        },
        methods: {
            // 接收导航条发来的数据，根据数据切换页面
            switcherHtml(data) {
                this.indexShow = data[0]
                this.kanbanShow = data[1]
                this.configurationShow = data[2]
                this.planId = data[3]
                this.nowShow = data[4]
            },
            loadingShow(data) {
                this.loading = data
            }
        },
        template: `
        <div id="wrapper" style="height:100%" v-loading="loading">
            <el-row style="height:100%">
                <!-- 左侧导航条 -->
				<el-col :span="2" style="height:100%">
                    <div id="nav" style="height:100%;">
                        <mes-nav @switcher="switcherHtml"></mes-nav>
                    </div>
                </el-col>
                <!-- 右侧内容 -->
                <el-col :span="21" style="height:100%">
                    <!-- 看板展示 -->
                    <mes-kanban :kanbanShow="kanbanShow" :planId="planId" v-if="indexShow === 'kanban'"></mes-kanban>
                    <!-- 配置展示 -->
                    <div style="height:100%;padding:15px 0" v-if="indexShow === 'configuration'">
                        <mes-configuration :configurationShow="configurationShow" :planId="planId" :nowShow="nowShow" @loadingShow="loadingShow"></mes-configuration>
                    </div>
                    <!--<div style="height:95%;padding:15px 0" v-if="indexShow === 'addkanban'">
                        <mes-addkanban :configurationShow="configurationShow" :planId="planId"></mes-addkanban>
                    </div>-->

				</el-col>
			</el-row>

        </div>
        `
    })



})
