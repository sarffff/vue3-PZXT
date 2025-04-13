import { defineStore } from "pinia";
import {ref} from 'vue';
export const useUserStore = defineStore('user', () => {
    const token = ref()
    const userInfo = ref({})
    const setToken = (newtoken) => {
        token.value = newtoken
    }
    const removeToken = () => {
        token.value = null
    }
    const setUserInfo = (newuserInfo) => {
        userInfo.value = newuserInfo
    }
    return {
        token,
        userInfo,
        setToken,
        removeToken,
        setUserInfo
    }
},
{
    persist: [
        {
            key: 'h5-token',
            pick: ['token'],
            storage: localStorage
        },
        {
            key: 'h5-userInfo',
            pick: ['userInfo'],
            storage: localStorage
        }
     
    ]  
}    );