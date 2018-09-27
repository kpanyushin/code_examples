/*@flow*/
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import push from '../../utils/dataLayer';

import styles from './FreeTimeQuestionPage.desktop.css';
import Circle from '../../components/Circle/Circle.container';
import NextButton from '../../components/NextButton/NextButton';
import questions from '../../constants/questions';

import FreeTimeLeftKite from '../../components/FreeTimeLeftKite/FreeTimeLeftKite';
import FreeTimeRightKite from '../../components/FreeTimeRightKite/FreeTimeRightKite';

import * as QuestionsState from '../../redux/reducers/QuestionsState';

type Props = {
  currentPage: number,
  nextPage: () => void,
  mouseX: number,
  mouseY: number,
  question: (value: number) => void
};

type State = {
  startParalax: boolean,
  selected: Array<number>
}

type Element = {
  text: Array<string>,
  active: boolean,
  empty: boolean,
  hidden: boolean,
  value: number
};

class FreeTimeQuestionPage extends React.Component<Props, State> {
  constructor(props: Props):void {
    super(props);

    this.state = {
      startParalax: false,
      selected: []
    }
  }

  componentWillUpdate(nextProps: Object) {
    if (nextProps.currentPage == 9 && this.mouseIndicator === null) {

      if (this.state.startParalax === false) {
        setTimeout(() => {
          this.mouseIndicator = true;
          this.setState({
            startParalax: true
          })
        }, 1400)
      }
    } else {
      this.mouseIndicator = null;
    }
  }

  props: {
    currentPage: number,
    nextPage: () => void,
    mouseX: number,
    mouseY: number,
    question: (value: number) => void
  };
  mouseIndicator = null;

  onClick(element: Element, index: number):void {
    let { selected } = this.state;
    let isSelected = selected.indexOf(index);

    if (isSelected !== -1) {
      selected.splice(isSelected, 1);
    } else {
      selected.push(index);
    }

    this.setState({
      selected
    })
  }

  getAnswers():Array<Element> {
    let answers = [];
    let { selected } = this.state;

    questions[7].answers.map((element, index) => {
      answers.push(Object.assign(element, {active: selected.indexOf(index) !== -1 ? true : false}));
    });

    return answers;
  }

  nextPage():void {
    let { selected } = this.state;
    let result = 0;
    let string = '';

    selected.map((element) => {
      if (questions[7].answers[element].value == 2) result = 2;
      string += `${questions[7].answers[element].text.join()}|`;
    });

    push('free_time', string);
    this.props.question(result);
    this.props.nextPage();
  }

  render() {
    const { currentPage, mouseX, mouseY } = this.props;
    const { startParalax, selected } = this.state;

    return (
      <div className={classNames(styles.container, {[styles.current]: currentPage == 9})}>

        <div className={styles.filter} />

        <Circle
          data={this.getAnswers()}
          onClick={this.onClick.bind(this)}
          titles={questions[7].question}
          index={8}
        />

        <div className={classNames(styles.nextBtn, {[styles.hidden]: !selected.length})}>
          <NextButton onClick={this.nextPage.bind(this)}/>

          <div className={styles.hint}>можно выбрать несколько<br/> вариантов ответа</div>
        </div>

        <FreeTimeLeftKite
          translateX={mouseX / 31}
          translateY={mouseY / 31}
          startParalax={startParalax}
          visible={currentPage == 9}
        />
        <FreeTimeRightKite
          translateX={mouseX / 31}
          translateY={mouseY / 31}
          startParalax={startParalax}
          visible={currentPage == 9}
        />

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  mouseX: state.getIn(['coords', 'mouseX']),
  mouseY: state.getIn(['coords', 'mouseY'])
});

const mapDispatchToProps = dispatch => ({
  question(value) {
    return dispatch(QuestionsState.question(5, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FreeTimeQuestionPage);
