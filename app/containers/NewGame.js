import React, { Component, PropTypes } from 'react'
import fetch from 'isomorphic-fetch'

import {
  Button,
  Container,
  Header,
  Content,
  Footer,
  Label,
  ThemeSelect
} from '../components'

export class NewGame extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.selectTheme = this.selectTheme.bind(this)
    this.createGame = this.createGame.bind(this)

    this.state = {
      themes: [],
      selectedTheme: ''
    }
  }

  componentWillMount() {
    fetch('/api/themes')
      .then((response) => response.json())
      .then(({ themes }) => {
        let selectedTheme = themes.length === 1 ? themes[0]._id : ''
        this.setState({ themes, selectedTheme })
      })
  }

  selectTheme(themeID) {
    this.setState({ selectedTheme: themeID })
  }

  createGame() {
    let { selectedTheme } = this.state
    let { router } = this.context

    fetch('/api/new', {
      method: 'POST',
      body: JSON.stringify({ theme: selectedTheme }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then(({ gameID }) => router.push(`/${gameID}/join`))
  }

  render() {
    const { themes, selectedTheme } = this.state

    return (
      <Container>
        <Header>New Game</Header>

        <Content>
          <Label>Choose a version:</Label>

          <ThemeSelect
            themes={themes}
            selectedTheme={selectedTheme}
            onChange={this.selectTheme}
          />
        </Content>

        <Footer>
          <Button secondary
              disabled={!selectedTheme}>
            Adjust Settings
          </Button>

          <Button
              disabled={!selectedTheme}
              onPress={this.createGame}>
            Create Game
          </Button>
        </Footer>
      </Container>
    )
  }
}
