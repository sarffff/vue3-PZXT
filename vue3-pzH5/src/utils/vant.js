import { createApp } from 'vue'
import 'vant/lib/index.css'
import {
    Button, Tabbar, TabbarItem, Form, Field, Icon, Search, Swipe, SwipeItem,
    Row,Col,Cell, CellGroup,Popup,Picker, DatePicker,Notify ,Dialog,Tab,Tabs,
 } from 'vant'
const app = createApp({})
app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Form);
app.use(Field)
app.use(Icon)
app.use(Search)
app.use(Swipe)
app.use(SwipeItem)
app.use(Row)
app.use(Col)
app.use(Cell)
app.use(CellGroup)
app.use(Popup)
app.use(Picker)
app.use(DatePicker)
app.use(Notify)
app.use(Dialog)
app.use(Tab)
app.use(Tabs)