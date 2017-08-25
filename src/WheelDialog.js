import React, { Component } from 'react';
import WheelView from './WheelView.js';
/**
 * 选择组件
 */
export default class WheelDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pro: [],//省数组
            city: [],//市数组
            area: [],//区数组
            pIndex: 0,//当前的省下标
            cIndex: 0,//当前的市下标
            aIndex: 0,//当前的区下标
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data});//把新的数据填进列表，setState会自动触发render更新界面
        this.initData(nextProps.data);
    }
    initData(data) {
        var pArr = [];
        var cArr = [];
        var aArr = [];
        data.map(function (pro) {
            pArr.push(pro.name);
        });
        if (data[0])
            data[0].city.map(function (city) {
                cArr.push(city.name)
            });
        aArr = data[0].city[0].area;
        this.setState({
            pro: pArr,
            city: cArr,
            area: aArr
        });
        this.props.onAddressSelect(0, 0, 0);
    }
    onDataChange(type, index) {
        console.log(type + "   --->" + index)
        var cArr = [];
        var aArr = [];
        switch (type) {
            case  "pro"://省带动市区变化
                this.state.data[index].city.map(function (city) {
                    cArr.push(city.name)
                });
                aArr = this.state.data[index].city[0].area;
                this.setState({
                    city: cArr,
                    area: aArr,
                    pIndex: index,
                    cIndex: 0,
                    aIndex: 0,
                });
                break;
            case  "city"://市带动区变化
                // if(this.state.data[this.state.pIndex].city[index].area == 'undefined')return;
                aArr = this.state.data[this.state.pIndex].city[index].area;
                this.setState({
                    area: aArr || [],
                    cIndex: index,
                    aIndex: 0,
                });

                break;
            case  "area":
                this.setState({aIndex: index});
                break;
        }
        this.props.onAddressSelect(this.state.pIndex, this.state.cIndex, this.state.aIndex);//数据变化之后，触发回调
    }
    render() {
        return (
                <div className="dialog">
                    <div  className="box"></div>
                    <WheelView type="pro" data={this.state.pro}
                               index={this.state.pIndex}
                               onDataChange={this.onDataChange.bind(this)}/>
                    <WheelView type="city" data={this.state.city}
                               index={this.state.cIndex}
                               onDataChange={this.onDataChange.bind(this)}/>
                    <WheelView type="area" data={this.state.area}
                               index={this.state.aIndex}
                               onDataChange={this.onDataChange.bind(this)}/>

                </div>
        );
    }
};
