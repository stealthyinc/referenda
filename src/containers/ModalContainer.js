import React, { Component } from 'react'
import Modal from 'modal-enhanced-react-native-web'
export default class ModalContainer extends Component {
  render () {
    return (
      <Modal
        isVisible={this.props.showModal}
        onBackdropPress={() => this.props.toggleModal()}
      >
        {this.props.component}
      </Modal>
    )
  } 
}