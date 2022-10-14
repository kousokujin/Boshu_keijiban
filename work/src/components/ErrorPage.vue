<template>
    <h1 class='display-6'>500 Internal Server Error</h1>
    <div class="col">
        <img :src="require('@/assets/404.png')" alt="404Image" class="img-fluid">
    </div>
</template>
<script>
 export default {
    mounted(){
        document.title = "500 Internal Server Error";
    }
}
</script>