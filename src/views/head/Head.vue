<template>
    <div class="head-wrapper">
      <div class="store-img">
        <img src="../../assets/icon/test.jpg" style="width: 80px;height: 80px">
      </div>
      <div class="description">
        <img src="../../assets/icon/brand.png" style="width: 20px;height: 20px">
        <span class="store-name">{{storeName}}</span>
        <span class="welcome">欢迎您的光临</span>
        <span class="pay-type">在线支付/微信、支付宝</span>
      </div>
    </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: 'Head',
    components: {
    },
  data() {
    return {

    };
  },
  computed: {
    ...mapState("userStore", {
      storeName: state => state.storeName,
    })
  },
  created() {

  },
}
</script>

<style scoped>
  .head-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #727483;
  }
  .store-img{
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .description{
    position: absolute;
    top: 20px;
    left: 120px;
    color: white;
  }
  .store-name{
    position: absolute;
    width: 180px;
    top: 0px;
    left: 40px;
  }
  .welcome{
    position: absolute;
    width: 180px;
    top: 30px;
    left: 0px;
    font-size: 15px;
  }
  .pay-type{
    position: absolute;
    width: 180px;
    top: 55px;
    left: 0px;
    font-size: 15px;
  }

</style>
