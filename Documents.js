import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Spinner from '../../components/Spinner/Spinner';
import ScrollArea from 'react-scrollbar';

import styles from './Documents.css';

import * as DocumentState from '../../../redux/reducers/DocumentState';
import PdfIcon from '../../../svg/PdfIcon';

import { contScroll, thumbScroll } from '../../../utils/stylesScroll';
import DocIcon from '../../../svg/DocIcon';
import settings from '../../../utils/Settings';

class Documents extends React.Component {

  static propTypes = {
    loading: PropTypes.bool,
    document: PropTypes.object,
    currentPage: PropTypes.number,
    scrollOn: PropTypes.func,
    scrollOf: PropTypes.func,
    documentRender: PropTypes.func
  };

  params = window.filters.document;
  state = {
    year: 2017,
    scrollView: 'none'
  };

  _changeYear(year) {
    this.setState({
      year: year
    }, () => {
      this.props.getDocument(year);
    })
  }

  _scrollDisabled() {
    this.props.scrollOf();
  }

  _scrollEnabled() {
    this.props.scrollOn();
  }

  componentDidMount() {
    this.props.getDocument(this.state.year);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage != this.props.currentPage ) {
      setTimeout(() => {
        this.setState({
          scrollView: this.props.currentPage == 4 ? 'auto' : 'none'
        })
      }, 1000)
    }
  }

  render() {
    let { loading, document, currentPage } = this.props;

    if (loading && document) return (
      <div className={styles.spinnerContainer}><Spinner/></div>
    );

    return (
      <div
        className={classNames(styles.containerPage,
          {[styles.activePage]: currentPage == 4},
          {[styles.prevPage]: currentPage > 4})}
      >
        <div className={styles.head}>
          Документы
        </div>
        <div className={styles.containerListo}>
          <div className={styles.left}>
            <div className={styles.headYear}>Сортировать по году...</div>
            <div className={styles.yearList}>
              {
                this.params.map((element, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames(styles.itemYear, {[styles.active]:
                      this.state.year == parseInt(element)})}
                      onClick={this._changeYear.bind(this, element)}>
                      {
                        element
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={styles.right}
               style={{
                 pointerEvents: this.state.scrollView
               }}
               onMouseEnter={::this._scrollDisabled}
               onMouseLeave={::this._scrollEnabled}
          >
            <div className={styles.documentsList}
                 style={{
                   pointerEvents: this.state.scrollView
                 }}
              >
              <div className={styles.headerName}>
                Наименование документа
              </div>
              <ScrollArea
                speed={0.8}
                className={classNames(styles.scrollContainer,
                  {[styles.activeSCroll]: currentPage == 4}
                )}
                verticalContainerStyle={contScroll}
                verticalScrollbarStyle={thumbScroll}
                horizontal={false}
                style={{
                  pointerEvents: this.state.scrollView
                }}
              >
                {
                  document.rows.map((document, index) => {
                    return (
                      <div key={index} className={styles.document}>

                        <div className={styles.icon}>
                          {
                            document.file.extension == 'PDF' ? <PdfIcon/> : <DocIcon/>
                          }
                        </div>
                        <div className={styles.title}>{document.title}</div>
                        <div className={styles.size}>&nbsp;({document.file.size})</div>
                        <div className={styles.download}>
                          <a
                            href={settings.src + document.file.path}
                            target={true}
                            download={true}
                          >
                            Скачать
                          </a>
                        </div>
                      </div>
                    )
                  })
                }
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  loading: state.getIn(['document', 'loading']),
  document: state.getIn(['document', 'document']),
  currentPage: state.getIn(['page', 'currentPage'])
});

const mapDispatchToProps = dispatch => ({
  getDocument(year) {
    return dispatch(DocumentState.request(year));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
