import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Userinfo from '../../components/userinfo/userinfo';
import './card.less';

export default class Card extends Component {
    render() {
        let { photo, username, sex, age, address, stateList } = this.props;
        return (
            <View className='card'>
                <Image src={photo} className='card-image' />
                <View className='card-info'>
                    <View className='userinfo'>
                        <Userinfo color="#fff" />
                    </View>
                    <View className='button'>
                        <View className='card-button'>约玩</View>
                    </View>
                </View>
            </View>
        )
    }
}