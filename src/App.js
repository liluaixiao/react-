import React, { Component } from 'react';
import './App.css';
import WheelDialog from './WheelDialog';
import './citySelect.css';
import $ from './zepto.js';

import DatePicker from 'react-mobile-datepicker';

 /**
     * 城市选择回调，返回省市区的下标
     */
class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        isShow: false,

        time: new Date(),
        isOpen: false
      }
    }
   // 城市选择插件事件
    onAddressSelect(pIndex, cIndex, aIndex) {
        var data = this.state.data;
        var address = data[pIndex].name
            + data[pIndex].city[cIndex].name
            + data[pIndex].city[cIndex].area[aIndex];
        console.log(" address:  --->" + address)
        this.address = address;
       //与渲染无关的数据  直接存在this对象里  如果存在State里面会导致页面脏渲染，卡顿
    }
    onClick() {
        this.input.innerHTML = this.address;
        this.setState({isShow: !this.state.isShow})
    }
    showCitySelect() {
        this.setState({isShow: !this.state.isShow})
    }

    // 时间插件选择事件
    handleClick = () => {
      this.setState({ isOpen: true });
    }

    handleCancel = () => {
      this.setState({ isOpen: false });
    }

    handleSelect = (time) => {
      this.setState({ time, isOpen: false }, ()=> {
        let date = this.state.time;
        this.selectValue.innerHTML = date.getFullYear() + '-' + (date.getMonth()-0 +1) + '-' + date.getDate();
        console.log(new Date(this.state.time))
      });
    }

    componentWillMount() {
      // console.log(this.state.data)
    }
    componentDidMount() {
        var self = this;
        $.get("http://ac-wiuh7w1y.clouddn.com/c4acc5d3bec3fb3216fa.json", 
              function (data) {
            self.setState({data: data});
        });
    }
  render() {
    return (
      <div className="Appb">
    {/* 城市插件选择 */}
        <div className="dataChoose" onClick={this.showCitySelect.bind(this)} ref={(input)=>{this.input=input}}>请选择地址</div>
        <div className={this.state.isShow?'containerb':'hide'}>
          <div className="picker">
            <div className="header">
              <span onClick={this.showCitySelect.bind(this)}>取消</span>
              <span>请选择地址</span>
              <span onClick={this.onClick.bind(this)}>确定</span>
            </div>
                <WheelDialog
                        data={this.state.data}
                        onAddressSelect={this.onAddressSelect.bind(this)}//传进回调
                />
          </div>
        </div>
      {/* 时间插件选择 */}
        <div className="App">
          <a
            className="select-btn"
            onClick={this.handleClick}
            ref={(selectValue)=>{this.selectValue=selectValue}}>
            select time
          </a>
          <DatePicker
            value={this.state.time}
            isOpen={this.state.isOpen}
            onSelect={this.handleSelect.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            dateFormat={['YYYY', 'M', 'D']} 
            min={new Date()}/>
      </div>
    </div>
    );
  }
}

export default App;
