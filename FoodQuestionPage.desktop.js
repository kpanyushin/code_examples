/* @flow */
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import push from '../../utils/dataLayer';

import styles from './FoodQuestionPage.desktop.css';
import Circle from '../../components/Circle/Circle.container'
import questions from '../../constants/questions';

import FoodFork from '../../components/FoodFork/FoodFork';
import FoodDish from '../../components/FoodDish/FoodDish';

import * as QuestionsState from '../../redux/reducers/QuestionsState';

type Props = {
  currentPage: number,
  nextPage: () => void,
  mouseX: number,
  mouseY: number,
  question: (value: number) => void
};

type State = {
  startParalax: boolean
};

type Element = {
  text: Array<string>,
  active: boolean,
  empty: boolean,
  hidden: boolean,
  value: number
};

class FoodQuestionPage extends React.Component<Props, State> {
  constructor(props: Props):void {
    super(props);

    this.state = {
      startParalax: false
    }
  }

  componentWillUpdate(nextProps: Object) {
    if (nextProps.currentPage == 10 && this.mouseIndicator === null) {

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

  onClick(element: Element):void {
    push('what_you_eat', element.text.join(''));
    this.props.question(element.value);
    this.props.nextPage();
  }

  render() {
    const { currentPage, mouseX, mouseY } = this.props;
    const { startParalax } = this.state;

    return (
      <div className={classNames(styles.container, {[styles.current]: currentPage == 10})}>

        <div className={styles.filter} />
        <Circle
          data={questions[8].answers}
          onClick={this.onClick.bind(this)}
          titles={questions[8].question}
          index={9}
        />

        <FoodFork
          translateX={mouseX / 31}
          translateY={mouseY / 31}
          startParalax={startParalax}
          visible={currentPage == 10}
        />
        <FoodDish
          translateX={mouseX / 31}
          translateY={mouseY / 31}
          startParalax={startParalax}
          visible={currentPage == 10}
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
    return dispatch(QuestionsState.question(6, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FoodQuestionPage);
