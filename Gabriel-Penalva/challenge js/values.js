 function isEqual (a,b){
    if ((Object.is(a,0) || Object.is(b,0)) && (Object.is(a,-0) || Object.is(b,-0))){
        return true;
    }else if((Object.is(a,NaN) && Object.is(b,NaN))){
        return false;
    }else {
        return Object.is(a,b);
    }
}

let array = [0,0,0,0,0];
console.log(array[-1]);
