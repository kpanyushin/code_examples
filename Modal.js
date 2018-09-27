import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import classNames from 'classnames';
import InputMask from 'react-input-mask';

import styles from './Modal.css';
import CloseModalIcon from '../../../svg/CloseModalIcon';

import * as ModalState from '../../../redux/reducers/ModalState';
import * as MailsSendState from '../../../redux/reducers/MailSendState';
import OkIcon from '../../../svg/OkIcon';
import Spinner from '../Spinner/Spinner';

class Modal extends React.Component {

  state = {
    phone: '',
    name: '',
    nameValid: null,
    phoneValid: null,
    send: false,
    OK: null
  };

  phoneChange(e) {
    this.setState({
      phone: e.target.value
    })
  }

  nameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  async sendEmail() {
    let nameValid = this.state.name.length >= 4;
    let phoneValid = this.state.phone.replace(/[^0-9]/g, '').length == 11;

    if (nameValid && phoneValid) {

      this.setState({
        send: true
      });

      await this.props.sendMail({
        name: this.state.name,
        phone: this.state.phone.replace(/[^0-9]/g, '')
      });

      //console.log(this.props.mailStatus)

      this.setState({
        phone: '',
        name: '',
        nameValid: null,
        phoneValid: null,
        send: false,
        OK: this.props.mailStatus.status == 200
      })
    } else {
      this.setState({
        nameValid: nameValid,
        phoneValid: phoneValid
      })
    }
  }

  closeModal() {
    this.props.changeModal(false);

    this.setState({
      phone: '',
      name: '',
      nameValid: null,
      phoneValid: null,
      send: false,
      OK: null
    })
  }

  render() {
    let { isVisible } = this.props;

    return (
      <div className={classNames(styles.container, {[styles.activeContainer]: isVisible.visible})}>
        <div className={styles.overlay} onClick={::this.closeModal} />
        <div className={styles.modalContainer}>
          <div className={styles.head}>
            <div className={styles.text}>
              {
                isVisible.type == 'Callback' ?
                  <span>Заказать звонок</span>
                  :
                  <span>Забронировать</span>
              }
            </div>
            <div className={styles.close} onClick={::this.closeModal}><CloseModalIcon/></div>
          </div>
          {
            this.state.send &&
            <div className={styles.spinnerLoading}>
              <Spinner/>
            </div>
          }
          {
            this.state.OK &&
              <div className={styles.Result}>
                <div className={styles.OkIcon}><OkIcon/></div>
                <div className={styles.textResilt}>
                  <div className={styles.headResult}>Ваша заявка отправлена</div>
                  <div className={styles.textResult}>Спасибо Ваша заявка отправлена!<br />
                    В скором времени менеджер свяжется с вами.</div>
                </div>
                <div className={styles.closeBtn} onClick={::this.closeModal}>
                  Закрыть
                </div>
              </div>
          }
          {
            this.state.OK === false &&
            <div className={styles.Result}>
              <div className={styles.CLoseIcon}><CloseModalIcon/></div>
              <div className={styles.textResilt}>
                Сервер временно недоступен. Попробуйте позже
              </div>
              <div className={styles.closeBtn} onClick={::this.closeModal}>
                Закрыть
              </div>
            </div>
          }
          {
            !this.state.send && this.state.OK == null &&
            <div className={styles.content}>
              <div className={styles.nameContainer}>
                <div className={styles.nameText}>Ваше имя</div>
                <div
                  className={classNames(styles.nameInput,
                    {[styles.nameValid]: this.state.nameValid},
                    {[styles.nameError]: this.state.nameValid === false}
                  )}>
                  <div className={styles.okIcon}><OkIcon/></div>
                  <div className={styles.errorIcon}><CloseModalIcon/></div>
                  <input
                    type="text"
                    placeholder='Иван Иванов'
                    value={this.state.name}
                    onChange={::this.nameChange}
                  />
                </div>
              </div>
              <div className={styles.phoneContainer}>
                <div className={styles.phoneText}>Ваш телефон</div>
                <div
                  className={classNames(styles.phoneInput,
                    {[styles.phoneValid]: this.state.phoneValid},
                    {[styles.phoneError]: this.state.phoneValid === false}
                  )}>
                  <div className={styles.okIcon}><OkIcon/></div>
                  <div className={styles.errorIcon}><CloseModalIcon/></div>
                  <InputMask
                    type="text"
                    value={this.state.phone}
                    onChange={::this.phoneChange}
                    mask="+7(999)-999-99-99"
                    placeholder="+7(___) ___-__-__"
                    maskChar=" "
                  />
                </div>
              </div>
            </div>
          }
          {
            !this.state.send && this.state.OK == null &&
            <div className={styles.btnContainer}>
              <div className={styles.btn} onClick={::this.sendEmail}>Отправить</div>
            </div>
          }
        </div>
      </div>
    )
  }
}

static PropTypes = {
  isVisible: propTypes.bool
};

const mapStateToProps = state => ({
  isVisible: state.getIn(['modal', 'isVisible']),
  mailStatus: state.getIn(['mail', 'mailStatus'])
});

const mapDispatchToProps = dispatch => ({
  changeModal(options) {
    return dispatch(ModalState.changeVisibleModal(options));
  },
  sendMail(info) {
    return dispatch(MailsSendState.request(info))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
