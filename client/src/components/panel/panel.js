import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './panel.less';
import more from '../../common/images/more.png'

export default class Panel extends Component {
    navigate(page) {
        this.props.onMore && this.props.onMore(page)
    }
    render() {
        let { label, iconPath, backgroudColor, noBorder, page } = this.props;
        return (
            <View className='panel-wrapper' onClick={() => this.navigate(page)}>
                <View className='container' style={{ borderBottom: noBorder ? '' : '1px solid #EAEAEA' }}>
                    <View className='panel'>
                        <View className='panel-icon-wrapper' style={{ backgroundColor: backgroudColor }}>
                            <Image className='panel-icon' src={iconPath}></Image>
                        </View>

                        <Text className='panel-label'>{label}</Text>
                    </View>

                    <Image className='panel-more' src={more}></Image>
                </View>
            </View >
        )
    }
}