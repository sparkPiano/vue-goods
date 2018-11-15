<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button size="large" long type="text">
                	<transition name="mes-current-type-btn">
                		<Icon type="checkmark"></Icon>
                	</transition>
                	<span class="mes-type-btn-text">订单消息</span>
                	<Badge class="message-count-badge-outer" class-name="message-count-badge" :count="count"></Badge>
                </Button>
            </div>
            <div>
                
            </div>
        </div>
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="columns" :data="currentMesList" :no-data-text="noDataText"></Table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'message_index',
    data () {
        return {
        	show:false,
            showMesTitleList: true,
            count: 0,
            noDataText: '暂无消息',
            currentMesList: [],
            columns: [
                {
                    key: 'order_id',
                    title: '订单编号',
                },
                {
                    key: 'refund_apply_time',
                    title: '申请时间',
                    width:170
                },
                {
                    key: 'user_id',
                    title: '用户ID',
                },
                {
                    key: 'rp_name',
                    title: '收件人',
                },
                {
                    key: 'rp_mobile',
                    title: '联系电话',
                },
                {
                    key: 'rp_addr',
                    title: '收货地址',
                },
                {
                    title: '操作',
                    width: 80,
                    render: (h, params) => {
                        return h('Button', {
					        props: {
					            type: 'warning',
					            size:'small'
					        },
					        on: {
					            'click': () => {
					                this.refund(params.row);
					            }
					        }
					    },'退款');
                    }
                }
            ],
            form:{
            	
            }
        };
    },
    methods: {
        initMsg () {
	        this.currentMesList = this.$store.state.app.orderMesList;
	        this.count = this.$store.state.app.messageCount;
        },
        refund(row){
        	console.log(row);
        }
    },
    activated () {
    	if(this.$store.state.app.messageCount>0){
    		this.initMsg();
    	}
    },
    mounted () {
        
    }
};
</script>

