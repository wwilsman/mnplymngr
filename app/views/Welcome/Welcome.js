import React, { Component, PropTypes } from 'react'
import styles from './Welcome.css'

import { Flex, Box, Title } from '../../layout'
import { Button } from '../../common'
import { JoinGameModal } from '../../game'
import { Toaster } from '../../toaster'

class Welcome extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  static propTypes = {
    connectGame: PropTypes.func.isRequired,
    disconnectGame: PropTypes.func.isRequired,
    showErrorToast: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    loading: PropTypes.string,
    error: PropTypes.object,
    room: PropTypes.string
  }

  state = {
    showJoinModal: false,
    loading: false
  }

  componentWillMount() {
    if (this.props.room) {
      this.props.disconnectGame()
    }
  }

  componentWillUnmount() {
    this._cancelLoading()
  }

  componentWillReceiveProps({ error, loading, room }) {
    if (error) {
      this.props.showErrorToast(error.message)
    } else if (room) {
      this.context.router.push(`/${room}`)
    }

    if (loading) {
      this._loadingTimeout = setTimeout(() => {
        this.setState({ loading: true })
      }, 100)
    } else {
      this._cancelLoading()
    }
  }

  _cancelLoading() {
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout)
    }
    
    this.setState({ loading: false })
  }

  _showJoinModal = () => {
    this.setState({
      showJoinModal: true
    })
  }

  _hideJoinModal = () => {
    this.setState({
      showJoinModal: false
    })
  }

  _tryConnect = (room) => {
    this.props.clearError()
    this.props.connectGame(room)
  }

  _goToNewGame = () => {
    this.context.router.push('/new');
  }

  render() {
    const { loading, showJoinModal } = this.state

    return (
      <Flex>
        <Box className={styles.top} stretch justify="center">
          <Title lg>Monopoly<br/>Wallet</Title>
        </Box>

        <Box align="center" size="1/2"
             className={styles.buttons}>
          <Button
              onClick={this._showJoinModal}
              color="blue"
              width="1/2">
            Join Game
          </Button>

          <Button
              onClick={this._goToNewGame}
              color="green"
              width="1/2">
            New Game
          </Button>
        </Box>

        {showJoinModal && (
           <div>
             <JoinGameModal
                 onClose={this._hideJoinModal}
                 onContinue={this._tryConnect}
                 loading={loading}
             />

             <Toaster/>
           </div>
         )}
      </Flex>
    )
  }
}

export default Welcome
