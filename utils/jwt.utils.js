const jwt = require('jsonwebtoken')
const JWT_SIGN_SECRET = '9a73539d-798c-4d47-84eb-05b1876269f0';

module.exports = {
    generateTokenForUser : function (user){
        return jwt.sign({
            userId : user.id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn:'1h'
        }
    )
    },
    parseAuthorization : function(authorization){
        if(authorization.indexOf('Bearer') !==0) return null;
        return (authorization!=null)? authorization.replace('Bearer', '') : null;
    },
    getUserId : function (authorization){
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try{
                let jwtToken= jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null){
                    userId = jwtToken.userId;
                }
            }catch(err){}
        }
        return userId;
    }
}