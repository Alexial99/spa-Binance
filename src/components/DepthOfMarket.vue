<template>
  <div >
    <div  id="element_1">
    <div class="hoverElement" id="aHoverElement" v-on:mouseover='counter=true' v-on:mouseout="counter=false"  v-bind:class="{tableScroll: counter}">

    <table >
      <!--<div style="display: block">-->
      <thead>
        <th >Amount</th>
        <th>Price</th>
        <th v-if="getSizeWindow__table()">Total</th>

      </thead>
      <tbody v-for="elements in arrayBid" >
        <tr v-for="element in elements">
          <td v-for="elemental in element" >
            <a>{{elemental}}</a>
          </td>
          <td v-if="getSizeWindow__table()"  ><a>{{Number(element[0])+Number(element[1])}}</a></td>
        </tr>
      </tbody> <!--//</div>-->
    </table>



      <table > <!--//<div style="display: block">-->
        <thead>
        <th >Amount</th>
        <th>Price</th>
        <th v-if="getSizeWindow__table()">Total</th>

        </thead>
        <tbody v-for="elements in arrayAsk">
        <tr v-for="element in elements">
          <td v-for="elemental in element" >
            <a>{{elemental}}</a>
          </td>
          <td v-if="getSizeWindow__table()"  ><a>{{Number(element[0])+Number(element[1])}}</a></td>
        </tr>
        </tbody><!--//</div>-->
      </table>

      </div>
  </div>

</div>
</template>

<script>


  import { bus } from '@/core/eventBus'
  import saveState from 'vue-save-state'
  import Binance from '@/core/binance'

  export default {

    mixins: [saveState],
        name: "DepthOfMarket",
      data(){
          return{
            /*arrayOne:[[1,1],[1,1],[1,1],[1,1]],
            arrayTwo:[[2,2],[2,2],[2,2],[2,2]],*/
            arrayBid:[],
            arrayAsk:[],
            index:0,
            counter:false,
            title:'table',
        }
      },
    components:{
      Binance,
    },
    created() {
      bus.$on('choice', data =>{

        let binance = new Binance(data ,5);
        let askBid = binance.getDepth();

        /*this.arrayBid =askBid.bids;
        this.arrayAsk=askBid.asks;*/
      })
      bus.$on('depthUpdated',data=>{
       // alert(data[0]);
        this.arrayBid= data[0];
        this.arrayAsk = data[1];

      })
      window.addEventListener('resize', this.onResize)
    },


    beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
    },

      methods:{
        onResize() {
          let elem = document.getElementById('aHoverElement');

          if (window.innerWidth < 678) {

            elem.classList.add("big");
            if (window.innerWidth < 380) {
              elem.classList.add("small");
            }else{elem.classList.remove('small');}
          }
           else{
            elem.classList.remove('big');

          }
        },



        getSizeWindow__table:function(){
            if(window.innerWidth>=1200)
            {return true;}
            return false;
                      },


        getSaveStateConfig() {
          return {
            'cacheKey': 'nameOfYourComponent',
          };
        },

      },

    }
</script>

<style scoped>

  .hoverElement{
    background: rgba(226, 226, 226, 0.9);
    align-items: center;
    width:50%;
    height: 500px;
    overflow: hidden;
    font-size: 14px;
  }

  #element_1{
    display: flex;
    flex-direction:row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    overflow: hidden;

  }
  
  .tableScroll{
    overflow:scroll;
}

.hoverElement>table{
  flex-basis: 50%;
  display: inline-table;
}

  table{
    color:rgba(0, 0, 0, 0.7);
  }


.big {
  width:100%;
}
  .small{
    font-size: 8px;
  }
</style>
