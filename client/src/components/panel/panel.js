import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './panel.less';
import more from '../../common/images/more.png'

export default class Panel extends Component {
    render() {
        let { label, iconPath, backgroudColor } = this.props;
        return (
            <View className='panel-wrapper'>
                <View className='panel'>
                    <View className='panel-icon-wrapper' style={{ backgroundColor: backgroudColor }}>
                        <Image className='panel-icon' src={iconPath}></Image>
                    </View>

                    <Text className='panel-label'>{label}</Text>
                </View>

                <Image className='panel-more' src={more}></Image>
            </View>
        )
    }
}