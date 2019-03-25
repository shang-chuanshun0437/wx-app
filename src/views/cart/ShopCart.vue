<template lang="html">
  <div class="">
  <div class="shopCart">
    <div class="content">
      <div class="content-left" @click="listToggle">
        <div class="logo-wrapper">
          <div class="badge" v-show="totalCount">
            {{totalCount}}
          </div>
          <div class="logo" :class="{'active':totalPrice}">
            <img class="img" src="../../assets/icon/shopNon.png" v-show="totalPrice <= 0"></img>
            <img class="img" src="../../assets/icon/shopAny.png" v-show="totalPrice > 0"></img>
          </div>
        </div>
      </div>
      <div class="content-vip-right" :class="{'vip-enough':totalVipPrice > 0}" @click="vipPayBill">
        <div style="position: relative;top: -10px;">￥{{totalVipPrice}}</div>
        <div style="position: relative;top: -40px;">会员结算</div>
      </div>
      <div class="content-right" :class="{'enough':totalPrice > 0}" @click="payBill">
        <div style="position: relative;top: -10px;">￥{{totalPrice}}</div>
        <div style="position: relative;top: -40px;">非会员结算</div>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop" v-on:before-enter="beforeEnter"
        v-on:enter="enter" v-on:after-enter="afterEnter"
        v-for="(ball,index) in balls" :key="index">
        <div class="ball" v-show="ball.show" >
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="transHeight">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="setEmpty()">清空</span>
        </div>
        <div class="list-content" ref="foodlist">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.foodName}}</span>
              <div class="price">
                <span>￥{{food.newPrice * food.foodCount}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <CartControl :food="food"></CartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade-backdrop">
    <div class="backdrop" v-show="showBackdrop" @click="hideBackdrop"></div>
  </transition>
    <van-dialog v-model="viPayBillShow" show-cancel-button :before-close="beforeClose" >
      <van-field v-model="vipNum" label="会员编号" placeholder="请输入会员编号" />
    </van-dialog>
  </div>
</template>

<script>
import CartControl from './CartControl'
import BScroll from 'better-scroll'
import * as API from "../../axios/api";
import * as URL from "../../axios/url";

export default {
  props: {
    selectFoods: {
      type: Array,
      default: []
    },
    wxAppId: {
      type: String,
      default: ''
    },
    payType: {
      type: String,
      default: ''
    },
  },
  components: {
    CartControl
  },
  data() {
    return {
      balls: [{ show: false }, { show: false }, { show: false },
        { show: false }, { show: false }],
      dropBalls: [],
      listShow: false,
      viPayBillShow: false,
      vipNum: '',
    }
  },
  created() {
    this.$root.eventHub.$on('cart.add', this.drop)
  },
  computed: {

    showBackdrop() {
      if (this.listShow && this.totalPrice) {
        return true
      }
      this.listShow = false
      return false
    },
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
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.foodCount
      })
      return count
    },
  },
  methods: {
    drop(el) {
      for (let i = 0, l = this.balls.length; i < l; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    setEmpty() {
      this.selectFoods.forEach((food) => {
        food.foodCount = 0
      })
    },
    hideBackdrop() {
      this.listShow = false
    },
    initScroll() {
      this.foodlistScroll = new BScroll(this.$refs.foodlist, {
        click: true
      });
    },
    listToggle() {
      if (!this.selectFoods.length) {
        return
      }
      this.listShow = !this.listShow
      if (this.listShow) {
        this.$nextTick(() => {
          if (!this.foodlistScroll) {
            this.initScroll()
          } else {
            this.foodlistScroll.refresh()
          }
        })
      }
    },
    beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.querySelector('.inner-hook')
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter(el) {
      el.offsetHeight // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.querySelector('.inner-hook')
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    payBill(){
      var userPhone = this.$route.params.userPhone;
      var storeId = this.$route.params.storeId;
      var tableId = this.$route.params.tableId;
      var onlinePay = false;
      if (this.payType == 2){
        onlinePay = true;
      };
      this.$router.push({path:"/wx/order/pay",query:{selectFoods: this.selectFoods,wxAppId: this.wxAppId,
          vipNum: '',onlinePay: onlinePay,userPhone: userPhone,storeId: storeId,
          tableId: tableId,totalAmount: this.totalPrice}});
    },
    vipPayBill(){
      this.viPayBillShow = true;
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        //查询会员编号是否存在
        var userPhone = this.$route.params.userPhone;
        var param = Object.assign({}, {userPhone: userPhone ,vipId: this.vipNum });

        //查询会员
        API.POST(URL.QUERY_VIP_URL, param)
          .then(res => {
            if (res.result.retCode === 0) {
              //打开支付界面
              this.$router.push({path:"/wx/order/pay",query:{selectFoods: this.selectFoods,wxAppId: this.wxAppId,
                  vipNum: this.vipNum}});

            }else if(res.result.retCode === 1024){
              alert('会员账号输入错误，请重新输入')
            }
          })
          .catch(err => {
            alert('后台正在升级，请联系管理员！');
          });
        done();
      } else {
        done();
      }
    }
  },

}

</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/icon.styl'
.shopCart
  position fixed
  left 0
  bottom 0
  width 100%
  height 48px
  z-index 50
  .content
    display flex
    background #141d27
    .content-left
      flex 1
      height 48px
      .logo-wrapper
        display inline-block
        vertical-align top
        position: relative
        height: 56px
        line-height: 56px
        border-radius: 50%
        width: 56px
        top: -10px
        background: #141d27
        margin:0 12px
        padding 6px
        box-sizing border-box
        text-align: center
        .badge
          position absolute
          top: 0;
          right 0
          background: rgb(240,20,20);
          color: white;
          width 24px
          height 16px
          line-height: 16px;
          font-size: 9px;
          box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.4);
          font-weight: 700;
          border-radius: 16px;
          text-align center
        .logo
          width 100%
          height 100%
          background: #2b343c
          border-radius: 50%
          font-size: 24px
          color: #80858a
          line-height: 44px
          font-weight: 700
          &.active
            background: rgb(0,160,220);
            color: white;
          .img
            height: 25px
            width: 25px
      .price
        display inline-block
        vertical-align top
        font-size 12px
        margin-top 12px
        padding-right 12px
        box-sizing border-box
        color rgba(255,255,255,0.4)
        font-weight 700
        line-height 24px
        border-right 1px solid rgba(255,255,255,0.1)
        &.active
          color white
    .content-vip-right
      flex 0 0 105px
      font-size 12px
      font-weight 700
      background #2b343c
      color rgba(255,255,255,0.4)
      line-height 48px
      text-align center
      &.vip-enough
        background #1296db
        color white
    .content-right
      flex 0 0 105px
      font-size 12px
      font-weight 700
      background #2b343c
      color rgba(255,255,255,0.4)
      line-height 48px
      text-align center
      &.enough
        background #00b43c
        color white
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      &.drop-enter,&.drop-enter-active
        transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
  .shopcart-list
    position absolute
    top 0
    left 0
    width 100%
    background white
    transform translate3d(0,-100%,0)
    z-index -1
    &.transHeight-enter-active,&.transHeight-leave-active
      transition all 0.5s
    &.transHeight-enter,&.transHeight-leave-active
      transform translate3d(0,0,0)
    .list-header
      height 40px
      line-height 40px
      background #f3f5f7
      border-bottom 1px solid rgba(7,17,27,0.1)
      .title
        display inline-block
        font-size 14px
        font-weight 200
        color rgb(7,17,27)
        padding-left 18px
      .empty
        position absolute
        right 8px
        font-size 12px
        color rgb(0,160,220)
        padding 0 10px
    .list-content
      max-height 217px
      overflow hidden
      .food
        position relative
        display flex
        height 48px
        margin 0 18px
        border-bottom 1px solid rgba(7,17,27,0.1)
        .name
          flex 1
          font-size 14px
          color rgb(7,17,27)
          line-height 48px
          font-weight 700
        .price
          font-size 14px
          font-weight 700
          color rgb(240,20,20)
          padding 0 12px 0 18px
          line-height 48px
        .cartcontrol-wrapper
          font-size 14px
          margin-top 6px
.backdrop
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background rgba(7,17,27,0.6)
  backdrop-filter blur(10px)
  z-index 40
  &.fade-backdrop-enter-active,&.fade-backdrop-leave-active
    transition opacity 0.5s
  &.fade-backdrop-enter,&.fade-backdrop-leave-active
    opacity 0

</style>
