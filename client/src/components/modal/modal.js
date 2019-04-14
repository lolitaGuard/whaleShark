import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './modal.less';

export default class Modal extends Component {
  static defaultProps = {
    isShow: false
  }
  render() {
    let { isShow } = this.props;
    return (
      <View className='modal-wrapper' style={{ display: isShow ? 'block' : 'none' }}>
        {this.props.children}
      </View>
    )
  }
}