<template>
    <h1 class="col-auto me-auto display-2">新規作成</h1>
    <div class="mb-3">
      <label for="TitleInput" class="form-label">名前</label>
      <input type="text" class="form-control" id="TtileInput" v-model="Title">
    </div>
    <div class="mb-3">
      <label for="OwnerName" class="form-label">主催者</label>
      <input type="text" class="form-control" id="OwnerName" v-model="Owner">
    </div>
    <div class="mb-3">
      <label for="MemberCount" class="form-label">定員</label>
      <input type="text" class="form-control" id="MemberCount" v-model="MemberCount">
    </div>
    <div class="mb-3">
      <label for="Discription" class="form-label">説明</label>
      <textarea class="form-control" id="Discription" rows="4" v-model="Discription"></textarea>
    </div>
    <div class="mb-3 form-check">
      <input class="form-check-input" type="checkbox" id="join_check" v-model="owner_join">
      <label class="form-check-label" for="join_check">自分も参加する</label>
    </div>
    <button type="button" class="btn btn-primary" v-on:click="DataSubmit">作成</button>
</template>
<script>
  import utils from "./scripts/utils.js"
  export default {
    data(){
      return {
        Title: "",
        Owner: "",
        MemberCount: "",
        Discription: "",
        owner_join: true,
        csrf_token: "",
      }
    },
    emits: ['InfoMessage','ErrorMessage'],
    methods:{
      DataSubmit: function(){
        this.axios.post("/api/apply/new",{
          Title: this.Title,
          Owner: this.Owner,
          MemberCount: this.MemberCount,
          Discription: this.Discription,
          owner_join: this.owner_join,
          _csrf: this.csrf_token
        }).then((res) => {
          if(res.data.status == "ok"){
            this.$router.push("/Recruitment/"+res.data.id);
          }
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        });
      }
    },
    created(){
      //this.$emit('InfoMessage','test');
      this.axios.get('/api/token').then((res)=>{
        this.csrf_token = res.data._csrf;
      }).catch((err)=>{
        utils.ErrorMessage(err,this);
      });
    }
  }
</script>