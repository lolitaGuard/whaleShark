import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import female from '../../common/images/female.png';
import './userinfo.less';

export default class Userinfo extends Component {
    render() {
        let { color, username, sex, age, address } = this.props;
        color = color || '#000'
        return (
            <View className='userinfo-wrapper'>
                <View className='userinfo'>
                    <View className='userinfo-username'>
                        <Text style={{ color: color }}>你的baby</Text>
                    </View>
                    <View className='userinfo-detail'>
                        <Image className='userinfo-sex' src={female}></Image>
                        <Text className='userinfo-age'>24</Text>
                        <Text className='userinfo-address' style={{ color: color }}>杭州市,下城区</Text>
                    </View>
                </View>
            </View>
        )
    }
}