import React, { Component, PropTypes } from 'react';


export default class Timer extends Component {

  static propTypes = {
    update: PropTypes.func.isRequired,
    timers: PropTypes.array.isRequired
  }

  state = {timers: [], timeout: false};

  componentDidMount() {
    this.props.update();
    this.update();
  }

  update() {
    clearTimeout(this.state.timeout);
    this.setState({
      timers: this.sortedTimers(),
      timeout: setTimeout(this.update.bind(this), 1000)
    });
  }

  sortedTimers() {
    return this.props.timers.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      } else if (a.date < b.date) {
        return -1;
      }

      return 0;
    });
  }

  dateLocale(date) {
    return date.toLocaleString();
  }

  remaining(date) {
    var now = new Date();
    var distance = date - now;

    if (distance < 0) {
      return 'Pronto';
    }

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;

    var hours = Math.floor(distance / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    return [this.pad(hours), this.pad(minutes), this.pad(seconds)].join(':');
  }

  pad(str) {
    return ('00' + str).substring(('' + str).length);
  }

  render() {
    return (
      <div>
        <button onClick={this.props.update}>Update</button>
        <ul>
          {this.state.timers.map((timer) => {
            return (
              <li key={timer.id}>
                {timer.description} - {this.dateLocale(timer.date)} ({this.remaining(timer.date)})
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
