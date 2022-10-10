<template>
  <h1 v-if="id=='new'" class="col-auto me-auto display-2">新規作成</h1>
  <h1 v-else class="col-auto me-auto display-2">編集:{{name}}</h1>
  <div class="mb-3">
    <label for="TitleInput" class="form-label">名前</label>
    <input type="text" class="form-control" id="TtileInput" v-model="name">
  </div>
  <div class="mb-3 invalid-feedback d-block" v-for="(error, index) of v$.name.$errors" :key="index">
      <span>Error:{{ error.$message }}</span>
  </div>
  <div class="mb-3">
    <label for="OwnerName" class="form-label">主催者</label>
    <input type="text" class="form-control" id="OwnerName" v-model="owner">
  </div>
  <div class="mb-3">
    <label for="MemberCount" class="form-label">定員</label>
    <input type="text" class="form-control" id="MemberCount" v-model="member_count">
  </div>
  <div class="mb-3">
    <label for="Discription" class="form-label">説明</label>
    <textarea class="form-control" id="Discription" rows="4" v-model="discription"></textarea>
  </div>
  <div class="mb-3 form-check">
    <input class="form-check-input" type="checkbox" id="join_check" v-model="owner_join" :disabled="isModify">
    <label class="form-check-label" for="join_check" >自分も参加する</label>
  </div>
  <div class="d-grid gap-2 d-md-flex">
    <button type="button" class="btn btn-primary" v-on:click="ValidateTest">test</button>
    <button v-if="id=='new'" type="button" class="btn btn-primary" v-on:click="DataSubmit">作成</button>
    <button v-else type="button" class="btn btn-primary" v-on:click="DataSubmit">変更</button>
    <router-link v-if="id!='new'" :to="{name:'Recruitment',params: {id:id}}" type="button" class="btn btn-secondary">キャンセル</router-link>
  </div>
</template>
<script>
import utils from "./scripts/utils.js"
import { useVuelidate } from '@vuelidate/core'
import { required, numeric} from '@vuelidate/validators'
  export default {
    data(){
      return {
        id: "new",
        name: "",
        owner: "",
        member_count: "",
        discription: "",
        owner_join: true,
        csrf_token: "",
      }
    },
    emits: ['InfoMessage','ErrorMessage'],
    methods:{
      DataSubmit(){
        this.axios.post("/api/apply/"+this.id,{
          name: this.name,
          owner: this.owner,
          member_count: this.member_count,
          discription: this.discription,
          owner_join: this.owner_join,
          _csrf: this.csrf_token
        }).then((res) => {
          if(res.data.status == "ok"){
            this.$router.push("/Recruitment/"+res.data.id);
          }
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        });
      },
      ValidateTest(){
        console.log(this.v$);
        console.log(this.v$.name.$errors);
        console.log(this.v$.member_count.$errors);
        console.log(this.v$.$invalid);
      }
    },
    created(){
      if(this.$route.params.id == "new"){
        this.axios.get('/api/token').then((res)=>{
          this.csrf_token = res.data._csrf;
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        });
      }
      else{
        const id = this.$route.params.id
        this.axios.get('/api/recruitment_editdata/'+id).then((res)=>{
          this.id = res.data.id;
          this.name = res.data.name;
          this.owner = res.data.owner;
          this.member_count = res.data.member_max;
          this.discription = res.data.discription;
          this.owner_join = false;
          this.csrf_token = res.data._csrf;
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        })
      }
    },
    setup () {
      return { v$: useVuelidate() }
    },
    validations(){
      return {
        name: {required},
        owner: {required},
        member_count: {numeric}
      }
    },
    computed: {
      isModify(){
        return this.id != "new";
      }
    },
    watch: {
      $route(to, from) {
        if(to.path !== from.path){
          location.reload();
        }
      }
    }
  }
</script>