<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link class="navbar-brand" to="/">UENO</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <router-link class="nav-link" aria-current="page" to="/edit/new">新規作成</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" aria-current="page" to="/">一覧</router-link>
                </li>
              </ul>
            </div>
        </div>
    </nav>
  </header>
  <main class="container-fluid">
    <div class="container mt-3" v-if="alert.message.length > 0 || alert.error.length > 0">
      <div v-if="alert.message.length > 0" class="alert alert-success">
        {{alert.message}}
      </div>
      <div v-if="alert.error.length > 0" class="alert alert-danger">
        {{alert.error}}
      </div>
    </div>
    <div class="container mt-3">
      <router-view @InfoMessage="ChangeMessage" @ErrorMessage="ChangeErrorMessage"/>
    </div>
  </main>
</template>

<script>
  export default {
    name: 'App',
    data(){
      return {
        alert : {
          message: "",
          error: "",
        }
      }
    },
    methods:{
      ChangeMessage(message){
        this.alert.message = message;
      },
      ChangeErrorMessage(message){
        this.alert.error = message;
      }
    },
    watch: {
      '$route' : function(to,from){
        if(to.path !== from.path){
          this.alert.message = ""
          this.alert.error = ""
        }
      }
    }
  }
</script>
