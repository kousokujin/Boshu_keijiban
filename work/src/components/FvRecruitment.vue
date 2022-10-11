<template>
  <h1 class="col-auto me-auto display-2">
    {{main_data.name}}
    <small class="text-muted">(@{{main_data.owner}})</small>
  </h1>
  <span>更新日:{{ConvertTime(main_data.updatedAt)}}</span>
  <p class="lead" style="white-space:pre-wrap; word-wrap:break-word;">{{main_data.discription}}</p>
  <h4 class="display-6" v-if="main_data.member_max != 0">メンバー({{main_data.members.length}}/{{main_data.member_max}})</h4>
  <h4 class="display-6" v-else>メンバー({{main_data.members.length}}人)</h4>
  <div class="table-responsive">
    <table class="table table-striped mb-3">
      <thead>
        <tr>
          <th class="col-3">名前</th>
          <th class="col-6">コメント</th>
          <th class="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in main_data.members" v-bind:key="m.id">
          <td v-if="m.isEdit == false">{{m.name}}</td>
          <td v-else><input text="text" :class="['form-control','form-control-sm', invalid_member(m) ? 'is-invalid' : '']" v-model="m.name" v-on:keydown.enter="apply_member_btn(m.id)" ></td>
          <td v-if="m.isEdit == false">{{m.discription}}</td>
          <td v-else><input text="text" class="form-control form-control-sm" v-model="m.discription" v-on:keydown.enter="apply_member_btn(m.id)"></td>
          <td>
            <div v-if="m.isEdit == false" class="d-grid gap-2 d-md-flex">
              <button type="btn" class="btn btn-sm btn-primary" v-on:click="edit_member_btn(m.id)"><i class="bi bi-pencil-square"></i></button>
            </div>
            <div v-else class="d-grid gap-2 d-md-flex">
              <button type="btn" class="btn btn-sm btn-success" v-on:click="apply_member_btn(m.id)"><i class="bi bi-check-lg"></i></button>
              <button type="btn" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button>
            </div>
          </td>
        </tr>
        <tr v-if="main_data.member_max == 0|| main_data.members.length < main_data.member_max">
          <td>
            <input text="text" v-if="new_member.isEdit == true" v-model="new_member.name" :class="['form-control','form-control-sm',invalid_member(new_member) ? 'is-invalid' : '']" v-on:keydown.enter="add_member_btn">
          </td>
          <td>
            <input text="text" v-if="new_member.isEdit == true" v-model="new_member.discription" class="form-control form-control-sm" v-on:keydown.enter="add_member_btn">
          </td>
          <td class="d-grid gap-2 d-md-flex">
            <button type="button" class="btn btn-sm btn-success" v-on:click="add_member_btn">
              <i class="bi bi-plus-lg" v-if="new_member.isEdit == false"></i>
              <i class="bi bi-check-lg" v-else></i>
            </button>
            <button v-if="new_member.isEdit == true" type="button" class="btn btn-sm btn-secondary" v-on:click="cancel_member_btn"><i class="bi bi-x-lg"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-grid gap-2 d-md-flex mb-3">
    <router-link :to="{ path: `/edit/${main_data.id}`}" type="button" class="btn btn-primary">編集</router-link>
    <button class="btn btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#delete_btn_area" aria-expanded="false" aria-controls="delete_btn_area">
      削除
    </button>
  </div>
  <div class="collapse" id="delete_btn_area">
    <div class="card card-body">
      <p>削除を行うには下のボタンを押します。</p>
      <div class="d-grid gap-2 d-md-block">
        <button class="btn btn-danger" type="button"  data-bs-toggle="modal" data-bs-target="#delete_modal">削除を実行する</button>
      </div>
    </div>
  </div>

  <!--募集削除モーダル-->
  <div class="modal fade" id="delete_modal" tabindex="-1" aria-labelledby="delete_modal_label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="delete_modal_label">削除</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          削除を実行しますか？
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" v-on:click="delete_recruitment">削除する</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from "./scripts/utils.js";
  export default {
    data : function(){
      return {
        main_data: {
          members: []
        },
        new_member: {
          isEdit: false,
          name: "",
          discription: "",
        },
        edit_temp : ""
      };
    },
    created: function(){      
      this.reload();
    },
    emits: ['InfoMessage','ErrorMessage'],
    methods:{
      reload(){
        this.axios.get('/api/recruitment/'+this.$route.params.id).then((res)=>{
          this.main_data = res.data;
          this.main_data.members.forEach((value)=>{
            value["isEdit"] = false;
          });
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        });
      },
      edit_member_btn(id){
        this.main_data.members.forEach(value=>{
          value.isEdit = false;
        });
        this.new_member.isEdit = false;
        const edit_data = this.main_data.members.find(e=>(e.id == id));
        edit_data.isEdit = true;
        this.edit_temp = edit_data.name;
      },
      apply_member_btn(id){
        const target = this.main_data.members.find(x=>(x.id == id));
        if(this.invalid_member(target)){
          target.isEdit = false;
          target.name = this.edit_temp;
          this.edit_temp = "";
          return;
        }
        const request_data = {
          recuit_id: this.main_data.id,
          id: target.id,
          name: target.name,
          discription: target.discription,
          _csrf: this.main_data._csrf,
        };
        this.axios.post('/api/modify_member',request_data).then(()=>{
          target.isEdit = false;
          this.reload();
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        });
        this.edit_temp = "";

      },
      add_member_btn(){
        if(this.new_member.isEdit == true){
          if(this.invalid_member(this.new_member)){
            this.cancel_member_btn();
            return;
          }

          let request_data = {
            recuit_id: this.main_data.id,
            name: this.new_member.name,
            discription: this.new_member.discription,
            _csrf: this.main_data._csrf
          };
          this.axios.post('/api/add_member',request_data).then(()=>{
            this.reload();
            this.cancel_member_btn();
          }).catch((err)=>{
            if(err.response.data.message == "MAX_MEMBER"){
              this.$emit('ErrorMessage',"人数が満員です。");
              return;
            }
            utils.ErrorMessage(err,this);
          });
        }
        else{
          this.new_member.isEdit = true;
          this.main_data.members.forEach((value)=>{
            value.isEdit = false;
          });
        }
      },
      cancel_member_btn(){
        this.new_member.name = "";
        this.new_member.discription = "";
        this.new_member.isEdit = false;
      },
      invalid_member(member){
        return member.name.length <= 0 || member.name.length > 20
      },
      delete_recruitment(){
        const request_data = {
          id: this.main_data.id,
          _csrf: this.main_data._csrf
        }
        this.axios.post('/api/delete/recruitment',request_data).then(()=>{
          this.$router.push('/');
        }).catch((err)=>{
          utils.ErrorMessage(err,this);
        })
      }
    },
    computed:{
      ConvertTime(){
        return utils.ConvertTime
      }
    }
  }
</script>