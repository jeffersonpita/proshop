import React, { useState, useEffect } from 'react'
import { Link }  from 'react-router-dom'
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/userActions'



function RegisterScreen({ location, history }){
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch( )

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const userRegister =  useSelector( state => state.userRegister )
  const { loading, error, userInfo } = userRegister

  useEffect(()=>{
    if(userInfo){
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if(confirmpassword!==password){
      setMessage("Passwords do not match")
    }
    else {
      dispatch( register( name, email, password  ) )
    }

  }

  return (
      <FormContainer>
        <h1>Register</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="confirmpassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">Register</Button>
        </Form>

        <Row className="py-3">
          <Col>
            Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Log In</Link>
          </Col>
        </Row>
      </FormContainer>
  )
}

export default RegisterScreen;
