import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Switch, Input } from '@tarojs/components'

export default class AppointmentItem extends Component {
  render() {
    let { check, iconPath, label } = this.props;
    return (
      <View className='appointmentItem'>
        <Image src={iconPath}></Image>
        <View className='appointmentItem-content'>
          <Text className='appointmentItem-label'>{label}</Text>
          <View>
            <Input className='appointmentItem-input'></Input>
            <Text className='appointmentItem-unit'>币/次</Text>
          </View>

        </View>
        <View className='appointmentItem-button'>
          <Switch color='#000' check={check}></Switch>
        </View>
      </View>
    )
  }
}