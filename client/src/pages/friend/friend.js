import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'
import Card from '../../components/card/card';
import photo from '../../common/images/photo.png';
import filter from '../../common/images/filter.png';
import './friend.less';

export default class Friend extends Component {
    config = {
        navigationBarTitleText: '交友'
    }
    state = {
        list: [{
            name: '123',
            photo: photo
        }, {
            name: '223',
            photo: photo
        }, {
            name: '223',
            photo: photo
        }],
        height: 0,
    }

    componentDidMount() {
        this.getSystemInfoSync();
    }

    onChange(e) {
        let { detail: { current } } = e;
        let { list } = this.state;
        if (current >= list.length - 2) {
            this.pushList()
        }
    }

    navigateFilter() {
        console.log('navigateFilter')
        Taro.navigateTo({
            url: '/pages/filter/filter'
        })
    }

    // 测试数据
    pushList() {
        let { list } = this.state;
        setTimeout(() => {
            list.push({ name: 12334 })
            this.setState({ list })
        }, 1000);
    }

    getSystemInfoSync() {
        let res = Taro.getSystemInfoSync();
        let height = res.windowHeight;
        this.setState({ height });
    }

    render() {
        let { height } = this.state;
        return (
            <View className='friend-container'>
                <Swiper className='swpier' style={{ height: height + 'px' }}
                    onChange={(e) => { this.onChange(e) }}
                >
                    {
                        list.map(el => {
                            return (
                                <SwiperItem key={el.name} className='card-container'>
                                    <View className='card-content'>
                                        <Card photo={el.photo} />
                                    </View>

                                </SwiperItem>
                            )
                        })
                    }

                </Swiper>
                <View className='filter-wrapper' onClick={() => this.navigateFilter()}>
                    <Image src={filter} className='filter' />
                </View>
            </View>
        )
    }
}