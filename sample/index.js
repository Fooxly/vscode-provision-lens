import React, { Component } from 'react'
import Container from 'Components/Container'

export default class ShopPage extends Component {
  //NOTE: This is a sample note
  constructor(props) {
    super(props)
    
    // TODO: get other props
    this.state = {
      pageIndex: 0
    }
  }

  render() {
    // TODO: render correct page
    return (
      <Container>
        <Header title='Shop' />
        <div className='shop-page'>

        </div>
      </Container>
    )
  }
}