import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Store } from '../store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
export default function SigninScreen() {
    //naviaget  to pefer location
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //need to store submit handler data in local storage
    //access to context in local storage below lines
    const {state , dispatch:ctxDispatch} = useContext(Store);
    const {userInfo}=state;

    const submitHandler = async (e) => {
        //pervent to refreshing hte page next line
        e.preventDefault();
        //send jsx request to bakend
        try {
            const { data } = await Axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({type :'USER_SIGNIN', payload:data});
            // console.log(data);
            //save local storage in browerse storage
            localStorage.setItem('userInfo' , JSON.stringify(data));
            navigate(redirect || '/');
        } catch (err) {
            toast.error (getError(err));
        }
    };
    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    } , [navigate , redirect , userInfo]);
    return (
        <div className='footer-avoiding'>
        <Container className="small-container" id="id-small-conatiner-sign">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className='my-3' id="sign-style">Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='email' >
                    <Form.Label id="sign-style1">Email</Form.Label>
                    <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password' >
                    <Form.Label id="sign-style1">Password</Form.Label>
                    <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <div className='mb-3' id="sign-style-btn">
                    <Button type='submit' id="sign-style-btn" variant="dark">Sign In</Button>
                </div>
                <div className='mb-3' id="sign-style-btn">
                    New customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}> Create your account</Link>
                </div>
            </Form>
        </Container>
        </div>
    )
}
