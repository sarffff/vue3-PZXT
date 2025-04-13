import request from '../utils/request';

export const userLogin = (data) => { 
    return request.post('/login', data);
}

export const getIndexInfo = () => {
    return request.get('/Index/index')
}