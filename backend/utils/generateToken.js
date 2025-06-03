import jwt from 'jsonwebtoken';

// ----- Generate token

export const generatetoken = (userId)=>{
    const token = jwt.sign({userId}, process.env.SECRET_KEY);
    return token
} 