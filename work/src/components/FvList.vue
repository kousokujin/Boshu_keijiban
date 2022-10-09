<template>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="検索" aria-label="検索" aria-describedby="SearchBtn" v-model="SearchWord" v-on:keydown.enter="RunSearch">
      <button class="btn btn-primary" type="button" id="SearchBtn" v-on:click="RunSearch"><i class="bi bi-search"></i></button>
    </div>
    <div class="card mb-3" v-for="item in RecList" v-bind:key="item.id">
      <div class="card-body">
        <h3 class="card-title">
          <router-link :to="{name:'Recruitment',params: {id:item.id}}">{{item.name}}</router-link>
        </h3>
        <div class="card-subtitle mb-2 text-muted">@{{item.owner}}</div>
        <p>{{ReadMore(item.discription)}}</p>
        <span>更新日: {{ConvertTime(item.updatedAt, 20)}}</span>
      </div>
    </div>
</template>

<script>
import utils from "./scripts/utils.js";
  export default {
    data(){
      return {
        RecList: [],
        SearchWord: "",
        LoadedPage: 0,
        EndPage: false
      }
    },
    emits: ['InfoMessage','ErrorMessage'],
    created(){
      //this.RunSearch();
      this.InitScroll();
      window.addEventListener("scroll", this.Scroll);
    },
    methods:{
      GetSearch(){
        return this.axios.get('/api/search',{
          params: {
            SearchWord: this.SearchWord,
            page: this.LoadedPage
          }
        }).catch((err)=>{
          utils.ErrorMessage(err);
        });
      },
      async RunSearch(){
        this.LoadedPage = 0;
        this.EndPage = false;
        this.RecList = [];
        await this.$nextTick();
        await this.InitScroll();
      },
      async nextload(){
        if(this.EndPage == true){
          return;
        }
        let res = await this.GetSearch().catch((err)=>{
          utils.ErrorMessage(err);
        });
        if(res.data.length != 0){
          res.data.forEach((value)=>{
            this.RecList.push(value);
          });
          this.LoadedPage++;
        }
        else{
          this.EndPage = true;
        }
      },
      async Scroll(){
        const document_h = document.documentElement.scrollHeight;
        const scroll_h = window.scrollY + document.documentElement.clientHeight;
        if(document_h - 50 < scroll_h){
          await this.nextload();
        }
      },
      async InitScroll(){
        while(this.EndPage == false && document.documentElement.clientHeight >= document.documentElement.scrollHeight){
          await this.nextload();
        }
      }
    },
    computed: {
      ConvertTime(){
        return utils.ConvertTime
      },
      ReadMore(){
        return utils.ReadMore
      }
    }
  }
</script>