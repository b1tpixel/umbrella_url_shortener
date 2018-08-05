import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader, FormGroup, FormControl, InputGroup, Button, ControlLabel, Alert} from 'react-bootstrap';
import './App.css';


class App extends Component {
  state = {users: []}

  constructor(props){
    super(props);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleCustomLinkChange = this.handleCustomLinkChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      link: '',
      customlink: '',
      generatedLink: '',
      customValidationState: null,
      toggleInputError: false,
    }
  }

  checkCustomForDuplicates(val){
    if(!val){
      this.setState({customValidationState: null});
      return;
    }
    fetch('/custom_url_exists?custom='+val)
      .then(res => res.json())
      .then(data => {
          if(data.isExists){
            this.setState({
              customValidationState:'success',
              toggleInputError: false
            })
          } else {
            this.setState({customValidationState:'error'})
          }
        }
      )
  }

  handleLinkChange(e){
    this.setState({
      link: e.target.value,
    })
  }

  handleCustomLinkChange(e){
    this.setState({
      customlink: e.target.value,
    })
    this.checkCustomForDuplicates(e.target.value)
  }

  handleSubmit(e){
    debugger;
    e.preventDefault();
    if(this.state.customValidationState === 'error'){
      this.setState({
        toggleInputError: true,
      });
      return;
    }
    fetch('/shorten_url/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: this.state.link,
        custom: this.state.customlink,
      })
    })
    .then(result => result.json())
    .then(result => {
        this.setState({
          generatedLink: result.createdUrl,
        })
        this.setState({
          customlink: '',
        })
        this.checkCustomForDuplicates(null);
    })
  }

  render() {
    const inputError = this.state.toggleInputError;
    const generatedLink = this.state.generatedLink;
    let errorComp = null
    if (inputError){
      errorComp = (
        <Alert bsStyle="warning">Entered URL is already exists. Try another one.</Alert>
      )
    }
    let layout = (
      <Grid>
        <Row className="show-grid">
          <Col xs={8} xsOffset={2}>
            <PageHeader>URL Shortener</PageHeader>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={8} xsOffset={2}>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Enter your link to shorten it:</ControlLabel>
                <FormControl 
                  onChange={this.handleLinkChange} 
                  type="url" />
              </FormGroup>
              <ControlLabel>Customize your shortened link or just click "submit" to generate it:</ControlLabel>
              <FormGroup 
                validationState={this.state.customValidationState}
              >
                <InputGroup>
                  <InputGroup.Addon>{window.location.host + '/'}</InputGroup.Addon>
                  <FormControl 
                    onChange={this.handleCustomLinkChange} 
                    type="text"
                  />
                </InputGroup>
                {errorComp}
              </FormGroup>
              <Button className='pull-right btn btn-primary' type='submit'>Submit</Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
    if(generatedLink){
      layout = (
        <Grid>
          <Row>
            <Col xs={8} xsOffset={2}>
              <PageHeader>URL Shortener</PageHeader>
            </Col>
          </Row>
          <Row>
            <Col xs={8} xsOffset={2}>
              <PageHeader>Your shortened URL is ready:</PageHeader>
              <PageHeader><code>{generatedLink}</code></PageHeader>
              <Button className='pull-right btn btn-primary' onClick={()=>{this.setState({generatedLink:null})}}>Make another</Button>
            </Col>
          </Row>
        </Grid>
      )
    }
    return (
      <div>
        {layout}
      </div>
    );
  }
}

export default App;