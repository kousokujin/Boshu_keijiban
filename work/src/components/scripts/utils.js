export default {
    ConvertTime(str){
        let parse = Date.parse(str);
        let date_obj = new Date(parse);
        return date_obj.toLocaleString();
    },

    ReadMore(text,length,suffix = "..."){
        if(text.length > length){
            return text.substring(0, length) + suffix;
        }
        else{
            return text;
        }
    },

    ErrorMessage(err,vueobj){
        console.log(err);
        let message = err.response.status + ":" + err.response.statusText;
        vueobj.$emit('ErrorMessage',message);
    }
}