import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import SwitchButton from '../../components/swtichButton/swtichButton';

export default class Filter extends Component {
    config = {
        navigationBarTitleText: '筛选',
        navigationBarBackgroundColor: '#000',
        navigationBarTextStyle: '#fff'
    }

    state = {
        cityMode: false,
        appointmentMode: false,
        list: [
            { label: '约电影', check: false, id: 1 },
            { label: '约游戏', check: true, id: 2 },
            { label: '约旅行', check: true, id: 3 },
            { label: '约饭', check: true, id: 4 },
            { label: '约电子游戏城', check: false, id: 5 }
        ]
    }

    list = {
        cityList: [{ label: "同城" }, { label: '不限' }],
        appointmentList: [{ label: "开启" }, { label: '未开启' }]
    }

    citySwitch(cityMode) {
        this.setState({
            cityMode: cityMode
        })
    }
    appointmentSwitch(appointmentMode) {
        this.setState({
            appointmentMode: appointmentMode
        })
    }
    changeList({ id }) {
        // console.log(this);
        let { list } = this.state;
        list = list.map(el => {
            if (el.id == id) el.check = !el.check;
            return el
        })
        this.setState({
            list: list
        })
    }
    render() {
        let { cityList, appointmentList } = this.list;
        let { cityMode, appointmentMode, list } = this.state
        return (
            <View className='filter-page'>
                <View className='filter-content'>
                    <View className='label'><Text>是否同城</Text></View>
                    <SwitchButton buttonList={cityList} active={cityMode} onSwitch={(cityMode) => this.citySwitch(cityMode)}></SwitchButton>
                </View>
                <View className='filter-content last'>
                    <View className='label'><Text>是否开启约玩</Text></View>
                    <SwitchButton buttonList={appointmentList} active={appointmentMode} onSwitch={(appointmentMode) => this.appointmentSwitch(appointmentMode)}></SwitchButton>
                </View>
                <View className='appointment-list'>
                    {
                        list.map((el) => {
                            return <View
                                key={el.id}
                                className={el.check ? 'appointment-item active' : 'appointment-item'}
                                onClick={() => this.changeList(el)}
                            >
                                <Text>{el.label}</Text>
                            </View>
                        })
                    }
                </View>
            </View >
        )
    }
}