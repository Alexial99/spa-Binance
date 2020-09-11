<template>
  <div id="app">
 <h1>Header</h1>
    <button><router-link to="/list">list</router-link></button>
    <button><router-link to="/">Depth</router-link></button>
    <hr/>
    <router-view/>
  </div>
</template>


<style >
#app {
  font-family: italic;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
  h1{
    font-family: italic;
    font-weight:bold;
    color: rgba(0, 0, 0, 0.7);
  }
  a{
    font-family: italic;
    text-decoration: none;
    font-size:20px;
    color:rgba(0, 0, 0, 0.7);

  }
</style>
