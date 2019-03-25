<template>
  <div class="pay">
    <div id="selected-wrapper" ref="foodsWrapper" class="selected-food">
      <ul>
        <li class="food" v-for="food in selectFoods">
          <img width="45" height="45" :src="food.foodImg"/>
          <span class="food-name">{{food.foodName}}</span>
          <span class="food-count">×{{food.foodCount}}</span>
          <span class="food-price" v-if="vipNum == ''">￥{{food.newPrice * food.foodCount}}</span>
          <span class="food-price" v-else>￥{{food.vipPrice * food.foodCount}}</span>
        </li>
      </ul>
    </div>
    <div class="pay-type">
      <div class="desc">请选择支付方式</div>
      <van-radio-group v-model="radio" class="select-pay">
        <van-cell-group>
          <van-cell title="前台收银" clickable @click="radio = '1'" :disabled="foregroundDisabled">
            <img class="wxpay-img" slot="icon" slot-scope="props" src="../../assets/icon/foreground.png" >
            <van-radio :disabled="foregroundDisabled" name="1"></van-radio>
          </van-cell>
          <van-cell title="微信支付" clickable @click="radio = '2'">
            <img class="wxpay-img" slot="icon" slot-scope="props" src="../../assets/icon/wxpay.png" >
            <van-radio :disabled="wxpayDisabled" name="2"></van-radio>
          </van-cell>
          <van-cell title="支付宝支付" clickable @click="radio = '3'">
            <img class="alipay-img" slot="icon" slot-scope="props" src="../../assets/icon/alipay.png" >
            <van-radio :disabled="alipayDisabled" name="3" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="pay-price">
        <span class="discount" v-if="vipNum != ''">优惠￥{{discount}}</span>
        <span  class="total">合计￥</span>
        <span class="total-price" v-if="vipNum != ''">{{totalVipPrice}}</span>
        <span class="total-price" v-else>{{totalPrice}}</span>
        <van-button class="commit" type="info" :disabled="commitDisabled" @click="commit">提交订单</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import * as API from "../../axios/api";
  import * as URL from "../../axios/url";
  import { mapState } from "vuex";
  export default {
    name: 'Pay',
    data() {
      return {
        selectFoods: [],
        wxAppId: '',
        vipNum: '',
        listHeight: [],
        foodsScrollY: 0,
        radio: '1',
        foregroundDisabled: false,
        wxpayDisabled: true,
        alipayDisabled: true,
        onlinePay: false,
        commitDisabled: false,
        userPhone: '',
        storeId: '',
        tableId: '',
        totalAmount:"",
        wxParameter:{
          "appId":"",
          "timeStamp":"",
          "nonceStr":"",
          "package":"",
          "paySign":""
        }
      }
    },
    components: {
    },
    created() {
      this.refresh()
    },
    watch: {
      //vant的cell和radio配合在一起，禁用框任然能选择，通过代码使之不能选择
      radio(val) {
        if (this.foregroundDisabled == false ){
          this.radio = '1';
        }else{
          if (this.radio == '1'){
            this.radio = '2'
          }
        }
      }
    },
    computed: {
      ...mapState("userStore", {
        storeName: state => state.storeName,
      }),
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          if (food.foodCount) {
            total += food.newPrice * food.foodCount
          }
        })
        return total
      },
      totalVipPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          if (food.foodCount) {
            total += food.vipPrice * food.foodCount
          }
        })
        return total
      },
      discount(){
        let total = 0;
        return (this.totalPrice - this.totalVipPrice)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initScroll();
      })
    },
    methods: {
      refresh() {
        this.selectFoods = this.$route.query.selectFoods;
        this.wxAppId = this.$route.query.wxAppId;
        this.vipNum = this.$route.query.vipNum;
        this.onlinePay = this.$route.query.onlinePay;
        this.userPhone = this.$route.query.userPhone;
        this.storeId = this.$route.query.storeId;
        this.tableId = this.$route.query.tableId;
        this.totalAmount = this.$route.query.totalAmount;

        if (this.onlinePay == true){
          this.foregroundDisabled = true;
          this.wxpayDisabled = false;
          this.alipayDisabled = false;
          this.radio = '2';
        }else{
          this.foregroundDisabled = false;
          this.wxpayDisabled = true;
          this.alipayDisabled = true;
          this.radio = '1';
        }
      },
      initScroll() {
        console.log(this.$refs.foodsWrapper)
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
        });
      },
      commit(){
        this.commitDisabled = true;
        var param = Object.assign({}, {userPhone: this.userPhone ,storeId: this.storeId , tableId: this.tableId,
          storeName: this.storeName,source: 1,orderInfos: this.selectFoods,personNum: 4,
          orderStatus: 2,totalAmount: this.totalAmount});
        if (this.vipNum != ''){
          param.vipNum = this.vipNum;
        }
        //前台收银
        if (this.onlinePay == false & this.radio == '1'){
          param.payType = 1;
          param.orderTemp = 2;
          this.commited(param);
        }else if(this.onlinePay == true & this.radio == '2'){
          //微信支付
          param.payType = 4;
          param.orderTemp = 1;
          this.wxPayCommited(param);
        }else {
          //支付宝支付

        }
      },
      commited(param){
        //提交订单
        API.POST(URL.ORDER_ADD_URL, param)
          .then(res => {
            if (res.result.retCode === 0) {
              alert('客官订单已提交成功，大厨正在备餐');
            }else {
              alert('抱歉，订单提交失败,请联系服务员');
            }
          })
          .catch(err => {
            alert('后台正在升级，请联系管理员！');
            this.commitDisabled = false;
          });
      },
      wxPayCommited(param){
        //提交订单
        API.POST(URL.ORDER_ADD_URL, param)
          .then(res => {
            if (res.result.retCode === 0) {
              if (res.wxPayParameter == null){
                alert('抱歉，订单提交失败,微信支付参数有误');
              }else {
                if (typeof WeixinJSBridge == "undefined"){
                  if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                  }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                  }
                }else{
                  this.appId = res.wxPayParameter.appId;
                  this.timeStamp = res.wxPayParameter.timeStamp;
                  this.nonceStr = res.wxPayParameter.nonceStr;
                  this.package = res.wxPayParameter.prepayId;
                  this.paySign = res.wxPayParameter.paySign;
                  this.onBridgeReady();
                }
              }

            }else {
              alert('抱歉，订单提交失败,请联系服务员');
            }
          })
          .catch(err => {
            alert('后台正在升级，请联系管理员！');
            this.commitDisabled = false;
          });
      },
      onBridgeReady(){
        WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId":this.appId,     //公众号名称，由商户传入
          "timeStamp":this.timeStamp,         //时间戳，自1970年以来的秒数
          "nonceStr":this.nonceStr, //随机串
          "package":this.package,
          "signType":"MD5",         //微信签名方式：
          "paySign":this.paySign //微信签名
        },
        function(res){
          if(res.err_msg == "get_brand_wcpay_request:ok" ){
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            alert('客官订单已提交成功，大厨正在备餐');
          }
        });
       }
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  .pay
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 1px;
    bottom: 0px;
    width: 100%;
    overflow: hidden;
    .selected-food
      position: relative;
      flex: 1;
      width: 100%;
      overflow: hidden;
      .food
        position relative
        margin: 0 18px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,0,0,0.1)
        .food-name
          position: absolute;
          top: 10px;
          left: 70px;
        .food-count
          position: absolute;
          top: 35px;
          left: 70px;
        .food-price
          position: absolute;
          top: 35px;
          right: 30px;
    .pay-type
      flex: 0 0 220px;
      position relative
      width 100%
      border-top: 1px solid rgba(0,0,255,0.1)
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background-color white
      .desc
        position absolute;
        width 100%
        text-align center
        top: 10px;
        font-size 14px
      .select-pay
        position absolute
        top 40px;
        width 98%
        left 1%
        .wxpay-img
          position relative
          left -5px
          width 20px
          height 20px
        .alipay-img
          position relative
          left -8px
          width 25px
          height 25px
      .pay-price
        position absolute
        bottom: 10px
        left 10px
        width 100%
        .discount
          font-size 15px
        .total
          position relative
          left 10px
          font-size 15px
        .total-price
          position relative
          left 5px
          font-size 20px
          color green
        .commit
          position absolute
          top: -13px
          right 20px
          width 100px
</style>
