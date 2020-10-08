<template>
  <div>
    <br>
    <h2>list of pairs</h2>
    <div class="dropdown">
      <button v-on:click="dropDown()" class="dropbtn">Dropdown</button>
      <div id="myDropdown" class="dropdown-content">
        <div v-for="symbol in symbols">
          <div v-on:click="choicePair(symbol)">{{symbol}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {bus} from '@/core/eventBus'
  import saveState from 'vue-save-state';
  import Binance from '@/core/binance'

  export default {

    mixins: [saveState],
    name: 'App',
    data() {
      return {
        title: 'oooooop',
        symbols: [],
      }
    },
    components: {
      Binance, saveState
    },

    created() {
      this.symbols = Binance.getAvailableSymbols();
    },

    methods: {

      dropDown: function () {
        document.getElementById("myDropdown").classList.toggle("show");
      },
      choicePair: function (pair) {
        bus.$emit('choice', pair);
      },
      getSaveStateConfig() {
        return {
          'cacheKey': 'nameOfYourComponent',
        };
      },
    }

  }

  window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
</script>

<style scoped>
  .dropbtn {
    background-color: rgba(130, 130, 130, 0.8);
    border-radius: 5px;
    color: white;
    padding: 18px;
    font-size: 18px;
    border: none;
    cursor: pointer;
    font-family: italic;
    font-weight: normal;
  }

  .dropbtn:hover, .dropbtn:focus {
    background-color: rgba(66, 66, 66, 0.8);
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content a:hover {
    background-color: #ddd
  }

  .show {
    display: block;
  }

  h2 {
    font-family: italic;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
  }

  #myDropdown > div {
    padding: 4px;
  }

  #myDropdown > div:hover, #myDropdown > div:focus {
    background-color: rgba(80, 80, 80, 0.8);
    color: white;
  }
</style>
