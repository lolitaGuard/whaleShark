import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './swtichButton.less'

export default class SwtichButton extends Component {
    static defaultProps = {
        active: false,
        buttonList: []
    }

    chooseButton(idx) {
        let { active } = this.props;
        let currentIndex = active ? 1 : 0;
        if (idx === currentIndex) return;
        this.props.onSwitch && this.props.onSwitch(!active);
    }

    render() {
        let { buttonList, active } = this.props;
        let currentIndex = active ? 1 : 0;
        let current = buttonList[currentIndex];
        return (
            <View className='swtich-button-wrapper'>
                {
                    buttonList.map((el, idx) => <View key={idx} className='switch-button' onClick={() => this.chooseButton(idx)}><Text>{el.label}</Text></View>)
                }
                <View className={!active ? "swtich-block" : 'swtich-block swtich-block-active'}>{current.label}</View>
            </View>
        )
    }
}
