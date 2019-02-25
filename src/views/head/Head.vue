<template>
    <div class="head-wrapper">
      <div class="store-img">
        <img src="../../assets/icon/test.jpg" style="width: 80px;height: 80px">
      </div>
      <div class="description">
        <img src="../../assets/icon/brand.png" style="width: 23px;height: 23px">
        <span class="store-name">中国第一香</span>
        <span class="welcome">欢迎您的光临</span>
        <span class="pay-type">在线支付/微信、支付宝</span>
      </div>
    </div>
</template>

<script>

export default {
  name: 'Head',
  components: {
  },
  data() {
    return {

    };
  },
  computed: {

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
    background: url("../../assets/icon/head_backgroud.jpg");
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
