<template>

  <div class="app">
    <div class="content">
      <div class="head">
        <Head></Head>
      </div>
      <div class="store">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>

</template>

<script>
  import Head from './views/head/Head';
  export default {
    name: 'App',
    components: {
      Head
    },
    created() {

    },
  }
</script>

<style scoped>
  .app{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
  }
  .content{
    height: 100%;
    width: 100%;
    margin: 0px 0px 0px 0px;
    display: flex;
    flex-direction: column;
  }
  .head{
    flex: 0 0 120px;
    width: 100%;
  }
  .store{
    position: relative;
    flex: 0 10 1000px;
    height: 100%;
    background-color: white;
  }
</style>
