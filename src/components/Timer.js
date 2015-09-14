import React, { Component, PropTypes } from 'react';


export default class Timer extends Component {

  static propTypes = {
    update: PropTypes.func.isRequired,
    timers: PropTypes.array.isRequired
  }

  state = {
    timers: [],
    timeout: false,
    updateTimeout: false
  };

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
    this.props.update();
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.state.updateTimeout);
    this.setState({
      updateTimeout: setTimeout(nextProps.update, this.nextUpdate(nextProps).getTime() - (new Date()).getTime())
    });
    this.updateState(nextProps);
  }

  updateState(props) {
    clearTimeout(this.state.timeout);
    this.setState({
      timers: this.sortedTimers(props || this.props),
      timeout: setTimeout(this.updateState.bind(this), 1000)
    });
  }

  nextUpdate(props) {
    var now = new Date();
    var next = new Date(now.getTime() + 60000);
    return props.timers
    .map((timer) => {
      return timer.date;
    })
    .filter((date) => {
      return date && date.getTime() > now.getTime() && date.getTime() < next.getTime();
    })
    .reduce((prev, cur) => {
      if (cur.getTime() < prev.getTime()) {
        return cur;
      }

      return prev;
    }, next);
  }

  sortedTimers(props) {
    return props.timers.filter((timer) => {
      return timer.date === null || (timer.date.getTime() - (new Date()).getTime()) >= -10000;
    }).sort((a, b) => {
      if (b.date === null || a.date > b.date) {
        return 1;
      } else if (a.date === null || a.date < b.date) {
        return -1;
      }

      return 0;
    });
  }

  dateLocale(date) {
    if (date === null) return 'Disponível';

    var now = new Date();
    var locale = [];

    if (date.getDate() === now.getDate()) {
      locale.push('hoje');
    } else if (date.getDate() === now.getDate() + 1) {
      locale.push('amanhã');
    } else {
      locale.push(this.pad(date.getDate()) + '/' + this.pad(date.getMonth() + 1));
    }

    locale.push('às');
    locale.push(this.pad(date.getHours()) + ':' + this.pad(date.getMinutes()));

    return locale.join(' ');
  }

  remaining(date) {
    var now = new Date();
    var distance = date - now;

    if (date === null || distance < 0) {
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
      <div className="content-border">
        <div className="inner-border" style={{padding: 10}}>
          <p><button className="btn" onClick={this.props.update}>Atualizar</button></p>
          <table className="vis" style={{borderSpacing: 2, borderCollapse: 'separate', emptyCells: 'show', width: '100%'}}>
            <tbody>
              <tr>
                <th style={{padding: '2px 4px'}}>Descrição</th>
                <th style={{padding: '2px 4px'}}>Duração</th>
                <th style={{padding: '2px 4px'}}>Conclusão</th>
              </tr>
              {this.state.timers.map((timer) => {
                return (
                  <tr key={timer.id}>
                    <td style={{padding: '2px 4px'}}>{timer.description}</td>
                    <td className="nowrap" style={{padding: '2px 4px', textAlign: 'right'}}>{this.remaining(timer.date)}</td>
                    <td style={{padding: '2px 4px', textAlign: 'right'}}>{this.dateLocale(timer.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
