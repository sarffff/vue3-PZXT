import request from '../utils/request'

export const usestaffAvatar = () => {
    return request.get('/photo/list');
}

export const updateStaff = (data) => { 
    return request.post('/companion', data);
}

export const getstaffList = (params) => {
    return request.get('/companion/list', { params });
}

export const deletaStaff = (id) => { 
    return request.post('/delete/companion' , id);
}