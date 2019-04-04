import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/mine/mine',
      'pages/index/index',
      'pages/appointment/appointment'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#000',
      selectedColor: '#E17069',
      position: 'bottom',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '颜值',
          iconPath: 'common/tabbar/home.png',
          selectedIconPath: 'common/tabbar/home_active.png'
        }, {
          pagePath: 'pages/index/index',
          iconPath: 'common/tabbar/friend.png',
          selectedIconPath: 'common/tabbar/friend_active.png',
          text: '交友'
        }, {
          pagePath: 'pages/mine/mine',
          iconPath: 'common/tabbar/mine.png',
          selectedIconPath: 'common/tabbar/mine_active.png',
          text: '我的'
        }
      ]
    }
  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
