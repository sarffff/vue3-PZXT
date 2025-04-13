import request from '@/utils/request'
export const userRegister = ({ userName, passWord, validCode }) => {
    return request.post('/user/authentication',
        {
            userName,
            passWord,
            validCode
        })
}

export const getValidCode = (tel) => { 
    return request.post('/get/code', {
        tel
    })
}

export const userLogin = ({ userName, passWord }) => { 
    return request.post('/login', {
        userName,
        passWord
    })
}

export const authAdmin = (params) => {
    return request.get('/auth/admin', { params })
}

export const userGetMenu = () => { 
    return request.get('/user/getmenu')
}

export const userSetmenu = ({name,permissions,id}) => { 
    return request.post('/user/setmenu', {
        name,
        permissions,
        id
    })
}

export const userGetMenulist = (params) => {
    return request.get('/menu/list', { params })
}

export const userMenuSelect = () => { 
    return request.get('/menu/selectlist')
}

//用户信息修改
export const userUpdate = (params) => { 
    return request.post('/update/user', params)
}

//用户菜单权限
export const userMenuPermission = () => { 
    return request.get('/menu/permissions')
}

export const getOrderList = (params) => { 
    return request.get('/admin/order', { params })
}