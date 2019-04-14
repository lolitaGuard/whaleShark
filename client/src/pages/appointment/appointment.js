import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import AppointmentItem from '../../components/appointmentItem/appointmentItem';
import meal from '../../common/images/meal.png';
import travel from '../../common/images/travel.png';
import film from '../../common/images/Film.png';
import sing from '../../common/images/sing.png';
import motion from '../../common/images/motion.png';
import game from '../../common/images/game.png';


export default class Appointment extends Component {
  config = {
    navigationBarTitleText: '我的约玩'
  }

  state = {
    list: [
      {
        label: '约吃饭',
        iconPath: meal,
        state: true,
        pirce: 300
      }, {
        label: '约旅行',
        iconPath: travel,
        state: true,
        pirce: 300
      }, {
        label: '约电影',
        iconPath: film,
        state: true,
        pirce: 300
      }, {
        label: '约唱歌',
        iconPath: sing,
        state: true,
        pirce: 300
      }, {
        label: '约运动',
        iconPath: motion,
        state: true,
        pirce: 300
      }, {
        label: '约游戏',
        iconPath: game,
        state: true,
        pirce: 300
      },
    ]
  }

  render() {
    let { list } = this.state;
    return (
      <View className='appointment-list'>
        {list.map((el, index) => {
          return (
            <View className='appointment-item' key={index}>
              <AppointmentItem
                label={el.label}
                iconPath={el.iconPath}
                check={el.state}
                price={el.pirce}
              />
            </View>
          )
        })}
      </View >
    )
  }
}