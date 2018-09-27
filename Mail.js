import React from 'react';
import propTypes from 'prop-types';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

import styles from './Mail.css';

export default class Mail extends React.Component {
  static PropTypes = {
    sendMail: propTypes.func,
    errors: propTypes.boolean,
    loading: propTypes.boolean
  };

  state = {
    name: '',
    email: '',
    phone: '',
    nameValid: true,
    emailValid: true,
    phoneValid: true,
    formValid: false,
    success: false
  }


  componentDidUpdate(prevProps) {
    let { loading } = this.props;

    if (prevProps.loading == true && loading === false) {
      this.setState({
        success: true
      })

      setTimeout(() => this.setState({
        success: false,
        name: '',
        email: '',
        phone: ''
      }), 6000)
    }
  }

  handleChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  validateInput() {
    const emailRegExp = new RegExp(/^[a-zA-Z0-9-]+@[a-zA-Z0-9-]+\.[A-Za-z]+$/);
    let { name, email, phone } = this.state;
    let nameValid = name.length >= 2;
    let emailValid = email.match(emailRegExp);
    let phoneValid = phone.replace(/[^0-9]/g, '').length == 11;

    this.setState({
      nameValid: nameValid,
      emailValid: emailValid,
      phoneValid: phoneValid,
      formValid: nameValid && emailValid && phoneValid
    }, () => {
      if (this.state.formValid) this.props.sendMail(this.state);
    });
  }

  handleSubmit(e) {
    let { loading } = this.props;
    let { success } = this.state;

    if (loading || success) return;
    this.validateInput();
    e.preventDefault();
  }

  render() {
    let { loading } = this.props;
    let { nameValid, emailValid, phoneValid, success } = this.state;

    return (
      <div className={styles.container}>
        <p className={styles.text}>Оставить заявку</p>
        <div className={classNames(
            styles.leaveRequest, 
            {[styles.success]: success}, 
            {[styles.loading]: loading})}>
            <div className={classNames(styles.thanks, {[styles.visible]: success})}>
              Спасибо! Ваше обращение принято!
            </div>
            <div className={styles.inputGroup}>
              <input
                name={'name'}
                className={styles.mailInput}
                type={'text'}
                placeholder={'Ваше имя'}
                onChange={::this.handleChange}
                value={this.state.name} />
              { !nameValid && (<div className={styles.error}>Введите имя</div>) }
            </div>
            <div className={styles.inputGroup}>
              <input
                name={'email'}
                className={styles.mailInput}
                type={'e-mail'}
                placeholder={'E-mail'}
                onChange={::this.handleChange}
                value={this.state.email} />
              { !emailValid && (<div className={styles.error}>Введите e-mail</div>) }
            </div>
            <div className={styles.inputGroup}>
              <InputMask
                name={'phone'}
                className={styles.mailInput}
                type={'text'}
                placeholder={'Телефон'}
                onChange={::this.handleChange}
                value={this.state.phone}
                mask={'+7(999)-999-99-99'} />
              { !phoneValid && (<div className={styles.error}>Введите номер телефона</div>) }
              </div>
            <button
              className={styles.button}
              onClick={::this.handleSubmit}
              disabled={this.state.loading}>
              Отправить заявку
            </button>
        </div>
      </div>
    );
  }
}
