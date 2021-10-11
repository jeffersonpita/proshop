import React, { useState, useEffect } from 'react'
import { Link }  from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'



function UserEditScreen({ match, history }){
  const userId = match.params.id
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isAdmin, setAdmin] = useState(false)

  const dispatch = useDispatch( )

  const userDetails =  useSelector( state => state.userDetails )
  const { loading, error, user } = userDetails

  const userUpdate =  useSelector( state => state.userUpdate )
  const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdate

  useEffect(()=>{

    if(successUpdate){
      dispatch({type:USER_UPDATE_RESET})
      history.push("/admin/userlist")
    } else {
      if(!user.name || Number(user._id) !== Number(userId) ){
        dispatch(getUserDetails(userId))
      }
      else {
        setName(user.name)
        setEmail(user.email)
        setAdmin(user.isAdmin)
      }
    }
  }, [user, userId, history, successUpdate, dispatch])

  const submitHandler = (e) => {
    e.preventDefault()
    const a = isAdmin==='on' ? true : false
    dispatch( updateUser( { _id:user._id, name, email, 'isAdmin':a} ) )
  }

  return (
      <div>
        <Link to='/admin/userlist'>
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit User</h1>
          { loadingUpdate && <Loader/>}
          { errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

          { loading ? <Loader/> :
            error ? (<Message variant="danger">{error}</Message> ):
            (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}

                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}

                  />
                </Form.Group>
                <br/>
                <Form.Group controlId="isadmin">
                  <Form.Check
                     style={{float:'left'}}
                    type="checkbox"
                    placeholder="Is Admin"
                    checked={isAdmin}
                    onChange={(e)=>setAdmin(e.target.value)}
                  />
                  <span>Is Admin</span>
                </Form.Group>
                <br/>
                <Button type="submit" variant="primary">Save</Button>
              </Form>
            )
          }
          </FormContainer>
      </div>
  )
}

export default UserEditScreen;
