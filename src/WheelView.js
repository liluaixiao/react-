import React, { Component } from 'react';
/**
 * 滚动组件
 */
export default class WheelView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }
    /**
     * 当有新的属性需要更新时。也就是网络数据回来之后
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {//接收父组建的数据
        this.setState({
            data: nextProps.data,
        });//把新的数据填进列表，setState会自动触发render更新界面
        this.scroller.scrollTop = 40 * nextProps.index;
          //每个列表选项高度为40px;
    }
    componentWillMount() {
        // console.log(this.scroller)
    }
    componentDidMount() {
        console.log(this.scroller.scrollTop)
        // var self = this;
        this.scroller.addEventListener('touchstart', touchStart, false);
        this.scroller.addEventListener('touchend', touchEnd, false);
        this.scroller.addEventListener('mousedown', touchStart, false);
        this.scroller.addEventListener('mouseup', touchEnd, false);

        function touchStart(event) {
            this.isTouchStart = true;
        }

        function touchEnd(event) {
            this.isTouchStart = false;
            this.timer = setTimeout(this.reSet, 100)
            //100毫秒未触摸，认定滚动结束进行状态修正
        }
    }

    /**
     * 监听滚动事件
     * @param e
     */
    onScroll() {
        // var self = this;
        if (this.timer) clearTimeout(this.timer)//如果一直在滚动，不会触发timer
        this.timer = setTimeout(this.reSet.bind(this), 100)
        //100毫秒未滚动，认定滚动结束
    }

    /**
     * 状态修正
     */
    reSet() {
        // var self = this;
        if (this.isTouchStart)return;//如果在触摸状态，返回
        console.log('scrolling ends..')
        var top = this.scroller.scrollTop;//滚过的高度
        var dis = top % 40;
        var target;
        if (dis > 20) {//超过一半，向下滚
            target=top + (40 - dis);
            this.transfrom(target);
        } else {//否则滚回去
            target=top - dis;
            this.transfrom(target);
        }
        this.index = target / 40;//  当前选中的序号
        this.props.onDataChange(this.props.type, this.index);
    }
    handleClick(e){   //点到哪个滚到目标位置
        console.log(e.clientY-120);
        var distance = e.clientY-120;  //当前点击的位置距目标位置的距离
        // var self=this;
        var top = this.scroller.scrollTop;  //滚过的高度
        var target = top+Math.floor(distance/40)*40;  //需要滚动的高度
        this.transfrom(target);    //动画过渡到目标位置
        this.index = target / 40;  //  当前选中的序号
        if (!this.index) return;
        this.props.onDataChange(this.props.type, this.index); 
          //回调函数数据改变事件    
    }
    /**
     * 动画过渡到目标位置
     * @param target
     */
    transfrom(target) {
        var self = this;
        var now = this.scroller.scrollTop;
        var step = (target - now) / 20;
        setTimeout(function () {
            self.scroller.scrollTop = self.scroller.scrollTop + step;
            if (self.scroller.scrollTop != target)
                setTimeout(this, 10);//没有滚动到目标位置，继续触发自己
        },10);
    }

    render() {
        return (<div className="container-city"
                     ref={(scroller) => {this.scroller = scroller}}
                     onScroll={this.onScroll.bind(this)}>
                     <div className="scroller">
                        {
                            this.state.data.map((item, index) => {
                            //循环把数据显示出来
                                return <div key={index} className="item">{item}</div>
                            })
                        }
                    </div>
                </div>
        );
    }
};
