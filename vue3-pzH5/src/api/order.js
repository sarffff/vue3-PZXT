import request from '../utils/request';
//获取订单详情
export const getOrderDetail = () => { 
    return request.get('/h5/companion');
}

export const createOrder = (data) => { 
    return request.post('/createOrder', data);
}

export const getOrderList = ({state}) => { 
    return request.get('/order/list', { params: { state } });
}

export const getOrderDetails = ({ oid }) => { 
    return request.get('/order/detail', { params: { oid } });    
}