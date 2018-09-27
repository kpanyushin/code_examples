import React, { PureComponent } from 'react';
import classNames from 'classnames';

type Props = {
  data: Array<{
    text: Array<string>,
    active: boolean,
    empty: boolean,
    hidden: boolean,
    value: number
  }>,
  onClick: ({
    text: Array<string>,
    active: boolean,
    empty: boolean,
    hidden: boolean,
    value: number
  }, index: number) => void,
  titles: Array<string>,
  index: number,
  home: District,
  work: District,
};

type District = {
  value: number,
  label: string,
  district: number
}

type State = {
  fontSize: number,
  hours: number,
  minutes: number
};

const colors = [
  'white',
  'white',
  '#4bffa2',
  '#81ffa2',
  '#c3fea1',
  '#eae478',
  '#fcc25d',
  '#ee7553',
  '#ee7453',
  '#e9584f',
  '#ffd46b'
]

import styles from './PollutionCircle.css';
// import points from '../../constants/points';
// import Point from '../Point/Point';

export default class PollutonCircle extends PureComponent<Props, State> {
  constructor(props: Props):void {
    super(props);

    this.state = {
      fontSize: this.getFontSize(),
      hours: this.getRandomInt(0, 360),
      minutes: this.getRandomInt(0, 360)
    }
  }

  componentWillMount():void {
    window.addEventListener('resize', this.resizeWindow.bind(this), false);
  }

  componentDidMount() {
    if (this.work && this.home) {
      let work_rect = this.work.getBoundingClientRect();
      let home_rect = this.home.getBoundingClientRect();

      this.props.getPositions(work_rect, home_rect)
    }

    if (this.pol_l && this.pol_r && this.pol_wl && this.pol_wr) {
      let transform_l = getComputedStyle(this.pol_l).getPropertyValue('transform');
      let transform_wr = getComputedStyle(this.pol_wr).getPropertyValue('transform');

      this.pol_l.setAttribute('transform', transform_l);
      this.pol_wr.setAttribute('transform', transform_wr);
    }
  }


  componentWillUnmount():void {
    window.removeEventListener('resize', this.resizeWindow.bind(this), false);
  }

  resizeTimeout = null;
  work = null;
  home = null;
  pol_l = null;
  pol_r = null;
  pol_wl = null;
  pol_wr = null;

  resizeWindow():void {
    if (!this.resizeTimeout) {
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = null;
        this.setState({
          fontSize: this.getFontSize()
        })
        if (this.work && this.home) {
          let work_rect = this.work.getBoundingClientRect();
          let home_rect = this.home.getBoundingClientRect();

          this.props.getPositions(work_rect, home_rect)
        }
      }, 66);
    }
  }

  getFontSize():number {
    let fontSize = 0;

    if (document.documentElement && window)  {
      let doc = document.documentElement;
      let fontSizeString = window.getComputedStyle(doc, null).getPropertyValue('font-size');

      fontSize = parseInt(fontSizeString);
    }

    return fontSize;
  }

  getRandomInt(min: number, max: number):number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  render() {
    let { index, titles, home, work } = this.props;
    let { fontSize, hours, minutes } = this.state;
    let work_value = (6 - parseInt(work.value)) + 2;
    let home_value = (6 - parseInt(home.value)) + 2;
    let rad_k = Math.PI/180;

    return (
      <div className={styles.container}>
        <svg viewBox='0 0 1920 910' x='0px' y='0px' style={{
          height: '100%',
          width: '100%'
        }}>
          <g style={{opacity: .3}}>
            <line x1="960" y1="455" x2="960" y2="105" className={styles.minutes}
              style={{transform: `rotate(${minutes}deg)`}}
            />
            <line x1="960" y1="455" x2="960" y2="155" className={styles.hours}
              style={{transform: `rotate(${hours}deg)`}}
            />
          </g>
          <defs>
            <linearGradient id="linear" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0" stopColor="#1dffa2"/>
              <stop offset="0.26" stopColor="#c2ffa4"/>
              <stop offset="0.49" stopColor="#ffd560"/>
              <stop offset="1" stopColor="#e5414c"/>
            </linearGradient>
          </defs>
          <g transform ="translate(960, 455)">
            <circle
              ref={ref => this.pol_l = ref}
              className={styles.circleLeft}
              stroke="url(#linear)"
              cx='0'
              cy='0'
              r='400'
              strokeDashoffset={2513 - (home_value * 125.6) + 37}
            />
            <circle
              ref={ref => this.pol_r = ref}
              className={styles.circleRight}
              stroke="url(#linear)"
              cx='0'
              cy='0'
              r='400'
              transform={`rotate(${90 - 16 * work_value})`}
              strokeDashoffset={2513 - (work_value * 125.6) + 37}
            />
            <circle
              ref={ref => this.pol_wl = ref}
              className={styles.circleWhiteLeft}
              cx='0'
              cy='0'
              r='400'
              transform={`rotate(${270 - 16 * (10 - home_value)})`}
              strokeDashoffset={1286 + (home_value * 125.6)}
            />
            <circle
              ref={ref => this.pol_wr = ref}
              className={styles.circleWhiteRigth}
              cx='0'
              cy='0'
              r='400'
              strokeDashoffset={1286 + (work_value * 125.6)}
            />
          </g>
          <circle
            className={styles.values}
            stroke={colors[work_value]}
            fill={colors[work_value]}
            cx={960 - 400 * Math.cos((17 * work_value - 270) * rad_k)}
            cy={455 + 400 * Math.sin((17 * work_value - 270) * rad_k)}
            r='20'
          />
          <circle
            className={styles.values}
            stroke={colors[home_value]}
            fill={colors[home_value]}
            cx={960 + 400 * Math.cos((17 * home_value - 270) * rad_k)}
            cy={455 + 400 * Math.sin((17 * home_value - 270) * rad_k)}
            r='20'
          />
          <text
            ref={ref => this.work = ref}
            className={styles.percent}
            x={960 - 400 * Math.cos((17 * work_value - 270) * rad_k)}
            y={455 + 400 * Math.sin((17 * work_value - 270) * rad_k) + 10}
            textAnchor={'middle'}
          >
            &#160;
          </text>
          <text
            ref={ref => this.home = ref}
            className={styles.percent}
            x={960 + 400 * Math.cos((17 * home_value - 270) * rad_k)}
            y={455 + 400 * Math.sin((17 * home_value - 270) * rad_k) + 10}
            textAnchor={'middle'}
          >
            &#160;
          </text>

          {/*<text x={960} className={styles.question} y={175} textAnchor={'middle'}>ТЕСТ</text>*/}
          <text x={960} className={styles.counter} y={175 + fontSize * 3} textAnchor={'middle'}>ВОПРОС {index}/10</text>
          {
            titles.map((text, key) => {
              return (
                <text
                  key={key}
                  className={classNames(styles.title, {[styles.min]: index === 5})}
                  x={960}
                  y={355 + fontSize * 3.5 * key}
                  textAnchor={'middle'}
                >
                  {text}
                </text>
              )
            })
          }
        </svg>
      </div>
    )
  }
}
