import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Carousel from 'nuka-carousel';

import styles from './HomeSlider.css';

import * as SliderState from '../../../redux/reducers/SliderState';
import * as PageState from '../../../redux/reducers/PageState';

import settings from '../../../utils/Settings';
import ArrowIcon from '../../../svg/ArrowIcon';
import Spinner from '../../components/Spinner/Spinner';

class HomeSlider extends React.PureComponent {

  static propTypes = {
    loading: PropTypes.bool,
    slides: PropTypes.object,
    currentPage: PropTypes.number,
    prevPage: PropTypes.number
  };

  _setPage(e) {
    this.props.setPage(e)
  }

  state = {
    currentSlide: 0
  };

  _currSlideSet(e) {
    this.setState({
      currentSlide: e
    });
  }
  _prevSlide() {
    this.slider.previousSlide();
  }

  _nextSlide() {
    this.slider.nextSlide()
  }

  _setSlide(e) {
    this.slider.goToSlide(e)
  }

  componentWillMount() {
    this.props.getSlides()
  }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.currentPage == 0 || nextProps.currentPage == 1) return true;
  //
  //   return false;
  // }

  render() {
    let { loading, slides, currentPage } = this.props;

    if (loading && slides) return (
      <Spinner/>
    );

    return (
      <div
        className={classNames(styles.containerPage,
          {[styles.activePage]: currentPage == 0},
          {[styles.prevPage]: currentPage > 0})}
      >
        <div className={styles.dotsContainer}>
          <div className={styles.arrLeft} onClick={::this._prevSlide} />
          {
            slides.rows.map((element, index) => {
              return (
                <div
                  className={classNames(styles.dot, {[styles.dotActive]: this.state.currentSlide == index})}
                  key={index}
                  onClick={this._setSlide.bind(this, index)}
                />
              )
            })
          }
          <div className={styles.arrRight} onClick={::this._nextSlide} />
        </div>
        <Carousel
          slidesToShow={1}
          slidesToScroll={1}
          decorators={[]}
          ref={ref => this.slider = ref}
          easing={'easeOutCubic'}
          afterSlide={::this._currSlideSet}
          //autoplay={true}
        >
          {
            slides.rows.map((slide, index) => {
              return (
                <div key={index} className={styles.item}>
                  <div className={styles.imgSlide} style={{
                    backgroundImage: `url(${settings.src}${slide.image.path})`
                  }} />
                  <div className={styles.fon}>
                    <div className={styles.leftClick} onClick={::this._prevSlide}/>
                    <div className={styles.rightClick} onClick={::this._nextSlide}/>
                  </div>
                  <div className={styles.titleContainer}>
                    <div className={styles.title}>
                      <span>{slide.title.a}</span>
                      </div>
                    <div className={styles.text}>
                      <span>{slide.title.b}</span>
                    </div>
                  </div>

                  <div className={styles.btn} onClick={this._setPage.bind(this, 7)}>
                    <a>Подробнее <ArrowIcon/></a>
                  </div>
                </div>
              )
            })
          }
        </Carousel>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.getIn(['slider', 'loading']),
  slides: state.getIn(['slider', 'slides']),
  currentPage: state.getIn(['page', 'currentPage']),
  prevPage: state.getIn(['page', 'prevPage'])
});

const mapDispatchToProps = dispatch => ({
  getSlides() {
    return dispatch(SliderState.request());
  },
  setPage(cur) {
    return dispatch(PageState.setPage(cur));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeSlider);
