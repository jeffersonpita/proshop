import React, { useState, useEffect } from 'react'
import { Link }  from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'



function ProductEditScreen({ match, history }){
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch( )

  const productDetails =  useSelector( state => state.productDetails )
  const { loading, error, product } = productDetails

  const productUpdate =  useSelector( state => state.productUpdate )
  const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = productUpdate


  useEffect(()=>{
    if(successUpdate){
        dispatch({ type:PRODUCT_UPDATE_RESET })
        history.push('/admin/productlist')
    }
    else {
      if(!product._id || Number(product._id) !== Number(productId) ){
        dispatch(listProductDetails(productId))
      }
      else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [successUpdate, product, productId, history, dispatch])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch( updateProduct( { _id:productId, name, price, image, brand, category, countInStock, description } ) )
  }

  const uploadFileHandler = async (e) => {

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    formData.append('product_id', productId)

    setUploading(true)
    try {
      const config = {
        headers:{
          'Content-Type': 'multipart/form-data',
        }
      }
      const { data } = await axios.post('/api/products/upload/', formData, config )
      setUploading(false)
      setImage( data )

    } catch(error) {
      setUploading(false)
    }
  }

  return (
      <div>
        <Link to='/admin/productlist'>
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Product</h1>
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
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}

                  />
                </Form.Group>
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Image"
                    value={image}
                    onChange={(e)=>setImage(e.target.value)}

                  />
                  <Form.File
                    id="image-file"
                    label="Choose file"
                    custom
                    onChange={uploadFileHandler}
                  >
                  </Form.File>
                  {uploading && <Loader/>}
                </Form.Group>
                <Form.Group controlId="brand">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Brand"
                    value={brand}
                    onChange={(e)=>setBrand(e.target.value)}

                  />
                </Form.Group>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Category"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}

                  />
                </Form.Group>
                <Form.Group controlId="stock">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Count In Stock"
                    value={countInStock}
                    onChange={(e)=>setCountInStock(e.target.value)}

                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}

                  />
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

export default ProductEditScreen;
