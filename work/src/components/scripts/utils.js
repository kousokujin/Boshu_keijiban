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
    },

    ValidateMessage(validator){
        if(validator.length < 1){
            return ""
        }

        const validate_type = validator[0].$validator;
        switch(validate_type){
            case "maxLengthValue":{
                const max = validator[0].$params.max;
                return max + "文字以下の文字を入力してください。"
            }
            case "required":{
                return "この項目は必須項目です。"
            }
            case "numeric":{
                return "数字を入力してください。"
            }
            case "integer":{
                return "数字を入力してください。"
            }
            default:{
                return validator[0].$message
            }
        }
    }
}