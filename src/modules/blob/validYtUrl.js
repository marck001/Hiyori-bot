
const isValidYtUrl = (url)=>{
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([A-Za-z0-9_-]{11})/;
    return pattern.test(url);
}

module.exports = {  isValidYtUrl};


