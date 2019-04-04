import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Switch, Input } from '@tarojs/components'
import './appointmentItem.less';

export default class AppointmentItem extends Component {
  render() {
    let { check, iconPath, label } = this.props;
    return (
      <View className='appointmentItem'>
        <View className='appointmentItem-image-wrapper'>
          <Image src={iconPath} className='appointmentItem-image'></Image>
        </View>

        <View className='appointmentItem-content'>
          <View className='appointmentItem-top'>
            <Text className='appointmentItem-label'>{label}</Text>
            <View className='appointmentItem-button'>
              <Switch color='#000' check={check}></Switch>
            </View>
          </View>

          <View className='appointmentItem-middle'>
            <Input className='appointmentItem-input'></Input>
            <Text className='appointmentItem-unit'>币/次</Text>
          </View>
        </View>
      </View>
    )
  }
}