<template>

  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="ul">
        <li v-for="(item,index) in goods" @click="menuClick(index,$event)" :class="index==menuCurrentIndex?'menu-item-selected':'menu-item'">
          <span class="text">
            {{item.categoryName}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" id="wrapper" ref="foodsWrapper">
      <ul class="ul">
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1>{{item.categoryName}}</h1>
          <ul class="ul">
            <li v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.foodImg"/>
              </div>
              <div class="content">
                <h2>{{food.foodName}}</h2>

                <div class="price">
                  <span class="newPrice"><span class="unit">￥</span>{{food.newPrice}}</span>
                  <span v-show="food.oldPrice != food.newPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="sell-info">
                  <span class="sellCount" v-show="food.vipPrice != food.newPrice">会员价：￥{{food.vipPrice}}</span>
                  <span class="rating" v-show="food.taste == 1">口味：不辣</span>
                  <span class="rating" v-show="food.taste == 2">口味：微辣</span>
                  <span class="rating" v-show="food.taste == 3">口味：中辣</span>
                  <span class="rating" v-show="food.taste == 4">口味：特辣</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"></CartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <ShopCart  :selectFoods="selectFoods" :wxAppId="wxAppId" :payType="payType"></ShopCart>
  </div>

</template>

<script>
import BScroll from 'better-scroll'
import ShopCart from '../cart/ShopCart'
import CartControl from '../cart/CartControl'
import * as API from "../../axios/api";
import * as URL from "../../axios/url";

export default {
  props: {
    seller: Object
  },
  components: {
    ShopCart,
    CartControl,
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      foodsScrollY: 0,
      selectedFood: '',
      userPhone: '',
      storeId: '',
      tableId: '',
      wxAppId: '',
      payType:"",
    }
  },
  created() {
    this.refresh();
  },

  computed: {
    menuCurrentIndex() {
      for (let i = 0, l = this.listHeight.length; i < l; i++) {
        let topHeight = this.listHeight[i]
        let bottomHeight = this.listHeight[i + 1]
        if (!bottomHeight || (this.foodsScrollY >= topHeight && this.foodsScrollY < bottomHeight)) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.foodCount) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    refresh(){
      this.userPhone = this.$route.params.userPhone;
      this.storeId = this.$route.params.storeId;
      this.tableId = this.$route.params.tableId;
      var param = Object.assign({}, {userPhone: this.userPhone ,storeId: this.storeId , tableId: this.tableId });

      //查询店铺商品
      API.POST(URL.QUERY_MENU_URL, param)
        .then(res => {
          if (res.result.retCode === 0) {
            this.goods = res.goods;
            this.wxAppId = res.wxAppId;
            this.payType = res.payType;
            this.$store.dispatch("userStore/list",res);
            this.$nextTick(() => {
              this.initScroll(); // 初始化scroll
              this.calculateHeight(); // 初始化列表高度列表
            })
          }else {
            alert('餐桌编号不存在')
          }
        })
        .catch(err => {
          alert('后台正在升级，请联系管理员！');
        });
    },
    initScroll() {
      this.menuWrapper = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      // 监控滚动事件
      this.foodsScroll.on('scroll', (pos) => {
        this.foodsScrollY = Math.abs(Math.round(pos.y))
      })
    },
    calculateHeight() {
      let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook')
      console.log(foodList)
      let height = 0
      this.listHeight.push(height)
      for (let i = 0, l = foodList.length; i < l; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    menuClick(index, event) {
      if (!event._constructed) {
        return
      }
      this.foodsScroll.scrollTo(0, -this.listHeight[index], 300)
    },

  },
}

</script>

<style lang="stylus" type="text/stylus">
@import '../../common/stylus/mixin.styl'
  .goods
    display flex
    position absolute
    top 2px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      margin-top: 2px;
      .ul
        list-style-type: none
        padding: 0
      .menu-item-selected
        background white
        font-weight 700
        margin-top -1px
      .menu-item,.menu-item-selected
        position relative
        display table
        height 54px
        line-height 14px
        width 56px
        padding 0 12px
        &:last-child:after
          content none
      .menu-item:after
          position: absolute
          content: ''
          left: 12px
          width: 56px
          bottom: 0
          border-bottom: 1px solid rgba(7,17,27,0.1)
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          font-weight 200
          white-space normal
          line-height 14px
          .iconMap
            vertical-align middle
    .foods-wrapper
      flex 1
      margin-top: 2px;
      .food-list
        h1
          height 26px
          line-height 26px
          padding-left 12px
          font-size 12px
          color rgb(147,153,159)
          background #f3f5f7
          border-left 2px solid #d9dde1
      .food-item
        position relative
        display flex
        margin: 0 18px;
        padding: 18px 0;
        border-bottom 1px solid rgba(7,17,27,0.1)
        .icon
          flex 0 0 57px
        &:last-child
          border-bottom none
        .content
          flex 1
          padding-left 10px
          h2
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            height 14px
            font-weight 700
            color rgb(7,17,27)
          .sell-info,.description
            font-size 10px
            color rgb(147,153,159)
            line-height 10px
            .sellCount
              margin-right 4px
          .description
            font-size 10px
            margin-bottom 8px
            line-height: 12px
          .price
            font-size 10px
            font-weight 700
            line-height 24px
            .newPrice
              font-size 14px
              color rgb(240,20,20)
              .unit
                font-size 10px
                font-weight normal
            .oldPrice
              text-decoration line-through
              color rgb(147,153,159)
              padding-left 4px
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom 12px
            z-index 20
.ul{
  list-style-type: none;
  padding: 0;
}

</style>
