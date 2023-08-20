/*
@Description: Tiktok X-Bogus decryption
@Date       :2023/08/21
@Author     :VensGTH
@License    :Apache License 2.0
@Github     :https://github.com/VensGTH
@Mail       :losjefes@pronton.me
-------------------------------------------------
Change Log  :
2023/08/21 - upload
-------------------------------------------------*/


function decBogus(e){
    const d_array = get_array(e);
    if(!validate_bogus(d_array)) return false;
    const timestamp = extract_ts(d_array);
    const magic = extract_magic(d_array)
    let rc4_key = String.fromCharCode.apply(null, d_array.slice(1, 4));
    return {bogus: e, magic, rc4_key, data_array: d_array, timestamp, gen_date: new Date(parseInt(timestamp * 1e3))}
}

function get_array(data){
    if(!data.length === 29) throw Error("wrong length");
    let shifted = atob(b64_shift(data));
    let rc4_data = rc4(String.fromCharCode(255), shifted.slice(2));
    const strArr = rc4_data.split("");
    return strArr.map(a => a.charCodeAt(0))
}

function validate_bogus(l){
    let result = l.slice(0, 18).reduce((a, b) => a ^ b);
    if(l.at(-1) === result) return true;
    return false
}

function extract_ts(e){
    let timeArr = e.slice(10, 14);
    return pack(timeArr);
}

function extract_magic(e){
    let magicArr = e.slice(14, 18);
    return pack(magicArr);
}

function pack(arr){
    if(!arr.length === 4) return false;

    return ((arr[0] << 24) | (arr[1] << 16) | ( arr[2] << 8 ) | (arr[3]))
}

function rc4(key, t) {
    var n = [], a = 0, i = "";

    for (var o = 0; o < 256; o++) n[o] = o;

    for (var f = 0; f < 256; f++) {
        a = (a + n[f] + key.charCodeAt(f % key.length)) % 256;
        [n[f], n[a]] = [n[a], n[f]];
    }
    var c = 0;
    a = 0;
    for (var u = 0; u < t.length; u++) {
        a = (a + n[c = (c + 1) % 256]) % 256;
        [n[c], n[a]] = [n[a], n[c]];
        i += String.fromCharCode(t.charCodeAt(u) ^ n[(n[c] + n[a]) % 256]);
    }
    return i;
}

function b64_shift(t, type = "r"){
    let s1, s2;
    const b64chr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let chars = "Dkdpgh4ZKsQB80/Mfvw36XI1R25-WUAlEi7NLboqYTOPuzmFjJnryx9HVGcaStCe=";
    //if(t.includes("-"))
    type === "f" ? (s1 = chars, s2 = b64chr) : (s1 = b64chr, s2 = chars);
    return t.replace(/[A-Z0-9(-|+)/=]/gi, c => s1[s2.indexOf(c)]);
};

module.exports = {
    decBogus
}

