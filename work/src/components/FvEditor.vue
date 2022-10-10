<template>
  <h1 v-if="id=='new'" class="col-auto me-auto display-2">新規作成</h1>
  <h1 v-else class="col-auto me-auto display-2">編集:{{name}}</h1>
  <div class="mb-3">
    <label for="TitleInput" class="form-label">名前</label>
    <input type="text" :class="['form-control', v$.name.$dirty && v$.name.$invalid ? 'is-invalid' : '']" id="TtileInput" v-model="name" @input="v$.name.$touch()">
    <span v-if="v$.name.$dirty && v$.name.$invalid" class="invalid-feedback d-block">{{ValidateMessage(v$.name)}}</span>
  </div>
  <div class="mb-3">
    <label for="OwnerName" class="form-label">主催者</label>
    <input type="text" :class="['form-control', v$.owner.$dirty && v$.owner.$invalid ? 'is-invalid' : '']" id="OwnerName" v-model="owner" @input="v$.owner.$touch()">
    <span v-if="v$.owner.$dirty && v$.owner.$invalid" class="invalid-feedback d-block">{{ValidateMessage(v$.owner)}}</span>
  </div>
  <div class="mb-3">
    <label for="MemberCount" class="form-label">定員</label>
    <input type="text" :class="['form-control', v$.member_count.$dirty &&v$.member_count.$invalid ? 'is-invalid' : '']" id="MemberCount" v-model="member_count" @input="v$.member_count.$touch()">
    <span v-if="v$.member_count.$dirty && v$.member_count.$invalid" class="invalid-feedback d-block">{{ValidateMessage(v$.member_count)}}</span>
  </div>
  <div class="mb-3">
    <label for="Discription" class="form-label">説明</label>
    <textarea class="form-control" id="Discription" rows="6" v-model="discription"></textarea>
  </div>
  <div class="mb-3 form-check">
    <input class="form-check-input" type="checkbox" id="join_check" v-model="owner_join" :disabled="isModify">
    <label class="form-check-label" for="join_check" >自分も参加する</label>
  </div>
  <div class="d-grid gap-2 d-md-flex">
    <button v-if="id=='new'" type="button" class="btn btn-primary" v-on:click="DataSubmit" :disabled="v$.$invalid">作成</button>
    <button v-else type="button" class="btn btn-primary" v-on:click="DataSubmit">変更</button>
    <router-link v-if="id!='new'" :to="{name:'Recruitment',params: {id:id}}" type="button" class="btn btn-secondary">キャンセル</router-link>
  </div>
</template>
<script>
import utils from "./scripts/utils.js"
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, maxLength,integer} from '@vuelidate/validators'
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
      ValidateMessage(validate_obj){
        return utils.ValidateMessage(validate_obj.$errors);
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
        name: {required, maxLengthValue: maxLength(20)},
        owner: {required, maxLengthValue: maxLength(20)},
        member_count: {numeric,integer}
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