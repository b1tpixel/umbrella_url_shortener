import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader, FormGroup, FormControl, InputGroup, Button, ControlLabel, Alert} from 'react-bootstrap';
import './App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.changeView = this.changeView.bind(this)

    this.state = {
      recordsCount: 0,
      component: (<FormComponent changeView={this.changeView} />) 
    }
  }

  fetchCounter(){
    fetch('/get_count') 
      .then(res => res.json())
      .then(data => {
        this.setState({
          recordsCount: data.count,
        })
      })
  }

  componentDidMount(){
    this.fetchCounter()
  }

  changeView(comp, link){
    if(comp === 'message' && link){
      this.fetchCounter();
      this.setState({
        component: (<MessageComponent generatedLink={link} changeView={this.changeView}/>)
      });
    } else {
      this.setState({
        component: (<FormComponent changeView={this.changeView} />) 
      })
    }
  }

  render() {
    let component = this.state.component
    return (
      <Grid>
        <Row>
          <Col xs={8} xsOffset={2}>
            <PageHeader>URL Shortener</PageHeader>
            <h3>Now serving {this.state.recordsCount} URLs!</h3>
          </Col>
        </Row>
        <Row>
          {component}
        </Row>
      </Grid>
    );
  }
}

class MessageComponent extends Component {
  render(){
    return (
      <Col xs={8} xsOffset={2}>
        <h3>Your shortened URL is ready:</h3>
        <h3><code>{this.props.generatedLink}</code></h3>
        <Button className='pull-right btn btn-primary' onClick={()=>(this.props.changeView('form'))}>Make another</Button>
      </Col>  
    )
  }
}

class FormComponent extends Component {
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
      errorMsg: null,
      isUrlExists: false,
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
          if(!/^[a-z0-9_-]+$/i.test(val)) {
            debugger;
            this.setState({
              customValidationState: 'error',
              toggleInputError: true,
              errorMsg: 'Entered URL is invalid. Use only alphabetical, numerical, dash and underscore symbols',
          })
          } else if(!data.isExists) {
            this.setState({
              customValidationState: 'success',
              toggleInputError: false,
            })
          } else {
            this.setState({
              customValidationState:'error',
              toggleInputError: false,
            })
          } 
      })
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
    e.preventDefault();
    if(this.state.customValidationState === 'error'){
      this.setState({
        toggleInputError: true,
      });
      return;
    }
    if(!this.state.link){
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
        this.props.changeView('message', this.state.generatedLink)
    })
  }
  
  render(){
    const inputError = this.state.toggleInputError;
    let errorComp = null
    if (inputError){
      errorComp = (
        <Alert bsStyle="warning">{this.state.errorMsg}</Alert>
      )
    }
    return (
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
    )
  }
}

export default App;