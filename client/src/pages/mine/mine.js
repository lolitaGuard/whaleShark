import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import Panel from '../../components/panel/panel'
import './mine.less';
import message from '../../common/images/message.png';
import setting from '../../common/images/setting.png';
import female from '../../common/images/female.png';
import pencel from '../../common/images/pencel.png'
export default class Mine extends Component {
    config = {
        navigationBarTitleText: '我的'
    }

    render() {
        return (
            <View className='mine-page'>
                <View className='mine-top'>
                    <View className='userinfo-wrapper'>
                        <View className='avatar-wrapper'>
                            <Image className='avatar-image' src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554323484907&di=baa3503d6a3296def28f72580dd72046&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201606%2F17%2F20160617132106_ZELQd.jpeg'></Image>
                        </View>
                        <View className='userinfo'>
                            <View className='userinfo-username'>
                                <Text>你的baby</Text>
                            </View>
                            <View className='userinfo-detail'>
                                <Image className='userinfo-sex' src={female}></Image>
                                <Text className='userinfo-age'>24</Text>
                                <Text className='userinfo-address'>杭州市,下城区</Text>
                            </View>
                        </View>
                        <View className='userinfo-action'>
                            <Image className='userinfo-message' src={message}></Image>
                            <Image className='userinfo-setting' src={setting}></Image>
                        </View>
                    </View>
                    <View className='user-state'>
                        <View className='user-state-left'>
                            <View className='state-item'>
                                <View className='state-item-number'>
                                    <Text>3.2w</Text>
                                </View>
                                <View className='state-item-name'>
                                    <Text>获赞</Text>
                                </View>
                            </View>
                            <View className='state-item'>
                                <View className='state-item-number'>
                                    <Text>435</Text>
                                </View>
                                <View className='state-item-name'>
                                    <Text>粉丝</Text>
                                </View>
                            </View>
                            <View className='state-item'>
                                <View className='state-item-number'>
                                    <Text>4</Text>
                                </View>
                                <View className='state-item-name'>
                                    <Text>关注</Text>
                                </View>
                            </View>
                        </View>
                        <Button className='sign'>签到</Button>
                    </View>
                </View>
                <View className='panel-list'>
                    <View className='panel-item'>
                        <Panel label='颜值日记' iconPath={pencel} backgroudColor='#000'></Panel>
                    </View>
                    <View className='panel-item'>
                        <Panel label='颜值日记' iconPath={pencel} backgroudColor='#000'></Panel>
                    </View>
                </View>
            </View >
        )
    }
}