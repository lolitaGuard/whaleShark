import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import AppointmentItem from '../../components/appointmentItem/appointmentItem';

export default class Appointment extends Component {
  config = {
    navigationBarTitleText: '我的约玩'
  }

  render() {
    return (
      <View className='appointment-list'>
        <AppointmentItem></AppointmentItem>
      </View>
    )
  }
}