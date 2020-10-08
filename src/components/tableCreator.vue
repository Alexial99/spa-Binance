<template>
  <table>
    <!--<div style="display: block">-->
    <thead>
    <th>Amount</th>
    <th>Price</th>
    <th v-if="getSizeWindow__table()">Total</th>

    </thead>
    <tbody v-for="elements in thisArray">
    <tr v-for="element in elements">
      <td>
        <a>{{element[1]}}</a>
      </td>
      <td><a>{{element[0]}}</a></td>
      <td v-if="getSizeWindow__table()"><a>{{(Number(element[0])*Number(element[1])).toFixed(8)}}</a></td>
    </tr>
    </tbody> <!--//</div>-->
  </table>
</template>

<script>
  import Depth from './DepthOfMarket'
  import {bus} from '@/core/eventBus'
  import Binance from '@/core/binance'

    export default {
        name: "tableCreator",
        props:['numberArray'],
        data:function(){
          return{
            thisArray: [],

          }
        },
      created() {

        bus.$on('depthUpdated', data => {
          let n = Number(this.numberArray);
          this.thisArray = data[n];
        })
      },

      methods:{
          getSizeWindow__table: function () {
            if (window.innerWidth >= 1200) {
              return true;
            }
            return false;
          },

        },
      components:{
        Depth
      },
    }
</script>

<style scoped>

</style>
